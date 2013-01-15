var fs = require('fs'),
  path = require('path'),
  colors = require('colors'),
  zlib = require('zlib'),
  request = require('request'),
  tar = require('tar');

// Check if we're behind some kind of proxy.
var proxy = process.env.http_proxy || process.env.HTTP_PROXY ||
    process.env.https_proxy || process.env.HTTPS_PROXY || '';

// heavily based on npm's util/untar.js file
function fetch(tarball, target, cb) {
  var now = +new Date();

  var log = this.log
    .subhead('Fetching ' + tarball)
    .writeln('This might take a few moment'.yellow);

  // tarball untar opts
  var extractOpts = { type: 'Directory', path: target, strip: 1 };

  // remote request --> zlib.Unzip() --> untar into h5bp/root
  var req = fetch.request.get(tarball).on('error', cb);

  req.on('data', function() { log.write('.'); }).on('end', function() {
    log.ok().writeln();
    log.ok( ('Done in ' + (+new Date() - now) / 1000 + 's.').green );
  });

  req
    // first gzip
    .pipe(zlib.Unzip())
    .on('error', function(err) {
      console.error('unzip error', err);
      cb(err);
    })
    // then tar extract into h5bp/root
    .pipe(tar.Extract(extractOpts))
    .on('entry', function(entry) {
      entry.props.uid = entry.uid = 501;
      entry.props.gid = entry.gid = 20;
    })
    .on('error', function(err) {
      console.error('untar error', err);
      cb(err);
    })
    .on('close', function() {
      log.writeln().ok( ('Done in ' + extractOpts.path).green ).writeln();
      cb();
    });
}


module.exports = fetch;

// re-expose the request with proxy defaults, so that we can
// reuse this instance of request.
fetch.request = request.defaults({ proxy: proxy });
