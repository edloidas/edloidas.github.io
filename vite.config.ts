import { defineConfig } from 'vite';
import glsl from 'vite-plugin-glsl';
import { personalDataPlugin } from './utils/vite-plugin-personal-data';

export default defineConfig({
  plugins: [glsl(), personalDataPlugin()],
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
