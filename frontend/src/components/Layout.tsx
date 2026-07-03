import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';
import { LayoutDashboard, Zap, History, Users, FolderKanban, Calendar, BarChart3, MessageSquare, LogOut, ChevronRight, ChevronDown } from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { Logo } from './Logo';

const nav = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/sprint', label: 'Active Sprint', icon: Zap },
  { to: '/analytics', label: 'Sprint Analytics', icon: BarChart3 },
  { to: '/history', label: 'Sprint History', icon: History },
  { to: '/capacity', label: 'Capacity', icon: Calendar },
  { to: '/retro', label: 'Retro', icon: MessageSquare },
  { to: '/team', label: 'Team', icon: Users },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
];

export function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const { instance } = useMsal();
  const account = instance.getAllAccounts()[0];
  const initials = account?.name
    ? account.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  const { projects, selectedProjectId, setSelectedProjectId, selectedProject } = useProject();

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white flex flex-col shadow-xl">
        <div className="px-6 py-5 flex items-center gap-3">
          <Logo size={28} />
          <span className="text-lg font-semibold tracking-tight">Sprintify</span>
        </div>

        {/* Project selector */}
        {projects.length > 0 && (
          <div className="px-3 pb-3">
            <div className="relative">
              <select
                value={selectedProjectId}
                onChange={e => setSelectedProjectId(e.target.value)}
                className="w-full appearance-none bg-white/10 border border-white/10 rounded-lg pl-3 pr-8 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id} className="text-slate-900">{p.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>
        )}

        <nav className="flex-1 px-3 py-4 space-y-1">
          {nav.map(({ to, label, icon: Icon }) => {
            const active = pathname === to || (to !== '/' && pathname.startsWith(to));
            return (
              <Link
                key={to}
                to={to}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? 'bg-white/15 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={18} className={active ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'} />
                {label}
                {active && <ChevronRight size={14} className="ml-auto text-slate-500" />}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 pb-4 mt-auto">
          <div className="rounded-lg bg-white/5 p-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-xs font-bold">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{account?.name || 'User'}</div>
                <div className="text-xs text-slate-500 truncate">{account?.username}</div>
              </div>
            </div>
            <button
              onClick={() => instance.logoutRedirect()}
              className="mt-3 w-full flex items-center justify-center gap-2 text-xs text-slate-400 hover:text-white py-1.5 rounded-md hover:bg-white/5 transition-colors"
            >
              <LogOut size={14} />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
