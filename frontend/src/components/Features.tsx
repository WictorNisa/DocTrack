import { type ReactNode } from 'react';
import { GitBranch, Shield, Zap, Cloud, Cpu, Code2, Eye, Lock } from 'lucide-react';
import FadeInSection from './FadeInSection';
import GlowOrb from './GlowOrb';

interface Feature {
  icon: ReactNode;
  title: string;
  description: string;
  accent: string;
}

const FEATURES: Feature[] = [
  {
    icon: <GitBranch size={22} />,
    title: 'Git-Aware Change Detection',
    description:
      'Uses git diff when available — 100× faster than filesystem walks. Falls back to SHA-256 content hashing with mtime pre-filtering.',
    accent: '#7c3aed',
  },
  {
    icon: <Shield size={22} />,
    title: 'Built-In Secret Scanner',
    description:
      'Every diff is scanned and redacted before leaving your machine. Catches AWS keys, OpenAI tokens, private keys, connection strings, and more.',
    accent: '#ef4444',
  },
  {
    icon: <Zap size={22} />,
    title: 'BYOK — Your AI Key',
    description:
      'Point DocTrack at OpenAI, Anthropic, Ollama, or any OpenAI-compatible endpoint. You own your API key. Zero vendor lock-in.',
    accent: '#f59e0b',
  },
  {
    icon: <Cloud size={22} />,
    title: 'Confluence Push',
    description:
      'Run doctrack sync --confluence to automatically push updated docs to Confluence. Content-hash deduplication skips unchanged pages.',
    accent: '#06b6d4',
  },
  {
    icon: <Cpu size={22} />,
    title: 'Parallel Processing',
    description:
      'Worker pool bounded by runtime.NumCPU() for hashing. Max 3 concurrent AI calls with exponential backoff and Retry-After support.',
    accent: '#10b981',
  },
  {
    icon: <Code2 size={22} />,
    title: 'Marker-Based Doc Format',
    description:
      'HTML comment markers separate AI-generated content from your hand-written sections. User text is NEVER overwritten.',
    accent: '#818cf8',
  },
  {
    icon: <Eye size={22} />,
    title: 'Dry Run Mode',
    description:
      'Preview what would sync: files changed, estimated tokens, projected cost. Zero API calls until you are ready.',
    accent: '#c084fc',
  },
  {
    icon: <Lock size={22} />,
    title: '.aiignore Support',
    description:
      'Works like .gitignore. Control exactly what code the AI ever sees. Default rules for `.env`, `*.pem`, `*.key`, and secrets dirs.',
    accent: '#f43f5e',
  },
];

function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  return (
    <FadeInSection delay={index * 60}>
      <div
        className="glass card-hover"
        style={{
          padding: '28px 24px',
          borderRadius: 16,
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 10,
            background: `${feature.accent}18`,
            border: `1px solid ${feature.accent}30`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: feature.accent,
            marginBottom: 16,
          }}
        >
          {feature.icon}
        </div>
        <h3 style={{ fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 10, lineHeight: 1.3 }}>
          {feature.title}
        </h3>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>
          {feature.description}
        </p>
        {/* Subtle glow on hover */}
        <div
          style={{
            position: 'absolute',
            bottom: -40,
            right: -40,
            width: 100,
            height: 100,
            background: feature.accent,
            opacity: 0.04,
            borderRadius: '50%',
            filter: 'blur(30px)',
            pointerEvents: 'none',
          }}
        />
      </div>
    </FadeInSection>
  );
}

export default function Features() {
  return (
    <section id="features" style={{ padding: '100px 24px', position: 'relative' }}>
      <GlowOrb color="#7c3aed" size={400} top="10%" right="-10%" opacity={0.06} blur={100} />
      <GlowOrb color="#06b6d4" size={300} bottom="10%" left="-5%" opacity={0.06} blur={80} />
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Section header */}
        <FadeInSection>
          <div style={{ textAlign: 'center', marginBottom: 70 }}>
            <span
              style={{
                display: 'inline-block',
                background: 'rgba(124,58,237,0.12)',
                border: '1px solid rgba(124,58,237,0.25)',
                borderRadius: 100,
                padding: '4px 16px',
                fontSize: 13,
                color: '#c084fc',
                fontWeight: 600,
                marginBottom: 20,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              Features
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
              Everything you need,{' '}
              <span className="text-gradient">nothing you don't</span>
            </h2>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.5)', maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
              DocTrack is a lightweight Go CLI—no server infrastructure, no licensing, no telemetry.
              Pure local tooling that respects your workflow.
            </p>
          </div>
        </FadeInSection>

        {/* Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 18,
          }}
        >
          {FEATURES.map((f, i) => (
            <FeatureCard key={f.title} feature={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
