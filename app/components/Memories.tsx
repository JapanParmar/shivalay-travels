'use client';
import { useState } from 'react';

const TESTIMONIALS = [
  { quote: 'Our Kashmir honeymoon was beyond imagination. Every detail — the scenic houseboat, the private saffron farm walk, the taxi transfers — felt tailored to our exact pace.', name: 'Priya & Arjun Mehta', location: 'Mumbai, India', destination: 'Kashmir', trip: 'Honeymoon · 8 nights', image: '/images/kashmir.png', rating: 5 },
  { quote: 'The Kedarnath yatra with Shivalay Travels was incredibly smooth. They managed all registrations and our helicopter tickets without any hassle. A truly divine experience.', name: 'Ramesh & Savita Joshi', location: 'Indore, India', destination: 'Kedarnath', trip: 'Pilgrim · 5 nights', image: '/images/kedarnath.png', rating: 5 },
  { quote: 'Taking our elderly parents to Chardham was a big concern, but Shivalay Travels made it feel absolutely stress-free. The premium Tempo Traveller was extremely comfortable.', name: 'The Verma Family', location: 'Bhopal, India', destination: 'Chardham Yatra', trip: 'Family Yatra · 11 nights', image: '/images/chardham.png', rating: 5 },
  { quote: 'No transactional booking templates here. From our first call to our private houseboat cruise in Alleppey, we felt like honored guests. Already booking Jaisalmer for winter.', name: 'Dr. Ananya Nair', location: 'Kochi, India', destination: 'Kerala', trip: 'Solo · 9 nights', image: '/images/kerala.png', rating: 5 },
  { quote: 'Shivalay Travels designed our corporate leadership retreat in a private Goa beach resort. The yacht sunset cruise and dinners were absolutely spectacular.', name: 'Rahul Sharma', location: 'Bangalore, India', destination: 'Goa', trip: 'Corporate · 5 nights', image: '/images/goa.png', rating: 5 },
  { quote: 'Shivalay Travels showed me what Leh Ladakh actually feels like when seasoned road specialists design it. The logistics, permits and backup support were top notch.', name: 'Vikram Sethi', location: 'New Delhi, India', destination: 'Ladakh', trip: 'Adventure · 9 nights', image: '/images/ladakh.png', rating: 5 },
];

const MEDIA_MENTIONS = ['Condé Nast Traveller India', 'Travel + Leisure India', 'National Geographic Traveller', 'Forbes India', 'Outlook Traveller', 'The Hindu Lifestyle'];

export default function Memories() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <section id="stories" style={{ background: 'var(--surface-canvas)', padding: '80px 0' }}>
      <div className="container">

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div className="badge badge-dark reveal" style={{ marginBottom: 16 }}>Traveller Stories</div>
            <h2 className="reveal reveal-d1" style={{ fontFamily: 'var(--font-cosmica)', fontWeight: 700, fontSize: 'clamp(28px,3.5vw,42px)', color: '#fff', lineHeight: 1.2 }}>
              Real Journeys.<br />Real Transformations.
            </h2>
          </div>
          <div className="reveal reveal-d2" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
            <div style={{ display: 'flex', gap: 3 }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} width="18" height="18" viewBox="0 0 18 18" fill="var(--color-ember)">
                  <path d="M9 1l2.2 4.5 5 .7-3.6 3.5.8 5L9 12.4l-4.4 2.3.8-5L2 6.2l5-.7L9 1z" />
                </svg>
              ))}
            </div>
            <p style={{ fontFamily: 'var(--font-cosmica)', fontSize: 13, fontWeight: 500, color: '#fff' }}>4.97 / 5 from 860+ luxury inquiries</p>
          </div>
        </div>

        {/* Testimonial grid */}
        <div className="testimonials-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 40 }}>
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className={`${i % 2 === 0 ? 'card-white' : 'card-muted'} reveal reveal-d${(i % 3) + 1}`}
              style={{
                display: 'flex', flexDirection: 'column', gap: 14,
                borderRadius: i % 2 === 0 ? 'var(--radius-card)' : 'var(--radius-card-compact)',
                padding: '22px',
              }}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Destination image */}
              <div className="img-zoom-wrap" style={{ height: 180, borderRadius: 'var(--radius-card-compact)', overflow: 'hidden', position: 'relative' }}>
                <img src={t.image} alt={t.destination} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(9,9,11,0.4) 0%, transparent 60%)', transition: 'opacity 0.3s', opacity: hoveredIdx === i ? 0.6 : 1 }} />
                <span className="badge" style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(9,9,11,0.72)', backdropFilter: 'blur(6px)', color: '#fff', fontSize: 10 }}>{t.destination}</span>
              </div>

              {/* Stars */}
              <div style={{ display: 'flex', gap: 3 }}>
                {Array.from({ length: 5 }).map((_, j) => (
                  <svg key={j} width="12" height="12" viewBox="0 0 14 14" fill="var(--color-ember)">
                    <path d="M7 1l1.8 3.6L13 5.4l-3 2.9.7 4.1L7 10.3l-3.7 2.1.7-4.1-3-2.9 4.2-.8L7 1z" />
                  </svg>
                ))}
              </div>

              <p style={{ fontFamily: 'var(--font-cosmica)', fontWeight: 300, fontSize: 13.5, color: 'var(--color-ink)', lineHeight: 1.68, flex: 1 }}>
                "{t.quote}"
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 12, borderTop: '1px solid var(--color-fog)', paddingTop: 12 }}>
                <div>
                  <p style={{ fontFamily: 'var(--font-cosmica)', fontWeight: 600, fontSize: 13, color: '#fff', marginBottom: 2 }}>{t.name}</p>
                  <p style={{ fontFamily: 'var(--font-cosmica)', fontSize: 12, color: 'var(--color-steel)', marginBottom: 1 }}>{t.location}</p>
                  <p style={{ fontFamily: 'var(--font-cosmica)', fontSize: 11, color: 'var(--color-ash)' }}>{t.trip}</p>
                </div>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: hoveredIdx === i ? 'var(--color-ember)' : 'var(--color-fog)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'background 0.25s ease, transform 0.25s ease',
                  transform: hoveredIdx === i ? 'scale(1.1)' : 'scale(1)',
                  flexShrink: 0,
                }}>
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke={hoveredIdx === i ? '#fff' : 'var(--color-ash)'} strokeWidth="2" style={{ transition: 'stroke 0.25s' }}>
                    <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Media mentions */}
        <div style={{ borderTop: '1px solid var(--color-fog)', borderBottom: '1px solid var(--color-fog)', padding: '22px 0', marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
            <p style={{ fontFamily: 'var(--font-cosmica)', fontSize: 11, fontWeight: 600, color: 'var(--color-ash)', textTransform: 'uppercase', letterSpacing: '1px', whiteSpace: 'nowrap' }}>As featured in</p>
            {MEDIA_MENTIONS.map(m => (
              <span
                key={m}
                style={{
                  fontFamily: 'var(--font-cosmica)', fontSize: 13, fontWeight: 600,
                  color: 'var(--color-pebble)', whiteSpace: 'nowrap',
                  transition: 'color 0.2s ease', cursor: 'default',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-graphite)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-pebble)')}
              >
                {m}
              </span>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="reveal" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <p style={{ fontFamily: 'var(--font-cosmica)', fontWeight: 700, fontSize: 20, color: '#fff', marginBottom: 4 }}>Your story belongs here too.</p>
            <p style={{ fontFamily: 'var(--font-cosmica)', fontSize: 14, color: 'var(--color-steel)' }}>Join thousands of happy travellers who choose to journey with Shivalay Travels.</p>
          </div>
          <button className="btn-primary" onClick={() => document.getElementById('planner')?.scrollIntoView({ behavior: 'smooth' })}>
            Start My Journey
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .testimonials-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 600px) {
          .testimonials-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
