
var path = require('path'),
  grunt = require('grunt'),
  _ = grunt.util._;

var actions = module.exports;

// put this version of grunt into verbose mode
grunt.option.init({
  verbose: true
});

// The action mixin is comprised of Grunt's file and log API, and made
// available for generators to use as instance methods directly for the file API,
// and through the `log` property for the log API.

_.extend(actions, grunt.file);
actions.log = grunt.log;

// Stores and return the source root for this class
actions.sourceRoot = function sourceRoot(root) {
  if(root) this._sourceRoot = root;
  return this._sourceRoot;
};

// Sets the destination root for this thor class. Relatives path are added to
// the directory where the script was invoked and expanded.
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
  return grunt.file.copy(source, destination, options);
};

actions.read = function read(filepath, encoding) {
  filepath = path.join(this.sourceRoot(), filepath);
  return grunt.file.read(filepath, encoding);
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
  var root = path.join(this.sourceRoot(), source),
    files = grunt.file.expandFiles(path.join(root, '**'));

  destination = destination || source;

  // get the path relative to the template root, and copy to the relative destination
  files.forEach(function(filepath) {
    var src = filepath.slice(root.length),
      dest = path.join(destination, src);
    grunt.file.copy(filepath, dest);
  });
};
