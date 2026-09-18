import { useState } from 'react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import RiskMeter from '@/components/RiskMeter';
import Disclaimer from '@/components/Disclaimer';
import { WarningSignCard } from '@/components/WarningSignCard';
import { AnalyzingState } from '@/components/LoadingStates';
import { Gift, RotateCcw, ShieldCheck, ListChecks } from 'lucide-react';
import { analyzePrize, determineRisk, type PrizeFormData } from '@/analysis';
import type { WarningSign, RiskLevel } from '@/types';
import { RISK_CONFIG } from '@/types';

const EMPTY_FORM: PrizeFormData = {
  prizeName: '', organizer: '', message: '', requiredPayment: '',
  contactMethod: '', officialWebsite: '', enteredContest: '', hasOfficialPage: '', askedToPay: '',
};

const SAFETY_CHECKLIST = [
  'You cannot win a contest you did not enter',
  'Never pay fees to receive a prize',
  'Verify the organizer through official channels',
  'Be suspicious of giveaways on social media',
  'Do not share personal information to claim a prize',
];

export default function PrizeCheckPage() {
  const [form, setForm] = useState<PrizeFormData>(EMPTY_FORM);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<{ signs: WarningSign[]; level: RiskLevel } | null>(null);

  const update = (key: keyof PrizeFormData, value: string) => setForm(f => ({ ...f, [key]: value }));

  const handleCheck = () => {
    setAnalyzing(true);
    setResult(null);
    setTimeout(() => {
      const signs = analyzePrize(form);
      const level = determineRisk(signs.length);
      setResult({ signs, level });
      setAnalyzing(false);
    }, 1400);
  };

  const handleReset = () => { setForm(EMPTY_FORM); setResult(null); };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="animate-fade-in-up">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-danger-500/15 border border-danger-500/30 flex items-center justify-center">
            <Gift className="w-5 h-5 text-danger-400" />
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white">PrizeCheck</h1>
        </div>
        <p className="text-navy-300">Check unexpected prize, giveaway, or reward messages.</p>
      </div>

      {!result && !analyzing && (
        <Card className="p-6 space-y-5 animate-fade-in-up animate-delay-100">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Prize Name" value={form.prizeName} onChange={v => update('prizeName', v)} placeholder="e.g. $500 Gift Card" />
            <Field label="Organizer" value={form.organizer} onChange={v => update('organizer', v)} placeholder="e.g. MegaGiveaway Inc." />
            <Field label="Required Payment" value={form.requiredPayment} onChange={v => update('requiredPayment', v)} placeholder="e.g. $5 shipping fee" />
            <Field label="Contact Method" value={form.contactMethod} onChange={v => update('contactMethod', v)} placeholder="e.g. WhatsApp message" />
            <Field label="Official Website" value={form.officialWebsite} onChange={v => update('officialWebsite', v)} placeholder="https://..." />
          </div>
          <Field label="Message Received" value={form.message} onChange={v => update('message', v)} placeholder="Paste the prize or giveaway message..." textarea />

          <div className="grid sm:grid-cols-3 gap-4">
            <YesNoQuestion label="Did you enter this contest?" value={form.enteredContest} onChange={v => update('enteredContest', v)} />
            <YesNoQuestion label="Does the organizer have a verifiable official page?" value={form.hasOfficialPage} onChange={v => update('hasOfficialPage', v)} />
            <YesNoQuestion label="Are you being asked to pay before receiving the prize?" value={form.askedToPay} onChange={v => update('askedToPay', v)} />
          </div>

          <Button variant="primary" size="lg" onClick={handleCheck}>
            <Gift className="w-5 h-5" /> Check Prize Claim
          </Button>
        </Card>
      )}

      {analyzing && (
        <Card className="p-8">
          <AnalyzingState label="Checking prize claim..." />
        </Card>
      )}

      {result && !analyzing && (
        <div className="space-y-5 animate-fade-in-up">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-white">Prize Check Result</h2>
              <span className={`text-sm font-bold px-3 py-1.5 rounded-full border ${RISK_CONFIG[result.level].bgColor} ${RISK_CONFIG[result.level].borderColor} ${RISK_CONFIG[result.level].textColor}`}>
                {RISK_CONFIG[result.level].label}
              </span>
            </div>
            <RiskMeter level={result.level} warningCount={result.signs.length} />
          </Card>

          <Card className="p-6">
            <h3 className="text-base font-bold text-white mb-4">Detected Warning Signs</h3>
            {result.signs.length === 0 ? (
              <div className="flex items-center gap-3 rounded-xl bg-success-500/10 border border-success-500/30 px-4 py-4">
                <ShieldCheck className="w-6 h-6 text-success-400" />
                <p className="text-sm text-success-300">No significant warning signs were detected. However, always verify prize claims through official sources.</p>
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
            <div className="flex items-center gap-2 mb-4">
              <ListChecks className="w-5 h-5 text-success-400" />
              <h3 className="text-base font-bold text-white">Safety Checklist</h3>
            </div>
            <div className="grid gap-2.5">
              {SAFETY_CHECKLIST.map((item, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg bg-navy-800/30 px-4 py-2.5">
                  <ShieldCheck className="w-4 h-4 text-success-400 flex-shrink-0" />
                  <span className="text-sm text-navy-100">{item}</span>
                </div>
              ))}
            </div>
          </Card>

          <Disclaimer />

          <div className="flex justify-center pt-2">
            <Button variant="secondary" size="lg" onClick={handleReset}>
              <RotateCcw className="w-4 h-4" /> Check Another Prize
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, placeholder, textarea = false }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; textarea?: boolean }) {
  return (
    <div>
      <label className="block text-sm font-medium text-navy-200 mb-1.5">{label}</label>
      {textarea ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full rounded-lg bg-navy-900/50 border border-navy-700/40 px-3.5 py-2.5 text-sm text-white placeholder:text-navy-500 focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/20 transition-all resize-none"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg bg-navy-900/50 border border-navy-700/40 px-3.5 py-2.5 text-sm text-white placeholder:text-navy-500 focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/20 transition-all"
        />
      )}
    </div>
  );
}

function YesNoQuestion({ label, value, onChange }: { label: string; value: string; onChange: (v: 'yes' | 'no' | '') => void }) {
  return (
    <div>
      <label className="block text-sm font-medium text-navy-200 mb-1.5">{label}</label>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onChange('yes')}
          className={`flex-1 rounded-lg px-3 py-2.5 text-sm font-medium border transition-all ${value === 'yes' ? 'bg-brand-500/20 border-brand-500/50 text-brand-300' : 'bg-navy-900/50 border-navy-700/40 text-navy-300 hover:border-navy-600/60'}`}
        >Yes</button>
        <button
          type="button"
          onClick={() => onChange('no')}
          className={`flex-1 rounded-lg px-3 py-2.5 text-sm font-medium border transition-all ${value === 'no' ? 'bg-navy-700/40 border-navy-600/50 text-white' : 'bg-navy-900/50 border-navy-700/40 text-navy-300 hover:border-navy-600/60'}`}
        >No</button>
      </div>
    </div>
  );
}
