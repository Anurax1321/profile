import styles from './FireText.module.css';

interface FireTextProps {
  children: string;
  className?: string;
}

const FireText: React.FC<FireTextProps> = ({ children, className }) => {
  const classNames = [styles.fire, className ?? ''].filter(Boolean).join(' ');

  return <span className={classNames}>{children}</span>;
};

export default FireText;
