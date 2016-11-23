/**
 * Task: copy
 * Description: Copy files into another directory
 * Contributor: @ctalkington
 */

module.exports = function(grunt) {
  var path = require("path");

  var _ = grunt.utils._;
  var kindOf = grunt.utils.kindOf;

  grunt.registerMultiTask("copy", "Copy files into another directory.", function() {
    var options = grunt.helper("options", this, {
      basePath: null,
      processName: false,
      processContent: false,
      processContentExclude: []
    });

    var data = this.data;

    var copyOptions = {
      process: options.processContent,
      noProcess: options.processContentExclude
    };

    if (options.basePath !== null) {
      options.basePath = _(options.basePath).trim("/");
    }

    grunt.verbose.writeflags(options, "Options");

    Object.keys(data.files).forEach(function(dest) {
      var src = data.files[dest];
      var srcFiles = grunt.file.expandFiles(src);

      dest = grunt.template.process(dest);
      dest = _(dest).trim("/");

      if (path.existsSync(dest) === false) {
        grunt.file.mkdir(dest);
      }

      var count = 0;

      var filename = "";
      var relative = "";

      var destFile = "";

      srcFiles.forEach(function(srcFile) {
        filename = path.basename(srcFile);
        relative = path.dirname(srcFile);

        if (options.basePath !== null && options.basePath.length > 1) {
          relative = _(relative).strRightBack(options.basePath);
          relative = _(relative).trim("/");
        }

        if (options.processName && kindOf(options.processName) === "function") {
          filename = options.processName(filename);
        }

        // make paths outside grunts working dir relative
        relative = relative.replace(/\.\.\//g, "");

        destFile = path.join(dest, relative, filename);

        grunt.file.copy(srcFile, destFile, copyOptions);

        count++;
      });

      grunt.log.writeln("Copied " + count + ' file(s) to "' + dest + '".');
    });
  });
};