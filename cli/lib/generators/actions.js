
var grunt = require('grunt'),
  _ = grunt.util._;

var actions = module.exports;

// put this version of grunt into verbose mode
grunt.option.init({
  verbose: true
});

// The action mixin is comprised of Grunt's file and log API, and made
// available for generators to use as instance methods directly for the file API,
// and through the `log` property for the log API.

_.extend(actions, grunt.file);
actions.log = grunt.log;
