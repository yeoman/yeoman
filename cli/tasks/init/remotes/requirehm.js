
var fs = require('fs'),
  path = require('path'),
  util = require('util'),
  Repo = require('./util/repo'),
  fstream = require('fstream');

module.exports = requirehm;

function requirehm(opts) {

  this.name = opts.name || 'requirehm';
  this.user = opts.user || 'jrburke';
  this.repo = opts.repo || 'require-hm';
  this.title = "experimental support for ECMAScript 6 Modules";

  this.version = opts.version || '9e1773f332d9d356bb6e7d976f9220f3a1371747';

  this.files = {};
  this.files.path = 'js/vendor';
  this.files.js = ['hm.js','esprima.js'];

  this.priority = 5;

  Repo.apply(this, arguments);
}

util.inherits(requirehm, Repo);



requirehm.prototype.copy = function copy(cb) {

  var self = this;

  this.files.js.forEach(function( currentFile ){

    fstream.Reader(path.join(self.cache, currentFile))
      .on('error', cb)
      .pipe(fstream.Writer({
        path: path.join(__dirname, '../yeoman/root/js/vendor', currentFile),
        type: 'File'
      }))
      .on('error', cb)
      .on('close', cb)
      .on('close', self.emit.bind(self, 'copy'));

  });

};

requirehm.prototype.end = function end(cb) {
  return this;
};