
var util = require('util'),
  yeoman = require('../../../../');

// jasmine:app generator
//
// Setup the test/ directory.
//

module.exports = Generator;

function Generator() {
  yeoman.generators.Base.apply(this, arguments);
}

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.setupEnv = function setupEnv() {
  this.directory('.', 'test');
};

