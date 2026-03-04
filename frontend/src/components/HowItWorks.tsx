import FadeInSection from './FadeInSection';
import GlowOrb from './GlowOrb';

const STEPS = [
  {
    num: '01',
    title: 'Install & Init',
    description:
      'Run npm install -g doctrack, then doctrack init to walk through an interactive setup wizard. DocTrack auto-detects your project type and pre-populates include patterns.',
    code: '$ doctrack init\n? Provider: OpenAI\n? API Key: sk-... (validated)\n? Docs dir: docs/\n✓ .doctrack.yaml written (0600)',
    accent: '#7c3aed',
  },
  {
    num: '02',
    title: 'Detect Changes',
    description:
      'DocTrack scans your source tree using git-aware change detection. SHA-256 hashes are compared against the last snapshot — only truly changed files proceed.',
    code: 'Scanning... 142 tracked, 7 changed\n  ● src/api/handler.go\n  ● src/db/queries.go\n  ○ src/config.go (unchanged)',
    accent: '#06b6d4',
  },
  {
    num: '03',
    title: 'Scan & Redact',
    description:
      'Every diff is run through the built-in secret scanner before anything else. Detected secrets are redacted to [REDACTED:type] and a warning is printed to stderr.',
    code: '⚠ 1 secret redacted in src/db/queries.go\n  → OPENAI_API_KEY → [REDACTED:openai]',
    accent: '#ef4444',
  },
  {
    num: '04',
    title: 'AI-Powered Docs',
    description:
      'Redacted diffs and existing doc content are sent to your AI provider of choice. The AI produces only the auto-section content — your hand-written notes are never touched.',
    code: 'Generating (max 3 concurrent)...\n  ✓ docs/api/handler.md   (820 tokens)\n  ✓ docs/db/queries.md    (614 tokens)\n✓ 7 docs updated. ~4,120 tokens.',
    accent: '#10b981',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" style={{ padding: '100px 24px', position: 'relative' }}>
      <GlowOrb color="#818cf8" size={500} top="20%" left="50%" opacity={0.05} blur={120} />
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <FadeInSection>
          <div style={{ textAlign: 'center', marginBottom: 72 }}>
            <span
              style={{
                display: 'inline-block',
                background: 'rgba(6,182,212,0.1)',
                border: '1px solid rgba(6,182,212,0.2)',
                borderRadius: 100,
                padding: '4px 16px',
                fontSize: 13,
                color: '#38bdf8',
                fontWeight: 600,
                marginBottom: 20,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              How It Works
            </span>
            <h2
              style={{
                fontSize: 'clamp(1.8rem, 4vw, 3rem)',
                fontWeight: 800,
                color: '#fff',
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
                marginBottom: 18,
              }}
            >
              From code change to{' '}
              <span className="text-gradient">docs updated</span>
            </h2>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.5)', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
              One command. Four steps. Fully automated docs that never drift from your code.
            </p>
          </div>
        </FadeInSection>

        {/* Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
          {STEPS.map((step, i) => (
            <FadeInSection key={step.num} delay={i * 80}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 48,
                  alignItems: 'center',
                }}
                className="step-grid"
              >
                {/* Text side */}
                <div style={{ order: i % 2 === 1 ? 2 : undefined }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 800,
                        letterSpacing: '0.15em',
                        color: step.accent,
                        fontFamily: 'monospace',
                      }}
                    >
                      STEP {step.num}
                    </span>
                    <div style={{ flex: 1, height: 1, background: `${step.accent}30` }} />
                  </div>
                  <h3
                    style={{
                      fontSize: 'clamp(1.4rem, 2.5vw, 2rem)',
                      fontWeight: 700,
                      color: '#fff',
                      letterSpacing: '-0.02em',
                      marginBottom: 16,
                      lineHeight: 1.2,
                    }}
                  >
                    {step.title}
                  </h3>
                  <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.55)', lineHeight: 1.75 }}>
                    {step.description}
                  </p>
                </div>

                {/* Code side */}
                <div style={{ order: i % 2 === 1 ? 1 : undefined }}>
                  <div
                    style={{
                      background: '#0a0a0a',
                      border: `1px solid ${step.accent}25`,
                      borderRadius: 12,
                      overflow: 'hidden',
                      boxShadow: `0 0 40px ${step.accent}10`,
                    }}
                  >
                    <div
                      style={{
                        background: `${step.accent}08`,
                        padding: '10px 16px',
                        borderBottom: `1px solid ${step.accent}15`,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                      }}
                    >
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: step.accent, opacity: 0.6 }} />
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' }}>terminal</span>
                    </div>
                    <pre
                      style={{
                        padding: '20px 22px',
                        fontSize: 13,
                        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                        color: 'rgba(255,255,255,0.7)',
                        lineHeight: 1.8,
                        margin: 0,
                        overflowX: 'auto',
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {step.code}
                    </pre>
                  </div>
                </div>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .step-grid {
            grid-template-columns: 1fr !important;
          }
          .step-grid > * { order: 0 !important; }
        }
      `}</style>
    </section>
  );
}
