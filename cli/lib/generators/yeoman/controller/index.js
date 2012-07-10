
var util = require('util'),
  yeoman = require('../../../../');

module.exports = Generator;

// XXX might be removed to controller generator at framework level

function Generator() {
  yeoman.generators.NamedBase.apply(this, arguments);

  this.argument('views', {
    type: Array,
    desc: 'The list of view name for this controller to create'
  });

  this.hookFor('js-framework');
}

util.inherits(Generator, yeoman.generators.NamedBase);
