/*globals describe, it, before, after, beforeEach, afterEach */
var fs = require('fs'),
  path = require('path'),
  grunt = require('grunt'),
  assert = require('assert'),
  helpers = require('./helpers'),
  bower = require('bower').commands;

// bower components to test out
var components = ['jquery', 'backbone', 'spine'];
// var components = ['jquery', 'backbone', 'ember', 'angular', 'canjs'];

describe('Bower install packages', function() {

  before(helpers.directory('.test'));

  before(helpers.gruntfile({
    foo: {
      bar: '<config.baz>'
    }
  }));

  before(function(done) {
    var yeoman = helpers.run('init --force');
    yeoman
      // enter '\n' for both prompts, and grunt confirm
      .prompt(/would you like/i)
      .prompt(/Do you need to make any changes to the above before continuing?/)
      // check exit code
      .expect(0)
      // run and done
      .end(done);
  });

  components.forEach(function(name) {
    it('should install ' + name + ' with yeoman install ' + name, function(done) {
      console.log();
      helpers.run('install ' + name, { redirect: true })
        .expect(0)
        .end(done);
    });


    it('should have copied resolved components to app/components', function(done) {
      var ctx = this;

      fs.stat(path.join('app/components', name), done);

      /*
      bower.list({ map: true })
        .on('error', done)
        .on('data', function(results) {
          
          ctx.results = results;
          var pkg = results[name];
          
          var source = ctx[name] = pkg.source.main;
          var vendor = source.replace(/^components/, 'app/components');
          fs.stat(vendor, done);
          
        
        });

        */
    });
  });

  // These tests are failing, and specifically testing out some current issues
  // we might have.

  /* * /
  describe('should not override non "components" files in app/scripts/vendor', function(done) {
    ['esprima.js', 'hm.js', 'jquery.min.js', 'modernizr.min.js', 'require.js'].forEach(function(file) {
      it('like ' + file, function(done) {
        fs.stat(path.join('app/scripts/vendor', file), done);
      });
    });
  });
  /* */

  /* * /
  describe('should have updated the RequireJS configuration for paths', function() {

    before(function() {
      this.main = grunt.file.read('app/scripts/main.js');
    });

    components.forEach(function(name) {
      it('configuration for ' + name + ' is updated', function() {
        var source = this[name];
        // map the bower resolved package to be within vendor/
        var pathname = source.replace(/^components/, 'vendor').replace(path.extname(source), '');

        // assert string against lines, to gain diff output
        var pathline = this.main.split('\n').filter(function(line) {
          return line.indexOf(name + ':') !== -1;
        })[0];

        var pattern = name + ": '" + pathname + "',";
        assert.equal(pathline.trim(), pattern);
      });
    });
  });
  /* */

});
