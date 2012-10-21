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
  describe('usemin:css', function() {
    it("should replace a block with link on furnished target", function() {
      grunt.log.muted = true;
      var block = "   foo\nbar\nbaz";
      var content = "before block\n" + block + "\nafter block";
      var awaited = "before block\n   <link rel=\"stylesheet\" href=\"foo\"/>\nafter block";
      var changed = grunt.helper('usemin:css', content, block, 'foo');
      assert.ok( changed == awaited );
    });
  });

  describe('usemin:post:html', function() {
    before(function() {
      usemin.call(grunt,grunt);
      grunt.log.muted = true;
      grunt.file.mkdir('images');
      grunt.file.mkdir('css');
    });
  
    it('should skip external file', function() {
      grunt.file.write('images/23012.foo.png', "foo");
      var content = '<img src="//css/main.css">';
      var awaited = '<img src="//css/main.css">';
      var changed = grunt.helper('usemin:post:html', content);
      assert.ok( changed == awaited );

    });

    it('do not depend on tag position', function() {
      grunt.file.write('css/23012.main.css', "foo");
      var content = '<link href="css/main.css" rel="stylesheet"/><link rel="stylesheet" href="css/main.css"/>';
      var awaited = '<link href="css/23012.main.css" rel="stylesheet"/><link rel="stylesheet" href="css/23012.main.css"/>';
      var changed = grunt.helper('usemin:post:html', content);
      assert.ok( changed == awaited );
    });

    it('should treat files referenced from site root', function() {
      grunt.file.write('images/23012.foo.png', "foo");
      var content = '<img src="/images/foo.png">';
      var awaited = '<img src="/images/23012.foo.png">';
      var changed = grunt.helper('usemin:post:html', content);
      assert.ok( changed == awaited );
    });

    it('should also replace local reference in anchors', function() {
      grunt.file.write('images/23012.foo.png', "foo");
      var content = '<a href="http://foo/bar"></a><a href="ftp://bar"></a><a href="images/foo.png"></a><a href="/images/foo.png"></a><a href="#local"></a>';
      var awaited = '<a href="http://foo/bar"></a><a href="ftp://bar"></a><a href="images/23012.foo.png"></a><a href="/images/23012.foo.png"></a><a href="#local"></a>';
      var changed = grunt.helper('usemin:post:html', content);
      assert.ok( changed == awaited );
    });

    it('should handle properly the case of the root path (/)', function() {
      var content = '<a href="/">'
      var awaited = '<a href="/">';
      var changed = grunt.helper('usemin:post:html', content);
      assert.ok( changed == awaited );
    });
  });
  describe('usemin-handler', function() {
    it("should treat local references", function() {
      grunt.log.muted = true;
      usemin.call(grunt, grunt);
      helpers.gruntfile({'usemin-handler': {
        html: 'index.html'}
      });
      grunt.config.init();
      grunt.config('usemin-handler', {html: "index.html"});
      grunt.file.copy(path.join(__dirname,"fixtures/usemin.html"), "index.html");
      grunt.task.run('usemin-handler:html');
      grunt.task.start();
      // Grunt config related to concat should have been changed
      var concat_config = grunt.config('concat');
      // Actually the fixture index.html requires to concat stuff in '/scripts/plugins.js' ...
      // As this references a local file, the concat config should have a key named
      // 'scripts/plugins.js' (i.e. *without* the leading /)
      assert.ok('scripts/plugins.js' in concat_config);
    })
  });
});

