const WebpackFavicons = require('../index.js');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, 'test.js'),
  output: {
    path: path.resolve(__dirname, '../dist/hybrid'), 
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
  optimization: {
    minimize: false
  },
  plugins: [
    new CleanWebpackPlugin({
      'cleanOnceBeforeBuildPatterns': [path.resolve('./dist/hybrid/')]
    }),
    new CopyPlugin({
      patterns: [
        { from: 'test/test.html', to: './' }
      ],
    }),   
    new HtmlWebpackPlugin({
      'title': 'Hybrid Test',
      'template': './test/test.html',
      'filename': './testing.html',
      'minify': false
    }),     
    new WebpackFavicons({
      'src': 'assets/favicon.svg',
      'path': 'assets/',
      'scope': 'resources/',
      'background': '#000',
      'theme_color': '#000',
      'icons': {
        'favicons': true
      }
    })  
  ]
};

