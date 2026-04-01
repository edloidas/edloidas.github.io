export interface SocialLink {
  name: string;
  url: string;
}

export interface CareerEntry {
  company: string;
  companyUrl?: string;
  position: string;
  period: string;
  location?: string;
  description?: string;
  current?: boolean;
}

export interface Project {
  name: string;
  url?: string;
  description: string;
  tech: string[];
  status?: 'development' | 'mvp';
}

export interface TechCategory {
  name: string;
  items: string[];
}

export interface PersonalData {
  name: string;
  surname: string;
  nickname: string;
  email: string;
  position: string;
  company: string;
  companyUrl: string;
  hobby: string;
  domain: string;
  twitterHandle: string;
  location: string;
  links: SocialLink[];
  career: CareerEntry[];
  projects: Project[];
  techStack: TechCategory[];
}

export const data: PersonalData = {
  name: 'Mikita',
  surname: 'Taukachou',
  nickname: 'edloidas',
  email: 'edloidas@gmail.com',
  position: 'Frontend Architect',
  company: 'Enonic',
  companyUrl: 'https://enonic.com',
  hobby: 'AI & 3D graphics enthusiast',
  domain: 'edloidas.io',
  twitterHandle: '@edloidas',
  location: 'Barcelona, Spain',
  links: [
    { name: 'GitHub', url: 'https://github.com/edloidas' },
    { name: 'Instagram', url: 'https://www.instagram.com/edloidas' },
    { name: 'X', url: 'https://x.com/edloidas' },
  ],
  career: [
    {
      company: 'Enonic AS',
      companyUrl: 'https://enonic.com',
      position: 'Frontend Architect',
      period: '2024 — Present',
      location: 'Alicante → Barcelona, Spain',
      description: `Shipped AI features inside Content Studio (Content Operator, Content Translator) — from architecture to integration layer to UX. Cut build times 3–5×. Leading UI modernization: component library, incremental migration, no Big Rewrite drama. Team of 5. Mentoring juniors. Driving AI adoption across the company.
I build frontend platforms: design systems, tooling, and reliability at scale — with incremental migration instead of rewrites. Recently: making AI actually useful inside content tools.`,
      current: true,
    },
    {
      company: 'Enonic AS',
      companyUrl: 'https://enonic.com',
      position: 'Senior Software Engineer',
      period: 'Q4 2017 — 2024',
      location: 'Remote (Belarus → Georgia → Spain)',
      description: `Seven years of kill-team delivery (yes, like Warhammer 40K): small, high-trust squads assembled to solve one problem and move on. Led some, executed in others.
Shipped typed API surface for the platform (led team of 4). Designed WebSocket layer that killed a whole class of auth and connectivity bugs. Built Enonic Cloud self-service frontend. Started the AI push that became Juke AI.`,
    },
    {
      company: 'ScienceSoft',
      companyUrl: 'https://www.scnsoft.com',
      position: 'Fullstack Developer',
      period: '2014 — Q3 2017',
      location: 'Minsk, Belarus',
      description: `Joined Enonic XP platform team. Built core parts of Content Studio — the content tree and management workflows that users interact with daily. Became the go-to person for build tooling and TypeScript adoption before it was mainstream.`,
    },
    {
      company: 'SaM Solutions',
      companyUrl: 'https://www.sam-solutions.com',
      position: 'Junior Java Developer',
      period: '2012 — 2013',
      location: 'Minsk, Belarus',
      description: `My tutorial level. Built frontend for Siemens server management system, got thrown into security implementation, learned how enterprise teams actually ship software.`,
    },
  ],
  projects: [
    {
      name: 'Order of Lust',
      url: 'https://orderoflust.com',
      description:
        'Narrative RPG set in a cyberpunk world with neo-classical aesthetic. Built with React Three Fiber for 3D rendering and React for UI.',
      tech: ['React', 'Three.js', 'React Three Fiber'],
      status: 'development',
    },
    {
      name: 'Scriptorium',
      description:
        'Visual dialog editor for game narratives. Node-based workflow, AI-assisted text generation, JSON export for game engines.',
      tech: ['Next.js', 'React Three Fiber', 'Bun', 'Effect'],
      status: 'mvp',
    },
    {
      name: 'Enonic UI',
      url: 'https://github.com/enonic/enonic-ui',
      description:
        'Composable React/Preact component library built from scratch. Zero dependencies, full control over styling and behavior.',
      tech: ['React', 'Preact', 'Tailwind CSS'],
      status: 'development',
    },
    {
      name: 'Roll Parser',
      url: 'https://github.com/edloidas/roll-parser',
      description:
        'Library and CLI for parsing dice roll notation. Supports D&D, World of Darkness, and custom formats.',
      tech: ['Bun', 'TypeScript'],
    },
  ],
  techStack: [
    {
      name: 'Languages',
      items: ['TypeScript', 'Go', 'Java'],
    },
    {
      name: 'Frameworks',
      items: ['React', 'Next.js', 'Three.js'],
    },
    {
      name: 'Tools',
      items: ['Git', 'Docker', 'Figma'],
    },
    {
      name: 'AI',
      items: ['Claude Code', 'AI SDK', 'Vertex AI'],
    },
  ],
};
