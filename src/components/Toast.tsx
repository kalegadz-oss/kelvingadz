import { useEffect, useState } from 'react';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'warning' | 'error' | 'info';

export interface ToastData {
  id: number;
  type: ToastType;
  message: string;
}

const config: Record<ToastType, { icon: typeof CheckCircle2; bg: string; border: string; text: string }> = {
  success: { icon: CheckCircle2, bg: 'bg-success-500/15', border: 'border-success-500/40', text: 'text-success-400' },
  warning: { icon: AlertTriangle, bg: 'bg-warning-500/15', border: 'border-warning-500/40', text: 'text-warning-400' },
  error: { icon: XCircle, bg: 'bg-danger-500/15', border: 'border-danger-500/40', text: 'text-danger-400' },
  info: { icon: Info, bg: 'bg-brand-500/15', border: 'border-brand-500/40', text: 'text-brand-300' },
};

export function Toast({ toast, onClose }: { toast: ToastData; onClose: (id: number) => void }) {
  const [exiting, setExiting] = useState(false);
  const cfg = config[toast.type];
  const Icon = cfg.icon;

  useEffect(() => {
    const t = setTimeout(() => {
      setExiting(true);
      setTimeout(() => onClose(toast.id), 200);
    }, 4000);
    return () => clearTimeout(t);
  }, [toast.id, onClose]);

  return (
    <div
      className={`glass-strong rounded-xl px-4 py-3 flex items-start gap-3 shadow-card min-w-[280px] max-w-md ${cfg.bg} ${cfg.border} border transition-all duration-200 ${exiting ? 'opacity-0 translate-x-4' : 'animate-slide-in'}`}
    >
      <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${cfg.text}`} />
      <p className="text-sm text-navy-100 flex-1 leading-relaxed">{toast.message}</p>
      <button onClick={() => { setExiting(true); setTimeout(() => onClose(toast.id), 200); }} className="text-navy-300 hover:text-white transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export function ToastContainer({ toasts, onClose }: { toasts: ToastData[]; onClose: (id: number) => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2.5">
      {toasts.map(t => <Toast key={t.id} toast={t} onClose={onClose} />)}
    </div>
  );
}
