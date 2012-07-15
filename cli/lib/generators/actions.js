
var fs = require('fs'),
  path = require('path'),
  grunt = require('grunt'),
  fetch = require('../utils/fetch'),
  _ = grunt.util._;

// The action mixin is comprised of Grunt's file, log, helper and prompt API,
// and made available for generators to use as instance methods directly for
// the file API, and through the `log` property for the log API.

var actions = module.exports;

// File API
// --------
// 1:1 relationship with grunt.file.
_.extend(actions, grunt.file);

// Helper API
// ----------
// 1:1 relationship with grunt.helper
actions.helper = grunt.helper;

// Prompts API
// -----------
// 1:1 relationship with grunt.helpers for prompt, prompt_for, and
// prompt_for_obj
actions.prompt = grunt.helper.bind(grunt, 'prompt');
actions.promptFor = grunt.helper.bind(grunt, 'prompt_for');
actions.promptForObj = grunt.helper.bind(grunt, 'prompt_for_obj');

// Log API
// -------
// as self.log property. 1:1 relationship with grunt.log
actions.log = grunt.log;

// Internal API
// ------------
// Specifics of our generator API, additonal logic and tweaks to file behaviour
// and so on.

// Stores and return the source root for this class
actions.sourceRoot = function sourceRoot(root) {
  if(root) this._sourceRoot = root;
  return this._sourceRoot;
};

// Sets the destination root for this class. Relatives path are added to the
// directory where the script was invoked and expanded.
actions.destinationRoot = function destinationRoot(root) {
  if(root) {
    this._destinationRoot = root;
    if(!path.existsSync(root)) this.mkdir(root);
    process.chdir(root);
  }

  return this._destinationRoot || './';
};

// Make some of the file API aware of our source / destination root paths.
// copy, template, write and alike consider:
//
// - the source path to be relative to generator's `templates/` directory.
// - the destination path to be relative to application Gruntfile's directory
// (most likely cwd)
actions.copy = function copy(source, destination, options) {
  source = path.join(this.sourceRoot(), source);
  grunt.file.copy(source, destination, options);
  return this;
};

actions.read = function read(filepath, encoding) {
  filepath = path.join(this.sourceRoot(), filepath);
  return grunt.file.read(filepath, encoding);
};

actions.write = function write(filepath, encoding) {
  grunt.option('verbose', true);
  grunt.file.write(filepath, encoding);
  grunt.option('verbose', false);
  return this;
};

// Gets an underscore template at the relative source, executes it and makes a copy
// at the relative destination. If the destination is not given it's assumed
// to be equal to the source relative to destination.
actions.template = function template(source, destination, data) {
  // data is meant to be the whole instance for now. Will change.
  data = data || this;
  destination = destination || source;

  var body = grunt.template.process(this.read(source), data);
  this.write(destination, body);
  return this;
};

// Copies recursively the files from source directory to root directory
actions.directory = function directory(source, destination) {
  var self = this,
    root = path.join(this.sourceRoot(), source),
    list = grunt.file.expandFiles({ dot: true }, path.join(root, '**'));

  destination = destination || source;

  // get the path relative to the template root, and copy to the relative destination
  list.forEach(function(filepath) {
    var src = filepath.slice(root.length),
      dest = path.join(destination, src);

    self.log.write('Writing ' + dest + '...');
    grunt.file.copy(filepath, dest, {
      process: function(content) {
        return grunt.template.process(content, self);
      }
    });
    self.log.ok();
  });
};

// Fetch a remote tarball, and untar at the given location
actions.tarball = fetch;

// Download a single file at the given destination.
actions.fetch = function(url, destination, cb) {
  this.mkdir(path.dirname(destination));

  var log = this.log.write('Fetching ' + url + '...');

  fetch.request(url)
    .on('error', cb)
    .on('data', log.write.bind(log, '.'))
    .pipe(fs.createWriteStream(destination))
    .on('error', cb)
    .on('close', function() {
      log.ok()
        .write('Writing ' + destination + '...')
        .ok();
    })
    .on('close', cb);
};

// Remotely fetch a package on github, store this into a _cache folder,
// and provide a "remote" object as an a facade API to ourself (part of
// genrator API, copy, template, directory)
actions.remote = function(username, repo, branch, cb) {
  if(!cb) { cb = branch; branch = 'master'; }

  var self = this,
    cache = path.join(__dirname, '../../_cache/', username, repo, branch),
    url = 'http://nodeload.github.com/' + [username, repo, 'tarball', branch].join('/');

  fs.stat(cache, function(err) {
    // already cached
    if(!err) return done();
    // first time fetch
    self.tarball(url, cache, done);
  });

  // XXX remote should probably be in its own file,
  function done(err) {
    if(err) return cb(err);

    var files = grunt.file.expandFiles(path.join(cache, '**')).map(function(filepath) {
      return filepath.slice(cache.length + 1);
    });

    var remote = {};

    remote.copy = function copy(source, destination, options) {
      source = path.join(cache, source);
      grunt.file.copy(source, destination, options);
      return this;
    };

    remote.template = function template(source, destination, data) {
      // data is meant to be the whole instance for now. Will change.
      data = data || self;
      destination = destination || source;
      source = path.join(cache, source);

      var body = grunt.template.process(grunt.file.read(source), data);
      self.write(destination, body);
    };

    remote.directory = function directory(source, destination) {
      var root = self.sourceRoot();
      self.sourceRoot(cache);
      self.directory(source, destination);
      self.sourceRoot(root);
    };

    cb(err, remote, files);
  }
};
