
var path     = require('path');
var fs       = require('fs');
var bower    = require('bower');
var template = require('bower/lib/util/template');
var shelljs  = require('shelljs');


module.exports = function(grunt) {

  // Task facade to Twitter Bower.
  //
  // This task basically just pases our current provess.argv to bower. Special tasks
  // like install, list, search etc. are all configured to trigger this one.
  //
  // A yeoman-specific configuration can be defined in your Gruntfile:
  //
  // - dir: Alternate directory location. (defaults to: components)
  //
  // If the dir option is specified, bower is asked for the package dependency
  // model and each paths. Each package is then simply copied over the value of
  // the dir options.
  //
  // `components/` next to your Gruntfile is bower's internal directory.
  // `app/js/vendor` is your working directory, files used in development and
  // concat / min by grunt script.
  grunt.registerTask('bower', 'This triggers the `bower` commands.', function() {
    // pull in the bower command module
    var args = this.args;
    var command = bower.commands[args[0]];
    if(!command) {
      return grunt.fatal('A valid bower command should be specified.');
    }

    // run
    var cb = this.async();
    command.line(process.argv)
      .on('error', grunt.fatal.bind(grunt.fail))
      .on('data', grunt.log.writeln.bind(grunt.log));
  });


  // Little grunt helper to access the bower template facility.
  //
  // - name       - a String to define the template name to invoke
  // - context    - A hash of data to pass through the given template
  //
  // Returns the template output
  grunt.registerHelper('bower:template', function(name, context) {
    return template(name, context, true);
  });

  // Helper to log through bower template action utility.
  //
  // - name   - main message.
  // - stuff  - additional logging message. Displayed in grey.
  grunt.registerHelper('bower:log', function(name, stuff) {
    grunt.log.writeln(grunt.helper('bower:template', 'action', {
      name: name,
      shizzle: stuff
    }));
  });
};