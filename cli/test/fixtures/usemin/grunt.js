
var path = require('path');

module.exports = function(grunt) {

  //
  // Grunt configuration
  //
  grunt.config.init({

    usemin: {
      files: ['index.html', 'without.html']
    }

  });

  grunt.loadNpmTasks(path.join(__dirname, '..'));

};
