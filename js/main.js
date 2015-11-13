$(document).ready(function() {
    
	var attachFastClick = Origami.fastclick;
	attachFastClick(document.body);

	$("header .title a").hover(function() {
	  $(this).toggleClass("hover");
	});

	$("project .abstract").click(function() {
	  $(this).toggleClass("show");
	  $(this).children().children(".more-icon").toggleClass("open");

	  var moreDiv  = $(this).next();
	  moreDiv.toggleClass("show");
		moreDiv.children(".back-overlay").css("background-color", "rgba(20,20,20,.4)");
	  

	  var img = moreDiv.children().children().children().children('.screenshot img');
	  img.attr("src", img.attr('data-src'))
	  		.waitForImages(function(){},function(loaded, count, success) {
	  			if(success){
	  				img.parent().css("opacity", "1");
	  			}
	  }, $.noop, true);
	});


	$('a').click(function(event){
	    $('html, body').animate({
	        scrollTop: $( $.attr(this, 'href') ).offset().top
	    }, 500);
	    $(this).blur(); 
	    event.preventDefault();
	});


    // Vals
    var diviserX = 100;
    var diviserY = 140;
    var rotateMultiplier = 1;

	$("project .more").mousemove(function(e){
        var y = -25 - (e.pageX - $(this).width()/2) / diviserX;
        var x = 3 +(e.pageY - $(this).offset().top - $(this).height()/2) / diviserY;

        var img = $(this).children().children().children().children('.screenshot img');

        img.css({"-ms-transform": "perspective( 600px ) rotateY("+(y*rotateMultiplier)+"deg) rotateX( "+(x*rotateMultiplier)+"deg)",
                 "-webkit-transform": "perspective( 600px ) rotateY("+(y*rotateMultiplier)+"deg) rotateX( "+(x*rotateMultiplier)+"deg)",
                 "transform": "perspective( 600px ) rotateY("+(y*rotateMultiplier)+"deg) rotateX( "+(x*rotateMultiplier)+"deg)"});
      
    });

    $("project .more").mouseout(function(e){
        var img = $(this).children().children().children().children('.screenshot img');
        img.css({"-ms-transform": "perspective( 600px ) rotateY( -25deg ) rotateX( 5deg )",
                 "-webkit-transform": "perspective( 600px ) rotateY( -25deg ) rotateX( 5deg )",
                 "transform": "perspective( 600px ) rotateY( -25deg ) rotateX( 5deg )"});
      
    });
});

