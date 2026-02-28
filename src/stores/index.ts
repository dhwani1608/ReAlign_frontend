import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
interface User {
  id: number;
  email: string;
  full_name: string;
  role: 'design_engineer' | 'site_engineer' | 'admin';
  created_at: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

interface ProjectStore {
  projects: any[];
  currentProject: any | null;
  isLoading: boolean;
  setProjects: (projects: any[]) => void;
  setCurrentProject: (project: any | null) => void;
  setLoading: (loading: boolean) => void;
}

interface LayoutStore {
  layouts: any[];
  currentLayout: any | null;
  isLoading: boolean;
  setLayouts: (layouts: any[]) => void;
  setCurrentLayout: (layout: any | null) => void;
  setLoading: (loading: boolean) => void;
}

// Auth Store
export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      isAuthenticated: false,
      setUser: (user: User | null) =>
        set({ user, isAuthenticated: !!user }),
      setToken: (token: string | null) => set({ token }),
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      logout: () =>
        set({ user: null, token: null, isAuthenticated: false }),
    }),
    { name: "auth-storage" }
  )
);


export const useProjectStore = create<ProjectStore>()(
  persist(
    (set) => ({
      projects: [],
      currentProject: null,
      isLoading: false,
      setProjects: (projects: any[]) => set({ projects }),
      setCurrentProject: (project: any | null) =>
        set({ currentProject: project }),
      setLoading: (loading: boolean) => set({ isLoading: loading }),
    }),
    { name: "project-storage" }
  )
);

export const useLayoutStore = create<LayoutStore>()(
  persist(
    (set) => ({
      layouts: [],
      currentLayout: null,
      isLoading: false,
      setLayouts: (layouts: any[]) => set({ layouts }),
      setCurrentLayout: (layout: any | null) =>
        set({ currentLayout: layout }),
      setLoading: (loading: boolean) => set({ isLoading: loading }),
    }),
    { name: "layout-storage" }
  )
);