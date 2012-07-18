module.exports = function(grunt) {

  //
  // Grunt configuration:
  //
  // https://github.com/cowboy/grunt/blob/master/docs/getting_started.md
  //
  grunt.initConfig({

    // Project configuration
    // ---------------------

    // coffee to js compilation
    coffee: {
      dist: {
        src: 'app/js/**/*.coffee',
        dest: 'app/js'
      }
    },

    // compile .scss/.sass to .css using Compass
    compass: {
      dist: {
        // http://compass-style.org/help/tutorials/configuration-reference/#configuration-properties
        options: {
          css_dir: 'css',
          sass_dir: 'css/sass',
          images_dir: 'img',
          javascripts_dir: 'js'
        }
      }
    },

    // generate application cache manifest
    manifest:{
      dest: ''
    },

    // Headless test through PhantomJS
    <%= test_framework %>: {
      all: ['test/**/*.html']
    },

    // default watch configuration
    watch: {
      coffee: {
        files: '<config:coffee.dist.src>',
        tasks: 'coffee reload'
      },
      compass: {
        files: ['app/css/sass/**/*.sass', 'app/css/sass/**/*.scss'],
        tasks: 'compass reload'
      },
      reload: {
        files: ['app/css/**/*.css', 'app/js/**/*.js', 'app/img/**/*'],
        tasks: 'reload'
      }
    },


    // default lint configuration, change this to match your setup:
    // https://github.com/cowboy/grunt/blob/master/docs/task_lint.md#lint-built-in-task
    lint: {
      files: ['Gruntfile.js', 'app/js/**/*.js', 'spec/**/*.js']
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
        jQuery: true
      }
    },

    // Build configuration
    // -------------------

     // the staging directory used during the process
    staging: 'intermediate',
    // final build output
    output: 'publish',

    mkdirs: {
      staging: 'app/'
    },

    // Below, all paths are relative to the staging directory, which is a copy
    // of the app/ directory. Any .gitignore, .ignore and .buildignore file
    // that might appear in the app/ tree are used to ignore these values
    // during the copy process.

    // concat css/**/*.css files, inline @import, output a single minified css
    css: {
      'css/main.css': ['css/**/*.css']
    },

    // Renames JS/CSS to prepend a hash of their contents for easier
    // versioning
    rev: {
      js: 'js/**/*.js',
      css: 'css/**/*.css',
      img: 'img/**'
    },

    // update references in html / css to revved files
    usemin: {
      html: ['**/*.html'],
      css: ['**/*.css']
    },

    // html minification
    html: {
      files: ['**/*.html']
    },

    // Optimizes JPGs and PNGs (with jpegtran & optipng)
    img: {
      dist: '<config:rev.img>'
    },

    // default concat configuration, change this to match your setup:
    // https://github.com/cowboy/grunt/blob/master/docs/task_concat.md
    concat: {
      dist: {
        src: ['js/plugins.js', 'js/vendor/bootstrap-*.js', 'js/main.js'],
        dest: 'js/build.js'
      }
    },

    // default min configuration, change this to match your setup:
    // https://github.com/cowboy/grunt/blob/master/docs/task_min.md
    min: {
      dist: {
        src: 'js/build.js',
        dest: 'js/build.min.js'
      }
    },

    // rjs configuration. You don't necessary need to specify here the typical
    // `path` configuration, the rjs task will parse these values from your
    // main module, using `require.config()`
    rjs: {
      modules: [{
        name: 'main',
      }],
      dir: 'js',
      appDir: 'js',
      baseUrl: './',
      pragmas: {
        doExclude: true
      },
      skipModuleInsertion: false,
      optimizeAllPluginResources: true,
      findNestedDependencies: true
    },

    // specifying UglifyJS options:
    // https://github.com/cowboy/grunt/blob/master/docs/task_min.md#specifying-uglifyjs-options
    uglify: {}
  });

  // Alias the `test` task to run the `jasmine` task instead
  grunt.registerTask('test', '<%= test_framework %>');

};
