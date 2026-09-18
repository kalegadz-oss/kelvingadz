import type { RiskLevel } from '@/types';
import { RISK_CONFIG } from '@/types';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md';
}

export default function RiskBadge({ level, size = 'md' }: RiskBadgeProps) {
  const cfg = RISK_CONFIG[level];
  const sizeClasses = size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold border ${cfg.bgColor} ${cfg.borderColor} ${cfg.textColor} ${sizeClasses}`}>
      <span className={`w-2 h-2 rounded-full bg-${cfg.color}-400`} />
      {cfg.shortLabel}
    </span>
  );
}
