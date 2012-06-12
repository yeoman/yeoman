
var path = require('path'),
  util = require('util'),
  events = require('events'),
  connect = require('connect'),
  WebSocket = require('faye-websocket');

module.exports = function(grunt) {

  // the msg pattern of the watch task
  var matcher = /File "([^"]+)" ([a-z]+)/;

  // Latest changed file reference, we'll have to be careful about race
  // condition issues
  var changedFile = {};

  // Reactor object
  // ==============

  // Somewhat a port of guard-livereload's Reactor class
  // https://github.com/guard/guard-livereload/blob/master/lib/guard/livereload/reactor.rb
  //
  // XXX may very well go into our lib/ directory (which needs a good cleanup)

  function Reactor(options) {
    this.sockets = {};
    if(!options.server) throw new Error('Missing server option');

    this.server = options.server;
    if(!(this.server instanceof connect.HTTPServer)) throw new Error('Is not a valid HTTP server');

    this.options = options || {};
    this.uid = 0;

    this.start(options);
  }

  util.inherits(Reactor, events.EventEmitter);

  // send a reload command on all stored web socket connection
  Reactor.prototype.reload = function reload(changed) {
    var self = this,
      sockets = this.sockets;

    // go through all sockets, and emit a reload command
    Object.keys(this.sockets).forEach(function(id) {
      var ws = sockets[id],
        version = ws.livereloadVersion;

      // support both "refresh" command for 1.6 and 1.7 protocol version
      var data = version === '1.6' ? ['refresh', {
        path: changed.filepath,
        apply_js_live: true,
        apply_css_live: true
      }] : {
        command: 'reload',
        path: changed.filepath,
        liveCSS: true,
        liveJS: true
      };

      self.send(ws, data);
    });
  };

  Reactor.prototype.start = function start(options) {
    // setup socket connection
    this.server.on('upgrade', this.connection.bind(this));
  };

  Reactor.prototype.connection = function connection(request, socket, head) {
    var ws = new WebSocket(request, socket, head),
      self = this,
      wsId = this.uid + 1;

    // store the new connection
    this.sockets[wsId] = ws;

    ws.onmessage = function(event) {
      // message type
      if(!event.type === 'message') return console.warn('Unhandled ws message type');

      // parse the JSON data object
      var data = self.parseData(event.data);

      // attach the guessed livereload protocol version to the sokect object
      ws.livereloadVersion = data.command ? '1.7' : '1.6';
      // data sent wasn't a valid JSON object, assume version 1.6
      if(!data.command) return ws.send('!!ver:1.6');

      // valid commands are: url, reload, alert and hello for 1.7

      // first handshake
      if(data.command === 'hello') return self.hello(data, ws);

      // livereload.js emits this
      if(data.command === 'info') return self.info(data, ws);
    };

    ws.onclose = function(event) {
      ws = null;
      delete self.sockets[wsId];
    };
  };

  Reactor.prototype.parseData = function parseData(str) {
    var data = {};
    try {
      data = JSON.parse(str);
    } catch (e) {}
    return data;
  };

  Reactor.prototype.hello = function hello(data, ws) {
    this.send(ws, {
      command: 'hello',
      protocols: [
        'http://livereload.com/protocols/official-7'
      ],
      serverName: 'yeoman-livereload'
    });

  };

  // noop
  Reactor.prototype.info = function info(data, ws) {};

  Reactor.prototype.send = function send(ws, data) {
    ws.send(JSON.stringify(data));
  };


  // Tasks & Helpers
  // ===============

  // Retain grunt's built-in server task.
  grunt.renameTask('server', 'grunt-server')

  // The server task always run with the watch task, this is done by
  // aliasing the server task to the relevant set of task to run.
  grunt.registerTask('server', 'yeoman-server watch');

  // Reload handlers
  // ---------------

  // triggered by a watch handler to emit a reload event on all livereload
  // established connection
  grunt.registerTask('reload', '(internal) livereload interface', function(target) {
    // defaults the target to css
    target = target || 'css';

    // get the reactor instance
    var reactor = grunt.helper('reload:reactor');
    // and send a reload command to all browsers
    reactor.reload(changedFile);
  });

  // Factory for the reactor object
  var reactor;
  grunt.registerHelper('reload:reactor', function(options) {
    if(options && !reactor) reactor = new Reactor(options);
    return reactor;
  });


  // Server
  // ------

  // Note: yeoman-server alone will exit prematurly unless `this.async()` is
  // called. The task is designed to work alongside the `watch` task.
  grunt.registerTask('yeoman-server', 'Launch a preview, LiveReload compatible server', function() {
    // Get values from config, or use defaults.
    var port = grunt.config('server.port') || 35729,
      base = path.resolve(grunt.config('server.base') || '.');

    var middleware = [
      // Serve static files.
      connect.static(base),
      // Serve the livereload.js script,
      connect.static(path.join(__dirname, 'livereload')),
      // Make empty directories browsable.
      connect.directory(base)
    ];

    // the connect logger format if --debug was specified. Get values from
    // config or use defaults.
    var format = grunt.config('server.logformat') || (
      '[D] server :method :url :status ' +
      ':res[content-length] - :response-time ms'
    );

    // If --debug was specified, enable logging.
    if (grunt.option('debug')) {
      connect.logger.format('yeoman', format.magenta);
      middleware.unshift(connect.logger('yeoman'));
    }

    // Start server.
    grunt.log
      .subhead('Starting static web server on port ' + port + '.')
      .writeln('Hit Ctrl+C to quit.');

    var server = connect.apply(null, middleware).listen(port);

    // create the reactor object
    grunt.helper('reload:reactor', {
      server: server,
      apiVersion: '1.7',
      host: '0.0.0.0',
      port: port
    });

  });

  // Hacky part.
  //
  // Grunt doesn't easily expose which was file was changed, but it logs the
  // filepath and the status. The idea here is to monkey-patch grunt's writeln
  // method to keep track of the latest watched file.
  //
  // Yes this is hacky, but kinda works ;) Another option would be to override
  // the watch task to find a way to expose to other task the changedFiles
  // object.
  //

  var _writeln = grunt.log.writeln;
  grunt.log.writeln = function writeln (msg) {
    // Check that the msg match the watch task log output
    if(!matcher.test(msg)) return _writeln.apply(grunt.log, arguments);

    // keep track of the latest changed file
    var matches = msg.match(matcher);
    // update the latest changedFile information
    changedFile.pathname = matches[1];
    changedFile.filepath = path.resolve(matches[1]);
    changedFile.status = matches[2];
  };
};
