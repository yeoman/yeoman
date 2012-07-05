
var util = require('util'),
  yeoman = require('../../../../');

module.exports = AppGenerator;

function AppGenerator(args, options, config) {
  yeoman.generators.NamedBase.apply(this, arguments);
  this.destinationRoot(this.name);

  // setup the test-framework property, Gruntfile template will need this
  this.test_framework = options['test-framework'] || 'jasmine';

  // clenup the name propery from trailing /, typical usage of directories.
  // update the args object, it's used to initialize js-framework hooks
  this.args[0] = this.args[0].replace(/\/$/, '');
}

util.inherits(AppGenerator, yeoman.generators.NamedBase);

AppGenerator.prototype.readme = function readme() {
  this.copy('readme.md', 'readme.md');
};

AppGenerator.prototype.gruntfile = function gruntfile() {
  this.template('Gruntfile.js');
};

AppGenerator.prototype.packageJSON = function packageJSON() {
  this.template('package.json');
};

AppGenerator.prototype.configrb = function configrb() {
  this.template('config.rb');
};

AppGenerator.prototype.gitignore = function gitignore() {
  this.copy('gitignore', '.gitignore');
};

AppGenerator.prototype.app = function app() {
  this.mkdir('app');
  this.mkdir('app/js');
  this.mkdir('app/css');
  this.mkdir('app/templates');

  // create the index.html file (until we remotely fetch again h5bp repository,
  // and copy index.html + stripped conversion)
  this.copy('index.html', 'index.html');

  // resolved to js by default (could be switched to coffee for instance)
  this.hookFor('javascript-engine');

  // resolved to sass by default (could be switched to less for instance)
  this.hookFor('stylesheet-engine');

  // init a framework specific controller. resolved to ? by default
  this.hookFor('js-framework', { as: 'controller' });

  // init a framework specific model. resolved to ? by default
  this.hookFor('js-framework', { as: 'model' });

  // init a framework specific view. resolved to ? by default
  this.hookFor('js-framework', { as: 'view' });
};

AppGenerator.prototype.lib = function lib() {
  this.mkdir('lib');

  // init a generator ? a readme explaining the purpose of the lib/ folder?
};

AppGenerator.prototype.test = function test() {
  this.mkdir('test');
  this.mkdir('spec');

  // resolved to jasmine by default (could be switched to mocha for instance)
  this.hookFor('test-framework');
};

