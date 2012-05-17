
var fs = require('fs'),
  path = require('path'),
  rjs = require('requirejs'),
  mkdirp = require('mkdirp');

var plugin = module.exports;

// give it a name
plugin.name = 'script';

// give it some defaults
plugin.defaults = {
  dir: process.cwd(),
  output: 'js/bundle.min.js'
};

//
// Second plugin implementation.
//
// Will probably flesh out and remove duplicated code.
//

// and the main plugin handler, mixed in jsdom's jquery as $.fn.pluginame
plugin.handler = function link($, options, cb) {
  options = options || {};

  // hmm, will probably do this in other way, log object from grunt is passed
  // in options, or anything that comply to the grunt logger api. Using
  // `writeln` as of now. Will probably work out a better adapter system.
  var log = options.log || { writeln: $.noop };

  // same goes for some usefull helpers, here we need minify
  var min = (options.helpers && options.helpers.uglify) || $.noop;

  options.separator = process.platform === 'win32' ? '\r\n' : '\n';
  options.minify = typeof options.minify !== 'undefined' ? options.minify : true;

  // reg cache
  var rAbs = /\/\//;

  // don't act on zero-element
  if(!this.length) {
    cb();
    return this;
  }

  // don't handle external files
  var set = this.filter(function(i, el) {
    var src = $(el).attr('src');
    return !rAbs.test(src);
  });

  // size of the passed in collection, after absolute url filter
  // used to emit `success` on last iteration.
  var ln = set.length;
  log.writeln(' › Script plugin - about to process ' + set.length + ' element(s)');

  // will hold the concatenated script,
  // in the order they appear in the collection
  var files = [];

  //
  // 1. Iterates through each script in order, append them to the files array
  // 2. On the very last iteration (last script tags in jQuery collection),
  //    concat'd files are minified.
  // 3. The single minified content string is written to `options.output` or to
  //    the `data-build` attribute of last script tag.
  // 4. Every script in the collection but the last one get removed. Last
  //    one is updated so that the src attribute is `src=path/to/output`
  //
  // todo: better doc, further customization on this default behaviour
  //

  return set.each(function(i, target) {
    var el = $(this),
      last = ln === (i + 1),
      src = el.attr('src'),
      file = path.resolve(options.cwd, src);

    if(!path.existsSync(file)) return cb(new Error('no ' + src));

    files = files.concat(fs.readFileSync(file, 'utf8'));

    log.writeln(' › Handle: ' + el.get(0).outerHTML);
    if(!last) return el.remove();

    var href = el.data('build') || options.output,
      output = path.join(options.out, href);

    log.writeln((' › Writing optimized JS file to output ' + output).bold);

    mkdirp(path.dirname(output), function(e) {
      if(e) return cb(e);
      el.attr('src', href);
      var content = files.join(options.separator);

      //
      // minify - depending on the number of files to process, and their content
      // minification is a quite costly process. We should store in some cache
      // the minified output, indexed by the sha1 of concatenated files.
      //
      if(options.minify) log
        .writeln((' › Minifying JS file to output ' + output).bold)
        .writeln((' › from ' + set.length + ' file(s)').bold)
        .writeln((' › This may take a while..').bold);

      content = options.minify ? min(content) : content;
      fs.writeFile(output, content, cb);
    });
  });
};

