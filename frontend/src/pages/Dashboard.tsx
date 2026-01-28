import { useApi } from '../hooks/useApi';
import { useProject } from '../context/ProjectContext';
import { Card, CardContent } from '../components/ui/card';
import { Calendar, BookOpen, Zap, TrendingUp, BarChart3, PieChart, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { DashboardStats, Forecast } from '../types';

function StatCard({
  icon: Icon,
  label,
  mainValue,
  subValue,
  color,
  iconBg,
}: {
  icon: typeof Zap;
  label: string;
  mainValue: string;
  subValue?: string;
  color: string;
  iconBg: string;
}) {
  return (
    <Card className="rounded-xl border border-slate-200/60 shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <div className="flex items-baseline gap-1.5 mt-2">
              <span className="text-2xl font-bold text-slate-900">{mainValue}</span>
              {subValue && <span className="text-sm text-slate-400">{subValue}</span>}
            </div>
          </div>
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBg}`}>
            <Icon size={20} className={color} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function Dashboard() {
  const { selectedProjectId: projectId } = useProject();

  const { data: stats, loading } = useApi<DashboardStats>(
    projectId ? `/statistics/project/${projectId}/dashboard` : null
  );

  const { data: forecast } = useApi<Forecast>(
    projectId ? `/statistics/project/${projectId}/forecast` : null
  );

  const sprintProgressPct = stats?.sprintOverview
    ? stats.sprintOverview.totalSprints > 0
      ? Math.round((stats.sprintOverview.completedSprints / stats.sprintOverview.totalSprints) * 100)
      : 0
    : 0;

  const storyPointsPct = stats?.storyProgress?.storyPointsRate ?? 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
        <p className="text-slate-500 mt-1 text-sm">Overview of your project performance</p>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        </div>
      )}

      {!loading && stats && (
        <>
          {/* Top stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={Calendar}
              label="Total Sprints"
              mainValue={`${stats.totalSprints.active}`}
              subValue={`/ ${stats.totalSprints.total}`}
              color="text-indigo-600"
              iconBg="bg-indigo-50"
            />
            <StatCard
              icon={BookOpen}
              label="Total Stories"
              mainValue={`${stats.totalStories.completed}`}
              subValue={`/ ${stats.totalStories.total}`}
              color="text-purple-600"
              iconBg="bg-purple-50"
            />
            <StatCard
              icon={Zap}
              label="Story Points"
              mainValue={`${stats.storyPoints.completed}`}
              subValue={`/ ${stats.storyPoints.total}`}
              color="text-amber-600"
              iconBg="bg-amber-50"
            />
            <StatCard
              icon={TrendingUp}
              label="Completion Rate"
              mainValue={`${stats.completionRate}%`}
              color="text-emerald-600"
              iconBg="bg-emerald-50"
            />
          </div>

          {/* Sprint Overview + Story Progress */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sprint Overview */}
            <Card className="rounded-xl border border-slate-200/60 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-5">
                  <BarChart3 size={18} className="text-indigo-600" />
                  <h2 className="text-base font-semibold text-slate-900">Sprint Overview</h2>
                </div>

                <div className="flex gap-3 mb-6">
                  <div className="flex-1 rounded-lg bg-indigo-50 border border-indigo-100 p-4 text-center">
                    <p className="text-2xl font-bold text-indigo-700">{stats.sprintOverview.activeSprints}</p>
                    <p className="text-xs font-medium text-indigo-500 mt-1">Active Sprints</p>
                  </div>
                  <div className="flex-1 rounded-lg bg-emerald-50 border border-emerald-100 p-4 text-center">
                    <p className="text-2xl font-bold text-emerald-700">{stats.sprintOverview.completedSprints}</p>
                    <p className="text-xs font-medium text-emerald-500 mt-1">Completed</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Total Sprints</span>
                    <span className="font-semibold text-slate-900">{stats.sprintOverview.totalSprints}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Average Velocity (SP)</span>
                    <span className="font-semibold text-slate-900">{stats.sprintOverview.averageVelocity}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Success Rate</span>
                    <span className="font-semibold text-slate-900">{stats.sprintOverview.successRate}%</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                    <span>Progress</span>
                    <span>{sprintProgressPct}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: `${sprintProgressPct}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Story Progress */}
            <Card className="rounded-xl border border-slate-200/60 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-5">
                  <PieChart size={18} className="text-purple-600" />
                  <h2 className="text-base font-semibold text-slate-900">Story Progress</h2>
                </div>

                <div className="flex gap-3 mb-6">
                  <div className="flex-1 rounded-lg bg-purple-50 border border-purple-100 p-4 text-center">
                    <p className="text-2xl font-bold text-purple-700">{stats.storyProgress.totalStoryPoints}</p>
                    <p className="text-xs font-medium text-purple-500 mt-1">Total Story Points</p>
                  </div>
                  <div className="flex-1 rounded-lg bg-emerald-50 border border-emerald-100 p-4 text-center">
                    <p className="text-2xl font-bold text-emerald-700">{stats.storyProgress.completedPoints}</p>
                    <p className="text-xs font-medium text-emerald-500 mt-1">Completed Points</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Total Stories</span>
                    <span className="font-semibold text-slate-900">{stats.storyProgress.totalStories}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Completed Stories</span>
                    <span className="font-semibold text-slate-900">{stats.storyProgress.completedStories}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Story Points Rate</span>
                    <span className="font-semibold text-slate-900">{stats.storyProgress.storyPointsRate}%</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                    <span>Completion</span>
                    <span>{storyPointsPct}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full transition-all duration-500"
                      style={{ width: `${storyPointsPct}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Forecast Card */}
          {forecast && forecast.completedSprintsAnalyzed > 0 && (
            <Card className="rounded-xl border border-slate-200/60 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-5">
                  <Target size={18} className="text-indigo-600" />
                  <h2 className="text-base font-semibold text-slate-900">Forecast</h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                  <div className="rounded-lg bg-indigo-50 border border-indigo-100 p-3 text-center">
                    <p className="text-xl font-bold text-indigo-700">{forecast.avgVelocity}</p>
                    <p className="text-xs font-medium text-indigo-500 mt-1">Avg Velocity</p>
                  </div>
                  <div className="rounded-lg bg-purple-50 border border-purple-100 p-3 text-center">
                    <p className="text-xl font-bold text-purple-700">{forecast.remainingPoints}</p>
                    <p className="text-xs font-medium text-purple-500 mt-1">Remaining Points</p>
                  </div>
                  <div className="rounded-lg bg-amber-50 border border-amber-100 p-3 text-center">
                    <p className="text-xl font-bold text-amber-700">{forecast.sprintsRemaining ?? '—'}</p>
                    <p className="text-xs font-medium text-amber-500 mt-1">Sprints Remaining</p>
                  </div>
                  <div className="rounded-lg bg-emerald-50 border border-emerald-100 p-3 text-center">
                    <p className="text-xl font-bold text-emerald-700">
                      {forecast.estimatedCompletionDate
                        ? new Date(forecast.estimatedCompletionDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                        : '—'}
                    </p>
                    <p className="text-xs font-medium text-emerald-500 mt-1">Est. Completion</p>
                  </div>
                </div>

                {forecast.sprintsRemainingBest !== null && forecast.sprintsRemainingWorst !== null && (
                  <p className="text-xs text-slate-400 text-center">
                    Confidence range: {forecast.sprintsRemainingBest}–{forecast.sprintsRemainingWorst} sprints (based on {forecast.completedSprintsAnalyzed} completed sprints)
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}

      {!loading && !stats && !projectId && (
        <Card className="rounded-xl border border-slate-200/60">
          <CardContent className="py-16 text-center">
            <Calendar size={48} className="mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-700">No projects yet</h3>
            <p className="text-sm text-slate-400 mt-1">Create your first project to get started</p>
            <Link to="/projects" className="inline-block mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-700">
              Go to Projects
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
