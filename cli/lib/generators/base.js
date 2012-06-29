
var util = require('util'),
  events = require('events'),
  actions = require('./actions'),
  _ = require('underscore');

module.exports = Base;

function Base(args, options, config) {
  events.EventEmitter.call(this);
  this.args = args;
  this.config = config || {};

  // setup default options
  // XXX most of these values are not used yet. Are here as reference to some of
  // the rails default options.
  this.options = _.defaults(options, {
    assets: true,
    javascripts: true,
    stylesheets: true,
    'javascript-engine': 'js',
    'stylesheet-engine': 'sass',
    'template-engine': 'handlebars',
    'test-framework': 'jasmine'
  });

  this.arguments = [];
}

util.inherits(Base, events.EventEmitter);

// "include" the actions module
_.extend(Base.prototype, actions);


// Runs all methods in this given generator.
// "namespace:method"). You can also supply the arguments for the method to be
// invoked, if none is given, the same values used to initialize the invoker
// are used to initialize the invoked.
//
// XXX curently, all is asumed to be run synchronously. We may have the need to
// run async thing, if that's so, always assume a method is synchronous unless
// a special this.async() handler is invoked (like Grunt).

Base.prototype.run = function run(name, config) {
  var args = config.args || this.args,
    opts = config.options || this.options,
    self = this;

  var methods = Object.keys(this.__proto__);
  methods.forEach(function(method) {
    console.log('..', method, '..');
    self[method].apply(self, args);
  });
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
//   yeoman generate --name=NAME
//
// Besides, arguments are used inside your code as an accessor (self.argument),
// while options are all kept in a hash (self.options).
//
// Options
// -------
//
// desc     - (todo) Description for the argument.
// required - If the argument is required or not.
// optional - (todo) If the argument is optional or not.
// type     - (todo) The type of the argument, can be :string, :hash, :array, :numeric.
// default  - (todo) Default value for this argument. It cannot be required
//             and have default values.
// banner   - (todo) String to show on usage notes.
//
//

Base.prototype.argument = function argument(name, config) {
  // config handling. Should probably be breaked up in its own Argument class,
  // like Thor does.
  config.name = name;
  _.defaults(config, {
    required: true,
    type: String
  });

  config.banner = config.banner || this.bannerFor(config);

  this.arguments.push({
    name: name,
    config: config
  });

  // create the accessor for this named argument, its value is direcly tied to
  // the position of the given argument, and the order of specified arguments
  // for this class.
  this.__defineGetter__(name, function() {
    var position = -1;
    this.arguments.forEach(function(arg, i) {
      if(position !== -1) return;
      if(arg.name === name) position = i;
    });

    // a bit of coercion and type handling, to be improved (just dealing with
    // Array / String, default is assumed to be String.)
    //
    // XXX add handling for Number, Array, String, Object (aka hash object)
    return config.type === Array ? this.args.slice(position) : this.args[position];
  });
};



// Invoke a generator based on the value supplied by the user to the
// given option named "name". An option is created when this method
// is invoked and you can set a hash to customize it.

Base.prototype.hookFor = function hookFor(name, config) {
  // resolve the name of our hook. This can be defined through cli options or
  // via Gruntfile's generators config.
  name = this.defaultFor(name);

  // and try to invoke the generator, looking up for hook:context
  this.invoke(name + ':' + this.generatorName, this.args, this.options, this.config);
};

// Return the default value for the option name given doing a lookup in
// cli options and Gruntfile's generator config.
Base.prototype.defaultFor = function defaultFor(name) {
  var config = this.config.generators;
  if(this.options[name]) name = this.options[name]
  else if(config && config[name]) name = config[name];
  return name;
};


// Generate the default banner for help output, depending on argument type
// XXX should probably be breaked up in its own Argument class, like Thor does.
Base.prototype.bannerFor = function defaultFor(config) {
  return config.type === Boolean ? '' :
    config.type === String ? config.name.toUpperCase() :
    config.type === Number ? 'N' :
    config.type === Object ? 'key:value' :
    config.type === Array ? 'one two three' :
    ''
};
