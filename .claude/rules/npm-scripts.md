# pnpm Scripts

Use `pnpm`, never `npm` or `yarn`. Use `pnpm dlx` instead of `npx`.

## Development

```bash
pnpm dev      # Vite dev server on port 5173
pnpm preview  # Preview production build
```

## Build

```bash
pnpm build    # Build for production (outputs to dist/)
```

## Code Quality

```bash
pnpm check     # All checks: typecheck + lint (read-only)
pnpm fix       # Auto-fix lint/format issues
```

Individual commands:

```bash
pnpm typecheck # TypeScript type checking
pnpm lint      # Biome check (read-only)
pnpm lint:fix  # Biome check with auto-fix
```

## Tooling

Single tool: **Biome** handles TS lint, format, import sorting, JSON, and CSS.

## Deployment

GitHub Actions automatically deploys to GitHub Pages on push to `master`.
