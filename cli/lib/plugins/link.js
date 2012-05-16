
var fs = require('fs'),
  path = require('path'),
  rjs = require('requirejs');

var plugin = module.exports;

// give it a name
plugin.name = 'link';

// give it some defaults
plugin.defaults = {
  dir: process.cwd(),
  output: 'css/style.min.css'
};

// and the main plugin handler, mixed in jsdom's jquery as $.fn.pluginame
plugin.handler = function link($, options, cb) {
  options = options || {};

  // hmm, will probably do this in other way, log object from grunt is passed
  // in options, or anything that comply to the grunt logger api. Using
  // `writeln` as of now. Will probably work out a better adapter system.
  var log = options.log || { writeln: $.noop };

  // reg cache
  var rAbs = /\/\//;

  // don't act on zero-element
  if(!this.length) {
    cb();
    return this;
  }

  // don't handle external files
  var set = this.filter(function(i, el) {
    var src = $(el).attr('href');
    return !rAbs.test(src);
  });

  // size of the passed in collection, after absolute url filter
  // used to emit `success` on last iteration.
  var ln = set.length;
  log.writeln(' › Link plugin - about to process ' + set.length + ' element(s)');

  return set.each(function(i, target) {
    var el = $(this),
      last = ln === (i + 1),
      src = el.attr('href'),
      file = path.resolve(options.cwd, src);

    if(!path.existsSync(file)) return cb(new Error('no ' + src));

    var href = el.data('build') || options.output,
      output = path.join(options.out, href);

    // have rjs deal with import inlines, plus file writes
    var config = options.rjs || options.requirejs || {
      optimizeCss: 'standard.keepLines'
    };
    config.out = output;
    config.cssIn = file;

    log.writeln(' › Handle: ' + el.get(0).outerHTML);
    log.writeln((' › Writing optimized CSS file to output ' + output).bold);
    rjs.optimize(config, function(res) {
      if(!last) return el.remove();
      // update dom tree accordingly
      el.attr('href', href);
      cb(null, res);
    });
  });
};

