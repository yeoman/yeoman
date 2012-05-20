//
// Mocha generated tests
//

var helpers = require('../helpers');

describe('HTML task', function() {

  // prepares the build dir
  before(helpers.before);

  describe('As a build script user I want to be able to run the html task So that I can see the html task in action', function() {

    describe('html task', function() {

      it('Given I run the html task', function(done) {
        // runt the html task
        helpers.run('html', done);
      });

      it('When the script ends', function(done) {
        // not doing anything particularly usefull in this step but the hook is here
        // if we need to
        done();
      });

      it('Then ./test/index.html should be the same as test/fixtures/html/index.html', function(done) {
        helpers.assertFile('.test/index.html', 'test/fixtures/html/index.html');
        done();
      });

    });

  });

});
