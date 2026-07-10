'use client';
import { useState, useEffect } from 'react';

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
    { from: 'Indore (IND)', to: 'Bhopal (BPL)' },
    { from: 'Indore (IND)', to: 'Ahmedabad (AMD)' },
    { from: 'Indore (IND)', to: 'Pune (PUN)' },
  ],
  train: [
    { from: 'Indore (INDB)', to: 'Delhi (NDLS)' },
    { from: 'Indore (INDB)', to: 'Mumbai (MMCT)' },
    { from: 'Indore (INDB)', to: 'Varanasi (BSB)' },
  ],
  cruise: [
    { from: 'Mumbai (BOM)', to: 'Goa (GOI)' },
    { from: 'Cochin (COK)', to: 'Lakshadweep (LKD)' },
    { from: 'Chennai (MAA)', to: 'Sri Lanka (CMB)' },
  ],
};

const classOptions = {
  flight: ['Economy', 'Premium', 'Business', 'First Class'],
  bus: ['AC Sleeper', 'Non-AC Sleeper', 'AC Seater', 'Luxury Volvo'],
  train: ['AC 1st Class', 'AC 2 Tier', 'AC 3 Tier', 'Sleeper Class', 'Vande Bharat CC'],
  cruise: ['Standard Cabin', 'Ocean View', 'Balcony Suite', 'Luxury Penthouse'],
};



const TABS: { type: TravelType; label: string; icon: React.ReactNode }[] = [
  {
    type: 'flight',
    label: 'Flights',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L15 22L11 13L2 9L22 2Z" /></svg>,
  },
  {
    type: 'train',
    label: 'Trains',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="3" width="16" height="14" rx="2" /><path d="M4 11h16M12 3v8M8 17l-3 4M16 17l3 4M7 7h2M15 7h2" /></svg>,
  },
  {
    type: 'bus',
    label: 'Buses',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M7 16v4M17 16v4M3 8h18M5 12h2M17 12h2" /></svg>,
  },
  {
    type: 'cruise',
    label: 'Cruises',
    icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 21h20M19.3 14.8C21.1 13.5 22 11.7 22 10V5l-8 3-4-2-8 3v4c0 1.7.9 3.5 2.7 4.8L12 18z" /></svg>,
  },
];

const RECENT_SEARCHES = {
  flight: [
    { from: 'Indore (IDR)', to: 'Mumbai (BOM)', price: '₹4,200', desc: '1 Passenger • Economy' },
    { from: 'Indore (IDR)', to: 'Delhi (DEL)', price: '₹3,800', desc: '2 Passengers • Economy' },
  ],
  train: [
    { from: 'Indore (INDB)', to: 'Delhi (NDLS)', price: '₹1,400', desc: '1 Passenger • AC 3 Tier' },
    { from: 'Indore (INDB)', to: 'Mumbai (MMCT)', price: '₹1,800', desc: '1 Passenger • AC 2 Tier' },
  ],
  bus: [
    { from: 'Indore (IND)', to: 'Bhopal (BPL)', price: '₹450', desc: '1 Passenger • AC Sleeper' },
    { from: 'Indore (IND)', to: 'Ahmedabad (AMD)', price: '₹1,200', desc: '2 Passengers • Luxury Volvo' },
  ],
  cruise: [
    { from: 'Mumbai (BOM)', to: 'Goa (GOI)', price: '₹12,500', desc: '2 Passengers • Balcony Suite' },
    { from: 'Cochin (COK)', to: 'Lakshadweep (LKD)', price: '₹22,000', desc: '2 Passengers • Ocean View' },
  ],
};

export default function TicketBooking({ settings }: { settings?: any }) {
  const [activeTab, setActiveTab] = useState<TravelType>('flight');
  const [isRoundTrip, setIsRoundTrip] = useState(true);
  const [formData, setFormData] = useState<BookingFormData>({
    from: '', to: '', date: '', returnDate: '', passengers: 1, classType: 'Economy', phone: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [citiesFrom, setCitiesFrom] = useState<any[]>([]);
  const [citiesTo, setCitiesTo] = useState<any[]>([]);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [cityApiSetting, setCityApiSetting] = useState<string>('open_meteo');

  const [captchaSvg, setCaptchaSvg] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaError, setCaptchaError] = useState('');

  const fetchCaptcha = async () => {
    try {
      const res = await fetch('/api/captcha');
      if (res.ok) {
        const data = await res.json();
        setCaptchaSvg(data.svg);
        setCaptchaToken(data.token);
        setCaptchaInput('');
        setCaptchaError('');
      }
    } catch (err) {
      console.error('Failed to fetch CAPTCHA', err);
    }
  };

  useEffect(() => {
    fetchCaptcha();
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        if (data && data.cityApi) {
          setCityApiSetting(data.cityApi);
        }
      })
      .catch(err => console.error('Failed to fetch settings', err));
  }, []);

  const fetchCities = async (query: string): Promise<any[]> => {
    if (!query || query.length < 2) return [];

    let dbCities: any[] = [];
    try {
      // 1. Fetch from our dynamic admin cities catalog API
      const res = await fetch(`/api/admin/cities`);
      if (res.ok) {
        dbCities = await res.json();
      }
    } catch (err) {
      console.error('Error fetching admin cities', err);
    }

    const matches = dbCities.filter((c: any) => 
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.code.toLowerCase().includes(query.toLowerCase()) ||
      c.state.toLowerCase().includes(query.toLowerCase())
    );

    // If set to local, only merge local DB results and fallback local cities
    if (cityApiSetting === 'local') {
      const fallbackCities = [
        { name: 'Indore', code: 'IDR', state: 'Madhya Pradesh', country: 'India' },
        { name: 'Mumbai', code: 'BOM', state: 'Maharashtra', country: 'India' },
        { name: 'Delhi', code: 'DEL', state: 'Delhi', country: 'India' },
        { name: 'Bangalore', code: 'BLR', state: 'Karnataka', country: 'India' },
        { name: 'Goa', code: 'GOI', state: 'Goa', country: 'India' }
      ];
      
      const staticMatches = fallbackCities.filter(c => 
        c.name.toLowerCase().includes(query.toLowerCase()) || 
        c.code.toLowerCase().includes(query.toLowerCase())
      );

      const merged = matches.map((c: any) => ({
        name: c.name,
        code: c.code,
        state: c.state,
        country: c.country
      }));

      for (const sm of staticMatches) {
        if (!merged.find(m => m.name.toLowerCase() === sm.name.toLowerCase())) {
          merged.push(sm);
        }
      }
      return merged;
    }

    // Otherwise, try external Open-Meteo search if there are too few database matches
    if (matches.length >= 3) {
      return matches.map((c: any) => ({
        name: c.name,
        code: c.code,
        state: c.state,
        country: c.country
      }));
    }

    // 2. Supplementary geocoding lookup using free Open-Meteo Geocoding API
    try {
      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=6&language=en&format=json`
      );
      if (response.ok) {
        const data = await response.json();
        return (data.results || [])
          .filter((r: any) => r.country_code === 'IN' || r.country === 'India')
          .map((r: any) => ({
            name: r.name,
            code: r.name.slice(0, 3).toUpperCase(),
            state: r.admin1 || '',
            country: r.country || 'India'
          }));
      }
    } catch (err) {
      console.error('External geocoding API failed', err);
    }
    
    // 3. Fallback static list
    const fallbackCities = [
      { name: 'Indore', code: 'IDR', state: 'Madhya Pradesh', country: 'India' },
      { name: 'Mumbai', code: 'BOM', state: 'Maharashtra', country: 'India' },
      { name: 'Delhi', code: 'DEL', state: 'Delhi', country: 'India' },
      { name: 'Bangalore', code: 'BLR', state: 'Karnataka', country: 'India' },
      { name: 'Goa', code: 'GOI', state: 'Goa', country: 'India' }
    ];
    return fallbackCities.filter(c => 
      c.name.toLowerCase().includes(query.toLowerCase()) || 
      c.code.toLowerCase().includes(query.toLowerCase())
    );
  };

  useEffect(() => {
    // Strip parenthetical codes from search query to avoid infinite loop matching
    const cleanSearch = formData.from.replace(/\s*\([^)]*\)/g, '').trim();
    if (cleanSearch.length >= 2) {
      fetchCities(cleanSearch).then(list => setCitiesFrom(list));
    } else {
      setCitiesFrom([]);
    }
  }, [formData.from, cityApiSetting]);

  useEffect(() => {
    const cleanSearch = formData.to.replace(/\s*\([^)]*\)/g, '').trim();
    if (cleanSearch.length >= 2) {
      fetchCities(cleanSearch).then(list => setCitiesTo(list));
    } else {
      setCitiesTo([]);
    }
  }, [formData.to, cityApiSetting]);

  const handleInputChange = (key: keyof BookingFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSwap = () => {
    setFormData((prev) => ({
      ...prev,
      from: prev.to,
      to: prev.from,
    }));
  };

  const getCityCode = (cityName: string, fallback: string) => {
    if (!cityName) return fallback;
    const match = cityName.match(/\(([^)]+)\)/);
    if (match) return match[1].toUpperCase();
    return cityName.slice(0, 3).toUpperCase();
  };

  const handleRecentClick = (search: { from: string; to: string; desc: string }) => {
    const paxMatch = search.desc.match(/^(\d+)/);
    const classMatch = search.desc.match(/•\s*(.*)$/);
    setFormData(prev => ({
      ...prev,
      from: search.from,
      to: search.to,
      passengers: paxMatch ? parseInt(paxMatch[1]) : 1,
      classType: classMatch ? classMatch[1].trim() : 'Economy',
    }));
  };

  const getSubmitButtonText = () => {
    const verbMap = { flight: 'Flights', bus: 'Buses', train: 'Trains', cruise: 'Cruises' };
    return `SEARCH ${verbMap[activeTab].toUpperCase()}`;
  };

  const getWhatsAppLink = () => {
    const emojiMap = { flight: '✈️ Flight', bus: '🚌 Bus', train: '🚆 Train', cruise: '🚢 Cruise' };
    const text = `Hello ${settings?.businessName || 'Shivalay Travels'}! I would like to book a *${emojiMap[activeTab]} Ticket*:\n\n` +
      `📍 *From:* ${formData.from || 'Not specified'}\n` +
      `📍 *To:* ${formData.to || 'Not specified'}\n` +
      `📅 *Departure:* ${formData.date || 'Not specified'}\n` +
      (isRoundTrip && formData.returnDate ? `📅 *Return:* ${formData.returnDate}\n` : '') +
      `👥 *Passengers:* ${formData.passengers}\n` +
      `✨ *Class:* ${formData.classType}\n\n` +
      `Please share the best available rates. Thanks!`;
    const waNumber = settings?.whatsapp || '919340994628';
    return `https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCaptchaError('');

    // Default amount to 0 when booking from the main page. The admin side will set the actual price.
    const computedAmount = 0;

    try {
      const response = await fetch('/api/admin/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: 'Guest Traveller',
          customerPhone: formData.phone,
          fromCity: formData.from,
          toCity: formData.to,
          travelType: activeTab,
          date: formData.date,
          returnDate: formData.returnDate || null,
          passengers: formData.passengers,
          classType: formData.classType,
          amount: computedAmount,
          status: 'pending',
          notes: `Web Inquiry from ${formData.phone}`,
          isPublicInquiry: true,
          captchaToken,
          captchaInput,
        })
      });

      if (!response.ok) {
        const data = await response.json();
        setCaptchaError(data.error || 'CAPTCHA validation failed.');
        fetchCaptcha();
        return;
      }

      setIsSubmitted(true);
      setTimeout(() => { window.open(getWhatsAppLink(), '_blank'); }, 1200);
    } catch (err) {
      console.error('Failed to log booking in DB', err);
      setCaptchaError('Network error. Please try again.');
    }
  };

  return (
    <section id="tickets" style={{ background: 'var(--surface-canvas)', padding: 'var(--spacing-48) 0', borderBottom: '1px solid var(--color-zinc-hairline)' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 'var(--spacing-24)', flexWrap: 'wrap', gap: 'var(--spacing-16)' }}>
          <div>
            <p className="section-label" style={{ marginBottom: 'var(--spacing-8)' }}>Quick Transit Solutions</p>
            <h2 className="heading-lg">Instant Ticket Booking</h2>
          </div>
          <div className="desktop-features" style={{ display: 'flex', gap: 'var(--spacing-8)', flexWrap: 'wrap' }}>
            {[
              { icon: '★', text: 'Lowest Rates' },
              { icon: '⚡', text: 'Instant PNR' },
              { icon: '↩', text: 'Easy Refunds' },
            ].map(item => (
              <span key={item.text} className="font-primary text-sm" style={{ color: 'var(--color-steel-gray)', display: 'flex', alignItems: 'center', gap: 6, padding: '5px 14px', border: '1px solid var(--color-zinc-hairline)', borderRadius: 'var(--radius-full)', background: 'rgba(255, 255, 255, 0.01)' }}>
                <span style={{ color: 'var(--color-highlighter-lime)' }}>{item.icon}</span>
                {item.text}
              </span>
            ))}
          </div>
        </div>

        {/* TRAVEL GO Style Core Container */}
        <div className="travelgo-container">
          {/* Main Card */}
          <div className="travelgo-card">
            {/* 1. Header with Tabs */}
            <div className="travelgo-card-header">
              <h3 className="travelgo-card-title">Book Your Journey</h3>
              
              <div className="travelgo-tabs-grid">
                {TABS.map((tab) => {
                  const isActive = activeTab === tab.type;
                  return (
                    <button
                      key={tab.type}
                      type="button"
                      onClick={() => {
                        setActiveTab(tab.type);
                        handleInputChange('classType', classOptions[tab.type][0]);
                      }}
                      className={`travelgo-tab-btn ${isActive ? 'active' : ''}`}
                    >
                      {tab.icon}
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Form Inner Content */}
            <div style={{ padding: 'var(--spacing-24)' }}>
              {!isSubmitted ? (
                <form onSubmit={handleSubmit}>
                  {/* 2. Trip Type Switcher */}
                  <div className="travelgo-toggles">
                    <span className="toggles-label">Trip Type</span>
                    <div className="toggles-row">
                      <button
                        type="button"
                        onClick={() => setIsRoundTrip(true)}
                        className={`toggle-pill ${isRoundTrip ? 'active' : ''}`}
                      >
                        Round Trip
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsRoundTrip(false)}
                        className={`toggle-pill ${!isRoundTrip ? 'active' : ''}`}
                      >
                        One Way
                      </button>
                      <button
                        type="button"
                        className="toggle-pill disabled-pill"
                        disabled
                      >
                        Multi-City
                      </button>
                    </div>
                  </div>

                  {/* 3. Fields Layout */}
                  <div className="travelgo-form-grid">
                    {/* Row 1: From & To */}
                    <div className="span-4 route-inputs-wrapper">
                      {/* From field */}
                      <div className="travelgo-field-group">
                        <label className="input-box-label">From</label>
                        <div className="travelgo-input-box">
                          <span className="input-box-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                              <circle cx="12" cy="10" r="3" />
                            </svg>
                          </span>
                          <input
                            type="text"
                            className="input-box-field"
                            placeholder="Departure Station / City"
                            value={formData.from}
                            onChange={e => handleInputChange('from', e.target.value)}
                            onFocus={() => setShowFromDropdown(true)}
                            onBlur={() => setTimeout(() => setShowFromDropdown(false), 250)}
                            autoComplete="off"
                            required
                          />
                          <span className="input-box-code">{getCityCode(formData.from, 'IND')}</span>
                        </div>
                        {showFromDropdown && citiesFrom.length > 0 && (
                          <div className="autocomplete-dropdown">
                            {citiesFrom.map((c, idx) => (
                              <div
                                key={idx}
                                className="autocomplete-item"
                                onMouseDown={() => {
                                  handleInputChange('from', `${c.name} (${c.code})`);
                                  setShowFromDropdown(false);
                                }}
                              >
                                <div className="autocomplete-item-name">{c.name} ({c.code})</div>
                                <div className="autocomplete-item-sub">{c.state}, {c.country}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Interactive Swap Button */}
                      <button
                        type="button"
                        onClick={handleSwap}
                        className="travelgo-swap-btn"
                        title="Swap Destinations"
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 17H4M4 17l4 4M4 17l4-4M4 7h16M20 7l-4-4M20 7l-4 4" />
                        </svg>
                      </button>

                      {/* To field */}
                      <div className="travelgo-field-group">
                        <label className="input-box-label">To</label>
                        <div className="travelgo-input-box">
                          <span className="input-box-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                              <circle cx="12" cy="10" r="3" />
                            </svg>
                          </span>
                          <input
                            type="text"
                            className="input-box-field"
                            placeholder="Arrival Station / City"
                            value={formData.to}
                            onChange={e => handleInputChange('to', e.target.value)}
                            onFocus={() => setShowToDropdown(true)}
                            onBlur={() => setTimeout(() => setShowToDropdown(false), 250)}
                            autoComplete="off"
                            required
                          />
                          <span className="input-box-code">{getCityCode(formData.to, 'BOM')}</span>
                        </div>
                        {showToDropdown && citiesTo.length > 0 && (
                          <div className="autocomplete-dropdown">
                            {citiesTo.map((c, idx) => (
                              <div
                                key={idx}
                                className="autocomplete-item"
                                onMouseDown={() => {
                                  handleInputChange('to', `${c.name} (${c.code})`);
                                  setShowToDropdown(false);
                                }}
                              >
                                <div className="autocomplete-item-name">{c.name} ({c.code})</div>
                                <div className="autocomplete-item-sub">{c.state}, {c.country}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Row 2: Date, Return, Travelers & Class */}
                    {/* Departure Date */}
                    <div className="travelgo-field-group span-1-tablet">
                      <label className="input-box-label">Departure Date</label>
                      <div className="travelgo-input-box">
                        <span className="input-box-icon">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                        </span>
                        <input
                          type="date"
                          className="input-box-field"
                          value={formData.date}
                          onChange={e => handleInputChange('date', e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    {/* Return Date */}
                    <div className={`travelgo-field-group span-1-tablet ${!isRoundTrip ? 'disabled' : ''}`}>
                      <label className="input-box-label">Return Date</label>
                      <div className="travelgo-input-box">
                        <span className="input-box-icon">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                        </span>
                        <input
                          type="date"
                          className="input-box-field"
                          disabled={!isRoundTrip}
                          value={isRoundTrip ? formData.returnDate : ''}
                          onChange={e => handleInputChange('returnDate', e.target.value)}
                          required={isRoundTrip}
                        />
                      </div>
                    </div>

                    {/* Combined Travelers & Class */}
                    <div className="travelgo-field-group span-2">
                      <label className="input-box-label">Travelers &amp; Class</label>
                      <div className="travelgo-input-box">
                        <span className="input-box-icon">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg>
                        </span>
                        <div style={{ display: 'flex', gap: 'var(--spacing-8)', width: '100%', alignItems: 'center' }}>
                          <select
                            className="input-box-select"
                            value={formData.passengers}
                            onChange={e => handleInputChange('passengers', parseInt(e.target.value))}
                          >
                            {[1, 2, 3, 4, 5, 6, 8, 10].map(n => (
                              <option key={n} value={n} style={{ background: 'var(--color-carbon)', color: '#fff' }}>{n} Traveler{n > 1 ? 's' : ''}</option>
                            ))}
                          </select>
                          <div style={{ width: 1, height: '20px', background: 'rgba(255,255,255,0.08)' }} />
                          <select
                            className="input-box-select"
                            value={formData.classType}
                            onChange={e => handleInputChange('classType', e.target.value)}
                          >
                            {classOptions[activeTab].map(c => (
                              <option key={c} value={c} style={{ background: 'var(--color-carbon)', color: '#fff' }}>{c}</option>
                            ))}
                          </select>
                        </div>
                        <span className="booking-select-arrow" style={{ right: 'var(--spacing-16)' }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M6 9l6 6 6-6" /></svg>
                        </span>
                      </div>
                    </div>

                    {/* Contact Phone & Info Panel */}
                    <div className="travelgo-field-group span-2">
                      <label className="input-box-label">WhatsApp Contact Number</label>
                      <div className="travelgo-input-box">
                        <span className="input-box-icon">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                        </span>
                        <input
                          type="tel"
                          className="input-box-field"
                          placeholder="e.g. +91 93409 94628"
                          value={formData.phone}
                          onChange={e => handleInputChange('phone', e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="travelgo-info-radar span-2" style={{ alignSelf: 'end' }}>
                      <span className="radar-ping" />
                      <p className="font-primary text-xs text-muted" style={{ margin: 0, lineHeight: 1.4 }}>
                        <strong>Live Radar Search:</strong> Direct API lookup to Indian state transport links and flight booking platforms.
                      </p>
                    </div>

                    {/* Captcha Verification */}
                    <div className="span-2" style={{ marginTop: 'var(--spacing-8)' }}>
                      <label className="input-box-label" style={{ display: 'block', marginBottom: 8 }}>
                        Security Verification (CAPTCHA)
                      </label>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'auto 1fr',
                        alignItems: 'center',
                        gap: 16,
                        background: 'rgba(255, 255, 255, 0.01)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        borderRadius: 'var(--radius-md)',
                        padding: 12,
                        width: '100%',
                      }}>
                        {/* Captcha Image & Refresh Button */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          {captchaSvg ? (
                            <div 
                              dangerouslySetInnerHTML={{ __html: captchaSvg }}
                              style={{ display: 'flex', alignItems: 'center', borderRadius: 4, overflow: 'hidden' }}
                            />
                          ) : (
                            <div style={{ width: 140, height: 44, background: '#121212', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#666' }}>
                              Loading...
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={fetchCaptcha}
                            style={{
                              background: 'rgba(255,255,255,0.05)',
                              border: '1px solid rgba(255,255,255,0.08)',
                              color: '#fff',
                              borderRadius: 6,
                              width: 38,
                              height: 38,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                            }}
                            title="Refresh CAPTCHA"
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                          >
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--color-steel-gray)' }}>
                              <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                            </svg>
                          </button>
                        </div>
                        
                        {/* Captcha Input */}
                        <div style={{ position: 'relative' }}>
                          <input
                            type="text"
                            placeholder="Enter verification code"
                            value={captchaInput}
                            onChange={e => setCaptchaInput(e.target.value)}
                            required
                            style={{
                              width: '100%',
                              height: 38,
                              background: 'rgba(255,255,255,0.02)',
                              border: '1px solid rgba(255,255,255,0.08)',
                              borderRadius: 6,
                              padding: '0 12px',
                              color: '#fff',
                              fontFamily: 'monospace',
                              letterSpacing: 2,
                              fontSize: 14,
                              outline: 'none',
                              transition: 'all 0.2s'
                            }}
                            onFocus={e => e.currentTarget.style.borderColor = 'var(--color-highlighter-lime)'}
                            onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
                          />
                        </div>
                      </div>
                      {captchaError && (
                        <p style={{ color: '#ff4444', fontSize: 12, marginTop: 6, marginBottom: 0, fontWeight: 500 }}>
                          ⚠️ {captchaError}
                        </p>
                      )}
                    </div>

                    {/* Action container on side of CAPTCHA */}
                    <div className="span-2" style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 'var(--spacing-8)', justifyContent: 'flex-end' }}>
                      {/* Direct Booking Note */}
                      <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: 10, padding: '10px 14px', gap: 8,
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 16 }}>📲</span>
                          <div>
                            <div style={{ fontSize: 11, fontWeight: 600, color: '#fff', fontFamily: 'DM Sans, sans-serif' }}>
                              Direct Agent Booking
                            </div>
                            <div style={{ fontSize: 10, color: '#666', fontFamily: 'DM Sans, sans-serif' }}>
                              No prepayment required. Rates verified by agents.
                            </div>
                          </div>
                        </div>
                        <div style={{ fontSize: 9, color: 'var(--color-highlighter-lime)', textAlign: 'right', maxWidth: 140, lineHeight: 1.3 }}>
                          ⚡ Instant inquiry logged directly
                        </div>
                      </div>

                      {/* Search Button */}
                      <button
                        type="submit"
                        className="travelgo-search-btn"
                        style={{ margin: 0, height: 44 }}
                      >
                        {getSubmitButtonText()}
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                /* Boarding pass receipt */
                <div style={{ animation: 'scaleIn 0.4s ease both', padding: '12px 0', textAlign: 'center' }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: '50%',
                    background: 'var(--color-highlighter-lime)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--color-onyx-black)', margin: '0 auto 16px',
                    boxShadow: '0 0 16px rgba(255, 0, 0, 0.3)',
                  }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>

                  <div>
                    <h4 className="font-secondary fs-20 fw-regular" style={{ color: 'var(--color-pure-white)', marginBottom: 8 }}>
                      Booking Request Prepared
                    </h4>
                    <p className="font-primary text-sm text-muted" style={{ maxWidth: 420, margin: '0 auto 24px' }}>
                      Redirecting to Shivalay Travels on WhatsApp to secure live rates and check berth availability.
                    </p>
                  </div>

                  <div className="boarding-pass-visual">
                    <div className="boarding-pass-header">
                      <span>BOARDING INQUIRY</span>
                      <span style={{ color: 'var(--color-highlighter-lime)', fontWeight: 500 }}>SHIVALAY TRAVELS</span>
                    </div>
                    <div className="boarding-pass-body">
                      <div className="pass-row">
                        <div>
                          <label>FROM</label>
                          <div className="pass-val">{getCityCode(formData.from, 'IND')}</div>
                        </div>
                        <div className="pass-arrow">➔</div>
                        <div>
                          <label>TO</label>
                          <div className="pass-val">{getCityCode(formData.to, 'BOM')}</div>
                        </div>
                      </div>
                      <div className="pass-divider" />
                      <div className="pass-details">
                        <div>
                          <label>DEPARTURE</label>
                          <div className="pass-sub-val">{formData.date || 'Pending'}</div>
                        </div>
                        <div>
                          <label>CLASS</label>
                          <div className="pass-sub-val">{formData.classType}</div>
                        </div>
                        <div>
                          <label>TRAVELERS</label>
                          <div className="pass-sub-val">{formData.passengers} PAX</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 28 }}>
                    <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ textDecoration: 'none' }}>
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

          {/* 5. Additional Columns: Recent Searches & Popular Deal Suggestions */}
          {!isSubmitted && (
            <div className="travelgo-side-grid">
              {/* Recent Searches */}
              <div className="side-column">
                <h4 className="side-column-title">Recent Searches</h4>
                <div className="recent-searches-list">
                  {RECENT_SEARCHES[activeTab].map((search, idx) => (
                    <div
                      key={idx}
                      className="recent-search-card"
                      onClick={() => handleRecentClick(search)}
                      title="Click to auto-fill form"
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-8)' }}>
                        <span className="search-card-icon">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                        </span>
                        <div>
                          <p className="search-card-route">{getCityCode(search.from, '')} ➔ {getCityCode(search.to, '')}</p>
                          <p className="search-card-meta">{search.desc}</p>
                        </div>
                      </div>
                      <span className="search-card-price">{search.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggestions */}
              <div className="side-column">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 className="side-column-title">Explore Destinations</h4>
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-highlighter-lime)', cursor: 'pointer', fontFamily: 'var(--font-primary)' }}>See all</span>
                </div>
                <div className="deal-suggestions-list">
                  {POPULAR_ROUTES[activeTab].map((route, idx) => (
                    <div
                      key={idx}
                      className="deal-suggestion-card"
                      onClick={() => { handleInputChange('from', route.from); handleInputChange('to', route.to); }}
                    >
                      <div className="deal-img-placeholder">
                        <span>🇮🇳</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <p className="deal-title">{route.from} to {route.to}</p>
                        <p className="deal-desc">Instant booking available</p>
                      </div>
                      <span className="deal-arrow">➔</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Styles for precise layout & matching theme tokens */}
      <style>{`
        .travelgo-container {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-24);
        }
        .travelgo-card {
          background: rgba(18, 18, 18, 0.4);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: var(--radius-xl);
          box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.8), 0 0 100px -30px rgba(255, 0, 0, 0.02);
          overflow: hidden;
        }
        .travelgo-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--spacing-24) var(--spacing-24) 0;
          gap: var(--spacing-16);
          flex-wrap: wrap;
        }
        .travelgo-card-title {
          font-family: var(--font-secondary);
          font-size: var(--text-subheading);
          font-weight: var(--font-weight-bold);
          color: var(--color-pure-white);
          margin: 0;
        }
        .travelgo-tabs-grid {
          display: flex;
          gap: var(--spacing-8);
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          padding: 4px;
          border-radius: var(--radius-full);
        }
        .travelgo-tab-btn {
          display: flex;
          align-items: center;
          gap: var(--spacing-8);
          padding: 8px 16px;
          border-radius: var(--radius-full);
          background: transparent;
          border: none;
          color: var(--color-steel-gray);
          font-family: var(--font-primary);
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-medium);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .travelgo-tab-btn.active {
          background: var(--color-highlighter-lime);
          color: var(--color-onyx-black);
          box-shadow: 0 4px 12px rgba(255, 0, 0, 0.2);
          font-weight: var(--font-weight-semibold);
        }
        .travelgo-tab-btn:hover:not(.active) {
          color: var(--color-pure-white);
          background: rgba(255, 255, 255, 0.04);
        }
        .travelgo-toggles {
          display: flex;
          align-items: center;
          gap: var(--spacing-16);
          margin-bottom: var(--spacing-24);
        }
        .toggles-label {
          font-family: var(--font-geist-mono);
          font-size: var(--font-size-xs);
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--color-ash-gray);
          font-weight: var(--font-weight-semibold);
        }
        .toggles-row {
          display: flex;
          gap: var(--spacing-8);
        }
        .toggle-pill {
          padding: 6px 14px;
          border-radius: var(--radius-full);
          border: 1px solid rgba(255, 255, 255, 0.05);
          background: rgba(255, 255, 255, 0.02);
          color: var(--color-steel-gray);
          font-family: var(--font-primary);
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-medium);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .toggle-pill.active {
          border-color: rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.06);
          color: var(--color-pure-white);
        }
        .disabled-pill {
          opacity: 0.35;
          cursor: not-allowed;
        }
        .travelgo-form-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--spacing-24);
        }
        .travelgo-form-grid > .span-4 {
          grid-column: span 4;
        }
        .travelgo-form-grid > .span-2 {
          grid-column: span 2;
        }
        .travelgo-field-group {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-8);
        }
        .route-inputs-wrapper {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-24);
          position: relative;
        }
        .travelgo-swap-btn {
          position: absolute;
          bottom: 12px;
          left: 50%;
          transform: translate(-50%, 0);
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #121212;
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: var(--color-highlighter-lime);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.25s ease;
          z-index: 10;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
        }
        .travelgo-swap-btn:hover {
          background: var(--color-highlighter-lime);
          color: var(--color-onyx-black);
          border-color: var(--color-highlighter-lime);
          box-shadow: 0 0 12px rgba(255, 0, 0, 0.3);
        }
        .travelgo-input-box {
          position: relative;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: var(--radius-md);
          padding: 0 var(--spacing-16) 0 40px;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          height: 48px;
        }
        .travelgo-input-box:hover {
          border-color: rgba(255, 255, 255, 0.15);
          background: rgba(255, 255, 255, 0.04);
        }
        .travelgo-input-box:focus-within {
          border-color: var(--color-highlighter-lime);
          box-shadow: 0 0 8px rgba(255, 0, 0, 0.1);
          background: rgba(255, 255, 255, 0.04);
        }
        .travelgo-field-group.disabled {
          opacity: 0.35;
          pointer-events: none;
        }
        .input-box-icon {
          position: absolute;
          left: var(--spacing-16);
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-steel-gray);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.2s ease;
        }
        .travelgo-input-box:focus-within .input-box-icon {
          color: var(--color-highlighter-lime);
        }
        .input-box-label {
          font-family: var(--font-primary);
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-medium);
          color: var(--color-steel-gray);
        }
        .input-box-field {
          background: transparent;
          border: none;
          outline: none;
          color: var(--color-pure-white);
          font-family: var(--font-primary);
          font-size: var(--font-size-md);
          font-weight: var(--font-weight-medium);
          width: 100%;
          padding: 0;
          height: 100%;
        }
        .input-box-field::placeholder {
          color: rgba(255, 255, 255, 0.2);
        }
        .input-box-field[type="date"] {
          color-scheme: dark;
        }
        .input-box-code {
          font-family: var(--font-geist-mono);
          font-size: var(--font-size-xs);
          color: var(--color-steel-gray);
          font-weight: var(--font-weight-bold);
          margin-left: var(--spacing-8);
          text-transform: uppercase;
        }
        .input-box-select {
          background: transparent;
          border: none;
          outline: none;
          color: var(--color-pure-white);
          font-family: var(--font-primary);
          font-size: var(--font-size-md);
          font-weight: var(--font-weight-medium);
          width: 100%;
          cursor: pointer;
          appearance: none;
          -webkit-appearance: none;
          height: 100%;
        }
        .booking-select-arrow {
          position: absolute;
          right: var(--spacing-16);
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
          color: var(--color-steel-gray);
          display: flex;
          align-items: center;
        }
        .travelgo-info-radar {
          background: rgba(255, 0, 0, 0.01);
          border: 1px dashed rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-md);
          padding: var(--spacing-8) var(--spacing-16);
          display: flex;
          align-items: center;
          gap: var(--spacing-16);
          height: 48px;
          position: relative;
        }
        .radar-ping {
          width: 6px;
          height: 6px;
          background: var(--color-highlighter-lime);
          border-radius: 50%;
          flex-shrink: 0;
          box-shadow: 0 0 8px var(--color-highlighter-lime);
          animation: radar-ping 1.5s infinite ease-out;
        }
        @keyframes radar-ping {
          0% { transform: scale(0.9); opacity: 1; }
          100% { transform: scale(3.5); opacity: 0; }
        }
        .travelgo-search-btn {
          background: linear-gradient(90deg, var(--color-highlighter-lime) 0%, #ff5252 100%);
          color: var(--color-onyx-black);
          font-family: var(--font-secondary);
          font-weight: var(--font-weight-bold);
          font-size: var(--font-size-md);
          letter-spacing: 1px;
          padding: 16px var(--spacing-24);
          border-radius: var(--radius-md);
          border: none;
          cursor: pointer;
          width: 100%;
          transition: all 0.25s ease;
          box-shadow: 0 6px 20px rgba(255, 0, 0, 0.15);
        }
        .travelgo-search-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 30px rgba(255, 0, 0, 0.3);
        }
        .travelgo-side-grid {
          display: grid;
          grid-template-columns: 1.5fr 2.5fr;
          gap: var(--spacing-24);
        }
        .side-column {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-16);
        }
        .side-column-title {
          font-family: var(--font-secondary);
          font-size: var(--font-size-md);
          font-weight: var(--font-weight-semibold);
          color: var(--color-pure-white);
          margin: 0;
        }
        .recent-searches-list, .deal-suggestions-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-8);
        }
        .recent-search-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: var(--radius-md);
          padding: 12px var(--spacing-16);
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .recent-search-card:hover {
          border-color: rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.04);
        }
        .search-card-icon {
          color: var(--color-steel-gray);
          display: flex;
          align-items: center;
        }
        .search-card-route {
          font-family: var(--font-secondary);
          font-size: var(--font-size-sm);
          color: var(--color-pure-white);
          margin: 0 0 2px;
          font-weight: var(--font-weight-medium);
        }
        .search-card-meta {
          font-family: var(--font-primary);
          font-size: var(--font-size-xs);
          color: var(--color-steel-gray);
          margin: 0;
        }
        .search-card-price {
          font-family: var(--font-geist-mono);
          font-size: var(--font-size-sm);
          color: var(--color-highlighter-lime);
          font-weight: var(--font-weight-semibold);
        }
        .deal-suggestion-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: var(--radius-md);
          padding: 12px var(--spacing-16);
          display: flex;
          align-items: center;
          gap: var(--spacing-16);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .deal-suggestion-card:hover {
          border-color: rgba(255, 255, 255, 0.12);
          background: rgba(255, 255, 255, 0.04);
        }
        .deal-img-placeholder {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-md);
          background: rgba(255, 255, 255, 0.04);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
        }
        .deal-title {
          font-family: var(--font-secondary);
          font-size: var(--font-size-sm);
          color: var(--color-pure-white);
          margin: 0 0 2px;
          font-weight: var(--font-weight-medium);
        }
        .deal-desc {
          font-family: var(--font-primary);
          font-size: var(--font-size-xs);
          color: var(--color-steel-gray);
          margin: 0;
        }
        .deal-arrow {
          color: var(--color-steel-gray);
          font-size: 14px;
          transition: transform 0.2s ease;
        }
        .deal-suggestion-card:hover .deal-arrow {
          color: var(--color-highlighter-lime);
          transform: translateX(3px);
        }
        .boarding-pass-visual {
          background: var(--color-carbon);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-xl);
          max-width: 480px;
          margin: 20px auto;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
          position: relative;
        }
        .boarding-pass-visual::before,
        .boarding-pass-visual::after {
          content: '';
          position: absolute;
          top: 48px;
          width: 16px;
          height: 16px;
          background: var(--color-onyx-black);
          border-radius: 50%;
          z-index: 5;
        }
        .boarding-pass-visual::before {
          left: -8px;
          border-right: 1px solid rgba(255, 255, 255, 0.08);
        }
        .boarding-pass-visual::after {
          right: -8px;
          border-left: 1px solid rgba(255, 255, 255, 0.08);
        }
        .boarding-pass-header {
          background: rgba(255, 255, 255, 0.02);
          border-bottom: 1px dashed rgba(255, 255, 255, 0.12);
          padding: 14px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-family: var(--font-geist-mono);
          font-size: 11px;
          letter-spacing: 1px;
          color: var(--color-steel-gray);
        }
        .boarding-pass-body {
          padding: 20px;
        }
        .pass-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .pass-row label {
          font-family: var(--font-geist-mono);
          font-size: 9px;
          letter-spacing: 0.5px;
          color: var(--color-steel-gray);
          text-transform: uppercase;
        }
        .pass-val {
          font-family: var(--font-tomorrow);
          font-size: 22px;
          color: var(--color-pure-white);
          margin-top: 4px;
        }
        .pass-arrow {
          color: var(--color-highlighter-lime);
          font-size: 20px;
          padding: 0 12px;
        }
        .pass-divider {
          height: 1px;
          border-top: 1px dashed rgba(255, 255, 255, 0.12);
          margin: 16px 0;
        }
        .pass-details {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          text-align: left;
        }
        .pass-details label {
          font-family: var(--font-geist-mono);
          font-size: 9px;
          color: var(--color-steel-gray);
          text-transform: uppercase;
        }
        .pass-sub-val {
          font-family: var(--font-geist-mono);
          font-size: 13px;
          color: var(--color-pure-white);
          margin-top: 2px;
          font-weight: 500;
        }
        @keyframes scaleIn {
          from { transform: scale(0.96); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .travelgo-field-group {
          position: relative;
        }
        .autocomplete-dropdown {
          position: absolute;
          top: calc(100% + 4px);
          left: 0;
          right: 0;
          background: rgba(20, 20, 20, 0.96);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          z-index: 200;
          max-height: 240px;
          overflow-y: auto;
          box-shadow: 0 10px 40px rgba(0,0,0,0.6);
        }
        .autocomplete-item {
          padding: 12px 16px;
          cursor: pointer;
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
          transition: all 0.2s ease;
        }
        .autocomplete-item:last-child {
          border-bottom: none;
        }
        .autocomplete-item:hover {
          background: rgba(255, 0, 0, 0.08);
          padding-left: 20px;
        }
        .autocomplete-item-name {
          font-family: var(--font-primary);
          font-size: 13px;
          font-weight: 600;
          color: #fff;
        }
        .autocomplete-item-sub {
          font-family: var(--font-geist-mono);
          font-size: 10px;
          color: #666;
          margin-top: 3px;
        }

        @media (max-width: 1024px) {
          .travelgo-form-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .travelgo-form-grid > .span-4 {
            grid-column: span 2;
          }
          .travelgo-form-grid > .span-2 {
            grid-column: span 2;
          }
          .span-1-tablet {
            grid-column: span 1 !important;
          }
        }
        @media (max-width: 768px) {
          .travelgo-card-header {
            padding: var(--spacing-16) var(--spacing-16) 0;
          }
          .route-inputs-wrapper {
            grid-template-columns: 1fr;
            gap: var(--spacing-16);
          }
          .travelgo-swap-btn {
            top: 50%;
            transform: translate(-50%, -50%) rotate(90deg);
            width: 32px;
            height: 32px;
          }
          .travelgo-swap-btn:hover {
            transform: translate(-50%, -50%) rotate(270deg);
          }
          .travelgo-side-grid {
            grid-template-columns: 1fr;
            gap: var(--spacing-16);
          }
        }
        @media (max-width: 640px) {
          .desktop-features {
            display: none !important;
          }
          .travelgo-card-header {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--spacing-16);
            padding: var(--spacing-16) var(--spacing-16) 0;
          }
          .travelgo-tabs-grid {
            width: 100%;
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            border-radius: var(--radius-md);
            padding: 4px;
          }
          .travelgo-tab-btn {
            flex-direction: column;
            gap: 4px;
            padding: 10px 4px;
            height: 60px;
            border-radius: var(--radius-md);
            justify-content: center;
          }
          .travelgo-tab-btn span {
            font-size: var(--font-size-xs);
          }
          .travelgo-tab-btn svg {
            width: 14px;
            height: 14px;
          }
          .travelgo-toggles {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--spacing-8);
          }
          .toggles-row {
            width: 100%;
          }
          .toggle-pill {
            flex: 1;
            text-align: center;
          }
          .travelgo-form-grid {
            grid-template-columns: 1fr;
            gap: var(--spacing-16);
          }
          .travelgo-form-grid > .span-4,
          .travelgo-form-grid > .span-2 {
            grid-column: span 1;
          }
          .travelgo-info-radar {
            height: auto;
            padding: 12px;
          }
        }
      `}</style>
    </section>
  );
}
