'use client';

const PARTNERS = [
  'Taj Palaces', 'The Oberoi Group', 'SUJÁN Sher Bagh', 'Aman-i-Khas',
  'RAAS Devigarh', 'Mary Budden Estate', 'Glenburn Tea Estate', 'The Leela',
  'National Geographic', 'Condé Nast Traveller India', 'Travel + Leisure India', 'Virtuoso',
];

export default function LogoStrip() {
  const doubled = [...PARTNERS, ...PARTNERS];

  return (
    <section style={{
      borderTop: '1px solid var(--color-fog)',
      borderBottom: '1px solid var(--color-fog)',
      background: 'var(--color-snow)',
      padding: '24px 0',
      overflow: 'hidden',
    }}>
      <div className="ticker-wrap">
        <div className="ticker-track">
          {doubled.map((name, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              flexShrink: 0,
            }}>
              <div style={{
                width: 6, height: 6, borderRadius: '50%',
                background: 'var(--color-pebble)', flexShrink: 0,
              }} />
              <span style={{
                fontFamily: 'var(--font-cosmica)',
                fontSize: 14, fontWeight: 500,
                color: 'var(--color-ash)',
                whiteSpace: 'nowrap',
              }}>
                {name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
