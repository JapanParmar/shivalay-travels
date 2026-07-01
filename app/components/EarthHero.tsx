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
        background: 'radial-gradient(circle, rgba(195,0,16,0.06) 0%, transparent 70%)',
        pointerEvents: 'none',
        transform: `translate(${mousePos.x * 0.4}px, ${mousePos.y * 0.4}px)`,
        transition: 'transform 0.8s var(--ease-out)',
      }} />
      <div style={{
        position: 'absolute', bottom: -50, left: -80, width: 400, height: 400,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(195,0,16,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
        transform: `translate(${mousePos.x * -0.3}px, ${mousePos.y * -0.3}px)`,
        transition: 'transform 0.8s var(--ease-out)',
      }} />

      {/* Floating destination tags */}
      {mounted && FLOATING_TAGS.map((tag) => (
        <div key={tag.text} className="floating-tag" style={{
          position: 'absolute', left: tag.x, top: tag.y,
          background: 'rgba(20,20,25,0.85)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 'var(--radius-pill)',
          padding: '6px 14px',
          fontFamily: 'var(--font-cosmica)', fontSize: 12, fontWeight: 600,
          color: '#fff',
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
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
          <div className="announcement-banner" style={{ border: '1px solid rgba(195,0,16,0.3)', background: 'rgba(20,20,25,0.9)' }}>
            <span style={{
              display: 'inline-block', width: 6, height: 6, borderRadius: '50%',
              background: 'var(--color-ember)', marginRight: 4,
              animation: 'pulse 2s ease-in-out infinite',
            }} />
            <span style={{ fontSize: 12, fontWeight: 500, color: '#fff' }}>🇮🇳 India's Trusted Pilgrimage & Tourism Partner</span>
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
        <div className="hero-main-grid" style={{
          display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 48, alignItems: 'center',
          opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(24px)',
          transition: 'opacity 0.8s ease 0.25s, transform 0.8s var(--ease-out) 0.25s',
        }}>
          {/* LEFT */}
          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              <span className="badge badge-dark reveal reveal-d1" style={{ background: 'var(--color-ember)', color: '#fff', fontWeight: 600 }}>YOUR JOURNEY, OUR RESPONSIBILITY</span>
              <span className="badge" style={{ background: 'rgba(195,0,16,0.15)', color: 'var(--color-orchid-flash)', border: '1px solid rgba(195,0,16,0.3)' }}>Indore, Madhya Pradesh</span>
            </div>

            <h1 className="reveal" style={{
              fontFamily: 'var(--font-cosmica)', fontSize: 'clamp(38px, 4.8vw, 58px)',
              fontWeight: 700, lineHeight: 1.08, color: '#fff', marginBottom: 20,
            }}>
              INSTANT TICKET BOOKINGS<br />
              Made <span
                key={wordIdx}
                className="gradient-text-gold"
                style={{ display: 'inline-block', animation: 'revealUp 0.45s var(--ease-spring) both' }}
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
                    border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)',
                    fontFamily: 'var(--font-cosmica)', fontSize: 13, fontWeight: 600,
                    color: '#fff', cursor: 'pointer', transition: 'all 0.25s var(--ease-out)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--color-ember)';
                    e.currentTarget.style.background = 'var(--color-ember)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
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
              borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 24,
            }}>
              {[
                { icon: '₹', title: 'Best Prices Challenge', desc: 'Guaranteed Rates' },
                { icon: '🎧', title: '24x7 Support', desc: 'Always Available' },
                { icon: '🛡️', title: 'Safe & Secure Journey', desc: 'Verified Transit' },
                { icon: '👥', title: 'Customer Satisfaction', desc: 'Highly Rated' },
              ].map((badge) => (
                <div key={badge.title} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                  background: 'rgba(255,255,255,0.02)', padding: '12px 6px', borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.04)', transition: 'transform 0.25s ease',
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.borderColor = 'var(--color-ember)';
                    e.currentTarget.style.background = 'rgba(195,0,16,0.05)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                  }}
                >
                  <span style={{ fontSize: 20, marginBottom: 6, color: 'var(--color-orchid-flash)' }}>{badge.icon}</span>
                  <p style={{ fontFamily: 'var(--font-cosmica)', fontSize: 11, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>{badge.title}</p>
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
                boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
                border: '1px solid rgba(255,255,255,0.08)',
                transform: `perspective(1000px) rotateY(${mousePos.x * 0.015}deg) rotateX(${mousePos.y * -0.012}deg)`,
                transition: 'transform 0.6s var(--ease-out)',
              }}
            >
              {/* Kedarnath Temple Image */}
              <img className="tile-img" src="/images/kedarnath.png" alt="Kedarnath Yatra" />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(9,9,11,0.95) 0%, rgba(9,9,11,0.15) 60%, transparent 100%)' }} />

              <div style={{ position: 'absolute', top: 16, left: 16 }}>
                <span className="badge badge-ember" style={{ background: 'var(--color-ember)', color: '#fff' }}>TEMPLE YATRA SPECIAL</span>
              </div>
              <div style={{ position: 'absolute', top: 16, right: 16 }}>
                <span className="badge glass" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)' }}>Kedarnath Yatra</span>
              </div>
              <div style={{ position: 'absolute', bottom: 18, left: 18, right: 18 }}>
                <p style={{ fontFamily: 'var(--font-cosmica)', fontSize: 10, fontWeight: 700, color: 'var(--color-ember)', textTransform: 'uppercase', letterSpacing: '1px' }}>Spiritual Journey • Divine Experience</p>
                <h4 style={{ fontFamily: 'var(--font-cosmica)', fontSize: 22, fontWeight: 800, color: '#fff', marginTop: 4 }}>Complete Pilgrimage Solutions</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginTop: 12 }}>
                  {['Comfortable Stay', 'Hygienic Food', 'VIP Darshan', 'Travel Assistance'].map((inc) => (
                    <span key={inc} style={{ fontSize: 11, color: '#e4e4e7', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ color: 'var(--color-ember)' }}>✦</span> {inc}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Consultation Card */}
            <div className="card-white reveal reveal-d3" style={{ padding: '22px 26px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <h3 style={{ fontFamily: 'var(--font-cosmica)', fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 6 }}>
                Need instant booking assistance?
              </h3>
              <p style={{ fontFamily: 'var(--font-cosmica)', fontSize: 13, color: 'var(--color-steel)', lineHeight: 1.5, marginBottom: 14 }}>
                Enter your phone number to get connected directly to our support desk on WhatsApp.
              </p>
              <form
                onSubmit={e => {
                  e.preventDefault();
                  const target = e.currentTarget.elements.namedItem('phone') as HTMLInputElement;
                  const val = target ? target.value : '';
                  const encoded = encodeURIComponent(`Hello Shivalay Travels, I need instant booking support for my trip. Contact: ${val}`);
                  window.open(`https://wa.me/919340994628?text=${encoded}`, '_blank');
                }}
                style={{ display: 'flex', gap: 8 }}
              >
                <input
                  className="input-luxury"
                  name="phone"
                  type="tel"
                  placeholder="Enter Phone Number"
                  style={{ flex: 1, background: 'rgba(0,0,0,0.4)', borderColor: 'rgba(255,255,255,0.08)', color: '#fff' }}
                  required
                />
                <button type="submit" className="btn-primary" style={{ flexShrink: 0, fontSize: 13, padding: '11px 16px', background: 'var(--color-ember)' }}>
                  Get Tickets
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .hero-main-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
        @media (max-width: 600px) {
          .hero-badges-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .hero-section .floating-tag { display: none !important; }
          .hero-section { padding-top: 80px !important; padding-bottom: 40px !important; }
        }
        @media (max-width: 400px) {
          .hero-badges-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
