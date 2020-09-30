import * as fs from 'fs';
import * as path from 'path';
import pug from 'pug';
import { terser } from 'rollup-plugin-terser';
import pugPlugin from 'rollup-plugin-pug';
import postcssPlugin from 'rollup-plugin-postcss';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

import data from './src/data.json';

const { prod: isProd, dev: isDev, outDir } = require('./util/env');

const plugins = isProd ? [
  terser(),
] : [
  serve({
    contentBase: [outDir, './'],
    historyApiFallback: '/',
    open: true,
    port: 8000,
  }),
  livereload({
    verbose: true,
    watch: [
      path.resolve(__dirname, outDir),
      path.resolve(__dirname, 'src'),
      path.resolve(__dirname, 'index.html'),
    ],
    exts: ['html', 'pug', 'js', 'css', 'json'],
  }),
];

export default {
  input: 'src/js/app.js',
  output: {
    file: 'public/app.js',
    format: 'cjs',
    sourcemap: isDev,
  },
  plugins: [
    pugPlugin(),
    postcssPlugin({
      extract: path.resolve('public/style.css'),
    }),
    {
      name: 'emitPug',
      generateBundle() {
        fs.writeFileSync(path.join(__dirname, 'index.html'), pug.compileFile('src/html/index.pug')({
          production: isProd,
          outDir,
          data,
        }));
      },
    },
    ...plugins,
  ],
};
