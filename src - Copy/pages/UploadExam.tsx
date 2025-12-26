import { useState, useRef } from 'react';
import { Upload, FileText, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { useToast } from '../hooks/use-toast';
import { supabase } from '../lib/supabase';
import Tesseract from 'tesseract.js';

interface UploadExamProps {
  subject: string;
  gradeLevel: string;
  totalMarks: number;
  onEvaluationComplete: (evaluationId: string) => void;
  onBack: () => void;
}

const UploadExam = ({ subject, gradeLevel, totalMarks, onEvaluationComplete, onBack }: UploadExamProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [answerKey, setAnswerKey] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFileSelect(droppedFile);
  };

  const handleFileSelect = (selectedFile: File) => {
    // Only accept image files (PNG, JPG, JPEG)
    if (selectedFile && selectedFile.type.includes('image')) {
      setFile(selectedFile);
      toast({
        title: 'File selected',
        description: `${selectedFile.name} is ready for evaluation`,
      });
    } else if (selectedFile && selectedFile.type === 'application/pdf') {
      toast({
        title: 'PDF not supported yet',
        description: 'Please upload an image (PNG, JPG, JPEG) of the exam paper instead',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Invalid file',
        description: 'Please upload an image file (PNG, JPG, JPEG)',
        variant: 'destructive',
      });
    }
  };

  const performOCR = async (file: File): Promise<string> => {
    setProgress('Reading exam paper with OCR...');
    
    // Check if file is PDF - PDFs need to be converted to images first
    if (file.type === 'application/pdf') {
      throw new Error('PDF files are not yet supported. Please upload an image (PNG, JPG, JPEG) of the exam paper.');
    }

    // Create object URL for the image
    const imageUrl = URL.createObjectURL(file);
    
    try {
      const result = await Tesseract.recognize(
        imageUrl,
        'eng',
        {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              setProgress(`OCR Progress: ${Math.round(m.progress * 100)}%`);
            }
          },
        }
      );
      
      // Clean up the object URL
      URL.revokeObjectURL(imageUrl);
      
      console.log('OCR Result:', result.data.text);
      return result.data.text;
      
    } catch (error) {
      // Clean up the object URL even on error
      URL.revokeObjectURL(imageUrl);
      console.error('OCR Error:', error);
      throw new Error('Failed to read text from image. Please ensure the image is clear and contains readable text.');
    }
  };

  const handleEvaluate = async () => {
    if (!file || !answerKey.trim()) {
      toast({
        title: 'Missing information',
        description: 'Please upload an exam paper and provide the answer key',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    setProgress('Starting evaluation...');

    try {
      // Step 1: Upload file to Supabase Storage
      setProgress('Uploading exam paper...');
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('exam-papers')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('exam-papers')
        .getPublicUrl(fileName);

      // Step 2: Perform OCR on the uploaded file
      const extractedText = await performOCR(file);

      if (!extractedText.trim()) {
        throw new Error('Could not extract text from the image. Please ensure the image is clear and contains visible text.');
      }

      // Step 3: Create evaluation record
      setProgress('Creating evaluation record...');
      const { data: evaluationData, error: dbError } = await supabase
        .from('evaluations')
        .insert({
          subject,
          grade_level: gradeLevel,
          total_marks: totalMarks,
          uploaded_file_url: publicUrl,
          answer_key_data: { answerKey },
          status: 'processing',
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // Step 4: Call evaluation Edge Function
      setProgress('AI is evaluating the answers...');
      const { data: evalResult, error: evalError } = await supabase.functions.invoke('evaluate-exam', {
        body: {
          evaluationId: evaluationData.id,
          extractedText,
          answerKey,
          subject,
          gradeLevel,
        },
      });

      if (evalError) {
        console.error('Evaluation error:', evalError);
        throw new Error('Evaluation failed. Please try again.');
      }

      setProgress('Evaluation complete!');
      toast({
        title: 'Evaluation complete',
        description: 'Your exam has been evaluated successfully',
      });

      // Move to results page
      onEvaluationComplete(evaluationData.id);

    } catch (error: any) {
      console.error('Evaluation error:', error);
      toast({
        title: 'Evaluation failed',
        description: error.message || 'An error occurred during evaluation',
        variant: 'destructive',
      });
      setIsProcessing(false);
      setProgress('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-slide-up">
      <Button variant="ghost" onClick={onBack} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="bg-card rounded-lg shadow-lg p-8 space-y-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">{subject} Evaluation</h2>
          <p className="text-muted-foreground">
            {gradeLevel} • Total Marks: {totalMarks}
          </p>
        </div>

        {/* File Upload */}
        <div className="space-y-4">
          <Label className="text-lg font-semibold">Upload Exam Paper</Label>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`file-upload-zone ${isDragging ? 'drag-active' : ''}`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
              className="hidden"
            />
            <div className="text-center">
              {file ? (
                <div className="flex flex-col items-center gap-3">
                  <FileText className="w-16 h-16 text-primary" />
                  <div>
                    <p className="font-semibold text-lg">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Change File
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <Upload className="w-16 h-16 text-muted-foreground" />
                  <div>
                    <p className="font-semibold text-lg">Drop your exam paper here</p>
                    <p className="text-sm text-muted-foreground">
                      or click to browse (PNG, JPG, JPEG)
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Answer Key */}
        <div className="space-y-4">
          <Label htmlFor="answerKey" className="text-lg font-semibold">
            Answer Key
          </Label>
          <Textarea
            id="answerKey"
            value={answerKey}
            onChange={(e) => setAnswerKey(e.target.value)}
            placeholder="Enter the correct answers for each question. Example:&#10;&#10;Q1: Answer 1&#10;Q2: Answer 2&#10;Q3: Answer 3"
            className="min-h-[200px] font-mono text-sm"
          />
          <p className="text-sm text-muted-foreground">
            Enter the correct answers in a clear format. The AI will compare student answers against this key.
          </p>
        </div>

        {/* Progress */}
        {isProcessing && (
          <div className="bg-primary/10 border border-primary rounded-lg p-4">
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <span className="font-semibold">{progress}</span>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button
          onClick={handleEvaluate}
          size="lg"
          className="w-full text-lg py-6"
          disabled={!file || !answerKey.trim() || isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Evaluating...
            </>
          ) : (
            'Evaluate Exam'
          )}
        </Button>
      </div>
    </div>
  );
};

export default UploadExam;
