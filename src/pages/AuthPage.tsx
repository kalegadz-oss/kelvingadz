import { useState } from 'react';
import Logo from '@/components/Logo';
import Button from '@/components/Button';
import { Shield, Eye, EyeOff, Mail, Lock, User, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

type Tab = 'login' | 'signup';

export default function AuthPage() {
  const [tab, setTab] = useState<Tab>('login');
  const { signIn, signUp } = useAuth();

  return (
    <div className="min-h-screen bg-navy-950 bg-mesh flex flex-col">
      <header className="px-6 lg:px-12 py-5 flex items-center justify-between animate-fade-in">
        <Logo size="md" />
        <div className="hidden sm:flex items-center gap-2 text-sm text-navy-300">
          <Shield className="w-4 h-4 text-brand-400" />
          <span>Anti-Scam Awareness Platform</span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Hero */}
          <div className="hidden lg:flex flex-col space-y-8 animate-fade-in-up">
            <div>
              <h1 className="text-5xl xl:text-6xl font-extrabold tracking-tight text-white leading-[1.05]">
                Stay Alert.<br />
                Stay <span className="text-gradient">Wise.</span><br />
                Stay Safe.
              </h1>
              <p className="mt-6 text-lg text-navy-200 leading-relaxed max-w-md">
                Identify warning signs, understand online risks, and make safer digital decisions with AlegadoWise.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              {[
                'Analyze suspicious messages instantly',
                'Check links for risky URL patterns',
                'Learn to recognize common scams',
                'Take the Scam Awareness Quiz',
              ].map(item => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success-400 flex-shrink-0" />
                  <span className="text-navy-200">{item}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 pt-2">
              <div className="flex -space-x-2">
                {['bg-brand-500', 'bg-accent-500', 'bg-success-500', 'bg-warning-500'].map((c, i) => (
                  <div key={i} className={`w-8 h-8 rounded-full ${c} border-2 border-navy-900`} />
                ))}
              </div>
              <p className="text-sm text-navy-300">Join thousands of young people staying scam-aware.</p>
            </div>
          </div>

          {/* Right: Auth Form */}
          <div className="w-full max-w-md mx-auto lg:mx-0 animate-fade-in-up animate-delay-100">
            <div className="glass rounded-2xl border border-navy-700/30 shadow-card overflow-hidden">
              {/* Tabs */}
              <div className="flex border-b border-navy-700/30">
                <button
                  onClick={() => setTab('login')}
                  className={`flex-1 py-4 text-sm font-semibold transition-all ${tab === 'login' ? 'text-white border-b-2 border-brand-400 bg-brand-500/5' : 'text-navy-400 hover:text-navy-200'}`}
                >
                  Log In
                </button>
                <button
                  onClick={() => setTab('signup')}
                  className={`flex-1 py-4 text-sm font-semibold transition-all ${tab === 'signup' ? 'text-white border-b-2 border-brand-400 bg-brand-500/5' : 'text-navy-400 hover:text-navy-200'}`}
                >
                  Create Account
                </button>
              </div>

              <div className="p-6 lg:p-8">
                {tab === 'login' ? (
                  <LoginForm onSwitchToSignup={() => setTab('signup')} />
                ) : (
                  <SignUpForm onSwitchToLogin={() => setTab('login')} />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="px-6 lg:px-12 py-5 border-t border-navy-800/50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-navy-400">AlegadoWise identifies potential warning signs. It cannot guarantee something is legitimate or fraudulent.</p>
          <p className="text-xs text-navy-400">© 2026 AlegadoWise. Educational use only.</p>
        </div>
      </footer>
    </div>
  );
}

function LoginForm({ onSwitchToSignup }: { onSwitchToSignup: () => void }) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setLoading(true);
    setError(null);
    const { error } = await signIn(email.trim(), password);
    if (error) setError(error);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h2 className="text-xl font-extrabold text-white">Welcome back</h2>
        <p className="text-sm text-navy-300 mt-1">Sign in to your AlegadoWise account.</p>
      </div>

      {error && (
        <div className="flex items-start gap-2.5 rounded-xl bg-danger-500/10 border border-danger-500/30 px-4 py-3 animate-scale-in">
          <AlertCircle className="w-4 h-4 text-danger-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-danger-300">{error}</p>
        </div>
      )}

      <FormField
        icon={Mail}
        label="Email Address"
        type="email"
        value={email}
        onChange={setEmail}
        placeholder="you@example.com"
        autoComplete="email"
      />

      <FormField
        icon={Lock}
        label="Password"
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={setPassword}
        placeholder="Your password"
        autoComplete="current-password"
        rightIcon={
          <button type="button" onClick={() => setShowPassword(v => !v)} className="text-navy-400 hover:text-navy-200 transition-colors" aria-label={showPassword ? 'Hide password' : 'Show password'}>
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        }
      />

      <div className="flex justify-end">
        <button type="button" className="text-xs text-brand-300 hover:text-brand-200 transition-colors">
          Forgot Password?
        </button>
      </div>

      <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full" disabled={!email.trim() || !password}>
        Log In <ArrowRight className="w-4 h-4" />
      </Button>

      <p className="text-center text-sm text-navy-400">
        Don't have an account?{' '}
        <button type="button" onClick={onSwitchToSignup} className="text-brand-300 font-semibold hover:text-brand-200 transition-colors">
          Create one
        </button>
      </p>
    </form>
  );
}

function SignUpForm({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !password) return;
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    setError(null);
    const { error } = await signUp(email.trim(), password, fullName.trim());
    if (error) {
      setError(error);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="text-center space-y-4 py-4 animate-scale-in">
        <div className="w-16 h-16 rounded-2xl bg-success-500/15 border border-success-500/30 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8 text-success-400" />
        </div>
        <h3 className="text-lg font-bold text-white">Account Created!</h3>
        <p className="text-sm text-navy-300">Your AlegadoWise account is ready. You can now log in.</p>
        <Button variant="primary" size="md" onClick={onSwitchToLogin} className="w-full">
          Go to Login <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h2 className="text-xl font-extrabold text-white">Create your account</h2>
        <p className="text-sm text-navy-300 mt-1">Join AlegadoWise and start staying scam-aware.</p>
      </div>

      {error && (
        <div className="flex items-start gap-2.5 rounded-xl bg-danger-500/10 border border-danger-500/30 px-4 py-3 animate-scale-in">
          <AlertCircle className="w-4 h-4 text-danger-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-danger-300">{error}</p>
        </div>
      )}

      <FormField icon={User} label="Full Name" type="text" value={fullName} onChange={setFullName} placeholder="Your full name" autoComplete="name" />
      <FormField icon={Mail} label="Email Address" type="email" value={email} onChange={setEmail} placeholder="you@example.com" autoComplete="email" />
      <FormField
        icon={Lock}
        label="Password"
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={setPassword}
        placeholder="At least 6 characters"
        autoComplete="new-password"
        rightIcon={
          <button type="button" onClick={() => setShowPassword(v => !v)} className="text-navy-400 hover:text-navy-200 transition-colors" aria-label={showPassword ? 'Hide password' : 'Show password'}>
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        }
      />
      <FormField
        icon={Lock}
        label="Confirm Password"
        type={showConfirm ? 'text' : 'password'}
        value={confirmPassword}
        onChange={setConfirmPassword}
        placeholder="Repeat your password"
        autoComplete="new-password"
        rightIcon={
          <button type="button" onClick={() => setShowConfirm(v => !v)} className="text-navy-400 hover:text-navy-200 transition-colors" aria-label={showConfirm ? 'Hide password' : 'Show password'}>
            {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        }
      />

      <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full" disabled={!fullName.trim() || !email.trim() || !password || !confirmPassword}>
        Create Account <ArrowRight className="w-4 h-4" />
      </Button>

      <p className="text-center text-sm text-navy-400">
        Already have an account?{' '}
        <button type="button" onClick={onSwitchToLogin} className="text-brand-300 font-semibold hover:text-brand-200 transition-colors">
          Log in
        </button>
      </p>
    </form>
  );
}

function FormField({
  icon: Icon,
  label,
  type,
  value,
  onChange,
  placeholder,
  autoComplete,
  rightIcon,
}: {
  icon: typeof Mail;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
  rightIcon?: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-navy-200 mb-1.5">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="w-full rounded-xl bg-navy-900/50 border border-navy-700/40 pl-10 pr-10 py-3 text-sm text-white placeholder:text-navy-500 focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/20 transition-all"
        />
        {rightIcon && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
            {rightIcon}
          </div>
        )}
      </div>
    </div>
  );
}
