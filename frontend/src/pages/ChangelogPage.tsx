import { Link } from 'react-router-dom';
import { ArrowLeft, Tag, Calendar, GitCommit, Sparkles, Bug, Wrench } from 'lucide-react';
import FadeInSection from '../components/FadeInSection';

interface Release {
  version: string;
  date: string;
  tag: 'latest' | 'stable' | null;
  changes: { type: 'feat' | 'fix' | 'refactor' | 'docs' | 'perf'; text: string }[];
}

const RELEASES: Release[] = [
  {
    version: '0.3.0',
    date: '2026-02-28',
    tag: 'latest',
    changes: [
      { type: 'feat', text: 'Confluence integration — push docs with --confluence flag' },
      { type: 'feat', text: 'Custom Goldmark renderer for Confluence Storage Format conversion' },
      { type: 'feat', text: 'Confluence page manifest at .doctrack/confluence-manifest.yaml' },
      { type: 'feat', text: 'Content hash deduplication — unchanged pages are skipped on push' },
      { type: 'feat', text: 'Rate limiting at 5 req/s for Confluence API compliance' },
      { type: 'fix', text: 'Fix --dry-run incorrectly counting unchanged files in token estimate' },
      { type: 'perf', text: 'Reduce AI prompt size by trimming unchanged context lines from diffs' },
    ],
  },
  {
    version: '0.2.0',
    date: '2026-02-15',
    tag: null,
    changes: [
      { type: 'feat', text: 'Secret scanner with 9 pattern types (AWS, OpenAI, GitHub, etc.)' },
      { type: 'feat', text: 'Automatic redaction to [REDACTED:type] before sending to AI' },
      { type: 'feat', text: 'Anthropic Claude provider support via official SDK' },
      { type: 'feat', text: 'base_url override for Ollama, Azure OpenAI, and LiteLLM' },
      { type: 'feat', text: '--dry-run mode: preview changes and estimate token cost' },
      { type: 'feat', text: '.aiignore file support for controlling AI-visible code' },
      { type: 'fix', text: 'Fix race condition in parallel file hashing worker pool' },
      { type: 'fix', text: 'Handle files deleted between scan and diff phase gracefully' },
      { type: 'refactor', text: 'Extract AI provider interface for better extensibility' },
      { type: 'docs', text: 'Add CLI reference documentation to website' },
    ],
  },
  {
    version: '0.1.0',
    date: '2026-01-30',
    tag: null,
    changes: [
      { type: 'feat', text: 'Initial release of DocTrack' },
      { type: 'feat', text: 'Git-aware file change detection with SHA-256 hashing' },
      { type: 'feat', text: 'Parallel file hashing with bounded worker pool (runtime.NumCPU)' },
      { type: 'feat', text: 'Unified diff computation (git diff with go-diff fallback)' },
      { type: 'feat', text: 'OpenAI integration for AI-powered doc generation' },
      { type: 'feat', text: 'Marker-based doc format (user sections never overwritten)' },
      { type: 'feat', text: 'YAML frontmatter with source_hash for stale detection' },
      { type: 'feat', text: 'Interactive init wizard with charmbracelet/huh' },
      { type: 'feat', text: 'npm distribution via platform-specific binary packages' },
      { type: 'feat', text: 'Cross-platform support: macOS ARM/x64, Linux x64, Windows x64' },
    ],
  },
];

function TypeBadge({ type }: { type: string }) {
  const map: Record<string, { color: string; icon: typeof Sparkles; label: string }> = {
    feat:     { color: '#34d399', icon: Sparkles, label: 'Feature' },
    fix:      { color: '#f59e0b', icon: Bug, label: 'Fix' },
    refactor: { color: '#818cf8', icon: Wrench, label: 'Refactor' },
    docs:     { color: '#38bdf8', icon: Tag, label: 'Docs' },
    perf:     { color: '#c084fc', icon: Sparkles, label: 'Perf' },
  };
  const m = map[type] || map.feat;
  const Icon = m.icon;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      fontSize: 11, fontWeight: 700, letterSpacing: '0.05em',
      textTransform: 'uppercase', color: m.color,
      background: `${m.color}14`, border: `1px solid ${m.color}30`,
      borderRadius: 4, padding: '2px 8px',
    }}>
      <Icon size={10} /> {m.label}
    </span>
  );
}

export default function ChangelogPage() {
  return (
    <div style={{ paddingTop: 80 }}>
      {/* Header */}
      <div style={{
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        padding: '40px 24px 48px',
        background: 'linear-gradient(180deg, rgba(6,182,212,0.04) 0%, transparent 100%)',
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 500,
              marginBottom: 24, transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#c084fc'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)'; }}
          >
            <ArrowLeft size={14} /> Back to Home
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(52,211,153,0.2))',
              border: '1px solid rgba(6,182,212,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <GitCommit size={20} color="#38bdf8" />
            </div>
            <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em' }}>
              Changelog
            </h1>
          </div>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: 'rgba(255,255,255,0.6)' }}>
            All notable changes to DocTrack. We follow <a
              href="https://semver.org"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#38bdf8', borderBottom: '1px solid rgba(56,189,248,0.3)', transition: 'border-color 0.2s' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#38bdf8'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(56,189,248,0.3)'; }}
            >Semantic Versioning</a>.
          </p>
        </div>
      </div>

      {/* Releases */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px 80px' }}>
        {/* Timeline line */}
        <div style={{ position: 'relative' }}>
          <div style={{
            position: 'absolute',
            left: 19,
            top: 0,
            bottom: 0,
            width: 1,
            background: 'rgba(255,255,255,0.06)',
          }} />

          {RELEASES.map((release, ri) => (
            <FadeInSection key={release.version} delay={ri * 80}>
              <div style={{ position: 'relative', paddingLeft: 52, marginBottom: 56 }}>
                {/* Timeline dot */}
                <div style={{
                  position: 'absolute',
                  left: 12,
                  top: 6,
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  background: ri === 0 ? '#7c3aed' : 'rgba(255,255,255,0.1)',
                  border: ri === 0 ? '3px solid rgba(124,58,237,0.3)' : '2px solid rgba(255,255,255,0.1)',
                  boxShadow: ri === 0 ? '0 0 12px rgba(124,58,237,0.5)' : 'none',
                }} />

                {/* Version header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
                  <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', margin: 0 }}>
                    v{release.version}
                  </h2>
                  {release.tag && (
                    <span style={{
                      fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
                      background: 'rgba(124,58,237,0.15)', color: '#c084fc',
                      border: '1px solid rgba(124,58,237,0.3)',
                      borderRadius: 4, padding: '2px 8px', letterSpacing: '0.05em',
                    }}>
                      {release.tag}
                    </span>
                  )}
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>
                    <Calendar size={12} /> {release.date}
                  </span>
                </div>

                {/* Changes list */}
                <div style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 12,
                  padding: '4px 0',
                  overflow: 'hidden',
                }}>
                  {release.changes.map((change, ci) => (
                    <div
                      key={ci}
                      style={{
                        display: 'flex', alignItems: 'flex-start', gap: 12,
                        padding: '10px 16px',
                        borderBottom: ci < release.changes.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                      }}
                    >
                      <div style={{ flexShrink: 0, paddingTop: 2 }}>
                        <TypeBadge type={change.type} />
                      </div>
                      <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>
                        {change.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </div>
  );
}
