/*global describe, before, after, beforeEach, afterEach, describe, it */
var fs      = require('fs');
var path    = require('path');
var grunt   = require('grunt');
var assert  = require('assert');
var helpers = require('./helpers');
var usemin = require('../tasks/usemin.js');

var opts = grunt.cli.options;
opts.redirect = !opts.silent;

// XXX Conform to coding guidelines, mostly literral spacing stuff
describe('usemin', function() {
  before(helpers.directory('.test'));
  describe('replace helper', function() {
    it("should take into account path", function() {
      usemin.call(grunt,grunt);

      // Let's prepare our context: in index.html we do have references 
      // to images/test.png and images/misc/test.png.
      // Usemin's replace is supposed to change this by files
      // found on the filesystem matching the same path, but
      // potentially prefixed
      // e.g images/test.pmg -> images/misc/23012.test.png
      grunt.file.mkdir('images');
      grunt.file.mkdir('images/misc');
      grunt.file.write('images/23012.test.png', "foo");
      grunt.file.write('images/misc/2a436.test.png', "foo");

      // Let's avoid cluttering the output
      grunt.log.muted = true;
      var content = grunt.file.read(path.join(__dirname,"fixtures/usemin.html"));
      var changed = grunt.helper('replace',content, /<img[^\>]+src=['"]([^"']+)["']/gm);

      // Check replace has performed its duty
      assert.ok( changed.match(/img[^\>]+src=['"]images\/23012\.test\.png["']/) );
      assert.ok( changed.match(/img[^\>]+src=['"]images\/misc\/2a436\.test\.png["']/) );
    });
  });
});

