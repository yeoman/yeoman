
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

    // figure out the alternate install location, if any
    var directory = grunt.config('bower.dir');

    // run
    var cb = this.async();
    command.line(process.argv)
      .on('error', grunt.fatal.bind(grunt.fail))
      .on('data', grunt.log.writeln.bind(grunt.log))
      .on('end', function(){

        grunt.helper('bower:sync', directory, cb);
        /*
        if(args[0] === 'install' && directory) {
          grunt.helper('bower:sync', directory, cb);
        } else if(args[0] === 'uninstall' || args[0] === 'update' && directory) {
          grunt.helper('bower:sync', directory, cb);
        } else {
          cb();
        }*/
      });
  });


  // This helper returns a function meant to be used as a direct callback, most
  // likely on the end event of a bower command.
  //
  // Bower's list is used to get the paths of each dependency in
  // components/, these deps are simply copied over the directory
  // specified.
  //
  // - dir: directory path to mirror bower's components.
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

    // Resolve application index
    var scripts = '';
    var basePath = 'app';
    var appIndexPath  = path.resolve(path.join(basePath + '/index.html'));
    var indexBuffer = fs.readFileSync(appIndexPath, 'utf8');

    // parse data-main for require config path
    var datamain = /data-main=['"]([^'"]+)['"]/;

    // Syncronize the components directory with the vendor directory
    // if we're not having an rjs setup, go through synchronize step directly
    if(!datamain.test(indexBuffer)){
      return grunt.helper('bower:sync', dir, cb);
    }

    // store the relative filepath of the rjs entry point
    var filepath = indexBuffer.match(datamain)[1];

    // otherwise, request bower for deps listing and update the relevant config
    // while going through to synchronize step when done
    bower.commands.list({ paths: true })
      .on('error', grunt.fatal.bind(grunt.fail))
      .on('data', function(deps) {
        // should probably emit on `end` in bower's internal
        if(typeof deps === 'string') { return; }

        // Handler for RequireJS app config.
        // Wires up the relevant RequireJS paths config when
        // running `yeoman install spine backbone` etc.

        var requireConfigPath = basePath + '/' + filepath;

        // check path contains .js, append if not
        if ( requireConfigPath.indexOf('.js') ) {
          requireConfigPath += '.js';
        }

        // check config file exists
        var configExists = grunt.file.exists(requireConfigPath);
        if(configExists) {
          grunt.helper('bower:log', 'Updating RequireJS config: ' + requireConfigPath);
          // if so..
          // iterate over Bower deps, generating the path string fo config
          Object.keys(deps).forEach(function(dep){
            // Quote key if it contains non a-z chars
            var key = /[^\w]/.test( dep ) ? '\'' + dep + '\'' : dep;
            scripts+= "    " + key + ": '../../" + deps[dep].replace('.js','') + "',\n";
          });

          // read in the existing data-main config
          var cf = fs.readFileSync(requireConfigPath, 'utf8');
          // replace the existing paths with your new paths
          var html = cf.replace(' paths: {', 'paths: {\n' + scripts);

          // Write the paths to config
          fs.writeFileSync(requireConfigPath, html, 'utf8');
        }

        // end the process
        grunt.helper('bower:sync', dir, cb);
      });
  });



  // Helper to syncronize the Bower components directory with app/scripts/vendor
  grunt.registerHelper('bower:sync', function(dir, cb) {
    // Clean the vendor directory then sync with the components directory

    if(typeof cb !== 'function') {
      return grunt.fatal('bower:sync helper requires a callback.');
    }

    if(!dir) {
      return grunt.fatal('bower:sync helper requires a directory path.');
    }

    shelljs.rm('-rf', dir);
    shelljs.mkdir('-p', dir);
    shelljs.cp('-R', 'components/*', dir);

    cb();
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