'use client';

export type UserRole = 'super_admin' | 'manager' | 'agent' | 'viewer';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  lastLogin?: string;
  status: 'active' | 'inactive';
}

export interface AuthState {
  user: AdminUser | null;
  isAuthenticated: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, {
  label: string;
  color: string;
  canManageBookings: boolean;
  canManageUsers: boolean;
  canManageCities: boolean;
  canManageSettings: boolean;
  canViewAnalytics: boolean;
  canDeleteRecords: boolean;
}> = {
  super_admin: {
    label: 'Super Admin',
    color: '#ff0000',
    canManageBookings: true,
    canManageUsers: true,
    canManageCities: true,
    canManageSettings: true,
    canViewAnalytics: true,
    canDeleteRecords: true,
  },
  manager: {
    label: 'Manager',
    color: '#f59e0b',
    canManageBookings: true,
    canManageUsers: false,
    canManageCities: true,
    canManageSettings: false,
    canViewAnalytics: true,
    canDeleteRecords: true,
  },
  agent: {
    label: 'Agent',
    color: '#3b82f6',
    canManageBookings: true,
    canManageUsers: false,
    canManageCities: false,
    canManageSettings: false,
    canViewAnalytics: false,
    canDeleteRecords: false,
  },
  viewer: {
    label: 'Viewer',
    color: '#6b7280',
    canManageBookings: false,
    canManageUsers: false,
    canManageCities: false,
    canManageSettings: false,
    canViewAnalytics: true,
    canDeleteRecords: false,
  },
};

// Demo admin users (in real app, this would come from a database/API)
export const DEMO_USERS: (AdminUser & { password: string })[] = [
  {
    id: '1',
    name: 'Rajesh Parmar',
    email: 'admin@shivalay.in',
    password: 'admin123',
    role: 'super_admin',
    avatar: 'RP',
    lastLogin: '2026-07-09T10:00:00Z',
    status: 'active',
  },
  {
    id: '2',
    name: 'Priya Sharma',
    email: 'manager@shivalay.in',
    password: 'manager123',
    role: 'manager',
    avatar: 'PS',
    lastLogin: '2026-07-08T14:30:00Z',
    status: 'active',
  },
  {
    id: '3',
    name: 'Amit Verma',
    email: 'agent@shivalay.in',
    password: 'agent123',
    role: 'agent',
    avatar: 'AV',
    lastLogin: '2026-07-07T09:15:00Z',
    status: 'active',
  },
  {
    id: '4',
    name: 'Sunita Patel',
    email: 'viewer@shivalay.in',
    password: 'viewer123',
    role: 'viewer',
    avatar: 'SP',
    lastLogin: '2026-07-06T16:00:00Z',
    status: 'active',
  },
];

export function authenticate(email: string, password: string): AdminUser | null {
  const user = DEMO_USERS.find(u => u.email === email && u.password === password);
  if (!user) return null;
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export function getStoredUser(): AdminUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem('shivalay_admin_user');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function storeUser(user: AdminUser): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('shivalay_admin_user', JSON.stringify(user));
}

export function clearUser(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('shivalay_admin_user');
}
