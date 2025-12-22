import './styles/main.css';
import { type BackgroundController, initBackground } from './canvas/background';

type ThemeMode = 'auto' | 'light' | 'dark';

const THEME_KEY = 'theme-preference';
const LIGHT_COLOR = '#ffffff';
const DARK_COLOR = '#030303';

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

// Initialize
const canvas = document.getElementById('background') as HTMLCanvasElement | null;
const backgroundController = canvas ? initBackground(canvas) : null;

initTheme(backgroundController);
