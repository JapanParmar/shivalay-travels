'use client';

export default function Footer({ settings }: { settings?: any }) {
  const businessName = settings?.businessName || 'Shivalay Travels';
  const whatsappNumber = settings?.whatsapp || '919340994628';
  const phoneNumber = settings?.phone || '+91 93409 94628';
  const emailAddress = settings?.email || 'info@shivalaytravels.com';
  const address = settings?.address || 'Indore, Madhya Pradesh, India';

  const cols = [
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
        { name: address, href: `https://maps.google.com/?q=${encodeURIComponent(address)}`, external: true },
        { name: `Phone: ${phoneNumber}`, href: `tel:${phoneNumber.replace(/\s+/g, '')}` },
        { name: `WhatsApp: +${whatsappNumber}`, href: `https://wa.me/${whatsappNumber}` },
      ],
    },
  ];

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
              <span className="font-primary fw-medium text-md" style={{ color: 'var(--color-pure-white)' }}>{businessName}</span>
            </div>
            <p className="font-primary text-sm lh-16 text-dim">
              Complete travel solutions for all your pilgrimage and holiday needs.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 20 }}>
              <a href={`mailto:${emailAddress}`} className="text-link-sm"
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-pure-white)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-ash-gray)')}>
                {emailAddress}
              </a>
              <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="text-link-sm"
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-pure-white)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-ash-gray)')}>
                WhatsApp: +{whatsappNumber}
              </a>
            </div>
          </div>

          {/* Link columns */}
          <div className="footer-links-grid">
            {cols.map(col => (
              <div key={col.label}>
                <p className="font-primary text-xs fw-medium uppercase ls-08 text-muted" style={{ marginBottom: 16 }}>
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
                      className="text-link-sm"
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
          <p className="font-primary text-sm text-dim">
            © 2026 {businessName}. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--color-highlighter-lime)', display: 'inline-block', animation: 'pulse 2s infinite' }} />
            <p className="font-primary text-sm text-dim">
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
