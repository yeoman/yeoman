
var fs = require('fs'),
  path = require('path'),
  util = require('util'),
  events = require('events'),
  assert = require('assert'),
  rimraf = require('rimraf'),
  mkdirp = require('mkdirp'),
  yeoman = require('../../'),
  grunt = require('grunt');

describe('yeoman.generators.Base', function() {

  before(function() {
    function Dummy() {
      yeoman.generators.Base.apply(this, arguments);
    }

    util.inherits(Dummy, yeoman.generators.Base);

    Dummy.prototype.test = function () {
      this.shouldRun = true;
    };

    this.dummy = new Dummy(['bar', 'baz', 'bom'], {
      foo: true,
      something: 'else'
    });
    this.Dummy = Dummy;

    // actual generator
    this.generator = yeoman.generators.setup(grunt)
        .create('app', [], {}, {});
  });

  // cleaup the test dir, and cd into it
  before(function(done) {
    process.chdir(path.join(__dirname, '../../'));
    rimraf('.test', function(err) {
      if(err) return done(err);
      mkdirp('.test', function() {
        if(err) return done(err);
        process.chdir('.test');
        done();
      });
    });
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
    it('should go through all registered hooks, and invoke them in series', function(done) {
      this.generator.runHooks(function(err) {
        if(err) return err;
        fs.stat('app/css/sass', function(err) {
          if(err) return done(err);
          fs.stat('test/index.html', done);
        });
      });
    });
  });

  describe('generator.argument(name, config)', function() {
    it('should add a new argument to the generator instance', function() {
      assert.equal(this.dummy._arguments.length, 0);
      this.dummy.argument('foo');
      assert.equal(this.dummy._arguments.length, 1);
    });

    it('should create the property specified with value from positional args', function() {
      assert.equal(this.dummy.foo, 'bar');
    });

    it('should slice positional arguments when config.type is Array', function() {
      this.dummy.argument('bar', {
        type: Array
      });

      assert.deepEqual(this.dummy.bar, ['baz', 'bom']);
    });
  });

  describe('generator.option(name, config)', function() {
    it('should add a new option to the set of generator expected options', function() {
      // every generator have the --help options
      assert.equal(this.dummy._options.length, 1);
      this.dummy.option('foo');
      assert.equal(this.dummy._options.length, 2);
      assert.deepEqual(this.dummy._options.pop(), {
        desc: 'Description for foo',
        name: 'foo',
        type: Boolean,
        defaults: false,
        hide: false
      });
    });
  });

  describe('generator.hookFor(name, config)', function() {
    it('should emit errors if called when running', function() {
      try {
        this.dummy.hookFor('maoow');
      } catch(e) {
        assert.equal(e.message, 'hookFor must be used within the constructor only');
      }
    });

    it('should create the macthing option', function() {
      this.dummy._running = false;
      this.dummy.hookFor('something');
      assert.deepEqual(this.dummy._options.pop(), {
        desc: 'Something to be invoked',
        name: 'something',
        type: Boolean,
        defaults: 'else',
        hide: false
      });
    });

    it('should update the internal hooks holder', function() {
      assert.deepEqual(this.dummy._hooks.pop(), {
        name: 'something'
      });
    });
  });

  describe('generator.defaultFor(config)', function() {
    it('should return the value for the option name, doing lookup in options and Grunt config', function() {
      var name = this.dummy.defaultFor('something');
      assert.equal(name, 'else');
    });
  });

  describe('generator.desc(decription)', function() {
    it('should update the internal description', function() {
      this.dummy.desc('A new desc for this generator');
      assert.equal(this.dummy.description, 'A new desc for this generator');
    });
  });

  describe('generator.help()', function() {
    it('should return the expected help / usage output', function() {
      this.dummy.option('ooOoo');
      var help = this.dummy.help();

      assert.ok(help.match('Usage:'));
      assert.ok(help.match('yeoman init FOO one two three \\[options\\]'));
      assert.ok(help.match('A new desc for this generator'));
      assert.ok(help.match('Options:'));
      assert.ok(help.match('  -h, --help   # Print generator\'s options and usage'));
      assert.ok(help.match('      --ooOoo  # Description for ooOoo'));
    });
  });

  describe('generator.usage()', function() {
    it('should return the expected help / usage output', function() {
      var usage = this.dummy.usage();
      assert.equal(usage, 'yeoman init FOO one two three [options]\n\nA new desc for this generator');
    });
  });

  describe('generator.optionsHelp()', function() {
    it('should return the expected help / usage output', function() {
      var help = this.dummy.optionsHelp();
      assert.equal(help, [
        '  -h, --help   # Print generator\'s options and usage  ',
        '               # Default: false',
        '      --ooOoo  # Description for ooOoo                ',
        '               # Default: false'
      ].join('\n'));
    });
  });
});
