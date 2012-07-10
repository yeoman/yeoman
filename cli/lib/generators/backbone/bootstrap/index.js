
var path = require('path'),
  util = require('util'),
  yeoman = require('../../../../');

module.exports = Generator;

function Generator() {
  yeoman.generators.Base.apply(this, arguments);
  this.sourceRoot(path.join(__dirname, '../templates'));

  this.dirs = 'models collections views routes helpers templates'.split(' ');

  // should we figure it out automatically? and made available through an
  // appname property, function of something.
  this.appname = path.basename(process.cwd());
}

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.injectBackbone = function injectBackbone() {
  //this.template('lib/backbone-min.js', 'app/js/backbone.js');
  //this.template('lib/underscore-min.js', 'app/js/underscore.js');
};

Generator.prototype.createDirLayout = function createDirLayout() {
  var self = this;
  this.dirs.forEach(function(dir) {
    self.log.write('Creating app/js/' + dir + ' directory...')
    self.mkdir(path.join('app/js', dir));
    self.log.ok();
  });
};

Generator.prototype.createAppFile = function createAppFile() {
  this.template('app.js', 'app/js/' + this.appname + '.js');
};

Generator.prototype.createAppStubs = function createAppStubs() {
  // the api to hookFor and pass arguments may vary a bit.
  this.hookFor('backbone:view', {
    args: [ 'application' ]
  });
  this.hookFor('backbone:model', {
    args: [ 'application' ]
  });
  this.hookFor('backbone:collection', {
    args: [ 'application' ]
  });
  this.hookFor('backbone:router', {
    args: [ 'application' ]
  });
};

