export interface Project {
  title: string;
  description: string;
  tech: string[];
  github?: string;
  live?: string;
  highlights: string[];
}

export const projects: Project[] = [
  {
    title: 'OHQ (Office Hours Queue)',
    description:
      'Full-stack real-time office hours platform serving 500+ students at UW-Madison. React/TypeScript frontend, Flask backend, PostgreSQL, Redis for real-time SSE queue updates, FastAPI ML microservice with semantic search.',
    tech: ['React', 'TypeScript', 'Flask', 'PostgreSQL', 'Redis', 'FastAPI', 'Docker', 'ChromaDB'],
    highlights: [
      'Served 500+ students',
      '~2s average answer lookup via ML',
      '6 containerized services',
    ],
  },
  {
    title: 'EBEAM Dashboard',
    description:
      'Multi-threaded Python control system for E-Beam 3D metal printer at Morgridge Institute. Integrates 6+ hardware subsystems over Serial, Modbus RTU, and custom binary protocols.',
    tech: ['Python', 'Tkinter', 'Serial', 'Modbus RTU', 'Matplotlib'],
    highlights: [
      '6+ hardware subsystems',
      'Multi-threaded architecture',
      '2,600+ lines production Python',
    ],
  },
  {
    title: 'EBEAM WebMonitor',
    description:
      'Remote monitoring dashboard for E-Beam printer streaming experiment logs from Google Drive API with log2-based downsampling.',
    tech: ['Node.js', 'Express', 'Google Drive API', 'uPlot'],
    highlights: [
      'Real-time log streaming',
      'Handles multi-GB files',
      'Deployed on Render',
    ],
  },
  {
    title: 'DOA Report Extraction',
    description:
      'CLI tool parsing z/OS WLM HTML reports into color-coded Excel workbooks for Wisconsin Dept. of Administration.',
    tech: ['Python', 'BeautifulSoup', 'xlsxwriter'],
    highlights: [
      '90% manual triage reduction',
      '12 workloads, 44 service classes',
      '1,080 lines production Python',
    ],
  },
  {
    title: 'AI/ML Implementations',
    description:
      '9 algorithms implemented from scratch for CS 540: LeNet-5 CNN, Q-Learning/SARSA, PCA, A* search, Naive Bayes, Linear Regression, HAC clustering, MLP, Bipartite matching.',
    tech: ['Python', 'PyTorch', 'scikit-learn', 'NumPy', 'Matplotlib'],
    highlights: [
      '9 algorithms from scratch',
      'CNN for 100-class scene classification',
      'RL agents trained over 30K episodes',
    ],
  },
];
