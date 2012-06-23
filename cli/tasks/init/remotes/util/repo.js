
var fs = require('fs'),
  path = require('path'),
  util = require('util'),
  events = require('events'),
  fstream = require('fstream'),
  utils = require('../../../../').utils;

// XXX Fetch code may go directly in the fetch method of the Base class

module.exports = Repo;

// Going with EventEmitter right now. Might go to the Stream API.  Maybe we'll
// "pipe" a project to a given folder. Maybe we'll extend a base EventEmitter
// based class.

function Repo(opts) {
  this.cache = path.join(__dirname, '../_cache', this.user, this.repo, this.version);

  this.opts = opts || {};

  if(!opts.grunt) throw new Error('Grunt object is mandatory');
  this.grunt = opts.grunt;

  events.EventEmitter.call(this);
}

util.inherits(Repo, events.EventEmitter);

// may prompt for further info, then fetch & copy
Repo.prototype.init = function init(cb) {
  var self = this;

  // if set to include by default, skip the prompt
  // same if the props set an include_remote_name to `y`
  var include = this.include || /y/i.test(this.opts.props['include_' + this.name]);
  if(include) return self.fetch(function(err) {
    if(err) return cb(err);
    self.copy(cb);
  });

  // node-prompt info
  var prompts = [{
    name: 'include',
    message: 'Would you like to include ' + (this.title || ([this.user, this.repo].join('/') + ' repository')) + '?',
    default: 'Y/n',
    warning: 'Be warned!'
  }];


  this.grunt.helper('prompt', {}, prompts, function(err, props) {
    if(err) return cb(err);
    // XXX add validators, typing something else than y is meaning a no
    // right now. y and n should be the only possible value. If it's
    // not, it should reprompt
    if(!/y/i.test(props.include)) return cb();

    self.fetch(function(err) {
      if(err) return cb(err);
      self.copy(cb);
    });

  });
};

// fetch the remote locally
Repo.prototype.fetch = function fetch(cb) {
  var self = this;

  fs.stat(this.cache, function(err) {
    // cache is there, copy right away
    if(!err) return cb();

    // expected error, trigger the fetch & copy
    utils.fetch.call(self.grunt, self.url(), self.cache, function(err) {
      if(err) return cb(err);
      console.log('fetched');
      self.emit('fetch');
      cb();
    });

  });

  return this;
};

// Base copy files to the root folder, meant to be overridden by
// subclasses to implement their own copy handler if they need to.
Repo.prototype.copy = function copy(cb) {
  // XXX a fstream Writer class that takes grunt rename rules to "pipe"
  // a folder into another, ala fstream-ignore or fstream-npm
  fstream.Reader(this.cache)
    .on('error', cb)
    .pipe(fstream.Writer({
        path: path.join(__dirname, '../../yeoman/root'),
        type: 'Directory' }))
    .on('error', cb)
    .on('close', cb)
    .on('close', this.emit.bind(this, 'copy'));

  return this;
};

// final step
Repo.prototype.end = function end(cb) {
  return this;
};

// Utilities
// ---------

// returns the given tarball url for this repo
Repo.prototype.url = function url() {
  var repo = 'http://nodeload.github.com/:user/:repo/tarball/:version',
    data = this;
  return repo.replace(/:([a-z]+)/g, function(m, prop) {
    return data[prop] || '';
  });
};
