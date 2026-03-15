import { motion } from 'framer-motion';
import { education } from '../../data/education';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import styles from './Education.module.css';

export default function Education() {
  const { ref, isInView } = useScrollReveal();

  return (
    <div className={styles.wrapper} ref={ref}>
      <motion.div
        className={styles.card}
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <h3 className={styles.school}>{education.school}</h3>
        <p className={styles.degree}>{education.degree}</p>

        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>GPA</span>
            <span className={styles.metaValue}>{education.gpa}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Expected Graduation</span>
            <span className={styles.metaValue}>{education.graduation}</span>
          </div>
        </div>

        {education.honors && education.honors.length > 0 && (
          <div>
            <p className={styles.honorsLabel}>Honors</p>
            <div className={styles.honorsList}>
              {education.honors.map((h) => (
                <span key={h} className={styles.honor}>{h}</span>
              ))}
            </div>
          </div>
        )}

        {education.coursework && education.coursework.length > 0 && (
          <div>
            <p className={styles.courseworkLabel}>Relevant Coursework</p>
            <div className={styles.courseworkList}>
              {education.coursework.map((c) => (
                <span key={c} className={styles.course}>{c}</span>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
