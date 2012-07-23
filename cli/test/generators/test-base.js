
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

  describe('generator.run(args, cb)', function() {
    it('should run all methods in the given generator', function() {
      this.dummy.run();
    });

    it('should have the _running flag turned on', function() {
      assert.ok(this.dummy._running);
    });
  });

  describe('generator.runHooks(cb)', function() {
    it('should go through all registered hooks, and invoke them in series');
  });

  describe('generator.argument(name, config)', function() {
    it('should add a new argument to the generator instance');
    it('should create the property specified with value from positional args');
    it('should slice positional arguments when config.type is Array');
  });

  describe('generator.option(name, config)', function() {
    it('should add a new option to the set of generator expected options');
  });

  describe('generator.hookFor(name, config)', function() {
    it('should emit errors if called when running');
    it('should create the macthing option');
    it('should update the internal hooks holder');
  });

  describe('generator.defaultFor(config)', function() {
    it('should return the corresponding banner for each supported type');
  });

  describe('generator.desc(decription)', function() {
    it('should update the internal description');
  });

  describe('generator.help()', function() {
    it('should return the expected help / usage output');
  });

  describe('generator.usage()', function() {
    it('should return the expected help / usage output');
  });

  describe('generator.optionsHelp()', function() {
    it('should return the expected help / usage output');
  });

});
