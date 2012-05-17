var fs = require('fs'),
  path = require('path'),
  fork = require('child_process').fork,
  assert = require('assert'),
  rimraf = require('rimraf'),
  mkdirp = require('mkdirp'),
  ncp = require('ncp').ncp,
  EventEmitter = require('events').EventEmitter;

//
// Grunt runner helper. A stack of command is built when called, to finally run
// them sequentially on the next event loop.
//
// Depending on grunt's exit code, the test fails or pass.
//
var helpers = module.exports = function grunt(base, em) {
  if(!em) em = base, base = '';
  base = base || 'test/h5bp';
  em = em || (new EventEmitter);

  return function(cmd) {
    var stack = grunt.stack || (grunt.stack = []);
    stack.push(cmd);

    process.nextTick(function() {
      if(grunt.started) return;
      grunt.started = true;

      // path to the grunt executable, going to node dependency but could be done
      // with the global grunt instead
      var gruntpath = path.resolve('node_modules/grunt/bin/grunt');

      // now that the stack is setup, run each command serially
      (function run(cmd) {
        if(!cmd) return em.emit('end');
        cmd = Array.isArray(cmd) ? cmd : cmd.split(' ');

        // grunt process - maybe fork would avoid the exec use for this to work on windows, I dunno
        console.log('running in ', path.resolve(base));
        console.log(' » grunt ' + cmd);
        console.log();

        // we want $PATH in forked process environment for
        // which package to work appropriately when run via
        // npm test
        var env = { PATH: process.env.PATH };

        // run grunt via child_process.fork, setting up cwd to test dir and
        // necessary environment variables.
        var gpr = fork(gruntpath, cmd, { cwd: path.resolve(base), env: env });
        gpr.on('exit', function(code, stdout, stderr) {
          assert.equal(code, 0, ' ✗ Grunt exited with errors. Code: ' + code);
          em.emit(cmd, code, stdout, stdout);
          run(stack.shift());
        });
      })(stack.shift());
    });
  }
};

//
// **setup** tests. Meant to be called before running individual tests.
// Not automated, must be called explicitely. Equivalent of npm's pretest script.
//
//    rm -rf .test
//    mkdir .test
//    cp -r test/h5bp/* test/h5bp/.htaccess test/fixtures/grunt.js .test/
//
// ncp doesn't have a sync api -> async process.
helpers.setup = function setup(o, cb) {
  if(!cb) cb = o, o = {};

  // test dir, $pkgroot/.test
  var dest = o.base || o.dest || path.join(__dirname, '../../.test');

  // source dir, test/h5bp submodule
  var source = o.source || path.join(__dirname, '../h5bp');

  // test gruntfile
  var gruntfile = o.gruntfile || o.grunt || path.join(__dirname, '../fixtures/default/grunt.js');

  // ignore handler
  var ignore = o.ignore || function ignore(name) {
    return path.basename(name) !== '.git';
  };

  // rm -rf .test
  rimraf(dest, function(err) {
    if(err) return cb(err);

    // && mkdirp ./test
    mkdirp(dest, function(err) {
      if(err) return cb(err);

      // cp -r test/h5bp/* test/fixtures/grunt.js .test/
      ncp(source, dest, { filter: ignore }, function(err) {
        if(err) return cb(err);

        // specific copy of test/fixtures/grunt.js
        var ws = fs.createWriteStream(path.join(dest, 'grunt.js')).on('close', cb);
        fs.createReadStream(gruntfile).pipe(ws);
      });
    });
  });
};


//
// **copy** helper, creates a new ReadStream, connects to WriteStream destination,
// call the callback on completion. sources can be a single or an Array of source files,
// destination is the destination directory.
//
helpers.copy = function(sources, destination, cb) {
  sources = Array.isArray(sources) ? sources : sources.split(' ');
  sources = sources.map(function(file) {
    return path.resolve('test/fixtures', file);
  });

  var ln = sources.length;
  if(!ln) return cb(new Error('Sources array is empty'));

  // if we get a single file to copy and destination is not a dir
  // direct file copy
  if(ln === 1 && path.extname(destination)) {
    return fs.createReadStream(sources[0])
      .pipe(fs.createWriteStream(destination).on('close', cb));
  }

  sources.forEach(function(src) {
    var to = path.join(destination, path.basename(src)),
      rs = fs.createReadStream(src),
      ws = fs.createWriteStream(to).on('close', function() {
        if(--ln) return;
        cb();
      });

    rs.pipe(ws);
  });
};
