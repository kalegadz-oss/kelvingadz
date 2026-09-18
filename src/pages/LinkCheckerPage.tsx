import { useState } from 'react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Disclaimer from '@/components/Disclaimer';
import { WarningSignCard } from '@/components/WarningSignCard';
import { AnalyzingState } from '@/components/LoadingStates';
import { Link2, RotateCcw, ShieldCheck, AlertTriangle } from 'lucide-react';
import RiskMeter from '@/components/RiskMeter';
import { analyzeLink, determineRisk } from '@/analysis';
import type { WarningSign, RiskLevel } from '@/types';
import { RISK_CONFIG } from '@/types';

export default function LinkCheckerPage() {
  const [url, setUrl] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<{ signs: WarningSign[]; level: RiskLevel } | null>(null);

  const handleCheck = () => {
    if (!url.trim()) return;
    setAnalyzing(true);
    setResult(null);
    setTimeout(() => {
      const signs = analyzeLink(url);
      const level = determineRisk(signs.length);
      setResult({ signs, level });
      setAnalyzing(false);
    }, 1400);
  };

  const handleReset = () => {
    setUrl('');
    setResult(null);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="animate-fade-in-up">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-accent-500/15 border border-accent-500/30 flex items-center justify-center">
            <Link2 className="w-5 h-5 text-accent-400" />
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white">Link Checker</h1>
        </div>
        <p className="text-navy-300">Review a suspicious URL for potentially risky patterns.</p>
      </div>

      {!result && !analyzing && (
        <Card className="p-6 animate-fade-in-up animate-delay-100">
          <label className="block text-sm font-semibold text-navy-200 mb-2">Suspicious URL</label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="Paste URL here..."
              className="flex-1 rounded-xl bg-navy-900/50 border border-navy-700/40 px-4 py-3 text-sm text-white placeholder:text-navy-500 focus:border-accent-500/50 focus:ring-2 focus:ring-accent-500/20 transition-all"
              onKeyDown={e => e.key === 'Enter' && handleCheck()}
            />
            <Button variant="primary" size="lg" onClick={handleCheck} disabled={!url.trim()}>
              <Link2 className="w-5 h-5" /> Check Link
            </Button>
          </div>
        </Card>
      )}

      {analyzing && (
        <Card className="p-8">
          <AnalyzingState label="Inspecting URL patterns..." />
        </Card>
      )}

      {result && !analyzing && (
        <div className="space-y-5 animate-fade-in-up">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-white">Link Analysis</h2>
              <span className={`text-sm font-bold px-3 py-1.5 rounded-full border ${RISK_CONFIG[result.level].bgColor} ${RISK_CONFIG[result.level].borderColor} ${RISK_CONFIG[result.level].textColor}`}>
                Risk indicators detected: {result.signs.length}
              </span>
            </div>
            <div className="rounded-xl bg-navy-900/50 border border-navy-700/40 px-4 py-3 mb-5">
              <p className="text-xs text-navy-400 mb-1">URL Checked</p>
              <p className="text-sm text-white font-mono break-all">{url}</p>
            </div>
            <RiskMeter level={result.level} warningCount={result.signs.length} />
          </Card>

          <Card className="p-6">
            <h3 className="text-base font-bold text-white mb-4">Risk Indicators</h3>
            {result.signs.length === 0 ? (
              <div className="flex items-center gap-3 rounded-xl bg-success-500/10 border border-success-500/30 px-4 py-4">
                <ShieldCheck className="w-6 h-6 text-success-400" />
                <p className="text-sm text-success-300">No significant URL risk indicators were detected. However, a clean pattern check does not guarantee safety.</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {result.signs.map((sign, i) => (
                  <WarningSignCard key={sign.id + i} icon={sign.icon} title={sign.title} explanation={sign.explanation} />
                ))}
              </div>
            )}
          </Card>

          <div className="flex items-start gap-3 rounded-xl bg-warning-500/10 border border-warning-500/30 px-4 py-3.5">
            <AlertTriangle className="w-4 h-4 text-warning-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-warning-300 leading-relaxed">
              ScamWise checks URL patterns only. A result does not guarantee that a website is safe or fraudulent.
            </p>
          </div>

          <Disclaimer />

          <div className="flex justify-center pt-2">
            <Button variant="secondary" size="lg" onClick={handleReset}>
              <RotateCcw className="w-4 h-4" /> Check Another Link
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
