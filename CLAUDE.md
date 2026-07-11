# edloidas.github.io

Personal landing page with WebGL shader background.

## Commands

```bash
pnpm dev       # Start dev server (Vite+, port 5173)
pnpm build     # Build for production
pnpm preview   # Preview production build
pnpm check     # All checks: format + lint + types (`vp check`)
pnpm fix       # Auto-fix: format + lint (`vp fmt` + `vp lint --fix`)
```

Individual commands:

```bash
pnpm typecheck # TypeScript type checking (tsc --noEmit, TS 7)
pnpm lint      # Lint (Oxlint via `vp lint`)
pnpm lint:fix  # Lint with auto-fix
pnpm format    # Format (Oxfmt via `vp fmt`)
```

## Tech Stack

- **Toolchain**: Vite+ (`vp`) — unifies Vite 8 (Rolldown), Oxlint, Oxfmt; config in `vite.config.ts` (`lint`/`fmt` keys)
- **Build**: Vite 8 (via Vite+) + pnpm 11
- **Language**: TypeScript 7 (native compiler, ES2022)
- **Styling**: Plain CSS + PostCSS (autoprefixer, modern-normalize)
- **Graphics**: Raw WebGL2 shaders
- **Lint/Format**: Oxlint + Oxfmt (replaces Biome)

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
