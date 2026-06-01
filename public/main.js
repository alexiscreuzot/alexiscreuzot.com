// Website - vanilla JS (no dependencies)

(function () {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const offsetTop = (el) => el.getBoundingClientRect().top + window.scrollY;
  const ready = (fn) =>
    document.readyState === 'loading'
      ? document.addEventListener('DOMContentLoaded', fn)
      : fn();

  ready(init);

  function init() {
    // ===================
    // Theme Management
    // ===================
    const getTheme = () => localStorage.getItem('theme') || 'dark';

    const setTheme = (theme) => {
      localStorage.setItem('theme', theme);
      const isLight = theme === 'light';
      document.documentElement.classList.toggle('light-theme', isLight);
      document.body.classList.toggle('light-theme', isLight);
    };

    setTheme(getTheme());

    $$('.theme-toggle').forEach((btn) =>
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        setTheme(getTheme() === 'dark' ? 'light' : 'dark');
      })
    );

    // ===================
    // Smooth Scrolling
    // ===================
    $$('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', function (e) {
        const target = $(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          window.scrollTo({ top: offsetTop(target) - 20, behavior: 'smooth' });
        }
      });
    });

    // ===================
    // Progressive Blur on Intro
    // ===================
    const intro = $('#intro');
    if (intro) {
      const introHeight = intro.offsetHeight;
      const maxBlur = 8;

      window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const introTop = offsetTop(intro);

        if (scrollTop > introTop && scrollTop < introTop + introHeight) {
          const progress = Math.min((scrollTop - introTop) / introHeight, 1);
          intro.style.filter = `blur(${progress * maxBlur}px)`;
          intro.style.opacity = String(1 - progress * 0.3);
        } else if (scrollTop <= introTop) {
          intro.style.filter = 'blur(0)';
          intro.style.opacity = '1';
        }
      });
    }

    // ===================
    // Navigation Dots
    // ===================
    const sections = ['intro', 'work', 'websites', 'homes', 'community'];
    const tooltips = ['Intro', 'Apps', 'Websites', 'Homes', 'Community'];

    const nav = document.createElement('div');
    nav.id = 'page-nav';
    nav.innerHTML =
      '<ul>' +
      sections
        .map(
          (id, i) => `
        <li>
          <a href="#${id}" data-section="${i}">
            <span></span>
            <span class="page-nav-tooltip">${tooltips[i]}</span>
          </a>
        </li>`
        )
        .join('') +
      '</ul>';
    document.body.appendChild(nav);

    const updateActiveDot = () => {
      const scrollMiddle = window.scrollY + window.innerHeight / 2;
      sections.forEach((id, i) => {
        const section = $(`#${id}`);
        if (!section) return;
        const top = offsetTop(section);
        const bottom = top + section.offsetHeight;
        const dot = $(`a[data-section="${i}"]`, nav);
        if (dot) dot.classList.toggle('active', scrollMiddle >= top && scrollMiddle <= bottom);
      });
    };

    window.addEventListener('scroll', updateActiveDot);
    updateActiveDot();

    // ===================
    // Mobile Menu
    // ===================
    const menuToggle = $('.mobile-menu-toggle');
    const menu = $('.mobile-menu');

    if (menuToggle && menu) {
      menuToggle.addEventListener('click', function () {
        const isOpen = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', String(!isOpen));
        menu.setAttribute('aria-hidden', String(isOpen));
      });

      document.addEventListener('click', (e) => {
        if (!menu.contains(e.target) && !menuToggle.contains(e.target)) {
          menuToggle.setAttribute('aria-expanded', 'false');
          menu.setAttribute('aria-hidden', 'true');
        }
      });

      $$('.mobile-menu__link').forEach((link) => {
        link.addEventListener('click', function (e) {
          e.preventDefault();
          menuToggle.setAttribute('aria-expanded', 'false');
          menu.setAttribute('aria-hidden', 'true');
          const target = $(this.getAttribute('href'));
          if (target) window.scrollTo({ top: offsetTop(target), behavior: 'smooth' });
        });
      });

      window.addEventListener('scroll', () => {
        const scrollMiddle = window.scrollY + window.innerHeight / 2;
        $$('.mobile-menu__link').forEach((link) => {
          const target = $(link.getAttribute('href'));
          if (!target) return;
          const top = offsetTop(target);
          const bottom = top + target.offsetHeight;
          link.classList.toggle('active', scrollMiddle >= top && scrollMiddle <= bottom);
        });
      });
    }

    // ===================
    // Scroll Animations with Word-by-Word Effect
    // ===================
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    function wrapWords(element) {
      if (!element) return;

      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
      const textNodes = [];
      let node;

      while ((node = walker.nextNode())) {
        if (node.textContent.trim()) textNodes.push(node);
      }

      textNodes.forEach((textNode) => {
        const words = textNode.textContent.split(/(\s+)/);
        const fragment = document.createDocumentFragment();

        words.forEach((word) => {
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

    const wordStagger = 0.04;
    const stepOffset = 0.8;
    const initialDelay = 0.5;

    const avatar = $('.intro__avatar');
    const greeting = $('.intro__greeting');
    const bio = $('.intro__bio');
    const links = $('.intro__links');

    if (greeting) wrapWords(greeting);
    if (bio) wrapWords(bio);

    if (links) {
      $$('a', links)
        .filter((a) => a.parentElement === links)
        .forEach((a) => {
          const span = document.createElement('span');
          span.className = 'link-item';
          a.parentNode.insertBefore(span, a);
          span.appendChild(a);
        });
    }

    [greeting, bio, links].forEach((el) => el && el.classList.add('js-ready'));

    if (avatar) avatar.style.transitionDelay = `${initialDelay}s`;

    const greetingStart = initialDelay + stepOffset;
    if (greeting)
      $$('.word', greeting).forEach((el, i) => {
        el.style.transitionDelay = `${greetingStart + i * wordStagger}s`;
      });

    const bioStart = initialDelay + stepOffset * 2;
    if (bio)
      $$('.word', bio).forEach((el, i) => {
        el.style.transitionDelay = `${bioStart + i * wordStagger}s`;
      });

    const linksStart = initialDelay + stepOffset * 4;
    if (links)
      $$('.link-item', links).forEach((el, i) => {
        el.style.transitionDelay = `${linksStart + i * wordStagger}s`;
      });

    setTimeout(() => {
      if (avatar) avatar.classList.add('is-visible');
      if (greeting) $$('.word', greeting).forEach((el) => el.classList.add('is-visible'));
      if (bio) $$('.word', bio).forEach((el) => el.classList.add('is-visible'));
      if (links) $$('.link-item', links).forEach((el) => el.classList.add('is-visible'));
    }, 50);

    $$('.section__title, .section__subtitle').forEach((el) => {
      el.classList.add('js-ready');
      observer.observe(el);
    });
    $$('.work__carousel-wrapper').forEach((el) => {
      el.classList.add('js-ready');
      observer.observe(el);
    });
    $$('.websites__item, .homes__item, .community__item').forEach((el, i) => {
      el.style.transitionDelay = `${i * 0.1}s`;
      observer.observe(el);
    });

    // ===================
    // Infinite Carousel
    // ===================
    function initCarousel() {
      const track = $('.work__carousel-track');
      const container = $('.work__carousel-container');
      const pagination = $('.work__carousel-pagination');

      if (!track) return;
      const cards = $$('.work__card:not(.work__card--clone)', track);
      if (!cards.length) return;

      const totalCards = cards.length;
      let currentIndex = 0;
      let isTransitioning = false;

      const clonesNeeded = 3;
      cards.slice(-clonesNeeded).forEach((card) => {
        const clone = card.cloneNode(true);
        clone.classList.add('work__card--clone');
        track.insertBefore(clone, track.firstChild);
      });
      cards.slice(0, clonesNeeded).forEach((card) => {
        const clone = card.cloneNode(true);
        clone.classList.add('work__card--clone');
        track.appendChild(clone);
      });

      const allCards = $$('.work__card', track);
      currentIndex = clonesNeeded;

      const counter = document.createElement('span');
      counter.className = 'work__carousel-counter';
      if (pagination) pagination.appendChild(counter);

      for (let i = 0; i < totalCards; i++) {
        const dot = document.createElement('button');
        dot.className = 'work__carousel-dot';
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.addEventListener('click', () => goToCard(i));
        if (pagination) pagination.appendChild(dot);
      }

      const getCardWidth = () => {
        const cardWidth = cards[0].offsetWidth;
        const gap = parseFloat(getComputedStyle(track).gap) || 24;
        return cardWidth + gap;
      };

      const updatePosition = (animate = true) => {
        const cardWidth = getCardWidth();
        const containerWidth = container.clientWidth;
        const gap = parseFloat(getComputedStyle(track).gap) || 24;
        const centerOffset = containerWidth / 2 - cardWidth / 2 + gap / 2;
        const offset = centerOffset - currentIndex * cardWidth;

        track.style.transition = animate ? 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'none';
        track.style.transform = `translateX(${offset}px)`;
      };

      const updateCenterCard = () => {
        allCards.forEach((c) => c.classList.remove('work__card--center'));
        if (allCards[currentIndex]) allCards[currentIndex].classList.add('work__card--center');
      };

      const updatePagination = () => {
        let realIndex = currentIndex - clonesNeeded;
        if (realIndex < 0) realIndex = totalCards + realIndex;
        if (realIndex >= totalCards) realIndex = realIndex - totalCards;

        counter.textContent = `${realIndex + 1}/${totalCards}`;
        $$('.work__carousel-dot', pagination).forEach((dot, i) => {
          dot.classList.toggle('work__carousel-dot--active', i === realIndex);
        });
      };

      function goToCard(targetIndex) {
        if (isTransitioning) return;
        currentIndex = clonesNeeded + targetIndex;
        isTransitioning = true;
        updatePosition();
        updateCenterCard();
        updatePagination();
        setTimeout(() => {
          isTransitioning = false;
        }, 500);
      }

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

      const prevArrow = $('.work__carousel-arrow--prev');
      const nextArrow = $('.work__carousel-arrow--next');
      if (prevArrow) prevArrow.addEventListener('click', goToPrev);
      if (nextArrow) nextArrow.addEventListener('click', goToNext);

      allCards.forEach((card) => {
        card.addEventListener('click', function (e) {
          if (e.target.closest('.work__card-link')) return;

          const clickedIndex = allCards.indexOf(this);
          if (clickedIndex === currentIndex) return;

          e.preventDefault();

          if (this.classList.contains('work__card--clone')) {
            if (clickedIndex < clonesNeeded) {
              goToCard(totalCards - (clonesNeeded - clickedIndex));
            } else {
              goToCard(clickedIndex - clonesNeeded - totalCards);
            }
          } else {
            goToCard(clickedIndex - clonesNeeded);
          }
        });
      });

      let isDragging = false;
      let startX = 0;
      let startTransform = 0;

      const getTransformX = () => {
        const match = getComputedStyle(track).transform.match(/matrix.*\((.+)\)/);
        return match ? parseFloat(match[1].split(', ')[4]) : 0;
      };

      container.addEventListener('mousedown', startDrag);
      container.addEventListener('touchstart', startDrag);

      function startDrag(e) {
        if (e.target.closest('.work__card-link')) return;
        if (e.type === 'mousedown') e.preventDefault();
        isDragging = true;
        startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        startTransform = getTransformX();
        track.style.transition = 'none';
      }

      const onMove = (e) => {
        if (!isDragging) return;
        const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        const delta = clientX - startX;
        track.style.transform = `translateX(${startTransform + delta}px)`;
      };

      const onEnd = (e) => {
        if (!isDragging) return;
        isDragging = false;

        const clientX = e.type === 'touchend' ? e.changedTouches[0].clientX : e.clientX;
        const delta = clientX - startX;
        const threshold = getCardWidth() * 0.3;

        if (Math.abs(delta) > threshold) {
          delta > 0 ? goToPrev() : goToNext();
        } else {
          updatePosition();
        }
      };

      document.addEventListener('mousemove', onMove);
      document.addEventListener('touchmove', onMove);
      document.addEventListener('mouseup', onEnd);
      document.addEventListener('touchend', onEnd);

      let resizeTimer;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => updatePosition(), 100);
      });

      updatePosition(false);
      updateCenterCard();
      updatePagination();
    }

    // ===================
    // App Store Data (using JSONP to avoid CORS)
    // ===================
    function fetchAppDataJsonp(numericId, country, appId, manualScreenshot) {
      return new Promise((resolve) => {
        const callbackName = `itunesCallback_${numericId}_${Date.now()}`;
        const script = document.createElement('script');

        window[callbackName] = function (data) {
          delete window[callbackName];
          script.remove();

          if (!data.results?.[0]) {
            resolve();
            return;
          }

          const app = data.results[0];

          $$(`.work__card[data-appid="${appId}"]`).forEach((card) => {
            const icon = $('.work__card-icon', card);
            const screenshot = $('.work__card-screenshot', card);

            if (icon && (app.artworkUrl512 || app.artworkUrl100)) {
              icon.setAttribute('src', app.artworkUrl512 || app.artworkUrl100);
              icon.style.display = '';
            }

            if (!manualScreenshot && screenshot && app.screenshotUrls?.[0]) {
              screenshot.setAttribute('src', app.screenshotUrls[0]);
              screenshot.style.display = '';
            }
          });

          resolve();
        };

        script.onerror = function () {
          delete window[callbackName];
          script.remove();
          resolve();
        };

        setTimeout(() => {
          if (window[callbackName]) {
            delete window[callbackName];
            script.remove();
            resolve();
          }
        }, 10000);

        script.src = `https://itunes.apple.com/lookup?id=${numericId}&country=${country}&callback=${callbackName}`;
        document.head.appendChild(script);
      });
    }

    function fetchAppData() {
      const fetchedIds = new Set();

      $$('.work__card[data-appid]').forEach((card) => {
        const appId = card.dataset.appid;
        const manualScreenshot = card.dataset.screenshot;
        const country = card.dataset.country || 'us';
        const numericId = String(appId).replace(/^id/, '');

        if (!numericId || fetchedIds.has(numericId)) return;
        fetchedIds.add(numericId);

        if (manualScreenshot) {
          $$(`.work__card[data-appid="${appId}"]`).forEach((c) => {
            const screenshot = $('.work__card-screenshot', c);
            if (screenshot) {
              screenshot.setAttribute('src', manualScreenshot);
              screenshot.style.display = '';
            }
          });
        }

        fetchAppDataJsonp(numericId, country, appId, manualScreenshot);
      });
    }

    setTimeout(() => {
      initCarousel();
      fetchAppData();
    }, 100);

    // ===================
    // Contact Form
    // ===================
    const contactForm = $('.support-form');
    const formWrapper = $('.form-wrapper');
    const MIN_LOADING_TIME = 800;
    const isLocalhost = ['localhost', '127.0.0.1', ''].includes(window.location.hostname);

    if (contactForm) {
      contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const submitBtn = $('.form-submit', this);
        const startTime = Date.now();

        if (submitBtn) {
          submitBtn.classList.add('is-loading');
          submitBtn.disabled = true;
        }

        const formData = new FormData(this);

        const submitPromise = isLocalhost
          ? new Promise((resolve) => {
              console.log('Localhost: faking form submission', Object.fromEntries(formData));
              setTimeout(resolve, 300);
            }).then(() => ({ ok: true }))
          : fetch(this.getAttribute('action'), {
              method: 'POST',
              body: formData,
              headers: { Accept: 'application/json' },
            });

        submitPromise
          .then((response) => {
            const elapsed = Date.now() - startTime;
            const remaining = Math.max(0, MIN_LOADING_TIME - elapsed);

            return new Promise((resolve, reject) => {
              setTimeout(() => {
                response.ok ? resolve() : reject(new Error('Form submission failed'));
              }, remaining);
            });
          })
          .then(() => {
            if (formWrapper) formWrapper.classList.add('is-success');
            contactForm.reset();
            if (submitBtn) {
              submitBtn.classList.remove('is-loading');
              submitBtn.disabled = false;
            }
          })
          .catch((error) => {
            alert('Oops! There was a problem sending your message. Please try again.');
            console.error('Form error:', error);
            if (submitBtn) {
              submitBtn.classList.remove('is-loading');
              submitBtn.disabled = false;
            }
          });
      });

      const resetBtn = $('.form-success__reset');
      if (resetBtn)
        resetBtn.addEventListener('click', () => {
          if (formWrapper) formWrapper.classList.remove('is-success');
        });
    }
  }
})();
