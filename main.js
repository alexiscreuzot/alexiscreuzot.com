// KISS Website - Simplified Vanilla JavaScript

(function() {
  'use strict';

  // ===================
  // Theme Toggle
  // ===================
  const getTheme = () => localStorage.getItem('theme') || 'dark';
  
  const setTheme = (theme) => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('light-theme', theme === 'light');
    document.body.classList.toggle('light-theme', theme === 'light');
  };

  // Apply saved theme immediately to prevent flash
  setTheme(getTheme());

  // ===================
  // DOM Ready
  // ===================
  document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initNavigationDots();
    initMobileMenu();
    initSmoothScroll();
    initScrollAnimations();
    initCarousel();
    fetchAppData();
  });

  // ===================
  // Theme Toggle Button
  // ===================
  function initThemeToggle() {
    const toggleBtn = document.querySelector('.theme-toggle');
    if (!toggleBtn) return;
    
    toggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      setTheme(getTheme() === 'dark' ? 'light' : 'dark');
    });
  }

  // ===================
  // Navigation Dots
  // ===================
  function initNavigationDots() {
    const sections = ['intro', 'work', 'websites', 'community'];
    const tooltips = ['Intro', 'Apps', 'Websites', 'Community'];
    
    const nav = document.createElement('div');
    nav.id = 'page-nav';
    nav.innerHTML = `<ul>${sections.map((id, i) => `
      <li>
        <a href="#${id}" data-section="${i}">
          <span></span>
          <span class="page-nav-tooltip">${tooltips[i]}</span>
        </a>
      </li>
    `).join('')}</ul>`;
    
    document.body.appendChild(nav);
    
    // Update active dot on scroll
    const updateActiveDot = () => {
      const scrollMiddle = window.scrollY + window.innerHeight / 2;
      
      sections.forEach((id, i) => {
        const section = document.getElementById(id);
        if (!section) return;
        
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        const link = nav.querySelector(`a[data-section="${i}"]`);
        
        link.classList.toggle('active', scrollMiddle >= top && scrollMiddle <= bottom);
      });
    };
    
    window.addEventListener('scroll', updateActiveDot, { passive: true });
    updateActiveDot();
  }

  // ===================
  // Mobile Menu
  // ===================
  function initMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const menu = document.querySelector('.mobile-menu');
    if (!toggle || !menu) return;

    const closeMenu = () => {
      toggle.setAttribute('aria-expanded', 'false');
      menu.setAttribute('aria-hidden', 'true');
    };

    toggle.addEventListener('click', () => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', !isOpen);
      menu.setAttribute('aria-hidden', isOpen);
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!menu.contains(e.target) && !toggle.contains(e.target)) {
        closeMenu();
      }
    });

    // Close and scroll on link click
    menu.querySelectorAll('.mobile-menu__link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        closeMenu();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    // Update active menu item on scroll
    const updateActiveMenu = () => {
      const scrollMiddle = window.scrollY + window.innerHeight / 2;
      
      menu.querySelectorAll('.mobile-menu__link').forEach(link => {
        const target = document.querySelector(link.getAttribute('href'));
        if (!target) return;
        
        const top = target.offsetTop;
        const bottom = top + target.offsetHeight;
        link.classList.toggle('active', scrollMiddle >= top && scrollMiddle <= bottom);
      });
    };

    window.addEventListener('scroll', updateActiveMenu, { passive: true });
    updateActiveMenu();
  }

  // ===================
  // Smooth Scroll for Anchor Links
  // ===================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      // Skip mobile menu links (handled separately)
      if (link.classList.contains('mobile-menu__link')) return;
      // Skip page-nav links (handled by CSS scroll-behavior)
      if (link.closest('#page-nav')) return;
      
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href === '#' || href === '#!') return;
        
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  // ===================
  // Scroll Animations (Intersection Observer)
  // ===================
  function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    // Observe intro elements
    document.querySelectorAll('.intro__avatar, .intro__greeting, .intro__bio, .intro__links').forEach(el => {
      el.classList.add('js-ready');
      observer.observe(el);
    });

    // Observe section titles and subtitles
    document.querySelectorAll('.section__title, .section__subtitle').forEach(el => {
      el.classList.add('js-ready');
      observer.observe(el);
    });

    // Observe work carousel
    const carousel = document.querySelector('.work__carousel-wrapper');
    if (carousel) {
      carousel.classList.add('js-ready');
      observer.observe(carousel);
    }

    // Observe websites and community items with stagger
    document.querySelectorAll('.websites__item, .community__item').forEach((el, i) => {
      el.style.transitionDelay = `${i * 0.1}s`;
      observer.observe(el);
    });
  }

  // ===================
  // Carousel (CSS Scroll-Snap based)
  // ===================
  function initCarousel() {
    const track = document.querySelector('.work__carousel-track');
    const container = document.querySelector('.work__carousel-container');
    const cards = document.querySelectorAll('.work__card');
    const prevBtn = document.querySelector('.work__carousel-arrow--prev');
    const nextBtn = document.querySelector('.work__carousel-arrow--next');
    const pagination = document.querySelector('.work__carousel-pagination');
    
    if (!track || !cards.length) return;

    const totalCards = cards.length;
    let currentIndex = 0;

    // Create pagination
    if (pagination) {
      const counter = document.createElement('span');
      counter.className = 'work__carousel-counter';
      pagination.appendChild(counter);

      cards.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'work__carousel-dot';
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.addEventListener('click', () => goToCard(i));
        pagination.appendChild(dot);
      });
    }

    const updatePagination = () => {
      const counter = pagination?.querySelector('.work__carousel-counter');
      if (counter) counter.textContent = `${currentIndex + 1}/${totalCards}`;

      pagination?.querySelectorAll('.work__carousel-dot').forEach((dot, i) => {
        dot.classList.toggle('work__carousel-dot--active', i === currentIndex);
      });
    };

    const updateCenterCard = () => {
      cards.forEach((card, i) => {
        card.classList.toggle('work__card--center', i === currentIndex);
      });
    };

    const getCardWidth = () => {
      const card = cards[0];
      const gap = parseFloat(getComputedStyle(track).gap) || 24;
      return card.offsetWidth + gap;
    };

    const goToCard = (index) => {
      currentIndex = Math.max(0, Math.min(index, totalCards - 1));
      const cardWidth = getCardWidth();
      const containerWidth = container.offsetWidth;
      const offset = (containerWidth / 2) - (cards[currentIndex].offsetWidth / 2) - (currentIndex * cardWidth);
      
      track.style.transform = `translateX(${offset}px)`;
      updateCenterCard();
      updatePagination();
    };

    const goToNext = () => goToCard((currentIndex + 1) % totalCards);
    const goToPrev = () => goToCard((currentIndex - 1 + totalCards) % totalCards);

    // Arrow buttons
    prevBtn?.addEventListener('click', goToPrev);
    nextBtn?.addEventListener('click', goToNext);

    // Drag/swipe support
    let isDragging = false;
    let startX = 0;
    let startTransform = 0;

    const getTransformX = () => {
      const match = track.style.transform?.match(/translateX\(([^)]+)\)/);
      return match ? parseFloat(match[1]) : 0;
    };

    const handleDragStart = (clientX) => {
      isDragging = true;
      startX = clientX;
      startTransform = getTransformX();
      track.style.transition = 'none';
    };

    const handleDragMove = (clientX) => {
      if (!isDragging) return;
      const delta = clientX - startX;
      track.style.transform = `translateX(${startTransform + delta}px)`;
    };

    const handleDragEnd = (clientX) => {
      if (!isDragging) return;
      isDragging = false;
      track.style.transition = '';
      
      const delta = clientX - startX;
      const threshold = getCardWidth() * 0.3;
      
      if (Math.abs(delta) > threshold) {
        delta > 0 ? goToPrev() : goToNext();
      } else {
        goToCard(currentIndex); // Snap back
      }
    };

    // Mouse events
    container.addEventListener('mousedown', (e) => {
      if (e.target.closest('.work__card-link')) return;
      e.preventDefault();
      handleDragStart(e.clientX);
    });
    document.addEventListener('mousemove', (e) => handleDragMove(e.clientX));
    document.addEventListener('mouseup', (e) => handleDragEnd(e.clientX));

    // Touch events
    container.addEventListener('touchstart', (e) => {
      if (e.target.closest('.work__card-link')) return;
      handleDragStart(e.touches[0].clientX);
    }, { passive: true });
    container.addEventListener('touchmove', (e) => {
      handleDragMove(e.touches[0].clientX);
    }, { passive: true });
    container.addEventListener('touchend', (e) => {
      handleDragEnd(e.changedTouches[0].clientX);
    }, { passive: true });

    // Card click to center
    cards.forEach((card, i) => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.work__card-link')) return;
        if (i !== currentIndex) {
          e.preventDefault();
          goToCard(i);
        }
      });
    });

    // Handle resize
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => goToCard(currentIndex), 100);
    });

    // Initialize
    goToCard(0);
  }

  // ===================
  // App Store Data Fetching
  // ===================
  function fetchAppData() {
    const cards = document.querySelectorAll('.work__card[data-appid]');
    
    cards.forEach(card => {
      const appId = card.dataset.appid;
      const manualScreenshot = card.dataset.screenshot;
      const country = card.dataset.country || 'us';
      const numericId = appId?.replace(/^id/, '');
      
      if (!numericId) return;

      const iconImg = card.querySelector('.work__card-icon');
      const screenshotImg = card.querySelector('.work__card-screenshot');

      // Use manual screenshot if provided
      if (manualScreenshot && screenshotImg) {
        screenshotImg.src = manualScreenshot;
        screenshotImg.style.display = 'block';
      }

      // Fetch from iTunes API using JSONP
      const callbackName = `itunesCallback_${numericId}_${Date.now()}`;
      
      window[callbackName] = (data) => {
        delete window[callbackName];
        document.getElementById(`itunes-${numericId}`)?.remove();
        
        if (!data?.results?.[0]) return;
        const app = data.results[0];

        if (iconImg) {
          const iconUrl = app.artworkUrl512 || app.artworkUrl100;
          if (iconUrl) {
            iconImg.src = iconUrl;
            iconImg.style.display = 'block';
          }
        }

        if (!manualScreenshot && screenshotImg && app.screenshotUrls?.[0]) {
          screenshotImg.src = app.screenshotUrls[0];
          screenshotImg.style.display = 'block';
        }
      };

      const script = document.createElement('script');
      script.id = `itunes-${numericId}`;
      script.src = `https://itunes.apple.com/lookup?id=${numericId}&country=${country}&callback=${callbackName}`;
      script.onerror = () => {
        delete window[callbackName];
        script.remove();
      };
      document.head.appendChild(script);
    });
  }

})();
