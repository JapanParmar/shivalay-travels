'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedPage from '../components/ProtectedPage';
import { useAdminAuth } from '../lib/AdminAuthContext';
import AdminLoader from '../components/AdminLoader';

interface DestinationPackage {
  id: string;
  name: string;
  region: string;
  tagline: string;
  duration: string;
  groupSize: string;
  difficulty: string;
  bestSeason: string;
  startingFrom: string;
  tags: string[];
  highlights: string[];
  includes: string[];
  imagePath: string;
}

const DEV_TOKEN = 'shivalay-dev-cms-2026';

export default function DestinationsPage() {
  const router = useRouter();
  const { can, isDev } = useAdminAuth();
  const [packages, setPackages] = useState<DestinationPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Only the developer account may access this page
  useEffect(() => {
    if (!isDev) router.replace('/admin/dashboard');
  }, [isDev, router]);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    region: '',
    tagline: '',
    duration: '',
    groupSize: '2-12',
    difficulty: 'Easy',
    bestSeason: '',
    startingFrom: '₹15,000',
    tags: '',
    highlights: '',
    includes: '',
    imagePath: '/images/kedarnath.png'
  });

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/packages');
      if (res.ok) {
        const data = await res.json();
        setPackages(data);
      }
    } catch (err) {
      console.error('Error fetching packages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (pkg: DestinationPackage) => {
    setEditingId(pkg.id);
    setFormData({
      name: pkg.name,
      region: pkg.region,
      tagline: pkg.tagline,
      duration: pkg.duration,
      groupSize: pkg.groupSize,
      difficulty: pkg.difficulty,
      bestSeason: pkg.bestSeason,
      startingFrom: pkg.startingFrom,
      tags: pkg.tags.join(', '),
      highlights: pkg.highlights.join('\n'),
      includes: pkg.includes.join('\n'),
      imagePath: pkg.imagePath
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this destination package?')) return;
    try {
      const res = await fetch(`/api/admin/packages/${id}`, {
        method: 'DELETE',
        headers: { 'x-dev-token': DEV_TOKEN },
      });
      if (res.ok) {
        fetchPackages();
      } else {
        alert('Failed to delete package.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.region) {
      alert('Please fill name and region.');
      return;
    }

    const payload = {
      name: formData.name,
      region: formData.region,
      tagline: formData.tagline,
      duration: formData.duration,
      groupSize: formData.groupSize,
      difficulty: formData.difficulty,
      bestSeason: formData.bestSeason,
      startingFrom: formData.startingFrom,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      highlights: formData.highlights.split('\n').map(h => h.trim()).filter(Boolean),
      includes: formData.includes.split('\n').map(i => i.trim()).filter(Boolean),
      imagePath: formData.imagePath
    };

    try {
      const url = editingId ? `/api/admin/packages/${editingId}` : '/api/admin/packages';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'x-dev-token': DEV_TOKEN },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setShowForm(false);
        setEditingId(null);
        setFormData({
          name: '',
          region: '',
          tagline: '',
          duration: '',
          groupSize: '2-12',
          difficulty: 'Easy',
          bestSeason: '',
          startingFrom: '₹15,000',
          tags: '',
          highlights: '',
          includes: '',
          imagePath: '/images/kedarnath.png'
        });
        fetchPackages();
      } else {
        alert('Failed to save destination.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = packages.filter(p => {
    const matchSearch = !search || 
      p.name.toLowerCase().includes(search.toLowerCase()) || 
      p.region.toLowerCase().includes(search.toLowerCase()) ||
      p.difficulty.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  return (
    <ProtectedPage>
      <div className="destinations-container">
        <div className="dest-header">
          <div>
            <h2 className="dest-title">Destinations & Packages</h2>
            <p className="dest-subtitle">Manage client-facing tour destinations and pilgrimage itinerary tags</p>
          </div>
          {can('canManageSettings') && !showForm && (
            <button className="dest-add-btn" onClick={() => { setEditingId(null); setShowForm(true); }}>
              + Add Destination
            </button>
          )}
        </div>

        {showForm && (
          <div className="dest-form-card">
            <h3 className="form-card-title">{editingId ? 'Edit Destination Package' : 'Create New Destination'}</h3>
            <form onSubmit={handleSubmit} className="dest-form">
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-lbl">Package Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Chardham Pilgrimage"
                    value={formData.name}
                    onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-lbl">Region / State</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Uttarakhand"
                    value={formData.region}
                    onChange={e => setFormData(p => ({ ...p, region: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-lbl">Duration</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 5 Nights – 6 Days"
                    value={formData.duration}
                    onChange={e => setFormData(p => ({ ...p, duration: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-lbl">Group Size</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 2–12 Travelers"
                    value={formData.groupSize}
                    onChange={e => setFormData(p => ({ ...p, groupSize: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-lbl">Difficulty</label>
                  <select
                    className="form-select"
                    value={formData.difficulty}
                    onChange={e => setFormData(p => ({ ...p, difficulty: e.target.value }))}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Challenging">Challenging</option>
                    <option value="Expedition">Expedition</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-lbl">Best Season</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. May – Oct"
                    value={formData.bestSeason}
                    onChange={e => setFormData(p => ({ ...p, bestSeason: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-lbl">Starting Price</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. ₹18,500"
                    value={formData.startingFrom}
                    onChange={e => setFormData(p => ({ ...p, startingFrom: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-lbl">Image Path</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="/images/kedarnath.png"
                    value={formData.imagePath}
                    onChange={e => setFormData(p => ({ ...p, imagePath: e.target.value }))}
                  />
                </div>
              </div>

              <div className="form-group full-width" style={{ marginTop: 14 }}>
                <label className="form-lbl">Tags (comma-separated)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Spiritual, Adventure, Scenic"
                  value={formData.tags}
                  onChange={e => setFormData(p => ({ ...p, tags: e.target.value }))}
                />
              </div>

              <div className="form-grid" style={{ marginTop: 14 }}>
                <div className="form-group">
                  <label className="form-lbl">Highlights (One item per line)</label>
                  <textarea
                    rows={4}
                    className="form-textarea"
                    placeholder="VIP Darshan at shrine&#10;Private boat ride at Dashashwamedh"
                    value={formData.highlights}
                    onChange={e => setFormData(p => ({ ...p, highlights: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-lbl">Package Inclusions (One item per line)</label>
                  <textarea
                    rows={4}
                    className="form-textarea"
                    placeholder="Premium hotel stays & food&#10;Station/Airport transfers"
                    value={formData.includes}
                    onChange={e => setFormData(p => ({ ...p, includes: e.target.value }))}
                  />
                </div>
              </div>

              <div className="form-group full-width" style={{ marginTop: 14 }}>
                <label className="form-lbl">Short Tagline Description</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Spiritual yatra with divine scenic valley views and VIP arrangements..."
                  value={formData.tagline}
                  onChange={e => setFormData(p => ({ ...p, tagline: e.target.value }))}
                />
              </div>

              <div className="form-actions">
                <button type="button" className="dest-cancel-btn" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="dest-save-btn">
                  {editingId ? 'Save Changes' : 'Create Package'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="dest-search-row">
          <input
            type="text"
            className="dest-search-input"
            placeholder="🔍 Search packages by name, region or difficulty..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <AdminLoader />
        ) : filtered.length === 0 ? (
          <div className="dest-empty">No packages found. Click Add Destination to create one!</div>
        ) : (
          <div className="dest-table-wrap">
            <table className="dest-table">
              <thead>
                <tr>
                  <th>Destination</th>
                  <th>Region</th>
                  <th>Duration</th>
                  <th>Difficulty</th>
                  <th>Price</th>
                  <th>Tags</th>
                  {can('canManageSettings') && <th style={{ textAlign: 'right' }}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filtered.map(pkg => (
                  <tr key={pkg.id}>
                    <td>
                      <div className="dest-info-cell">
                        <span className="dest-info-name">{pkg.name}</span>
                        <span className="dest-info-sub">{pkg.tagline.substring(0, 50)}...</span>
                      </div>
                    </td>
                    <td>{pkg.region}</td>
                    <td>{pkg.duration}</td>
                    <td>
                      <span className={`diff-badge ${pkg.difficulty.toLowerCase()}`}>
                        {pkg.difficulty}
                      </span>
                    </td>
                    <td>{pkg.startingFrom}</td>
                    <td>
                      <div className="tag-pills">
                        {pkg.tags.map((t, idx) => (
                          <span key={idx} className="tag-pill">{t}</span>
                        ))}
                      </div>
                    </td>
                    {can('canManageSettings') && (
                      <td style={{ textAlign: 'right' }}>
                        <div className="action-buttons">
                          <button className="edit-btn" onClick={() => handleEdit(pkg)}>Edit</button>
                          <button className="delete-btn" onClick={() => handleDelete(pkg.id)}>Delete</button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style jsx>{`
        .destinations-container { padding: 8px 4px; }
        .dest-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .dest-title { font-size: 20px; font-weight: 700; color: #fff; margin: 0 0 4px 0; }
        .dest-subtitle { font-size: 13px; color: #666; margin: 0; }
        .dest-add-btn { background: #ff0000; color: #fff; border: none; border-radius: 8px; padding: 10px 18px; font-size: 13px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
        .dest-add-btn:hover { background: #cc0000; }

        .dest-form-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,0,0,0.15); border-radius: 14px; padding: 24px; margin-bottom: 24px; }
        .form-card-title { font-size: 15px; font-weight: 700; color: #fff; margin: 0 0 20px 0; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 10px; }
        .form-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }
        .form-group { display: flex; flex-direction: column; gap: 6px; }
        .form-group.full-width { grid-column: 1 / -1; }
        .form-lbl { font-size: 11px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; }
        .form-input, .form-select, .form-textarea { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 10px 12px; color: #fff; font-size: 13px; outline: none; font-family: inherit; }
        .form-input:focus, .form-select:focus, .form-textarea:focus { border-color: rgba(255,0,0,0.5); }
        .form-textarea { resize: vertical; }
        .form-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 20px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 16px; }
        .dest-cancel-btn { background: transparent; border: 1px solid rgba(255,255,255,0.1); color: #888; border-radius: 8px; padding: 10px 20px; font-size: 13px; cursor: pointer; }
        .dest-save-btn { background: #ff0000; color: #fff; border: none; border-radius: 8px; padding: 10px 20px; font-size: 13px; font-weight: 600; cursor: pointer; }

        .dest-search-row { margin-bottom: 16px; }
        .dest-search-input { width: 100%; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 10px; padding: 12px 16px; color: #fff; font-size: 13px; outline: none; }
        .dest-search-input:focus { border-color: rgba(255,255,255,0.15); }

        .dest-table-wrap { background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; overflow-x: auto; }
        .dest-table { width: 100%; border-collapse: collapse; text-align: left; }
        .dest-table th { padding: 14px 16px; font-size: 11px; font-weight: 600; color: #555; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .dest-table td { padding: 14px 16px; font-size: 13px; color: #bbb; border-bottom: 1px solid rgba(255,255,255,0.04); }
        .dest-table tr:hover td { background: rgba(255,255,255,0.02); }
        .dest-info-cell { display: flex; flex-direction: column; gap: 2px; }
        .dest-info-name { font-weight: 600; color: #fff; }
        .dest-info-sub { font-size: 11px; color: #666; }

        .diff-badge { padding: 2px 8px; border-radius: 10px; font-size: 11px; font-weight: 500; display: inline-block; text-transform: capitalize; }
        .diff-badge.easy { background: rgba(34,197,94,0.1); color: #22c55e; }
        .diff-badge.moderate { background: rgba(245,158,11,0.1); color: #f59e0b; }
        .diff-badge.challenging { background: rgba(239,68,68,0.1); color: #ef4444; }
        .diff-badge.expedition { background: rgba(139,92,246,0.1); color: #8b5cf6; }

        .tag-pills { display: flex; flex-wrap: wrap; gap: 4px; }
        .tag-pill { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 4px; padding: 2px 6px; font-size: 10px; color: #999; }

        .action-buttons { display: flex; justify-content: flex-end; gap: 8px; }
        .edit-btn { background: rgba(59,130,246,0.1); border: 1px solid rgba(59,130,246,0.2); color: #3b82f6; border-radius: 6px; padding: 5px 10px; font-size: 12px; cursor: pointer; }
        .delete-btn { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); color: #ef4444; border-radius: 6px; padding: 5px 10px; font-size: 12px; cursor: pointer; }

        .dest-empty { text-align: center; padding: 48px; color: #666; font-size: 14px; }
      `}</style>
    </ProtectedPage>
  );
}
