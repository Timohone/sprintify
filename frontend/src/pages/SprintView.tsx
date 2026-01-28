import { useApi } from '../hooks/useApi';
import { useProject } from '../context/ProjectContext';
import { Card, CardContent } from '../components/ui/card';
import { Target, CheckCircle2, Clock, AlertCircle, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Sprint, SprintStatistics } from '../types';

const statusColors: Record<string, string> = {
  'To Do': 'bg-slate-100 text-slate-700',
  'In Progress': 'bg-blue-100 text-blue-700',
  'Done': 'bg-emerald-100 text-emerald-700',
};

export function SprintView() {
  const { selectedProjectId: projectId } = useProject();
  const { data: sprints, loading: loadingSprints } = useApi<Sprint[]>(projectId ? `/sprints?projectId=${projectId}` : null);

  const activeSprint = sprints?.find(s => s.status === 'active');
  const { data: stats } = useApi<SprintStatistics>(activeSprint ? `/statistics/sprint/${activeSprint.id}` : null);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Active Sprint</h1>
        <p className="text-muted-foreground mt-1">Current sprint overview and progress</p>
      </div>

      {loadingSprints && (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        </div>
      )}

      {!loadingSprints && activeSprint && stats && (
        <>
          <Card className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">{activeSprint.name}</h2>
                  <p className="text-indigo-100 mt-1">
                    {activeSprint.startDate && new Date(activeSprint.startDate).toLocaleDateString()} — {activeSprint.endDate && new Date(activeSprint.endDate).toLocaleDateString()}
                  </p>
                  {activeSprint.goal && <p className="text-indigo-100 mt-2 text-sm">{activeSprint.goal}</p>}
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold">{Math.round(stats.stories.completionRate * 100)}%</div>
                  <div className="text-indigo-200 text-sm">completed</div>
                </div>
              </div>
              {/* Progress bar */}
              <div className="mt-4 bg-white/20 rounded-full h-2">
                <div className="bg-white rounded-full h-2 transition-all" style={{ width: `${stats.stories.completionRate * 100}%` }} />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                  <BarChart3 size={18} className="text-slate-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Stories</p>
                  <p className="text-2xl font-bold">{stats.stories.total}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <Target size={18} className="text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Story Points</p>
                  <p className="text-2xl font-bold">{stats.stories.totalPoints}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 size={18} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Done</p>
                  <p className="text-2xl font-bold">{stats.stories.donePoints} pts</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Clock size={18} className="text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-bold">{stats.stories.inProgressPoints} pts</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Status Breakdown</h3>
                <div className="space-y-3">
                  {Object.entries(stats.statusBreakdown).map(([status, count]) => {
                    const total = Object.values(stats.statusBreakdown).reduce((a, b) => a + b, 0);
                    const pct = total > 0 ? (count / total) * 100 : 0;
                    return (
                      <div key={status}>
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[status] || 'bg-slate-100 text-slate-700'}`}>{status}</span>
                          <span className="text-sm font-medium">{count}</span>
                        </div>
                        <div className="bg-slate-100 rounded-full h-1.5">
                          <div className="bg-indigo-500 rounded-full h-1.5 transition-all" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Team Capacity</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Available</span>
                    <span className="font-semibold">{stats.capacity.totalAvailableHours}h</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Allocated</span>
                    <span className="font-semibold">{stats.capacity.totalAllocatedHours}h</span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Utilization</span>
                      <span className="font-bold text-lg">{Math.round(stats.capacity.utilizationRate * 100)}%</span>
                    </div>
                    <div className="bg-slate-100 rounded-full h-3">
                      <div
                        className={`rounded-full h-3 transition-all ${stats.capacity.utilizationRate > 0.9 ? 'bg-red-500' : stats.capacity.utilizationRate > 0.7 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                        style={{ width: `${Math.min(stats.capacity.utilizationRate * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {!loadingSprints && projectId && !activeSprint && sprints && (
        <Card>
          <CardContent className="py-16 text-center">
            <AlertCircle size={48} className="mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-medium">No active sprint</h3>
            <p className="text-sm text-muted-foreground mt-1">This project has no active sprint. Sync from Jira to import sprints.</p>
            <Link to="/projects" className="inline-block mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-700">
              Go to Projects
            </Link>
          </CardContent>
        </Card>
      )}

      {!projectId && (
        <Card>
          <CardContent className="py-16 text-center">
            <Target size={48} className="mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-medium">Select a project</h3>
            <p className="text-sm text-muted-foreground mt-1">Choose a project to view the active sprint</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
