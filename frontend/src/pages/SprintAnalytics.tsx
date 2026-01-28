import { useState, useEffect, useMemo } from 'react';
import { api } from '../api/client';
import { useProject } from '../context/ProjectContext';
import { Card, CardContent } from '../components/ui/card';
import {
  BarChart3,
  CheckCircle2,
  Zap,
  TrendingUp,
  Clock,
  BookOpen,
  Plus,
  Minus,
  ArrowUpDown,
  Users,
  Trophy,
  Target,
  Activity,
  ChevronDown,
  Download,
  Printer,
} from 'lucide-react';
import type {
  SprintStatistics,
  BurndownData,
  SprintComparison,
  TeamPerformance,
  Sprint,
  Project,
} from '../types';

type Tab = 'overview' | 'compare' | 'changes' | 'team';

const TABS: { key: Tab; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'compare', label: 'Compare' },
  { key: 'changes', label: 'Changes' },
  { key: 'team', label: 'Team Performance' },
];

// ── SVG Burndown Chart ──────────────────────────────────────────────

function BurndownChart({ data }: { data: BurndownData }) {
  const padding = { top: 20, right: 20, bottom: 50, left: 50 };
  const width = 700;
  const height = 340;
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  const dates = data.dates ?? [];
  const actual = data.actual ?? [];
  const ideal = data.ideal ?? [];
  const maxPoints = Math.max(data.totalPoints ?? 0, ...actual, ...ideal, 1);

  const xScale = (i: number) =>
    padding.left + (dates.length > 1 ? (i / (dates.length - 1)) * innerW : 0);
  const yScale = (v: number) =>
    padding.top + innerH - (v / maxPoints) * innerH;

  const actualPath = actual
    .map((v, i) => `${i === 0 ? 'M' : 'L'}${xScale(i)},${yScale(v)}`)
    .join(' ');

  const actualArea =
    actualPath +
    ` L${xScale(actual.length - 1)},${yScale(0)} L${xScale(0)},${yScale(0)} Z`;

  const idealPath = ideal
    .map((v, i) => `${i === 0 ? 'M' : 'L'}${xScale(i)},${yScale(v)}`)
    .join(' ');

  // Y-axis ticks
  const yTicks = 5;
  const yTickValues = Array.from({ length: yTicks + 1 }, (_, i) =>
    Math.round((maxPoints / yTicks) * i)
  );

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
      {/* grid lines */}
      {yTickValues.map((v) => (
        <line
          key={v}
          x1={padding.left}
          x2={width - padding.right}
          y1={yScale(v)}
          y2={yScale(v)}
          stroke="#e5e7eb"
          strokeDasharray="4 2"
        />
      ))}

      {/* Y-axis labels */}
      {yTickValues.map((v) => (
        <text
          key={v}
          x={padding.left - 8}
          y={yScale(v) + 4}
          textAnchor="end"
          fontSize={11}
          fill="#6b7280"
        >
          {v}
        </text>
      ))}

      {/* X-axis labels */}
      {dates.map((d, i) => {
        if (dates.length > 10 && i % Math.ceil(dates.length / 8) !== 0 && i !== dates.length - 1)
          return null;
        const label = new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        return (
          <text
            key={d}
            x={xScale(i)}
            y={height - 8}
            textAnchor="middle"
            fontSize={10}
            fill="#6b7280"
          >
            {label}
          </text>
        );
      })}

      {/* Actual area fill */}
      {actual.length > 1 && (
        <path d={actualArea} fill="rgba(239,68,68,0.12)" />
      )}

      {/* Ideal line */}
      {ideal.length > 1 && (
        <path d={idealPath} fill="none" stroke="#a5b4fc" strokeWidth={2} strokeDasharray="6 3" />
      )}

      {/* Actual line */}
      {actual.length > 1 && (
        <path d={actualPath} fill="none" stroke="#ef4444" strokeWidth={2.5} />
      )}

      {/* Actual data dots */}
      {actual.map((v, i) => (
        <circle key={i} cx={xScale(i)} cy={yScale(v)} r={3} fill="#ef4444" />
      ))}

      {/* Legend */}
      <line x1={padding.left} y1={12} x2={padding.left + 24} y2={12} stroke="#a5b4fc" strokeWidth={2} strokeDasharray="6 3" />
      <text x={padding.left + 28} y={16} fontSize={11} fill="#6b7280">Ideal</text>
      <line x1={padding.left + 70} y1={12} x2={padding.left + 94} y2={12} stroke="#ef4444" strokeWidth={2.5} />
      <text x={padding.left + 98} y={16} fontSize={11} fill="#6b7280">Actual</text>
    </svg>
  );
}

// ── Velocity Bar Chart (SVG) ────────────────────────────────────────

function VelocityBarChart({ members }: { members: TeamPerformance['members'] }) {
  if (!members || members.length === 0) return null;
  const padding = { top: 20, right: 20, bottom: 40, left: 40 };
  const width = 600;
  const height = 260;
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;
  const maxVel = Math.max(...members.map((m) => m.velocity ?? 0), 1);
  const barWidth = Math.min(40, innerW / members.length - 8);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
      {members.map((m, i) => {
        const x =
          padding.left +
          (innerW / members.length) * i +
          (innerW / members.length - barWidth) / 2;
        const barH = ((m.velocity ?? 0) / maxVel) * innerH;
        const initials = (m.name ?? '')
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase();
        return (
          <g key={i}>
            <rect
              x={x}
              y={padding.top + innerH - barH}
              width={barWidth}
              height={barH}
              rx={4}
              fill="#6366f1"
              opacity={0.85}
            />
            <text
              x={x + barWidth / 2}
              y={padding.top + innerH - barH - 6}
              textAnchor="middle"
              fontSize={11}
              fill="#4f46e5"
              fontWeight={600}
            >
              {m.velocity}
            </text>
            <text
              x={x + barWidth / 2}
              y={height - 10}
              textAnchor="middle"
              fontSize={11}
              fill="#6b7280"
            >
              {initials}
            </text>
          </g>
        );
      })}
      {/* baseline */}
      <line
        x1={padding.left}
        x2={width - padding.right}
        y1={padding.top + innerH}
        y2={padding.top + innerH}
        stroke="#d1d5db"
        strokeWidth={1}
      />
    </svg>
  );
}

// ── Velocity Trend Chart (SVG) ─────────────────────────────────────

function VelocityTrendChart({ data, avg }: { data: { sprintName: string; velocity: number; totalPoints: number }[]; avg: number }) {
  if (!data || data.length === 0) return null;
  const padding = { top: 20, right: 20, bottom: 50, left: 50 };
  const width = 700;
  const height = 260;
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;
  const maxV = Math.max(...data.map(d => Math.max(d.velocity, d.totalPoints)), avg, 1);
  const barWidth = Math.min(50, innerW / data.length - 16);

  const yScale = (v: number) => padding.top + innerH - (v / maxV) * innerH;
  const avgY = yScale(avg);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
      {/* Avg line */}
      <line x1={padding.left} x2={width - padding.right} y1={avgY} y2={avgY} stroke="#a5b4fc" strokeWidth={1.5} strokeDasharray="6 3" />
      <text x={width - padding.right + 2} y={avgY - 4} fontSize={10} fill="#818cf8">Avg</text>

      {data.map((d, i) => {
        const cx = padding.left + (innerW / data.length) * i + (innerW / data.length) / 2;
        const totalH = (d.totalPoints / maxV) * innerH;
        const doneH = (d.velocity / maxV) * innerH;
        const label = d.sprintName.replace(/sprint\s*/i, 'S').substring(0, 12);
        return (
          <g key={i}>
            {/* Total points bar (light) */}
            <rect
              x={cx - barWidth / 2}
              y={padding.top + innerH - totalH}
              width={barWidth}
              height={totalH}
              rx={4}
              fill="#e0e7ff"
            />
            {/* Done points bar (solid) */}
            <rect
              x={cx - barWidth / 2}
              y={padding.top + innerH - doneH}
              width={barWidth}
              height={doneH}
              rx={4}
              fill="#6366f1"
              opacity={0.85}
            />
            {/* Value label */}
            <text x={cx} y={padding.top + innerH - doneH - 6} textAnchor="middle" fontSize={11} fill="#4f46e5" fontWeight={600}>
              {d.velocity}
            </text>
            {/* Sprint name */}
            <text x={cx} y={height - 8} textAnchor="middle" fontSize={10} fill="#6b7280">
              {label}
            </text>
          </g>
        );
      })}
      {/* Baseline */}
      <line x1={padding.left} x2={width - padding.right} y1={padding.top + innerH} y2={padding.top + innerH} stroke="#d1d5db" strokeWidth={1} />
      {/* Legend */}
      <rect x={padding.left} y={6} width={12} height={8} rx={2} fill="#6366f1" />
      <text x={padding.left + 16} y={14} fontSize={10} fill="#6b7280">Done SP</text>
      <rect x={padding.left + 70} y={6} width={12} height={8} rx={2} fill="#e0e7ff" />
      <text x={padding.left + 86} y={14} fontSize={10} fill="#6b7280">Total SP</text>
    </svg>
  );
}

// ── Stat Card ───────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accent = 'indigo',
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
}) {
  const colorMap: Record<string, string> = {
    indigo: 'text-indigo-600 bg-indigo-50',
    green: 'text-green-600 bg-green-50',
    red: 'text-red-600 bg-red-50',
    blue: 'text-blue-600 bg-blue-50',
    purple: 'text-purple-600 bg-purple-50',
    amber: 'text-amber-600 bg-amber-50',
  };
  const cls = colorMap[accent] ?? colorMap.indigo;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${cls}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-gray-500">{label}</p>
            <p className="text-xl font-bold text-gray-900">{value}</p>
            {sub && <p className="text-xs text-gray-400">{sub}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Progress Bar ────────────────────────────────────────────────────

function ProgressBar({ value, max = 100, color = 'bg-indigo-500' }: { value: number; max?: number; color?: string }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="w-full bg-gray-100 rounded-full h-2">
      <div className={`${color} h-2 rounded-full transition-all`} style={{ width: `${pct}%` }} />
    </div>
  );
}

// ── Main Page ───────────────────────────────────────────────────────

export function SprintAnalytics() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const { projects, selectedProjectId, setSelectedProjectId } = useProject();
  const [selectedSprintId, setSelectedSprintId] = useState<string>('');

  const [stats, setStats] = useState<SprintStatistics | null>(null);
  const [burndown, setBurndown] = useState<BurndownData | null>(null);
  const [comparison, setComparison] = useState<SprintComparison | null>(null);
  const [teamPerf, setTeamPerf] = useState<TeamPerformance | null>(null);
  const [velocityTrend, setVelocityTrend] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Load sprints for selected project
  useEffect(() => {
    if (!selectedProjectId) return;
    api.get<any>(`/sprints?projectId=${selectedProjectId}`).then((res) => {
      const list = Array.isArray(res) ? res : res?.sprints ?? [];
      setSprints(list);
      if (list.length > 0) {
        const active = list.find((s: any) => s.status === 'active' || s.state === 'active');
        const completed = list.find((s: any) => s.status === 'completed' || s.state === 'closed');
        setSelectedSprintId((active || completed || list[0]).id);
      }
    });
    // Load velocity trend for project
    api.get<any>(`/statistics/project/${selectedProjectId}/velocity`).then((res) => {
      setVelocityTrend(res);
    }).catch(() => setVelocityTrend(null));
  }, [selectedProjectId]);

  // Fetch data when sprint changes
  useEffect(() => {
    if (!selectedSprintId) return;
    setLoading(true);
    const base = `/statistics/sprint/${selectedSprintId}`;

    Promise.all([
      api.get(base).catch(() => null),
      api.get(`${base}/burndown`).catch(() => null),
      api.get(`${base}/comparison`).catch(() => null),
      api.get(`${base}/team-performance`).catch(() => null),
    ]).then(([s, b, c, t]: any[]) => {
      setStats(s);
      // Transform burndown response to { dates, actual, ideal, totalPoints }
      if (b && b.idealBurndown) {
        const dates = b.idealBurndown.map((p: any) => p.date);
        const ideal = b.idealBurndown.map((p: any) => p.remaining);
        // Compute actual burndown: start at totalPoints, subtract done points progressively
        // If backend provides actualBurndown use it, otherwise estimate from current state
        let actual: number[];
        if (b.actualBurndown && b.actualBurndown.length > 0) {
          actual = b.actualBurndown.map((p: any) => p.remaining);
        } else {
          // Fallback: show total points as flat line up to today
          const today = new Date().toISOString().split('T')[0];
          actual = dates.filter((d: string) => d <= today).map(() => b.totalPoints);
        }
        setBurndown({ dates, actual, ideal, totalPoints: b.totalPoints } as any);
      } else {
        setBurndown(b);
      }
      setComparison(c);
      setTeamPerf(t);
      setLoading(false);
    });
  }, [selectedSprintId]);

  const selectedSprint = sprints.find((s) => String(s.id) === String(selectedSprintId));

  const exportCsv = () => {
    if (!stats || !selectedSprint) return;
    const rows = [
      ['Sprint', selectedSprint.name],
      ['Status', selectedSprint.status],
      ['Start Date', selectedSprint.startDate || ''],
      ['End Date', selectedSprint.endDate || ''],
      ['Total Stories', String(stats.totalStories ?? 0)],
      ['Completed Stories', String(stats.completedStories ?? 0)],
      ['Velocity (SP)', String(stats.velocity ?? 0)],
      ['Completion Rate', `${stats.completionRate ?? 0}%`],
      ['Days Remaining', String(stats.daysRemaining ?? 0)],
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedSprint.name.replace(/\s+/g, '_')}_report.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const sprintLabel = (s: Sprint) => {
    const st = (s as any).state || s.status;
    const status = st === 'closed' || st === 'completed' ? '(completed)' : st === 'active' ? '(active)' : '';
    return `${s.name} ${status}`.trim();
  };

  // ── Tab Content ─────────────────────────────────────────────────

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard icon={BookOpen} label="Total Stories" value={stats?.totalStories ?? 0} />
        <StatCard icon={CheckCircle2} label="Completed" value={stats?.completedStories ?? 0} sub="Stories Done" accent="green" />
        <StatCard icon={Zap} label="Velocity" value={stats?.velocity ?? 0} sub="Story Points" accent="purple" />
        <StatCard icon={TrendingUp} label="Completion" value={`${stats?.completionRate ?? 0}%`} sub="Progress Rate" accent="blue" />
        <StatCard icon={Clock} label="Days Left" value={stats?.daysRemaining ?? 0} sub="Sprint Days" accent="amber" />
      </div>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Burndown Chart</h3>
          {burndown ? (
            <BurndownChart data={burndown} />
          ) : (
            <p className="text-gray-400 text-center py-12">No burndown data available</p>
          )}
        </CardContent>
      </Card>

      {/* Velocity Trend - last 6 sprints */}
      {velocityTrend && velocityTrend.velocity && velocityTrend.velocity.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Velocity Trend</h3>
              <p className="text-sm text-gray-500">Avg: {velocityTrend.averageVelocity?.toFixed(1)} SP</p>
            </div>
            <VelocityTrendChart data={velocityTrend.velocity.slice(-6)} avg={velocityTrend.averageVelocity} />
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderCompare = () => {
    const cur = comparison?.current;
    const prev = comparison?.previous;
    const bench = comparison?.benchmarks;
    const perfStatus =
      cur && prev
        ? cur.velocity > prev.velocity
          ? 'Improving'
          : cur.velocity < prev.velocity
            ? 'Declining'
            : 'Stable'
        : '—';
    const perfColor =
      perfStatus === 'Improving'
        ? 'text-green-600'
        : perfStatus === 'Declining'
          ? 'text-red-600'
          : 'text-gray-600';

    return (
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-900">Sprint Performance Comparison</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <h4 className="font-semibold text-gray-800">Current vs Last Sprint</h4>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500">Current Sprint</p>
                  <p className="text-2xl font-bold text-indigo-600">{cur?.velocity ?? '—'}<span className="text-sm text-gray-400 font-normal"> / {cur?.totalPoints ?? '—'} SP</span></p>
                  <p className="text-xs text-gray-400">{cur?.storiesCompleted ?? 0} of {cur?.storiesTotal ?? 0} stories</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Last Sprint</p>
                  <p className="text-2xl font-bold text-gray-500">{prev?.velocity ?? '—'}<span className="text-sm text-gray-400 font-normal"> / {prev?.totalPoints ?? '—'} SP</span></p>
                  <p className="text-xs text-gray-400">{prev ? `${prev.storiesCompleted ?? 0} of ${prev.storiesTotal ?? 0} stories` : '—'}</p>
                </div>
              </div>
              {cur?.totalPoints ? (
                <div>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Completion</span>
                    <span>{Math.round((cur.velocity / cur.totalPoints) * 100)}%</span>
                  </div>
                  <ProgressBar value={cur.velocity} max={cur.totalPoints} color="bg-indigo-500" />
                </div>
              ) : null}
              <div>
                <p className="text-xs text-gray-500">Performance</p>
                <p className={`text-sm font-semibold ${perfColor}`}>{perfStatus}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <h4 className="font-semibold text-gray-800">Team Benchmarks</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500">Average Velocity</p>
                  <p className="text-lg font-bold text-gray-900">{bench?.averageVelocity ?? '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Best Performance</p>
                  <p className="text-lg font-bold text-gray-900">{bench?.bestVelocity ?? '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Sprint Count</p>
                  <p className="text-lg font-bold text-gray-900">{bench?.sprintCount ?? '—'}</p>
                </div>
              </div>
              {bench?.bestVelocity && cur?.velocity != null && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">
                    {Math.round((cur.velocity / bench.bestVelocity) * 100)}% of best performance
                  </p>
                  <ProgressBar value={cur.velocity} max={bench.bestVelocity} />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const renderChanges = () => {
    const added = stats?.storiesAdded ?? [];
    const removed = stats?.storiesRemoved ?? [];
    const netChange = added.length - removed.length;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <StatCard icon={BookOpen} label="Total Stories" value={stats?.totalStories ?? 0} />
          <StatCard icon={CheckCircle2} label="Completed" value={stats?.completedStories ?? 0} sub="Stories Done" accent="green" />
          <StatCard icon={Zap} label="Velocity" value={stats?.velocity ?? 0} sub="Story Points" accent="purple" />
          <StatCard icon={TrendingUp} label="Completion" value={`${stats?.completionRate ?? 0}%`} sub="Progress Rate" accent="blue" />
          <StatCard icon={Clock} label="Days Left" value={stats?.daysRemaining ?? 0} sub="Sprint Days" accent="amber" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-green-200 bg-green-50/40">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 text-green-600">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Stories Added</p>
                <p className="text-2xl font-bold text-green-700">{added.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-red-200 bg-red-50/40">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-100 text-red-600">
                <Minus className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Stories Removed</p>
                <p className="text-2xl font-bold text-red-700">{removed.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-blue-200 bg-blue-50/40">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                <ArrowUpDown className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Net Change</p>
                <p className="text-2xl font-bold text-blue-700">
                  {netChange > 0 ? '+' : ''}
                  {netChange}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <h4 className="font-semibold text-gray-800 mb-3">Stories Added During Sprint</h4>
              {added.length === 0 ? (
                <p className="text-sm text-gray-400">No stories added</p>
              ) : (
                <ul className="space-y-3">
                  {added.map((s: any, i: number) => (
                    <li key={i} className="flex justify-between items-start border-b border-gray-100 pb-2">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{s.title ?? s.name}</p>
                        <p className="text-xs text-gray-400">
                          {s.dateAdded ? new Date(s.dateAdded).toLocaleDateString() : ''}
                        </p>
                      </div>
                      {s.points != null && (
                        <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                          {s.points} pts
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h4 className="font-semibold text-gray-800 mb-3">Stories Removed During Sprint</h4>
              {removed.length === 0 ? (
                <p className="text-sm text-gray-400">No stories removed</p>
              ) : (
                <ul className="space-y-3">
                  {removed.map((s: any, i: number) => (
                    <li key={i} className="flex justify-between items-start border-b border-gray-100 pb-2">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{s.title ?? s.name}</p>
                        <p className="text-xs text-gray-400">
                          {s.dateRemoved ? new Date(s.dateRemoved).toLocaleDateString() : ''}
                        </p>
                      </div>
                      {s.points != null && (
                        <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                          {s.points} pts
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const renderTeam = () => {
    const members = teamPerf?.members ?? [];
    const topVelocity = members.length ? Math.max(...members.map((m) => m.velocity ?? 0)) : 0;
    const avgCompletion = members.length
      ? Math.round(members.reduce((a, m) => a + (m.completionRate ?? 0), 0) / members.length)
      : 0;
    const totalPoints = members.reduce((a, m) => a + (m.velocity ?? 0), 0);

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard icon={Trophy} label="Top Velocity" value={topVelocity} accent="purple" />
          <StatCard icon={Target} label="Avg Completion" value={`${avgCompletion}%`} accent="green" />
          <StatCard icon={Users} label="Team Size" value={members.length} accent="blue" />
          <StatCard icon={Activity} label="Total Points" value={totalPoints} accent="indigo" />
        </div>

        <Card>
          <CardContent className="p-6">
            <h4 className="font-semibold text-gray-800 mb-4">Velocity per Team Member</h4>
            {members.length > 0 ? (
              <VelocityBarChart members={members} />
            ) : (
              <p className="text-gray-400 text-center py-8">No team data available</p>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((m, i) => (
            <Card key={i}>
              <CardContent className="p-4 space-y-3">
                <p className="font-semibold text-gray-800">{m.name}</p>
                <div>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Velocity</span>
                    <span>{m.velocity ?? 0} pts</span>
                  </div>
                  <ProgressBar value={m.velocity ?? 0} max={topVelocity || 1} color="bg-indigo-500" />
                </div>
                <div>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Completion</span>
                    <span>{m.completionRate ?? 0}%</span>
                  </div>
                  <ProgressBar value={m.completionRate ?? 0} max={100} color="bg-green-500" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  // ── Render ──────────────────────────────────────────────────────

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sprint Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track sprint progress, compare performance, and analyze team velocity
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportCsv}
            disabled={!stats}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <Download size={14} /> Export CSV
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Printer size={14} /> Print
          </button>
          {/* Sprint selector */}
          <div className="relative">
            <select
              value={selectedSprintId}
              onChange={(e) => setSelectedSprintId(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg pl-3 pr-8 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {sprints.map((s) => (
                <option key={s.id} value={s.id}>
                  {sprintLabel(s)}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-6" aria-label="Tabs">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
        </div>
      ) : (
        <>
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'compare' && renderCompare()}
          {activeTab === 'changes' && renderChanges()}
          {activeTab === 'team' && renderTeam()}
        </>
      )}
    </div>
  );
}
