import type { Project } from '../data';

const EXTERNAL_LINK_ICON = `<svg class="project__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
  <polyline points="15 3 21 3 21 9"/>
  <line x1="10" y1="14" x2="21" y2="3"/>
</svg>`;

function renderProject(project: Project): string {
  const nameHtml = project.url
    ? `<a href="${project.url}" class="project__link" target="_blank" rel="noopener noreferrer">
        ${project.name}
        ${EXTERNAL_LINK_ICON}
       </a>`
    : project.name;

  return `
    <article class="project">
      <div class="project__header">
        <h3 class="project__name">${nameHtml}</h3>
      </div>
      <p class="project__description">${project.description}</p>
      <div class="project__tech">
        ${project.tech.map(tech => `<span class="project__tag">${tech}</span>`).join('')}
      </div>
    </article>
  `;
}

export function renderProjectsView(container: HTMLElement, projects: Project[]): void {
  // Sort: featured first, then alphabetically
  const sortedProjects = [...projects].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return a.name.localeCompare(b.name);
  });

  container.innerHTML = `
    <div class="projects">
      ${sortedProjects.map(renderProject).join('')}
    </div>
  `;
}
