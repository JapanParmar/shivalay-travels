'use client';
import { useState } from 'react';

const SAMPLE_ITINERARY = {
  destination: 'Ladakh, Himalayas',
  duration: '8 nights · 9 days',
  style: 'High Pass Adventure & Culture',
  days: [
    { day: 1, title: 'Arrival in Leh & Acclimatisation', location: 'Leh (11,500 ft)', desc: 'Private airport pickup and transfer to your luxury heritage hotel. Complete physical rest for acclimatisation. In the evening, enjoy a light, warm traditional Ladakhi welcome dinner.' },
    { day: 2, title: 'Leh Monasteries & Shanti Stupa Sunrise', location: 'Leh', desc: 'Sunrise visit to Shanti Stupa overlooking the Indus valley. Private guided walk through Leh Old Town, followed by a VIP blessing ceremony at Thiksey Monastery.' },
    { day: 3, title: 'Across the Mighty Khardung La', location: 'Nubra Valley (10,000 ft)', desc: "Drive across Khardung La, one of the world's highest motorable passes. Explore Diskit Monastery and ride double-humped camels on the Hunder sand dunes at sunset." },
    { day: 4, title: 'Turtuk Border Village Exploration', location: 'Turtuk', desc: 'Journey to the edge of the line of control. Walk through Balti village apricot orchards and enjoy a traditional Balti lunch.' },
    { day: 5, title: 'Pangong Tso Wilderness Crossing', location: 'Pangong Lake (13,940 ft)', desc: 'Travel alongside the Shyok River to the legendary Pangong Tso Lake. Check in to your premium heated luxury dome tent.' },
    { day: 6, title: 'Chang La Return to Leh valley', location: 'Leh', desc: 'Sunrise photography by the turquoise waters of Pangong. Drive back to Leh crossing Chang La. Visit Hemis Monastery.' },
    { day: 7, title: 'Indus-Zanskar Sangam Rafting', location: 'Nimoo', desc: 'Morning visit to the confluence of Indus & Zanskar rivers at Nimoo. Moderate rafting option on class II rapids.' },
    { day: 8, title: 'Artisan copper-smiths & Farewell', location: 'Leh', desc: 'Excursion to Chilling village. Evening local culinary masterclass, preparing skyu (local pasta). Farewell dinner.' },
    { day: 9, title: 'Departure Transfer', location: 'Leh Airport', desc: 'Sunrise transfer to Leh Kushok Bakula Rimpochee Airport for your flight back home.' },
  ],
};

export default function ItineraryPreview() {
  const [expandedDay, setExpandedDay] = useState<number | null>(1);

  return (
    <section id="itinerary-preview" style={{ background: 'var(--surface-canvas)', padding: '48px 0', borderBottom: '1px solid var(--color-zinc-hairline)' }}>
      <div className="container">
        <div className="itinerary-grid">
          {/* Left — itinerary */}
          <div>
            <p className="section-label" style={{ marginBottom: 8 }}>Sample Itinerary</p>
            <h2 className="heading-lg" style={{ marginBottom: 10 }}>A taste of what we handcraft<br />for every client.</h2>
            <p className="font-primary text-sm lh-16 text-muted" style={{ marginBottom: 20, maxWidth: 480 }}>
              Here is an actual luxury Ladakh itinerary designed recently. Your customized schedule will be built completely around your group.
            </p>

            {/* Meta tags */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 24 }}>
              {[SAMPLE_ITINERARY.destination, SAMPLE_ITINERARY.duration, SAMPLE_ITINERARY.style].map(m => (
                <span key={m} className="pill fs-11" style={{ pointerEvents: 'none' }}>{m}</span>
              ))}
            </div>

            {/* Day-by-day */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {SAMPLE_ITINERARY.days.slice(0, 6).map(day => (
                <div
                  key={day.day}
                  style={{
                    background: 'var(--color-onyx-black)',
                    border: '1px solid var(--color-zinc-hairline)',
                    borderRadius: 'var(--radius-xl)',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'border-color 0.18s ease',
                  }}
                  onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-smoke)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-zinc-hairline)'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px' }}>
                    <div style={{
                      width: 30, height: 30, borderRadius: 'var(--radius-md)', flexShrink: 0,
                      background: expandedDay === day.day ? 'var(--color-highlighter-lime)' : 'var(--color-carbon)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'background 0.2s ease',
                    }}>
                      <span className="font-primary fs-11 fw-medium" style={{ color: expandedDay === day.day ? 'var(--color-onyx-black)' : 'var(--color-steel-gray)' }}>
                        {String(day.day).padStart(2, '0')}
                      </span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                        <p className="font-primary fs-13 fw-medium lh-13" style={{ color: 'var(--color-pure-white)' }}>{day.title}</p>
                        <span className="font-primary text-xs" style={{ color: 'var(--color-steel-gray)', whiteSpace: 'nowrap', flexShrink: 0 }}>{day.location}</span>
                      </div>
                    </div>
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, transform: expandedDay === day.day ? 'rotate(180deg)' : 'none', transition: 'transform 0.28s var(--ease-out)', color: 'var(--color-steel-gray)' }}>
                      <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div style={{ overflow: 'hidden', maxHeight: expandedDay === day.day ? 120 : 0, transition: 'max-height 0.35s var(--ease-out)' }}>
                    <p className="font-primary text-sm lh-17 text-muted" style={{ padding: '0 16px 14px 58px' }}>{day.desc}</p>
                  </div>
                </div>
              ))}
              {/* Blur teaser */}
              <div style={{ position: 'relative' }}>
                <div style={{ filter: 'blur(3px)', opacity: 0.3, pointerEvents: 'none' }}>
                  {SAMPLE_ITINERARY.days.slice(6).map(day => (
                    <div key={day.day} style={{ background: 'var(--color-carbon)', border: '1px solid var(--color-zinc-hairline)', borderRadius: 'var(--radius-xl)', padding: '13px 16px', marginBottom: 6 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 30, height: 30, borderRadius: 'var(--radius-md)', background: 'var(--color-zinc-hairline)', flexShrink: 0 }} />
                        <p className="font-primary fs-13 fw-medium" style={{ color: 'var(--color-ash-gray)' }}>{day.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--surface-canvas) 0%, transparent 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
              </div>
            </div>
          </div>

          {/* Right — CTA Card */}
          <div style={{ position: 'sticky', top: 72 }}>
            <div style={{
              background: 'var(--color-carbon)',
              border: '1px solid var(--color-zinc-hairline)',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
            }}>
              <div style={{ height: 180, overflow: 'hidden', position: 'relative' }}>
                <img src="/images/ladakh.png" alt="Ladakh Mountains" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'var(--gradient-visual-overlay)' }} />
                <span className="font-primary fs-9 fw-medium" style={{ position: 'absolute', top: 12, left: 12, color: 'var(--color-onyx-black)', background: 'var(--color-highlighter-lime)', padding: '3px 8px', borderRadius: 'var(--radius-full)' }}>
                  Pangong Tso
                </span>
              </div>
              <div style={{ padding: '20px' }}>
                <p className="section-label" style={{ marginBottom: 10, color: 'var(--color-ash-gray)' }}>Complimentary Consultation</p>
                <h3 className="heading-md" style={{ marginBottom: 8 }}>Want a customized adventure?</h3>
                <p className="font-primary text-sm lh-16 text-muted" style={{ marginBottom: 16 }}>
                  Submit a query to co-create a perfect Himalayan or backwater itinerary with our experts.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                  {['Custom vehicle routing & inner line permits', 'Stays in luxury camps, palaces, & villas', 'Dedicated 24/7 travel advisor on WhatsApp', 'Curated local guides & expert botanists'].map(item => (
                    <div key={item} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                      <span className="text-xs" style={{ color: 'var(--color-highlighter-lime)', marginTop: 2, flexShrink: 0 }}>✦</span>
                      <span className="font-primary fs-11 lh-15 text-muted">{item}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <button className="btn-primary fs-13" style={{ width: '100%', justifyContent: 'center' }} onClick={() => document.getElementById('planner')?.scrollIntoView({ behavior: 'smooth' })}>
                    Design My Plan — Free
                  </button>
                  <a
                    href="https://wa.me/919340994628?text=Hello%20Shivalay%20Travels%2C%20I%20would%20like%20to%20consult%20about%20a%20customized%20itinerary."
                    target="_blank" rel="noopener noreferrer"
                    className="btn-ghost fs-13"
                    style={{ textAlign: 'center', justifyContent: 'center' }}
                  >
                    WhatsApp with Specialist
                  </a>
                </div>
                <p className="font-primary text-xs text-center" style={{ color: 'var(--color-ash-gray)', marginTop: 10 }}>No hidden costs · Complimentary consultation</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
