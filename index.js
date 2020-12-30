const fs = require('fs');
const path = require('path');
const favicons = require('favicons');

class WebpackFavicon {
  constructor(options) {
    this.options = Object.assign({
      src: false,
      appName: null,                            // Your application's name. `string`
      appShortName: null,                       // Your application's short_name. `string`. Optional. If not set, appName will be used
      appDescription: null,                     // Your application's description. `string`
      developerName: null,                      // Your (or your developer's) name. `string`
      developerURL: null,                       // Your (or your developer's) URL. `string`
      dir: "auto",                              // Primary text direction for name, short_name, and description
      lang: "en-US",                            // Primary language for name and short_name
      background: "#fff",                       // Background colour for flattened icons. `string`
      theme_color: "#fff",                      // Theme color user for example in Android's task switcher. `string`
      appleStatusBarStyle: "black-translucent", // Style for Apple status bar: "black-translucent", "default", "black". `string`
      display: "standalone",                    // Preferred display mode: "fullscreen", "standalone", "minimal-ui" or "browser". `string`
      orientation: "any",                       // Default orientation: "any", "natural", "portrait" or "landscape". `string`
      scope: "/",                               // set of URLs that the browser considers within your app
      start_url: "/?homescreen=1",              // Start URL when launching the application from a device. `string`
      version: "1.0",                           // Your application's version string. `string`
      logging: false,                           // Print logs to console? `boolean`
      pixel_art: false,                         // Keeps pixels "sharp" when scaling up, for pixel art.  Only supported in offline mode.
      loadManifestWithCredentials: false,       // Browsers don't send cookies when fetching a manifest, enable this to fix that. `boolean`
      icons: {
        android: true,              // Create Android homescreen icon. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
        appleIcon: true,            // Create Apple touch icons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
        appleStartup: true,         // Create Apple startup images. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
        coast: true,                // Create Opera Coast icon. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
        favicons: true,             // Create regular favicons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
        firefox: true,              // Create Firefox OS icons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
        windows: true,              // Create Windows 8 tile icons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
        yandex: true                // Create Yandex browser icon. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
      }      
    }, options);

    favicons(
      this.options.src,
      this.options, 
      (error, response) => {
        if (error) {
          console.log(error.message); // Error description e.g. "An unknown error has occurred"
          return;
        }
        this.html = response.html;
        this.files = response.files;
        this.images = response.images; 
      }
    );
  }

  apply(compiler) {
    let { output } = compiler.options;
    this.options.path = output.path;

    /* Ensure our ouput directory exists */
    if (!fs.existsSync(output.path)){
      fs.mkdirSync(output.path);
    }

    if (this.options.src && output.path) {
      // add images to build
      compiler.hooks.make.tap({ name: 'WebpackFavicon' }, (compilation) => {
        compilation.hooks.processAssets.tap(
          {
            name: 'WebpackFavicon',
            stage: compilation.PROCESS_ASSETS_STAGE_PRE_PROCESS, // see below for more stages
            additionalAssets: true          
          },
          (assets) => {
            Object.keys(assets).map((i) => {
              // limit assets to only .html files
              if (i.indexOf('.html') !== -1) {
                // get .html file's source out of buffer and into string
                let HTML = assets[i]._value.toString();
                assets[i]._value = HTML.replace(
                  /<head>([\s\S]*?)<\/head>/,
                 `<head>$1\r${this.html.join('\r')}</head>`
                );
              }
            });
          }
        );
      });

      compiler.hooks.emit.tap({ name: 'WebpackFavicon'}, () => {
        Object.keys(this.images).map((i) => {
          let image = this.images[i];

          fs.writeFile(
            path.resolve(`${compiler.options.output.path}/${image.name}`), 
            image.contents, 
            (err) => {
              if (err) { console.log(err); }
              return true;
            }
          );
        });
      });
    }     
  }
}

module.exports = WebpackFavicon;