import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { FaChevronDown, FaGithub, FaLinkedin, FaDownload } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import type { Theme } from '../../utils/constants';
import photo from '../../assets/photo.jpg';
import styles from './Hero.module.css';

const MinimalGradient = React.lazy(() => import('../themed/backgrounds/MinimalGradient'));
const MatrixRain = React.lazy(() => import('../themed/backgrounds/MatrixRain'));
const CyberpunkGrid = React.lazy(() => import('../themed/backgrounds/CyberpunkGrid'));
const GoTEmbers = React.lazy(() => import('../themed/backgrounds/GoTEmbers'));

const GlitchText = React.lazy(() => import('../themed/effects/GlitchText'));
const NeonGlow = React.lazy(() => import('../themed/effects/NeonGlow'));
const FireText = React.lazy(() => import('../themed/effects/FireText'));

const BACKGROUNDS: Record<Theme, React.LazyExoticComponent<React.ComponentType>> = {
  minimal: MinimalGradient,
  matrix: MatrixRain,
  cyberpunk: CyberpunkGrid,
  got: GoTEmbers,
};

function ThemedName({ theme, name }: { theme: Theme; name: string }) {
  switch (theme) {
    case 'matrix':
      return (
        <Suspense fallback={<h1 className={styles.name}>{name}</h1>}>
          <GlitchText className={styles.name}>{name}</GlitchText>
        </Suspense>
      );
    case 'cyberpunk':
      return (
        <Suspense fallback={<h1 className={styles.name}>{name}</h1>}>
          <NeonGlow className={styles.name}>
            <h1 className={styles.name}>{name}</h1>
          </NeonGlow>
        </Suspense>
      );
    case 'got':
      return (
        <Suspense fallback={<h1 className={styles.name}>{name}</h1>}>
          <FireText className={styles.name}>{name}</FireText>
        </Suspense>
      );
    default:
      return (
        <motion.h1
          className={styles.name}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {name}
        </motion.h1>
      );
  }
}

export default function Hero() {
  const { theme } = useTheme();
  const Background = BACKGROUNDS[theme];

  return (
    <section className={styles.hero} id="hero">
      <div className={styles.background}>
        <Suspense fallback={null}>
          <Background />
        </Suspense>
      </div>

      <motion.div
        className={styles.content}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <motion.div
          className={styles.photoWrapper}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <img
            src={photo}
            alt="Anurag Chinnaboina"
            className={styles.photo}
          />
        </motion.div>

        <ThemedName theme={theme} name="Anurag Chinnaboina" />

        <motion.p
          className={styles.tagline}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          Full-Stack Software Engineer
        </motion.p>

        <motion.p
          className={styles.subtitle}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.65 }}
        >
          CS &amp; Data Science @ UW-Madison
        </motion.p>

        <motion.div
          className={styles.ctaButtons}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <a href="#projects" className={styles.ctaPrimary}>
            View My Work
          </a>
          <a href="/Anurag_Chinnaboina_Resume.pdf" download className={styles.ctaSecondary}>
            <FaDownload /> Download Resume
          </a>
        </motion.div>

        <motion.div
          className={styles.socialLinks}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.95 }}
        >
          <a
            href="https://github.com/Anurax1321"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
            aria-label="GitHub"
          >
            <FaGithub />
          </a>
          <a
            href="https://linkedin.com/in/anuragchinnaboina"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
            aria-label="LinkedIn"
          >
            <FaLinkedin />
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        className={styles.scrollIndicator}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
      >
        <span>Scroll</span>
        <motion.span
          className={styles.arrow}
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        >
          <FaChevronDown />
        </motion.span>
      </motion.div>
    </section>
  );
}
