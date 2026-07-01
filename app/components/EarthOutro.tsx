'use client';

export default function EarthOutro() {
  return (
    <section 
      style={{ 
        position: 'relative', 
        padding: '120px 0', 
        background: 'var(--color-obsidian)', 
        overflow: 'hidden' 
      }}
      onMouseEnter={e => {
        const bg = e.currentTarget.querySelector('.outro-bg') as HTMLElement;
        if (bg) bg.style.transform = 'scale(1.06)';
      }}
      onMouseLeave={e => {
        const bg = e.currentTarget.querySelector('.outro-bg') as HTMLElement;
        if (bg) bg.style.transform = 'scale(1)';
      }}
    >
      {/* Background Image with Zoom transition */}
      <div 
        className="outro-bg"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/images/goa.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
          opacity: 0.25,
          zIndex: 1
        }}
      />

      {/* Radial ambient glow overlay */}
      <div 
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 50%, transparent 20%, rgba(9, 9, 11, 0.95) 100%)',
          zIndex: 2
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 3 }}>
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          textAlign: 'center', gap: 32, maxWidth: 600, margin: '0 auto',
        }}>
          {/* Eyebrow */}
          <div className="badge reveal" style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
            Begin your story
          </div>

          <h2 className="reveal" style={{
            fontFamily: 'var(--font-cosmica)',
            fontSize: 'clamp(36px, 5vw, 56px)',
            fontWeight: 700,
            color: '#fff',
            lineHeight: 1.1,
          }}>
            Your Indian Odyssey<br />
            <span style={{ color: 'var(--color-orchid-flash)' }}>starts here.</span>
          </h2>

          <p className="reveal" style={{
            fontFamily: 'var(--font-cosmica)',
            fontSize: 16, fontWeight: 300,
            color: 'rgba(255,255,255,0.65)',
            lineHeight: 1.7,
          }}>
            Every extraordinary journey begins with a single conversation. Tell us where you want to go — we'll handle every extraordinary detail.
          </p>

          {/* Email form */}
          <form
            onSubmit={e => { e.preventDefault(); document.getElementById('planner')?.scrollIntoView({ behavior: 'smooth' }); }}
            style={{
              display: 'flex', gap: 8, width: '100%', maxWidth: 440,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 'var(--radius-pill)',
              padding: 6,
              backdropFilter: 'blur(8px)',
            }}
          >
            <input
              type="email"
              placeholder="Enter your email"
              style={{
                flex: 1, background: 'none', border: 'none', outline: 'none',
                fontFamily: 'var(--font-cosmica)', fontSize: 14,
                color: '#fff', padding: '8px 12px',
              }}
            />
            <button type="submit" className="btn-primary" style={{ flexShrink: 0, fontSize: 13, padding: '10px 20px', background: 'var(--color-orchid-flash)' }}>
              Plan my journey
            </button>
          </form>

          {/* Secondary CTAs */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginTop: 8 }}>
            <a
              href="https://wa.me/+1234567890"
              target="_blank" rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                fontFamily: 'var(--font-cosmica)', fontSize: 14, fontWeight: 500,
                color: 'rgba(255,255,255,0.6)', textDecoration: 'none',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp a travel expert
            </a>
            <span style={{ color: 'rgba(255,255,255,0.2)', lineHeight: 1 }}>·</span>
            <a
              href="mailto:journeys@lumiere.travel"
              style={{
                fontFamily: 'var(--font-cosmica)', fontSize: 14, fontWeight: 500,
                color: 'rgba(255,255,255,0.6)', textDecoration: 'none',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}
            >
              Schedule a consultation
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
