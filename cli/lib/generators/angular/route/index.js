
var path = require('path'),
  util = require('util'),
  grunt = require('grunt'),
  _ = grunt.util._,
  yeoman = require('../../../../'),
  angularUtils = require('../util.js');

module.exports = Generator;

function Generator() {
  yeoman.generators.NamedBase.apply(this, arguments);
  this.sourceRoot(path.join(__dirname, '../templates'));

  this.appname = path.basename(process.cwd());

  this.hookFor('angular:controller', {
    args: [this.name]
  });
  this.hookFor('angular:view', {
    args: [this.name]
  });
}

util.inherits(Generator, yeoman.generators.NamedBase);

Generator.prototype.rewriteAppJs = function() {
  var file = 'app/scripts/' + this.appname + '.js';
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
