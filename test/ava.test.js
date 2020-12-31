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
    console.log('Successfully tested link tag insertion');
  } else {
    t.fail();
  }
});

test('insert', t => {
  let hasFile = false;
    if (fs.existsSync(path.resolve(__dirname, '../dist/assets/favicon.ico'))){
      hasFile = true;
    }

  if (hasFile) {
    t.pass();
    console.log('Successfully tested for favicon files');
  } else {
    t.fail();
  }
});


test('manifest', t => {
  let hasFile = false;
    if (fs.existsSync(path.resolve(__dirname, '../dist/assets/manifest.json'))){
      hasFile = true;
    }

  if (hasFile) {
    t.pass();
    console.log('Successfully tested manifest files');
  } else {
    t.fail();
  }
});