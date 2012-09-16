
var fs       = require('fs');
var path     = require('path');
var spawn    = require('child_process').spawn;
var rimraf   = require('rimraf');
var mkdirp   = require('mkdirp');
var which    = require('which');
var Runnable = require('./runnable');

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
//    yeoman.prompt(/Woud you like/, 'Y');
//    yeoman.end(done);
//
// Returns a new Runnable object.
helpers.run = function run(cmds, opts) {
  return new Runnable([process.execPath, yeomanpath, cmds].join(' '), opts);
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
    process.chdir(path.join(__dirname, '../..'));
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
//      before(helpers.yeoman('foo'));
//
//      describe('when I run foo', function() {
//        it('should run foo and expose child process and stdout / stderr output', function() {
//          console.log(this.stdout);
//          console.log(this.stderr);
//
//        });
//      });
//
//
// Returns a function suitable to use with mocha hooks.
helpers.yeoman = function (cmds, takeOver) {
  var args = [yeomanpath].concat(cmds.split(' ')),
    options = { env: env };

  if(takeOver) return spawn(process.execPath, args, options);

  return function yeoman(done) {
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
    var config = 'grunt.initConfig(' + JSON.stringify(options, null, 2) + ');';
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


// Mocha before helper. Takes a command String to be checked against `which`
// package, and a callback to call on completion, most likely the mocha async
// `done` callback.
//
// Setups the relevant Boolean flag on the test context.
//
helpers.installed = function installed(command, cb) {
  return function installed(done) {
    var ctx = this;
    which(command, function(err) {
      ctx[command] = !err;
      done();
    });
  };
};
