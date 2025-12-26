import type { CareerEntry, TechCategory } from '../data';

function renderCareerEntry(entry: CareerEntry): string {
  const companyHtml = entry.companyUrl
    ? `<a href="${entry.companyUrl}" class="timeline__company-link" target="_blank" rel="noopener noreferrer">${entry.company}</a>`
    : `<span>${entry.company}</span>`;

  const locationHtml = entry.location ? `<span class="timeline__location">${entry.location}</span>` : '';

  const descriptionHtml = entry.description
    ? `<p class="timeline__description">${entry.description.replace(/\n/g, '<br>')}</p>`
    : '';

  return `
    <article class="timeline__entry${entry.current ? ' timeline__entry--current' : ''}">
      <span class="timeline__period">${entry.period}</span>
      <h3 class="timeline__position">${entry.position}</h3>
      <div class="timeline__company">
        ${companyHtml}
        ${locationHtml}
      </div>
      ${descriptionHtml}
    </article>
  `;
}

function renderTechStack(categories: TechCategory[]): string {
  return `
    <div class="tech-stack">
      ${categories
        .map(
          category => `
        <div class="tech-stack__category">
          <h4 class="tech-stack__title">${category.name}</h4>
          <ul class="tech-stack__items">
            ${category.items.map(item => `<li>${item}</li>`).join('')}
          </ul>
        </div>
      `,
        )
        .join('')}
    </div>
  `;
}

export function renderCareerView(container: HTMLElement, career: CareerEntry[], techStack: TechCategory[]): void {
  container.innerHTML = `
    <div class="timeline">
      ${career.map(renderCareerEntry).join('')}
    </div>
    ${renderTechStack(techStack)}
  `;
}
