import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
import { Layout } from './components/Layout';
import { ProjectProvider } from './context/ProjectContext';
import { Dashboard } from './pages/Dashboard';
import { SprintView } from './pages/SprintView';
import { SprintHistory } from './pages/SprintHistory';
import { CapacityPlanning } from './pages/CapacityPlanning';
import { TeamMembers } from './pages/TeamMembers';
import { Projects } from './pages/Projects';
import { ProjectSettings } from './pages/ProjectSettings';
import { SprintAnalytics } from './pages/SprintAnalytics';
import { Retrospectives } from './pages/Retrospectives';
import { Button } from './components/ui/button';
import { Logo } from './components/Logo';
import { loginRequest } from './auth/msalConfig';

function LoginPage() {
  const { instance } = useMsal();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="text-center space-y-8">
        <div className="space-y-4">
          <div className="mx-auto w-20 h-20 flex items-center justify-center">
            <Logo size={120} />
          </div>
          <h1 className="text-5xl font-bold text-white tracking-tight">Sprintify</h1>
          <p className="text-lg text-slate-400">Capacity Planning & Sprint Analytics</p>
        </div>
        <Button
          size="lg"
          onClick={() => instance.loginRedirect(loginRequest)}
          className="bg-white text-slate-900 hover:bg-slate-100 font-semibold px-8 py-3 text-base shadow-lg"
        >
          Sign in with Microsoft
        </Button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <UnauthenticatedTemplate>
        <LoginPage />
      </UnauthenticatedTemplate>
      <AuthenticatedTemplate>
        <ProjectProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/sprint" element={<SprintView />} />
            <Route path="/history" element={<SprintHistory />} />
            <Route path="/analytics" element={<SprintAnalytics />} />
            <Route path="/capacity" element={<CapacityPlanning />} />
            <Route path="/team" element={<TeamMembers />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/retro" element={<Retrospectives />} />
            <Route path="/projects/:id/settings" element={<ProjectSettings />} />
          </Routes>
        </Layout>
        </ProjectProvider>
      </AuthenticatedTemplate>
    </BrowserRouter>
  );
}
