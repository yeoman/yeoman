module.exports = function(grunt) {
  var path = require('path');

  grunt.registerMultiTask('coffee', 'Compile CoffeeScript files', function() {
    var dest = this.file.dest;

    grunt.file.expandFiles(this.file.src).forEach(function(filepath) {
      grunt.helper('coffee', filepath, dest);
    });

    if (grunt.task.current.errorCount) {
      return false;
    }
  });

  grunt.registerHelper('coffee', function(src, destPath) {
    var coffee = require('coffee-script'),
        js = '',
        dest = path.join(destPath, 
                         path.basename(src, '.coffee') + '.js');

    try {
      js = coffee.compile(grunt.file.read(src), { bare: true });
      grunt.file.write(dest, js);
    } catch (e) {
      grunt.log.error("Unable to compile your coffee", e);
    }
  });

};