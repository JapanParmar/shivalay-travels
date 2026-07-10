'use client';
import { useState, useEffect, useRef } from 'react';
import ProtectedPage from '../components/ProtectedPage';
import { useAdminAuth } from '../lib/AdminAuthContext';
import Chart from 'chart.js/auto';
import AdminLoader from '../components/AdminLoader';

type Booking = {
  id: string; customerName: string; travelType: string; status: string;
  amount: number; passengers: number; createdAt: string; date: string;
  fromCity?: string; toCity?: string; from?: string; to?: string; classType?: string;
};

const TYPE_COLORS: Record<string, string> = {
  flight: '#ef4444', train: '#f59e0b', bus: '#3b82f6', cruise: '#8b5cf6',
};
const STATUS_COLORS: Record<string, string> = {
  confirmed: '#22c55e', pending: '#f59e0b', cancelled: '#ef4444', completed: '#3b82f6',
};

export default function AnalyticsPage() {
  const { can } = useAdminAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [rangeFilter, setRangeFilter] = useState<'7d' | '30d' | '90d' | 'all'>('30d');
  const [typeFilter, setTypeFilter] = useState('all');

  // Chart canvas refs
  const revenueChartRef = useRef<HTMLCanvasElement | null>(null);
  const typeChartRef = useRef<HTMLCanvasElement | null>(null);
  const statusChartRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    fetch('/api/admin/bookings')
      .then(r => r.json())
      .then(data => { setBookings(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Compute filtered datasets
  const now = new Date();
  const cutoff = rangeFilter === '7d' ? new Date(now.getTime() - 7 * 86400000)
    : rangeFilter === '30d' ? new Date(now.getTime() - 30 * 86400000)
    : rangeFilter === '90d' ? new Date(now.getTime() - 90 * 86400000)
    : new Date(0);

  const filtered = bookings.filter(b => {
    const created = new Date(b.createdAt);
    const matchDate = created >= cutoff;
    const matchType = typeFilter === 'all' || b.travelType === typeFilter;
    return matchDate && matchType;
  });

  // KPI Calculations
  const totalRevenue = filtered.filter(b => b.status !== 'cancelled').reduce((s, b) => s + Number(b.amount || 0), 0);
  const confirmed = filtered.filter(b => b.status === 'confirmed').length;
  const pending = filtered.filter(b => b.status === 'pending').length;
  const cancelled = filtered.filter(b => b.status === 'cancelled').length;
  const completed = filtered.filter(b => b.status === 'completed').length;
  const avgBookingValue = filtered.length > 0 ? totalRevenue / (filtered.length - cancelled) : 0;
  const totalPassengers = filtered.reduce((s, b) => s + Number(b.passengers || 1), 0);
  const confirmationRate = filtered.length > 0 ? ((confirmed + completed) / filtered.length * 100) : 0;

  // Chart data calculations
  const days = rangeFilter === '7d' ? 7 : rangeFilter === '30d' ? 14 : 30;
  const revenueByDay: { label: string; value: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400000);
    const label = days <= 7
      ? ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()]
      : `${d.getDate()}/${d.getMonth() + 1}`;
    const dayStr = d.toISOString().split('T')[0];
    const rev = filtered
      .filter(b => b.createdAt?.startsWith(dayStr) && b.status !== 'cancelled')
      .reduce((s, b) => s + Number(b.amount || 0), 0);
    revenueByDay.push({ label, value: rev });
  }

  const byTypeData = ['flight', 'train', 'bus', 'cruise'].map(type => ({
    label: type.charAt(0).toUpperCase() + type.slice(1),
    value: filtered.filter(b => b.travelType === type).length,
    revenue: filtered.filter(b => b.travelType === type && b.status !== 'cancelled').reduce((s, b) => s + Number(b.amount || 0), 0),
    color: TYPE_COLORS[type],
  }));

  const byStatusData = [
    { label: 'Confirmed', value: confirmed, color: STATUS_COLORS.confirmed },
    { label: 'Pending', value: pending, color: STATUS_COLORS.pending },
    { label: 'Completed', value: completed, color: STATUS_COLORS.completed },
    { label: 'Cancelled', value: cancelled, color: STATUS_COLORS.cancelled },
  ].filter(s => s.value > 0);

  // Instantiating ChartJS
  useEffect(() => {
    if (loading || filtered.length === 0) return;

    let revInstance: any = null;
    let typeInstance: any = null;
    let statusInstance: any = null;

    // 1. Revenue Chart
    if (revenueChartRef.current) {
      const ctx = revenueChartRef.current.getContext('2d');
      if (ctx) {
        revInstance = new Chart(ctx, {
          type: 'line',
          data: {
            labels: revenueByDay.map(d => d.label),
            datasets: [{
              label: 'Daily Revenue (₹)',
              data: revenueByDay.map(d => d.value),
              borderColor: '#ff3b30',
              backgroundColor: 'rgba(255, 59, 48, 0.05)',
              borderWidth: 2,
              fill: true,
              tension: 0.3,
              pointBackgroundColor: '#ff3b30',
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false }
            },
            scales: {
              y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#888' } },
              x: { grid: { display: false }, ticks: { color: '#888' } }
            }
          }
        });
      }
    }

    // 2. Type Distribution Chart
    if (typeChartRef.current) {
      const ctx = typeChartRef.current.getContext('2d');
      if (ctx) {
        typeInstance = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: byTypeData.map(t => t.label),
            datasets: [{
              data: byTypeData.map(t => t.value),
              backgroundColor: byTypeData.map(t => t.color),
              borderColor: '#0f0f0f',
              borderWidth: 2,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'right',
                labels: { color: '#bbb', font: { size: 11 } }
              }
            }
          }
        });
      }
    }

    // 3. Status Split Chart
    if (statusChartRef.current) {
      const ctx = statusChartRef.current.getContext('2d');
      if (ctx) {
        statusInstance = new Chart(ctx, {
          type: 'pie',
          data: {
            labels: byStatusData.map(s => s.label),
            datasets: [{
              data: byStatusData.map(s => s.value),
              backgroundColor: byStatusData.map(s => s.color),
              borderColor: '#0f0f0f',
              borderWidth: 2,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'right',
                labels: { color: '#bbb', font: { size: 11 } }
              }
            }
          }
        });
      }
    }

    return () => {
      if (revInstance) revInstance.destroy();
      if (typeInstance) typeInstance.destroy();
      if (statusInstance) statusInstance.destroy();
    };
  }, [loading, rangeFilter, typeFilter, bookings]);

  if (!can('canViewAnalytics')) {
    return (
      <ProtectedPage>
        <div style={{ textAlign: 'center', padding: '80px 24px' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
          <h2 style={{ color: '#fff', fontSize: 20 }}>Access Restricted</h2>
          <p style={{ color: '#666' }}>You do not have view permission for owner analytics dashboard.</p>
        </div>
      </ProtectedPage>
    );
  }

  // Routes ranking calculation
  const routeMap: Record<string, { count: number; revenue: number; type: string }> = {};
  filtered.forEach(b => {
    const from = (b.fromCity || b.from || '').split(' ')[0];
    const to = (b.toCity || b.to || '').split(' ')[0];
    if (!from || !to) return;
    const key = `${from} → ${to}`;
    if (!routeMap[key]) routeMap[key] = { count: 0, revenue: 0, type: b.travelType };
    routeMap[key].count++;
    if (b.status !== 'cancelled') routeMap[key].revenue += Number(b.amount || 0);
  });
  const topRoutes = Object.entries(routeMap)
    .sort(([, a], [, b]) => b.revenue - a.revenue)
    .slice(0, 5);

  const kpis = [
    { label: 'Gross Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, color: '#22c55e', icon: '💰' },
    { label: 'Total Inquiries', value: filtered.length.toString(), color: '#3b82f6', icon: '📋' },
    { label: 'Booking Rate', value: `${confirmationRate.toFixed(1)}%`, color: '#f59e0b', icon: '⚡' },
    { label: 'Total Passengers', value: totalPassengers.toString(), color: '#8b5cf6', icon: '👥' },
  ];

  if (loading) {
    return (
      <ProtectedPage>
        <div style={{ padding: '24px 0' }}>
          <AdminLoader message="Loading business reports and chart graphs..." />
        </div>
      </ProtectedPage>
    );
  }

  return (
    <ProtectedPage>
      <div className="an-root">
        <div className="an-header-row">
          <div>
            <h1 className="an-title">Business Analytics</h1>
            <p className="an-sub">Realtime performance indicators &amp; booking statistics</p>
          </div>
          <div className="an-filters">
            <select className="an-select" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
              <option value="all">All Transits</option>
              <option value="flight">Flights</option>
              <option value="train">Trains</option>
              <option value="bus">Buses</option>
              <option value="cruise">Cruises</option>
            </select>
            {(['7d', '30d', '90d', 'all'] as const).map(r => (
              <button key={r} className={`an-range-btn ${rangeFilter === r ? 'active' : ''}`} onClick={() => setRangeFilter(r)}>
                {r === 'all' ? 'All Time' : r === '7d' ? '7 Days' : r === '30d' ? '30 Days' : '90 Days'}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#555' }}>Retrieving agent details...</div>
        ) : filtered.length === 0 ? (
          <div className="an-empty-state">
            <div style={{ fontSize: 44, marginBottom: 12 }}>📈</div>
            <p style={{ color: '#fff', fontSize: 14, fontWeight: 'bold' }}>No booking records found.</p>
            <p style={{ color: '#555', fontSize: 12, marginTop: 4 }}>Add custom bookings inside the manager to generate owner reports.</p>
          </div>
        ) : (
          <>
            {/* KPI Stats */}
            <div className="an-kpi-row">
              {kpis.map(k => (
                <div key={k.label} className="an-kpi-card">
                  <div className="an-kpi-top">
                    <span className="an-kpi-lbl">{k.label}</span>
                    <span className="an-kpi-ico">{k.icon}</span>
                  </div>
                  <div className="an-kpi-val" style={{ color: k.color }}>{k.value}</div>
                </div>
              ))}
            </div>

            {/* ChartJS Row */}
            <div className="an-charts-grid">
              <div className="an-chart-card span-2">
                <h3 className="an-chart-title">Revenue Intake Trend (₹)</h3>
                <div className="an-chart-canvas-wrap">
                  <canvas ref={revenueChartRef} />
                </div>
              </div>
              <div className="an-chart-card">
                <h3 className="an-chart-title">Transit Type Split</h3>
                <div className="an-chart-canvas-wrap">
                  <canvas ref={typeChartRef} />
                </div>
              </div>
            </div>

            {/* Split row: status + top routes */}
            <div className="an-charts-grid">
              <div className="an-chart-card">
                <h3 className="an-chart-title">Booking Status Distribution</h3>
                <div className="an-chart-canvas-wrap">
                  <canvas ref={statusChartRef} />
                </div>
              </div>

              <div className="an-chart-card span-2">
                <h3 className="an-chart-title">Top Revenue Routes</h3>
                <div className="an-table-wrap">
                  <table className="an-table">
                    <thead>
                      <tr>
                        <th>Rank</th>
                        <th>Route Station</th>
                        <th>Type</th>
                        <th>Total Inquiries</th>
                        <th>Combined Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topRoutes.map(([route, rdata], i) => (
                        <tr key={route}>
                          <td style={{ color: '#555', fontWeight: 'bold' }}>#{i + 1}</td>
                          <td style={{ color: '#ddd', fontWeight: 500 }}>{route}</td>
                          <td>
                            <span 
                              className="an-type-badge" 
                              style={{ borderColor: `${TYPE_COLORS[rdata.type]}44`, color: TYPE_COLORS[rdata.type] }}
                            >
                              {rdata.type}
                            </span>
                          </td>
                          <td>{rdata.count}</td>
                          <td style={{ color: '#22c55e', fontWeight: 'bold' }}>₹{rdata.revenue.toLocaleString('en-IN')}</td>
                        </tr>
                      ))}
                      {topRoutes.length === 0 && (
                        <tr>
                          <td colSpan={5} style={{ textAlign: 'center', color: '#444' }}>No route stats yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <style>{`
        .an-root { display: flex; flex-direction: column; gap: 20px; }
        .an-header-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
        .an-title { font-size: 22px; font-weight: 700; color: #fff; }
        .an-sub { font-size: 12px; color: #555; margin-top: 2px; }
        
        .an-filters { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .an-select { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); color: #ccc; font-size: 12px; padding: 7px 12px; border-radius: 8px; cursor: pointer; font-family: 'DM Sans', sans-serif; }
        .an-select option { background: #111; color: #fff; }
        .an-range-btn { background: transparent; border: 1px solid rgba(255,255,255,0.08); color: #666; font-size: 11px; padding: 6px 12px; border-radius: 6px; cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', sans-serif; }
        .an-range-btn.active { background: rgba(255,0,0,0.12); border-color: rgba(255,0,0,0.3); color: #ff6060; }
        .an-range-btn:hover { border-color: rgba(255,255,255,0.2); color: #ccc; }
        
        .an-kpi-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
        .an-kpi-card { background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 18px; display: flex; flex-direction: column; gap: 10px; }
        .an-kpi-top { display: flex; align-items: center; justify-content: space-between; }
        .an-kpi-lbl { font-size: 11px; color: #555; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px; }
        .an-kpi-ico { font-size: 16px; }
        .an-kpi-val { font-size: 20px; font-weight: 700; }
        
        .an-charts-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .an-chart-card { background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 20px; display: flex; flex-direction: column; gap: 16px; }
        .an-chart-card.span-2 { grid-column: span 2; }
        .an-chart-title { font-size: 13px; font-weight: 700; color: #fff; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 8px; }
        .an-chart-canvas-wrap { position: relative; height: 180px; width: 100%; }
        
        .an-empty-state { text-align: center; padding: 60px 24px; background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; }
        .an-table-wrap { overflow-x: auto; }
        .an-table { width: 100%; border-collapse: collapse; }
        .an-table th { padding: 8px 10px; text-align: left; font-size: 10px; color: #555; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .an-table td { padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.04); font-size: 12px; color: #bbb; }
        .an-table tr:last-child td { border-bottom: none; }
        .an-type-badge { font-size: 10px; padding: 2px 8px; border-radius: 4px; border: 1px solid; text-transform: capitalize; font-weight: 600; display: inline-block; }
        
        @media (max-width: 1024px) {
          .an-kpi-row { grid-template-columns: repeat(2, 1fr); }
          .an-charts-grid { grid-template-columns: 1fr; }
          .an-chart-card.span-2 { grid-column: span 1; }
        }
        @media (max-width: 640px) {
          .an-kpi-row { grid-template-columns: 1fr; }
        }
      `}</style>
    </ProtectedPage>
  );
}
