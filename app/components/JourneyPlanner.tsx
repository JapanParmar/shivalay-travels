'use client';
import { useState } from 'react';

interface Step {
  id: string;
  label: string;
  question: string;
  subtext?: string;
  options: string[];
  inputType?: 'text' | 'date' | 'number' | 'textarea';
  inputPlaceholder?: string;
  icon?: string;
}

const STEPS: Step[] = [
  {
    id: 'destination',
    label: '01 — Where',
    question: 'Where in India does your soul want to go?',
    subtext: 'Choose from our curated regions or describe your dream destination.',
    options: ['Ladakh', 'Kashmir', 'Kerala', 'Meghalaya', 'Rajasthan', 'Goa', 'Hampi', 'Varanasi', 'Surprise me'],
    inputType: 'text',
    inputPlaceholder: 'e.g. Spiti Valley, Coorg, or a multi-destination circuit…',
    icon: '🗺️',
  },
  {
    id: 'dates',
    label: '02 — When',
    question: 'When are you planning to travel?',
    subtext: 'Select a timeframe or enter specific dates.',
    options: ['Next month', 'In 2–3 months', 'In 6 months', 'Next year', 'Flexible / Open'],
    inputType: 'text',
    inputPlaceholder: 'e.g. Dec 20 – Jan 5, or around Diwali 2026…',
    icon: '📅',
  },
  {
    id: 'duration',
    label: '03 — Duration',
    question: 'How many nights are you envisioning?',
    subtext: 'We can design anything from a 3-night escape to a 21-night odyssey.',
    options: ['3–5 nights', '6–8 nights', '9–12 nights', '13–18 nights', '3+ weeks'],
    inputType: 'text',
    inputPlaceholder: 'e.g. 10 nights, or flexible based on budget…',
    icon: '🌙',
  },
  {
    id: 'travelers',
    label: '04 — Who',
    question: "Who's joining you on this journey?",
    subtext: 'Tell us about your group composition — we tailor every detail.',
    options: ['Solo traveller', 'Couple / Honeymoon', 'Small group (3–6)', 'Family with children', 'Family with seniors', 'Corporate team'],
    inputType: 'text',
    inputPlaceholder: 'e.g. 2 adults + 1 child (8 yrs), or 4 couples…',
    icon: '👥',
  },
  {
    id: 'budget',
    label: '05 — Budget',
    question: "What's your investment range per traveller?",
    subtext: 'All prices are per person. This helps us recommend the right properties.',
    options: ['Under ₹50,000', '₹50k – ₹1.5 Lakhs', '₹1.5L – ₹3 Lakhs', '₹3 Lakhs – ₹5 Lakhs', '₹5 Lakhs+', 'Flexible'],
    inputType: 'text',
    inputPlaceholder: 'e.g. ₹8 Lakhs total for 2 people, or best value…',
    icon: '💰',
  },
  {
    id: 'style',
    label: '06 — Style',
    question: 'What kind of experience do you seek?',
    subtext: 'Mix and match — your journey can blend multiple styles.',
    options: ['Luxury Stays & Wellness', 'Himalayan Trek & Adventure', 'Heritage Trails & History', 'Wildlife & Nature', 'Honeymoon Retreat', 'Spiritual & Wellness', 'Family Magic', 'Culinary Journey'],
    inputType: 'text',
    inputPlaceholder: 'e.g. Active days, luxury nights, with some local food exploration…',
    icon: '✨',
  },
  {
    id: 'accommodation',
    label: '07 — Stay',
    question: 'Any accommodation preferences?',
    subtext: 'We partner with Taj, Oberoi, boutique camps, and private villas.',
    options: ['Luxury 5-star hotels', 'Boutique heritage properties', 'Private villas', 'Luxury tented camps', 'Houseboats', 'Mix of experiences'],
    inputType: 'text',
    inputPlaceholder: 'e.g. Must have a pool, prefer eco-lodges, open to anything…',
    icon: '🏡',
  },
  {
    id: 'notes',
    label: '08 — Notes',
    question: 'Anything else we should know?',
    subtext: 'Dietary needs, medical considerations, must-do experiences, or special occasions.',
    options: [],
    inputType: 'textarea',
    inputPlaceholder: 'e.g. Celebrating our anniversary, vegetarian only, one guest uses a wheelchair, must see a sunrise somewhere spectacular…',
    icon: '📝',
  },
  {
    id: 'contact',
    label: '09 — Contact',
    question: 'Last step — how do we reach you?',
    subtext: 'We respond within 2 hours with a personalised itinerary draft.',
    options: [],
    icon: '📞',
  },
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

  const select = (option: string) => {
    const newAnswers = { ...answers, [current.id]: option };
    setAnswers(newAnswers);
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
    setSubmitted(true);
  };

  const isLastStep = step === STEPS.length - 1;
  const isNotesStep = current.id === 'notes';

  return (
    <section id="planner" style={{ background: 'var(--color-obsidian)', padding: '80px 0', position: 'relative', overflow: 'hidden' }}>
      {/* Background decoration */}
      <div style={{ position: 'absolute', top: -200, right: -200, width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(254,69,226,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -100, left: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,90,0,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 56, alignItems: 'start' }}>

          {/* Left sidebar */}
          <div className="reveal-right">
            <div className="badge" style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)', marginBottom: 24 }}>Journey Planner</div>
            <h2 style={{ fontFamily: 'var(--font-cosmica)', fontWeight: 700, fontSize: 26, color: '#fff', lineHeight: 1.25, marginBottom: 8 }}>
              Build your perfect private escape.
            </h2>
            <p style={{ fontFamily: 'var(--font-cosmica)', fontSize: 13, color: 'rgba(255,255,255,0.35)', lineHeight: 1.6, marginBottom: 32 }}>
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
                      display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
                      background: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
                      border: `1px solid ${isActive ? 'rgba(255,255,255,0.14)' : 'transparent'}`,
                      borderRadius: 10, cursor: i <= step ? 'pointer' : 'default',
                      textAlign: 'left', width: '100%', transition: 'all 0.22s ease',
                    }}
                    onMouseEnter={e => { if (i <= step && !isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                  >
                    <div style={{
                      width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: isDone ? '#fff' : isActive ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.06)',
                      transition: 'background 0.2s ease',
                    }}>
                      {isDone ? (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5L4 7L8 3" stroke="#09090b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        <span style={{ fontFamily: 'var(--font-cosmica)', fontSize: 9, fontWeight: 700, color: isActive ? '#fff' : 'rgba(255,255,255,0.28)' }}>{i + 1}</span>
                      )}
                    </div>
                    <span style={{
                      fontFamily: 'var(--font-cosmica)', fontSize: 12, fontWeight: 500,
                      color: isActive ? '#fff' : isDone ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.25)',
                      flex: 1,
                    }}>{s.label}</span>
                    {answers[s.id] && (
                      <span style={{
                        fontFamily: 'var(--font-cosmica)', fontSize: 10, color: 'rgba(255,255,255,0.35)',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 72,
                      }}>{answers[s.id]}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right panel */}
          <div className="reveal" style={{
            background: 'var(--surface-card-white)', borderRadius: 'var(--radius-card)',
            padding: '44px 48px', minHeight: 520, display: 'flex', flexDirection: 'column',
          }}>
            {!submitted ? (
              <>
                {/* Progress */}
                <div style={{ marginBottom: 36 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontFamily: 'var(--font-cosmica)', fontSize: 12, color: 'var(--color-ash)' }}>
                      Step {step + 1} of {STEPS.length}
                    </span>
                    <span style={{ fontFamily: 'var(--font-cosmica)', fontSize: 12, fontWeight: 700, color: 'var(--color-obsidian)' }}>{progress}%</span>
                  </div>
                  <div style={{ height: 5, background: 'var(--color-fog)', borderRadius: 5, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', width: `${progress}%`,
                      background: 'linear-gradient(90deg, var(--color-ember), var(--color-orchid-flash))',
                      borderRadius: 5, transition: 'width 0.55s var(--ease-out)',
                    }} />
                  </div>
                </div>

                {/* Question */}
                <div key={step} style={{ animation: 'revealUp 0.4s var(--ease-out) both', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <span style={{ fontSize: 22 }}>{current.icon}</span>
                    <h3 style={{
                      fontFamily: 'var(--font-cosmica)', fontWeight: 700,
                      fontSize: 'clamp(20px, 2.8vw, 28px)', color: 'var(--color-obsidian)', lineHeight: 1.25,
                    }}>
                      {current.question}
                    </h3>
                  </div>
                  {current.subtext && (
                    <p style={{ fontFamily: 'var(--font-cosmica)', fontSize: 13, color: 'var(--color-ash)', lineHeight: 1.55, marginBottom: 24, marginLeft: 32 }}>
                      {current.subtext}
                    </p>
                  )}

                  {/* Option chips */}
                  {current.options.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
                      {current.options.map(opt => (
                        <button
                          key={opt}
                          className={`option-chip ${answers[current.id] === opt ? 'selected' : ''}`}
                          onClick={() => select(opt)}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Custom input — shown for all non-contact steps */}
                  {!isLastStep && (
                    <div style={{
                      borderTop: current.options.length > 0 ? '1px solid var(--color-fog)' : 'none',
                      paddingTop: current.options.length > 0 ? 20 : 0,
                      marginTop: current.options.length > 0 ? 4 : 0,
                    }}>
                      {current.options.length > 0 && (
                        <p style={{ fontFamily: 'var(--font-cosmica)', fontSize: 11, fontWeight: 600, color: 'var(--color-ash)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>
                          Or enter custom details:
                        </p>
                      )}

                      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                        {isNotesStep ? (
                          <textarea
                            className="input-luxury"
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
                            type={current.inputType || 'text'}
                            className="input-luxury"
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
                          style={{ padding: '11px 20px', fontSize: 13, flexShrink: 0, marginTop: isNotesStep ? 0 : 0 }}
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
                          style={{
                            marginTop: 10, fontFamily: 'var(--font-cosmica)', fontSize: 13, color: 'var(--color-ash)',
                            background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline',
                          }}
                        >
                          Skip this step
                        </button>
                      )}
                    </div>
                  )}

                  {/* Final contact form */}
                  {isLastStep && (
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 460 }}>
                      {[
                        { label: 'Your full name', val: name, set: setName, placeholder: 'First & last name', type: 'text', required: true },
                        { label: 'Email address', val: email, set: setEmail, placeholder: 'you@email.com', type: 'email', required: true },
                        { label: 'WhatsApp / Phone (optional)', val: phone, set: setPhone, placeholder: '+91 98765 43210', type: 'tel', required: false },
                      ].map(field => (
                        <div key={field.label}>
                          <label style={{ display: 'block', fontFamily: 'var(--font-cosmica)', fontSize: 11, fontWeight: 600, color: 'var(--color-ash)', marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{field.label}</label>
                          <input className="input-luxury" type={field.type} value={field.val} onChange={e => field.set(e.target.value)} placeholder={field.placeholder} required={field.required} />
                        </div>
                      ))}

                      {/* Summary */}
                      <div style={{ background: 'var(--color-mist)', borderRadius: 'var(--radius-card-compact)', padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <p style={{ fontFamily: 'var(--font-cosmica)', fontSize: 11, fontWeight: 700, color: 'var(--color-obsidian)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>Your journey summary</p>
                        {Object.entries(answers).filter(([, v]) => v).map(([k, v]) => {
                          const stepDef = STEPS.find(s => s.id === k);
                          return (
                            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'flex-start' }}>
                              <span style={{ fontFamily: 'var(--font-cosmica)', fontSize: 12, color: 'var(--color-ash)', textTransform: 'capitalize', flexShrink: 0 }}>{stepDef?.label?.replace(/^\d+ — /, '') || k}</span>
                              <span style={{ fontFamily: 'var(--font-cosmica)', fontSize: 12, fontWeight: 600, color: 'var(--color-obsidian)', textAlign: 'right' }}>{v}</span>
                            </div>
                          );
                        })}
                      </div>

                      <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start', marginTop: 4 }}>
                        Send My Journey Brief →
                      </button>
                    </form>
                  )}
                </div>

                {/* Back */}
                {step > 0 && (
                  <button
                    onClick={() => setStep(s => s - 1)}
                    style={{
                      marginTop: 24, background: 'none', border: 'none', cursor: 'pointer',
                      fontFamily: 'var(--font-cosmica)', fontSize: 13, color: 'var(--color-ash)',
                      display: 'flex', alignItems: 'center', gap: 6, transition: 'color 0.2s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-steel)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-ash)')}
                  >
                    ← Back
                  </button>
                )}
              </>
            ) : (
              /* Success state */
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 20, animation: 'scaleIn 0.6s var(--ease-spring) both' }}>
                <div style={{
                  width: 64, height: 64, borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--color-ember), var(--color-orchid-flash))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 8px 32px rgba(255,90,0,0.3)',
                  animation: 'float 3s ease-in-out infinite',
                }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-cosmica)', fontWeight: 700, fontSize: 28, color: 'var(--color-obsidian)', marginBottom: 10 }}>
                    Your Indian Odyssey is Registered. 🎉
                  </h3>
                  <p style={{ fontFamily: 'var(--font-cosmica)', fontSize: 15, color: 'var(--color-steel)', lineHeight: 1.65, maxWidth: 400 }}>
                    Our luxury travel planner will contact you within 2 hours with a personalised draft itinerary based on your selections.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 8 }}>
                  <a href="https://wa.me/+1234567890" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ textDecoration: 'none' }}>
                    WhatsApp Planner Now
                  </a>
                  <a href="mailto:journeys@lumiere.travel" className="btn-outline" style={{ textDecoration: 'none' }}>
                    Send Email
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          #planner .container > div { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
      `}</style>
    </section>
  );
}
