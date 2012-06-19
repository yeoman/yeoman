var fs = require('fs'),
  path = require('path'),
  rjs = require('requirejs'),
  vm = require('vm');

module.exports = function(grunt) {
  grunt.task.registerTask('rjs', 'Optimizes javascript that actually is built with requirejs.', function () {
    this.requiresConfig(this.name);
    grunt.helper('rjs:optimize:js', grunt.config(this.name), this.async());
  });

  grunt.registerHelper('rjs:optimize:js', function(options, cb) {
    if(!cb) { cb = options; options = {}; }

    // update options to reflect the same paths configuration than runtime's
    options = grunt.helper('rjs:paths', options);

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

  // Given a rjs options Hash object, iterates through each `modules`, read
  // its content and evaluates each one through node's VM. It looks up for
  // `require({})` or `require.config({})` calls and get back the paths Hash
  // object to update the rjs build configuration.
  grunt.registerHelper('rjs:paths', function(options) {
    var base = path.join(options.baseUrl, options.appDir);

    // the sandbox object, this is the environment used to parse AMD modules
    // looking up for runtime configuration
    var sandbox = {};

    // basic require shim.
    sandbox.require = function require(o) {
      if(!o || !o.paths) return;
      // if the first arg passed to require is an Hash object, and has a paths
      // property, pass it through require.config method
      sandbox.require.config(o);
    };

    // require.config support, each time a rjs config with paths props
    // appears, merge the paths configuration (and other options that might
    // appear here) into the original options object.
    sandbox.require.config = function config(o) {
      grunt.utils._.extend(options, o);
    };

    // define noop
    sandbox.define = function() {};

    options.modules.forEach(function(mod) {
      var body = grunt.file.read(path.join(base, mod.name + '.js'));
      vm.runInNewContext(body, sandbox);
    });

    return options;
  });

};