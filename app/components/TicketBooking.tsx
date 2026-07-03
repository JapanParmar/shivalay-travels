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

const classOptions = {
  flight: ['Economy', 'Premium Economy', 'Business Class', 'First Class'],
  bus: ['AC Sleeper (2+1)', 'Non-AC Sleeper (2+1)', 'AC Seater (2+2)', 'Luxury Volvo Multi-Axle'],
  train: ['AC 1st Class (1A)', 'AC 2 Tier (2A)', 'AC 3 Tier (3A)', 'Sleeper Class (SL)', 'Vande Bharat Chair Car (CC)'],
  cruise: ['Standard Cabin', 'Ocean View Cabin', 'Balcony Suite', 'Luxury Penthouse Suite'],
};

const TABS: { type: TravelType; label: string; icon: React.ReactNode }[] = [
  {
    type: 'flight', label: 'Flights',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L15 22L11 13L2 9L22 2Z" /></svg>,
  },
  {
    type: 'bus', label: 'Buses',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M7 16v4M17 16v4M3 8h18M5 12h2M17 12h2" /></svg>,
  },
  {
    type: 'train', label: 'Trains',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="3" width="16" height="14" rx="2" /><path d="M4 11h16M12 3v8M8 17l-3 4M16 17l3 4M7 7h2M15 7h2" /></svg>,
  },
  {
    type: 'cruise', label: 'Cruises',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 21h20M19.3 14.8C21.1 13.5 22 11.7 22 10V5l-8 3-4-2-8 3v4c0 1.7.9 3.5 2.7 4.8L12 18z" /></svg>,
  },
];

export default function TicketBooking() {
  const [activeTab, setActiveTab] = useState<TravelType>('flight');
  const [formData, setFormData] = useState<BookingFormData>({
    from: '', to: '', date: '', returnDate: '', passengers: 1, classType: 'Economy', phone: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (key: keyof BookingFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const getWhatsAppLink = () => {
    const emojiMap = { flight: '✈️ Flight', bus: '🚌 Bus', train: '🚆 Train', cruise: '🚢 Cruise' };
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
    setTimeout(() => { window.open(getWhatsAppLink(), '_blank'); }, 1200);
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 10,
    fontWeight: 500,
    color: 'var(--color-steel-gray)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.6px',
    marginBottom: 6,
    fontFamily: 'var(--font-geist-mono)',
  };

  return (
    <section id="tickets" style={{ background: 'var(--surface-canvas)', padding: '48px 0', borderBottom: '1px solid var(--color-zinc-hairline)' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <p className="section-label" style={{ marginBottom: 8 }}>Quick Transit Solutions</p>
            <h2 className="heading-lg">Instant Ticket Booking</h2>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[
              { icon: '★', text: 'Lowest Rates' },
              { icon: '⚡', text: 'Instant PNR' },
              { icon: '↩', text: 'Easy Refunds' },
            ].map(item => (
              <span key={item.text} style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 12, color: 'var(--color-steel-gray)', display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', border: '1px solid var(--color-zinc-hairline)', borderRadius: 'var(--radius-full)' }}>
                <span style={{ color: 'var(--color-highlighter-lime)' }}>{item.icon}</span>
                {item.text}
              </span>
            ))}
          </div>
        </div>

        {/* Booking Card */}
        <div style={{
          background: 'var(--color-onyx-black)',
          border: '1px solid var(--color-zinc-hairline)',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
        }}>
          {/* Tabs */}
          <div className="booking-tabs-grid" style={{ borderBottom: '1px solid var(--color-zinc-hairline)' }}>
            {TABS.map((tab) => {
              const isActive = activeTab === tab.type;
              return (
                <button
                  key={tab.type}
                  onClick={() => {
                    setActiveTab(tab.type);
                    handleInputChange('classType', classOptions[tab.type][0]);
                  }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                    padding: '14px 12px',
                    color: isActive ? 'var(--color-onyx-black)' : 'var(--color-steel-gray)',
                    background: isActive ? 'var(--color-highlighter-lime)' : 'transparent',
                    border: 'none',
                    borderRight: '1px solid var(--color-zinc-hairline)',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-geist-mono)',
                    fontSize: 13,
                    fontWeight: isActive ? 500 : 400,
                  }}
                  onMouseEnter={e => { if (!isActive) { e.currentTarget.style.color = 'var(--color-pure-white)'; e.currentTarget.style.background = 'var(--color-carbon)'; } }}
                  onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color = 'var(--color-steel-gray)'; e.currentTarget.style.background = 'transparent'; } }}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Form body */}
          <div style={{ padding: '28px 28px 24px' }}>
            {!isSubmitted ? (
              <form onSubmit={handleSubmit}>
                {/* Popular routes */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center', marginBottom: 20 }}>
                  <span style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 10, color: 'var(--color-ash-gray)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 500 }}>Popular:</span>
                  {POPULAR_ROUTES[activeTab].map((route, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => { handleInputChange('from', route.from); handleInputChange('to', route.to); }}
                      style={{
                        padding: '3px 8px', borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-zinc-hairline)',
                        background: 'var(--color-carbon)',
                        fontFamily: 'var(--font-geist-mono)', fontSize: 11,
                        color: 'var(--color-steel-gray)', cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-highlighter-lime)'; e.currentTarget.style.color = 'var(--color-highlighter-lime)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-zinc-hairline)'; e.currentTarget.style.color = 'var(--color-steel-gray)'; }}
                    >
                      {route.from} → {route.to}
                    </button>
                  ))}
                </div>

                {/* Fields grid */}
                <div className="booking-grid">
                  {/* From */}
                  <div className="span-2">
                    <label style={labelStyle}>From (Source)</label>
                    <input
                      type="text"
                      className="input-terminal"
                      placeholder="e.g. Indore, Delhi, Mumbai"
                      value={formData.from}
                      onChange={e => handleInputChange('from', e.target.value)}
                      required
                    />
                  </div>

                  {/* To */}
                  <div className="span-2">
                    <label style={labelStyle}>To (Destination)</label>
                    <input
                      type="text"
                      className="input-terminal"
                      placeholder="e.g. Varanasi, Kedarnath, Goa, Leh"
                      value={formData.to}
                      onChange={e => handleInputChange('to', e.target.value)}
                      required
                    />
                  </div>

                  {/* Departure */}
                  <div>
                    <label style={labelStyle}>Departure</label>
                    <input
                      type="date"
                      className="input-terminal"
                      value={formData.date}
                      onChange={e => handleInputChange('date', e.target.value)}
                      required
                    />
                  </div>

                  {/* Return */}
                  <div>
                    <label style={labelStyle}>Return (Optional)</label>
                    <input
                      type="date"
                      className="input-terminal"
                      value={formData.returnDate}
                      onChange={e => handleInputChange('returnDate', e.target.value)}
                    />
                  </div>

                  {/* Passengers */}
                  <div>
                    <label style={labelStyle}>Passengers</label>
                    <div style={{ position: 'relative' }}>
                      <select
                        className="input-terminal"
                        value={formData.passengers}
                        onChange={e => handleInputChange('passengers', parseInt(e.target.value))}
                        style={{ appearance: 'none', WebkitAppearance: 'none', paddingRight: 28, cursor: 'pointer' }}
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                          <option key={num} value={num} style={{ background: 'var(--color-carbon)', color: 'var(--color-pure-white)' }}>
                            {num} Passenger{num > 1 ? 's' : ''}
                          </option>
                        ))}
                      </select>
                      <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--color-steel-gray)' }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </div>
                    </div>
                  </div>

                  {/* Class */}
                  <div>
                    <label style={labelStyle}>Travel Class</label>
                    <div style={{ position: 'relative' }}>
                      <select
                        className="input-terminal"
                        value={formData.classType}
                        onChange={e => handleInputChange('classType', e.target.value)}
                        style={{ appearance: 'none', WebkitAppearance: 'none', paddingRight: 28, cursor: 'pointer' }}
                      >
                        {classOptions[activeTab].map(cls => (
                          <option key={cls} value={cls} style={{ background: 'var(--color-carbon)', color: 'var(--color-pure-white)' }}>{cls}</option>
                        ))}
                      </select>
                      <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--color-steel-gray)' }}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </div>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="span-2">
                    <label style={labelStyle}>Mobile / WhatsApp Number</label>
                    <input
                      type="tel"
                      className="input-terminal"
                      placeholder="+91 93409 94628"
                      value={formData.phone}
                      onChange={e => handleInputChange('phone', e.target.value)}
                      required
                    />
                  </div>

                  {/* Submit */}
                  <div className="span-2">
                    <button
                      type="submit"
                      className="btn-primary"
                      style={{ width: '100%', padding: '11px 24px', fontSize: 14, justifyContent: 'center' }}
                    >
                      Inquire Rates &amp; Book On WhatsApp →
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              /* Success State */
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 20, padding: '32px 0', animation: 'scaleIn 0.4s ease both' }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 'var(--radius-md)',
                  background: 'var(--color-highlighter-lime)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--color-onyx-black)',
                }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div>
                  <h4 style={{ fontFamily: 'var(--font-tomorrow)', fontSize: 20, fontWeight: 400, color: 'var(--color-pure-white)', marginBottom: 8 }}>
                    Preparing WhatsApp Booking Request...
                  </h4>
                  <p style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 13, color: 'var(--color-steel-gray)', maxWidth: 420, margin: '0 auto', lineHeight: 1.6 }}>
                    Redirecting to Shivalay Travels on WhatsApp. If it doesn&apos;t open, use the button below.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="btn-primary">
                    Open WhatsApp Chat
                  </a>
                  <button className="btn-ghost" onClick={() => setIsSubmitted(false)}>
                    Go Back
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
