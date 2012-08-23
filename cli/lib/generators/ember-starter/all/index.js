var path = require('path'),
    util = require('util'),
    yeoman = require('../../../../');

module.exports = Generator;

function Generator() {
  yeoman.generators.Base.apply(this, arguments);
  this.sourceRoot(path.join(__dirname, '../templates'));
  this.dirs = 'templates'.split(' ');
  this.appname = path.basename(process.cwd());
}

util.inherits(Generator, yeoman.generators.Base);

/*
Generator.prototype.createDirLayout = function createDirLayout() {
  var self = this;
  this.dirs.forEach(function(dir) {
    self.log.write('Creating app/scripts/' + dir + ' directory...')
    self.mkdir(path.join('app/scripts', dir));
    self.log.ok();
  });
};

Generator.prototype.createAppFile = function createAppFile() {
  this.template('app.js', 'app/scripts/' + this.appname + '.js');
};

Generator.prototype.createRouterFile = function createRouterFile() {
  this.template('router.js', 'app/scripts/routes/app-router.js');
};

Generator.prototype.createStoreFile = function createStoreFile() {
  this.template('store.js', 'app/scripts/store.js');
};
*/
