var path = require('path'),
    util = require('util'),
    yeoman = require('../../../../');

module.exports = Generator;

function Generator() {
  yeoman.generators.Base.apply(this, arguments);
  this.sourceRoot(path.join(__dirname, '../templates'));
  this.dirs = 'scripts styles'.split(' ');
  this.appname = path.basename(process.cwd());
}

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.createDirLayout = function createDirLayout() {
  var self = this;
  this.dirs.forEach(function(dir) {
    self.log.write('Creating app/' + dir + ' directory...')
    self.mkdir(path.join('app/', dir));
    self.log.ok();
  });
};

Generator.prototype.createJsFiles = function createJsFiles() {
  this.template('scripts/app.js', 'app/scripts/app.js');

  // AB : this would be more elegantly handled with 
  // file globbing, but given the limited number
  // of files, opting to hardcode instead of 
  // introduce another dependency (node-glob?) 

  this.libfiles = 'ember-1.0.pre.js handlebars-1.0.0.beta.6.js jquery-1.7.2.min.js'.split(' ');
  var self = this;
  this.libfiles.forEach(function(file) {
    self.template('scripts/libs/' + file, 'app/scripts/libs/' + file);
  });
};

Generator.prototype.createIndexFile = function createIndexFile() {
  this.template('index.html', 'app/index.html');
};

Generator.prototype.createStyleFile = function createStyleFile() {
  this.template('styles/style.css', 'app/styles/style.css');
};

Generator.prototype.createGruntFile = function createGruntFile() {
  this.template('Gruntfile.js', 'Gruntfile.js');
};
