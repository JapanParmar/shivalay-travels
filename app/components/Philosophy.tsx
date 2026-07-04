'use client';
import { useState } from 'react';

const PROCESS_STEPS = [
  { num: '01', title: 'Discovery Call', duration: '30 min', body: 'Speak directly with our travel specialists. We discuss your group preferences, pace of travel, dietary requirements, and dream destinations.', icon: '◎' },
  { num: '02', title: 'Custom Planning', duration: '24–48 hrs', body: 'We handcraft a complete itinerary with handpicked hotels, experienced drivers, local guides, and optimal routing for your journey.', icon: '⊹' },
  { num: '03', title: 'Safety Check', duration: 'Pre-departure', body: 'For high-altitude destinations like Ladakh, we program rest days, secure inner line permits, and arrange medical backups.', icon: '◇' },
  { num: '04', title: 'Seamless Journey', duration: 'Travel dates', body: 'Your dedicated concierge is on standby 24/7. Ground transport, hotel check-ins, local guides, and permits are managed end-to-end.', icon: '✦' },
];

const FAQS = [
  { q: 'Do you arrange Inner Line Permits (ILP) for Ladakh?', a: 'Yes. For restricted border areas like Pangong Tso, Nubra Valley, and Turtuk, our team secures all necessary permits from the Leh administration. You only need to share your ID proof online.' },
  { q: 'How do you handle high-altitude acclimatisation?', a: 'Safety is our absolute priority. For Ladakh expeditions, our itineraries mandate a minimum of 48 hours of complete rest in Leh. Our private vehicles carry oxygen cylinders, and guides are trained in wilderness first aid.' },
  { q: 'What type of vehicles do you provide for ground transport?', a: 'We use premium, well-maintained all-terrain vehicles such as Toyota Innova Crysta or Fortuner. For groups, we arrange custom luxury Tempo Travellers. All vehicles have experienced drivers who know the local terrain.' },
  { q: 'Can we customise the stays to include specific luxury properties?', a: "Absolutely. We have direct partnerships with India's finest luxury brands including Taj Palaces, The Oberoi Group, boutique luxury camps in Ladakh, and premium houseboats in Kerala." },
  { q: 'Do you cater to specific dietary preferences?', a: 'Yes. We coordinate directly with all hotels and local hosts to ensure your dietary requirements are met — pure vegetarian, Jain, gluten-free, or specific regional cuisines.' },
  { q: 'Can itineraries be customised for families with senior citizens or children?', a: 'Yes, we specialise in multi-generational family journeys. We adjust the pace, minimise long road journeys, and select hotels with easy accessibility and activities suitable for all age groups.' },
];

export default function Philosophy() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section id="how-it-works" style={{ background: 'var(--surface-canvas)', padding: '48px 0', borderBottom: '1px solid var(--color-zinc-hairline)' }}>
      <div className="container">
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <p className="section-label" style={{ marginBottom: 8 }}>How we work</p>
          <h2 className="heading-lg">Tailoring Journeys Across<br />the Subcontinent.</h2>
        </div>

        {/* Process steps */}
        <div className="process-grid" style={{ marginBottom: 40 }}>
          {PROCESS_STEPS.map((s, i) => (
            <div
              key={s.num}
              className={`reveal reveal-d${i + 1}`}
              style={{
                background: 'var(--color-onyx-black)',
                border: '1px solid var(--color-zinc-hairline)',
                borderRadius: 'var(--radius-xl)',
                padding: '20px',
                display: 'flex', flexDirection: 'column', gap: 12,
                transition: 'border-color 0.18s ease',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-highlighter-lime)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-zinc-hairline)'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 'var(--radius-md)',
                  background: 'var(--color-carbon)', border: '1px solid var(--color-zinc-hairline)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, color: 'var(--color-highlighter-lime)',
                }}>
                  {s.icon}
                </div>
                <span className="font-primary text-xs" style={{ color: 'var(--color-steel-gray)', padding: '3px 8px', border: '1px solid var(--color-zinc-hairline)', borderRadius: 'var(--radius-full)' }}>
                  {s.duration}
                </span>
              </div>
              <div>
                <p className="font-primary text-xs fw-medium uppercase ls-05" style={{ color: 'var(--color-ash-gray)', marginBottom: 4 }}>Step {s.num}</p>
                <h3 className="font-secondary text-lg fw-regular" style={{ color: 'var(--color-pure-white)', marginBottom: 6 }}>{s.title}</h3>
                <p className="font-primary text-sm lh-16 text-muted">{s.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Philosophy + FAQ */}
        <div className="philosophy-grid">
          {/* Philosophy */}
          <div
            className="reveal-scale"
            style={{
              background: 'var(--color-carbon)',
              border: '1px solid var(--color-zinc-hairline)',
              borderRadius: 'var(--radius-xl)',
              padding: '24px',
              display: 'flex', flexDirection: 'column', gap: 20,
            }}
          >
            <div>
              <p className="font-primary text-xs fw-medium uppercase ls-1" style={{ color: 'var(--color-ash-gray)', marginBottom: 12 }}>Our philosophy</p>
              <h3 className="heading-md" style={{ marginBottom: 12 }}>
                Curating divine pilgrimages &amp;<br />tours with absolute responsibility.
              </h3>
              <p className="font-primary text-sm lh-17 text-muted">
                Shivalay Travels brings premium coordination standards to Indian domestic tourism. We coordinate directly with local teams, select verified hotels, and maintain round-the-clock support.
              </p>
            </div>
            <div style={{ borderTop: '1px solid var(--color-zinc-hairline)', paddingTop: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: 'Taj, Oberoi & boutique stays', desc: 'Curated premium accommodations' },
                { label: 'All permits & logistics handled', desc: 'Inner Line Permits & border paperwork' },
                { label: 'Local expert guides only', desc: 'Regional culture & terrain specialists' },
              ].map((p) => (
                <div key={p.label} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span className="text-xs" style={{ color: 'var(--color-highlighter-lime)', marginTop: 2, flexShrink: 0 }}>✦</span>
                  <div>
                    <p className="font-primary fs-13 fw-medium lh-13" style={{ color: 'var(--color-pure-white)' }}>{p.label}</p>
                    <p className="font-primary fs-11 text-muted" style={{ marginTop: 2 }}>{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              className="btn-primary fs-13"
              onClick={() => document.getElementById('planner')?.scrollIntoView({ behavior: 'smooth' })}
              style={{ alignSelf: 'flex-start' }}
            >
              Plan My Journey
            </button>
          </div>

          {/* FAQ */}
          <div className="reveal">
            <p className="section-label" style={{ marginBottom: 16 }}>Frequently asked</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {FAQS.map((faq, i) => (
                <div
                  key={i}
                  style={{
                    background: 'var(--color-onyx-black)',
                    border: '1px solid var(--color-zinc-hairline)',
                    borderRadius: 'var(--radius-xl)',
                    overflow: 'hidden',
                    transition: 'border-color 0.18s ease',
                  }}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{
                      width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '14px 16px', background: openFaq === i ? 'var(--color-carbon)' : 'transparent',
                      border: 'none', cursor: 'pointer', textAlign: 'left', gap: 12,
                      transition: 'background 0.18s ease',
                    }}
                    onMouseEnter={e => { if (openFaq !== i) e.currentTarget.style.background = 'var(--color-carbon)'; }}
                    onMouseLeave={e => { if (openFaq !== i) e.currentTarget.style.background = 'transparent'; }}
                  >
                    <span className="font-primary fs-13 fw-medium lh-14" style={{ color: 'var(--color-pure-white)' }}>{faq.q}</span>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, transform: openFaq === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.28s var(--ease-out)' }}>
                      <path d="M3 6l5 5 5-5" stroke="var(--color-steel-gray)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <div style={{ overflow: 'hidden', maxHeight: openFaq === i ? 200 : 0, transition: 'max-height 0.35s var(--ease-out)' }}>
                    <p className="font-primary text-sm lh-17 text-muted" style={{ padding: '0 16px 14px' }}>{faq.a}</p>
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
