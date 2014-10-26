/**
 * Particleground demo
 * @author Jonathan Nicol - @mrjnicol
 */

$(document).ready(function() {

  $( "#main" ).mouseenter(function() {
    $( "#pupil" ).addClass( "show" );
    $( "#qle" ).addClass( "show" );
  });

  $( "#main" ).mouseleave(function() {
    $( "#pupil" ).removeClass( "show" );
    $( "#qle" ).removeClass( "show" );
  });

});
