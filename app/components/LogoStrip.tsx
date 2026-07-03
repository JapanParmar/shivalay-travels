'use client';

const PARTNERS = [
  '✈ IRCTC Authorized', '🚌 RedBus Partner', '🚢 Cruise Authority', '🏨 MakeMyTrip',
  '🛡️ Insured Trips', '⚡ Instant PNR', '🇮🇳 India Tourism', '📱 24/7 WhatsApp',
  '💳 EMI Available', '🔒 Secure Booking', '✦ Lowest Fares', '🎯 100% Verified',
];

export default function LogoStrip() {
  const doubled = [...PARTNERS, ...PARTNERS];

  return (
    <section style={{
      borderTop: '1px solid var(--color-zinc-hairline)',
      borderBottom: '1px solid var(--color-zinc-hairline)',
      background: 'var(--color-carbon)',
      padding: '16px 0',
      overflow: 'hidden',
    }}>
      <div className="ticker-wrap">
        <div className="ticker-track">
          {doubled.map((name, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
              <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--color-highlighter-lime)', flexShrink: 0 }} />
              <span style={{
                fontFamily: 'var(--font-geist-mono)',
                fontSize: 12, fontWeight: 400,
                color: 'var(--color-steel-gray)',
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
