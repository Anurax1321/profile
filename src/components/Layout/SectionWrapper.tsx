import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../utils/cn';
import TerminalPrompt from '../themed/decorations/TerminalPrompt';
import HudFrame from '../themed/decorations/HudFrame';
import SigilHeader from '../themed/decorations/SigilHeader';
import styles from './SectionWrapper.module.css';

interface SectionWrapperProps {
  id: string;
  title: string;
  children: ReactNode;
  className?: string;
}

export default function SectionWrapper({ id, title, children, className }: SectionWrapperProps) {
  const { ref, isInView } = useScrollReveal();
  const { theme } = useTheme();

  const renderHeader = () => {
    switch (theme) {
      case 'matrix':
        return <TerminalPrompt>{title}</TerminalPrompt>;
      case 'cyberpunk':
        return (
          <HudFrame>
            <h2 className={styles.title}>{title}</h2>
          </HudFrame>
        );
      case 'got':
        return <SigilHeader>{title}</SigilHeader>;
      default:
        return <h2 className={styles.title}>{title}</h2>;
    }
  };

  return (
    <section id={id} className={cn(styles.section, className)} ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className={styles.header}>{renderHeader()}</div>
        <div className={styles.content}>{children}</div>
      </motion.div>
    </section>
  );
}
