
var util = require('util'),
path = require('path'),
  yeoman = require('../../../../');

// sass:app generator

module.exports = Generator;

function Generator() {
  yeoman.generators.Base.apply(this, arguments);
}

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.setupEnv = function setupEnv() {
    this.directory('.','.', true);
};
