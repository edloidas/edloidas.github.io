# pnpm Scripts

Use `pnpm`, never `npm` or `yarn`. Use `pnpm dlx` instead of `npx`.

## Development

```bash
pnpm dev      # Vite+ dev server on port 5173
pnpm preview  # Preview production build
```

## Build

```bash
pnpm build    # Build for production (outputs to dist/)
```

## Code Quality

```bash
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

## Tooling

Single toolchain: **Vite+** (`vp`) unifies Vite 8 (Rolldown) for dev/build, **Oxlint** for
linting, and **Oxfmt** for formatting and import sorting (TS, JSON, CSS). Lint/format config
lives in `vite.config.ts` under the `lint` and `fmt` keys.

## Deployment

GitHub Actions automatically deploys to GitHub Pages on push to `master`.
