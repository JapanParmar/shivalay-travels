'use client';

const COLS = [
  {
    label: 'Destinations',
    links: ['Ladakh', 'Kashmir', 'Kerala', 'Meghalaya', 'Rajasthan', 'All Indian Expeditions'],
  },
  {
    label: 'Services',
    links: ['Private journeys', 'Honeymoon planning', 'Corporate retreats', 'Family expeditions', 'Wellness escapes'],
  },
  {
    label: 'Company',
    links: ['Our story', 'Traveller stories', 'Press', 'Careers', 'Privacy policy'],
  },
];

export default function Footer() {
  return (
    <footer style={{ background: 'var(--color-obsidian)', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '64px 0 40px' }}>
      <div className="container">
        {/* Top */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 64, marginBottom: 64 }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="2.5" fill="white" />
                  <path d="M7 1v2M7 11v2M1 7h2M11 7h2" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <span style={{ fontFamily: 'var(--font-cosmica)', fontWeight: 700, fontSize: 18, color: '#fff' }}>Lumière</span>
            </div>
            <p style={{ fontFamily: 'var(--font-cosmica)', fontWeight: 300, fontSize: 14, color: 'rgba(255,255,255,0.4)', lineHeight: 1.65, maxWidth: 220 }}>
              Private journeys for those who seek transformation, not tourism.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 28 }}>
              <a href="mailto:journeys@lumiere.travel" style={{ fontFamily: 'var(--font-cosmica)', fontSize: 13, color: 'rgba(255,255,255,0.4)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}>
                journeys@lumiere.travel
              </a>
              <a href="https://wa.me/+1234567890" target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'var(--font-cosmica)', fontSize: 13, color: 'rgba(255,255,255,0.4)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}>
                WhatsApp concierge
              </a>
            </div>
          </div>

          {/* Link columns */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
            {COLS.map(col => (
              <div key={col.label}>
                <p style={{ fontFamily: 'var(--font-cosmica)', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 20 }}>
                  {col.label}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {col.links.map(link => (
                    <button
                      key={link}
                      style={{
                        fontFamily: 'var(--font-cosmica)', fontSize: 14, fontWeight: 400,
                        color: 'rgba(255,255,255,0.45)', background: 'none', border: 'none',
                        cursor: 'pointer', textAlign: 'left', padding: 0,
                        transition: 'color 0.2s ease',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.75)')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
                    >
                      {link}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontFamily: 'var(--font-cosmica)', fontSize: 13, fontWeight: 400, color: 'rgba(255,255,255,0.25)' }}>
            © 2025 Lumière Private Travel. All rights reserved.
          </p>
          <p style={{ fontFamily: 'var(--font-cosmica)', fontSize: 13, fontWeight: 300, color: 'rgba(255,255,255,0.2)' }}>
            Crafting extraordinary Indian journeys since 2010.
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          footer .container > div:first-child {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          footer .container > div:first-child > div:last-child {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
