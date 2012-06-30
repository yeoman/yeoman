
var util = require('util'),
  yeoman = require('../../../../');

// js:app generator

module.exports = Generator;

function Generator() {
  yeoman.generators.Base.apply(this, arguments);
}

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.main = function main() {
  this.write('app/js/main.js', '// Add initialization content here');
};

// XXX needs to generate controllers, models, view & templates
// probably through another hook, more framework specific
Generator.prototype.app = function app() {
  this.mkdir('app/js/controllers');
  this.mkdir('app/js/models');
  this.mkdir('app/js/views');

  // we use js-framework here to hook into bootstrap js plugins by default
  // but it might evry well be done a bit differently (or we consider bootstrap
  // as we would consider backbone or amber)
  //
  // We may use a different hook, or handle the bootstrap scaffolding directly here.
  this.hookFor('js-framework');
};

