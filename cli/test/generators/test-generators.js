
var events = require('events'),
  assert = require('assert'),
  yeoman = require('../../');

describe('Generators', function() {

  describe('yeoman.generators', function() {
    it('should have a Base object to extend from', function() {
      assert.ok(yeoman.generators.Base);
    });

    it('should have a NamedBase object to extend from', function() {
      assert.ok(yeoman.generators.NamedBase);
    });
  });

  describe('yeoman.generators.Base', function() {
    before(function() {
      this.generator = new yeoman.generators.Base();
    });

    it('should be an EventEmitter', function(done) {
      assert.ok(this.generator instanceof events.EventEmitter);
      assert.ok(typeof this.generator.on === 'function');
      assert.ok(typeof this.generator.emit === 'function');
      this.generator.on('yay-o-man', done);
      this.generator.emit('yay-o-man');
    });
  });

  describe('yeoman.generators.NamedBase', function() {
    before(function() {
      this.generator = new yeoman.generators.NamedBase(['namedArg']);
    });

    it('should be a Base generator', function() {
      assert.ok(this.generator instanceof yeoman.generators.Base);
    });

    it('and it should have a name property', function() {
      assert.equal(this.generator.name, 'namedArg');
    });
  });

  describe('yeoman.generators.prepare', function() {
    it('should parse out grunt.cli for arguments and options');
    it('should setup the invoked generator name from arguments');
    it('should setup the hash options from grunt.cli.options');
    it('should prefix each positional arguments with `init:`');
    it('and turn off the internal grunt help output');
  });

  describe('yeoman.generators.init', function() {
    it('should setup the current working directory property');
    it('should find Gruntfile throughout the file tree');
    it('should setup the base property and cd into that directory');
    it('should try to locate installed yeoman plugins');
    it('should ouptut help when no generator name is given');
  });

  describe('yeoman.generators.help', function() {
    it('should output according help / usage');
  });

});
