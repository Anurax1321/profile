import { motion } from 'framer-motion';
import {
  SiOpenjdk, SiPython, SiJavascript, SiTypescript, SiR, SiC, SiMysql, SiGnubash,
  SiHtml5, SiReact, SiFlask, SiFastapi, SiNodedotjs, SiExpress, SiDocker, SiGit,
  SiGithubactions, SiLinux, SiPytorch, SiScikitlearn, SiPandas, SiNumpy, SiOpenai,
  SiPostgresql, SiRedis, SiSqlite, SiGooglecloud, SiRender, SiSelenium,
  SiPytest, SiJunit5,
} from 'react-icons/si';
import {
  FaTerminal, FaServer, FaDatabase, FaChartLine, FaChartBar, FaPlug,
  FaBroadcastTower, FaExchangeAlt, FaLock, FaKey, FaTasks,
} from 'react-icons/fa';
import { skillCategories } from '../../data/skills';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import styles from './Skills.module.css';
import type { IconType } from 'react-icons';

const ICON_MAP: Record<string, IconType> = {
  SiOpenjdk, SiPython, SiJavascript, SiTypescript, SiR, SiC, SiMysql, SiGnubash,
  SiHtml5, SiReact, SiFlask, SiFastapi, SiNodedotjs, SiExpress, SiDocker, SiGit,
  SiGithubactions, SiLinux, SiPytorch, SiScikitlearn, SiPandas, SiNumpy, SiOpenai,
  SiPostgresql, SiRedis, SiSqlite, SiGooglecloud, SiRender, SiSelenium,
  SiPytest, SiJunit5,
  SiOracle: FaDatabase,
  FaTerminal, FaServer, FaDatabase, FaChartLine, FaChartBar, FaPlug,
  FaBroadcastTower, FaExchangeAlt, FaLock, FaKey, FaTasks,
};

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

export default function Skills() {
  const { ref, isInView } = useScrollReveal();

  return (
    <motion.div
      className={styles.grid}
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'show' : 'hidden'}
    >
      {skillCategories.map((category) => (
        <motion.div key={category.title} className={styles.card} variants={cardVariants}>
          <h3 className={styles.categoryTitle}>{category.title}</h3>
          <div className={styles.skillsList}>
            {category.skills.map((skill) => {
              const Icon = ICON_MAP[skill.icon];
              return (
                <span key={skill.name} className={styles.skill}>
                  {Icon && <Icon className={styles.skillIcon} />}
                  {skill.name}
                </span>
              );
            })}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
