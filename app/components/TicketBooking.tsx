'use client';
import { useState } from 'react';

type TravelType = 'flight' | 'bus' | 'train' | 'cruise';

interface BookingFormData {
  from: string;
  to: string;
  date: string;
  returnDate: string;
  passengers: number;
  classType: string;
  phone: string;
}

const POPULAR_ROUTES = {
  flight: [
    { from: 'Indore (IDR)', to: 'Mumbai (BOM)' },
    { from: 'Indore (IDR)', to: 'Delhi (DEL)' },
    { from: 'Indore (IDR)', to: 'Varanasi (VNS)' },
  ],
  bus: [
    { from: 'Indore', to: 'Bhopal' },
    { from: 'Indore', to: 'Ahmedabad' },
    { from: 'Indore', to: 'Pune' },
  ],
  train: [
    { from: 'Indore (INDB)', to: 'Delhi (NDLS)' },
    { from: 'Indore (INDB)', to: 'Mumbai (MMCT)' },
    { from: 'Indore (INDB)', to: 'Varanasi (BSB)' },
  ],
  cruise: [
    { from: 'Mumbai', to: 'Goa' },
    { from: 'Cochin', to: 'Lakshadweep' },
    { from: 'Chennai', to: 'Sri Lanka' },
  ],
};

export default function TicketBooking() {
  const [activeTab, setActiveTab] = useState<TravelType>('flight');
  const [formData, setFormData] = useState<BookingFormData>({
    from: '',
    to: '',
    date: '',
    returnDate: '',
    passengers: 1,
    classType: 'Economy',
    phone: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (key: keyof BookingFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const getWhatsAppLink = () => {
    const emojiMap = {
      flight: '✈️ Flight',
      bus: '🚌 Bus',
      train: '🚆 Train',
      cruise: '🚢 Cruise',
    };
    
    const text = `Hello Shivalay Travels! I would like to book a *${emojiMap[activeTab]} Ticket*:\n\n` +
      `📍 *From:* ${formData.from || 'Not specified'}\n` +
      `📍 *To:* ${formData.to || 'Not specified'}\n` +
      `📅 *Date:* ${formData.date || 'Not specified'}\n` +
      (formData.returnDate ? `📅 *Return Date:* ${formData.returnDate}\n` : '') +
      `👥 *Passengers:* ${formData.passengers}\n` +
      `✨ *Class:* ${formData.classType}\n\n` +
      `Please share the best available rates. Thanks!`;
      
    return `https://wa.me/919340994628?text=${encodeURIComponent(text)}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    // Automatically open WhatsApp in a new tab
    setTimeout(() => {
      window.open(getWhatsAppLink(), '_blank');
    }, 1500);
  };

  const tabs: { type: TravelType; label: string; icon: React.ReactNode }[] = [
    {
      type: 'flight',
      label: 'Flight Ticket',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 2L15 22L11 13L2 9L22 2Z" />
        </svg>
      ),
    },
    {
      type: 'bus',
      label: 'Bus Ticket',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="12" rx="2" />
          <path d="M7 16v4M17 16v4M3 8h18M5 12h2M17 12h2" />
        </svg>
      ),
    },
    {
      type: 'train',
      label: 'Train Ticket',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="3" width="16" height="14" rx="2" />
          <path d="M4 11h16M12 3v8M8 17l-3 4M16 17l3 4M7 7h2M15 7h2" />
        </svg>
      ),
    },
    {
      type: 'cruise',
      label: 'Cruise/Ship',
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 21h20M19.3 14.8C21.1 13.5 22 11.7 22 10V5l-8 3-4-2-8 3v4c0 1.7.9 3.5 2.7 4.8L12 18z" />
          <path d="M12 8v10M8 12h8" />
        </svg>
      ),
    },
  ];

  const classOptions = {
    flight: ['Economy', 'Premium Economy', 'Business Class', 'First Class'],
    bus: ['AC Sleeper (2+1)', 'Non-AC Sleeper (2+1)', 'AC Seater (2+2)', 'Luxury Volvo Multi-Axle'],
    train: ['AC 1st Class (1A)', 'AC 2 Tier (2A)', 'AC 3 Tier (3A)', 'Sleeper Class (SL)', 'Vande Bharat Chair Car (CC)'],
    cruise: ['Standard Cabin', 'Ocean View Cabin', 'Balcony Suite', 'Luxury Penthouse Suite'],
  };

  return (
    <section id="tickets" style={{ background: 'var(--color-obsidian)', padding: '80px 0', position: 'relative', overflow: 'hidden' }}>
      {/* Decorative Trident / Trishul watermark or radial red glow */}
      <div style={{ position: 'absolute', top: '10%', left: '5%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(195,0,16,0.06) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '5%', width: 450, height: 450, borderRadius: '50%', background: 'radial-gradient(circle, rgba(195,0,16,0.04) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="badge badge-dark" style={{ border: '1px solid var(--color-ember)', color: 'var(--color-orchid-flash)', background: 'rgba(195,0,16,0.1)', marginBottom: 16 }}>
            Quick Transit Solutions
          </div>
          <h2 style={{ fontFamily: 'var(--font-cosmica)', fontWeight: 700, fontSize: 'clamp(28px, 3.5vw, 42px)', color: '#fff', lineHeight: 1.2 }}>
            Instant Ticket Booking Service
          </h2>
          <p style={{ fontFamily: 'var(--font-cosmica)', fontSize: 15, color: 'var(--color-steel)', marginTop: 10, maxWidth: 580, marginInline: 'auto' }}>
            Book direct tickets for Flights, Intercity Buses, Indian Railways, and Cruises at the lowest rates with 24/7 client coordination support.
          </p>
        </div>

        {/* Booking Card Widget */}
        <div style={{ maxWidth: 840, margin: '0 auto', background: 'rgba(20,20,25,0.7)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--radius-card)', overflow: 'hidden', backdropFilter: 'blur(20px)', boxShadow: '0 24px 64px rgba(0,0,0,0.5)' }}>
          
          {/* Tabs header */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', borderBottom: '1px solid rgba(255,255,255,0.08)', background: 'rgba(10,10,12,0.5)' }}>
            {tabs.map((tab) => {
              const isActive = activeTab === tab.type;
              return (
                <button
                  key={tab.type}
                  onClick={() => {
                    setActiveTab(tab.type);
                    handleInputChange('classType', classOptions[tab.type][0]);
                  }}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '18px 12px',
                    color: isActive ? 'var(--color-orchid-flash)' : 'var(--color-steel)',
                    background: isActive ? 'rgba(195,0,16,0.05)' : 'transparent',
                    border: 'none', borderBottom: `2.5px solid ${isActive ? 'var(--color-ember)' : 'transparent'}`,
                    transition: 'all 0.25s ease', cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = '#fff'; }}
                  onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = 'var(--color-steel)'; }}
                >
                  <span style={{ transform: isActive ? 'scale(1.1) translateY(-2px)' : 'scale(1)', transition: 'transform 0.2s ease', color: isActive ? 'var(--color-ember)' : 'inherit' }}>
                    {tab.icon}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: isActive ? 600 : 500, fontFamily: 'var(--font-cosmica)', letterSpacing: '0.3px' }}>
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Form body */}
          <div style={{ padding: '36px 40px' }}>
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 1fr 1fr', gap: 20 }}>
                {/* Popular Routes */}
                <div style={{ gridColumn: 'span 4', display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: 11, color: 'var(--color-steel)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>Popular:</span>
                  {POPULAR_ROUTES[activeTab].map((route, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        handleInputChange('from', route.from);
                        handleInputChange('to', route.to);
                      }}
                      style={{
                        padding: '4px 10px', borderRadius: 6,
                        border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)',
                        fontSize: 11, color: 'var(--color-slate)', cursor: 'pointer', transition: 'all 0.2s',
                        fontFamily: 'var(--font-cosmica)', fontWeight: 500
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-ember)'; e.currentTarget.style.color = '#fff'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'var(--color-slate)'; }}
                    >
                      {route.from} ➔ {route.to}
                    </button>
                  ))}
                </div>

                {/* From */}
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--color-steel)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 8 }}>From (Source)</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      className="input-luxury"
                      placeholder="e.g. Indore, Delhi, Mumbai"
                      value={formData.from}
                      onChange={(e) => handleInputChange('from', e.target.value)}
                      required
                      style={{ background: 'rgba(0,0,0,0.4)', borderColor: 'rgba(255,255,255,0.08)', color: '#fff' }}
                    />
                  </div>
                </div>

                {/* To */}
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--color-steel)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 8 }}>To (Destination)</label>
                  <input
                    type="text"
                    className="input-luxury"
                    placeholder="e.g. Varanasi, Kedarnath, Goa, Leh"
                    value={formData.to}
                    onChange={(e) => handleInputChange('to', e.target.value)}
                    required
                    style={{ background: 'rgba(0,0,0,0.4)', borderColor: 'rgba(255,255,255,0.08)', color: '#fff' }}
                  />
                </div>

                {/* Departure Date */}
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--color-steel)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 8 }}>Departure Date</label>
                  <input
                    type="date"
                    className="input-luxury"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    required
                    style={{ background: 'rgba(0,0,0,0.4)', borderColor: 'rgba(255,255,255,0.08)', color: '#fff' }}
                  />
                </div>

                {/* Return Date */}
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--color-steel)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 8 }}>Return Date (Optional)</label>
                  <input
                    type="date"
                    className="input-luxury"
                    value={formData.returnDate}
                    onChange={(e) => handleInputChange('returnDate', e.target.value)}
                    style={{ background: 'rgba(0,0,0,0.4)', borderColor: 'rgba(255,255,255,0.08)', color: '#fff' }}
                  />
                </div>

                {/* Passengers */}
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--color-steel)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 8 }}>Passengers</label>
                  <div style={{ position: 'relative' }}>
                    <select
                      className="input-luxury"
                      value={formData.passengers}
                      onChange={(e) => handleInputChange('passengers', parseInt(e.target.value))}
                      style={{ background: 'rgba(0,0,0,0.4)', borderColor: 'rgba(255,255,255,0.08)', color: '#fff', appearance: 'none', WebkitAppearance: 'none', paddingRight: '28px' }}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <option key={num} value={num} style={{ background: '#141419', color: '#fff' }}>
                          {num} Passenger{num > 1 ? 's' : ''}
                        </option>
                      ))}
                    </select>
                    <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--color-steel)' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Travel Class */}
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--color-steel)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 8 }}>Travel Class</label>
                  <div style={{ position: 'relative' }}>
                    <select
                      className="input-luxury"
                      value={formData.classType}
                      onChange={(e) => handleInputChange('classType', e.target.value)}
                      style={{ background: 'rgba(0,0,0,0.4)', borderColor: 'rgba(255,255,255,0.08)', color: '#fff', appearance: 'none', WebkitAppearance: 'none', paddingRight: '28px' }}
                    >
                      {classOptions[activeTab].map((cls) => (
                        <option key={cls} value={cls} style={{ background: '#141419', color: '#fff' }}>
                          {cls}
                        </option>
                      ))}
                    </select>
                    <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--color-steel)' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Phone / Contact */}
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--color-steel)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 8 }}>Your Mobile / WhatsApp Number</label>
                  <input
                    type="tel"
                    className="input-luxury"
                    placeholder="e.g. +91 93409 94628"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    required
                    style={{ background: 'rgba(0,0,0,0.4)', borderColor: 'rgba(255,255,255,0.08)', color: '#fff' }}
                  />
                </div>

                {/* Submit button */}
                <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'flex-end' }}>
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ width: '100%', padding: '12px 24px', fontSize: 14, justifyContent: 'center', background: 'var(--color-ember)' }}
                  >
                    Inquire Rates & Book On WhatsApp →
                  </button>
                </div>
              </form>
            ) : (
              /* Success Redirection State */
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 20, padding: '24px 0', animation: 'scaleIn 0.5s ease both' }}>
                <div style={{
                  width: 56, height: 56, borderRadius: '50%',
                  background: 'rgba(195,0,16,0.1)', border: '2px solid var(--color-ember)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--color-ember)', animation: 'pulse 1.8s infinite'
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div>
                  <h4 style={{ fontFamily: 'var(--font-cosmica)', fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 8 }}>
                    Preparing WhatsApp Booking Request...
                  </h4>
                  <p style={{ fontFamily: 'var(--font-cosmica)', fontSize: 14, color: 'var(--color-steel)', maxWidth: 440, margin: '0 auto', lineHeight: 1.6 }}>
                    Redirection to chat with Nisha Chouhan at Shivalay Travels is starting. If it doesn't open automatically, click the button below.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                  <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ background: '#25D366', color: '#fff', border: 'none', boxShadow: 'none' }}>
                    Open WhatsApp Chat Now
                  </a>
                  <button className="btn-outline" onClick={() => setIsSubmitted(false)}>
                    Go Back
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick info footer */}
          <div style={{ background: 'rgba(10,10,12,0.4)', padding: '16px 40px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <span style={{ fontSize: 12, color: 'var(--color-steel)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: 'var(--color-ember)' }}>★</span> Lowest Agent Commission Rates
            </span>
            <span style={{ fontSize: 12, color: 'var(--color-steel)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: 'var(--color-ember)' }}>★</span> Instant PNR & Seat Selection Updates
            </span>
            <span style={{ fontSize: 12, color: 'var(--color-steel)', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ color: 'var(--color-ember)' }}>★</span> Easy Cancellations & Refunds
            </span>
          </div>
        </div>
      </div>
      
      <style>{`
        @media (max-width: 768px) {
          #tickets form {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          #tickets form > div {
            grid-column: span 1 !important;
          }
          #tickets div[style*="grid-template-columns: repeat(4"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
}
