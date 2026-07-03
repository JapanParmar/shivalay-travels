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

const linkStyle: React.CSSProperties = {
  fontFamily: 'var(--font-geist-mono)',
  fontSize: 12,
  fontWeight: 400,
  color: 'var(--color-ash-gray)',
  textDecoration: 'none',
  transition: 'color 0.18s ease',
  cursor: 'pointer',
  display: 'block',
};

export default function Footer() {
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, external?: boolean) => {
    if (!external && href.startsWith('#')) {
      e.preventDefault();
      const target = document.getElementById(href.substring(1));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer style={{ background: 'var(--surface-canvas)', borderTop: '1px solid var(--color-zinc-hairline)', padding: '48px 0 32px' }}>
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <div style={{
                width: 24, height: 24, borderRadius: 'var(--radius-md)',
                background: 'var(--color-highlighter-lime)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--color-onyx-black)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                </svg>
              </div>
              <span style={{ fontFamily: 'var(--font-geist-mono)', fontWeight: 500, fontSize: 14, color: 'var(--color-pure-white)' }}>Shivalay Travels</span>
            </div>
            <p style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 12, color: 'var(--color-ash-gray)', lineHeight: 1.65 }}>
              Complete travel solutions for all your pilgrimage and holiday needs.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 20 }}>
              <a href="mailto:info@shivalaytravels.com" style={linkStyle}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-pure-white)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-ash-gray)')}>
                info@shivalaytravels.com
              </a>
              <a href="https://wa.me/919340994628" target="_blank" rel="noopener noreferrer" style={linkStyle}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-pure-white)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-ash-gray)')}>
                WhatsApp: +91 93409 94628
              </a>
            </div>
          </div>

          {/* Link columns */}
          <div className="footer-links-grid">
            {COLS.map(col => (
              <div key={col.label}>
                <p style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 10, fontWeight: 500, color: 'var(--color-steel-gray)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 16 }}>
                  {col.label}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {col.links.map(link => (
                    <a
                      key={link.name}
                      href={link.href}
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                      onClick={e => handleLinkClick(e, link.href, link.external)}
                      style={linkStyle}
                      onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-pure-white)')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-ash-gray)')}
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
        <div style={{
          borderTop: '1px solid var(--color-zinc-hairline)',
          paddingTop: 24,
          marginTop: 40,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 10,
        }}>
          <p style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 12, color: 'var(--color-ash-gray)' }}>
            © 2026 Shivalay Travels. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--color-highlighter-lime)', display: 'inline-block', animation: 'pulse 2s infinite' }} />
            <p style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 12, color: 'var(--color-ash-gray)' }}>
              Your Journey, Our Responsibility.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .footer-links-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .footer-links-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
        }
      `}</style>
    </footer>
  );
}
