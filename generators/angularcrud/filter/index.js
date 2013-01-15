
var path = require('path'),
  util = require('util'),
  ScriptBase = require('../script-base.js'),
  grunt = require('grunt'),
  angularUtils = require('../util.js');

module.exports = Generator;

function Generator() {
  ScriptBase.apply(this, arguments);
  this.sourceRoot(path.join(__dirname, '../templates'));

  this.appname = path.basename(process.cwd());
}

util.inherits(Generator, ScriptBase);

Generator.prototype.createFilterFiles = function createFilterFiles() {
  this.template('filter.js', 'app/scripts/filters/' + this.name);
  this.template('spec/filter.js', 'test/spec/filters/' + this.name);
};

Generator.prototype.rewriteIndexHtml = function() {
  var file = 'app/index.html';
  var body = grunt.file.read(file);
  
  body = angularUtils.rewrite({
    needle: '<!-- endbuild -->',
    haystack: body,
    splicable: [
      '<script src="scripts/filters/' + this.name + '.js"></script>'
    ]
  });

  grunt.file.write(file, body);
};
