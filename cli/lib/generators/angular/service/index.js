
var path = require('path'),
  util = require('util'),
  yeoman = require('../../../../');

module.exports = Generator;

function Generator() {
  yeoman.generators.NamedBase.apply(this, arguments);
  this.sourceRoot(path.join(__dirname, '../templates'));

  var allowedTypes = [
    'constant',
    'factory',
    'provider',
    'service',
    'value'
  ];

  this.argument('type', {
    type: String,
    defaults: 'factory',
    banner: '[type]',
    required: false
  });

  // TODO: log some warning?
  if (allowedTypes.indexOf(this.type) === -1) {
    this.type = 'factory';
  }

  this.appname = path.basename(process.cwd());
}

util.inherits(Generator, yeoman.generators.NamedBase);

Generator.prototype.createServiceFiles = function createServiceFiles() {
  this.template(path.join('service', this.type + '.js'), 'app/scripts/services/' + this.name + '.js');
};
