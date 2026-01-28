import { useApi } from '../hooks/useApi';
import { useProject } from '../context/ProjectContext';
import { Card, CardContent } from '../components/ui/card';
import { TrendingUp, Calendar, CheckCircle2, History } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Sprint, VelocityData } from '../types';

export function SprintHistory() {
  const { selectedProjectId } = useProject();
  const { data: sprints, loading } = useApi<Sprint[]>(selectedProjectId ? `/sprints?projectId=${selectedProjectId}` : null);
  const { data: velocity } = useApi<VelocityData>(selectedProjectId ? `/statistics/project/${selectedProjectId}/velocity` : null);

  const completedSprints = sprints?.filter(s => s.status === 'completed') || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Sprint History</h1>
        <p className="text-muted-foreground mt-1">Past sprints and velocity trends</p>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        </div>
      )}

      {!loading && velocity && velocity.velocity.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                <TrendingUp size={16} className="text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold">Velocity</h3>
                <p className="text-sm text-muted-foreground">Average: <span className="font-semibold text-foreground">{velocity.averageVelocity.toFixed(1)} pts</span></p>
              </div>
            </div>

            {/* Bar chart */}
            <div className="overflow-x-auto">
              <div className="flex items-end gap-2" style={{ height: '160px', minWidth: `${Math.max(velocity.velocity.length * 48, 200)}px` }}>
                {velocity.velocity.map(v => {
                  const max = Math.max(...velocity.velocity.map(x => x.velocity), 1);
                  const pct = (v.velocity / max) * 100;
                  return (
                    <div key={v.sprintId} className="flex-1 flex flex-col items-center gap-1 h-full" style={{ minWidth: '40px' }}>
                      <span className="text-xs font-medium text-indigo-600">{v.velocity}</span>
                      <div className="w-full flex-1 flex items-end">
                        <div
                          className="w-full bg-indigo-500 rounded-t-md transition-all"
                          style={{ height: `${pct}%`, minHeight: v.velocity > 0 ? '4px' : '0' }}
                        />
                      </div>
                      <span className="text-[10px] text-muted-foreground truncate w-full text-center">
                        {v.sprintName.replace(/sprint\s*/i, 'S')}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!loading && completedSprints.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Completed Sprints</h2>
          {completedSprints.map(sprint => (
            <Card key={sprint.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={18} className="text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium">{sprint.name}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar size={12} />
                    {sprint.startDate && new Date(sprint.startDate).toLocaleDateString()} — {sprint.endDate && new Date(sprint.endDate).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">Completed</span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && selectedProjectId && completedSprints.length === 0 && (
        <Card>
          <CardContent className="py-16 text-center">
            <History size={48} className="mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-medium">No completed sprints</h3>
            <p className="text-sm text-muted-foreground mt-1">Completed sprints will appear here once sprints are finished.</p>
            <Link to="/projects" className="inline-block mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-700">
              Go to Projects to sync from Jira
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
