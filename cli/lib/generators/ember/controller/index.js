
var path = require('path'),
  util = require('util'),
  yeoman = require('../../../../'),
  grunt = require('grunt'),
  _ = grunt.util._;

module.exports = Generator;

function Generator() {
  yeoman.generators.NamedBase.apply(this, arguments);
  this.sourceRoot(path.join(__dirname, '../templates'));

  this.option('array', {
    type: Boolean,
    defaults: false,
    desc: 'Create an Ember.ArrayController to represent multiple objects'
   });

  this.appname = path.basename(process.cwd());

  this.filename = _.dasherize(this.name).replace(/^-/, '');
}

util.inherits(Generator, yeoman.generators.NamedBase);

Generator.prototype.createControllerFiles = function createControllerFiles() {
  var filename = this.options.array ? 'array_controller.js' : 'controller.js';
  this.template(filename, path.join('app/js/controllers', this.filename + '-controller.js'));
};
