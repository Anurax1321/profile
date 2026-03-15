import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';
import ThemeSwitcher from '../ThemeSwitcher/ThemeSwitcher';
import styles from './Navbar.module.css';

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Education', href: '#education' },
  { label: 'Contact', href: '#contact' },
];

const SECTION_IDS = NAV_LINKS.map((l) => l.href.slice(1));

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  const handleObserver = useCallback(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
    );

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return observer;
  }, []);

  useEffect(() => {
    const observer = handleObserver();
    return () => observer.disconnect();
  }, [handleObserver]);

  const closeMobile = () => setMobileOpen(false);

  return (
    <nav className={styles.navbar}>
      <div className={styles.inner}>
        <a href="#" className={styles.logo}>
          AC
        </a>

        <div className={styles.desktopNav}>
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={cn(
                styles.navLink,
                activeSection === link.href.slice(1) && styles.navLinkActive
              )}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className={styles.actions}>
          <ThemeSwitcher />
          <button
            className={cn(styles.hamburger, mobileOpen && styles.hamburgerOpen)}
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className={styles.mobileOverlay}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
          >
            {NAV_LINKS.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                className={cn(
                  styles.mobileLink,
                  activeSection === link.href.slice(1) && styles.mobileLinkActive
                )}
                onClick={closeMobile}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                {link.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
