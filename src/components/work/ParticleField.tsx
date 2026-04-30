import { useEffect, useRef } from 'react';
import styles from './ParticleField.module.css';

interface ParticleFieldProps {
  /** Number of dust particles. Default 60 (cheap on any modern device). */
  count?: number;
  /** Particle color in any CSS color. Defaults to currentColor (so themes apply). */
  color?: string;
}

/**
 * Subtle drifting dust field rendered to canvas. Designed to sit behind the
 * NodeGraph constellation without competing visually: low alpha, slow drift,
 * tiny radius. Pauses when the tab isn't visible (saves CPU).
 */
export default function ParticleField({ count = 60, color }: ParticleFieldProps) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let running = true;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { clientWidth, clientHeight } = canvas;
      canvas.width = Math.max(1, Math.floor(clientWidth * dpr));
      canvas.height = Math.max(1, Math.floor(clientHeight * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const w = () => canvas.clientWidth;
    const h = () => canvas.clientHeight;

    interface P {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      a: number;
    }

    const particles: P[] = Array.from({ length: count }, () => ({
      x: Math.random() * w(),
      y: Math.random() * h(),
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.12,
      r: 0.6 + Math.random() * 1.4,
      a: 0.18 + Math.random() * 0.32,
    }));

    const resolveColor = (): string => {
      if (color) return color;
      const probe = getComputedStyle(canvas).getPropertyValue('color').trim();
      return probe || '#00f0ff';
    };

    const tick = () => {
      if (!running) return;
      const W = w();
      const H = h();
      ctx.clearRect(0, 0, W, H);
      const c = resolveColor();
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -2) p.x = W + 2;
        if (p.x > W + 2) p.x = -2;
        if (p.y < -2) p.y = H + 2;
        if (p.y > H + 2) p.y = -2;

        ctx.globalAlpha = p.a;
        ctx.fillStyle = c;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    document.addEventListener('visibilitychange', onVisibility);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [count, color]);

  return <canvas ref={ref} className={styles.canvas} aria-hidden />;
}
