
var path = require('path'),
  util = require('util'),
  yeoman = require('../../../../');

module.exports = Generator;

function Generator() {
  yeoman.generators.Base.apply(this, arguments);
  this.sourceRoot(path.join(__dirname, '../templates'));

  this.dirs = 'models controllers views routes helpers templates'.split(' ');

  // should we figure it out automatically? and made available through an
  // appname property, function of something.
  this.appname = path.basename(process.cwd());
}

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.injectEmber = function injectEmber() {
  // noop for now, but here we might add necessary content to necessary file to
  // wire up the framework. emberjs/ember-rails does this to add the necessary
  // pipeline require to the main application.js file
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

Generator.prototype.createRouterFile = function createRouterFile() {
  this.template('router.js', 'app/js/routes/app-router.js');
};

Generator.prototype.createStoreFile = function createStoreFile() {
  this.template('store.js', 'app/js/store.js');
};

Generator.prototype.createAppStubs = function createAppStubs() {
  // the api to hookFor and pass arguments may vary a bit.
  this.hookFor('ember:view', {
    args: [ 'application' ]
  });
};
