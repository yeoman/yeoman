/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // the staging directory used during the process
    staging: '{%= staging %}',
    // final build output
    output: '{%= output %}',
    // filter any files matching one of the below pattern during mkdirs task
    // the pattern in the .gitignore file should work too.
    exclude: '.git* build/** node_modules/** grunt.js package.json *.md'.split(' '),
    mkdirs: {
      staging: '<config:exclude>'
    },
    // concat css/**/*.css files, inline @import, output a single minified css
    css: {
      'css/style.css': ['{%= css_dir %}/**/*.css']
    },
    // Renames JS/CSS to prepend a hash of their contents for easier
    // versioning
    rev: {
      js: '{%= js_dir %}/**/*.js',
      css: '{%= css_dir %}/**/*.css',
      img: '{%= img_dir %}/**'
    },
    // update references in html to revved files
    usemin: {
      files: ['**/*.html']
    },
    // html minification
    html: '<config:usemin>',
    // Optimizes JPGs and PNGs (with jpegtran & optipng)
    img: {
      dist: '<config:rev.img>'
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint {%= test_task %}'
    },
    {% if (min_concat) { if (package_json) { %}
    pkg: '<json:package.json>',
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
    },{% } else { %}
    meta: {
      version: '0.1.0',
      banner: '/*! PROJECT_NAME - v<%= meta.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '* http://PROJECT_WEBSITE/\n' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> ' +
        'YOUR_NAME; Licensed MIT */'
    },{% } } %}
    lint: {
      files: ['grunt.js', '{%= js_dir %}/**/*.js', '{%= test_dir %}/**/*.js']
    },{% if (dom) { %}
    qunit: {
      files: ['{%= test_dir %}/**/*.html']
    },{% } else { %}
    test: {
      files: ['{%= test_dir %}/**/*.js']
    },{% } %}{% if (min_concat) { %}
    concat: {
      dist: {
        src: ['{%= js_dir %}/plugins.js', '{%= js_dir %}/main.js'],
        dest: '{%= js_dir %}/{%= name %}-{%= version %}.js'
      }
    },
    min: {
      dist: {
        src: '{%= js_dir %}/{%= name %}-{%= version %}.js',
        dest: '{%= js_dir %}/main.js'
      }
    },{% } %}
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
        eqnull: true{% if (dom) { %},
        browser: true{% } %}
      },
      globals: {{% if (jquery) { %}
        jQuery: true
      {% } %}}
    }{% if (min_concat) { %},
    uglify: {}{% } %}
  });

};
