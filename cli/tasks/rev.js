

var fs = require('fs'),
  path = require('path'),
  crypto = require('crypto');


module.exports = function(grunt) {
  // rev task - reving is done in the `output/` directory
  grunt.registerMultiTask('rev', 'Automate the hash renames of assets filename', function() {
    grunt.helper('hash', this.data);
  });

  // **hash** helper takes care of files revving, by renaming any files
  // in the given `files` pattern(s), with passed in `options`.
  //
  // - files      - String or Array of glob pattern
  // - options    - (optional) An Hash object where:
  //    - cwd     - Base directory to work from, glob patterns are
  //                prepended to this path.
  //
  grunt.registerHelper('hash', function(files, opts) {
    opts = opts || {};

    grunt.file.expandFiles(files).forEach(function(f) {
      var md5 = grunt.helper('md5', f),
        renamed = [md5.slice(0, 8), path.basename(f)].join('.');

      grunt.verbose.ok().ok(md5);
      // create the new file
      fs.renameSync(f, path.resolve(path.dirname(f), renamed));
      grunt.log.write(f + ' ').ok(renamed);
    });
  });


  // **md5** helper is a basic wrapper around crypto.createHash, with
  // given `algorithm` and `encoding`. Both are optional and defaults to
  // `md5` and `hex` values.
  grunt.registerHelper('md5', function(filepath, algorithm, encoding) {
    algorithm = algorithm || 'md5';
    encoding = encoding || 'hex';
    var hash = crypto.createHash(algorithm);
    hash.update(grunt.file.read(filepath));
    grunt.log.verbose.write('Hashing ' + filepath + '...');
    return hash.digest(encoding);
  });
};



