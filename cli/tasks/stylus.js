/**
 * Task: stylus
 * Description: Compile Stylus files into CSS
 * Dependencies: stylus
 * Contributor: @errcw
 */

module.exports = function(grunt) {
  var _ = grunt.utils._;
  var async = grunt.utils.async;

  grunt.registerMultiTask("stylus", "Compile Stylus files into CSS", function() {
    var options = grunt.helper('options', this);
    var data = this.data;
    var done = this.async();

    grunt.verbose.writeflags(options, "Options");

    async.forEachSeries(Object.keys(data.files), function(dest, next) {
      var src = data.files[dest];
      var srcFiles = grunt.file.expandFiles(src);

      dest = grunt.template.process(dest);

      async.concatSeries(srcFiles, function(srcFile, nextConcat) {
        var stylusOptions = _.extend({filename: srcFile}, options);
        var stylusSource = grunt.file.read(srcFile);

        grunt.helper("stylus", stylusSource, stylusOptions, function(css) {
          nextConcat(css);
        });
      }, function(css) {
        grunt.file.write(dest, css);
        grunt.log.writeln("File '" + dest + "' created.");

        next();
      });
    }, function() {
      done();
    });
  });

  grunt.registerHelper("stylus", function(source, options, callback) {
    var s = require("stylus")(source);

    _.each(options, function(value, key) {
      s.set(key, value);
    });

    s.render(function(e, css) {
      if (!e) {
        callback(css);
      } else {
        grunt.log.error(e);
        grunt.fail.warn("Stylus failed to compile.");
      }
    });
  });
};