import { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { useProject } from '../context/ProjectContext';
import { api } from '../api/client';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { MessageSquare, Plus, Trash2, Check } from 'lucide-react';
import type { Sprint, Retrospective } from '../types';

export function Retrospectives() {
  const { selectedProjectId: projectId } = useProject();
  const { data: sprints, loading: loadingSprints } = useApi<Sprint[]>(
    projectId ? `/sprints?projectId=${projectId}` : null
  );

  const completedSprints = sprints?.filter(s => s.status === 'completed') || [];
  const [selectedSprintId, setSelectedSprintId] = useState('');
  const [retro, setRetro] = useState<Retrospective | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [wentWell, setWentWell] = useState('');
  const [needsImprovement, setNeedsImprovement] = useState('');
  const [actionItems, setActionItems] = useState<{ text: string; assigneeId: string; done: boolean }[]>([]);
  const [newAction, setNewAction] = useState('');

  // Auto-select first completed sprint
  useEffect(() => {
    if (completedSprints.length > 0 && !selectedSprintId) {
      setSelectedSprintId(completedSprints[0].id);
    }
  }, [completedSprints, selectedSprintId]);

  // Load retro when sprint changes
  useEffect(() => {
    if (!selectedSprintId) return;
    setLoading(true);
    api.get<Retrospective | null>(`/retrospectives?sprintId=${selectedSprintId}`)
      .then(data => {
        setRetro(data);
        if (data) {
          setWentWell(data.wentWell);
          setNeedsImprovement(data.needsImprovement);
          setActionItems(data.actionItems || []);
        } else {
          setWentWell('');
          setNeedsImprovement('');
          setActionItems([]);
        }
      })
      .catch(() => {
        setRetro(null);
        setWentWell('');
        setNeedsImprovement('');
        setActionItems([]);
      })
      .finally(() => setLoading(false));
  }, [selectedSprintId]);

  const save = async () => {
    setSaving(true);
    try {
      if (retro) {
        const updated = await api.patch<Retrospective>(`/retrospectives/${retro.id}`, {
          wentWell, needsImprovement, actionItems
        });
        setRetro(updated);
      } else {
        const created = await api.post<Retrospective>('/retrospectives', {
          sprintId: selectedSprintId, wentWell, needsImprovement, actionItems
        });
        setRetro(created);
      }
    } finally {
      setSaving(false);
    }
  };

  const addActionItem = () => {
    if (!newAction.trim()) return;
    setActionItems(prev => [...prev, { text: newAction.trim(), assigneeId: '', done: false }]);
    setNewAction('');
  };

  const toggleAction = (idx: number) => {
    setActionItems(prev => prev.map((item, i) => i === idx ? { ...item, done: !item.done } : item));
  };

  const removeAction = (idx: number) => {
    setActionItems(prev => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Retrospective</h1>
          <p className="text-muted-foreground mt-1">Reflect on completed sprints</p>
        </div>
        {selectedSprintId && (
          <select
            value={selectedSprintId}
            onChange={e => setSelectedSprintId(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-lg pl-3 pr-8 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {completedSprints.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        )}
      </div>

      {(loadingSprints || loading) && (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        </div>
      )}

      {!loadingSprints && !loading && completedSprints.length === 0 && (
        <Card>
          <CardContent className="py-16 text-center">
            <MessageSquare size={48} className="mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-medium">No completed sprints</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Retrospectives are available for completed sprints. Sync sprints from Jira in the Projects page.
            </p>
          </CardContent>
        </Card>
      )}

      {!loadingSprints && !loading && selectedSprintId && completedSprints.length > 0 && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Went Well */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-emerald-700 mb-3">What went well</h3>
                <textarea
                  className="w-full min-h-[120px] rounded-lg border border-gray-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
                  value={wentWell}
                  onChange={e => setWentWell(e.target.value)}
                  placeholder="Things that worked well this sprint..."
                />
              </CardContent>
            </Card>

            {/* Needs Improvement */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-amber-700 mb-3">Needs improvement</h3>
                <textarea
                  className="w-full min-h-[120px] rounded-lg border border-gray-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
                  value={needsImprovement}
                  onChange={e => setNeedsImprovement(e.target.value)}
                  placeholder="Areas to improve next sprint..."
                />
              </CardContent>
            </Card>
          </div>

          {/* Action Items */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-indigo-700 mb-4">Action Items</h3>

              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Add an action item..."
                  value={newAction}
                  onChange={e => setNewAction(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addActionItem()}
                />
                <Button size="sm" onClick={addActionItem}>
                  <Plus size={16} />
                </Button>
              </div>

              {actionItems.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No action items yet</p>
              )}

              <ul className="space-y-2">
                {actionItems.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50">
                    <button
                      onClick={() => toggleAction(idx)}
                      className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 ${
                        item.done ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-300'
                      }`}
                    >
                      {item.done && <Check size={12} />}
                    </button>
                    <span className={`flex-1 text-sm ${item.done ? 'line-through text-muted-foreground' : ''}`}>
                      {item.text}
                    </span>
                    <button onClick={() => removeAction(idx)} className="text-slate-400 hover:text-red-500">
                      <Trash2 size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={save} disabled={saving}>
              {saving ? 'Saving...' : retro ? 'Update Retrospective' : 'Save Retrospective'}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
