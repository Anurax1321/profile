import styles from './ScanlineOverlay.module.css';

const ScanlineOverlay: React.FC = () => {
  return <div className={styles.scanlines} aria-hidden="true" />;
};

export default ScanlineOverlay;
