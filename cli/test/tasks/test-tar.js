//
// Mocha generated tests
//

var fs = require('fs'),
  path = require('path'),
  helpers = require('../helpers');

describe('TAR task', function() {

  // mocha converter should expose hook for before, after, beforeEach and afterEach
  // note: stop copy-pasting this everywhere, do it.
  before(helpers.before);

  describe('As a build script user I want to be able to run the tar task So that I can see the tar task in action', function() {

    describe('tar task', function() {

      it('Given I run the tar task', function(done) {
        // runs the tar task
        // we gonna pack the whole '.test' dir in '.test/test.tar.gz'
        // curious to see how the task handle output within input..
        helpers.run('tar --input ./ --output ./test.tgz', done);
      });

      it('When the script ends', function(done) {
        // not doing particularly usefull in this step
        // but the hook is here is we need to
        done();
      });

      it('Then .test/test.tgz should be there', function(done) {
        fs.stat('.test/test.tgz', done);
      });

      /// XXX actualy extract the tarball, and do some assertions on the files in there

    });

  });

});
