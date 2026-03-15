import { TypeAnimation } from 'react-type-animation';
import styles from './TerminalPrompt.module.css';

interface TerminalPromptProps {
  children: string;
}

const TerminalPrompt: React.FC<TerminalPromptProps> = ({ children }) => {
  const text = children.toLowerCase().replace(/\s+/g, '_');

  return (
    <div className={styles.terminal}>
      <span className={styles.prompt}>&gt;</span>
      <span className={styles.text}>
        <TypeAnimation
          sequence={[text]}
          speed={70}
          cursor={false}
          repeat={0}
        />
      </span>
      <span className={styles.cursor} aria-hidden="true" />
    </div>
  );
};

export default TerminalPrompt;
