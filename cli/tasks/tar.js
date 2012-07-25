
var path = require('path'),
  fstream = require('fstream'),
  zlib = require('zlib'),
  tar = require('tar');

module.exports = function(grunt) {

  //
  // **tar** task is a basic task for tarball creation. Takes two options: the
  // directory (`input`) to read from and the tarball file to create
  // (`output`). Depending on tarball extension (either .tar or .tgz), tarball
  // file is also passed through zlib.Gzip().
  //
  // The tar task will try to get the input / output options from different
  // sources, in this order:
  //
  // - cli options for `--input` and `--output`
  // - configuration for tar.input and tar.output (usually in project's Gruntfile)
  //
  // If one of `--input` or `--output` is not defined, then the task looks for
  // these values in grunt's config, and fail if either input or output is
  // missing.
  //
  grunt.registerTask('tar', 'Creates a tarball from a directory', function() {
    var input = grunt.option('input') || grunt.config('input'),
      output = grunt.option('output') || grunt.config('output'),
      cb = this.async();

    if ( !input ) {
      grunt.log.error('tar: No input value, please specify one.');
    }

    if ( !output ) {
      grunt.log.error('tar: No output value, please specify one.');
    }

    if ( !input || !output ) {
      return cb(false);
    }

    // correct extension?
    if(!(/tar|tgz/).test(path.extname(output))) {
      grunt.log.error('tar: ' + output + ' is not a valid destination. Must ends with .tar or .tgz');
      return cb(false);
    }

    grunt.log.write('Creating tarball >> ' + output + ' from ' + input + ' directory...');

    //
    // Note to self: should the tar task use fstream-ignore instead? By default
    // and for now, assuming the tar task is used to copy the whole folder,
    // without ignore handling. But seems like the correct way to do so, as the
    // stuff ignores by .gitignore or other ignore files are likely not
    // intended to be copied.
    //
    var reader = fstream.Reader({ type: 'Directory', path: input });
    grunt.helper('packer', reader, output, function(msg) {
      return function(e) {
        // no errors.. All ok.
        if(!e) {
          grunt.log.ok();
          return cb();
        }
        // hmm, got error, log and fail
        grunt.log.error('Oh snap >> ' + msg);
        grunt.log.error(e);
        return cb(false);
      };
    });
  });

  //
  // **packer** is a simple pass-through stream helper using zlib and
  // isaacs/node-tar.  Takes a readable fstream (like a fstream.Reader or
  // fstream-ignore), pass it through tar.Pack() with default option, then into
  // zlib.Gzip() and finally to a writable fs Stream.
  //
  // gzipping is optional and only happens when dest ends with `.tgz`. Dest
  // ending with `.tar` will omit the zlib.Gzip() step.
  //
  // Error is a curried function.. Not a raw callback, it returns the callback
  // to call on completion though, done this way mainly to circumvent the fact that
  // grunt's async callback currently handles instanceof Errors as truthy
  // value, hence not failing the task.
  //
  // note to self: now that packer helper is used by more than one task, should
  // simplify this error callback stuff (and not rely on curried thing,
  // confusing for little value)
  //
  grunt.registerHelper('packer', function(input, dest, error) {
    var stream = input.pipe(tar.Pack())
      .on('error', error('tar creation error' + dest));

    // if it ends with .tgz, then Gzip it.
    if ( path.extname( dest ) === '.tgz' ) {
      stream = stream.pipe( zlib.Gzip() );
    }

    return stream.on('error', error('gzip error ' + dest))
      .pipe(fstream.Writer({ type: 'File', path: dest }))
      .on('error', error('Could not write ' + dest))
      .on('close', error());
  });
};



