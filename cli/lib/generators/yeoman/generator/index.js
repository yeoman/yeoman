
var util = require('util'),
  yeoman = require('../../../../');

// generator generator...

module.exports = Generator;

function Generator() {
  yeoman.generators.NamedBase.apply(this, arguments);

  this.warnOn('lib/generators/' + this.name + '/*');
}

util.inherits(Generator, yeoman.generators.NamedBase);

Generator.prototype.createGeneratorFiles = function createGeneratorFiles() {
  this.directory('.', 'lib/generators/' + this.name);
};
