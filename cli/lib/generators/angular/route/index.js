
var path = require('path'),
  util = require('util'),
  yeoman = require('../../../../');

module.exports = Generator;

function Generator() {
  yeoman.generators.NamedBase.apply(this, arguments);
  this.sourceRoot(path.join(__dirname, '../templates'));

  this.appname = path.basename(process.cwd());

  this.hookFor('angular:controller', {
    args: [this.name]
  });
  this.hookFor('angular:partial', {
    args: [this.name]
  });

  // TODO: hook up routing in appName.js
}

util.inherits(Generator, yeoman.generators.NamedBase);
