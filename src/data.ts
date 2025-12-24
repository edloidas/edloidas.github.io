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
  featured?: boolean;
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
      company: 'Enonic',
      companyUrl: 'https://enonic.com',
      position: 'Frontend Architect',
      period: '2020 — Present',
      location: 'Barcelona, Spain',
      description:
        'Leading frontend architecture for headless CMS platform. Building design systems, developer tools, and modern web experiences.',
      current: true,
    },
    {
      company: 'Previous Company',
      position: 'Senior Frontend Developer',
      period: '2018 — 2020',
      location: 'Minsk, Belarus',
      description: 'Developed scalable web applications using React and TypeScript. Led frontend team of 5 engineers.',
    },
    {
      company: 'Another Company',
      position: 'Frontend Developer',
      period: '2015 — 2018',
      location: 'Minsk, Belarus',
      description: 'Built interactive web experiences and single-page applications. Introduced modern build tooling.',
    },
  ],
  projects: [
    {
      name: 'edloidas.io',
      url: 'https://github.com/edloidas/edloidas.github.io',
      description: 'Personal landing page with WebGL shader background and View Transition API.',
      tech: ['TypeScript', 'WebGL', 'Vite'],
      featured: true,
    },
    {
      name: 'Project Alpha',
      url: 'https://github.com/edloidas',
      description: 'A creative coding experiment exploring generative art and procedural graphics.',
      tech: ['Three.js', 'GLSL', 'React'],
      featured: true,
    },
    {
      name: 'Project Beta',
      url: 'https://github.com/edloidas',
      description: 'Developer toolkit for automating common frontend tasks and workflows.',
      tech: ['Node.js', 'TypeScript', 'CLI'],
      featured: true,
    },
    {
      name: 'Project Gamma',
      description: 'Experimental AI-powered code generation tool for rapid prototyping.',
      tech: ['Python', 'OpenAI', 'FastAPI'],
    },
  ],
  techStack: [
    {
      name: 'Languages',
      items: ['TypeScript', 'JavaScript', 'HTML', 'CSS', 'GLSL', 'Python'],
    },
    {
      name: 'Frameworks',
      items: ['React', 'Next.js', 'Node.js', 'Three.js', 'Vite'],
    },
    {
      name: 'Tools',
      items: ['Git', 'Docker', 'Figma', 'VS Code', 'Linux'],
    },
  ],
};
