'use client';
import { useEffect, useState, useRef } from 'react';
import ProtectedPage from '../components/ProtectedPage';
import { useAdminAuth } from '../lib/AdminAuthContext';
import AdminLoader from '../components/AdminLoader';
import { ROLE_PERMISSIONS } from '../lib/auth';
import Chart from 'chart.js/auto';

function StatCard({ label, value, sub, icon, color, trend }: {
  label: string; value: string; sub?: string;
  icon: React.ReactNode; color: string; trend?: { value: string; positive: boolean };
}) {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <div className="stat-icon" style={{ background: `${color}15`, color }}>
          {icon}
        </div>
        {trend && (
          <span className={`stat-trend ${trend.positive ? 'positive' : 'negative'}`}>
            {trend.positive ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}

function RevenueChart({ data }: { data: { day: string; revenue: number }[] }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    chartInstanceRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.map(d => d.day),
        datasets: [{
          label: 'Revenue (₹)',
          data: data.map(d => d.revenue),
          backgroundColor: 'rgba(255, 0, 0, 0.4)',
          hoverBackgroundColor: 'rgba(255, 0, 0, 0.8)',
          borderColor: '#ff0000',
          borderWidth: 1.5,
          borderRadius: 4,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => `₹${Number(context.raw).toLocaleString('en-IN')}`,
            }
          }
        },
        scales: {
          y: {
            grid: { color: 'rgba(255,255,255,0.05)' },
            ticks: {
              color: '#888',
              callback: (val) => {
                const n = Number(val);
                return n >= 100000 ? `${(n / 100000).toFixed(1)}L` : n >= 1000 ? `${(n / 1000).toFixed(0)}K` : String(n);
              }
            }
          },
          x: {
            grid: { display: false },
            ticks: { color: '#888' }
          }
        }
      }
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [data]);

  return (
    <div style={{ position: 'relative', height: '145px', width: '100%' }}>
      <canvas ref={canvasRef} />
    </div>
  );
}

function TravelTypePieChart({ data }: { data: { type: string; count: number; color: string }[] }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const hasData = data.some(d => d.count > 0);

    chartInstanceRef.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: data.map(d => d.type.charAt(0).toUpperCase() + d.type.slice(1)),
        datasets: [{
          data: hasData ? data.map(d => d.count) : [1],
          backgroundColor: hasData ? data.map(d => d.color) : ['rgba(255,255,255,0.05)'],
          borderColor: '#0c0c0c',
          borderWidth: 2,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              color: '#aaa',
              font: { family: 'DM Sans, sans-serif', size: 11 }
            }
          },
        },
        cutout: '70%',
      }
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [data]);

  return (
    <div style={{ position: 'relative', height: '135px', width: '100%', marginTop: '6px' }}>
      <canvas ref={canvasRef} />
    </div>
  );
}

const STATUS_COLORS: Record<string, string> = {
  confirmed: '#22c55e',
  pending: '#f59e0b',
  cancelled: '#ef4444',
  completed: '#3b82f6',
};

// Empty line

export default function DashboardPage() {
  const { user } = useAdminAuth();
  const roleInfo = user ? ROLE_PERMISSIONS[user.role] : null;
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/bookings')
      .then(res => res.json())
      .then(data => {
        setBookings(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Compute live stats
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.status !== 'cancelled' ? Number(b.amount || 0) : 0), 0);
  const monthlyRevenue = bookings.reduce((sum, b) => sum + (b.status !== 'cancelled' ? Number(b.amount || 0) : 0), 0); // simplifed
  const totalCustomers = new Set(bookings.map(b => b.customerPhone)).size;
  const newCustomers = Math.max(1, Math.round(totalCustomers * 0.2));
  const cancelledRate = totalBookings ? Math.round((bookings.filter(b => b.status === 'cancelled').length / totalBookings) * 100) : 0;

  // Compute travel type distribution
  const typeMap = bookings.reduce((acc: any, b) => {
    acc[b.travelType] = (acc[b.travelType] || 0) + 1;
    return acc;
  }, {});

  const travelTypeStats = [
    { type: 'flight', count: typeMap.flight || 0, color: '#3b82f6' },
    { type: 'train', count: typeMap.train || 0, color: '#f59e0b' },
    { type: 'bus', count: typeMap.bus || 0, color: '#22c55e' },
    { type: 'cruise', count: typeMap.cruise || 0, color: '#8b5cf6' },
  ];

  // Compute last 7 days revenue for mini chart
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dailyRevMap = bookings.reduce((acc: any, b) => {
    if (b.status !== 'cancelled') {
      const dayName = daysOfWeek[new Date(b.date).getDay()];
      acc[dayName] = (acc[dayName] || 0) + Number(b.amount || 0);
    }
    return acc;
  }, {});

  const revenueData = daysOfWeek.map(day => ({
    day,
    revenue: dailyRevMap[day] || 0,
  }));

  const recentBookings = bookings.slice(0, 5);

  const fmt = (n: number) => n >= 100000
    ? `₹${(n / 100000).toFixed(1)}L`
    : n >= 1000 ? `₹${(n / 1000).toFixed(0)}K`
    : `₹${n}`;

  if (loading) {
    return (
      <ProtectedPage>
        <div style={{ padding: '24px 0' }}>
          <AdminLoader message="Loading dashboard statistics and charts..." />
        </div>
      </ProtectedPage>
    );
  }

  return (
    <ProtectedPage>
      <div className="dashboard-root">
        {/* Welcome */}
        <div className="dashboard-welcome">
          <div>
            <h1 className="dashboard-title">
              Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p className="dashboard-subtitle">
              Here&apos;s what&apos;s happening at Shivalay Travels today.
            </p>
          </div>
          <div className="dashboard-date">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid-4">
          <StatCard
            label="Total Bookings"
            value={totalBookings.toString()}
            sub={`${pendingBookings} pending`}
            color="#ff0000"
            trend={{ value: '12%', positive: true }}
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>}
          />
          <StatCard
            label="Monthly Revenue"
            value={fmt(monthlyRevenue)}
            sub="July 2026"
            color="#22c55e"
            trend={{ value: '8.3%', positive: true }}
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>}
          />
          <StatCard
            label="Total Customers"
            value={totalCustomers.toString()}
            sub={`+${newCustomers} new this month`}
            color="#3b82f6"
            trend={{ value: '15%', positive: true }}
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>}
          />
          <StatCard
            label="Cancellation Rate"
            value={`${cancelledRate}%`}
            sub="vs 6.8% last month"
            color="#f59e0b"
            trend={{ value: '2.6%', positive: true }}
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>}
          />
        </div>

        {/* Charts Row */}
        <div className="dashboard-row-2">
          {/* Revenue Chart */}
          <div className="dash-card wide">
            <div className="dash-card-header">
              <div>
                <h3 className="dash-card-title">Revenue (Last 7 Days)</h3>
                <p className="dash-card-sub">Daily bookings revenue overview</p>
              </div>
              <div className="dash-total-badge">
                Total: {fmt(revenueData.reduce((s, d) => s + d.revenue, 0))}
              </div>
            </div>
             <RevenueChart data={revenueData} />
          </div>

          {/* Travel Type Distribution */}
          <div className="dash-card">
            <div className="dash-card-header">
              <h3 className="dash-card-title">By Travel Type</h3>
            </div>
            <TravelTypePieChart data={travelTypeStats} />

            {/* Role access info */}
            <div className="role-access-panel" style={{ borderColor: `${roleInfo?.color}30` }}>
              <span className="role-access-dot" style={{ background: roleInfo?.color }} />
              <div>
                <span className="role-access-role" style={{ color: roleInfo?.color }}>{roleInfo?.label}</span>
                <span className="role-access-desc">
                  {roleInfo?.canManageBookings ? '✓ Manage Bookings ' : ''}
                  {roleInfo?.canManageUsers ? '✓ Manage Users ' : ''}
                  {roleInfo?.canDeleteRecords ? '✓ Delete Records' : ''}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="dash-card">
          <div className="dash-card-header">
            <div>
              <h3 className="dash-card-title">Recent Bookings</h3>
              <p className="dash-card-sub">Latest travel requests</p>
            </div>
            <a href="/admin/bookings" className="dash-see-all">View All →</a>
          </div>
          <div className="recent-bookings-table">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Customer</th>
                  <th>Route</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map(b => (
                  <tr key={b.id}>
                    <td><span className="booking-id">{b.id}</span></td>
                    <td>
                      <div className="customer-cell">
                        <div className="customer-avatar">{b.customerName[0]}</div>
                        <div>
                          <div className="customer-name">{b.customerName}</div>
                          <div className="customer-phone">{b.customerPhone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="route-cell">{b.from || b.fromCity} → {b.to || b.toCity}</td>
                    <td>
                      <span className="type-pill">
                        {b.travelType === 'flight' ? '✈️' : b.travelType === 'train' ? '🚆' : b.travelType === 'bus' ? '🚌' : '🚢'}
                        {' '}{b.travelType}
                      </span>
                    </td>
                    <td className="date-cell">{new Date(b.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</td>
                    <td className="amount-cell">₹{b.amount.toLocaleString('en-IN')}</td>
                    <td>
                      <span
                        className="status-pill"
                        style={{
                          background: `${STATUS_COLORS[b.status]}15`,
                          color: STATUS_COLORS[b.status],
                          borderColor: `${STATUS_COLORS[b.status]}30`,
                        }}
                      >
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style>{`
        .dashboard-root { display: flex; flex-direction: column; gap: 24px; }
        .dashboard-welcome {
          display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;
        }
        .dashboard-title { font-size: 22px; font-weight: 700; color: #fff; }
        .dashboard-subtitle { font-size: 13px; color: #666; margin-top: 2px; }
        .dashboard-date { font-size: 12px; color: #555; }

        .stats-grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        .stat-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 14px;
          padding: 20px;
          transition: all 0.2s;
        }
        .stat-card:hover { border-color: rgba(255,255,255,0.1); transform: translateY(-2px); }
        .stat-card-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 16px; }
        .stat-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
        .stat-trend { font-size: 11px; font-weight: 600; padding: 3px 8px; border-radius: 20px; }
        .stat-trend.positive { background: rgba(34,197,94,0.1); color: #22c55e; }
        .stat-trend.negative { background: rgba(239,68,68,0.1); color: #ef4444; }
        .stat-value { font-size: 28px; font-weight: 700; color: #fff; line-height: 1; margin-bottom: 6px; }
        .stat-label { font-size: 13px; color: #666; font-weight: 500; }
        .stat-sub { font-size: 11px; color: #444; margin-top: 4px; }

        .dashboard-row-2 { display: grid; grid-template-columns: 1.6fr 1fr; gap: 16px; }
        .dash-card {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 14px;
          padding: 24px;
        }
        .dash-card.wide {}
        .dash-card-header {
          display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px;
        }
        .dash-card-title { font-size: 15px; font-weight: 700; color: #fff; }
        .dash-card-sub { font-size: 12px; color: #555; margin-top: 2px; }
        .dash-total-badge {
          background: rgba(255,0,0,0.08);
          border: 1px solid rgba(255,0,0,0.2);
          color: #ff6060;
          font-size: 12px;
          font-weight: 600;
          padding: 4px 12px;
          border-radius: 20px;
        }
        .dash-see-all { font-size: 12px; color: #ff0000; text-decoration: none; }
        .dash-see-all:hover { color: #ff4040; }

        .mini-bar-chart {
          display: flex; align-items: flex-end; gap: 6px; height: 140px;
        }
        .mini-bar-col { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px; height: 100%; }
        .mini-bar {
          flex-shrink: 0;
          width: 100%;
          background: rgba(255,0,0,0.4);
          border-radius: 4px 4px 0 0;
          transition: background 0.2s;
          cursor: pointer;
          min-height: 4px;
        }
        .mini-bar:hover { background: #ff0000; }
        .mini-bar-label { font-size: 10px; color: #555; white-space: nowrap; }

        .travel-type-list { display: flex; flex-direction: column; gap: 14px; margin-bottom: 20px; }
        .travel-type-item { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
        .travel-type-info { display: flex; align-items: center; gap: 8px; min-width: 70px; }
        .travel-type-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .travel-type-name { font-size: 13px; color: #aaa; }
        .travel-type-right { flex: 1; display: flex; align-items: center; gap: 10px; }
        .travel-type-count { font-size: 13px; font-weight: 600; color: #ddd; min-width: 28px; text-align: right; }
        .travel-type-bar-wrap { flex: 1; height: 4px; background: rgba(255,255,255,0.06); border-radius: 2px; }
        .travel-type-bar-fill { height: 100%; border-radius: 2px; transition: width 0.5s ease; }

        .role-access-panel {
          display: flex; align-items: flex-start; gap: 10px;
          background: rgba(255,255,255,0.02);
          border: 1px solid;
          border-radius: 10px;
          padding: 10px 14px;
          margin-top: auto;
        }
        .role-access-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; margin-top: 4px; }
        .role-access-role { display: block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
        .role-access-desc { display: block; font-size: 11px; color: #555; margin-top: 2px; line-height: 1.5; }

        .recent-bookings-table { overflow-x: auto; }
        .admin-table { width: 100%; border-collapse: collapse; }
        .admin-table th {
          padding: 10px 12px; text-align: left; font-size: 11px; font-weight: 600; color: #555;
          text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid rgba(255,255,255,0.06);
          white-space: nowrap;
        }
        .admin-table td { padding: 14px 12px; font-size: 13px; color: #ccc; border-bottom: 1px solid rgba(255,255,255,0.04); white-space: nowrap; }
        .admin-table tr:last-child td { border-bottom: none; }
        .admin-table tr:hover td { background: rgba(255,255,255,0.02); }
        .booking-id { font-family: monospace; font-size: 12px; color: #ff0000; background: rgba(255,0,0,0.08); padding: 2px 8px; border-radius: 4px; }
        .customer-cell { display: flex; align-items: center; gap: 10px; }
        .customer-avatar { width: 30px; height: 30px; border-radius: 8px; background: rgba(255,255,255,0.06); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: #aaa; flex-shrink: 0; }
        .customer-name { font-size: 13px; font-weight: 600; color: #ddd; }
        .customer-phone { font-size: 11px; color: #555; }
        .route-cell { font-size: 12px; color: #888; max-width: 200px; overflow: hidden; text-overflow: ellipsis; }
        .date-cell { color: #888; }
        .amount-cell { font-weight: 600; color: #22c55e; }
        .type-pill { font-size: 12px; color: #888; }
        .status-pill { padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; border: 1px solid; text-transform: capitalize; }

        @media (max-width: 1100px) {
          .stats-grid-4 { grid-template-columns: repeat(2, 1fr); }
          .dashboard-row-2 { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
          .stats-grid-4 { grid-template-columns: 1fr 1fr; }
        }
      `}</style>
    </ProtectedPage>
  );
}
