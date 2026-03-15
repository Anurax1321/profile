import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import { projects } from '../../data/projects';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import styles from './Projects.module.css';

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

export default function Projects() {
  const { ref, isInView } = useScrollReveal();

  return (
    <motion.div
      className={styles.grid}
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'show' : 'hidden'}
    >
      {projects.map((project) => (
        <motion.div key={project.title} className={styles.card} variants={cardVariants}>
          <h3 className={styles.cardTitle}>{project.title}</h3>
          <p className={styles.cardDescription}>{project.description}</p>

          {project.highlights && project.highlights.length > 0 && (
            <ul className={styles.highlights}>
              {project.highlights.map((h, i) => (
                <li key={i} className={styles.highlight}>{h}</li>
              ))}
            </ul>
          )}

          <div className={styles.techTags}>
            {project.tech.map((t) => (
              <span key={t} className={styles.tag}>{t}</span>
            ))}
          </div>

          <div className={styles.cardLinks}>
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer" className={styles.cardLink}>
                <FaGithub className={styles.linkIcon} /> Code
              </a>
            )}
            {project.live && (
              <a href={project.live} target="_blank" rel="noopener noreferrer" className={styles.cardLink}>
                <FaExternalLinkAlt className={styles.linkIcon} /> Live
              </a>
            )}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
