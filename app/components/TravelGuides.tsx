'use client';
import { useState } from 'react';

const GUIDES = [
  { category: 'Packing Guide', title: 'The ultimate cold desert packing checklist for Ladakh — what to carry in June vs September', readTime: '7 min read', badge: 'Popular', badgeColor: 'var(--color-ember)', image: '/images/ladakh.png', icon: '🏔️' },
  { category: 'Destination Intel', title: 'Kashmir in winters — Gulmarg ski resorts, wooden chalets, & winter wonderland guide', readTime: '9 min read', badge: 'Insider', badgeColor: 'var(--color-obsidian)', image: '/images/kashmir.png', icon: '❄️' },
  { category: 'Health & Safety', title: 'High altitude acclimatisation 101 — how to prevent Acute Mountain Sickness (AMS) in Leh', readTime: '6 min read', badge: null, badgeColor: '', image: '/images/ladakh.png', icon: '⛑️' },
  { category: 'Culture', title: 'Monastery decorum in Ladakh & Spiti — rules, prayer wheel direction, & photography guidelines', readTime: '8 min read', badge: 'New', badgeColor: '#0f766e', image: '/images/ladakh.png', icon: '🙏' },
  { category: 'Destination Intel', title: 'Inner Line Permits decoded — how to secure travel clearance to Pangong Tso, Nubra & Turtuk', readTime: '5 min read', badge: null, badgeColor: '', image: '/images/meghalaya.png', icon: '📋' },
  { category: 'Packing Guide', title: 'Monsoon packing list for Meghalaya — trekking boots, waterproof cases, & jungle essentials', readTime: '6 min read', badge: 'Popular', badgeColor: 'var(--color-ember)', image: '/images/meghalaya.png', icon: '🌿' },
];

const CATEGORIES = ['All', 'Packing Guide', 'Destination Intel', 'Health & Safety', 'Culture'];

export default function TravelGuides() {
  const [cat, setCat] = useState('All');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const filtered = cat === 'All' ? GUIDES : GUIDES.filter(g => g.category === cat);

  return (
    <section id="guides" style={{ background: 'var(--surface-canvas)', padding: '80px 0', borderTop: '1px solid var(--color-pebble)' }}>
      <div className="container">

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div className="badge badge-dark reveal" style={{ background: 'var(--color-graphite)', color: '#fafafa', borderRadius: '12px', marginBottom: 16 }}>Travel Intelligence</div>
            <h2 className="reveal reveal-d1" style={{ fontFamily: 'var(--font-cosmica)', fontWeight: 700, fontSize: 'clamp(26px,3vw,38px)', color: 'var(--color-obsidian)', lineHeight: 1.2 }}>
              Expert Travel Tips & Yatra Guidance.
            </h2>
            <p className="reveal reveal-d2" style={{ fontFamily: 'var(--font-cosmica)', fontSize: 15, color: 'var(--color-steel)', lineHeight: 1.6, marginTop: 10, maxWidth: 420 }}>
              Practical packing tips, yatra safety guidelines, and destination itineraries written by our local coordinators.
            </p>
          </div>
        </div>

        {/* Category tabs */}
        <div className="reveal" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCat(c)} style={{
              padding: '7px 16px', borderRadius: 'var(--radius-pill)', cursor: 'pointer',
              fontFamily: 'var(--font-cosmica)', fontSize: 13, fontWeight: 500,
              transition: 'all 0.22s var(--ease-out)',
              background: cat === c ? 'var(--color-ember)' : 'var(--surface-card-white)',
              color: cat === c ? '#fff' : 'var(--color-slate)',
              border: `1px solid ${cat === c ? 'var(--color-ember)' : 'var(--color-pebble)'}`,
              boxShadow: 'none',
              transform: cat === c ? 'scale(1.03)' : 'scale(1)',
            }}>
              {c}
            </button>
          ))}
        </div>

        <div className="guides-grid">
          {filtered.map((g, i) => (
            <div
              key={i}
              className="card-white reveal"
              style={{
                display: 'flex', flexDirection: 'column', gap: 0, cursor: 'pointer',
                padding: 0, overflow: 'hidden', background: 'var(--surface-card-white)',
                border: '1px solid var(--color-pebble)', borderRadius: '36px', boxShadow: 'none'
              }}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Image header */}
              <div className="img-zoom-wrap" style={{ height: 120, position: 'relative', overflow: 'hidden', borderTopLeftRadius: '36px', borderTopRightRadius: '36px' }}>
                <img src={g.image} alt={g.category} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(9,9,11,0.7) 0%, rgba(9,9,11,0.1) 100%)' }} />
                <div style={{ position: 'absolute', bottom: 10, left: 12, display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span style={{ fontSize: 14 }}>{g.icon}</span>
                  <span style={{ fontFamily: 'var(--font-cosmica)', fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.85)', textTransform: 'uppercase', letterSpacing: '1px' }}>{g.category}</span>
                </div>
                {g.badge && (
                  <span className="badge" style={{ position: 'absolute', top: 10, right: 12, background: 'var(--color-ember)', color: '#fff', fontSize: 10 }}>{g.badge}</span>
                )}
              </div>

              {/* Content */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '18px 20px', flex: 1 }}>
                <h3 style={{ fontFamily: 'var(--font-cosmica)', fontWeight: 600, fontSize: 15, color: 'var(--color-obsidian)', lineHeight: 1.45, flex: 1 }}>
                  {g.title}
                </h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-cosmica)', fontSize: 12, color: 'var(--color-steel)' }}>{g.readTime}</span>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 4,
                    fontFamily: 'var(--font-cosmica)', fontSize: 12, fontWeight: 600,
                    color: hoveredIdx === i ? 'var(--color-obsidian)' : 'var(--color-steel)',
                    transition: 'color 0.2s ease',
                  }}>
                    Read guide
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ transform: hoveredIdx === i ? 'translateX(3px)' : 'translateX(0)', transition: 'transform 0.25s var(--ease-out)' }}>
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View all */}
        <div className="reveal" style={{ textAlign: 'center', marginTop: 36 }}>
          <button className="btn-outline">
            View All India Travel Guides →
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .guides-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 560px) {
          .guides-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
