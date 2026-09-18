import type { RiskLevel } from '@/types';
import { RISK_CONFIG } from '@/types';

interface RiskMeterProps {
  level: RiskLevel;
  warningCount: number;
}

export default function RiskMeter({ level, warningCount }: RiskMeterProps) {
  const cfg = RISK_CONFIG[level];

  const segments: { key: RiskLevel; label: string; width: string }[] = [
    { key: 'low', label: 'LOW', width: '33%' },
    { key: 'moderate', label: 'MODERATE', width: '34%' },
    { key: 'high', label: 'HIGH', width: '33%' },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-navy-300">Risk Indicator</span>
        <span className={`text-sm font-bold ${cfg.textColor}`}>{cfg.label}</span>
      </div>
      <div className="relative flex h-3.5 rounded-full overflow-hidden bg-navy-800">
        {segments.map(seg => {
          const segCfg = RISK_CONFIG[seg.key];
          const isActive = seg.key === level;
          const isLower = RISK_CONFIG[seg.key].percent <= cfg.percent;
          return (
            <div
              key={seg.key}
              className={`transition-all duration-700 ${isActive ? `bg-${segCfg.color}-500 shadow-[0_0_12px_rgba(34,211,238,0.3)]` : isLower ? `bg-${segCfg.color}-500/40` : 'bg-navy-700/50'}`}
              style={{ width: seg.width }}
            />
          );
        })}
      </div>
      <div className="flex justify-between text-[11px] font-semibold tracking-wide">
        {segments.map(seg => (
          <span key={seg.key} className={seg.key === level ? RISK_CONFIG[seg.key].textColor : 'text-navy-400'}>
            {seg.label}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-3 pt-2">
        <div className={`flex-1 rounded-lg ${cfg.bgColor} ${cfg.borderColor} border px-4 py-2.5`}>
          <p className={`text-sm font-semibold ${cfg.textColor}`}>{cfg.label}</p>
          <p className="text-xs text-navy-300 mt-0.5">{cfg.description}</p>
        </div>
        <div className="text-center px-4 py-2.5 rounded-lg bg-navy-800/50 border border-navy-700/30">
          <p className="text-2xl font-extrabold text-white">{warningCount}</p>
          <p className="text-[10px] text-navy-400 uppercase tracking-wide">Warning Signs</p>
        </div>
      </div>
      <p className="text-xs text-navy-400 italic pt-1">
        Risk indicator is based on detected warning signs and does not prove that the message is fraudulent.
      </p>
    </div>
  );
}
