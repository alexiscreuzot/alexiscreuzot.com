$(function() {

	// -------------------------------
    // FastClick
    // -------------------------------
    var attachFastClick = Origami.fastclick;
	attachFastClick(document.body);

    // -------------------------------
    // Navigation
    // -------------------------------
	var contentSections = $('section'),
		navigationItems = $('#vertical-nav a');

	updateNavigation();
	$(window).on('scroll', function(){
		updateNavigation();
		$('#vertical-nav').removeClass('open');
	});

	//smooth scroll to the section
	navigationItems.on('click', function(event){
        event.preventDefault();
        smoothScroll($(this.hash));
    });

    //smooth scroll to second section
    $('.scroll-down').on('click', function(event){
        event.preventDefault();
        smoothScroll($(this.hash));
    });

    //open-close navigation on touch devices
    $('.nav-trigger').on('click', function(){
    	$('#vertical-nav').toggleClass('open');

    });

	function updateNavigation() {
		contentSections.each(function(){
			$this = $(this);
			var activeSection = $('#vertical-nav a[href="#'+$this.attr('id')+'"]').data('number') - 1;
			if ( ( $this.offset().top - $(window).height()/2 < $(window).scrollTop() ) && ( $this.offset().top + $this.height() - $(window).height()/2 > $(window).scrollTop() ) ) {
				navigationItems.eq(activeSection).addClass('is-selected');
			}else {
				navigationItems.eq(activeSection).removeClass('is-selected');
			}
		});
	}

	function smoothScroll(target) {
        $('body,html').animate(
        	{'scrollTop':target.offset().top},
        	600
        );
	}
});
