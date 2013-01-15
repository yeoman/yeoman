  
var util = require('util'),
    path = require('path'),
    grunt = require('grunt'),
    yeoman = require('yeoman');

module.exports = Generator;

function Generator() {
  yeoman.generators.NamedBase.apply(this, arguments);
  this.appname = path.basename(process.cwd());


  this.option('coffee');

  // attempt to detect if user is using CS or not
  // if cml arg provided, use that; else look for the existence of cs
  if (!this.options.coffee &&
    grunt.file.expandFiles(path.join(__dirname,
      '/app/scripts/**/*.coffee')).length > 0)
  {
    this.options.coffee = true;
  }


  var sourceRoot = '/templates/javascript';
  this.scriptSuffix = '.js';

  if (this.options.coffee)
  {
    sourceRoot = '/templates/coffeescript';
    this.scriptSuffix = '.coffee';
  }

  this.sourceRoot(path.join(__dirname, sourceRoot));
}

util.inherits(Generator, yeoman.generators.NamedBase);

Generator.prototype.template = function (src, dest) {
  yeoman.generators.Base.prototype.template.apply(this, [
    src + this.scriptSuffix,
    dest + this.scriptSuffix
  ]);
};

Generator.prototype.htmlTemplate = function () {
  yeoman.generators.Base.prototype.template.apply(this, arguments);
};
