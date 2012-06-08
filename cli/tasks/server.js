
var path = require('path'),
  connect = require('connect');

module.exports = function(grunt) {

  // Note: yeoman-server alone will exit prematurly unless `this.async()` is
  // called. The task is designed to work alongside the `watch` task.
  grunt.registerTask('yeoman-server', 'Launch a preview, LiveReload compatible server', function() {
    // Get values from config, or use defaults.
    var port = grunt.config('server.port') || 35729,
      base = path.resolve(grunt.config('server.base') || '.');

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

  // Retain grunt's built-in server task.
  grunt.renameTask('server', 'grunt-server')

  // The server task always run with the watch task, this is done by
  // aliasing the server task to the relevant set of task to run.
  grunt.registerTask('server', 'yeoman-server watch');

};
