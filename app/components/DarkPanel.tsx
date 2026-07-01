'use client';

const PAIN_POINTS = [
  { lead: 'Forget about', key: 'crowded commercial buses packed with tourists.' },
  { lead: 'No more', key: 'fixed, inflexible check-ins and rushed sightseeing.' },
  { lead: 'Stop settling for', key: 'generic hotels that overlook highway traffic.' },
  { lead: 'End the cycle of', key: 'hidden travel operator surcharges mid-trip.' },
  { lead: 'Leave behind', key: "inexperienced city guides who don't know local terrain." },
  { lead: 'Break free from', key: 'cookie-cutter itineraries sold to thousands.' },
];

export default function DarkPanel() {
  return (
    <section style={{ background: 'var(--surface-canvas)', padding: '80px 0' }}>
      <div className="container">
        <div className="card-dark reveal" style={{ borderRadius: 'var(--radius-card)', overflow: 'hidden', position: 'relative' }}>
          {/* Decorative gradient blobs */}
          <div style={{ position: 'absolute', top: -80, right: -80, width: 280, height: 280, borderRadius: '50%', background: 'radial-gradient(circle, rgba(195,0,16,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -60, left: 200, width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(circle, rgba(195,0,16,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

          <div className="dark-panel-grid" style={{ padding: '48px 48px', display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 1fr', gap: 40, alignItems: 'center', position: 'relative', zIndex: 1 }}>
            {/* Col 1: Intro */}
            <div>
              <div className="badge" style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.12)', marginBottom: 20 }}>
                The problem
              </div>
              <h2 style={{ fontFamily: 'var(--font-cosmica)', fontWeight: 700, fontSize: 'clamp(26px, 3vw, 40px)', color: '#fff', lineHeight: 1.15, marginBottom: 18 }}>
                Indian tourism has become<br />
                <span style={{ color: 'var(--color-ash)' }}>an assembly line.</span>
              </h2>
              <p style={{ fontFamily: 'var(--font-cosmica)', fontWeight: 300, fontSize: 15, color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, marginBottom: 28 }}>
                Most agencies reuse identical templates for Leh, Srinagar, or Munnar. Shivalay Travels was built for those who seek authentic, reliable travel and pilgrimages without compromises.
              </p>
              <button
                className="btn-primary"
                onClick={() => document.getElementById('planner')?.scrollIntoView({ behavior: 'smooth' })}
                style={{ background: 'var(--color-ember)', color: '#fff', transition: 'all 0.25s var(--ease-out)' }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                Discover Our Method
              </button>
            </div>

            {/* Col 2: Pain points */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {PAIN_POINTS.map((p, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: 12,
                    padding: '13px 0',
                    borderBottom: i < PAIN_POINTS.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                    transition: 'all 0.2s ease',
                    borderRadius: 8,
                    cursor: 'default',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.paddingLeft = '8px'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.paddingLeft = '0'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                >
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                    background: 'rgba(195,0,16,0.12)', border: '1px solid rgba(195,0,16,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 2,
                    transition: 'background 0.2s ease',
                  }}>
                    <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5L4 7L8 3" stroke="var(--color-ember)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <p style={{ fontFamily: 'var(--font-cosmica)', fontSize: 13.5, lineHeight: 1.5 }}>
                    <span className="weight-lead">{p.lead} </span>
                    <span className="weight-key">{p.key}</span>
                  </p>
                </div>
              ))}
            </div>

            {/* Col 3: Image */}
            <div className="img-zoom-wrap" style={{ height: 360, borderRadius: 'var(--radius-card-compact)', overflow: 'hidden', position: 'relative' }}>
              <img src="/images/meghalaya.png" alt="Meghalaya Living Root Bridge" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(9,9,11,0.82) 0%, transparent 100%)' }} />
              <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}>
                <p style={{ fontFamily: 'var(--font-cosmica)', fontSize: 11, fontWeight: 600, color: 'var(--color-ember)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 4 }}>Raw Ecotourism</p>
                <h4 style={{ fontFamily: 'var(--font-cosmica)', fontSize: 16, fontWeight: 700, color: '#fff' }}>Cherrapunji rainforest loops</h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 992px) {
          .dark-panel-grid { grid-template-columns: 1fr 1fr !important; padding: 36px !important; }
          .dark-panel-grid > div:last-child { display: none !important; }
        }
        @media (max-width: 768px) {
          .dark-panel-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
        }
      `}</style>
    </section>
  );
}
