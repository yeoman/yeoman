var path = require('path'),
  util = require('util'),
  yeoman = require('yeoman');

module.exports = Generator;

function Generator() {
  yeoman.generators.NamedBase.apply(this, arguments);

  this.hookFor('angularcrud:crud-route', {
    args: [this.name, 'index']
  });

  this.hookFor('angularcrud:crud-route', {
    args: [this.name, 'create']
  });

  this.hookFor('angularcrud:crud-route', {
    args: [this.name, 'update']
  });

  this.hookFor('angularcrud:crud-route', {
    args: [this.name, 'view']
  });

}

util.inherits(Generator, yeoman.generators.NamedBase);
