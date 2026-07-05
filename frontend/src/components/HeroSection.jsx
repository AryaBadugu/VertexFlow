import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

export default function HeroSection({ onSubmit, isRunning }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) onSubmit(query.trim());
  };

  // Run the 'show' logic when component mounts, similar to IntersectionObserver in template
  useEffect(() => {
    const timer = setTimeout(() => {
      document.querySelectorAll('.hero-r').forEach(el => el.classList.add('show'));
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      id="hero"
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '0 5%',
        position: 'relative',
        zIndex: 10,
        opacity: isRunning ? 0 : 1,
        pointerEvents: isRunning ? 'none' : 'auto',
        transition: 'opacity 0.7s ease'
      }}
    >
      <div className="scan"></div>
      <div className="hud hero-r r" style={{ position: 'absolute', top: '92px', left: '5%', color: 'rgba(77,200,255,.3)' }}>
        VERTEXFLOW.SYS // RESEARCH // ACTIVE
      </div>
      <div className="hud hero-r r" style={{ position: 'absolute', bottom: '50px', right: '5%', color: 'rgba(200,151,58,.28)' }}>
        RESEARCH → DEBATE → SYNTHESIS
      </div>

      <div style={{ maxWidth: '960px', marginTop: '-40px' }}>
        <div className="hero-r r" style={{ display: 'flex', alignItems: 'center', gap: '11px', marginBottom: '24px' }}>
          <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--color-gold-lt)', boxShadow: '0 0 12px var(--color-gold)', flexShrink: 0 }}></div>
          <span className="label" style={{ color: 'rgba(200,151,58,.6)' }}>Multi-Agent AI Research Synthesis</span>
        </div>

        <div className="hero-r r"><h1 className="display glitch" style={{ color: 'var(--color-white)' }}>We analyze what</h1></div>
        <div className="hero-r r rd"><h1 className="display glitch" style={{ color: 'var(--color-white)' }}>others miss.</h1></div>
        <div className="hero-r r rd2"><h1 className="display g-full">Synthesize the frontier.</h1></div>

        <div className="hero-r r rd3" style={{ maxWidth: '600px', marginTop: '24px' }}>
          <p className="body-lg" style={{ color: 'rgba(184,200,216,.62)' }}>
            VertexFlow orchestrates four autonomous AI agents to analyze papers, debate methodologies, and generate novel research roadmaps. Discover the hidden gaps in academic research.
          </p>
        </div>

        <div className="hero-r r rd4" style={{ marginTop: '32px', maxWidth: '600px' }}>
          <form onSubmit={handleSubmit} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(12,7,24,.65)',
              border: '1px solid rgba(123,45,191,.4)',
              backdropFilter: 'blur(14px)',
              borderRadius: '1px',
              padding: '6px 6px 6px 18px',
              width: '100%',
              transition: 'border-color .3s'
            }}
            className="hover:border-[var(--color-violet)] focus-within:border-[var(--color-electric)]"
            >
              <Search size={16} color="rgba(77,200,255,.6)" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter research domain..."
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--color-white)',
                  padding: '12px 14px',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '15px'
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '14px 36px',
                  background: 'linear-gradient(135deg, rgba(123,45,191,.42), rgba(77,200,255,.2))',
                  border: '1px solid rgba(123,45,191,.5)',
                  borderRadius: '1px',
                  textDecoration: 'none',
                  fontSize: '10px',
                  letterSpacing: '.2em',
                  textTransform: 'uppercase',
                  color: '#fff',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  transition: 'background .3s, border-color .3s'
                }}
                className="hover:border-[var(--color-electric)] hover:bg-[rgba(77,200,255,.1)]"
              >
                Synthesize ↗
              </button>
            </div>
          </form>
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: '38px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', opacity: '.28' }}>
        <div className="hud" style={{ fontSize: '8px' }}>scroll</div>
        <div style={{ width: '1px', height: '34px', background: 'linear-gradient(180deg, rgba(123,45,191,.8), transparent)' }}></div>
      </div>
    </section>
  );
}
