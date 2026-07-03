'use client';
import { useState } from 'react';

const GUIDES = [
  { category: 'Packing Guide', title: 'The ultimate cold desert packing checklist for Ladakh — what to carry in June vs September', readTime: '7 min read', badge: 'Popular', image: '/images/ladakh.png', icon: '🏔️' },
  { category: 'Destination Intel', title: 'Kashmir in winters — Gulmarg ski resorts, wooden chalets, & winter wonderland guide', readTime: '9 min read', badge: 'Insider', image: '/images/kashmir.png', icon: '❄️' },
  { category: 'Health & Safety', title: 'High altitude acclimatisation 101 — how to prevent Acute Mountain Sickness (AMS) in Leh', readTime: '6 min read', badge: null, image: '/images/ladakh.png', icon: '⛑️' },
  { category: 'Culture', title: 'Monastery decorum in Ladakh & Spiti — rules, prayer wheel direction, & photography guidelines', readTime: '8 min read', badge: 'New', image: '/images/ladakh.png', icon: '🙏' },
  { category: 'Destination Intel', title: 'Inner Line Permits decoded — how to secure travel clearance to Pangong Tso, Nubra & Turtuk', readTime: '5 min read', badge: null, image: '/images/meghalaya.png', icon: '📋' },
  { category: 'Packing Guide', title: 'Monsoon packing list for Meghalaya — trekking boots, waterproof cases, & jungle essentials', readTime: '6 min read', badge: 'Popular', image: '/images/meghalaya.png', icon: '🌿' },
];

const CATEGORIES = ['All', 'Packing Guide', 'Destination Intel', 'Health & Safety', 'Culture'];

export default function TravelGuides() {
  const [cat, setCat] = useState('All');
  const filtered = cat === 'All' ? GUIDES : GUIDES.filter(g => g.category === cat);

  return (
    <section id="guides" style={{ background: 'var(--surface-canvas)', padding: '48px 0', borderBottom: '1px solid var(--color-zinc-hairline)' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <p className="section-label" style={{ marginBottom: 8 }}>Travel Intelligence</p>
            <h2 className="heading-lg">Expert Tips &amp; Yatra Guidance.</h2>
            <p style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 12, color: 'var(--color-steel-gray)', lineHeight: 1.6, marginTop: 8, maxWidth: 420 }}>
              Practical packing tips, yatra safety guidelines, and destination insights written by our local coordinators.
            </p>
          </div>
        </div>

        {/* Category pills */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 24 }}>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCat(c)} className={`pill${cat === c ? ' active' : ''}`}>
              {c}
            </button>
          ))}
        </div>

        <div className="guides-grid">
          {filtered.map((g, i) => (
            <div
              key={i}
              className="reveal"
              style={{
                display: 'flex', flexDirection: 'column', gap: 0, cursor: 'pointer',
                overflow: 'hidden',
                background: 'var(--color-onyx-black)',
                border: '1px solid var(--color-zinc-hairline)',
                borderRadius: 'var(--radius-xl)',
                transition: 'border-color 0.18s ease',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-smoke)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-zinc-hairline)'; }}
            >
              {/* Image */}
              <div className="img-zoom-wrap" style={{ height: 110, position: 'relative', overflow: 'hidden', borderRadius: 0 }}>
                <img src={g.image} alt={g.category} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'var(--gradient-visual-overlay)' }} />
                <div style={{ position: 'absolute', bottom: 8, left: 12, display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span style={{ fontSize: 13 }}>{g.icon}</span>
                  <span style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 9, fontWeight: 500, color: 'var(--color-white-80)', textTransform: 'uppercase', letterSpacing: '1px' }}>{g.category}</span>
                </div>
                {g.badge && (
                  <span style={{ position: 'absolute', top: 8, right: 10, fontFamily: 'var(--font-geist-mono)', fontSize: 9, color: 'var(--color-onyx-black)', background: 'var(--color-highlighter-lime)', padding: '2px 6px', borderRadius: 'var(--radius-full)', fontWeight: 500 }}>{g.badge}</span>
                )}
              </div>

              {/* Content */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '14px 16px', flex: 1 }}>
                <p style={{ fontFamily: 'var(--font-geist-mono)', fontWeight: 500, fontSize: 12, color: 'var(--color-pure-white)', lineHeight: 1.5, flex: 1 }}>{g.title}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 11, color: 'var(--color-steel-gray)' }}>{g.readTime}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontFamily: 'var(--font-geist-mono)', fontSize: 11, color: 'var(--color-highlighter-lime)' }}>
                    Read guide
                    <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View all */}
        <div className="reveal" style={{ textAlign: 'center', marginTop: 28 }}>
          <button className="btn-ghost" style={{ fontSize: 13 }}>
            View All India Travel Guides →
          </button>
        </div>
      </div>
    </section>
  );
}
