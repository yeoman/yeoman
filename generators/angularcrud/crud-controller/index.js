
var path = require('path'),
  util = require('util'),
  ScriptBase = require('../script-base.js'),
  grunt = require('grunt'),
  angularUtils = require('../util.js'),
  fs = require('fs');

module.exports = Generator;

function Generator() {
  ScriptBase.apply(this, arguments);
  
  this.model = this.name;
  this.verb = this.args[2];
  this.name = this.filename = this.args[1];

}

util.inherits(Generator, ScriptBase);

Generator.prototype.createControllerFiles = function createControllerFiles() {
  this.template('controller', 'app/scripts/controllers/' + this.model + '/' + this.filename);
  this.template('spec/controller', 'test/spec/controllers/' + this.model + '/' + this.filename);
};

Generator.prototype.rewriteIndexHtml = function() {
  var file = 'app/index.html';
  var body = grunt.file.read(file);
  
  body = angularUtils.rewrite({
    needle: '<!-- endbuild -->',
    haystack: body,
    splicable: [
      '<script src="scripts/controllers/' + this.model + '/' + this.filename + '.js"></script>'
    ]
  });

  grunt.file.write(file, body);
};
