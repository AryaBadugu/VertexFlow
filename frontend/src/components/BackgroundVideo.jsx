export default function BackgroundVideo() {
  return (
    <div className="fixed inset-0 z-0">
      {/* Clean dark radial gradient — no video bleed-through */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(30, 27, 45, 0.6) 0%, rgba(9, 9, 11, 1) 70%)',
        }}
      />

      {/* Subtle ambient orbs for depth */}
      <div
        className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full opacity-[0.04]"
        style={{
          background: 'radial-gradient(circle, rgba(245, 158, 11, 0.8) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-[0.03]"
        style={{
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.8) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
