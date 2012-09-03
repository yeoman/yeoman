// Updater.js: npm version checker and updater for packages
// @author: Addy Osmani and Sindre Sorhus
// @inspired by: npm, npm-latest
//
// Sample usage:
//
// Query for the latest update type
// updater.getUpdate({ name: 'grunt', version: pkg.version }, function( update ) {
//
//      console.log( 'Update type available is:', colors.yellow( update.severity ) );
//      console.log( 'You have version', colors.blue( update.current ) );
//      console.log( 'Latest version is', colors.red( update.latest ) );
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
//      console.log( 'You have version', colors.blue( update.current ) );
//      console.log( 'Latest version is', colors.red( update.latest ) );
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
var prompt = require('prompt');


var updater = module.exports;


var config = (function() {
  var mkdirp = require('mkdirp');
  var homeDir = process.env[ ( process.platform == 'win32' ) ? 'USERPROFILE' : 'HOME' ];
  var folderPath = path.join( homeDir, '.config', 'npm-updater' );
  // Function, since _packageName is not available when this is init'd
  var filename = function() {
    return updater._packageName + '.json';
  };

  var loadConfig = function() {
    try {
      return JSON.parse( fs.readFileSync( path.join( folderPath, filename() ), 'utf-8' ) || {} );
    } catch ( err ) {
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
      fs.writeFileSync( path.join( folderPath, filename() ), JSON.stringify( config ) );
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

// Last time the update check was run
Object.defineProperty( updater, '_lastUpdateCheck', {
  get: function() {
    return config.get('lastUpdateCheck');
  },
  set: function( timestamp ) {
    config.set( 'lastUpdateCheck', timestamp );
  }
});


// Prompt for update
updater.promptUpdate = function promptUpdate( cb ) {
  prompt.start();
  prompt.message = 'yeoman'.red;
  prompt.get([{
    name: 'shouldUpdate',
    message: 'Do you want to upgrade Yeoman?'.yellow
  }], function( err, result ) {
    cb( !err && /^y/i.test( result.shouldUpdate ) );
  });
};


// TODO(sindresorhus): Docs
// Prefilter to be overriden if custom logic is needed
updater.shouldUpdate = function shouldUpdate( update, cb ) {
  var severity = update.severity;

  console.log('Update available: ' + update.current +
              '(current: ' + update.latest + ')');

  if ( update.optOut === true ) {
    console.log('You have opted out of automatic updates.');
    console.log('Run `npm update -g yeoman` to update');
    return cb( false );
  }

  if ( severity === 'patch' ) {
    cb( true );
  }

  if ( severity === 'minor' ) {
    // Force auto-update if it's past the set time limit
    if ( +new Date() - +new Date( update.lastUpdate ) >= this.updatePromptTimeLimit ) {
      return cb( true );
    }

    this.promptUpdate(function( shouldUpdate ) {
      console.log( 'update:', shouldUpdate );
      cb( shouldUpdate );
    });
  }

  if ( severity === 'major' ) {
    this.promptUpdate(function( shouldUpdate ) {
      console.log( 'update:', shouldUpdate );
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
// @options.optOut: Give the user ability to opt-out. This option is persisted.
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

  // Expose the packageName internally
  this._packageName = options.name;

  // Only check for updates on a set
  console.log('now', new Date())
  console.log('last', new Date(this._lastUpdateCheck), this._lastUpdateCheck)
  console.log('since last update', (new Date() - this._lastUpdateCheck) / 1000)
  console.log('this.updateCheckInterval', this.updateCheckInterval)
  if ( new Date() - this._lastUpdateCheck < this.updateCheckInterval ) {
    console.log('tmp - skip update');
    return;
  }

  this._lastUpdateCheck = +new Date();
  console.log( new Date( this._lastUpdateCheck) )
  return;

  // Step 2: Query the NPM registry for the latest package
  url = util.format( this.registryUrl, options.name );

  request({ url: url, json: true }, function( error, response, body ) {
    var latest, update;

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
    latest = Object.keys( body.time ).reverse()[0];

    // Details to expose about the update
    update = {
      latest: latest,
      current: options.version,
      severity: self.parseUpdateType( options.version, latest ),
      optOut: options.optOut
    };

    if ( update.severity !== 'latest' ) {
      cb( update );

      self.shouldUpdate( update, function( shouldUpdate ) {
        if ( shouldUpdate ) {
          self.updatePackage( options.name, function( err, data ) {
            if ( err ) {
              return console.error( 'Update error', err );
            }
            controller.emit( 'packageUpdated', data );
            console.log('tmp - updated', data);
          });
        }
      });
    }
  });
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
    return 'Update comparison error.';
  }
};


// Run `npm update` against a specific package name
updater.updatePackage = function updatePackage( packageName, cb ) {
  var child = exec( 'npm update ' + packageName, { cwd: __dirname }, cb );
  child.stdout.pipe( process.stdout );
  child.stderr.pipe( process.stderr );
  console.log( 'Updating ' + packageName );
};
