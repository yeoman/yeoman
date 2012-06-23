module.exports = function(grunt) {

  //
  // Grunt configuration:
  //
  // https://github.com/cowboy/grunt/blob/master/docs/getting_started.md
  //
  grunt.initConfig({

    // Project configuration
    // ---------------------

    // pull in package.json data
    pkg: '<json:package.json>',
    // and build banner from these information
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
    },

    // Dev utilities and configuration
    // -------------------------------

    // coffee to js compilation
    coffee: {
      dist: {
        src: 'js/**/*.coffee',
        dest: 'js'
      }
    },

    // compass compile
    // https://github.com/sindresorhus/grunt-shell#grunt-shell
    shell: {
      compass: {
        command: 'compass compile'
      }
    },

    // generate application cache manifest
    manifest:{
      dest: ''
    },

    // Jasmine headless test through PhantomJS
    // > https://github.com/creynders/grunt-jasmine-task
    jasmine: {
      all: ['test/**/*.html']
    },

    // default watch configuration
    watch: {
      coffee: {
        files: '<config:coffee.dist.src>',
        tasks: 'coffee'
      },
      compass: {
        files: ['css/sass/**/*.sass', 'css/sass/**/*.scss'],
        tasks: 'shell:compass'
      },
      // only used with `yeoman server`
      reload: {
        files: ['css/**/*.css', 'js/**/*.js', 'img/**/*'],
        tasks: 'reload'
      }
    },


    // default lint configuration, change this to match your setup:
    // https://github.com/cowboy/grunt/blob/master/docs/task_lint.md#lint-built-in-task
    lint: {
      files: ['grunt.js', 'js/**/*.js', 'test/**/*.js']
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

    // filter any files matching one of the below pattern during mkdirs task
    // the pattern in the .gitignore file should work too.
    exclude: '.git* build/** node_modules/** grunt.js package.json *.md css/sass/'.split(' '),
    mkdirs: {
      staging: '<config:exclude>'
    },

    // concat css/**/*.css files, inline @import, output a single minified css
    css: {
      'css/style.css': ['css/**/*.css']
    },

    // Renames JS/CSS to prepend a hash of their contents for easier
    // versioning
    rev: {
      js: 'js/**/*.js',
      css: 'css/**/*.css',
      img: 'img/**'
    },

    // update references in html to revved files
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
        dest: 'js/<%= pkg.name %>-<%= pkg.version %>.js'
      }
    },

    // default min configuration, change this to match your setup:
    // https://github.com/cowboy/grunt/blob/master/docs/task_min.md
    min: {
      dist: {
        src: 'js/<%= pkg.name %>-<%= pkg.version %>.js',
        dest: 'js/main.js'
      }
    },

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
  grunt.registerTask('test', 'jasmine');

};
