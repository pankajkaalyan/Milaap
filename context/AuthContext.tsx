import React, { createContext, ReactNode } from 'react';
import { User, UserRole, UserProfile } from '../types';
import { useAuth } from '../hooks/useAuth';

export interface AuthContextType {
  token: string | null;
  user: User | null;
  login: (email: string, role: UserRole, profile?: UserProfile, token?: string) => void;
  logout: () => void;
  updateCurrentUser: (updatedUser: User) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};
