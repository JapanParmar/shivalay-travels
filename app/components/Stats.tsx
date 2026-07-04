'use client';
import { useState, useEffect, useRef } from 'react';

const STATS = [
  { num: '12,500+', label: 'Happy travellers served' },
  { num: '99%', label: 'Customer satisfaction rate' },
  { num: '50+', label: 'Pilgrimage & tourist routes' },
  { num: '24/7', label: 'On-ground support available' },
];

function CountUp({ end, duration = 1600 }: { end: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const cleanNumberStr = end.replace(/[^0-9]/g, '');
  const suffix = end.replace(/[0-9,]/g, '');
  const isNumeric = cleanNumberStr.length > 0 && !end.includes('/');

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setStarted(true); }, { threshold: 0.1 });
    const el = elementRef.current;
    if (el) observer.observe(el);
    return () => { if (el) observer.unobserve(el); };
  }, []);

  useEffect(() => {
    if (!started || !isNumeric) return;
    let startTimestamp: number | null = null;
    const endValue = parseInt(cleanNumberStr, 10);
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = progress * (2 - progress);
      setCount(Math.floor(easeProgress * endValue));
      if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  }, [started, cleanNumberStr, isNumeric, duration]);

  if (!isNumeric) return <div ref={elementRef}>{end}</div>;
  return <div ref={elementRef}>{started ? `${count.toLocaleString()}${suffix}` : `0${suffix}`}</div>;
}

export default function Stats() {
  return (
    <section style={{ background: 'var(--surface-canvas)', padding: '0', borderBottom: '1px solid var(--color-zinc-hairline)' }}>
      <div className="container">
        <div className="stats-grid" style={{ overflow: 'hidden' }}>
          {STATS.map((s, i) => (
            <div
              key={i}
              className="reveal"
              style={{
                padding: '32px 24px',
                display: 'flex', flexDirection: 'column', gap: 6,
                borderRight: i < 3 ? '1px solid var(--color-zinc-hairline)' : 'none',
                transition: 'background 0.2s ease',
                cursor: 'default',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--color-carbon)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              <div className="text-stat">
                <CountUp end={s.num} />
              </div>
              <p className="font-primary text-sm fw-regular lh-15 text-muted">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .stats-grid > div { border-bottom: 1px solid var(--color-zinc-hairline) !important; }
          .stats-grid > div:nth-child(2n) { border-right: none !important; }
          .stats-grid > div:nth-last-child(-n+2) { border-bottom: none !important; }
        }
        @media (max-width: 480px) {
          .stats-grid { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </section>
  );
}
