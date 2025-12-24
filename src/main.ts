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
      renderCareerView(container, data.career, data.techStack);
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

  // Update tab active states
  document.querySelectorAll('.tabs__item').forEach(tab => {
    const tabView = (tab as HTMLElement).dataset.tab;
    tab.classList.toggle('tabs__item--active', tabView === viewId);
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

  router.init();
}

// ============================================
// Initialize
// ============================================

const canvas = document.getElementById('background') as HTMLCanvasElement | null;
const backgroundController = canvas ? initBackground(canvas) : null;

initTheme(backgroundController);
initRouter(backgroundController);

// Update tab indicator on resize
window.addEventListener('resize', updateTabIndicator);
