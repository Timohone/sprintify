import { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { useProject } from '../context/ProjectContext';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { api } from '../api/client';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Calendar, Users, Clock, Pencil } from 'lucide-react';
import type { Sprint, CapacityPlan, WeeklyCapacity, Forecast } from '../types';

function getInitials(firstName: string, lastName: string) {
  return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getSprintWeeks(startDate?: string, endDate?: string): number {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = end.getTime() - start.getTime();
  return Math.max(1, Math.round(diff / (7 * 24 * 60 * 60 * 1000)));
}

function weekTotal(w: WeeklyCapacity): number {
  return w.holiday + w.customer + w.internal + w.other;
}

function sumCategory(weeks: WeeklyCapacity[], key: keyof Omit<WeeklyCapacity, 'week'>): number {
  return weeks.reduce((s, w) => s + (w[key] as number), 0);
}

function totalHours(weeks: WeeklyCapacity[]): number {
  return weeks.reduce((s, w) => s + weekTotal(w), 0);
}

function parseWeeks(raw: unknown): WeeklyCapacity[] {
  if (Array.isArray(raw)) return raw;
  if (typeof raw === 'string') { try { const p = JSON.parse(raw); return Array.isArray(p) ? p : []; } catch { return []; } }
  return [];
}

export function CapacityPlanning() {
  const { selectedProjectId: projectId } = useProject();
  const { data: sprints } = useApi<Sprint[]>(projectId ? `/sprints?projectId=${projectId}` : null);
  const [sprintIndex, setSprintIndex] = useState(0);
  const { data: plans, refetch } = useApi<CapacityPlan[]>(
    sprints && sprints[sprintIndex] ? `/capacity-plans?sprintId=${sprints[sprintIndex].id}` : null
  );

  const { data: forecast } = useApi<Forecast>(projectId ? `/statistics/project/${projectId}/forecast` : null);

  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [editData, setEditData] = useState<WeeklyCapacity[]>([]);
  const [saving, setSaving] = useState(false);

  const currentSprint = sprints?.[sprintIndex] || null;

  // Reset sprint index when sprints change
  useEffect(() => {
    if (sprints && sprints.length > 0) {
      // Try to find the active sprint
      const activeIdx = sprints.findIndex(s => s.status === 'active');
      setSprintIndex(activeIdx >= 0 ? activeIdx : 0);
    }
  }, [sprints]);

  const navigateSprint = (dir: -1 | 1) => {
    if (!sprints) return;
    const next = sprintIndex + dir;
    if (next >= 0 && next < sprints.length) {
      setSprintIndex(next);
      setEditingPlanId(null);
    }
  };

  const startEdit = (plan: CapacityPlan) => {
    setEditingPlanId(plan.id);
    setEditData(JSON.parse(JSON.stringify(parseWeeks(plan.weeklyCapacity))));
  };

  const cancelEdit = () => {
    setEditingPlanId(null);
    setEditData([]);
  };

  const updateCell = (weekIdx: number, field: keyof Omit<WeeklyCapacity, 'week'>, value: string) => {
    const num = parseFloat(value) || 0;
    setEditData(prev => {
      const next = [...prev];
      next[weekIdx] = { ...next[weekIdx], [field]: num };
      return next;
    });
  };

  const savePlan = async (planId: string) => {
    setSaving(true);
    try {
      const availableHours = totalHours(editData);
      await api.put(`/capacity-plans/${planId}`, {
        weeklyCapacity: editData,
        availableHours,
      });
      setEditingPlanId(null);
      refetch();
    } finally {
      setSaving(false);
    }
  };

  // Aggregates
  const activeMembers = plans?.filter(p => parseWeeks(p.weeklyCapacity).length > 0).length || 0;
  const allWeeks = plans?.flatMap(p => parseWeeks(p.weeklyCapacity)) || [];
  const totalCap = totalHours(allWeeks);
  const avgPerPerson = activeMembers > 0 ? Math.round(totalCap / activeMembers) : 0;
  const sprintWeeks = getSprintWeeks(currentSprint?.startDate, currentSprint?.endDate);

  const totalHoliday = sumCategory(allWeeks, 'holiday');
  const totalCustomer = sumCategory(allWeeks, 'customer');
  const totalInternal = sumCategory(allWeeks, 'internal');
  const totalOther = sumCategory(allWeeks, 'other');

  const statusBadge = (status?: string) => {
    if (status === 'active') return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">Active</span>;
    if (status === 'completed') return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">Completed</span>;
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">Planning</span>;
  };

  return (
    <div className="space-y-6">
      {projectId && (
        <>
          {/* Header with sprint navigation */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Capacity Planning</h1>
              <p className="text-muted-foreground mt-1">
                {currentSprint ? currentSprint.name : 'No sprints available'}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {sprints && sprints.length > 0 && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigateSprint(-1)}
                    disabled={sprintIndex <= 0}
                  >
                    <ChevronLeft size={16} />
                  </Button>
                  <span className="text-sm font-medium whitespace-nowrap">
                    Sprint {sprintIndex + 1} of {sprints.length}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => navigateSprint(1)}
                    disabled={sprintIndex >= sprints.length - 1}
                  >
                    <ChevronRight size={16} />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Sprint info bar */}
          {currentSprint && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-muted-foreground" />
                    <span className="text-muted-foreground">Sprint Period:</span>
                    <span className="font-medium">
                      {formatDate(currentSprint.startDate)} - {formatDate(currentSprint.endDate)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={14} className="text-muted-foreground" />
                    <span className="text-muted-foreground">Team Size:</span>
                    <span className="font-medium">{activeMembers} active members</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Status:</span>
                    {statusBadge(currentSprint.status)}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Team Capacity Overview - 4 cards */}
          {currentSprint && (
            <div>
              <h2 className="text-lg font-semibold mb-3">Team Capacity Overview</h2>
              <div className="grid grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">Total Capacity</p>
                    <p className="text-2xl font-bold mt-1">{totalCap}h</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">Active Members</p>
                    <p className="text-2xl font-bold mt-1">{activeMembers}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">Avg per Person</p>
                    <p className="text-2xl font-bold mt-1">{avgPerPerson}h</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground">Sprint Duration</p>
                    <p className="text-2xl font-bold mt-1">{sprintWeeks} weeks</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* SP Recommendation */}
          {currentSprint && forecast && forecast.recommendedPoints > 0 && (
            <Card>
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Recommended Story Points</p>
                  <p className="text-3xl font-bold mt-1">{forecast.recommendedPoints} SP</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Based on Avg Velocity ({forecast.avgVelocity} SP)
                    {forecast.currentSprintCapacity !== null && forecast.avgHistoricalCapacity !== null
                      ? ` × Capacity Factor (${(forecast.currentSprintCapacity / forecast.avgHistoricalCapacity).toFixed(2)})`
                      : ''}
                  </p>
                </div>
                {forecast.currentSprintCapacity !== null && forecast.avgHistoricalCapacity !== null && (
                  <div className="text-right text-sm text-muted-foreground">
                    <p>Current Capacity: {forecast.currentSprintCapacity}h</p>
                    <p>Avg Historical: {forecast.avgHistoricalCapacity}h</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Category Breakdown */}
          {currentSprint && plans && plans.length > 0 && (
            <div className="grid grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Holiday</p>
                    <p className="text-xl font-bold text-red-500 mt-1">{totalHoliday}h</p>
                  </div>
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Customer Work</p>
                    <p className="text-xl font-bold text-blue-500 mt-1">{totalCustomer}h</p>
                  </div>
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Internal</p>
                    <p className="text-xl font-bold text-purple-500 mt-1">{totalInternal}h</p>
                  </div>
                  <div className="w-3 h-3 rounded-full bg-purple-500" />
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Other</p>
                    <p className="text-xl font-bold text-green-500 mt-1">{totalOther}h</p>
                  </div>
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Individual Capacity Plans */}
          {currentSprint && plans && plans.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-3">Individual Capacity Plans</h2>
              <div className="space-y-4">
                {plans.map(plan => {
                  const user = plan.User;
                  const weeks = editingPlanId === plan.id ? editData : parseWeeks(plan.weeklyCapacity);
                  const isEditing = editingPlanId === plan.id;
                  const planTotal = totalHours(weeks);

                  return (
                    <Card key={plan.id}>
                      <CardContent className="p-4">
                        {/* Member header */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-sm font-semibold text-slate-600">
                              {user ? getInitials(user.firstName, user.lastName) : '??'}
                            </div>
                            <div>
                              <p className="font-medium">
                                {user ? `${user.firstName} ${user.lastName}` : 'Unknown'}
                              </p>
                              <p className="text-sm text-muted-foreground">{user?.email || ''}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-muted-foreground">
                              Total Capacity: <span className="font-semibold text-foreground">{planTotal}h</span>
                            </span>
                            {isEditing ? (
                              <div className="flex gap-2">
                                <Button size="sm" onClick={() => savePlan(plan.id)} disabled={saving}>
                                  {saving ? 'Saving...' : 'Save'}
                                </Button>
                                <Button size="sm" variant="outline" onClick={cancelEdit}>
                                  Cancel
                                </Button>
                              </div>
                            ) : (
                              <Button size="sm" variant="outline" className="gap-1.5" onClick={() => startEdit(plan)}>
                                <Pencil size={12} /> Edit
                              </Button>
                            )}
                          </div>
                        </div>

                        {/* Weekly table */}
                        {weeks.length > 0 && (
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b">
                                  <th className="text-left py-2 px-3 font-medium text-muted-foreground text-xs uppercase tracking-wider">Week</th>
                                  <th className="text-right py-2 px-3 font-medium text-xs uppercase tracking-wider text-red-500">Holiday</th>
                                  <th className="text-right py-2 px-3 font-medium text-xs uppercase tracking-wider text-blue-500">Customer</th>
                                  <th className="text-right py-2 px-3 font-medium text-xs uppercase tracking-wider text-purple-500">Internal</th>
                                  <th className="text-right py-2 px-3 font-medium text-xs uppercase tracking-wider text-green-500">Other</th>
                                  <th className="text-right py-2 px-3 font-medium text-xs uppercase tracking-wider text-foreground">Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                {weeks.map((w, wi) => (
                                  <tr key={wi} className="border-b last:border-0">
                                    <td className="py-2 px-3 text-muted-foreground">{w.week}</td>
                                    {isEditing ? (
                                      <>
                                        <td className="py-1 px-2 text-right">
                                          <input
                                            type="number"
                                            className="w-16 text-right rounded border border-input bg-background px-2 py-1 text-sm text-red-500 focus:outline-none focus:ring-1 focus:ring-ring"
                                            value={w.holiday}
                                            onChange={e => updateCell(wi, 'holiday', e.target.value)}
                                          />
                                        </td>
                                        <td className="py-1 px-2 text-right">
                                          <input
                                            type="number"
                                            className="w-16 text-right rounded border border-input bg-background px-2 py-1 text-sm text-blue-500 focus:outline-none focus:ring-1 focus:ring-ring"
                                            value={w.customer}
                                            onChange={e => updateCell(wi, 'customer', e.target.value)}
                                          />
                                        </td>
                                        <td className="py-1 px-2 text-right">
                                          <input
                                            type="number"
                                            className="w-16 text-right rounded border border-input bg-background px-2 py-1 text-sm text-purple-500 focus:outline-none focus:ring-1 focus:ring-ring"
                                            value={w.internal}
                                            onChange={e => updateCell(wi, 'internal', e.target.value)}
                                          />
                                        </td>
                                        <td className="py-1 px-2 text-right">
                                          <input
                                            type="number"
                                            className="w-16 text-right rounded border border-input bg-background px-2 py-1 text-sm text-green-500 focus:outline-none focus:ring-1 focus:ring-ring"
                                            value={w.other}
                                            onChange={e => updateCell(wi, 'other', e.target.value)}
                                          />
                                        </td>
                                        <td className="py-2 px-3 text-right font-bold">{weekTotal(w)}h</td>
                                      </>
                                    ) : (
                                      <>
                                        <td className="py-2 px-3 text-right text-red-500">{w.holiday}h</td>
                                        <td className="py-2 px-3 text-right text-blue-500">{w.customer}h</td>
                                        <td className="py-2 px-3 text-right text-purple-500">{w.internal}h</td>
                                        <td className="py-2 px-3 text-right text-green-500">{w.other}h</td>
                                        <td className="py-2 px-3 text-right font-bold">{weekTotal(w)}h</td>
                                      </>
                                    )}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}

                        {weeks.length === 0 && (
                          <p className="text-sm text-muted-foreground text-center py-4">
                            No weekly capacity data. Click Edit to add hours.
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Empty state */}
          {currentSprint && (!plans || plans.length === 0) && (
            <Card>
              <CardContent className="py-16 text-center">
                <Clock size={48} className="mx-auto text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-medium">No capacity plans yet</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Capacity plans will appear here once team members are assigned to this sprint.
                </p>
              </CardContent>
            </Card>
          )}

          {!currentSprint && sprints && sprints.length === 0 && (
            <Card>
              <CardContent className="py-16 text-center">
                <Calendar size={48} className="mx-auto text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-medium">No sprints found</h3>
                <p className="text-sm text-muted-foreground mt-1">Create a sprint for this project first.</p>
                <Link to="/projects" className="inline-block mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-700">
                  Go to Projects
                </Link>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
