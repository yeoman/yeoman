var fs = require('fs'),
  join = require('path').join,
  util = require('util'),
  h5bp = require('../');

  module.exports = function(grunt) {

    // Create a new task for all nest functionality
    grunt.registerTask('manifest', 'Generates an application cache manifest using Confess.js.', function() {


        //need yeoman path
       var libPath  = (join(__dirname, '../lib/support/'));
       var confessPath = libPath + 'confess.js';
       var confessConfig = libPath + 'confess.json';
       var confessTask = 'appcache'; //performance, appcache, cssproperties
       var manifestTarget = 'manifest.appcache';
       var localServer = 'http://localhost:3000';

        // Tell grunt this task is asynchronous.
        var done = this.async(),
            exec = require('child_process').exec,
            command = 'phantomjs ' +  confessPath  + ' ' + localServer +' ' + confessTask + ' >' + manifestTarget + ' ' + confessConfig;

        command += this.args.join(' ');

        function puts(error, stdout, stderr) {

            grunt.log.write('\n\nConfess output:\n');
            grunt.log.write(stdout);

            if (error !== null) {
                grunt.log.error(error);
                done(false);
            } else {
                done(true);
            }
        }

        exec(command, puts);
        grunt.log.write('Generating the cache manifest');
    });
};

