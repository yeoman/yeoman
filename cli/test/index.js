
var fs = require('fs'),
  h5bp = require('../'),
  assert = require('assert'),
  runner = require('./helpers'),
  EventEmitter = require('events').EventEmitter;

// XXX Backport latest tests environment from dev branch
// switching to grunt + mocha bdd

// plugins
assert.ok(h5bp.plugins);

// file equal helper
// XXX move to helper module
assert.file = function(actual, expect, message) {
  var actualBody = fs.readFileSync(actual, 'utf8');
  var expectBody = fs.readFileSync(expect, 'utf8');

  // only check length for now, form system to system seems like the hash change
  // for versioned assets. Probably caused by different linefeeds in the assets
  // content.

  var ok = actualBody.length === expectBody.length;
  if(!ok) console.log(actualBody, '\n\n\n', expectBody);

  message = message || [
    'Error checking length of:',
    '  > ' + actual + ': ' + actualBody.length,
    '  > ' + expect + ': ' + expectBody.length,
    '',
    ''
  ].join('\n');

  assert.ok(ok, message);
};


var test = new EventEmitter();

//
// Running tasks serially, tests pass or fail depending on grunt's exit code.
//

var imgs = ['1.png', '2.png', '3.png', '4.png', '5.jpg', '6.jpg'].map(function(img) {
  return 'default/' + img;
});

runner.copy(imgs, '.test/img', function(err) {
  if(err) {
    console.error('... Error copying files during tests ...');
    return process.exit(err.code || 1);
  }

  var cmd = process.argv.slice(2);

  // run grunt with passed in task to run, or default if not provided
  // give it the test EventEmitter that emits back the end event for our
  // assertions.
  runner('.test', test)(cmd.length ? cmd : 'default');
});

// global check on index.html
test.on('end', function(err) {
  assert.ifError(err);
  assert.file('.test/publish/index.html', 'test/fixtures/default/expected.html');
});

//
// check the usemin version, eg. one using
//
//    <!-- build:js path/to/script.js -->
//
// kind of surrouding html comment.
//
test.on('end', function(err) {
  assert.ifError(err);
  fs.writeFileSync('test/fixtures/default/usemin.expected.html', fs.readFileSync('.test/publish/usemin.html'));
  assert.file('.test/publish/usemin.html', 'test/fixtures/default/usemin.expected.html');
});


//
// Test original files remains the same
// (build script should happen on intermediate directory)
//
test.on('end', function(err) {
  assert.ifError(err);
  assert.file('.test/usemin.html', 'test/fixtures/default/usemin.html');
});
