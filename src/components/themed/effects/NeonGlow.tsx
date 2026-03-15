import styles from './NeonGlow.module.css';

interface NeonGlowProps {
  children: React.ReactNode;
  className?: string;
}

const NeonGlow: React.FC<NeonGlowProps> = ({ children, className }) => {
  const classNames = [styles.neon, className ?? ''].filter(Boolean).join(' ');

  return <span className={classNames}>{children}</span>;
};

export default NeonGlow;
