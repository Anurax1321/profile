import { useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './RippleIntro.module.css';

interface Props {
  onComplete: () => void;
  soundSrc?: string;
  ringCount?: number;
  duration?: number;
}

export default function RippleIntro({
  onComplete,
  soundSrc = '/droplet.mp3',
  ringCount = 6,
  duration = 2.0,
}: Props) {
  useEffect(() => {
    const audio = new Audio(soundSrc);
    audio.volume = 0.55;
    // Browsers block autoplay without a user gesture; swallow the rejection.
    audio.play().catch(() => {});

    // Tight overlap between rings keeps the wave feeling continuous.
    const stagger = 0.14;
    const totalMs = (duration + (ringCount - 1) * stagger) * 1000 + 100;
    const timer = window.setTimeout(onComplete, totalMs);
    return () => window.clearTimeout(timer);
  }, [onComplete, soundSrc, ringCount, duration]);

  return (
    <div className={styles.overlay} aria-hidden>
      {Array.from({ length: ringCount }).map((_, i) => (
        <motion.span
          key={i}
          className={styles.ring}
          initial={{ scale: 0.12, opacity: 0.5 }}
          animate={{ scale: 16, opacity: 0 }}
          transition={{
            duration,
            delay: i * 0.14,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      ))}
    </div>
  );
}
