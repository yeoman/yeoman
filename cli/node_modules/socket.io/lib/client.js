
/**
 * Module dependencies.
 */

var parser = require('socket.io-client').parser
  , EventEmitter = require('events').EventEmitter

/**
 * Client constructor.
 *
 * @api public
 */

function Client (id, server) {
  this.id = id;
  this.acks = {};
  this.store = server.store;

  var self = this;

  store.subscribe(id, function (packet) {
    
  });

  store.subscribe(id + '.disconect', function () {
    self.onDisconnect();
  });
}

/**
 * Inherits from EventEmitter.
 */

Client.prototype.__proto__ = EventEmitter.prototype;

/**
 * Save reference to original `emit`.
 *
 * @api private
 */

Client.prototype._emit = Client.prototype.emit;

/**
 * Broadcast flag.
 *
 * @api public
 */

Client.prototype.__defineGetter__('broadcast', function () {
  this.flags.broadcast = true;
});

/**
 * JSON flag (deprecated)
 *
 * @api public
 */

Client.prototype.__defineGetter__('json', function () {
  this.flags.broadcast = true;
});

/**
 * Joins a group.
 *
 * @param {String} group
 * @return {Client} for chaining
 * @api public
 */

Client.prototype.join = function (group, fn) {
  if (!~this.subscriptions.indexOf(group)) {
    var self = this;
    this.subscriptions.push(group);
    this.store.addToGroup(group, this.sid, function (ev, args) {
      self.onGroupEvent(ev, args);
    }, fn);
  } else {
    fn && fn();
  }

  return this;
};

/**
 * Leaves a group.
 *
 * @return {Client} for chaining
 * @api public
 */

Client.prototype.leave = function (group) {
  var index = this.subscriptions.indexOf(group);
  if (~index) {
    this.subscriptions.splice(index, 1);
  }
  return this;
};

Client.prototype.disconnect = function () {
  if (this.socket) {
    this.socket.disconnect();
  } else {
    this.publish('disconnect');
  }
}

/**
 * Called upon disconnect.
 *
 * @api private
 */

Client.prototype.onDisconnect = function () {
  for (var i = 0, l = this.subscriptions; i < l; i++) {
    this.store.removeFromGroup(id, group, fn);
  }
};

/**
 * Registers ACK.
 */

Client.prototype.ack = function (fn, callback) {
  this.subscribe('ack');
};

/**
 * Emits an event.
 */

Client.prototype.emit = function () {
  var args = toArray(arguments), fn;

  if ('function' == typeof args[args.length - 1]) {
    fn = args.pop();
  }

  var data = args.shift();
  if (args.length) {
    data += '\n' + JSON.stringify(args);
  }

  if (fn) {
    this.ack(fn, function (id) {
      self.sendPacket('event', data, id);
    });
  } else {
    this.sendPacket('event', data);
  }

  return this;
};

/**
 * Sends a packet.
 */

Client.prototype.sendPacket = function (type, data, id) {
  var data = parser.encode({ type: type, data: data, id: id });

  if (this.server.sockets[id]) {
    this.server.sockets[id].write(data);
  }
};
