
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

  describe('grunt.file API', function() {
    it('should be available in the generator API');
  });

  describe('grunt.log API', function() {
    it('should be available in the generator API through this.log property');
  });

  describe('generator.helper(name, args)', function() {
    it('should be a 1:1 mapping with grunt.helper()');
  });

  describe('generator.prompt(defaults, prompts, cb)', function() {
    it('should be a 1:1 mapping with grunt.helper("prompts", ...)');
  });

  describe('generator.promptForObj()', function() {
    it('should be a 1:1 mapping with grunt.helper("prompt_for_obj")');
  });

  describe('generator.promptFor(name, default)', function() {
    it('should be a 1:1 mapping with grunt.helper("prompt_for", ...)');
  });

  describe('generator.sourceRoot(root)', function() {
    it('should update the "_sourceRoot" property when root is given');
    it('should return the uddated or current value of "_sourceRoot"');
  });

  describe('generator.destinationRoot(root)', function() {
    it('should update the "_destinationRoot" property when root is given');
    it('should return the uddated or current value of "_destinationRoot"');
  });

  describe('generator.copy(source, destination, options)', function() {
    it('should copy source files relative to the "sourceRoot" value');
    it('should allow absolute path, and prevent the relative paths join');
  });

  describe('generator.read(filepath, encoding)', function() {
    it('should read files relative to the "sourceRoot" value');
    it('should allow absolute path, and prevent the relative paths join');
  });

  describe('generator.write(filepath, content)', function() {
    it('should write the specified files relative to the "destinationRoot" value');
  });

  describe('generator.template(source, destination, data)', function() {
    it('should copy and process source file to destination');
    it('should defaults the destination to the source filepath value, relative to "destinationRoot" value');
    it('should process underscore templates with the passed-in data');
    it('should process underscore templates with the actual generator instance, when no data is given');
  });

  describe('generator.directory(source, destination)', function() {
    it('should copy and process source files to destination');
    it('should defaults the destination to the source filepath value, relative to "destinationRoot" value');
    it('should process underscore templates with the actual generator instance');
  });

});
