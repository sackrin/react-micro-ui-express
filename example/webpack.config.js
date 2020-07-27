const path = require('path');
const fs = require('fs');
const microUiConfig = require('./microui.config');
const webpack = require('webpack');
const ManifestPlugin = require('webpack-manifest-plugin');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const ModuleNotFoundPlugin = require('react-dev-utils/ModuleNotFoundPlugin');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

// Webpack uses `publicPath` to determine where the app is being served from.
// In development, we always serve from the root. This makes config easier.
const appPath = path.resolve(fs.realpathSync(process.cwd()), '.');
const appNodeModules = path.resolve(fs.realpathSync(process.cwd()), 'node_modules');
const publicPath = '/';

if (!fs.existsSync('./.assets')) {
  fs.mkdirSync('./.assets');
}

module.exports = {
  entry: [`${appNodeModules}/@sackrin/react-micro-ui/webpack/webpack.path.js`, './src/assets.js'],
  devtool: 'source-map',
  node: {
    fs: 'empty',
    net: 'empty'
  },
  output: {
    filename: 'micro-ui.[hash].js',
    globalObject: `(typeof self !== 'undefined' ? self : this)`,
    umdNamedDefine: true,
    library: microUiConfig.name,
    libraryTarget: microUiConfig.assets.target,
    publicPath: publicPath,
    path: path.resolve(__dirname, './.assets'),
    pathinfo: true,
  },
  resolve: {
    extensions: ['.js', '.json', '.jsx'],
    symlinks: false
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          parse: {
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false,
            inline: 2,
          },
          mangle: {
            safari10: true,
          },
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true,
          },
        },
        parallel: true,
        cache: true,
        sourceMap: true,
      }),
    ],
  },
  module: {
    strictExportPresence: true,
    rules: [
      { parser: { requireEnsure: false } },
      {
        oneOf: [
          // "url" loader works like "file" loader except that it embeds assets
          // smaller than specified limit in bytes as data URLs to avoid requests.
          // A missing `test` is equivalent to a match.
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: require.resolve('url-loader'),
            options: {
              limit: 10000,
              name: 'media/[name].[hash:8].[ext]',
            },
          },
          {
            test: /\.ts(x?)$/,
            use: 'ts-loader',
            exclude: /node_modules/,
          },
          {
            test: /\.(js|mjs|jsx)$/,
            exclude: /(node_modules|bower_components)/,
            loader: require.resolve('babel-loader'),
            options: {
              cacheDirectory: true,
              cacheCompression: false,
              sourceMaps: true,
            },
          },
          { test: /\.css$/, loader: 'style-loader!css-loader' },
        ],
      },
    ],
  },
  plugins: [
    new WebpackCleanupPlugin(),
    new ModuleNotFoundPlugin(appPath),
    new webpack.HotModuleReplacementPlugin(),
    new CaseSensitivePathsPlugin(),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new CompressionPlugin({}),
    new webpack.DefinePlugin({
      __MICROUI__: {
        library: JSON.stringify(microUiConfig.name)
      },
    }),
    new ManifestPlugin({
      fileName: 'manifest.json',
      publicPath: publicPath,
    }),
  ]
};
