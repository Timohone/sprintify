import { useState } from 'react';
import { useApi } from '../hooks/useApi';
import { api } from '../api/client';
import { Card, CardContent } from '../components/ui/card';
import { Users, RefreshCw, Trash2 } from 'lucide-react';
import type { User } from '../types';

export function TeamMembers() {
  const { data: users, loading, refetch } = useApi<User[]>('/users');
  const [deleting, setDeleting] = useState<string | null>(null);

  const deleteUser = async (userId: string, name: string) => {
    if (!confirm(`Remove ${name} from the app?`)) return;
    setDeleting(userId);
    try {
      await api.delete(`/users/${userId}`);
      refetch();
    } catch (e: any) {
      alert(e.message || 'Failed to delete user');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Team Members</h1>
        <p className="text-muted-foreground mt-1">{users?.length || 0} members in your team</p>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <RefreshCw size={24} className="animate-spin text-muted-foreground" />
        </div>
      )}

      {!loading && users && users.length > 0 && (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-slate-50/50">
                    <th className="text-left py-3 px-6 font-medium text-muted-foreground">Member</th>
                    <th className="text-left py-3 px-6 font-medium text-muted-foreground">Email</th>
                    <th className="text-left py-3 px-6 font-medium text-muted-foreground">Role</th>
                    <th className="text-left py-3 px-6 font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-6 font-medium text-muted-foreground">Last Login</th>
                    <th className="text-right py-3 px-6 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => {
                    const initials = `${user.firstName[0] || ''}${user.lastName[0] || ''}`.toUpperCase();
                    return (
                      <tr key={user.id} className="border-b last:border-0 hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                              {initials}
                            </div>
                            <span className="font-medium">{user.firstName} {user.lastName}</span>
                          </div>
                        </td>
                        <td className="py-3 px-6 text-muted-foreground">{user.email}</td>
                        <td className="py-3 px-6">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            user.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3 px-6">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                            user.isActive ? 'text-emerald-600' : 'text-slate-400'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${user.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-3 px-6 text-muted-foreground">
                          {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : '-'}
                        </td>
                        <td className="py-3 px-6 text-right">
                          <button
                            onClick={() => deleteUser(user.id, `${user.firstName} ${user.lastName}`)}
                            disabled={deleting === user.id}
                            className="text-red-500 hover:text-red-700 disabled:opacity-50 p-1 rounded hover:bg-red-50 transition-colors"
                            title="Remove user"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {!loading && (!users || users.length === 0) && (
        <Card>
          <CardContent className="py-16 text-center">
            <Users size={48} className="mx-auto text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-medium">No team members</h3>
            <p className="text-sm text-muted-foreground mt-1">Members will appear here after they sign in</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
