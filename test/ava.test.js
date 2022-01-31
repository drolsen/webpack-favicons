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