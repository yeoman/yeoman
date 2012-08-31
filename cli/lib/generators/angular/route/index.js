
var path = require('path'),
  util = require('util'),
  grunt = require('grunt'),
  _ = grunt.util._,
  yeoman = require('../../../../');

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
  
  body = rewrite(body, this.name);

  grunt.file.write(file, body);
};

var rewrite = function (body, name) {

  var lines = body.split('\n');

  var otherwiseLineIndex = 0;
  lines.forEach(function (line, i) {
    if (line.indexOf('.otherwise') !== -1) {
      otherwiseLineIndex = i;
    }
  });

  var spaces = 0;
  while (lines[otherwiseLineIndex].charAt(spaces) === ' ') {
    spaces += 1;
  }

  var spaceStr = '';
  while ((spaces -= 1) >= 0) {
    spaceStr += ' ';
  }

  lines.splice(otherwiseLineIndex, 0, [
    spaceStr + ".when('/" + name + "', {",
    spaceStr + "  templateUrl: 'views/" + name + ".html',",
    spaceStr + "  controller: '" + _.classify(name) + "Ctrl'",
    spaceStr + "})"
  ].join('\n'));

  return lines.join('\n');
};
