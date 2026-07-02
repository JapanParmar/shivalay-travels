'use client';
import { useState, useEffect, useRef } from 'react';

const TESTIMONIALS = [
  { quote: 'Our Kashmir honeymoon was beyond imagination. Every detail — the scenic houseboat, the private saffron farm walk, the taxi transfers — felt tailored to our exact pace.', name: 'Priya & Arjun Mehta', location: 'Mumbai, India', destination: 'Kashmir', trip: 'Honeymoon · 8 nights', image: '/images/kashmir.png', rating: 5, avatar: 'PA' },
  { quote: 'The Kedarnath yatra with Shivalay Travels was incredibly smooth. They managed all registrations and our helicopter tickets without any hassle. A truly divine experience.', name: 'Ramesh & Savita Joshi', location: 'Indore, India', destination: 'Kedarnath', trip: 'Pilgrim · 5 nights', image: '/images/kedarnath.png', rating: 5, avatar: 'RS' },
  { quote: 'Taking our elderly parents to Chardham was a big concern, but Shivalay Travels made it feel absolutely stress-free. The premium Tempo Traveller was extremely comfortable.', name: 'The Verma Family', location: 'Bhopal, India', destination: 'Chardham Yatra', trip: 'Family Yatra · 11 nights', image: '/images/chardham.png', rating: 5, avatar: 'VF' },
  { quote: 'No transactional booking templates here. From our first call to our private houseboat cruise in Alleppey, we felt like honored guests. Already booking Jaisalmer for winter.', name: 'Dr. Ananya Nair', location: 'Kochi, India', destination: 'Kerala', trip: 'Solo · 9 nights', image: '/images/kerala.png', rating: 5, avatar: 'AN' },
  { quote: 'Shivalay Travels designed our corporate leadership retreat in a private Goa beach resort. The yacht sunset cruise and dinners were absolutely spectacular.', name: 'Rahul Sharma', location: 'Bangalore, India', destination: 'Goa', trip: 'Corporate · 5 nights', image: '/images/goa.png', rating: 5, avatar: 'RS' },
  { quote: 'Shivalay Travels showed me what Leh Ladakh actually feels like when seasoned road specialists design it. The logistics, permits and backup support were top notch.', name: 'Vikram Sethi', location: 'New Delhi, India', destination: 'Ladakh', trip: 'Adventure · 9 nights', image: '/images/ladakh.png', rating: 5, avatar: 'VS' },
];

const MEDIA_MENTIONS = ['Condé Nast Traveller India', 'Travel + Leisure India', 'National Geographic Traveller', 'Forbes India', 'Outlook Traveller', 'The Hindu Lifestyle'];

export default function Memories() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [fade, setFade] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const startAutoPlay = () => {
    stopAutoPlay();
    autoPlayRef.current = setInterval(() => {
      handleNext();
    }, 8000);
  };

  const stopAutoPlay = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
  };

  useEffect(() => {
    startAutoPlay();
    return stopAutoPlay;
  }, [activeIdx]);

  const handleSelect = (idx: number) => {
    if (idx === activeIdx || fade) return;
    setFade(true);
    setTimeout(() => {
      setActiveIdx(idx);
      setFade(false);
    }, 200);
  };

  const handleNext = () => {
    if (fade) return;
    setFade(true);
    setTimeout(() => {
      setActiveIdx((prev) => (prev + 1) % TESTIMONIALS.length);
      setFade(false);
    }, 200);
  };

  const handlePrev = () => {
    if (fade) return;
    setFade(true);
    setTimeout(() => {
      setActiveIdx((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
      setFade(false);
    }, 200);
  };

  const t = TESTIMONIALS[activeIdx];

  return (
    <section
      id="stories"
      style={{ background: 'var(--surface-canvas)', padding: '100px 0', position: 'relative', overflow: 'hidden' }}
      onMouseEnter={stopAutoPlay}
      onMouseLeave={startAutoPlay}
    >
      {/* Red ambient background glow */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(220,38,38,0.04) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div className="badge badge-dark reveal" style={{ background: 'var(--color-graphite)', color: '#fafafa', borderRadius: '12px', marginBottom: 16 }}>Guest Reviews</div>
            <h2 className="reveal reveal-d1" style={{ fontFamily: 'var(--font-cosmica)', fontWeight: 700, fontSize: 'clamp(28px,3.5vw,42px)', color: 'var(--color-obsidian)', lineHeight: 1.2 }}>
              What Our Guests Say.<br />Honest Experiences.
            </h2>
          </div>
          <div className="reveal reveal-d2" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
            <div style={{ display: 'flex', gap: 3 }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} width="18" height="18" viewBox="0 0 18 18" fill="var(--color-gold)">
                  <path d="M9 1l2.2 4.5 5 .7-3.6 3.5.8 5L9 12.4l-4.4 2.3.8-5L2 6.2l5-.7L9 1z" />
                </svg>
              ))}
            </div>
            <p style={{ fontFamily: 'var(--font-cosmica)', fontSize: 13, fontWeight: 500, color: 'var(--color-slate)' }}>4.97 / 5 rating from 860+ families</p>
          </div>
        </div>

        {/* Layout */}
        <div className="testimonial-layout">
          {/* Main Card */}
          <div className={`testimonial-main-card ${fade ? 'fade-out' : ''}`}>
            {/* Quote icon background */}
            <div style={{ position: 'absolute', top: 20, right: 30, fontSize: 120, fontFamily: 'serif', color: 'rgba(220, 38, 38, 0.08)', fontWeight: 'bold', pointerEvents: 'none', lineHeight: 1 }}>
              &ldquo;
            </div>

            {/* Top row: Rating & Destination info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', gap: 4 }}>
                {Array.from({ length: t.rating }).map((_, i) => (
                  <svg key={i} width="16" height="16" viewBox="0 0 18 18" fill="var(--color-gold)">
                    <path d="M9 1l2.2 4.5 5 .7-3.6 3.5.8 5L9 12.4l-4.4 2.3.8-5L2 6.2l5-.7L9 1z" />
                  </svg>
                ))}
              </div>
              <span className="badge" style={{ background: 'rgba(220, 38, 38, 0.15)', border: '1px solid rgba(220, 38, 38, 0.3)', color: '#fff' }}>
                {t.destination}
              </span>
            </div>

            {/* Middle: The Quote */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', marginBottom: 28, position: 'relative', zIndex: 1 }}>
              <p style={{ fontFamily: 'var(--font-cosmica)', fontSize: 'clamp(17px, 2.2vw, 21px)', fontWeight: 400, color: '#ffffff', lineHeight: 1.68, fontStyle: 'italic' }}>
                "{t.quote}"
              </p>
            </div>

            {/* Bottom Row: Profile info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: 24, position: 'relative', zIndex: 1, flexWrap: 'wrap', gap: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{
                  width: 50, height: 50, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--color-ember), #991b1b)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#ffffff', fontWeight: 700, fontSize: 16, fontFamily: 'var(--font-cosmica)',
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
                  flexShrink: 0
                }}>
                  {t.avatar}
                </div>
                <div>
                  <h4 style={{ fontFamily: 'var(--font-cosmica)', fontWeight: 600, fontSize: 15, color: '#ffffff', marginBottom: 2 }}>{t.name}</h4>
                  <p style={{ fontFamily: 'var(--font-cosmica)', fontSize: 13, color: 'var(--color-steel)' }}>{t.location} &middot; <span style={{ color: 'var(--color-ash)' }}>{t.trip}</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Tabs */}
          <div className="testimonial-sidebar">
            {TESTIMONIALS.map((item, idx) => {
              const isActive = idx === activeIdx;
              return (
                <button
                  key={idx}
                  className={`testimonial-tab-btn ${isActive ? 'active' : ''}`}
                  onClick={() => handleSelect(idx)}
                >
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: isActive ? 'var(--color-ember)' : 'var(--color-graphite)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#ffffff', fontWeight: 600, fontSize: 13, fontFamily: 'var(--font-cosmica)',
                    transition: 'all 0.25s ease',
                    flexShrink: 0
                  }}>
                    {item.avatar}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                      <span style={{ fontFamily: 'var(--font-cosmica)', fontWeight: 600, fontSize: 13.5, color: isActive ? '#ffffff' : 'var(--color-slate)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.name}
                      </span>
                      <span style={{ fontFamily: 'var(--font-cosmica)', fontSize: 11, color: isActive ? 'rgba(255,255,255,0.7)' : 'var(--color-ash)', fontWeight: 500 }}>
                        {item.destination}
                      </span>
                    </div>
                    <p style={{ fontFamily: 'var(--font-cosmica)', fontSize: 12, color: 'var(--color-steel)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.quote}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile controls */}
        <div className="testimonial-controls-mobile">
          <button
            onClick={handlePrev}
            style={{
              width: 44, height: 44, borderRadius: '50%',
              background: 'var(--surface-card-white)', border: '1px solid var(--color-pebble)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              color: '#ffffff', transition: 'all 0.2s'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            {TESTIMONIALS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                style={{
                  width: idx === activeIdx ? 24 : 8, height: 8, borderRadius: 4,
                  background: idx === activeIdx ? 'var(--color-ember)' : 'rgba(255,255,255,0.15)',
                  border: 'none', cursor: 'pointer', transition: 'all 0.25s ease'
                }}
              />
            ))}
          </div>
          <button
            onClick={handleNext}
            style={{
              width: 44, height: 44, borderRadius: '50%',
              background: 'var(--surface-card-white)', border: '1px solid var(--color-pebble)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              color: '#ffffff', transition: 'all 0.2s'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* Media mentions */}
        <div style={{ borderTop: '1px solid var(--color-pebble)', borderBottom: '1px solid var(--color-pebble)', padding: '22px 0', marginTop: 56, marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
            <p style={{ fontFamily: 'var(--font-cosmica)', fontSize: 11, fontWeight: 600, color: 'var(--color-steel)', textTransform: 'uppercase', letterSpacing: '1px', whiteSpace: 'nowrap' }}>As featured in</p>
            {MEDIA_MENTIONS.map(m => (
              <span
                key={m}
                style={{
                  fontFamily: 'var(--font-cosmica)', fontSize: 13, fontWeight: 600,
                  color: 'var(--color-slate)', whiteSpace: 'nowrap',
                  transition: 'color 0.2s ease', cursor: 'default',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-obsidian)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-slate)')}
              >
                {m}
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="reveal" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <p style={{ fontFamily: 'var(--font-cosmica)', fontWeight: 700, fontSize: 20, color: 'var(--color-obsidian)', marginBottom: 4 }}>Your story belongs here too.</p>
            <p style={{ fontFamily: 'var(--font-cosmica)', fontSize: 14, color: 'var(--color-steel)' }}>Join thousands of happy travellers who choose to journey with Shivalay Travels.</p>
          </div>
          <button className="btn-primary" onClick={() => document.getElementById('planner')?.scrollIntoView({ behavior: 'smooth' })}>
            Start My Journey
          </button>
        </div>
      </div>
    </section>
  );
}
