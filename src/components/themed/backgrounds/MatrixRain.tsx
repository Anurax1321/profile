import { useEffect, useRef } from 'react';

const KATAKANA =
  '\u30A0\u30A1\u30A2\u30A3\u30A4\u30A5\u30A6\u30A7\u30A8\u30A9\u30AA\u30AB\u30AC\u30AD\u30AE\u30AF\u30B0\u30B1\u30B2\u30B3\u30B4\u30B5\u30B6\u30B7\u30B8\u30B9\u30BA\u30BB\u30BC\u30BD\u30BE\u30BF\u30C0\u30C1\u30C2\u30C3\u30C4\u30C5\u30C6\u30C7\u30C8\u30C9\u30CA\u30CB\u30CC\u30CD\u30CE\u30CF';
const LATIN = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const DIGITS = '0123456789';
const CHARS = KATAKANA + LATIN + DIGITS;

const GREEN = '#00ff41';
const FONT_SIZE = 16;

const MatrixRain: React.FC = () => {
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
    let columns: number = 0;
    let drops: number[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      columns = Math.floor(canvas.width / FONT_SIZE);
      drops = new Array(columns).fill(0).map(() => Math.random() * -100);
    };

    resize();

    if (prefersReducedMotion) {
      // Static green overlay fallback
      ctx.fillStyle = 'rgba(0, 255, 65, 0.03)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // Draw a few static characters scattered around
      ctx.font = `${FONT_SIZE}px monospace`;
      ctx.fillStyle = 'rgba(0, 255, 65, 0.08)';
      for (let i = 0; i < columns; i++) {
        const rows = Math.floor(canvas.height / FONT_SIZE);
        for (let j = 0; j < rows; j++) {
          if (Math.random() > 0.7) {
            const char = CHARS[Math.floor(Math.random() * CHARS.length)];
            ctx.fillText(char, i * FONT_SIZE, j * FONT_SIZE);
          }
        }
      }
      return;
    }

    const draw = () => {
      // Fade trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${FONT_SIZE}px monospace`;

      for (let i = 0; i < columns; i++) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        const x = i * FONT_SIZE;
        const y = drops[i] * FONT_SIZE;

        // Bright head character
        ctx.fillStyle = '#ffffff';
        ctx.fillText(char, x, y);

        // Trailing green character slightly behind
        ctx.fillStyle = GREEN;
        const trailChar = CHARS[Math.floor(Math.random() * CHARS.length)];
        ctx.fillText(trailChar, x, y - FONT_SIZE);

        // Dimmer trail
        ctx.fillStyle = 'rgba(0, 255, 65, 0.6)';
        const dimChar = CHARS[Math.floor(Math.random() * CHARS.length)];
        ctx.fillText(dimChar, x, y - FONT_SIZE * 2);

        drops[i]++;

        // Reset drop with randomized threshold for varied speeds
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
      }

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
        background: '#000000',
      }}
    />
  );
};

export default MatrixRain;
