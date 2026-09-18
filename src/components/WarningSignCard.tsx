import { AlertTriangle } from 'lucide-react';

export function WarningSignCard({ icon, title, explanation }: { icon: string; title: string; explanation: string }) {
  return (
    <div className="flex items-start gap-3.5 rounded-xl bg-navy-800/40 border border-danger-500/20 px-4 py-3.5 transition-all duration-200 hover:border-danger-500/40 hover:bg-navy-800/60 animate-fade-in-up">
      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-danger-500/15 border border-danger-500/30 flex items-center justify-center">
        <AlertTriangle className="w-5 h-5 text-danger-400" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-white">{title}</h4>
        <p className="text-xs text-navy-300 mt-1 leading-relaxed">{explanation}</p>
      </div>
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description, action }: { icon: typeof AlertTriangle; title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-navy-800/50 border border-navy-700/30 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-navy-400" />
      </div>
      <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
      <p className="text-sm text-navy-400 max-w-sm">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
