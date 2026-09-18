import { useState } from 'react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { User, Settings, Bell, Globe, Moon, Lock, LogOut, Mail, AtSign, ChevronRight } from 'lucide-react';

interface SettingsPageProps {
  onLogout: () => void;
}

export default function SettingsPage({ onLogout }: SettingsPageProps) {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('English');

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

      <Card className="p-6 animate-fade-in-up animate-delay-100">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white text-xl font-extrabold">
            JD
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Jordan Doe</h2>
            <p className="text-sm text-navy-300">@jordan.doe</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <ProfileField icon={User} label="Name" value="Jordan Doe" />
          <ProfileField icon={AtSign} label="Username" value="jordan.doe" />
          <ProfileField icon={Mail} label="Email" value="jordan.doe@example.com" />
        </div>
      </Card>

      <Card className="p-6 animate-fade-in-up animate-delay-200">
        <h3 className="text-base font-bold text-white mb-4">Preferences</h3>
        <div className="grid gap-1">
          <ToggleRow icon={Moon} label="Dark Mode" description="Use dark theme across the app" value={darkMode} onChange={setDarkMode} />
          <ToggleRow icon={Bell} label="Notifications" description="Get alerts about new scam patterns" value={notifications} onChange={setNotifications} />
          <div className="flex items-center justify-between rounded-lg px-4 py-3.5 hover:bg-navy-800/30 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-navy-700/40 flex items-center justify-center">
                <Globe className="w-4.5 h-4.5 text-navy-200" />
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

      <Card className="p-6 animate-fade-in-up animate-delay-300">
        <h3 className="text-base font-bold text-white mb-4">Security</h3>
        <div className="grid gap-1">
          <ActionRow icon={Lock} label="Change Password" description="Update your account password" />
          <ActionRow icon={LogOut} label="Log Out" description="Sign out of your account" danger onClick={onLogout} />
        </div>
      </Card>
    </div>
  );
}

function ProfileField({ icon: Icon, label, value }: { icon: typeof User; label: string; value: string }) {
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

function ToggleRow({ icon: Icon, label, description, value, onChange }: { icon: typeof Moon; label: string; description: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between rounded-lg px-4 py-3.5 hover:bg-navy-800/30 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-navy-700/40 flex items-center justify-center">
          <Icon className="w-4.5 h-4.5 text-navy-200" />
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

function ActionRow({ icon: Icon, label, description, danger, onClick }: { icon: typeof Lock; label: string; description: string; danger?: boolean; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center justify-between rounded-lg px-4 py-3.5 hover:bg-navy-800/30 transition-colors text-left">
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${danger ? 'bg-danger-500/15' : 'bg-navy-700/40'}`}>
          <Icon className={`w-4.5 h-4.5 ${danger ? 'text-danger-400' : 'text-navy-200'}`} />
        </div>
        <div>
          <p className={`text-sm font-medium ${danger ? 'text-danger-400' : 'text-white'}`}>{label}</p>
          <p className="text-xs text-navy-400">{description}</p>
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-navy-500" />
    </button>
  );
}
