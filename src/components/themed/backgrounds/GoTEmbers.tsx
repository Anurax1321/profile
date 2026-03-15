import { useEffect, useRef } from 'react';

interface Ember {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  maxRadius: number;
  opacity: number;
  life: number;
  maxLife: number;
  hue: number; // 10-45 range for reds/oranges/yellows
}

const GoTEmbers: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let embers: Ember[] = [];

    const getMaxEmbers = (width: number) => {
      if (width < 600) return 50;
      if (width < 1024) return 80;
      return 120;
    };

    let maxEmbers: number = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      maxEmbers = getMaxEmbers(canvas.width);
    };

    resize();

    const createEmber = (): Ember => {
      const maxLife = 200 + Math.random() * 300;
      return {
        x: Math.random() * canvas.width,
        y: canvas.height + Math.random() * 20,
        vx: (Math.random() - 0.5) * 0.8,
        vy: -(0.5 + Math.random() * 1.5),
        radius: 0,
        maxRadius: 1 + Math.random() * 2.5,
        opacity: 0.8 + Math.random() * 0.2,
        life: 0,
        maxLife,
        hue: 10 + Math.random() * 35,
      };
    };

    // Pre-populate
    for (let i = 0; i < maxEmbers * 0.5; i++) {
      const e = createEmber();
      e.y = Math.random() * canvas.height;
      e.life = Math.random() * e.maxLife * 0.6;
      embers.push(e);
    }

    if (prefersReducedMotion) {
      // Draw warm gradient background and static embers
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, '#1a0a00');
      grad.addColorStop(0.7, '#2a0a00');
      grad.addColorStop(1, '#4a1500');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (const e of embers) {
        const progress = e.life / e.maxLife;
        const alpha = (1 - progress) * 0.5;
        const r = e.maxRadius * (1 - progress * 0.5);
        ctx.beginPath();
        ctx.arc(e.x, e.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${e.hue}, 100%, 60%, ${alpha})`;
        ctx.fill();
      }
      return;
    }

    const draw = () => {
      // Draw warm gradient background each frame
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, 'rgba(10, 5, 0, 0.95)');
      grad.addColorStop(0.6, 'rgba(20, 5, 0, 0.95)');
      grad.addColorStop(0.85, 'rgba(40, 10, 0, 0.9)');
      grad.addColorStop(1, 'rgba(60, 15, 0, 0.85)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Spawn new embers
      while (embers.length < maxEmbers) {
        embers.push(createEmber());
      }

      // Update and draw embers
      for (let i = embers.length - 1; i >= 0; i--) {
        const e = embers[i];
        e.life++;

        if (e.life >= e.maxLife) {
          embers[i] = createEmber();
          continue;
        }

        const progress = e.life / e.maxLife;

        // Wobble
        e.vx += (Math.random() - 0.5) * 0.05;
        e.x += e.vx;
        e.y += e.vy;

        // Size: grow quickly then shrink
        const sizeCurve = progress < 0.1
          ? progress / 0.1
          : 1 - (progress - 0.1) / 0.9;
        e.radius = e.maxRadius * sizeCurve;

        // Opacity: fade out
        const alpha = e.opacity * (1 - progress);

        if (e.radius > 0.1 && alpha > 0.01) {
          // Glow effect
          const glowRadius = e.radius * 4;
          const glowGrad = ctx.createRadialGradient(
            e.x, e.y, 0, e.x, e.y, glowRadius
          );
          glowGrad.addColorStop(0, `hsla(${e.hue}, 100%, 70%, ${alpha * 0.5})`);
          glowGrad.addColorStop(0.4, `hsla(${e.hue}, 100%, 55%, ${alpha * 0.2})`);
          glowGrad.addColorStop(1, 'transparent');
          ctx.beginPath();
          ctx.arc(e.x, e.y, glowRadius, 0, Math.PI * 2);
          ctx.fillStyle = glowGrad;
          ctx.fill();

          // Core ember
          ctx.beginPath();
          ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${e.hue}, 100%, 65%, ${alpha})`;
          ctx.fill();
        }
      }

      // Subtle bottom glow
      const bottomGlow = ctx.createLinearGradient(
        0, canvas.height - 100, 0, canvas.height
      );
      bottomGlow.addColorStop(0, 'transparent');
      bottomGlow.addColorStop(1, 'rgba(180, 60, 0, 0.15)');
      ctx.fillStyle = bottomGlow;
      ctx.fillRect(0, canvas.height - 100, canvas.width, 100);

      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }}
    />
  );
};

export default GoTEmbers;
