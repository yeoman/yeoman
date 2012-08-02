
var fs = require('fs'),
  grunt = require('grunt'),
  assert = require('assert'),
  helpers = require('./helpers');

var opts = grunt.cli.options;
opts.redirect = !opts.silent;

describe('yeoman init && yeoman build', function() {

  before(helpers.directory('.test'));

  before(helpers.gruntfile({
    foo: {
      bar: '<config.baz>'
    }
  }));

  describe('When I run init app with default prompts', function() {
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
        .expect(/Writing app\/apple-touch-icon-(.+).png/)
        .expect(/Writing app\/css\/main\.css/)
        .expect(/Writing app\/img\/\.gitignore/)
        .expect(/Writing app\/js\/main\.js/)

        // same for bootstrap
        .expect(/Writing app\/js\/vendor\/bootstrap\/bootstrap-(.+)\.js/)

        // stylesheet hook - sass:app
        .expect(/Invoke sass:app/)
        .expect(/Writing app\/css\/sass\/main\.scss/)
        .expect(/Writing app\/css\/sass\/_compass_twitter_bootstrap\.sass/)
        .expect(/Writing app\/css\/sass\/compass_twitter_bootstrap\/(.+).sass/)

        // test hook - jasmine:app
        .expect(/Invoke jasmine:app/)
        .expect(/Writing test\/index\.html/)
        .expect(/Writing test\/lib\/jasmine-[0-9\.]+\/jasmine\.css/)
        .expect(/Writing test\/lib\/jasmine-[0-9\.]+\/jasmine\.js/)
        .expect(/Writing test\/runner\/html\.js/)
        .expect(/Writing test\/runner\/headless\.js/)

        // run and done
        .end(done);
    });

    it('should generate index.html with bootstrap plugins', function() {
      var index = grunt.file.read('app/index.html');
      assert.ok((/<!-- build:js js\/plugins.js -->/).test(index));
      assert.ok((/<!-- endbuild -->/).test(index));

      assert.ok(index.match('js/vendor/bootstrap/bootstrap-alert.js'));
      assert.ok(index.match('js/vendor/bootstrap/bootstrap-dropdown.js'));
      assert.ok(index.match('js/vendor/bootstrap/bootstrap-tooltip.js'));
      assert.ok(index.match('js/vendor/bootstrap/bootstrap-modal.js'));
      assert.ok(index.match('js/vendor/bootstrap/bootstrap-transition.js'));
      assert.ok(index.match('js/vendor/bootstrap/bootstrap-button.js'));
      assert.ok(index.match('js/vendor/bootstrap/bootstrap-popover.js'));
      assert.ok(index.match('js/vendor/bootstrap/bootstrap-typeahead.js'));
      assert.ok(index.match('js/vendor/bootstrap/bootstrap-carousel.js'));
      assert.ok(index.match('js/vendor/bootstrap/bootstrap-scrollspy.js'));
      assert.ok(index.match('js/vendor/bootstrap/bootstrap-collapse.js'));
      assert.ok(index.match('js/vendor/bootstrap/bootstrap-tab.js'));
    });

    it('should generate an app/ directory', function(done) {
      fs.stat('app/', done);
    });

    it('should generate a spec/ directory', function(done) {
      fs.stat('spec/', done);
    });

    it('should generate a test/ directory', function(done) {
      fs.stat('test/', done);
    });

    it('should generate a Gruntfile.js file', function(done) {
      fs.stat('Gruntfile.js', done);
    });
  });


  describe('And I run a build', function() {
    before(function() {
      var self = this;
      // setup the runnable, the actual run happens on last step
      this.yeoman = helpers.run('build --no-color', opts);
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
        .expect(/Running "compass(:.+)?" (\(.+\) )?task/)
        .expect(/Running "usemin-handler(:.+)?" (\(.+\) )?task/)
        .expect(/Running "rjs(:.+)?" (\(.+\) )?task/)
        .expect(/Running "concat(:.+)?" (\(.+\) )?task/)
        .expect(/Running "css(:.+)?" (\(.+\) )?task/)
        .expect(/Running "img(:.+)?" (\(.+\) )?task/)
        .expect(/Running "rev(:.+)?" (\(.+\) )?task/)
        .expect(/Running "usemin(:.+)?" (\(.+\) )?task/)
        .expect(/Running "manifest(:.+)?" (\(.+\) )?task/)
        .expect(/Running "copy(:.+)?" (\(.+\) )?task/)
        .expect(/Running "time(:.+)?" (\(.+\) )?task/);
    });

    describe('build', function() {
      it('should output the list of task at the beginning of the build', function() {
        this.yeoman
          .expect(/intro clean mkdirs coffee compass usemin-handler rjs concat css img rev usemin manifest copy time/);
      });
    });

    describe('mkdirs', function() {
      it('should copy to the staging directory', function() {
        this.yeoman
          .expect(/Copying into/)
          .expect(/Ignoring .gitignore, .ignore, .buildignore/)
          .expect(/(.+)app -> (.+)intermediate/);
      });
    });


    describe('coffee', function() {
      it('should go through coffee:dist', function() {
        this.yeoman.expect(/Running "coffee:dist" \(coffee\) task/);
      });
    });

    describe('compass', function() {
      it('should go through compass:dist', function() {
        this.yeoman.expect(/Running "compass:dist" \(compass\) task/);
      });

      it('should write to css/main.css', function() {
        this.yeoman.expect(/(overwrite|identical|create)(.+)css\/main.css/);
      });
    });

    describe('img', function() {
      it('should go through img:dist', function() {
        this.yeoman.expect(/Running "img:dist" \(img\) task/);
      });
    });

    describe('rjs', function() {
      it('should optimize js/main', function() {
        this.yeoman.expect(/rjs optimized module: (.+)/);
      });
    });

    describe('concat', function() {
      it('should write plugins.js concat target', function() {
        this.yeoman
          .expect(/Running "concat:js\/plugins\.js" \(concat\) task/)
          .expect(/File "js\/plugins\.js" created\./);
      });

      it('should write amd-app.js concat target', function() {
        this.yeoman
          .expect(/Running "concat:js\/amd-app.js" \(concat\) task/)
          .expect(/File "js\/amd-app\.js" created\./);
      });
    });

    describe('css', function() {
      it('should process css/main.css', function() {
        this.yeoman
          .expect(/Running "css:css\/main.css" \(css\) task/)
          .expect(/Writing css files to css\/main.css/);
      });
    });

    describe('rev', function() {
      describe('rev: should find and process the following files', function() {
        it('js/main.js >> {rev}.main.js', function() {
          this.yeoman.expect(/js\/main.js >> ([a-z0-9]+)\.main.js/i);
        });
        it('js/plugins.js >> {rev}.plugins.js', function() {
          this.yeoman.expect(/js\/plugins.js >> ([a-z0-9]+)\.plugins.js/i);
        });
        it('js/vendor/bootstrap-alert.js >> {rev}.bootstrap-alert.js', function() {
          this.yeoman.expect(/js\/vendor\/bootstrap\/bootstrap-alert.js >> ([a-z0-9]+)\.bootstrap-alert.js/i);
        });
        it('js/vendor/jquery-1.7.2.js >> {rev}.jquery-1.7.2.js', function() {
          this.yeoman.expect(/js\/vendor\/jquery-1\.7\.2.js >> ([a-z0-9]+)\.jquery-1\.7\.2.js/i);
        });
        it('js/vendor/require.js >> {rev}.require.js', function() {
          this.yeoman.expect(/js\/vendor\/require\.js >> ([a-z0-9]+)\.require\.js/i);
        });
      });
    });

    describe('usemin', function() {
      describe('usemin: should find and replace the following files', function() {
        it('js/vendor/modernizr-2.6.1.min.js', function() {
          this.yeoman
            .expect('was <script src="js/vendor/modernizr-2.6.1.min.js')
            .expect(/now <script src="js\/vendor\/([a-z0-9]+)\.modernizr-2\.6\.1\.min\.js/i);
        });
        it('js/amp-app.js', function() {
          this.yeoman
            .expect('was <script src="js/amd-app.js')
            .expect(/now <script src="js\/([a-z0-9]+)\.amd-app\.js/i);
        });
        it('css/main.css', function() {
          this.yeoman
            .expect('was <link rel="stylesheet" href="css/main.css')
            .expect(/now <link rel="stylesheet" href="css\/([a-z0-9]+)\.main\.css/i);
        });
      });
    });

    describe('manifest', function() {
      it('should start a webserver automatically', function() {
        this.yeoman.expect('Starting static web server on port 3501');
      });
      it('should write to manifest.appcache', function() {
        this.yeoman
          .expect('Writing to manifest.appcache')
          .expect('This manifest was created by confess.js, http://github.com/jamesgpearce/confess');
      });
    });

  });

});
