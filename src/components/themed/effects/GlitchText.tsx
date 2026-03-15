import { useEffect, useState, useCallback, useRef } from 'react';
import styles from './GlitchText.module.css';

interface GlitchTextProps {
  children: string;
  className?: string;
}

const GLITCH_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`0123456789';

const GlitchText: React.FC<GlitchTextProps> = ({ children, className }) => {
  const [displayText, setDisplayText] = useState(children);
  const [isGlitching, setIsGlitching] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const intervalRef = useRef<ReturnType<typeof setInterval>>(undefined);

  const triggerGlitch = useCallback(() => {
    setIsGlitching(true);

    // Rapidly swap characters for 200ms
    let elapsed = 0;
    const step = 30;
    intervalRef.current = setInterval(() => {
      elapsed += step;
      if (elapsed >= 200) {
        clearInterval(intervalRef.current);
        setDisplayText(children);
        setIsGlitching(false);
        return;
      }
      // Replace random characters
      const arr = children.split('');
      const replacements = Math.max(1, Math.floor(arr.length * 0.3));
      for (let i = 0; i < replacements; i++) {
        const idx = Math.floor(Math.random() * arr.length);
        arr[idx] = GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
      }
      setDisplayText(arr.join(''));
    }, step);
  }, [children]);

  useEffect(() => {
    const scheduleNext = () => {
      const delay = 3000 + Math.random() * 2000; // 3-5 seconds
      timeoutRef.current = setTimeout(() => {
        triggerGlitch();
        scheduleNext();
      }, delay);
    };

    scheduleNext();

    return () => {
      clearTimeout(timeoutRef.current);
      clearInterval(intervalRef.current);
    };
  }, [triggerGlitch]);

  // Update display text when children change
  useEffect(() => {
    if (!isGlitching) {
      setDisplayText(children);
    }
  }, [children, isGlitching]);

  const classNames = [
    styles.glitch,
    isGlitching ? styles.glitchActive : '',
    isGlitching ? styles.glitchSkew : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classNames} data-text={children}>
      {displayText}
    </span>
  );
};

export default GlitchText;
