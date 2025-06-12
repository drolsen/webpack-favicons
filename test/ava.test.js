const test = require('ava');
const fs = require('fs');
const path = require('path');
 
test('write (ensures <link> tags in test.HTML and favicons written to disk)', t => {
  let writeTest = true;
  const testData = fs.readFileSync(path.resolve(__dirname, '../dist/basic/test.html'), 'utf8');
  
  if (testData.toString().indexOf('<link rel="icon"') === -1) {
    writeTest = false;
  }

  if (!fs.existsSync(path.resolve(__dirname, '../dist/basic/assets/favicon.ico'))){
    writeTest = false;
  }

  if (writeTest) {
    t.pass();
  } else {
    t.fail();
  }
});

test('recursive-test (ensures output folder(s) gets recursivly created)', t => {
  let recursiveOutputTest = false;
  if (fs.existsSync(path.resolve(__dirname, '../dist/nested/assets/favicon.ico'))){
    recursiveOutputTest = true;
  }

  if (recursiveOutputTest) {
    t.pass();
  } else {
    t.fail();
  }
});

test('manifest-path-test (ensures paths to icons from manifest are correct)', t => {
  let testAPassed = false;
  let testBPassed = false;
  let testCPassed = false;
  let testDPassed = false;
  let testEPassed = false;

  const testADataFile2 = fs.readFileSync(path.resolve(__dirname, '../dist/manifest/build/faviconsA/browserconfig.xml'), 'utf8');
  const testADataFile1 = fs.readFileSync(path.resolve(__dirname, '../dist/manifest/build/faviconsA/manifest.webmanifest'), 'utf8');
  const testADataFile3 = fs.readFileSync(path.resolve(__dirname, '../dist/manifest/build/faviconsA/yandex-browser-manifest.json'), 'utf8');
  
  const testBDataFile2 = fs.readFileSync(path.resolve(__dirname, '../dist/manifest/build/faviconsB/browserconfig.xml'), 'utf8');
  const testBDataFile1 = fs.readFileSync(path.resolve(__dirname, '../dist/manifest/build/faviconsB/manifest.webmanifest'), 'utf8');
  const testBDataFile3 = fs.readFileSync(path.resolve(__dirname, '../dist/manifest/build/faviconsB/yandex-browser-manifest.json'), 'utf8');
  
  const testCDataFile2 = fs.readFileSync(path.resolve(__dirname, '../dist/manifest/build/faviconsC/browserconfig.xml'), 'utf8');
  const testCDataFile1 = fs.readFileSync(path.resolve(__dirname, '../dist/manifest/build/faviconsC/manifest.webmanifest'), 'utf8');
  const testCDataFile3 = fs.readFileSync(path.resolve(__dirname, '../dist/manifest/build/faviconsC/yandex-browser-manifest.json'), 'utf8');
  
  const testDDataFile2 = fs.readFileSync(path.resolve(__dirname, '../dist/manifest/build/faviconsD/browserconfig.xml'), 'utf8');
  const testDDataFile1 = fs.readFileSync(path.resolve(__dirname, '../dist/manifest/build/faviconsD/manifest.webmanifest'), 'utf8');
  const testDDataFile3 = fs.readFileSync(path.resolve(__dirname, '../dist/manifest/build/faviconsD/yandex-browser-manifest.json'), 'utf8');
  
  const testEDataFile2 = fs.readFileSync(path.resolve(__dirname, '../dist/manifest/build/faviconsE/browserconfig.xml'), 'utf8');
  const testEDataFile1 = fs.readFileSync(path.resolve(__dirname, '../dist/manifest/build/faviconsE/manifest.webmanifest'), 'utf8');
  const testEDataFile3 = fs.readFileSync(path.resolve(__dirname, '../dist/manifest/build/faviconsE/yandex-browser-manifest.json'), 'utf8');
  

  if (
    testADataFile1.toString().indexOf('/some/crazy/path/') === -1
    && testADataFile2.toString().indexOf('/some/crazy/path/') === -1
    && testADataFile3.toString().indexOf('/some/crazy/path/') === -1
  ) {
    testAPassed = true;
  }

  if (
    testBDataFile1.toString().indexOf('/some/crazy/path/') !== -1
    && testBDataFile2.toString().indexOf('/some/crazy/path/') === -1
    && testBDataFile3.toString().indexOf('/some/crazy/path/') === -1
  ) {
    testBPassed = true;
  }

  if (
    testCDataFile1.toString().indexOf('/some/crazy/path/') === -1
    && testCDataFile2.toString().indexOf('/some/crazy/path/') !== -1
    && testCDataFile3.toString().indexOf('/some/crazy/path/') === -1
  ) {
    testCPassed = true;
  }

  if (
    testDDataFile1.toString().indexOf('/some/crazy/path/') === -1
    && testDDataFile2.toString().indexOf('/some/crazy/path/') === -1
    && testDDataFile3.toString().indexOf('/some/crazy/path/') !== -1
  ) {
    testDPassed = true;
  }

  if (
    testEDataFile1.toString().indexOf('/some/crazy/path/') !== -1
    && testEDataFile2.toString().indexOf('/some/crazy/path/') !== -1
    && testEDataFile3.toString().indexOf('/some/crazy/path/') !== -1
  ) {
    testEPassed = true;
  }

  if (testAPassed && testBPassed && testCPassed && testDPassed && testEPassed) {
    t.pass();
  } else {
    t.fail();
  }
});

test('public-path-test (ensures output.publicPath accounted for)', t => {
  let publicPathTest = false;
  const testData = fs.readFileSync(path.resolve(__dirname, '../dist/public/test.html'), 'utf8');
  if (testData.toString().indexOf('href="/~media/') !== -1) {
    publicPathTest = true;
  }

  if (publicPathTest) {
    t.pass();
  } else {
    t.fail();
  }
});

test('mixed-path-test (ensure output.publicPath and WebpackFavicons path accounted for)', t => {
  let mixedPathTest = false;
  const testData = fs.readFileSync(path.resolve(__dirname, '../dist/mixed/test.html'), 'utf8');
  if (testData.toString().indexOf('href="/~media/custom/favicon') !== -1) {
    mixedPathTest = true;
  }

  if (mixedPathTest) {
    t.pass();
  } else {
    t.fail();
  }
});

test('minimal-test (no WebpackFavicons "icon": {} configuration)', t => {
  let minimalTest = true;

  if (!fs.existsSync(path.resolve(__dirname, '../dist/minimal/assets/favicon.ico'))){
    minimalTest = false;
  }

  if (minimalTest) {
    t.pass();
  } else {
    t.fail();
  }
});


test('full-test (builds lots of favicon types)', t => {
  let fullTest = true;

  const webmanifestTestData = fs.readFileSync(path.resolve(__dirname, '../dist/full/assets/manifest.webmanifest'), 'utf8');
  const yandexBrowserManifestTestData = fs.readFileSync(path.resolve(__dirname, '../dist/full/assets/yandex-browser-manifest.json'), 'utf8');

  if (!fs.existsSync(path.resolve(__dirname, '../dist/full/assets/android-chrome-144x144.png'))){
    fullTest = false;
  }

  if (!fs.existsSync(path.resolve(__dirname, '../dist/full/assets/apple-touch-icon-1024x1024.png'))){
    fullTest = false;
  }  

  if (!fs.existsSync(path.resolve(__dirname, '../dist/full/assets/apple-touch-startup-image-1125x2436.png'))){
    fullTest = false;
  } 

  if (!fs.existsSync(path.resolve(__dirname, '../dist/full/assets/favicon-16x16.png'))){
    fullTest = false;
  }  

  if (!fs.existsSync(path.resolve(__dirname, '../dist/full/assets/favicon-16x16.png'))){
    fullTest = false;
  } 

  if (!fs.existsSync(path.resolve(__dirname, '../dist/full/assets/favicon-32x32.png'))){
    fullTest = false;
  } 

  if (!fs.existsSync(path.resolve(__dirname, '../dist/full/assets/favicon-48x48.png'))){
    fullTest = false;
  } 

  if (!fs.existsSync(path.resolve(__dirname, '../dist/full/assets/favicon.ico'))){
    fullTest = false;
  }  

  if (!fs.existsSync(path.resolve(__dirname, '../dist/full/assets/mstile-144x144.png'))){
    fullTest = false;
  } 

  if (!fs.existsSync(path.resolve(__dirname, '../dist/full/assets/yandex-browser-50x50.png'))){
    fullTest = false;
  } 

  if (!fs.existsSync(path.resolve(__dirname, '../dist/full/assets/browserconfig.xml'))){
    fullTest = false;
  } 

  if (!fs.existsSync(path.resolve(__dirname, '../dist/full/assets/manifest.webmanifest'))){
    fullTest = false;
  } 

  if (!fs.existsSync(path.resolve(__dirname, '../dist/full/assets/yandex-browser-manifest.json'))){
    fullTest = false;
  }   

  if (
    webmanifestTestData.toString().indexOf('"background_color": "#fff"') === -1
    || webmanifestTestData.toString().indexOf('"theme_color": "#fff"') === -1
    || webmanifestTestData.toString().indexOf('"name": "Webpack Favicons"') === -1
    || webmanifestTestData.toString().indexOf('"description": "Favicon Generator for Webpack 5",') === -1
  ) {
    fullTest = false;
  }

  if (yandexBrowserManifestTestData.toString().indexOf('"color": "#fff"') === -1) {
    fullTest = false;
  }

  if (fullTest) {
    t.pass();
  } else {
    t.fail();
  }
});

test('callback-test (ensures callback can alter favicon data)', t => {
  let callbackTest = false;

  if (fs.existsSync(path.resolve(__dirname, '../dist/callback/assets/custom.ico'))){
    callbackTest = true;
  }

  const testData = fs.readFileSync(path.resolve(__dirname, '../dist/callback/test.html'), 'utf8');
  if (testData.toString().indexOf('custom.ico') === -1) {
    callbackTest = false;
  }  

  if (callbackTest) {
    t.pass();
  } else {
    t.fail();
  }
});

test('copy-test (ensures <link> added to html documented moved by CopyWebpackPlugin)', t => {
  let copyTest = true;

  if (!fs.existsSync(path.resolve(__dirname, '../dist/copy/test.html'))){
    copyTest = false;
  }

  const testData = fs.readFileSync(path.resolve(__dirname, '../dist/copy/test.html'), 'utf8');
  if (testData.toString().indexOf('favicon.ico') === -1) {
    copyTest = false;
  }  

  if (copyTest) {
    t.pass();
  } else {
    t.fail();
  }
});

test('hybrid-test (ensures <link>s added to both CopyWebpackPlugin and HtmlWebpackPlugin)', t => {
  let hybridTest = true;

  if (!fs.existsSync(path.resolve(__dirname, '../dist/hybrid/test.html'))){
    hybridTest = false;
  }

  if (!fs.existsSync(path.resolve(__dirname, '../dist/hybrid/testing.html'))){
    hybridTest = false;
  }  

  const testData1 = fs.readFileSync(path.resolve(__dirname, '../dist/hybrid/test.html'), 'utf8');
  if (testData1.toString().indexOf('favicon.ico') === -1) {
    hybridTest = false;
  } 

  const testData2 = fs.readFileSync(path.resolve(__dirname, '../dist/hybrid/testing.html'), 'utf8');
  if (testData2.toString().indexOf('favicon.ico') === -1) {
    hybridTest = false;
  }    

  if (hybridTest) {
    t.pass();
  } else {
    t.fail();
  }
});