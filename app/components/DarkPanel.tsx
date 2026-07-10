'use client';
import ImageWithSkeleton from './ImageWithSkeleton';

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
    <section style={{ background: 'var(--surface-canvas)', padding: '48px 0', borderBottom: '1px solid var(--color-zinc-hairline)' }}>
      <div className="container">
        <div
          className="dark-panel-grid reveal"
          style={{
            background: 'var(--color-carbon)',
            border: '1px solid var(--color-zinc-hairline)',
            borderRadius: 'var(--radius-xl)',
            padding: '32px',
          }}
        >
          {/* Col 1 */}
          <div>
            <p className="section-label" style={{ marginBottom: 12, color: 'var(--color-ash-gray)' }}>The problem</p>
            <h2
              className="font-secondary fs-section-heading fw-regular lh-12"
              style={{
                color: 'var(--color-pure-white)',
                marginBottom: 14,
              }}
            >
              Indian tourism has become<br />
              <span style={{ color: 'var(--color-ash-gray)' }}>an assembly line.</span>
            </h2>
            <p className="font-primary text-sm lh-17 text-muted" style={{ marginBottom: 24, maxWidth: 340 }}>
              Most agencies reuse identical templates for Leh, Srinagar, or Munnar. Shivalay Travels was built for those who seek authentic, reliable travel without compromises.
            </p>
            <button
              className="btn-primary"
              onClick={() => document.getElementById('planner')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Discover Our Method
            </button>
          </div>

          {/* Col 2: Pain points */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {PAIN_POINTS.map((p, i) => (
              <div
                key={i}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 10,
                  padding: '11px 8px',
                  borderBottom: i < PAIN_POINTS.length - 1 ? '1px solid var(--color-zinc-hairline)' : 'none',
                  transition: 'background 0.15s ease',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'default',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--color-lime-07)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                <span style={{ color: 'var(--color-highlighter-lime)', fontSize: 10, marginTop: 3, flexShrink: 0 }}>✦</span>
                <p className="font-primary text-sm lh-155">
                  <span className="fw-regular text-muted">{p.lead} </span>
                  <span className="fw-medium" style={{ color: 'var(--color-pure-white)' }}>{p.key}</span>
                </p>
              </div>
            ))}
          </div>

          {/* Col 3: Image */}
          <div className="img-zoom-wrap" style={{ height: 320, borderRadius: 'var(--radius-xl)', overflow: 'hidden', position: 'relative' }}>
            <ImageWithSkeleton src="/images/meghalaya.png" alt="Meghalaya" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'var(--gradient-visual-overlay)' }} />
            <div style={{ position: 'absolute', bottom: 14, left: 14, right: 14 }}>
              <p className="font-primary fs-9 fw-medium uppercase ls-1 text-muted" style={{ marginBottom: 4 }}>Raw Ecotourism</p>
              <p className="font-secondary fs-15 fw-regular" style={{ color: 'var(--color-pure-white)' }}>Cherrapunji rainforest loops</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
