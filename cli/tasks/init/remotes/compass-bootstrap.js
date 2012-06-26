

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

  // Files to wire up
  this.files = {
    js: [
      'js/vendor/bootstrap/bootstrap-alert.js',
      'js/vendor/bootstrap/bootstrap-button.js',
      'js/vendor/bootstrap/bootstrap-tab.js',
      'js/vendor/bootstrap/bootstrap-modal.js'
    ]
  };

  this.priority = 3;

  Repo.apply(this, arguments);
}

util.inherits(CompassBootstrap, Repo);

CompassBootstrap.prototype.copy = function copy(cb) {

  var self = this,
    cp = function(input, output, cb2) {
      // XXX provide a glob based API to copy specific files from the cached
      // folder to the root one
      fstream.Reader(path.join(self.cache, input))
        .on('error', cb)
        .pipe(fstream.Writer({
          path: path.join(__dirname, '../yeoman/root/' + output),
          type: 'Directory'
        }))
        .on('error', cb)
        .on('close', cb2)
        .on('close', self.emit.bind(self, 'copy'));
    };

  cp('stylesheets_sass', 'css/sass', function() {
    cp('vendor/assets/javascripts', 'js/vendor/bootstrap', cb);
  });

};

CompassBootstrap.prototype.end = function end(cb) {
  return this;
};
