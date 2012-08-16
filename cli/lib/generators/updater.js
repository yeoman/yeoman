
// Yeodater: Yeoman NPM version checker and updater for packages
// @author: Addy
// inspired by npm, npm-latest

// Reference:
//
// Sample usage:
//
// Specify your package.json path
// var packagePath = path.join(__dirname, '../../../../package.json');
//
// Just get the latest update type available
// this.getLatest(packagePath);
//
// Get the latest update type and run npm update for it
// if newer
// this.getLatest(packagePath, true);
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
// Note: If a package has not yet been published to NPM and
// you wish to test this module works with another package
// name, simply override 'packageName' in getLatest, e.g
// var packageName = 'jquery' to make sure everything works

var request = require('request'),
    colors = require('colors'),
    path = require('path'),
    fs = require('fs'),
    util = require('util'),
    childProcess = require('child_process');


updater = module.exports;

// Registry end-point
updater.registryUrl = "http://registry.npmjs.org/%s";
// Alternative registry mirrors
// http://85.10.209.91/%s
// http://165.225.128.50:8000/%s


updater.npmGetLatest = function(npmObj) {
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



// @localPackageUrl (string)
// Supply a local package URL and we'll check to see
// if there is a new version of the package 'name'
// available on NPM. This will check against your local
// package version and the remote package version then
// return either 'major', 'minor', 'patch' or 'latest'
// 
// @fetchLatest (boolean)
// Supply to denote whether or not NPM update
updater.getLatest = function(localPackageUrl, fetchLatest){
    
    var localPackage = JSON.parse(fs.readFileSync(localPackageUrl).toString());
    var packageName = localPackage.name;
    var url = util.format(this.registryUrl, packageName);
    var self = this;

    request(url, function(err, response, body) {

        // Fetch issue incurred
        if (err) {
            console.log("ERROR: ");
            console.log("\t" + err.message);
            console.log("\thttp code: " + response.statusCode);
        } else {
            var npmObj = JSON.parse(body);

            // Whoops, package not found.
            if (npmObj.error) {
                if (npmObj.error === "not_found") {
                    console.log("");
                    console.log("  Package '%s' not found in NPM.", colors.blue(packageName));
                    console.log("");
                } else {
                    console.log("ERROR");
                    console.log(npmObj.reason);
                }
            } else {

                // Package found, let's compare versions
                var latest = self.npmGetLatest(npmObj);
                var updateType = self.getUpdateType(localPackage.version, latest.version);

                if(updateType !== 'latest'){
                  self.npmRunUpdate(localPackage.name);
                };

                // also available (npmObj.author.name, repository.url, description)
                return updateType;
            }
        }
    });
};


// Compare a local package version and remote package version
// to discover what type of update (major, minor, patch) is
// available.
updater.getUpdateType = function(currentVersion, remoteVersion){

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
  childProcess.exec('npm update ' + packageName, function (error, stdout, stderr) {
     if (error) {
       console.log(error.stack);
       console.log('Error code: '+error.code);
     }
     console.log('Child Process STDOUT: '+stdout);
     console.log('Child Process STDERR: '+stderr);
   });
};

