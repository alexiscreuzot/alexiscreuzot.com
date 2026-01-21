// Website - jQuery Implementation
// Uses jQuery slim (no ajax) + native fetch for API calls

$(function() {
  'use strict';

  // ===================
  // Theme Management
  // ===================
  const getTheme = () => localStorage.getItem('theme') || 'dark';
  
  const setTheme = (theme) => {
    localStorage.setItem('theme', theme);
    $('html, body').toggleClass('light-theme', theme === 'light');
  };

  // Apply saved theme
  setTheme(getTheme());

  // Theme toggle button
  $('.theme-toggle').on('click', (e) => {
    e.preventDefault();
    setTheme(getTheme() === 'dark' ? 'light' : 'dark');
  });

  // ===================
  // Smooth Scrolling
  // ===================
  $('a[href^="#"]').on('click', function(e) {
    const target = $(this.getAttribute('href'));
    if (target.length) {
      e.preventDefault();
      $('html, body').stop().animate({
        scrollTop: target.offset().top - 20
      }, 600, 'swing');
    }
  });

  // ===================
  // Progressive Blur on Intro
  // ===================
  const $intro = $('#intro');
  const introHeight = $intro.outerHeight();
  const maxBlur = 8;

  $(window).on('scroll', function() {
    const scrollTop = $(window).scrollTop();
    const introTop = $intro.offset().top;
    
    if (scrollTop > introTop && scrollTop < introTop + introHeight) {
      const progress = Math.min((scrollTop - introTop) / introHeight, 1);
      const blur = progress * maxBlur;
      $intro.css({
        filter: `blur(${blur}px)`,
        opacity: 1 - (progress * 0.3)
      });
    } else if (scrollTop <= introTop) {
      $intro.css({ filter: 'blur(0)', opacity: 1 });
    }
  });

  // ===================
  // Navigation Dots
  // ===================
  const sections = ['intro', 'work', 'websites', 'community'];
  const tooltips = ['Intro', 'Apps', 'Websites', 'Community'];

  const $nav = $('<div id="page-nav"><ul></ul></div>');
  sections.forEach((id, i) => {
    $nav.find('ul').append(`
      <li>
        <a href="#${id}" data-section="${i}">
          <span></span>
          <span class="page-nav-tooltip">${tooltips[i]}</span>
        </a>
      </li>
    `);
  });
  $('body').append($nav);

  // Update active dot
  const updateActiveDot = () => {
    const scrollMiddle = $(window).scrollTop() + $(window).height() / 2;
    sections.forEach((id, i) => {
      const $section = $(`#${id}`);
      if (!$section.length) return;
      const top = $section.offset().top;
      const bottom = top + $section.outerHeight();
      $nav.find(`a[data-section="${i}"]`).toggleClass('active', scrollMiddle >= top && scrollMiddle <= bottom);
    });
  };

  $(window).on('scroll', updateActiveDot);
  updateActiveDot();

  // ===================
  // Mobile Menu
  // ===================
  const $menuToggle = $('.mobile-menu-toggle');
  const $menu = $('.mobile-menu');

  $menuToggle.on('click', function() {
    const isOpen = $(this).attr('aria-expanded') === 'true';
    $(this).attr('aria-expanded', !isOpen);
    $menu.attr('aria-hidden', isOpen);
  });

  $(document).on('click', (e) => {
    if (!$menu.is(e.target) && !$menu.has(e.target).length && 
        !$menuToggle.is(e.target) && !$menuToggle.has(e.target).length) {
      $menuToggle.attr('aria-expanded', 'false');
      $menu.attr('aria-hidden', 'true');
    }
  });

  $('.mobile-menu__link').on('click', function(e) {
    e.preventDefault();
    $menuToggle.attr('aria-expanded', 'false');
    $menu.attr('aria-hidden', 'true');
    const target = $($(this).attr('href'));
    if (target.length) {
      $('html, body').stop().animate({ scrollTop: target.offset().top }, 600);
    }
  });

  // Update active menu item
  $(window).on('scroll', function() {
    const scrollMiddle = $(window).scrollTop() + $(window).height() / 2;
    $('.mobile-menu__link').each(function() {
      const target = $($(this).attr('href'));
      if (!target.length) return;
      const top = target.offset().top;
      const bottom = top + target.outerHeight();
      $(this).toggleClass('active', scrollMiddle >= top && scrollMiddle <= bottom);
    });
  });

  // ===================
  // Scroll Animations with Word-by-Word Effect
  // ===================
  const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        $(entry.target).addClass('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Word wrapper function for progressive text animation
  function wrapWords(element) {
    if (!element) return;
    
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
    const textNodes = [];
    let node;
    
    while (node = walker.nextNode()) {
      if (node.textContent.trim()) {
        textNodes.push(node);
      }
    }
    
    textNodes.forEach(textNode => {
      const words = textNode.textContent.split(/(\s+)/);
      const fragment = document.createDocumentFragment();
      
      words.forEach(word => {
        if (word.trim()) {
          const span = document.createElement('span');
          span.className = 'word';
          span.textContent = word;
          fragment.appendChild(span);
        } else if (word) {
          fragment.appendChild(document.createTextNode(word));
        }
      });
      
      textNode.parentNode.replaceChild(fragment, textNode);
    });
  }

  // Animation timing
  const wordStagger = 0.04;  // 40ms between words
  const stepOffset = 0.8;    // Offset between animation steps
  const initialDelay = 0.5;  // Initial delay before first animation

  const $avatar = $('.intro__avatar');
  const $greeting = $('.intro__greeting');
  const $bio = $('.intro__bio');
  const $links = $('.intro__links');

  // Wrap words in greeting and bio for word-by-word animation
  wrapWords($greeting[0]);
  wrapWords($bio[0]);

  // Wrap links in spans for animation
  $links.children('a').each(function() {
    $(this).wrap('<span class="link-item"></span>');
  });

  // Mark elements as ready (makes them visible via CSS)
  $greeting.addClass('js-ready');
  $bio.addClass('js-ready');
  $links.addClass('js-ready');

  // Set staggered transition delays for each word/element
  // Avatar
  $avatar.css('transition-delay', `${initialDelay}s`);

  // Greeting words
  const greetingStart = initialDelay + stepOffset;
  $greeting.find('.word').each(function(i) {
    $(this).css('transition-delay', `${greetingStart + (i * wordStagger)}s`);
  });

  // Bio words
  const bioStart = initialDelay + stepOffset * 2;
  $bio.find('.word').each(function(i) {
    $(this).css('transition-delay', `${bioStart + (i * wordStagger)}s`);
  });

  // Link items
  const linksStart = initialDelay + stepOffset * 4;
  $links.find('.link-item').each(function(i) {
    $(this).css('transition-delay', `${linksStart + (i * wordStagger)}s`);
  });

  // Trigger intro animations immediately (intro is visible on page load)
  setTimeout(() => {
    $avatar.addClass('is-visible');
    $greeting.find('.word').addClass('is-visible');
    $bio.find('.word').addClass('is-visible');
    $links.find('.link-item').addClass('is-visible');
  }, 50);

  // Other sections - use observer since they're below fold
  $('.section__title, .section__subtitle').addClass('js-ready').each((_, el) => observer.observe(el));
  $('.work__carousel-wrapper').addClass('js-ready').each((_, el) => observer.observe(el));
  $('.websites__item, .community__item').each((i, el) => {
    $(el).css('transition-delay', `${i * 0.1}s`);
    observer.observe(el);
  });

  // ===================
  // Infinite Carousel
  // ===================
  function initCarousel() {
    const $track = $('.work__carousel-track');
    const $container = $('.work__carousel-container');
    const $cards = $track.find('.work__card:not(.work__card--clone)');
    const $pagination = $('.work__carousel-pagination');
    
    if (!$track.length || !$cards.length) return;

    const totalCards = $cards.length;
    let currentIndex = 0;
    let isTransitioning = false;

    // Clone cards for infinite scroll
    const clonesNeeded = 3;
    $cards.slice(-clonesNeeded).clone().addClass('work__card--clone').prependTo($track);
    $cards.slice(0, clonesNeeded).clone().addClass('work__card--clone').appendTo($track);

    const $allCards = $track.find('.work__card');
    currentIndex = clonesNeeded; // Start at first real card

    // Create pagination
    const $counter = $('<span class="work__carousel-counter"></span>');
    $pagination.append($counter);
    
    for (let i = 0; i < totalCards; i++) {
      const $dot = $(`<button class="work__carousel-dot" aria-label="Go to slide ${i + 1}"></button>`);
      $dot.on('click', () => goToCard(i));
      $pagination.append($dot);
    }

    const getCardWidth = () => {
      const cardWidth = $cards.first().outerWidth();
      const gap = parseFloat($track.css('gap')) || 24;
      return cardWidth + gap;
    };

    const updatePosition = (animate = true) => {
      const cardWidth = getCardWidth();
      const containerWidth = $container.width();
      const centerOffset = (containerWidth / 2) - (cardWidth / 2) + (parseFloat($track.css('gap')) || 24) / 2;
      const offset = centerOffset - (currentIndex * cardWidth);

      $track.css({
        transition: animate ? 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
        transform: `translateX(${offset}px)`
      });
    };

    const updateCenterCard = () => {
      $allCards.removeClass('work__card--center');
      $allCards.eq(currentIndex).addClass('work__card--center');
    };

    const updatePagination = () => {
      let realIndex = currentIndex - clonesNeeded;
      if (realIndex < 0) realIndex = totalCards + realIndex;
      if (realIndex >= totalCards) realIndex = realIndex - totalCards;
      
      $counter.text(`${realIndex + 1}/${totalCards}`);
      $pagination.find('.work__carousel-dot').removeClass('work__carousel-dot--active')
        .eq(realIndex).addClass('work__carousel-dot--active');
    };

    const goToCard = (targetIndex) => {
      if (isTransitioning) return;
      currentIndex = clonesNeeded + targetIndex;
      isTransitioning = true;
      updatePosition();
      updateCenterCard();
      updatePagination();
      setTimeout(() => { isTransitioning = false; }, 500);
    };

    const goToNext = () => {
      if (isTransitioning) return;
      isTransitioning = true;
      currentIndex++;
      updatePosition();
      updateCenterCard();
      updatePagination();

      setTimeout(() => {
        if (currentIndex >= clonesNeeded + totalCards) {
          currentIndex = clonesNeeded;
          updatePosition(false);
          updateCenterCard();
        }
        isTransitioning = false;
      }, 500);
    };

    const goToPrev = () => {
      if (isTransitioning) return;
      isTransitioning = true;
      currentIndex--;
      updatePosition();
      updateCenterCard();
      updatePagination();

      setTimeout(() => {
        if (currentIndex < clonesNeeded) {
          currentIndex = clonesNeeded + totalCards - 1;
          updatePosition(false);
          updateCenterCard();
        }
        isTransitioning = false;
      }, 500);
    };

    // Arrow buttons
    $('.work__carousel-arrow--prev').on('click', goToPrev);
    $('.work__carousel-arrow--next').on('click', goToNext);

    // Card click to center
    $allCards.on('click', function(e) {
      if ($(e.target).closest('.work__card-link').length) return;
      
      const clickedIndex = $allCards.index(this);
      if (clickedIndex === currentIndex) return;
      
      e.preventDefault();
      
      // Handle clone clicks
      if ($(this).hasClass('work__card--clone')) {
        if (clickedIndex < clonesNeeded) {
          goToCard(totalCards - (clonesNeeded - clickedIndex));
        } else {
          goToCard(clickedIndex - clonesNeeded - totalCards);
        }
      } else {
        goToCard(clickedIndex - clonesNeeded);
      }
    });

    // Drag/swipe support
    let isDragging = false;
    let startX = 0;
    let startTransform = 0;

    const getTransformX = () => {
      const match = $track.css('transform').match(/matrix.*\((.+)\)/);
      return match ? parseFloat(match[1].split(', ')[4]) : 0;
    };

    $container.on('mousedown touchstart', function(e) {
      if ($(e.target).closest('.work__card-link').length) return;
      isDragging = true;
      startX = e.type === 'touchstart' ? e.originalEvent.touches[0].clientX : e.clientX;
      startTransform = getTransformX();
      $track.css('transition', 'none');
    });

    $(document).on('mousemove touchmove', function(e) {
      if (!isDragging) return;
      const clientX = e.type === 'touchmove' ? e.originalEvent.touches[0].clientX : e.clientX;
      const delta = clientX - startX;
      $track.css('transform', `translateX(${startTransform + delta}px)`);
    });

    $(document).on('mouseup touchend', function(e) {
      if (!isDragging) return;
      isDragging = false;
      
      const clientX = e.type === 'touchend' ? e.originalEvent.changedTouches[0].clientX : e.clientX;
      const delta = clientX - startX;
      const threshold = getCardWidth() * 0.3;

      if (Math.abs(delta) > threshold) {
        delta > 0 ? goToPrev() : goToNext();
      } else {
        updatePosition();
      }
    });

    // Resize handler
    let resizeTimer;
    $(window).on('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => updatePosition(), 100);
    });

    // Initialize
    updatePosition(false);
    updateCenterCard();
    updatePagination();
  }

  // ===================
  // App Store Data
  // ===================
  function fetchAppData() {
    const fetchedIds = new Set();
    
    $('.work__card[data-appid]').each(function() {
      const $card = $(this);
      const appId = $card.data('appid');
      const manualScreenshot = $card.data('screenshot');
      const country = $card.data('country') || 'us';
      const numericId = String(appId).replace(/^id/, '');

      if (!numericId || fetchedIds.has(numericId)) return;
      fetchedIds.add(numericId);

      const $icon = $card.find('.work__card-icon');
      const $screenshot = $card.find('.work__card-screenshot');

      // Manual screenshot
      if (manualScreenshot && $screenshot.length) {
        $screenshot.attr('src', manualScreenshot).show();
      }

      // Fetch from iTunes API
      fetch(`https://itunes.apple.com/lookup?id=${numericId}&country=${country}`)
        .then(res => res.json())
        .then(data => {
          if (!data.results?.[0]) return;
          const app = data.results[0];

          // Update all cards with this appId (including clones)
          $(`.work__card[data-appid="${appId}"]`).each(function() {
            const $c = $(this);
            const $i = $c.find('.work__card-icon');
            const $s = $c.find('.work__card-screenshot');

            if ($i.length && (app.artworkUrl512 || app.artworkUrl100)) {
              $i.attr('src', app.artworkUrl512 || app.artworkUrl100).show();
            }

            if (!manualScreenshot && $s.length && app.screenshotUrls?.[0]) {
              $s.attr('src', app.screenshotUrls[0]).show();
            }
          });
        })
        .catch(() => {});
    });
  }

  // Initialize after short delay to ensure DOM is ready
  setTimeout(() => {
    initCarousel();
    fetchAppData();
  }, 100);

});
