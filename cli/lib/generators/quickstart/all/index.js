
var util = require('util'),
path = require('path'),
  yeoman = require('../../../../');

module.exports = Generator;

function Generator() {
  yeoman.generators.Base.apply(this, arguments);
}

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.setupEnv = function setupEnv() {
	// Copies the contents of the generator `templates`
	// directory into your users new application path
    this.directory('.','.');
};
