import { useState } from 'react';
import { BookOpen, Calculator, Atom, Beaker, Dna, Languages, Code, Stethoscope } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

interface SubjectSelectionProps {
  onNext: (subject: string, gradeLevel: string, totalMarks: number) => void;
}

const subjects = [
  { name: 'Mathematics', icon: Calculator, color: 'text-blue-500' },
  { name: 'Physics', icon: Atom, color: 'text-purple-500' },
  { name: 'Chemistry', icon: Beaker, color: 'text-green-500' },
  { name: 'Biology', icon: Dna, color: 'text-emerald-500' },
  { name: 'English', icon: BookOpen, color: 'text-orange-500' },
  { name: 'Hindi', icon: Languages, color: 'text-red-500' },
  { name: 'Marathi', icon: Languages, color: 'text-pink-500' },
  { name: 'Science', icon: Atom, color: 'text-cyan-500' },
  { name: 'Engineering', icon: Code, color: 'text-indigo-500' },
  { name: 'Medical', icon: Stethoscope, color: 'text-rose-500' },
];

const gradeLevels = [
  'Class 1-5 (Primary)',
  'Class 6-8 (Middle School)',
  'Class 9-10 (High School)',
  'Class 11-12 (Senior Secondary)',
  'Undergraduate (College)',
  'Postgraduate (Master\'s)',
];

const SubjectSelection = ({ onNext }: SubjectSelectionProps) => {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [totalMarks, setTotalMarks] = useState('100');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSubject && gradeLevel && totalMarks) {
      onNext(selectedSubject, gradeLevel, parseInt(totalMarks));
    }
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Select Exam Details
        </h2>
        <p className="text-muted-foreground text-lg">
          Choose the subject and grade level for accurate evaluation
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Subject Selection */}
        <div className="space-y-4">
          <Label className="text-lg font-semibold">Select Subject</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {subjects.map((subject) => {
              const Icon = subject.icon;
              return (
                <div
                  key={subject.name}
                  onClick={() => setSelectedSubject(subject.name)}
                  className={`subject-card ${selectedSubject === subject.name ? 'selected' : ''}`}
                >
                  <div className="flex flex-col items-center gap-3">
                    <Icon className={`w-10 h-10 ${subject.color}`} />
                    <span className="font-semibold text-sm text-center">{subject.name}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Grade Level */}
        <div className="space-y-2">
          <Label htmlFor="grade" className="text-lg font-semibold">Grade Level</Label>
          <Select value={gradeLevel} onValueChange={setGradeLevel}>
            <SelectTrigger id="grade" className="w-full">
              <SelectValue placeholder="Select grade level" />
            </SelectTrigger>
            <SelectContent>
              {gradeLevels.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Total Marks */}
        <div className="space-y-2">
          <Label htmlFor="marks" className="text-lg font-semibold">Total Marks</Label>
          <Input
            id="marks"
            type="number"
            min="1"
            max="1000"
            value={totalMarks}
            onChange={(e) => setTotalMarks(e.target.value)}
            placeholder="Enter total marks"
            className="text-lg"
          />
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full text-lg py-6"
          disabled={!selectedSubject || !gradeLevel || !totalMarks}
        >
          Continue to Upload
        </Button>
      </form>
    </div>
  );
};

export default SubjectSelection;
