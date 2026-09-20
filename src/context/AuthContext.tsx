import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserAccount {
  name: string;
  username: string;
  email: string;
  avatarUrl?: string;
  joinedDate: string;
  preferredTheme?: string;
}

export interface SavedProject {
  id: string;
  name: string;
  createdAt: string;
  theme: string;
  budget: number;
  totalCost: number;
  roomShape: string;
  dimensions: { width: number; length: number; unit: string };
  fixtureIds: string[];
  selectedBlendTitle?: string;
  notes?: string;
}

export interface DesignVersionSnapshot {
  id: string;
  projectId: string;
  versionNumber: number;
  timestamp: string;
  name: string;
  theme: string;
  totalCost: number;
  designScore: number;
  dimensions: { width: number; length: number; unit: string };
  roomShape: string;
  fixtureIds: string[];
  notes?: string;
}

interface AuthContextType {
  user: UserAccount | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  authIntent: 'wishlist' | 'cart' | 'save' | 'general';
  login: (email: string, password?: string) => boolean;
  signup: (username: string, email: string, password?: string) => boolean;
  loginWithGoogle: () => void;
  logout: () => void;
  openAuthModal: (intent?: 'wishlist' | 'cart' | 'save' | 'general') => void;
  closeAuthModal: () => void;
  savedProjects: SavedProject[];
  saveCurrentProject: (project: Omit<SavedProject, 'id' | 'createdAt'>) => SavedProject;
  deleteSavedProject: (id: string) => void;
  // Version History
  versionHistory: DesignVersionSnapshot[];
  saveVersionSnapshot: (snapshot: Omit<DesignVersionSnapshot, 'id' | 'timestamp' | 'versionNumber'>) => DesignVersionSnapshot;
  restoreVersion: (versionId: string) => DesignVersionSnapshot | undefined;
  compareVersions: (v1Id: string, v2Id: string) => { v1: DesignVersionSnapshot; v2: DesignVersionSnapshot; costDelta: number; scoreDelta: number } | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_USER_KEY = 'kohler_spatia_user';
const STORAGE_PROJECTS_KEY = 'kohler_spatia_saved_projects';
const STORAGE_VERSIONS_KEY = 'kohler_spatia_version_history';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem(STORAGE_USER_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  const [savedProjects, setSavedProjects] = useState<SavedProject[]>(() => {
    const saved = localStorage.getItem(STORAGE_PROJECTS_KEY);
    return saved ? JSON.parse(saved) : [
      {
        id: 'proj-demo-1',
        name: 'Hilltop Master Bath Spa',
        createdAt: '2026-08-14',
        theme: 'classic-luxury',
        budget: 450000,
        totalCost: 396000,
        roomShape: 'rectangular',
        dimensions: { width: 10, length: 12, unit: 'ft' },
        fixtureIds: ['shower-thermostatic', 'toilet-smart', 'faucet-bridge', 'light-cove', 'floor-marble', 'vanity-freestanding', 'extra-mirror'],
        notes: 'Double French Gold trim with bookmatched Calacatta slabs.'
      }
    ];
  });

  const [versionHistory, setVersionHistory] = useState<DesignVersionSnapshot[]>(() => {
    const saved = localStorage.getItem(STORAGE_VERSIONS_KEY);
    return saved ? JSON.parse(saved) : [
      {
        id: 'ver-demo-1',
        projectId: 'proj-demo-1',
        versionNumber: 1,
        timestamp: '2026-08-14 14:30',
        name: 'Hilltop Master Bath — Initial Concept',
        theme: 'classic-luxury',
        totalCost: 420000,
        designScore: 89,
        dimensions: { width: 10, length: 12, unit: 'ft' },
        roomShape: 'rectangular',
        fixtureIds: ['shower-digital', 'toilet-smart', 'faucet-bridge', 'light-cove', 'floor-marble', 'vanity-doublebasin', 'extra-mirror'],
        notes: 'Initial spacious double basin layout.'
      },
      {
        id: 'ver-demo-2',
        projectId: 'proj-demo-1',
        versionNumber: 2,
        timestamp: '2026-08-22 10:15',
        name: 'Hilltop Master Bath — Value Optimized',
        theme: 'classic-luxury',
        totalCost: 382000,
        designScore: 94,
        dimensions: { width: 10, length: 12, unit: 'ft' },
        roomShape: 'rectangular',
        fixtureIds: ['shower-thermostatic', 'toilet-smart', 'faucet-bridge', 'light-cove', 'floor-marble', 'vanity-freestanding', 'extra-mirror'],
        notes: 'Swapped to freestanding vanity to expand doorway circulation.'
      }
    ];
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authIntent, setAuthIntent] = useState<'wishlist' | 'cart' | 'save' | 'general'>('general');

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_USER_KEY);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PROJECTS_KEY, JSON.stringify(savedProjects));
  }, [savedProjects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_VERSIONS_KEY, JSON.stringify(versionHistory));
  }, [versionHistory]);

  const STORAGE_ACCOUNTS_KEY = 'kohler_spatia_registered_accounts';

  const signup = (username: string, email: string, _password?: string): boolean => {
    const cleanUsername = username.trim();
    const cleanEmail = email.trim().toLowerCase();
    
    // Store in registered accounts directory in localStorage
    try {
      const existing = localStorage.getItem(STORAGE_ACCOUNTS_KEY);
      const accounts: Record<string, { username: string; email: string }> = existing ? JSON.parse(existing) : {};
      accounts[cleanEmail] = { username: cleanUsername, email: cleanEmail };
      localStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify(accounts));
    } catch (e) {
      console.warn('Accounts storage error:', e);
    }

    const newUser: UserAccount = {
      name: cleanUsername,
      username: cleanUsername,
      email: cleanEmail,
      joinedDate: new Date().toISOString().split('T')[0],
      preferredTheme: 'classic-luxury'
    };
    setUser(newUser);
    setIsAuthModalOpen(false);
    return true;
  };

  const login = (email: string, _password?: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    let retrievedUsername = cleanEmail.split('@')[0];

    // Check if account exists in registry
    try {
      const existing = localStorage.getItem(STORAGE_ACCOUNTS_KEY);
      if (existing) {
        const accounts = JSON.parse(existing);
        if (accounts[cleanEmail]?.username) {
          retrievedUsername = accounts[cleanEmail].username;
        }
      }
    } catch (e) {
      // ignore
    }

    const loggedUser: UserAccount = {
      name: retrievedUsername,
      username: retrievedUsername,
      email: cleanEmail,
      joinedDate: new Date().toISOString().split('T')[0],
      preferredTheme: 'classic-luxury'
    };
    setUser(loggedUser);
    setIsAuthModalOpen(false);
    return true;
  };

  const loginWithGoogle = () => {
    const googleUser: UserAccount = {
      name: 'Aditi Sharma',
      username: 'aditi_sharma',
      email: 'aditi.sharma@designstudio.in',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      joinedDate: new Date().toISOString().split('T')[0],
      preferredTheme: 'japanese-zen'
    };
    setUser(googleUser);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
  };

  const openAuthModal = (intent: 'wishlist' | 'cart' | 'save' | 'general' = 'general') => {
    setAuthIntent(intent);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const saveCurrentProject = (projectData: Omit<SavedProject, 'id' | 'createdAt'>) => {
    const newProject: SavedProject = {
      ...projectData,
      id: `proj-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setSavedProjects(prev => [newProject, ...prev]);

    // Also automatically log version 1 snapshot
    const versionSnapshot: DesignVersionSnapshot = {
      id: `ver-${Date.now()}`,
      projectId: newProject.id,
      versionNumber: 1,
      timestamp: new Date().toLocaleString(),
      name: newProject.name,
      theme: newProject.theme,
      totalCost: newProject.totalCost,
      designScore: 92,
      dimensions: newProject.dimensions,
      roomShape: newProject.roomShape,
      fixtureIds: newProject.fixtureIds,
      notes: newProject.notes
    };
    setVersionHistory(prev => [versionSnapshot, ...prev]);

    return newProject;
  };

  const deleteSavedProject = (id: string) => {
    setSavedProjects(prev => prev.filter(p => p.id !== id));
  };

  const saveVersionSnapshot = (snapshotData: Omit<DesignVersionSnapshot, 'id' | 'timestamp' | 'versionNumber'>) => {
    const projectVersions = versionHistory.filter(v => v.projectId === snapshotData.projectId);
    const nextVersionNum = projectVersions.length + 1;

    const newSnapshot: DesignVersionSnapshot = {
      ...snapshotData,
      id: `ver-${Date.now()}`,
      versionNumber: nextVersionNum,
      timestamp: new Date().toLocaleString()
    };
    setVersionHistory(prev => [newSnapshot, ...prev]);
    return newSnapshot;
  };

  const restoreVersion = (versionId: string): DesignVersionSnapshot | undefined => {
    return versionHistory.find(v => v.id === versionId);
  };

  const compareVersions = (v1Id: string, v2Id: string) => {
    const v1 = versionHistory.find(v => v.id === v1Id);
    const v2 = versionHistory.find(v => v.id === v2Id);
    if (!v1 || !v2) return null;
    return {
      v1,
      v2,
      costDelta: v2.totalCost - v1.totalCost,
      scoreDelta: v2.designScore - v1.designScore
    };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAuthModalOpen,
        authIntent,
        login,
        signup,
        loginWithGoogle,
        logout,
        openAuthModal,
        closeAuthModal,
        savedProjects,
        saveCurrentProject,
        deleteSavedProject,
        versionHistory,
        saveVersionSnapshot,
        restoreVersion,
        compareVersions
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
