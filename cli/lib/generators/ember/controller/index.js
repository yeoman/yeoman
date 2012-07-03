
var path = require('path'),
  util = require('util'),
  yeoman = require('../../../../');

module.exports = Generator;

function Generator() {
  yeoman.generators.NamedBase.apply(this, arguments);
  this.sourceRoot(path.join(__dirname, '../templates'));

  // XXX to be implemented, help generating usage output
  // this.option('array', {
  //   type: Boolean,
  //   default: false,
  //   desc: 'Create an Ember.ArrayController to represent multiple objects'
  //  });


  this.appname = path.basename(process.cwd());
}

util.inherits(Generator, yeoman.generators.NamedBase);

Generator.prototype.createControllerFiles = function createControllerFiles() {
  var filename = this.options.array ? 'array_controller.js' : 'controller.js';
  this.template(filename, path.join('app/js/controllers', this.name + '-controller.js'));
};
