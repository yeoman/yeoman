/*global describe, before, after, beforeEach, afterEach, describe, it */
var fs      = require('fs');
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
    it('should output to stdout expected file writes', function(done) {
      var yeoman = helpers.run('init --force', opts);
      yeoman
        // enter '\n' for both prompts, and grunt confirm
        .prompt(/would you like/i)
        .prompt(/Do you need to make any changes to the above before continuing?/)

        // check few pattern in the process stdout
        // Check app generator invoke
        .expect(/Invoke (.+)?app/)

        // top level files
        .expect(/Writing Gruntfile\.js/)
        .expect(/Writing package.json/)

        // some expected files from h5bp
        .expect(/Writing app\/index\.html/)
        .expect(/Writing app\/404\.html/)
        .expect(/Writing app\/styles\/main\.css/)
        .expect(/Writing app\/scripts\/main\.js/)

        // same for bootstrap
        .expect(/Writing app\/scripts\/vendor\/bootstrap\/bootstrap-(.+)\.js/)

        // stylesheet hook - sass:app - to be re-added if we decide to go back
        // to use a hook for SASS part of the app generator, or simply delete
        // this line
        //
        // .expect(/Invoke sass:app/)
        .expect(/Writing app\/styles\/main\.scss/)
        .expect(/Writing app\/styles\/_compass_twitter_bootstrap\.scss/)
        .expect(/Writing app\/styles\/compass_twitter_bootstrap\/(.+).scss/)

        // test hook - jasmine:app
        .expect(/Invoke mocha:app/)
        .expect(/Writing test\/index\.html/)
        .expect(/Writing test\/lib\/chai\.js/)
        .expect(/Writing test\/lib\/expect\.js/)
        .expect(/Writing test\/lib\/mocha\/mocha\.css/)
        .expect(/Writing test\/lib\/mocha\/mocha\.js/)
        .expect(/Writing test\/runner\/mocha\.js/)

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
  });


  describe('And I run a build', function() {
    before(function() {
      var self = this;
      // setup the runnable, the actual run happens on last step
      this.yeoman = helpers.run('build:test --no-color', opts);
    });

    afterEach(function(done) {
      this.yeoman.end(done);
    });

    it('should run the correct set of task', function() {
      this.yeoman
        .expect(0)
        // intro clean mkdirs coffee compass usemin-handler rjs concat css img rev usemin manifest copy time
        .expect(/Running "build(:.+)?" (\(.+\) )?task/)
        .expect(/Running "clean(:.+)?" (\(.+\) )?task/)
        .expect(/Running "mkdirs(:.+)?" (\(.+\) )?task/)
        .expect(/Running "coffee(:.+)?" (\(.+\) )?task/)
        .expect(/Running "usemin-handler(:.+)?" (\(.+\) )?task/)
        .expect(/Running "rjs(:.+)?" (\(.+\) )?task/)
        .expect(/Running "concat(:.+)?" (\(.+\) )?task/)
        .expect(/Running "css(:.+)?" (\(.+\) )?task/)
        .expect(/Running "img(:.+)?" (\(.+\) )?task/)
        .expect(/Running "rev(:.+)?" (\(.+\) )?task/)
        .expect(/Running "usemin(:.+)?" (\(.+\) )?task/)
        .expect(/Running "copy(:.+)?" (\(.+\) )?task/)
        .expect(/Running "time(:.+)?" (\(.+\) )?task/);

      if( this.compass ) {
        this.yeoman.expect(/Running "compass(:.+)?" (\(.+\) )?task/);
      }

      if( this.phantomjs ) {
        this.yeoman.expect(/Running "manifest(:.+)?" (\(.+\) )?task/);
      }
    });

    describe('build', function() {
      it('should output the list of task at the beginning of the build', function() {
        this.yeoman.expect(/intro clean/);
        this.yeoman.expect(/mkdirs usemin-handler rjs concat css img rev usemin/);

        if( this.compass ) {
          this.yeoman.expect(/compass mkdirs/);
        }

        if( this.phantomjs) {
          this.yeoman.expect(/usemin manifest copy/);
        }
      });
    });

    describe('mkdirs', function() {
      it('should copy to the staging directory', function() {
        this.yeoman
          .expect(/Copying into/)
          .expect(/Ignoring .gitignore, .ignore, .buildignore/)
          .expect(/(.+)app -> (.+)temp/);
      });
    });


    describe('coffee', function() {
      it('should go through coffee:dist', function() {
        this.yeoman.expect(/Running "coffee:dist" \(coffee\) task/);
      });
    });

    describe('compass', function() {
      it('should go through compass:dist', function() {
        if( !this.compass ) { return; }
        this.yeoman.expect(/Running "compass:dist" \(compass\) task/);
      });

      it('should write to styles/main.css', function() {
        if( !this.compass ) { return; }
        this.yeoman.expect(/(overwrite|identical|create)(.+)styles\/main.css/);
      });
    });

    describe('img', function() {
      it('should go through img:dist', function() {
        this.yeoman.expect(/Running "img:dist" \(img\) task/);
      });
    });

    describe('rjs', function() {
      it('should optimize scripts/main', function() {
        this.yeoman.expect(/rjs optimized module: (.+)/);
      });
    });

    describe('concat', function() {
      it('should write plugins.js concat target', function() {
        this.yeoman
          .expect(/Running "concat:scripts\/plugins\.js" \(concat\) task/)
          .expect(/File "scripts\/plugins\.js" created\./);
      });

      it('should write amd-app.js concat target', function() {
        this.yeoman
          .expect(/Running "concat:scripts\/amd-app.js" \(concat\) task/)
          .expect(/File "scripts\/amd-app\.js" created\./);
      });
    });

    describe('css', function() {
      it('should process styles/main.css', function() {
        this.yeoman
          .expect(/Running "css:styles\/main.css" \(css\) task/)
          .expect(/Writing css files to styles\/main.css/);
      });
    });

    describe('rev', function() {
      describe('rev: should find and process the following files', function() {
        it('scripts/main.js >> {rev}.main.js', function() {
          this.yeoman.expect(/scripts\/main.js >> ([a-z0-9]+)\.main\.js/i);
        });
        it('scripts/vendor/bootstrap-alert.js >> {rev}.bootstrap-alert.js', function() {
          this.yeoman.expect(/scripts\/vendor\/bootstrap\/bootstrap-alert\.js >> ([a-z0-9]+)\.bootstrap-alert\.js/i);
        });
        it('scripts/vendor/jquery.min.js >> {rev}.jquery.min.js', function() {
          this.yeoman.expect(/scripts\/vendor\/jquery.min\.js >> ([a-z0-9]+)\.jquery.min\.js/i);
        });
        it('scripts/vendor/require.js >> {rev}.require.js', function() {
          this.yeoman.expect(/scripts\/vendor\/require\.js >> ([a-z0-9]+)\.require\.js/i);
        });
      });
    });

    describe('usemin', function() {
      describe('usemin: should find and replace the following files', function() {
        it('scripts/vendor/modernizr.min.js', function() {
          this.yeoman
            .expect('was <script src="scripts/vendor/modernizr.min.js')
            .expect(/now <script src="scripts\/vendor\/([a-z0-9]+)\.modernizr.min\.js/i);
        });
        it('scripts/amp-app.js', function() {
          this.yeoman
            .expect('was <script src="scripts/amd-app.js')
            .expect(/now <script src="scripts\/([a-z0-9]+)\.amd-app\.js/i);
        });
        it('styles/main.css', function() {
          this.yeoman
            .expect('was <link rel="stylesheet" href="styles/main.css')
            .expect(/now <link rel="stylesheet" href="styles\/([a-z0-9]+)\.main\.css/i);
        });
      });
    });

    describe('manifest', function() {
      it('should start a webserver automatically', function() {
        this.yeoman.expect('Starting static web server on port 3501');
      });
      it('should write to manifest.appcache', function() {
        if( !this.phantomjs ) { return; }
        this.yeoman
          .expect('Writing to manifest.appcache')
          .expect('This manifest was created by confess.js, http://github.com/jamesgpearce/confess')
          .expect(/styles\/([1-9a-z]+)\.main\.css/);
      });
    });

  });

});
