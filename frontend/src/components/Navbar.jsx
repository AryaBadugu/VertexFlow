import { motion } from 'framer-motion';
import { Hexagon } from 'lucide-react';

const NAV_LINKS = ['Home', 'Architecture', 'Agents', 'Support'];

export default function Navbar({ activeTab, onTabChange, onLaunch }) {
  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: '18px 5%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'linear-gradient(180deg, rgba(4,2,10,.92) 0%, transparent 100%)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
        <div className="w-8 h-8 rounded-sm bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center border border-violet-500/30">
          <Hexagon size={16} strokeWidth={2} className="text-white" />
        </div>
        <div>
          <div style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '.1em', fontFamily: 'var(--font-sans)' }}>
            VERTEXFLOW
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '.22em', color: 'rgba(184,200,216,.3)', textTransform: 'uppercase' }}>
            AI Research Synthesis Engine
          </div>
        </div>
      </div>

      <nav className="hidden md:flex gap-8">
        {NAV_LINKS.map((link) => {
          const tabId = link.toLowerCase();
          const isActive = activeTab === tabId;
          return (
            <button
              key={link}
              onClick={() => onTabChange(tabId)}
              style={{
                fontSize: '10px',
                letterSpacing: '.18em',
                textTransform: 'uppercase',
                color: isActive ? 'var(--color-electric)' : 'rgba(184,200,216,.5)',
                textDecoration: 'none',
                transition: 'color .25s',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
              className="hover:text-[var(--color-electric)]"
            >
              {link}
            </button>
          );
        })}
      </nav>

      <button
        onClick={onLaunch}
        style={{
          padding: '9px 20px',
          border: '1px solid rgba(123,45,191,.4)',
          borderRadius: '1px',
          fontSize: '10px',
          letterSpacing: '.16em',
          textTransform: 'uppercase',
          color: 'rgba(184,200,216,.7)',
          background: 'rgba(123,45,191,.05)',
          cursor: 'pointer',
          transition: 'all .3s',
        }}
        className="hover:border-[var(--color-violet)] hover:text-white hover:bg-[rgba(155,77,255,.12)]"
      >
        Launch Engine
      </button>
    </motion.header>
  );
}
