import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Book, Zap, Settings, Terminal, Shield, Cloud,
  Copy, Check, GitBranch, ArrowLeft
} from 'lucide-react';


type SectionId = 'quick-start' | 'configuration' | 'cli-reference' | 'ai-providers' | 'secret-scanner' | 'confluence';

const SIDEBAR: { id: SectionId; label: string; icon: typeof Book }[] = [
  { id: 'quick-start', label: 'Quick Start', icon: Zap },
  { id: 'configuration', label: 'Configuration', icon: Settings },
  { id: 'cli-reference', label: 'CLI Reference', icon: Terminal },
  { id: 'ai-providers', label: 'AI Providers', icon: Cloud },
  { id: 'secret-scanner', label: 'Secret Scanner', icon: Shield },
  { id: 'confluence', label: 'Confluence', icon: GitBranch },
];

function CodeBlock({ children, title }: { children: string; title?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    try { navigator.clipboard.writeText(children.trim()); } catch (_) { /* clipboard unavailable */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div style={{ marginBottom: 24, borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)' }}>
      {title && (
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          padding: '8px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>{title}</span>
          <button
            onClick={copy}
            style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12 }}
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      )}
      <pre style={{
        background: '#0a0a0a',
        padding: '16px 20px',
        fontSize: 13,
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        color: 'rgba(255,255,255,0.7)',
        lineHeight: 1.8,
        margin: 0,
        overflowX: 'auto',
        whiteSpace: 'pre',
      }}>
        {children.trim()}
      </pre>
    </div>
  );
}

function Heading({ id, children }: { id: string; children: string }) {
  return (
    <h2
      id={id}
      style={{
        fontSize: 'clamp(1.5rem, 3vw, 2rem)',
        fontWeight: 800,
        color: '#fff',
        letterSpacing: '-0.02em',
        marginBottom: 16,
        marginTop: 64,
        paddingTop: 24,
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {children}
    </h2>
  );
}

function SubHeading({ children }: { children: string }) {
  return (
    <h3 style={{ fontSize: 18, fontWeight: 700, color: '#e2e8f0', marginBottom: 12, marginTop: 32 }}>
      {children}
    </h3>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 15, lineHeight: 1.8, color: 'rgba(255,255,255,0.6)', marginBottom: 16 }}>
      {children}
    </p>
  );
}

function InlineCode({ children }: { children: string }) {
  return (
    <code style={{
      background: 'rgba(124,58,237,0.12)',
      border: '1px solid rgba(124,58,237,0.2)',
      borderRadius: 4,
      padding: '2px 6px',
      fontSize: 13,
      fontFamily: "'JetBrains Mono', monospace",
      color: '#c084fc',
    }}>
      {children}
    </code>
  );
}

function TableRow({ cells, header }: { cells: string[]; header?: boolean }) {
  const Tag = header ? 'th' : 'td';
  return (
    <tr>
      {cells.map((c, i) => (
        <Tag
          key={i}
          style={{
            padding: '10px 16px',
            textAlign: 'left',
            fontSize: 13,
            fontWeight: header ? 700 : 400,
            color: header ? '#fff' : 'rgba(255,255,255,0.6)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            fontFamily: i === 0 && !header ? "'JetBrains Mono', monospace" : 'inherit',
          }}
        >
          {c}
        </Tag>
      ))}
    </tr>
  );
}

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div style={{ overflowX: 'auto', marginBottom: 24, borderRadius: 12, border: '1px solid rgba(255,255,255,0.07)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'rgba(0,0,0,0.3)' }}>
        <thead style={{ background: 'rgba(255,255,255,0.03)' }}>
          <TableRow cells={headers} header />
        </thead>
        <tbody>
          {rows.map((r, i) => <TableRow key={i} cells={r} />)}
        </tbody>
      </table>
    </div>
  );
}

function Note({ children, type = 'info' }: { children: React.ReactNode; type?: 'info' | 'warning' | 'tip' }) {
  const colors = { info: '#38bdf8', warning: '#f59e0b', tip: '#34d399' };
  const labels = { info: 'Note', warning: 'Warning', tip: 'Tip' };
  return (
    <div style={{
      marginBottom: 24,
      padding: '16px 20px',
      borderRadius: 10,
      background: `${colors[type]}08`,
      border: `1px solid ${colors[type]}25`,
      borderLeft: `3px solid ${colors[type]}`,
    }}>
      <div style={{ fontWeight: 700, fontSize: 13, color: colors[type], marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {labels[type]}
      </div>
      <div style={{ fontSize: 14, lineHeight: 1.7, color: 'rgba(255,255,255,0.6)' }}>
        {children}
      </div>
    </div>
  );
}

export default function DocsPage() {
  const [active, setActive] = useState<SectionId>('quick-start');

  // Scroll spy: update sidebar active state as user scrolls through sections.
  useEffect(() => {
    const ids = SIDEBAR.map((s) => s.id);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id as SectionId);
          }
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: SectionId) => {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div style={{ paddingTop: 80 }}>
      {/* Header */}
      <div style={{
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        padding: '40px 24px 48px',
        background: 'linear-gradient(180deg, rgba(124,58,237,0.04) 0%, transparent 100%)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
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
              background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.2))',
              border: '1px solid rgba(124,58,237,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Book size={20} color="#c084fc" />
            </div>
            <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em' }}>
              Documentation
            </h1>
          </div>
          <P>Everything you need to install, configure, and run DocTrack in your project.</P>
        </div>
      </div>

      {/* Main content */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', gap: 48 }} className="docs-layout">
        {/* Sidebar */}
        <aside style={{
          width: 220, flexShrink: 0, paddingTop: 32,
          position: 'sticky', top: 80, height: 'fit-content',
        }} className="docs-sidebar">
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {SIDEBAR.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 12px', borderRadius: 8, border: 'none',
                  background: active === s.id ? 'rgba(124,58,237,0.12)' : 'transparent',
                  color: active === s.id ? '#c084fc' : 'rgba(255,255,255,0.5)',
                  fontSize: 14, fontWeight: 500, cursor: 'pointer',
                  transition: 'all 0.2s', textAlign: 'left',
                }}
                onMouseEnter={(e) => {
                  if (active !== s.id) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
                }}
                onMouseLeave={(e) => {
                  if (active !== s.id) (e.currentTarget as HTMLElement).style.background = 'transparent';
                }}
              >
                <s.icon size={15} />
                {s.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <div style={{ flex: 1, paddingTop: 32, paddingBottom: 80, minWidth: 0 }}>
            {/* ─── Quick Start ─── */}
            <Heading id="quick-start">Quick Start</Heading>
            <P>
              Get DocTrack running in under a minute. You need Node.js 18+ and an API key from your preferred AI provider.
            </P>

            <SubHeading>1. Install</SubHeading>
            <P>DocTrack is distributed as a single Go binary via npm. Install globally:</P>
            <CodeBlock title="terminal">
{`npm install -g doctrack`}
            </CodeBlock>
            <P>
              This installs the correct pre-compiled binary for your platform (macOS ARM/x64, Linux x64, Windows x64).
              No Go toolchain needed.
            </P>

            <SubHeading>2. Initialize</SubHeading>
            <P>
              In your project root, run the interactive setup wizard. DocTrack auto-detects your project type
              and suggests sensible defaults.
            </P>
            <CodeBlock title="terminal">
{`cd your-project
doctrack init`}
            </CodeBlock>
            <P>The wizard will ask you to:</P>
            <ul style={{ marginBottom: 16, paddingLeft: 24 }}>
              {[
                'Choose your AI provider (OpenAI, Anthropic, or custom base URL)',
                'Enter your API key (validated immediately via a lightweight request)',
                'Set the docs output directory (default: docs/)',
                'Optionally configure Confluence integration',
              ].map((item, i) => (
                <li key={i} style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 2 }}>{item}</li>
              ))}
            </ul>
            <P>
              A <InlineCode>.doctrack.yaml</InlineCode> file will be created with <InlineCode>0600</InlineCode> permissions.
              DocTrack adds it to your <InlineCode>.gitignore</InlineCode> automatically.
            </P>

            <SubHeading>3. Sync</SubHeading>
            <P>Generate or update documentation for every changed file:</P>
            <CodeBlock title="terminal">
{`doctrack sync`}
            </CodeBlock>
            <P>
              DocTrack scans your source tree, computes diffs against the last snapshot,
              redacts any detected secrets, sends the diff to your AI, and writes the updated
              Markdown files. Done.
            </P>
            <CodeBlock title="output">
{`Scanning... 142 tracked, 7 changed
  ● src/api/handler.go     → docs/api/handler.md
  ● src/db/queries.go      → docs/db/queries.md
  ○ src/config/config.go   → (skipped, unchanged)
⚠ 1 secret redacted in src/db/queries.go
Generating...
  ✓ docs/api/handler.md    (820 tokens)
  ✓ docs/db/queries.md     (614 tokens)
✓ 7 docs updated. ~4,120 tokens.`}
            </CodeBlock>

            <Note type="tip">
              Run <InlineCode>doctrack sync --dry-run</InlineCode> first to preview what would change
              and estimate token costs without making any API calls.
            </Note>

            {/* ─── Configuration ─── */}
            <Heading id="configuration">Configuration</Heading>
            <P>
              DocTrack uses a YAML config file with a clear precedence chain. No Viper — just straightforward YAML and environment variables.
            </P>

            <SubHeading>Precedence (highest first)</SubHeading>
            <Table
              headers={['Source', 'Description']}
              rows={[
                ['CLI flags', 'Override everything. E.g. --provider anthropic'],
                ['Environment variables', 'Prefixed DOCTRACK_. E.g. DOCTRACK_PROVIDER=openai'],
                ['Project .doctrack.yaml', 'In your project root. Primary config file.'],
                ['Global config', '~/.config/doctrack/config.yaml — shared across projects'],
                ['Defaults', 'Sensible built-in defaults for everything'],
              ]}
            />

            <SubHeading>Full config reference</SubHeading>
            <CodeBlock title=".doctrack.yaml">
{`version: 1
provider: openai              # "openai" | "anthropic"
model: gpt-4o-mini            # Any model your provider supports
docs_dir: docs                # Output directory for generated docs
mapping: mirror               # Source path → doc path strategy

# File inclusion/exclusion patterns (glob syntax)
include:
  - "**/*.go"
  - "**/*.ts"
  - "**/*.tsx"
exclude:
  - "vendor/**"
  - "node_modules/**"
  - "**/*_test.go"

# Provider configuration
providers:
  base_url: ""                # Override for Ollama/Azure/LiteLLM
  api_key: env:OPENAI_API_KEY # Literal key or env: prefix to read from env

# Confluence integration (optional)
confluence:
  base_url: https://your-domain.atlassian.net/wiki
  space_key: DEV
  username: your@email.com
  api_token: env:CONFLUENCE_API_TOKEN
  parent_page_id: "123456"`}
            </CodeBlock>

            <SubHeading>API key resolution</SubHeading>
            <P>DocTrack resolves API keys in this order:</P>
            <Table
              headers={['Method', 'Example', 'Priority']}
              rows={[
                ['Config value', 'api_key: sk-abc123...', '1 (highest)'],
                ['env: prefix in config', 'api_key: env:MY_KEY', '2'],
                ['Standard env var', 'OPENAI_API_KEY / ANTHROPIC_API_KEY', '3'],
                ['System keyring', 'Stored via doctrack config set', '4 (lowest)'],
              ]}
            />

            <Note type="warning">
              If your config file contains a literal API key, DocTrack will check that the file has <InlineCode>0600</InlineCode> permissions.
              If the permissions are broader, a warning is printed to stderr.
            </Note>

            <SubHeading>.aiignore</SubHeading>
            <P>
              The <InlineCode>.aiignore</InlineCode> file works like <InlineCode>.gitignore</InlineCode> and controls what code the AI
              can see. Files matching patterns in <InlineCode>.aiignore</InlineCode> are completely excluded from diffs.
            </P>
            <CodeBlock title=".aiignore">
{`# Default patterns (always applied)
.env
*.pem
*.key
**/secrets/**

# Add your own
internal/legacy/**
scripts/deploy.sh`}
            </CodeBlock>

            {/* ─── CLI Reference ─── */}
            <Heading id="cli-reference">CLI Reference</Heading>
            <P>
              DocTrack provides a focused set of commands. Every command supports <InlineCode>--help</InlineCode> for detailed usage.
            </P>

            <SubHeading>Global flags</SubHeading>
            <Table
              headers={['Flag', 'Description']}
              rows={[
                ['--quiet', 'Suppress all output except errors'],
                ['--verbose', 'Show detailed progress information'],
                ['--debug', 'Enable HTTP traces and internal debugging'],
                ['--json', 'Machine-readable JSON output'],
                ['--config <path>', 'Use a specific config file (default: .doctrack.yaml)'],
              ]}
            />

            <SubHeading>doctrack init</SubHeading>
            <P>Interactive setup wizard that creates <InlineCode>.doctrack.yaml</InlineCode>.</P>
            <CodeBlock title="terminal">
{`doctrack init

# Options:
#   --provider <name>    Skip provider selection prompt
#   --docs-dir <path>    Skip docs directory prompt
#   --non-interactive    Use all defaults, skip prompts`}
            </CodeBlock>

            <SubHeading>doctrack sync</SubHeading>
            <P>The main command. Detects changes, generates diffs, calls your AI, writes docs.</P>
            <CodeBlock title="terminal">
{`doctrack sync [flags]

# Flags:
#   --dry-run          Preview changes without calling AI
#   --force            Regenerate all docs, not just changed files
#   --confluence       Push updated docs to Confluence after sync
#   --no-confluence    Skip Confluence even if configured`}
            </CodeBlock>

            <SubHeading>doctrack diff</SubHeading>
            <P>Show which files have changed since the last sync without modifying anything.</P>
            <CodeBlock title="terminal">
{`doctrack diff

# Output:
#   ● src/api/handler.go      (modified)
#   ● src/db/queries.go       (modified)
#   + src/api/middleware.go    (new)
#   - src/legacy/old.go       (deleted)`}
            </CodeBlock>

            <SubHeading>doctrack config</SubHeading>
            <P>Read and write config values from the command line.</P>
            <CodeBlock title="terminal">
{`doctrack config set provider anthropic
doctrack config set api_key env:ANTHROPIC_API_KEY
doctrack config get model
doctrack config list`}
            </CodeBlock>

            <SubHeading>doctrack version</SubHeading>
            <P>Print version, commit hash, and build date.</P>
            <CodeBlock title="terminal">
{`doctrack version
# doctrack version 0.1.0 (commit: a3f8c21, built: 2026-02-27)`}
            </CodeBlock>

            <SubHeading>Exit codes</SubHeading>
            <Table
              headers={['Code', 'Meaning']}
              rows={[
                ['0', 'Success'],
                ['1', 'General error'],
                ['2', 'Usage error (bad flags/args)'],
                ['3', 'Configuration error'],
                ['4', 'Authentication error (bad API key)'],
                ['5', 'Network error'],
                ['10', 'Partial failure (some files failed)'],
              ]}
            />

            {/* ─── AI Providers ─── */}
            <Heading id="ai-providers">AI Providers</Heading>
            <P>
              DocTrack works with any OpenAI-compatible API. No vendor lock-in — switch providers
              by changing a single config line.
            </P>

            <SubHeading>OpenAI</SubHeading>
            <P>The default provider. Works with GPT-4o, GPT-4o-mini, and any model available on the OpenAI API.</P>
            <CodeBlock title=".doctrack.yaml">
{`provider: openai
model: gpt-4o-mini
providers:
  api_key: env:OPENAI_API_KEY`}
            </CodeBlock>

            <SubHeading>Anthropic</SubHeading>
            <P>First-class support via the official Anthropic SDK. Works with Claude 3.5, Claude 4, etc.</P>
            <CodeBlock title=".doctrack.yaml">
{`provider: anthropic
model: claude-sonnet-4-20250514
providers:
  api_key: env:ANTHROPIC_API_KEY`}
            </CodeBlock>

            <SubHeading>Ollama (Local)</SubHeading>
            <P>
              Run completely offline using Ollama. Set the <InlineCode>base_url</InlineCode> to your
              Ollama instance and use the OpenAI-compatible endpoint.
            </P>
            <CodeBlock title=".doctrack.yaml">
{`provider: openai
model: llama3.2
providers:
  base_url: http://localhost:11434/v1
  api_key: ollama    # Any non-empty string`}
            </CodeBlock>
            <Note type="tip">
              With Ollama, zero data leaves your machine. Perfect for enterprises with strict data policies.
            </Note>

            <SubHeading>Azure OpenAI</SubHeading>
            <CodeBlock title=".doctrack.yaml">
{`provider: openai
model: gpt-4o-mini
providers:
  base_url: https://your-resource.openai.azure.com/openai/deployments/your-deployment
  api_key: env:AZURE_OPENAI_KEY`}
            </CodeBlock>

            <SubHeading>LiteLLM / Any proxy</SubHeading>
            <P>
              Any OpenAI-compatible proxy works. Just set the <InlineCode>base_url</InlineCode>.
            </P>
            <CodeBlock title=".doctrack.yaml">
{`provider: openai
model: your-model
providers:
  base_url: http://localhost:4000/v1
  api_key: env:LITELLM_KEY`}
            </CodeBlock>

            {/* ─── Secret Scanner ─── */}
            <Heading id="secret-scanner">Secret Scanner</Heading>
            <P>
              Every diff is scanned before it leaves your machine. If a secret is detected, it's
              replaced with a <InlineCode>[REDACTED:type]</InlineCode> placeholder. The original content
              is never sent to any API.
            </P>

            <SubHeading>Detected patterns</SubHeading>
            <Table
              headers={['Type', 'Pattern', 'Example']}
              rows={[
                ['AWS Access Key', 'AKIA[0-9A-Z]{16}', 'AKIAIOSFODNN7EXAMPLE'],
                ['OpenAI API Key', 'sk-[a-zA-Z0-9]{20,}', 'sk-abc123...'],
                ['Anthropic Key', 'sk-ant-[a-zA-Z0-9-]{20,}', 'sk-ant-api03-...'],
                ['GitHub Token', 'gh[pousr]_[a-zA-Z0-9]{36,}', 'ghp_abc123...'],
                ['Private Key', '-----BEGIN.*PRIVATE KEY-----', 'RSA, EC, etc.'],
                ['Generic Secret', 'password|secret|token = "..."', 'Assignment patterns'],
                ['Connection String', 'postgres://|mysql://|mongodb://', 'Database URIs'],
                ['Slack Token', 'xox[bpras]-...', 'Bot/user tokens'],
                ['Stripe Key', 'sk_live_[a-zA-Z0-9]{24,}', 'Live API keys'],
              ]}
            />

            <SubHeading>How redaction works</SubHeading>
            <CodeBlock title="before">
{`+ const apiKey = "sk-abc123def456ghi789jkl012mno345";
+ const dbUrl = "postgres://admin:s3cret@db.example.com:5432/app";`}
            </CodeBlock>
            <CodeBlock title="after (sent to AI)">
{`+ const apiKey = "[REDACTED:openai_key]";
+ const dbUrl = "[REDACTED:connection_string]";`}
            </CodeBlock>

            <Note type="info">
              The scanner uses compiled regex patterns (initialized once via <InlineCode>sync.Once</InlineCode>)
              for near-zero overhead. Scanning adds less than 1ms per file.
            </Note>

            {/* ─── Confluence ─── */}
            <Heading id="confluence">Confluence Integration</Heading>
            <P>
              Push updated docs to Confluence with a single flag. DocTrack handles page creation,
              versioning, and Markdown-to-Confluence conversion.
            </P>

            <SubHeading>Setup</SubHeading>
            <P>
              Add the Confluence section to your config. You need a Confluence Cloud API token
              (not your Atlassian password).
            </P>
            <CodeBlock title=".doctrack.yaml">
{`confluence:
  base_url: https://your-domain.atlassian.net/wiki
  space_key: DEV
  username: your@email.com
  api_token: env:CONFLUENCE_API_TOKEN
  parent_page_id: "123456"  # Optional: nest under this page`}
            </CodeBlock>

            <SubHeading>Usage</SubHeading>
            <CodeBlock title="terminal">
{`# Push after sync
doctrack sync --confluence

# Skip even if configured
doctrack sync --no-confluence`}
            </CodeBlock>

            <SubHeading>How it works</SubHeading>
            <P>DocTrack maintains a manifest at <InlineCode>.doctrack/confluence-manifest.yaml</InlineCode> that maps local doc paths to Confluence page IDs. On each push:</P>
            <ul style={{ marginBottom: 16, paddingLeft: 24 }}>
              {[
                'If a page ID exists in the manifest → update (auto-increments the version number)',
                'If no ID → search by title in the target space → create if not found',
                'Content hash comparison skips pages that haven\'t changed since last push',
                'Rate limited to 5 requests/second to stay within Confluence API limits',
              ].map((item, i) => (
                <li key={i} style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 2 }}>{item}</li>
              ))}
            </ul>

            <SubHeading>Markdown conversion</SubHeading>
            <P>
              DocTrack converts Markdown to Confluence Storage Format (XHTML) using a custom Goldmark renderer.
              Supported elements: headings, paragraphs, lists, code blocks (with <InlineCode>{'<ac:structured-macro>'}</InlineCode> syntax highlighting),
              tables, links, images, and inline formatting.
            </P>

            <Note type="warning">
              Confluence API tokens are sensitive. Always use <InlineCode>env:CONFLUENCE_API_TOKEN</InlineCode> rather than putting the token directly in your config file.
            </Note>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .docs-sidebar { display: none !important; }
          .docs-layout { flex-direction: column !important; }
        }
      `}</style>
    </div>
  );
}
