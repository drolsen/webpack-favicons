<div align="center">
  <img src="/assets/logo.png" width="500" />
  <p style="margin-top: 25px;">Plugin to generate favicons for browsers and devices.</p>

[![Build Status](https://app.travis-ci.com/drolsen/webpack-favicons.svg?branch=master)](https://app.travis-ci.com/drolsen/webpack-favicons)
[![Minimum node.js version](https://badgen.net/badge/node/%3E=18.17.0/green)](https://npmjs.com/package/webpack-favicons)
[![downloads](https://img.shields.io/npm/dm/webpack-favicons.svg?style=flat-square)](http://npm-stat.com/charts.html?package=webpack-favicons&from=2022-01-08)
[![version](https://img.shields.io/npm/v/webpack-favicons.svg?style=flat-square)](http://npm.im/webpack-favicons)
[![GitLab release](https://badgen.net/github/releases/drolsen/webpack-favicons)](https://github.com/drolsen/webpack-favicons/releases)
[![MIT License](https://img.shields.io/npm/l/webpack-favicons.svg?style=flat-square)](http://opensource.org/licenses/MIT)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/drolsen/webpack-favicons/graphs/commit-activity)
</div>

### Does this plugin work with Webpack 4?
No, you should checkout https://github.com/jantimon/favicons-webpack-plugin for a Webpack 4 compatible plugin.


### How does it works
By tapping into the Webpack 5's latest hooks, WebackFavicon digs into a given build to search for any instances of HTML file assets.
While doing that, it leverages the favicon (https://github.com/itgalaxy/favicons) module to generate configured favicons off your provided source file.

Once done, you will have device or browser specific generated favicons written to disk while HTML files (with a `<head>` tag) will have corresponding `<link>` tags injected.

### Does this work with CopyWebpackPlugin?
Yep! While it is more common to see a Webpack configuration using `HtmlWebpackPlugin` in order to process HTML files; WebpackFavicons will inject `<link>` tags into HTML documents found being copied by `CopyWebpackPlugin` and/or `HtmlWebpackPlugin`.

---
## Install
```
npm i --save-dev webpack-favicons
```
or
```
yarn add --dev webpack-favicons
```

## Webpack Config
```js
const WebpackFavicons = require('webpack-favicons');
```
Instantiate a `new WebpackFavicons()` class within Webpack configuration's plugin array:

```js

// Basic configuration

module.exports = {
  output: {
    path: '/dist', 
    publicPath: '/~media/'
  }  
  plugins: [
    new WebpackFavicons({
      src: 'assets/favicon.svg',
      path: 'img',
      background: '#000',
      theme_color: '#000',
      icons: {
        favicons: true
      }
    })
  ]
};
```

Will result in file(s) being written to:
- /dist/img/favicon.ico
- /dist/img/favicon16x16.png 
- /dist/img/favicon32x32.png
- /dist/img/favicon48x48.png

While any HTML with a `<head>` tag will have paths to favicons added:
```html
<link rel="shortcut icon" href="/~media/img/favicon.ico">
<link rel="icon" type="image/png" sizes="16x16" href="/~media/img/favicon-16x16.png">
<link rel="icon" type="image/png" sizes="32x32" href="/~media/img/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="48x48" href="/~media/img/favicon-48x48.png">
```

It is recommended that your source favicon file be a SVG vector file to allow best possible quality to generated pixel based favicons from.

---

## Options

Note: These options both come from, and are directly passed to the favicon generating node module.
For much more information about these options please visit: https://github.com/itgalaxy/favicons

Option | Type | Description
--- | --- | ---
`src` | String | Path to the source favicon file which all favicons will be generated from
`path` | String | Path to where icons get written (is relative to webpack's `output.path`)
`appName` | String | Your application's name.
`appShortName` | String | Your application's short_name. (Optional. If not set, appName will be used)
`appDescription` | String | Your application's description.
`developerName` | String | Your (or your developer's) name.
`developerURL` | String | Your (or your developer's) URL.
`dir` | String | Primary text direction for name, short_name, and description
`lang` | String | Primary language for name and short_name
`background` | String | Background color for flattened icons.
`theme_color` | String | Theme color user for example in Android's task switcher.
`appleStatusBarStyle` | String | Style for Apple status bar: "black-translucent", "default", "black".
`display` | String | Preferred display mode: "fullscreen", "standalone", "minimal-ui" or "browser".
`orientation` | String | Default orientation: "any", "natural", "portrait" or "landscape".
`scope` | String | set of URLs that the browser considers within your app
`start_url` | String | Start URL when launching the application from a device.
`version` | String | Your application's version string.
`logging` | Boolean | Print logs to console?
`pixel_art` | String | Keeps pixels "sharp" when scaling up, for pixel art.  Only supported in offline mode.
`loadManifestWithCredentials` | Boolean | Browsers don't send cookies when fetching a manifest, enable this to fix that.
`icons` | Object | See below for more details about this object's options.

---

## Icon Object's Options

Option | Type | Description
--- | --- | ---
`android` | Boolean | Create Android homescreen icon. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
`appleIcon` | Boolean | Create Apple touch icons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
`appleStartup` | Boolean | Create Apple startup images. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
`coast` | Boolean | Create Opera Coast icon. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
`favicons` | Boolean | Create regular favicons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
`firefox` | Boolean | Create Firefox OS icons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
`windows` | Boolean | Create Windows 8 tile icons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
`yandex` | Boolean | Create Yandex browser icon. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources

---

## Callback

Optional callback allowing the opportunity to alter the generated images, html and manifest file(s) data prior to Webpack writing anything to disk:

```js

// Basic configuration

module.exports = {
  output: {
    path: '/dist', 
    publicPath: '/~media/'
  }  
  plugins: [
    new WebpackFavicons({
      ...
    }, (response) => {
      // alter generated images, html or manifest file data here
      response.images[0].name = 'custom.ico';
      response.html[0] = response.html[0].replace('favicon.ico', 'custom.ico');
    })
  ]
};
```

---

### Manifest File

Depending on the options.icons you set for your configuration, you may see a manifest browserconfig or yandexManifest file(s) along with the built icons. 

By default all three file's favicon paths are relative, and will need no altering for most situations. 
However if you have a need to alter the paths (for whatever reason), you can use the following three path pattern options to do so:

Option | Type | Description
--- | --- | ---
`manifestPathPattern` | String | Defines a custom path for this file's icon path. Default is `[filename]` which makes relative paths.
`browserconfigPathPattern` | String | Defines a custom path for this file's icon path. Default is `[filename]` which makes relative paths.
`yandexManifestIconPattern` | String | Defines a custom path for this file's icon path. Default is `[filename]` which makes relative paths.

```js

// Basic configuration

module.exports = {
  output: {
    path: '/dist', 
    publicPath: '/~media/'
  }  
  plugins: [
    new WebpackFavicons({
      src: 'assets/favicon.svg',
      path: 'img',
      ...
      icons: {
        ...
      },
      manifesstPathPattern: '/custom/path/[filename]',
      browserconfigPathPattern: '/custom/path/[filename]',
      yandexManifestIconPattern: '/custom/path/[filename]'
    })
  ]
};
```

#### manifest.webmanifest
```json
{
  "src": "/custom/path/android-chrome-36x36.png",
  "sizes": "36x36",
  "type": "image/png",
  "purpose": "any"
}
```

#### yandex-browser-manifest.json
```json
"layout": {
  "logo": "/custom/path/yandex-browser-50x50.png",
  "color": "#fff",
  "show_title": true
}
```

#### browserconfig.xml
```xml
<tile>
  <square70x70logo src="/custsom/path/mstile-70x70.png"/>
  <square150x150logo src="/custsom/path/mstile-150x150.png"/>
  <wide310x150logo src="/custsom/path/mstile-310x150.png"/>
  <square310x310logo src="/custsom/path/mstile-310x310.png"/>
  <TileColor>#fff</TileColor>
</tile>
```

(Please note these options are custom to this plugin are not part of the itgalaxy/favicons module.)

### Tests

Webpack Favicons comes with a few `test`s.
These helps ensure that both favicons get written to disk and that link tags are injected into any HTML assets within the larger Webpack build process.

Simply run `npm run test` or `yarn test` from the root of the plugin to run test.

Running a test will produce a `/dist/` directory.

If you would like to change a test, update the root package.json file's `test` script to use any of the `/test/test.config.js` files.