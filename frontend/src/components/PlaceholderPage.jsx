import { useEffect } from 'react';
import { Layers, Bot, Headphones, Cpu, Shield, Database, GitBranch } from 'lucide-react';

const pages = {
  architecture: {
    icon: Layers,
    title: 'System Architecture',
    subtitle: 'A modular, sequential multi-agent pipeline built for reliability and extensibility.',
    cards: [
      { icon: Database, title: 'ArXiv MCP Tool', desc: 'Custom Python tool wrapping the arXiv API for real-time paper retrieval with structured JSON output.' },
      { icon: Cpu, title: 'Gemini 2.5 Flash', desc: 'Primary LLM backbone with 3-model fallback chain (2.5 → 2.0 → 1.5 Flash) and exponential backoff.' },
      { icon: Shield, title: 'PII Scrubber', desc: 'Local regex-based sanitization layer that masks emails and phone numbers before any data leaves the system.' },
      { icon: GitBranch, title: 'Sequential Pipeline', desc: 'Each agent receives only the previous agent\'s output, enforcing specialization and preventing hallucination.' },
    ],
  },
  agents: {
    icon: Bot,
    title: 'Agent Profiles',
    subtitle: 'Four specialized cognitive roles, each designed for a distinct stage of research synthesis.',
    cards: [
      { icon: Layers, title: 'Extractor Agent', desc: 'Scans all retrieved papers and extracts every distinct methodology, technique, and algorithm mentioned.' },
      { icon: Layers, title: 'Gap Analyzer', desc: 'Reviews extracted methodologies to identify under-explored areas, limitations, and open problems.' },
      { icon: Layers, title: 'Hypothesis Engine', desc: 'Proposes 3-5 novel, testable research hypotheses with rationale, expected outcomes, and gap references.' },
      { icon: Layers, title: 'Roadmap Planner', desc: 'Creates a detailed 6-month research roadmap with monthly milestones, resources, and success metrics.' },
    ],
  },
  support: {
    icon: Headphones,
    title: 'Support & Resources',
    subtitle: 'Get started with VertexFlow and explore the documentation.',
    cards: [
      { icon: Layers, title: 'Quick Start Guide', desc: 'Clone the repo, add your API key to .env, and run python main.py to start synthesizing research.' },
      { icon: Layers, title: 'API Key Setup', desc: 'Get a free Gemini API key at aistudio.google.com. Supports free-tier with automatic rate limit handling.' },
      { icon: Layers, title: 'GitHub Repository', desc: 'Open-source under MIT License. Contributions welcome — issues, PRs, and feature requests.' },
      { icon: Layers, title: 'Kaggle Capstone', desc: 'Built for the Google AI Agents Intensive Vibe Coding Capstone. Track: Agents for Good.' },
    ],
  },
};

export default function PlaceholderPage({ tabId }) {
  const page = pages[tabId];

  useEffect(() => {
    const timer = setTimeout(() => {
      document.querySelectorAll('.ph-r').forEach(el => el.classList.add('show'));
    }, 100);
    return () => clearTimeout(timer);
  }, [tabId]);

  if (!page) return null;
  const PageIcon = page.icon;

  return (
    <section
      key={tabId}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '120px 5% 60px',
        position: 'relative',
        zIndex: 10
      }}
    >
      <div style={{ maxWidth: '900px', width: '100%' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div className="ph-r r" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(77,200,255,.08)', border: '1px solid rgba(77,200,255,.25)', marginBottom: '24px' }}>
            <PageIcon size={20} color="var(--color-electric)" />
          </div>
          <h2 className="display-sm ph-r r rd" style={{ marginBottom: '16px' }}>{page.title}</h2>
          <p className="body ph-r r rd2" style={{ color: 'rgba(184,200,216,.5)', maxWidth: '480px', margin: '0 auto' }}>{page.subtitle}</p>
        </div>

        {/* Cards Grid */}
        <div className="g2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {page.cards.map((card, i) => {
            const CardIcon = card.icon;
            const delayClass = i === 0 ? 'rd2' : i === 1 ? 'rd3' : i === 2 ? 'rd3' : 'rd4';
            return (
              <div
                key={i}
                className={`glass ph-r r ${delayClass}`}
                style={{ padding: '32px 28px', borderRadius: '1px', transition: 'transform .4s, border-color .3s' }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(123,45,191,.08)', border: '1px solid rgba(123,45,191,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <CardIcon size={18} color="var(--color-violet)" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: 500, marginBottom: '8px', color: 'var(--color-white)' }}>{card.title}</h3>
                    <p className="body-sm" style={{ color: 'rgba(184,200,216,.56)' }}>{card.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
