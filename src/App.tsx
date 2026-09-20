import { useCallback } from 'react';
import Logo from '@/components/Logo';
import Button from '@/components/Button';
import { ToastContainer, type ToastData, type ToastType } from '@/components/Toast';
import { useState } from 'react';
import {
  LayoutDashboard, MessageSquareWarning, Link2, ShoppingCart, Briefcase, Gift,
  Brain, BookOpen, ClipboardList, Settings, HelpCircle, LogOut, Menu, X, User,
} from 'lucide-react';

import { AuthProvider, useAuth } from '@/context/AuthContext';
import AuthPage from '@/pages/AuthPage';
import DashboardPage from '@/pages/DashboardPage';
import MessageAnalyzerPage from '@/pages/MessageAnalyzerPage';
import LinkCheckerPage from '@/pages/LinkCheckerPage';
import ShopSafePage from '@/pages/ShopSafePage';
import JobGuardPage from '@/pages/JobGuardPage';
import PrizeCheckPage from '@/pages/PrizeCheckPage';
import QuizPage from '@/pages/QuizPage';
import LearningCenterPage from '@/pages/LearningCenterPage';
import ReportsPage from '@/pages/ReportsPage';
import SettingsPage from '@/pages/SettingsPage';

export type PageId =
  | 'dashboard' | 'message' | 'link' | 'shopping' | 'job' | 'prize'
  | 'quiz' | 'learning' | 'reports' | 'settings';

interface NavItem {
  id: PageId;
  label: string;
  icon: typeof LayoutDashboard;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'message', label: 'Message Analyzer', icon: MessageSquareWarning },
  { id: 'link', label: 'Link Checker', icon: Link2 },
  { id: 'shopping', label: 'ShopSafe', icon: ShoppingCart },
  { id: 'job', label: 'JobGuard', icon: Briefcase },
  { id: 'prize', label: 'PrizeCheck', icon: Gift },
  { id: 'quiz', label: 'Scam Awareness Quiz', icon: Brain },
  { id: 'learning', label: 'Learning Center', icon: BookOpen },
  { id: 'reports', label: 'Reports / History', icon: ClipboardList },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}

function AppInner() {
  const { user, profile, loading, signOut } = useAuth();
  const [currentPage, setCurrentPage] = useState<PageId>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback((type: ToastType, message: string) => {
    setToasts(prev => [...prev, { id: Date.now() + Math.random(), type, message }]);
  }, []);

  const closeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const handleNavigate = useCallback((page: PageId) => {
    setCurrentPage(page);
    setSidebarOpen(false);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleLogout = useCallback(async () => {
    await signOut();
    setSidebarOpen(false);
    setCurrentPage('dashboard');
    addToast('info', 'You have been logged out. Stay safe!');
  }, [signOut, addToast]);

  // Show loading spinner while session is being resolved
  if (loading) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-2 border-navy-700" />
            <div className="absolute inset-0 rounded-full border-2 border-brand-400 border-t-transparent animate-spin-slow" />
          </div>
          <Logo size="sm" />
        </div>
      </div>
    );
  }

  // Not logged in → show auth page
  if (!user) {
    return (
      <>
        <AuthPage />
        <ToastContainer toasts={toasts} onClose={closeToast} />
      </>
    );
  }

  const displayName = profile?.full_name || profile?.email || user.email || 'User';
  const initials = displayName
    .split(' ')
    .map((p: string) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <DashboardPage onNavigate={handleNavigate} stats={{ scans: 24, warnings: 17, quizScore: 86, safetyLevel: 'Good' }} />;
      case 'message': return <MessageAnalyzerPage />;
      case 'link': return <LinkCheckerPage />;
      case 'shopping': return <ShopSafePage />;
      case 'job': return <JobGuardPage />;
      case 'prize': return <PrizeCheckPage />;
      case 'quiz': return <QuizPage onNavigate={handleNavigate} />;
      case 'learning': return <LearningCenterPage />;
      case 'reports': return <ReportsPage />;
      case 'settings': return <SettingsPage onLogout={handleLogout} />;
      default: return <DashboardPage onNavigate={handleNavigate} stats={{ scans: 24, warnings: 17, quizScore: 86, safetyLevel: 'Good' }} />;
    }
  };

  const currentPageLabel = NAV_ITEMS.find(n => n.id === currentPage)?.label || 'Dashboard';

  const SidebarBottom = () => (
    <div className="border-t border-navy-800/40 p-3 space-y-1">
      <button onClick={() => { handleNavigate('settings'); setSidebarOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-navy-300 hover:text-white hover:bg-navy-800/40 transition-all">
        <User className="w-5 h-5" /> Profile
      </button>
      <button onClick={() => { addToast('info', 'Help & Support: Visit the Learning Center for guidance.'); setSidebarOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-navy-300 hover:text-white hover:bg-navy-800/40 transition-all">
        <HelpCircle className="w-5 h-5" /> Help
      </button>
      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-danger-400 hover:bg-danger-500/10 transition-all">
        <LogOut className="w-5 h-5" /> Logout
      </button>
    </div>
  );

  const NavLinks = () => (
    <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
      {NAV_ITEMS.map(item => {
        const Icon = item.icon;
        const active = currentPage === item.id;
        return (
          <button
            key={item.id}
            onClick={() => handleNavigate(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              active
                ? 'bg-brand-500/15 border border-brand-500/30 text-brand-300 shadow-glow'
                : 'text-navy-300 hover:text-white hover:bg-navy-800/40 border border-transparent'
            }`}
          >
            <Icon className={`w-5 h-5 ${active ? 'text-brand-400' : ''}`} />
            {item.label}
          </button>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-navy-950 bg-mesh flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 flex-shrink-0 border-r border-navy-800/40 glass-strong sticky top-0 h-screen">
        <div className="p-5 border-b border-navy-800/40">
          <Logo size="sm" />
        </div>
        <NavLinks />
        <SidebarBottom />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 animate-fade-in" onClick={() => setSidebarOpen(false)}>
          <div className="absolute inset-0 bg-navy-950/80 backdrop-blur-sm" />
          <aside className="absolute left-0 top-0 bottom-0 w-72 glass-strong border-r border-navy-800/40 flex flex-col animate-slide-in" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-navy-800/40 flex items-center justify-between">
              <Logo size="sm" />
              <button onClick={() => setSidebarOpen(false)} className="text-navy-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <NavLinks />
            <SidebarBottom />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile Top Bar */}
        <header className="lg:hidden sticky top-0 z-30 glass-strong border-b border-navy-800/40 px-4 py-3 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="text-navy-200 hover:text-white p-1">
            <Menu className="w-6 h-6" />
          </button>
          <Logo size="sm" showText={false} />
          <button onClick={() => handleNavigate('settings')} className="text-navy-200 hover:text-white p-1">
            <User className="w-5 h-5" />
          </button>
        </header>

        {/* Desktop Top Bar */}
        <header className="hidden lg:flex sticky top-0 z-30 glass border-b border-navy-800/40 px-8 py-3.5 items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-white">{currentPageLabel}</h2>
            <p className="text-xs text-navy-400">AlegadoWise — Stay Alert. Stay Wise. Stay Safe.</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => addToast('info', 'Help: Visit the Learning Center for guidance.')} className="text-navy-300 hover:text-white p-1.5 rounded-lg hover:bg-navy-800/40 transition-all">
              <HelpCircle className="w-5 h-5" />
            </button>
            <button onClick={() => handleNavigate('settings')} className="flex items-center gap-2.5 rounded-xl bg-navy-800/40 border border-navy-700/30 px-3 py-1.5 hover:border-navy-600/50 transition-all">
              <div className="w-7 h-7 rounded-lg overflow-hidden flex-shrink-0">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center text-white text-xs font-bold">
                    {initials}
                  </div>
                )}
              </div>
              <span className="text-sm font-medium text-white max-w-[120px] truncate">{displayName}</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main key={currentPage} className="flex-1 p-4 sm:p-6 lg:p-8 animate-fade-in">
          {renderPage()}
        </main>
      </div>

      <ToastContainer toasts={toasts} onClose={closeToast} />
    </div>
  );
}
