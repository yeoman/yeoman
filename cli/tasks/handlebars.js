/**
 * Task: handlebars
 * Description: Compile handlebars templates to JST file
 * Dependencies: handlebars
 * Contributor: @tbranyen
 */

module.exports = function(grunt) {
  grunt.registerMultiTask("handlebars", "Compile handlebars templates to JST file", function() {
    var options = grunt.helper("options", this, {namespace: "JST"});
    var data = this.data;

    grunt.verbose.writeflags(options, "Options");

    Object.keys(data.files).forEach(function(dest) {
      var src = data.files[dest];
      var srcFiles = grunt.file.expandFiles(src);

      dest = grunt.template.process(dest);

      var handlebarOutput = [];
      var handlebarNamespace = "this['" + options.namespace + "']";

      handlebarOutput.push(handlebarNamespace + " = " + handlebarNamespace + " || {};");

      srcFiles.forEach(function(srcFile) {
        var handlebarSource = grunt.file.read(srcFile);

        handlebarOutput.push(grunt.helper("handlebars", handlebarSource, srcFile, handlebarNamespace));
      });

      if (handlebarOutput.length > 0) {
        grunt.file.write(dest, handlebarOutput.join("\n\n"));
        grunt.log.writeln("File '" + dest + "' created.");
      }
    });
  });

  grunt.registerHelper("handlebars", function(source, filepath, namespace) {
    try {
      var output = "Handlebars.template(" + require("handlebars").precompile(source) + ");";
      return namespace + "['" + filepath + "'] = " + output;
    } catch (e) {
      grunt.log.error(e);
      grunt.fail.warn("Handlebars failed to compile.");
    }
  });
};
