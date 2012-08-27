// Updater.js: npm version checker and updater for packages
// @author: Addy Osmani
// @inspired by: npm, npm-latest
//
// Sample usage:
//
// Query for the latest update type
// updater.getUpdate({ name: 'grunt', version: pkg.version }, function( update ) {
//
//      console.log( 'Update type available is:', colors.yellow( update.severity ) );
//      console.log( 'You have version', colors.blue( update.localVersion ) );
//      console.log( 'Latest version is', colors.red( update.latestVersion ) );
//      console.log( 'To get the latest version run: ' + colors.green('npm update yeoman -g') );
//
// });
//
// Alternatively, if you just want to pass in a package.json
// file directly, you can simply do:
//
// updater.getUpdate({ localPackageUrl: '../package.json' }, function( update ) {
//
//      console.log( 'Update type available is:', colors.yellow( update.severity ) );
//      console.log( 'You have version', colors.blue( update.localVersion ) );
//      console.log( 'Latest version is', colors.red( update.latestVersion ) );
//      console.log( 'To get the latest version run:' + colors.green('npm update yeoman -g') );
//
// });
//
// Both will either return patch, minor, major or latest. These
// correspond to:
//
// patch 0.0.x: Forced auto-update with opt-out
// ability. Since it should only contain backwards
// compatible bugfixes.
//
// minor 0.x.0: Update prompts (with auto-update
// after a set time) with ability to opt out of
// auto-update.
//
// major: x.0.0: Update prompts (no time-limit),
// since this can contain backwards incompatible changes.
//
// latest: you are already up to date
//

var fs = require('fs');
var path = require('path');
var util = require('util');
var exec = require('child_process').exec;
var EventEmitter = require('events').EventEmitter;
var request = require('request');
var colors = require('colors');


updater = module.exports;

// Registry end-point
// Alternative registry mirrors
// http://85.10.209.91/%s
// http://165.225.128.50:8000/%s
updater.registryUrl = 'http://registry.npmjs.org/%s';

//
// updater.getUpdate()
// Returns the severity of the latest update available
//
// Supported options:
//
// @options.name: package name
//
// @options.version: local package version
//
// @options.localPackageUrl: the url to a local package to be
// checked against if no package name or version are supplied
//
// @options.fetchLatest: a boolean to indicate whether you
// should also fetch the latest version at the same time
//
// cb: callback for successfully returning the
// update type

updater.getUpdate = function getUpdate( options, cb ) {
  var localPackage, url;
  var self = this;
  var controller = new EventEmitter();

  cb = cb || function() {};

  // Step 1: We need a package name and version to work off.

  // Ideally, supply us with the package name and version
  if ( options.name === undefined || options.version === undefined ) {
    // If not, we'll ascertain from a local package.json file
    if ( options.localPackageUrl ) {
      localPackage = require( options.localPackageUrl );
      options.name = localPackage.name;
      options.version = localPackage.version;
    } else {
      return console.error('No package name/version or local package supplied');
    }
  }

  // Step 2: Query the NPM registry for the latest package
  url = util.format( this.registryUrl, options.name );

  request({ url: url, json: true }, function( error, response, body ) {
    var latestVersion, update;

    // Fetch issue incurred
    if ( error ) {
      controller.emit('fetchError', {
        message: error.message,
        httpCode: response.statusCode
      });

      return;
    }

    // Whoops, package not found.
    if ( body.error ) {
      controller.emit('npmError', {
          errorType: body.error, // not_found etc
          reason: body.reason // additional reason
      });

      return;
    }

    // Step 3: Package found, lets compare versions
    latestVersion = Object.keys( body.time ).reverse()[0];

    // Details to expose about the update
    update = {
      latestVersion: latestVersion,
      localVersion: options.version,
      severity: self.parseUpdateType( options.version, latestVersion )
    };

    // Possibly deprecate: fetch latest
    if ( update.severity !== 'latest' && options.fetchLatest === true ) {
      self.updatePackage( options.name );
    };

    return cb( update );
  });
};



// Compare a local package version and remote package version
// to discover what type of update (major, minor, patch) is
// available.
updater.parseUpdateType = function parseUpdateType( currentVersion, remoteVersion ) {
  var current, remote;

  if ( currentVersion  === remoteVersion ) {
    return 'latest';
  }

  current = currentVersion.split('.');
  remote  = remoteVersion.split('.');

  if ( remote[2] > current[2] ) {
    return 'major';
  } else if ( remote[1] > current[1] ) {
    return 'minor';
  } else if ( remote[0] > current[0] ) {
    return 'patch';
  } else{
    return 'Update comparison error.';
  }
};


// Run `npm update` against a specific package name
updater.updatePackage = function updatePackage( packageName ) {
  var child = exec('npm update ' + packageName, function() {
    // complete
  });

  child.stdout.pipe( process.stdout );
  child.stderr.pipe( process.stderr );
};
