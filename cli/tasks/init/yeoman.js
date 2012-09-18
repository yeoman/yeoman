
var fs = require('fs'),
  path = require('path'),
  colors = require('colors'),
  yeoman = require('../../'),
  grunt = require('grunt'),
  utils = yeoman.utils;

// top level export
var template = module.exports;

// get back the resolved generator name to invoke
var name = yeoman.generators.name;

// and associated cli options (--help, --foo, ...)
var opts = yeoman.generators.options;

// strip back args from any `init:` prefix
grunt.cli.tasks = grunt.cli.tasks.map(function(arg) {
  return arg.replace(/^init:/, '');
});

if(!name && !opts.help) {
  yeoman.generators.name = 'app';
}

// Basic template description.
template.description = 'Init a new project or components';

// warnOn, specifics to resolved generator.  Any existing file or directory
// matching this wildcard will cause a warning.
//
// Bypass on --help
if(!opts.help) {
  template.warnOn = yeoman.generators.warnOn(grunt);
}

// Welcome message
template.welcome =
'\n     _-----_' +
'\n    |       |' +
'\n    |'+'--(o)--'.red+'|   .--------------------------.' +
'\n   `---------´  |    '+'Welcome to Yeoman,'.yellow.bold+'    |' +
'\n    '+'( '.yellow+'_'+'´U`'.yellow+'_'+' )'.yellow+'   |   '+'ladies and gentlemen!'.yellow.bold+'  |' +
'\n    /___A___\\   \'__________________________\'' +
'\n     |  ~  |'.yellow +
'\n   __'+'\'.___.\''.yellow+'__' +
'\n ´   '+'`  |'.red+'° '+'´ Y'.red+' `\n';

// Template-specific notes to be displayed before question prompts.
template.notes = '\n'; //... More notes to come here ...'.yellow;

// The actual grunt init template. We need to support:
//
// yeoman init
// yeoman init backbone
// yeoman init backbone:model modelName
//
// Handles the specific case of default generator on `init` (without generator
// name).
template.template = function _template(grunt, init, cb) {
  console.log(template.welcome);
  console.log('Out of the box I include HTML5 Boilerplate, jQuery and Modernizr.');

  // delegate the groundwork of scaffolding to the generator layer
  return yeoman.generators.init(grunt);
};
