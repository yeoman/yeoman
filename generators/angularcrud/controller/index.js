
var path = require('path'),
  util = require('util'),
  ScriptBase = require('../script-base.js'),
  grunt = require('grunt'),
  angularUtils = require('../util.js');

module.exports = Generator;

function Generator() {
  ScriptBase.apply(this, arguments);
  
  // if the controller name is suffixed with ctrl, remove the suffix
  if (this.name && this.name.substr(-4).toLowerCase() === 'ctrl') {
    this.name = this.name.slice(0, -4);
  }
}

util.inherits(Generator, ScriptBase);

Generator.prototype.createControllerFiles = function createControllerFiles() {
  this.template('standardController', 'app/scripts/controllers/' + this.name);
  this.template('spec/controller', 'test/spec/controllers/' + this.name);
};

Generator.prototype.rewriteIndexHtml = function() {
  var file = 'app/index.html';
  var body = grunt.file.read(file);
  
  body = angularUtils.rewrite({
    needle: '<!-- endbuild -->',
    haystack: body,
    splicable: [
      '<script src="scripts/controllers/' + this.name + '.js"></script>'
    ]
  });

  grunt.file.write(file, body);
};
