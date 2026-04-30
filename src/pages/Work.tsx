import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProjectList from '../components/work/ProjectList';
// Constellation + modal kept around but unused; revive if we want a graph view later.
// import NodeGraph from '../components/work/NodeGraph';
// import ProjectModal from '../components/work/ProjectModal';
import { PROJECTS, ROLE_IDS, validateProjects, type RoleId } from '../data/projects';
import { useRoleParam } from '../hooks/useRoleParam';
import styles from './Work.module.css';

const ROLE_LABELS: Record<RoleId, string> = {
  swe: 'SWE',
  aiml: 'AI / ML',
  data: 'Data',
  infra: 'Infra',
};

export default function Work() {
  const { role: activeRole, setRole } = useRoleParam();

  useEffect(() => {
    if (import.meta.env.DEV) validateProjects();
  }, []);

  return (
    <div className={styles.work}>
      <Link to="/" className={styles.backLink}>
        &larr; Home
      </Link>

      <header className={styles.header}>
        <h1 className={styles.title}>Work</h1>
        <p className={styles.subtitle}>
          Experience and projects. Tap a card to expand the details.
        </p>

        <div className={styles.tabs} role="tablist" aria-label="Filter by role">
          {ROLE_IDS.map((r) => {
            const isActive = r === activeRole;
            return (
              <button
                key={r}
                role="tab"
                aria-selected={isActive}
                onClick={() => setRole(r)}
                className={[styles.tab, isActive ? styles.tabActive : ''].join(' ')}
              >
                {ROLE_LABELS[r]}
              </button>
            );
          })}
        </div>
      </header>

      <ProjectList nodes={PROJECTS} activeRole={activeRole} />
    </div>
  );
}
