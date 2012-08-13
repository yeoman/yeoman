
var util = require('util'),
  yeoman = require('../../../../');

// sass:app generator

module.exports = Generator;

function Generator() {
  yeoman.generators.Base.apply(this, arguments);
}

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.main = function main() {
  this.write('app/styles/main.css', "/* Will be compiled down to a single stylesheet with your sass files */");
  this.write('app/styles/main.scss', '@import "compass_twitter_bootstrap";');
};

Generator.prototype.compassBootstrap = function compassBootstrap() {
  this.directory('compass_twitter_bootstrap', 'app/styles');
};
