
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

// hidden namespaces don't show up in the help output
// XXX hidden namespaces for now means app context, should we filter them
// automatically in help output?
generators.hiddenNamespaces = [
  'yeoman:app',
  'yeoman:js',
  'sass:app',
  'jasmine:app',
  'mocha:app'
];

// keep track of loaded path in lookup case no generator were found, to be able to
// log where we searched
generators.loadedPath = [];

// Main entry point of the generator layer, requires a Grunt object from which
// we read cli options and tasks, and kick off the appropriate generator.
generators.init = function init(grunt) {
  // get back arguments without the generate prefix
  var cli = grunt.cli,
    args = cli.tasks.slice(1),
    name = args.shift();

  // figure out the base application directory
  generators.cwd = process.cwd();
  generators.gruntfile = grunt.file.findup(generators.cwd, 'Gruntfile.js');
  generators.base = generators.gruntfile ? path.dirname(generators.gruntfile) : generators.cwd;

  // keep reference to this grunt object, so that other method of this module may use its API.
  generators.grunt = grunt;

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

  // try to locate locally installed yeoman plugin
  generators.plugins = grunt.file.expandDirs('node_modules/yeoman-*');

  if(!name) {
    return generators.help(args, cli.options, grunt.config() || {});
  }

  generators.invoke(name, args, cli.options, grunt.config() || {});
};

// show help message with available generators
generators.help = function help(args, options, config) {
  var internalPath = path.join(__dirname, '../..'),
    internal = generators.lookupHelp(internalPath, args, options, config),
    users = generators.lookupHelp(process.cwd(), args, options, config),
    grunt = generators.grunt;

  // try load in any node_modules/yeoman-*/lib/generators too
  var plugins = generators.plugins.map(function(plugin) {
    return generators.lookupHelp(path.resolve(plugin), args, options, config);
  }).reduce(function(a, b) {
    a = a.concat(b);
    return a;
  }, []);

  // group them all together
  var all = users.concat(plugins).concat(internal);

  // sort out the namespaces
  var namespaces = all.map(function(generator) {
    return generator.namespace;
  });

  // ensure we don't help loaded twice generator
  namespaces = generators.grunt.util._.uniq(namespaces);

  // filter hidden namespaces
  namespaces = namespaces.filter(function(ns) {
    return !~generators.hiddenNamespaces.indexOf(ns);
  });

  // group them by namespace
  var groups = {}
  namespaces.forEach(function(namespace) {
    var base = namespace.split(':')[0];
    if(!groups[base]) groups[base] = [];
    groups[base] = groups[base].concat(namespace);
  });

  // default help message
  var out = [
    'Usage: yeoman generate GENERATOR [args] [options]',
    '',
    'General options:',
    '  -h, --help     # Print generator\'s options and usage',
    // XXX below are options that are present in rails generators we might want
    // to handle
    // '  -p, [--pretend]  # Run but do not make any changes',
    // '  -f, [--force]    # Overwrite files that already exist',
    // '  -s, [--skip]     # Skip files that already exist',
    // '  -q, [--quiet]    # Suppress status output',
    '',
    'Please choose a generator below.',
    ''
  ].join('\n');

  console.log(out);

  // strip out the yeoman base namespace
  groups.yeoman = groups.yeoman.map(function(ns) {
    return ns.replace(/^yeoman:/, '');
  });

  // print yeoman default first
  generators.printList('yeoman', groups.yeoman);
  Object.keys(groups).forEach(function(key) {
    if(key === 'yeoman') return;
    generators.printList(key, groups[key]);
  });
};

// Prints a list of generators.
generators.printList = function printList(base, namespaces) {
  // should use underscore.string for humanize, camelize and so on.
  console.log( base.charAt(0).toUpperCase() + base.slice(1) + ':' );
  namespaces.forEach(function(ns) {
    console.log('  ' + ns);
  });
  console.log();
};

// Receives a namespace, arguments and the options list to invoke a generator.
// It's used as the default entry point for the generate command.
generators.invoke = function invoke(namespace, args, options, config) {

  // keep track of loaded path in lookup case no generator were found, to be able to
  // log where we searched
  // reset the loadedPath on invoke
  generators.loadedPath = [];

  // create the given generator
  var generator = generators.create(namespace, args, options, config);

  // unable to find one
  if(!generator) {
    // output some help unless we're following some hooks, and silent flag is turned on
    console.log('Could not find generator', namespace);
    return console.log('Tried in:\n' + generators.loadedPath.map(function(path) {
      return ' - ' + path;
    }).join('\n'));
  }

  // configure the given sourceRoot for this path, if it wasn't already in the
  // Generator constructor.
  if(!generator.sourceRoot()) {
    generator.sourceRoot(path.join(generator.generatorPath, 'templates'));
  }

  // validate the generator (show help on missing argument / options)
  var requiredArgs = generator._arguments.some(function(arg) {
    return arg.config && arg.config.required;
  });

  if(!args.length && requiredArgs) {
    return console.log( generator.help() );
  }

  // also show help if --help was specifically passed
  if(options.help) {
    return console.log( generator.help() );
  }

  generators.grunt.log.subhead('.. Invoke ' + namespace.replace(/^yeoman:/, '') + ' ..');
  // and start if off
  generator.run(namespace, {
    args: args,
    options: options,
    config: config
  });
};

// Generator factory. Get a namespace, locate, instantiate, init and return the
// given generator.
generators.create = function create(namespace, args, options, gruntConfig, silent) {
  var names = namespace.split(':'),
    name = names.pop(),
    klass = generators.findByNamespace(name, names.join(':'));

  // try by forcing the yeoman namespace, if none is specified
  if(!klass && !names.length) {
    klass = generators.findByNamespace(name, 'yeoman');
  }

  if(!klass) return;

  // create a new generator from this class
  var generator = new klass(args, options, gruntConfig);

  // hacky, might change.
  // attach the invoke helper to the generator instance
  generator.invoke = generators.invoke;

  // and few other informations
  generator.namespace = klass.namespace;
  generator.generatorName = name;
  generator.generatorPath = klass.path;

  // follup registered hooks, and instantiate each resolved generator
  // so that we can get access to expected arguments / options
  generator._hooks = generator._hooks.map(function(hook) {
    var config = gruntConfig.generator,
      resolved = options[hook.name] || config[hook.name];

    hook.context = resolved + ':' + (hook.as || name);
    hook.args = hook.args || args;
    hook.config = hook.config || config;
    hook.options = hook.options || options;
    hook.generator = generators.create(hook.context, hook.args, hook.options, hook.config, true);
    return hook;
  });

  return generator;
};

//
// Yeoman finds namespaces by looking up special directories, and namespaces
// are directly tied to their file structure.
//
//    findByNamespace('jasmine', 'yeoman')
//
// Will search for the following generators:
//
//    "yeoman:jasmine", "jasmine"
//
// Which in turns look for these paths in the load paths:
//
//    generators/yeoman/jasmine/index.js
//    generators/yeoman/jasmine.js
//
//    generators/jasmine/index.js
//    generators/jasmine.js
//
// Load paths include `lib/` from within the yeoman application (user one), and
// the internal `lib/yeoman` path from within yeoman itself.
//
generators.findByNamespace = function findByNamespace(name, base) {
  var internal = path.join(__dirname, '../..'),
    lookups = base ? [base + ':' + name , base] : [name];

  // first search locally, ./lib/generators
  var generator = generators.lookup(lookups);

  if(!generator) {
    // then try in each yeoman plugin
    generators.plugins.forEach(function(plugin) {
      generator = generator || generators.lookup(lookups, path.resolve(plugin));
    });
  }

  if(!generator) {
    // finally try in yeoman's bultin
    generator = generators.lookup(lookups, path.join(__dirname, '../..'));
  }

  return generator;
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
        // keep track of loaded path
        generators.loadedPath && generators.loadedPath.push(path);
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

// This will try to load any generator in the load path to show in help.
//
// XXX Note may end up in the convention than rails, with generator named after
// {name}_generator.js pattern. Easier for path lookup. Right now, generators
// are stucked with the `index.js` name.
generators.lookupHelp = function lookupHelp(basedir, args, options, config) {
  var grunt = generators.grunt;

  basedir = basedir || generators.base;

  var found = ['yeoman/generators', 'generators'].map(function(p) {
    var prefix = path.join(basedir, 'lib', p),
      pattern = path.join(prefix, '**', 'index.js'),
      files = grunt.file.expandFiles(pattern);

    // don't load up under special path, like an immediate `templates/` dirname
    files = files.filter(function(file) {
      return path.basename(path.dirname(file)) !== 'templates';
    });

    return files.map(function(filepath) {
      var shorten = filepath.slice(prefix.length + 1),
        namespace = shorten.split(path.join('/')).slice(0, -1).join(':'),
        mod;

      try {
        mod = require(filepath);
      } catch(e) {
        if(!(/Cannot find module ['"]yeoman['"]/.test(e.message))) {
          // not a yeoman loading issue? bubble up the exception
          throw e;
        }

        console.log('[Error] loading generator at', filepath);
        console.log('Make sure you have the yeoman module installed locally:');
        console.log();
        console.log('  npm install yeoman');
        console.log();
        console.log();
      }

      return {
        root: prefix,
        path: shorten,
        fullpath: filepath,
        module: mod,
        namespace: namespace
      }
    });
  });

  // reduce it down to a single array
  found = found.reduce(function(a, b) {
    a = a.concat(b);
    return a;
  }, []);

  // filter out non generator based module
  found = found.filter(function(generator) {
    if(typeof generator.module !== 'function') return false;
    generator.instance = new generator.module(args, options, config);
    return generator.instance instanceof generators.Base;
  }).sort(function(a, b) {
    return a.namespace < b.namespace;
  });

  // and ensure we won't return same generator on different namespace
  var paths = [];
  return found.filter(function(generator) {
    var known = !~paths.indexOf(generator.fullpath);
    paths.push(generator.fullpath);
    return known;
  });
};

// Convert namespaces to paths by replacing ":" for "/".
generators.namespacesToPaths = function namespacesToPaths(namespaces) {
  return namespaces.map(function(namespace) {
    return namespace.split(':').join('/');
  });
};
