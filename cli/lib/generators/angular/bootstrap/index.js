
var path = require('path'),
  util = require('util'),
  yeoman = require('../../../../');

module.exports = Generator;

function Generator() {
  yeoman.generators.Base.apply(this, arguments);
  this.sourceRoot(path.join(__dirname, '../templates'));

  this.dirs = 'controllers helpers templates'.split(' ');

  // should we figure it out automatically? and made available through an
  // appname property, function of something.
  this.appname = path.basename(process.cwd());
}

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.injectAngular = function injectAngular() {
  // noop for now, but here we might add necessary content to necessary file to
  // wire up the framework. 
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

Generator.prototype.createFiltersFile = function createFiltersFile() {
  this.template('filters.js', 'app/js/filters.js');
};

Generator.prototype.createServicesFile = function createServicesFile() {
  this.template('services.js', 'app/js/services.js');
};

Generator.prototype.createDirectivesFile = function createDirectivesFile() {
  this.template('directives.js', 'app/js/directives.js');
};


Generator.prototype.createPartialsFile = function createPartialsFile() {
  this.template('partials1.html', 'app/partials/partials1.html');
  this.template('partials2.html', 'app/partials/partials2.html');
};


Generator.prototype.createAppStubs = function createAppStubs() {
  // the api to hookFor and pass arguments may vary a bit.
  this.hookFor('angular:controller', {
    args: [ 'application' ]
  });
};