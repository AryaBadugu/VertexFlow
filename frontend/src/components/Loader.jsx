export default function Loader({ isVisible }) {
  return (
    <div
      id="loader"
      style={{
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'auto' : 'none'
      }}
    >
      <div className="l-ring"></div>
      <p className="hud" style={{ color: 'rgba(155,77,255,.45)' }}>Starling · Initializing</p>
    </div>
  );
}
