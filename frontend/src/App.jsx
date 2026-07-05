import { useEffect, useRef, useState } from 'react';
import Loader from './components/Loader';
import CustomCursor from './components/CustomCursor';
import ThreeBackground from './components/ThreeBackground';
import gsap from 'gsap';

export default function App() {
  const [isLoaderVisible, setLoaderVisible] = useState(true);
  const [appState, setAppState] = useState('landing');
  const [searchQuery, setSearchQuery] = useState('');
  const [reportProgress, setReportProgress] = useState(0);
  
  const glitchRefs = useRef([]);

  useEffect(() => {
    // Re-initialize intersection observers whenever appState changes
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('show');
          e.target.querySelectorAll('.bar-fill').forEach(b => b.classList.add('show'));
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.r').forEach(el => obs.observe(el));

    const barObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('show');
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.bar-fill').forEach(b => barObs.observe(b));

    return () => {
      obs.disconnect();
      barObs.disconnect();
    };
  }, [appState]);

  useEffect(() => {
    // Glitch effect on mouse move (speed > 3)
    let lx2 = 0, ly2 = 0, lt2 = 0;
    const handleMouseMove = (e) => {
      const now = Date.now(), dt = now - lt2;
      if (dt > 30) {
        const s = Math.sqrt((e.clientX - lx2) ** 2 + (e.clientY - ly2) ** 2) / dt;
        if (s > 3) {
          glitchRefs.current.forEach(el => {
            if (el && !el.classList.contains('go')) {
              el.classList.add('go');
              setTimeout(() => { if (el) el.classList.remove('go') }, 280);
            }
          });
        }
        lx2 = e.clientX;
        ly2 = e.clientY;
        lt2 = now;
      }
    };
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    if (appState === 'report') {
      const timers = [
        setTimeout(() => setReportProgress(1), 1500),
        setTimeout(() => setReportProgress(2), 3500),
        setTimeout(() => setReportProgress(3), 5500),
        setTimeout(() => setReportProgress(4), 8000),
      ];
      return () => timers.forEach(clearTimeout);
    }
  }, [appState]);

  const handleThreeReady = ({ coreScale, w1Scale, w2Scale }) => {
    const tl = gsap.timeline();
    tl.to('#loader', { opacity: 0, duration: 0.7, onComplete: () => setLoaderVisible(false) })
      .from(coreScale, { x: 0, y: 0, z: 0, duration: 2, ease: 'elastic.out(1,.7)' }, '-=.2')
      .from(w1Scale, { x: 0, y: 0, z: 0, duration: 2, ease: 'elastic.out(1,.7)' }, '<')
      .from(w2Scale, { x: 0, y: 0, z: 0, duration: 2, ease: 'elastic.out(1,.7)' }, '<')
      .to('#nav', { opacity: 1, duration: 0.8 }, '<.4')
      .to('.hero-r', { opacity: 1, y: 0, duration: 1.1, stagger: 0.08, ease: 'power4.out' }, '<.2');
  };

  const handleSynthesize = (e) => {
    e.preventDefault();
    setAppState('report');
    setReportProgress(0);
    window.scrollTo(0, 0);
  };

  const navigate = (state) => {
    setAppState(state);
    window.scrollTo(0,0);
  };

  const navigateToAgents = () => {
    setAppState('landing');
    setTimeout(() => {
      document.getElementById('agents-grid')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <>
      <CustomCursor />
      {isLoaderVisible && <Loader isVisible={isLoaderVisible} />}
      <ThreeBackground onReady={handleThreeReady} />

      <header id="nav">
        <div className="logo-wrap" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }} onClick={() => navigate('landing')}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ filter: 'drop-shadow(0 0 8px rgba(96,165,250,0.6))' }}>
            <defs>
              <linearGradient id="nodeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
            <circle cx="16" cy="8" r="4" fill="url(#nodeGrad)" />
            <circle cx="8" cy="24" r="4" fill="url(#nodeGrad)" />
            <circle cx="24" cy="24" r="4" fill="url(#nodeGrad)" />
            <line x1="14" y1="11" x2="10" y2="21" stroke="url(#nodeGrad)" strokeWidth="2" />
            <line x1="18" y1="11" x2="22" y2="21" stroke="url(#nodeGrad)" strokeWidth="2" />
            <line x1="11" y1="24" x2="21" y2="24" stroke="url(#nodeGrad)" strokeWidth="2" />
          </svg>
          <div>
            <div className="brand-n" style={{ color: 'white', fontWeight: 'bold' }}>
              Vertex<span style={{ color: 'var(--electric)' }}>Flow</span>
            </div>
            <div className="brand-s">AI Research Synthesis Engine</div>
          </div>
        </div>
        <nav className="lnk">
          <button style={{ background:'none', border:'none', color:'inherit', cursor:'pointer' }} onClick={() => navigate('architecture')}>Architecture</button>
          <button style={{ background:'none', border:'none', color:'inherit', cursor:'pointer' }} onClick={navigateToAgents}>Agents</button>
          <button style={{ background:'none', border:'none', color:'inherit', cursor:'pointer' }} onClick={() => navigate('security')}>Security</button>
        </nav>
        <a href="https://github.com/AryaBadugu/VertexFlow.git" target="_blank" rel="noreferrer" className="nc">View GitHub</a>
      </header>

      {appState === 'landing' && (
        <>
          <section id="hero" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 5%', position: 'relative', zIndex: 10 }}>
            <div className="scan"></div>
            <div className="hud hero-r r" style={{ position: 'absolute', top: '92px', left: '5%', color: 'rgba(77,200,255,.3)' }}>
              VERTEX.SYS // PIPELINE // ACTIVE
            </div>
            <div className="hud hero-r r" style={{ position: 'absolute', bottom: '50px', right: '5%', color: 'rgba(200,151,58,.28)' }}>
              INGEST → SYNTHESIZE → ROADMAP
            </div>

            <div style={{ maxWidth: '1060px' }}>
              <div className="hero-r r" style={{ display: 'flex', alignItems: 'center', gap: '11px', marginBottom: '34px' }}>
                <div className="gdot"></div>
                <span className="label" style={{ color: 'rgba(200,151,58,.6)' }}>GraphRAG Architecture · Gemini 1.5 Pro · GCP Native</span>
              </div>

              <div className="hero-r r">
                <h1 className="display glitch" ref={el => el && glitchRefs.current.push(el)} style={{ color: 'var(--white)' }}>Autonomous</h1>
              </div>
              <div className="hero-r r rd">
                <h1 className="display glitch" ref={el => el && glitchRefs.current.push(el)} style={{ color: 'var(--white)' }}>Research Synthesis</h1>
              </div>
              <div className="hero-r r rd2">
                <h1 className="display g-full">Engine.</h1>
              </div>

              <div className="hero-r r rd3" style={{ maxWidth: '640px', marginTop: '36px' }}>
                <p className="body-lg" style={{ color: 'rgba(184,200,216,.62)' }}>
                  Overcoming the knowledge explosion in academia. VertexFlow orchestrates a 4-agent 
                  GraphRAG architecture to analyze arXiv papers, identify literature gaps, and 
                  generate novel, testable research roadmaps.
                </p>
              </div>

              <div className="hero-r r rd4" style={{ marginTop: '44px' }}>
                <form style={{ display: 'flex', gap: '10px', width: '100%', maxWidth: '640px' }} onSubmit={handleSynthesize}>
                  <input 
                    type="text" 
                    required
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter a research domain (e.g., Hallucination Mitigation in LLMs)..." 
                    style={{ flex: 1, padding: '16px 24px', background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1px', color: 'white', fontSize: '13px', outline: 'none', transition: 'border-color 0.3s' }} 
                    onFocus={(e) => e.target.style.borderColor = 'var(--electric)'} 
                    onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'} 
                  />
                  <button 
                    type="submit" 
                    style={{ padding: '16px 32px', background: 'linear-gradient(135deg,rgba(123,45,191,.42),rgba(77,200,255,.2))', border: '1px solid rgba(123,45,191,.5)', borderRadius: '1px', color: '#fff', fontSize: '10px', letterSpacing: '.2em', textTransform: 'uppercase', cursor: 'pointer', whiteSpace: 'nowrap' }}
                  >
                    Synthesize ↗
                  </button>
                </form>
              </div>
            </div>

            <div style={{ position: 'absolute', bottom: '38px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', opacity: .28 }}>
              <div className="hud" style={{ fontSize: '8px' }}>scroll</div>
              <div style={{ width: '1px', height: '34px', background: 'linear-gradient(180deg, rgba(123,45,191,.8), transparent)' }}></div>
            </div>
          </section>

          <section id="problem" className="pad bg-nebula">
            <div className="max">
              <div className="sdiv r">✦ The Problem ✦</div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center', marginBottom: '80px' }} className="g2">
                <div>
                  <p className="label r" style={{ color: 'var(--electric)', marginBottom: '18px' }}>01 / Systemic Failure</p>
                  <h2 className="display-md r rd" style={{ marginBottom: '32px' }}>
                    THE KNOWLEDGE<br/>
                    <em className="g-gold">BOTTLENECK.</em>
                  </h2>
                  <p className="body-lg r rd2" style={{ color: 'rgba(184,200,216,.6)', marginBottom: '22px' }}>
                    Human researchers can no longer keep pace with the volume of published AI literature. 
                    Cross-domain synthesis opportunities are lost in the noise of thousands of unread PDFs.
                  </p>
                  <p className="body r rd3" style={{ color: 'rgba(184,200,216,.5)' }}>
                    VertexFlow replaces static keyword search with autonomous agentic reasoning, executing 
                    deep methodological comparisons at scale.
                  </p>
                </div>

                <div className="r rd2">
                  <div className="glass-g" style={{ padding: '0', borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', background: '#09090b', boxShadow: '0 0 80px rgba(123,45,191,.13)' }}>
                    <div style={{ background: '#18181b', padding: '12px 16px', display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }}></div>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#eab308' }}></div>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e' }}></div>
                    </div>
                    <pre style={{ padding: '24px', margin: 0, color: '#a1a1aa', fontSize: '13px', fontFamily: 'JetBrains Mono, monospace', overflowX: 'auto', lineHeight: '1.5' }}>
                      <code dangerouslySetInnerHTML={{__html: `
<span style="color: #c678dd">def</span> <span style="color: #61afef">pii_scrubber</span>(text: <span style="color: #e5c07b">str</span>) -> <span style="color: #e5c07b">str</span>:
    <span style="color: #5c6370">"""Masks sensitive entities."""</span>
    text = re.sub(
        <span style="color: #98c379">r'\\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Z|a-z]{2,}\\b'</span>, 
        <span style="color: #98c379">'[EMAIL]'</span>, 
        text
    )
    text = re.sub(
        <span style="color: #98c379">r'\\b\\d{3}[-.]?\\d{3}[-.]?\\d{4}\\b'</span>, 
        <span style="color: #98c379">'[PHONE]'</span>, 
        text
    )
    <span style="color: #c678dd">return</span> text
                      `.trim()}} />
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="agents" className="pad bg-deep">
            <div className="max">
              <div className="sdiv r">✦ How It Works ✦</div>
              <p className="label r" style={{ color: 'var(--rose)', marginBottom: '14px' }}>02 / Multi-Agent Swarm</p>
              <h2 className="display-sm r rd" style={{ marginBottom: '56px' }}>The Multi-Agent Pipeline.</h2>

              <div id="agents-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '18px' }} className="g4">
                <div className="glass r" style={{ padding: '32px 24px', borderRadius: '1px' }}>
                  <div className="pn" style={{ fontSize: '32px', width: 'auto', marginBottom: '14px' }}>01</div>
                  <h3 style={{ fontSize: '15px', fontWeight: 500, marginBottom: '12px' }}>Extractor Agent</h3>
                  <p className="body-sm" style={{ color: 'rgba(184,200,216,.5)', lineHeight: 1.6 }}>Autonomously queries the arXiv MCP server to ingest and structure methodologies from raw academic texts.</p>
                </div>
                <div className="glass r rd" style={{ padding: '32px 24px', borderRadius: '1px' }}>
                  <div className="pn" style={{ fontSize: '32px', width: 'auto', marginBottom: '14px' }}>02</div>
                  <h3 style={{ fontSize: '15px', fontWeight: 500, marginBottom: '12px' }}>Gap Analyzer</h3>
                  <p className="body-sm" style={{ color: 'rgba(184,200,216,.5)', lineHeight: 1.6 }}>Cross-references extracted data to identify contradictions, unexplored combinations, and missing experiments.</p>
                </div>
                <div className="glass r rd2" style={{ padding: '32px 24px', borderRadius: '1px' }}>
                  <div className="pn" style={{ fontSize: '32px', width: 'auto', marginBottom: '14px' }}>03</div>
                  <h3 style={{ fontSize: '15px', fontWeight: 500, marginBottom: '12px' }}>Hypothesis Engine</h3>
                  <p className="body-sm" style={{ color: 'rgba(184,200,216,.5)', lineHeight: 1.6 }}>Synthesizes identified gaps into highly technical, novel, and testable research hypotheses.</p>
                </div>
                <div className="glass-g r rd3" style={{ padding: '32px 24px', borderRadius: '1px' }}>
                  <div className="pn" style={{ fontSize: '32px', width: 'auto', marginBottom: '14px' }}>04</div>
                  <h3 style={{ fontSize: '15px', fontWeight: 500, marginBottom: '12px' }}>Roadmap Planner</h3>
                  <p className="body-sm" style={{ color: 'rgba(184,200,216,.5)', lineHeight: 1.6 }}>Drafts a comprehensive, actionable 6-month project execution plan to test the generated hypothesis.</p>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {appState === 'architecture' && (
        <section className="pad bg-nebula" style={{ position: 'relative', zIndex: 20, minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
          <div className="max">
            <div className="sdiv r">✦ Architecture ✦</div>
            <h2 className="display-md r rd" style={{ marginBottom: '56px', textTransform: 'uppercase' }}>
              ENTERPRISE-GRADE<br/>
              <em className="g-full">ARCHITECTURE.</em>
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }} className="g3 r rd2">
              <div className="glass" style={{ padding: '40px 32px', borderRadius: '1px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--electric)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '24px' }}><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>
                <h3 style={{ fontSize: '18px', fontWeight: 500, marginBottom: '16px', color: 'white' }}>Gemini 1.5 Pro</h3>
                <p className="body" style={{ color: 'rgba(184,200,216,.6)', lineHeight: 1.6 }}>
                  Powered by Gemini 1.5 Pro for deep reasoning and massive context windows, enabling simultaneous processing of dozens of full-length academic papers.
                </p>
              </div>

              <div className="glass" style={{ padding: '40px 32px', borderRadius: '1px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--violet)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '24px' }}><path d="m9 18 6-6-6-6"/></svg>
                <h3 style={{ fontSize: '18px', fontWeight: 500, marginBottom: '16px', color: 'white' }}>Google ADK</h3>
                <p className="body" style={{ color: 'rgba(184,200,216,.6)', lineHeight: 1.6 }}>
                  Orchestrated via the Google Agent Development Kit (ADK), providing robust state management and deterministic tool-calling constraints.
                </p>
              </div>

              <div className="glass-g" style={{ padding: '40px 32px', borderRadius: '1px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '24px' }}><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>
                <h3 style={{ fontSize: '18px', fontWeight: 500, marginBottom: '16px', color: 'white' }}>MCP Server</h3>
                <p className="body" style={{ color: 'rgba(184,200,216,.6)', lineHeight: 1.6 }}>
                  Secured by a local Model Context Protocol (MCP) server for real-time, air-gapped arXiv data ingestion, bypassing standard web scraping limits.
                </p>
              </div>
            </div>
            
            <div className="r rd3" style={{ marginTop: '48px', textAlign: 'center' }}>
              <button onClick={() => navigate('landing')} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '12px 24px', cursor: 'pointer', letterSpacing: '0.1em', fontSize: '11px', textTransform: 'uppercase' }}>← Back to Pipeline</button>
            </div>
          </div>
        </section>
      )}

      {appState === 'security' && (
        <section className="pad bg-deep" style={{ position: 'relative', zIndex: 20, minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
          <div className="max" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <div className="sdiv r" style={{ justifyContent: 'center' }}>✦ Security ✦</div>
            <div className="r rd" style={{ display: 'inline-flex', padding: '24px', background: 'rgba(10, 255, 150, 0.05)', borderRadius: '50%', marginBottom: '32px', border: '1px solid rgba(10, 255, 150, 0.1)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z"/></svg>
            </div>
            
            <h2 className="display-md r rd2" style={{ marginBottom: '24px', textTransform: 'uppercase' }}>
              Absolute Data<br/>
              <em style={{ color: '#10b981' }}>Privacy.</em>
            </h2>
            
            <p className="body-lg r rd3" style={{ color: 'rgba(184,200,216,.62)', marginBottom: '48px', lineHeight: 1.8 }}>
              VertexFlow implements a proactive PII (Personally Identifiable Information) Scrubber. 
              All queries are sanitized locally, masking emails and phone numbers before interacting 
              with the LLM, ensuring zero sensitive data leakage.
            </p>
            
            <div className="r rd4">
              <button onClick={() => navigate('landing')} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.2)', color: 'white', padding: '12px 24px', cursor: 'pointer', letterSpacing: '0.1em', fontSize: '11px', textTransform: 'uppercase' }}>← Back to Pipeline</button>
            </div>
          </div>
        </section>
      )}

      {appState === 'report' && (
        <section style={{ position: 'relative', zIndex: 30, minHeight: '100vh', padding: '120px 5% 60px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="glass r" style={{ width: '92%', maxWidth: '1360px', height: '85vh', display: 'flex', flexDirection: 'column', borderRadius: '1px', background: 'rgba(4, 2, 10, 0.7)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', boxShadow: '0 0 80px rgba(123, 45, 191, 0.15)', border: '1px solid rgba(255,255,255,0.05)' }}>
            
            {/* Dashboard Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 32px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '8px', height: '8px', background: 'var(--electric)', borderRadius: '50%', boxShadow: '0 0 10px var(--electric)' }}></div>
                <span className="hud" style={{ color: 'rgba(255,255,255,0.7)' }}>SYNTHESIS RUN ID: VF-9902X</span>
              </div>
              <button 
                onClick={() => navigate('landing')}
                style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 16px', color: 'rgba(255,255,255,0.6)', fontSize: '10px', letterSpacing: '.1em', textTransform: 'uppercase', cursor: 'pointer', transition: 'background 0.2s', borderRadius: '1px' }}
                onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
                onMouseLeave={(e) => e.target.style.background = 'none'}
              >
                CLOSE SESSION ✕
              </button>
            </div>

            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
              
              {/* Left Column: Agent Pipeline Status — SCALED UP for video readability */}
              <div style={{ width: '30%', borderRight: '1px solid rgba(255,255,255,0.05)', padding: '36px 32px', display: 'flex', flexDirection: 'column', gap: '32px', overflowY: 'auto' }}>
                <div style={{ fontSize: '16px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--violet)', fontFamily: "'JetBrains Mono', monospace" }}>Agent Pipeline Status</div>
                
                {[
                  { name: 'Extractor Agent', desc: 'Parsing arXiv methodologies', status: reportProgress >= 1 ? 'COMPLETE' : 'SYNTHESIZING...', color: reportProgress >= 1 ? '#10b981' : 'var(--electric)' },
                  { name: 'Gap Analyzer', desc: 'Cross-referencing literature gaps', status: reportProgress >= 2 ? 'COMPLETE' : reportProgress >= 1 ? 'SYNTHESIZING...' : 'PENDING', color: reportProgress >= 2 ? '#10b981' : reportProgress >= 1 ? 'var(--electric)' : 'rgba(255,255,255,0.2)' },
                  { name: 'Hypothesis Engine', desc: 'Generating novel hypotheses', status: reportProgress >= 3 ? 'COMPLETE' : reportProgress >= 2 ? 'SYNTHESIZING...' : 'PENDING', color: reportProgress >= 3 ? '#10b981' : reportProgress >= 2 ? 'var(--electric)' : 'rgba(255,255,255,0.2)' },
                  { name: 'Roadmap Planner', desc: 'Drafting execution roadmap', status: reportProgress >= 4 ? 'COMPLETE' : reportProgress >= 3 ? 'SYNTHESIZING...' : 'PENDING', color: reportProgress >= 4 ? '#10b981' : reportProgress >= 3 ? 'var(--electric)' : 'rgba(255,255,255,0.2)' }
                ].map((agent, i) => (
                  <div key={i} className="glass" style={{ padding: '24px', borderRadius: '1px', border: `1px solid ${agent.status === 'SYNTHESIZING...' ? 'rgba(77,200,255,0.4)' : 'rgba(255,255,255,0.05)'}`, transition: 'all 0.3s' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <span style={{ fontSize: '18px', fontWeight: 500, letterSpacing: '0.05em', color: agent.status === 'PENDING' ? 'rgba(255,255,255,0.4)' : 'white', fontFamily: "'JetBrains Mono', monospace" }}>0{i+1} // {agent.name}</span>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: agent.status === 'COMPLETE' ? agent.color : 'transparent', border: agent.status !== 'COMPLETE' ? `2px solid ${agent.color}` : 'none', boxShadow: `0 0 12px ${agent.color}`, animation: agent.status === 'SYNTHESIZING...' ? 'pulse 1.5s infinite' : 'none' }}>
                        {agent.status === 'COMPLETE' && (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        )}
                      </div>
                    </div>
                    <div style={{ fontSize: '14px', letterSpacing: '.08em', color: agent.color, marginBottom: '6px' }}>
                      {agent.status}
                    </div>
                    <div style={{ fontSize: '13px', color: 'rgba(184,200,216,0.45)', lineHeight: 1.4 }}>
                      {agent.desc}
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Column: Synthesis Report */}
              <div style={{ width: '70%', padding: '48px', overflowY: 'auto', background: 'rgba(0,0,0,0.2)' }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                  <h2 className="display-sm" style={{ marginBottom: '40px', color: 'white' }}>Query: {searchQuery || 'Unspecified Domain'}</h2>
                  
                  {reportProgress >= 1 && (
                    <div style={{ marginBottom: '48px', animation: 'fadeIn 0.5s ease-out' }}>
                      <div className="hud" style={{ color: 'var(--electric)', marginBottom: '24px', fontSize: '14px' }}>### 🤖 Agent 1: Extractor Output</div>
                      <div className="glass" style={{ padding: '24px', borderLeft: '2px solid var(--electric)' }}>
                        <ul style={{ paddingLeft: '20px', margin: 0, color: 'rgba(255,255,255,0.8)', lineHeight: 1.8, listStyleType: 'disc' }}>
                          <li style={{ marginBottom: '16px' }}><strong>Methodology A: Lookahead Decoding &amp; Speculative Sampling.</strong> An inference-time optimization technique that uses a smaller draft model to predict tokens, which are then verified by the target model, reducing confabulation during long-context generation.</li>
                          <li style={{ marginBottom: '16px' }}><strong>Methodology B: GraphRAG (Knowledge Graph-Augmented Generation).</strong> Utilizing structured semantic networks instead of flat vector databases to enforce relational consistency and ground LLM outputs in multi-hop factual chains.</li>
                          <li style={{ marginBottom: '16px' }}><strong>Methodology C: Inference-Time Intervention (ITI).</strong> A mechanistic interpretability approach that trains linear probes on transformer activation heads to shift internal representations toward "truthful" directions during decoding.</li>
                          <li><strong>Methodology D: Phase-wise Self-Reward Decoding (PSRD).</strong> An online hallucination correction method guided by phase-wise self-reward signals distilled from LVLMs.</li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {reportProgress >= 2 && (
                    <div style={{ marginBottom: '48px', animation: 'fadeIn 0.5s ease-out' }}>
                      <div className="hud" style={{ color: 'var(--rose)', marginBottom: '24px', fontSize: '14px' }}>### 🔍 Agent 2: Gap Analysis</div>
                      <div className="glass" style={{ padding: '24px', borderLeft: '2px solid var(--rose)' }}>
                        <p className="body" style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '20px' }}>
                          <strong>Gap 1 (Static RAG Boundaries vs. Dynamic Context Drift):</strong> Current RAG pipelines retrieve context strictly before generation. However, hallucinations frequently occur mid-generation when the model's internal attention drifts away from the retrieved context. There is a critical gap in dynamically updating retrieval state mid-generation.
                        </p>
                        <p className="body" style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '20px' }}>
                          <strong>Gap 2 (Compute Overhead of Multi-Agent Debate):</strong> While self-reflection and multi-agent debate (e.g., Chain-of-Verification) reduce hallucinations, they require multiple expensive forward passes, making them unscalable for real-time, low-latency deployment.
                        </p>
                        <p className="body" style={{ color: 'rgba(255,255,255,0.8)' }}>
                          <strong>Gap 3 (Layer-Specific vs. Global Interventions):</strong> Current ITI methods steer all transformer layers uniformly. This ignores mechanistic evidence showing that factual retrieval happens in specific mid-to-late cross-attention layers, leading to over-steering and degraded fluency.
                        </p>
                      </div>
                    </div>
                  )}

                  {reportProgress >= 3 && (
                    <div style={{ marginBottom: '48px', animation: 'fadeIn 0.5s ease-out' }}>
                      <div className="hud" style={{ color: 'var(--electric)', marginBottom: '24px', fontSize: '14px' }}>### 💡 Agent 3: Hypothesis Engine</div>
                      <div className="glass-g" style={{ padding: '36px', borderRadius: '1px', border: '1px solid var(--electric)', background: 'rgba(77,200,255,0.05)', boxShadow: '0 0 30px rgba(77,200,255,0.15)' }}>
                        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', color: 'white', marginBottom: '20px' }}>
                          Dynamic Retrieval-Gated Activation Steering (DR-GAS)
                        </h3>
                        <p className="body" style={{ color: 'rgba(255,255,255,0.9)', lineHeight: 1.7, marginBottom: '16px' }}>
                          <strong>Novel Hypothesis:</strong> We hypothesize that by training a lightweight linear probe strictly on the cross-attention layers of a RAG-enabled LLM, we can detect "retrieval failure" states in real-time.
                        </p>
                        <p className="body" style={{ color: 'rgba(255,255,255,0.9)', lineHeight: 1.7 }}>
                          Instead of static steering, we can dynamically trigger targeted Inference-Time Intervention (ITI) <em>only</em> when the model deviates from its grounding documents. This neuro-symbolic intersection should reduce hallucination rates on complex multi-hop queries by at least 40% without degrading general fluency or incurring the compute overhead of full multi-agent debate.
                        </p>
                      </div>
                    </div>
                  )}

                  {reportProgress >= 4 && (
                    <div style={{ marginBottom: '48px', animation: 'fadeIn 0.5s ease-out' }}>
                      <div className="hud" style={{ color: 'var(--violet)', marginBottom: '24px', fontSize: '14px' }}>### 🗺️ Agent 4: Execution Roadmap</div>
                      <div className="glass" style={{ padding: '24px', borderLeft: '2px solid var(--violet)', display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '16px', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '1px' }}>
                          <strong style={{ color: 'var(--violet)' }}>Month 1:</strong>
                          <span style={{ color: 'rgba(255,255,255,0.8)' }}>Dataset Prep &amp; Tooling. Establish mechanistic interpretability tooling (Captum, TransformerLens) and curate a dataset of 5,000 activation-hallucination pairs using TruthfulQA and HaluEval.</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '16px', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '1px' }}>
                          <strong style={{ color: 'var(--violet)' }}>Month 2:</strong>
                          <span style={{ color: 'rgba(255,255,255,0.8)' }}>Probe Training &amp; Layer Profiling. Extract internal activations from Llama-3-8B during RAG runs. Train the linear probe to identify divergence layers with &gt;90% precision.</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '16px', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '1px' }}>
                          <strong style={{ color: 'var(--violet)' }}>Month 3:</strong>
                          <span style={{ color: 'rgba(255,255,255,0.8)' }}>Steering Integration. Implement the DR-GAS dynamic intervention vectors, multiplying them by the probe's confidence score at each autoregressive decoding step.</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '16px', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '1px' }}>
                          <strong style={{ color: 'var(--violet)' }}>Month 4:</strong>
                          <span style={{ color: 'rgba(255,255,255,0.8)' }}>Benchmarking. Evaluate DR-GAS against standard RAG, baseline ITI, and Self-Reflection frameworks on computational overhead and factual accuracy.</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '16px', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '1px' }}>
                          <strong style={{ color: 'var(--violet)' }}>Month 5:</strong>
                          <span style={{ color: 'rgba(255,255,255,0.8)' }}>Ablation Studies. Perform layer-wise ablation to determine the exact mid-to-late transformer blocks responsible for factual routing.</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '16px', padding: '16px', background: 'rgba(255,255,255,0.03)', borderRadius: '1px' }}>
                          <strong style={{ color: 'var(--violet)' }}>Month 6:</strong>
                          <span style={{ color: 'rgba(255,255,255,0.8)' }}>Publication. Draft the final research paper detailing the DR-GAS architecture and open-source the pipeline to the community.</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {reportProgress < 4 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '32px' }}>
                      <div style={{ width: '4px', height: '4px', background: 'var(--electric)', borderRadius: '50%', animation: 'pulse 1s infinite' }}></div>
                      <span className="hud" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px' }}>AWAITING NEXT AGENT PAYLOAD...</span>
                    </div>
                  )}

                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {appState !== 'report' && (
        <footer style={{ padding: '44px 5%', borderTop: '1px solid rgba(123,45,191,.1)', position: 'relative', zIndex: 10, background: 'var(--void)' }}>
          <div className="max" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 500, letterSpacing: '.08em', color: 'rgba(184,200,216,.35)' }}>VERTEXFLOW</div>
                <div className="hud" style={{ color: 'rgba(184,200,216,.18)', fontSize: '8px' }}>AUTONOMOUS RESEARCH SYNTHESIS ENGINE</div>
              </div>
            </div>
            <div className="hud" style={{ color: 'rgba(200,151,58,.22)' }}>INGEST → SYNTHESIZE → ROADMAP</div>
          </div>
        </footer>
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </>
  );
}
