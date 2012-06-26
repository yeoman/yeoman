
var fs = require('fs'),
  path = require('path'),
  util = require('util'),
  Repo = require('./util/repo'),
  fstream = require('fstream');

// XXX
//   - Fetch code may go directly in the fetch method of the Base class
//   - This file file become the base class (and be renamed)
//

module.exports = requirehm;

function requirehm(opts) {

  this.name = opts.name || 'requirehm';
  this.user = opts.user || 'addyosmani';
  this.repo = opts.repo || 'require-hm';
  this.title = "experimental support for ECMAScript 6 Modules";

  this.version = opts.version || '12dd2cc037b1cda98b1ac34e2ae6e31686de1acb';

  this.files = {};
  this.files.path = 'js/vendor';
  this.files.js = ['hm.js'];

  this.priority = 5;

  Repo.apply(this, arguments);
}

util.inherits(requirehm, Repo);

requirehm.prototype.copy = function copy(cb) {
  // XXX provide a glob based API to copy specific files from the cached
  // folder to the root one
  fstream.Reader(path.join(this.cache, 'dist'))
    .on('error', cb)
    .pipe(fstream.Writer({
      path: path.join(__dirname, '../yeoman/root/js/vendor'),
      type: 'Directory'
    }))
    .on('error', cb)
    .on('close', cb)
    .on('close', this.emit.bind(this, 'copy'));
};

requirehm.prototype.end = function end(cb) {
  return this;
};
