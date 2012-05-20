//
// Mocha generated tests
//

var helpers = require('../helpers');

describe('IMG task', function() {

  // mocha converter should expose hook for before, after, beforeEach and afterEach
  before(helpers.before);

  describe('As a  build script user I want to be able to run the img task So that I can see the img task in action', function() {

    describe('img task', function() {

      it('Given I run the img task', function(done) {
        // run the img task
        //
        // note: try commenting out this and execute done callback right away
        // to see mocha generate diff output on base64 encoded value in its
        // full glory
        helpers.run('img', done);
      });

      it('When the script ends', function(done) {
        // not doing particularly usefull in this step
        // but the hook is here is we need to
        done();
      });

      it('Then .test/img dir should be the same as test/fixtures/img/expected/', function(done) {
        helpers.assertDir('.test/img', 'test/fixtures/img/expected/');
        done();
      });

    });

  });

});
