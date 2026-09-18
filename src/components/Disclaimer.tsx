import { Info } from 'lucide-react';
import { DISCLAIMER } from '@/types';

export default function Disclaimer() {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-navy-800/40 border border-navy-700/30 px-4 py-3.5">
      <Info className="w-4 h-4 text-navy-300 mt-0.5 flex-shrink-0" />
      <p className="text-xs text-navy-300 leading-relaxed">{DISCLAIMER}</p>
    </div>
  );
}
