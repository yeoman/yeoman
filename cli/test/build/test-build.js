
var grunt = require('grunt'),
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

  describe('when I run init app with default prompts', function() {

    before(function(done) {
      var yeoman = helpers.run('init --force');
      // match both prompt for bootstrap plugins, Y/n and location
      yeoman.prompt(/would you like/i);
      // match final grunt confirmation
      yeoman.prompt(/Do you need/);
      yeoman.end(done);
    });

    it('should generate index.html with bootstrap plugins', function() {
      var index = grunt.file.read('index.html');
      assert.ok((/<!-- build:js app\/js\/plugins.js -->/).test(index));
      assert.ok((/<!-- endbuild -->/).test(index));

      assert.ok(index.match('app/js/vendor/bootstrap/bootstrap-alert.js'));
      assert.ok(index.match('app/js/vendor/bootstrap/bootstrap-dropdown.js'));
      assert.ok(index.match('app/js/vendor/bootstrap/bootstrap-tooltip.js'));
      assert.ok(index.match('app/js/vendor/bootstrap/bootstrap-modal.js'));
      assert.ok(index.match('app/js/vendor/bootstrap/bootstrap-transition.js'));
      assert.ok(index.match('app/js/vendor/bootstrap/bootstrap-button.js'));
      assert.ok(index.match('app/js/vendor/bootstrap/bootstrap-popover.js'));
      assert.ok(index.match('app/js/vendor/bootstrap/bootstrap-typeahead.js'));
      assert.ok(index.match('app/js/vendor/bootstrap/bootstrap-carousel.js'));
      assert.ok(index.match('app/js/vendor/bootstrap/bootstrap-scrollspy.js'));
      assert.ok(index.match('app/js/vendor/bootstrap/bootstrap-collapse.js'));
      assert.ok(index.match('app/js/vendor/bootstrap/bootstrap-tab.js'));
    });

  });

});
