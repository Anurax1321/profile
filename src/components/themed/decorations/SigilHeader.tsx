import styles from './SigilHeader.module.css';

interface SigilHeaderProps {
  children: string;
}

const OrnamentSvg: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={`${styles.dividerSvg} ${className ?? ''}`}
    viewBox="0 0 80 24"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {/* Main horizontal blade */}
    <line x1="0" y1="12" x2="55" y2="12" strokeLinecap="round" />
    {/* Sword tip / spear point */}
    <polygon
      points="55,12 70,8 75,12 70,16"
      fill="#d4a833"
      stroke="#d4a833"
      strokeWidth="1"
      opacity="0.9"
    />
    {/* Cross guard */}
    <line x1="50" y1="6" x2="50" y2="18" strokeWidth="2" strokeLinecap="round" />
    {/* Decorative diamond on the blade */}
    <polygon
      points="30,12 35,9 40,12 35,15"
      fill="none"
      stroke="#d4a833"
      strokeWidth="1"
    />
    {/* Small circle pommel */}
    <circle cx="5" cy="12" r="3" fill="none" stroke="#d4a833" strokeWidth="1.5" />
    <circle cx="5" cy="12" r="1" fill="#d4a833" />
    {/* Filigree curls near guard */}
    <path
      d="M 45,6 Q 42,3 38,5"
      fill="none"
      strokeWidth="1"
      opacity="0.6"
    />
    <path
      d="M 45,18 Q 42,21 38,19"
      fill="none"
      strokeWidth="1"
      opacity="0.6"
    />
  </svg>
);

const SigilHeader: React.FC<SigilHeaderProps> = ({ children }) => {
  return (
    <div className={styles.sigilHeader}>
      <div className={styles.divider}>
        <OrnamentSvg />
      </div>
      <span className={styles.text}>{children}</span>
      <div className={styles.divider}>
        <OrnamentSvg className={styles.dividerRight} />
      </div>
    </div>
  );
};

export default SigilHeader;
