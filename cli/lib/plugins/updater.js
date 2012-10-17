// Updater.js: npm version checker and updater for packages
// @author: Addy Osmani and Sindre Sorhus
// @inspired by: npm, npm-latest
//
// Sample usage:
//
// Query for the latest update type
// updater.getUpdate({ name: 'grunt', version: pkg.version }, function( error, update ) {
//   console.log('Update checking complete');
// });
//
// Alternatively, if you just want to pass in a package.json
// file directly, you can simply do:
//
// updater.getUpdate({ localPackageUrl: '../package.json' }, function( error, update ) {
//   console.log('Update checking complete');
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
var prompt = require('prompt');


var updater = module.exports;


var config = (function() {
  var mkdirp = require('mkdirp');
  var homeDir = process.env[ process.platform === 'win32' ? 'USERPROFILE' : 'HOME' ];
  var folderPath = path.join( homeDir, '.config', 'npm-updater' );
  // Function, since _packageName is not available when this is init'd
  var filename = function() {
    return updater._packageName + '.json';
  };

  var loadConfig = function() {
    try {
      return JSON.parse( fs.readFileSync( path.join( folderPath, filename() ), 'utf-8' ) || {} );
    } catch ( err ) {
      // Create dir if it doesn't exist
      if ( err.errno === 34 ) {
        mkdirp.sync( folderPath );
        return {};
      }
    }
  };

  return {
    get: function( key ) {
      return loadConfig()[ key ];
    },
    set: function( key, val ) {
      var config = loadConfig();
      config[ key ] = val;
      fs.writeFileSync( path.join( folderPath, filename() ), JSON.stringify( config, null, '\t' ) );
    }
  };
})();




// Registry end-point
// Alternative registry mirrors
// http://85.10.209.91/%s
// http://165.225.128.50:8000/%s
updater.registryUrl = 'http://registry.npmjs.org/%s';

// How often the updater should check for updates
updater.updateCheckInterval = 1000 * 60 * 60 * 24; // 1 day

// How long it should wait until force auto-update
updater.updatePromptTimeLimit = 1000 * 60 * 60 * 24 * 7; // 1 week


// Prompt for update
updater.promptUpdate = function promptUpdate( cb ) {
  prompt.start();
  prompt.message = 'yeoman'.red;
  prompt.get([{
    name: 'shouldUpdate',
    message: ( 'Do you want to upgrade ' + this._packageName + '?' ).yellow
  }], function( err, result ) {
    cb( !err && /^y/i.test( result.shouldUpdate ) );
  });
};


// TODO(sindresorhus): Docs
// Prefilter to be overriden if custom logic is needed
updater.shouldUpdate = function shouldUpdate( update, cb ) {
  var severity = update.severity;

  console.log('Update available: ' + update.latest.green +
              (' (current: ' + update.current + ')').grey );

  if ( config.get('optOut') === true ) {
    console.log('You have opted out of automatic updates');
    console.log('Run `npm update -g yeoman` to update');
    return cb( false );
  }

  if ( severity === 'patch' ) {
    cb( true );
  }

  if ( severity === 'minor' ) {
    // Force auto-update if it's past the set time limit
    if ( new Date() - new Date( update.date ) > this.updatePromptTimeLimit ) {
      console.log( 'Forcing update because it\'s been too long since last'.red );
      return cb( true );
    }

    this.promptUpdate(function( shouldUpdate ) {
      cb( shouldUpdate );
    });
  }

  if ( severity === 'major' ) {
    this.promptUpdate(function( shouldUpdate ) {
      cb( shouldUpdate );
    });
  }
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
// cb: callback for when the update checks and update is complete

updater.getUpdate = function getUpdate( options, cb ) {
  var localPackage, url;
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
      cb();
      return console.error('No package name/version or local package supplied');
    }
  }

  // Expose the packageName internally, but still
  // make it accessible if somone would need it
  this._packageName = options.name;

  // Create the `optOut` option, so it's easy to switch the flag
  if ( config.get('optOut') === undefined ) {
    config.set( 'optOut', false );
  }

  // Only check for updates on a set interval
  if ( new Date() - config.get('lastUpdateCheck') < this.updateCheckInterval ) {
    cb();
    return;
  }

  console.log('Starting update check...');

  // Update the last update check date
  config.set( 'lastUpdateCheck', +new Date() );

  // Step 2: Query the NPM registry for the latest package
  url = util.format( this.registryUrl, options.name );

  request({ url: url, json: true }, function( error, response, body ) {
    var latest, update;

    // TODO(sindresorhus): Look into the best way to output errors, only cb or cb + emit?

    // Fetch issue incurred
    if ( error ) {
      controller.emit('fetchError', {
        message: error.message,
        httpCode: response && response.statusCode
      });

      cb( error );

      return;
    }

    // Whoops, package not found
    if ( body.error ) {
      controller.emit('npmError', {
          errorType: body.error, // not_found etc
          reason: body.reason // additional reason
      });

      cb( error );

      return;
    }

    // Step 3: Package found, lets compare versions
    latest = Object.keys( body.time ).reverse()[0];

    // Details to expose about the update
    update = {
      latest: latest,
      date: body.time[ latest ],
      current: options.version,
      severity: this.parseUpdateType( options.version, latest )
    };

    if ( update.severity !== 'latest' ) {
      this.shouldUpdate( update, function( shouldUpdate ) {
        if ( shouldUpdate ) {
          this.updatePackage( options.name, function( err, data ) {
            if ( err ) {
              console.error( '\nUpdate error', err );
            } else {
              console.log( '\nUpdated successfully!'.green );
            }

            cb( err, update );
          });
        } else {
          cb( err, update );
        }
      }.bind(this));
    } else {
      cb();
    }
  }.bind(this));
};



// Compare a local package version and remote package version
// to discover what type of update (major, minor, patch) is
// available.
updater.parseUpdateType = function parseUpdateType( current, remoteVersion ) {
  var current, remote;

  if ( current  === remoteVersion ) {
    return 'latest';
  }

  current = current.split('.');
  remote  = remoteVersion.split('.');

  if ( remote[0] > current[0] ) {
    return 'major';
  } else if ( remote[1] > current[1] ) {
    return 'minor';
  } else if ( remote[2] > current[2] ) {
    return 'patch';
  } else{
    return 'Update comparison error';
  }
};


// Run `npm update` against a specific package name
updater.updatePackage = function updatePackage( packageName, cb ) {
  // TODO(sindresorhus): Find a better solution for local packages
  // Something like going up filestructure until node_modules folder
  var child = exec( 'npm update -g ' + packageName, cb );
  console.log( 'Updating ' + packageName + '\n' );
  child.stdout.pipe( process.stdout );
  child.stderr.pipe( process.stderr );
};
