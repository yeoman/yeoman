//
// Mocha generated tests
//

var assert = require('assert'),
  helpers = require('../helpers');

describe('build:* tasks', function() {

  // setup build dir
  before(helpers.before);

  // default --> build:default
  describe('default -> build:default', function() {

    it('Given I run the default task', function(done) {
      helpers.run('build', done);
    });

    describe('When the build script ends', function() {
      it('Then the outcome should be test/fixtures/default/expected/index.html', function() {
        helpers.assertFile('.test/publish/index.html', 'test/fixtures/default/expected/index.html');
      });
    });
  });

  // build:minify -> same as default but with full html minification
  describe('build:minify', function() {

    it('Given I run the build:minify task', function(done) {
      helpers.run('build:minify', done);
    });

    describe('When the build script ends', function() {

      it('Then the outcome should be test/fixtures/default/expected/minify.html', function() {
        helpers.assertFile('.test/publish/index.html', 'test/fixtures/default/expected/minify.html');
      });

    });

  });

});
