import { useState, useRef, useEffect } from 'react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { useAuth } from '@/context/AuthContext';
import {
  User, Settings, Bell, Globe, Moon, Lock, LogOut, Mail, AtSign, Phone,
  ChevronRight, Eye, EyeOff, CheckCircle2, AlertCircle, Camera, Pencil, X,
} from 'lucide-react';

interface SettingsPageProps {
  onLogout: () => void;
}

export default function SettingsPage({ onLogout }: SettingsPageProps) {
  const { profile, updateProfile, changePassword } = useAuth();
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('English');
  const [passwordOpen, setPasswordOpen] = useState(false);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="animate-fade-in-up">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-navy-700/40 border border-navy-600/30 flex items-center justify-center">
            <Settings className="w-5 h-5 text-navy-200" />
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white">Settings</h1>
        </div>
        <p className="text-navy-300">Manage your profile and preferences.</p>
      </div>

      {/* Profile Section */}
      <ProfileSection profile={profile} updateProfile={updateProfile} />

      {/* Preferences */}
      <Card className="p-6 animate-fade-in-up animate-delay-200">
        <h3 className="text-base font-bold text-white mb-4">Preferences</h3>
        <div className="grid gap-1">
          <ToggleRow icon={Moon} label="Dark Mode" description="Use dark theme across the app" value={darkMode} onChange={setDarkMode} />
          <ToggleRow icon={Bell} label="Notifications" description="Get alerts about new scam patterns" value={notifications} onChange={setNotifications} />
          <div className="flex items-center justify-between rounded-lg px-4 py-3.5 hover:bg-navy-800/30 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-navy-700/40 flex items-center justify-center">
                <Globe className="w-4 h-4 text-navy-200" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Language</p>
                <p className="text-xs text-navy-400">Choose your preferred language</p>
              </div>
            </div>
            <select
              value={language}
              onChange={e => setLanguage(e.target.value)}
              className="rounded-lg bg-navy-900/50 border border-navy-700/40 px-3 py-2 text-sm text-white focus:border-brand-500/50 transition-all"
            >
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Security */}
      <Card className="p-6 animate-fade-in-up animate-delay-300">
        <h3 className="text-base font-bold text-white mb-4">Security</h3>
        <div className="grid gap-1">
          <button
            onClick={() => setPasswordOpen(v => !v)}
            className="w-full flex items-center justify-between rounded-lg px-4 py-3.5 hover:bg-navy-800/30 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-navy-700/40 flex items-center justify-center">
                <Lock className="w-4 h-4 text-navy-200" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Change Password</p>
                <p className="text-xs text-navy-400">Update your account password</p>
              </div>
            </div>
            <ChevronRight className={`w-4 h-4 text-navy-500 transition-transform ${passwordOpen ? 'rotate-90' : ''}`} />
          </button>

          {passwordOpen && (
            <div className="mt-2 animate-fade-in-up">
              <ChangePasswordForm onClose={() => setPasswordOpen(false)} changePassword={changePassword} />
            </div>
          )}
        </div>
      </Card>

      {/* Account */}
      <Card className="p-6 animate-fade-in-up animate-delay-300">
        <h3 className="text-base font-bold text-white mb-4">Account</h3>
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-between rounded-lg px-4 py-3.5 hover:bg-danger-500/10 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-danger-500/15 flex items-center justify-center">
              <LogOut className="w-4 h-4 text-danger-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-danger-400">Log Out</p>
              <p className="text-xs text-navy-400">Sign out of your account</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-navy-500" />
        </button>
      </Card>
    </div>
  );
}

// ─── Profile Section ─────────────────────────────────────────────────────────

function ProfileSection({ profile, updateProfile }: {
  profile: ReturnType<typeof useAuth>['profile'];
  updateProfile: ReturnType<typeof useAuth>['updateProfile'];
}) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    full_name: '',
    username: '',
    email: '',
    phone: '',
    avatar_url: '',
  });

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name ?? '',
        username: profile.username ?? '',
        email: profile.email ?? '',
        phone: profile.phone ?? '',
        avatar_url: profile.avatar_url ?? '',
      });
    }
  }, [profile]);

  const initials = (form.full_name || form.email || 'U')
    .split(' ')
    .map(p => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError('Image must be under 2 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = ev => {
      setForm(f => ({ ...f, avatar_url: ev.target?.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!form.full_name.trim()) {
      setError('Full name is required.');
      return;
    }
    setSaving(true);
    setError(null);
    const { error } = await updateProfile({
      full_name: form.full_name.trim(),
      username: form.username.trim() || null,
      phone: form.phone.trim() || null,
      avatar_url: form.avatar_url || null,
    });
    setSaving(false);
    if (error) {
      setError(error);
    } else {
      setSuccess(true);
      setEditing(false);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setForm({
        full_name: profile.full_name ?? '',
        username: profile.username ?? '',
        email: profile.email ?? '',
        phone: profile.phone ?? '',
        avatar_url: profile.avatar_url ?? '',
      });
    }
    setEditing(false);
    setError(null);
  };

  return (
    <Card className="p-6 animate-fade-in-up animate-delay-100">
      {success && (
        <div className="flex items-center gap-2.5 rounded-xl bg-success-500/10 border border-success-500/30 px-4 py-3 mb-5 animate-scale-in">
          <CheckCircle2 className="w-4 h-4 text-success-400 flex-shrink-0" />
          <p className="text-sm text-success-300 font-medium">Profile updated successfully.</p>
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2.5 rounded-xl bg-danger-500/10 border border-danger-500/30 px-4 py-3 mb-5 animate-scale-in">
          <AlertCircle className="w-4 h-4 text-danger-400 flex-shrink-0" />
          <p className="text-sm text-danger-300">{error}</p>
        </div>
      )}

      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl overflow-hidden">
              {form.avatar_url ? (
                <img src={form.avatar_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white text-xl font-extrabold">
                  {initials}
                </div>
              )}
            </div>
            {editing && (
              <>
                <button
                  onClick={() => fileRef.current?.click()}
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg bg-brand-500 border-2 border-navy-900 flex items-center justify-center hover:bg-brand-400 transition-colors"
                  aria-label="Change profile picture"
                >
                  <Camera className="w-3.5 h-3.5 text-white" />
                </button>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
              </>
            )}
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{form.full_name || 'Your Name'}</h2>
            <p className="text-sm text-navy-300">{form.username ? `@${form.username}` : form.email}</p>
          </div>
        </div>
        {!editing && (
          <Button variant="secondary" size="sm" onClick={() => setEditing(true)}>
            <Pencil className="w-4 h-4" /> Edit Profile
          </Button>
        )}
      </div>

      {editing ? (
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <EditField icon={User} label="Full Name" value={form.full_name} onChange={v => setForm(f => ({ ...f, full_name: v }))} placeholder="Your full name" required />
            <EditField icon={AtSign} label="Username" value={form.username} onChange={v => setForm(f => ({ ...f, username: v }))} placeholder="your.username" />
            <EditField icon={Mail} label="Email Address" value={form.email} onChange={() => {}} placeholder="" disabled helpText="Email cannot be changed here." />
            <EditField icon={Phone} label="Phone Number" value={form.phone} onChange={v => setForm(f => ({ ...f, phone: v }))} placeholder="+1 234 567 8900" />
          </div>
          <div className="flex items-center gap-3 pt-2">
            <Button variant="primary" size="md" onClick={handleSave} loading={saving}>
              Save Changes
            </Button>
            <Button variant="ghost" size="md" onClick={handleCancel}>
              <X className="w-4 h-4" /> Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          <DisplayField icon={User} label="Full Name" value={form.full_name || '—'} />
          <DisplayField icon={AtSign} label="Username" value={form.username ? `@${form.username}` : '—'} />
          <DisplayField icon={Mail} label="Email" value={form.email} />
          <DisplayField icon={Phone} label="Phone" value={form.phone || '—'} />
        </div>
      )}
    </Card>
  );
}

// ─── Change Password Form ─────────────────────────────────────────────────────

function ChangePasswordForm({
  onClose,
  changePassword,
}: {
  onClose: () => void;
  changePassword: ReturnType<typeof useAuth>['changePassword'];
}) {
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!currentPw || !newPw || !confirmPw) {
      setError('All fields are required.');
      return;
    }
    if (newPw.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }
    if (newPw !== confirmPw) {
      setError('New passwords do not match.');
      return;
    }
    setLoading(true);
    const { error } = await changePassword(currentPw, newPw);
    setLoading(false);
    if (error) {
      setError(error);
    } else {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <div className="rounded-xl bg-success-500/10 border border-success-500/30 p-5 flex items-start gap-3 animate-scale-in">
        <CheckCircle2 className="w-5 h-5 text-success-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-success-300">Password changed successfully.</p>
          <p className="text-xs text-navy-400 mt-1">Your new password is now active.</p>
        </div>
        <button onClick={onClose} className="text-navy-400 hover:text-white transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl bg-navy-800/20 border border-navy-700/20 p-5 space-y-4">
      {error && (
        <div className="flex items-start gap-2.5 rounded-lg bg-danger-500/10 border border-danger-500/30 px-4 py-3 animate-scale-in">
          <AlertCircle className="w-4 h-4 text-danger-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-danger-300">{error}</p>
        </div>
      )}
      <PasswordField label="Current Password" value={currentPw} onChange={setCurrentPw} show={showCurrent} onToggle={() => setShowCurrent(v => !v)} autoComplete="current-password" />
      <PasswordField label="New Password" value={newPw} onChange={setNewPw} show={showNew} onToggle={() => setShowNew(v => !v)} autoComplete="new-password" />
      <PasswordField label="Confirm New Password" value={confirmPw} onChange={setConfirmPw} show={showConfirm} onToggle={() => setShowConfirm(v => !v)} autoComplete="new-password" />
      <div className="flex items-center gap-3">
        <Button type="submit" variant="primary" size="md" loading={loading}>
          Change Password
        </Button>
        <Button type="button" variant="ghost" size="md" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

// ─── Helper sub-components ───────────────────────────────────────────────────

function PasswordField({ label, value, onChange, show, onToggle, autoComplete }: {
  label: string; value: string; onChange: (v: string) => void;
  show: boolean; onToggle: () => void; autoComplete?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-navy-200 mb-1.5">{label}</label>
      <div className="relative">
        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={e => onChange(e.target.value)}
          autoComplete={autoComplete}
          className="w-full rounded-lg bg-navy-900/50 border border-navy-700/40 pl-10 pr-10 py-2.5 text-sm text-white placeholder:text-navy-500 focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/20 transition-all"
        />
        <button type="button" onClick={onToggle} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-navy-400 hover:text-navy-200 transition-colors" aria-label={show ? 'Hide' : 'Show'}>
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

function EditField({ icon: Icon, label, value, onChange, placeholder, disabled, helpText, required }: {
  icon: typeof User; label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; disabled?: boolean; helpText?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-navy-200 mb-1.5">
        {label}{required && <span className="text-danger-400 ml-1">*</span>}
      </label>
      <div className="relative">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full rounded-lg bg-navy-900/50 border border-navy-700/40 pl-10 pr-3.5 py-2.5 text-sm text-white placeholder:text-navy-500 focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>
      {helpText && <p className="text-xs text-navy-500 mt-1">{helpText}</p>}
    </div>
  );
}

function DisplayField({ icon: Icon, label, value }: { icon: typeof User; label: string; value: string }) {
  return (
    <div className="rounded-lg bg-navy-800/30 border border-navy-700/20 px-4 py-3">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-3.5 h-3.5 text-navy-400" />
        <span className="text-xs text-navy-400 font-medium">{label}</span>
      </div>
      <p className="text-sm text-white font-medium">{value}</p>
    </div>
  );
}

function ToggleRow({ icon: Icon, label, description, value, onChange }: {
  icon: typeof Moon; label: string; description: string; value: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg px-4 py-3.5 hover:bg-navy-800/30 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-navy-700/40 flex items-center justify-center">
          <Icon className="w-4 h-4 text-navy-200" />
        </div>
        <div>
          <p className="text-sm font-medium text-white">{label}</p>
          <p className="text-xs text-navy-400">{description}</p>
        </div>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-11 h-6 rounded-full transition-all ${value ? 'bg-brand-500' : 'bg-navy-700'}`}
        role="switch"
        aria-checked={value}
      >
        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${value ? 'left-[22px]' : 'left-0.5'}`} />
      </button>
    </div>
  );
}
