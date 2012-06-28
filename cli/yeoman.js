

var yeoman = module.exports;

// hoist up any plugins onto the plugin object as lazy-loaded getters.
yeoman.plugins = require('./lib/plugins');

//
// custom package utilities, works in tandem with `grunt.util`.
//
// Utils is there to package and provide a
//
// Will be merged into grunt.util for further usage in tasks and helpers
//
yeoman.utils = require('./lib/utils');

// Yeoman generators
yeoman.generators = require('./lib/generators');
