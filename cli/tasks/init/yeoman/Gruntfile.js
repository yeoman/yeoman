module.exports = function(grunt) {

  // Project configuration:
  // https://github.com/cowboy/grunt/blob/master/docs/getting_started.md
  grunt.initConfig({
    // the staging directory used during the process
    staging: 'intermediate',
    // final build output
    output: 'publish',
    // filter any files matching one of the below pattern during mkdirs task
    // the pattern in the .gitignore file should work too.
    exclude: '.git* build/** node_modules/** grunt.js package.json *.md'.split(' '),
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
    coffee: {
      dist: {
        src: 'js/**/*.coffee',
        dest: 'js'
      }
    },
    // default watch configuration
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint qunit'
    },
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
    // default lint configuration, change this to match your setup:
    // https://github.com/cowboy/grunt/blob/master/docs/task_lint.md#lint-built-in-task
    lint: {
      files: ['grunt.js', 'js/**/*.js', 'test/**/*.js']
    },
    // QUnit headless test through PhantomJS
    // XXX to be changed with grunt-jasmine integration
    qunit: {
      files: ['test/**/*.html']
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
    // specifying UglifyJS options:
    // https://github.com/cowboy/grunt/blob/master/docs/task_min.md#specifying-uglifyjs-options
    uglify: {}
  });

};
