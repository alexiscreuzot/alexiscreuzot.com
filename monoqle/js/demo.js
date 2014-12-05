
$(document).ready(function() {

  var zoomed = $("#zoomed");
  var qle = $("#qle");

  var curX = 0;

  // Desktop
  $(document).mousemove(function(event) {
    curX = event.pageX;
  });

  // Mobile
  document.addEventListener('touchmove', function(e) {
    e.preventDefault();
    var touch = e.touches[0];
    curX = touch.pageX;
  }, false);

  // Mobile with accelerometer

  if (window.DeviceOrientationEvent) {
    window.addEventListener("deviceorientation", function () {
        curX = (event.gamma + 40) * ($(window).width()/80);
    }, true);
  }

  setInterval(function () {

    var mid = $(window).width()/2;
    var maxDx = 14;
    var mlZoom = -134;
    var mlQle = -50;

    if(mid<=200){
      maxDx = 4;
      mlZoom = -50;
      mlQle = -20;
    }

    var dx = -(curX-mid)/mid * maxDx;
    zoomed.css('margin-left' , (mlZoom - dx*1.4));
    qle.css('margin-left' , (mlQle + dx));

  }, 200);


});
