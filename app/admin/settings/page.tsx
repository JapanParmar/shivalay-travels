'use client';
import { useState } from 'react';
import ProtectedPage from '../components/ProtectedPage';
import { useAdminAuth } from '../lib/AdminAuthContext';

import { useEffect } from 'react';

export default function SettingsPage() {
  const { can, user } = useAdminAuth();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState({
    businessName: 'Shivalay Travels',
    phone: '+91 93409 94628',
    email: 'info@shivalay.in',
    whatsapp: '919340994628',
    address: 'Indore, Madhya Pradesh, India',
    gstNumber: 'GSTIN23AABCS1234F1Z5',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
    bookingNotifications: true,
    whatsappIntegration: true,
    autoConfirm: false,
    requirePhone: true,
    defaultPassengers: '1',
    defaultClass: 'Economy',
    cityApi: 'open_meteo',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/settings');
      if (res.ok) {
        const data = await res.json();
        if (data) {
          setConfig({
            ...data,
            // Convert numbers 0/1 from MySQL to booleans
            bookingNotifications: Boolean(data.bookingNotifications),
            whatsappIntegration: Boolean(data.whatsappIntegration),
            autoConfirm: Boolean(data.autoConfirm),
            requirePhone: Boolean(data.requirePhone),
            cityApi: data.cityApi || 'open_meteo',
          });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } catch (err) {
      console.error(err);
    }
  };
  const toggle = (key: keyof typeof config) => setConfig(p => ({ ...p, [key]: !p[key as keyof typeof config] }));

  if (!can('canManageSettings')) {
    return (
      <ProtectedPage>
        <div style={{ textAlign: 'center', padding: '80px 24px' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
          <h2 style={{ color: '#fff', fontSize: 20, marginBottom: 8 }}>Access Restricted</h2>
          <p style={{ color: '#666', fontSize: 14 }}>Only Super Admin can access settings. You are logged in as <strong style={{ color: '#fff' }}>{user?.role}</strong>.</p>
        </div>
      </ProtectedPage>
    );
  }

  return (
    <ProtectedPage>
      <div className="st-root">
        <div className="st-header">
          <div>
            <h1 className="st-title">Settings</h1>
            <p className="st-sub">Configure your travel agency platform</p>
          </div>
          <button className={`st-save-btn ${saved ? 'saved' : ''}`} onClick={handleSave}>
            {saved ? '✓ Saved!' : 'Save Changes'}
          </button>
        </div>

        <div className="st-sections">
          {/* Business Info */}
          <div className="st-section">
            <div className="st-section-head">
              <div className="st-section-icon">🏢</div>
              <div>
                <h2 className="st-section-title">Business Information</h2>
                <p className="st-section-sub">Your travel agency details</p>
              </div>
            </div>
            <div className="st-grid">
              {[
                { label: 'Business Name', key: 'businessName' },
                { label: 'Phone', key: 'phone' },
                { label: 'Email', key: 'email' },
                { label: 'WhatsApp Number', key: 'whatsapp' },
                { label: 'Address', key: 'address' },
                { label: 'GST Number', key: 'gstNumber' },
              ].map(f => (
                <div key={f.key} className="st-field">
                  <label className="st-lbl">{f.label}</label>
                  <input
                    className="st-input"
                    value={config[f.key as keyof typeof config] as string}
                    onChange={e => setConfig(p => ({ ...p, [f.key]: e.target.value }))}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Localization */}
          <div className="st-section">
            <div className="st-section-head">
              <div className="st-section-icon">🌍</div>
              <div>
                <h2 className="st-section-title">Localization</h2>
                <p className="st-section-sub">Regional preferences</p>
              </div>
            </div>
            <div className="st-grid">
              <div className="st-field">
                <label className="st-lbl">Currency</label>
                <select className="st-select" value={config.currency} onChange={e => setConfig(p => ({ ...p, currency: e.target.value }))}>
                  <option value="INR">INR — Indian Rupee ₹</option>
                  <option value="USD">USD — US Dollar $</option>
                  <option value="EUR">EUR — Euro €</option>
                </select>
              </div>
              <div className="st-field">
                <label className="st-lbl">Timezone</label>
                <select className="st-select" value={config.timezone} onChange={e => setConfig(p => ({ ...p, timezone: e.target.value }))}>
                  <option value="Asia/Kolkata">Asia/Kolkata (IST UTC+5:30)</option>
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">America/New_York (EST)</option>
                </select>
              </div>
              <div className="st-field">
                <label className="st-lbl">Default Passengers</label>
                <select className="st-select" value={config.defaultPassengers} onChange={e => setConfig(p => ({ ...p, defaultPassengers: e.target.value }))}>
                  {['1','2','3','4','5'].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div className="st-field">
                <label className="st-lbl">Default Class</label>
                <select className="st-select" value={config.defaultClass} onChange={e => setConfig(p => ({ ...p, defaultClass: e.target.value }))}>
                  {['Economy', 'Business', 'First Class', 'AC 3 Tier', 'AC 2 Tier', 'AC Sleeper'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Integrations */}
          <div className="st-section">
            <div className="st-section-head">
              <div className="st-section-icon">⚡</div>
              <div>
                <h2 className="st-section-title">Features & Integrations</h2>
                <p className="st-section-sub">Toggle platform capabilities</p>
              </div>
            </div>
            <div className="st-toggles">
              {[
                { key: 'bookingNotifications', label: 'Booking Notifications', desc: 'Receive alerts for new and updated bookings' },
                { key: 'whatsappIntegration', label: 'WhatsApp Integration', desc: 'Send booking details via WhatsApp' },
                { key: 'autoConfirm', label: 'Auto-Confirm Bookings', desc: 'Automatically confirm new booking requests' },
                { key: 'requirePhone', label: 'Require Phone Number', desc: 'Make phone number mandatory in booking form' },
              ].map(t => (
                <div key={t.key} className="st-toggle-item">
                  <div>
                    <div className="st-toggle-label">{t.label}</div>
                    <div className="st-toggle-desc">{t.desc}</div>
                  </div>
                  <button
                    className={`st-toggle-btn ${config[t.key as keyof typeof config] ? 'on' : 'off'}`}
                    onClick={() => toggle(t.key as keyof typeof config)}
                  >
                    <span className="st-toggle-thumb" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* City API */}
          <div className="st-section">
            <div className="st-section-head">
              <div className="st-section-icon">🗺️</div>
              <div>
                <h2 className="st-section-title">City Autocomplete API</h2>
                <p className="st-section-sub">Configuration for city search</p>
              </div>
            </div>
            <div className="st-api-info">
              <div className="st-api-status">
                <span className="st-api-dot" />
                <span className="st-api-active">
                  Active — {config.cityApi === 'open_meteo' && 'Open-Meteo Geocoding API'}
                  {config.cityApi === 'geodb' && 'GeoDB Cities API'}
                  {config.cityApi === 'local' && 'Local Database'}
                </span>
              </div>
              <p className="st-api-desc">
                {config.cityApi === 'open_meteo' && 'Using Open-Meteo Geocoding API (completely free, no API key required). Supports 3M+ cities worldwide with India-first filtering. Fallback to local database of 30 curated Indian cities.'}
                {config.cityApi === 'geodb' && 'Using GeoDB Cities API on RapidAPI (requires API key). Highly accurate geolocation details.'}
                {config.cityApi === 'local' && 'Using built-in local database of 30 curated Indian cities. Safe, fast, and does not require external network requests.'}
              </p>
              <div className="st-api-cards">
                <div 
                  className={`st-api-card ${config.cityApi === 'open_meteo' ? 'active' : ''}`}
                  onClick={() => setConfig(p => ({ ...p, cityApi: 'open_meteo' }))}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="st-api-card-name">
                    {config.cityApi === 'open_meteo' ? '✓ ' : ''}Open-Meteo Geocoding
                  </div>
                  <div className="st-api-card-desc">Free, no key needed. geocoding-api.open-meteo.com</div>
                </div>
                <div 
                  className={`st-api-card ${config.cityApi === 'geodb' ? 'active' : ''}`}
                  onClick={() => setConfig(p => ({ ...p, cityApi: 'geodb' }))}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="st-api-card-name">
                    {config.cityApi === 'geodb' ? '✓ ' : ''}GeoDB Cities
                  </div>
                  <div className="st-api-card-desc">RapidAPI — requires API key</div>
                </div>
                <div 
                  className={`st-api-card ${config.cityApi === 'local' ? 'active' : ''}`}
                  onClick={() => setConfig(p => ({ ...p, cityApi: 'local' }))}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="st-api-card-name">
                    {config.cityApi === 'local' ? '✓ ' : ''}Local Database
                  </div>
                  <div className="st-api-card-desc">30 curated Indian cities — always available</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .st-root { display: flex; flex-direction: column; gap: 20px; }
        .st-header { display: flex; align-items: center; justify-content: space-between; }
        .st-title { font-size: 22px; font-weight: 700; color: #fff; }
        .st-sub { font-size: 12px; color: #555; margin-top: 2px; }
        .st-save-btn { background: #ff0000; color: #fff; border: none; border-radius: 8px; padding: 10px 20px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'DM Sans',sans-serif; transition: all 0.3s; }
        .st-save-btn.saved { background: #22c55e; }
        .st-sections { display: flex; flex-direction: column; gap: 16px; }
        .st-section { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 24px; }
        .st-section-head { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 20px; }
        .st-section-icon { font-size: 24px; }
        .st-section-title { font-size: 16px; font-weight: 700; color: #fff; }
        .st-section-sub { font-size: 12px; color: #555; margin-top: 2px; }
        .st-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
        .st-field { display: flex; flex-direction: column; gap: 8px; }
        .st-lbl { font-size: 11px; color: #555; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; }
        .st-input { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 10px 12px; color: #fff; font-size: 13px; outline: none; font-family: 'DM Sans',sans-serif; transition: border-color 0.2s; }
        .st-input:focus { border-color: rgba(255,0,0,0.4); }
        .st-select { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 10px 12px; color: #aaa; font-size: 13px; outline: none; cursor: pointer; font-family: 'DM Sans',sans-serif; }
        .st-toggles { display: flex; flex-direction: column; gap: 0; }
        .st-toggle-item { display: flex; align-items: center; justify-content: space-between; padding: 16px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .st-toggle-item:last-child { border-bottom: none; }
        .st-toggle-label { font-size: 14px; font-weight: 600; color: #ddd; margin-bottom: 3px; }
        .st-toggle-desc { font-size: 12px; color: #555; }
        .st-toggle-btn { width: 44px; height: 24px; border-radius: 12px; border: none; cursor: pointer; position: relative; transition: background 0.2s; flex-shrink: 0; }
        .st-toggle-btn.on { background: #ff0000; }
        .st-toggle-btn.off { background: rgba(255,255,255,0.1); }
        .st-toggle-thumb { position: absolute; top: 2px; width: 20px; height: 20px; border-radius: 50%; background: #fff; transition: left 0.2s; box-shadow: 0 1px 4px rgba(0,0,0,0.3); }
        .st-toggle-btn.on .st-toggle-thumb { left: 22px; }
        .st-toggle-btn.off .st-toggle-thumb { left: 2px; }
        .st-api-info { display: flex; flex-direction: column; gap: 14px; }
        .st-api-status { display: flex; align-items: center; gap: 8px; }
        .st-api-dot { width: 8px; height: 8px; border-radius: 50%; background: #22c55e; box-shadow: 0 0 8px #22c55e; animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
        .st-api-active { font-size: 13px; font-weight: 600; color: #22c55e; }
        .st-api-desc { font-size: 13px; color: #666; line-height: 1.6; }
        .st-api-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
        .st-api-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 10px; padding: 14px; }
        .st-api-card.active { border-color: rgba(34,197,94,0.25); background: rgba(34,197,94,0.04); }
        .st-api-card-name { font-size: 13px; font-weight: 600; color: #ddd; margin-bottom: 4px; }
        .st-api-card-desc { font-size: 11px; color: #555; }
        @media (max-width: 900px) { .st-grid { grid-template-columns: 1fr 1fr; } .st-api-cards { grid-template-columns: 1fr; } }
        @media (max-width: 600px) { .st-grid { grid-template-columns: 1fr; } }
      `}</style>
    </ProtectedPage>
  );
}
