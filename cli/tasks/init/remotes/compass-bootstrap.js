

var fs = require('fs'),
  path = require('path'),
  util = require('util'),
  Repo = require('./util/repo'),
  fstream = require('fstream');

//
// Compass bootstrap project handler
//

module.exports = CompassBootstrap;

function CompassBootstrap(opts) {
  this.name = opts.name || 'compass_bootstrap';

  this.user = opts.user || 'vwall';
  this.repo = opts.repo || 'compass-twitter-bootstrap';
  this.version = opts.version || 'v2.0.3';
  this.title = "Twitter Bootstrap (Compass version)";

  this.priority = 3;

  Repo.apply(this, arguments);
}

util.inherits(CompassBootstrap, Repo);

CompassBootstrap.prototype.copy = function copy(cb) {
  // XXX provide a glob based API to copy specific files from the cached
  // folder to the root one
  fstream.Reader(path.join(this.cache, 'stylesheets_sass'))
    .on('error', cb)
    .pipe(fstream.Writer({
      path: path.join(__dirname, '../yeoman/root/css/sass'),
      type: 'Directory'
    }))
    .on('error', cb)
    .on('close', cb)
    .on('close', this.emit.bind(this, 'copy'));
};

CompassBootstrap.prototype.end = function end(cb) {
  return this;
};



