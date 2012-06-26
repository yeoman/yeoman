//
// Mocha generated tests
//

var fs = require('fs'),
  path = require('path'),
  assert = require('assert'),
  helpers = require('../helpers');

describe('USEMIN task', function() {

  before(helpers.before);

  describe('As a build script user I want to be able to run the usemin task So that I can see the usemin task in action', function() {

    describe('usemin task', function() {

      it('Given I run the usemin task', function(done) {
        // runt the usemin task
        helpers.run('usemin', done);
      });

      it('When the script ends', function(done) {
        // not doing anything particularly usefull in this step
        // but the hook is here if we need to
        done();
      });

      it('Then .test/usemin.html should be the same as test/fixtures/usemin/index.html', function(done) {
        // XXX task log output doesn't return things that were changed between
        // <!-- build:<target> path/to/foo.js --> directives
        helpers.assertFile('.test/usemin.html', 'test/fixtures/usemin/index.html');
        done();
      });

    });


    describe('usemin task with reved imgs', function() {

      before (function(done) {
        // XXX move into an helper function, used here and in test-css.js
        // copy in some files, with @imports to test out the inline imports
        var files = fs.readdirSync(path.join(__dirname, '../fixtures/css'))
          .filter(function(f) {
            return !(/expected/).test(f) & !!path.extname(f);
          })
          .map(function(f) {
            return path.join('css', f);
          });

        helpers.copy(files, '.test/css', function(err) {
          if(err) return done(err);
          // add one level of relative assets, just to see how it goes
          helpers.copyFile('test/fixtures/css/ui/widget.css', '.test/css/ui/widget.css', done);
        });
      });

      it('Given I run the rev usemin task', function(done) {
        // runt the usemin task
        helpers.run('css rev usemin', done);
      });

      it('When the script ends', function(done) {
        // not doing anything particularly usefull in this step
        // but the hook is here if we need to
        done();
      });

      it('Then .test/usemin.html should be the same as test/fixtures/usemin/reved.html', function(done) {
        // todo: task log output doesn't return things that were changed between
        // <!-- build:<target> path/to/foo.js --> directives
        helpers.assertFile('.test/usemin.html', 'test/fixtures/usemin/reved.html');
        done();
      });

      it('And I should see img/59928801.1.png in .test/usemin.html', function(done) {
        var test = new RegExp('img/59928801.1.png');
        fs.readFile('.test/usemin.html', function(err, body) {
          if(err) return done(err);
          assert.ok(test.test(body));
          done();
        });
      });

      // XXX add step definition for this one. Should readdir the ./test/css
      // dir, guessing the revision instead of hardcoding here
      it('And I should see img/f67f4a27.6.jpg in .test/css/app.css', function(done) {
        var test = new RegExp('img/f67f4a27.6.jpg');
        fs.readFile('.test/css/e66fc2fd.app.css', function(err, body) {
          if(err) return done(err);
          assert.ok(test.test(body), 'Missing reved img in style.css');
          done();
        });
      });

    });

  });

});
