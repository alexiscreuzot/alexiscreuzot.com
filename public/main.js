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

  // ===================
  // Portrait-derived theme (high contrast)
  // ===================
  const rgbToHsl = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;
    if (max === min) return [0, 0, l];
    const d = max - min;
    const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    let h;
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      default:
        h = ((r - g) / d + 4) / 6;
    }
    return [h * 360, s, l];
  };

  const hslToRgb = (h, s, l) => {
    h /= 360;
    if (s === 0) {
      const v = Math.round(l * 255);
      return [v, v, v];
    }
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    return [
      Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
      Math.round(hue2rgb(p, q, h) * 255),
      Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
    ];
  };

  const toHex = ([r, g, b]) =>
    `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`;

  const extractAccent = (data) => {
    const buckets = new Map();
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const [h, s, l] = rgbToHsl(r, g, b);
      if (s < 0.18 || l < 0.08 || l > 0.96) continue;
      const key = Math.round(h / 10);
      const weight = s * s * (1 - Math.abs(l - 0.5) * 0.85);
      const entry = buckets.get(key) || { score: 0, r: 0, g: 0, b: 0, n: 0 };
      entry.score += weight;
      entry.r += r * weight;
      entry.g += g * weight;
      entry.b += b * weight;
      entry.n += weight;
      buckets.set(key, entry);
    }
    let best = null;
    buckets.forEach((entry) => {
      if (!best || entry.score > best.score) best = entry;
    });
    if (!best) return [0, 232, 255];
    return [
      Math.round(best.r / best.n),
      Math.round(best.g / best.n),
      Math.round(best.b / best.n),
    ];
  };

  const boostAccent = (rgb) => {
    const [h, s] = rgbToHsl(...rgb);
    return hslToRgb(h, Math.min(1, s * 1.25 + 0.35), 0.58);
  };

  const blendHue = (a, b) => {
    const toRad = (deg) => (deg * Math.PI) / 180;
    const x = Math.cos(toRad(a)) + Math.cos(toRad(b));
    const y = Math.sin(toRad(a)) + Math.sin(toRad(b));
    return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
  };

  const applyPortraitTheme = (accentLeft, accentRight) => {
    const primary = boostAccent(accentLeft);
    const secondary = boostAccent(accentRight);
    const [h1] = rgbToHsl(...primary);
    const [h2] = rgbToHsl(...secondary);
    const hue = blendHue(h1, h2);
    const ink = hslToRgb(hue, 0.48, 0.04);
    const inkSoft = hslToRgb(hue, 0.38, 0.08);
    const cream = hslToRgb(hue, 0.04, 0.98);
    const [, ps] = rgbToHsl(...primary);
    const primaryDeep = hslToRgb(h1, Math.min(1, ps + 0.05), 0.42);
    const mix = hslToRgb(blendHue(h1, h2), 0.72, 0.52);
    const root = document.documentElement;

    root.style.setProperty('--ink', toHex(ink));
    root.style.setProperty('--ink-soft', toHex(inkSoft));
    root.style.setProperty('--ink-rgb', ink.join(', '));
    root.style.setProperty('--cream', toHex(cream));
    root.style.setProperty('--cream-rgb', cream.join(', '));
    root.style.setProperty('--orange', toHex(primary));
    root.style.setProperty('--orange-deep', toHex(primaryDeep));
    root.style.setProperty('--orange-rgb', primary.join(', '));
    root.style.setProperty('--accent-2', toHex(secondary));
    root.style.setProperty('--accent-2-rgb', secondary.join(', '));
    root.style.setProperty(
      '--gradient',
      `linear-gradient(135deg, ${toHex(primary)} 0%, ${toHex(mix)} 48%, ${toHex(secondary)} 100%)`
    );
    root.style.setProperty('--ink-line', `rgba(${cream.join(', ')}, 0.14)`);

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = toHex(ink);
  };

  const samplePortrait = (img) => {
    const size = 72;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    ctx.drawImage(img, 0, 0, size, size);
    const half = size / 2;
    const left = ctx.getImageData(0, 0, half, size).data;
    const right = ctx.getImageData(half, 0, half, size).data;
    applyPortraitTheme(extractAccent(left), extractAccent(right));
    document.body.classList.add('has-portrait-theme');
  };

  const initPortraitTheme = () => {
    const img = document.querySelector('[data-portrait-theme]');
    if (!img) return;
    const run = () => samplePortrait(img);
    if (img.complete && img.naturalWidth) run();
    else img.addEventListener('load', run, { once: true });
  };

  ready(init);

  function init() {
    initPortraitTheme();
    // ===================
    // Entrance (hero line masks, portrait reveal)
    // ===================
    requestAnimationFrame(() => {
      setTimeout(() => document.body.classList.add('is-loaded'), 80);
    });

    // ===================
    // Smooth Scrolling
    // ===================
    const HEADER_OFFSET = () => (header?.offsetHeight ?? 72) + 8;
    const isMobileNav = () => window.matchMedia('(max-width: 880px)').matches;

    $$('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', function (e) {
        const target = $(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          window.scrollTo({
            top: offsetTop(target) - HEADER_OFFSET(),
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
          if (!isMobileNav()) {
            header.classList.toggle('is-hidden', y > lastY && y > 400);
          } else {
            header.classList.remove('is-hidden');
          }
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
      let menuScrollY = 0;

      const setMenu = (open) => {
        menuToggle.setAttribute('aria-expanded', String(open));
        menu.setAttribute('aria-hidden', String(!open));
        document.body.classList.toggle('menu-open', open);

        if (open) {
          menuScrollY = window.scrollY;
          document.body.style.position = 'fixed';
          document.body.style.top = `-${menuScrollY}px`;
          document.body.style.left = '0';
          document.body.style.right = '0';
          document.body.style.overflow = 'hidden';
        } else {
          document.body.style.position = '';
          document.body.style.top = '';
          document.body.style.left = '';
          document.body.style.right = '';
          document.body.style.overflow = '';
          window.scrollTo(0, menuScrollY);
        }
      };

      menuToggle.addEventListener('click', () => {
        setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
          setMenu(false);
        }
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
                top: offsetTop(target) - HEADER_OFFSET(),
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

        const activeWord = words[index];
        if (activeWord) {
          activeWord.scrollIntoView({
            inline: 'nearest',
            block: 'nearest',
            behavior: reducedMotion ? 'auto' : 'smooth',
          });
        }
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
