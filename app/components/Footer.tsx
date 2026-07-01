'use client';

const COLS = [
  {
    label: 'Destinations',
    links: ['Kedarnath', 'Chardham Yatra', 'Varanasi Yatra', 'Kashmir Valley', 'Goa Beaches', 'All Indian Tours'],
  },
  {
    label: 'Services',
    links: ['Flight Booking', 'Bus Booking', 'Train Booking', 'Hotel Stays', 'Customised Tour Packages'],
  },
  {
    label: 'Contact Office',
    links: ['Shop No. 2, Shivalay Travels', 'Indore, Madhya Pradesh', 'Nisha Chouhan: 9340994628', 'Manisha Mali: 9340994628'],
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
                background: 'var(--color-ember)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff',
              }}>
                {/* Trident SVG logo */}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3v18M6 8v1c0 3 2 5.5 6 5.5s6-2.5 6-5.5V8M9 21h6" />
                </svg>
              </div>
              <span style={{ fontFamily: 'var(--font-cosmica)', fontWeight: 700, fontSize: 18, color: '#fff' }}>Shivalay Travels</span>
            </div>
            <p style={{ fontFamily: 'var(--font-cosmica)', fontWeight: 300, fontSize: 14, color: 'rgba(255,255,255,0.4)', lineHeight: 1.65, maxWidth: 220 }}>
              Complete travel solutions for all your pilgrimage and holiday needs.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 28 }}>
              <a href="mailto:info@shivalaytravels.com" style={{ fontFamily: 'var(--font-cosmica)', fontSize: 13, color: 'rgba(255,255,255,0.4)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-orchid-flash)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}>
                info@shivalaytravels.com
              </a>
              <a href="https://wa.me/919340994628" target="_blank" rel="noopener noreferrer" style={{ fontFamily: 'var(--font-cosmica)', fontSize: 13, color: 'rgba(255,255,255,0.4)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-orchid-flash)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}>
                WhatsApp: +91 93409 94628
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
                    <span
                      key={link}
                      style={{
                        fontFamily: 'var(--font-cosmica)', fontSize: 13.5, fontWeight: 400,
                        color: 'rgba(255,255,255,0.45)', textAlign: 'left', padding: 0,
                      }}
                    >
                      {link}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <p style={{ fontFamily: 'var(--font-cosmica)', fontSize: 13, fontWeight: 400, color: 'rgba(255,255,255,0.25)' }}>
            © 2026 Shivalay Travels. All rights reserved.
          </p>
          <p style={{ fontFamily: 'var(--font-cosmica)', fontSize: 13, fontWeight: 300, color: 'rgba(255,255,255,0.2)' }}>
            Your Journey, Our Responsibility.
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
