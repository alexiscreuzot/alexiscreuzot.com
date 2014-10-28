

$(document).ready(function() {

  var maxDx = 10;
  var mid = $(window).width()/2;

  var loupe = $(".loupe");
  var zoomed = $(".zoomed");
  var qle = $("#qle");

  $(window).mousemove(function( event ) {
    var msg = event.pageX ;
    var dx = (event.pageX-mid)/mid * maxDx;

    loupe.css('margin-left' , (-30 + dx));
    zoomed.css('margin-left' , (-148 - dx));
    qle.css('margin-left' , (-50 + dx));
  });

});
