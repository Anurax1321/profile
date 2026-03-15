import styles from './MinimalGradient.module.css';

const MinimalGradient: React.FC = () => {
  return (
    <div className={styles.gradientContainer} aria-hidden="true">
      <div className={styles.gradient} />
      <div className={styles.overlay} />
    </div>
  );
};

export default MinimalGradient;
