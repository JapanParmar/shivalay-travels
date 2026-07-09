'use client';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AdminUser, authenticate, clearUser, getStoredUser, ROLE_PERMISSIONS, storeUser } from './auth';

interface AdminAuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  can: (permission: keyof typeof ROLE_PERMISSIONS[keyof typeof ROLE_PERMISSIONS]) => boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = getStoredUser();
    if (stored) setUser(stored);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, error: errorData.error || 'Invalid credentials' };
      }
      const authenticatedUser = await response.json();
      storeUser(authenticatedUser);
      setUser(authenticatedUser);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: 'Database connection failed or network error' };
    }
  };

  const logout = () => {
    clearUser();
    setUser(null);
  };

  const can = (permission: keyof typeof ROLE_PERMISSIONS[keyof typeof ROLE_PERMISSIONS]): boolean => {
    if (!user) return false;
    const perms = ROLE_PERMISSIONS[user.role];
    return Boolean(perms[permission]);
  };

  return (
    <AdminAuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, can }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}
