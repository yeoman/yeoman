
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

    // init is a little bit tricky to get done because of the prompt, will be
    // refactored as another helper for reuse across test
    before(function(done) {
      var child = this.child = helpers.yeoman('init --force', true),
        write = child.stdin.write.bind(child.stdin),
        output = '';

      this.child.stdout.setEncoding('utf8');
      this.child.stdout.on('data', function(chunk) {
        if(/would you like/i.test(chunk)) {
          process.nextTick(write.bind(null, '\n'))
        } else if (/Do you need to make any changes/.test(chunk)) {
          process.nextTick(write.bind(null, '\n'))
        }
      });

      this.child.on('close', function(code) {
        if(!code) return done();
        var err = new Error('Error executing yeoman init: ' + code);
        err.code = code;
        done(err);
      });
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
