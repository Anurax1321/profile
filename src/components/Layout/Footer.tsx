import { FaGithub, FaLinkedin } from 'react-icons/fa';
import styles from './Footer.module.css';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.links}>
          <a
            href="https://github.com/Anurax1321"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            <FaGithub className={styles.icon} />
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/anuragchinnaboina"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            <FaLinkedin className={styles.icon} />
            LinkedIn
          </a>
        </div>
        <p className={styles.text}>
          Built by Anurag Chinnaboina &copy; {year}
        </p>
      </div>
    </footer>
  );
}
