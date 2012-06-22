// Agency code.

$( document ).ready( function() {

  //
  $('pre code').addClass('prettyprint');
  //
  $( window ).bind( 'load resize', setMenuBackgroundHeight );

  prettyPrint();

  setMenuBackgroundHeight();

});


var setMenuBackgroundHeight = function() {

  var d = $( document ).height();
  var w = $( window ).width();

  if( w > 760 ) {
    $( 'nav' ).css( { "min-height": (d) } );
  } else {
    $( 'nav' ).css( { "min-height": (100) } );
  }

}