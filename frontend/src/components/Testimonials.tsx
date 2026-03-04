import FadeInSection from './FadeInSection';

const QUOTES = [
  {
    text: "DocTrack saved us hours every sprint. We used to forget updating docs after refactors. Now it just happens.",
    author: 'Sarah K.',
    role: 'Staff Engineer @ FinTech startup',
    avatar: 'SK',
    accent: '#7c3aed',
  },
  {
    text: "The secret scanner alone is worth it. Caught an API key in a diff before it ever left my machine.",
    author: 'Marco D.',
    role: 'Senior Backend Developer',
    avatar: 'MD',
    accent: '#ef4444',
  },
  {
    text: "Loved that it works with Ollama locally. Full AI-powered docs with zero data leaving our network.",
    author: 'Priya M.',
    role: 'Platform Eng Lead @ Enterprise',
    avatar: 'PM',
    accent: '#06b6d4',
  },
  {
    text: "The Confluence integration is a game changer for our team. One flag and docs are live in the wiki.",
    author: 'James T.',
    role: 'DevRel @ OSS Project',
    avatar: 'JT',
    accent: '#10b981',
  },
  {
    text: "Sub-50ms startup time means I added it to my git pre-push hook without anyone noticing.",
    author: 'Elena W.',
    role: 'Full-Stack Engineer',
    avatar: 'EW',
    accent: '#f59e0b',
  },
  {
    text: "The marker-based doc format is genius. AI updates the auto section, my notes stay forever.",
    author: 'Chris H.',
    role: 'Open Source Contributor',
    avatar: 'CH',
    accent: '#c084fc',
  },
];

function QuoteCard({ q, delay }: { q: typeof QUOTES[0]; delay: number }) {
  return (
    <FadeInSection delay={delay}>
      <div
        className="glass card-hover"
        style={{
          padding: '24px',
          borderRadius: 16,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        {/* Stars */}
        <div style={{ display: 'flex', gap: 3 }} role="img" aria-label="5 out of 5 stars">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} style={{ color: '#f59e0b', fontSize: 14 }}>★</span>
          ))}
        </div>
        {/* Text */}
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.75, flex: 1 }}>
          "{q.text}"
        </p>
        {/* Author */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              background: `${q.accent}20`,
              border: `1px solid ${q.accent}40`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 700,
              color: q.accent,
              flexShrink: 0,
            }}
          >
            {q.avatar}
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{q.author}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{q.role}</div>
          </div>
        </div>
      </div>
    </FadeInSection>
  );
}

export default function Testimonials() {
  return (
    <section style={{ padding: '100px 24px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <FadeInSection>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <span
              style={{
                display: 'inline-block',
                background: 'rgba(245,158,11,0.1)',
                border: '1px solid rgba(245,158,11,0.2)',
                borderRadius: 100,
                padding: '4px 16px',
                fontSize: 13,
                color: '#fbbf24',
                fontWeight: 600,
                marginBottom: 20,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              Loved by developers
            </span>
            <h2
              style={{
                fontSize: 'clamp(1.8rem, 4vw, 3rem)',
                fontWeight: 800,
                color: '#fff',
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
              }}
            >
              Don't take our word for it
            </h2>
          </div>
        </FadeInSection>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 18,
          }}
        >
          {QUOTES.map((q, i) => (
            <QuoteCard key={q.author} q={q} delay={i * 60} />
          ))}
        </div>
      </div>
    </section>
  );
}
