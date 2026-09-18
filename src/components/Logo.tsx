import { ShieldCheck, ShieldAlert, Eye } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const sizes = {
    sm: { icon: 32, text: 'text-lg' },
    md: { icon: 40, text: 'text-xl' },
    lg: { icon: 56, text: 'text-3xl' },
  };
  const s = sizes[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative" style={{ width: s.icon, height: s.icon }}>
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-brand-400 to-accent-500 opacity-90" />
        <div className="absolute inset-0 rounded-xl bg-brand-500/30 blur-md" />
        <div className="relative flex items-center justify-center w-full h-full rounded-xl border border-white/10">
          <ShieldCheck className="text-white" style={{ width: s.icon * 0.55, height: s.icon * 0.55 }} strokeWidth={2.2} />
          <Eye className="absolute text-accent-400" style={{ width: s.icon * 0.28, height: s.icon * 0.28, bottom: s.icon * 0.18, right: s.icon * 0.15 }} strokeWidth={2.5} />
        </div>
      </div>
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`font-extrabold tracking-tight ${s.text} text-white`}>
            SCAM<span className="text-gradient">WISE</span>
          </span>
          {size !== 'sm' && (
            <span className="text-[10px] text-navy-300 tracking-wide mt-0.5 font-medium">
              Stay Alert. Stay Wise. Stay Safe.
            </span>
          )}
        </div>
      )}
    </div>
  );
}
