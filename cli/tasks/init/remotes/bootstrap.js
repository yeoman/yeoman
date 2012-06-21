

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
  this.title = "Twitter Bootstrap";

  // Files to wire up
  this.files = {};
  this.files.path = 'js/vendor/bootstrap';
  this.files.js = ['bootstrap-alert.js', 'bootstrap-button.js','bootstrap-tab.js','bootstrap-modal.js'];
  //

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
        path: path.join(__dirname, '../yeoman/root/js/vendor/bootstrap'), type: 'Directory'
    }))
    .on('error', cb)
    .on('close', cb)
    .on('close', this.emit.bind(this, 'copy'));
};

Bootstrap.prototype.end = function end(cb) {
  return this;
};



