module.exports = function( grunt ) {
  'use strict';
  //
  // Grunt configuration:
  //
  // https://github.com/cowboy/grunt/blob/master/docs/getting_started.md
  //
  grunt.initConfig({

    // Project configuration
    // ---------------------

    // specify an alternate install location for Bower
    bower: {
      dir: 'app/scripts/vendor'
    },

    // Coffee to JS compilation
    coffee: {
      dist: {
        src: 'app/scripts/**/*.coffee',
        dest: 'app/scripts'
      }
    },

    // compile .scss/.sass to .css using Compass
    compass: {
      dist: {
        // http://compass-style.org/help/tutorials/configuration-reference/#configuration-properties
        options: {
          css_dir: 'styles',
          sass_dir: 'styles',
          images_dir: 'images',
          javascripts_dir: 'scripts',
          force: true
        }
      }
    },

    // generate application cache manifest
    manifest:{
      dest: ''
    },

    // default watch configuration
    watch: {
      coffee: {
        files: '<config:coffee.dist.src>',
        tasks: 'coffee reload'
      },
      compass: {
        files: [
          'app/styles/**/*.{scss,sass}'
        ],
        tasks: 'compass reload'
      },
      reload: {
        files: [
          'app/*.html',
          'app/styles/**/*.css',
          'app/scripts/**/*.js',
          'app/images/**/*'
        ],
        tasks: 'reload'
      }
    },

    // default lint configuration, change this to match your setup:
    // https://github.com/cowboy/grunt/blob/master/docs/task_lint.md#lint-built-in-task
    lint: {
      files: [
        'Gruntfile.js',
        'app/scripts/**/*.js',
        'spec/**/*.js'
      ]
    },

    // specifying JSHint options and globals
    // https://github.com/cowboy/grunt/blob/master/docs/task_lint.md#specifying-jshint-options-and-globals
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {
        angular: true
      }
    },

    // Build configuration
    // -------------------

    // the staging directory used during the process
    staging: 'temp',
    // final build output
    output: 'dist',

    mkdirs: {
      staging: 'app/'
    },

    // Below, all paths are relative to the staging directory, which is a copy
    // of the app/ directory. Any .gitignore, .ignore and .buildignore file
    // that might appear in the app/ tree are used to ignore these values
    // during the copy process.

    // concat css/**/*.css files, inline @import, output a single minified css
    css: {
      'styles/main.css': ['styles/**/*.css']
    },

    // renames JS/CSS to prepend a hash of their contents for easier
    // versioning
    rev: {
      js: 'scripts/**/*.js',
      css: 'styles/**/*.css',
      img: 'images/**'
    },

    // usemin handler should point to the file containing
    // the usemin blocks to be parsed
    'usemin-handler': {
      html: 'index.html'
    },

    // update references in HTML/CSS to revved files
    usemin: {
      html: ['**/*.html'],
      css: ['**/*.css']
    },

    // HTML minification
    html: {
      files: ['**/*.html']
    },

    // Optimizes JPGs and PNGs (with jpegtran & optipng)
    img: {
      dist: '<config:rev.img>'
    },

    // rjs configuration. You don't necessarily need to specify the typical
    // `path` configuration, the rjs task will parse these values from your
    // main module, using http://requirejs.org/docs/optimization.html#mainConfigFile
    //
    // name / out / mainConfig file should be used. You can let it blank if
    // you're using usemin-handler to parse rjs config from markup (default
    // setup)
    rjs: {
      // no minification, is done by the min task
      optimize: 'none',
      baseUrl: './scripts',
      wrap: true
    },
  });

  // Alias the `test` task to run `testacular` instead
  grunt.registerTask('test', 'run the testacular test driver', function () {
    var done = this.async();
    require('child_process').exec('testacular testacular.conf.js --single-run', function (err, stdout) {
      grunt.log.write(stdout);
      done(err);
    });
  });

};
