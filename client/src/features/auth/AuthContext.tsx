import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../../services/api';
import { User } from '../../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('ps_user');
    const storedToken = localStorage.getItem('ps_token');
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch { localStorage.clear(); }
    }
    if (storedToken) {
      // Verify token with server
      authAPI.getMe().then((res) => {
        setUser(res.data.user);
        localStorage.setItem('ps_user', JSON.stringify(res.data.user));
      }).catch(() => {
        setUser(null);
        localStorage.removeItem('ps_user');
        localStorage.removeItem('ps_token');
      }).finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = (user: User, token: string) => {
    setUser(user);
    localStorage.setItem('ps_user', JSON.stringify(user));
    localStorage.setItem('ps_token', token);
  };

  const logout = async () => {
    try { await authAPI.logout(); } catch {}
    setUser(null);
    localStorage.removeItem('ps_user');
    localStorage.removeItem('ps_token');
  };

  const refreshUser = async () => {
    try {
      const res = await authAPI.getMe();
      setUser(res.data.user);
      localStorage.setItem('ps_user', JSON.stringify(res.data.user));
    } catch {}
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
