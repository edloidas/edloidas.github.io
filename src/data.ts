export interface SocialLink {
  name: string;
  url: string;
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
  links: SocialLink[];
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
  links: [
    { name: 'GitHub', url: 'https://github.com/edloidas' },
    { name: 'Instagram', url: 'https://www.instagram.com/edloidas' },
    { name: 'X', url: 'https://x.com/edloidas' },
  ],
};
