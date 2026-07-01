'use client';
import { useState, useEffect, useRef } from 'react';

interface CountUpProps {
  end: string;
  duration?: number;
}

function CountUp({ end, duration = 1800 }: CountUpProps) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  // Extract clean number and suffix
  const cleanNumberStr = end.replace(/[^0-9]/g, '');
  const suffix = end.replace(/[0-9,]/g, '');
  const isNumeric = cleanNumberStr.length > 0 && !end.includes('/');

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
        }
      },
      { threshold: 0.1 }
    );
    
    const el = elementRef.current;
    if (el) observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, []);

  useEffect(() => {
    if (!started || !isNumeric) return;

    let startTimestamp: number | null = null;
    const endValue = parseInt(cleanNumberStr, 10);

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing out quadratic
      const easeProgress = progress * (2 - progress);
      setCount(Math.floor(easeProgress * endValue));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  }, [started, cleanNumberStr, isNumeric, duration]);

  if (!isNumeric) {
    return <div ref={elementRef}>{end}</div>;
  }

  return (
    <div ref={elementRef}>
      {started ? `${count.toLocaleString()}${suffix}` : `0${suffix}`}
    </div>
  );
}

const STATS = [
  { num: '4,800+', label: 'Luxury Indian journeys crafted since 2010' },
  { num: '98%', label: 'Return client & referral rate' },
  { num: '8', label: 'Handpicked domestic regions' },
  { num: '24/7', label: 'On-ground medical & concierge support' },
];

export default function Stats() {
  return (
    <section style={{ background: 'var(--surface-canvas)', padding: '40px 0' }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 2,
          background: 'var(--color-fog)',
          borderRadius: 'var(--radius-card)',
          overflow: 'hidden',
        }}>
          {STATS.map((s, i) => (
            <div
              key={i}
              className="reveal"
              style={{
                background: 'var(--surface-card-white)',
                padding: '40px 32px',
                display: 'flex', flexDirection: 'column', gap: 8,
                boxShadow: 'var(--shadow-card-inset)',
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <div style={{
                fontFamily: 'var(--font-cosmica)',
                fontSize: 'clamp(32px, 3vw, 48px)',
                fontWeight: 700,
                color: 'var(--color-obsidian)',
                lineHeight: 1,
              }}>
                <CountUp end={s.num} />
              </div>
              <p style={{
                fontFamily: 'var(--font-cosmica)',
                fontSize: 13,
                fontWeight: 400,
                color: 'var(--color-steel)',
                lineHeight: 1.56,
                maxWidth: 160,
              }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          section div[style*="grid-template-columns: repeat(4"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
}
