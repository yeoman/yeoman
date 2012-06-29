
var util = require('util'),
  events = require('events'),
  actions = require('./actions'),
  _ = require('underscore');

module.exports = Base;

function Base(args, options) {
  events.EventEmitter.call(this);
  this.args = args;
  this.options = options;

  this.arguments = [];
}

util.inherits(Base, events.EventEmitter);

// "include" the actions module
_.extend(Base.prototype, actions);


// Receives a name and invokes it. The name is a string (either "method" or
// "namespace:method"). You can also supply the arguments, options and
// configuration values for the method to be invoked, if none is given, the
// same values used to initialize the invoker are used to initialize the
// invoked.
//
// XXX curently, all is asumed to be run synchronously. We may have the need to
// run async thing, if that's so, always assume a method is synchronous unless
// a special this.async() handler is invoked (like Grunt).

Base.prototype.invoke = function invoke(name, config) {
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

Base.prototype.argument = function argument(name, config) {
  console.log('create arg', name, config);
  var self = this;

  this.arguments.push({
    name: name,
    config: config
  });

  // create the accesor for this named argument, its value is direcly tied to
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


