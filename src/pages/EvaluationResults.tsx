import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Award, TrendingUp, Lightbulb, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { supabase } from '../lib/supabase';
import { useToast } from '../hooks/use-toast';

interface EvaluationResultsProps {
  evaluationId: string;
  onStartNew: () => void;
}

interface QuestionResult {
  questionNumber: number;
  maxMarks: number;
  obtainedMarks: number;
  feedback: string;
  mistakes: string[];
  suggestions: string[];
  correctAnswer: string;
}

interface Results {
  questions: QuestionResult[];
  totalObtainedMarks: number;
  overallRemarks: string;
  strengths: string[];
  areasForImprovement: string[];
  rawResponse?: string;
}

const EvaluationResults = ({ evaluationId, onStartNew }: EvaluationResultsProps) => {
  const [results, setResults] = useState<Results | null>(null);
  const [loading, setLoading] = useState(true);
  const [evaluation, setEvaluation] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchResults();
  }, [evaluationId]);

  const fetchResults = async () => {
    try {
      const { data, error } = await supabase
        .from('evaluations')
        .select('*')
        .eq('id', evaluationId)
        .single();

      if (error) throw error;

      setEvaluation(data);
      setResults(data.evaluation_results);
      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching results:', error);
      toast({
        title: 'Error loading results',
        description: error.message,
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Loading evaluation results...</p>
        </div>
      </div>
    );
  }

  if (!results || !evaluation) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground mb-4">No results found</p>
        <Button onClick={onStartNew}>Start New Evaluation</Button>
      </div>
    );
  }

  const percentage = (results.totalObtainedMarks / evaluation.total_marks) * 100;
  const grade = percentage >= 90 ? 'A+' : percentage >= 80 ? 'A' : percentage >= 70 ? 'B' : percentage >= 60 ? 'C' : percentage >= 50 ? 'D' : 'F';

  return (
    <div className="max-w-5xl mx-auto animate-fade-in space-y-8">
      {/* Header Card */}
      <div className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 rounded-lg shadow-xl p-8 text-white">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">Evaluation Complete!</h2>
            <p className="text-white/90">{evaluation.subject} • {evaluation.grade_level}</p>
          </div>
          <Award className="w-16 h-16 opacity-80" />
        </div>
        
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <p className="text-sm text-white/80 mb-1">Obtained Marks</p>
            <p className="text-3xl font-bold">{results.totalObtainedMarks}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <p className="text-sm text-white/80 mb-1">Total Marks</p>
            <p className="text-3xl font-bold">{evaluation.total_marks}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <p className="text-sm text-white/80 mb-1">Grade</p>
            <p className="text-3xl font-bold">{grade}</p>
          </div>
        </div>

        <div className="mt-6 bg-white/20 backdrop-blur-sm rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold">Performance</span>
            <span className="text-sm font-semibold">{percentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-white/30 rounded-full h-3">
            <div
              className="bg-white rounded-full h-3 transition-all duration-1000"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Overall Remarks */}
      <div className="bg-card rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Award className="w-6 h-6 text-primary" />
          Overall Remarks
        </h3>
        <p className="text-muted-foreground leading-relaxed">{results.overallRemarks}</p>
      </div>

      {/* Strengths and Areas for Improvement */}
      <div className="grid md:grid-cols-2 gap-6">
        {results.strengths && results.strengths.length > 0 && (
          <div className="bg-success/10 border border-success rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-success">
              <TrendingUp className="w-5 h-5" />
              Strengths
            </h3>
            <ul className="space-y-2">
              {results.strengths.map((strength, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{strength}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {results.areasForImprovement && results.areasForImprovement.length > 0 && (
          <div className="bg-warning/10 border border-warning rounded-lg p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-warning">
              <Lightbulb className="w-5 h-5" />
              Areas for Improvement
            </h3>
            <ul className="space-y-2">
              {results.areasForImprovement.map((area, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-warning mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{area}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Question-wise Results */}
      {results.questions && results.questions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-2xl font-bold">Question-wise Analysis</h3>
          {results.questions.map((question) => {
            const scorePercentage = (question.obtainedMarks / question.maxMarks) * 100;
            const isGood = scorePercentage >= 70;
            const isAverage = scorePercentage >= 40 && scorePercentage < 70;

            return (
              <div key={question.questionNumber} className="bg-card rounded-lg shadow-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                      isGood ? 'bg-success/20 text-success' :
                      isAverage ? 'bg-warning/20 text-warning' :
                      'bg-destructive/20 text-destructive'
                    }`}>
                      Q{question.questionNumber}
                    </div>
                    <div>
                      <p className="font-semibold text-lg">Question {question.questionNumber}</p>
                      <p className="text-sm text-muted-foreground">
                        {question.obtainedMarks} / {question.maxMarks} marks
                      </p>
                    </div>
                  </div>
                  <div className={`result-badge ${isGood ? 'success' : isAverage ? 'warning' : 'error'}`}>
                    {scorePercentage.toFixed(0)}%
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-sm text-muted-foreground mb-2">Feedback</p>
                    <p className="text-sm leading-relaxed">{question.feedback}</p>
                  </div>

                  {question.mistakes && question.mistakes.length > 0 && (
                    <div>
                      <p className="font-semibold text-sm text-destructive mb-2 flex items-center gap-2">
                        <XCircle className="w-4 h-4" />
                        Mistakes Identified
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        {question.mistakes.map((mistake, idx) => (
                          <li key={idx}>{mistake}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {question.suggestions && question.suggestions.length > 0 && (
                    <div>
                      <p className="font-semibold text-sm text-primary mb-2 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4" />
                        Suggestions for Improvement
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        {question.suggestions.map((suggestion, idx) => (
                          <li key={idx}>{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {question.correctAnswer && (
                    <div className="bg-accent/50 rounded-lg p-4 border border-border">
                      <p className="font-semibold text-sm mb-2">Correct Answer</p>
                      <p className="text-sm">{question.correctAnswer}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Raw Response (if available and no structured data) */}
      {results.rawResponse && (!results.questions || results.questions.length === 0) && (
        <div className="bg-card rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">Detailed Evaluation</h3>
          <div className="prose prose-sm max-w-none">
            <pre className="whitespace-pre-wrap text-sm">{results.rawResponse}</pre>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button onClick={onStartNew} size="lg" className="flex-1">
          Evaluate Another Exam
        </Button>
        <Button variant="outline" size="lg" onClick={() => window.print()}>
          Print Results
        </Button>
      </div>
    </div>
  );
};

export default EvaluationResults;
