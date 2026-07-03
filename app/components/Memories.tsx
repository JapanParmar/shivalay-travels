'use client';
import { useState, useEffect, useRef } from 'react';

const TESTIMONIALS = [
  { quote: 'Our Kashmir honeymoon was beyond imagination. Every detail — the scenic houseboat, the private saffron farm walk — felt tailored to our exact pace.', name: 'Priya & Arjun Mehta', location: 'Mumbai', destination: 'Kashmir', trip: 'Honeymoon · 8 nights', rating: 5, avatar: 'PA' },
  { quote: 'The Kedarnath yatra was incredibly smooth. They managed all registrations and helicopter tickets without any hassle. A truly divine experience.', name: 'Ramesh & Savita Joshi', location: 'Indore', destination: 'Kedarnath', trip: 'Pilgrim · 5 nights', rating: 5, avatar: 'RS' },
  { quote: 'Taking our elderly parents to Chardham was a big concern, but Shivalay Travels made it absolutely stress-free. The premium Tempo Traveller was very comfortable.', name: 'The Verma Family', location: 'Bhopal', destination: 'Chardham Yatra', trip: 'Family Yatra · 11 nights', rating: 5, avatar: 'VF' },
  { quote: 'From our first call to our private houseboat cruise in Alleppey, we felt like honored guests. Already booking Jaisalmer for winter.', name: 'Dr. Ananya Nair', location: 'Kochi', destination: 'Kerala', trip: 'Solo · 9 nights', rating: 5, avatar: 'AN' },
  { quote: 'Shivalay Travels designed our corporate leadership retreat in a private Goa beach resort. The yacht sunset cruise and dinners were spectacular.', name: 'Rahul Sharma', location: 'Bangalore', destination: 'Goa', trip: 'Corporate · 5 nights', rating: 5, avatar: 'RS' },
  { quote: 'Shivalay Travels showed me what Leh Ladakh actually feels like when seasoned road specialists design it. The logistics and permits were top notch.', name: 'Vikram Sethi', location: 'New Delhi', destination: 'Ladakh', trip: 'Adventure · 9 nights', rating: 5, avatar: 'VS' },
];

const MEDIA_MENTIONS = ['Condé Nast Traveller India', 'Travel + Leisure India', 'National Geographic Traveller', 'Forbes India', 'Outlook Traveller', 'The Hindu Lifestyle'];

export default function Memories() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [fade, setFade] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  const startAutoPlay = () => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(() => {
      setFade(true);
      setTimeout(() => { setActiveIdx(prev => (prev + 1) % TESTIMONIALS.length); setFade(false); }, 180);
    }, 7000);
  };
  const stopAutoPlay = () => { if (autoPlayRef.current) clearInterval(autoPlayRef.current); };

  useEffect(() => { startAutoPlay(); return stopAutoPlay; }, []);

  const handleSelect = (idx: number) => {
    if (idx === activeIdx || fade) return;
    setFade(true);
    setTimeout(() => { setActiveIdx(idx); setFade(false); }, 180);
  };

  const t = TESTIMONIALS[activeIdx];

  return (
    <section id="stories" style={{ background: 'var(--surface-canvas)', padding: '48px 0', borderBottom: '1px solid var(--color-zinc-hairline)' }}
      onMouseEnter={stopAutoPlay}
      onMouseLeave={startAutoPlay}
    >
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <p className="section-label" style={{ marginBottom: 8 }}>Guest Reviews</p>
            <h2 className="heading-lg">What Our Guests Say.<br />Honest Experiences.</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
            <div style={{ display: 'flex', gap: 2 }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} style={{ color: 'var(--color-highlighter-lime)', fontSize: 14 }}>★</span>
              ))}
            </div>
            <p style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 12, color: 'var(--color-steel-gray)' }}>4.97 / 5 from 860+ families</p>
          </div>
        </div>

        {/* Main layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20, marginBottom: 28 }}>
          {/* Main card */}
          <div
            style={{
              background: 'var(--color-carbon)',
              border: '1px solid var(--color-zinc-hairline)',
              borderRadius: 'var(--radius-xl)',
              padding: '28px',
              display: 'flex', flexDirection: 'column',
              opacity: fade ? 0 : 1,
              transform: fade ? 'translateY(4px)' : 'translateY(0)',
              transition: 'opacity 0.18s ease, transform 0.18s ease',
              position: 'relative', overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', top: 16, right: 20, fontSize: 80, fontFamily: 'serif', color: 'var(--color-lime-06)', fontWeight: 'bold', lineHeight: 1, pointerEvents: 'none' }}>&ldquo;</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div style={{ display: 'flex', gap: 2 }}>
                {Array.from({ length: t.rating }).map((_, i) => (
                  <span key={i} style={{ color: 'var(--color-highlighter-lime)', fontSize: 12 }}>★</span>
                ))}
              </div>
              <span style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 10, color: 'var(--color-steel-gray)', padding: '3px 8px', border: '1px solid var(--color-zinc-hairline)', borderRadius: 'var(--radius-full)' }}>
                {t.destination}
              </span>
            </div>
            <p style={{ fontFamily: 'var(--font-tomorrow)', fontSize: 'clamp(15px, 1.8vw, 19px)', fontWeight: 400, color: 'var(--color-pure-white)', lineHeight: 1.65, fontStyle: 'italic', flex: 1, marginBottom: 24, position: 'relative', zIndex: 1 }}>
              &ldquo;{t.quote}&rdquo;
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, borderTop: '1px solid var(--color-zinc-hairline)', paddingTop: 18 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 'var(--radius-md)',
                background: 'var(--color-highlighter-lime)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--color-onyx-black)', fontWeight: 500, fontSize: 13, fontFamily: 'var(--font-geist-mono)',
                flexShrink: 0,
              }}>
                {t.avatar}
              </div>
              <div>
                <p style={{ fontFamily: 'var(--font-geist-mono)', fontWeight: 500, fontSize: 13, color: 'var(--color-pure-white)', marginBottom: 2 }}>{t.name}</p>
                <p style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 11, color: 'var(--color-steel-gray)' }}>{t.location} · {t.trip}</p>
              </div>
              {/* Nav arrows */}
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
                {(['prev', 'next'] as const).map(dir => (
                  <button
                    key={dir}
                    onClick={() => {
                      if (fade) return;
                      setFade(true);
                      setTimeout(() => {
                        setActiveIdx(prev => dir === 'next' ? (prev + 1) % TESTIMONIALS.length : (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
                        setFade(false);
                      }, 180);
                    }}
                    style={{
                      width: 32, height: 32, borderRadius: 'var(--radius-md)',
                      background: 'transparent', border: '1px solid var(--color-zinc-hairline)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', color: 'var(--color-steel-gray)', transition: 'all 0.18s ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-zinc-hairline)'; e.currentTarget.style.color = 'var(--color-pure-white)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-steel-gray)'; }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {dir === 'prev' ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 18 15 12 9 6" />}
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 340, overflowY: 'auto' }}>
            {TESTIMONIALS.map((item, idx) => {
              const isActive = idx === activeIdx;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 12px', borderRadius: 'var(--radius-xl)',
                    background: isActive ? 'var(--color-carbon)' : 'transparent',
                    border: `1px solid ${isActive ? 'var(--color-zinc-hairline)' : 'transparent'}`,
                    cursor: 'pointer', textAlign: 'left',
                    transition: 'all 0.18s ease',
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'var(--color-carbon)'; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: 'var(--radius-md)', flexShrink: 0,
                    background: isActive ? 'var(--color-highlighter-lime)' : 'var(--color-zinc-hairline)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: isActive ? 'var(--color-onyx-black)' : 'var(--color-steel-gray)',
                    fontSize: 11, fontFamily: 'var(--font-geist-mono)', fontWeight: 500,
                    transition: 'all 0.18s ease',
                  }}>
                    {item.avatar}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: 'var(--font-geist-mono)', fontWeight: 500, fontSize: 11, color: isActive ? 'var(--color-pure-white)' : 'var(--color-steel-gray)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 2 }}>{item.name}</p>
                    <p style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 10, color: 'var(--color-ash-gray)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.destination}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: 32 }}>
          {TESTIMONIALS.map((_, idx) => (
            <button key={idx} onClick={() => handleSelect(idx)} style={{ width: idx === activeIdx ? 20 : 6, height: 6, borderRadius: 3, background: idx === activeIdx ? 'var(--color-highlighter-lime)' : 'var(--color-zinc-hairline)', border: 'none', cursor: 'pointer', transition: 'all 0.25s ease' }} />
          ))}
        </div>

        {/* Media mentions */}
        <div style={{ borderTop: '1px solid var(--color-zinc-hairline)', borderBottom: '1px solid var(--color-zinc-hairline)', padding: '16px 0', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
            <p style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 10, fontWeight: 500, color: 'var(--color-ash-gray)', textTransform: 'uppercase', letterSpacing: '1px', whiteSpace: 'nowrap' }}>As featured in</p>
            {MEDIA_MENTIONS.map(m => (
              <span key={m} style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 12, color: 'var(--color-steel-gray)', whiteSpace: 'nowrap', transition: 'color 0.18s', cursor: 'default' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-pure-white)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-steel-gray)')}>
                {m}
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="reveal" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <p style={{ fontFamily: 'var(--font-tomorrow)', fontSize: 18, fontWeight: 400, color: 'var(--color-pure-white)', marginBottom: 4 }}>Your story belongs here too.</p>
            <p style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 12, color: 'var(--color-steel-gray)' }}>Join thousands of happy travellers who choose Shivalay Travels.</p>
          </div>
          <button className="btn-primary" onClick={() => document.getElementById('planner')?.scrollIntoView({ behavior: 'smooth' })}>
            Start My Journey
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          #stories .container > div:nth-child(2) { grid-template-columns: 1fr !important; }
          #stories .container > div:nth-child(2) > div:last-child { display: none !important; }
        }
      `}</style>
    </section>
  );
}
