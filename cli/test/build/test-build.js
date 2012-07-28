
var fs = require('fs'),
  grunt = require('grunt'),
  assert = require('assert'),
  yeoman = require('../../'),
  helpers = require('./helpers');

describe('yeoman init && yeoman build', function() {

  before(helpers.directory('.test'));

  before(helpers.gruntfile({
    foo: {
      bar: '<config.baz>'
    }
  }));

  describe('When I run init app with default prompts', function() {
    it('should output to stdout expected file writes', function(done) {
      var yeoman = helpers.run('init --force', { redirect: true });
      yeoman
        // enter '\n' for both prompts, and grunt confirm
        .prompt(/Would you like to include (.+) plugins/)
        .prompt(/Where would you like it be downloaded ?/)
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


  describe('When I run a build', function() {

    it('should do something', function(done) {
      var yeoman = helpers.run('build', { redirect: true });
      yeoman
        .expect(0)
        .expect(/Running "build" taskss/)
        .expect(/Running "mkdirs" taskss/)
        .end(done);
    });

  });

});
