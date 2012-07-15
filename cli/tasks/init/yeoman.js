
var fs = require('fs'),
  path = require('path'),
  colors = require('colors'),
  yeoman = require('../../'),
  utils = yeoman.utils;


// top level export
var template = module.exports;

// Basic template description.
template.description = 'Init a new project or components';

// Welcome message
template.welcome =
'\n        _   .--------------------------.' +
'\n      _|' + 'o'.red + '|_ |    ' + 'Welcome to Yeoman,'.yellow.bold + '    |' +
'\n       '+ '|_|'.yellow + '  |   ' + 'ladies and gentlemen!'.yellow.bold + '  |' +
'\n     / \\' + 'Y'.red + '/ \\' + ' o'.yellow + '_________________________|' +
'\n    ||  :  |\//                          ' +
'\n    '+'o'.yellow + '/' + ' ---'.red + ' \\                            ' +
'\n      _\\ /_                             ' +
'\n'.yellow.bold;

// Template-specific notes to be displayed before question prompts.
template.notes = '\n'; //... More notes to come here ...'.yellow;

// Any existing file or directory matching this wildcard will cause a warning.
//
// XXX thing of a way to dinamycally set this based on what generates the
// genrator that is likely to be invoked.
template.warnOn = '*';

// Display welcome message
// XXX should this exist as it's own helper task?
console.log(template.welcome);

// The actual grunt init template.
template.template = function _template(grunt, init, cb) {

  // strip back args from any `init:` prefix
  grunt.cli.tasks = grunt.cli.tasks.map(function(arg) {
    return arg.replace(/^init:/, '');
  });

  // delegate the groundwork of scaffolding to the generator layer
  return yeoman.generators.init(grunt);
};
