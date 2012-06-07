var path = require('path'),
  rjs = require('requirejs');

module.exports = function(grunt) {
  grunt.task.registerTask('rjs', 'Optimizes javascript that actually is built with requirejs.', function () {
    this.requiresConfig(this.name);
    grunt.helper('rjs:optimize:js', grunt.config(this.name), this.async());
  });

  grunt.registerHelper('rjs:optimize:js', function(options, cb) {
    if(!cb) { cb = options; options = {}; }
    grunt.log.subhead('Options:');
    grunt.helper('inspect', options);

    var originals = options.modules.map(function(m) {
      return {
        name: m.name,
        body: grunt.file.read(path.join(options.baseUrl, options.appDir, m.name + '.js'))
      };
    });

    rjs.optimize(options, function() {
      originals.forEach(function(m) {
        var filepath = path.join(options.dir, m.name + '.js');
        grunt.log
          .writeln('rjs optimized module ' + m.name)
          .writeln('>> ' + filepath);
        grunt.helper('min_max_info', grunt.file.read(filepath), m.body);
      });

      cb();
    });
  });

};