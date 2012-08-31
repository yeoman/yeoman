
var path = require('path'),
  util = require('util'),
  yeoman = require('../../../../');

module.exports = Generator;

function Generator() {
  yeoman.generators.NamedBase.apply(this, arguments);
  this.sourceRoot(path.join(__dirname, '../templates'));

  this.appname = path.basename(process.cwd());
}

util.inherits(Generator, yeoman.generators.NamedBase);

Generator.prototype.createFilterFiles = function createFilterFiles() {
  this.template('filter.js', 'app/scripts/filters/' + this.name + '.js');
  this.template('spec/filter.js', 'test/spec/filters/' + this.name + '.js');
};
