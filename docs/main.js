// Minimalist Website - Simplified JavaScript

// Theme Toggle Functionality
(function() {
  // Get theme from localStorage or default to dark
  function getTheme() {
    return localStorage.getItem('theme') || 'dark';
  }
  
  // Update CSS variables based on theme
  function updateCSSVariables(theme) {
    if (theme === 'light') {
      document.documentElement.style.setProperty('--font-color-base', '#000000');
      document.documentElement.style.setProperty('--font-color-highlight', '#0052a3');
      document.documentElement.style.setProperty('--color-background', '#ffffff');
      document.documentElement.style.setProperty('--font-color-base-rgb', '0, 0, 0');
      document.documentElement.style.setProperty('--font-color-highlight-rgb', '0, 82, 163');
      document.documentElement.style.setProperty('--color-background-rgb', '255, 255, 255');
    } else {
      // Reset to default dark theme values
      document.documentElement.style.setProperty('--font-color-base', '#F3F3FE');
      document.documentElement.style.setProperty('--font-color-highlight', '#58BAFC');
      document.documentElement.style.setProperty('--color-background', '#121212');
      document.documentElement.style.setProperty('--font-color-base-rgb', '243, 243, 254');
      document.documentElement.style.setProperty('--font-color-highlight-rgb', '88, 186, 252');
      document.documentElement.style.setProperty('--color-background-rgb', '18, 18, 18');
    }
  }
  
  // Set theme
  function setTheme(theme) {
    localStorage.setItem('theme', theme);
    updateCSSVariables(theme);
    if (theme === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }
  
  // Apply saved theme immediately (before DOM ready to prevent flash)
  const savedTheme = getTheme();
  updateCSSVariables(savedTheme);
  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
  }
  
  // Initialize theme toggle button
  function initThemeToggle() {
    const toggleButton = document.querySelector('.theme-toggle');
    if (!toggleButton) return;
    
    toggleButton.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      const currentTheme = getTheme();
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
    });
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThemeToggle);
  } else {
    initThemeToggle();
  }
})();

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
    } else {
      // Scrolled past intro section - keep it blurred
      introSection.css({
        'filter': 'blur(' + maxBlur + 'px)',
        '-webkit-filter': 'blur(' + maxBlur + 'px)',
        'opacity': 0.7
      });
    }
  });

  // Intersection Observer for fade-in animations with stagger
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe intro section elements with stagger animation
  const introAvatar = document.querySelector('#intro .intro__avatar');
  const introGreeting = document.querySelector('#intro .intro__greeting');
  const introBio = document.querySelector('#intro .intro__bio');
  const introLinks = document.querySelector('#intro .intro__links');
  
  if (introAvatar) {
    introAvatar.style.transition = 'opacity 3s ease-out 0s, transform 3s ease-out 0s';
    observer.observe(introAvatar);
  }
  
  if (introGreeting) {
    introGreeting.style.transition = 'opacity 3s ease-out 0.2s, transform 3s ease-out 0.2s';
    observer.observe(introGreeting);
  }
  
  if (introBio) {
    introBio.style.transition = 'opacity 3s ease-out 0.4s, transform 3s ease-out 0.4s';
    observer.observe(introBio);
  }
  
  if (introLinks) {
    introLinks.style.transition = 'opacity 3s ease-out 0.6s, transform 3s ease-out 0.6s';
    observer.observe(introLinks);
  }

  // Observe all websites items with stagger animation
  document.querySelectorAll('.websites__item').forEach((item, index) => {
    const delay = index * 0.15; // Stagger delay: 0ms, 150ms, 300ms, etc.
    item.style.transition = `opacity 3s ease-out ${delay}s, transform 3s ease-out ${delay}s`;
    observer.observe(item);
  });

  // Observe community items with stagger animation
  document.querySelectorAll('.community__item').forEach((item, index) => {
    const delay = index * 0.15; // Stagger delay: 0ms, 150ms, 300ms, etc.
    item.style.transition = `opacity 3s ease-out ${delay}s, transform 3s ease-out ${delay}s`;
    observer.observe(item);
  });

  // Observe work section elements with stagger animation
  const workTitle = document.querySelector('#work .section__title');
  const workSubtitle = document.querySelector('#work .section__subtitle');
  const workCarousel = document.querySelector('#work .work__carousel-wrapper');
  
  if (workTitle) {
    workTitle.style.transition = 'opacity 3s ease-out 0s, transform 3s ease-out 0s';
    observer.observe(workTitle);
  }
  
  if (workSubtitle) {
    workSubtitle.style.transition = 'opacity 3s ease-out 0.3s, transform 3s ease-out 0.3s';
    observer.observe(workSubtitle);
  }
  
  if (workCarousel) {
    workCarousel.style.transition = 'opacity 3s ease-out 0.6s, transform 3s ease-out 0.6s';
    observer.observe(workCarousel);
  }

  // Carousel functionality
  function initCarousel() {
    const carouselTrack = document.querySelector('.work__carousel-track');
    const carouselContainer = document.querySelector('.work__carousel-container');
    const cards = Array.from(document.querySelectorAll('.work__card:not(.work__card--clone)'));
    const prevButton = document.querySelector('.work__carousel-arrow--prev');
    const nextButton = document.querySelector('.work__carousel-arrow--next');
    
    if (!carouselTrack || !cards.length) return;
    
    let currentIndex = 0;
    let isTransitioning = false;
    
    function getCardsPerView() {
      return window.innerWidth <= 550 ? 1 : 3;
    }
    
    let cardsPerView = getCardsPerView();
    const totalCards = cards.length;
    
    // Clone cards for infinite scroll
    const clonesBefore = cards.slice(-cardsPerView);
    const clonesAfter = cards.slice(0, cardsPerView);
    
    clonesBefore.forEach(card => {
      const clone = card.cloneNode(true);
      clone.classList.add('work__card--clone');
      carouselTrack.insertBefore(clone, cards[0]);
    });
    
    clonesAfter.forEach(card => {
      const clone = card.cloneNode(true);
      clone.classList.add('work__card--clone');
      carouselTrack.appendChild(clone);
    });
    
    const allCards = carouselTrack.querySelectorAll('.work__card');
    const paginationContainer = document.querySelector('.work__carousel-pagination');
    
    // Create pagination dots
    let paginationDots = [];
    if (paginationContainer) {
      for (let i = 0; i < totalCards; i++) {
        const dot = document.createElement('button');
        dot.className = 'work__carousel-dot';
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.setAttribute('data-index', i);
        paginationContainer.appendChild(dot);
        paginationDots.push(dot);
        
        dot.addEventListener('click', function() {
          goToCard(i);
        });
      }
    }
    
    function updatePagination() {
      const isMobile = window.innerWidth <= 550;
      let activeIndex;
      
      if (isMobile) {
        // On mobile, active index is based on currentIndex
        const originalStartIndex = cardsPerView;
        activeIndex = currentIndex - originalStartIndex;
      } else {
        // On desktop, active index is based on the center card (currentIndex + 1)
        const originalStartIndex = cardsPerView;
        const centerCardIndex = currentIndex + 1;
        activeIndex = centerCardIndex - originalStartIndex;
      }
      
      // Handle wrapping for infinite scroll
      if (activeIndex < 0) {
        activeIndex = totalCards + activeIndex;
      } else if (activeIndex >= totalCards) {
        activeIndex = activeIndex - totalCards;
      }
      
      paginationDots.forEach((dot, index) => {
        if (index === activeIndex) {
          dot.classList.add('work__carousel-dot--active');
        } else {
          dot.classList.remove('work__carousel-dot--active');
        }
      });
    }
    
    function getCardWidth() {
      if (cards.length === 0) return 0;
      const card = cards[0];
      const cardWidth = card.offsetWidth;
      // Get gap from parent container (work__carousel-track)
      const trackStyle = window.getComputedStyle(carouselTrack);
      const gap = parseFloat(trackStyle.gap) || 24; // 1.5rem = 24px
      return cardWidth + gap;
    }
    
    function getCenterOffset() {
      // Calculate offset to center the middle card
      const cardWidth = getCardWidth();
      const containerWidth = carouselContainer ? carouselContainer.offsetWidth : window.innerWidth;
      const isMobile = window.innerWidth <= 550;
      
      if (isMobile) {
        // On mobile, center the current card
        return (containerWidth / 2) - (cardWidth / 2);
      } else {
        // On desktop, center the middle card of 3
        // The middle card is at currentIndex + 1
        const centerCardIndex = currentIndex + 1;
        const centerCardPosition = centerCardIndex * cardWidth;
        return (containerWidth / 2) - (cardWidth / 2) - centerCardPosition;
      }
    }
    
    // Set initial position - start at the first real card after clones
    // On desktop, center card is at currentIndex + 1, so we need currentIndex = cardsPerView - 1
    // On mobile, center card is at currentIndex, so we need currentIndex = cardsPerView
    const isMobile = window.innerWidth <= 550;
    currentIndex = isMobile ? cardsPerView : cardsPerView - 1;
    updateCarouselPosition();
    updateCenterCard();
    updatePagination();
    
    function updateCarouselPosition() {
      const cardWidth = getCardWidth();
      const isMobile = window.innerWidth <= 550;
      
      if (isMobile) {
        // On mobile, center the current card
        const containerWidth = carouselContainer ? carouselContainer.offsetWidth : window.innerWidth;
        // Get actual card width without gap for centering
        const actualCardWidth = cards[0] ? cards[0].offsetWidth : cardWidth;
        const cardPosition = currentIndex * cardWidth;
        // Center the card: container center - card left edge - half card width
        const offset = (containerWidth / 2) - cardPosition - (actualCardWidth / 2);
        carouselTrack.style.transform = `translateX(${offset}px)`;
      } else {
        // On desktop, center the middle card (currentIndex + 1)
        const containerWidth = carouselContainer ? carouselContainer.offsetWidth : window.innerWidth;
        const centerCardIndex = currentIndex + 1;
        const centerCardPosition = centerCardIndex * cardWidth;
        const centerOffset = (containerWidth / 2) - (cardWidth / 2);
        const offset = centerOffset - centerCardPosition;
        carouselTrack.style.transform = `translateX(${offset}px)`;
      }
    }
    
    function updateCenterCard(suppressTransitions = false) {
      const isMobile = window.innerWidth <= 550;
      
      if (suppressTransitions) {
        // Temporarily disable transitions on all cards and force GPU acceleration
        allCards.forEach(card => {
          card.style.transition = 'none';
          card.style.willChange = 'transform, opacity';
        });
      }
      
      allCards.forEach((card, index) => {
        const wasCenter = card.classList.contains('work__card--center');
        card.classList.remove('work__card--center');
        let isCenter = false;
        
        if (isMobile) {
          // On mobile, center card is the current one
          if (index === currentIndex) {
            card.classList.add('work__card--center');
            isCenter = true;
          }
        } else {
          // On desktop, center card is the middle of 3 visible cards
          const centerIndex = currentIndex + 1;
          if (index === centerIndex) {
            card.classList.add('work__card--center');
            isCenter = true;
          }
        }
        
        // If center state changed and we're suppressing transitions, force immediate update
        if (suppressTransitions && wasCenter !== isCenter) {
          // Force a reflow to apply styles immediately
          card.offsetHeight;
        }
      });
      
      if (suppressTransitions) {
        // Re-enable transitions after browser has processed the changes
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            allCards.forEach(card => {
              card.style.transition = '';
              card.style.willChange = '';
            });
          });
        });
      }
    }
    
    function goToNext() {
      if (isTransitioning) return;
      isTransitioning = true;
      currentIndex++;
      
      const originalStartIndex = cardsPerView;
      const originalEndIndex = originalStartIndex + totalCards;
      
      carouselTrack.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
      updateCarouselPosition();
      updateCenterCard();
      updatePagination();
      
      setTimeout(() => {
        // Check if we've reached the end and need to loop
        if (currentIndex >= originalEndIndex) {
          // Reset immediately without transition
          carouselTrack.style.transition = 'none';
          currentIndex = originalStartIndex;
          updateCarouselPosition();
          updateCenterCard(true);
          updatePagination();
          // Force a reflow
          carouselTrack.offsetHeight;
          // Re-enable transitions in next frame
          requestAnimationFrame(() => {
            carouselTrack.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            isTransitioning = false;
          });
        } else {
          isTransitioning = false;
        }
      }, 500);
    }
    
    function goToPrev() {
      if (isTransitioning) return;
      isTransitioning = true;
      currentIndex--;
      
      const originalStartIndex = cardsPerView;
      
      carouselTrack.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
      updateCarouselPosition();
      updateCenterCard();
      updatePagination();
      
      setTimeout(() => {
        // Check if we've reached the beginning and need to loop
        if (currentIndex < originalStartIndex) {
          // Reset immediately without transition
          carouselTrack.style.transition = 'none';
          currentIndex = originalStartIndex + totalCards - 1;
          updateCarouselPosition();
          updateCenterCard(true);
          updatePagination();
          // Force a reflow
          carouselTrack.offsetHeight;
          // Re-enable transitions in next frame
          requestAnimationFrame(() => {
            carouselTrack.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            isTransitioning = false;
          });
        } else {
          isTransitioning = false;
        }
      }, 500);
    }
    
    function goToCard(targetIndex) {
      if (isTransitioning) return;
      
      const originalStartIndex = cardsPerView;
      const originalEndIndex = originalStartIndex + totalCards;
      const isMobile = window.innerWidth <= 550;
      
      // Calculate what the current card index is (0-based in original cards array)
      let currentCardIndex;
      if (isMobile) {
        currentCardIndex = currentIndex - originalStartIndex;
      } else {
        // On desktop, center card is at currentIndex + 1
        currentCardIndex = (currentIndex + 1) - originalStartIndex;
      }
      
      // Normalize currentCardIndex to be within 0 to totalCards-1
      if (currentCardIndex < 0) currentCardIndex += totalCards;
      if (currentCardIndex >= totalCards) currentCardIndex -= totalCards;
      
      // Calculate the difference (how many cards to move)
      let diff = targetIndex - currentCardIndex;
      
      // Find the shortest path (forward or backward)
      if (Math.abs(diff) > totalCards / 2) {
        // Go the other way (shorter)
        diff = diff > 0 ? diff - totalCards : diff + totalCards;
      }
      
      // Move by the difference
      currentIndex += diff;
      isTransitioning = true;
      
      // Use requestAnimationFrame to ensure layout is complete
      requestAnimationFrame(() => {
        carouselTrack.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        updateCarouselPosition();
        updateCenterCard();
        updatePagination();
        
        setTimeout(() => {
          // Check if we need to loop after animation
          if (currentIndex < originalStartIndex) {
            // We went before the originals, reset to original range
            carouselTrack.style.transition = 'none';
            currentIndex = currentIndex + totalCards;
            updateCarouselPosition();
            updateCenterCard(true); // Suppress card transitions during reset
            updatePagination();
            carouselTrack.offsetHeight; // Force reflow
            requestAnimationFrame(() => {
              carouselTrack.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
              isTransitioning = false;
            });
          } else if (currentIndex >= originalEndIndex) {
            // We went after the originals, reset to original range
            carouselTrack.style.transition = 'none';
            currentIndex = currentIndex - totalCards;
            updateCarouselPosition();
            updateCenterCard(true); // Suppress card transitions during reset
            updatePagination();
            carouselTrack.offsetHeight; // Force reflow
            requestAnimationFrame(() => {
              carouselTrack.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
              isTransitioning = false;
            });
          } else {
            isTransitioning = false;
          }
        }, 500);
      });
    }
    
    if (nextButton) {
      nextButton.addEventListener('click', goToNext);
    }
    
    if (prevButton) {
      prevButton.addEventListener('click', goToPrev);
    }
    
    // Add click handlers to cards to center them when clicked (but not on the link)
    allCards.forEach((card, index) => {
      card.addEventListener('click', function(e) {
        // Don't handle clicks on the link - let it work normally
        if (e.target.closest('.work__card-link')) {
          return;
        }
        
        const isMobile = window.innerWidth <= 550;
        let isCenterCard = false;
        
        if (isMobile) {
          isCenterCard = (index === currentIndex);
        } else {
          isCenterCard = (index === currentIndex + 1);
        }
        
        // If card is already centered, don't do anything
        if (isCenterCard) {
          return;
        }
        
        // Otherwise, center the card
        e.preventDefault();
        e.stopPropagation();
        
        // Check if this is a clone or original card
        const isClone = card.classList.contains('work__card--clone');
        
        if (isClone) {
          // Find which original card this clone represents
          const originalStartIndex = cardsPerView;
          const originalEndIndex = originalStartIndex + totalCards;
          
          if (index < originalStartIndex) {
            // This is a clone from the beginning, map to end
            const originalIndex = totalCards - (originalStartIndex - index);
            goToCard(originalIndex);
          } else if (index >= originalEndIndex) {
            // This is a clone from the end, map to beginning
            const originalIndex = index - originalEndIndex;
            goToCard(originalIndex);
          }
        } else {
          // This is an original card
          const originalIndex = index - cardsPerView;
          goToCard(originalIndex);
        }
        });
    });
    
    // Handle window resize
    let resizeTimeout;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(function() {
        const newCardsPerView = getCardsPerView();
        if (newCardsPerView !== cardsPerView) {
          // Reload to reinitialize with new card count
          location.reload();
        } else {
          // Just update position and center card
          updateCarouselPosition();
          updateCenterCard();
          updatePagination();
        }
      }, 250);
    });
  }

  // Copy image sources from original card to its clones
  function syncImagesToClones(originalCard) {
    const appId = originalCard.getAttribute('data-appid');
    if (!appId) return;
    
    const originalIcon = originalCard.querySelector('.work__card-icon');
    const originalScreenshot = originalCard.querySelector('.work__card-screenshot');
    
    // Find all clones of this card (they have the same data-appid)
    const clones = document.querySelectorAll('.work__card--clone[data-appid="' + appId + '"]');
    
    clones.forEach(function(clone) {
      const cloneIcon = clone.querySelector('.work__card-icon');
      const cloneScreenshot = clone.querySelector('.work__card-screenshot');
      
      // Copy icon if it exists and has a src
      if (cloneIcon && originalIcon && originalIcon.src) {
        cloneIcon.src = originalIcon.src;
        cloneIcon.style.display = originalIcon.style.display;
      }
      
      // Copy screenshot if it exists and has a src
      if (cloneScreenshot && originalScreenshot && originalScreenshot.src) {
        cloneScreenshot.src = originalScreenshot.src;
        cloneScreenshot.style.display = originalScreenshot.style.display;
      }
    });
  }

  // Fetch and display app icons and screenshots from App Store
  function fetchAppData() {
    // Only select original cards, not clones (to avoid duplicate API calls)
    const appCards = document.querySelectorAll('.work__card[data-appid]:not(.work__card--clone)');
    
    appCards.forEach(function(card) {
      const appId = card.getAttribute('data-appid');
      const manualScreenshot = card.getAttribute('data-screenshot');
      // Extract numeric ID from format like "id650627810"
      const numericId = appId ? appId.replace(/^id/, '') : null;
      const iconImg = card.querySelector('.work__card-icon');
      const screenshotImg = card.querySelector('.work__card-screenshot');
      
      if (!numericId) return;
      
      // If manual screenshot URL is provided, use it directly
      if (manualScreenshot && screenshotImg) {
        screenshotImg.src = manualScreenshot;
        screenshotImg.style.display = 'block';
        // Sync to clones immediately
        syncImagesToClones(card);
      }
      
      // Always fetch icon from API (even if we have manual screenshot)
      // Use JSONP to avoid CORS issues
      const callbackName = 'itunesCallback_' + numericId + '_' + Date.now();
      const params = new URLSearchParams({ id: numericId, country: 'us', callback: callbackName });
      
      // Create callback function
      window[callbackName] = function(data) {
        // Clean up callback and script tag
        delete window[callbackName];
        const script = document.getElementById('itunes-script-' + numericId);
        if (script) {
          script.remove();
        }
        
        if (!data || !data.resultCount || !data.results || data.results.length === 0) {
          return;
        }
        
        const appData = data.results[0];
        
        // Set icon
        if (iconImg) {
          const iconUrl = appData.artworkUrl512 || appData.artworkUrl100 || appData.artworkUrl60;
          if (iconUrl) {
            iconImg.src = iconUrl;
            iconImg.style.display = 'block';
            // Sync to clones - handle both cached and loading images
            if (iconImg.complete) {
              // Image is already loaded (cached)
              syncImagesToClones(card);
            } else {
              // Image is loading, sync when it loads
              iconImg.onload = function() {
                syncImagesToClones(card);
              };
              // Also sync after a short delay as a fallback
              setTimeout(function() {
                syncImagesToClones(card);
              }, 100);
            }
          }
        }
        
        // Set screenshot from API only if we don't have a manual one
        if (!manualScreenshot && screenshotImg) {
          const screenshotUrls = appData.screenshotUrls || [];
          if (screenshotUrls.length > 0) {
            screenshotImg.src = screenshotUrls[0];
            screenshotImg.style.display = 'block';
            // Sync to clones - handle both cached and loading images
            if (screenshotImg.complete) {
              // Image is already loaded (cached)
              syncImagesToClones(card);
            } else {
              // Image is loading, sync when it loads
              screenshotImg.onload = function() {
                syncImagesToClones(card);
              };
              // Also sync after a short delay as a fallback
              setTimeout(function() {
                syncImagesToClones(card);
              }, 100);
            }
          }
        }
      };
      
      // Create and append script tag for JSONP
      const script = document.createElement('script');
      script.id = 'itunes-script-' + numericId;
      script.src = 'https://itunes.apple.com/lookup?' + params.toString();
      script.onerror = function() {
        // Clean up on error
        delete window[callbackName];
        script.remove();
        console.log('Failed to fetch app data:', appId);
      };
      document.head.appendChild(script);
    });
  }
  
  // Initialize carousel and fetch app data after page load
  setTimeout(function() {
    initCarousel();
    fetchAppData();
  }, 100);

});



