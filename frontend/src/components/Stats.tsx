import AnimatedCounter from './AnimatedCounter';
import FadeInSection from './FadeInSection';

const STATS = [
  { target: 100, suffix: '%', label: 'Local & Private', desc: 'No data sent to our servers. Your code and API key stay on your machine.' },
  { target: 256, prefix: 'SHA-', suffix: '', label: 'Secure Hashing', desc: 'Content-addressed file tracking avoids unnecessary AI calls.' },
  { target: 3, suffix: 'x', label: 'Concurrent API Calls', desc: 'Bounded parallel processing keeps syncs fast without burning rate limits.' },
  { target: 50, suffix: 'ms', label: 'Startup Time', desc: 'Lazy initialization — DocTrack is always snappy, never sluggish.' },
];

export default function Stats() {
  return (
    <section style={{ padding: '80px 24px', position: 'relative' }}>
      {/* Divider */}
      <div
        style={{
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(124,58,237,0.4), rgba(6,182,212,0.3), transparent)',
          marginBottom: 80,
          maxWidth: 1200,
          margin: '0 auto 80px',
        }}
      />

      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 2,
          }}
        >
          {STATS.map((s, i) => (
            <FadeInSection key={s.label} delay={i * 80}>
              <div
                className="glass card-hover"
                style={{
                  padding: '36px 28px',
                  borderRadius: 16,
                  textAlign: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    fontSize: 'clamp(2.4rem, 4vw, 3.2rem)',
                    fontWeight: 800,
                    letterSpacing: '-0.04em',
                    marginBottom: 8,
                    lineHeight: 1,
                  }}
                  className="text-gradient"
                >
                  <AnimatedCounter target={s.target} suffix={s.suffix} prefix={s.prefix ?? ''} />
                </div>
                <div style={{ fontWeight: 700, fontSize: 15, color: '#fff', marginBottom: 8 }}>
                  {s.label}
                </div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>
                  {s.desc}
                </div>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  );
}
