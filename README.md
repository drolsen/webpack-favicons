<div align="center">
  <img src="/assets/logo.png" width="500" />
  <p style="margin-top: 25px;">Plugin to generate favicons for browsers and devices.</p>

[![Build Status](https://travis-ci.com/drolsen/webpack-favicons.svg?branch=master)](https://travis-ci.com/drolsen/webpack-favicons)
[![dependencies Status](https://david-dm.org/drolsen/webpack-favicons/status.svg)](https://david-dm.org/drolsen/webpack-favicons)
[![devDependencies Status](https://david-dm.org/drolsen/webpack-favicons/dev-status.svg)](https://david-dm.org/drolsen/webpack-favicons?type=dev)
</div>

### Does this plugin work with Webpack 4?
No, you should checkout https://github.com/jantimon/favicons-webpack-plugin for a Webpack4 compatible plugin.


### How does it works
By tapping into the Webpack5's latest hook updates, WebackFavicon digs into the build to search for any instances of HTML file assets.
While doing that, it leverages the favicon (https://github.com/itgalaxy/favicons) module to generate configured favicons off your provided source file.

Once everything is done, you have device and browser specific generated favicons from a single source and any / all HTML files now have corresponding link tags now injected.

---
## Install
```
npm i --save webpack-favicons
```
```
yarn add --dev webpack-favicons
```

## Webpack Config
```js
const WebpackFavicons = require('webpack-favicons');
```
Instantiate a `new WebpackFavicons()` class within Webpack configuration's plugin array:
```js
module.exports = {
  "plugins": [
    new WebpackFavicons({
      src: 'path/to/favicon.svg'
    })
  ]
};
```
Recommended that your source favicon file be a SVG vector file. This allow for best possible quality of generated pixel based favicons.



## Options

Note: These options both come from, and are directly passed to the favicon generating node module.
For much more information about these options please visit: https://github.com/itgalaxy/favicons

Option | Type | Description
--- | --- | ---
`src` | String | Path to the source favicon file which all favicons will be generated from
`path` | String | Path for overriding default icons path.
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



### Tests

Webpack Favicons comes with one `test`.
These helps ensure that both favicons get written to disk and that link tags are injected into any HTML assets within the larger Webpack build process.

Simply run `npm run test` or `yarn test` from the root of the plugin to run test.

Running a test will produce a `/dist/` directory.

If you would like to change a test, update the root package.json file's `test` script to use any of the `/test/test.config.js` files.