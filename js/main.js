$(document).ready(function() {
    
	var attachFastClick = Origami.fastclick;
	attachFastClick(document.body);

	function setParticles(){

		$('#particles').particleground({
	    dotColor: "#FFF",
	    lineColor: "rgba(255,255,255, 0.1)",
	    maxSpeedX:0,
	    maxSpeedY:0,
	    minSpeedX:0,
	    minSpeedY:0,
	    density:12000,
	    proximity:160,
	    lineWidth:.5,
	    particleRadius:2.5,
	    parallaxMultiplier:-35
	 });

	}

    function showparticles() {  
        $('#particles').addClass("show"); 
        setParticles();
        
    }
    setTimeout(showparticles, 10);
	
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

