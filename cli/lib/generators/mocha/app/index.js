
var util = require('util'),
  yeoman = require('../../../../');

// mocha:app generator
//
// Setup the test/ directory.
//

module.exports = Generator;

function Generator(args, options, config) {

  yeoman.generators.Base.apply(this, arguments);

  this.option('assert-framework', {
    type: String,
    defaults: 'chai',
    desc: 'Choose your prefered assertion library'
  });

  this.option('assert-style', {
    desc: 'Choose the asssert style you wish to use (assert, expect, should). Only enabled with chai.',
    type: String,
    defaults: 'expect'
  });

  this.option('ui', {
    desc: 'Choose your style of DSL (bdd, tdd, qunit, or exports)',
    type: String,
    defaults: 'bdd'
  });

  // parse arguments for now, manually
  this.assert_framework = options['assert-framework'] || 'chai';
  this.assert_style = options['assert-style'] || 'expect';
}

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.setupEnv = function setupEnv() {
  this.directory('.', 'test');
};

