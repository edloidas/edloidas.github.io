# edloidas.github.io

Personal landing page with WebGL shader background.

## Commands

```bash
pnpm dev       # Start dev server (port 5173)
pnpm build     # Build for production
pnpm preview   # Preview production build
pnpm check     # All checks (typecheck + lint)
pnpm fix       # Auto-fix lint/format issues
```

Individual commands:

```bash
pnpm typecheck # TypeScript type checking
pnpm lint      # Biome check (read-only)
pnpm lint:fix  # Biome check with auto-fix
```

## Tech Stack

- **Build**: Vite 6 + pnpm
- **Language**: TypeScript (ES2022)
- **Styling**: Plain CSS + PostCSS (autoprefixer, modern-normalize)
- **Graphics**: Raw WebGL2 shaders
- **Linting**: Biome

## Project Structure

```
src/
├── main.ts              # Entry point
├── data.ts              # Personal data (typed)
├── styles/
│   └── main.css         # CSS with custom properties
├── canvas/
│   └── background.ts    # WebGL setup
└── shaders/
    ├── background.vert  # Vertex shader
    └── background.frag  # Fragment shader
```

## Accessibility

- Keep an explicit `tabindex="0"` on every interactive element (links, buttons). Safari's "Press Tab to highlight each item on a webpage" setting is off by default and drops native focusables from the Tab order unless they carry an explicit tabindex. When adding a new link/button to `index.html` or a view template, add `tabindex="0"` too. (The `.tabs__item` links use a roving `0`/`-1` tabindex instead — leave those alone.)

## Deployment

Automatic deployment to GitHub Pages on push to `master` branch.
Custom domain: edloidas.io (configured via CNAME)
