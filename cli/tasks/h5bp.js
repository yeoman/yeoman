
var fs = require('fs'),
  join = require('path').join,
  util = require('util'),
  h5bp = require('../');

//
// ant build script has a nice notion of environment, this defaults to
// production. And we only support env=prod for now.
//
// not implemented tasks (add noop waithing for their impl): manifest
//


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
  grunt.loadTasks(join(__dirname, '../node_modules/grunt-shell/tasks'));

  // Setup some default alias...
  grunt.registerTask('reload', 'default connect watch:reload');

  // and build targets, these are equivalent to alias except that we
  // defined a single task and use arguments to trigger the appropriate
  // target
  var targets = {
    // build - (default) no html optimizations
    "default": 'coffee concat shell:compass css min img rev usemin manifest',

    // text - same as build but without image (png/jpg) optimizing
    text: 'coffee concat css min rev usemin manifest',

    // buildkit - minor html optimizations, all html whitespace/comments
    // maintained
    // (todo: inline script/style minified)
    buildkit: 'coffee concat css min img rev usemin manifest html:buildkit',

    // basics - same as build minus plugs minor html optimizations
    // (extra quotes and comments removed)
    // (todo: inline script/style minified)
    basics: 'coffee concat css min img rev usemin manifest html:basics',

    // minify - same as build plus full html minification,
    minify: 'coffee concat css min img rev usemin manifest html:compress'
  };

  var targetList = grunt.log.wordlist(Object.keys(targets));
  grunt.registerTask('build', 'Run a predefined target - build:<target> \n' + targetList, function(target) {
    var valid = Object.keys(targets);
    if(!target) {
      target = 'default';
    }
    if(!~valid.indexOf(target)) {
      grunt.log
        .error('Not a valid target')
        .error(grunt.helper('invalid targets', targets));
      return false;
    }

    var tasks = ['intro clean mkdirs', targets[target], 'copy time'].join(' ');
    grunt.task.run(tasks);
  });

  grunt.registerHelper('invalid targets', function(valid, code) {
    var msg = Object.keys(valid).map(function(key) {
      if(/pre|post/.test(key)) return '';
      return grunt.helper('pad', key, 10) + '# '+ valid[key];
    }).join(grunt.utils.linefeed);

    var err = new Error(grunt.utils.linefeed + msg);
    err.code = code || 3;
    return err;
  });

  grunt.registerHelper('pad', function pad(str, max) {
    return str.length > max ? str :
        str + new Array(max - str.length + 1).join(' ');
  });

  // To-be-implemented tasks
  grunt.registerTask('manifest', 'TBD - Generates appcache manifest file.', function() {
    grunt.log.error('not yet implemented');
  });

  var now = +new Date();
  grunt.registerTask('time', 'Print sucess status with elapsed time', function() {
    grunt.log.ok('Build sucess. Done in ' + ((+new Date() - now) / 1000) + 's');
  });

  // Output some size info about a file, from a stat object.
  grunt.registerHelper('min_max_stat', function(min, max) {
    min = typeof min === 'string' ? fs.statSync(min) : min;
    max = typeof max === 'string' ? fs.statSync(max) : max;
    grunt.log.writeln('Uncompressed size: ' + String(max.size).green + ' bytes.');
    grunt.log.writeln('Compressed size: ' + String(min.size).green + ' bytes minified.');
  });

  // Output some info on given object, using util.inspect
  grunt.registerHelper('inspect', function(o) {
    var lf = grunt.utils.linefeed;
    var output = (lf + util.inspect(o, false, 4, true) + lf).split(lf).map(function(line) {
      return line;
    });
    output.forEach(grunt.log.ok, grunt.log);
    return grunt;
  });


};
