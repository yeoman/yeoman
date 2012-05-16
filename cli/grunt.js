var util = require('util'),
  path = require('path');

/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    lint: {
      grunt: ['grunt.js', 'tasks/*.js'],
      lib: ['lib/plugins/*.js']
    },
    watch: {
      files: '<config:lint.grunt>',
      tasks: 'lint:grunt'
    },
    jshint: {
      options: {
        es5: true,
        node: true,
        curly: false,
        eqeqeq: true,
        immed: true,
        latedef: false,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true
      }
    }
  });

  // Default task.
  grunt.registerTask('default', 'lint');

  // some debugging helpers
  grunt.registerTask('list-helpers', 'List all grunt registered helpers', function(helper) {
    var ls = grunt.log.wordlist(Object.keys(grunt.task._helpers), grunt.utils.linefeed);
    if(!helper) return grunt.log.ok(ls);
    grunt.log.subhead(helper + ' source:').ok(grunt.task._helpers[helper]);
  });

  grunt.registerTask('list-task', 'List all grunt registered tasks', function(t) {
    var ls = grunt.log.wordlist(Object.keys(grunt.task._tasks), grunt.utils.linefeed);
    if(!t) return grunt.log.ok(ls);
    grunt.log.subhead(t + ' source:');
    grunt.helper('inspect', grunt.task._tasks[t]);
  });

  // and the doc generation for the docs task
  grunt.registerTask('gendocs', 'Generates docs/index.html from wiki pages', function() {
    var cb = this.async();

    var gendoc = grunt.utils.spawn({
      cmd: 'grunt', opts: { cwd: path.join(__dirname, 'scripts/docs') }
    }, function() {});

    gendoc.stdout.pipe(process.stdout);
    gendoc.stderr.pipe(process.stderr);
    gendoc.on('exit', function(code) {
      if(code) grunt.warn('Something bad happend', code);
      cb();
    });
  });

};
