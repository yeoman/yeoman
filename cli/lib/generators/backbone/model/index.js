
var path = require('path'),
  util = require('util'),
  yeoman = require('../../../../');

module.exports = Generator;

function Generator() {
  yeoman.generators.NamedBase.apply(this, arguments);
  this.sourceRoot(path.join(__dirname, '../templates'));

  // XXX default and banner to be implemented
  this.argument('attributes', { type: Array, defaults: [], banner: 'field[:type] field[:type]' });

  // parse back the attributes provided, build an array of attr
  this.attrs = this.attributes.map(function(attr) {
    var parts = attr.split(':');
    return {
      name: parts[0],
      type: parts[1] || 'string'
    }
  });

  this.appname = path.basename(process.cwd());
}

util.inherits(Generator, yeoman.generators.NamedBase);

Generator.prototype.createModelFiles = function createModelFiles() {
  this.template('model.js', path.join('app/scripts/models', this.name + '-model.js'));
};
