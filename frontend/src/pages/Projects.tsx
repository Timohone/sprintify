import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { api } from '../api/client';
import { Plus, Settings, RefreshCw, FolderKanban, ExternalLink, Users } from 'lucide-react';
import type { Project } from '../types';

export function Projects() {
  const { data: projects, loading, refetch } = useApi<Project[]>('/projects');
  const [showForm, setShowForm] = useState(false);
  const [syncing, setSyncing] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', jiraProjectKey: '', jiraServerUrl: '', jiraUsername: '', jiraApiToken: '' });

  const handleCreate = async () => {
    await api.post('/projects', form);
    setForm({ name: '', jiraProjectKey: '', jiraServerUrl: '', jiraUsername: '', jiraApiToken: '' });
    setShowForm(false);
    refetch();
  };

  const handleSync = async (projectId: string) => {
    setSyncing(projectId);
    try {
      await api.post(`/jira/sync/${projectId}`);
      refetch();
    } finally {
      setSyncing(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground mt-1">Manage your projects and Jira integrations</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          {showForm ? 'Cancel' : <><Plus size={16} /> New Project</>}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Create New Project</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-muted-foreground">Project Name</label>
                <input
                  className="mt-1 block w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="My Project"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Jira Project Key</label>
                <input
                  className="mt-1 block w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="PROJ"
                  value={form.jiraProjectKey}
                  onChange={e => setForm({ ...form, jiraProjectKey: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Jira Server URL</label>
                <input
                  className="mt-1 block w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="https://yourorg.atlassian.net"
                  value={form.jiraServerUrl}
                  onChange={e => setForm({ ...form, jiraServerUrl: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Jira Username / Email</label>
                <input
                  className="mt-1 block w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="you@company.com"
                  value={form.jiraUsername}
                  onChange={e => setForm({ ...form, jiraUsername: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Jira API Token</label>
                <input
                  type="password"
                  className="mt-1 block w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Your API token"
                  value={form.jiraApiToken}
                  onChange={e => setForm({ ...form, jiraApiToken: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button onClick={handleCreate}>Create Project</Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {loading && (
        <div className="flex items-center justify-center py-12">
          <RefreshCw size={24} className="animate-spin text-muted-foreground" />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects?.map(project => (
          <Card key={project.id} className="hover:shadow-md transition-shadow group">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <FolderKanban size={20} />
                </div>
                <Link
                  to={`/projects/${project.id}/settings`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Settings size={18} />
                </Link>
              </div>

              <h3 className="font-semibold text-lg">{project.name}</h3>

              <div className="mt-3 space-y-2">
                {project.jiraProjectKey && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ExternalLink size={14} />
                    <span>Jira: {project.jiraProjectKey}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users size={14} />
                  <span>{project.ProjectUsers?.length || 0} members</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t flex gap-2">
                {project.jiraProjectKey && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    disabled={syncing === project.id}
                    onClick={() => handleSync(project.id)}
                  >
                    <RefreshCw size={14} className={syncing === project.id ? 'animate-spin' : ''} />
                    {syncing === project.id ? 'Syncing...' : 'Sync Jira'}
                  </Button>
                )}
                <Link to={`/projects/${project.id}/settings`}>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Settings size={14} /> Settings
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!loading && (!projects || projects.length === 0) && (
        <Card>
          <CardContent className="py-16 text-center">
            <FolderKanban size={48} className="mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-medium">No projects yet</h3>
            <p className="text-sm text-muted-foreground mt-1">Create your first project to get started</p>
            <Button className="mt-4 gap-2" onClick={() => setShowForm(true)}>
              <Plus size={16} /> Create Project
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
