/*global describe, before, after, beforeEach, afterEach, describe, it */
var fs      = require('fs');
var path    = require('path');
var grunt   = require('grunt');
var assert  = require('assert');
var helpers = require('./helpers');

var opts = grunt.cli.options;
opts.redirect = !opts.silent;

// XXX Conform to coding guidelines, mostly literral spacing stuff

describe('yeoman init && yeoman build', function() {

  before(helpers.directory('.test'));

  before(helpers.gruntfile({
    foo: {
      bar: '<config.baz>'
    }
  }));

  // Handle missing dependencies during test run, we only run compass /
  // manifest related test when necessary binaries are available. This helper
  // defines the respective boolean flag on the mocha test context, and used
  // within some of our tests to conditionnaly go through.
  before(helpers.installed('compass'));
  before(helpers.installed('phantomjs'));

  describe('When I run init app with default prompts', function(done) {
    before(function(done) {
      var yeoman = helpers.run('init --force', opts);
      yeoman
        // enter '\n' for both prompts, and grunt confirm
        .prompt(/would you like/i)
        .prompt(/Do you need to make any changes to the above before continuing?/)
        // check exit code
        .expect(0)
        // run and done
        .end(done);
    });

    it('should generate index.html with bootstrap plugins', function() {
      var index = grunt.file.read('app/index.html');
      assert.ok((/<!-- build:js scripts\/plugins.js -->/).test(index));
      assert.ok((/<!-- endbuild -->/).test(index));

      assert.ok(index.match('scripts/vendor/bootstrap/bootstrap-affix.js'));
      assert.ok(index.match('scripts/vendor/bootstrap/bootstrap-alert.js'));
      assert.ok(index.match('scripts/vendor/bootstrap/bootstrap-dropdown.js'));
      assert.ok(index.match('scripts/vendor/bootstrap/bootstrap-tooltip.js'));
      assert.ok(index.match('scripts/vendor/bootstrap/bootstrap-modal.js'));
      assert.ok(index.match('scripts/vendor/bootstrap/bootstrap-transition.js'));
      assert.ok(index.match('scripts/vendor/bootstrap/bootstrap-button.js'));
      assert.ok(index.match('scripts/vendor/bootstrap/bootstrap-popover.js'));
      assert.ok(index.match('scripts/vendor/bootstrap/bootstrap-typeahead.js'));
      assert.ok(index.match('scripts/vendor/bootstrap/bootstrap-carousel.js'));
      assert.ok(index.match('scripts/vendor/bootstrap/bootstrap-scrollspy.js'));
      assert.ok(index.match('scripts/vendor/bootstrap/bootstrap-collapse.js'));
      assert.ok(index.match('scripts/vendor/bootstrap/bootstrap-tab.js'));
    });

    it('should generate an app/ directory', function(done) {
      fs.stat('app/', done);
    });

    it('should generate a test/ directory', function(done) {
      fs.stat('test/', done);
    });

    it('should generate a test/spec/ directory', function(done) {
      fs.stat('test/spec/', done);
    });

    it('should generate a Gruntfile.js file', function(done) {
      fs.stat('Gruntfile.js', done);
    });

    describe('And I run a build', function() {
      before(function() {
        // setup some very basic coffee setup, to test out
        // coffee output
        grunt.file.write('app/scripts/foo.coffee', 'foo = "yeo"');
      });

      before(function(done) {
        // setup the runnable
        this.yeoman = helpers.run('build:test --no-color', opts)
          .expect(0)
          .end(done);
      });

      describe('mkdirs', function() {
        var dirs = ['index.html', 'images/', 'styles/', 'scripts/', 'templates'];
        dirs.forEach(function(filepath) {
          it('should copy ' + filepath + ' to the staging directory', function(done) {
            fs.stat(path.join('temp', filepath), done);
          });
        });
      });


      describe('coffee', function() {
        it('should go through coffee:dist', function() {
          // handled version file, get back filename via grunt globbing
          var foo = grunt.file.expandFiles('temp/scripts/*.foo.js')[0];
          assert.equal(grunt.file.read(foo), '(function() {\n  var foo;\n\n  foo = "yeo";\n\n}).call(this);\n');
        });
      });

      describe('compass', function() {
        it('should go through compass:dist', function() {
          if( !this.compass ) { return; }
          var main = grunt.file.expandFiles('temp/styles/*.main.css')[0];
          var body = grunt.file.read(main);
          assert.ok(/article,aside,details/.test(body));
        });
      });

      describe('img', function() {
        // TBD: setup some fixture, check that files in temp/images are smaller
        // than the one in app/images
        it('should go through img:dist');
      });

      describe('rjs', function() {
        it('should optimize scripts/main', function() {
          var file = grunt.file.expandFiles('temp/scripts/*.amd-app.js')[0];
          var body = grunt.file.read(file);
          assert.ok(/Hello from Yeoman!/, body);
        });
      });

      describe('concat', function() {
        it('should write plugins.js concat target', function() {
          var file = grunt.file.expandFiles('temp/scripts/*.plugins.js')[0];
          var body = grunt.file.read(file);

          // some of the expected bootstrap plugins
          ['affix', 'alert', 'dropdown', 'tooltip', 'modal', 'button'].forEach(function(str) {
            assert.ok(body.indexOf(str) !== -1);
          });
        });

        it('should write amd-app.js concat target', function() {
          var file = grunt.file.expandFiles('temp/scripts/*.amd-app.js')[0];
          var body = grunt.file.read(file);

          // some of the expected pattern in this optimized minified file
          ['Hello from Yeoman!', 'requirejs'].forEach(function(str) {
            assert.ok(body.indexOf(str) !== -1);
          });
        });
      });

      describe('rev', function() {
        describe('rev: should find and process the following files', function() {
          it('scripts/main.js >> {rev}.main.js', function() {
            var file = grunt.file.expandFiles('temp/scripts/*.main.js')[0];
            assert.ok(/[a-z0-9]+\.main\.js/.test(file));
          });
          it('scripts/vendor/bootstrap-alert.js >> {rev}.bootstrap-alert.js', function() {
            var file = grunt.file.expandFiles('temp/scripts/vendor/bootstrap/*.bootstrap-alert.js')[0];
            assert.ok(/[a-z0-9]+\.bootstrap-alert\.js/.test(file));
          });
          it('scripts/vendor/jquery.min.js >> {rev}.jquery.min.js', function() {
            var file = grunt.file.expandFiles('temp/scripts/vendor/*.jquery.min.js')[0];
            assert.ok(/[a-z0-9]+\.jquery\.min\.js/.test(file));
          });
          it('scripts/vendor/require.js >> {rev}.require.js', function() {
            var file = grunt.file.expandFiles('temp/scripts/vendor/*.require.js')[0];
            assert.ok(/[a-z0-9]+\.require\.js/.test(file));
          });
        });
      });

      describe('usemin', function() {
        before(function() {
          this.body = grunt.file.read('temp/index.html');
        });

        describe('usemin: should find and replace the following files', function() {
          it('scripts/vendor/modernizr.min.js', function() {
            var file = path.basename(grunt.file.expandFiles('temp/scripts/vendor/*.modernizr.min.js')[0]);
            assert.ok(this.body.indexOf(file) !== -1);
          });
          it('scripts/amp-app.js', function() {
            var file = path.basename(grunt.file.expandFiles('temp/scripts/*.amd-app.js')[0]);
            assert.ok(this.body.indexOf(file) !== -1);
          });
          it('styles/main.css', function() {
            if( !this.compass ) { return; }
            var file = path.basename(grunt.file.expandFiles('temp/styles/*.main.css')[0]);
            assert.ok(this.body.indexOf(file) !== -1);
          });
        });
      });

      describe('manifest', function() {
        it('should write to manifest.appcache', function() {
          if( !this.phantomjs ) { return; }

          var manifest = grunt.file.read('temp/manifest.appcache');
          assert.ok(/CACHE:/.test(manifest));
          assert.ok(/scripts\/[a-z0-9]+\.amd-app\.js/.test(manifest));
          assert.ok(/scripts\/[a-z0-9]+\.plugins\.js/.test(manifest));
          assert.ok(/scripts\/vendor\/[a-z0-9]+\.modernizr\.min\.js/.test(manifest));

          if( !this.compass ) { return; }
          assert.ok(/styles\/[a-z0-9]+\.main\.css/.test(manifest));
        });
      });

    });

  });

  describe('And when I launch a test server ', function() {
    it('should export the needed directories');
//    it('should export the needed directories', function(done) {
//      // setup the runnable, the actual run happens on last step
//      this.yeoman = helpers.run('server:test', opts);
//      this.yeoman
//        .expect(/\/test/)
//        .expect(/\/app/)
//        .end(done);
//      });
  });
});
