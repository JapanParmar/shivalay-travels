'use client';

const COLS = [
  {
    label: 'Destinations',
    links: [
      { name: 'Kedarnath', href: '#destinations' },
      { name: 'Chardham Yatra', href: '#destinations' },
      { name: 'Varanasi Yatra', href: '#destinations' },
      { name: 'Kashmir Valley', href: '#destinations' },
      { name: 'Goa Beaches', href: '#destinations' },
      { name: 'All Indian Tours', href: '#destinations' },
    ],
  },
  {
    label: 'Services',
    links: [
      { name: 'Flight Booking', href: '#tickets' },
      { name: 'Bus Booking', href: '#tickets' },
      { name: 'Train Booking', href: '#tickets' },
      { name: 'Hotel Stays', href: '#planner' },
      { name: 'Customised Tour Packages', href: '#planner' },
    ],
  },
  {
    label: 'Contact Office',
    links: [
      { name: 'Shop No. 2, Shivalay Travels', href: 'https://maps.google.com/?q=Shop+No.+2,+Shivalay+Travels,+Indore,+Madhya+Pradesh', external: true },
      { name: 'Indore, Madhya Pradesh', href: 'https://maps.google.com/?q=Shop+No.+2,+Shivalay+Travels,+Indore,+Madhya+Pradesh', external: true },
      { name: 'Nisha Chouhan: 9340994628', href: 'tel:+919340994628' },
      { name: 'Manisha Mali: 9340994628', href: 'tel:+919340994628' },
    ],
  },
];

export default function Footer() {
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, external?: boolean) => {
    if (!external && href.startsWith('#')) {
      e.preventDefault();
      const target = document.getElementById(href.substring(1));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer style={{ background: 'var(--color-obsidian)', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '64px 0 40px' }}>
      <div className="container">
        {/* Top */}
        <div className="footer-top-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 64, marginBottom: 64 }}>
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
          <div className="footer-links-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
            {COLS.map(col => (
              <div key={col.label}>
                <p style={{ fontFamily: 'var(--font-cosmica)', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 20 }}>
                  {col.label}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {col.links.map(link => (
                    <a
                      key={link.name}
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      onClick={(e) => handleLinkClick(e, link.href, link.external)}
                      style={{
                        fontFamily: 'var(--font-cosmica)', fontSize: 13.5, fontWeight: 400,
                        color: 'rgba(255,255,255,0.45)', textAlign: 'left', padding: 0,
                        textDecoration: 'none', transition: 'color 0.2s ease', cursor: 'pointer'
                      }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-orchid-flash)')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
                    >
                      {link.name}
                    </a>
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
          .footer-top-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .footer-links-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 480px) {
          .footer-links-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
        }
      `}</style>
    </footer>
  );
}
