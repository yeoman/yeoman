
// Module dependencies

var fs = require('fs'),
  path = require('path');

// setup up every remote project definition in this directory as lazy-loaded
// getters

var remotes = module.exports;

fs.readdirSync(__dirname).forEach(function(remote) {
  // bypass itself..
  if(remote === 'index.js') return;
  // if it's a dir..
  if(fs.statSync(path.join(__dirname, remote)).isDirectory()) return;

  // strip out ext
  remote = remote.replace(path.extname(remote), '');

  // define lazy-loaded getter, capitalized.
  remotes.__defineGetter__(remote.charAt(0).toUpperCase() + remote.slice(1), function() {
    return require('./' + remote);
  });

});
