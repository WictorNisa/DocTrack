import { Link } from 'react-router-dom';
import { ArrowRight, Github } from 'lucide-react';
import FadeInSection from './FadeInSection';
import GlowOrb from './GlowOrb';

const providerGridStyle = `
  @media (max-width: 768px) {
    .providers-grid { grid-template-columns: 1fr !important; }
  }
`;

const PROVIDERS = [
  { name: 'OpenAI', color: '#10a37f' },
  { name: 'Anthropic', color: '#d97706' },
  { name: 'Ollama', color: '#818cf8' },
  { name: 'Azure OpenAI', color: '#0078d4' },
  { name: 'LiteLLM', color: '#c084fc' },
  { name: 'Any OpenAI-compatible API', color: '#38bdf8' },
];

export default function Providers() {
  return (
    <section id="providers" style={{ padding: '80px 24px', position: 'relative' }}>
      <style>{providerGridStyle}</style>
      <GlowOrb color="#7c3aed" size={600} top="-10%" left="30%" opacity={0.06} blur={120} />
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Horizontal divider */}
        <div
          style={{
            height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)',
            marginBottom: 80,
          }}
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 64,
            alignItems: 'center',
          }}
          className="providers-grid"
        >
          {/* Left */}
          <FadeInSection>
            <span
              style={{
                display: 'inline-block',
                background: 'rgba(16,163,127,0.1)',
                border: '1px solid rgba(16,163,127,0.2)',
                borderRadius: 100,
                padding: '4px 16px',
                fontSize: 13,
                color: '#34d399',
                fontWeight: 600,
                marginBottom: 24,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              Bring Your Own Key
            </span>
            <h2
              style={{
                fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
                fontWeight: 800,
                color: '#fff',
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
                marginBottom: 20,
              }}
            >
              Works with every{' '}
              <span className="text-gradient">AI provider</span>
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.55)', lineHeight: 1.75, marginBottom: 32 }}>
              DocTrack is provider-agnostic. Use the base_url field to point at any
              OpenAI-compatible endpoint — cloud or local. Your key is stored locally,
              never transmitted to DocTrack servers (there are none).
            </p>

            <div style={{ display: 'flex', gap: 12 }}>
              <Link
                to="/docs"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '11px 24px',
                  borderRadius: 8,
                  background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: 14,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(124,58,237,0.4)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = '';
                  (e.currentTarget as HTMLElement).style.boxShadow = '';
                }}
              >
                Get Started <ArrowRight size={15} />
              </Link>
              <a
                href="https://github.com/WictorNisa/DocTrack"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '11px 24px',
                  borderRadius: 8,
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.7)',
                  fontWeight: 600,
                  fontSize: 14,
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)';
                }}
              >
                <Github size={15} /> Star on GitHub
              </a>
            </div>
          </FadeInSection>

          {/* Right — provider pills */}
          <FadeInSection delay={100}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 12,
              }}
            >
              {PROVIDERS.map((p) => (
                <div
                  key={p.name}
                  className="glass card-hover"
                  style={{
                    padding: '16px 18px',
                    borderRadius: 12,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: p.color,
                      flexShrink: 0,
                      boxShadow: `0 0 8px ${p.color}80`,
                    }}
                  />
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
                    {p.name}
                  </span>
                </div>
              ))}
            </div>

            {/* Config snippet */}
            <div
              style={{
                marginTop: 16,
                background: '#0a0a0a',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 12,
                padding: '16px 18px',
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                fontSize: 12,
                lineHeight: 1.8,
                color: 'rgba(255,255,255,0.55)',
              }}
            >
              <span style={{ color: 'rgba(255,255,255,0.25)' }}># .doctrack.yaml</span>
              {'\n'}<span style={{ color: '#818cf8' }}>provider</span>
              <span style={{ color: 'rgba(255,255,255,0.4)' }}>: </span>
              <span style={{ color: '#34d399' }}>openai</span>
              {'\n'}<span style={{ color: '#818cf8' }}>model</span>
              <span style={{ color: 'rgba(255,255,255,0.4)' }}>: </span>
              <span style={{ color: '#34d399' }}>gpt-4o-mini</span>
              {'\n'}<span style={{ color: '#818cf8' }}>providers</span>
              <span style={{ color: 'rgba(255,255,255,0.4)' }}>:</span>
              {'\n'}{'  '}<span style={{ color: '#818cf8' }}>base_url</span>
              <span style={{ color: 'rgba(255,255,255,0.4)' }}>: </span>
              <span style={{ color: '#38bdf8' }}>http://localhost:11434/v1</span>
              {'\n'}<span style={{ color: '#818cf8' }}>api_key</span>
              <span style={{ color: 'rgba(255,255,255,0.4)' }}>: </span>
              <span style={{ color: '#fbbf24' }}>env:OPENAI_API_KEY</span>
            </div>
          </FadeInSection>
        </div>
      </div>
    </section>
  );
}
