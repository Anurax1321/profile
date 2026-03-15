import styles from './HudFrame.module.css';

interface HudFrameProps {
  children: React.ReactNode;
}

const HudFrame: React.FC<HudFrameProps> = ({ children }) => {
  return (
    <div className={styles.hudFrame}>
      <span className={styles.cornerTL} aria-hidden="true">&#x2554;</span>
      <span className={styles.cornerTR} aria-hidden="true">&#x2557;</span>
      <span className={styles.cornerBL} aria-hidden="true">&#x255A;</span>
      <span className={styles.cornerBR} aria-hidden="true">&#x255D;</span>
      <span className={styles.sysPrefix} aria-hidden="true">SYS://</span>
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default HudFrame;
