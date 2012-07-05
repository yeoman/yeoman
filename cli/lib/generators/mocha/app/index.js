
var util = require('util'),
  yeoman = require('../../../../');

// mocha:app generator
//
// Setup the test/ directory.
//

module.exports = Generator;

function Generator(name, options, config) {

  yeoman.generators.Base.apply(this, arguments);

  // XXX this.options to be implemented
  // this.options('assert_framework', {
  //   type: ['chai', 'expect'],
  //   default: 'chai',
  //   desc: 'Choose your prefered assertion library'
  // });

  // this.options('assert_style', {
  //   desc: 'Choose the asssert style you wish to use (assert, expect, should). Only enabled with chai.',
  //   type: ['assert', 'expect', 'should'],
  //   default: 'expect'
  // });

  // this.options('ui', {
  //   desc: 'Choose your style of DSL (bdd, tdd, qunit, or exports)',
  //   type: ['bdd', 'tdd', 'exports'],
  //   default: 'bdd'
  // });

  // parse arguments for now, manually

  this.assert_framework = options['assert-framework'] || 'chai';
  this.assert_style = options['assert-style'] || 'expect';

}

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.setupEnv = function setupEnv() {
  this.directory('.', 'test');
};

