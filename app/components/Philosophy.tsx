'use client';
import { useState } from 'react';

const PROCESS_STEPS = [
  { num: '01', title: 'Discovery call', duration: '30 min', body: 'Speak directly with our Indian travel specialists. We discuss your group preferences, pace of travel, dietary requirements, and dream destinations.', icon: '◎', color: 'var(--color-ember)' },
  { num: '02', title: 'Customised planning', duration: '24–48 hrs', body: 'We handcraft a complete itinerary with handpicked hotels, experienced drivers, local guides, and optimal road routing.', icon: '⊹', color: 'var(--color-orchid-flash)' },
  { num: '03', title: 'Safety check', duration: 'Pre-departure', body: 'For high-altitude destinations like Ladakh and Spiti, we program rest days, secure inner line permits, and arrange medical backups.', icon: '◇', color: '#ff4d4d' },
  { num: '04', title: 'Seamless journey', duration: 'Travel dates', body: 'Your dedicated concierge is on standby 24/7. Ground transport, hotel check-ins, local guides, and special permits are managed invisibly.', icon: '✦', color: '#b91c1c' },
];

const FAQS = [
  { q: 'Do you arrange Inner Line Permits (ILP) for Ladakh?', a: 'Yes. For restricted border areas like Pangong Tso, Nubra Valley, and Turtuk, our team secures all necessary permits from the Leh administration. You only need to share your ID proof online.' },
  { q: 'How do you handle high-altitude acclimatisation?', a: 'Safety is our absolute priority. For Ladakh expeditions, our itineraries mandate a minimum of 48 hours of complete rest in Leh. Our private vehicles carry oxygen cylinders, and guides are trained in wilderness first aid.' },
  { q: 'What type of vehicles do you provide for ground transport?', a: 'We use premium, well-maintained all-terrain vehicles such as Toyota Innova Crysta or Fortuner. For groups, we arrange custom luxury Tempo Travellers. All vehicles have experienced drivers who know the local terrain.' },
  { q: 'Can we customise the stays to include specific luxury properties?', a: "Absolutely. We have direct partnerships with India's finest luxury brands including Taj Palaces, The Oberoi Group, boutique luxury camps in Ladakh, and premium houseboats in Kerala. Your itinerary can be tailored to any stay." },
  { q: 'Do you cater to specific dietary preferences?', a: 'Yes. We coordinate directly with all hotels and local hosts to ensure your dietary requirements are met, whether you need pure vegetarian, Jain, gluten-free, or specific regional cuisines during your travels.' },
  { q: 'Can itineraries be customised for families with senior citizens or children?', a: 'Yes, we specialise in multi-generational family journeys. We adjust the pace, minimise long road journeys, select hotels with easy accessibility, and plan activities suitable for all age groups.' },
];

export default function Philosophy() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section id="how-it-works" style={{ background: 'var(--surface-canvas)', padding: '80px 0' }}>
      <div className="container">

        {/* Header */}
        <div style={{ marginBottom: 52 }}>
          <div className="badge badge-dark reveal" style={{ background: 'var(--color-graphite)', color: '#fafafa', borderRadius: '12px', marginBottom: 16 }}>How we work</div>
          <h2 className="reveal reveal-d1" style={{ fontFamily: 'var(--font-cosmica)', fontWeight: 700, fontSize: 'clamp(28px,3.5vw,42px)', color: 'var(--color-obsidian)', lineHeight: 1.2, maxWidth: 480 }}>
            Tailoring Journeys Across the Subcontinent.
          </h2>
        </div>

        {/* Process steps */}
        <div className="process-steps-grid">
          {PROCESS_STEPS.map((s, i) => (
            <div
              key={s.num}
              className={`card-white reveal reveal-d${i + 1}`}
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
                background: 'var(--surface-card-white)',
                border: '1px solid var(--color-pebble)',
                borderRadius: '36px',
                padding: '24px',
                boxShadow: 'none'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 'var(--radius-icon)',
                  background: 'var(--color-fog)',
                  border: '1px solid var(--color-pebble)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 17, color: 'var(--color-obsidian)',
                  transition: 'all 0.3s ease',
                }}>
                  {s.icon}
                </div>
                <span style={{ fontFamily: 'var(--font-cosmica)', fontSize: 11, fontWeight: 500, color: 'var(--color-obsidian)', background: 'var(--color-fog)', padding: '3px 10px', borderRadius: '12px', marginLeft: 'auto' }}>
                  {s.duration}
                </span>
              </div>
              <div>
                <p style={{ fontFamily: 'var(--font-cosmica)', fontSize: 10, fontWeight: 700, color: 'var(--color-steel)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 5 }}>
                  Step {s.num}
                </p>
                <h3 style={{ fontFamily: 'var(--font-cosmica)', fontWeight: 700, fontSize: 16, color: 'var(--color-obsidian)', marginBottom: 8, lineHeight: 1.3 }}>
                  {s.title}
                </h3>
                <p style={{ fontFamily: 'var(--font-cosmica)', fontSize: 13.5, color: 'var(--color-steel)', lineHeight: 1.65 }}>
                  {s.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Philosophy + FAQ */}
        <div className="philosophy-faq-grid">
          {/* Philosophy */}
          <div className="card-dark reveal-right" style={{ display: 'flex', flexDirection: 'column', gap: 28, height: '100%', position: 'relative', overflow: 'hidden', background: 'var(--surface-card-white)', border: '1px solid rgba(220,38,38,0.18)', borderRadius: '36px', padding: '32px' }}>
            <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <p style={{ fontFamily: 'var(--font-cosmica)', fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 18 }}>
                Our philosophy
              </p>
              <h3 style={{ fontFamily: 'var(--font-cosmica)', fontWeight: 700, fontSize: 26, color: '#fff', lineHeight: 1.25, marginBottom: 18 }}>
                Curating divine<br />pilgrimages & tours with<br />absolute responsibility.
              </h3>
              <p style={{ fontFamily: 'var(--font-cosmica)', fontWeight: 300, fontSize: 14.5, color: 'rgba(255,255,255,0.5)', lineHeight: 1.75 }}>
                Shivalay Travels brings premium coordination standards to Indian domestic tourism. We coordinate directly with local teams, select verified hotels, and maintain round-the-clock support.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 22, position: 'relative', zIndex: 1 }}>
              {[
                { label: 'Taj, Oberoi & boutique stays', desc: 'Curated premium accommodations' },
                { label: 'All permits & logistics handled', desc: 'Inner Line Permits & border paperwork managed' },
                { label: 'Local expert guides only', desc: 'Travel alongside regional culture and terrain specialists' },
              ].map((p, i) => (
                <div
                  key={p.label}
                  style={{ display: 'flex', gap: 12, alignItems: 'flex-start', transition: 'transform 0.2s ease' }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'translateX(4px)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'none')}
                >
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5l2 2 4-4" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <p style={{ fontFamily: 'var(--font-cosmica)', fontSize: 13.5, fontWeight: 600, color: '#fff' }}>{p.label}</p>
                    <p style={{ fontFamily: 'var(--font-cosmica)', fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div className="reveal">
            <p style={{ fontFamily: 'var(--font-cosmica)', fontSize: 11, fontWeight: 600, color: 'var(--color-steel)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 18 }}>
              Frequently asked
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {FAQS.map((faq, i) => (
                <div
                  key={i}
                  className="card-white"
                  style={{
                    padding: 0, overflow: 'hidden',
                    background: 'var(--surface-card-white)',
                    border: '1px solid var(--color-pebble)',
                    borderRadius: openFaq === i ? '24px' : '36px',
                    transition: 'all 0.3s ease',
                    boxShadow: 'none'
                  }}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{
                      width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '16px 22px', background: openFaq === i ? 'var(--surface-card-muted)' : 'none',
                      border: 'none', cursor: 'pointer', textAlign: 'left', gap: 14,
                      transition: 'background 0.2s ease',
                    }}
                    onMouseEnter={e => { if (openFaq !== i) e.currentTarget.style.background = 'var(--surface-card-muted)'; }}
                    onMouseLeave={e => { if (openFaq !== i) e.currentTarget.style.background = 'none'; }}
                  >
                    <span style={{ fontFamily: 'var(--font-cosmica)', fontSize: 13.5, fontWeight: 600, color: 'var(--color-obsidian)', lineHeight: 1.45 }}>
                      {faq.q}
                    </span>
                    <svg
                      width="16" height="16" viewBox="0 0 16 16" fill="none"
                      style={{ flexShrink: 0, transform: openFaq === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.32s var(--ease-out)' }}
                    >
                      <path d="M3 6l5 5 5-5" stroke="var(--color-steel)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <div style={{
                    overflow: 'hidden',
                    maxHeight: openFaq === i ? 200 : 0,
                    transition: 'max-height 0.38s var(--ease-out)',
                  }}>
                    <p style={{ padding: '0 22px 16px', fontFamily: 'var(--font-cosmica)', fontSize: 13.5, fontWeight: 400, color: 'var(--color-steel)', lineHeight: 1.72 }}>
                      {faq.a}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
