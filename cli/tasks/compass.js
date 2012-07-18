module.exports = function( grunt ) {
  'use strict';

  var _ = grunt.util._;

  function optsToArgs( opts ) {
    var args = [];

    Object.keys( opts ).forEach(function( el ) {
      var val = opts[ el ];

      el = el.replace( /_/g, '-' );

      if ( val === true ) {
        args.push( '--' + el );
      }

      if ( _.isString( val ) ) {
        args.push( '--' + el, val );
      }
    });

    return args;
  }

  grunt.registerMultiTask( 'compass', 'Compass task', function() {
    var cb = this.async();
    var args = optsToArgs( this.options() );

    var compass = grunt.util.spawn({
      cmd: 'compass',
      args: ['compile'].concat( args )
    }, function( err ) {
      if ( err ) {
        grunt.fail.fatal( err );
      }
      cb();
    });

    compass.stdout.pipe( process.stdout );
    compass.stderr.pipe( process.stderr );
  });
};