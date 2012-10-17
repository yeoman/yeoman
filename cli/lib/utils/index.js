
var path = require('path');

var utils = module.exports;

//
// flatiron/utile inspired.
//
// Set of common utilities, mainly defining wrapper to various utility modules
// (like mkdir, rimraf) as lazy-loaded getters.


Object.defineProperties( utils,
  [
    // Wrapper to `require('mkdirp')`
    'mkdirp',
    // Wrapper to `require('rimraf')`
    'rimraf',
    // Wrapper to `require('./fetch')`, internal tarball helper using
    // mikeal/request, zlib and isaacs/tar.
    './fetch'
  ].reduce(function( descriptor, api ) {
    return (
      // Add the Identifier and define a get accessor that returns
      // a fresh or cached copy of the API; remove any
      // non-alphanumeric characters (in the case of "./fetch")
      descriptor[ api.replace(/\W/g, '') ] = {
        get: function() { return require(api); }
      },
      // Return the |descriptor| object at the end of the expression,
      // continuing the the reduction.
      descriptor
    );
    // Prime the "initialVal" with an empty object
  }, {})
);


// **extend** a given object with the util module definition, taking care
// of not triggering the getters. Doing so with _.extend makes the module
// to be required right away.
utils.extend = function extend(o) {
  Object.keys(utils).forEach(function(prop) {
    Object.defineProperty(o, prop, {
      get: function() {
        return utils[prop];
      }
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
