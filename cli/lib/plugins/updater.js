
// Updater.js: npm version checker and updater for packages
// @author: Addy Osmani
// @inspired by: npm, npm-latest
//
// Sample usage:
//
// Query for the latest update type
// updater.getUpdate({ name: 'grunt', version: pkg.version }, function(update){
//
//      console.log('Update type available is:', colors.yellow(update.severity));
//      console.log('You have version', colors.blue(update.localVersion));
//      console.log('Latest version is', colors.red(update.latestVersion));
//      console.log('To get the latest version run:' + colors.green(' npm update yeoman -g'));
//
// });
//
// Alternatively, if you just want to pass in a package.json
// file directly, you can simply do:
//
// updater.getUpdate({ localPackageUrl: '../package.json'}, function(update){
//
//      console.log('Update type available is:', colors.yellow(update.severity));
//      console.log('You have version', colors.blue(update.localVersion));
//      console.log('Latest version is', colors.red(update.latestVersion));
//      console.log('To get the latest version run:' + colors.green(' npm update yeoman -g'));
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

var request = require('request'),
    colors = require('colors'),
    path = require('path'),
    fs = require('fs'),
    util = require('util'),
    EventEmitter = require('events').EventEmitter,
    childProcess = require('child_process');


updater = module.exports;

// Registry end-point
// Alternative registry mirrors
// http://85.10.209.91/%s
// http://165.225.128.50:8000/%s
updater.registryUrl = "http://registry.npmjs.org/%s";

updater.npmParseLatest = function npmParseLatest(npmObj) {
    var versions = [];
    for (var version in npmObj.time) {
        versions.push(version);
    }

    var lastVersion = versions[versions.length - 1];
    var lastTime = npmObj.time[lastVersion];

    return {
        "version": lastVersion,
        "time": new Date(lastTime)
    };
};


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

updater.getUpdate = function getUpdate(options, cb){

  var self = this, url, latest, updateType, update, controller;
  cb = cb || function(){};

  controller = new EventEmitter();

  // Step 1: We need a package name and version to work off.

  // Ideally, supply us with the package name and version
  if(options.name === undefined || options.version === undefined){

      // If not, we'll ascertain from a local package.json file
      if(options.localPackageUrl){

        var localPackage = JSON.parse(fs.readFileSync(options.localPackageUrl).toString());
        options.name = localPackage.name;
        options.version = localPackage.version;

      }else{
        console.error('No package name/version or local package supplied');
      }
  }

    // Step 2: Query the NPM registry for the latest package
    url = util.format(this.registryUrl, options.name);

    request(url, function(err, response, body) {

        // Fetch issue incurred
        if (err) {

            controller.emit("fetchError", {
              message: err.message,
              httpCode: response.statusCode
            });

            return;

        } else {
            var npmObj = JSON.parse(body);

            // Whoops, package not found.
            if (npmObj.error) {

              controller.emit("npmError", {
                  errType: npmObj.error, // not_found etc
                  reason: npmObj.reason // additional reason
              });

            return;

            } else {

                // Step 3: Package found, lets compare versions
                latest = self.npmParseLatest(npmObj);
                updateType = self.parseUpdateType(options.version, latest.version);

                // Details to expose about the update
                update = {
                  latestVersion: latest.version,
                  localVersion: options.version,
                  severity: updateType
                };

                // Possibly deprecate: fetch latest
                if(updateType !== 'latest' && options.fetchLatest === true){
                  self.npmRunUpdate(options.name);
                };

                return cb(update);
            }
        }
    });

};



// Compare a local package version and remote package version
// to discover what type of update (major, minor, patch) is
// available.
updater.parseUpdateType = function parseUpdateType(currentVersion, remoteVersion){

   // already on latest?
   if( currentVersion  === remoteVersion ){
     return 'latest';
   }else{

       // Regex against versions for comparison
       var current = currentVersion.split('.'),
           remote  = remoteVersion.split('.');

       // major update?
       if( remote[2] > current[2] ){
          return 'major';
       // minor update?
       }else if( remote[1] > current[1] ){
          return 'minor';
       // patch?
       }else if( remote[0] > current[0] ){
          return 'patch';
       }else{
          return "Comparison error.";
       }
   }

};


// Run npm update against a specific package name
updater.npmRunUpdate = function npmRunUpdate(packageName){

  var child = exec('npm update ' + packageName, function() {
    // complete
  });

  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);

};




