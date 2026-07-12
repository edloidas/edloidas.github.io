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
  intro: string;
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
  intro:
    'Outside work, I build for the love of it — games most of all, plus 3D and the game systems behind them. Parsers are a separate itch.',
  career: [
    {
      company: 'Enonic AS',
      companyUrl: 'https://enonic.com',
      position: 'Frontend Architect',
      period: '2024 — Present',
      location: 'Alicante → Barcelona, Spain',
      description: `My most productive stretch yet — and the first role with both the authority and the capacity to fix things at the root. I own the modernization of a 300k-line codebase: rebuilt the architecture, added unit, integration, and Storybook tests, moved error handling to the Result pattern, migrated the apps to Preact and a new UI, and cut build times 3–5×. I designed and shipped the Enonic UI component library, and built the cross-frame sync and editing overlay behind Content Studio's live page editor — keeping a live page and its editor in sync across the iframe boundary. On the AI side, I shipped features inside Content Studio and now lead adoption across the company. I run a team of five, and mentor throughout.`,
      current: true,
    },
    {
      company: 'Enonic AS',
      companyUrl: 'https://enonic.com',
      position: 'Senior Software Engineer',
      period: 'Q4 2017 — 2024',
      location: 'Remote (Belarus → Georgia → Spain)',
      description: `Seven years — less one long chapter than a run of small, cross-functional squads, spanning all kinds of projects in a mix of languages and technologies. I led some, delivered in others, usually the frontend one at the table. I owned the frontend tooling, tech choices, and build systems, kept trying new things, and tuned UI performance. But the squads pulled me across the stack too — our Cloud platform and its Google Cloud integration, even the Enonic CLI in Go. I moved our WebSocket layer into a Shared Worker for always-on, cross-tab sync. Near the end, I started the AI integration into Enonic products with Vertex AI — the work that became Juke.`,
    },
    {
      company: 'ScienceSoft',
      companyUrl: 'https://www.scnsoft.com',
      position: 'Fullstack Developer',
      period: '2014 — Q3 2017',
      location: 'Minsk, Belarus',
      description: `A few smaller projects first, including a proof-of-concept transport system where I did the Node.js work. Then I moved to Enonic's CMS, Content Studio, where I wrote the frontend, set up all the build systems, and pushed for TypeScript before it was mainstream.`,
    },
    {
      company: 'SaM Solutions',
      companyUrl: 'https://www.sam-solutions.com',
      position: 'Junior Java Developer',
      period: '2012 — 2013',
      location: 'Minsk, Belarus',
      description: `My tutorial level. Built the frontend for a Siemens server-management system, got thrown into security work, learned how enterprise teams actually ship software — most of it on tech that's half-dead now: Tomcat, SVN, jQuery.`,
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
      name: 'Lorequary',
      url: 'https://github.com/lorequary',
      description:
        'Visual dialog editor for game narratives. Node-based workflow, AI-assisted text generation, JSON export for game engines.',
      tech: ['AI', 'React Flow', 'Elysia', 'Bun', 'Effect'],
      status: 'mvp',
    },
    {
      name: 'Enonic UI',
      url: 'https://github.com/enonic/npm-enonic-ui',
      description:
        'UI component library for Enonic projects. Radix-style composability, built mostly from scratch, works with React or Preact.',
      tech: ['React', 'Preact', 'Tailwind CSS'],
    },
    {
      name: 'Roll Parser',
      url: '/roll-parser/',
      description:
        'Library and CLI for parsing dice roll notation. Supports D&D, World of Darkness, and custom formats.',
      tech: ['Bun', 'TypeScript'],
    },
  ],
  techStack: [
    {
      name: 'Languages',
      items: ['TypeScript', 'Go', 'Rust'],
    },
    {
      name: 'Frontend',
      items: ['React', 'Svelte', 'Next.js'],
    },
    {
      name: '3D & Graphics',
      items: ['Three.js', 'React Three Fiber', 'WebGL'],
    },
    {
      name: 'AI',
      items: ['Claude Code', 'Vertex AI', 'AI SDK'],
    },
  ],
};
