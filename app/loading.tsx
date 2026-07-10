export default function Loading() {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#0c0c0c',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      fontFamily: 'DM Sans, sans-serif',
      color: '#fff',
      gap: 20,
    }}>
      {/* Premium glowing logo circle */}
      <div style={{
        position: 'relative',
        width: 60,
        height: 60,
        borderRadius: '50%',
        background: 'rgba(163, 230, 53, 0.1)',
        border: '1px solid rgba(163, 230, 53, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 0 20px rgba(163, 230, 53, 0.15)',
        animation: 'pulseGlow 2s infinite ease-in-out',
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#a3e635" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#a3e635' }}>
          <path d="M22 2L15 22L11 13L2 9L22 2Z" />
        </svg>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
        <h3 style={{ fontSize: 16, fontWeight: 500, letterSpacing: '0.05em', color: '#fff', margin: 0 }}>
          SHIVALAY TRAVELS
        </h3>
        <p style={{ fontSize: 12, color: '#666', margin: 0, letterSpacing: '0.02em' }}>
          Loading your Indian Odyssey...
        </p>
      </div>

      {/* Progress Line */}
      <div style={{
        width: 140,
        height: 2,
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 2,
        overflow: 'hidden',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          height: '100%',
          width: '50%',
          background: '#a3e635',
          borderRadius: 2,
          animation: 'loadProgress 1.5s infinite ease-in-out',
        }} />
      </div>

      <style>{`
        @keyframes pulseGlow {
          0%, 100% { transform: scale(1); box-shadow: 0 0 20px rgba(163, 230, 53, 0.15); }
          50% { transform: scale(1.05); box-shadow: 0 0 30px rgba(163, 230, 53, 0.3); }
        }
        @keyframes loadProgress {
          0% { left: -50%; width: 30%; }
          50% { width: 50%; }
          100% { left: 100%; width: 30%; }
        }
      `}</style>
    </div>
  );
}
