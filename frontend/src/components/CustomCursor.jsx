import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  
  useEffect(() => {
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;

    const handleMouseMove = (e) => {
      mx = e.clientX;
      my = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.left = `${mx}px`;
        dotRef.current.style.top = `${my}px`;
      }
      if (ringRef.current) {
        ringRef.current.style.left = `${mx}px`;
        ringRef.current.style.top = `${my}px`;
      }
    };

    const handleMouseDown = () => {
      if (dotRef.current) dotRef.current.style.transform = 'translate(-50%,-50%) scale(0.6)';
      if (ringRef.current) ringRef.current.style.transform = 'translate(-50%,-50%) scale(1.5)';
    };

    const handleMouseUp = () => {
      if (dotRef.current) dotRef.current.style.transform = 'translate(-50%,-50%) scale(1)';
      if (ringRef.current) ringRef.current.style.transform = 'translate(-50%,-50%) scale(1)';
    };

    const handleMouseOver = (e) => {
      if (e.target.tagName === 'A' || e.target.closest('a') || e.target.classList.contains('nc')) {
        if (dotRef.current) dotRef.current.style.background = 'var(--rose)';
      } else {
        if (dotRef.current) dotRef.current.style.background = 'var(--electric)';
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <>
      <div id="cur" ref={dotRef}></div>
      <div id="cur-ring" ref={ringRef}></div>
    </>
  );
}
