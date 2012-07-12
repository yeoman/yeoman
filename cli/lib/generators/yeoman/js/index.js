
var util = require('util'),
  yeoman = require('../../../../');

module.exports = Generator;

function Generator() {
  yeoman.generators.Base.apply(this, arguments);
}

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.createSomething = function() {
  this.directory('bootstrap', 'app/js/vendor/bootstrap');
  this.directory('requirejs', 'app/js/vendor/');
  this.directory('main', 'app/js/');
};
