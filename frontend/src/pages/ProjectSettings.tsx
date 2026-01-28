import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { api } from '../api/client';
import { ArrowLeft, RefreshCw, CheckCircle2, XCircle, Settings, Link2, Key, User as UserIcon, Globe, Users, Plus, Trash2 } from 'lucide-react';
import type { Project, User, ProjectUser } from '../types';

export function ProjectSettings() {
  const { id } = useParams<{ id: string }>();
  const { data: project, refetch } = useApi<Project>(id ? `/projects/${id}` : null);
  const { data: allUsers } = useApi<User[]>('/users');
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [syncResult, setSyncResult] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});

  const field = (key: string) => form[key] ?? (project as Record<string, unknown>)?.[key] as string ?? '';

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    try {
      await api.put(`/projects/${id}`, {
        name: field('name'),
        jiraProjectKey: field('jiraProjectKey'),
        jiraServerUrl: field('jiraServerUrl'),
        jiraUsername: field('jiraUsername'),
        ...(form.jiraApiToken ? { jiraApiToken: form.jiraApiToken } : {}),
        jiraBoardId: field('jiraBoardId'),
      });
      setForm({});
      refetch();
    } finally {
      setSaving(false);
    }
  };

  const handleTestConnection = async () => {
    if (!id) return;
    setTesting(true);
    setTestResult(null);
    try {
      const result = await api.post<{ success: boolean; error?: string[]; serverInfo?: { title: string; version: string } }>(`/jira/test-connection/${id}`);
      setTestResult({
        success: result.success,
        message: result.success
          ? `Connected to ${result.serverInfo?.title} (v${result.serverInfo?.version})`
          : (result.error?.join(', ') || 'Connection failed')
      });
    } catch (err) {
      setTestResult({ success: false, message: err instanceof Error ? err.message : 'Connection failed' });
    } finally {
      setTesting(false);
    }
  };

  const handleFullSync = async () => {
    if (!id) return;
    setSyncing(true);
    setSyncResult(null);
    try {
      await api.post(`/jira/full-sync/${id}`);
      setSyncResult('Sync completed successfully');
      refetch();
    } catch (err) {
      setSyncResult(err instanceof Error ? err.message : 'Sync failed');
    } finally {
      setSyncing(false);
    }
  };

  if (!project) return null;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link to="/projects" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{project.name}</h1>
          <p className="text-muted-foreground mt-0.5">Project settings & Jira integration</p>
        </div>
      </div>

      {/* General Settings */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
              <Settings size={16} className="text-slate-600" />
            </div>
            <h2 className="text-lg font-semibold">General</h2>
          </div>
          <div className="max-w-md">
            <label className="text-sm font-medium text-muted-foreground">Project Name</label>
            <input
              className="mt-1 block w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              value={field('name')}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Jira Integration */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <Link2 size={16} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Jira Integration</h2>
              <p className="text-sm text-muted-foreground">Connect this project to a Jira board for automatic sprint & story sync</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Globe size={14} /> Server URL
              </label>
              <input
                className="mt-1 block w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="https://yourorg.atlassian.net"
                value={field('jiraServerUrl')}
                onChange={e => setForm({ ...form, jiraServerUrl: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Project Key</label>
              <input
                className="mt-1 block w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="PROJ"
                value={field('jiraProjectKey')}
                onChange={e => setForm({ ...form, jiraProjectKey: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <UserIcon size={14} /> Username / Email
              </label>
              <input
                className="mt-1 block w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="you@company.com"
                value={field('jiraUsername')}
                onChange={e => setForm({ ...form, jiraUsername: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Key size={14} /> API Token
              </label>
              <input
                type="password"
                className="mt-1 block w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder={project.jiraApiToken ? '********' : 'Paste your token'}
                value={form.jiraApiToken ?? ''}
                onChange={e => setForm({ ...form, jiraApiToken: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Board ID (optional)</label>
              <input
                className="mt-1 block w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Auto-detect if empty"
                value={field('jiraBoardId')}
                onChange={e => setForm({ ...form, jiraBoardId: e.target.value })}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-6">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
            <Button variant="outline" onClick={handleTestConnection} disabled={testing} className="gap-2">
              {testing ? <RefreshCw size={14} className="animate-spin" /> : <Link2 size={14} />}
              Test Connection
            </Button>
          </div>

          {testResult && (
            <div className={`mt-4 flex items-center gap-2 text-sm rounded-lg p-3 ${
              testResult.success ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
            }`}>
              {testResult.success ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
              {testResult.message}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sync */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
              <RefreshCw size={16} className="text-emerald-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Synchronization</h2>
              <p className="text-sm text-muted-foreground">Import sprints, stories and users from Jira</p>
            </div>
          </div>

          {project.jiraConfig && (
            <div className="mb-4 text-sm text-muted-foreground space-y-1">
              {(project.jiraConfig as Record<string, unknown>).lastSync && (
                <p>Last sync: {new Date((project.jiraConfig as Record<string, unknown>).lastSync as string).toLocaleString()}</p>
              )}
              {(project.jiraConfig as Record<string, unknown>).isConnected !== undefined && (
                <p className="flex items-center gap-2">
                  Status: {(project.jiraConfig as Record<string, unknown>).isConnected
                    ? <span className="text-emerald-600 flex items-center gap-1"><CheckCircle2 size={14} /> Connected</span>
                    : <span className="text-red-600 flex items-center gap-1"><XCircle size={14} /> Disconnected</span>
                  }
                </p>
              )}
            </div>
          )}

          <Button onClick={handleFullSync} disabled={syncing || !project.jiraProjectKey} className="gap-2">
            <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
            {syncing ? 'Syncing...' : 'Full Sync'}
          </Button>
          {!project.jiraProjectKey && (
            <p className="mt-2 text-sm text-muted-foreground">Save Jira settings first to enable sync.</p>
          )}

          {syncResult && (
            <div className="mt-4 text-sm rounded-lg p-3 bg-slate-50 text-slate-700">{syncResult}</div>
          )}
        </CardContent>
      </Card>

      {/* Team Members */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
              <Users size={16} className="text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Team Members</h2>
              <p className="text-sm text-muted-foreground">Manage who has access to this project</p>
            </div>
          </div>

          {/* Current members */}
          <div className="space-y-2 mb-6">
            {(project.ProjectUsers || []).length === 0 && (
              <p className="text-sm text-muted-foreground py-4 text-center">No members assigned. Run a Jira sync or add members manually.</p>
            )}
            {(project.ProjectUsers || []).map((pu: ProjectUser) => {
              const u = pu.User;
              if (!u) return null;
              const initials = `${u.firstName?.[0] || ''}${u.lastName?.[0] || ''}`.toUpperCase() || '?';
              return (
                <div key={pu.id} className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
                      {initials}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{u.firstName} {u.lastName}</div>
                      <div className="text-xs text-muted-foreground">{u.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <select
                      value={pu.role}
                      onChange={async (e) => {
                        await api.post(`/projects/${id}/members`, { userId: u.id, role: e.target.value });
                        refetch();
                      }}
                      className="text-xs border border-slate-200 rounded-md px-2 py-1 bg-white"
                    >
                      <option value="admin">Admin</option>
                      <option value="member">Member</option>
                      <option value="viewer">Viewer</option>
                    </select>
                    <button
                      onClick={async () => {
                        await api.delete(`/projects/${id}/members/${u.id}`);
                        refetch();
                      }}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add member */}
          {(() => {
            const memberIds = new Set((project.ProjectUsers || []).map((pu: ProjectUser) => pu.userId));
            const available = (allUsers || []).filter((u: User) => !memberIds.has(u.id));
            if (available.length === 0) return null;
            return (
              <div className="flex items-center gap-3">
                <select
                  id="add-member-select"
                  defaultValue=""
                  className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-2.5 bg-white"
                >
                  <option value="" disabled>Select a user to add...</option>
                  {available.map((u: User) => (
                    <option key={u.id} value={u.id}>{u.firstName} {u.lastName} ({u.email})</option>
                  ))}
                </select>
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={async () => {
                    const sel = document.getElementById('add-member-select') as HTMLSelectElement;
                    if (!sel.value) return;
                    await api.post(`/projects/${id}/members`, { userId: sel.value, role: 'member' });
                    sel.value = '';
                    refetch();
                  }}
                >
                  <Plus size={14} /> Add
                </Button>
              </div>
            );
          })()}
        </CardContent>
      </Card>
    </div>
  );
}
