import type { PersonalData, SocialLink } from '../data';

const ARROW_ICON = `<svg class="about__cta-icon" viewBox="0 0 24 24" aria-hidden="true">
  <line x1="5" y1="12" x2="19" y2="12" stroke-linecap="round" stroke-linejoin="round"></line>
  <polyline points="12 5 19 12 12 19" stroke-linecap="round" stroke-linejoin="round"></polyline>
</svg>`;

function renderSocialLink(link: SocialLink): string {
  const ariaLabel = link.name === 'X' ? 'X (formerly Twitter)' : link.name;
  return `<a href="${link.url}" class="about__social-link" rel="noopener noreferrer" aria-label="${ariaLabel}">${link.name}</a>`;
}

export function renderAboutView(container: HTMLElement, data: PersonalData): void {
  container.innerHTML = `
    <div class="about">
      <div class="about__bio">
        <p class="about__title">
          ${data.position} at <a href="${data.companyUrl}" class="about__accent" target="_blank" rel="noopener noreferrer">${data.company}</a>.
        </p>
        <p class="about__description">${data.hobby}.</p>
      </div>

      <a href="mailto:${data.email}" class="about__cta" aria-label="Send email to ${data.email}">
        <span>${data.email}</span>
        ${ARROW_ICON}
      </a>

      <nav class="about__social" aria-label="Social links">
        ${data.links.map(renderSocialLink).join('')}
      </nav>
    </div>
  `;
}
