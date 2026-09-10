import { escapeHtml } from '../escape';
import type { CareerEntry, PersonalData, TechCategory } from '../data';

function renderCareerEntry(entry: CareerEntry): string {
  const companyHtml = entry.companyUrl
    ? `<a href="${escapeHtml(entry.companyUrl)}" class="timeline__company-link" tabindex="0" rel="noopener noreferrer">${escapeHtml(entry.company)}</a>`
    : `<span>${escapeHtml(entry.company)}</span>`;

  const locationHtml = entry.location ? `<span class="timeline__location">${escapeHtml(entry.location)}</span>` : '';

  const descriptionHtml = entry.description
    ? `<p class="timeline__description">${escapeHtml(entry.description).replace(/\n/g, '<br>')}</p>`
    : '';

  return `
    <article class="timeline__entry${entry.current ? ' timeline__entry--current' : ''}">
      <span class="timeline__period">${escapeHtml(entry.period)}</span>
      <h3 class="timeline__position">${escapeHtml(entry.position)}</h3>
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
      <h3 class="sr-only">Tech Stack</h3>
      ${categories
        .map(
          category => `
        <div class="tech-stack__category">
          <h4 class="tech-stack__title">${escapeHtml(category.name)}</h4>
          <ul class="tech-stack__items">
            ${category.items.map(item => `<li>${escapeHtml(item)}</li>`).join('')}
          </ul>
        </div>
      `,
        )
        .join('')}
    </div>
  `;
}

/** Inlined into index.html at build time, so no DOM APIs here. */
export function careerViewHtml(data: PersonalData): string {
  return `
    <div class="timeline">
      <p class="timeline__intro">${escapeHtml(data.intro)}</p>
      ${data.career.map(renderCareerEntry).join('')}
    </div>
    ${renderTechStack(data.techStack)}
  `;
}
