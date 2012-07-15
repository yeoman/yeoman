
var fs = require('fs'),
  path = require('path'),
  util = require('util'),
  events = require('events'),
  wiring = require('./wiring'),
  actions = require('./actions'),
  _ = require('underscore'),
  grunt = require('grunt');

module.exports = Base;

function Base(args, options, config) {
  events.EventEmitter.call(this);
  this.args = args || [];
  this.config = config || {};

  this.description = '';

  // setup default options
  // XXX most of these values are not used yet. Are here as reference to some of
  // the rails default options.
  this.options = _.defaults(options || {}, {
    assets: true,
    javascripts: true,
    stylesheets: true,
    'javascript-engine': 'yeoman:js',
    'stylesheet-engine': 'sass',
    'template-engine': 'handlebars',
    'test-framework': 'jasmine',

    // we use js-framework here to hook into bootstrap js plugins by default
    // but it might very well be done a bit differently (or we consider bootstrap
    // as we would consider backbone or amber)
    //
    // We may use a different hook, or handle the bootstrap scaffolding directly here.
    'js-framework': 'ember'
  });

  // holder for parsed arguments
  this._arguments = [];

  // holder for parsed options
  this._options = [];

  // holder for hooks
  this._hooks = [];

  // init general options, these are common to all generators
  this.option('help', {
    alias: 'h',
    desc: 'Print generator\'s options and usage'
  });
}

util.inherits(Base, events.EventEmitter);

// "include" the actions module
_.extend(Base.prototype, actions);

// "include" the wiring module
_.extend(Base.prototype, wiring);

// Runs all methods in this given generator. You can also supply the arguments
// for the method to be invoked, if none is given, the same values used to
// initialize the invoker are used to initialize the invoked.
Base.prototype.run = function run(args, cb) {
  if(!cb) cb = args, args = this.args;
  cb = cb || function() {};

  var self = this;

  this._running = true;

  var methods = Object.keys(this.__proto__);
  (function next(method) {
    if(!method) return self.runHooks(cb);

    // prevent specific methods from running. This include any private-like
    // method (prefixed with _) and coffee-specific method like constructor.
    if(method.charAt(0) === '-') return next(methods.shift());
    if(method.constructor === '-') return next(methods.shift());

    // very very basic async management, could be done better using event and
    // EventEmitter ability of Generators.
    var wait = false;
    self.async = function async() {
      wait = true;
      return function(err) {
        if(err) self.emit('error', err);
        next(methods.shift());
      };
    };

    // run the given method
    self[method].apply(self, args);

    // async wasn't called, assume synchronous behaviour, go next right away
    if(!wait) next(methods.shift());

  })(methods.shift());
};

// Go through all registered hooks, and invoke them in series
Base.prototype.runHooks = function runHooks(cb) {
  var self = this,
    hooks = this._hooks;

  (function next(hook) {
    if(!hook) return cb();

    var resolved = self.defaultFor(hook.name),
      gruntConfig = hook.config || self.config,
      options = hook.options || self.options,
      context = hook.as || self.generatorName,
      args = hook.args || self.args;

    self.invoke(resolved + ':' + context, args, options, gruntConfig, function(err) {
      if(err) return cb(err);
      next(hooks.shift());
    });

  })(hooks.shift());
};


//
// Adds an argument to the class and creates an attribute getter for it.
//
// Arguments are different from options in several aspects. The first one
// is how they are parsed from the command line, arguments are retrieved
// from position:
//
//   yeoman generate NAME
//
// Instead of:
//
//   yeoman generate --name NAME
//
// Besides, arguments are used inside your code as a property (this.argument),
// while options are all kept in a hash (this.options).
//
// Options
// -------
//
// desc     - Description for the argument.
// required - If the argument is required or not.
// optional - If the argument is optional or not.
// type     - The type of the argument, can be String, Number, Array, Object
//            (in which case considered as an Hash object, key:value).
// defaults - Default value for this argument. It cannot be required
//             and have default values.
// banner   - String to show on usage notes.
//
Base.prototype.argument = function argument(name, config) {
  config = config || {};
  // config handling. Should probably be put in its own Argument class,
  // like Thor does.
  config.name = name;
  _.defaults(config, {
    required: true,
    type: String
  });

  config.banner = config.banner || this.bannerFor(config);

  this._arguments.push({
    name: name,
    config: config
  });

  var position = -1;
  this._arguments.forEach(function(arg, i) {
    if(position !== -1) return;
    if(arg.name === name) position = i;
  });

  // a bit of coercion and type handling, to be improved (just dealing with
  // Array / String, default is assumed to be String.)
  //
  // XXX add handling for Number, Array, String, Object (aka hash object)
  var value = config.type === Array ? this.args.slice(position) : this.args[position];
  value = position >= this.args.length ? config.defaults : value;

  this[name] = value;
  return this;
};

// Adds an option to the set of generator expected options, only used to
// generate generator usage. By default, generators get all the cli option
// parsed by nopt as a this.options Hash object.
//
// - name       - The name of the argument
// - options    - Hash of configuration values where:
//   - desc     -- Description for the argument.
//   - type     -- Type for this argument, either Boolean, String or Number.
//   - default  -- Default value for this argument.
//   - banner   -- String to show on usage notes.
//   - hide     -- If you want to hide this option from the help.
//
Base.prototype.option = function option(name, config) {
  config = config || {};
  // config handling. Should probably be put in its own Argument class,
  // like Thor does.
  config.name = name;

  _.defaults(config, {
    desc: 'Description for ' + name,
    type: Boolean,
    defaults: false,
    hide: false
  });

  // avoid duplicated option, update existing one
  var opt = this._options.filter(function(o) {
    return o.name === name;
  })[0];

  if(!opt) this._options.push(config);
  else opt = config;

  return this;
};


// Register a hook to invoke a generator based on the value supplied by
// the user to the given option named "name". An option is created when
// this method is invoked and you can set a hash to customize it.
//
// Must be called within the constructor only.
Base.prototype.hookFor = function hookFor(name, config) {
  config = config || {};

  // enforce use of hookFor during instantiation
  if(this._running) {
    return this.emit('error', new Error(
      'hookFor must be used within the constructor only'
    ));
  }

  // add the corresponding option to this class, so that we output these hooks
  // in help
  this.option(name, {
    desc: _.humanize(name) + ' to be invoked',
    defaults: this.options[name] || ''
  });

  this._hooks.push(_.defaults(config, {
    name: name
  }));
};

// Return the default value for the option name given doing a lookup in
// cli options and Gruntfile's generator config.
Base.prototype.defaultFor = function defaultFor(name) {
  var config = this.config.generators;
  if(this.options[name]) name = this.options[name];
  else if(config && config[name]) name = config[name];
  return name;
};


// Generate the default banner for help output, depending on argument type
// XXX should probably be breaked up in its own Argument class, like Thor does.
Base.prototype.bannerFor = function bannerFor(config) {
  return config.type === Boolean ? '' :
    config.type === String ? config.name.toUpperCase() :
    config.type === Number ? 'N' :
    config.type === Object ? 'key:value' :
    config.type === Array ? 'one two three' :
    '';
};


// Defines the usage and the description of this class.
Base.prototype.desc = function desc(description) {
  this.description = description || '';
  return this;
};

// Tries to get the description from a USAGE file one folder above the source
// root otherwise uses a default description.
Base.prototype.help = function help() {
  var filepath = path.join(this.generatorPath, 'USAGE'),
    exists = path.existsSync(filepath),
    self = this;

  var out = [
    'Usage:',
    '  ' + this.usage(),
    ''
    // exists ? '' : 'Description:',
    // exists ? fs.readFileSync(filepath, 'utf8') : '\n  ' +
    //   (this.description || 'Create files for ' + this.generatorName + ' generator.')
  ];

  // build options
  if(this._options.length) {
    out = out.concat([
      'Options:',
      this.optionsHelp(),
      ''
    ]);
  }

  // append USAGE file is any
  if(exists) {
    out.push(fs.readFileSync(filepath, 'utf8'));
  }

  return out.join('\n');
};

// Output usage information for this given class, depending on its arguments /
// options / hooks
Base.prototype.usage = function usage() {
  var args = this._arguments.map(function(arg) {
    return arg.config.banner;
  }).join(' ');

  var options = this._options.length ? '[options]' : '',
    name = this.namespace === 'yeoman:app' ? '' : this.namespace + ' ',
    cmd = this.namespace === 'yeoman:app' ? 'new' : 'generate';

  name = name.replace(/^yeoman:/, '');

  var out = 'yeoman ' + cmd + ' ' + name + args + ' ' + options;
  if(this.description) out += '\n\n' + this.description;
  return out;
};

// print the list of options in formatted table
Base.prototype.optionsHelp = function optionsHelp() {
  var self = this,
    widths = [],
    options = [],
    rows = [],
    out = '',
    pad = 0;

  options = this._options.filter(function(o) {
    return !o.hide;
  });

  var hookOpts = this._hooks.map(function(hook) {
    return hook.generator && hook.generator._options;
  }).reduce(function(a, b) {
    a = a.concat(b);
    return a;
  }, []).filter(function(opts) {
    return opts && opts.name !== 'help';
  });

  rows = options.concat(hookOpts).map(function(o) {
    return [
      '',
      o.alias ? '-' + o.alias + ', ' : '',
      '--' + o.name,
      o.desc ? '# ' + o.desc : '',
      o.defaults == null ? '' : 'Default: ' + o.defaults
    ];
  });

  widths = [
    2,
    _.max(rows.map(function(row) { return row[1].length; })),
    _.max(rows.map(function(row) { return row[2].length; })) + 2,
    _.max(rows.map(function(row) { return row[3].length; })) + 2
  ];

  pad = new Array(widths.slice(0, 3).reduce(function(a, b) {
    return a + b;
  }, 1)).join(' ');

  out += rows.map(function(row) {
    var defaults = row[4] ? '\n' + pad + '# ' + row[4] : '';
    return self.log.table(widths, row) + defaults;
  }).join('\n');

  return out;
};


