import { useState } from 'react';
import SubjectSelection from './pages/SubjectSelection';
import UploadExam from './pages/UploadExam';
import EvaluationResults from './pages/EvaluationResults';
import Header from './components/layout/Header';

export type AppStep = 'subject' | 'upload' | 'results';

export interface EvaluationData {
  evaluationId: string;
  subject: string;
  gradeLevel: string;
  totalMarks: number;
}

function App() {
  const [currentStep, setCurrentStep] = useState<AppStep>('subject');
  const [evaluationData, setEvaluationData] = useState<EvaluationData | null>(null);

  const handleSubjectSelected = (subject: string, gradeLevel: string, totalMarks: number) => {
    setEvaluationData({
      evaluationId: '',
      subject,
      gradeLevel,
      totalMarks,
    });
    setCurrentStep('upload');
  };

  const handleEvaluationComplete = (evaluationId: string) => {
    if (evaluationData) {
      setEvaluationData({ ...evaluationData, evaluationId });
      setCurrentStep('results');
    }
  };

  const handleStartNew = () => {
    setEvaluationData(null);
    setCurrentStep('subject');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {currentStep === 'subject' && (
          <SubjectSelection onNext={handleSubjectSelected} />
        )}
        {currentStep === 'upload' && evaluationData && (
          <UploadExam
            subject={evaluationData.subject}
            gradeLevel={evaluationData.gradeLevel}
            totalMarks={evaluationData.totalMarks}
            onEvaluationComplete={handleEvaluationComplete}
            onBack={() => setCurrentStep('subject')}
          />
        )}
        {currentStep === 'results' && evaluationData && (
          <EvaluationResults
            evaluationId={evaluationData.evaluationId}
            onStartNew={handleStartNew}
          />
        )}
      </main>
    </div>
  );
}

export default App;
