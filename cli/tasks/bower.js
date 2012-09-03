
var path     = require('path');
var fs       = require('fs');
var bower    = require('bower');
var template = require('bower/lib/util/template');

module.exports = function(grunt) {

  // Task facade to Twitter Bower.
  //
  // This task basically just pass current provess.argv to bower. Special tasks
  // like install, list, search etc. are all configured to trigger this one.
  //
  // A yeoman-specific configuration can be defined in your Gruntfile:
  //
  // - dir: Alternate directory location. (default: browser_modules)
  //
  // If dir option is specified, bower is asked for the package dependency
  // model and each paths. Each package is then simply copied over the value of
  // the dir options.
  //
  // `browser_modules/` next to your Gruntfile is bower's internal directory.
  // `app/js/vendor` is your working directory, files used in development and
  // concat / min by grunt script.
  grunt.registerTask('bower', 'This triggers the `bower` commands.', function() {
    // pull in the bower command module
    var args = this.args;
    var command = bower.commands[args[0]];
    if(!command) {
      return grunt.fatal('A valid bower command should be specified.');
    }

    // figure out the alternate install location, if any
    var directory = grunt.config('bower.dir');

    // should we run the yeoman post install step
    var install = args[0] === 'install' && directory;

    // run
    var cb = this.async();
    command.line(process.argv)
      .on('error', grunt.fatal.bind(grunt.fail))
      .on('data', grunt.log.writeln.bind(grunt.log))
      // should probably add other end hooks on commands like uninstall, to
      // also remove from directory
      .on('end', install ? grunt.helper('bower:copy', directory, cb) : cb);
  });


  // This helper returns a function meant to be used as a direct callback, most
  // likely on the end event of a bower command.
  //
  // Bower's list is used to get the paths of each dependency in
  // browser_modules/, these deps are simply copied over the directory
  // specified.
  //
  // - dir: directory path to mirror bower's browser_module.
  // - cb: callback to call on completion.
  //
  // Examples:
  //
  //      stuff.on('end', grunt.helper('bower:copy', this.async()));
  //
  grunt.registerHelper('bower:copy', function(dir, cb) {
    if(typeof cb !== 'function') {
      return grunt.fatal('bower:copy helper requires a callback.');
    }

    if(!dir) {
      return grunt.fatal('bower:copy helper requires a directory path.');
    }

    return function() {
      grunt.helper('bower:log', 'copying to', dir);

      var scripts = '';

      bower.commands.list({ paths: true })
        .on('error', grunt.fatal.bind(grunt.fail))
        .on('data', function(deps) {
          // should probably emit on `end` in bower's internal
          if(typeof deps === 'string') { return; }

          // Handler for RequireJS app config.
          // Wires up the relevant RequireJS config when
          // running `yeoman install spine backbone` etc.

          // Read in application index
          var basePath = 'app';
          var appIndexPath  = path.resolve(basePath + '/index.html');
          var indexBuffer = fs.readFileSync(appIndexPath, 'utf8');
          // parse data-main for require config path
          var hasDataMain = (indexBuffer.match(/data-main=['"]([^'"]+)['"]/));
          // If data-main present..
          if(hasDataMain !== null){
            var requireConfigPath = basePath + '/' + hasDataMain[1];
            // check path contains .js, append if not.
            requireConfigPath.indexOf('.js') ? requireConfigPath += '.js' : null;
            // check config file exists
            if(grunt.file.exists(requireConfigPath)){
                // if so..
                // iterate over Bower deps, generating the path string fo config     
                Object.keys(deps).forEach(function(dep){
                  scripts+= "    " + dep + ": '../../" + deps[dep].replace('.js','') + "',\n";
                });

                // read in the existing data-main config   
                var cf = fs.readFileSync(requireConfigPath, 'utf8');
                // replace the existing paths with your new paths
                var html = cf.replace(' paths: {', 'paths: {\n' + scripts);
                // Write the paths to config
                fs.writeFileSync(requireConfigPath, html, 'utf8');
            }
          }

          // go through each installed package (via cli.tasks, nopt's remain
          // array), figure out the path from bower dependency tree, and copy
          // to final location
          grunt.cli.tasks.split(':').slice(2).forEach(function(dep) {
            var file = deps[dep];
            if(!file) { return; }
            var ext  = path.extname(file);
            var dest = path.join(dir, dep + ext);
            grunt.helper('bower:log', 'copying ' + dep, dest);
            if(!grunt.file.exists(file)) {
              grunt.log.writeln(grunt.helper('bower:template', 'warning-missing', { name: dep }));
              grunt.log.writeln(grunt.helper('bower:template', 'warn', {
                name: file,
                shizzle: 'seems missing. You should bug the author of ' + dep + ' package'
              }));
              return;
            }

            grunt.file.copy(file, dest);
          });

          cb();
        });
    };
  });


  // Little grunt helper to access the bower template facility.
  //
  // - name       - a String to define the template name to invoke
  // - context    - A hash of data to pass through the given template
  //
  // Returns the template output
  grunt.registerHelper('bower:template', function(name, context, cb) {
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
