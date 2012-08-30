
var path = require('path'),
  util = require('util'),
  yeoman = require('../../../../');

var Generator = module.exports = function Generator() {
  yeoman.generators.Base.apply(this, arguments);
  this.sourceRoot(path.join(__dirname, '../templates'));

  this.appname = path.basename(process.cwd());
  
  this.hookFor('angular:app', {
    args: ['main']
  });
  this.hookFor('testacular:app', {
    args: [false] // run testacular hook in non-interactive mode
  });
};

util.inherits(Generator, yeoman.generators.Base);
