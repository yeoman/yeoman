
var util = require('util'),
  yeoman = require('../../../../');

module.exports = Generator;

function Generator() {
  yeoman.generators.Base.apply(this, arguments);
}

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.createSomething = function() {
  this.directory('bootstrap', 'app/scripts/vendor/bootstrap');
  this.directory('requirejs', 'app/scripts/vendor/');
  this.directory('main', 'app/scripts/');
};
