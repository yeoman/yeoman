
var fs = require('fs'),
  path = require('path'),
  util = require('util'),
  Repo = require('./util/repo'),
  fstream = require('fstream');

// XXX
//   - Fetch code may go directly in the fetch method of the Base class
//   - This file file become the base class (and be renamed)
//

module.exports = requirejs;

function requirejs(opts) {

  this.name = opts.name || 'requirejs';
  this.user = opts.user || 'jrburke';
  this.repo = opts.repo || 'requirejs';
  this.title = "RequireJS (for AMD support)";

  this.version = opts.version || '819774388d0143f2dcc7b178a364e875aea6e45a';

  this.files = {};
  this.files.path = 'js/vendor';
  this.files.js = ['require.js'];

  this.priority = 4;

  Repo.apply(this, arguments);
}

util.inherits(requirejs, Repo);

requirejs.prototype.copy = function copy(cb) {
  // XXX provide a glob based API to copy specific files from the cached
  // folder to the root one
  var filename = 'require.js';

  fstream.Reader(path.join(this.cache, filename))
    .on('error', cb)
    .pipe(fstream.Writer({
      path: path.join(__dirname, '../yeoman/root/js/vendor', filename),
      type: 'File'
    }))
    .on('error', cb)
    .on('close', cb)
    .on('close', this.emit.bind(this, 'copy'));
};

requirejs.prototype.end = function end(cb) {
  return this;
};
