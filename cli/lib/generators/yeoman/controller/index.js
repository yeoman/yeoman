
var util = require('util'),
  yeoman = require('../../../../');

module.exports = Generator;

function Generator() {
  yeoman.generators.Base.apply(this, arguments);
}

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.createInitializerFile = function() {
  this.log.ok('Logging through grunt log API');
  this.write('config/initializers/initializer.js', "# Add initialization content here");
};
