
var fs = require('fs'),
  path = require('path'),
  which = require('which');

//
// This task takes care of img optimizations by running a set of `.png`
// or `.jpg` files through optipng and jpegtran.
//
//      grunt img:<type>
//
// Gruntfile config:
//
//      ...
//      img: {
//        src: ['img/**/*'],
//        options: {
//          ...
//        }
//      }
//

var win32 = process.platform === 'win32';

module.exports = function(grunt) {

  var png = ['.png', '.bmp', '.gif', '.pnm', '.tiff'],
    jpegs = ['.jpg', 'jpeg'];

  // rev task - reving is done in the `output/` directory
  grunt.registerMultiTask('img', 'Optimizes .png/.jpg images using optipng/jpegtran', function() {
    var cb = this.async(),
      files = grunt.file.expandFiles(this.file.src);

    var pngfiles = files.filter(function(file) {
      return !!~png.indexOf(path.extname(file).toLowerCase());
    });

    var jpgfiles = files.filter(function(file) {
      return !!~jpegs.indexOf(path.extname(file).toLowerCase());
    });

    var remains = 2;
    grunt.helper('optipng', pngfiles, grunt.config('optipng'), function(err) {
      if(err) {
        grunt.log.error(err);
        return cb(false);
      }

      grunt.helper('jpegtran', jpgfiles, grunt.config('jpegtran'), function(err) {
        if(err) {
          grunt.log.error(err);
          return cb(false);
        }
        cb();
      });
    });
  });

  grunt.registerHelper('optipng', function(files, opts, cb) {
    opts = opts || {};
    cb = cb || function() {};

    grunt.helper('which', 'optipng', function(err, cmdpath) {
      if(err) return grunt.helper('not installed', 'optipng', cb);
      var args = opts.args ? opts.args : [];
      args = args.concat(files);
      if(!files.length) return cb();
      grunt.log.writeln('Running optipng... ' + grunt.log.wordlist(files));
      var optipng = grunt.util.spawn({
        cmd: cmdpath,
        args: args
      }, function() {});

      optipng.stdout.pipe(process.stdout);
      optipng.stderr.pipe(process.stderr);
      optipng.on('exit', function(code) {
        if(code) grunt.warn('optipng exited unexpectedly with exit code ' + code + '.', code);
        cb();
      });
    });
  });

  grunt.registerHelper('jpegtran', function(files, opts, cb) {
    opts = opts || {};
    cb = cb || function() {};
    opts.args = opts.args ? opts.args : ['-copy', 'none', '-optimize', '-outfile', 'jpgtmp.jpg'];

    grunt.helper('which', 'jpegtran', function(err, cmdpath) {
      if(err) return grunt.helper('not installed', 'jpegtran', cb);
      (function run(file) {
        if(!file) return cb();
        grunt.log.subhead('** Processing: ' + file);
        var jpegtran = grunt.util.spawn({
          cmd: cmdpath,
          args: opts.args.concat(file)
        }, function() {});

        jpegtran.stdout.pipe(process.stdout);
        jpegtran.stderr.pipe(process.stderr);

        jpegtran.on('exit', function(code) {
          if(code) return grunt.warn('jpgtran exited unexpectedly with exit code ' + code + '.', code);
          // output some size info about the file
          grunt.helper('min_max_stat', 'jpgtmp.jpg', file);
          // copy the temporary optimized jpg to original file
          fs.createReadStream('jpgtmp.jpg')
            .pipe(fs.createWriteStream(file)).on('close', function() {
              run(files.shift());
            });
        });
      }(files.shift()));
    });

  });

  grunt.registerHelper('not installed', function(cmd, cb) {
    grunt.verbose.or.writeln();
    grunt.log.write('Running ' + cmd + '...').error();
    grunt.log.errorlns([
      'In order for this task to work properly, :cmd must be',
      'installed and in the system PATH (if you can run ":cmd" at',
      'the command line, this task should work)'
    ].join(' ').replace(/:cmd/g, cmd));
    grunt.log.subhead('Skiping ' + cmd + ' task');
    if(cb) cb();
  });

  // **which** helper, wrapper to isaacs/which package plus some fallback logic
  // specifically for the win32 binaries in vendor/ (optipng.exe, jpegtran.exe)
  grunt.registerHelper('which', function(cmd, cb) {
    if(!win32 || !/optipng|jpegtran/.test(cmd)) return which(cmd, cb);

    var cmdpath = cmd === 'optipng' ? '../vendor/optipng-0.7.1-win32/optipng.exe' :
      '../vendor/jpegtran-8d/jpegtran.exe';

    cb(null, path.join(__dirname, cmdpath));
  });
};

