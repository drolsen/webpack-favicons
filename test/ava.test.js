const test = require('ava');
const fs = require('fs');
const path = require('path');
 
test('write', t => {
  let insert = false;
  const testData = fs.readFileSync(path.resolve(__dirname, '../dist/test.html'), 'utf8');
  if (testData.toString().indexOf('<link rel="icon"') !== -1) {
    insert = true;
  }

  if (insert) {
    t.pass();
  } else {
    t.fail();
  }
});

test('generate', t => {
  let hasFile = false;
    if (fs.existsSync(path.resolve(__dirname, '../dist/assets/favicon.ico'))){
      hasFile = true;
    }

  if (hasFile) {
    t.pass();
  } else {
    t.fail();
  }
});

test('nested-folders', t => {
  let hasFile = false;
    if (fs.existsSync(path.resolve(__dirname, '../dist/nested/assets/favicon.ico'))){
      hasFile = true;
    }

  if (hasFile) {
    t.pass();
  } else {
    t.fail();
  }
});

test('public-path-test', t => {
  let insert = false;
  const testData = fs.readFileSync(path.resolve(__dirname, '../dist/public/test.html'), 'utf8');
  if (testData.toString().indexOf('href="/~media/') !== -1) {
    insert = true;
  }

  if (insert) {
    t.pass();
  } else {
    t.fail();
  }
});

test('mixed-pathing-test', t => {
  let insert = false;
  const testData = fs.readFileSync(path.resolve(__dirname, '../dist/mixed/test.html'), 'utf8');
  if (testData.toString().indexOf('href="/~media/assets/favicon') !== -1) {
    insert = true;
  }

  if (insert) {
    t.pass();
  } else {
    t.fail();
  }
});

test('default-test (no "icon": {} config)', t => {
  let hasFile = true;

  if (!fs.existsSync(path.resolve(__dirname, '../dist/default/assets/favicon.ico'))){
    hasFile = false;
  }

  if (hasFile) {
    t.pass();
  } else {
    t.fail();
  }
});


test('full-test (all favicon types)', t => {
  let hasFiles = true;

  if (!fs.existsSync(path.resolve(__dirname, '../dist/full/assets/android-chrome-144x144.png'))){
    hasFiles = false;
  }

  if (!fs.existsSync(path.resolve(__dirname, '../dist/full/assets/apple-touch-icon-1024x1024.png'))){
    hasFiles = false;
  }  

  if (!fs.existsSync(path.resolve(__dirname, '../dist/full/assets/apple-touch-startup-image-1125x2436.png'))){
    hasFiles = false;
  } 

  if (!fs.existsSync(path.resolve(__dirname, '../dist/full/assets/favicon-16x16.png'))){
    hasFiles = false;
  }  

  if (!fs.existsSync(path.resolve(__dirname, '../dist/full/assets/favicon-16x16.png'))){
    hasFiles = false;
  } 

  if (!fs.existsSync(path.resolve(__dirname, '../dist/full/assets/favicon-32x32.png'))){
    hasFiles = false;
  } 

  if (!fs.existsSync(path.resolve(__dirname, '../dist/full/assets/favicon-48x48.png'))){
    hasFiles = false;
  } 

  if (!fs.existsSync(path.resolve(__dirname, '../dist/full/assets/favicon.ico'))){
    hasFiles = false;
  }  

  if (!fs.existsSync(path.resolve(__dirname, '../dist/full/assets/mstile-144x144.png'))){
    hasFiles = false;
  } 

  if (!fs.existsSync(path.resolve(__dirname, '../dist/full/assets/yandex-browser-50x50.png'))){
    hasFiles = false;
  }                 

  if (hasFiles) {
    t.pass();
  } else {
    t.fail();
  }
});

test('callback-test', t => {
  let test = false;

  if (fs.existsSync(path.resolve(__dirname, '../dist/callback/assets/custom.ico'))){
    test = true;
  }

  const testData = fs.readFileSync(path.resolve(__dirname, '../dist/callback/test.html'), 'utf8');
  if (testData.toString().indexOf('custom.ico') === -1) {
    test = false;
  }  

  if (test) {
    t.pass();
  } else {
    t.fail();
  }
});