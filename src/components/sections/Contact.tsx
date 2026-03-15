import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLinkedin, FaGithub } from 'react-icons/fa';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import styles from './Contact.module.css';

function useObfuscatedEmail() {
  return useMemo(() => {
    const user = 'jyothiranurag';
    const domain = 'gmail.com';
    const email = `${user}@${domain}`;
    return { email, href: `mailto:${email}` };
  }, []);
}

function useContacts() {
  const { email, href } = useObfuscatedEmail();
  return useMemo(
    () => [
      {
        label: 'Email',
        value: email,
        href,
        icon: FaEnvelope,
      },
      {
        label: 'LinkedIn',
        value: 'anuragchinnaboina',
        href: 'https://linkedin.com/in/anuragchinnaboina',
        icon: FaLinkedin,
      },
      {
        label: 'GitHub',
        value: 'Anurax1321',
        href: 'https://github.com/Anurax1321',
        icon: FaGithub,
      },
    ],
    [email, href]
  );
}

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

export default function Contact() {
  const { ref, isInView } = useScrollReveal();
  const contacts = useContacts();

  return (
    <motion.div
      className={styles.grid}
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'show' : 'hidden'}
    >
      {contacts.map((c) => {
        const Icon = c.icon;
        return (
          <motion.a
            key={c.label}
            href={c.href}
            target={c.label !== 'Email' ? '_blank' : undefined}
            rel={c.label !== 'Email' ? 'noopener noreferrer' : undefined}
            className={styles.card}
            variants={cardVariants}
          >
            <Icon className={styles.icon} />
            <div className={styles.info}>
              <span className={styles.label}>{c.label}</span>
              <span className={styles.value}>{c.value}</span>
            </div>
          </motion.a>
        );
      })}
    </motion.div>
  );
}
