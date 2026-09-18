import { useState } from 'react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import RiskMeter from '@/components/RiskMeter';
import Disclaimer from '@/components/Disclaimer';
import { WarningSignCard } from '@/components/WarningSignCard';
import { AnalyzingState } from '@/components/LoadingStates';
import { Briefcase, RotateCcw, ShieldCheck, ListChecks } from 'lucide-react';
import { analyzeJob, determineRisk, type JobFormData } from '@/analysis';
import type { WarningSign, RiskLevel } from '@/types';
import { RISK_CONFIG } from '@/types';

const CHECKBOX_FLAGS: { id: string; label: string }[] = [
  { id: 'upfront_payment', label: 'Requires an upfront payment' },
  { id: 'high_earnings', label: 'Promises unusually high earnings' },
  { id: 'no_company_info', label: 'No clear company information' },
  { id: 'pressure', label: 'Pressures applicant to act quickly' },
  { id: 'sensitive_early', label: 'Requests sensitive information too early' },
  { id: 'vague_description', label: 'Job description is vague' },
  { id: 'unofficial_account', label: 'Communication is only through an unofficial account' },
];

const EMPTY_FORM: JobFormData = {
  company: '', position: '', salary: '', description: '', contactMethod: '',
  applicationFee: '', trainingFee: '', requiredInfo: '', flags: [],
};

const SAFETY_TIPS = [
  'Research the company through official sources',
  'Never pay fees to get a job',
  'Verify the employer through official channels',
  'Be cautious of remote work that seems too easy',
  'Do not share sensitive information before formal hiring',
];

export default function JobGuardPage() {
  const [form, setForm] = useState<JobFormData>(EMPTY_FORM);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<{ signs: WarningSign[]; level: RiskLevel } | null>(null);

  const updateField = (key: keyof Omit<JobFormData, 'flags'>, value: string) => setForm(f => ({ ...f, [key]: value }));
  const toggleFlag = (id: string) => setForm(f => ({ ...f, flags: f.flags.includes(id) ? f.flags.filter(x => x !== id) : [...f.flags, id] }));

  const handleCheck = () => {
    setAnalyzing(true);
    setResult(null);
    setTimeout(() => {
      const signs = analyzeJob(form);
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
          <div className="w-10 h-10 rounded-xl bg-success-500/15 border border-success-500/30 flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-success-400" />
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white">JobGuard</h1>
        </div>
        <p className="text-navy-300">Review an online job offer for common scam warning signs.</p>
      </div>

      {!result && !analyzing && (
        <Card className="p-6 space-y-5 animate-fade-in-up animate-delay-100">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Company Name" value={form.company} onChange={v => updateField('company', v)} placeholder="e.g. TechCorp Inc." />
            <Field label="Job Position" value={form.position} onChange={v => updateField('position', v)} placeholder="e.g. Data Entry Clerk" />
            <Field label="Salary Offered" value={form.salary} onChange={v => updateField('salary', v)} placeholder="e.g. $500/day" />
            <Field label="Contact Method" value={form.contactMethod} onChange={v => updateField('contactMethod', v)} placeholder="e.g. WhatsApp" />
            <Field label="Application Fee" value={form.applicationFee} onChange={v => updateField('applicationFee', v)} placeholder="e.g. 50" type="number" />
            <Field label="Training Fee" value={form.trainingFee} onChange={v => updateField('trainingFee', v)} placeholder="e.g. 200" type="number" />
          </div>
          <Field label="Job Description" value={form.description} onChange={v => updateField('description', v)} placeholder="Describe the job duties..." textarea />
          <Field label="Required Personal Information" value={form.requiredInfo} onChange={v => updateField('requiredInfo', v)} placeholder="e.g. SSN, bank account, passport..." />

          <div>
            <p className="text-sm font-semibold text-navy-200 mb-3">Check all that apply:</p>
            <div className="grid gap-2.5">
              {CHECKBOX_FLAGS.map(flag => (
                <label key={flag.id} className="flex items-center gap-3 rounded-lg bg-navy-800/30 border border-navy-700/20 px-4 py-2.5 cursor-pointer hover:border-navy-600/40 transition-colors">
                  <input type="checkbox" checked={form.flags.includes(flag.id)} onChange={() => toggleFlag(flag.id)} className="w-4 h-4 rounded border-navy-600 bg-navy-800 text-brand-500 focus:ring-brand-500/30" />
                  <span className="text-sm text-navy-100">{flag.label}</span>
                </label>
              ))}
            </div>
          </div>

          <Button variant="primary" size="lg" onClick={handleCheck}>
            <Briefcase className="w-5 h-5" /> Check Job Offer
          </Button>
        </Card>
      )}

      {analyzing && (
        <Card className="p-8">
          <AnalyzingState label="Analyzing job offer..." />
        </Card>
      )}

      {result && !analyzing && (
        <div className="space-y-5 animate-fade-in-up">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-white">Job Offer Analysis</h2>
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
                <p className="text-sm text-success-300">No significant warning signs were detected based on the information provided. Still, always research employers independently.</p>
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
              <h3 className="text-base font-bold text-white">Safety Recommendations</h3>
            </div>
            <div className="grid gap-2.5">
              {SAFETY_TIPS.map((item, i) => (
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
              <RotateCcw className="w-4 h-4" /> Check Another Job Offer
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = 'text', textarea = false }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string; textarea?: boolean }) {
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
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg bg-navy-900/50 border border-navy-700/40 px-3.5 py-2.5 text-sm text-white placeholder:text-navy-500 focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/20 transition-all"
        />
      )}
    </div>
  );
}
