
// Updater.js: npm version checker and updater for packages
// @author: Addy Osmani
// @inspired by: npm, npm-latest
//
// Sample usage:
//
// Query for the latest update
// updater.getUpdate({
//    name: pkg.name,
//    version: pkg.version,
//    success: function(update){
//      console.log('Update type available is:', update.severity);
//      console.log('You have version', update.localVersion);
//      console.log('Latest version is', update.latestVersion);
//    },
//    fetchError: function(err){
//      console.log(err.message);
//      console.log(err.httpCode);
//    },
//    npmError: function(err){
//      if (err.errType === "not_found") {
//          console.log("  Package '%s' not found in NPM.", colors.blue(pkg.name));
//          console.log("");
//      } else {
//          console.log("ERROR");
//          console.log(err.reason);
//      }
//    }
// });
//
// Alternatively, if you just want to pass in a package.json
// file directly, you can simply do:
//
// updater.getUpdate({
//    localPackageUrl: '../package.json'
//    success: function(update){
//      console.log('Update type available is:', update.severity);
//      console.log('You have version', update.localVersion);
//      console.log('Latest version is', update.latestVersion);
//    },
//    fetchError: function(err){
//      console.log(err.message);
//      console.log(err.httpCode);
//    }
// });
//
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
    childProcess = require('child_process');


updater = module.exports;

// Registry end-point
// Alternative registry mirrors
// http://85.10.209.91/%s
// http://165.225.128.50:8000/%s
updater.registryUrl = "http://registry.npmjs.org/%s";

updater.npmParseLatest = function(npmObj) {
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
// @options.success: callback for successfully returning the
// update type
//
// @options.fetchError: callback for errors with fetching the url

// @options.npmError: callback for npm errors
//
// @options.fetchLatest: a boolean to indicate whether you 
// should also fetch the latest version at the same time

updater.getUpdate = function(options){


  var self = this, url, latest, updateType, update;

  // Callbacks
  options.success = options.success || function(){};
  options.fetchError = options.fetchError || function(){};
  options.npmError = options.npmError || function(){};

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
            return options.fetchError({
              message: err.message,
              httpCode: response.statusCode
            });

        } else {
            var npmObj = JSON.parse(body);

            // Whoops, package not found.
            if (npmObj.error) {
                return options.npmError({
                  errType: npmObj.error, // not_found etc
                  reason: npmObj.reason // additional reason
                });
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

                return options.success(update);
            }
        }
    });

};



// Compare a local package version and remote package version
// to discover what type of update (major, minor, patch) is
// available.
updater.parseUpdateType = function(currentVersion, remoteVersion){

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
updater.npmRunUpdate = function(packageName){

  var spawn = childProcess.spawn;
  var bin =  'npm';
  var args = ['update '  + packageName];
  var cspr = spawn(bin, args);

  cspr.stdout.setEncoding('utf8');

  cspr.stdout.on('data', function(data) {
    var str = data.toString(), lines = str.split(/(\r?\n)/g);
    for (var i=0; i<lines.length; i++) {
      console.log(lines[i]);
    }
  });

  cspr.stderr.on('data', function(data){
    console.log(data);
  });

  cspr.on('exit', function (code) {
    console.log('child process exited with code ' + code);
    process.exit(code);
  });

};

