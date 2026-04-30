import React, { Suspense, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaLinkedin, FaDownload, FaArrowRight } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import type { Theme } from '../../utils/constants';
import photo from '../../assets/photo.jpg';
import RippleIntro from '../RippleIntro/RippleIntro';
import { useRoleParam } from '../../hooks/useRoleParam';
import styles from './Hero.module.css';

const MinimalGradient = React.lazy(() => import('../themed/backgrounds/MinimalGradient'));
const MatrixRain = React.lazy(() => import('../themed/backgrounds/MatrixRain'));
const CyberpunkGrid = React.lazy(() => import('../themed/backgrounds/CyberpunkGrid'));
const GoTEmbers = React.lazy(() => import('../themed/backgrounds/GoTEmbers'));

const GlitchText = React.lazy(() => import('../themed/effects/GlitchText'));
const FireText = React.lazy(() => import('../themed/effects/FireText'));

const BACKGROUNDS: Record<Theme, React.LazyExoticComponent<React.ComponentType>> = {
  minimal: MinimalGradient,
  matrix: MatrixRain,
  cyberpunk: CyberpunkGrid,
  got: GoTEmbers,
};

// Re-exported from data/projects to keep one source of truth for role ids.
import type { RoleId } from '../../data/projects';

interface Role {
  id: RoleId;
  label: string;
  hook: string;
  resume: string;
  primary: boolean;
}

const ROLES: Role[] = [
  {
    id: 'swe',
    label: 'SWE',
    hook: 'Full-stack systems end-to-end, from React UIs to multi-threaded control loops.',
    resume: '/Anurag_Chinnaboina_SWE.pdf',
    primary: true,
  },
  {
    id: 'aiml',
    label: 'AI / ML',
    hook: 'AI that ships to production. Not AI that demos in notebooks.',
    resume: '/Anurag_Chinnaboina_AI_ML.pdf',
    primary: true,
  },
  {
    id: 'data',
    label: 'Data',
    hook: 'I turn messy data into systems people rely on.',
    resume: '/Anurag_Chinnaboina_Data.pdf',
    primary: false,
  },
  {
    id: 'infra',
    label: 'Infra',
    hook: 'Build it to survive 2 AM. Docker, CI/CD, fault-tolerant control systems.',
    resume: '/Anurag_Chinnaboina_Infra.pdf',
    primary: false,
  },
];

function ThemedName({ theme, name }: { theme: Theme; name: string }) {
  switch (theme) {
    case 'matrix':
      return (
        <Suspense fallback={<h1 className={styles.name}>{name}</h1>}>
          <GlitchText className={styles.name}>{name}</GlitchText>
        </Suspense>
      );
    case 'cyberpunk':
      // Cyberpunk name stays clean/professional; no neon glow.
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

  const [introDone, setIntroDone] = useState(false);
  const { role: activeRole, setRole: setActiveRole } = useRoleParam();

  const role = ROLES.find((r) => r.id === activeRole) ?? ROLES[0];

  return (
    <section className={styles.hero} id="hero">
      <div className={styles.background}>
        <Suspense fallback={null}>
          <Background />
        </Suspense>
      </div>

      <Link
        to={`/work?role=${activeRole}`}
        className={styles.workLink}
        aria-label="Open Work page"
      >
        Work <FaArrowRight aria-hidden />
      </Link>

      <AnimatePresence>
        {!introDone && (
          <RippleIntro onComplete={() => setIntroDone(true)} />
        )}
      </AnimatePresence>

      <div className={styles.content}>
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

        <AnimatePresence>
          {introDone && (
            <motion.div
              key="body"
              className={styles.body}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
            >
              <ThemedName theme={theme} name="Anurag Chinnaboina" />

              <div className={styles.roleTabs} role="tablist" aria-label="Role focus">
                {ROLES.map((r) => {
                  const isActive = r.id === activeRole;
                  return (
                    <button
                      key={r.id}
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActiveRole(r.id)}
                      className={[
                        styles.roleTab,
                        r.primary ? styles.rolePrimary : styles.roleSecondary,
                        isActive ? styles.roleActive : '',
                      ].join(' ')}
                    >
                      {r.label}
                    </button>
                  );
                })}
              </div>

              <motion.p
                key={role.id}
                className={styles.roleHook}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {role.hook}
              </motion.p>

              <p className={styles.pitch}>
                I'm not just a feature builder. I think about graceful degradation,
                deployment, and what breaks at 2 AM. What I like most is solving messy,
                real-world problems: turning raw data into structured output and making
                manual processes disappear.
              </p>

              <div className={styles.ctaButtons}>
                <a
                  href={role.resume}
                  download
                  className={styles.ctaSecondary}
                  key={role.id + '-dl'}
                >
                  <FaDownload /> Download {role.label} Resume
                </a>
              </div>

              <div className={styles.socialLinks}>
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
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {introDone && (
        <motion.p
          className={styles.copyright}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Built by Anurag Chinnaboina &copy; {new Date().getFullYear()}
        </motion.p>
      )}
    </section>
  );
}
