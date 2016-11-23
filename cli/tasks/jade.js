/**
 * Task: jade
 * Description: Compile Jade templates to HTML
 * Dependencies: jade, path
 * Contributor: @errcw
 */

module.exports = function(grunt) {
  var _ = grunt.utils._;

  grunt.registerMultiTask("jade", "Compile Jade templates into HTML.", function() {
    var path = require("path");

    var options = grunt.helper("options", this);
    var data = this.data;
    var jadeData = options.data;

    grunt.verbose.writeflags(options, "Options");

    if (_.isEmpty(jadeData) === false) {
      _.each(jadeData, function(value, key) {
        if (_.isString(value)) {
          jadeData[key] = grunt.template.process(value);
        }
      });
    }

    Object.keys(data.files).forEach(function(dest) {
      var src = data.files[dest];
      var srcFiles = grunt.file.expandFiles(src);

      dest = grunt.template.process(dest);

      var jadeOutput = [];

      srcFiles.forEach(function(srcFile) {
        var jadeOptions = _.extend({filename: srcFile}, options);
        var jadeSource = grunt.file.read(srcFile);

        jadeOutput.push(grunt.helper("jade", jadeSource, jadeOptions, jadeData));
      });

      if (jadeOutput.length > 0) {
        grunt.file.write(dest, jadeOutput.join("\n"));
        grunt.log.writeln("File '" + dest + "' created.");
      }
    });
  });

  grunt.registerHelper("jade", function(src, options, data) {
    try {
      return require("jade").compile(src, options)(data);
    } catch (e) {
      grunt.log.error(e);
      grunt.fail.warn("Jade failed to compile.");
    }
  });
};