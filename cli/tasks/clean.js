/**
 * Task: clean
 * Description: Clear files and folders.
 * Dependencies: rimraf
 * Contributor: @tbranyen
 */

module.exports = function(grunt) {
  var fs = require("fs");

  var isOutsideCWD = function(path) {
    if (path.substring(0, 3) === "../") return true;
    if (path.substring(0, 1) === "/") return true;

    path = path.split("/");

    var cwd = fs.readdirSync(process.cwd());

    return (cwd.indexOf(path[0]) === -1);
  };

  grunt.registerMultiTask("clean", "Clear files and folders", function() {
    var options = grunt.helper("options", this, {force: false});

    grunt.verbose.writeflags(options, "Options");

    var validPaths = grunt.file.expand(this.file.src);

    if (validPaths.length === 0) {
      grunt.fatal("should have an array of valid paths to clean by now, too dangerous to continue.");
    }

    validPaths.forEach(function(path) {
      if (options.force === false && isOutsideCWD(path)) {
        grunt.fail.warn('trying to clean "' + path + '" which is outside the working dir.');
      }

      grunt.helper("clean", path);
    });
  });

  grunt.registerHelper("clean", function(path) {
    grunt.log.write('Cleaning "' + path + '"...');

    try {
      require("rimraf").sync(path);
      grunt.log.ok();
    } catch (e) {
      grunt.log.error();
      grunt.verbose.error(e);
      grunt.fail.warn("Clean operation failed.");
    }
  });
};