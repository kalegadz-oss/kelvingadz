import { useState, useMemo } from 'react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import RiskBadge from '@/components/RiskBadge';
import { EmptyState } from '@/components/WarningSignCard';
import { ClipboardList, Search, ChevronRight, X, AlertTriangle } from 'lucide-react';
import { SAMPLE_SCAN_HISTORY } from '@/data';
import type { ScanRecord, ToolType } from '@/types';

const FILTERS: { id: 'all' | ToolType; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'message', label: 'Messages' },
  { id: 'link', label: 'Links' },
  { id: 'shopping', label: 'Shopping' },
  { id: 'job', label: 'Jobs' },
  { id: 'prize', label: 'Prizes' },
];

type SortOption = 'date-desc' | 'date-asc' | 'risk-high' | 'risk-low';

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function ReportsPage() {
  const [filter, setFilter] = useState<'all' | ToolType>('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('date-desc');
  const [selectedRecord, setSelectedRecord] = useState<ScanRecord | null>(null);

  const filtered = useMemo(() => {
    let result = [...SAMPLE_SCAN_HISTORY];
    if (filter !== 'all') result = result.filter(r => r.type === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(r => r.inputSummary.toLowerCase().includes(q) || r.typeLabel.toLowerCase().includes(q));
    }
    const riskOrder = { high: 3, moderate: 2, low: 1 };
    result.sort((a, b) => {
      switch (sort) {
        case 'date-asc': return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'risk-high': return riskOrder[b.riskLevel] - riskOrder[a.riskLevel];
        case 'risk-low': return riskOrder[a.riskLevel] - riskOrder[b.riskLevel];
        default: return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });
    return result;
  }, [filter, search, sort]);

  return (
    <div className="space-y-6">
      <div className="animate-fade-in-up">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-brand-500/15 border border-brand-500/30 flex items-center justify-center">
            <ClipboardList className="w-5 h-5 text-brand-400" />
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-white">Reports / History</h1>
        </div>
        <p className="text-navy-300">View your previous analyses and scan history.</p>
      </div>

      <Card className="p-4 animate-fade-in-up animate-delay-100">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by type or content..."
              className="w-full rounded-lg bg-navy-900/50 border border-navy-700/40 pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-navy-500 focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/20 transition-all"
            />
          </div>
          <select
            value={sort}
            onChange={e => setSort(e.target.value as SortOption)}
            className="rounded-lg bg-navy-900/50 border border-navy-700/40 px-4 py-2.5 text-sm text-white focus:border-brand-500/50 transition-all"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="risk-high">Highest Risk</option>
            <option value="risk-low">Lowest Risk</option>
          </select>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === f.id ? 'bg-brand-500/20 border border-brand-500/40 text-brand-300' : 'bg-navy-800/40 border border-navy-700/30 text-navy-300 hover:text-white hover:border-navy-600/50'}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </Card>

      {filtered.length === 0 ? (
        <Card className="p-6">
          <EmptyState
            icon={ClipboardList}
            title="No scans yet"
            description="Your previous analyses will appear here."
          />
        </Card>
      ) : (
        <>
          {/* Desktop table */}
          <Card className="overflow-hidden hidden md:block animate-fade-in-up animate-delay-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-navy-700/30">
                  <th className="text-left px-5 py-3 font-semibold text-navy-400 text-xs uppercase tracking-wide">Type</th>
                  <th className="text-left px-5 py-3 font-semibold text-navy-400 text-xs uppercase tracking-wide">Date</th>
                  <th className="text-left px-5 py-3 font-semibold text-navy-400 text-xs uppercase tracking-wide">Risk Indicator</th>
                  <th className="text-left px-5 py-3 font-semibold text-navy-400 text-xs uppercase tracking-wide">Warning Signs</th>
                  <th className="text-right px-5 py-3 font-semibold text-navy-400 text-xs uppercase tracking-wide">Details</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(scan => (
                  <tr key={scan.id} className="border-b border-navy-800/30 last:border-0 hover:bg-navy-800/30 transition-colors cursor-pointer" onClick={() => setSelectedRecord(scan)}>
                    <td className="px-5 py-4">
                      <span className="font-medium text-white">{scan.typeLabel}</span>
                      <p className="text-xs text-navy-400 mt-0.5 truncate max-w-[200px]">{scan.inputSummary}</p>
                    </td>
                    <td className="px-5 py-4 text-navy-300">{formatDate(scan.date)}</td>
                    <td className="px-5 py-4"><RiskBadge level={scan.riskLevel} size="sm" /></td>
                    <td className="px-5 py-4 text-navy-200">{scan.warningCount}</td>
                    <td className="px-5 py-4 text-right">
                      <ChevronRight className="w-4 h-4 text-navy-400 inline-block" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          {/* Mobile cards */}
          <div className="md:hidden grid gap-3 animate-fade-in-up animate-delay-200">
            {filtered.map(scan => (
              <Card key={scan.id} className="p-4 cursor-pointer" onClick={() => setSelectedRecord(scan)}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-white">{scan.typeLabel}</span>
                  <RiskBadge level={scan.riskLevel} size="sm" />
                </div>
                <p className="text-sm text-navy-300 mb-2">{scan.inputSummary}</p>
                <div className="flex items-center justify-between text-xs text-navy-400">
                  <span>{formatDate(scan.date)}</span>
                  <span>{scan.warningCount} warning signs</span>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Detail modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setSelectedRecord(null)}>
          <div className="absolute inset-0 bg-navy-950/80 backdrop-blur-sm" />
          <Card className="relative max-w-lg w-full p-6 animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Scan Details</h3>
              <button onClick={() => setSelectedRecord(null)} className="text-navy-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-navy-400">Type</span>
                <span className="text-sm font-medium text-white">{selectedRecord.typeLabel}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-navy-400">Date</span>
                <span className="text-sm font-medium text-white">{formatDate(selectedRecord.date)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-navy-400">Risk Level</span>
                <RiskBadge level={selectedRecord.riskLevel} size="sm" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-navy-400">Warning Signs</span>
                <span className="text-sm font-medium text-white">{selectedRecord.warningCount}</span>
              </div>
              <div>
                <span className="text-sm text-navy-400 block mb-1.5">Content</span>
                <div className="rounded-lg bg-navy-900/50 border border-navy-700/30 px-4 py-3">
                  <p className="text-sm text-navy-100">{selectedRecord.inputSummary}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 rounded-lg bg-navy-800/30 px-4 py-3">
                <AlertTriangle className="w-4 h-4 text-warning-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-navy-300">Risk indicator is based on detected warning signs and does not prove fraud. Always verify through official sources.</p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
