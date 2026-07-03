'use client';
import { useState } from 'react';

interface Step {
  id: string; label: string; question: string; subtext?: string;
  options: string[]; inputType?: 'text' | 'textarea'; inputPlaceholder?: string; icon: string;
}

const STEPS: Step[] = [
  { id: 'destination', label: '01 — Where', question: 'Where in India does your soul want to go?', subtext: 'Choose from our curated regions or describe your dream destination.', options: ['Kedarnath', 'Chardham Yatra', 'Varanasi', 'Kashmir', 'Goa', 'Kerala', 'Rajasthan', 'Leh Ladakh', 'Surprise me'], inputType: 'text', inputPlaceholder: 'e.g. Kedarnath, Spiti Valley, Coorg, or a multi-city circuit…', icon: '🗺️' },
  { id: 'dates', label: '02 — When', question: 'When are you planning to travel?', subtext: 'Select a timeframe or enter specific dates.', options: ['Next month', 'In 2–3 months', 'In 6 months', 'Next year', 'Flexible / Open'], inputType: 'text', inputPlaceholder: 'e.g. Dec 20 – Jan 5, or around Diwali 2026…', icon: '📅' },
  { id: 'duration', label: '03 — Duration', question: 'How many nights are you envisioning?', subtext: 'We can design anything from a 3-night escape to a 21-night odyssey.', options: ['3–5 nights', '6–8 nights', '9–12 nights', '13–18 nights', '3+ weeks'], inputType: 'text', inputPlaceholder: 'e.g. 10 nights, or flexible based on budget…', icon: '🌙' },
  { id: 'travelers', label: '04 — Who', question: "Who's joining you on this journey?", subtext: 'Tell us about your group composition — we tailor every detail.', options: ['Solo traveller', 'Couple / Honeymoon', 'Small group (3–6)', 'Family with children', 'Family with seniors', 'Corporate team'], inputType: 'text', inputPlaceholder: 'e.g. 2 adults + 1 child (8 yrs), or 4 couples…', icon: '👥' },
  { id: 'budget', label: '05 — Budget', question: "What's your investment range per traveller?", subtext: 'All prices are per person. This helps us recommend the right properties.', options: ['Under ₹50,000', '₹50k – ₹1.5 Lakhs', '₹1.5L – ₹3 Lakhs', '₹3L – ₹5 Lakhs', '₹5 Lakhs+', 'Flexible'], inputType: 'text', inputPlaceholder: 'e.g. ₹8 Lakhs total for 2 people, or best value…', icon: '💰' },
  { id: 'style', label: '06 — Style', question: 'What kind of experience do you seek?', subtext: 'Mix and match — your journey can blend multiple styles.', options: ['Luxury Stays & Wellness', 'Himalayan Trek & Adventure', 'Heritage Trails & History', 'Wildlife & Nature', 'Honeymoon Retreat', 'Spiritual & Wellness', 'Family Magic', 'Culinary Journey'], inputType: 'text', inputPlaceholder: 'e.g. Active days, luxury nights, with some local food exploration…', icon: '✨' },
  { id: 'accommodation', label: '07 — Stay', question: 'Any accommodation preferences?', subtext: 'We partner with premium hotels, guest houses, camps, and heritage resorts.', options: ['Premium 3/4 Star Hotels', 'Comfortable Guest Houses', 'Boutique Resorts', 'Luxury Tented Camps', 'Houseboats', 'Mix of Stays'], inputType: 'text', inputPlaceholder: 'e.g. Near the temple shrine, pool required, family suite…', icon: '🏡' },
  { id: 'notes', label: '08 — Notes', question: 'Anything else we should know?', subtext: 'Dietary needs, medical considerations, must-do experiences, or special occasions.', options: [], inputType: 'textarea', inputPlaceholder: 'e.g. Celebrating our anniversary, vegetarian only, one guest uses a wheelchair, must see a sunrise…', icon: '📝' },
  { id: 'contact', label: '09 — Contact', question: 'Last step — how do we reach you?', subtext: 'We respond within 2 hours with a personalised itinerary draft.', options: [], icon: '📞' },
];

export default function JourneyPlanner() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [customInputs, setCustomInputs] = useState<Record<string, string>>({});
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const current = STEPS[step];
  const progress = Math.round((step / (STEPS.length - 1)) * 100);
  const isLastStep = step === STEPS.length - 1;
  const isNotesStep = current.id === 'notes';

  const select = (option: string) => {
    setAnswers(prev => ({ ...prev, [current.id]: option }));
    if (!current.options.includes(option)) {
      setCustomInputs(prev => ({ ...prev, [current.id]: option }));
    } else {
      setCustomInputs(prev => ({ ...prev, [current.id]: '' }));
    }
    if (step < STEPS.length - 1) setStep(s => s + 1);
  };

  const handleCustomNext = () => {
    const val = customInputs[current.id]?.trim();
    if (val) select(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const summaryLines = Object.entries(answers)
      .filter(([, v]) => v)
      .map(([k, v]) => {
        const stepDef = STEPS.find(s => s.id === k);
        const label = stepDef?.label?.replace(/^\d+ — /, '') || k;
        return `*${label}:* ${v}`;
      });
    const text = `Hello Shivalay Travels! Here is my journey brief:\n\n${summaryLines.join('\n')}\n\n*Name:* ${name}\n*Email:* ${email}\n${phone ? `*Phone:* ${phone}` : ''}`;
    window.open(`https://wa.me/919340994628?text=${encodeURIComponent(text)}`, '_blank');
    setSubmitted(true);
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 10, fontWeight: 500,
    color: 'var(--color-steel-gray)',
    textTransform: 'uppercase',
    letterSpacing: '0.6px',
    marginBottom: 6,
    fontFamily: 'var(--font-geist-mono)',
  };

  return (
    <section id="planner" style={{ background: 'var(--surface-canvas)', padding: '48px 0', borderBottom: '1px solid var(--color-zinc-hairline)' }}>
      <div className="container">
        <div className="planner-grid">

          {/* Left Sidebar */}
          <div className="planner-sidebar">
            <p className="section-label" style={{ marginBottom: 8 }}>Journey Planner</p>
            <h2 className="heading-md" style={{ marginBottom: 8 }}>Build your perfect private escape.</h2>
            <p style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 12, color: 'var(--color-steel-gray)', lineHeight: 1.6, marginBottom: 24 }}>
              {STEPS.length} steps to your dream itinerary. Every field is fully customisable.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {STEPS.map((s, i) => {
                const isActive = step === i;
                const isDone = i < step;
                return (
                  <button
                    key={s.id}
                    onClick={() => i <= step && setStep(i)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '8px 12px',
                      background: isActive ? 'var(--color-lime-07)' : 'transparent',
                      border: `1px solid ${isActive ? 'var(--color-lime-25)' : 'transparent'}`,
                      borderRadius: 'var(--radius-md)',
                      cursor: i <= step ? 'pointer' : 'default',
                      textAlign: 'left', width: '100%', transition: 'all 0.18s ease',
                    }}
                    onMouseEnter={e => { if (i <= step && !isActive) e.currentTarget.style.background = 'var(--color-carbon)'; }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                  >
                    <div style={{
                      width: 20, height: 20, borderRadius: 'var(--radius-md)', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: isDone ? 'var(--color-highlighter-lime)' : isActive ? 'var(--color-lime-20)' : 'var(--color-zinc-hairline)',
                      transition: 'background 0.18s ease',
                    }}>
                      {isDone ? (
                        <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5L4 7L8 3" stroke="var(--color-onyx-black)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        <span style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 8, fontWeight: 500, color: isActive ? 'var(--color-highlighter-lime)' : 'var(--color-ash-gray)' }}>{i + 1}</span>
                      )}
                    </div>
                    <span style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 11, fontWeight: isActive ? 500 : 400, color: isActive ? 'var(--color-pure-white)' : isDone ? 'var(--color-steel-gray)' : 'var(--color-ash-gray)', flex: 1 }}>
                      {s.label}
                    </span>
                    {answers[s.id] && (
                      <span style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 9, color: 'var(--color-highlighter-lime)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 64 }}>
                        {answers[s.id]}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Panel */}
          <div
            className="reveal"
            style={{
              background: 'var(--color-carbon)',
              border: '1px solid var(--color-zinc-hairline)',
              borderRadius: 'var(--radius-xl)',
              padding: '32px',
              minHeight: 480,
              display: 'flex', flexDirection: 'column',
            }}
          >
            {!submitted ? (
              <>
                {/* Progress bar */}
                <div style={{ marginBottom: 28 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 11, color: 'var(--color-ash-gray)' }}>Step {step + 1} of {STEPS.length}</span>
                    <span style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 11, fontWeight: 500, color: 'var(--color-highlighter-lime)' }}>{progress}%</span>
                  </div>
                  <div style={{ height: 3, background: 'var(--color-zinc-hairline)', borderRadius: 3, overflow: 'hidden' }}>
                    <div className="progress-bar-fill" style={{ height: '100%', width: `${progress}%`, background: 'var(--color-highlighter-lime)', borderRadius: 3, transition: 'width 0.5s var(--ease-out)' }} />
                  </div>
                </div>

                {/* Step content */}
                <div key={step} style={{ animation: 'revealUp 0.35s var(--ease-out) both', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <span style={{ fontSize: 20 }}>{current.icon}</span>
                    <h3 style={{ fontFamily: 'var(--font-tomorrow)', fontWeight: 400, fontSize: 'clamp(18px, 2.2vw, 24px)', color: 'var(--color-pure-white)', lineHeight: 1.25 }}>
                      {current.question}
                    </h3>
                  </div>
                  {current.subtext && (
                    <p style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 12, color: 'var(--color-steel-gray)', lineHeight: 1.55, marginBottom: 20, marginLeft: 30 }}>
                      {current.subtext}
                    </p>
                  )}

                  {/* Option chips */}
                  {current.options.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 24 }}>
                      {current.options.map(opt => {
                        const isSelected = answers[current.id] === opt;
                        return (
                          <button
                            key={opt}
                            onClick={() => select(opt)}
                            style={{
                              padding: '7px 14px', borderRadius: 'var(--radius-md)',
                              border: `1px solid ${isSelected ? 'var(--color-highlighter-lime)' : 'var(--color-zinc-hairline)'}`,
                              background: isSelected ? 'var(--color-highlighter-lime)' : 'transparent',
                              fontFamily: 'var(--font-geist-mono)', fontSize: 12,
                              color: isSelected ? 'var(--color-onyx-black)' : 'var(--color-steel-gray)',
                              cursor: 'pointer', transition: 'all 0.18s ease',
                            }}
                            onMouseEnter={e => { if (!isSelected) { e.currentTarget.style.borderColor = 'var(--color-smoke)'; e.currentTarget.style.color = 'var(--color-pure-white)'; } }}
                            onMouseLeave={e => { if (!isSelected) { e.currentTarget.style.borderColor = 'var(--color-zinc-hairline)'; e.currentTarget.style.color = 'var(--color-steel-gray)'; } }}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Custom input (non-contact steps) */}
                  {!isLastStep && (
                    <div style={{ borderTop: current.options.length > 0 ? '1px solid var(--color-zinc-hairline)' : 'none', paddingTop: current.options.length > 0 ? 18 : 0 }}>
                      {current.options.length > 0 && (
                        <p style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 10, fontWeight: 500, color: 'var(--color-ash-gray)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>
                          Or enter custom details:
                        </p>
                      )}
                      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                        {isNotesStep ? (
                          <textarea
                            className="input-terminal"
                            rows={4}
                            style={{ resize: 'vertical', lineHeight: 1.6, flex: 1 }}
                            placeholder={current.inputPlaceholder}
                            value={customInputs[current.id] || ''}
                            onChange={e => {
                              const val = e.target.value;
                              setCustomInputs(prev => ({ ...prev, [current.id]: val }));
                              setAnswers(prev => ({ ...prev, [current.id]: val }));
                            }}
                          />
                        ) : (
                          <input
                            type="text"
                            className="input-terminal"
                            placeholder={current.inputPlaceholder}
                            value={customInputs[current.id] || ''}
                            style={{ flex: 1 }}
                            onChange={e => {
                              const val = e.target.value;
                              setCustomInputs(prev => ({ ...prev, [current.id]: val }));
                              setAnswers(prev => ({ ...prev, [current.id]: val }));
                            }}
                            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleCustomNext(); } }}
                          />
                        )}
                        <button
                          type="button"
                          className="btn-primary"
                          style={{ padding: '10px 18px', fontSize: 13, flexShrink: 0 }}
                          disabled={!customInputs[current.id]?.trim()}
                          onClick={handleCustomNext}
                        >
                          Next →
                        </button>
                      </div>
                      {isNotesStep && (
                        <button
                          type="button"
                          onClick={() => { setAnswers(prev => ({ ...prev, notes: customInputs.notes || '' })); setStep(s => s + 1); }}
                          style={{ marginTop: 10, fontFamily: 'var(--font-geist-mono)', fontSize: 12, color: 'var(--color-ash-gray)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
                        >
                          Skip this step
                        </button>
                      )}
                    </div>
                  )}

                  {/* Contact form */}
                  {isLastStep && (
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 440 }}>
                      {[
                        { label: 'Your full name', val: name, set: setName, placeholder: 'First & last name', type: 'text', required: true },
                        { label: 'Email address', val: email, set: setEmail, placeholder: 'you@email.com', type: 'email', required: true },
                        { label: 'WhatsApp / Phone (optional)', val: phone, set: setPhone, placeholder: '+91 93409 94628', type: 'tel', required: false },
                      ].map(field => (
                        <div key={field.label}>
                          <label style={labelStyle}>{field.label}</label>
                          <input
                            className="input-terminal"
                            type={field.type}
                            value={field.val}
                            onChange={e => field.set(e.target.value)}
                            placeholder={field.placeholder}
                            required={field.required}
                          />
                        </div>
                      ))}

                      {/* Summary */}
                      <div style={{ background: 'var(--color-onyx-black)', border: '1px solid var(--color-zinc-hairline)', borderRadius: 'var(--radius-xl)', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <p style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 10, fontWeight: 500, color: 'var(--color-steel-gray)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>Your journey summary</p>
                        {Object.entries(answers).filter(([, v]) => v).map(([k, v]) => {
                          const stepDef = STEPS.find(s => s.id === k);
                          return (
                            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'flex-start' }}>
                              <span style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 11, color: 'var(--color-ash-gray)', flexShrink: 0 }}>{stepDef?.label?.replace(/^\d+ — /, '') || k}</span>
                              <span style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 11, fontWeight: 500, color: 'var(--color-pure-white)', textAlign: 'right' }}>{v}</span>
                            </div>
                          );
                        })}
                      </div>

                      <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start', fontSize: 13 }}>
                        Send My Journey Brief →
                      </button>
                    </form>
                  )}
                </div>

                {/* Back */}
                {step > 0 && (
                  <button
                    onClick={() => setStep(s => s - 1)}
                    style={{ marginTop: 20, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-geist-mono)', fontSize: 12, color: 'var(--color-ash-gray)', display: 'flex', alignItems: 'center', gap: 5, transition: 'color 0.18s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-pure-white)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-ash-gray)')}
                  >
                    ← Back
                  </button>
                )}
              </>
            ) : (
              /* Success state */
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 20, animation: 'scaleIn 0.5s var(--ease-spring) both' }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 'var(--radius-md)',
                  background: 'var(--color-highlighter-lime)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--color-onyx-black)',
                }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-tomorrow)', fontWeight: 400, fontSize: 24, color: 'var(--color-pure-white)', marginBottom: 8, lineHeight: 1.3 }}>
                    Your Journey Brief is On Its Way! 🎉
                  </h3>
                  <p style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 13, color: 'var(--color-steel-gray)', lineHeight: 1.65, maxWidth: 400 }}>
                    Our travel specialist will contact you within 2 hours with a personalised draft itinerary based on your selections.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <a href="https://wa.me/919340994628" target="_blank" rel="noopener noreferrer" className="btn-primary">
                    WhatsApp Planner Now
                  </a>
                  <a href="mailto:info@shivalaytravels.com" className="btn-ghost">
                    Send Email
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          #planner .planner-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
