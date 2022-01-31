const fs = require('fs');
const path = require('path');
const { sources } = require('webpack');

const getAttributes = (markup) => markup.match(/([^\r\n\t\f\v= '"]+)(?:=(["'])?((?:.(?!\2?\s+(?:\S+)=|\2))+.)\2?)?/g).slice(1, -1);

class WebpackFavicons {
  constructor(options, callback) {
    this.options = Object.assign({
      src: false,
      path: '',
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
      scope: '',                                // set of URLs that the browser considers within your app
      start_url: "/?homescreen=1",              // Start URL when launching the application from a device. `string`
      version: "1.0",                           // Your application's version string. `string`
      logging: false,                           // Print logs to console? `boolean`
      pixel_art: false,                         // Keeps pixels "sharp" when scaling up, for pixel art.  Only supported in offline mode.
      loadManifestWithCredentials: false,       // Browsers don't send cookies when fetching a manifest, enable this to fix that. `boolean`
      icons: { favicons: true }      
    }, options);

    this.options.icons = Object.assign({
      android: false,                          // Create Android homescreen icon. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
      appleIcon: false,                        // Create Apple touch icons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
      appleStartup: false,                     // Create Apple startup images. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
      coast: false,                            // Create Opera Coast icon. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
      favicons: true,                          // Create regular favicons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
      firefox: false,                          // Create Firefox OS icons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
      windows: false,                          // Create Windows 8 tile icons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
      yandex: false                            // Create Yandex browser icon. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
    }, this.options.icons);

    this.callback = callback;
  }

  apply(compiler) {
    let { output } = compiler.options;

    /* Ensure our ouput directory exists */
    if (!fs.existsSync(output.path)){
      fs.mkdirSync(output.path, { recursive: true });
    }

    if (this.options.src && output.path) {
      // HTML link tag injections
      compiler.hooks.thisCompilation.tap({ name: 'WebpackFavicons' }, (compilation) => {
        compilation.hooks.processAssets.tapPromise(
          {
            name: 'WebpackFavicons',
            stage: compilation.PROCESS_ASSETS_STAGE_ADDITIONAL, // see below for more stages  
            additionalAssets: false 
          },
          (assets) => import('favicons').then((module) => module.favicons(
            this.options.src,
            this.options, 
            (error, response) => {
              // If we have parsing error lets stop
              if (error) { console.error(error.message); return; }

              // Check/Run plugin callback
              if (typeof this.callback === 'function') {
                response = Object.assign({ ...response }, this.callback(response));
              }

              //////// if HtmlWebpackPlugin found //////////
              try {
                require('html-webpack-plugin/lib/hooks').getHtmlWebpackPluginHooks(compilation).alterAssetTags.tapAsync(
                  { name: 'WebpackFavicons' }, 
                  (data, callback) => {
                    // Loop over favicon's response HTML <link> tags
                    Object.keys(response.html).map((i) => {
                      // Collect <link> HTML attributes into key|value object
                      let attrs = getAttributes(response.html[i]);
                      const attributes = {};

                      Object.keys(attrs).map((j) => {
                        const parts = attrs[j].split('=');
                        const key = parts[0];
                        const value = parts[1].slice(1, -1);

                        attributes[key] = value;

                        if (
                          key === 'href' 
                          && compiler.options.output.publicPath !== 'auto'
                        ) {
                          attributes[key] = path.normalize(`${compiler.options.output.publicPath}/${value}`).replace(/\\/g, '/');
                        }
                      });

                      // Push <link> HTML object data into HtmlWebpackPlugin meta template
                      data.assetTags.meta.push({
                        tagName: 'link',
                        voidTag: true,
                        meta: { plugin: 'WebpackFavicons' },
                        attributes
                      });
                    });

                    // Run required callback with altered data
                    callback(null, data);
                  }
                );
              } catch (err) { }

              //////// if CopyWebpackPlugin found //////////
              Object.keys(assets).map((i) => {
                // Only alter .html files
                if (i.indexOf('.html') === -1) { return false; }

                // Prepend output.plublicPath to favicon href paths by hand
                if (compiler.options.output.publicPath !== 'auto') {
                  response.html = Object.keys(response.html).map(
                    (i) => response.html[i].replace(
                      /href="(.*?)"/g, 
                      (match, p1, string) => `href="${path.normalize(`${compiler.options.output.publicPath}/${p1}`)}"`.replace(/\\/g, '/')
                    )
                  );
                }

                // Inject favicon <link> into .html document(s)
                let HTML = compilation.getAsset(i).source.source().toString();
                compilation.updateAsset(                
                  i,
                  new sources.RawSource(
                    HTML.replace(
                      /<head>([\s\S]*?)<\/head>/, 
                      `<head>$1\r    ${response.html.join('\r    ')}\r  </head>`
                    )
                  )
                );
              });         

              // Adds generated images to build
              if (response.images) {
                Object.keys(response.images).map((i) => {
                  let image = response.images[i];
                  assets[path.normalize(`/${this.options.path}/${image.name}`)] = {
                    source: () => image.contents,
                    size: () => image.contents.length
                  };
                });
              }

              // Adds manifest json and xml files to build
              if (response.files) {
                Object.keys(response.files).map((i) => {
                  let file = response.files[i];
                  assets[path.normalize(`/${this.options.path}/${file.name}`)] = {
                    source: () => file.contents,
                    size: () => file.contents.length
                  };
                }); 
              }

              return assets;                      
            }
          ))
        );      
      });
    }     
  }
}

module.exports = WebpackFavicons;