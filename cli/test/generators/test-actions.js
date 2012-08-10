
var fs = require('fs'),
  path = require('path'),
  util = require('util'),
  events = require('events'),
  rimraf = require('rimraf'),
  assert = require('assert'),
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

    this.dummy = new Dummy;
    this.Dummy = Dummy;
  });

  // Initialize task system so that the helpers can be used.
  before(function() {
    grunt.task.init([]);
  });

  // cleaup the test dir
  before(function(done) {
    process.chdir(path.join(__dirname, '../../'));
    rimraf('.test', done);
  });

  describe('grunt.file API', function() {
    it('should be available in the generator API', function() {
      var methods = Object.keys(grunt.file);
      methods.forEach(function(method) {
        assert.equal(typeof this.dummy[method], typeof grunt.file[method]);
      }, this);
    });
  });

  describe('grunt.log API', function() {
    it('should be available in the generator API through this.log property', function() {
      var methods = Object.keys(grunt.log);
      methods.forEach(function(method) {
        assert.equal(typeof this.dummy.log[method], typeof grunt.log[method]);
      }, this);
    });
  });

  describe('generator.helper(name, args)', function() {
    it('should be a 1:1 mapping with grunt.helper()', function() {
      assert.equal(grunt.helper, this.dummy.helper);
    });
  });

  describe('generator.prompt(defaults, prompts, cb)', function() {
    it('should be a 1:1 mapping with grunt.helper("prompts", ...)', function(done) {
      this.dummy.prompt([], done);
    });
  });

  describe('generator.promptForObj()', function() {
    it('should be a 1:1 mapping with grunt.helper("prompt_for_obj")', function() {
      var obj = this.dummy.promptForObj();

      // expected props
      var props = [
        'name',
        'title',
        'description',
        'version',
        'repository',
        'homepage',
        'bugs',
        'licenses',
        'author_name',
        'author_email',
        'author_url',
        'jquery_version',
        'node_version',
        'main',
        'bin',
        'npm_test',
        'grunt_version'
      ];

      props.forEach(function(prop) {
        var prompt = obj[prop];
        assert.ok(prompt);
        assert.ok(prompt.message, 'Undfined message for ' + prop);
        assert.ok(prompt['default'], 'Undfined default for ' + prop);
      });
    });
  });

  describe('generator.promptFor(name, default)', function() {
    it('should be a 1:1 mapping with grunt.helper("prompt_for", ...)', function() {
      var obj = this.dummy.promptFor('name');
      assert.equal(obj.message, 'Project name');

      obj = this.dummy.promptFor('name', {
        message: 'Enter a project name'
      });

      assert.equal(obj.altDefault.message, 'Enter a project name');
    });
  });

  describe('generator.sourceRoot(root)', function() {
    it('should update the "_sourceRoot" property when root is given', function() {
      this.dummy.sourceRoot('./test/generators/fixtures');
      assert.equal(this.dummy._sourceRoot, path.resolve('./test/generators/fixtures'));
    });

    it('should return the uddated or current value of "_sourceRoot"', function() {
      assert.equal(this.dummy.sourceRoot(), path.resolve('./test/generators/fixtures'));
    });
  });

  describe('generator.destinationRoot(root)', function() {
    it('should update the "_destinationRoot" property when root is given', function() {
      this.dummy.destinationRoot('.test');
      assert.equal(this.dummy._destinationRoot, process.cwd());
    });

    it('should return the uddated or current value of "_destinationRoot"', function() {
      assert.equal(this.dummy.destinationRoot(), process.cwd());
    });
  });

  describe('generator.copy(source, destination, options)', function() {
    it('should copy source files relative to the "sourceRoot" value', function(done) {
      this.dummy.copy('foo.js', 'write/to/foo.js');
      fs.stat('write/to/foo.js', done);
    });

    it('should allow absolute path, and prevent the relative paths join', function(done) {
      this.dummy.copy(path.join(__dirname, 'fixtures/foo.js'), 'write/to/bar.js');
      fs.stat('write/to/bar.js', done);
    });
  });

  describe('generator.read(filepath, encoding)', function() {
    it('should read files relative to the "sourceRoot" value', function() {
      var body = this.dummy.read('foo.js');
      assert.equal(body, 'var foo = \'foo\';\n');
    });
    it('should allow absolute path, and prevent the relative paths join', function() {
      var body = this.dummy.read(path.join(__dirname, 'fixtures/foo.js'));
      assert.equal(body, 'var foo = \'foo\';\n');
    });
  });

  describe('generator.write(filepath, content)', function() {
    it('should write the specified files relative to the "destinationRoot" value', function(done) {
      var body = 'var bar = \'bar\';\n';
      this.dummy.write('write/to/bar.js', body);
      fs.readFile('write/to/bar.js', 'utf8', function(err, actual) {
        if(err) return done(err);
        assert.ok(actual, body);
        done();
      });
    });
  });

  describe('generator.template(source, destination, data)', function() {

    before(function() {
      this.dummy.foo = 'fooooooo';
    });

    it('should copy and process source file to destination', function(done) {
      this.dummy.template('foo-template.js', 'write/to/from-template.js');
      fs.stat('write/to/from-template.js', done);
    });

    it('should defaults the destination to the source filepath value, relative to "destinationRoot" value', function() {
      this.dummy.template('foo-template.js');
      var body = fs.readFileSync('foo-template.js', 'utf8');
      assert.equal(body, 'var fooooooo = \'fooooooo\';\n');
    });

    it('should process underscore templates with the passed-in data', function() {
      this.dummy.template('foo-template.js', 'write/to/from-template.js', {
        foo: 'bar'
      });
      var body = fs.readFileSync('write/to/from-template.js', 'utf8');
      assert.equal(body, 'var bar = \'bar\';\n');
    });

    it('should process underscore templates with the actual generator instance, when no data is given', function() {
      this.dummy.template('foo-template.js', 'write/to/from-template.js');
      var body = fs.readFileSync('write/to/from-template.js', 'utf8');
      assert.equal(body, 'var fooooooo = \'fooooooo\';\n');
    });
  });

  describe('generator.directory(source, destination)', function() {

    it('should copy and process source files to destination', function(done) {
      this.dummy.directory('./', 'directory');
      fs.stat('directory/foo-template.js', function(err) {
        if(err) return done(err);
        fs.stat('directory/foo.js', done);
      });
    });

    it('should defaults the destination to the source filepath value, relative to "destinationRoot" value', function(done) {
      this.dummy.directory('./');
      fs.stat('foo-template.js', function(err) {
        if(err) return done(err);
        fs.stat('foo.js', done);
      });
    });


    it('should process underscore templates with the actual generator instance', function() {
      var body = fs.readFileSync('directory/foo-template.js', 'utf8');
      var foo = this.dummy.foo;
      assert.equal(body, 'var ' + foo + ' = \'' + foo + '\';\n');
    });
  });

});
