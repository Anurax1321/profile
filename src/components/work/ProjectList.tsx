import { useState } from 'react';
import type { ProjectNode, RoleId, NodeType } from '../../data/projects';
import styles from './ProjectList.module.css';

interface ProjectListProps {
  nodes: ProjectNode[];
  /** Active role from the URL filter; null shows all. */
  activeRole: RoleId | null;
}

const TYPE_LABEL: Record<NodeType, string> = {
  project: 'Project',
  internship: 'Internship',
  research: 'Research',
  class: 'Class',
};

/** Items that count as professional engagements with an org. */
const EXPERIENCE_TYPES: NodeType[] = ['internship', 'research'];
/** Items that count as personal builds. */
const PROJECT_TYPES: NodeType[] = ['project', 'class'];

function isTodoBullet(b: string): boolean {
  return b.trim().toUpperCase().startsWith('TODO');
}

function ProjectCard({ node }: { node: ProjectNode }) {
  const [showExtras, setShowExtras] = useState(false);
  const cleanExtras = node.extraBullets.filter((b) => !isTodoBullet(b));

  return (
    <article className={styles.card}>
      <header className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>{node.title}</h3>
        <div className={styles.meta}>
          <span className={styles.typePill}>{TYPE_LABEL[node.type]}</span>
          <span>{node.org}</span>
          <span aria-hidden>&middot;</span>
          <span>{node.dates}</span>
        </div>
      </header>

      <p className={styles.summary}>{node.summary}</p>

      {node.tech.length > 0 && (
        <div className={styles.chips}>
          {node.tech.map((t) => (
            <span key={t} className={styles.chip}>
              {t}
            </span>
          ))}
        </div>
      )}

      {node.resumeBullets.length > 0 && (
        <ul className={styles.bullets}>
          {node.resumeBullets.map((b, i) => (
            <li key={i} className={styles.bullet}>
              {b}
            </li>
          ))}
        </ul>
      )}

      {cleanExtras.length > 0 && (
        <>
          {showExtras && (
            <div className={styles.extras}>
              <p className={styles.extrasLabel}>Beyond the resume</p>
              <ul className={styles.bullets}>
                {cleanExtras.map((b, i) => (
                  <li key={i} className={styles.bullet}>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <button
            type="button"
            className={styles.seeMore}
            onClick={() => setShowExtras((v) => !v)}
            aria-expanded={showExtras}
          >
            {showExtras ? 'See less' : `See more (${cleanExtras.length})`}
          </button>
        </>
      )}
    </article>
  );
}

export default function ProjectList({ nodes, activeRole }: ProjectListProps) {
  const filtered = nodes.filter(
    (n) => activeRole === null || n.roles.includes(activeRole),
  );
  const experience = filtered.filter((n) => EXPERIENCE_TYPES.includes(n.type));
  const projects = filtered.filter((n) => PROJECT_TYPES.includes(n.type));

  if (filtered.length === 0) {
    return (
      <div className={styles.list}>
        <p className={styles.empty}>No work tagged for this role yet.</p>
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {experience.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Experience</h2>
            <span className={styles.sectionCount}>{experience.length}</span>
          </div>
          <div className={styles.cards}>
            {experience.map((n) => (
              <ProjectCard key={n.id} node={n} />
            ))}
          </div>
        </section>
      )}

      {projects.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Projects</h2>
            <span className={styles.sectionCount}>{projects.length}</span>
          </div>
          <div className={styles.cards}>
            {projects.map((n) => (
              <ProjectCard key={n.id} node={n} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
