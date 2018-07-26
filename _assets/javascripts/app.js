
$(document).ready(function() {

    $(document).scroll(function() {
        var scrollTop = $(document).scrollTop();
        var screenHeight = $(window).height();

        if(scrollTop <  screenHeight){
            $("header").css({
                "background-color": "rgba(8,8,18,"+ (0.2+scrollTop/screenHeight)  +")"
            });
        }
    });
    
	var attachFastClick = Origami.fastclick;
	attachFastClick(document.body);

    var sky = new cbMilyWay({id: "sky",
                    popularity: 0.1, // Per Screen Width
                    freezedRollupSpeed: 0.003,
                    speedMin: 0.02,
                    maxTrailLength: .8});
    sky.drawStars();
    sky.animateSky();
    
    $( "a.button" ).hover(
      function() {
        sky.freezed = true;
      }, function() {
        sky.freezed = false;
      }
    );
	
	$('header .title a').click(function(event){
	    $('#particles').particleground('restart');
	});

	$("header .title a").hover(function() {
	  $(this).toggleClass("hover");
	});

	$("project .abstract").click(function() {
	  $(this).toggleClass("show");
	  $(this).children().children(".more-icon").toggleClass("open");

	  if( $(this).hasClass("show") ){
	  	var textDelta = -parseInt($(this).css('font-size')) + 24;
	  	$('html, body').animate({
	        scrollTop: ($(this).offset().top - $(this).outerHeight(false) - textDelta)
	    }, 300);
	  }

	  var moreDiv  = $(this).next();
	  moreDiv.toggleClass("show");
	  moreDiv.css("background-image", "url("+moreDiv.attr('data-src')+")")
	  		.waitForImages(function(){},function(loaded, count, success) {
	  			if(success){
	  				moreDiv.children(".back-overlay").css("background-color", "rgba(0,0,0,.5)");
	  			}
	  }, $.noop, true);

	  var img = moreDiv.children().children().children().children('.screenshot img');
	  img.attr("src", img.attr('data-src'))
	  		.waitForImages(function(){},function(loaded, count, success) {
	  			if(success){
	  				img.parent().css("opacity", "1");
	  			}
	  }, $.noop, true);

	});

	$('header a').click(function(event){
	    $('html, body').animate({
	        scrollTop: $( $.attr(this, 'href') ).offset().top
	    }, 300);
	    $(this).blur(); 
	    event.preventDefault();
	});

	String.prototype.reverse = function () {
	    return this.split("").reverse().join("");
	};

	$('a.e-mail').click(function(event){
		var user = $(this).attr("data-user").split("").reverse().join("");
		var domain = $(this).attr("data-website").split("").reverse().join("");
	    window.location.href = "mailto:"+user+"@"+domain;
	    event.preventDefault();
	});

    // Vals
    var diviserX = 140;
    var diviserY = 140;
    var rotateMultiplier = 1;

	$("project .more").mousemove(function(e){
        var y = -25 - (e.pageX - $(this).width()/2) / diviserX;
        var x = 3 +(e.pageY - $(this).offset().top - $(this).height()/2) / diviserY;
  
        var img = $(this).children().children().children().children('.screenshot .content');

        img.css({"-ms-transform": "perspective( 600px ) rotateY("+(y*rotateMultiplier)+"deg) rotateX( "+(x*rotateMultiplier)+"deg)",
                 "-webkit-transform": "perspective( 600px ) rotateY("+(y*rotateMultiplier)+"deg) rotateX( "+(x*rotateMultiplier)+"deg)",
                 "transform": "perspective( 600px ) rotateY("+(y*rotateMultiplier)+"deg) rotateX( "+(x*rotateMultiplier)+"deg)"});
      
    });

    $("project .more").mouseout(function(e){
        var img = $(this).children().children().children().children('.screenshot .content');
        img.css({"-ms-transform": "perspective( 600px ) rotateY( -20deg ) rotateX( 5deg )",
                 "-webkit-transform": "perspective( 600px ) rotateY( -20deg ) rotateX( 5deg )",
                 "transform": "perspective( 600px ) rotateY( -20deg ) rotateX( 5deg )"});
      
    });
});

