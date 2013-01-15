var path = require('path'),
  util = require('util'),
  ScriptBase = require('../script-base.js'),
  grunt = require('grunt'),
  angularUtils = require('../util.js');

module.exports = Generator;

function Generator() {
  ScriptBase.apply(this, arguments);
  this.routeFile = this.name + 'Routes'
}

util.inherits(Generator, ScriptBase);

Generator.prototype.createRoutesFile = function createRoutesFile() {
    this.template('routes/routes', 'server/' + this.routeFile);
//  this.template('spec/routes/routes', 'test/spec/routes/' + this.routeFile);
};

Generator.prototype.rewriteIndexHtml = function() {
  var file = 'server/index.js';
  var body = grunt.file.read(file);
  
  body = angularUtils.rewrite({
    needle: '/* Required Route Files */',
    haystack: body,
    splicable: [
      "require('./"+this.routeFile+"')(app);"
    ]
  });
  
  grunt.file.write(file, body);
};

