import { defineConfig, lazyPlugins } from 'vite-plus';
import glsl from 'vite-plugin-glsl';
import { personalDataPlugin } from './utils/vite-plugin-personal-data';

export default defineConfig({
  fmt: {
    printWidth: 120,
    tabWidth: 2,
    semi: true,
    singleQuote: true,
    trailingComma: 'all',
    arrowParens: 'avoid',
    // Match the previous Biome scope: TS/JSON/CSS only. Leave HTML, markdown,
    // and agent-config docs untouched.
    ignorePatterns: ['dist/**', '.claude/**', '.cursor/**', '**/*.html', '**/*.md', 'pnpm-lock.yaml'],
  },
  lint: {
    jsPlugins: [{ name: 'vite-plus', specifier: 'vite-plus/oxlint-plugin' }],
    rules: {
      'vite-plus/prefer-vite-plus-imports': 'error',
      'typescript/no-explicit-any': 'error',
      'typescript/consistent-type-imports': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'no-unused-vars': 'warn',
    },
    options: { typeAware: true, typeCheck: true },
  },
  plugins: lazyPlugins(() => [glsl(), personalDataPlugin()]),
  build: {
    target: 'es2022',
    outDir: 'dist',
  },
  css: {
    postcss: {
      plugins: [(await import('autoprefixer')).default],
    },
  },
});
