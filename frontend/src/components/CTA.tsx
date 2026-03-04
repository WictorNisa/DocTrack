import { Link } from 'react-router-dom';
import { ArrowRight, Terminal } from 'lucide-react';
import FadeInSection from './FadeInSection';

export default function CTA() {
  return (
    <section id="get-started" style={{ padding: '100px 24px', position: 'relative', overflow: 'hidden' }}>
      {/* Centered ambient glow */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        height: 600,
        borderRadius: '50%',
        background: '#7c3aed',
        opacity: 0.07,
        filter: 'blur(120px)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        {/* Glow ring */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 500,
            height: 500,
            borderRadius: '50%',
            border: '1px solid rgba(124,58,237,0.12)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 340,
            height: 340,
            borderRadius: '50%',
            border: '1px solid rgba(6,182,212,0.1)',
            pointerEvents: 'none',
          }}
        />

        <FadeInSection>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 28,
              background: 'rgba(124,58,237,0.1)',
              border: '1px solid rgba(124,58,237,0.25)',
              borderRadius: 100,
              padding: '6px 18px',
              fontSize: 13,
              color: '#c084fc',
              fontWeight: 600,
            }}
          >
            <Terminal size={14} />
            Free & Open Source — Apache 2.0
          </div>

          <h2
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.6rem)',
              fontWeight: 800,
              color: '#fff',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              marginBottom: 20,
            }}
          >
            Start syncing docs{' '}
            <span className="text-gradient">in 30 seconds</span>
          </h2>

          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, marginBottom: 44, maxWidth: 560, margin: '0 auto 44px' }}>
            One npm install. No signup. No cloud account. Just run it and watch your
            documentation keep pace with your code — forever.
          </p>

          {/* Install snippet */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 16,
              background: 'rgba(0,0,0,0.4)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12,
              padding: '14px 20px',
              marginBottom: 36,
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              fontSize: 15,
            }}
          >
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>$</span>
            <span style={{ color: '#a78bfa' }}>npm</span>
            <span style={{ color: 'rgba(255,255,255,0.6)' }}>install -g</span>
            <span style={{ color: '#38bdf8' }}>doctrack</span>
          </div>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              to="/docs"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '14px 32px',
                borderRadius: 10,
                background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                color: '#fff',
                fontWeight: 700,
                fontSize: 16,
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 16px 40px rgba(124,58,237,0.5)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = '';
                (e.currentTarget as HTMLElement).style.boxShadow = '';
              }}
            >
              Read the Docs <ArrowRight size={17} />
            </Link>
          </div>
        </FadeInSection>
      </div>
    </section>
  );
}
