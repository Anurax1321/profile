import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSun } from 'react-icons/fi';
import { FaTerminal, FaBolt, FaCrown } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import { THEMES, THEME_LABELS, type Theme } from '../../utils/constants';
import { cn } from '../../utils/cn';
import styles from './ThemeSwitcher.module.css';

const THEME_ICONS: Record<Theme, React.ComponentType> = {
  minimal: FiSun,
  matrix: FaTerminal,
  cyberpunk: FaBolt,
  got: FaCrown,
};

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [hoveredTheme, setHoveredTheme] = useState<Theme | null>(null);

  return (
    <div className={styles.container}>
      {THEMES.map((t) => {
        const Icon = THEME_ICONS[t];
        const isActive = theme === t;

        return (
          <button
            key={t}
            className={cn(styles.button, isActive && styles.buttonActive)}
            onClick={() => setTheme(t)}
            onMouseEnter={() => setHoveredTheme(t)}
            onMouseLeave={() => setHoveredTheme(null)}
            aria-label={`Switch to ${THEME_LABELS[t]} theme`}
          >
            <AnimatePresence>
              {isActive && (
                <motion.span
                  className={styles.activeIndicator}
                  layoutId="theme-indicator"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.15 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </AnimatePresence>
            <span className={styles.icon}>
              <Icon />
            </span>
            <AnimatePresence>
              {hoveredTheme === t && (
                <motion.span
                  className={styles.tooltip}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.15 }}
                >
                  {THEME_LABELS[t]}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        );
      })}
    </div>
  );
}
