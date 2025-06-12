const fs = require('fs');
const path = require('path');
const { sources } = require('webpack');

const getAttributes = (markup) =>
  markup.match(/([^\r\n\t\f\v= '"]+)(?:=(["'])?((?:.(?!\2?\s+(?:\S+)=|\2))+.)\2?)?/g).slice(1, -1);

const getTagType = (markup) => (markup.includes('meta') ? 'meta' : 'link');

const applyPathPattern = (pattern, file) => {
  return pattern.replace('[filename]', file.name);
};

const fixManifestIconSrc = (pattern, file) => {
  try {
    const manifest = JSON.parse(file.contents);
    if (manifest.icons) {
      manifest.icons = manifest.icons.map(icon => ({
        ...icon,
        src: pattern.replace('[filename]', path.basename(icon.src)) // keep only filename
      }));
    }
    file.contents = JSON.stringify(manifest, null, 2);
  } catch (err) {
    console.error(err);
  }

  return file;
};

const fixBrowserconfigSrc = (pattern, file) => {
  try {
    file.contents = file.contents.replace(/src="([^"]+)"/g, (match, src) => {
      return `src="${pattern.replace('[filename]', path.basename(src))}"`;
    });
  } catch (err) {
    console.error(err);
  }

  return file;
};

const fixYandexManifestIconSrc = (pattern, file) => {
  try {
    const manifest = JSON.parse(file.contents);
    manifest.layout.logo = pattern.replace('[filename]', path.basename(manifest.layout.logo)) // keep only filename
    file.contents = JSON.stringify(manifest, null, 2);
  } catch (err) {
    console.error(err);
  }

  return file;
};

class WebpackFavicons {
  constructor(options, callback) {
    // Setting default options, user options will override
    this.options = {
      src: false,
      path: '',
      appName: null,                            // Your application's name. `string`
      appShortName: null,                       // Your application's short_name. `string`. Optional. If not set, appName will be used
      appDescription: null,                     // Your application's description. `string`
      developerName: null,                      // Your (or your developer's) name. `string`
      developerURL: null,                       // Your (or your developer's) URL. `string`
      dir: 'auto',                              // Primary text direction for name, short_name, and description
      lang: 'en-US',                            // Primary language for name and short_name
      background: '#fff',                    // Background color for flattened icons. `string`
      theme_color: '#fff',                   // Theme color used in Android's task switcher. `string`
      appleStatusBarStyle: 'black-translucent', // Style for Apple status bar: "black-translucent", "default", "black". `string`
      display: 'standalone',                    // Preferred display mode: "fullscreen", "standalone", "minimal-ui" or "browser". `string`
      orientation: 'any',                       // Default orientation: "any", "natural", "portrait" or "landscape". `string`
      scope: '',                                // Set of URLs that the browser considers within your app
      start_url: '/?homescreen=1',              // Start URL when launching the application from a device. `string`
      version: '1.0',                           // Your application's version string. `string`
      logging: false,                           // Print logs to console? `boolean`
      pixel_art: false,                         // Keeps pixels "sharp" when scaling up, for pixel art. Only supported in offline mode.
      loadManifestWithCredentials: false,       // Browsers don't send cookies when fetching a manifest, enable this to fix that. `boolean`
      icons: { favicons: true },                // Specify which icons to generate
      manifestPathPattern: '[filename]',        // Manifest file's icon path pattern (default is relative)
      browserconfigPathPattern: '[filename]',   // Browserconfig file'ss icon path pattern (default is relative)
      yandexManifestIconPattern: '[filename]',   // Yandex Manifest file's icon path pattern (default is relative)
      ...options,
    };

    // Merging user-specified icon options
    this.options.icons = {
      android: false,                           // Create Android homescreen icon. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
      appleIcon: false,                         // Create Apple touch icons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
      appleStartup: false,                      // Create Apple startup images. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
      coast: false,                             // Create Opera Coast icon. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
      favicons: true,                           // Create regular favicons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
      firefox: false,                           // Create Firefox OS icons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
      windows: false,                           // Create Windows 8 tile icons. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
      yandex: false,                            // Create Yandex browser icon. `boolean` or `{ offset, background, mask, overlayGlow, overlayShadow }` or an array of sources
      ...this.options.icons,
    };

    this.callback = callback;
  }

  apply(compiler) {
    const { output } = compiler.options;

    // Ensure the output directory exists
    if (!fs.existsSync(output.path)) fs.mkdirSync(output.path, { recursive: true });

    if (this.options.src && output.path) {
      // HTML link tag injections
      compiler.hooks.thisCompilation.tap({ name: 'WebpackFavicons' }, (compilation) => {
        compilation.hooks.processAssets.tapPromise(
          {
            name: 'WebpackFavicons',
            stage: compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
            additionalAssets: false,
          },
          async (assets) => {
            this.ticketTest += 1;
            try {
              // Generate favicons using the `favicons` module
              const { favicons } = await import('favicons');
              let response = await favicons(this.options.src, this.options);

              // Check/Run plugin callback
              if (typeof this.callback === 'function') {
                response = { ...response, ...this.callback(response) };
              }

              if (
                (this.options.manifestPathPattern || this.options.browserconfigPathPattern) 
                && response.files
              ) {
                response.files.forEach(file => {
                  // favicons npm module does not write paths correctly to manifest file, this is their own issue but we can fix it.
                  if (file.name === 'manifest.webmanifest') {
                    file = fixManifestIconSrc(this.options.manifestPathPattern, file);
                  }

                  // favicons npm module does not write paths correctly to browserconfig file, this is their own issue but we can fix it.
                  if (file.name === 'browserconfig.xml') {
                    file = fixBrowserconfigSrc(this.options.browserconfigPathPattern, file);
                  }

                  // favicons npm module does not write paths correctly to yandex file, this is their own issue but we can fix it.
                  if (file.name === 'yandex-browser-manifest.json') {
                    file = fixYandexManifestIconSrc(this.options.yandexManifestIconPattern, file);
                  }                  
                });
              }

              // Inject generated favicon tags into HTML files
              this.injectIntoHtml(compilation, response, assets);

              // Adds generated images, JSON, and XML files to the build
              this.addAssets(response, assets);
            } catch (error) {
              // If there is a parsing error, stop execution
              console.error(error.message);
            }

            return assets;
          }
        );
      });
    }
  }

  // Function to handle injection into HTML files
  injectIntoHtml = (compilation, response, assets) => {
    // If HtmlWebpackPlugin is found, inject link tags
    require('html-webpack-plugin').getCompilationHooks(compilation).alterAssetTags.tapAsync(
      { name: 'WebpackFavicons' },
      (data, callback) => {
        // Loop over each HTML <link> tag in the favicon response
        response.html.forEach((markup) => {
          const attributes = getAttributes(markup).reduce((acc, attr) => {
            const [key, value] = attr.split('=');
            acc[key] = value ? value.slice(1, -1) : '';

            // Prepend output.publicPath to href paths
            if (key === 'href' && compilation.compiler.options.output.publicPath !== 'auto') {
              acc[key] = path.normalize(`${compilation.compiler.options.output.publicPath}/${acc[key]}`).replace(/\\/g, '/');
            }
            return acc;
          }, {});

          // Push <link> HTML object data into HtmlWebpackPlugin meta template
          data.assetTags.meta.push({
            tagName: getTagType(markup),
            voidTag: true,
            meta: { plugin: 'WebpackFavicons' },
            attributes,
          });
        });

        // Run required callback with altered data
        callback(null, data);
      }
    );

    // If CopyWebpackPlugin is found, inject link tags manually
    Object.keys(assets)
      .filter((filename) => filename.endsWith('.html'))
      .forEach((filename) => {
        const { publicPath } = compilation.compiler.options.output;
        response.html = response.html.map((markup) =>
          markup.replace(/href="(.*?)"/g, (_, p1) => `href="${path.normalize(`${publicPath}/${p1}`)}"`.replace(/\\/g, '/'))
        );

        // Inject favicon <link> into .html document(s)
        const HTML = compilation.getAsset(filename).source.source().toString();
        compilation.updateAsset(
          filename,
          new sources.RawSource(
            HTML.replace(
              /<head>([\s\S]*?)<\/head>/,
              `<head>$1${response.html.join('\r    ')}</head>`
            )
          )
        );
      });
  };

  // Function to add generated images, JSON, and XML files to the build
  addAssets = (response, assets) => {
    const addFiles = (files) =>
      files.forEach((file) => {
        assets[`/${this.options.path}/${file.name}`] = {
          source: () => file.contents,
          size: () => file.contents.length,
        };
      });

    // Adds generated images to build
    if (response.images) addFiles(response.images);

    // Adds manifest JSON and XML files to build
    if (response.files) addFiles(response.files);
  };
}

module.exports = WebpackFavicons;
