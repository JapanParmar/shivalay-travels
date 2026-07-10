'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedPage from '../components/ProtectedPage';
import { useAdminAuth } from '../lib/AdminAuthContext';
import AdminLoader from '../components/AdminLoader';

interface TravelGuide {
  id: string;
  category: string;
  title: string;
  readTime: string;
  badge: string | null;
  image: string;
  icon: string;
}

const DEV_TOKEN = 'shivalay-dev-cms-2026';

export default function GuidesPage() {
  const router = useRouter();
  const { can, isDev } = useAdminAuth();
  const [guides, setGuides] = useState<TravelGuide[]>([]);
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
    category: 'Destination Intel',
    title: '',
    readTime: '6 min read',
    badge: '',
    image: '/images/ladakh.png',
    icon: '🏔️'
  });

  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/guides');
      if (res.ok) {
        const data = await res.json();
        setGuides(data);
      }
    } catch (err) {
      console.error('Error fetching guides:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (guide: TravelGuide) => {
    setEditingId(guide.id);
    setFormData({
      category: guide.category,
      title: guide.title,
      readTime: guide.readTime,
      badge: guide.badge || '',
      image: guide.image,
      icon: guide.icon
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this travel guide article?')) return;
    try {
      const res = await fetch(`/api/admin/guides/${id}`, {
        method: 'DELETE',
        headers: { 'x-dev-token': DEV_TOKEN },
      });
      if (res.ok) {
        fetchGuides();
      } else {
        alert('Failed to delete guide.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.category) {
      alert('Please fill category and title.');
      return;
    }

    const payload = {
      category: formData.category,
      title: formData.title,
      readTime: formData.readTime,
      badge: formData.badge || null,
      image: formData.image,
      icon: formData.icon
    };

    try {
      const url = editingId ? `/api/admin/guides/${editingId}` : '/api/admin/guides';
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
          category: 'Destination Intel',
          title: '',
          readTime: '6 min read',
          badge: '',
          image: '/images/ladakh.png',
          icon: '🏔️'
        });
        fetchGuides();
      } else {
        alert('Failed to save guide article.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = guides.filter(g => {
    const matchSearch = !search || 
      g.title.toLowerCase().includes(search.toLowerCase()) || 
      g.category.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  return (
    <ProtectedPage>
      <div className="guides-container">
        <div className="guide-header">
          <div>
            <h2 className="guide-title">Travel Guides & Intel</h2>
            <p className="guide-subtitle">Manage blogs, checklists, and cultural rules displayed in the Travel Intelligence section</p>
          </div>
          {can('canManageSettings') && !showForm && (
            <button className="guide-add-btn" onClick={() => { setEditingId(null); setShowForm(true); }}>
              + Create Article
            </button>
          )}
        </div>

        {showForm && (
          <div className="guide-form-card">
            <h3 className="form-card-title">{editingId ? 'Edit Travel Guide Article' : 'Create New Guide Article'}</h3>
            <form onSubmit={handleSubmit} className="guide-form">
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-lbl">Category</label>
                  <select
                    className="form-select"
                    value={formData.category}
                    onChange={e => setFormData(p => ({ ...p, category: e.target.value }))}
                  >
                    <option value="Packing Guide">Packing Guide</option>
                    <option value="Destination Intel">Destination Intel</option>
                    <option value="Health & Safety">Health & Safety</option>
                    <option value="Culture">Culture</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-lbl">Read Time</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 7 min read"
                    value={formData.readTime}
                    onChange={e => setFormData(p => ({ ...p, readTime: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-lbl">Badge Label (optional)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Popular, Insider, New"
                    value={formData.badge}
                    onChange={e => setFormData(p => ({ ...p, badge: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-lbl">Emoji Icon</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 🏔️, ❄️, 📋"
                    value={formData.icon}
                    onChange={e => setFormData(p => ({ ...p, icon: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group full-width">
                  <label className="form-lbl">Image Path</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="/images/ladakh.png"
                    value={formData.image}
                    onChange={e => setFormData(p => ({ ...p, image: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group full-width">
                  <label className="form-lbl">Article Title</label>
                  <textarea
                    rows={2}
                    className="form-textarea"
                    placeholder="The ultimate cold desert packing checklist for Ladakh..."
                    value={formData.title}
                    onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="guide-cancel-btn" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="guide-save-btn">
                  {editingId ? 'Save Changes' : 'Create Article'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="guide-search-row">
          <input
            type="text"
            className="guide-search-input"
            placeholder="🔍 Search articles by title or category..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <AdminLoader />
        ) : filtered.length === 0 ? (
          <div className="guide-empty">No travel intelligence guides found. Click Create Article to write one!</div>
        ) : (
          <div className="guide-table-wrap">
            <table className="guide-table">
              <thead>
                <tr>
                  <th style={{ width: '40px' }}>Icon</th>
                  <th>Article Title</th>
                  <th>Category</th>
                  <th>Read Time</th>
                  <th>Badge</th>
                  {can('canManageSettings') && <th style={{ textAlign: 'right' }}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filtered.map(g => (
                  <tr key={g.id}>
                    <td style={{ fontSize: '18px', textAlign: 'center' }}>{g.icon}</td>
                    <td>
                      <div className="guide-title-cell">
                        <span className="guide-title-text">{g.title}</span>
                        <span className="guide-title-sub">Image: {g.image}</span>
                      </div>
                    </td>
                    <td>{g.category}</td>
                    <td>{g.readTime}</td>
                    <td>
                      {g.badge ? (
                        <span className="badge-pill">{g.badge}</span>
                      ) : (
                        <span style={{ color: '#555' }}>—</span>
                      )}
                    </td>
                    {can('canManageSettings') && (
                      <td style={{ textAlign: 'right' }}>
                        <div className="action-buttons">
                          <button className="edit-btn" onClick={() => handleEdit(g)}>Edit</button>
                          <button className="delete-btn" onClick={() => handleDelete(g.id)}>Delete</button>
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
        .guides-container { padding: 8px 4px; }
        .guide-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .guide-title { font-size: 20px; font-weight: 700; color: #fff; margin: 0 0 4px 0; }
        .guide-subtitle { font-size: 13px; color: #666; margin: 0; }
        .guide-add-btn { background: #ff0000; color: #fff; border: none; border-radius: 8px; padding: 10px 18px; font-size: 13px; font-weight: 600; cursor: pointer; transition: background 0.2s; }
        .guide-add-btn:hover { background: #cc0000; }

        .guide-form-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,0,0,0.15); border-radius: 14px; padding: 24px; margin-bottom: 24px; }
        .form-card-title { font-size: 15px; font-weight: 700; color: #fff; margin: 0 0 20px 0; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 10px; }
        .form-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }
        .form-group { display: flex; flex-direction: column; gap: 6px; }
        .form-group.full-width { grid-column: 1 / -1; }
        .form-lbl { font-size: 11px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; }
        .form-input, .form-select, .form-textarea { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 10px 12px; color: #fff; font-size: 13px; outline: none; font-family: inherit; }
        .form-input:focus, .form-select:focus, .form-textarea:focus { border-color: rgba(255,0,0,0.5); }
        .form-textarea { resize: vertical; }
        .form-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 20px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 16px; }
        .guide-cancel-btn { background: transparent; border: 1px solid rgba(255,255,255,0.1); color: #888; border-radius: 8px; padding: 10px 20px; font-size: 13px; cursor: pointer; }
        .guide-save-btn { background: #ff0000; color: #fff; border: none; border-radius: 8px; padding: 10px 20px; font-size: 13px; font-weight: 600; cursor: pointer; }

        .guide-search-row { margin-bottom: 16px; }
        .guide-search-input { width: 100%; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 10px; padding: 12px 16px; color: #fff; font-size: 13px; outline: none; }
        .guide-search-input:focus { border-color: rgba(255,255,255,0.15); }

        .guide-table-wrap { background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; overflow-x: auto; }
        .guide-table { width: 100%; border-collapse: collapse; text-align: left; }
        .guide-table th { padding: 14px 16px; font-size: 11px; font-weight: 600; color: #555; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .guide-table td { padding: 14px 16px; font-size: 13px; color: #bbb; border-bottom: 1px solid rgba(255,255,255,0.04); }
        .guide-table tr:hover td { background: rgba(255,255,255,0.02); }
        .guide-title-cell { display: flex; flex-direction: column; gap: 2px; }
        .guide-title-text { font-weight: 600; color: #fff; }
        .guide-title-sub { font-size: 11px; color: #666; }

        .badge-pill { background: rgba(255,0,0,0.1); border: 1px solid rgba(255,0,0,0.2); color: #ff0000; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 600; }

        .action-buttons { display: flex; justify-content: flex-end; gap: 8px; }
        .edit-btn { background: rgba(59,130,246,0.1); border: 1px solid rgba(59,130,246,0.2); color: #3b82f6; border-radius: 6px; padding: 5px 10px; font-size: 12px; cursor: pointer; }
        .delete-btn { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); color: #ef4444; border-radius: 6px; padding: 5px 10px; font-size: 12px; cursor: pointer; }

        .guide-empty { text-align: center; padding: 48px; color: #666; font-size: 14px; }
      `}</style>
    </ProtectedPage>
  );
}
