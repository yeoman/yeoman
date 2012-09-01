
var path = require('path'),
  util = require('util'),
  yeoman = require('../../../../'),
  grunt = require('grunt'),
  angularUtils = require('../util.js');

module.exports = Generator;

function Generator() {
  yeoman.generators.NamedBase.apply(this, arguments);
  this.sourceRoot(path.join(__dirname, '../templates'));

  this.appname = path.basename(process.cwd());
}

util.inherits(Generator, yeoman.generators.NamedBase);

Generator.prototype.createDirectiveFiles = function createDirectiveFiles() {
  this.template('directive.js', 'app/scripts/directives/' + this.name + '.js');
  this.template('spec/directive.js', 'test/spec/directives/' + this.name + '.js');
};

Generator.prototype.rewriteIndexHtml = function() {
  var file = 'app/index.html';
  var body = grunt.file.read(file);
  
  body = angularUtils.rewrite({
    needle: '<!-- endbuild -->',
    haystack: body,
    splicable: [
      '<script src="scripts/directives/' + this.name + '.js"></script>'
    ]
  });

  grunt.file.write(file, body);
};
