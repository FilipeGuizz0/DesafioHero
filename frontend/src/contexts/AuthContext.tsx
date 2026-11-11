import { createContext, useContext, useState, type ReactNode } from 'react';
import { api } from '../services/api';
import type { AuthResponse, User } from '../types';

interface RegisterData {
  name: string;
  email: string;
  password: string;
  character: string;
}

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData | null>(null);

function readStoredUser(): User | null {
  const value = localStorage.getItem('heroforce_user');
  if (!value) return null;
  try {
    return JSON.parse(value) as User;
  } catch {
    localStorage.removeItem('heroforce_user');
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(readStoredUser);

  const saveSession = ({ accessToken, user: sessionUser }: AuthResponse) => {
    localStorage.setItem('heroforce_token', accessToken);
    localStorage.setItem('heroforce_user', JSON.stringify(sessionUser));
    setUser(sessionUser);
  };

  const login = async (email: string, password: string) => {
    const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
    saveSession(data);
  };

  const register = async (values: RegisterData) => {
    const { data } = await api.post<AuthResponse>('/auth/register', values);
    saveSession(data);
  };

  const logout = () => {
    localStorage.removeItem('heroforce_token');
    localStorage.removeItem('heroforce_user');
    setUser(null);
  };

  const value = { user, isAuthenticated: Boolean(user), login, register, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return context;
}
