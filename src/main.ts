import './styles/main.css';
import { type BackgroundController, initBackground } from './canvas/background';
import { data } from './data';
import { createRouter, type ViewId } from './router';
import { renderAboutView } from './views/about';
import { renderCareerView } from './views/career';
import { renderProjectsView } from './views/projects';

type ThemeMode = 'auto' | 'light' | 'dark';

const THEME_KEY = 'theme-preference';
const LIGHT_COLOR = '#ffffff';
const DARK_COLOR = '#030303';

// ============================================
// Theme Management
// ============================================

function getStoredTheme(): ThemeMode {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === 'light' || stored === 'dark' || stored === 'auto') {
    return stored;
  }
  return 'auto';
}

function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getEffectiveTheme(mode: ThemeMode): 'light' | 'dark' {
  return mode === 'auto' ? getSystemTheme() : mode;
}

function updateMetaThemeColor(theme: 'light' | 'dark') {
  const color = theme === 'dark' ? DARK_COLOR : LIGHT_COLOR;
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', color);
  }
}

function applyTheme(mode: ThemeMode, backgroundController: BackgroundController | null) {
  const html = document.documentElement;
  const effectiveTheme = getEffectiveTheme(mode);

  // Update data attribute for icon visibility
  html.dataset.theme = mode;

  // Remove existing theme classes
  html.classList.remove('light', 'dark');

  // Apply manual theme class if not auto
  if (mode !== 'auto') {
    html.classList.add(mode);
  }

  // Update meta theme-color
  updateMetaThemeColor(effectiveTheme);

  // Update WebGL background
  if (backgroundController) {
    backgroundController.setTheme(effectiveTheme === 'dark');
  }
}

function cycleTheme(current: ThemeMode): ThemeMode {
  const order: ThemeMode[] = ['auto', 'light', 'dark'];
  const index = order.indexOf(current);
  return order[(index + 1) % order.length];
}

function initTheme(backgroundController: BackgroundController | null) {
  const mode = getStoredTheme();
  applyTheme(mode, backgroundController);

  // Listen for system theme changes when in auto mode
  const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
  darkModeQuery.addEventListener('change', () => {
    const currentMode = getStoredTheme();
    if (currentMode === 'auto') {
      applyTheme('auto', backgroundController);
    }
  });

  // Set up toggle button
  const toggleButton = document.getElementById('theme-toggle');
  if (toggleButton) {
    toggleButton.addEventListener('click', () => {
      const currentMode = getStoredTheme();
      const newMode = cycleTheme(currentMode);
      localStorage.setItem(THEME_KEY, newMode);
      applyTheme(newMode, backgroundController);
    });
  }
}

// ============================================
// Tab Hints
// ============================================

function initTabHints() {
  const tabs = document.querySelector('.tabs');
  if (!tabs) return;

  let timer: ReturnType<typeof setTimeout> | null = null;

  const show = () => tabs.classList.add('tabs--hints-visible');
  const hide = () => {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
    tabs.classList.remove('tabs--hints-visible');
  };

  document.addEventListener('keydown', e => {
    if (e.key === 'Control' && !e.repeat && timer === null) {
      timer = setTimeout(show, 150);
    }
  });

  document.addEventListener('keyup', e => {
    if (e.key === 'Control') hide();
  });

  window.addEventListener('blur', hide);
}

// ============================================
// Tab Indicator
// ============================================

function updateTabIndicator() {
  const tabs = document.querySelector('.tabs') as HTMLElement | null;
  const indicator = document.querySelector('.tabs__indicator') as HTMLElement | null;
  const activeTab = document.querySelector('.tabs__item--active') as HTMLElement | null;

  if (!tabs || !indicator || !activeTab) return;

  const tabsRect = tabs.getBoundingClientRect();
  const activeRect = activeTab.getBoundingClientRect();

  const left = activeRect.left - tabsRect.left;
  const width = activeRect.width;

  tabs.style.setProperty('--indicator-left', `${left}px`);
  tabs.style.setProperty('--indicator-width', `${width}px`);
}

// ============================================
// View Management
// ============================================

const viewsRendered = {
  about: false,
  career: false,
  projects: false,
};

function renderViewContent(viewId: ViewId) {
  if (viewId === 'about' && !viewsRendered.about) {
    const container = document.getElementById('about-content');
    if (container) {
      renderAboutView(container, data);
      viewsRendered.about = true;
    }
  }

  if (viewId === 'career' && !viewsRendered.career) {
    const container = document.getElementById('career-content');
    if (container) {
      renderCareerView(container, data.intro, data.career, data.techStack);
      viewsRendered.career = true;
    }
  }

  if (viewId === 'projects' && !viewsRendered.projects) {
    const container = document.getElementById('projects-content');
    if (container) {
      renderProjectsView(container, data.projects);
      viewsRendered.projects = true;
    }
  }
}

function updateActiveView(viewId: ViewId) {
  const page = document.querySelector('.page');
  if (page) {
    page.setAttribute('data-view', viewId);
  }

  // Update content visibility
  document.querySelectorAll('[data-view-content]').forEach(el => {
    const element = el as HTMLElement;
    const contentView = element.dataset.viewContent;
    element.hidden = contentView !== viewId;
  });

  // Update tab active states and ARIA attributes
  document.querySelectorAll('.tabs__item').forEach(tab => {
    const tabEl = tab as HTMLElement;
    const isActive = tabEl.dataset.tab === viewId;
    tabEl.classList.toggle('tabs__item--active', isActive);
    tabEl.setAttribute('aria-selected', String(isActive));
    tabEl.setAttribute('tabindex', isActive ? '0' : '-1');
  });

  // Update tab indicator position
  updateTabIndicator();

  // Render view content (lazy loading)
  renderViewContent(viewId);
}

function switchView(viewId: ViewId, backgroundController: BackgroundController | null) {
  const updateDOM = () => {
    updateActiveView(viewId);

    // Update background mode
    if (backgroundController) {
      backgroundController.setMode(viewId === 'about' ? 'vibrant' : 'dim');
    }
  };

  // Use View Transition API if available
  if (document.startViewTransition) {
    document.startViewTransition(updateDOM);
  } else {
    updateDOM();
  }
}

function initRouter(backgroundController: BackgroundController | null) {
  const router = createRouter(viewId => {
    switchView(viewId, backgroundController);
  });

  // Set up tab click handlers
  document.querySelectorAll('.tabs__item').forEach(tab => {
    tab.addEventListener('click', e => {
      e.preventDefault();
      const tabView = (tab as HTMLElement).dataset.tab as ViewId;
      if (tabView && tabView !== router.current) {
        router.navigate(tabView);
      }
    });
  });

  // Arrow key navigation (roving tabindex pattern)
  const tabsEl = document.querySelector('.tabs');
  if (tabsEl) {
    tabsEl.addEventListener('keydown', e => {
      const key = (e as KeyboardEvent).key;
      if (key !== 'ArrowLeft' && key !== 'ArrowRight' && key !== 'Home' && key !== 'End') return;

      const tabs = Array.from(document.querySelectorAll<HTMLElement>('.tabs__item'));
      const currentIndex = tabs.findIndex(t => t.dataset.tab === router.current);
      let nextIndex: number;

      if (key === 'ArrowRight') nextIndex = (currentIndex + 1) % tabs.length;
      else if (key === 'ArrowLeft') nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      else if (key === 'Home') nextIndex = 0;
      else nextIndex = tabs.length - 1;

      e.preventDefault();
      const nextTab = tabs[nextIndex];
      router.navigate(nextTab.dataset.tab as ViewId);
      nextTab.focus();
    });
  }

  // Global Ctrl+number tab switching
  document.addEventListener('keydown', e => {
    if (!e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return;
    const index = Number(e.key) - 1;
    const tabs = Array.from(document.querySelectorAll<HTMLElement>('.tabs__item'));
    if (index < 0 || index >= tabs.length) return;
    e.preventDefault();
    const target = tabs[index].dataset.tab as ViewId;
    if (target && target !== router.current) {
      router.navigate(target);
      tabs[index].focus();
    }
  });

  router.init();
}

// ============================================
// Initialize
// ============================================

const canvas = document.getElementById('background') as HTMLCanvasElement | null;
const backgroundController = canvas ? initBackground(canvas) : null;

initTheme(backgroundController);
initRouter(backgroundController);
initTabHints();

// Update tab indicator on resize
window.addEventListener('resize', updateTabIndicator);
