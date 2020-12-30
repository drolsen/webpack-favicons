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

test('insert', t => {
  let hasFile = false;
    if (fs.existsSync(path.resolve(__dirname, '../dist/favicon.ico'))){
      hasFile = true;
    }

  if (hasFile) {
    t.pass();
  } else {
    t.fail();
  }
});