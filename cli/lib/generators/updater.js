// Updater.js
// A module for updating your NPM based projects

var fs = require('fs'),
    npm  = require('npm'),
    path = require('path'),
    util = require('util'),
    events = require('events'),

    updater = module.exports,

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
   	   var current = currentVersion.split('.'),
           remote  = remoteVersion.split('.');

       // major update?
       if( remote[2] > current[2] ){
          return updateTypes.major;	

       // minor update?
       }else if( remote[1] > current[1] ){
       	  return updateTypes.minor;

       // patch?
       }else if( remote[0] > current[0] ){
       	  return updateTypes.patch;
       }else{
       	  return "Comparison error.";
       }
   }

};


updater.getRemoteVersion = function( packageName, cb ) {
    npm.load(function() {
        npm.commands.view( [ packageName, 'versions' ], function( err, data ) {
            var versions = data[ Object.keys(data)[0] ].versions;
            cb( versions[ versions.length - 1 ] );
        });
    });
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



updated.runUpdater = function( packageName ){
  
   var self = this;

   this.getRemoteVersion( packageName, function( version ){

      var remoteVersion = version;
      var updateType = self.getUpdateType( currentVersion, remoteVersion );
      var currentVersion = require('../package.json').version;

      //or var currentVersion = self.getCurrentVersion();

      if( updateType !== updateTypes.uptodate ){
   	     self.npmUpdate();
      }

   });

};

