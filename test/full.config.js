const WebpackFavicons = require('../index.js');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, 'test.js'),
  output: {
    path: path.resolve(__dirname, '../dist/full/'), 
    publicPath: '/~media/',
    filename: 'test.js',
    pathinfo: false
  },
  module: {
    rules: [{
      'test': /\.html$/,
      'exclude': /node_modules/,
      'include': [
        path.resolve(__dirname, 'test.html')
      ],
      'use': {
        'loader': 'html-loader', // (see: https://www.npmjs.com/package/html-loader)
        'options': { 'minimize': false }
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
    cacheDirectory: path.resolve(__dirname, '../node_modules/.cache/WebpackFavicons/full'),
    buildDependencies: {
      config: [__filename] // Invalidate cache if config changes
    },
  },   
  plugins: [
    new HtmlWebpackPlugin({
      'title': 'Full Test',
      'template': './test/test.html',
      'filename': './test.html',
      'minify': false
    }),
    new WebpackFavicons({
      'appName': 'Webpack Favicons',
      'appDescription': 'Favicon Generator for Webpack 5',
      'src': 'assets/favicon.svg',
      'path': 'assets',
      'background': '#fff',
      'theme_color': '#fff',
      'icons': {
        'android': true,
        'appleIcon': true,
        'appleStartup': true,
        'favicons': true,
        'yandex': true,
        'windows': true
      }
    })  
  ]
};

