var fs = require('fs'),
  path = require('path'),
  spawn = require('child_process').spawn,
  assert = require('assert'),
  rimraf = require('rimraf'),
  mkdirp = require('mkdirp'),
  ncp = require('ncp').ncp,
  EventEmitter = require('events').EventEmitter;

// helpers exports
var helpers = module.exports;

// wheter we redirect stdout/stderr output or not
var silent = /silent/.test(process.argv.slice(-1)[0]);

// path to the grunt executable (test always run from cli root dir)
var gruntpath = path.resolve('node_modules/grunt/bin/grunt');

// path to our binary script, untill we have a programmatic API, this is
// triggered using a spawned process
var yeopath = path.join(__dirname, '../../bin/yeoman');

// mocha `before()` handler, to execute on each task test
helpers.before = function(cb) {

  // this setup the .test/ directory, by triggering the init task in it and
  // then copying a few specific fixtures files in there (like imgs to test out
  // the imgs tasks)
  helpers.setup(function(err) {
    if(err) return cb(err);

    var imgs = ['default/1.png', 'default/2.png', 'default/3.png', 'default/4.png', 'default/5.jpg', 'default/6.jpg'];

    // img to copy
    helpers.copy(['default/usemin.html', 'default/index.html'], '.test', function(err) {
      if(err) return cb(err);
      helpers.copy(imgs, '.test/img', cb);
    });
  });
};

//
// A simple wrapper to the grunt executable. Each tests spawns a new grunt process.
//
// Depending on grunt's exit code, the test fails or pass.
//
// if `--silent` is turned on, the spawned grunt process stdout/stderr is
// redirected back to the current one.
//
// Ex:
//
//    mocha test/tasks/*.js --silent
//    # includes only mocha specified reporter output
//
//    mocha test/tasks/*.js
//    # will include both mocha and grunt output
//
helpers.run = function(cmd, options, cb) {
  if(!cb) { cb = options; options = {}; }

  // cmd can be either an array of a string
  cmd = Array.isArray(cmd) ? cmd : cmd.split(' ');

  // some info when logging everything
  if(!silent) console.log([
    '', '', '',
    '... Running in ' + path.resolve(options.base) + ' ...',
    '... » grunt ' + cmd.join(' ') + ' ...',
    '', '', ''
  ].join('\n'));

  // trigger the process, calling cb on completion
  options.tasks = cmd;
  return helpers.spawn(options, cb);
};


//
// **spawn** little wrapper to node's child_process spawn. This redirects back
// the stdout/stderr output of the child_process only if `--silent` is turned off.
//
// If the process exits with anything else than 0 (grunt properly exists with
// errors codes on task errors), the tests failed and the process exists
// immediately.
//
// The default script is the yeoman binary, but setting options.bin to `gruntpath`
// will use the build-in grunt executable in our node_modules
//
helpers.spawn = function(options, cb) {
  options = options || {};
  // some defaults
  options.cmd = options.cmd || 'node';
  options.base = path.resolve(options.base || '.test');
  options.bin = options.bin || yeopath;
  options.args = options.args || options.tasks || [];

  // we want $PATH in forked process environment for the which package to
  // work appropriately when run via npm test
  var env = { PATH: process.env.PATH };

  var child = spawn(options.cmd, [options.bin].concat(options.args), { cwd: options.base, env: env });
  if(!silent) child.stderr.pipe(process.stderr);
  if(!silent) child.stdout.pipe(process.stdout);
  child.on('exit', function(code, stdout, stderr) {
    if(code) {
      assert.equal(code, 0, ' ✗ Exited with errors. Code: ' + code);
      process.exit(code);
    }

    if(!silent) console.log([
      '', '', '',
      '... Done, without errors.',
      '... ✔ ' + [options.bin].concat(options.args).join(' ') + ' ...',
      '', '', ''
    ].join('\n'));
    cb();
  });


  return child;
};

//
// **setup** tests. Meant to be called before running individual tests.
// Not automated, must be called explicitely. Usually done in a mocha `before`
// handler (helpers.before does exactly that). Equivalent of running:
//
//    rm -rf .test
//    mkdir .test
//    yeoman init --template default
//
// If an hash object of options is passed in as first arg, with a nocopy prop
// then the h5bp project copy is prevented (mostly useful with the init task test)
//
// XXX do copy with fstream
//
helpers.setup = function setup(o, cb) {
  if(!cb) { cb = o; o = {}; }

  // test dir, $pkgroot/.test
  var dest = o.base || o.dest || path.join(__dirname, '../../.test');

  // rm -rf .test
  rimraf(dest, function(err) {
    if(err) return cb(err);

    // && mkdirp ./test
    mkdirp(dest, function(err) {
      helpers.run('init --noprompt', cb);
    });
  });
};


//
// **copy** helper, creates a new ReadStream, connects to WriteStream destination,
// call the callback on completion. sources can be a single or an Array of source files,
// destination is the destination directory.
//
// Single file copy helper, meant to be used by tests and beforeTest handler to
// copy specific files from fixtures to the .test directory
//
// Source are always resolved with test/fixtures
//
// Typical use is as follow:
//
//     helpers.copy(['default/usemin.html', 'default/index.html'], '.test', function(err) {
//       if(err) return done(err);
//       helpers.copy(imgs, '.test/img', done);
//     });
//
//
// XXX support glob patterns, either by using isaac's glob or using grunt api
// here.
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
    return mkdirp(path.dirname(destination), function(err) {
      if(err) return cb(err);
      fs.createReadStream(sources[0])
        .pipe(fs.createWriteStream(destination).on('close', cb));
    });
  }

  sources.forEach(function(src) {
    var to = path.join(destination, path.basename(src));

    mkdirp(path.dirname(to), function(err) {
      if(err) return cb(err);
      var rs = fs.createReadStream(src),
        ws = fs.createWriteStream(to);

      ws.on('close', function() {
        if(--ln) return;
        cb();
      });

      rs.pipe(ws);
    });
  });
};

// assertion helper to compare files, output.
helpers.assertFile = function(actual, expected, mode) {
  // unless mode is specifically set to null, defaults to utf8
  mode = mode || 'utf8';
  var actualBody = fs.readFileSync(actual, mode);
  var expectBody = fs.readFileSync(expected, mode);
  helpers.equal(actualBody, expectBody);
};

// assertion helper to compare directories, length and output.
helpers.assertDir = function(actual, expected) {

  fs.readdirSync(actual).forEach(function(file, i) {
    var fname = path.join(actual, file);
    if(fs.statSync(fname).isDirectory()) return;

    var expectHex = fs.readFileSync(path.join(expected, file), 'base64');
    var actualHex = fs.readFileSync(fname, 'base64');
    // if it's not, it might take a little while for mocha to do the diff
    helpers.equal(file + ' - ' + actualHex, file + ' - ' + expectHex);
  });
};

// for when comparing actual file is a bit tricky (like binary file)
helpers.assertLength = function(actual, expected, cb) {
  // sync if cb not provided
  if(!cb) {
    actual = fs.statSync(actual).length;
    expected = fs.statSync(expected).length;
    return helpers.equal(actual, expected);
  }

  fs.stat(actual, function(e, actualStat) {
    if(cb) return cb(e);
    fs.stat(expected, function(e, expectedStat) {
      if(cb) return cb(e);
      helpers.equal(actualStat, expectedStat, 'Length should be the same');
    });
  });
};

helpers.equal = function(actual, expected, msg) {
  try {
    assert.equal(actual, expected, msg || 'Should both base64 encode value be the same');
  } catch(e) {
    console.log('\n\n');
    console.log('    ... Wooops, got error. Mocha will now generate the diff for you ...');
    console.log('    ... Please, be patient. It might take a while (few seconds maybe) ...');
    console.log('');
    throw e;
  }
};

// a simple copy helper, mostly used to update a fixture file no longer up to
// date
helpers.copyFile = function(src, dst, cb) {
  if(!cb) {
    mkdirp.sync(path.dirname(dst));
    return fs.writeFileSync(dst, fs.readFileSync(src));
  }

  mkdirp(path.dirname(dst), function(err) {
    if(err) return cb(err);
    fs.createReadStream(src).pipe(fs.createWriteStream(dst)).on('close', cb);
  });
};
