'use client';
import { useState, useEffect, useMemo } from 'react';
import ProtectedPage from '../components/ProtectedPage';
import { BookingStatus, Booking } from '../lib/data';
import { useAdminAuth } from '../lib/AdminAuthContext';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  ColumnDef,
  flexRender,
  SortingState,
} from '@tanstack/react-table';

const STATUS_COLORS: Record<BookingStatus, string> = {
  confirmed: '#22c55e', pending: '#f59e0b', cancelled: '#ef4444', completed: '#3b82f6',
};

const STATUSES: BookingStatus[] = ['pending', 'confirmed', 'completed', 'cancelled'];
const TRAVEL_TYPES = ['flight', 'train', 'bus', 'cruise'];

export default function BookingsPage() {
  const { can } = useAdminAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<BookingStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Booking | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // Form State
  const [formState, setFormState] = useState({
    customerName: '',
    customerPhone: '',
    fromCity: '',
    toCity: '',
    date: '',
    classType: '',
    passengers: 1,
    amount: 0,
    status: 'pending' as BookingStatus,
    notes: '',
    travelType: 'flight'
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/bookings');
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setSelected(null);
    setFormState({
      customerName: '',
      customerPhone: '',
      fromCity: '',
      toCity: '',
      date: new Date().toISOString().split('T')[0],
      classType: 'Economy',
      passengers: 1,
      amount: 0,
      status: 'pending',
      notes: '',
      travelType: 'flight'
    });
    setShowModal(true);
  };

  const openEdit = (b: Booking) => {
    setSelected(b);
    setFormState({
      customerName: b.customerName || '',
      customerPhone: b.customerPhone || '',
      fromCity: b.from || b.fromCity || '',
      toCity: b.to || b.toCity || '',
      date: b.date || '',
      classType: b.classType || '',
      passengers: b.passengers || 1,
      amount: b.amount || 0,
      status: b.status || 'pending',
      notes: b.notes || '',
      travelType: b.travelType || 'flight'
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selected) {
        // Update
        const res = await fetch(`/api/admin/bookings/${selected.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formState)
        });
        if (res.ok) {
          const updated = await res.json();
          setBookings(prev => prev.map(b => b.id === selected.id ? updated : b));
        }
      } else {
        // Create
        const res = await fetch(`/api/admin/bookings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formState)
        });
        if (res.ok) {
          const created = await res.json();
          setBookings(prev => [created, ...prev]);
        }
      }
      setShowModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteBooking = async (id: string) => {
    if (!can('canDeleteRecords')) return;
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setBookings(prev => prev.filter(b => b.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
    setShowModal(false);
  };

  const counts = {
    all: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length
  };

  const filtered = useMemo(() => {
    return bookings.filter(b => {
      const matchStatus = filter === 'all' || b.status === filter;
      const matchType = typeFilter === 'all' || b.travelType === typeFilter;
      const fromCity = b.from || b.fromCity || '';
      const toCity = b.to || b.toCity || '';
      const matchSearch = !search || 
        b.customerName.toLowerCase().includes(search.toLowerCase()) ||
        b.id.toLowerCase().includes(search.toLowerCase()) || 
        fromCity.toLowerCase().includes(search.toLowerCase()) || 
        toCity.toLowerCase().includes(search.toLowerCase());
      return matchStatus && matchType && matchSearch;
    });
  }, [bookings, filter, typeFilter, search]);

  // TanStack React Table columns definition
  const columns = useMemo<ColumnDef<Booking>[]>(() => [
    {
      accessorKey: 'id',
      header: 'ID',
      cell: info => <span className="bk-id">{String(info.getValue())}</span>,
    },
    {
      accessorKey: 'customerName',
      header: 'Customer Details',
      cell: info => {
        const row = info.row.original;
        return (
          <div className="bk-customer">
            <div className="bk-avatar" style={{ 
              border: `1px solid ${Number(row.amount) > 0 ? '#22c55e44' : '#ef444444'}`, 
              color: Number(row.amount) > 0 ? '#22c55e' : '#ef4444' 
            }}>
              {row.customerName ? row.customerName[0].toUpperCase() : '?'}
            </div>
            <div>
              <div className="bk-name">{row.customerName || 'Guest Traveller'}</div>
              <div className="bk-phone">{row.customerPhone || 'No Phone'}</div>
            </div>
          </div>
        );
      }
    },
    {
      header: 'Route / Journey',
      accessorFn: row => `${row.fromCity || row.from || ''} → ${row.toCity || row.to || ''}`,
      cell: info => {
        const row = info.row.original;
        return (
          <span className="bk-route">
            {(row.from || row.fromCity || 'Anywhere')} → {(row.to || row.toCity || 'Anywhere')}
          </span>
        );
      }
    },
    {
      accessorKey: 'travelType',
      header: 'Type',
      cell: info => {
        const type = String(info.getValue());
        return (
          <span className="bk-type">
            {type === 'flight' ? '✈️' : type === 'train' ? '🚆' : type === 'bus' ? '🚌' : '🚢'} 
            <span style={{ marginLeft: 6, textTransform: 'capitalize' }}>{type}</span>
          </span>
        );
      }
    },
    {
      accessorKey: 'date',
      header: 'Travel Date',
      cell: info => {
        const dateVal = String(info.getValue());
        return dateVal ? new Date(dateVal).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
      }
    },
    {
      accessorKey: 'passengers',
      header: 'Pax',
    },
    {
      accessorKey: 'amount',
      header: 'Price (₹)',
      cell: info => {
        const val = Number(info.getValue());
        return (
          <span className="bk-amount" style={{ color: val > 0 ? '#22c55e' : '#ef4444' }}>
            {val > 0 ? `₹${val.toLocaleString('en-IN')}` : 'Needs Quote'}
          </span>
        );
      }
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: info => {
        const status = info.getValue() as BookingStatus;
        return (
          <span className="bk-status" style={{ background: `${STATUS_COLORS[status]}15`, color: STATUS_COLORS[status], borderColor: `${STATUS_COLORS[status]}30` }}>
            {status}
          </span>
        );
      }
    },
    {
      id: 'actions',
      header: 'Action',
      cell: info => {
        const row = info.row.original;
        return can('canManageBookings') ? (
          <button className="bk-edit-btn" onClick={() => openEdit(row)}>
            Edit Entry
          </button>
        ) : null;
      }
    }
  ], [can]);

  // TanStack Table Instance
  const table = useReactTable({
    data: filtered,
    columns,
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <ProtectedPage>
      <div className="bk-root">
        <div className="bk-header">
          <div>
            <h1 className="bk-title">Bookings Manager</h1>
            <p className="bk-sub">{filtered.length} of {bookings.length} total entries</p>
          </div>
          {can('canManageBookings') && (
            <button className="bk-add-btn" onClick={openCreate}>
              + Add Custom Booking
            </button>
          )}
        </div>

        {/* Filter bar */}
        <div className="bk-filters">
          <div className="bk-status-tabs">
            {(['all', ...STATUSES] as const).map(s => (
              <button key={s} className={`bk-tab ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>
                {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
                <span className="bk-tab-count">{counts[s]}</span>
              </button>
            ))}
          </div>
          <div className="bk-right-filters">
            <input 
              className="bk-search" 
              placeholder="Search name, phone, city..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
            />
            <select className="bk-select" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
              <option value="all">All Types</option>
              <option value="flight">✈️ Flight</option>
              <option value="train">🚆 Train</option>
              <option value="bus">🚌 Bus</option>
              <option value="cruise">🚢 Cruise</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bk-table-wrap">
          <table className="bk-table">
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        <div
                          {...{
                            className: header.column.getCanSort() ? 'bk-header-sortable' : '',
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
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
          {filtered.length === 0 && <div className="bk-empty">No bookings found matching filters.</div>}
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
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <form className="modal-box" onClick={e => e.stopPropagation()} onSubmit={handleSave}>
              <div className="modal-head">
                <h3 className="modal-title">{selected ? `Manage Booking: ${selected.id}` : 'Create Custom Booking'}</h3>
                <button type="button" className="modal-close" onClick={() => setShowModal(false)}>✕</button>
              </div>
              
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-lbl">Customer Name</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      required 
                      value={formState.customerName}
                      onChange={e => setFormState(prev => ({ ...prev, customerName: e.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-lbl">WhatsApp / Phone</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      required 
                      value={formState.customerPhone}
                      onChange={e => setFormState(prev => ({ ...prev, customerPhone: e.target.value }))}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-lbl">From City / Station</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      required 
                      value={formState.fromCity}
                      onChange={e => setFormState(prev => ({ ...prev, fromCity: e.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-lbl">To City / Destination</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      required 
                      value={formState.toCity}
                      onChange={e => setFormState(prev => ({ ...prev, toCity: e.target.value }))}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-lbl">Travel Date</label>
                    <input 
                      type="date" 
                      className="form-input" 
                      required 
                      value={formState.date}
                      onChange={e => setFormState(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-lbl">Transit Type</label>
                    <select 
                      className="form-select"
                      value={formState.travelType}
                      onChange={e => setFormState(prev => ({ ...prev, travelType: e.target.value }))}
                    >
                      {TRAVEL_TYPES.map(t => (
                        <option key={t} value={t}>{t.toUpperCase()}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-lbl">Class Preference</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. Economy, AC Tier 3"
                      value={formState.classType}
                      onChange={e => setFormState(prev => ({ ...prev, classType: e.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-lbl">No. of Passengers</label>
                    <input 
                      type="number" 
                      className="form-input" 
                      min="1" 
                      required 
                      value={formState.passengers}
                      onChange={e => setFormState(prev => ({ ...prev, passengers: parseInt(e.target.value) || 1 }))}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-lbl">Amount Price (₹)</label>
                    <input 
                      type="number" 
                      className="form-input highlight-price" 
                      min="0" 
                      required 
                      value={formState.amount}
                      onChange={e => setFormState(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-lbl">Booking Status</label>
                    <select 
                      className="form-select"
                      value={formState.status}
                      style={{ color: STATUS_COLORS[formState.status], fontWeight: 'bold' }}
                      onChange={e => setFormState(prev => ({ ...prev, status: e.target.value as BookingStatus }))}
                    >
                      {STATUSES.map(s => (
                        <option key={s} value={s}>{s.toUpperCase()}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group" style={{ marginTop: 14 }}>
                  <label className="form-lbl">Owner Notes / Routing Notes</label>
                  <textarea 
                    className="form-textarea" 
                    rows={3}
                    placeholder="Enter itinerary details, PNR references, or special requests..."
                    value={formState.notes}
                    onChange={e => setFormState(prev => ({ ...prev, notes: e.target.value }))}
                  />
                </div>

                {/* Submit and Helper triggers */}
                <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                  <button type="submit" className="form-save-btn">
                    {selected ? 'Save Changes' : 'Create Entry'}
                  </button>
                  <button type="button" className="form-cancel-btn" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                </div>

                {selected && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16 }}>
                    <a 
                      href={`https://wa.me/${formState.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${formState.customerName}, this is Shivalay Travels. Regarding your booking request ${selected.id} for ${formState.fromCity} to ${formState.toCity}. Your status is currently ${formState.status.toUpperCase()} with quote of ₹${formState.amount}.`)}`}
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="form-whatsapp-btn"
                    >
                      💬 Contact on WhatsApp
                    </a>
                    
                    {can('canDeleteRecords') && (
                      <button 
                        type="button" 
                        className="modal-delete-btn-inline" 
                        onClick={() => { if (confirm('Delete this booking permanently?')) deleteBooking(selected.id); }}
                      >
                        Delete booking
                      </button>
                    )}
                  </div>
                )}
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
        .bk-add-btn { background: #ff0000; color: #fff; border: none; border-radius: 8px; padding: 10px 18px; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: 'DM Sans',sans-serif; }
        .bk-add-btn:hover { background: #cc0000; transform: translateY(-1px); }
        .bk-filters { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
        .bk-status-tabs { display: flex; gap: 4px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 10px; padding: 4px; }
        .bk-tab { display: flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 6px; background: transparent; border: none; color: #666; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: 'DM Sans',sans-serif; }
        .bk-tab.active { background: rgba(255,0,0,0.1); color: #ff0000; }
        .bk-tab-count { background: rgba(255,255,255,0.08); border-radius: 10px; padding: 1px 6px; font-size: 10px; }
        .bk-right-filters { display: flex; gap: 10px; }
        .bk-search { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 8px 14px; color: #fff; font-size: 13px; outline: none; width: 220px; font-family: 'DM Sans',sans-serif; }
        .bk-search::placeholder { color: #444; }
        .bk-search:focus { border-color: rgba(255,0,0,0.4); }
        .bk-select { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 8px 14px; color: #aaa; font-size: 13px; outline: none; cursor: pointer; font-family: 'DM Sans',sans-serif; }
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
        .bk-type { font-size: 12px; display: inline-flex; align-items: center; }
        .bk-date { color: #777; }
        .bk-amount { font-weight: 600; }
        .bk-status { padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; border: 1px solid; text-transform: capitalize; }
        .bk-edit-btn { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); color: #aaa; border-radius: 6px; padding: 5px 12px; font-size: 12px; cursor: pointer; transition: all 0.2s; font-family: 'DM Sans',sans-serif; }
        .bk-edit-btn:hover { border-color: rgba(255,0,0,0.4); color: #ff0000; background: rgba(255,0,0,0.05); }
        .bk-empty { text-align: center; padding: 48px; color: #444; font-size: 13px; }
        
        /* Pagination Controls */
        .bk-pagination { display: flex; align-items: center; justify-content: space-between; margin-top: 16px; padding: 12px 16px; background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.06); border-radius: 10px; }
        .bk-pagination-left { font-size: 12px; color: #555; }
        .bk-pagination-right { display: flex; align-items: center; gap: 8px; }
        .bk-page-btn { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); color: #ccc; border-radius: 6px; padding: 5px 12px; font-size: 12px; cursor: pointer; transition: all 0.2s; font-family: 'DM Sans',sans-serif; }
        .bk-page-btn:hover:not(:disabled) { border-color: rgba(255,0,0,0.4); color: #ff0000; background: rgba(255,0,0,0.05); }
        .bk-page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .bk-page-select { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 6px; padding: 5px 10px; color: #aaa; font-size: 12px; cursor: pointer; font-family: 'DM Sans',sans-serif; outline: none; }
        .bk-page-select option { background: #111; color: #fff; }

        /* Modal Editor Form Styles */
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
        .highlight-price { border-color: rgba(34,197,94,0.3); color: #22c55e; font-weight: bold; }
        .highlight-price:focus { border-color: #22c55e; }
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
