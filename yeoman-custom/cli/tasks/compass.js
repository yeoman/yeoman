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

      if( _.isArray( val ) ) {
        val.forEach(function( subval ) {
          args.push( '--' + el, subval );
        });
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
    }, function( err, result, code ) {
      if ( /not found/.test( err ) ) {
        grunt.fail.fatal('You need to have Compass installed.');
      }
      // Since `compass compile` exits with 1 when it has nothing to compile,
      // we do a little workaround by checking stdout which is then empty
      // https://github.com/chriseppstein/compass/issues/993
      cb( code === 0 || !result.stdout );
    });

    compass.stdout.pipe( process.stdout );
    compass.stderr.pipe( process.stderr );
  });
};
