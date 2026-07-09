'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '../lib/AdminAuthContext';

export default function AdminLoginPage() {
  const { login, isAuthenticated, isLoading } = useAdminAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/admin/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);
    if (result.success) {
      router.replace('/admin/dashboard');
    } else {
      setError(result.error || 'Login failed');
    }
  };

  const fillDemo = (role: string) => {
    const creds: Record<string, { email: string; password: string }> = {
      super_admin: { email: 'admin@shivalay.in', password: 'admin123' },
      manager: { email: 'manager@shivalay.in', password: 'manager123' },
      agent: { email: 'agent@shivalay.in', password: 'agent123' },
      viewer: { email: 'viewer@shivalay.in', password: 'viewer123' },
    };
    const c = creds[role];
    if (c) { setEmail(c.email); setPassword(c.password); }
  };

  if (isLoading) return null;

  return (
    <div className="admin-login-root">
      {/* Animated background */}
      <div className="admin-login-bg">
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
        <div className="bg-orb bg-orb-3" />
        <div className="admin-grid-overlay" />
      </div>

      {/* Card */}
      <div className="admin-login-card">
        {/* Logo */}
        <div className="login-logo">
          <div className="login-logo-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2L15 22L11 13L2 9L22 2Z" />
            </svg>
          </div>
          <div>
            <span className="login-brand">SHIVALAY TRAVELS</span>
            <span className="login-panel-label">Admin Panel</span>
          </div>
        </div>

        <h1 className="login-heading">Welcome back</h1>
        <p className="login-sub">Sign in to access the dashboard</p>

        {/* Demo credentials */}
        <div className="demo-creds">
          <span className="demo-creds-label">Quick Demo Login:</span>
          <div className="demo-creds-btns">
            {[
              { role: 'super_admin', label: 'Super Admin', color: '#ff0000' },
              { role: 'manager', label: 'Manager', color: '#f59e0b' },
              { role: 'agent', label: 'Agent', color: '#3b82f6' },
              { role: 'viewer', label: 'Viewer', color: '#6b7280' },
            ].map(r => (
              <button
                key={r.role}
                type="button"
                className="demo-role-btn"
                onClick={() => fillDemo(r.role)}
                style={{ '--role-color': r.color } as React.CSSProperties}
              >
                <span className="demo-role-dot" style={{ background: r.color }} />
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label className="login-label">Email Address</label>
            <div className="login-input-wrap">
              <span className="login-input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </span>
              <input
                id="admin-email"
                type="email"
                className="login-input"
                placeholder="admin@shivalay.in"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="login-field">
            <label className="login-label">Password</label>
            <div className="login-input-wrap">
              <span className="login-input-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                className="login-input"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="login-eye-btn"
                onClick={() => setShowPassword(s => !s)}
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="login-error">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          <button
            id="admin-login-btn"
            type="submit"
            className="login-submit"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <span className="login-spinner" />
                Authenticating...
              </>
            ) : (
              <>
                Sign In
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </>
            )}
          </button>
        </form>

        <a href="/" className="login-back-link">
          ← Back to main website
        </a>
      </div>

      <style>{`
        .admin-login-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #050505;
          position: relative;
          overflow: hidden;
          padding: 24px;
        }
        .admin-login-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .bg-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
        }
        .bg-orb-1 {
          width: 500px; height: 500px;
          background: rgba(255,0,0,0.05);
          top: -100px; left: -100px;
          animation: orbFloat 12s ease-in-out infinite;
        }
        .bg-orb-2 {
          width: 400px; height: 400px;
          background: rgba(255,0,0,0.03);
          bottom: -80px; right: -80px;
          animation: orbFloat 16s ease-in-out infinite reverse;
        }
        .bg-orb-3 {
          width: 300px; height: 300px;
          background: rgba(255,255,255,0.01);
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          animation: orbFloat 20s ease-in-out infinite;
        }
        @keyframes orbFloat {
          0%,100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
        }
        .admin-grid-overlay {
          position: absolute;
          inset: 0;
          background-image: linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
          background-size: 50px 50px;
        }
        .admin-login-card {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 440px;
          background: rgba(12,12,12,0.95);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 24px;
          padding: 40px;
          backdrop-filter: blur(20px);
          box-shadow: 0 40px 80px -20px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.03);
          animation: loginCardIn 0.5s cubic-bezier(0.16,1,0.3,1) both;
        }
        @keyframes loginCardIn {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to { opacity: 1; transform: none; }
        }
        .login-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 32px;
        }
        .login-logo-icon {
          width: 40px; height: 40px;
          background: #ff0000;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          color: #fff;
          box-shadow: 0 0 20px rgba(255,0,0,0.4);
        }
        .login-brand {
          display: block;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 700;
          color: #fff;
          letter-spacing: 1px;
        }
        .login-panel-label {
          display: block;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .login-heading {
          font-family: 'DM Sans', sans-serif;
          font-size: 26px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 6px;
        }
        .login-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: #666;
          margin-bottom: 24px;
        }
        .demo-creds {
          background: rgba(255,255,255,0.02);
          border: 1px dashed rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 14px 16px;
          margin-bottom: 28px;
        }
        .demo-creds-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          color: #555;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          display: block;
          margin-bottom: 10px;
        }
        .demo-creds-btns {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .demo-role-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 5px 10px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          color: #aaa;
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .demo-role-btn:hover {
          border-color: var(--role-color);
          color: #fff;
          background: rgba(255,255,255,0.06);
        }
        .demo-role-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .login-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .login-label {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          font-weight: 600;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .login-input-wrap {
          position: relative;
        }
        .login-input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #444;
          display: flex;
          align-items: center;
          pointer-events: none;
          transition: color 0.2s;
        }
        .login-input-wrap:focus-within .login-input-icon {
          color: #ff0000;
        }
        .login-input {
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px;
          padding: 12px 14px 12px 42px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: #fff;
          outline: none;
          transition: all 0.2s ease;
        }
        .login-input::placeholder { color: #444; }
        .login-input:focus {
          border-color: #ff0000;
          background: rgba(255,0,0,0.02);
          box-shadow: 0 0 0 3px rgba(255,0,0,0.08);
        }
        .login-eye-btn {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #555;
          padding: 4px;
          border-radius: 6px;
          cursor: pointer;
          transition: color 0.2s;
        }
        .login-eye-btn:hover { color: #fff; }
        .login-error {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,0,0,0.07);
          border: 1px solid rgba(255,0,0,0.2);
          border-radius: 8px;
          padding: 10px 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: #ff6060;
        }
        .login-submit {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          background: #ff0000;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 700;
          border: none;
          border-radius: 10px;
          padding: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          margin-top: 6px;
          box-shadow: 0 4px 20px rgba(255,0,0,0.3);
        }
        .login-submit:hover:not(:disabled) {
          background: #cc0000;
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(255,0,0,0.4);
        }
        .login-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .login-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          display: inline-block;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .login-back-link {
          display: block;
          text-align: center;
          margin-top: 24px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: #555;
          text-decoration: none;
          transition: color 0.2s;
        }
        .login-back-link:hover { color: #fff; }
      `}</style>
    </div>
  );
}
