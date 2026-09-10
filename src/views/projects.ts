import { escapeHtml } from '../escape';
import type { PersonalData, Project } from '../data';

const EXTERNAL_LINK_ICON = `<svg class="project__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
  <polyline points="15 3 21 3 21 9"/>
  <line x1="10" y1="14" x2="21" y2="3"/>
</svg>`;

function renderBadge(status: Project['status']): string {
  if (!status) return '';
  const label = status === 'development' ? 'In Development' : 'MVP';
  return `<span class="project__badge">${label}</span>`;
}

function renderProject(project: Project): string {
  // Referrer flows on purpose: unlike the career and social links, these destinations are ours.
  const nameHtml = project.url
    ? `<a href="${escapeHtml(project.url)}" class="project__link" tabindex="0" rel="noopener">
        ${escapeHtml(project.name)}
        ${EXTERNAL_LINK_ICON}
       </a>`
    : escapeHtml(project.name);

  return `
    <article class="project">
      <div class="project__header">
        <h3 class="project__name">${nameHtml}</h3>
        ${renderBadge(project.status)}
      </div>
      <p class="project__description">${escapeHtml(project.description)}</p>
      <div class="project__tech">
        ${project.tech.map(tech => `<span class="project__tag">${escapeHtml(tech)}</span>`).join('')}
      </div>
    </article>
  `;
}

/** Inlined into index.html at build time, so no DOM APIs here. */
export function projectsViewHtml(data: PersonalData): string {
  return `
    <div class="projects">
      ${data.projects.map(renderProject).join('')}
    </div>
  `;
}
