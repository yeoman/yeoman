var fs = require('fs'),
  path = require('path'),
  zlib = require('zlib'),
  request = require('request'),
  tar = require('tar');

// Check if we're behind some kind of proxy.
var proxy = process.env.http_proxy || process.env.HTTP_PROXY ||
    process.env.https_proxy || process.env.HTTPS_PROXY || '';

// heavily based on npm's util/untar.js file
module.exports = function fetch(tarball, target, cb) {
  var r = request.defaults({ proxy: proxy  }),
    now = +new Date;

  var log = this.log
    .subhead('Fetching ' + tarball)
    .writeln('This might take a few moment');

  // tarball untar opts
  var extractOpts = { type: 'Directory', path: target, strip: 1 };

  // remote request --> zlib.Unzip() --> untar into h5bp/root
  var req = r.get(tarball).on('error', cb);

  req.on('data', function() { log.write('.'); }).on('end', function() {
    log.ok().writeln();
    log.ok('Done in ' + (+new Date - now) / 1000 + 's.');
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
      log.write('.');
      entry.props.uid = entry.uid = 501;
      entry.props.gid = entry.gid = 20;
    })
    .on('error', function(err) {
      console.error('untar error', err);
      cb(err);
    })
    .on('close', function() {
      log.writeln().ok('Done in ' + extractOpts.path).writeln();
      cb();
    });
};
