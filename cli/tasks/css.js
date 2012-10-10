
var fs = require('fs'),
  path = require('path'),
  cleanCSS = require('clean-css'),
  rjs = require('requirejs');

module.exports = function(grunt) {



  // **css* task works pretty much the same as grunt's min task. The task
  // target is the destination, data is an array of glob patterns. These
  // files are concataned and run through requirejs optimizer to handle
  // @import inlines in CSS files.
  grunt.task.registerMultiTask('css', 'Concats, replaces @imports and minifies the CSS files', function() {
    this.requiresConfig('staging');

    // if defined, files get prepended by the output config value
    var files = this.data;

    // subtarget name is the output destination
    var target = this.target;

    // async task
    var cb = this.async();

    // concat prior to rjs optimize css, and before min max info
    grunt.log.write('Writing css files to ' + target + '...');
    var out = grunt.helper('mincss', files);
    // only go through if their's file to process
    if(!out) {
      return cb();
    }

    // write minified file before going through rjs:optimize to possibly inline
    // @imports (that are not handled by compass within .scss or .sass files)
    grunt.file.write(target, out);

    // replace @import statements
    //
    // XXX no error handling in this helper so far..
    // Check that rjs returns an error when something wrong (if it throws...)
    // if it is bubble the error back here
    grunt.helper('rjs:optimize:css', target, function() {
      // do the minification once inline imports are done
      grunt.log.ok();
      cb();
    });
  });

  //
  // **mincss** basic utility to concat CSS files and run them through
  // [cleanCSS](https://github.com/GoalSmashers/clean-css), might opt to use
  // [https://github.com/jzaefferer/grunt-css] plugin.
  //
  grunt.registerHelper('mincss', function(files, o) {
    o = o || {};
    files = grunt.file.expandFiles(files);
    return files.map(function(filepath) {
      var content = grunt.file.read(filepath);
      return o.nocompress ? content : cleanCSS.process(content);
    }).join('');
  });

  // **rjs:optimize:css** is an helper using rjs to optimize a single file,
  // mainly to properly import multi-level of @import statements, which can be
  // tricky with all the url rewrites.
  //
  // file     - Path to the css file to optimize
  // options  - (optional) rjs configuration
  // cb       - callback function to call on completion
  grunt.registerHelper('rjs:optimize:css', function(file, options, cb) {
    if(!cb) { cb = options; options = {}; }
    options.cssIn = file;
    options.out = options.out || file;
    options.optimizeCss = 'standard.keepComments.keepLines';
    var before = grunt.file.read(file);
    rjs.optimize(options, function() {
      grunt.helper('min_max_info', grunt.file.read(file), before);
      cb();
    });
  });

};

