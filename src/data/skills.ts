export interface Skill {
  name: string;
  icon: string;
}

export interface SkillCategory {
  title: string;
  skills: Skill[];
}

export const skillCategories: SkillCategory[] = [
  {
    title: 'Languages',
    skills: [
      { name: 'Java', icon: 'SiOpenjdk' },
      { name: 'Python', icon: 'SiPython' },
      { name: 'JavaScript', icon: 'SiJavascript' },
      { name: 'TypeScript', icon: 'SiTypescript' },
      { name: 'R', icon: 'SiR' },
      { name: 'C', icon: 'SiC' },
      { name: 'SQL', icon: 'SiMysql' },
      { name: 'Bash', icon: 'SiGnubash' },
      { name: 'HTML/CSS', icon: 'SiHtml5' },
      { name: 'REXX', icon: 'FaTerminal' },
      { name: 'JCL', icon: 'FaServer' },
    ],
  },
  {
    title: 'Frameworks & Tools',
    skills: [
      { name: 'React', icon: 'SiReact' },
      { name: 'Flask', icon: 'SiFlask' },
      { name: 'FastAPI', icon: 'SiFastapi' },
      { name: 'Node.js', icon: 'SiNodedotjs' },
      { name: 'Express', icon: 'SiExpress' },
      { name: 'Docker', icon: 'SiDocker' },
      { name: 'Git', icon: 'SiGit' },
      { name: 'GitHub Actions', icon: 'SiGithubactions' },
      { name: 'Linux', icon: 'SiLinux' },
    ],
  },
  {
    title: 'Data & ML',
    skills: [
      { name: 'PyTorch', icon: 'SiPytorch' },
      { name: 'scikit-learn', icon: 'SiScikitlearn' },
      { name: 'pandas', icon: 'SiPandas' },
      { name: 'NumPy', icon: 'SiNumpy' },
      { name: 'ChromaDB', icon: 'FaDatabase' },
      { name: 'OpenAI API', icon: 'SiOpenai' },
      { name: 'Matplotlib', icon: 'FaChartLine' },
      { name: 'Seaborn', icon: 'FaChartBar' },
    ],
  },
  {
    title: 'Databases & Cloud',
    skills: [
      { name: 'PostgreSQL', icon: 'SiPostgresql' },
      { name: 'Redis', icon: 'SiRedis' },
      { name: 'Oracle DB', icon: 'SiOracle' },
      { name: 'MySQL', icon: 'SiMysql' },
      { name: 'SQLite', icon: 'SiSqlite' },
      { name: 'Google Cloud', icon: 'SiGooglecloud' },
      { name: 'Render', icon: 'SiRender' },
    ],
  },
  {
    title: 'Other',
    skills: [
      { name: 'REST APIs', icon: 'FaPlug' },
      { name: 'SSE', icon: 'FaBroadcastTower' },
      { name: 'WebSockets', icon: 'FaExchangeAlt' },
      { name: 'OAuth2', icon: 'FaLock' },
      { name: 'JWT', icon: 'FaKey' },
      { name: 'Selenium', icon: 'SiSelenium' },
      { name: 'Agile/Scrum', icon: 'FaTasks' },
      { name: 'Pytest', icon: 'SiPytest' },
      { name: 'JUnit', icon: 'SiJunit5' },
    ],
  },
];
