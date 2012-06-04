
var path = require('path'),
  connect = require('connect');

module.exports = function(grunt) {

  grunt.registerTask('server', 'Launch a preview, LiveReload compatible server', function() {
    // Get values from config, or use defaults.
    var port = grunt.config('server.port') || 35729,
      base = path.resolve(grunt.config('server.base') || '.');

    // This task is asynchronous, even though we don't actually call it.
    // This ensures Grunt won't exit with this "long-running" task.
    var cb = this.async();

    var middleware = [
      // Serve static files.
      connect.static(base),
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

    connect.apply(null, middleware).listen(port);
  });

};
