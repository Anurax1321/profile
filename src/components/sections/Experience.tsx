import { motion } from 'framer-motion';
import { experiences } from '../../data/experience';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import styles from './Experience.module.css';

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const entryVariants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

export default function Experience() {
  const { ref, isInView } = useScrollReveal();

  return (
    <motion.div
      className={styles.timeline}
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'show' : 'hidden'}
    >
      {experiences.map((exp) => (
        <motion.div key={`${exp.company}-${exp.title}`} className={styles.entry} variants={entryVariants}>
          <div className={styles.node} />
          <span className={styles.period}>{exp.period}</span>
          <h3 className={styles.title}>{exp.title}</h3>
          <p className={styles.companyLine}>
            <span className={styles.company}>{exp.company}</span> &middot; {exp.location}
          </p>
          <ul className={styles.descriptionList}>
            {exp.description.map((d, i) => (
              <li key={i} className={styles.descItem}>{d}</li>
            ))}
          </ul>
          {exp.tech && exp.tech.length > 0 && (
            <div className={styles.techTags}>
              {exp.tech.map((t) => (
                <span key={t} className={styles.tag}>{t}</span>
              ))}
            </div>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}
