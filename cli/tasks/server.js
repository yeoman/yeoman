
var fs = require('fs'),
  path = require('path'),
  util = require('util'),
  http = require('http'),
  events = require('events'),
  colors = require('colors'),
  connect = require('connect'),
  WebSocket = require('faye-websocket'),
  open = require('open'),
  WeakMap = require('es6-collections').WeakMap;

module.exports = function(grunt) {
  var priv = new WeakMap();

  // Reactor object
  // ==============

  // Somewhat a port of guard-livereload's Reactor class
  // https://github.com/guard/guard-livereload/blob/master/lib/guard/livereload/reactor.rb
  //
  // XXX may very well go into our lib/ directory (which needs a good cleanup)

  function Reactor(options) {
    this.sockets = {};

    if ( !options.server ) {
      throw new Error('Missing server option');
    }

    this.server = options.server;

    if ( !( this.server instanceof http.Server ) ) {
      throw new Error('Is not a valid HTTP server');
    }

    this.options = options || {};
    this.uid = 0;

    this.start(options);
  }

  util.inherits(Reactor, events.EventEmitter);

  // send a reload command on all stored web socket connection
  Reactor.prototype.reload = function reload(files) {
    var sockets = this.sockets,
      changed = files.changed;

    // go through all sockets, and emit a reload command
    Object.keys(sockets).forEach(function(id) {
      var ws = sockets[id],
        version = ws.livereloadVersion;

      // go throuh all the files that has been marked as changed by grunt
      // and trigger a reload command on each one, for each connection.
      changed.forEach(this.reloadFile.bind(this, version));
    }, this);
  };

  Reactor.prototype.reloadFile = function reloadFile(version, filepath) {
    // > as full as possible/known, absolute path preferred, file name only is
    // > OK
    filepath = path.resolve(filepath);

    // support both "refresh" command for 1.6 and 1.7 protocol version
    var data = version === '1.6' ? ['refresh', {
      path: filepath,
      apply_js_live: true,
      apply_css_live: true
    }] : {
      command: 'reload',
      path: filepath,
      liveCSS: true,
      liveJS: true
    };

    this.send(data);
  };

  Reactor.prototype.start = function start() {
    // setup socket connection
    this.server.on('upgrade', this.connection.bind(this));
  };

  Reactor.prototype.connection = function connection(request, socket, head) {
    var ws = new WebSocket(request, socket, head),
      wsId = this.uid = this.uid + 1;

    // store the new connection
    this.sockets[wsId] = ws;

    ws.onmessage = function(event) {
      // message type
      if ( event.type !== 'message' ) {
        return console.warn('Unhandled ws message type');
      }

      // parse the JSON data object
      var data = this.parseData(event.data);

      // attach the guessed livereload protocol version to the sokect object
      ws.livereloadVersion = data.command ? '1.7' : '1.6';

      // data sent wasn't a valid JSON object, assume version 1.6
      if ( !data.command ) {
        return ws.send('!!ver:1.6');
      }

      // valid commands are: url, reload, alert and hello for 1.7

      // first handshake
      if ( data.command === 'hello' ) {
        return this.hello( data );
      }

      // livereload.js emits this
      if ( data.command === 'info' ) {
        return this.info( data );
      }
    }.bind(this);

    ws.onclose = function() {
      ws = null;
      delete this.sockets[wsId];

      priv.set(this, {
        ws: null
      });
    }.bind(this);

    priv.set(this, {
      ws: ws
    });
  };

  Reactor.prototype.parseData = function parseData(str) {
    var data = {};
    try {
      data = JSON.parse(str);
    } catch (e) {}
    return data;
  };

  Reactor.prototype.hello = function hello() {
    this.send({
      command: 'hello',
      protocols: [
        'http://livereload.com/protocols/official-7'
      ],
      serverName: 'yeoman-livereload'
    });

  };

  // noop
  Reactor.prototype.info = function info() {};

  Reactor.prototype.send = function send(data) {
    var ws = priv.get(this).ws;

    ws.send(JSON.stringify(data));
  };


  // Tasks & Helpers
  // ===============

  // Retain grunt's built-in server task.
  grunt.renameTask('server', 'grunt-server');

  // The server task always run with the watch task, this is done by
  // aliasing the server task to the relevant set of task to run.
  grunt.registerTask('server', 'yeoman-server watch');

  // Reload handlers
  // ---------------

  // triggered by a watch handler to emit a reload event on all livereload
  // established connection
  grunt.registerTask('reload', '(internal) livereload interface', function() {
    // get the reactor instance
    var reactor = grunt.helper('reload:reactor');

    // and send a reload command to all browsers
    reactor.reload(grunt.file.watchFiles);
  });

  // Factory for the reactor object
  var reactor;
  grunt.registerHelper('reload:reactor', function(options) {
    if ( options && !reactor ) {
      reactor = new Reactor( options );
    }
    return reactor;
  });


  // Server
  // ------

  // Note: yeoman-server alone will exit prematurly unless `this.async()` is
  // called. The task is designed to work alongside the `watch` task.
  grunt.registerTask('server', 'Launch a preview, LiveReload compatible server', function(target) {
    var opts;
    // Get values from config, or use defaults.
    var port = grunt.config('server.port') || 0xDAD;

    // async task, call it (or not if you wish to use this task standalone)
    var cb = this.async();

    // valid target are app (default), prod and test
    var targets = {
      // these paths once config and paths resolved will need to pull in the
      // correct paths from config
      app: path.resolve('app'),
      dist: path.resolve('dist'),
      test: path.resolve('test'),

      // phantom target is a special one: it is triggered
      // before launching the headless tests, and gives
      // to phantomjs visibility on the same paths a
      // server:test have.
      phantom: path.resolve('test'),

      // reload is a special one, acting like `app` but not opening the HTTP
      // server in default browser and forcing the port to LiveReload standard
      // port.
      reload: path.resolve('app')
    };

    target = target || 'app';

    // yell on invalid target argument
    if(!targets[target]) {
      grunt
        .log.error('Not a valid target: ' + target)
        .writeln('Valid ones are: ' + grunt.log.wordlist(Object.keys(targets)));
      return false;
    }

    var tasks = {
      // We do want our coffee, and compass recompiled on change
      // and our browser opened and refreshed both when developping
      // (app) and when writing tests (test)
      app: 'clean coffee compass open-browser watch',
      test: 'clean coffee compass open-browser watch',
      // Before our headless tests are run, ensure our coffee
      // and compass are recompiled
      phantom: 'clean coffee compass',
      dist: 'watch',
      reload: 'watch'
    };

    opts = {
      // prevent browser opening on `reload` target
      open: target !== 'reload',
      // and force 35729 port no matter what when on `reload` target
      port: target === 'reload' ? 35729 : port,
      base: targets[target],
      inject: true,
      target: target,
      hostname: grunt.config('server.hostname') || 'localhost'
    };

    grunt.helper('server', opts, cb);

    grunt.registerTask('open-browser', function() {
        if ( opts.open ) {
          open( 'http://' + opts.hostname + ':' + opts.port );
        }
    });

    grunt.task.run( tasks[target] );
  });

  grunt.registerHelper('server', function(opts, cb) {
    cb = cb || function() {};

    var middleware = [];

    // add the special livereload snippet injection middleware
    if ( opts.inject ) {
      middleware.push( grunt.helper('reload:inject', opts) );
    }

    // also serve static files from the temp directory, and before the app
    // one (compiled assets takes precedence over same pathname within app/)
    middleware.push(connect.static(path.join(opts.base, '../temp')));
    // Serve static files.
    middleware.push(connect.static(opts.base));
   // Make empty directories browsable.
    middleware.push(connect.directory(opts.base));

    if ( (opts.target === 'test') || ( opts.target === 'phantom')) {
      // We need to expose our code as well
      middleware.push(connect.static(path.resolve('app')));
      // Make empty directories browsable.
      middleware.push(connect.directory(path.resolve('app')));
    }

    middleware = middleware.concat([
      // Serve the livereload.js script
      connect.static(path.join(__dirname, 'livereload')),
      // To deal with errors, 404 and alike.
      grunt.helper('server:errorHandler', opts),
      // Connect error handler (for better looking error pages)
      connect.errorHandler()
    ]);

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

    return connect.apply(null, middleware)
      .on('error', function( err ) {
        if ( err.code === 'EADDRINUSE' ) {
          return this.listen(0); // 0 means random port
        }

        // not an EADDRINUSE error, buble up the error
        cb(err);
      })
      .listen(opts.port, function() {
        var port = this.address().port;

        // Start server.
        grunt.log
          .subhead( 'Starting static web server on port '.yellow + String( port ).red )
          .writeln( '  - ' + path.resolve(opts.base) )
          .writeln('I\'ll also watch your files for changes, recompile if neccessary and live reload the page.')
          .writeln('Hit Ctrl+C to quit.');

        // create the reactor object
        grunt.helper('reload:reactor', {
          server: this,
          apiVersion: '1.7',
          host: opts.hostname,
          port: port
        });

        cb(null, port);
      });
  });


  // Error handlers
  // --------------

  // Grunt helper providing a connect middleware focused on dealing with
  // errors. Assuming this middleware is at the bottom of your stack, deals
  // with incoming request as 404 errors. It then tries to add a more
  // meaningful message, based on provided `options`.
  //
  // - opts       - Hash of options where
  //    - base    - is the base directory and helps to determine a more
  //                specific message
  //    - target  - The base target name (app, dist, test) to act upon
  //
  //
  // If a grunt helper with a `server:error:<target>` name is registered,
  // invoke it, passing in the original error and associated pathname.
  //
  // It changes the exports.title property used internally by
  // connect.errorHandler (to update the Page title to be Yeoman instead of
  // Connect).
  //
  // In a next step, we might want to craft our own custom errorHandler, based
  // on http://www.senchalabs.org/connect/errorHandler.html to customize a bit
  // more.
  grunt.registerHelper('server:errorHandler', function(opts) {
    opts = opts || {};
    opts.target = opts.target || 'app';
    connect.errorHandler.title = 'Yeoman';
    return function errorHandler(req, res, next) {
      // Figure out the requested path
      var pathname = req.url;
      // asume 404 all the way.
      var err = connect.utils.error(404);
      err.message = pathname + ' ' + err.message;

      // Using events would be better here, but the `res.socket.server`
      // instance doesn't seem to be same than the one returned by connect()
      if(grunt.task._helpers['server:error:' + opts.target]) {
        grunt.helper('server:error:' + opts.target, err, pathname);
      }

      // go next, and pass in the crafted error object
      next(err);
    };
  });

  // Target specific error handlers. Alter the error object as you see fit.
  grunt.registerHelper('server:error:dist', function(err, pathname) {
    // handle specific pathname here, `/` on dist target as special meaning.
    // Most likely missing a build run.
    if(pathname === '/') {
      err.message = 'Missing /dist folder.';
      // connect middleware slice at position 1, append an Empty String (usually Error: err.message)
      err.stack = [
        '',
        'You need to run yeoman build first.',
        '',
        '<code>yeoman build</code>'
      ].join('\n');
    }
  });


  // LiveReload
  // ----------
  //
  // XXX Reactor and this inject middleware should be put in `livereload/*.js`.
  // At some point, it might be reanmed from `livereload/` to `server/`, and
  // put any non specific grunt piece of code (like the few connect middleware
  // in there) in this folder, with multiple files. Then, the grunt.helper is
  // registered using `grunt.registerHelper('reload:inject', require('./server/inject'))`


  // Grunt helper returning a valid connect / express middleware.  Its job is
  // to setup a middleware right before the usual static one, and to bypass the
  // response of `.html` file to render them with additional scripts.
  grunt.registerHelper('reload:inject', function(opts) {
    opts = opts || {};

    return function inject(req, res, next) {

      // build filepath from req.url and deal with index files for trailing `/`
      var filepath = req.url.slice(-1) === '/' ? req.url + 'index.html' : req.url;

      // if ext is anything but .html, let it go through usual connect static
      // middleware.
      if ( path.extname( filepath ) !== '.html' ) {
        return next();
      }

      var port = res.socket.server.address().port;

      // setup some basic headers, at this point it's always text/html anyway
      res.setHeader('Content-Type', connect.static.mime.lookup(filepath));

      // can't use the ideal stream / pipe case, we need to alter the html response
      // by injecting that little livereload snippet
      filepath = path.join(opts.base, filepath.replace(/^\//, ''));
      fs.readFile(filepath, 'utf8', function(e, body) {
        if(e) {
          // go next and silently fail
          return next();
        }

        body = body.replace(/<\/body>/, function(w) {
          return [
            "<!-- yeoman livereload snippet -->",
            "<script>document.write('<script src=\"http://'",
            " + (location.host || 'localhost').split(':')[0]",
            " + ':" + port + "/livereload.js?snipver=1\"><\\/script>')",
            "</script>",
            "",
            w
          ].join('\n');
        });

        res.end(body);
      });
    };

  });
};
