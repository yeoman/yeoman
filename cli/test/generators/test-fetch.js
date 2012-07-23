
var util = require('util'),
  events = require('events'),
  assert = require('assert'),
  yeoman = require('../../');

describe('yeoman.generators.Base', function() {

  before(function() {
    function Dummy() {
      yeoman.generators.Base.apply(this, arguments);
    }

    util.inherits(Dummy, yeoman.generators.Base);

    Dummy.prototype.test = function () {
      this.shouldRun = true;
    };

    this.dummy = new Dummy;
    this.Dummy = Dummy;
  });

  describe('generator.tarball(tarball, destination, cb)', function() {
    it('should allow the fecthing / untar of a given tarball, at the given location');
  });

  describe('generator.fetch(url, destination, cb)', function() {
    it('should allow the fething of a single file');
    it('should write at the specified location');
  });

  describe('generator.remote(user, repo, branch, cb)', function() {
    it('should remotely fetch a package on github');
    it('should have the result cached internally into a `_cache` folder');
    it('should invoke `cb` with a remote object to interract with the downloaded package');

    describe('remote.copy(source, destination, options)', function() {
      it('should copy a given file from package at the given destination');
    });

    describe('remote.template(source, destination, data)', function() {
      it('should copy and process a given template file from package at the given destination');
    });

    describe('remote.directory(source, destination, options)', function() {
      it('should recursively process and copy source directory from downloaded package');
      it('should write files at the given destination');
    });

  });

});
