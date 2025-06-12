const WebpackFavicons = require('../index.js');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, 'test.js'),
  output: {
    path: path.resolve(__dirname, '../dist/manifest/build'), 
    publicPath: '/build',
    filename: 'test.js',
    pathinfo: false
  },
  module: {
    rules: [{
      test: /\.html$/,
      exclude: /node_modules/,
      include: [
        path.resolve(__dirname, 'test.html')
      ],
      use: {
        loader: 'html-loader', // (see: https://www.npmjs.com/package/html-loader)
        options: { minimize: false }
      }
    }]
  },
  devtool: false,
  optimization: {
    minimize: false
  },
  stats: 'none',
  cache: {
    type: 'filesystem',
    cacheDirectory: path.resolve(__dirname, '../node_modules/.cache/WebpackFavicons/manifestPath'),
    buildDependencies: {
      config: [__filename] // Invalidate cache if config changes
    },
  },    
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Public Path Test',
      template: './test/test.html',
      filename: './test.html',
      minify: false
    }),
    /* Default */
    new WebpackFavicons({
      appName: 'Webpack Favicons',
      appDescription: 'Webpack Favicons for Webpack 5',
      src: 'assets/favicon.svg',
      path: 'faviconsA',
      background: '#fff',
      theme_color: '#fff',
      icons: {
        android: true,
        appleIcon: true,
        appleStartup: true,
        favicons: true,
        yandex: true,
        windows: true
      }
    }),
    /* Manifest only pathing */
    new WebpackFavicons({
      appName: 'Webpack Favicons',
      appDescription: 'Webpack Favicons for Webpack 5',
      src: 'assets/favicon.svg',
      path: 'faviconsB',
      background: '#fff',
      theme_color: '#fff',
      manifestPathPattern: '/some/crazy/path/[filename]',
      icons: {
        android: true,
        appleIcon: true,
        appleStartup: true,
        favicons: true,
        yandex: true,
        windows: true
      }
    }),
    /* Browser config only pathing */
    new WebpackFavicons({
      appName: 'Webpack Favicons',
      appDescription: 'Webpack Favicons for Webpack 5',
      src: 'assets/favicon.svg',
      path: 'faviconsC',
      background: '#fff',
      theme_color: '#fff',
      browserconfigPathPattern: '/some/crazy/path/[filename]',
      icons: {
        android: true,
        appleIcon: true,
        appleStartup: true,
        favicons: true,
        yandex: true,
        windows: true
      }
    }),
    /* Yanderx Manifest only pathing */
    new WebpackFavicons({
      appName: 'Webpack Favicons',
      appDescription: 'Webpack Favicons for Webpack 5',
      src: 'assets/favicon.svg',
      path: 'faviconsD',
      background: '#fff',
      theme_color: '#fff',
      yandexManifestIconPattern: '/some/crazy/path/[filename]',
      icons: {
        android: true,
        appleIcon: true,
        appleStartup: true,
        favicons: true,
        yandex: true,
        windows: true
      }
    }),
    /* All manifest and config pathing */
    new WebpackFavicons({
      appName: 'Webpack Favicons',
      appDescription: 'Webpack Favicons for Webpack 5',
      src: 'assets/favicon.svg',
      path: 'faviconsE',
      background: '#fff',
      theme_color: '#fff',
      manifestPathPattern: '/some/crazy/path/[filename]',
      browserconfigPathPattern: '/some/crazy/path/[filename]',
      yandexManifestIconPattern: '/some/crazy/path/[filename]',
      icons: {
        android: true,
        appleIcon: true,
        appleStartup: true,
        favicons: true,
        yandex: true,
        windows: true
      }
    })  
  ]
};

