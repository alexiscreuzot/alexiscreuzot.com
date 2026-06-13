// Website - vanilla JS (no dependencies)

(function () {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const offsetTop = (el) => el.getBoundingClientRect().top + window.scrollY;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ready = (fn) =>
    document.readyState === 'loading'
      ? document.addEventListener('DOMContentLoaded', fn)
      : fn();

  ready(init);

  function init() {
    // ===================
    // Entrance (hero line masks, portrait reveal)
    // ===================
    requestAnimationFrame(() => {
      setTimeout(() => document.body.classList.add('is-loaded'), 80);
    });

    // ===================
    // Smooth Scrolling
    // ===================
    const HEADER_OFFSET = 72;

    $$('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', function (e) {
        const target = $(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          window.scrollTo({
            top: offsetTop(target) - HEADER_OFFSET,
            behavior: reducedMotion ? 'auto' : 'smooth',
          });
        }
      });
    });

    // ===================
    // Header: scrolled state + hide on scroll down
    // ===================
    const header = $('.site-header');
    if (header) {
      let lastY = window.scrollY;

      window.addEventListener(
        'scroll',
        () => {
          const y = window.scrollY;
          header.classList.toggle('is-scrolled', y > 30);
          header.classList.toggle('is-hidden', y > lastY && y > 400);
          lastY = y;
        },
        { passive: true }
      );
    }

    // ===================
    // Scroll-spy (header nav + mobile menu)
    // ===================
    const navLinks = $$('.site-header__nav a[href^="#"], .mobile-menu__link[href^="#"]');

    if (navLinks.length) {
      const spy = () => {
        const middle = window.scrollY + window.innerHeight / 2;
        navLinks.forEach((link) => {
          const target = $(link.getAttribute('href'));
          if (!target) return;
          const top = offsetTop(target);
          link.classList.toggle(
            'active',
            middle >= top && middle < top + target.offsetHeight
          );
        });
      };
      window.addEventListener('scroll', spy, { passive: true });
      spy();
    }

    // ===================
    // Mobile Menu
    // ===================
    const menuToggle = $('.menu-toggle');
    const menu = $('.mobile-menu');

    if (menuToggle && menu) {
      const setMenu = (open) => {
        menuToggle.setAttribute('aria-expanded', String(open));
        menu.setAttribute('aria-hidden', String(!open));
        document.body.style.overflow = open ? 'hidden' : '';
      };

      menuToggle.addEventListener('click', () => {
        setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
      });

      $$('.mobile-menu__link', menu).forEach((link) => {
        link.addEventListener('click', function (e) {
          setMenu(false);
          const href = this.getAttribute('href');
          if (href.startsWith('#')) {
            const target = $(href);
            if (target) {
              e.preventDefault();
              window.scrollTo({
                top: offsetTop(target) - HEADER_OFFSET,
                behavior: reducedMotion ? 'auto' : 'smooth',
              });
            }
          }
        });
      });
    }

    // ===================
    // Reveal on scroll
    // ===================
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );

    $$('.reveal').forEach((el) => observer.observe(el));

    // ===================
    // Project showcase (one slide at a time)
    // ===================
    const showcase = $('[data-showcase]');

    if (showcase) {
      const slides = $$('[data-slide]', showcase);
      const words = $$('[data-goto]', showcase);
      const counter = $('[data-counter]', showcase);
      const stage = $('[data-stage]', showcase);

      let index = 0;
      let autoTimer = null;
      let inView = false;

      const select = (i) => {
        index = (i + slides.length) % slides.length;
        slides.forEach((s, j) => s.classList.toggle('is-active', j === index));
        words.forEach((w, j) => w.classList.toggle('is-active', j === index));
        if (counter) counter.textContent = String(index + 1).padStart(2, '0');
      };

      const stopAuto = () => {
        if (autoTimer) {
          clearInterval(autoTimer);
          autoTimer = null;
        }
      };

      // Gentle auto-advance until the visitor interacts
      if (!reducedMotion) {
        const watcher = new IntersectionObserver(
          ([entry]) => { inView = entry.isIntersecting; },
          { threshold: 0.3 }
        );
        watcher.observe(showcase);

        autoTimer = setInterval(() => {
          if (inView && !document.hidden) select(index + 1);
        }, 5000);
      }

      showcase.addEventListener('pointerdown', stopAuto, { passive: true });

      const prevBtn = $('[data-prev]', showcase);
      const nextBtn = $('[data-next]', showcase);

      if (prevBtn) prevBtn.addEventListener('click', () => select(index - 1));
      if (nextBtn) nextBtn.addEventListener('click', () => select(index + 1));

      words.forEach((word, i) => word.addEventListener('click', () => select(i)));

      // Swipe on the stage
      let swipeX = null;

      if (stage) {
        stage.addEventListener('pointerdown', (e) => { swipeX = e.clientX; }, { passive: true });
        stage.addEventListener(
          'pointerup',
          (e) => {
            if (swipeX === null) return;
            const dx = e.clientX - swipeX;
            if (Math.abs(dx) > 48) select(index + (dx < 0 ? 1 : -1));
            swipeX = null;
          },
          { passive: true }
        );
      }

      showcase.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
          stopAuto();
          select(index + 1);
        } else if (e.key === 'ArrowLeft') {
          stopAuto();
          select(index - 1);
        }
      });
    }

    // ===================
    // Contact Form
    // ===================
    const contactForm = $('.support-form');
    const formWrapper = $('.form-wrapper');
    const MIN_LOADING_TIME = 800;
    const isLocalhost = ['localhost', '127.0.0.1', ''].includes(window.location.hostname);

    if (contactForm) {
      const productSelect = $('#product', contactForm);
      const deviceGroup = $('.form-group--device', contactForm);

      const syncDeviceField = () => {
        if (!productSelect || !deviceGroup) return;

        const option = productSelect.options[productSelect.selectedIndex];
        const isWebsite =
          productSelect.value !== '' && option.parentElement?.label === 'Websites';

        deviceGroup.hidden = isWebsite;
        if (isWebsite) {
          const deviceInput = $('#device', deviceGroup);
          if (deviceInput) deviceInput.value = '';
        }
      };

      if (productSelect) {
        productSelect.addEventListener('change', syncDeviceField);
        syncDeviceField();
      }

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
            syncDeviceField();
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
