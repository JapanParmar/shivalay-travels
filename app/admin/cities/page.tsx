'use client';
import { useState, useEffect, useRef } from 'react';
import ProtectedPage from '../components/ProtectedPage';
import { LOCAL_CITIES, City, searchCitiesSimple } from '../lib/data';
import { useAdminAuth } from '../lib/AdminAuthContext';
import AdminLoader from '../components/AdminLoader';

const TYPE_COLORS: Record<string, string> = { airport: '#3b82f6', railway: '#f59e0b', bus_stand: '#22c55e', port: '#8b5cf6' };

function CitySearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ name: string; state: string; country: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    if (query.length < 2) { setResults([]); return; }
    timer.current = setTimeout(async () => {
      setLoading(true);
      const res = await searchCitiesSimple(query);
      setResults(res);
      setLoading(false);
    }, 400);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [query]);

  return (
    <div className="city-search-wrap">
      <p className="city-search-label">🔍 Live City Search (Open-Meteo Geocoding API)</p>
      <div className="city-search-input-wrap">
        <input
          className="city-search-input"
          placeholder="Type a city name to search (e.g. Varanasi, Jaipur…)"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        {loading && <span className="city-search-spinner" />}
      </div>
      {results.length > 0 && (
        <div className="city-search-results">
          {results.map((r, i) => (
            <div key={i} className="city-result-item">
              <div className="city-result-name">{r.name}</div>
              <div className="city-result-state">{r.state}{r.country ? `, ${r.country}` : ''}</div>
            </div>
          ))}
          <p className="city-api-badge">Results from: Open-Meteo Geocoding API (free, no key required)</p>
        </div>
      )}
      {query.length >= 2 && !loading && results.length === 0 && (
        <div className="city-no-results">No cities found. Try another query.</div>
      )}
    </div>
  );
}

export default function CitiesPage() {
  const { can } = useAdminAuth();
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('all');
  const [popularOnly, setPopularOnly] = useState(false);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newCity, setNewCity] = useState({ name: '', code: '', state: '', type: 'airport' as City['type'], isPopular: false });

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/cities');
      if (res.ok) {
        const data = await res.json();
        setCities(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = cities.filter(c => {
    const matchType = typeFilter === 'all' || c.type === typeFilter;
    const matchPopular = !popularOnly || c.isPopular;
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase()) || c.state.toLowerCase().includes(search.toLowerCase());
    return matchType && matchPopular && matchSearch;
  });

  const addCity = async () => {
    if (!newCity.name || !newCity.code) return;
    try {
      const res = await fetch('/api/admin/cities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newCity, country: 'India' })
      });
      if (res.ok) {
        const city = await res.json();
        setCities(prev => [...prev, city]);
        setNewCity({ name: '', code: '', state: '', type: 'airport', isPopular: false });
        setShowAdd(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteCity = async (id: string) => {
    if (!can('canDeleteRecords')) return;
    try {
      const res = await fetch(`/api/admin/cities/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setCities(prev => prev.filter(c => c.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const togglePopular = async (id: string) => {
    const city = cities.find(c => c.id === id);
    if (!city) return;
    try {
      const res = await fetch(`/api/admin/cities/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPopular: !city.isPopular })
      });
      if (res.ok) {
        setCities(prev => prev.map(c => c.id === id ? { ...c, isPopular: !c.isPopular } : c));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <ProtectedPage>
        <div style={{ padding: '24px 0' }}>
          <AdminLoader message="Loading routes and location directory..." />
        </div>
      </ProtectedPage>
    );
  }

  return (
    <ProtectedPage>
      <div className="ct-root">
        <div className="ct-header">
          <div>
            <h1 className="ct-title">Cities & Routes</h1>
            <p className="ct-sub">{cities.length} cities in local database</p>
          </div>
          {can('canManageCities') && (
            <button className="ct-add-btn" onClick={() => setShowAdd(s => !s)}>+ Add City</button>
          )}
        </div>

        {/* Live API Search */}
        <CitySearch />

        {/* Add Form */}
        {showAdd && can('canManageCities') && (
          <div className="ct-add-form">
            <h3 className="ct-form-title">Add New City</h3>
            <div className="ct-form-grid">
              <div><label className="ct-lbl">City Name *</label><input className="ct-input" placeholder="Indore" value={newCity.name} onChange={e => setNewCity(p => ({ ...p, name: e.target.value }))} /></div>
              <div><label className="ct-lbl">Code *</label><input className="ct-input" placeholder="IDR" maxLength={5} style={{ textTransform: 'uppercase' }} value={newCity.code} onChange={e => setNewCity(p => ({ ...p, code: e.target.value.toUpperCase() }))} /></div>
              <div><label className="ct-lbl">State</label><input className="ct-input" placeholder="Madhya Pradesh" value={newCity.state} onChange={e => setNewCity(p => ({ ...p, state: e.target.value }))} /></div>
              <div>
                <label className="ct-lbl">Type</label>
                <select className="ct-select" value={newCity.type} onChange={e => setNewCity(p => ({ ...p, type: e.target.value as City['type'] }))}>
                  <option value="airport">Airport</option>
                  <option value="railway">Railway</option>
                  <option value="bus_stand">Bus Stand</option>
                  <option value="port">Port</option>
                </select>
              </div>
            </div>
            <div className="ct-form-footer">
              <label className="ct-checkbox-label">
                <input type="checkbox" checked={newCity.isPopular} onChange={e => setNewCity(p => ({ ...p, isPopular: e.target.checked }))} />
                Mark as Popular
              </label>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="ct-cancel-btn" onClick={() => setShowAdd(false)}>Cancel</button>
                <button className="ct-save-btn" onClick={addCity}>Save City</button>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="ct-filters">
          <input className="ct-search" placeholder="Search city, code, state…" value={search} onChange={e => setSearch(e.target.value)} />
          <select className="ct-select-sm" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
            <option value="all">All Types</option>
            <option value="airport">Airport</option>
            <option value="railway">Railway</option>
            <option value="bus_stand">Bus Stand</option>
            <option value="port">Port</option>
          </select>
          <button className={`ct-popular-btn ${popularOnly ? 'active' : ''}`} onClick={() => setPopularOnly(s => !s)}>
            ★ Popular Only
          </button>
          <span className="ct-count">{filtered.length} cities</span>
        </div>

        {/* Table */}
        <div className="ct-table-wrap">
          <table className="ct-table">
            <thead>
              <tr>
                <th>Code</th><th>City Name</th><th>State</th><th>Type</th>
                <th>Popular</th>{can('canManageCities') && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id}>
                  <td><span className="ct-code">{c.code}</span></td>
                  <td className="ct-name">{c.name}</td>
                  <td className="ct-state">{c.state}</td>
                  <td><span className="ct-type-pill" style={{ color: TYPE_COLORS[c.type], background: `${TYPE_COLORS[c.type]}15`, borderColor: `${TYPE_COLORS[c.type]}30` }}>{c.type.replace('_', ' ')}</span></td>
                  <td>
                    <button className={`ct-star-btn ${c.isPopular ? 'active' : ''}`} onClick={() => can('canManageCities') && togglePopular(c.id)}>
                      {c.isPopular ? '★' : '☆'}
                    </button>
                  </td>
                  {can('canManageCities') && (
                    <td>
                      {can('canDeleteRecords') && (
                        <button className="ct-del-btn" onClick={() => deleteCity(c.id)}>✕</button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="ct-empty">No cities match your filters.</div>}
        </div>
      </div>

      <style>{`
        .ct-root { display: flex; flex-direction: column; gap: 20px; }
        .ct-header { display: flex; align-items: center; justify-content: space-between; }
        .ct-title { font-size: 22px; font-weight: 700; color: #fff; }
        .ct-sub { font-size: 12px; color: #555; margin-top: 2px; }
        .ct-add-btn { background: #ff0000; color: #fff; border: none; border-radius: 8px; padding: 10px 18px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'DM Sans',sans-serif; }

        .city-search-wrap { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 20px; }
        .city-search-label { font-size: 12px; font-weight: 600; color: #666; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
        .city-search-input-wrap { position: relative; }
        .city-search-input { width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 12px 16px; color: #fff; font-size: 14px; outline: none; font-family: 'DM Sans',sans-serif; transition: border-color 0.2s; }
        .city-search-input:focus { border-color: rgba(255,0,0,0.5); }
        .city-search-input::placeholder { color: #444; }
        .city-search-spinner { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; border: 2px solid rgba(255,0,0,0.2); border-top-color: #ff0000; border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: translateY(-50%) rotate(360deg); } }
        .city-search-results { margin-top: 12px; display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 8px; }
        .city-result-item { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 8px; padding: 10px 14px; }
        .city-result-name { font-size: 13px; font-weight: 600; color: #ddd; }
        .city-result-state { font-size: 11px; color: #555; margin-top: 2px; }
        .city-api-badge { grid-column: 1/-1; font-size: 10px; color: #444; margin-top: 4px; text-align: right; }
        .city-no-results { font-size: 13px; color: #444; margin-top: 12px; }

        .ct-add-form { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,0,0,0.15); border-radius: 14px; padding: 24px; }
        .ct-form-title { font-size: 15px; font-weight: 700; color: #fff; margin-bottom: 16px; }
        .ct-form-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 16px; }
        .ct-lbl { display: block; font-size: 11px; color: #555; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px; }
        .ct-input { width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 9px 12px; color: #fff; font-size: 13px; outline: none; font-family: 'DM Sans',sans-serif; }
        .ct-select { width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 9px 12px; color: #aaa; font-size: 13px; outline: none; cursor: pointer; font-family: 'DM Sans',sans-serif; }
        .ct-form-footer { display: flex; align-items: center; justify-content: space-between; }
        .ct-checkbox-label { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #aaa; cursor: pointer; }
        .ct-cancel-btn { background: transparent; border: 1px solid rgba(255,255,255,0.1); color: #666; border-radius: 8px; padding: 8px 16px; font-size: 13px; cursor: pointer; font-family: 'DM Sans',sans-serif; }
        .ct-save-btn { background: #ff0000; color: #fff; border: none; border-radius: 8px; padding: 8px 16px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: 'DM Sans',sans-serif; }

        .ct-filters { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .ct-search { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 8px 14px; color: #fff; font-size: 13px; outline: none; width: 220px; font-family: 'DM Sans',sans-serif; }
        .ct-search::placeholder { color: #444; }
        .ct-search:focus { border-color: rgba(255,0,0,0.3); }
        .ct-select-sm { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 8px 14px; color: #aaa; font-size: 13px; outline: none; cursor: pointer; font-family: 'DM Sans',sans-serif; }
        .ct-popular-btn { background: transparent; border: 1px solid rgba(255,255,255,0.1); color: #666; border-radius: 8px; padding: 8px 14px; font-size: 13px; cursor: pointer; font-family: 'DM Sans',sans-serif; transition: all 0.2s; }
        .ct-popular-btn.active { background: rgba(245,158,11,0.1); border-color: rgba(245,158,11,0.3); color: #f59e0b; }
        .ct-count { font-size: 12px; color: #555; margin-left: auto; }

        .ct-table-wrap { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; overflow-x: auto; }
        .ct-table { width: 100%; border-collapse: collapse; }
        .ct-table th { padding: 12px 16px; text-align: left; font-size: 11px; font-weight: 600; color: #555; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .ct-table td { padding: 13px 16px; font-size: 13px; color: #bbb; border-bottom: 1px solid rgba(255,255,255,0.04); }
        .ct-table tr:last-child td { border-bottom: none; }
        .ct-table tr:hover td { background: rgba(255,255,255,0.02); }
        .ct-code { font-family: monospace; font-weight: 700; color: #ff0000; background: rgba(255,0,0,0.08); padding: 2px 8px; border-radius: 4px; }
        .ct-name { font-weight: 600; color: #ddd; }
        .ct-state { color: #777; font-size: 12px; }
        .ct-type-pill { padding: 2px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; border: 1px solid; text-transform: capitalize; }
        .ct-star-btn { background: transparent; border: none; font-size: 18px; cursor: pointer; color: #444; transition: color 0.2s; }
        .ct-star-btn.active { color: #f59e0b; }
        .ct-del-btn { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.15); color: #ef4444; border-radius: 6px; width: 28px; height: 28px; cursor: pointer; font-size: 13px; }
        .ct-empty { text-align: center; padding: 48px; color: #444; font-size: 13px; }
        @media (max-width: 768px) { .ct-form-grid { grid-template-columns: 1fr 1fr; } }
      `}</style>
    </ProtectedPage>
  );
}
