'use client';
import { useState, useRef, useEffect, useCallback } from 'react';

type Difficulty = 'Easy' | 'Moderate' | 'Challenging' | 'Expedition';

interface Destination {
  id: string; name: string; region: string; tagline: string;
  duration: string; groupSize: string; difficulty: Difficulty;
  bestSeason: string; startingFrom: string; tags: string[];
  highlights: string[]; includes: string[]; imagePath: string;
}

const DESTINATIONS: Destination[] = [
  { id: 'kedarnath', name: 'Kedarnath Yatra', region: 'Uttarakhand', tagline: 'Spiritual temple yatra with divine scenic mountain views', duration: '4–6 nights', groupSize: '2–12', difficulty: 'Challenging', bestSeason: 'May – Jun, Sep – Nov', startingFrom: '₹15,000', tags: ['Spiritual', 'Adventure', 'Scenic'], highlights: ['VIP Darshan at Kedarnath Temple shrine', 'Beautiful trek from Gaurikund to Kedarnath basecamp', 'Comfortable stays near the holy temple base', 'Scenic helicopter ride booking options'], includes: ['Premium stays & hygienic food', 'Airport/station pickup & drop', 'Experienced local yatra coordinator', 'Helicopter booking assistance'], imagePath: '/images/kedarnath.png' },
  { id: 'chardham', name: 'Chardham Yatra', region: 'Uttarakhand', tagline: 'Holy pilgrimage to Yamunotri, Gangotri, Kedarnath, and Badrinath', duration: '9–12 nights', groupSize: '2–20', difficulty: 'Challenging', bestSeason: 'May – Jun, Sep – Oct', startingFrom: '₹45,000', tags: ['Spiritual', 'Heritage', 'Scenic'], highlights: ['Complete darshan of all four holy shrines', 'Special puja arrangement at Badrinath temple', 'Scenic drive through majestic Himalayan valleys', 'Holy Ganga aarti at Har Ki Pauri, Haridwar'], includes: ['Comfortable hotel bookings', 'All transfers via private luxury coach', 'Sanskrit-speaking local guide', 'All yatra registration permits'], imagePath: '/images/chardham.png' },
  { id: 'varanasi', name: 'Varanasi Kashi', region: 'Uttar Pradesh', tagline: 'Spiritual river ghats, ancient chants & silk-weaving heritage', duration: '3–5 nights', groupSize: '2–8', difficulty: 'Easy', bestSeason: 'Oct – Mar', startingFrom: '₹12,000', tags: ['Spiritual', 'Heritage', 'Wellness'], highlights: ['Private boat for Ganga Aarti ceremony at Dashashwamedh', 'Sunrise boat ride with live shehnai music', 'Guided walk through ancient alleyways & Kashi Vishwanath temple', 'Exclusive Banarasi silk weaving demonstration'], includes: ['Boutique riverfront stays', 'Private spiritual guide', 'VIP temple darshan assistance', 'Private boat charters'], imagePath: '/images/varanasi.png' },
  { id: 'kashmir', name: 'Kashmir Valley', region: 'North India', tagline: 'Misty pine valleys, wooden houseboats & peaceful shikaras', duration: '6–9 nights', groupSize: '2–12', difficulty: 'Easy', bestSeason: 'Mar – Oct', startingFrom: '₹22,000', tags: ['Luxury', 'Scenic', 'Wellness'], highlights: ['Stay in a hand-carved luxury houseboat', 'Dawn shikara ride on Dal Lake', 'Private saffron farm walk in Pampore', 'Gulmarg snow activities & gondola ride'], includes: ['Premium resort properties', 'Private local chauffeur', 'All gourmet local meals', 'Airport pickup assistance'], imagePath: '/images/kashmir.png' },
  { id: 'goa', name: 'Goa Beaches', region: 'West Coast', tagline: 'Secluded beaches, historic churches & vibrant coastal holiday', duration: '5–8 nights', groupSize: '2–8', difficulty: 'Easy', bestSeason: 'Nov – Apr', startingFrom: '₹18,000', tags: ['Luxury', 'Wellness', 'Adventure'], highlights: ['Private yacht sunset cruise', 'Curated heritage walk through Old Goa churches', 'Water sports and parasailing at Calangute', 'Beachside candlelight dinner'], includes: ['Luxury beachside hotel stays', 'Airport transfers & pickup', 'Personal travel coordinator', 'Sightseeing passes'], imagePath: '/images/goa.png' },
  { id: 'ladakh', name: 'Leh Ladakh', region: 'Himalayas', tagline: 'Snow-capped monasteries, deep valleys & high mountain passes', duration: '7–10 nights', groupSize: '2–8', difficulty: 'Challenging', bestSeason: 'Jun – Sep', startingFrom: '₹35,000', tags: ['Adventure', 'Scenic', 'Heritage'], highlights: ['Private sunrise at Pangong Tso Lake', 'Guided trek through Hemis National Park', 'VIP access to Thiksey Monastery prayer', 'Double-humped camel ride in Nubra Valley'], includes: ['Boutique camps & cottages', 'Private 4x4 vehicle & driver', 'Oxygen systems & medical backing', 'Expert local coordinator guide'], imagePath: '/images/ladakh.png' },
  { id: 'kerala', name: 'Kerala Backwaters', region: 'South India', tagline: 'Palm-fringed lagoons, spice hills & classical ayurveda', duration: '7–12 nights', groupSize: '2–6', difficulty: 'Easy', bestSeason: 'Sep – Mar', startingFrom: '₹24,000', tags: ['Wellness', 'Scenic', 'Luxury'], highlights: ['Private houseboat cruise through backwaters', 'Spice plantation trail in Munnar', 'Scenic Kathakali performance tour', 'Sunset view at Kovalam Beach'], includes: ['Boutique wellness resorts', 'All transfers via private sedan', 'Houseboat crew & meals', 'Sightseeing permits'], imagePath: '/images/kerala.png' },
  { id: 'rajasthan', name: 'Rajasthan Heritage', region: 'West India', tagline: 'Golden sandstone forts, royal palaces & desert heritage', duration: '8–12 nights', groupSize: '2–10', difficulty: 'Easy', bestSeason: 'Oct – Mar', startingFrom: '₹28,000', tags: ['Heritage', 'History', 'Luxury'], highlights: ['Private dinner at Jaisalmer desert camp', 'Exclusive tour of Mehrangarh Fort', 'Stay in Palace hotels of Udaipur', 'Sunrise hot air balloon ride over Jaipur'], includes: ['Heritage hotel properties', 'Vintage car tour', 'Folk dance performances', 'Private local guides'], imagePath: '/images/rajasthan.png' },
];

const FILTERS = ['All', 'Spiritual', 'Adventure', 'Luxury', 'Wellness', 'Heritage'];

const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  Easy: '●', Moderate: '●●', Challenging: '●●●', Expedition: '●●●●',
};

export default function Destinations() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [activeDot, setActiveDot] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const filtered = activeFilter === 'All'
    ? DESTINATIONS
    : DESTINATIONS.filter(d => d.tags.some(t => t.toLowerCase().includes(activeFilter.toLowerCase())));

  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.pageX - (scrollRef.current?.offsetLeft ?? 0);
    scrollLeft.current = scrollRef.current?.scrollLeft ?? 0;
    if (scrollRef.current) scrollRef.current.classList.add('dragging');
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    scrollRef.current.scrollLeft = scrollLeft.current - (x - startX.current) * 1.2;
  };
  const stopDrag = () => {
    isDragging.current = false;
    scrollRef.current?.classList.remove('dragging');
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const maxScroll = el.scrollWidth - el.clientWidth;
      const ratio = el.scrollLeft / (maxScroll || 1);
      setActiveDot(Math.round(ratio * (filtered.length)));
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [filtered.length]);

  const scrollTo = useCallback((dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -320 : 320, behavior: 'smooth' });
  }, []);

  return (
    <section id="destinations" style={{ background: 'var(--surface-canvas)', padding: '48px 0', borderBottom: '1px solid var(--color-zinc-hairline)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <p className="section-label" style={{ marginBottom: 8 }}>Curated Destinations</p>
            <h2 className="heading-lg">Sacred Yatras &amp; Scenic Getaways</h2>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button className="btn-ghost" style={{ fontSize: 12, padding: '6px 14px' }} onClick={() => document.getElementById('planner')?.scrollIntoView({ behavior: 'smooth' })}>
              Custom Package
            </button>
            {(['left', 'right'] as const).map(dir => (
              <button
                key={dir}
                onClick={() => scrollTo(dir)}
                style={{
                  width: 34, height: 34, borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-zinc-hairline)',
                  background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', transition: 'all 0.18s ease', color: 'var(--color-steel-gray)',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-carbon)'; e.currentTarget.style.color = 'var(--color-pure-white)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-steel-gray)'; }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {dir === 'left'
                    ? <path d="M19 12H5M12 19l-7-7 7-7" />
                    : <path d="M5 12h14M12 5l7 7-7 7" />}
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* Filter pills */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
          {FILTERS.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)} className={`pill${activeFilter === f ? ' active' : ''}`}>
              {f}
            </button>
          ))}
        </div>

        {/* Scroll row */}
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, bottom: 16, left: 0, width: 40, background: 'linear-gradient(to right, var(--surface-canvas), transparent)', zIndex: 5, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: 0, bottom: 16, right: 0, width: 40, background: 'linear-gradient(to left, var(--surface-canvas), transparent)', zIndex: 5, pointerEvents: 'none' }} />

          <div
            ref={scrollRef}
            className="h-scroll-row"
            style={{ paddingBottom: 12, userSelect: 'none' }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={stopDrag}
            onMouseLeave={stopDrag}
          >
            {/* Promo card */}
            <div style={{
              width: 140, height: 380, borderRadius: 'var(--radius-xl)', flexShrink: 0,
              background: 'var(--color-highlighter-lime)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10,
              border: '1px solid var(--color-zinc-hairline)',
            }}>
              <div style={{ fontSize: 36 }}>🇮🇳</div>
              <p style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 10, fontWeight: 500, color: 'var(--color-onyx-black)', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', lineHeight: 1.6 }}>Incredible<br />India</p>
            </div>

            {filtered.map((d, i) => (
              <div
                key={d.id}
                className="portfolio-tile"
                style={{ width: i % 3 === 0 ? 300 : 240, height: 380, cursor: 'pointer' }}
                onClick={() => setExpanded(expanded === d.id ? null : d.id)}
              >
                <img className="tile-img" src={d.imagePath} alt={d.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'var(--gradient-visual-overlay)' }} />

                <div style={{ position: 'absolute', top: 12, left: 12, right: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 9, color: 'var(--color-white-80)', padding: '3px 7px', border: '1px solid var(--color-white-20)', borderRadius: 'var(--radius-full)', backdropFilter: 'blur(4px)' }}>
                    {d.bestSeason.split(',')[0]}
                  </span>
                  <span style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 9, color: 'var(--color-onyx-black)', background: 'var(--color-highlighter-lime)', padding: '3px 7px', borderRadius: 'var(--radius-full)', fontWeight: 500 }}>
                    {DIFFICULTY_LABEL[d.difficulty]}
                  </span>
                </div>

                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '16px' }}>
                  <p style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 9, fontWeight: 500, color: 'var(--color-steel-gray)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 4 }}>{d.region}</p>
                  <h3 style={{ fontFamily: 'var(--font-tomorrow)', fontWeight: 400, fontSize: 18, color: 'var(--color-pure-white)', marginBottom: 4, lineHeight: 1.2 }}>{d.name}</h3>
                  <p style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 11, color: 'var(--color-white-60)', marginBottom: 12, lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{d.tagline}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 11, color: 'var(--color-steel-gray)' }}>{d.duration}</span>
                    <span style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 13, fontWeight: 500, color: 'var(--color-highlighter-lime)' }}>{d.startingFrom}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginTop: 12 }}>
          {Array.from({ length: filtered.length + 1 }).map((_, i) => (
            <div key={i} className={`scroll-dot ${activeDot === i ? 'active' : ''}`} onClick={() => {
              if (!scrollRef.current) return;
              const maxScroll = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
              scrollRef.current.scrollTo({ left: (i / filtered.length) * maxScroll, behavior: 'smooth' });
            }} />
          ))}
        </div>

        {/* Expanded detail panel */}
        {expanded && (() => {
          const d = DESTINATIONS.find(x => x.id === expanded)!;
          return (
            <div
              key={expanded}
              style={{
                marginTop: 20,
                background: 'var(--color-onyx-black)',
                border: '1px solid var(--color-zinc-hairline)',
                borderRadius: 'var(--radius-xl)',
                padding: '24px',
                animation: 'scaleIn 0.35s var(--ease-out) both',
              }}
            >
              <div className="destinations-detail-grid">
                <div>
                  <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
                    <span style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 10, color: 'var(--color-steel-gray)', padding: '3px 8px', border: '1px solid var(--color-zinc-hairline)', borderRadius: 'var(--radius-full)' }}>{d.region}</span>
                    <span style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 10, color: 'var(--color-highlighter-lime)', padding: '3px 8px', border: '1px solid var(--color-highlighter-lime)', borderRadius: 'var(--radius-full)' }}>{d.difficulty}</span>
                  </div>
                  <h3 className="heading-md" style={{ marginBottom: 8 }}>{d.name} Expedition</h3>
                  <p style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 13, color: 'var(--color-steel-gray)', lineHeight: 1.6, marginBottom: 20 }}>{d.tagline}</p>
                  <div style={{ display: 'flex', gap: 24, marginBottom: 24, flexWrap: 'wrap' }}>
                    {[{ label: 'Duration', val: d.duration }, { label: 'Group size', val: d.groupSize }, { label: 'Best season', val: d.bestSeason }, { label: 'Starting from', val: d.startingFrom }].map(m => (
                      <div key={m.label}>
                        <p style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 10, fontWeight: 500, color: 'var(--color-steel-gray)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>{m.label}</p>
                        <p style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 14, fontWeight: 500, color: m.label === 'Starting from' ? 'var(--color-highlighter-lime)' : 'var(--color-pure-white)' }}>{m.val}</p>
                      </div>
                    ))}
                  </div>
                  <p style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 10, fontWeight: 500, color: 'var(--color-steel-gray)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 12 }}>Signature Experiences</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                    {d.highlights.map(h => (
                      <div key={h} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                        <span style={{ color: 'var(--color-highlighter-lime)', fontSize: 10, marginTop: 2, flexShrink: 0 }}>✦</span>
                        <span style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 13, color: 'var(--color-steel-gray)' }}>{h}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn-primary" onClick={() => document.getElementById('planner')?.scrollIntoView({ behavior: 'smooth' })}>Plan this journey</button>
                    <button className="btn-ghost" onClick={() => setExpanded(null)}>Close</button>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div className="img-zoom-wrap" style={{ height: 200, borderRadius: 'var(--radius-xl)' }}>
                    <img src={d.imagePath} alt={d.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <p style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 10, fontWeight: 500, color: 'var(--color-steel-gray)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Included in every journey</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {d.includes.map(inc => (
                      <div key={inc} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '8px 10px', background: 'var(--color-carbon)', border: '1px solid var(--color-zinc-hairline)', borderRadius: 'var(--radius-md)', transition: 'all 0.18s ease' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-highlighter-lime)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-zinc-hairline)'; }}>
                        <span style={{ color: 'var(--color-highlighter-lime)', fontSize: 10, flexShrink: 0 }}>✦</span>
                        <span style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 12, color: 'var(--color-steel-gray)' }}>{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </section>
  );
}
