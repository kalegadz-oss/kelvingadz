import Card from '@/components/Card';
import Button from '@/components/Button';
import RiskBadge from '@/components/RiskBadge';
import { AnalyzingState } from '@/components/LoadingStates';
import {
  ScanLine, MessageSquareWarning, Link2, ShoppingCart, Briefcase, Gift,
  Brain, ShieldCheck, AlertTriangle, TrendingUp, Target, ArrowRight, ChevronRight,
} from 'lucide-react';
import type { PageId } from '@/App';
import { SAMPLE_SCAN_HISTORY } from '@/data';
import type { ScanRecord } from '@/types';

interface DashboardPageProps {
  onNavigate: (page: PageId) => void;
  stats: { scans: number; warnings: number; quizScore: number; safetyLevel: string };
}

const featureCards: { page: PageId; title: string; desc: string; icon: typeof ScanLine; color: string }[] = [
  { page: 'message', title: 'Message Analyzer', desc: 'Analyze suspicious messages and identify common warning signs.', icon: MessageSquareWarning, color: 'brand' },
  { page: 'link', title: 'Link Checker', desc: 'Review suspicious links and identify potentially risky URL patterns.', icon: Link2, color: 'accent' },
  { page: 'shopping', title: 'ShopSafe', desc: 'Check online shopping situations for common risk indicators.', icon: ShoppingCart, color: 'warning' },
  { page: 'job', title: 'JobGuard', desc: 'Review online job offers for suspicious conditions.', icon: Briefcase, color: 'success' },
  { page: 'prize', title: 'PrizeCheck', desc: 'Check giveaway and prize claims for common warning signs.', icon: Gift, color: 'danger' },
  { page: 'quiz', title: 'Scam Awareness Quiz', desc: 'Test your ability to recognize scam situations.', icon: Brain, color: 'brand' },
];

function StatCard({ icon: Icon, label, value, sublabel, color }: { icon: typeof ScanLine; label: string; value: string | number; sublabel?: string; color: string }) {
  return (
    <Card className="p-5 animate-fade-in-up">
      <div className="flex items-start justify-between">
        <div className={`w-11 h-11 rounded-xl bg-${color}-500/15 border border-${color}-500/30 flex items-center justify-center`}>
          <Icon className={`w-5.5 h-5.5 text-${color}-400`} />
        </div>
        {sublabel && <span className={`text-xs font-semibold text-${color}-400`}>{sublabel}</span>}
      </div>
      <p className="text-3xl font-extrabold text-white mt-4">{value}</p>
      <p className="text-sm text-navy-300 mt-1">{label}</p>
    </Card>
  );
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' · ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export default function DashboardPage({ onNavigate, stats }: DashboardPageProps) {
  const recentScans = SAMPLE_SCAN_HISTORY.slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-extrabold text-white">Good day! Stay alert online.</h1>
        <p className="text-navy-300 mt-2">Use ScamWise to check suspicious messages, links, offers, and online situations.</p>
      </div>

      <Card glass className="overflow-hidden animate-fade-in-up animate-delay-100">
        <div className="relative p-6 lg:p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 via-transparent to-accent-500/5" />
          <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <ScanLine className="w-5 h-5 text-brand-300" />
                <span className="text-sm font-bold text-brand-300 tracking-wide uppercase">Quick Scan</span>
              </div>
              <h2 className="text-2xl font-extrabold text-white">Have something suspicious?</h2>
              <p className="text-navy-300 mt-2 max-w-lg">Paste a message, offer, or suspicious content and check for warning signs.</p>
            </div>
            <Button variant="primary" size="lg" onClick={() => onNavigate('message')} className="w-full lg:w-auto">
              Analyze Now <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={ScanLine} label="Scans Completed" value={stats.scans} color="brand" />
        <StatCard icon={AlertTriangle} label="Warning Signs" value={stats.warnings} sublabel="Detected" color="warning" />
        <StatCard icon={Target} label="Quiz Score" value={`${stats.quizScore}%`} color="accent" />
        <StatCard icon={ShieldCheck} label="Safety Level" value={stats.safetyLevel} color="success" />
      </div>

      <div className="animate-fade-in-up animate-delay-200">
        <h2 className="text-xl font-bold text-white mb-4">What can you check?</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featureCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <Card key={card.page} hover className="p-5 group cursor-pointer animate-fade-in-up" onClick={() => onNavigate(card.page)} style={{ animationDelay: `${0.1 + i * 0.05}s` }}>
                <div className={`w-12 h-12 rounded-xl bg-${card.color}-500/15 border border-${card.color}-500/30 flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                  <Icon className={`w-6 h-6 text-${card.color}-400`} />
                </div>
                <h3 className="text-base font-bold text-white">{card.title}</h3>
                <p className="text-sm text-navy-300 mt-1.5 leading-relaxed">{card.desc}</p>
                <div className="flex items-center gap-1.5 mt-4 text-sm font-semibold text-brand-300 group-hover:gap-2.5 transition-all">
                  Open Tool <ChevronRight className="w-4 h-4" />
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="animate-fade-in-up animate-delay-300">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Recent Activity</h2>
          <Button variant="ghost" size="sm" onClick={() => onNavigate('reports')}>View All <ChevronRight className="w-4 h-4" /></Button>
        </div>
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-navy-700/30">
                  <th className="text-left px-5 py-3 font-semibold text-navy-400 text-xs uppercase tracking-wide">Type</th>
                  <th className="text-left px-5 py-3 font-semibold text-navy-400 text-xs uppercase tracking-wide">Date</th>
                  <th className="text-left px-5 py-3 font-semibold text-navy-400 text-xs uppercase tracking-wide hidden sm:table-cell">Warning Signs</th>
                  <th className="text-left px-5 py-3 font-semibold text-navy-400 text-xs uppercase tracking-wide">Risk Level</th>
                  <th className="text-right px-5 py-3 font-semibold text-navy-400 text-xs uppercase tracking-wide">View</th>
                </tr>
              </thead>
              <tbody>
                {recentScans.map((scan: ScanRecord) => (
                  <tr key={scan.id} className="border-b border-navy-800/30 last:border-0 hover:bg-navy-800/30 transition-colors cursor-pointer" onClick={() => onNavigate('reports')}>
                    <td className="px-5 py-3.5">
                      <span className="font-medium text-white">{scan.typeLabel}</span>
                    </td>
                    <td className="px-5 py-3.5 text-navy-300">{formatDate(scan.date)}</td>
                    <td className="px-5 py-3.5 text-navy-200 hidden sm:table-cell">{scan.warningCount}</td>
                    <td className="px-5 py-3.5"><RiskBadge level={scan.riskLevel} size="sm" /></td>
                    <td className="px-5 py-3.5 text-right">
                      <ChevronRight className="w-4 h-4 text-navy-400 inline-block" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
