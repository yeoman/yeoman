var url     = require('url');
var path    = require('path');
var join    = path.join;
var fstream = require('fstream');

module.exports = function(grunt) {

  // Launch a built-in webserver on the specified directory and run confess through phantomjs.
  //
  // This task can be used to run other confess task like performance or css,
  // and can be configured to operate on a specific subdirectory.
  //
  // - task   - first task argument is used to specify the confess task to run
  //            (default: appcache)
  // - basdir - base directory of the app to cache (default: './')
  //
  // Examples
  //
  //    grunt manifest
  //    grunt manifest:appcache:path/to/my/app
  //    grunt manifest:performance:app
  //    grunt manifest:performance:temp
  //
  // Advanced options can be configured below for expected options. Can be configures in the application gruntfile.
  //
  // Examples
  //
  //    manifest: {
  //      task: 'appcache',
  //      output: 'manifest.appcache',
  //      port: 3501,
  //      hostname: 'localhost',
  //      base: 'app/'
  //    }
  //
  //
  grunt.registerTask('manifest', 'Generates an application cache manifest using Confess.js.', function() {
    // port of the url to cache
    var port = grunt.config('server.port') || 3501;

    // default options
    var options = grunt.util._.defaults(grunt.config(this.name) || {}, {
      // confess task, set via first grunt task arg (default: appcache)
      // performance, appcache, cssproperties
      task: this.args[0] || 'appcache',
      // output file
      output: 'manifest.appcache',
      // port of the url to cache,
      port: port,
      // hostname of the url to cache
      hostname: 'localhost',
      // basedir
      base: path.resolve(this.args[1] || './'),
      // if the browser should be "opened" to the app to cache
      open: false,
      // if the reload snippet from livereload should be injected or not
      inject: false
    });

    // Tell grunt this task is asynchronous.
    var done = this.async();

    // start a webserver at the specified location
    grunt.helper('server', options, function(err, port) {
      if(err) {
        return done( err );
      }

      options.port = port;
      grunt.helper('manifest', options, done);
    });

  });

  grunt.registerHelper('manifest', function(options, done) {
    // base directory for confess files
    var support  = join(__dirname, '../lib/support/');

    // default options
    grunt.util._.defaults(options, {
      url: url.format({
        protocol: 'http',
        hostname: options.hostname || 'localhost',
        port: options.port || 0
      }),
      task: 'appcache'
    });

    // slightly changed output file if task is not the usual appcache.
    if(options.task !== 'appcache') {
      options.output = options.output.replace(path.extname(options.output), '.' + options.task);
    }

    // and what command is about to run
    var args = [
      join(support, 'confess.js'),
      options.url,
      options.task,
      // should be read from gruntfile, and write to temporary file
      join(support, 'confess.json')
    ];

    grunt.log
      .subhead('Generating the cache manifest')
      .writeln('  - Command: ' + grunt.log.wordlist(['phantomjs'].concat(args), {
        separator: ' '
      }))
      .subhead('Writing to ' + options.output + '...');

    var confess = grunt.util.spawn({
      cmd: 'phantomjs',
      args: args
    }, function(err) {
      if( err ) {
        grunt.fail.fatal(err);
      }
    });

    // redirect back stderr output
    confess.stderr.pipe( process.stderr );

    // same for stdout, plus file write to final manifest file
    confess.stdout.pipe( process.stdout );

    confess.stdout.pipe( fstream.Writer(options.output) ).on('close', function() {
      grunt.log.ok();
      done();
    });
  });
};

