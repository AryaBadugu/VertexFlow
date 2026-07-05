import { useEffect } from 'react';

const agents = [
  { id: 1, name: 'Extractor Agent', desc: 'Scans papers for methodologies & techniques', type: 'glass' },
  { id: 2, name: 'Gap Analyzer', desc: 'Identifies research gaps & open problems', type: 'glass' },
  { id: 3, name: 'Hypothesis Engine', desc: 'Generates novel, testable hypotheses', type: 'glass' },
  { id: 4, name: 'Roadmap Planner', desc: 'Drafts 6-month research roadmaps', type: 'glass-g' }, // Distinct finish
];

export default function AgentDashboard({ agentStatuses, isVisible }) {
  useEffect(() => {
    if (isVisible) {
      setTimeout(() => {
        document.querySelectorAll('.agent-r').forEach(el => el.classList.add('show'));
      }, 100);
    } else {
      document.querySelectorAll('.agent-r').forEach(el => el.classList.remove('show'));
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div style={{ position: 'fixed', bottom: '40px', left: 0, right: 0, zIndex: 20, padding: '0 5%' }}>
      <div style={{ maxWidth: '1160px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '18px' }} className="g4">
        {agents.map((agent, i) => {
          const status = agentStatuses[i] || 'idle';
          
          let borderStyle = {};
          if (status === 'running') {
            borderStyle = { borderColor: 'rgba(77,200,255,.5)', boxShadow: '0 0 16px rgba(77,200,255,0.1)' };
          } else if (status === 'complete') {
            borderStyle = { borderColor: 'rgba(200,151,58,.4)' };
          }

          // Delay for cascade entrance
          const delayClass = i === 0 ? '' : i === 1 ? 'rd' : i === 2 ? 'rd2' : 'rd3';

          return (
            <div
              key={agent.id}
              className={`${agent.type} agent-r r ${delayClass}`}
              style={{ padding: '20px 18px', borderRadius: '1px', position: 'relative', overflow: 'hidden', ...borderStyle, transition: 'all 0.5s ease' }}
            >
              <div className="pn" style={{ fontSize: '28px', width: 'auto', marginBottom: '8px', opacity: status === 'running' ? 1 : 0.38 }}>
                0{agent.id}
              </div>
              <h3 style={{ fontSize: '13px', fontWeight: 500, marginBottom: '6px' }}>{agent.name}</h3>
              <p className="body-sm" style={{ color: 'rgba(184,200,216,.5)', fontSize: '12px' }}>{agent.desc}</p>

              {status === 'running' && (
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: 'rgba(77,200,255,.2)' }}>
                  <div
                    className="bar-fill show"
                    style={{ background: 'var(--color-electric)', height: '100%', transformOrigin: 'left', animation: 'bar-progress 2s linear infinite' }}
                  />
                </div>
              )}
              {status === 'complete' && (
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: 'var(--color-gold)' }} />
              )}
            </div>
          );
        })}
      </div>
      <style>{`
        @keyframes bar-progress {
          0% { transform: scaleX(0); opacity: 1; }
          50% { transform: scaleX(1); opacity: 1; }
          50.1% { opacity: 0; }
          100% { transform: scaleX(0); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
