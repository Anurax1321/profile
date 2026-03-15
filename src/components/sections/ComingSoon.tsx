import { motion } from 'framer-motion';
import { FaHardHat } from 'react-icons/fa';
import styles from './ComingSoon.module.css';

interface ComingSoonProps {
  title: string;
  message?: string;
}

export default function ComingSoon({ title: _title, message }: ComingSoonProps) {
  return (
    <div className={styles.wrapper}>
      <motion.div
        className={styles.icon}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
      >
        <FaHardHat />
      </motion.div>

      <p className={styles.message}>
        {message || 'This section is under construction. Check back soon!'}
      </p>

      <div className={styles.dots}>
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className={styles.dot}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{
              repeat: Infinity,
              duration: 1.2,
              delay: i * 0.2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </div>
  );
}
