'use client';
import { useState } from 'react';
import ProtectedPage from '../components/ProtectedPage';
import { DEMO_USERS } from '../lib/auth';
import { useAdminAuth } from '../lib/AdminAuthContext';
import { ROLE_PERMISSIONS, UserRole, AdminUser } from '../lib/auth';

const ROLE_ORDER: UserRole[] = ['super_admin', 'manager', 'agent', 'viewer'];

import { useEffect } from 'react';

export default function UsersPage() {
  const { user: currentUser, can } = useAdminAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'agent' as UserRole });
  const [editingRole, setEditingRole] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addUser = async () => {
    if (!newUser.name || !newUser.email) return;
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
      if (res.ok) {
        const added = await res.json();
        setUsers(prev => [...prev, added]);
        setNewUser({ name: '', email: '', role: 'agent' });
        setShowAdd(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateRole = async (id: string, role: UserRole) => {
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      });
      if (res.ok) {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u));
      }
    } catch (err) {
      console.error(err);
    }
    setEditingRole(null);
  };

  const toggleStatus = async (id: string) => {
    const target = users.find(u => u.id === id);
    if (!target) return;
    const newStatus = target.status === 'active' ? 'inactive' : 'active';
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, status: newStatus } : u));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setUsers(prev => prev.filter(u => u.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!can('canManageUsers')) {
    return (
      <ProtectedPage>
        <div style={{ textAlign: 'center', padding: '80px 24px' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
          <h2 style={{ color: '#fff', fontSize: 20, marginBottom: 8 }}>Access Restricted</h2>
          <p style={{ color: '#666', fontSize: 14 }}>You don&apos;t have permission to manage users.</p>
        </div>
      </ProtectedPage>
    );
  }

  return (
    <ProtectedPage>
      <div className="usr-root">
        <div className="usr-header">
          <div>
            <h1 className="usr-title">Users & Roles</h1>
            <p className="usr-sub">{users.length} team members</p>
          </div>
          <button className="usr-add-btn" onClick={() => setShowAdd(s => !s)}>+ Add User</button>
        </div>

        {/* Role legend */}
        <div className="role-legend">
          {ROLE_ORDER.map(role => {
            const info = ROLE_PERMISSIONS[role];
            return (
              <div key={role} className="role-legend-card" style={{ borderColor: `${info.color}30` }}>
                <div className="role-legend-top">
                  <span className="role-legend-dot" style={{ background: info.color }} />
                  <span className="role-legend-name" style={{ color: info.color }}>{info.label}</span>
                  <span className="role-legend-count">{users.filter(u => u.role === role).length}</span>
                </div>
                <div className="role-legend-perms">
                  {info.canManageBookings && <span className="role-perm">Bookings</span>}
                  {info.canManageUsers && <span className="role-perm">Users</span>}
                  {info.canManageCities && <span className="role-perm">Cities</span>}
                  {info.canManageSettings && <span className="role-perm">Settings</span>}
                  {info.canViewAnalytics && <span className="role-perm">Analytics</span>}
                  {info.canDeleteRecords && <span className="role-perm">Delete</span>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Add form */}
        {showAdd && (
          <div className="usr-add-form">
            <h3 style={{ color: '#fff', fontSize: 15, marginBottom: 16 }}>Add Team Member</h3>
            <div className="usr-form-grid">
              <div><label className="usr-lbl">Full Name *</label><input className="usr-input" placeholder="Rahul Kumar" value={newUser.name} onChange={e => setNewUser(p => ({ ...p, name: e.target.value }))} /></div>
              <div><label className="usr-lbl">Email *</label><input className="usr-input" type="email" placeholder="rahul@shivalay.in" value={newUser.email} onChange={e => setNewUser(p => ({ ...p, email: e.target.value }))} /></div>
              <div>
                <label className="usr-lbl">Role</label>
                <select className="usr-select" value={newUser.role} onChange={e => setNewUser(p => ({ ...p, role: e.target.value as UserRole }))}>
                  {ROLE_ORDER.map(r => <option key={r} value={r}>{ROLE_PERMISSIONS[r].label}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 16 }}>
              <button className="usr-cancel-btn" onClick={() => setShowAdd(false)}>Cancel</button>
              <button className="usr-save-btn" onClick={addUser}>Add User</button>
            </div>
          </div>
        )}

        {/* Users list */}
        <div className="usr-table-wrap">
          <table className="usr-table">
            <thead>
              <tr><th>User</th><th>Email</th><th>Role</th><th>Status</th><th>Last Login</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {users.map(u => {
                const roleInfo = ROLE_PERMISSIONS[u.role];
                const isSelf = u.id === currentUser?.id;
                return (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="usr-avatar" style={{ background: `${roleInfo.color}25`, color: roleInfo.color }}>{u.avatar || u.name[0]}</div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: '#ddd' }}>{u.name}{isSelf && <span className="usr-self-badge">You</span>}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: '#777', fontSize: 12 }}>{u.email}</td>
                    <td>
                      {editingRole === u.id && !isSelf ? (
                        <select
                          className="usr-role-select"
                          value={u.role}
                          onChange={e => updateRole(u.id, e.target.value as UserRole)}
                          autoFocus
                          onBlur={() => setEditingRole(null)}
                        >
                          {ROLE_ORDER.map(r => <option key={r} value={r}>{ROLE_PERMISSIONS[r].label}</option>)}
                        </select>
                      ) : (
                        <span
                          className="usr-role-pill"
                          style={{ background: `${roleInfo.color}15`, color: roleInfo.color, borderColor: `${roleInfo.color}30` }}
                          onClick={() => !isSelf && setEditingRole(u.id)}
                          title={isSelf ? 'Cannot change own role' : 'Click to change role'}
                        >
                          {roleInfo.label}
                          {!isSelf && <span style={{ marginLeft: 4, opacity: 0.5 }}>✎</span>}
                        </span>
                      )}
                    </td>
                    <td>
                      <button
                        className={`usr-status-btn ${u.status === 'active' ? 'active' : 'inactive'}`}
                        onClick={() => !isSelf && toggleStatus(u.id)}
                        disabled={isSelf}
                      >
                        <span className="usr-status-dot" />
                        {u.status}
                      </button>
                    </td>
                    <td style={{ color: '#555', fontSize: 12 }}>
                      {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'}
                    </td>
                    <td>
                      {!isSelf && can('canDeleteRecords') && (
                        <button className="usr-del-btn" onClick={() => { if (confirm(`Remove ${u.name}?`)) deleteUser(u.id); }}>Remove</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .usr-root { display: flex; flex-direction: column; gap: 20px; }
        .usr-header { display: flex; align-items: center; justify-content: space-between; }
        .usr-title { font-size: 22px; font-weight: 700; color: #fff; }
        .usr-sub { font-size: 12px; color: #555; margin-top: 2px; }
        .usr-add-btn { background: #ff0000; color: #fff; border: none; border-radius: 8px; padding: 10px 18px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'DM Sans',sans-serif; }

        .role-legend { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
        .role-legend-card { background: rgba(255,255,255,0.02); border: 1px solid; border-radius: 12px; padding: 16px; }
        .role-legend-top { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
        .role-legend-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .role-legend-name { font-size: 13px; font-weight: 700; flex: 1; }
        .role-legend-count { background: rgba(255,255,255,0.06); border-radius: 10px; padding: 1px 8px; font-size: 12px; color: #aaa; }
        .role-legend-perms { display: flex; flex-wrap: wrap; gap: 4px; }
        .role-perm { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); border-radius: 4px; padding: 2px 6px; font-size: 10px; color: #666; }

        .usr-add-form { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,0,0,0.15); border-radius: 14px; padding: 24px; }
        .usr-form-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }
        .usr-lbl { display: block; font-size: 11px; color: #555; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
        .usr-input { width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 9px 12px; color: #fff; font-size: 13px; outline: none; font-family: 'DM Sans',sans-serif; }
        .usr-select { width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 9px 12px; color: #aaa; font-size: 13px; outline: none; cursor: pointer; font-family: 'DM Sans',sans-serif; }
        .usr-cancel-btn { background: transparent; border: 1px solid rgba(255,255,255,0.1); color: #666; border-radius: 8px; padding: 8px 16px; font-size: 13px; cursor: pointer; font-family: 'DM Sans',sans-serif; }
        .usr-save-btn { background: #ff0000; color: #fff; border: none; border-radius: 8px; padding: 8px 16px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'DM Sans',sans-serif; }

        .usr-table-wrap { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; overflow-x: auto; }
        .usr-table { width: 100%; border-collapse: collapse; }
        .usr-table th { padding: 12px 16px; text-align: left; font-size: 11px; font-weight: 600; color: #555; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid rgba(255,255,255,0.06); white-space: nowrap; }
        .usr-table td { padding: 14px 16px; font-size: 13px; color: #bbb; border-bottom: 1px solid rgba(255,255,255,0.04); }
        .usr-table tr:last-child td { border-bottom: none; }
        .usr-table tr:hover td { background: rgba(255,255,255,0.02); }
        .usr-avatar { width: 34px; height: 34px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0; }
        .usr-self-badge { margin-left: 8px; background: rgba(255,0,0,0.1); color: #ff0000; font-size: 10px; padding: 1px 6px; border-radius: 10px; font-weight: 600; }
        .usr-role-pill { padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; border: 1px solid; cursor: pointer; }
        .usr-role-select { background: #111; border: 1px solid rgba(255,0,0,0.3); border-radius: 6px; padding: 4px 8px; color: #fff; font-size: 12px; outline: none; cursor: pointer; font-family: 'DM Sans',sans-serif; }
        .usr-status-btn { display: flex; align-items: center; gap: 6px; background: transparent; border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 4px 10px; font-size: 11px; font-weight: 600; cursor: pointer; font-family: 'DM Sans',sans-serif; text-transform: capitalize; transition: all 0.2s; }
        .usr-status-btn.active { color: #22c55e; border-color: rgba(34,197,94,0.3); background: rgba(34,197,94,0.08); }
        .usr-status-btn.inactive { color: #ef4444; border-color: rgba(239,68,68,0.3); background: rgba(239,68,68,0.08); }
        .usr-status-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }
        .usr-del-btn { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.15); color: #ef4444; border-radius: 6px; padding: 5px 12px; font-size: 12px; cursor: pointer; font-family: 'DM Sans',sans-serif; }
        @media (max-width: 900px) { .role-legend { grid-template-columns: 1fr 1fr; } .usr-form-grid { grid-template-columns: 1fr; } }
      `}</style>
    </ProtectedPage>
  );
}
