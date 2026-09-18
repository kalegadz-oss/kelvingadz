import { useState } from 'react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import RiskMeter from '@/components/RiskMeter';
import Disclaimer from '@/components/Disclaimer';
import { WarningSignCard } from '@/components/WarningSignCard';
import { AnalyzingState } from '@/components/LoadingStates';
import { MessageSquareWarning, RotateCcw, ShieldCheck, AlertTriangle } from 'lucide-react';
import { analyzeMessage, containsSensitiveInfo, determineRisk } from '@/analysis';
import type { WarningSign, RiskLevel } from '@/types';

const SAFETY_CHECKLIST = [
  "Don't send money immediately.",
  "Don't share passwords or verification codes.",
  'Verify the sender independently.',
  'Avoid clicking suspicious links.',
  'Use official websites or contact channels to verify claims.',
];

export default function MessageAnalyzerPage() {
  const [text, setText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<{ signs: WarningSign[]; level: RiskLevel } | null>(null);
  const [sensitiveWarning, setSensitiveWarning] = useState(false);

  const maxChars = 5000;

  const handleAnalyze = () => {
    if (!text.trim()) return;

    const sensitive = containsSensitiveInfo(text);
    setSensitiveWarning(sensitive.length > 0);

    setAnalyzing(true);
    setResult(null);
    setTimeout(() => {
      const signs = analyzeMessage(text);
      const level = determineRisk(signs.length);
      setResult({ signs, level });
      setAnalyzing(false);
    }, 1400);
  };

  const handleReset = () => {
    setText('');
    setResult(null);
    setSensitiveWarning(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="animate-fade-in-up">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center">
            <MessageSquareWarning className="w-5 h-5 text-brand-400" />
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white">Message Analyzer</h1>
        </div>
        <p className="text-navy-300">Paste a suspicious message and ScamWise will identify possible warning signs.</p>
      </div>

      {!result && !analyzing && (
        <Card className="p-6 animate-fade-in-up animate-delay-100">
          <label className="block text-sm font-semibold text-navy-200 mb-2">Suspicious Message</label>
          <textarea
            value={text}
            onChange={e => setText(e.target.value.slice(0, maxChars))}
            placeholder="Paste the suspicious message here..."
            rows={8}
            className="w-full rounded-xl bg-navy-900/50 border border-navy-700/40 px-4 py-3 text-sm text-white placeholder:text-navy-500 focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/20 transition-all resize-none"
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-navy-400">{text.length} / {maxChars} characters</span>
            {sensitiveWarning && (
              <span className="flex items-center gap-1.5 text-xs text-danger-400 font-medium">
                <AlertTriangle className="w-3.5 h-3.5" />
                Remove private information before submitting
              </span>
            )}
          </div>

          {sensitiveWarning && (
            <div className="mt-3 rounded-xl bg-danger-500/10 border border-danger-500/30 px-4 py-3 animate-scale-in">
              <p className="text-sm text-danger-300 font-medium">
                Your message may contain sensitive information (passwords, codes, card numbers).
                Please remove any private data before analyzing.
              </p>
            </div>
          )}

          <div className="flex gap-3 mt-5">
            <Button variant="primary" size="lg" onClick={handleAnalyze} disabled={!text.trim()} className="flex-1 sm:flex-none">
              <MessageSquareWarning className="w-5 h-5" /> Analyze Message
            </Button>
            {text && <Button variant="ghost" size="lg" onClick={handleReset}>Clear</Button>}
          </div>
        </Card>
      )}

      {analyzing && (
        <Card className="p-8">
          <AnalyzingState label="Scanning for warning signs..." />
        </Card>
      )}

      {result && !analyzing && (
        <div className="space-y-5 animate-fade-in-up">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-white">Analysis Result</h2>
              <span className={`text-sm font-bold px-3 py-1.5 rounded-full border ${
                result.level === 'high' ? 'bg-danger-500/15 border-danger-500/40 text-danger-400' :
                result.level === 'moderate' ? 'bg-warning-500/15 border-warning-500/40 text-warning-400' :
                'bg-success-500/15 border-success-500/40 text-success-400'
              }`}>
                {result.level === 'high' ? 'HIGH CAUTION' : result.level === 'moderate' ? 'MODERATE CAUTION' : 'LOW CAUTION'}
              </span>
            </div>
            <RiskMeter level={result.level} warningCount={result.signs.length} />
          </Card>

          <Card className="p-6">
            <h3 className="text-base font-bold text-white mb-4">
              Warning Signs Detected {result.signs.length > 0 && `(${result.signs.length})`}
            </h3>
            {result.signs.length === 0 ? (
              <div className="flex items-center gap-3 rounded-xl bg-success-500/10 border border-success-500/30 px-4 py-4">
                <ShieldCheck className="w-6 h-6 text-success-400" />
                <p className="text-sm text-success-300">No significant warning signs were detected in this message. However, always stay cautious and verify claims through official sources.</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {result.signs.map((sign, i) => (
                  <WarningSignCard key={sign.id + i} icon={sign.icon} title={sign.title} explanation={sign.explanation} />
                ))}
              </div>
            )}
          </Card>

          <Card className="p-6">
            <h3 className="text-base font-bold text-white mb-4">What should you do?</h3>
            <div className="grid gap-2.5">
              {SAFETY_CHECKLIST.map((item, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg bg-navy-800/30 px-4 py-2.5">
                  <ShieldCheck className="w-4.5 h-4.5 text-success-400 flex-shrink-0" />
                  <span className="text-sm text-navy-100">{item}</span>
                </div>
              ))}
            </div>
          </Card>

          <Disclaimer />

          <div className="flex justify-center pt-2">
            <Button variant="secondary" size="lg" onClick={handleReset}>
              <RotateCcw className="w-4 h-4" /> Analyze Another Message
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
