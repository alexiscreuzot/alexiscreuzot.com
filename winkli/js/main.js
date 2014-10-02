// Typed
$(function() {
    $("span.typed").typed({
        strings: ["your next Facebook event", "the next music festival", "your neighbor's birthday", "the club night out", "your friend's wedding"],
        typeSpeed: 50,
        backSpeed: 20,
        backDelay: 1200,
        loop: true
    });
});

// Video preload
(function() {
    window.addEventListener('load', function() {
        var video = document.querySelector('video');
        var preloader = document.querySelector('.preloader');
        function checkLoad() {
            if (video.readyState === 4) {
                $("#overlay-video-preloader").addClass("loaded");
            } else {
                setTimeout(checkLoad, 100); // recurse
            }
        }
        checkLoad();
    }, false);
})();

// App links based on user agent
// Pages overlays
(function() {

  if(window.location.hash) {
    $('.overlay.'+window.location.hash.slice(1)).addClass('open');
  }

    // User agent
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;
    var isAndroid = userAgent.match( /Android/i );
    var isIOS = (userAgent.match( /iPad/i ) ||userAgent.match( /iPhone/i ) || userAgent.match( /iPod/i ));

    if(isIOS){
        $(".android").hide();
    }else if(isAndroid){
        $(".ios").hide();
    }
    // Overlays
    $('.trigger-overlay').click(function (event) {
        var idName = ($(this).attr('id'));
        $('.overlay.'+idName).addClass('open');
        $("body").css({ overflow: 'hidden' });

        if(isIOS){
          $("video").hide();
        }
    });

    $('.overlay-close').on( "touchstart click", function(event){
      $('.overlay').removeClass('open');
      $("body").css({ overflow: 'inherit' });

      if(isIOS){
        $("video").show();
      }
    });

})();
