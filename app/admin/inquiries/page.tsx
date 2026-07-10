'use client';
import { useState, useEffect, useMemo } from 'react';
import ProtectedPage from '../components/ProtectedPage';
import { useAdminAuth } from '../lib/AdminAuthContext';
import AdminLoader from '../components/AdminLoader';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';

type Inquiry = {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  destinations: string;
  duration: string;
  travelers: number;
  budget: string;
  accommodation: string;
  status: string;
  notes?: string | null;
  createdAt: string;
};

const STATUS_COLORS: Record<string, { border: string; text: string; bg: string }> = {
  pending: { border: 'rgba(245,158,11,0.2)', text: '#f59e0b', bg: 'rgba(245,158,11,0.08)' },
  contacted: { border: 'rgba(59,130,246,0.2)', text: '#3b82f6', bg: 'rgba(59,130,246,0.08)' },
  completed: { border: 'rgba(34,197,94,0.2)', text: '#22c55e', bg: 'rgba(34,197,94,0.08)' },
  cancelled: { border: 'rgba(239,68,68,0.2)', text: '#ef4444', bg: 'rgba(239,68,68,0.08)' },
};

export default function InquiriesPage() {
  const { can } = useAdminAuth();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal editor states
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalForm, setModalForm] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    destinations: '',
    duration: '',
    travelers: 1,
    budget: 'Standard',
    accommodation: '3 Star Hotel',
    status: 'pending',
    notes: '',
  });

  // Table pagination state
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/inquiries');
      if (res.ok) {
        const data = await res.json();
        setInquiries(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setModalForm({
      customerName: inquiry.customerName,
      customerPhone: inquiry.customerPhone,
      customerEmail: inquiry.customerEmail || '',
      destinations: inquiry.destinations,
      duration: inquiry.duration,
      travelers: inquiry.travelers,
      budget: inquiry.budget,
      accommodation: inquiry.accommodation,
      status: inquiry.status,
      notes: inquiry.notes || '',
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInquiry) return;
    try {
      const res = await fetch(`/api/admin/inquiries/${selectedInquiry.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...modalForm,
          travelers: Number(modalForm.travelers),
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setInquiries(prev => prev.map(i => i.id === selectedInquiry.id ? updated : i));
        setShowModal(false);
        setSelectedInquiry(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this custom inquiry?')) return;
    try {
      const res = await fetch(`/api/admin/inquiries/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setInquiries(prev => prev.filter(i => i.id !== id));
        setShowModal(false);
        setSelectedInquiry(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Memoized lists
  const filtered = useMemo(() => {
    return inquiries.filter(item => {
      // Tab filter
      if (activeTab !== 'all' && item.status !== activeTab) return false;

      // Text search
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.customerName.toLowerCase().includes(q);
        const matchesPhone = item.customerPhone.toLowerCase().includes(q);
        const matchesDest = item.destinations.toLowerCase().includes(q);
        const matchesId = item.id.toLowerCase().includes(q);
        return matchesName || matchesPhone || matchesDest || matchesId;
      }
      return true;
    });
  }, [inquiries, activeTab, searchQuery]);

  const tabCounts = useMemo(() => {
    return {
      all: inquiries.length,
      pending: inquiries.filter(i => i.status === 'pending').length,
      contacted: inquiries.filter(i => i.status === 'contacted').length,
      completed: inquiries.filter(i => i.status === 'completed').length,
      cancelled: inquiries.filter(i => i.status === 'cancelled').length,
    };
  }, [inquiries]);

  // Columns definition
  const columns = useMemo<ColumnDef<Inquiry>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'Inquiry ID',
        cell: info => <span className="bk-id">{info.getValue() as string}</span>,
      },
      {
        accessorKey: 'customerName',
        header: 'Customer Detail',
        cell: info => {
          const row = info.row.original;
          const initials = row.customerName
            .split(' ')
            .map(w => w[0])
            .join('')
            .slice(0, 2)
            .toUpperCase();
          return (
            <div className="bk-customer">
              <div className="bk-avatar">{initials}</div>
              <div>
                <div className="bk-name">{row.customerName}</div>
                <div className="bk-phone">{row.customerPhone}</div>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: 'destinations',
        header: 'Destinations Chosen',
        cell: info => <span className="bk-route">{info.getValue() as string}</span>,
      },
      {
        accessorKey: 'travelers',
        header: 'Duration & Travelers',
        cell: info => {
          const row = info.row.original;
          return (
            <div>
              <div style={{ color: '#fff', fontSize: 13, fontWeight: 500 }}>{row.duration}</div>
              <div style={{ color: '#555', fontSize: 11 }}>{row.travelers} Traveler(s)</div>
            </div>
          );
        },
      },
      {
        accessorKey: 'budget',
        header: 'Stay Preferences',
        cell: info => {
          const row = info.row.original;
          return (
            <div>
              <div style={{ color: '#aaa', fontSize: 12 }}>Budget: {row.budget}</div>
              <div style={{ color: '#777', fontSize: 11 }}>Stay: {row.accommodation}</div>
            </div>
          );
        },
      },
      {
        accessorKey: 'createdAt',
        header: 'Date Created',
        cell: info => {
          const val = info.getValue() as string;
          try {
            return <span className="bk-date">{new Date(val).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>;
          } catch {
            return <span className="bk-date">{val}</span>;
          }
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: info => {
          const status = info.getValue() as string;
          const colors = STATUS_COLORS[status] || { border: 'rgba(255,255,255,0.1)', text: '#aaa', bg: 'rgba(255,255,255,0.02)' };
          return (
            <span
              className="bk-status"
              style={{
                borderColor: colors.border,
                color: colors.text,
                background: colors.bg,
              }}
            >
              {status}
            </span>
          );
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: info => {
          const row = info.row.original;
          return (
            <button className="bk-edit-btn" onClick={() => handleOpenEdit(row)}>
              Edit / Manage
            </button>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: filtered,
    columns,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (loading) {
    return (
      <ProtectedPage>
        <div style={{ padding: '24px 0' }}>
          <AdminLoader message="Loading custom pilgrimage journey briefs..." />
        </div>
      </ProtectedPage>
    );
  }

  // Pre-fill WhatsApp link logic
  const whatsappLink = selectedInquiry
    ? `https://wa.me/${selectedInquiry.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
        `Hello ${selectedInquiry.customerName}! This is Shivalay Travels. We have received your pilgrimage/custom travel inquiry for: ${selectedInquiry.destinations} (${selectedInquiry.duration}). Let's discuss details and plan your journey!`
      )}`
    : '#';

  return (
    <ProtectedPage>
      <div className="bk-root">
        <div className="bk-header">
          <div>
            <h1 className="bk-title">Journey Planner Inquiries</h1>
            <p className="bk-sub">Manage custom yatra briefs, destination packages, and WhatsApp lead interactions</p>
          </div>
        </div>

        {/* Filter bar */}
        <div className="bk-filters">
          <div className="bk-status-tabs">
            {(['all', 'pending', 'contacted', 'completed', 'cancelled'] as const).map(tab => {
              const count = tabCounts[tab];
              return (
                <button
                  key={tab}
                  className={`bk-tab ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab(tab);
                    table.setPageIndex(0);
                  }}
                >
                  <span style={{ textTransform: 'capitalize' }}>{tab}</span>
                  <span className="bk-tab-count">{count}</span>
                </button>
              );
            })}
          </div>

          <div className="bk-right-filters">
            <input
              type="text"
              className="bk-search"
              placeholder="Search name, phone, route..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                table.setPageIndex(0);
              }}
            />
          </div>
        </div>

        {/* Table representation */}
        <div className="bk-table-wrap">
          <table className="bk-table">
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : (
                        <div
                          className={header.column.getCanSort() ? 'bk-header-sortable' : ''}
                          onClick={header.column.getToggleSortingHandler()}
                          style={{
                            cursor: header.column.getCanSort() ? 'pointer' : 'default',
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: ' ⬆️',
                            desc: ' ⬇️',
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="bk-empty">No inquiries found matching filters.</div>}
        </div>

        {/* Pagination controls */}
        <div className="bk-pagination">
          <div className="bk-pagination-left">
            Showing {table.getRowModel().rows.length} of {filtered.length} records (Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1})
          </div>
          <div className="bk-pagination-right">
            <button
              className="bk-page-btn"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </button>
            <button
              className="bk-page-btn"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </button>
            <select
              className="bk-page-select"
              value={table.getState().pagination.pageSize}
              onChange={e => {
                table.setPageSize(Number(e.target.value));
              }}
            >
              {[5, 10, 20, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Modal Editor */}
        {showModal && selectedInquiry && (
          <div className="modal-overlay" onClick={() => { setShowModal(false); setSelectedInquiry(null); }}>
            <form className="modal-box" onClick={e => e.stopPropagation()} onSubmit={handleSave}>
              <div className="modal-head">
                <span className="modal-title">Manage Inquiry: {selectedInquiry.id}</span>
                <button type="button" className="modal-close" onClick={() => { setShowModal(false); setSelectedInquiry(null); }}>✕</button>
              </div>

              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-lbl">Customer Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={modalForm.customerName}
                      onChange={e => setModalForm(prev => ({ ...prev, customerName: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-lbl">WhatsApp Phone</label>
                    <input
                      type="text"
                      className="form-input"
                      value={modalForm.customerPhone}
                      onChange={e => setModalForm(prev => ({ ...prev, customerPhone: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-lbl">Email Address</label>
                    <input
                      type="email"
                      className="form-input"
                      value={modalForm.customerEmail}
                      onChange={e => setModalForm(prev => ({ ...prev, customerEmail: e.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-lbl">Destinations</label>
                    <input
                      type="text"
                      className="form-input"
                      value={modalForm.destinations}
                      onChange={e => setModalForm(prev => ({ ...prev, destinations: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-lbl">Duration</label>
                    <input
                      type="text"
                      className="form-input"
                      value={modalForm.duration}
                      onChange={e => setModalForm(prev => ({ ...prev, duration: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-lbl">Travelers Count</label>
                    <input
                      type="number"
                      className="form-input"
                      value={modalForm.travelers}
                      onChange={e => setModalForm(prev => ({ ...prev, travelers: Number(e.target.value) }))}
                      min={1}
                      required
                    />
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-lbl">Budget Category</label>
                    <select
                      className="form-select"
                      value={modalForm.budget}
                      onChange={e => setModalForm(prev => ({ ...prev, budget: e.target.value }))}
                    >
                      <option value="Budget">Budget</option>
                      <option value="Standard">Standard</option>
                      <option value="Premium">Premium</option>
                      <option value="Luxury">Luxury</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-lbl">Stay Standard</label>
                    <select
                      className="form-select"
                      value={modalForm.accommodation}
                      onChange={e => setModalForm(prev => ({ ...prev, accommodation: e.target.value }))}
                    >
                      <option value="Homestay / Dharamshala">Homestay / Dharamshala</option>
                      <option value="2 Star Hotel">2 Star Hotel</option>
                      <option value="3 Star Hotel">3 Star Hotel</option>
                      <option value="4 Star Hotel">4 Star Hotel</option>
                      <option value="5 Star Hotel">5 Star Hotel</option>
                    </select>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-lbl">Inquiry Status</label>
                    <select
                      className="form-select"
                      value={modalForm.status}
                      onChange={e => setModalForm(prev => ({ ...prev, status: e.target.value }))}
                    >
                      <option value="pending">Pending</option>
                      <option value="contacted">Contacted</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ justifyContent: 'center' }}>
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="form-whatsapp-btn"
                      style={{ marginTop: 16, textAlign: 'center', justifyContent: 'center' }}
                    >
                      💬 Contact on WhatsApp
                    </a>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-lbl">Journey Planner Brief & Notes</label>
                  <textarea
                    rows={4}
                    className="form-textarea"
                    value={modalForm.notes}
                    onChange={e => setModalForm(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Enter itinerary draft, prices, customized options here..."
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                  {can('canManageUsers') ? (
                    <button
                      type="button"
                      className="modal-delete-btn-inline"
                      onClick={() => handleDelete(selectedInquiry.id)}
                    >
                      Delete Inquiry Permanently
                    </button>
                  ) : (
                    <div />
                  )}
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button type="button" className="form-cancel-btn" onClick={() => { setShowModal(false); setSelectedInquiry(null); }}>Cancel</button>
                    <button type="submit" className="form-save-btn">Save Changes</button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>

      <style>{`
        .bk-root { display: flex; flex-direction: column; gap: 20px; }
        .bk-header { display: flex; align-items: center; justify-content: space-between; }
        .bk-title { font-size: 22px; font-weight: 700; color: #fff; }
        .bk-sub { font-size: 12px; color: #555; margin-top: 2px; }
        .bk-filters { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
        .bk-status-tabs { display: flex; gap: 4px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 10px; padding: 4px; }
        .bk-tab { display: flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 6px; background: transparent; border: none; color: #666; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: 'DM Sans',sans-serif; }
        .bk-tab.active { background: rgba(255,0,0,0.1); color: #ff0000; }
        .bk-tab-count { background: rgba(255,255,255,0.08); border-radius: 10px; padding: 1px 6px; font-size: 10px; }
        .bk-right-filters { display: flex; gap: 10px; }
        .bk-search { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 8px 14px; color: #fff; font-size: 13px; outline: none; width: 220px; font-family: 'DM Sans',sans-serif; }
        .bk-search::placeholder { color: #444; }
        .bk-search:focus { border-color: rgba(255,0,0,0.4); }
        .bk-table-wrap { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; overflow-x: auto; }
        .bk-table { width: 100%; border-collapse: collapse; }
        .bk-table th { padding: 12px 16px; text-align: left; font-size: 11px; font-weight: 600; color: #555; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid rgba(255,255,255,0.06); white-space: nowrap; }
        .bk-table td { padding: 14px 16px; font-size: 13px; color: #bbb; border-bottom: 1px solid rgba(255,255,255,0.04); white-space: nowrap; vertical-align: middle; }
        .bk-table tr:last-child td { border-bottom: none; }
        .bk-table tr:hover td { background: rgba(255,255,255,0.02); }
        .bk-header-sortable { color: #666; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
        .bk-header-sortable:hover { color: #fff; }
        .bk-id { font-family: monospace; color: #ff0000; background: rgba(255,0,0,0.08); padding: 2px 8px; border-radius: 4px; font-size: 11px; }
        .bk-customer { display: flex; align-items: center; gap: 10px; }
        .bk-avatar { width: 32px; height: 32px; border-radius: 8px; background: rgba(255,255,255,0.02); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; flex-shrink: 0; }
        .bk-name { font-size: 13px; font-weight: 600; color: #ddd; }
        .bk-phone { font-size: 11px; color: #555; }
        .bk-route { color: #888; font-size: 13px; font-weight: 500; }
        .bk-date { color: #777; }
        .bk-status { padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; border: 1px solid; text-transform: capitalize; }
        .bk-edit-btn { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); color: #aaa; border-radius: 6px; padding: 5px 12px; font-size: 12px; cursor: pointer; transition: all 0.2s; font-family: 'DM Sans',sans-serif; }
        .bk-edit-btn:hover { border-color: rgba(255,0,0,0.4); color: #ff0000; background: rgba(255,0,0,0.05); }
        .bk-empty { text-align: center; padding: 48px; color: #444; font-size: 13px; }
        
        .bk-pagination { display: flex; align-items: center; justify-content: space-between; margin-top: 16px; padding: 12px 16px; background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.06); border-radius: 10px; }
        .bk-pagination-left { font-size: 12px; color: #555; }
        .bk-pagination-right { display: flex; align-items: center; gap: 8px; }
        .bk-page-btn { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); color: #ccc; border-radius: 6px; padding: 5px 12px; font-size: 12px; cursor: pointer; transition: all 0.2s; font-family: 'DM Sans',sans-serif; }
        .bk-page-btn:hover:not(:disabled) { border-color: rgba(255,0,0,0.4); color: #ff0000; background: rgba(255,0,0,0.05); }
        .bk-page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .bk-page-select { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 6px; padding: 5px 10px; color: #aaa; font-size: 12px; cursor: pointer; font-family: 'DM Sans',sans-serif; outline: none; }
        .bk-page-select option { background: #111; color: #fff; }

        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); display: flex; align-items: center; justify-content: center; z-index: 999; padding: 20px; backdrop-filter: blur(4px); }
        .modal-box { background: #0c0c0c; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; width: 100%; max-width: 580px; overflow: hidden; animation: modalIn 0.2s ease; box-shadow: 0 20px 50px rgba(0,0,0,0.5); }
        @keyframes modalIn { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: none; } }
        .modal-head { display: flex; align-items: center; justify-content: space-between; padding: 18px 24px; border-bottom: 1px solid rgba(255,255,255,0.07); background: rgba(255,255,255,0.01); }
        .modal-title { font-size: 15px; font-weight: 700; color: #fff; }
        .modal-close { background: rgba(255,255,255,0.06); border: none; color: #aaa; width: 28px; height: 28px; border-radius: 6px; cursor: pointer; font-size: 13px; }
        .modal-body { padding: 24px; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .form-group { display: flex; flex-direction: column; gap: 6px; }
        .form-lbl { font-size: 11px; color: #555; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
        .form-input, .form-select, .form-textarea { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 8px 12px; color: #fff; font-size: 13px; outline: none; font-family: 'DM Sans',sans-serif; width: 100%; }
        .form-input:focus, .form-select:focus, .form-textarea:focus { border-color: rgba(255,0,0,0.4); background: rgba(255,255,255,0.05); }
        .form-select option { background: #111; color: #fff; }
        .form-save-btn { background: #ff0000; color: #fff; border: none; border-radius: 8px; padding: 10px 20px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: 'DM Sans',sans-serif; }
        .form-save-btn:hover { background: #cc0000; }
        .form-cancel-btn { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #ccc; border-radius: 8px; padding: 10px 20px; font-size: 13px; cursor: pointer; transition: all 0.2s; font-family: 'DM Sans',sans-serif; }
        .form-cancel-btn:hover { background: rgba(255,255,255,0.1); }
        .form-whatsapp-btn { display: inline-flex; align-items: center; gap: 6px; background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.3); color: #22c55e; border-radius: 8px; padding: 8px 14px; font-size: 12px; font-weight: 600; text-decoration: none; cursor: pointer; transition: all 0.2s; font-family: 'DM Sans',sans-serif; }
        .form-whatsapp-btn:hover { background: rgba(34,197,94,0.2); }
        .modal-delete-btn-inline { background: transparent; border: none; color: #ef4444; font-size: 12px; cursor: pointer; text-decoration: underline; padding: 0; }
        .modal-delete-btn-inline:hover { color: #ff6b6b; }
      `}</style>
    </ProtectedPage>
  );
}
