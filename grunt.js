var path = require('path');

module.exports = function( grunt ) {
  'use strict';


  grunt.loadNpmTasks('grunt-shell');

  var angularcrudPath = path.resolve('./generators/angularcrud');
  var expressPath = path.resolve('./generators/express');

  grunt.initConfig({
    shell: {
      npmYeoman: {
        command: 'npm install',
        stdout: true,
        execOptions: {
          cwd: './yeoman-custom/cli'
        }
      },

      npmDemo: {
        command: 'npm install',
        stdout: true,
        execOptions: {
          cwd: './demo'
        }
      },

      linkAngularcrud: {
        command: 'ln -s ' + angularcrudPath + ' ./yeoman-custom/cli/node_modules/yeoman-generators/lib/generators/angularcrud',
        stdout: true
      },

      linkExpress: {
        command: 'ln -s ' + expressPath + ' ./yeoman-custom/cli/node_modules/yeoman-generators/lib/generators/express',
        stdout: true
      }
    }
  });

  // Disable lint for now until we upgrade to latest grunt with latest jshint
  grunt.registerTask('install', ['shell:npmYeoman', 'shell: npmDemo', 'shell:linkAngularcrud', 'shell:linkExpress']);
};