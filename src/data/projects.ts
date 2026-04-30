import type { Theme } from '../utils/constants';

export type RoleId = 'swe' | 'aiml' | 'data' | 'infra';
export type NodeType = 'project' | 'internship' | 'research' | 'class';

export interface ProjectLinks {
  github?: string | null;
  demo?: string | null;
}

export interface ProjectNode {
  id: string;
  title: string;
  /** Short identifier rendered inside the orb (2 to 4 chars). */
  initials: string;
  org: string;
  dates: string;
  type: NodeType;
  summary: string;
  tech: string[];
  roles: RoleId[];
  resumeBullets: string[];
  extraBullets: string[];
  links?: ProjectLinks;
  /** Optional theme override for tinting; defaults to current theme accent. */
  themeAccent?: Partial<Record<Theme, string>>;
}

/**
 * Single source of truth for the constellation. Add new entries here; the
 * NodeGraph + ProjectModal pick them up automatically. Order is the default
 * render order (no external sort).
 */
export const PROJECTS: ProjectNode[] = [
  {
    id: 'ohq',
    title: 'Office Hours Queue',
    initials: 'OHQ',
    org: 'Co-founder',
    dates: 'Sep 2025 to present',
    type: 'project',
    summary:
      'Full-stack queue platform serving 500+ students with real-time SSE updates, Redis pub/sub, and role-based portals.',
    tech: [
      'React',
      'TypeScript',
      'Go/Gin',
      'Flask',
      'FastAPI',
      'PostgreSQL',
      'Redis',
      'ChromaDB',
      'Docker',
      'Docker Compose',
      'Traefik',
      'GitHub Actions',
      'scikit-learn',
      'OpenAI API',
    ],
    roles: ['swe', 'aiml'],
    resumeBullets: [
      'Reduced student wait times from 1 to 3 hours down to under 15 minutes by launching a full-stack queue platform serving 500+ students across 2 courses with real-time SSE updates, Redis pub/sub, and role-based portals.',
      'Migrating the backend from Python/Flask to Go/Gin, targeting 10x concurrent connections for real-time SSE streaming and Redis pub/sub via goroutines and channels.',
      'Decreased average answer lookup time to ~2s with an ML-powered knowledge assistant (FastAPI, ChromaDB, scikit-learn) using semantic search across 4 sources and automated FAQ generation.',
      'Enabled one-command deployments for 6 services by containerizing with Docker Compose and Traefik reverse proxy, automating CI/CD via GitHub Actions and Portainer webhooks.',
    ],
    extraBullets: [
      'Architected a Flask 3 backend with SQLAlchemy 2.0, PostgreSQL, and Redis using feature-driven blueprints and 8 concurrent Gunicorn/gevent workers with real-time SSE streaming.',
      'Built a RAG-powered knowledge assistant (FastAPI, ChromaDB, OpenAI API) with semantic search across 4 sources, cutting answer lookup time to ~2s.',
      'Designed a visual form builder with conditional branching logic using @xyflow/react flow visualization and @dnd-kit drag-drop for instructors to create custom ticket intake forms.',
      'Engineered an agentic code-analysis pipeline using MCP-based sandboxed Docker containers that runs AI-powered diff analysis on student submissions with security hardening.',
      'Automated FAQ generation using DBSCAN/KMeans clustering on ticket embeddings with GPT-4o mini generating labeled Q&A pairs per cluster.',
      'Implemented real-time SSE streaming with Redis pub/sub broadcasting queue and ticket events to connected clients with 15-second keepalive heartbeats.',
      'Built 4 role-based portals (Student, TA, Instructor, Admin) with drag-and-drop queue management, desktop notifications, and analytics dashboards for schedule heatmaps.',
      'Deployed behind OAuth2-proxy with Traefik middleware for university SSO integration supporting NetID-based authentication across all portals.',
    ],
    links: { github: null, demo: null },
  },
  {
    id: 'vijay-rekha',
    title: 'Vijay Rekha Life Sciences',
    initials: 'VR',
    org: 'Software Developer Intern',
    dates: 'Aug 2025 to present',
    type: 'internship',
    summary:
      'Neonatal screening lab system processing 300+ samples daily with automated validation and abnormality flagging.',
    tech: [
      'React',
      'TypeScript',
      'FastAPI',
      'PostgreSQL',
      'Python',
      'pandas',
      'xlsxwriter',
      'pdfplumber',
    ],
    roles: ['swe', 'data'],
    resumeBullets: [
      'Built a neonatal screening lab system (React/TypeScript, FastAPI, PostgreSQL) processing 300+ samples daily with automated validation and abnormality flagging for 4 technicians.',
      'Accelerated clinical report validation by 85% with a batch pipeline (pdfplumber, regex) that cross-validates patient data from 100+ PDF reports across multiple formats.',
      'Automated 3+ hours of manual work into a single-click extraction pipeline (Python, pandas, xlsxwriter) transforming mass spectrometry data for 40+ compounds into formatted Excel reports.',
    ],
    extraBullets: ['TODO: source from notes'],
    links: { github: null, demo: null },
  },
  {
    id: 'doa',
    title: 'Wisconsin Department of Administration',
    initials: 'DOA',
    org: 'Mainframe Intern',
    dates: 'Jun 2025 to present',
    type: 'internship',
    summary:
      'WLM HTML report parser transforming z/OS service definitions into multi-sheet color-coded Excel workbooks.',
    tech: [
      'Python',
      'BeautifulSoup',
      'xlsxwriter',
      'z/OS',
      'Bash',
      'Ansible',
      'Terraform',
      'YAML',
      'JSON',
    ],
    roles: ['data', 'infra'],
    resumeBullets: [
      'Reduced manual triage time by 90% with a Python-based usage tracker that parsed job logs into structured CSV, flagged remediation status, and prioritized follow-ups across 5+ teams.',
      'Deployed an IaC automation platform (Ansible, Terraform) adopted department-wide, streamlining 15+ batch job workflows and reducing manual operations across state systems.',
      'Automated extraction of HTML configuration reports into structured Excel workbooks (Python, BeautifulSoup, xlsxwriter), processing 44 service classes across 6 policies with forward-fill data normalization.',
    ],
    extraBullets: [
      'Built a Python CLI tool to parse z/OS WLM HTML reports (12 workloads, 44 service classes, 6 policies) into 4-sheet color-coded Excel workbooks, automating manual mainframe reporting.',
      'Implemented a forward-fill algorithm and union-based row generation to handle sparse, hierarchical HTML tables with multi-row spans across service classes and policies.',
      'Designed a flexible policy parsing system supporting numeric ranges, named ranges, and mixed lists via CLI flags with smart header-anchor matching for robustness.',
      'Built format caching and shade-computation logic to generate professional Excel output with merged headers, color-coded sections, override highlighting, and auto-filters.',
      'Generated 4-sheet workbook covering all attributes grouped, policies grouped, overrides by attributes, and overrides by policies with per-section color palettes.',
      'Eliminated 4+ hours per week of manual reporting via a Python orchestrator with YAML-driven configuration, JSON Schema validation, and Jinja2 templating.',
    ],
    links: { github: null, demo: null },
  },
  {
    id: 'ebeam',
    title: 'E-Beam 3D Printer Control System',
    initials: 'EB',
    org: 'Morgridge Institute for Research',
    dates: 'Jan 2025 to Aug 2025',
    type: 'research',
    summary:
      'Multi-threaded Python control system for an electron beam 3D metal printer with 6+ hardware subsystems and real-time web monitoring.',
    tech: [
      'Python',
      'Tkinter',
      'matplotlib',
      'pyserial',
      'pymodbus',
      'Node.js',
      'Express',
      'Google Drive API',
      'GCP',
      'uPlot',
    ],
    roles: ['swe', 'infra'],
    resumeBullets: [
      'Architected a multi-threaded Python control system coordinating 6+ subsystems with fault-tolerant backoff and graceful degradation, enabling 72+ hour unattended experiments.',
      'Engineered a real-time observability dashboard (Node.js, Express, GCP) enabling researchers to monitor multi-day experiments, with log2-based downsampling to visualize weeks of sensor data.',
      'Implemented a G9SP safety controller driver parsing 199-byte binary packets with bit-field decoding for 13 interlock points, checksum validation, and fail-safe recovery on sensor disconnects.',
    ],
    extraBullets: [
      'Developed hardware drivers for G9SP safety controller (199-byte binary packets, bit-field parsing, checksum validation), BK Precision 9104 power supplies (RS485 UART), and Omega DP16 temperature controllers.',
      'Designed adaptive error recovery with exponential backoff (500ms to 5000ms) and graceful degradation, ensuring control system remains responsive when individual subsystems disconnect.',
      'Implemented cathode heating state machine with 3 power supply modes (immediate, current ramp, voltage ramp) with CV/CC limit detection and operator stop signaling.',
      'Built multi-threaded architecture with queue-based data passing between hardware communication threads and GUI thread, maintaining 500ms update intervals for real-time responsiveness.',
      'Created real-time data visualization with matplotlib embedded in Tkinter: 7-day pressure history plots, temperature trends with color-coded thresholds, and interactive tooltip plots.',
      'Implemented intelligent downsampling algorithm with dynamic stride selection maintaining ~256 display points for optimal visualization across multi-day time series.',
      'Fetches real-time experiment logs from Google Drive every 60 seconds via streaming downloads handling multi-GB files without memory overflow.',
    ],
    links: { github: null, demo: null },
  },
  {
    id: 'usp',
    title: 'United States Pharmacopeia',
    initials: 'USP',
    org: 'ERP Integration Intern',
    dates: 'Jun 2024 to Aug 2024',
    type: 'internship',
    summary:
      'Oracle ERP analytics tool using optimized SQL queries to surface order hold trends across supply chain data.',
    tech: ['Python', 'Oracle DB', 'oracledb', 'pandas', 'Matplotlib', 'Seaborn', 'SQL'],
    roles: ['data'],
    resumeBullets: [
      'Improved data retrieval time by 70% with an Oracle ERP analytics tool (Python, oracledb, pandas) using optimized SQL queries joining 5 tables to surface order hold trends.',
      'Automated quarterly stakeholder reports, previously 1 week of manual work, with an ETL pipeline (pandas, Matplotlib, Seaborn) rendering visualizations into Word, PPTX, and PDF for executive distribution.',
      'Built a web scraping tool (Python, Selenium) that extracted and structured compliance data from internal portals, replacing manual copy-paste workflows across 3 cross-departmental teams.',
    ],
    extraBullets: ['TODO: source from notes'],
    links: { github: null, demo: null },
  },
  {
    id: 'cs571',
    title: 'CS 571: Building User Interfaces',
    initials: '571',
    org: 'Academic Project',
    dates: 'Fall 2025',
    type: 'class',
    summary:
      '12 assignments spanning React Native mobile, React web, and full-stack development with NLU and streaming AI.',
    tech: [
      'React',
      'React Native',
      'Expo',
      'TypeScript',
      'Django',
      'Material-UI',
      'Bootstrap',
      'Wit.AI',
      'OpenAI API',
    ],
    roles: ['swe'],
    resumeBullets: [
      'Built 3 React Native mobile apps (Expo) with Bottom Tab, Stack, and Drawer navigation, animated content transitions, and secure JWT authentication via expo-secure-store.',
    ],
    extraBullets: [
      'Developed 12 web and mobile applications across React, React Native, and Django with real-time streaming, NLU voice interfaces, and responsive Material-UI designs.',
      'Implemented React Native e-commerce apps with dynamic product catalogs, shopping cart state management, and real-time order calculation with custom StyleSheet styling.',
      'Built a news reader with React Navigation, bottom tab navigation, nested stack navigation, and animated content reveal using Reanimated 4 parallel animations.',
      'Created a mobile chat app with JWT authentication, drawer navigation for chatroom selection, expo-secure-store token storage, and guest mode conversion.',
      'Integrated Wit.AI for natural language intent recognition across the chat interface with entity extraction and dynamic chatroom/message fetching.',
      'Built multi-persona AI chat with GPT-4 streaming responses, markdown rendering, localStorage persistence, and conversation reset on persona switch.',
      'Developed the ClubHub student organization portal (React, Material-UI, Django REST) with board member directory, search/filter, event system, and admin panel.',
    ],
    links: { github: null, demo: null },
  },
];

/** All role tab ids in render order. Mirrors the hero ROLES array. */
export const ROLE_IDS: RoleId[] = ['swe', 'aiml', 'data', 'infra'];

/** Returns nodes whose `roles` include the given id. */
export function filterByRole(role: RoleId): ProjectNode[] {
  return PROJECTS.filter((p) => p.roles.includes(role));
}

/**
 * @deprecated Legacy shape used by the original (currently commented-out)
 * `<Projects />` section. Kept so that file typechecks until that section is
 * either revived or deleted. Do not use in new code; use ProjectNode/PROJECTS.
 */
export interface Project {
  title: string;
  description: string;
  tech: string[];
  github?: string;
  live?: string;
  highlights: string[];
}

/**
 * @deprecated See `Project` above. Built from PROJECTS so both stay in sync
 * automatically; the old section will render the same source of truth if revived.
 */
export const projects: Project[] = PROJECTS.map((p) => ({
  title: p.title,
  description: p.summary,
  tech: p.tech,
  github: p.links?.github ?? undefined,
  live: p.links?.demo ?? undefined,
  highlights: p.resumeBullets.slice(0, 3),
}));

/** Cheap runtime smoke check; throws in dev so missing fields fail fast. */
export function validateProjects(): void {
  for (const p of PROJECTS) {
    if (!p.id || !p.title || !p.summary) {
      throw new Error(`ProjectNode invalid: ${JSON.stringify(p, null, 2)}`);
    }
    if (p.roles.length === 0) {
      throw new Error(`ProjectNode "${p.id}" has no roles`);
    }
    if (p.resumeBullets.length === 0 && p.extraBullets.length === 0) {
      throw new Error(`ProjectNode "${p.id}" has no bullets at all`);
    }
  }
}
