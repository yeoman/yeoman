
var path = require('path'),
  minifier = require('html-minifier');

//
// This task takes care of html minification through @kangax' html-minifier
// project
//
// > http://perfectionkills.com/experimenting-with-html-minifier/
//
// This is not a multi-task, but a simple one. The configuration is as follow:
//
//      ...
//      html: {
//        files: ['**/*.html']
//        options: {
//          ...
//        }
//      }
//      ...
//
// Usage:
//
//      grunt html:<type>
//
// Three "types" of html compression are supported. They map the html
// options of h5bp/ant-build-script, except that types and configuration works
// in "reverse order" here. (eg. default type is most aggresive compression).
// And we at the moment only have two types of html compression.
//
// * compress: (when `grunt html` or `grunt html:compress` is run)
//   Agrresive html compression (Most advanced optimization configuration,
//   Full html minification)
//
// * buildkit: (when `grunt html:buildkit` is run)
//   all html whitespace/comments maintained (todo: inline and minify
//   style/script)
//
// * basics: (when `grunt html:basics` is run) Intermediate html compression
//   (whitespace removed / comments removed)
//
// One very last thing this tasks needs to do is the minification of
// inlined styles / scripts.
//
//

var options = {
  // maintaining whitespace, removing html comments, extra quotes
  // removed, ...
  basics: {
    collapseWhitespace: false
  },

  // maintaining whitespace, retain html comments
  buildkit: {
    collapseWhitespace            : false,
    removeComments                : false,
    removeCommentsFromCDATA       : false,
  },

  compress: {
    removeComments                : true,
    removeCommentsFromCDATA       : true,
    removeEmptyAttributes         : true,
    cleanAttributes               : true,
    removeAttributeQuotes         : true,
    removeRedundantAttributes     : true,
    removeScriptTypeAttributes    : true,
    removeStyleLinkTypeAttributes : true,
    collapseWhitespace            : true,
    collapseBooleanAttributes     : true,
    removeOptionalTags            : true
  }
};

module.exports = function(grunt) {

  grunt.registerTask('html', 'Basic to aggresive html minification', function(type) {
    var config = grunt.config('html') || {};
    grunt.config.requires('html.files', 'staging');

    grunt.log.writeln('Run htmlcompressor on ' + grunt.log.wordlist(config.files));

    // default type
    type = type || config.type || 'compress';

    var valid = !!~Object.keys(options).indexOf(type);
    if(!valid) return grunt.log.error('not a valid target: ' + type);

    // merge default options for predefined type with the grunt's config
    // one.
    var defaults = options.compress;
    grunt.util._.defaults(options[type], defaults);

    grunt.log.write('>> ' + type + '...').subhead('Options:');
    grunt.helper('inspect', options[type]);

    var files = grunt.file.expandFiles(config.files).map(function(file) {
      var body = grunt.file.read(file);
      return {
        file: file,
        body: body,
        minified: grunt.helper('html', body, options[type])
      };
    });

    // now write back to the disk each optimized html file
    files.forEach(function(file) {
      grunt.log.subhead(file.file);
      grunt.helper('min_max_info', file.minified, file.body);
      grunt.file.write(file.file, file.minified);
    });
  });

  //
  // **html** helper is a wrapper to html-minifier package, taking care of
  // html compression. See below for the full list of possible options. Options
  // may be setup using `grunt.config('html.options')` in your gruntfile.
  //
  grunt.registerHelper('html', function(body, opts) {
    opts = opts || {};

    // > http://perfectionkills.com/experimenting-with-html-minifier/#options
    grunt.util._.defaults(opts, grunt.config('html.options'), {
      removeComments: true,
      removeCommentsFromCDATA: true,
      removeEmptyAttributes: true,
      cleanAttributes: true,
      removeAttributeQuotes: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeOptionalTags: true
    });

    return minifier.minify(body, opts);
  });

};

