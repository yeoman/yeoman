/*global describe, before, after, beforeEach, afterEach, describe, it */
var helpers = require('./helpers');
var grunt   = require('grunt');
var assert  = require('assert');
var fs      = require('fs');

describe('yeoman server', function() {
  before(helpers.directory('.test'));

  describe('When I run the app server with a customized task', function () {
    var options = {
      server: {
        tasks: {
          app: 'testTask'
        }
      }
    };
    var tasks = {
      'testTask': function () {
        grunt.file.write('test_task/test.js', '"testing custom task"');
      }
    };

    before(helpers.gruntfile(options, tasks));

    before(function(done) {
       this.yeoman = helpers.run('server:app --no-color', {redirect: true})
        .expect(0)
        .end(done);
    });

    it('should generate a testTask directory', function(done) {
      fs.stat('test_task/', done);
    });

    it('should generate a test.js file', function(done) {
      fs.stat('test_task/test.js', done);
    });

    it('should write the content from the task to the test file', function() {
      assert.equal(grunt.file.read('test_task/test.js'), '"testing custom task"');
    });
  });
});
