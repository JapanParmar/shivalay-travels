'use client';
import { useState, useEffect, useRef } from 'react';

const CYCLING_WORDS = ['fast', 'lowest-fare', 'reliable', 'hassle-free', 'secured'];

const FLOATING_TAGS = [
  { text: '✈️ Flight Booking', delay: '0s', x: '5%', y: '15%' },
  { text: '🚆 Train Tickets', delay: '1.2s', x: '85%', y: '25%' },
  { text: '🚌 Bus Booking', delay: '0.6s', x: '10%', y: '72%' },
  { text: '🚢 Cruise Tours', delay: '1.8s', x: '80%', y: '68%' },
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
      className="hero-section"
      style={{ background: 'var(--surface-canvas)', paddingTop: 104, paddingBottom: 56, position: 'relative', overflow: 'hidden' }}
    >
      {/* Ambient background blobs */}
      <div style={{
        position: 'absolute', top: -100, right: -100, width: 500, height: 500,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(220,38,38,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
        transform: `translate(${mousePos.x * 0.4}px, ${mousePos.y * 0.4}px)`,
        transition: 'transform 0.8s var(--ease-out)',
      }} />
      <div style={{
        position: 'absolute', bottom: -50, left: -80, width: 400, height: 400,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(220,38,38,0.07) 0%, transparent 70%)',
        pointerEvents: 'none',
        transform: `translate(${mousePos.x * -0.3}px, ${mousePos.y * -0.3}px)`,
        transition: 'transform 0.8s var(--ease-out)',
      }} />

      {/* Floating destination tags */}
      {mounted && FLOATING_TAGS.map((tag) => (
        <div key={tag.text} className="floating-tag" style={{
          position: 'absolute', left: tag.x, top: tag.y,
          background: 'var(--surface-card-white)',
          backdropFilter: 'blur(12px)',
          border: '1px solid var(--color-pebble)',
          borderRadius: 'var(--radius-pill)',
          padding: '6px 14px',
          fontFamily: 'var(--font-cosmica)', fontSize: 12, fontWeight: 600,
          color: 'var(--color-obsidian)',
          boxShadow: 'var(--shadow-md)',
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
              background: '#fff', marginRight: 4,
              animation: 'pulse 2s ease-in-out infinite',
            }} />
            <span style={{ fontSize: 12, fontWeight: 500, color: '#fff' }}>🇮🇳 India's Trusted Pilgrimage & Tourism Partner</span>
            <span style={{ color: 'rgba(255,255,255,0.3)', margin: '0 8px' }}>·</span>
            <button
              onClick={() => document.getElementById('stories')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                fontFamily: 'var(--font-cosmica)', fontSize: 12, fontWeight: 500,
                color: '#fff', background: 'none', border: 'none',
                textDecoration: 'underline', cursor: 'pointer', transition: 'opacity 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              Explore Traveller Stories →
            </button>
          </div>
        </div>

        <div className="hero-main-grid" style={{
          opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(24px)',
          transition: 'opacity 0.8s ease 0.25s, transform 0.8s var(--ease-out) 0.25s',
        }}>
          {/* LEFT */}
          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              <span className="badge badge-dark reveal reveal-d1" style={{ background: 'var(--color-graphite)', color: '#fafafa', fontWeight: 600 }}>YOUR JOURNEY, OUR RESPONSIBILITY</span>
              <span className="badge" style={{ background: 'var(--color-fog)', color: 'var(--color-obsidian)', border: '1px solid var(--color-pebble)' }}>Indore, Madhya Pradesh</span>
            </div>

            <h1 className="reveal" style={{
              fontFamily: 'var(--font-cosmica)', fontSize: 'clamp(38px, 4.8vw, 58px)',
              fontWeight: 700, lineHeight: 1.12, color: 'var(--color-obsidian)', marginBottom: 20,
            }}>
              INSTANT TICKET BOOKINGS<br />
              Made <span
                key={wordIdx}
                className="text-muted"
                style={{ display: 'inline-block', color: 'var(--color-ash)', animation: 'revealUp 0.45s var(--ease-spring) both' }}
              >
                {CYCLING_WORDS[wordIdx]}
              </span><br />
              & Sacred Temple Yatras
            </h1>

            <p className="reveal reveal-d2" style={{
              fontFamily: 'var(--font-cosmica)', fontSize: 15, fontWeight: 400,
              color: 'var(--color-steel)', lineHeight: 1.7, maxWidth: 500, marginBottom: 28,
            }}>
              Shivalay Travels is Indore's trusted agency for instant ticket bookings. Get the lowest prices on Flights, Trains, Buses, and Cruises with 24/7 on-ground assistance and customized tour planning.
            </p>

            {/* Destination chips */}
            <div className="reveal reveal-d3" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
              {['Kedarnath', 'Chardham Yatra', 'Varanasi', 'Kashmir', 'Goa', 'Kerala', 'Rajasthan'].map((dest) => (
                <button
                  key={dest}
                  onClick={() => {
                    const plannerEl = document.getElementById('planner');
                    if (plannerEl) plannerEl.scrollIntoView({ behavior: 'smooth' });
                  }}
                  style={{
                    padding: '7px 16px', borderRadius: 'var(--radius-pill)',
                    border: '1px solid var(--color-pebble)', background: 'var(--surface-card-white)',
                    fontFamily: 'var(--font-cosmica)', fontSize: 13, fontWeight: 600,
                    color: 'var(--color-ink)', cursor: 'pointer', transition: 'all 0.25s var(--ease-out)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--color-obsidian)';
                    e.currentTarget.style.background = 'var(--color-fog)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--color-pebble)';
                    e.currentTarget.style.background = 'var(--surface-card-white)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {dest}
                </button>
              ))}
            </div>

            {/* Trust Stats / Badges */}
            <div className="reveal reveal-d4 hero-badges-grid" style={{
              display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12,
              borderTop: '1px solid var(--color-pebble)', paddingTop: 24,
            }}>
              {[
                { icon: '₹', title: 'Best Prices Challenge', desc: 'Guaranteed Rates' },
                { icon: '🎧', title: '24x7 Support', desc: 'Always Available' },
                { icon: '🛡️', title: 'Safe & Secure Journey', desc: 'Verified Transit' },
                { icon: '👥', title: 'Customer Satisfaction', desc: 'Highly Rated' },
              ].map((badge) => (
                <div key={badge.title} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                  background: 'var(--surface-card-white)', padding: '12px 6px', borderRadius: '12px',
                  border: '1px solid var(--color-pebble)', transition: 'transform 0.25s ease',
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.borderColor = 'var(--color-ember)';
                    e.currentTarget.style.background = 'var(--surface-card-muted)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.borderColor = 'var(--color-pebble)';
                    e.currentTarget.style.background = 'var(--surface-card-white)';
                  }}
                >
                  <span style={{ fontSize: 20, marginBottom: 6, color: 'var(--color-slate)' }}>{badge.icon}</span>
                  <p style={{ fontFamily: 'var(--font-cosmica)', fontSize: 11, fontWeight: 700, color: 'var(--color-obsidian)', lineHeight: 1.2 }}>{badge.title}</p>
                  <p style={{ fontFamily: 'var(--font-cosmica)', fontSize: 9, color: 'var(--color-steel)', marginTop: 4 }}>{badge.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — visual stack */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Hero image card - Kedarnath Special */}
            <div
              className="portfolio-tile reveal-scale"
              style={{
                height: 340, width: '100%', position: 'relative',
                boxShadow: 'var(--shadow-md)',
                borderRadius: '36px',
                border: '1px solid var(--color-pebble)',
                transform: `perspective(1000px) rotateY(${mousePos.x * 0.015}deg) rotateX(${mousePos.y * -0.012}deg)`,
                transition: 'transform 0.6s var(--ease-out)',
              }}
            >
              {/* Kedarnath Temple Image */}
              <img className="tile-img" src="/images/kedarnath.png" alt="Kedarnath Yatra" />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(9,9,11,0.9) 0%, rgba(9,9,11,0.2) 60%, transparent 100%)' }} />

              <div style={{ position: 'absolute', top: 16, left: 16 }}>
                <span className="badge badge-overlay" style={{ background: 'rgba(9,9,11,0.65)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff' }}>TEMPLE YATRA SPECIAL</span>
              </div>
              <div style={{ position: 'absolute', top: 16, right: 16 }}>
                <span className="badge glass" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}>Kedarnath Yatra</span>
              </div>
              <div style={{ position: 'absolute', bottom: 18, left: 18, right: 18 }}>
                <p style={{ fontFamily: 'var(--font-cosmica)', fontSize: 10, fontWeight: 700, color: 'var(--color-ash)', textTransform: 'uppercase', letterSpacing: '1px' }}>Spiritual Journey • Divine Experience</p>
                <h4 style={{ fontFamily: 'var(--font-cosmica)', fontSize: 22, fontWeight: 600, color: '#fff', marginTop: 4 }}>Complete Pilgrimage Solutions</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginTop: 12 }}>
                  {['Comfortable Stay', 'Hygienic Food', 'VIP Darshan', 'Travel Assistance'].map((inc) => (
                    <span key={inc} style={{ fontSize: 11, color: '#e4e4e7', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ color: '#ffffff' }}>✦</span> {inc}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Consultation Card */}
            <div className="card-white reveal reveal-d3" style={{ padding: '28px', border: '1px solid var(--color-pebble)', borderRadius: '36px', boxShadow: 'none' }}>
              <h3 style={{ fontFamily: 'var(--font-cosmica)', fontSize: 15, fontWeight: 700, color: 'var(--color-obsidian)', marginBottom: 6 }}>
                Need instant booking assistance?
              </h3>
              <p style={{ fontFamily: 'var(--font-cosmica)', fontSize: 13, color: 'var(--color-steel)', lineHeight: 1.5, marginBottom: 14 }}>
                Enter your phone number to get connected directly to our support desk on WhatsApp.
              </p>
              <form
                className="hero-consultation-form"
                onSubmit={e => {
                  e.preventDefault();
                  const target = e.currentTarget.elements.namedItem('phone') as HTMLInputElement;
                  const val = target ? target.value : '';
                  const encoded = encodeURIComponent(`Hello Shivalay Travels, I need instant booking support for my trip. Contact: ${val}`);
                  window.open(`https://wa.me/919340994628?text=${encoded}`, '_blank');
                }}
              >
                <input
                  className="input-luxury"
                  name="phone"
                  type="tel"
                  placeholder="Enter Phone Number"
                  style={{ flex: 1, background: 'var(--color-mist)', borderColor: 'transparent', color: 'var(--color-obsidian)' }}
                  required
                />
                <button type="submit" className="btn-primary" style={{ flexShrink: 0, fontSize: 13, padding: '11px 16px' }}>
                  Get Tickets
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .hero-section .floating-tag { display: none !important; }
        }
        @media (max-width: 600px) {
          .hero-section { padding-top: 80px !important; padding-bottom: 40px !important; }
        }
        @media (max-width: 400px) {
          .hero-badges-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
