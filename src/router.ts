export type ViewId = 'about' | 'career' | 'projects';

export interface Router {
  current: ViewId;
  navigate: (view: ViewId) => void;
  init: () => void;
}

const VALID_VIEWS: ViewId[] = ['about', 'career', 'projects'];

function getViewFromHash(): ViewId {
  const hash = window.location.hash.slice(1);
  if (VALID_VIEWS.includes(hash as ViewId) && hash !== 'about') {
    return hash as ViewId;
  }
  return 'about';
}

export function createRouter(onNavigate: (view: ViewId) => void): Router {
  const router: Router = {
    current: getViewFromHash(),

    navigate(view: ViewId) {
      if (view === 'about') {
        // Remove hash for about view, but keep in history
        window.history.pushState(null, '', window.location.pathname);
        window.dispatchEvent(new HashChangeEvent('hashchange'));
      } else {
        window.location.hash = view;
      }
    },

    init() {
      // Handle hash changes
      window.addEventListener('hashchange', () => {
        const newView = getViewFromHash();
        if (newView !== router.current) {
          router.current = newView;
          onNavigate(newView);
        }
      });

      // Handle browser back/forward for home (no hash)
      window.addEventListener('popstate', () => {
        const newView = getViewFromHash();
        if (newView !== router.current) {
          router.current = newView;
          onNavigate(newView);
        }
      });

      // Initial navigation
      onNavigate(router.current);
    },
  };

  return router;
}
