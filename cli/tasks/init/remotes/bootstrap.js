

var fs = require('fs'),
  path = require('path'),
  util = require('util'),
  Repo = require('./util/repo'),
  fstream = require('fstream');

//
// Compass bootstrap project handler
//

module.exports = Bootstrap;

function Bootstrap(opts) {
  this.name = opts.name || 'bootstrap';

  this.user = opts.user || 'twitter';
  this.repo = opts.repo || 'bootstrap';
  this.version = opts.version || 'v2.0.3';

  this.priority = 2;


  Repo.apply(this, arguments);
}

util.inherits(Bootstrap, Repo);

Bootstrap.prototype.copy = function copy(cb) {
  // XXX provide a glob based API to copy specific files from the cached
  // folder to the root one
  fstream.Reader(path.join(this.cache, 'js'))
    .on('error', cb)
    .pipe(fstream.Writer({
        path: path.join(__dirname, '../yeoman/root/js/vendor'), type: 'Directory'
    }))
    .on('error', cb)
    .on('close', cb)
    .on('close', this.emit.bind(this, 'copy'));
};

Bootstrap.prototype.end = function end(cb) {
  return this;
};



