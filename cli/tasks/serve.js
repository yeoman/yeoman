
var fs = require('fs'),
  path = require('path'),
  connect = require('connect'),
  socketio = require('socket.io');

// client-side socket-io script
var ioScript = fs.readFileSync(path.join(__dirname, '../lib/support/reload.js'), 'utf8');

module.exports = function(grunt) {

  grunt.registerTask('server', 'Start a custom static web server.', function(target) {
    if(!grunt.config('server')) grunt.config('server', {
      staging: { port: 3000, base: 'intermediate/' },
      output: { port: 3001, base: 'publish/' }
    });

    if(target) this.requiresConfig('server.' + target);
    // long running process
    var cb = this.async();
    // Project configuration.
    var config = grunt.config('server');
    // if reload flag is setup, in server config or via `--reload` cli option
    // then starts a socket.io server instead
    var reload = config.reload || grunt.option('reload');
    // the helper name to use
    var helper = reload ? 'serve.io' : 'serve';

    // start the webserver(s)
    if(target) return grunt.helper(helper, config[target]);
    grunt.helper(helper, config.staging);
    grunt.helper(helper, config.output);
  });

  // **serve** creates and returns a basic application server, a configuration
  // object may be passed where:
  //
  // - base   - is the base directory to server static file from
  // - port   - server listen to this port
  grunt.registerHelper('server', function(config) {
    config = config || {};
    var base = config.base || './',
      port = config.port || 8000,
      app = connect();

    app.listen(port, function(err) {
      if(err) grunt.log.error(err).warn(err.message, err.code);
      grunt.log.ok('Started static web server in ' + base.underline.bold + ' on port ' + (port + '').green + '...');
      app.emit('start');
    });

    return app;
  });

  // **serve.io** creates and returns a webserver and setup a socket.io instance and 
  // the "inject" middleware. `/socket.io/socket.io.js` and `/relod.js` are
  // then available.
  grunt.registerHelper('serve.io', function serve(config) {
    // start on given port / base
    var app = grunt.helper('server', config);

    app
      .use(grunt.helper('inject.io', config))
      .use(connect.static(config.base));

    // setup scoket.io
    var io = socketio.listen(app);
    io.set('log level', config.loglevel || 1);
    // and return socket.io server instance
    return io;
  });

  // **serve** same as serve.io, without the socket.io connection and inject
  // middleware.
  grunt.registerHelper('serve', function serve(config) {
    return grunt.helper('server', config)
      .use(connect.static(config.base));
  });

  // **inject.io** is a grunt helper returning a valid connect / express middleware.
  // It's job is to setup a middleware right before the usual static one, and to
  // bypass the response of `.html` file to render them with additional scripts.
  grunt.registerHelper('inject.io', function(config) {
    grunt.utils._.defaults(config, {
      hostname: 'localhost'
    });

    return function inject(req, res, next) {
      // build filepath from req.url and deal with index files for trailing `/`
      var filepath = req.url.slice(-1) === '/' ? req.url + 'index.html' : req.url;

      // the client-side template
      var template = grunt.utils._.template(ioScript);

      // deal with our special socket.io client-side script
      if(path.basename(filepath) === 'reload.js') {
        res.setHeader('Content-Type', connect.static.mime.lookup('js'));
        return res.end(template(config));
      }

      // if ext is anything but .html, let it go through usual connect static
      // middleware
      if(path.extname(filepath) !== '.html') return next();

      // setup some basic headers, might add some.
      res.setHeader('Content-Type', connect.static.mime.lookup(filepath));

      // can't use the ideal stream / pipe case, we need to alter the html response
      // by injecting that little socket.io client-side app.
      filepath = path.join(config.base, filepath.replace(/^\//, ''));
      fs.readFile(filepath, function(e, body) {
        if(e) {
          res.writeHead(500);
          return res.end('Error loading' + req.url + '  -- ' + JSON.stringify(e));
        }

        body = body.toString().replace(/<\/script>/, function(w) {
          return [
            w,
            '  <script src="/socket.io/socket.io.js"></script>',
            '  <script src="/reload.js"></script>'
          ].join('\n');
        });

        res.end(body);
      });

      return next();
    };
  });

};
