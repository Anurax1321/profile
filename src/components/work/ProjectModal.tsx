import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import type { ProjectNode, NodeType } from '../../data/projects';
import styles from './ProjectModal.module.css';

interface ProjectModalProps {
  node: ProjectNode | null;
  onClose: () => void;
}

const TYPE_LABEL: Record<NodeType, string> = {
  project: 'Project',
  internship: 'Internship',
  research: 'Research',
  class: 'Class',
};

const TYPE_PILL_CLASS: Record<NodeType, string> = {
  project: '',
  internship: styles.typePillInternship,
  research: styles.typePillResearch,
  class: styles.typePillClass,
};

function isTodoBullet(b: string): boolean {
  return b.trim().toUpperCase().startsWith('TODO');
}

export default function ProjectModal({ node, onClose }: ProjectModalProps) {
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const [showExtras, setShowExtras] = useState(false);

  // Reset show-more state whenever a different node opens.
  useEffect(() => {
    setShowExtras(false);
  }, [node?.id]);

  // Esc-to-close, scroll lock, focus management.
  useEffect(() => {
    if (!node) return;

    previouslyFocused.current = document.activeElement as HTMLElement;
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      previouslyFocused.current?.focus?.();
    };
  }, [node, onClose]);

  return (
    <AnimatePresence>
      {node && (
        <motion.div
          className={styles.backdrop}
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className={styles.modal}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`modal-title-${node.id}`}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 14 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <button
              ref={closeRef}
              type="button"
              className={styles.closeBtn}
              onClick={onClose}
              aria-label="Close project details"
            >
              &times;
            </button>

            <div className={styles.inner}>
              <div className={styles.headerRow}>
                <div className={styles.titleBlock}>
                  <h2 id={`modal-title-${node.id}`} className={styles.title}>
                    {node.title}
                  </h2>
                  <div className={styles.meta}>
                    <span
                      className={[styles.typePill, TYPE_PILL_CLASS[node.type]]
                        .filter(Boolean)
                        .join(' ')}
                    >
                      {TYPE_LABEL[node.type]}
                    </span>
                    <span>{node.org}</span>
                    <span aria-hidden>&middot;</span>
                    <span>{node.dates}</span>
                  </div>
                </div>
              </div>

              <p className={styles.summary}>{node.summary}</p>

              {(node.links?.github || node.links?.demo) && (
                <div className={styles.linkRow}>
                  {node.links?.github && (
                    <a
                      href={node.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.link}
                    >
                      <FaGithub /> GitHub
                    </a>
                  )}
                  {node.links?.demo && (
                    <a
                      href={node.links.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.link}
                    >
                      <FaExternalLinkAlt /> Live
                    </a>
                  )}
                </div>
              )}

              <div className={styles.sectionLabel}>Tech Stack</div>
              <div className={styles.chips}>
                {node.tech.map((t) => (
                  <span key={t} className={styles.chip}>
                    {t}
                  </span>
                ))}
              </div>

              {node.resumeBullets.length > 0 && (
                <>
                  <div className={styles.sectionLabel}>In My Resume</div>
                  <ul className={styles.bullets}>
                    {node.resumeBullets.map((b, i) => (
                      <li key={i} className={styles.bullet}>
                        {b}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {node.extraBullets.length > 0 && (
                <>
                  <div className={styles.sectionLabel}>Beyond The Resume</div>
                  {showExtras ? (
                    <ul className={styles.bullets}>
                      {node.extraBullets.map((b, i) => (
                        <li
                          key={i}
                          className={[
                            styles.bullet,
                            isTodoBullet(b) ? styles.todoBullet : '',
                          ]
                            .filter(Boolean)
                            .join(' ')}
                        >
                          {b}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  <button
                    type="button"
                    className={styles.toggleBtn}
                    onClick={() => setShowExtras((v) => !v)}
                    aria-expanded={showExtras}
                  >
                    {showExtras
                      ? 'Show less'
                      : `Show ${node.extraBullets.length} more (the messy details)`}
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
