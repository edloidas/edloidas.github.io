/*
Configurable webpack config.
Uses $NODE_ENV, `production` or `development` (also default)
*/
const path = require('path');
const R = require('ramda');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractConfig = require('./util/config/extract');
const htmlConfig = require('./util/config/html');
const isProd = require('./util/env').prod;
const isDev = require('./util/env').dev;


// appendToArrayByPath :: Array -> Object -> Object -> Object
const appendToArrayByPath = R.curry((objPath, data, object) =>
  R.pipe(R.path(objPath), R.append(data), R.set(R.lensPath(objPath), R.__, object))(object)
);
// addRule :: Object -> Object -> Object
const addRule = appendToArrayByPath(['module', 'rules']);
// addPlugin :: Object -> Object -> Object
const addPlugin = appendToArrayByPath(['plugins']);

// mergeOptions :: Object -> String
const stringifyOptions = R.pipe(R.toPairs, R.map(R.join('=')), R.join('&'));
// stringifyUse :: Object -> String
const stringifyUse = use => `${use.loader}${use.options ? '?' : ''}${stringifyOptions(use.options)}`;
// stringifyUse :: Array -> String
const stringifyUses = R.pipe(R.map(stringifyUse), R.join('!'));


// Webpack config template
const webpackConfig = {
  entry: './src/js/index.js',
  output: {
    path: path.resolve(__dirname, 'public'),
    publicPath: '',
    filename: 'app.js',
  },
  module: {
    rules: [],
  },
  plugins: [],
};


// =====================
// Allows to convert pug->html
// Uglifies code in produnction (see `rule.pretty` and `plugin.minify`)
// Injects CSS and JS in production (disabled)
// =====================
function addPugSupport(cfg) {
  const rule = {
    test: /\.pug$/,
    loader: 'pug-loader',
    options: {
      pretty: !isDev,
      self: true,
    },
  };
  const plugin = new HtmlWebpackPlugin(htmlConfig);

  return R.pipe(addRule(rule), addPlugin(plugin))(cfg);
}


// =====================
// Add support for the css bundle
// - CSS file needs to be required from JS entry
// - ExtractTextPlugin extracts css from JS to a separate file
// =====================
function addPostCSSSupport(cfg) {
  let rule = {
    test: /\.css$/,
  };

  const devLoaders = {
    use: [
      { loader: 'style-loader' },
      {
        loader: 'css-loader',
        options: { importLoaders: 1 },
      },
      {
        loader: 'postcss-loader',
        options: { sourceMap: 'inline' },
      },
    ],
  };

  const prodLoaders = {
    loaders: ExtractTextPlugin.extract({
      // use `devLoaders` converted to query string as `fallbackLoader`
      fallbackLoader: stringifyUses(devLoaders.use),
      loader: 'css-loader?importLoaders=1!postcss-loader',
    }),
  };
  const loaders = isProd ? prodLoaders : devLoaders;

  rule = R.merge(rule)(loaders);

  const plugin = new ExtractTextPlugin(R.merge({ filename: 'style.css' }, extractConfig));

  return R.pipe(addRule(rule), addPlugin(plugin))(cfg);
}


// =====================
// Make final config support needed rules
// =====================
function makeConfig(cfg) {
  return R.pipe(
    addPugSupport,
    addPostCSSSupport
  )(cfg);
}

module.exports = makeConfig(webpackConfig);
