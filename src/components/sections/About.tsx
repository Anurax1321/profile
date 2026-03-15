import { motion } from 'framer-motion';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import styles from './About.module.css';

const ABOUT_TEXT =
  "I'm a software engineer who thrives at the intersection of systems thinking and product building. From architecting real-time platforms serving 500+ users to writing hardware drivers that talk to 3D metal printers over serial protocols \u2014 I build things that work in production, not just in demos. Currently pursuing a B.S. in Computer Science and Data Science at UW-Madison, I bring a bias toward shipping: containerized deployments, comprehensive test suites, and systems designed for real users. When I'm not writing code, I'm mentoring 100+ students as a drop-in tutor or exploring the latest in AI/ML.";

export default function About() {
  const { ref, isInView } = useScrollReveal();

  return (
    <div className={styles.about} ref={ref}>
      <motion.p
        className={styles.text}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {ABOUT_TEXT}
      </motion.p>
    </div>
  );
}
