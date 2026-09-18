import { useState } from 'react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import RiskMeter from '@/components/RiskMeter';
import Disclaimer from '@/components/Disclaimer';
import { WarningSignCard } from '@/components/WarningSignCard';
import { AnalyzingState } from '@/components/LoadingStates';
import { ShoppingCart, RotateCcw, ShieldCheck, ListChecks } from 'lucide-react';
import { analyzeShopping, determineRisk, type ShoppingFormData } from '@/analysis';
import type { WarningSign, RiskLevel } from '@/types';
import { RISK_CONFIG } from '@/types';

const CHECKBOX_FLAGS: { id: string; label: string }[] = [
  { id: 'outside_platform', label: 'Seller asks for payment outside the platform' },
  { id: 'low_price', label: 'Price seems unusually low' },
  { id: 'pressure', label: 'Seller is pressuring me to pay quickly' },
  { id: 'no_protection', label: 'Seller refuses normal payment protection' },
  { id: 'no_history', label: 'Seller has little or no transaction history' },
];

const EMPTY_FORM: ShoppingFormData = {
  product: '', seller: '', price: '', paymentMethod: '', sellerAge: '', reviews: '',
  returnPolicy: '', sellerContact: '', productLink: '', flags: [],
};

const BEFORE_YOU_BUY = [
  'Check seller history',
  'Review independent feedback',
  'Use protected payment methods',
  'Confirm return/refund policies',
  'Avoid rushing into payment',
];

export default function ShopSafePage() {
  const [form, setForm] = useState<ShoppingFormData>(EMPTY_FORM);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<{ signs: WarningSign[]; level: RiskLevel } | null>(null);

  const updateField = (key: keyof Omit<ShoppingFormData, 'flags'>, value: string) => setForm(f => ({ ...f, [key]: value }));
  const toggleFlag = (id: string) => setForm(f => ({ ...f, flags: f.flags.includes(id) ? f.flags.filter(x => x !== id) : [...f.flags, id] }));

  const handleEvaluate = () => {
    setAnalyzing(true);
    setResult(null);
    setTimeout(() => {
      const signs = analyzeShopping(form);
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
          <div className="w-10 h-10 rounded-xl bg-warning-500/15 border border-warning-500/30 flex items-center justify-center">
            <ShoppingCart className="w-5 h-5 text-warning-400" />
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white">ShopSafe</h1>
        </div>
        <p className="text-navy-300">Check an online shopping offer before making a purchase.</p>
      </div>

      {!result && !analyzing && (
        <Card className="p-6 space-y-5 animate-fade-in-up animate-delay-100">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Product Name" value={form.product} onChange={v => updateField('product', v)} placeholder="e.g. iPhone 15 Pro" />
            <Field label="Seller Name" value={form.seller} onChange={v => updateField('seller', v)} placeholder="e.g. TechDeals123" />
            <Field label="Product Price" value={form.price} onChange={v => updateField('price', v)} placeholder="e.g. 149" type="number" />
            <Field label="Payment Method" value={form.paymentMethod} onChange={v => updateField('paymentMethod', v)} placeholder="e.g. Wire transfer" />
            <Field label="Seller Account Age (days)" value={form.sellerAge} onChange={v => updateField('sellerAge', v)} placeholder="e.g. 15" type="number" />
            <Field label="Number of Reviews" value={form.reviews} onChange={v => updateField('reviews', v)} placeholder="e.g. 3" type="number" />
            <Field label="Return/Refund Policy" value={form.returnPolicy} onChange={v => updateField('returnPolicy', v)} placeholder="e.g. No returns" />
            <Field label="Seller Contact Information" value={form.sellerContact} onChange={v => updateField('sellerContact', v)} placeholder="e.g. WhatsApp only" />
          </div>
          <Field label="Product Link" value={form.productLink} onChange={v => updateField('productLink', v)} placeholder="https://..." />

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

          <Button variant="primary" size="lg" onClick={handleEvaluate}>
            <ShoppingCart className="w-5 h-5" /> Evaluate Shopping Risk
          </Button>
        </Card>
      )}

      {analyzing && (
        <Card className="p-8">
          <AnalyzingState label="Evaluating shopping risk..." />
        </Card>
      )}

      {result && !analyzing && (
        <div className="space-y-5 animate-fade-in-up">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-white">Shopping Risk Indicators</h2>
              <span className={`text-sm font-bold px-3 py-1.5 rounded-full border ${RISK_CONFIG[result.level].bgColor} ${RISK_CONFIG[result.level].borderColor} ${RISK_CONFIG[result.level].textColor}`}>
                {result.signs.length > 0 ? 'Several caution indicators detected' : 'No major indicators detected'}
              </span>
            </div>
            <RiskMeter level={result.level} warningCount={result.signs.length} />
          </Card>

          <Card className="p-6">
            <h3 className="text-base font-bold text-white mb-4">Detected Warning Signs</h3>
            {result.signs.length === 0 ? (
              <div className="flex items-center gap-3 rounded-xl bg-success-500/10 border border-success-500/30 px-4 py-4">
                <ShieldCheck className="w-6 h-6 text-success-400" />
                <p className="text-sm text-success-300">No significant warning signs were detected based on the information provided. Always exercise normal caution when shopping online.</p>
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
              <h3 className="text-base font-bold text-white">Before You Buy</h3>
            </div>
            <div className="grid gap-2.5">
              {BEFORE_YOU_BUY.map((item, i) => (
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
              <RotateCcw className="w-4 h-4" /> Check Another Offer
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-navy-200 mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg bg-navy-900/50 border border-navy-700/40 px-3.5 py-2.5 text-sm text-white placeholder:text-navy-500 focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/20 transition-all"
      />
    </div>
  );
}
