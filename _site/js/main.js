$(document).ready(function() {
    
	var attachFastClick = Origami.fastclick;
	attachFastClick(document.body);

	function setParticles(){
		$('#particles').particleground({
	    dotColor: '#DA1E29',
	    lineColor: '#DA1E29',
	    maxSpeedX:0,
	    maxSpeedY:0,
	    minSpeedX:0,
	    minSpeedY:0,
	    density:14000,
	    proximity:170,
	    lineWidth:.5,
	    particleRadius:4,
	    parallaxMultiplier:-40
	 });
	}

    setTimeout(setParticles(), 500)
	
	$('.title').click(function(event){
	    $('#particles').particleground('destroy');
	    setParticles()
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
	  				moreDiv.children(".back-overlay").css("background-color", "rgba(0,0,0,.4)");
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

	$('a').click(function(event){
	    $('html, body').animate({
	        scrollTop: $( $.attr(this, 'href') ).offset().top
	    }, 300);
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

