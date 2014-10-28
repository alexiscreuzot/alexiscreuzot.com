

$(document).ready(function() {

  var zoomed = $("#zoomed");
  var qle = $("#qle");

  var curX = 0;
  $(document).mousemove(function(event) {
    curX = event.pageX;
  });


  setInterval(function () {

    var mid = $(window).width()/2;
    var maxDx = 12;
    var mlZoom = -154;
    var mlQle = -50;

    if(mid<=200){
      maxDx = 4;
      mlZoom = -50;
      mlQle = -30;
    }

    var dx = -(curX-mid)/mid * maxDx;
    zoomed.css('margin-left' , (mlZoom - dx));
    qle.css('margin-left' , (mlQle + dx));

  }, 200);


});
