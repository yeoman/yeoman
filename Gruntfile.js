var util = require('util');
var path = require('path');

module.exports = function( grunt ) {
  'use strict';

  grunt.initConfig({
    lint: {
      options: {
        options: '<json:.jshintrc>',
        global: {
          process: true
        }
      },
      grunt: [
        'Gruntfile.js',
        //'tasks/*.js',
      ],
      lib: [
        //'lib/{plugins,utils}/*.js',
        //'lib/generators/*.js'
      ],
      test: [
        //'test/**/*.js'
      ]
    },
    watch: {
      files: '<config:lint>',
      tasks: 'lint'
    }
  });

  // Disable lint for now until we upgrade to latest grunt with latest jshint
  grunt.registerTask( 'default', 'lint' );

  // Debugging helpers
  grunt.registerTask( 'list-helpers', 'List all grunt registered helpers', function( helper ) {
    var ls = grunt.log.wordlist( Object.keys( grunt.task._helpers ), grunt.util.linefeed );

    if ( !helper ) {
      return grunt.log.ok( ls );
    }

    grunt.log.subhead( helper + ' source:' ).writeln( grunt.task._helpers[ helper ] );
  });

  grunt.registerTask( 'list-tasks', 'List all grunt registered tasks', function( task ) {
    var ls = grunt.log.wordlist( Object.keys( grunt.task._tasks ), grunt.util.linefeed );

    if ( !task ) {
      return grunt.log.ok( ls );
    }

    grunt.log.subhead( task + ' source:' ).writeln( util.inspect( grunt.task._tasks[ task ] ) );
  });
};
