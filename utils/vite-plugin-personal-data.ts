import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Plugin } from 'vite';
import { data, type PersonalData, type Project } from '../src/data';
import { aboutViewHtml } from '../src/views/about';
import { careerViewHtml } from '../src/views/career';
import { projectsViewHtml } from '../src/views/projects';

const PROJECT_SCHEMA_TYPES = {
  game: 'VideoGame',
  app: 'SoftwareApplication',
  library: 'SoftwareSourceCode',
} satisfies Record<Project['kind'], string>;

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * One `@graph` sharing a stable `@id` for the person, so anything off-site — a
 * project page, a repository README — can reference the same entity instead of
 * describing a lookalike.
 */
function generateJsonLd(d: PersonalData): string {
  const origin = `https://${d.domain}`;
  const personId = `${origin}/#me`;
  const author = { '@id': personId };
  const [city, country] = d.location.split(',').map(part => part.trim());

  const organization = { '@type': 'Organization', name: d.company, url: d.companyUrl };
  const startYear = d.career.find(entry => entry.current)?.period.match(/\d{4}/)?.[0];

  const person = {
    '@type': 'Person',
    '@id': personId,
    name: `${d.name} ${d.surname}`,
    alternateName: d.nickname,
    description: d.description,
    url: `${origin}/`,
    image: {
      '@type': 'ImageObject',
      url: `${origin}/avatar.png`,
      width: 512,
      height: 512,
    },
    jobTitle: d.position,
    // A Role wrapper only earns its place when it carries dates the plain
    // Organization cannot.
    worksFor: startYear
      ? { '@type': 'OrganizationRole', roleName: d.position, startDate: startYear, worksFor: organization }
      : organization,
    homeLocation: {
      '@type': 'Place',
      address: { '@type': 'PostalAddress', addressLocality: city, addressCountry: country },
    },
    knowsAbout: d.techStack.flatMap(category => category.items),
    sameAs: d.links.map(link => link.url),
  };

  const websiteId = `${origin}/#website`;

  const profilePage = {
    '@type': 'ProfilePage',
    '@id': `${origin}/#page`,
    url: `${origin}/`,
    mainEntity: author,
    isPartOf: { '@id': websiteId },
  };

  const website = {
    '@type': 'WebSite',
    '@id': websiteId,
    url: `${origin}/`,
    name: d.domain,
    inLanguage: 'en',
    about: author,
    author,
  };

  const projects = d.projects.map(project => ({
    '@type': PROJECT_SCHEMA_TYPES[project.kind],
    '@id': `${origin}/#${slugify(project.name)}`,
    name: project.name,
    description: project.description,
    url: project.url,
    codeRepository: project.kind === 'library' && project.url?.includes('github.com') ? project.url : undefined,
    keywords: project.tech,
    author,
  }));

  const graph = {
    '@context': 'https://schema.org',
    '@graph': [person, profilePage, website, ...projects],
  };

  return JSON.stringify(graph, null, 2);
}

function generateWebManifest(d: PersonalData): string {
  const manifest = {
    name: `${d.name} ${d.surname}`,
    short_name: d.nickname,
    description: d.description,
    start_url: '/',
    display: 'standalone',
    orientation: 'any',
    lang: 'en',
    background_color: '#030303',
    theme_color: '#030303',
    icons: [
      { src: '/favicon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/favicon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/favicon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
  return JSON.stringify(manifest, null, 2);
}

/**
 * The site loads nothing cross-origin, so everything can be locked to 'self'.
 * `style-src` keeps 'unsafe-inline' for the FOUC block in index.html; there is
 * no untrusted input anywhere on the page, so hashing it would buy nothing.
 *
 * A meta policy cannot express frame-ancestors, HSTS, nosniff or reporting —
 * those need real headers, which GitHub Pages does not allow.
 */
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self'",
  "font-src 'self'",
  "connect-src 'none'",
  "object-src 'none'",
  "base-uri 'none'",
  "form-action 'none'",
].join('; ');

const CSP_META = `<meta http-equiv="Content-Security-Policy" content="${CONTENT_SECURITY_POLICY}" />`;

export function personalDataPlugin(): Plugin {
  const fullName = `${data.name} ${data.surname}`;

  const replacements: Record<string, string> = {
    '{{name}}': data.name,
    '{{surname}}': data.surname,
    '{{fullName}}': fullName,
    '{{nickname}}': data.nickname,
    '{{email}}': data.email,
    '{{position}}': data.position,
    '{{company}}': data.company,
    '{{companyUrl}}': data.companyUrl,
    '{{hobby}}': data.hobby,
    '{{description}}': data.description,
    '{{domain}}': data.domain,
    '{{domainUrl}}': `https://${data.domain}`,
    '{{twitterHandle}}': data.twitterHandle,
    '{{jsonLd}}': generateJsonLd(data),
    // Prerendered so every view has real content without JavaScript, which is all most crawlers ever read.
    '{{aboutView}}': aboutViewHtml(data),
    '{{careerView}}': careerViewHtml(data),
    '{{projectsView}}': projectsViewHtml(data),
  };

  // Add social link URLs
  for (const link of data.links) {
    replacements[`{{${link.name.toLowerCase()}Url}}`] = link.url;
  }

  const webManifestContent = generateWebManifest(data);

  return {
    name: 'personal-data',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.originalUrl === '/site.webmanifest') {
          res.setHeader('Content-Type', 'application/manifest+json');
          res.end(webManifestContent);
          return;
        }
        next();
      });
    },
    transformIndexHtml(html, ctx) {
      // ? Build only: the dev server needs its HMR websocket and inline client,
      // ? which connect-src 'none' and script-src 'self' would block.
      const withCsp = html.replace('{{csp}}', ctx.server ? '' : CSP_META);

      return Object.entries(replacements).reduce((result, [key, value]) => result.replaceAll(key, value), withCsp);
    },
    writeBundle(options) {
      const outDir = options.dir ?? 'dist';
      const manifestPath = resolve(outDir, 'site.webmanifest');
      writeFileSync(manifestPath, webManifestContent);
    },
  };
}
