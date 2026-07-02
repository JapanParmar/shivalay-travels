'use client';
import { useEffect, useState, useRef } from 'react';

const NAV_LINKS = [
  { label: 'Ticket Booking', id: 'tickets' },
  { label: 'Destinations', id: 'destinations' },
  { label: 'Temple Yatras', id: 'itinerary-preview' },
  { label: 'How it works', id: 'how-it-works' },
  { label: 'Stories', id: 'stories' },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hovered, setHovered] = useState<string | null>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docH > 0 ? (window.scrollY / docH) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Active section tracking via IntersectionObserver
  useEffect(() => {
    const sectionIds = NAV_LINKS.map((l) => l.id);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id);
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  // Lock body scroll when mobile menu is open
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
      <header
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
          transition: 'background 0.4s ease, border-bottom 0.4s ease',
          background: scrolled ? 'rgba(9, 9, 11, 0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--color-pebble)' : '1px solid transparent',
        }}
      >
        {/* Scroll progress bar */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, height: 2,
          width: `${scrollProgress}%`,
          background: 'var(--color-ember)',
          transition: 'width 0.1s linear',
          zIndex: 201,
        }} />

        <div
          className="container"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}
        >
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'none', border: 'none', cursor: 'pointer',
              transition: 'transform 0.25s var(--ease-spring)',
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.03)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <div style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'var(--color-ember)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff',
            }}
            >
              {/* Trident (Trishul) Icon */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v18M6 8v1c0 3 2 5.5 6 5.5s6-2.5 6-5.5V8M9 21h6" />
                <path d="M12 6c1.5 0 2 1.5 2 1.5" />
              </svg>
            </div>
            <span style={{ fontFamily: 'var(--font-cosmica)', fontWeight: 800, fontSize: 19, color: 'var(--color-obsidian)', letterSpacing: '-0.3px' }}>
              Shivalay <span style={{ color: 'var(--color-steel)', fontWeight: 500 }}>Travels</span>
            </span>
          </button>

          {/* Desktop nav */}
          <nav ref={navRef} style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="desktop-nav">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.id;
              const isHovered = hovered === link.id;
              return (
                <button
                  key={link.id}
                  className="nav-link"
                  onClick={() => scrollTo(link.id)}
                  onMouseEnter={() => setHovered(link.id)}
                  onMouseLeave={() => setHovered(null)}
                  style={{
                    background: isHovered ? 'var(--color-fog)' : 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-pill)',
                    color: isActive ? 'var(--color-obsidian)' : 'var(--color-steel)',
                    fontWeight: isActive ? 600 : 500,
                    transition: 'all 0.2s ease',
                  }}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* CTA + Hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              className="btn-primary desktop-nav"
              onClick={() => scrollTo('planner')}
              style={{ fontSize: 14, padding: '9px 18px' }}
            >
              Plan my journey
            </button>
            {/* Animated hamburger */}
            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="mobile-menu-btn"
              style={{
                display: 'none', background: 'none', border: 'none',
                cursor: 'pointer', padding: 8, borderRadius: 8,
                transition: 'background 0.2s ease',
              }}
              aria-label="Menu"
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-fog)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{ width: 20, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{
                  width: '100%', height: 2, background: 'var(--color-obsidian)', borderRadius: 2,
                  transition: 'transform 0.3s ease, width 0.3s ease',
                  transform: mobileOpen ? 'rotate(45deg) translateY(6px)' : 'none',
                }} />
                <div style={{
                  height: 2, background: 'var(--color-obsidian)', borderRadius: 2,
                  transition: 'opacity 0.3s ease, width 0.3s ease',
                  opacity: mobileOpen ? 0 : 1,
                  width: mobileOpen ? 0 : '100%',
                }} />
                <div style={{
                  height: 2, background: 'var(--color-obsidian)', borderRadius: 2,
                  transition: 'transform 0.3s ease, width 0.3s ease',
                  transform: mobileOpen ? 'rotate(-45deg) translateY(-6px)' : 'none',
                  width: mobileOpen ? '100%' : '70%',
                }} />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu — full screen with slide-in */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 199,
        background: 'rgba(0, 0, 0, 0.98)',
        backdropFilter: 'blur(24px)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 8,
        paddingTop: 64,
        opacity: mobileOpen ? 1 : 0,
        transform: mobileOpen ? 'translateY(0)' : 'translateY(-8px)',
        transition: 'opacity 0.35s var(--ease-out), transform 0.35s var(--ease-out)',
        pointerEvents: mobileOpen ? 'all' : 'none',
      }}>
        {NAV_LINKS.map((link, i) => (
          <button
            key={link.id}
            onClick={() => scrollTo(link.id)}
            style={{
              fontFamily: 'var(--font-cosmica)', fontWeight: 600, fontSize: 28,
              color: 'var(--color-obsidian)', background: 'none', border: 'none', cursor: 'pointer',
              padding: '12px 24px', borderRadius: 'var(--radius-card)',
              transition: 'all 0.2s ease',
              opacity: mobileOpen ? 1 : 0,
              transform: mobileOpen ? 'translateY(0)' : 'translateY(12px)',
              transitionDelay: mobileOpen ? `${i * 0.06}s` : '0s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-fog)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
          >
            {link.label}
          </button>
        ))}
        <button
          className="btn-primary"
          onClick={() => scrollTo('planner')}
          style={{
            marginTop: 24,
            opacity: mobileOpen ? 1 : 0,
            transform: mobileOpen ? 'translateY(0)' : 'translateY(12px)',
            transition: 'all 0.3s var(--ease-out)',
            transitionDelay: mobileOpen ? `${NAV_LINKS.length * 0.06}s` : '0s',
          }}
        >
          Plan my journey
        </button>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}
