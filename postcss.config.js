const { prod: isProd, dev: isDev } = require('./util/env');

const devPlugins = {};
const prodPlugins = {
  'css-mqpacker': {},
  'postcss-discard-comments': {},
  cssnano: { discardUnused: true },
};

const plugins = isProd ? prodPlugins : devPlugins;

module.exports = {
  parser: false,
  // Map is additionally set in webpack config
  map: { inline: isDev },
  plugins: {
    'postcss-import': {},
    'postcss-mixins': {},
    'postcss-simple-vars': {},
    'postcss-nested': {},
    'postcss-color-alpha': {},
    'postcss-calc': {},
    autoprefixer: {},
    ...plugins,
  },
};
