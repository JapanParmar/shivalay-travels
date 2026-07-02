'use client';
import { useState } from 'react';

const SAMPLE_ITINERARY = {
  destination: 'Ladakh, Himalayas',
  duration: '8 nights · 9 days',
  style: 'High Pass Adventure & Culture',
  days: [
    { day: 1, title: 'Arrival in Leh & Acclimatisation', location: 'Leh (11,500 ft)', desc: 'Private airport pickup and transfer to your luxury heritage hotel. Complete physical rest for acclimatisation. In the evening, enjoy a light, warm traditional Ladakhi welcome dinner.' },
    { day: 2, title: 'Leh Monasteries & Shanti Stupa Sunrise', location: 'Leh', desc: 'Sunrise visit to Shanti Stupa overlooking the Indus valley. Private guided walk through Leh Old Town, followed by a VIP blessing ceremony at Thiksey Monastery.' },
    { day: 3, title: 'Across the Mighty Khardung La', location: 'Nubra Valley (10,000 ft)', desc: 'Drive across Khardung La, one of the world\'s highest motorable passes. Explore Diskit Monastery and ride double-humped camels on the Hunder sand dunes at sunset.' },
    { day: 4, title: 'Turtuk Border Village Exploration', location: 'Turtuk', desc: 'Journey to the edge of the line of control. Walk through Balti village apricot orchards, meet descendants of the local royal family, and enjoy a traditional Balti lunch.' },
    { day: 5, title: 'Pangong Tso Wilderness Crossing', location: 'Pangong Lake (13,940 ft)', desc: 'Travel alongside the Shyok River to the legendary Pangong Tso Lake. Check in to your premium heated luxury dome tent. Private lakeside sunset walk and stargazing.' },
    { day: 6, title: 'Chang La Return to Leh valley', location: 'Leh', desc: 'Sunrise photography by the turquoise waters of Pangong. Drive back to Leh crossing Chang La. Visit Hemis Monastery, the wealthiest monastery in Ladakh.' },
    { day: 7, title: 'Indus-Zanskar Sangam Rafting', location: 'Nimoo', desc: 'Morning visit to the confluence of Indus & Zanskar rivers at Nimoo. Moderate rafting option on class II rapids, followed by a riverside lunch.' },
    { day: 8, title: 'Artisan copper-smiths & Farewell', location: 'Leh', desc: 'Excursion to Chilling village to see master copper-smiths at work. Evening local culinary masterclass, preparing skyu (local pasta). Farewell dinner.' },
    { day: 9, title: 'Departure Transfer', location: 'Leh Airport', desc: 'Sunrise transfer to Leh Kushok Bakula Rimpochee Airport for your flight back home.' },
  ],
};

export default function ItineraryPreview() {
  const [expandedDay, setExpandedDay] = useState<number | null>(1);

  return (
    <section id="itinerary-preview" style={{ background: 'var(--surface-canvas)', padding: '80px 0' }}>
      <div className="container">

        <div className="itinerary-grid" style={{ gap: 48 }}>

          {/* Left — header + itinerary */}
          <div>
            <div className="badge badge-dark" style={{ background: 'var(--color-graphite)', color: '#fafafa', borderRadius: '12px', marginBottom: 16 }}>Sample Itinerary</div>
            <h2 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 'clamp(26px,3.2vw,40px)', color: 'var(--color-obsidian)', lineHeight: 1.2, marginBottom: 12 }}>
              A taste of what we handcraft<br />for every client.
            </h2>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--color-steel)', lineHeight: 1.65, marginBottom: 32, maxWidth: 480 }}>
              Here is an actual luxury Ladakh itinerary designed recently. Your customized schedule will be built completely around your group.
            </p>

            {/* Meta tags */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
              {[SAMPLE_ITINERARY.destination, SAMPLE_ITINERARY.duration, SAMPLE_ITINERARY.style].map(m => (
                <span key={m} className="badge" style={{ background: 'var(--surface-card-white)', border: '1px solid var(--color-pebble)', color: 'var(--color-steel)', fontSize: 13, padding: '6px 14px' }}>{m}</span>
              ))}
            </div>

            {/* Day-by-day */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {SAMPLE_ITINERARY.days.slice(0, 6).map(day => (
                <div key={day.day}
                  className="card-white"
                  style={{ padding: 0, overflow: 'hidden', cursor: 'pointer', background: 'var(--surface-card-white)', border: '1px solid var(--color-pebble)', borderRadius: '36px', boxShadow: 'none' }}
                  onClick={() => setExpandedDay(expandedDay === day.day ? null : day.day)}>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 22px' }}>
                    {/* Day number */}
                    <div style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                      background: expandedDay === day.day ? 'var(--color-ember)' : 'var(--surface-card-muted)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.3s ease' }}>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 700,
                        color: '#fff' }}>
                        {String(day.day).padStart(2, '0')}
                      </span>
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                        <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 15,
                          color: 'var(--color-obsidian)', lineHeight: 1.3 }}>
                          {day.title}
                        </p>
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 500,
                          color: 'var(--color-steel)', whiteSpace: 'nowrap', flexShrink: 0 }}>
                          {day.location}
                        </span>
                      </div>
                    </div>

                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0,
                      transform: expandedDay === day.day ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s ease' }}>
                      <path d="M3 6l5 5 5-5" stroke="var(--color-steel)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>

                  {expandedDay === day.day && (
                    <div style={{ padding: '0 22px 18px 74px', animation: 'revealUp 0.3s ease both' }}>
                      <p style={{ fontFamily: 'var(--font-body)', fontWeight: 400, fontSize: 14,
                        color: 'var(--color-steel)', lineHeight: 1.7 }}>
                        {day.desc}
                      </p>
                    </div>
                  )}
                </div>
              ))}

              {/* Blur teaser */}
              <div style={{ position: 'relative' }}>
                <div style={{ filter: 'blur(4px)', opacity: 0.4, pointerEvents: 'none' }}>
                  {SAMPLE_ITINERARY.days.slice(6).map(day => (
                    <div key={day.day} className="card-white" style={{ padding: '16px 22px', marginBottom: 10, background: 'var(--surface-card-white)', border: '1px solid var(--color-pebble)', borderRadius: '36px', boxShadow: 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--color-fog)', flexShrink: 0 }} />
                        <p style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 15, color: 'var(--color-ash)' }}>{day.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'linear-gradient(to top, var(--surface-canvas) 0%, transparent 100%)' }}>
                </div>
              </div>
            </div>
          </div>

          <div className="itinerary-cta-wrap" style={{ position: 'sticky', top: 80 }}>
            <div className="card-dark" style={{ display: 'flex', flexDirection: 'column', gap: 20, background: 'var(--surface-card-white)', border: '1px solid rgba(220,38,38,0.18)', borderRadius: '36px', padding: '32px', boxShadow: 'none' }}>
              
              {/* Image Header on right card */}
              <div style={{ height: 160, borderRadius: '28px', overflow: 'hidden', position: 'relative' }}>
                <img src="/images/ladakh.png" alt="Ladakh Mountains" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(9,9,11,0.6) 0%, transparent 100%)' }} />
                <span className="badge" style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(9,9,11,0.65)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', fontSize: 10 }}>Pangong Tso</span>
              </div>

              <div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600,
                  color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 8 }}>
                  Complimentary Consultation
                </p>
                <h3 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 22,
                  color: '#fff', lineHeight: 1.25, marginBottom: 8 }}>
                  Want a customized adventure?
                </h3>
                <p style={{ fontFamily: 'var(--font-body)', fontWeight: 400, fontSize: 13,
                  color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
                  Submit a query to co-create a perfect Himalayan or backwater itinerary with our experts.
                </p>
              </div>

              {/* Inclusions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {['Custom vehicle routing & inner line permits', 'Stays in luxury camps, palaces, & villas', 'Dedicated 24/7 travel advisor on WhatsApp', 'Curated local guides & expert botanists'].map(item => (
                  <div key={item} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ marginTop: 3, flexShrink: 0 }}>
                      <circle cx="7" cy="7" r="6" stroke="rgba(255,255,255,0.25)" strokeWidth="1"/>
                      <path d="M4 7l2 2 4-4" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 400,
                      color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button className="btn-primary"
                  style={{ boxShadow: 'none', width: '100%', justifyContent: 'center' }}
                  onClick={() => document.getElementById('planner')?.scrollIntoView({ behavior: 'smooth' })}>
                  Design My Plan — Free
                </button>
                <a href="https://wa.me/919340994628?text=Hello%20Shivalay%20Travels%2C%20I%20would%20like%20to%20consult%20about%20a%20customized%20itinerary." target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    padding: '12px 20px', borderRadius: 'var(--radius-pill)',
                    border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)',
                    fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 500,
                    textDecoration: 'none', transition: 'color 0.2s ease' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}>
                  WhatsApp with Specialist
                </a>
              </div>

              <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'rgba(255,255,255,0.25)', textAlign: 'center' }}>
                Complimentary Consultation · No hidden costs
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .itinerary-grid { grid-template-columns: 1fr !important; }
          .itinerary-cta-wrap { position: static !important; }
        }
      `}</style>
    </section>
  );
}
