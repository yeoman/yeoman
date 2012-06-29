
var util = require('util'),
  yeoman = require('../../../../');

module.exports = Generator;

function Generator() {
  yeoman.generators.NamedBase.apply(this, arguments);

  this.argument('views', {
    type: Array,
    desc: 'The list of view name for this controller to create'
  });
}

util.inherits(Generator, yeoman.generators.NamedBase);

Generator.prototype.createInitializerFile = function() {
  this.log.ok('Logging through grunt log API');
  this.write('app/js/controllers/' + this.name + '.js', "// Add initialization content here");
};
