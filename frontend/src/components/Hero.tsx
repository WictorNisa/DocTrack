import { ArrowRight, Github, Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';
import Particles from './Particles';
import GlowOrb from './GlowOrb';
import { useEffect, useState } from 'react';

const TYPING_LINES = [
  '$ npm install -g doctrack',
  '$ doctrack init',
  '✓ Config written to .doctrack.yaml',
  '$ doctrack sync',
  'Scanning... 142 tracked, 7 changed',
  '  ✓ docs/api/handler.md   (820 tokens)',
  '  ✓ docs/db/queries.md    (614 tokens)',
  '✓ 7 docs updated. ~4,120 tokens.',
];

function TerminalTyper() {
  const [lines, setLines] = useState<string[]>([]);
  const [cursor, setCursor] = useState(true);

  useEffect(() => {
    let lineIdx = 0;
    let charIdx = 0;
    let current = '';
    const interval = setInterval(() => {
      if (lineIdx >= TYPING_LINES.length) {
        clearInterval(interval);
        return;
      }
      const target = TYPING_LINES[lineIdx];
      if (charIdx < target.length) {
        current += target[charIdx];
        charIdx++;
        setLines((prev) => {
          const next = [...prev];
          next[lineIdx] = current;
          return next;
        });
      } else {
        lineIdx++;
        charIdx = 0;
        current = '';
      }
    }, 35);
    const cursorInterval = setInterval(() => setCursor((c) => !c), 500);
    return () => { clearInterval(interval); clearInterval(cursorInterval); };
  }, []);

  const getColor = (line: string) => {
    if (line.startsWith('$')) return '#a78bfa';
    if (line.startsWith('✓')) return '#34d399';
    if (line.includes('tokens')) return '#38bdf8';
    return 'rgba(255,255,255,0.6)';
  };

  return (
    <div
      style={{
        background: '#0d0d0d',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 12,
        overflow: 'hidden',
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        fontSize: 13,
        lineHeight: 1.7,
        minHeight: 220,
      }}
    >
      {/* Terminal header */}
      <div style={{
        background: 'rgba(255,255,255,0.04)',
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57' }} />
        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ffbd2e' }} />
        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840' }} />
        <span style={{ marginLeft: 8, color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>doctrack — zsh</span>
      </div>
      <div style={{ padding: '16px 20px' }}>
        {lines.map((line, i) => (
          <div key={i} style={{ color: getColor(line) }}>
            {line}
            {i === lines.length - 1 && (
              <span style={{ opacity: cursor ? 1 : 0, color: '#7c3aed' }}>▋</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        paddingTop: 80,
      }}
    >
      <Particles />
      <GlowOrb color="#7c3aed" size={600} top="-100px" left="-150px" opacity={0.12} blur={100} />
      <GlowOrb color="#06b6d4" size={400} top="200px" right="-100px" opacity={0.08} blur={100} />

      {/* Grid background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          zIndex: 0,
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 40%, black 40%, transparent 100%)',
        }}
      />

      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '80px 24px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 64,
          alignItems: 'center',
          position: 'relative',
          zIndex: 2,
          width: '100%',
        }}
        className="hero-grid"
      >
        {/* Left — text */}
        <div>
          {/* Pill badge */}
          <div
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 24 }}
            className="animate-fade-up"
          >
            <span
              style={{
                background: 'rgba(124,58,237,0.15)',
                border: '1px solid rgba(124,58,237,0.3)',
                borderRadius: 100,
                padding: '4px 14px',
                fontSize: 13,
                color: '#c084fc',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <Terminal size={13} />
              npm install -g doctrack
            </span>
          </div>

          <h1
            className="animate-fade-up"
            style={{
              fontSize: 'clamp(2.4rem, 5vw, 4rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: '#fff',
              marginBottom: 24,
              animationDelay: '80ms',
            }}
          >
            Keep Docs in Sync{' '}
            <span className="text-gradient">Automatically</span>
          </h1>

          <p
            className="animate-fade-up"
            style={{
              fontSize: 18,
              color: 'rgba(255,255,255,0.55)',
              lineHeight: 1.7,
              marginBottom: 40,
              maxWidth: 480,
              animationDelay: '160ms',
            }}
          >
            DocTrack detects code changes, computes diffs, scans for secrets, and uses
            your AI provider to update your documentation — all locally, all under your control.
          </p>

          <div
            className="animate-fade-up"
            style={{ display: 'flex', gap: 14, flexWrap: 'wrap', animationDelay: '240ms' }}
          >
            <Link
              to="/docs"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '13px 28px',
                borderRadius: 10,
                background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
                color: '#fff',
                fontWeight: 700,
                fontSize: 15,
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 32px rgba(124,58,237,0.45)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              }}
            >
              Get Started <ArrowRight size={16} />
            </Link>
            <a
              href="https://github.com/WictorNisa/DocTrack"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '13px 28px',
                borderRadius: 10,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.8)',
                fontWeight: 600,
                fontSize: 15,
                transition: 'background 0.2s, border-color 0.2s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.2)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)';
                (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)';
              }}
            >
              <Github size={16} />
              View on GitHub
            </a>
          </div>
        </div>

        {/* Right — terminal */}
        <div className="animate-fade-up" style={{ animationDelay: '300ms' }}>
          <div
            style={{
              filter: 'drop-shadow(0 0 40px rgba(124,58,237,0.25))',
            }}
            className="animate-float"
          >
            <TerminalTyper />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: 32,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8,
          zIndex: 2,
        }}
      >
        <div
          style={{
            width: 24,
            height: 38,
            border: '2px solid rgba(255,255,255,0.15)',
            borderRadius: 12,
            display: 'flex',
            justifyContent: 'center',
            paddingTop: 6,
          }}
        >
          <div
            style={{
              width: 3,
              height: 8,
              background: 'rgba(255,255,255,0.4)',
              borderRadius: 2,
              animation: 'float 1.5s ease-in-out infinite',
            }}
          />
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
