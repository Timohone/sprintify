import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../api/client';
import type { Project } from '../types';

interface ProjectContextType {
  projects: Project[];
  selectedProjectId: string;
  setSelectedProjectId: (id: string) => void;
  selectedProject: Project | null;
  loading: boolean;
}

const ProjectContext = createContext<ProjectContextType>({
  projects: [],
  selectedProjectId: '',
  setSelectedProjectId: () => {},
  selectedProject: null,
  loading: true,
});

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(() => {
    return localStorage.getItem('sprintify_project') || '';
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<any>('/projects').then((res) => {
      const list = Array.isArray(res) ? res : res?.projects ?? [];
      setProjects(list);
      if (list.length > 0 && !selectedProjectId) {
        setSelectedProjectId(list[0].id);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      localStorage.setItem('sprintify_project', selectedProjectId);
    }
  }, [selectedProjectId]);

  const selectedProject = projects.find(p => p.id === selectedProjectId) || null;

  return (
    <ProjectContext.Provider value={{ projects, selectedProjectId, setSelectedProjectId, selectedProject, loading }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  return useContext(ProjectContext);
}
