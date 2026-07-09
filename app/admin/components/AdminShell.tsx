'use client';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAdminAuth } from '../lib/AdminAuthContext';
import { ROLE_PERMISSIONS } from '../lib/auth';

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  permission?: keyof typeof ROLE_PERMISSIONS[keyof typeof ROLE_PERMISSIONS];
  badge?: number;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/admin/dashboard',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    id: 'bookings',
    label: 'Bookings',
    href: '/admin/bookings',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    id: 'cities',
    label: 'Cities & Routes',
    href: '/admin/cities',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    permission: 'canManageCities',
  },
  {
    id: 'users',
    label: 'Users & Roles',
    href: '/admin/users',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    permission: 'canManageUsers',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    href: '/admin/analytics',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" /><line x1="2" y1="20" x2="22" y2="20" />
      </svg>
    ),
    permission: 'canViewAnalytics',
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/admin/settings',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
    permission: 'canManageSettings',
  },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, logout, can } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/admin/bookings')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const pending = data.filter((b: any) => b.status === 'pending').length;
          setPendingCount(pending);
        }
      })
      .catch(err => console.error('Failed to fetch pending bookings count', err));
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  const visibleItems = NAV_ITEMS.filter(item => {
    if (!item.permission) return true;
    return can(item.permission);
  });

  const roleInfo = user ? ROLE_PERMISSIONS[user.role] : null;

  return (
    <div className="admin-shell">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'collapsed'}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M22 2L15 22L11 13L2 9L22 2Z" />
            </svg>
          </div>
          {sidebarOpen && (
            <div className="sidebar-brand">
              <span className="sidebar-brand-name">SHIVALAY</span>
              <span className="sidebar-brand-sub">Admin Portal</span>
            </div>
          )}
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(s => !s)}
            title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              {sidebarOpen
                ? <path d="M15 18l-6-6 6-6" />
                : <path d="M9 18l6-6-6-6" />
              }
            </svg>
          </button>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          {sidebarOpen && <span className="sidebar-nav-label">Main Menu</span>}
          {visibleItems.map(item => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const displayBadge = item.id === 'bookings' ? pendingCount : item.badge;
            return (
              <a
                key={item.id}
                href={item.href}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                title={!sidebarOpen ? item.label : undefined}
              >
                <span className="sidebar-nav-icon">{item.icon}</span>
                {sidebarOpen && <span className="sidebar-nav-text">{item.label}</span>}
                {sidebarOpen && displayBadge && displayBadge > 0 ? (
                  <span className="sidebar-badge">{displayBadge}</span>
                ) : null}
              </a>
            );
          })}
        </nav>

        {/* User section */}
        <div className="sidebar-user">
          <div
            className="sidebar-user-card"
            onClick={() => setUserMenuOpen(o => !o)}
            role="button"
            tabIndex={0}
          >
            <div
              className="sidebar-avatar"
              style={{ background: roleInfo?.color || '#555' }}
            >
              {user?.avatar || user?.name?.[0] || '?'}
            </div>
            {sidebarOpen && (
              <>
                <div className="sidebar-user-info">
                  <span className="sidebar-user-name">{user?.name}</span>
                  <span className="sidebar-user-role" style={{ color: roleInfo?.color }}>
                    {roleInfo?.label}
                  </span>
                </div>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </>
            )}
          </div>

          {userMenuOpen && sidebarOpen && (
            <div className="sidebar-user-menu">
              <div className="user-menu-email">{user?.email}</div>
              <button className="user-menu-item" onClick={() => { setUserMenuOpen(false); router.push('/'); }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                Main Website
              </button>
              <button className="user-menu-item danger" onClick={handleLogout}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                Sign Out
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main */}
      <div className="admin-main">
        {/* Top bar */}
        <header className="admin-topbar">
          <div className="topbar-left">
            <h2 className="topbar-title">
              {visibleItems.find(i => pathname.startsWith(i.href))?.label || 'Admin'}
            </h2>
          </div>
          <div className="topbar-right">
            <div
              className="topbar-role-badge"
              style={{ borderColor: roleInfo?.color, color: roleInfo?.color }}
            >
              <span className="role-badge-dot" style={{ background: roleInfo?.color }} />
              {roleInfo?.label}
            </div>
            <a href="/" className="topbar-site-link" target="_blank">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
              Live Site
            </a>
          </div>
        </header>

        {/* Content */}
        <main className="admin-content">
          {children}
        </main>
      </div>

      <style>{`
        .admin-shell {
          display: flex;
          min-height: 100vh;
          background: #060608;
          font-family: 'DM Sans', sans-serif;
        }

        /* ── Sidebar ── */
        .admin-sidebar {
          display: flex;
          flex-direction: column;
          background: #0a0a0c;
          border-right: 1px solid rgba(255,255,255,0.06);
          transition: width 0.3s cubic-bezier(0.16,1,0.3,1);
          position: fixed;
          top: 0; left: 0; bottom: 0;
          z-index: 100;
          overflow: hidden;
        }
        .admin-sidebar.open { width: 240px; }
        .admin-sidebar.collapsed { width: 64px; }

        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 20px 16px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          min-height: 64px;
        }
        .sidebar-logo-icon {
          width: 36px; height: 36px;
          background: #ff0000;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          color: #fff;
          flex-shrink: 0;
          box-shadow: 0 0 16px rgba(255,0,0,0.3);
        }
        .sidebar-brand { flex: 1; min-width: 0; }
        .sidebar-brand-name {
          display: block;
          font-size: 12px;
          font-weight: 700;
          color: #fff;
          letter-spacing: 1px;
          white-space: nowrap;
        }
        .sidebar-brand-sub {
          display: block;
          font-size: 10px;
          color: #555;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .sidebar-toggle {
          width: 24px; height: 24px;
          border-radius: 6px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          color: #555;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          transition: all 0.2s;
          margin-left: auto;
        }
        .sidebar-toggle:hover { color: #fff; border-color: rgba(255,255,255,0.15); }

        .sidebar-nav {
          flex: 1;
          padding: 16px 8px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          overflow-y: auto;
        }
        .sidebar-nav-label {
          font-size: 10px;
          color: #444;
          text-transform: uppercase;
          letter-spacing: 1px;
          padding: 0 8px 8px;
          white-space: nowrap;
        }
        .sidebar-nav-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 10px;
          border-radius: 8px;
          color: #666;
          text-decoration: none;
          font-size: 13px;
          font-weight: 500;
          transition: all 0.2s ease;
          white-space: nowrap;
          position: relative;
        }
        .sidebar-nav-item:hover { background: rgba(255,255,255,0.04); color: #ccc; }
        .sidebar-nav-item.active { background: rgba(255,0,0,0.08); color: #ff0000; }
        .sidebar-nav-item.active .sidebar-nav-icon { color: #ff0000; }
        .sidebar-nav-icon { flex-shrink: 0; display: flex; align-items: center; }
        .sidebar-nav-text { flex: 1; }
        .sidebar-badge {
          background: #ff0000;
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          padding: 1px 6px;
          border-radius: 20px;
          flex-shrink: 0;
        }

        .sidebar-user {
          padding: 12px 8px;
          border-top: 1px solid rgba(255,255,255,0.05);
          position: relative;
        }
        .sidebar-user-card {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 10px;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.2s;
          white-space: nowrap;
        }
        .sidebar-user-card:hover { background: rgba(255,255,255,0.04); }
        .sidebar-avatar {
          width: 32px; height: 32px;
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 12px;
          font-weight: 700;
          color: #fff;
          flex-shrink: 0;
        }
        .sidebar-user-info { flex: 1; min-width: 0; }
        .sidebar-user-name {
          display: block; font-size: 13px; font-weight: 600; color: #ddd;
          overflow: hidden; text-overflow: ellipsis;
        }
        .sidebar-user-role { display: block; font-size: 11px; }

        .sidebar-user-menu {
          position: absolute;
          bottom: 100%;
          left: 8px; right: 8px;
          background: #111;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 8px;
          margin-bottom: 4px;
          animation: menuIn 0.15s ease;
        }
        @keyframes menuIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
        .user-menu-email {
          font-size: 11px;
          color: #444;
          padding: 4px 8px 10px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          margin-bottom: 6px;
          overflow: hidden; text-overflow: ellipsis;
        }
        .user-menu-item {
          display: flex; align-items: center; gap: 8px;
          width: 100%; padding: 8px 10px;
          border-radius: 6px; font-size: 13px; color: #aaa;
          cursor: pointer; transition: all 0.15s;
          background: transparent;
          font-family: 'DM Sans', sans-serif;
        }
        .user-menu-item:hover { background: rgba(255,255,255,0.06); color: #fff; }
        .user-menu-item.danger { color: #ff6060; }
        .user-menu-item.danger:hover { background: rgba(255,0,0,0.08); color: #ff4040; }

        /* ── Main ── */
        .admin-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          margin-left: 240px;
          transition: margin-left 0.3s cubic-bezier(0.16,1,0.3,1);
          min-width: 0;
        }
        .admin-sidebar.collapsed ~ .admin-main {
          margin-left: 64px;
        }

        .admin-topbar {
          position: sticky;
          top: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 28px;
          height: 64px;
          background: rgba(6,6,8,0.95);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .topbar-title {
          font-size: 16px;
          font-weight: 700;
          color: #fff;
        }
        .topbar-right {
          display: flex; align-items: center; gap: 12px;
        }
        .topbar-role-badge {
          display: flex; align-items: center; gap: 6px;
          padding: 5px 12px;
          border-radius: 20px;
          border: 1px solid;
          font-size: 12px;
          font-weight: 600;
        }
        .role-badge-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
        }
        .topbar-site-link {
          display: flex; align-items: center; gap: 6px;
          padding: 6px 14px;
          border-radius: 8px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: #888;
          font-size: 12px;
          text-decoration: none;
          transition: all 0.2s;
        }
        .topbar-site-link:hover { color: #fff; border-color: rgba(255,255,255,0.2); }

        .admin-content {
          flex: 1;
          padding: 28px;
          overflow-x: hidden;
        }

        @media (max-width: 768px) {
          .admin-sidebar { display: none; }
          .admin-main { margin-left: 0 !important; }
          .admin-content { padding: 16px; }
        }
      `}</style>
    </div>
  );
}
