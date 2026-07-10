'use client';
import { useState, useEffect } from 'react';

const CYCLING_WORDS = ['fast', 'lowest-fare', 'reliable', 'hassle-free', 'secured'];
const DESTINATIONS = ['Kedarnath', 'Chardham', 'Kashmir', 'Goa', 'Kerala', 'Ladakh', 'Rajasthan', 'Varanasi'];

export default function Hero({ settings }: { settings?: any }) {
  const [wordIdx, setWordIdx] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setWordIdx((i) => (i + 1) % CYCLING_WORDS.length), 2600);
    return () => clearInterval(id);
  }, []);

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const businessName = settings?.businessName || 'Shivalay Travels';

  return (
    <section
      style={{
        background: 'var(--surface-canvas)',
        paddingTop: 88,
        paddingBottom: 48,
        borderBottom: '1px solid var(--color-zinc-hairline)',
        position: 'relative',
      }}
    >
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="hero-grid">
          {/* ── LEFT ── */}
          <div>
            {/* Announcement */}
            <div
              className="hero-announcement"
              style={{ display: 'flex', marginBottom: 28, opacity: mounted ? 1 : 0, transition: 'opacity 0.5s ease' }}
            >
              <div className="announcement-banner">
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-highlighter-lime)', animation: 'pulse 2s ease-in-out infinite', display: 'inline-block', flexShrink: 0 }} />
                <span>🇮🇳 India&apos;s Trusted Pilgrimage &amp; Tourism Partner · Indore, MP</span>
              </div>
            </div>

            {/* Headline */}
            <h1
              className="reveal font-secondary fs-hero fw-medium lh-115"
              style={{
                color: 'var(--color-pure-white)',
                marginBottom: 16,
              }}
            >
              Instant Ticket Bookings<br />
              Made{' '}
              <span
                key={wordIdx}
                className="italic"
                style={{
                  color: 'var(--color-highlighter-lime)',
                  display: 'inline-block',
                  animation: 'revealUp 0.4s var(--ease-spring) both',
                }}
              >
                {CYCLING_WORDS[wordIdx]}
              </span>
              <br />
              &amp; Sacred Temple Yatras
            </h1>

            <p
              className="reveal reveal-d1 font-primary fs-14 lh-16 text-muted"
              style={{
                maxWidth: 480,
                marginBottom: 28,
              }}
            >
              {businessName} is Indore&apos;s trusted agency for instant ticket bookings.
              Get the lowest prices on Flights, Trains, Buses &amp; Cruises with 24/7 on-ground assistance.
            </p>

            {/* Destination chips */}
            <div
              className="reveal reveal-d2"
              style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 32 }}
            >
              {DESTINATIONS.map((dest) => (
                <button
                  key={dest}
                  onClick={() => scrollTo('planner')}
                  className="pill"
                >
                  {dest}
                </button>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="reveal reveal-d3" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 36 }}>
              <button className="btn-primary" onClick={() => scrollTo('tickets')} style={{ padding: '10px 20px' }}>
                Book Tickets →
              </button>
              <button className="btn-ghost" onClick={() => scrollTo('planner')} style={{ padding: '10px 20px' }}>
                Plan Custom Journey
              </button>
              <a
                href="https://wa.me/919340994628"
                target="_blank"
                rel="noopener noreferrer"
                className="font-primary fs-14"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '10px 20px', borderRadius: 'var(--radius-md)',
                  background: 'transparent',
                  border: '1px solid var(--color-zinc-hairline)',
                  color: 'var(--color-steel-gray)',
                  transition: 'all 0.18s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--color-pure-white)'; e.currentTarget.style.borderColor = 'var(--color-smoke)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--color-steel-gray)'; e.currentTarget.style.borderColor = 'var(--color-zinc-hairline)'; }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--color-whatsapp)' }}>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </a>
          </div>

          {/* Trust badges */}
          <div
            className="reveal reveal-d4"
            style={{ display: 'flex', gap: 0, borderTop: '1px solid var(--color-zinc-hairline)', paddingTop: 24, flexWrap: 'wrap' }}
          >
            {[
              { stat: '12,500+', label: 'Happy Travellers' },
              { stat: '50+', label: 'Destinations' },
              { stat: '24/7', label: 'Support' },
              { stat: '₹ Best', label: 'Rates' },
            ].map((item, i) => (
              <div
                key={item.stat}
                style={{
                  padding: '12px 24px',
                  borderRight: i < 3 ? '1px solid var(--color-zinc-hairline)' : 'none',
                  textAlign: 'center',
                }}
              >
                <p className="font-primary fs-18 fw-medium lh-1" style={{ color: 'var(--color-pure-white)' }}>{item.stat}</p>
                <p className="font-primary fs-11 text-muted" style={{ marginTop: 4 }}>{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT (Desktop only) ── */}
        <div className="hero-right-visual reveal-scale" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Hero image card */}
          <div className="portfolio-tile" style={{ height: 320, position: 'relative' }}>
            <img
              className="tile-img"
              src="/images/kedarnath.png"
              alt="Kedarnath Yatra"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'var(--gradient-visual-overlay)' }} />

            {/* Minting-now style badge */}
            <div style={{ position: 'absolute', top: 14, left: 14 }}>
              <span className="font-primary text-xs fw-medium uppercase ls-05" style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                background: 'var(--color-highlighter-lime)', color: 'var(--color-onyx-black)',
                padding: '4px 8px', borderRadius: 'var(--radius-full)',
              }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--color-onyx-black)', animation: 'pulse 1.5s infinite' }} />
                Temple Yatra Special
              </span>
            </div>

            <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}>
              <p className="font-primary text-xs text-muted uppercase ls-1" style={{ marginBottom: 4 }}>Spiritual Journey · Divine Experience</p>
              <h3 className="font-secondary fs-20 fw-regular" style={{ color: 'var(--color-pure-white)', marginBottom: 10 }}>Complete Pilgrimage Solutions</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                {['Comfortable Stay', 'Hygienic Food', 'VIP Darshan', 'Travel Assistance'].map((inc) => (
                  <span key={inc} className="font-primary fs-11" style={{ color: 'var(--color-white-80)', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ color: 'var(--color-highlighter-lime)' }} className="fs-10">✦</span> {inc}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Quick contact card */}
          <div
            style={{
              background: 'var(--color-onyx-black)',
              border: '1px solid var(--color-zinc-hairline)',
              borderRadius: 'var(--radius-xl)',
              padding: '20px',
            }}
          >
            <p className="font-primary fs-13 fw-medium" style={{ color: 'var(--color-pure-white)', marginBottom: 4 }}>Need instant booking assistance?</p>
            <p className="font-primary text-sm lh-15 text-muted" style={{ marginBottom: 14 }}>
              Enter your phone number to get connected directly on WhatsApp.
            </p>
            <form
              style={{ display: 'flex', gap: 8 }}
              onSubmit={e => {
                e.preventDefault();
                const target = e.currentTarget.elements.namedItem('phone') as HTMLInputElement;
                const val = target ? target.value : '';
                const encoded = encodeURIComponent(`Hello Shivalay Travels, I need instant booking support. Contact: ${val}`);
                window.open(`https://wa.me/919340994628?text=${encoded}`, '_blank');
              }}
            >
              <input
                className="input-terminal"
                name="phone"
                type="tel"
                placeholder="+91 93409 94628"
                required
                style={{ flex: 1 }}
              />
              <button type="submit" className="btn-primary" style={{ flexShrink: 0, whiteSpace: 'nowrap' }}>
                Get Tickets
              </button>
            </form>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}
