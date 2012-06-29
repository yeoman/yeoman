
var util = require('util'),
  events = require('events'),
  actions = require('./actions'),
  _ = require('underscore');

module.exports = Base;

function Base(args, options) {
  events.EventEmitter.call(this);
  this.args = args;
  this.options = options;
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


