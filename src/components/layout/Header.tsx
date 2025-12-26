import { GraduationCap, Sparkles } from 'lucide-react';

const Header = () => {
  return (
    <header className="gradient-header text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
              <GraduationCap className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">AI Exam Evaluator</h1>
              <p className="text-sm text-white/80">Intelligent Answer Checking System</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold">NARNAWARE_OM — {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
