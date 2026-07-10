'use client';

export default function AdminLoader({ message = 'Loading details...' }: { message?: string }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 24px',
      minHeight: '300px',
      width: '100%',
      gap: 16,
      background: 'rgba(255, 255, 255, 0.01)',
      border: '1px solid rgba(255, 255, 255, 0.04)',
      borderRadius: '12px',
    }}>
      <div style={{
        position: 'relative',
        width: 42,
        height: 42,
      }}>
        {/* Outer Ring */}
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          border: '3px solid rgba(255, 0, 0, 0.08)',
        }} />
        {/* Spinning Segment */}
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          border: '3px solid transparent',
          borderTopColor: '#ff0000',
          animation: 'adminSpin 0.8s linear infinite',
        }} />
      </div>
      <p style={{
        margin: 0,
        fontSize: '13px',
        color: '#666',
        letterSpacing: '0.02em',
        fontFamily: 'DM Sans, sans-serif',
      }}>
        {message}
      </p>

      <style>{`
        @keyframes adminSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
