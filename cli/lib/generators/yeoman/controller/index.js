
var util = require('util'),
  yeoman = require('../../../../');

module.exports = Generator;

function Generator() {
  yeoman.generators.Base.apply(this, arguments);

  this.argument('name', {
    type: String,
    desc: 'The name of the controller to create'
  });

  this.argument('views', {
    type: Array,
    desc: 'The list of view name for this controller to create'
  });

  console.log('Name?', this.name);
  console.log('Views?', this.views);

}

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.createInitializerFile = function() {
  this.log.ok('Logging through grunt log API');
  this.write('app/controllers/' + this.name + '.js', "# Add initialization content here");
};
