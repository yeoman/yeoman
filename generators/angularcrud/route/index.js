
var path = require('path'),
  util = require('util'),
  grunt = require('grunt'),
  _ = grunt.util._,
  yeoman = require('yeoman'),
  angularUtils = require('../util.js');

module.exports = Generator;

function Generator() {
  yeoman.generators.NamedBase.apply(this, arguments);
  this.sourceRoot(path.join(__dirname, '../templates'));

  this.appname = path.basename(process.cwd());

  this.hookFor('angularcrud:controller', {
    args: [this.name]
  });
  this.hookFor('angularcrud:view', {
    args: [this.name]
  });
}

util.inherits(Generator, yeoman.generators.NamedBase);

Generator.prototype.rewriteAppJs = function() {
  var file = 'app/scripts/app.js'; // TODO: coffee
  var body = grunt.file.read(file);
  
  body = angularUtils.rewrite({
    needle: '.otherwise',
    haystack: body,
    splicable: [
      ".when('/" + this.name + "', {",
      "  templateUrl: 'views/" + this.name + ".html',",
      "  controller: '" + _.classify(this.name) + "Ctrl'",
      "})"
    ]
  });

  grunt.file.write(file, body);
};
