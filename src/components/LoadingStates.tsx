export function LoadingSpinner({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 border-navy-700" />
        <div className="absolute inset-0 rounded-full border-2 border-brand-400 border-t-transparent animate-spin-slow" />
      </div>
      {label && <p className="mt-4 text-sm text-navy-300 animate-pulse-soft">{label}</p>}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-2xl glass p-5 shimmer-bg animate-shimmer">
      <div className="h-4 w-24 rounded bg-navy-700/40 mb-3" />
      <div className="h-8 w-16 rounded bg-navy-700/30 mb-2" />
      <div className="h-3 w-32 rounded bg-navy-700/20" />
    </div>
  );
}

export function AnalyzingState({ label = 'Analyzing...' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 animate-fade-in">
      <div className="relative">
        <div className="w-14 h-14 rounded-full border-4 border-navy-700" />
        <div className="absolute inset-0 w-14 h-14 rounded-full border-4 border-brand-400 border-t-transparent animate-spin-slow" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-accent-400 animate-pulse-soft" />
        </div>
      </div>
      <p className="mt-5 text-sm font-medium text-navy-200">{label}</p>
      <div className="mt-2 flex gap-1">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse-soft"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
}
