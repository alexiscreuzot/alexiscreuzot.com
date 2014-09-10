// Typed
$(function() {
    $("span.typed").typed({
        strings: ["your next Facebook event", "your friend's birthday", "the next music festival", "the club night out", "your friend's wedding"],
        typeSpeed: 50,
        backSpeed: 30,
        backDelay: 750,
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
(function() {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if( userAgent.match( /iPad/i ) ||
      userAgent.match( /iPhone/i ) ||
      userAgent.match( /iPod/i )){
        $(".android").hide();
    }else if( userAgent.match( /Android/i ) ){
        $(".ios").hide();
    }
})();

// Pages overlays
(function() {
    $('.trigger-overlay').click(function (event) {
        var idName = ($(this).attr('id'));
        $('.overlay.'+idName).addClass('open');
        $("body").css({ overflow: 'hidden' })
    });

    $('.overlay-close').on( "click touchstart", function(event){
      $('.overlay').removeClass('open');
      $("body").css({ overflow: 'inherit' })
    });

})();
