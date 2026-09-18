import { useState } from 'react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { Brain, CheckCircle2, XCircle, ArrowRight, RotateCcw, Trophy, BookOpen, ChevronRight } from 'lucide-react';
import { QUIZ_QUESTIONS } from '@/data';
import type { PageId } from '@/App';

interface QuizPageProps {
  onNavigate: (page: PageId) => void;
}

export default function QuizPage({ onNavigate }: QuizPageProps) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);

  const question = QUIZ_QUESTIONS[currentQ];
  const isCorrect = selected === question.correctIndex;

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    const correct = idx === question.correctIndex;
    if (correct) setScore(s => s + 1);
    setAnswers(a => [...a, correct]);
  };

  const handleNext = () => {
    if (currentQ + 1 < QUIZ_QUESTIONS.length) {
      setCurrentQ(c => c + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      setFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentQ(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setFinished(false);
    setAnswers([]);
  };

  const percentage = Math.round((score / QUIZ_QUESTIONS.length) * 100);
  const category = percentage >= 80
    ? { label: 'Excellent Awareness', color: 'success', icon: Trophy }
    : percentage >= 60
    ? { label: 'Good Awareness', color: 'brand', icon: CheckCircle2 }
    : { label: 'Needs More Practice', color: 'warning', icon: Brain };

  if (finished) {
    const CatIcon = category.icon;
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="p-8 text-center animate-scale-in">
          <div className={`w-20 h-20 rounded-2xl bg-${category.color}-500/15 border border-${category.color}-500/30 flex items-center justify-center mx-auto mb-6`}>
            <Trophy className={`w-10 h-10 text-${category.color}-400`} />
          </div>
          <h2 className="text-2xl font-extrabold text-white mb-2">Your Results</h2>
          <p className="text-navy-300 mb-6">Here's how you did on the Scam Awareness Challenge.</p>

          <div className="flex items-center justify-center gap-8 mb-6">
            <div>
              <p className="text-4xl font-extrabold text-white">{score}<span className="text-2xl text-navy-400">/{QUIZ_QUESTIONS.length}</span></p>
              <p className="text-sm text-navy-400 mt-1">Score</p>
            </div>
            <div className="w-px h-12 bg-navy-700" />
            <div>
              <p className="text-4xl font-extrabold text-gradient">{percentage}%</p>
              <p className="text-sm text-navy-400 mt-1">Percentage</p>
            </div>
          </div>

          <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 bg-${category.color}-500/15 border border-${category.color}-500/30`}>
            <CatIcon className={`w-5 h-5 text-${category.color}-400`} />
            <span className={`text-sm font-bold text-${category.color}-400`}>{category.label}</span>
          </div>

          {percentage < 80 && (
            <p className="text-sm text-navy-300 mt-6 max-w-md mx-auto">
              Don't worry — learning about scams is an ongoing journey. Review the Learning Center to strengthen your awareness.
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
            <Button variant="primary" size="lg" onClick={() => onNavigate('learning')}>
              <BookOpen className="w-5 h-5" /> Review Learning Center
            </Button>
            <Button variant="secondary" size="lg" onClick={handleRestart}>
              <RotateCcw className="w-4 h-4" /> Try Again
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-bold text-white mb-4">Question Breakdown</h3>
          <div className="grid gap-2">
            {QUIZ_QUESTIONS.map((q, i) => (
              <div key={q.id} className="flex items-center gap-3 rounded-lg bg-navy-800/30 px-4 py-2.5">
                {answers[i] ? <CheckCircle2 className="w-4 h-4 text-success-400" /> : <XCircle className="w-4 h-4 text-danger-400" />}
                <span className="text-sm text-navy-200 flex-1 truncate">Q{i + 1}: {q.warningSign}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  const progress = ((currentQ + (answered ? 1 : 0)) / QUIZ_QUESTIONS.length) * 100;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="animate-fade-in-up">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center">
            <Brain className="w-5 h-5 text-brand-400" />
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white">Scam Awareness Challenge</h1>
        </div>
        <p className="text-navy-300">Test how well you can recognize common online scam warning signs.</p>
      </div>

      <div className="animate-fade-in-up animate-delay-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-navy-300">Question {currentQ + 1} of {QUIZ_QUESTIONS.length}</span>
          <span className="text-sm font-semibold text-brand-300">Score: {score}</span>
        </div>
        <div className="h-2 rounded-full bg-navy-800 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-brand-500 to-accent-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <Card className="p-6 animate-fade-in-up animate-delay-200">
        <div className="mb-1">
          <span className="text-xs font-semibold text-brand-300 uppercase tracking-wide">Warning Sign: {question.warningSign}</span>
        </div>
        <h3 className="text-lg font-bold text-white mt-2 mb-5 leading-relaxed">{question.scenario}</h3>

        <div className="grid gap-2.5">
          {question.options.map((opt, idx) => {
            const isThisCorrect = idx === question.correctIndex;
            const isThisSelected = idx === selected;
            let style = 'bg-navy-800/30 border-navy-700/20 hover:border-navy-600/40 text-navy-100';
            if (answered && isThisCorrect) style = 'bg-success-500/15 border-success-500/40 text-success-300';
            else if (answered && isThisSelected && !isThisCorrect) style = 'bg-danger-500/15 border-danger-500/40 text-danger-300';

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={answered}
                className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-all ${style} ${!answered && 'cursor-pointer'}`}
              >
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                  answered && isThisCorrect ? 'bg-success-500/30 text-success-400' :
                  answered && isThisSelected ? 'bg-danger-500/30 text-danger-400' :
                  'bg-navy-700/50 text-navy-300'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="text-sm flex-1">{opt}</span>
                {answered && isThisCorrect && <CheckCircle2 className="w-5 h-5 text-success-400" />}
                {answered && isThisSelected && !isThisCorrect && <XCircle className="w-5 h-5 text-danger-400" />}
              </button>
            );
          })}
        </div>

        {answered && (
          <div className="mt-5 animate-fade-in-up">
            <div className={`rounded-xl px-4 py-3.5 border ${isCorrect ? 'bg-success-500/10 border-success-500/30' : 'bg-danger-500/10 border-danger-500/30'}`}>
              <div className="flex items-center gap-2 mb-2">
                {isCorrect ? <CheckCircle2 className="w-5 h-5 text-success-400" /> : <XCircle className="w-5 h-5 text-danger-400" />}
                <span className={`text-sm font-bold ${isCorrect ? 'text-success-400' : 'text-danger-400'}`}>
                  {isCorrect ? 'Correct!' : 'Not quite right'}
                </span>
              </div>
              <p className="text-sm text-navy-200 leading-relaxed">{question.explanation}</p>
            </div>
            <div className="flex justify-end mt-4">
              <Button variant="primary" size="md" onClick={handleNext}>
                {currentQ + 1 < QUIZ_QUESTIONS.length ? 'Next Question' : 'See Results'} <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
