
var util = require('util'),
  yeoman = require('../../../../');

module.exports = AppGenerator;

function AppGenerator(args, options, config) {
  yeoman.generators.NamedBase.apply(this, arguments);
  this.destinationRoot(this.name);

  // setup some dummy data content for the template to pass. Will change.
  this.pkg = {
    title: this.name,
    name: this.name,
    version: '0.0.0',
    homepage: '',
    author: {
      name: 'author'
    },
    licenses: [{
      type: 'MIT'
    }]
  };
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

  this.hookFor('javascript-engine');
  this.hookFor('stylesheet-engine');
  this.hookFor('template-engine');

  this.hookFor('controller');
};

AppGenerator.prototype.lib = function lib() {
  this.mkdir('lib');
};

AppGenerator.prototype.test = function test() {
  this.mkdir('test');
  this.mkdir('spec');

  this.hookFor('test-framework');
};

