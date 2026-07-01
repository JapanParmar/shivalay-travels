'use client';
import { useState, useRef, useEffect, useCallback } from 'react';

type Difficulty = 'Easy' | 'Moderate' | 'Challenging' | 'Expedition';

interface Destination {
  id: string; name: string; region: string; tagline: string;
  duration: string; groupSize: string; difficulty: Difficulty;
  bestSeason: string; startingFrom: string; tags: string[];
  highlights: string[]; includes: string[]; imagePath: string; accent: string;
}

const DIFFICULTY_COLOR: Record<Difficulty, string> = {
  Easy: '#166534', Moderate: '#854d0e', Challenging: '#9a3412', Expedition: '#581c87',
};

const DESTINATIONS: Destination[] = [
  { id: 'ladakh', name: 'Ladakh', region: 'Himalayas', tagline: 'Snow-capped monasteries, deep valleys & high mountain passes', duration: '7–10 nights', groupSize: '2–8', difficulty: 'Challenging', bestSeason: 'Jun – Sep', startingFrom: '₹95,000', tags: ['Adventure', 'Scenic', 'Buddhist Culture'], highlights: ['Private sunrise at Pangong Tso Lake', 'Guided trek through Hemis National Park', 'VIP access to Thiksey Monastery prayer', 'Double-humped camel ride in Nubra Valley'], includes: ['Luxury boutique tents & stays', 'Private 4x4 vehicle & driver', 'Oxygen systems & medical backing', 'Expert local mountaineer guide'], imagePath: '/images/ladakh.png', accent: '#ff5a00' },
  { id: 'kashmir', name: 'Kashmir', region: 'North India', tagline: 'Misty pine valleys, wooden houseboats & peaceful shikaras', duration: '6–9 nights', groupSize: '2–10', difficulty: 'Easy', bestSeason: 'Mar – Oct, Dec – Feb', startingFrom: '₹85,000', tags: ['Luxury', 'Heritage', 'Romance'], highlights: ['Stay in a hand-carved heritage luxury houseboat', 'Dawn shikara ride on Dal Lake with local tea', 'Private saffron farm walk in Pampore', 'Helicopter transfer to Gulmarg ski slopes'], includes: ['5-star heritage properties', 'Private local concierge', 'All gourmet Kashmiri meals', 'Airport VIP assistance'], imagePath: '/images/kashmir.png', accent: '#fe45e2' },
  { id: 'goa', name: 'Goa', region: 'West Coast', tagline: 'Secluded luxury beach villas, spice farms & Portuguese heritage', duration: '5–8 nights', groupSize: '2–6', difficulty: 'Easy', bestSeason: 'Nov – Apr', startingFrom: '₹90,000', tags: ['Luxury', 'Wellness', 'Heritage'], highlights: ['Private yacht sunset cruise with champagne', 'Curated heritage walk through Fontainhas', 'Private chef dinner at a Portuguese estate', 'Exclusive spice plantation tour'], includes: ['Private beach villa stay', 'Yacht charters & transfers', 'Personal concierge', 'Heritage entry passes'], imagePath: '/images/goa.png', accent: '#fbbf24' },
  { id: 'kerala', name: 'Kerala', region: 'South India', tagline: 'Palm-fringed lagoons, spice hills & classical ayurveda', duration: '7–12 nights', groupSize: '2–6', difficulty: 'Easy', bestSeason: 'Sep – Mar', startingFrom: '₹75,000', tags: ['Wellness', 'Nature', 'Relaxation'], highlights: ['Private houseboat cruise through Vembanad Lake', 'Personalised Panchakarma spa treatments', 'Private Kathakali performance & backstage tour', 'Gourmet organic spice plantation dinner'], includes: ['Luxury wellness resorts & villa', 'Private chef onboard houseboat', 'Ayurvedic doctor consultations', 'All ground transfers'], imagePath: '/images/kerala.png', accent: '#22d3ee' },
  { id: 'hampi', name: 'Hampi', region: 'Deccan Plateau', tagline: 'Boulderscapes, ancient ruins & lost empires of Vijayanagara', duration: '4–6 nights', groupSize: '2–8', difficulty: 'Moderate', bestSeason: 'Oct – Mar', startingFrom: '₹70,000', tags: ['Heritage', 'Adventure', 'Scenic'], highlights: ['Sunrise coracle ride on the Tungabhadra River', 'Private archaeologist-led tour of the Royal Enclosure', 'Sunset view from Hemakuta Hill with flute music', 'Gourmet dinner overlooking temple ruins'], includes: ['Luxury heritage resort stay', 'Archaeologist guide fees', 'All private transfers', 'Coracle ride charters'], imagePath: '/images/hampi.png', accent: '#f97316' },
  { id: 'meghalaya', name: 'Meghalaya', region: 'Northeast India', tagline: 'Living root bridges, clear turquoise rivers & cloud forests', duration: '6–8 nights', groupSize: '2–6', difficulty: 'Moderate', bestSeason: 'Oct – Apr', startingFrom: '₹80,000', tags: ['Ecotourism', 'Trekking', 'Rainforests'], highlights: ['Private expedition to double-decker living root bridge', 'Boating on Umngot River in Dawki', 'Private cave exploration in Mawmluh', 'Dinner with Khasi village elders'], includes: ['Eco-luxury jungle lodges', 'All-terrain private vehicle', 'Khasi translator & guide', 'Trekking permits & gear'], imagePath: '/images/meghalaya.png', accent: '#4ade80' },
  { id: 'rajasthan', name: 'Rajasthan', region: 'West India', tagline: 'Golden sandstone forts, royal palaces & desert heritage', duration: '8–12 nights', groupSize: '2–10', difficulty: 'Easy', bestSeason: 'Oct – Mar', startingFrom: '₹1,10,000', tags: ['Royalty', 'History', 'Desert Experience'], highlights: ['Private dinner at Jaisalmer desert camp', 'Exclusive tour of Mehrangarh Fort', 'Stay in live Palace hotels of Udaipur', 'Sunrise hot air balloon ride over Jaipur'], includes: ['Heritage luxury Palace stays', 'Vintage car experience', 'Royal historian guides', 'Folk dance private performances'], imagePath: '/images/rajasthan.png', accent: '#ff9900' },
  { id: 'varanasi', name: 'Varanasi', region: 'Ganges Valley', tagline: 'Spiritual river ghats, ancient chants & silk-weaving heritage', duration: '3–5 nights', groupSize: '2–6', difficulty: 'Easy', bestSeason: 'Oct – Mar', startingFrom: '₹65,000', tags: ['Wellness', 'Heritage', 'Culture'], highlights: ['Private boat for Ganga Aarti ceremony', 'Sunrise boat ride with live shehnai music', 'Guided walk through ancient alleyways of Kashi', 'Exclusive silk weaving demonstration'], includes: ['5-star riverfront boutique stay', 'Private spiritual guide', 'VIP temple access assistance', 'Boat charters & transfers'], imagePath: '/images/varanasi.png', accent: '#a855f7' },
];

const FILTERS = ['All', 'Adventure', 'Luxury', 'Wellness', 'Ecotourism', 'Heritage'];

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


  // Drag to scroll
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

  // Scroll dots update
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
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -360 : 360, behavior: 'smooth' });
  }, []);

  return (
    <section id="destinations" style={{ background: 'var(--surface-canvas)', padding: '80px 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div className="badge badge-dark reveal" style={{ marginBottom: 16 }}>Curated Destinations</div>
            <h2 className="reveal reveal-d1" style={{ fontFamily: 'var(--font-cosmica)', fontWeight: 700, fontSize: 'clamp(28px,3.5vw,42px)', color: 'var(--color-obsidian)', lineHeight: 1.2 }}>
              Eight Legendary Regions.<br />Endless Discovery.
            </h2>
          </div>
          <div className="reveal reveal-d2" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="btn-outline" style={{ fontSize: 13 }} onClick={() => document.getElementById('planner')?.scrollIntoView({ behavior: 'smooth' })}>
              Inquire About Custom Stays
            </button>
            <div style={{ display: 'flex', gap: 8 }}>
              {(['left', 'right'] as const).map(dir => (
                <button
                  key={dir}
                  onClick={() => scrollTo(dir)}
                  style={{
                    width: 42, height: 42, borderRadius: '50%', border: '1px solid var(--color-fog)',
                    background: 'var(--color-snow)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: 'all 0.25s var(--ease-out)',
                    boxShadow: 'var(--shadow-card-inset)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-obsidian)'; e.currentTarget.style.borderColor = 'var(--color-obsidian)'; (e.currentTarget.querySelector('svg') as SVGElement).style.stroke = '#fff'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-snow)'; e.currentTarget.style.borderColor = 'var(--color-fog)'; (e.currentTarget.querySelector('svg') as SVGElement).style.stroke = 'var(--color-obsidian)'; }}
                  aria-label={dir === 'left' ? 'Scroll left' : 'Scroll right'}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-obsidian)" strokeWidth="2" style={{ transition: 'stroke 0.25s' }}>
                    {dir === 'left'
                      ? <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                      : <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />}
                  </svg>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Filter chips */}
        <div className="reveal reveal-d2" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28 }}>
          {FILTERS.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)} style={{
              padding: '7px 18px', borderRadius: 'var(--radius-pill)', cursor: 'pointer',
              fontFamily: 'var(--font-cosmica)', fontSize: 13, fontWeight: 500,
              transition: 'all 0.22s var(--ease-out)',
              background: activeFilter === f ? 'var(--color-obsidian)' : 'var(--color-snow)',
              color: activeFilter === f ? '#fff' : 'var(--color-graphite)',
              border: `1px solid ${activeFilter === f ? 'var(--color-obsidian)' : 'var(--color-fog)'}`,
              boxShadow: activeFilter === f ? 'var(--shadow-btn-primary)' : 'var(--shadow-card-inset)',
              transform: activeFilter === f ? 'scale(1.04)' : 'scale(1)',
            }}>
              {f}
            </button>
          ))}
        </div>

        {/* Scroll row */}
        <div style={{ position: 'relative' }}>
          {/* Fade edges */}
          <div style={{ position: 'absolute', top: 0, bottom: 16, left: 0, width: 48, background: 'linear-gradient(to right, var(--surface-canvas), transparent)', zIndex: 5, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: 0, bottom: 16, right: 0, width: 48, background: 'linear-gradient(to left, var(--surface-canvas), transparent)', zIndex: 5, pointerEvents: 'none' }} />

          <div
            ref={scrollRef}
            className="h-scroll-row"
            style={{ paddingBottom: 16, userSelect: 'none' }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={stopDrag}
            onMouseLeave={stopDrag}
          >
            {/* Decorative tile */}
            <div style={{
              width: 160, height: 420, borderRadius: 'var(--radius-card)', flexShrink: 0,
              background: 'linear-gradient(135deg, var(--color-orchid-flash) 0%, #a855f7 100%)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10,
              boxShadow: '0 12px 40px rgba(254,69,226,0.3)',
            }}>
              <div style={{ fontSize: 42 }}>🇮🇳</div>
              <p style={{ fontFamily: 'var(--font-cosmica)', fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.95)', letterSpacing: 2, textTransform: 'uppercase', textAlign: 'center', lineHeight: 1.5 }}>Incredible<br />India</p>
            </div>

            {filtered.map((d, i) => (
              <div
                key={d.id}
                className="portfolio-tile"
                style={{ width: i % 3 === 0 ? 360 : 300, height: 420, cursor: 'pointer' }}
                onClick={() => setExpanded(expanded === d.id ? null : d.id)}
              >
                <img className="tile-img" src={d.imagePath} alt={d.name} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(9,9,11,0.95) 0%, rgba(9,9,11,0.25) 55%, transparent 100%)', zIndex: 1 }} />

                {/* Hover overlay */}
                <div className="tile-overlay" style={{
                  position: 'absolute', inset: 0, zIndex: 2,
                  background: `linear-gradient(135deg, ${d.accent}20 0%, transparent 100%)`,
                  opacity: 0, transition: 'opacity 0.4s ease',
                }} />

                <div style={{ position: 'absolute', top: 16, left: 16, right: 16, display: 'flex', justifyContent: 'space-between', zIndex: 3 }}>
                  <span className="badge" style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)', color: '#fff', border: '1px solid rgba(255,255,255,0.25)' }}>{d.bestSeason}</span>
                  <span className="badge" style={{ background: DIFFICULTY_COLOR[d.difficulty], color: '#fff', fontWeight: 600 }}>{d.difficulty}</span>
                </div>

                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 20px', zIndex: 3 }}>
                  <p style={{ fontFamily: 'var(--font-cosmica)', fontSize: 10, fontWeight: 700, color: d.accent, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 1.5 }}>{d.region}</p>
                  <h3 style={{ fontFamily: 'var(--font-cosmica)', fontWeight: 700, fontSize: 23, color: '#fff', marginBottom: 5, lineHeight: 1.1 }}>{d.name}</h3>
                  <p style={{ fontFamily: 'var(--font-cosmica)', fontWeight: 300, fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 14, lineHeight: 1.45 }}>{d.tagline}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: 5 }}>
                      {d.tags.slice(0, 2).map(tag => <span key={tag} className="badge badge-overlay" style={{ fontSize: 9, padding: '3px 7px' }}>{tag}</span>)}
                    </div>
                    <span style={{ fontFamily: 'var(--font-cosmica)', fontSize: 14, fontWeight: 700, color: '#fff' }}>{d.startingFrom}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 16, marginBottom: 8 }}>
          {Array.from({ length: filtered.length + 1 }).map((_, i) => (
            <div key={i} className={`scroll-dot ${activeDot === i ? 'active' : ''}`} onClick={() => {
              if (!scrollRef.current) return;
              const maxScroll = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
              scrollRef.current.scrollTo({ left: (i / filtered.length) * maxScroll, behavior: 'smooth' });
            }} />
          ))}
        </div>
        <p style={{ fontFamily: 'var(--font-cosmica)', fontSize: 11, color: 'var(--color-ash)', textAlign: 'center', marginBottom: 4 }}>
          ← Scroll, drag, or use arrows to explore →
        </p>

        {/* Expanded detail panel */}
        {expanded && (() => {
          const d = DESTINATIONS.find(x => x.id === expanded)!;
          return (
            <div className="card-white" key={expanded} style={{ marginTop: 24, animation: 'scaleIn 0.4s var(--ease-out) both' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 40 }}>
                <div>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                    <span className="badge badge-dark">{d.region}</span>
                    <span className="badge" style={{ background: DIFFICULTY_COLOR[d.difficulty] + '18', color: DIFFICULTY_COLOR[d.difficulty], border: `1px solid ${DIFFICULTY_COLOR[d.difficulty]}40` }}>{d.difficulty}</span>
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-cosmica)', fontWeight: 700, fontSize: 28, color: 'var(--color-obsidian)', marginBottom: 8 }}>{d.name} Expedition</h3>
                  <p style={{ fontFamily: 'var(--font-cosmica)', fontSize: 15, color: 'var(--color-steel)', lineHeight: 1.65, marginBottom: 24 }}>{d.tagline}</p>
                  <div style={{ display: 'flex', gap: 24, marginBottom: 28, flexWrap: 'wrap' }}>
                    {[{ label: 'Duration', val: d.duration }, { label: 'Group size', val: d.groupSize }, { label: 'Best season', val: d.bestSeason }, { label: 'Starting from', val: d.startingFrom }].map(m => (
                      <div key={m.label}>
                        <p style={{ fontFamily: 'var(--font-cosmica)', fontSize: 11, fontWeight: 600, color: 'var(--color-ash)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>{m.label}</p>
                        <p style={{ fontFamily: 'var(--font-cosmica)', fontSize: 15, fontWeight: 600, color: 'var(--color-obsidian)' }}>{m.val}</p>
                      </div>
                    ))}
                  </div>
                  <p style={{ fontFamily: 'var(--font-cosmica)', fontSize: 11, fontWeight: 600, color: 'var(--color-ash)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 12 }}>Signature experiences</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {d.highlights.map(h => (
                      <div key={h} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginTop: 2, flexShrink: 0 }}>
                          <circle cx="8" cy="8" r="7" stroke="var(--color-obsidian)" strokeWidth="1" />
                          <path d="M5 8l2 2 4-4" stroke="var(--color-obsidian)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span style={{ fontFamily: 'var(--font-cosmica)', fontSize: 14, color: 'var(--color-ink)' }}>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div className="img-zoom-wrap" style={{ height: 180, borderRadius: 'var(--radius-card-compact)', overflow: 'hidden' }}>
                    <img src={d.imagePath} alt={d.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <p style={{ fontFamily: 'var(--font-cosmica)', fontSize: 12, fontWeight: 600, color: 'var(--color-ash)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: -8 }}>Included in every journey</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {d.includes.map(inc => (
                      <div key={inc} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '8px 12px', background: 'var(--color-mist)', borderRadius: 8, transition: 'background 0.2s' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-fog)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'var(--color-mist)')}>
                        <span style={{ fontSize: 12 }}>✦</span>
                        <span style={{ fontFamily: 'var(--font-cosmica)', fontSize: 13, color: 'var(--color-ink)' }}>{inc}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 8 }}>
                    <button className="btn-primary" onClick={() => document.getElementById('planner')?.scrollIntoView({ behavior: 'smooth' })}>Plan this journey</button>
                    <button className="btn-outline" onClick={() => setExpanded(null)}>Close</button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      <style>{`
        @media (max-width: 768px) {
          #destinations .card-white > div { grid-template-columns: 1fr !important; }
        }
        .portfolio-tile:hover .tile-overlay { opacity: 1 !important; }
      `}</style>
    </section>
  );
}
