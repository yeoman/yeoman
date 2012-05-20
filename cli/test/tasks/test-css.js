//
// Mocha generated tests
//

var fs = require('fs'),
  path = require('path'),
  helpers = require('../helpers');

describe('CSS task', function() {

  // prepares the build dir
  before(helpers.before);

  before(function(done) {
    // copy in some files, with @imports to test out the inline imports
    var files = fs.readdirSync(path.join(__dirname, '../fixtures/css'))
      .filter(function(f) {
        return !(/expected/).test(f) && path.extname(f);
      })
      .map(function(f) {
        return path.join('css', f);
      });

    helpers.copy(files, '.test/css', done);
  });

  describe('As a build script user I want to be able to run the css task So that I can see the css task in action', function() {

    describe('css task', function() {

      it('Given I run the css task', function(done) {
        // runt the css task
        helpers.run('css', done);
      });

      it('When the script ends', function(done) {
        // not doing particularly usefull in this step
        // but the hook is here is we need to
        done();
      });

      it('Then ./test/css/style.css should be the same as test/fixtures/css/expected.css', function(done) {
        helpers.assertFile('.test/css/style.css', 'test/fixtures/css/expected.css');
        done();
      });

    });

  });

});
