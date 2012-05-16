
var fs = require('fs'),
  path = require('path');



  module.exports = function(grunt) {
  var path = require('path');

  // Please see the grunt documentation for more information regarding task and
  // helper creation: https://github.com/cowboy/grunt/blob/master/docs/toc.md

  // ==========================================================================
  // TASKS
  // ==========================================================================

  grunt.registerMultiTask('coffee', 'Compile CoffeeScript files', function() {
    var dest = this.file.dest;
    grunt.file.expandFiles(this.file.src).forEach(function(filepath) {
      grunt.helper('coffee', filepath, dest);
    });

    if (grunt.task.current.errorCount) {
      return false;
    }
  });

  // ==========================================================================
  // HELPERS
  // ==========================================================================

  grunt.registerHelper('coffee', function(src, destPath) {
    var coffee = require('coffee-script'),
        js = '';

    var dest = path.join(destPath, 
                         path.basename(src, '.coffee') + '.js');

    try {
      js = coffee.compile(grunt.file.read(src), { bare: true });
      grunt.file.write(dest, js);
    } catch (e) {
      grunt.log.error("Unable to compile your coffee", e);
    }
  });

};