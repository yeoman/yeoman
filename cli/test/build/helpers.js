
var fs = require('fs'),
  path = require('path'),
  spawn = require('child_process').spawn,
  rimraf = require('rimraf'),
  mkdirp = require('mkdirp'),
  Runnable = require('./runnable');

// top level exports
var helpers = module.exports;

// path to the yeoman bin entry point
var yeomanpath = path.join(__dirname, '../../bin/yeoman');

// specific flag to ensure we bypass insight prompt, even when these
// tests are not run within an npm scripts (eg direct use of mocha)
var env = process.env;
env.yeoman_test = true;

// Top level helper for running specific command on the yeoman cli. Returns a
// Runnable object with API for asserting stdout output, entering prompts and
// so on.
//
// - cmds     - A String specifying the list of command to run
//
// Example:
//
//    var yeoman = helpers.run('init --force');
//
//    yeoman.
//
// Returns a new Runnable object.
helpers.run = function run(cmds) {
  return new Runnable([process.execPath, yeomanpath, cmds].join(' '));
};

// Removes, creates and cd into the specified directory. If the current working
// directory is the same as the specified one, then acts as a noop. Meant to be
// used once per mocha suite.
//
// - dir   - the directory path to create
//
// Example:
//
//     before(helpers.directory('.test'));
//
// Returns a function suitable to use with mocha's before/after hooks.
helpers.directory = function directory(dir) {
  return function directory(done) {
    var cwd = process.cwd(),
      dirname = path.basename(cwd);

    if(dirname === dir) return done();

    rimraf(dir, function(err) {
      if(err) return done(err);
      mkdirp(dir, function(err) {
        if(err) return done(err);
        process.chdir(dir);
        done();
      });
    });
  };
};


// Meant to be used with mocha handlers like before / beforeEach, etc. Creates
// and manage a yeoman child process, providing the child instance in the mocha
// context as `self.child`, collecting output for both stdout / stderr as
// `self.stdout` and `self.stderr`
//
// - cmds     - A String specifying the list of command to run
// - takeOver - (Optional) A Boolean that when set to true will create the
//              child and forget, allowing user to interract with the child
//              instance (collecting output, writing to stding, listening to
//              exit)
//
// Example:
//
//    before(helpers.yeoman('foo'));
//
//    describe('when I run foo', function() {
//      it('should run foo and expose child process and stdout / stderr output', function() {
//        console.log(this.stdout);
//        console.log(this.stderr);
//
//      });
//    });
//
//
// Returns a function suitable to use with mocha hooks.
helpers.yeoman = function (cmds, takeOver) {
  var args = [yeomanpath].concat(cmds.split(' ')),
    options = { env: env };

  if(takeOver) return spawn(process.execPath, args, options);

  return function yeoman(done) {
    // yeoman child process
    var child = this.child = spawn(process.execPath, args, options);
    var out = this.stdout = '';
    var err = this.stderr = '';
    child.stdout.on('data', function(chunk) {
      out += chunk;
    });
    child.stderr.on('data', function(chunk) {
      err += chunk;
    });
    child.on('end', done);
  };
};

// Generates a new Gruntfile.js in the current working directory based on
// `options` hash passed in. Same as other helpers, meant to be use as a mocha handler.
//
// - options  - Grunt configuration
//
// Example
//
//    before(helpers.gruntfile({
//      foo: {
//        bar: '<config.baz>'
//      }
//    }));
//
// Returns a function suitable to use with mocha hooks.
helpers.gruntfile = function(options) {
  return function gruntfile(done) {
    var config = 'grunt.initConfig(' + JSON.stringify(options, null, 2) + ');'
    config = config.split('\n').map(function(line) {
      return '  ' + line;
    }).join('\n');

    var out = [
      'module.exports = function(grunt) {',
      config,
      '};'
    ];

    fs.writeFile('Gruntfile.js', out.join('\n'), done);
  };
};

