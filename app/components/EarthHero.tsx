'use client';
import { useState, useEffect, useRef } from 'react';

const CYCLING_WORDS = ['transformative', 'breathtaking', 'luxurious', 'custom-tailored', 'unforgettable'];

const FLOATING_TAGS = [
  { text: '🏔️ Ladakh', delay: '0s', x: '5%', y: '15%' },
  { text: '🌿 Kerala', delay: '1.2s', x: '85%', y: '25%' },
  { text: '🏯 Rajasthan', delay: '0.6s', x: '10%', y: '72%' },
  { text: '❄️ Kashmir', delay: '1.8s', x: '80%', y: '68%' },
];

export default function Hero() {
  const [wordIdx, setWordIdx] = useState(0);
  const [email, setEmail] = useState('');
  const [mounted, setMounted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setWordIdx((i) => (i + 1) % CYCLING_WORDS.length), 2800);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width - 0.5) * 20,
        y: ((e.clientY - rect.top) / rect.height - 0.5) * 20,
      });
    };
    const el = heroRef.current;
    el?.addEventListener('mousemove', handleMouseMove);
    return () => el?.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section
      ref={heroRef}
      style={{ background: 'var(--surface-canvas)', paddingTop: 104, paddingBottom: 56, position: 'relative', overflow: 'hidden' }}
    >
      {/* Ambient background blobs */}
      <div style={{
        position: 'absolute', top: -100, right: -100, width: 500, height: 500,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(254,69,226,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
        transform: `translate(${mousePos.x * 0.4}px, ${mousePos.y * 0.4}px)`,
        transition: 'transform 0.8s var(--ease-out)',
      }} />
      <div style={{
        position: 'absolute', bottom: -50, left: -80, width: 400, height: 400,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,90,0,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
        transform: `translate(${mousePos.x * -0.3}px, ${mousePos.y * -0.3}px)`,
        transition: 'transform 0.8s var(--ease-out)',
      }} />

      {/* Floating destination tags */}
      {mounted && FLOATING_TAGS.map((tag) => (
        <div key={tag.text} style={{
          position: 'absolute', left: tag.x, top: tag.y,
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.9)',
          borderRadius: 'var(--radius-pill)',
          padding: '6px 14px',
          fontFamily: 'var(--font-cosmica)', fontSize: 12, fontWeight: 600,
          color: 'var(--color-obsidian)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          animation: `floatSlow 5s ease-in-out ${tag.delay} infinite`,
          pointerEvents: 'none',
          zIndex: 1,
        }}>
          {tag.text}
        </div>
      ))}

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        {/* Announcement */}
        <div style={{
          display: 'flex', justifyContent: 'center', marginBottom: 40,
          opacity: mounted ? 1 : 0, transition: 'opacity 0.6s ease 0.1s',
        }}>
          <div className="announcement-banner">
            <span style={{
              display: 'inline-block', width: 6, height: 6, borderRadius: '50%',
              background: '#22c55e', marginRight: 4,
              animation: 'pulse 2s ease-in-out infinite',
            }} />
            <span style={{ fontSize: 12, fontWeight: 500, color: '#fff' }}>🇮🇳 India's Premier Private Travel Architect</span>
            <span style={{ color: 'rgba(255,255,255,0.3)', margin: '0 8px' }}>·</span>
            <button
              onClick={() => document.getElementById('stories')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                fontFamily: 'var(--font-cosmica)', fontSize: 12, fontWeight: 500,
                color: 'var(--color-orchid-flash)', background: 'none', border: 'none',
                cursor: 'pointer', transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              Explore Traveller Stories →
            </button>
          </div>
        </div>

        {/* 2-col grid */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 48, alignItems: 'center',
          opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(24px)',
          transition: 'opacity 0.8s ease 0.25s, transform 0.8s var(--ease-out) 0.25s',
        }}>
          {/* LEFT */}
          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              <span className="badge badge-dark reveal reveal-d1" style={{ background: 'var(--color-obsidian)' }}>Indian Odysseys Only</span>
              <span className="badge reveal reveal-d2" style={{ background: 'var(--color-fog)', color: 'var(--color-graphite)' }}>Est. 2010 · New Delhi</span>
            </div>

            <h1 className="reveal" style={{
              fontFamily: 'var(--font-cosmica)', fontSize: 'clamp(38px, 4.8vw, 58px)',
              fontWeight: 700, lineHeight: 1.08, color: 'var(--color-obsidian)', marginBottom: 20,
            }}>
              Architecting<br />
              <span
                key={wordIdx}
                className="gradient-text"
                style={{ display: 'inline-block', animation: 'revealUp 0.45s var(--ease-spring) both' }}
              >
                {CYCLING_WORDS[wordIdx]}
              </span>
              <br />private Indian journeys.
            </h1>

            <p className="reveal reveal-d2" style={{
              fontFamily: 'var(--font-cosmica)', fontSize: 16, fontWeight: 400,
              color: 'var(--color-steel)', lineHeight: 1.75, maxWidth: 500, marginBottom: 28,
            }}>
              We do not sell pre-packaged tours. Lumière designs ultra-luxury, private expeditions across India's most majestic landscapes — from the heights of Ladakh to the tranquility of Kerala's backwaters.
            </p>

            {/* Destination chips */}
            <div className="reveal reveal-d3" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
              {['Ladakh', 'Kashmir', 'Kerala', 'Meghalaya', 'Rajasthan', 'Goa', 'Hampi'].map((dest) => (
                <button
                  key={dest}
                  onClick={() => document.getElementById('destinations')?.scrollIntoView({ behavior: 'smooth' })}
                  style={{
                    padding: '7px 16px', borderRadius: 'var(--radius-pill)',
                    border: '1px solid var(--color-pebble)', background: 'var(--color-snow)',
                    fontFamily: 'var(--font-cosmica)', fontSize: 13, fontWeight: 600,
                    color: 'var(--color-ink)', cursor: 'pointer', transition: 'all 0.25s var(--ease-out)',
                    boxShadow: 'var(--shadow-card-inset)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--color-obsidian)';
                    e.currentTarget.style.background = 'var(--color-obsidian)';
                    e.currentTarget.style.color = '#fff';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--color-pebble)';
                    e.currentTarget.style.background = 'var(--color-snow)';
                    e.currentTarget.style.color = 'var(--color-ink)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {dest}
                </button>
              ))}
            </div>

            {/* Trust stats */}
            <div className="reveal reveal-d4" style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20,
              borderTop: '1px solid var(--color-fog)', paddingTop: 24,
            }}>
              {[
                { num: '4,800+', label: 'Bespoke itineraries for discerning travellers' },
                { num: '100%', label: 'Private — dedicated guides & chartered logistics' },
              ].map((stat) => (
                <div key={stat.num} style={{ transition: 'transform 0.25s ease' }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'none')}
                >
                  <p style={{ fontFamily: 'var(--font-cosmica)', fontSize: 26, fontWeight: 700, color: 'var(--color-obsidian)', lineHeight: 1 }}>{stat.num}</p>
                  <p style={{ fontFamily: 'var(--font-cosmica)', fontSize: 13, color: 'var(--color-steel)', marginTop: 6, lineHeight: 1.5 }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — visual stack */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Hero image card */}
            <div
              className="portfolio-tile reveal-scale"
              style={{
                height: 330, width: '100%', position: 'relative',
                boxShadow: '0 24px 64px rgba(0,0,0,0.16)',
                transform: `perspective(1000px) rotateY(${mousePos.x * 0.015}deg) rotateX(${mousePos.y * -0.012}deg)`,
                transition: 'transform 0.6s var(--ease-out)',
              }}
            >
              <img className="tile-img" src="/images/kashmir.png" alt="Kashmir Dal Lake" />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(9,9,11,0.88) 0%, rgba(9,9,11,0.15) 60%, transparent 100%)' }} />

              <div style={{ position: 'absolute', top: 16, left: 16 }}>
                <span className="badge badge-ember">FEATURED EXPERIENCE</span>
              </div>
              <div style={{ position: 'absolute', top: 16, right: 16 }}>
                <span className="badge glass" style={{ color: '#fff' }}>Kashmir</span>
              </div>
              <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}>
                <p style={{ fontFamily: 'var(--font-cosmica)', fontSize: 11, fontWeight: 600, color: 'var(--color-orchid-flash)', textTransform: 'uppercase', letterSpacing: '1px' }}>Vistas of Srinagar</p>
                <h4 style={{ fontFamily: 'var(--font-cosmica)', fontSize: 19, fontWeight: 700, color: '#fff', marginTop: 2 }}>Dawn on Dal Lake via Private Shikara</h4>
              </div>
            </div>

            {/* Email capture card */}
            <div className="card-white reveal reveal-d3" style={{ padding: '22px 26px' }}>
              <h3 style={{ fontFamily: 'var(--font-cosmica)', fontSize: 15, fontWeight: 700, color: 'var(--color-obsidian)', marginBottom: 6 }}>
                Plan your bespoke Indian escape
              </h3>
              <p style={{ fontFamily: 'var(--font-cosmica)', fontSize: 13, color: 'var(--color-steel)', lineHeight: 1.5, marginBottom: 14 }}>
                Enter your email to receive a complimentary custom itinerary outline.
              </p>
              <form
                onSubmit={e => { e.preventDefault(); document.getElementById('planner')?.scrollIntoView({ behavior: 'smooth' }); }}
                style={{ display: 'flex', gap: 8 }}
              >
                <input
                  className="input-luxury"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  style={{ flex: 1 }}
                  required
                />
                <button type="submit" className="btn-primary" style={{ flexShrink: 0, fontSize: 13, padding: '11px 16px' }}>
                  Let's Begin
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          section > .container > div:nth-child(2) { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </section>
  );
}
