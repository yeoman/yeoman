  
var util = require('util'),
    path = require('path'),
    yeoman = require('../../../../');

module.exports = Generator;

function Generator() {
  yeoman.generators.Base.apply(this, arguments);
  this.appname = path.basename(process.cwd());
}

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.setupEnv = function setupEnv() {
  // Copies the contents of the generator `templates`
  // directory into your users new application path
  this.sourceRoot(path.join(__dirname, '../templates'));

  this.directory('app','.', true);
};

Generator.prototype.createAppFile = function createAppFile() {
  this.template('app.js', 'app/scripts/' + this.appname + '.js');
};

Generator.prototype.createMainFiles = function createMainFiles() {

  this.template('index.html', 'app/index.html');

  this.template('main.js', 'app/scripts/controllers/main.js');
  this.template('main.html', 'app/views/main.html');
};
