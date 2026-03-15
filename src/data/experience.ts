export interface Experience {
  title: string;
  company: string;
  location: string;
  period: string;
  description: string[];
  tech: string[];
}

export const experiences: Experience[] = [
  {
    title: 'Co-Founder & Lead Developer',
    company: 'OHQ',
    location: 'Madison, WI',
    period: 'Jan 2025 – Present',
    description: [
      'Built a full-stack office hours platform serving 500+ students with real-time SSE queue updates and role-based portals',
      'Developed ML microservice cutting answer lookup time to ~2s with semantic search across 4 knowledge sources',
      'Containerized 6 services with Docker Compose and Traefik reverse proxy with automated CI/CD',
    ],
    tech: ['React', 'TypeScript', 'Flask', 'PostgreSQL', 'Redis', 'FastAPI', 'Docker', 'ChromaDB'],
  },
  {
    title: 'Research Assistant',
    company: 'Morgridge Institute for Research',
    location: 'Madison, WI',
    period: 'Sep 2024 – Present',
    description: [
      'Architected multi-threaded Python control system for E-Beam 3D metal printer integrating 6+ hardware subsystems',
      'Built Node.js remote monitoring dashboard with log2-based downsampling deployed on Google Cloud',
      'Implemented G9SP safety controller driver parsing 199-byte binary packets for 13 interlock points',
    ],
    tech: ['Python', 'Node.js', 'Express', 'Google Cloud', 'Serial', 'Modbus RTU', 'Matplotlib'],
  },
  {
    title: 'Mainframe Intern',
    company: 'Wisconsin Dept. of Administration',
    location: 'Madison, WI',
    period: 'Jun – Aug 2025',
    description: [
      'Reduced manual triage time by 90% building Java 8 usage tracker on z/OS',
      'Automated weekly report delivery to 5+ teams with YAML-driven Python orchestrator',
      'Evaluated IaC tools for mainframe modernization; recommendations adopted for 15+ batch job workflows',
    ],
    tech: ['Java', 'Python', 'z/OS', 'REXX', 'JCL', 'YAML'],
  },
  {
    title: 'ERP Integration Intern',
    company: 'United States Pharmacopeia',
    location: 'Rockville, MD',
    period: 'Jun – Aug 2024',
    description: [
      'Reduced data retrieval time by 70% building Oracle ERP analytics tool',
      'Built ETL pipeline generating 5 visualization types with automated report distribution',
    ],
    tech: ['Oracle DB', 'Python', 'SQL', 'REST APIs'],
  },
  {
    title: 'Software Dev Intern',
    company: 'Vijay Rekha Life Sciences',
    location: 'Hyderabad, India',
    period: 'Dec 2023 – Jun 2024',
    description: [
      'Reduced manual processing time by 90% engineering mass spectrometry data pipeline',
      'Built full-stack neonatal screening lab system processing 40+ biomedical compounds',
    ],
    tech: ['Python', 'Flask', 'PostgreSQL', 'pandas', 'NumPy'],
  },
];
