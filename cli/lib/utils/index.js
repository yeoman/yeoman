
var path = require('path');

var utils = module.exports;

//
// flatiron/utile inspired.
//
// Set of common utilities, mainly defining wrapper to various utility modules
// (like ncp, mkdir, rimraf) as lazy-loaded getters.
//

//
// Wrapper to `require('mkdirp')`
//
utils.__defineGetter__('mkdirp', function () {
  return require('mkdirp');
});

//
// Wrapper to `require('rimraf')`
//
utils.__defineGetter__('rimraf', function () {
  return require('rimraf');
});

//
// Wrapper to `require('ncp').ncp`
//
utils.__defineGetter__('ncp', function () {
  return require('ncp').ncp;
});

//
// Wrapper to `require('./fetch')`, internal tarball helper using
// mikeal/request, zlib and isaacs/tar.
//
utils.__defineGetter__('fetch', function () {
  return require('./fetch');
});

// **extend** a given object with the util module definition, taking care
// of not triggering the getters. Doing so with _.extend makes the module
// to be required right away.
utils.extend = function extend(o) {
  var props = Object.keys(utils);
  props.forEach(function(prop) {
    o.__defineGetter__(prop, function() {
      return utils[prop];
    });
  });
  return o;
};

//
// **join** basic wrapper to `path.join`, dealing with `//` and converting back
// **`\` windows like path to unix like one.
//
utils.join = function join() {
  var args = Array.prototype.slice.call(arguments);
  return path.join.apply(path, args).replace(/\\/g, '/');
};
