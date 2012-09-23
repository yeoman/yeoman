var fs = require('fs'),
  path = require('path'),
  rjs = require('requirejs'),
  vm = require('vm');

module.exports = function(grunt) {
  grunt.task.registerTask('rjs', 'Optimizes javascript that actually is built with requirejs.', function () {
    var options = grunt.config(this.name) || {};

    // Verify if the application contains a data-main attribute
    var appIndexPath  = path.resolve('mainFile' in options ? '../app/' + options.mainFile : '../app/index.html');
    var indexBuffer = fs.readFileSync(appIndexPath, 'utf8');
    var hasDataMain = (indexBuffer.match(/data-main=['"]([^'"]+)['"]/));

    if(hasDataMain === null){
      grunt.log.writeln('No data-main attribute found in application index, bypassing the task...');
      return;
    }

    // Check for module/entry points in the rjs config
    if(!options.modules && !options.name) {
      grunt.log.writeln('No module or single entry point found in rjs configuration, bypassing the task...');
      return;
    }

    grunt.helper('rjs:optimize:js', grunt.config(this.name), this.async());
  });

  grunt.registerHelper('rjs:optimize:js', function(options, cb) {
    if(!cb) { cb = options; options = {}; }
    var mods = options.modules || [{ name: options.name }];

    // automatic configuration via mainConfigFile, assumed to be the app entry
    // point
    if(options.name) {
      options.mainConfigFile = options.mainConfigFile || path.join(options.baseUrl, options.name + '.js');
    }

    grunt.log.subhead('Options:')
      .writeln(grunt.helper('inspect', options));

    var originals = mods.map(function(m) {
      return {
        name: m.name,
        body: grunt.file.read(path.join(options.appDir, options.baseUrl, m.name + '.js'))
      };
    });

    rjs.optimize(options, function(out) {
      grunt.log.writeln(out);
      originals.forEach(function(m) {
        var filepath = path.join(options.dir, options.baseUrl, m.name + '.js');
        grunt.log
          .writeln('rjs optimized module: ' + m.name)
          .writeln('>> ' + filepath);

        grunt.helper('min_max_info', grunt.file.read(filepath), m.body);
      });

      cb();
    });
  });

};