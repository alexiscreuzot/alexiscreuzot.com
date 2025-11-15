// Minimalist Website - Simplified JavaScript

$(document).ready(function() {

  // Smooth scrolling for anchor links
  $('a[href^="#"]').on('click', function(event) {
    var target = $(this.getAttribute('href'));
    if (target.length) {
      event.preventDefault();
      $('html, body').stop().animate({
        scrollTop: target.offset().top - 20
      }, 600, 'swing');
    }
  });

  // Progressive blur on intro section when scrolling
  var introSection = $('#intro');
  var introHeight = introSection.outerHeight();
  var maxBlur = 8; // Maximum blur in pixels
  
  $(window).on('scroll', function() {
    var scrollTop = $(window).scrollTop();
    var introOffset = introSection.offset().top;
    var introBottom = introOffset + introHeight;
    
    // Only apply blur when scrolling past the intro section
    if (scrollTop > introOffset && scrollTop < introBottom) {
      var scrollProgress = (scrollTop - introOffset) / introHeight;
      scrollProgress = Math.min(scrollProgress, 1); // Clamp between 0 and 1
      var blurAmount = scrollProgress * maxBlur;
      
      introSection.css({
        'filter': 'blur(' + blurAmount + 'px)',
        '-webkit-filter': 'blur(' + blurAmount + 'px)',
        'opacity': 1 - (scrollProgress * 0.3) // Slight fade as well
      });
    } else if (scrollTop <= introOffset) {
      // Reset when scrolled back to top
      introSection.css({
        'filter': 'blur(0px)',
        '-webkit-filter': 'blur(0px)',
        'opacity': 1
      });
    }
  });

  // Intersection Observer for fade-in animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe all work, websites, and community items
  document.querySelectorAll('.work__item, .websites__item, .community__item').forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(item);
  });

  // Email obfuscation (if needed in future)
  String.prototype.reverse = function() {
		return this.split("").reverse().join("");
	};

});
