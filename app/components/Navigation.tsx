'use client';
import { useEffect, useState, useRef } from 'react';

const NAV_LINKS = [
  { label: 'Ticket Booking', id: 'tickets' },
  { label: 'Destinations', id: 'destinations' },
  { label: 'Temple Yatras', id: 'itinerary-preview' },
  { label: 'How it works', id: 'how-it-works' },
  { label: 'Stories', id: 'stories' },
];

export default function Navigation({ settings }: { settings?: any }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docH > 0 ? (window.scrollY / docH) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sectionIds = NAV_LINKS.map((l) => l.id);
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) setActiveSection(e.target.id); }); },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    sectionIds.forEach((id) => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        background: scrolled ? 'var(--color-onyx-black-95)' : 'var(--color-onyx-black-80)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--color-zinc-hairline)',
        transition: 'background 0.3s ease',
      }}>
        {/* Scroll progress bar */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, height: '1px',
          width: `${scrollProgress}%`,
          background: 'var(--color-highlighter-lime)',
          transition: 'width 0.1s linear',
          zIndex: 201,
        }} />

        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer' }}
          >
            {/* Lime dot mark */}
            <div style={{
              width: 28, height: 28, borderRadius: '6px',
              background: 'var(--color-highlighter-lime)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-onyx-black)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 2L15 22L11 13L2 9L22 2Z" />
              </svg>
            </div>
            <span className="text-logo-brand" style={{ display: 'flex', alignItems: 'center' }}>
              {settings?.businessName || 'Shivalay Travels'}
            </span>
          </button>

          {/* Desktop nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 2 }} className="desktop-nav">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                className={`nav-link${activeSection === link.id ? ' active' : ''}`}
                onClick={() => scrollTo(link.id)}
                style={{ color: activeSection === link.id ? 'var(--color-pure-white)' : 'var(--color-steel-gray)' }}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right: CTA + hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <a
              href={`https://wa.me/${settings?.whatsapp || '919340994628'}?text=Hello%20${encodeURIComponent(settings?.businessName || 'Shivalay Travels')}!%20I%20need%20help%20with%20a%20booking.`}
              target="_blank" rel="noopener noreferrer"
              className="desktop-nav ff-mono fs-12"
              style={{
                color: 'var(--color-steel-gray)',
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '5px 10px', borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-zinc-hairline)',
                transition: 'all 0.18s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-pure-white)'; e.currentTarget.style.borderColor = 'var(--color-smoke)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-steel-gray)'; e.currentTarget.style.borderColor = 'var(--color-zinc-hairline)'; }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </a>

            <button
              className="btn-primary desktop-nav"
              onClick={() => scrollTo('planner')}
              style={{ padding: '7px 14px' }}
            >
              Plan Journey →
            </button>

            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="mobile-menu-btn"
              style={{ display: 'none', background: 'none', border: '1px solid var(--color-zinc-hairline)', cursor: 'pointer', padding: 7, borderRadius: 'var(--radius-md)', transition: 'background 0.18s ease' }}
              aria-label="Menu"
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-carbon)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{ width: 18, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ width: '100%', height: 1.5, background: 'var(--color-pure-white)', borderRadius: 2, transition: 'transform 0.25s ease', transform: mobileOpen ? 'rotate(45deg) translateY(5.5px)' : 'none' }} />
                <div style={{ height: 1.5, background: 'var(--color-pure-white)', borderRadius: 2, transition: 'opacity 0.25s ease', opacity: mobileOpen ? 0 : 1 }} />
                <div style={{ height: 1.5, background: 'var(--color-pure-white)', borderRadius: 2, transition: 'transform 0.25s ease', transform: mobileOpen ? 'rotate(-45deg) translateY(-5.5px)' : 'none', width: mobileOpen ? '100%' : '70%' }} />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile fullscreen overlay */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 199,
        background: 'var(--color-onyx-black-98)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 4,
        paddingTop: 56,
        opacity: mobileOpen ? 1 : 0,
        transform: mobileOpen ? 'translateY(0)' : 'translateY(-6px)',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
        pointerEvents: mobileOpen ? 'all' : 'none',
      }}>
        {NAV_LINKS.map((link, i) => (
          <button
            key={link.id}
            onClick={() => scrollTo(link.id)}
            className="ff-tomorrow fs-24 fw-400"
            style={{
              color: activeSection === link.id ? 'var(--color-highlighter-lime)' : 'var(--color-pure-white)',
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '12px 24px', borderRadius: 'var(--radius-xl)',
              transition: 'all 0.18s ease',
              opacity: mobileOpen ? 1 : 0,
              transform: mobileOpen ? 'translateY(0)' : 'translateY(10px)',
              transitionDelay: mobileOpen ? `${i * 0.05}s` : '0s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-carbon)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
          >
            {link.label}
          </button>
        ))}
        <button
          className="btn-primary"
          onClick={() => scrollTo('planner')}
          style={{
            marginTop: 20,
            opacity: mobileOpen ? 1 : 0,
            transform: mobileOpen ? 'translateY(0)' : 'translateY(10px)',
            transition: 'all 0.3s ease',
            transitionDelay: mobileOpen ? `${NAV_LINKS.length * 0.05}s` : '0s',
          }}
        >
          Plan Journey
        </button>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="mobile-bottom-nav">
        {[
          { id: 'tickets', label: 'Tickets', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L15 22L11 13L2 9L22 2Z" /></svg> },
          { id: 'destinations', label: 'Explore', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/></svg> },
          { id: 'planner', label: 'Plan', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>, isMain: true },
          { id: 'stories', label: 'Stories', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg> },
          { id: 'how-it-works', label: 'About', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg> },
        ].map(item => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`mobile-bottom-nav-btn${item.isMain ? ' mobile-bottom-nav-main' : ''}`}
              style={{
                color: item.isMain ? 'var(--color-onyx-black)' : isActive ? 'var(--color-highlighter-lime)' : 'var(--color-steel-gray)',
              }}
            >
              {item.icon}
              <span className="text-nav-label">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}
