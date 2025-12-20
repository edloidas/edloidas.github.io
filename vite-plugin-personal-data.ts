import {writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import type {Plugin} from 'vite';
import {data, type PersonalData} from './src/data';

function generateJsonLd(d: PersonalData): string {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: `${d.name} ${d.surname}`,
    alternateName: d.nickname,
    url: `https://${d.domain}`,
    image: `https://${d.domain}/favicon-512.png`,
    jobTitle: d.position,
    worksFor: {
      '@type': 'Organization',
      name: d.company,
      url: d.companyUrl,
    },
    sameAs: d.links.map((link) => link.url),
  };
  return JSON.stringify(jsonLd, null, 2).replace(/^/gm, '      ').trim();
}

function generateWebManifest(d: PersonalData): string {
  const manifest = {
    name: d.nickname,
    short_name: d.nickname,
    description: `${d.name} ${d.surname}. ${d.position} and ${d.hobby}.`,
    start_url: '/',
    display: 'standalone',
    background_color: '#181c25',
    theme_color: '#181c25',
    icons: [
      {src: '/favicon-192.png', sizes: '192x192', type: 'image/png'},
      {src: '/favicon-512.png', sizes: '512x512', type: 'image/png'},
      {src: '/favicon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable'},
    ],
  };
  return JSON.stringify(manifest, null, 2);
}

export function personalDataPlugin(): Plugin {
  const fullName = `${data.name} ${data.surname}`;
  const description = `${fullName}. ${data.position} and ${data.hobby}.`;

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
    '{{description}}': description,
    '{{domain}}': data.domain,
    '{{domainUrl}}': `https://${data.domain}`,
    '{{twitterHandle}}': data.twitterHandle,
    '{{jsonLd}}': generateJsonLd(data),
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
    transformIndexHtml(html) {
      return Object.entries(replacements).reduce(
        (result, [key, value]) => result.replaceAll(key, value),
        html,
      );
    },
    writeBundle(options) {
      const outDir = options.dir ?? 'dist';
      const manifestPath = resolve(outDir, 'site.webmanifest');
      writeFileSync(manifestPath, webManifestContent);
    },
  };
}
