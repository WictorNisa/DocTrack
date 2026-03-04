import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '80px 24px',
      }}
    >
      <h1
        style={{
          fontSize: 'clamp(4rem, 10vw, 8rem)',
          fontWeight: 900,
          background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: 1,
          marginBottom: 16,
        }}
      >
        404
      </h1>
      <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.6)', marginBottom: 32 }}>
        Page not found.
      </p>
      <Link
        to="/"
        style={{
          padding: '10px 24px',
          borderRadius: 8,
          background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
          color: '#fff',
          fontSize: 14,
          fontWeight: 600,
        }}
      >
        Back to Home
      </Link>
    </div>
  );
}
