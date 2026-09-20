import Logo from '@/components/Logo';
import Button from '@/components/Button';
import { Shield, ShieldCheck, Eye, Smartphone, AlertTriangle, MessageSquareWarning, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onLearnAboutScams: () => void;
}

export default function LandingPage({ onGetStarted, onLearnAboutScams }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-navy-950 bg-mesh flex flex-col">
      <header className="px-6 lg:px-12 py-5 flex items-center justify-between animate-fade-in">
        <Logo size="md" />
        <div className="hidden sm:flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onLearnAboutScams}>Learn About Scams</Button>
          <Button variant="primary" size="sm" onClick={onGetStarted}>Get Started <ArrowRight className="w-4 h-4" /></Button>
        </div>
      </header>

      <main className="flex-1 flex items-center px-6 lg:px-12 py-8">
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in-up">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-brand-500/10 border border-brand-500/30 px-3 py-1.5 mb-6">
                <Shield className="w-3.5 h-3.5 text-brand-300" />
                <span className="text-xs font-semibold text-brand-200 tracking-wide">Anti-Scam Awareness Platform</span>
              </div>
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-white leading-[1.05]">
                Stay Alert.<br />
                Stay <span className="text-gradient">Wise.</span><br />
                Stay Safe.
              </h1>
              <p className="mt-6 text-lg text-navy-200 leading-relaxed max-w-xl">
                Identify warning signs, understand online risks, and make safer digital decisions.
                AlegadoWise helps you recognize scams before they happen.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="primary" size="lg" onClick={onGetStarted}>
                Get Started <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="secondary" size="lg" onClick={onLearnAboutScams}>
                Learn About Scams
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2">
              {['Message Analysis', 'Link Checking', 'Scam Quiz', 'Learning Center'].map(item => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success-400" />
                  <span className="text-sm text-navy-300">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative hidden lg:flex items-center justify-center animate-fade-in-up animate-delay-200">
            <div className="relative w-full max-w-md aspect-square">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-brand-500/20 to-accent-500/10 blur-3xl" />

              <div className="absolute inset-0 rounded-3xl glass border border-navy-600/30 flex items-center justify-center">
                <Shield className="w-40 h-40 text-brand-400/40 animate-float" strokeWidth={1} />
              </div>

              <div className="absolute top-8 right-0 glass-strong rounded-2xl p-4 shadow-card animate-float" style={{ animationDelay: '0.5s' }}>
                <Smartphone className="w-8 h-8 text-accent-400" />
                <p className="text-xs text-navy-300 mt-2 font-medium">Your Device</p>
              </div>

              <div className="absolute top-1/2 -left-4 glass-strong rounded-2xl p-4 shadow-card w-52 animate-float" style={{ animationDelay: '1s' }}>
                <MessageSquareWarning className="w-6 h-6 text-warning-400" />
                <p className="text-xs text-navy-200 mt-2 font-medium">"Your account will be closed in 10 minutes..."</p>
                <p className="text-[10px] text-danger-400 mt-1.5 font-semibold">WARNING SIGN DETECTED</p>
              </div>

              <div className="absolute bottom-12 right-4 glass-strong rounded-2xl p-4 shadow-card animate-float" style={{ animationDelay: '1.5s' }}>
                <AlertTriangle className="w-7 h-7 text-danger-400" />
                <p className="text-xs text-navy-300 mt-2 font-medium">High Caution</p>
              </div>

              <div className="absolute bottom-4 left-8 glass-strong rounded-2xl p-4 shadow-card animate-float" style={{ animationDelay: '2s' }}>
                <ShieldCheck className="w-7 h-7 text-success-400" />
                <p className="text-xs text-navy-300 mt-2 font-medium">Protected</p>
              </div>

              <div className="absolute top-1/3 left-1/2 glass-strong rounded-xl p-3 shadow-card animate-float" style={{ animationDelay: '0.8s' }}>
                <Lock className="w-5 h-5 text-brand-300" />
              </div>

              <div className="absolute top-12 left-1/3 glass-strong rounded-xl p-3 shadow-card animate-float" style={{ animationDelay: '1.2s' }}>
                <Eye className="w-5 h-5 text-accent-400" />
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="px-6 lg:px-12 py-6 border-t border-navy-800/50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-navy-400">AlegadoWise identifies potential warning signs. It cannot guarantee something is legitimate or fraudulent.</p>
          <p className="text-xs text-navy-400">© 2026 AlegadoWise. Educational use only.</p>
        </div>
      </footer>
    </div>
  );
}
