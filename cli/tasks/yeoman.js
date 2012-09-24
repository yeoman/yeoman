var fs    = require('fs');
var join  = require('path').join;
var util  = require('util');
var which = require('which');

// ant build script has a nice notion of environment, this defaults to
// production. And we only support env=prod for now.
//
// not implemented tasks (add noop waithing for their impl): manifest

module.exports = function(grunt) {

  // External grunt plugin:
  //
  // - jasmine task: https://github.com/creynders/grunt-jasmine-task
  //
  // note: We need to use loadTasks instead of loadNpmTasks, otherwise will try
  // to load relative to gruntfile node_modules, this would require user to
  // install manually. So we load tasks specifically from our node_modules,
  // with abs path.
  //
  grunt.loadTasks(join(__dirname, '../node_modules/grunt-jasmine-task/tasks'));
  grunt.loadTasks(join(__dirname, '../node_modules/grunt-mocha/tasks'));
  grunt.loadTasks(join(__dirname, '../node_modules/grunt-contrib-coffee/tasks'));

  // build targets: these are equivalent to grunt alias except that we defined
  // a single task and use arguments to trigger the appropriate target
  //
  // - build    - no html compression, no usemin-handler task
  // - usemin   - (default) same as build but parsing config from markup
  // - text     - same as usemin but without image (png/jpg) optimizing
  // - buildkit - minor html optimizations, all html whitespace/comments
  //              maintained (todo: inline script/style minified)
  // - basics   - same as buildkit plus minor html optimizations
  // - minify   - same as build plus full html minification
  //
  // - test     - same as default build plus but conditionally runs compass /
  //              manifest task depending on whether or not compass / phantomjs binaries are
  //              available within the path.  During the checking process, we output warning
  //              infos about missing deps. It might make sense to make it the default (img
  //              task internally does this check)
  var targets = {
    default   : '               rjs concat css min img rev usemin manifest',
    usemin    : 'usemin-handler rjs concat css min img rev usemin manifest',
    text      : 'usemin-handler rjs concat css min     rev usemin manifest',
    buildkit  : 'usemin-handler rjs concat css min img rev usemin manifest html:buildkit',
    basics    : 'usemin-handler rjs concat css min img rev usemin manifest html:basics',
    minify    : 'usemin-handler rjs concat css min img rev usemin manifest html:compress',
    test      : 'usemin-handler rjs concat css min img rev usemin manifest'
  };

  var targetList = grunt.log.wordlist(Object.keys(targets));
  grunt.registerTask('build', 'Run a predefined target - build:<target> \n' + targetList, function(target) {
    var valid = Object.keys(targets);
    target = target || 'usemin';

    if ( valid.indexOf( target ) === -1 ) {
      grunt.log
        .error('Not a valid target')
        .error(grunt.helper('invalid targets', targets));
      return false;
    }

    var tasks = ['intro', 'clean coffee compass mkdirs', targets[target], 'copy time'].join(' ');

    // Conditionally remove compass / manifest task if either compass or
    // phantomjs binary is missing. Done only for `test` target (specifically
    // used for our `npm test`). For each, output warning infos.
    if( target === 'test' ) {
      tasks = grunt.helper( 'build:skip', tasks, 'compass' );
      tasks = grunt.helper( 'build:skip', tasks, 'phantomjs', 'manifest' );
    }

    grunt.log.subhead('Running ' + target + ' target')
      .writeln('  - ' + grunt.log.wordlist(tasks.split(' '), { separator: ' ' }));


    grunt.task.run(tasks);
  });

  grunt.registerHelper('invalid targets', function(valid, code) {
    var msg = Object.keys(valid).map(function(key) {
      if ( /pre|post/.test( key ) ) {
        return '';
      }
      return grunt.helper('pad', key, 10) + '# '+ valid[key];
    }).join(grunt.util.linefeed);

    var err = new Error(grunt.util.linefeed + msg);
    err.code = code || 3;
    return err;
  });

  // Helper to conditionally remove a given task from the provided list of
  // `tasks` (as a String). A `cmd` and `task` Strings should be provided,
  // if `task` is omitted, it then takes the same value of the `cmd` one.
  //
  // When a binary is known as non available, and that the task is skipped,
  // this helper also output warning info to the user.
  //
  // - tasks   - String list of tasks to be run
  // - cmd     - The String name of the binary to check against the system.
  // - task    - (optional) A string name to define the specific task to remove
  //             from the returned tasks list. If undefined, is the same than
  //             `binary`.
  //
  // Returns optionally modified `tasks` String.
  grunt.registerHelper('build:skip', function(tasks, cmd, task) {
      try {
        which.sync(cmd);
      } catch(err) {
        grunt.helper('not installed', cmd);
        tasks = tasks.replace(task || cmd, '');
      }

      return tasks;
  });

  grunt.registerHelper('pad', function pad(str, max) {
    return str.length > max ? str :
        str + new Array(max - str.length + 1).join(' ');
  });

  var now = +new Date();
  grunt.registerTask('time', 'Print sucess status with elapsed time', function() {
    grunt.log.ok('Build success. Done in ' + ((+new Date() - now) / 1000) + 's');
  });

  // Output some size info about a file, from a stat object.
  grunt.registerHelper('min_max_stat', function(min, max) {
    min = typeof min === 'string' ? fs.statSync(min) : min;
    max = typeof max === 'string' ? fs.statSync(max) : max;
    grunt.log.writeln('Uncompressed size: ' + String(max.size).green + ' bytes.');
    grunt.log.writeln('Compressed size: ' + String(min.size).green + ' bytes minified.');
  });

  // Output some info on given object, using util.inspect, using colorized output.
  grunt.registerHelper('inspect', function(o) {
    return util.inspect(o, false, 4, true);
  });

};
