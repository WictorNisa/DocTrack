import { useEffect, useRef } from 'react';

export default function Spotlight() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let rafId = 0;
    let lastX = 0;
    let lastY = 0;
    const move = (e: MouseEvent) => {
      lastX = e.clientX;
      lastY = e.clientY;
      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          const rect = el.getBoundingClientRect();
          const x = lastX - rect.left;
          const y = lastY - rect.top;
          el.style.background = `radial-gradient(600px circle at ${x}px ${y}px, rgba(124,58,237,0.07), transparent 60%)`;
          rafId = 0;
        });
      }
    };
    window.addEventListener('mousemove', move);
    return () => {
      window.removeEventListener('mousemove', move);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 1,
        transition: 'background 0.15s',
      }}
    />
  );
}
