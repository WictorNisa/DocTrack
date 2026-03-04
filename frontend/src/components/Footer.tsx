import { Link } from 'react-router-dom';
import { GitBranch, Github, Twitter } from 'lucide-react';

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

const LINKS: Record<string, FooterLink[]> = {
  Tool: [
    { label: 'Features', href: '/#features' },
    { label: 'How It Works', href: '/#how-it-works' },
  ],
  Docs: [
    { label: 'Quick Start', href: '/docs#quick-start' },
    { label: 'Configuration', href: '/docs#configuration' },
    { label: 'CLI Reference', href: '/docs#cli-reference' },
    { label: 'AI Providers', href: '/docs#ai-providers' },
  ],
  Community: [
    { label: 'GitHub', href: 'https://github.com/wictorn/doctrack', external: true },
    { label: 'Discussions', href: 'https://github.com/wictorn/doctrack/discussions', external: true },
    { label: 'Issues', href: 'https://github.com/wictorn/doctrack/issues', external: true },
  ],
};

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid rgba(255,255,255,0.07)',
        padding: '64px 24px 40px',
        position: 'relative',
      }}
    >
      {/* Top gradient line */}
      <div
        style={{
          position: 'absolute',
          top: -1,
          left: 0,
          right: 0,
          height: 1,
          background: 'linear-gradient(90deg, transparent, #7c3aed, #06b6d4, transparent)',
        }}
      />

      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr',
            gap: 48,
            marginBottom: 56,
          }}
          className="footer-grid"
        >
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <GitBranch size={17} color="#fff" />
              </div>
              <span style={{ fontWeight: 700, fontSize: 17, color: '#fff', letterSpacing: '-0.02em' }}>
                DocTrack
              </span>
            </div>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.75, maxWidth: 280, marginBottom: 20 }}>
              Keep your docs in sync with your code. Automatically. Locally. Privately.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              {[
                { Icon: Github, href: 'https://github.com/wictorn/doctrack', label: 'GitHub' },
                { Icon: Twitter, href: 'https://x.com/doctrack', label: 'Twitter' },
              ].map(({ Icon, href, label }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'rgba(255,255,255,0.5)',
                    transition: 'background 0.2s, color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(124,58,237,0.15)';
                    (e.currentTarget as HTMLElement).style.color = '#c084fc';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
                    (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)';
                  }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([category, links]) => (
            <div key={category}>
              <h4 style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 16, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                {category}
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {links.map((l) => (
                  <li key={l.label}>
                    {l.external ? (
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: 14,
                          color: 'rgba(255,255,255,0.45)',
                          transition: 'color 0.2s',
                        }}
                        onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#fff')}
                        onMouseLeave={(e) => ((e.target as HTMLElement).style.color = 'rgba(255,255,255,0.45)')}
                      >
                        {l.label}
                      </a>
                    ) : (
                      <Link
                        to={l.href}
                        style={{
                          fontSize: 14,
                          color: 'rgba(255,255,255,0.45)',
                          transition: 'color 0.2s',
                        }}
                        onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#fff')}
                        onMouseLeave={(e) => ((e.target as HTMLElement).style.color = 'rgba(255,255,255,0.45)')}
                      >
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.06)',
            paddingTop: 24,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
            © 2026 DocTrack contributors. Apache 2.0 License.
          </span>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>
            Free forever. No server-side infrastructure.
          </span>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 560px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
