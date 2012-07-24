// less task, to be backported into gruntfiles
//
var fs = require('fs'),
  path = require('path'),
  less = require('less');

// ### Less tasks - Compiles less files
//
// Compiles any expanded less files into raw CSS. It'll run a compilation
// through the less compiler for each files in the fileset. The CSS results
// of these less files is then concat'd into the destincation file.
//
// Just as the built-in concat / min grunt tasks, the destination file
// (the file that'll be written to the file system) is guessed by resolving
// the subprop task name.
//
// **Basic configuration example:**
//
//    ...
//    less: {
//      'mockup/assets/css/bootstrap.css': ['mockup/assets/less/bootstrap.less'],
//
//      // if output file ends with `.min.css`, then less will be called with compress
//      'mockup/assets/css/bootstrap.min.css': ['mockup/assets/less/bootstrap.less'],
//      'mockup/assets/css/bootstrap.light.css': ['mockup/assets/less/light.lesis']
//    },
//
//  ...

module.exports = function(grunt) {

grunt.registerMultiTask('less', 'compiles less files', function(data, name) {
  var out = path.resolve(name),
    min = /\.min\.css$/.test(name),
    cb = this.async();

  verbose.or.write('Writing to .' + out.replace(process.cwd(), '') + '...');

  var files = file.expand(data);

  // check that the files passed in are actual less files, yell if it's not
  files.forEach(function(f) {
    if(path.extname(f) !== '.less') fail.warn(f + ' not a .less file', 3);
  });

  async.map(files, grunt.helper('less', { compress: min }), function(err, results) {
    if(err) return fail.warn(err);

    // now gonna concat the expanded set of files into destination files.
    file.write(out, results.join('\n\n'));
    verbose.or.ok();
    cb();
  });

});


grunt.registerHelper('less', function(o) {

  return function(filename, cb) {
    var parser = new less.Parser({
      paths: [path.dirname(filename)]
    });

    fs.readFile(filename, 'utf8', function(err, body) {
      if(err) return cb(err);

      parser.parse(body, function(err, tree) {
        if(err) return cb(err);
        var css = tree.toCSS(o || {});
        cb(null, css);
      });
    })
  };
});

};
