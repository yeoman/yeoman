var util = require('util');
var path = require('path');

module.exports = function( grunt ) {
  'use strict';

  grunt.initConfig({
    lint: {
      options: {
        options: {
          node: true,
          es5 : true,
          esnext: true,
          bitwise: true,
          curly: true,
          eqeqeq: true,
          immed: true,
          latedef: true,
          newcap: true,
          noarg: true,
          //regexp: true,
          undef: true,
          strict: false,
          trailing: true,
          smarttabs: true
        },
        global: {
          process: true
        }
      },
      grunt: [
        'Gruntfile.js',
        'tasks/*.js'
      ],
      lib: [
        'lib/{plugins,utils}/*.js',
        'lib/generators/*.js'
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
