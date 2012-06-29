
var path = require('path');

//
// Inspired by
// https://github.com/rails/rails/blob/master/railties/lib/rails/generators.rb
// module
//
// Super simplified here.

var generators = module.exports;

// hoist up top level class the generator extend
generators.Base = require('./base');
generators.NamedBase = require('./named-base');

generators.init = function init(grunt) {
  // get back arguments without the generate prefix
  var cli = grunt.cli,
    args = cli.tasks.slice(1),
    name = args.shift();

  // figure out the base application directory
  generators.cwd = process.cwd();
  generators.gruntfile = grunt.file.findup(generators.cwd, 'Gruntfile.js');
  generators.base = generators.gruntfile ? path.dirname(generators.gruntfile) : generators.cwd;

  // when a Gruntfile is found, make sure to cdinto that path. This is the
  // root of the yeoman app (should probably check few other things too, this
  // gruntfile may be in another project up to this path), otherwise let the
  // default cwd be (mainly for app generator).
  if(generators.gruntfile) {
    // init the grunt config if a Gruntfile was found
    try {
      require(generators.gruntfile).call(grunt, grunt);
    } catch(e) {
      grunt.log.write(msg).error().verbose.error(e.stack).or.error(e);
    }
    process.chdir(generators.base);
  }

  if(!name) {
    return generators.help('generate');
  }

  generators.invoke(name, args, cli.options, grunt.config());
};

// show help message with available generators
generators.help = function help(command) {
  console.log('show help message for', command);
};

// Receives a namespace, arguments and the options list to invoke a generator.
// It's used as the default entry point for the generate command.
generators.invoke = function invoke(namespace, args, options, config) {
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
  var generator = new klass(args, options, config);

  // configure the given sourceRoot for this path, if it wasn't already in the
  // Generator constructor.
  if(!generator.sourceRoot()) {
    generator.sourceRoot(path.join(klass.path, 'templates'));
  }

  // validate the generator (show help on missing argument / options)
  var requiredArgs = generator.arguments.some(function(arg) {
    return arg.config && arg.config.required;
  });

  if(!args.length && requiredArgs) {
    return console.log( generator.help() );
  }

  // also show help if --help was specifically passed
  if(options.help) {
    return console.log( generator.help() );
  }

  // hacky, might change.
  // attach the invoke helper to the generator instance
  generator.invoke = invoke;

  // and few other informations
  generator.namespace = klass.namespace;
  generator.generatorName = name;

  // and start if off
  generator.run(namespace, {
    args: args,
    options: options,
    config: config
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
  if(base) lookups.push(base);

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

    ['yeoman/generators', 'generators/yeoman', 'generators'].forEach(function(base) {
      var path = [basedir, 'lib', base, rawPath].join('/');

      try {
        // console.log('>>', namespaces, 'search in ', path);
        generator = require(path);
        // dynamically attach the generator filepath where it was found
        // to the given class, and the associated namespace
        generator.path = path;
        generator.namespace = rawPath.split('/').join(':');

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
