
var path = require('path');

// Inspired by
// https://github.com/rails/rails/blob/master/railties/lib/rails/generators.rb
// module
//
// Super simplified here.

var generators = module.exports;

// hoist up top level class the generator extend
generators.Base = require('./base');

generators.init = function init(grunt) {
  // get back arguments without the generate prefix
  var cli = grunt.cli,
    args = cli.tasks.slice(1),
    name = args.shift();

  // figure out the base application directory
  generators.base = path.dirname(grunt.file.findup(process.cwd(), 'Gruntfile.js'));

  // and "init" grunt as much as possible

  // and cd into it
  grunt.file.setBase(generators.base);

  if(!name) {
    return generators.help('generate');
  }

  generators.invoke(name, args, cli.options);
};

// show help message with available generators
generators.help = function help(command) {
  console.log('show help message for', command);
};


// Receives a namespace, arguments and the options list to invoke a generator.
// It's used as the default entry point for the generate command.
generators.invoke = function invoke(namespace, args, config) {
  var names = namespace.split(':'),
    name = names.pop(),
    klass = generators.findByNamespace(name, names.join(':'));

  // try by forcing the yeoman namespace, if none is specified
  if(!klass && !names.length) {
    klass = generators.findByNamespace(name, 'yeoman');
  }

  if(!klass) {
    return console.log('Could not find generator', namespace);
  }

  // create a new generator from this class
  var generator = new klass(args, config);

  // and start if off
  generator.invoke(namespace, {
    args: args,
    options: config
  });

};


//
// Yeoman finds namespaces by looking up special directories, and namespaces
// are directly tied to their file structure.
//
//    findByNamespace('jasmine', 'yeoman', 'integration')
//
// Will search for the following generators:
//
//    "yeoman:jasmine", "jasmine:integration", "jasmine"
//
// Which in turns look for these paths in the load paths:
//
//    generators/yeoman/jasmine/index.js
//    generators/yeoman/jasmine.js
//
//    generators/jasmine/integration/index.js
//    generators/jasmine/integration.js
//
//    generators/jasmine/index.js
//    generators/jasmine.js
//
// Load paths include `lib/` from within the yeoman application (user one), and
// the internal `lib/yeoman` path from within yeoman itself.
//
generators.findByNamespace = function findByNamespace(name, base, context) {
  var lookups = [],
    internal = path.join(__dirname, '../..');

  if(base) lookups.push(base + ':' + name);
  if(context) lookups.push(name + ':' + context);

  if(!base && !context) lookups.push(name);

  return generators.lookup(lookups) || generators.lookup(lookups, internal);
};

// Receives namespaces in an array and tries to find matching generators in the
// load paths. Load paths include both `yeoman/generators` and `generators`, in
// both the relative-to-gruntfile-directory `./lib/` and yeoman's built-in
// generators `lib/generators`.
generators.lookup = function lookup(namespaces, basedir) {
  var paths = generators.namespacesToPaths(namespaces),
    generator;

  basedir = basedir || generators.base;

  paths.forEach(function(rawPath) {
    if(generator) return;

    ['yeoman/generators', 'generators'].forEach(function(base) {
      var path = [basedir, 'lib', base, rawPath].join('/');

      try {
        generator = require(path);
      } catch(e) {
        // not a loadpath error? bubble up the exception
        if(!~e.message.indexOf(path)) throw e;
      }
    });
  });

  return generator;
};


// Convert namespaces to paths by replacing ":" for "/".
generators.namespacesToPaths = function namespacesToPaths(namespaces) {
  return namespaces.map(function(namespace) {
    return namespace.split(':').join('/');
  });
};
