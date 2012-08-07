// Updater.js
// A module for updating your NPM based projects

var fs = require('fs'),
    npm  = require('npm'),
    path = require('path'),
    util = require('util'),
    events = require('events'),

    updater = module.exports,

    // Regular Expression for matching x.x.x
    versionRE = /([0-9])+\.([0-9])+\.([0-9])/,

    // The types of updates supported
    updateTypes = {

    	// patch 0.0.x: Forced auto-update with opt-out 
    	// ability. Since it should only contain backwards 
    	// compatible bugfixes. Though some companies may 
    	// want to opt out.
    	patch: 'PATCH', 

    	// minor 0.x.0: Update prompts (with auto-update 
        // after a set time) with ability to opt out of 
        // auto-update.
    	minor: 'MINOR',

        // major: x.0.0: Update prompts (no time-limit), 
        // since this can contain backwards incompatible changes.
    	major: 'MAJOR',

    	// up to date
    	uptodate: 'UP-TO-DATE'
    };


updater.getLocalPackage = function( filePath ){
    if(!filePath){
    	filePath = "/package.json";
    }
    return fs.readFileSync(path.resolve(filePath), 'utf8') || "";
};

updater.getCurrentVersion = function(){
    var package = this.getLocalPackage('../package.json');
    var contents = JSON.parse(package);
    return contents.version;
};

updater.getUpdateType = function( currentVersion, remoteVersion ){

   if( currentVersion  === remoteVersion ){
     return updateTypes.uptodate;
   }else{

   	   // Regex against versions for comparison
   	   var current = versionRE.exec(currentVersion),
           remote  = versionRE.exec(remoteVersion);

       // major update?
       if( remote[3] > current[3] ){
          return updateTypes.major;	

       // minor update?
       }else if( remote[2] > current[2] ){
       	  return updateTypes.minor;

       // patch?
       }else if( remote[1] > current[1] ){
       	  return updateTypes.patch;
       }else{
       	  return "Comparison error.";
       }
   }

};

updater.getRemoteVersion = function(){
    // we have to implement getting the latest
    // version from NPM. We may need to get yeoman
    // listed privately before this can be done.
    // XX: do this with another project as a POC
    // first if we're waiting.
};

updater.npmIsOutdated = function(){
  npm.load(function(){
     npm.commands.ls();
     npm.commands.outdated();
  });
};

updater.npmUpdate = function( packageName ){
  npm.load(function(){
     npm.commands.update( packageName, function(){
        // ...
     });
  });
};



updated.runUpdater = function(){
  var remoteVersion  = "0.1.5", // getRemoteVersion()
      currentVersion = this.getCurrentVersion(),
      updateType     = this.getUpdateType( currentVersion, remoteVersion );

   if(updateType === updateTypes.major ||
   	  updateType === updateTypes.minor ||
   	  updateType === updateTypes.patch ){

   	  this.npmUpdate();
   }
};

