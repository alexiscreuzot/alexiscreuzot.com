  // =========================================================================
  // CONFIG — edit when reusing this booklet for another property.
  // =========================================================================
  var BOOKLET = {
    storagePrefix: 'zr',                                    // localStorage namespace
    wifi: { ssid: 'ZenInRennes', pass: 'welcomehome', type: 'WPA' },
    // Authoring libraries, loaded only on a local host (see IS_LOCAL below).
    exportLibs: [
      'https://unpkg.com/html-to-image@1.11.13/dist/html-to-image.js',
      'https://unpkg.com/jszip@3.10.1/dist/jszip.min.js'
    ]
  };

  // Render icons
  if (window.lucide) lucide.createIcons();

  // PNG/zip export is a local authoring utility — guests never use it, so we
  // only enable it (and load its libraries) when served from a local host.
  var IS_LOCAL = (function(){
    var h = location.hostname;
    return location.protocol === 'file:'
      || h === 'localhost' || h === '127.0.0.1' || h === '0.0.0.0' || h === '::1'
      || /\.local$/.test(h) || /^192\.168\./.test(h) || /^10\./.test(h);
  })();
  document.body.classList.toggle('is-export', IS_LOCAL);

  // Keep page numbers (footers) and export filenames sequential, even after
  // inserting/reordering slides. data-name prefix drives the PNG filename, so
  // alphabetical order in Popsa matches the visual deck order.
  (function renumberSlides(){
    var slides = document.querySelectorAll('.slide');
    slides.forEach(function(s, i){
      var pad = (i + 1 < 10 ? '0' : '') + (i + 1);
      var slug = (s.getAttribute('data-name') || 'slide').replace(/^\d+-/, '');
      s.setAttribute('data-name', pad + '-' + slug);
      var foot = s.querySelector('.pagefoot span:last-child');
      if (foot) foot.textContent = pad;
      // book-like page caption in the surround (desktop only via CSS)
      var wrap = s.closest('.slidewrap');
      if (wrap){
        var plate = wrap.querySelector('.plate');
        if (!plate){ plate = document.createElement('div'); plate.className = 'plate'; wrap.appendChild(plate); }
        plate.textContent = 'Page ' + pad;
      }
    });
  })();

  // Detect phones: small viewport, or a coarse/touch pointer on a small screen.
  function isMobile(){
    var coarse = (window.matchMedia && window.matchMedia('(pointer: coarse)').matches)
      || ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
    var narrow = window.matchMedia && window.matchMedia('(max-width: 820px)').matches;
    return narrow || (coarse && Math.min(window.innerWidth, window.innerHeight) < 820);
  }

  var deck = document.getElementById('deck');
  var wraps = Array.prototype.slice.call(document.querySelectorAll('.slidewrap'));
  var total = wraps.length;

  // Remember the owner's last view (read/grid) and page across refreshes.
  var STORE_VIEW = BOOKLET.storagePrefix + '.view';
  var STORE_PAGE = BOOKLET.storagePrefix + '.page';
  function storeGet(k){ try { return window.localStorage.getItem(k); } catch(e){ return null; } }
  function storeSet(k, v){ try { window.localStorage.setItem(k, v); } catch(e){} }
  var counterEl = document.querySelector('.m-counter');
  var progressEl = document.querySelector('.m-progress');
  var hintEl = document.querySelector('.m-hint');
  var cueEl = document.querySelector('.m-scrollcue');

  var SPRING = 'transform .6s cubic-bezier(.36,0,.3,1)';
  var FLIP_FWD = SPRING;
  // Back flip: original quick spring (.45s) — felt better as-is.
  var FLIP_BACK = 'transform .45s cubic-bezier(.22,.61,.36,1)';
  // Quicker curves used while riffling through several pages at once, so the
  // cascade of turns reads as flipping through a stack rather than one slow flip.
  var FLIP_RIFFLE_FWD = 'transform .34s cubic-bezier(.4,0,.4,1)';
  var FLIP_RIFFLE_BACK = 'transform .3s cubic-bezier(.4,0,.4,1)';
  var mobileActive = false;   // phone, full-screen pages
  var readerActive = false;   // desktop "book" reader
  var cur = (function(){
    var saved = parseInt(storeGet(STORE_PAGE), 10);
    return (isFinite(saved) && saved >= 0 && saved < total) ? saved : 0;
  })();
  // Both phone and desktop reader use the page-turn engine.
  function paged(){ return mobileActive || readerActive; }

  // ----- Desktop reader: scale the 1080px square so one page fits the
  // viewport, leaving room for the toolbar and the bottom control bar. -----
  function fitDesktop(){
    var vw = window.innerWidth, vh = window.innerHeight;
    // Reader deck spans top:96px to bottom:120px; keep the page within that band.
    var avail = Math.min(vw - 120, vh - 96 - 120 - 16);
    avail = Math.max(300, Math.min(avail, 760));
    var scale = avail / 1080;
    var disp = Math.round(1080 * scale);
    wraps.forEach(function(w){ w.style.setProperty('--disp', disp + 'px'); });
    document.querySelectorAll('.slide').forEach(function(s){ s.style.setProperty('--scale', scale); });
  }

  // ----- Local export grid: lay every page out two-up like a book spread. -----
  function fitGrid(){
    var vw = window.innerWidth;
    var twoUp = vw >= 1180;
    var avail;
    if (twoUp){
      var container = Math.min(vw - 48, 1220);
      avail = Math.min((container - 48) / 2, 540);
    } else {
      avail = Math.min(vw - 48, 640);
    }
    var scale = avail / 1080;
    var disp = Math.round(1080 * scale);
    wraps.forEach(function(w){ w.style.setProperty('--disp', disp + 'px'); });
    document.querySelectorAll('.slide').forEach(function(s){ s.style.setProperty('--scale', scale); });
  }

  // ----- Mobile: simple 3D page turn (rotateY on left edge). -----
  function setWrap(w, angle, z, hidden, transition){
    w.style.transition = transition || 'none';
    w.style.transform = 'rotateY(' + angle + 'deg)';
    w.style.zIndex = z;
    w.classList.toggle('pg-hidden', !!hidden);
  }
  function arrange(animate, flipIndex, flipTransition){
    var t = animate ? SPRING : 'none';
    wraps.forEach(function(w, i){
      // The page swinging on a turn uses the directional flip curve
      // (forward or its inverse for back); everything else keeps the standard one.
      var tt = (animate && i === flipIndex) ? (flipTransition || FLIP_FWD) : t;
      if (i < cur)            setWrap(w, -180, 40, false, tt);
      else if (i === cur)     setWrap(w, 0, 30, false, tt);
      else if (i === cur + 1) setWrap(w, 0, 20, false, tt);
      else                    setWrap(w, 0, 1, true, tt);
    });
  }
  function currentSlide(){
    return wraps[cur] ? wraps[cur].querySelector('.slide') : null;
  }
  // Show a soft fade at the bottom while the current page still has content below.
  function updateScrollCue(){
    if (!mobileActive){ cueEl.classList.remove('show'); return; }
    var s = currentSlide();
    var more = !!s && (s.scrollTop + s.clientHeight < s.scrollHeight - 4);
    cueEl.classList.toggle('show', more);
  }
  function updateUI(){
    if (!paged()) return;
    counterEl.textContent = (cur + 1) + ' / ' + total;
    progressEl.style.width = ((cur + 1) / total * 100) + '%';
    document.body.classList.toggle('pg-dark', cur === total - 1);
    document.body.classList.toggle('pg-bare', cur === 0 || cur === total - 1);
    updateControls();
    updateScrollCue();
  }
  var riffleTimer = null;
  function clearRiffle(){
    if (riffleTimer){ clearTimeout(riffleTimer); riffleTimer = null; }
  }
  // Turn the pages one at a time toward the target, staggered closely enough
  // that several are mid-flip together — the "thumbing through a stack" feel.
  function riffle(to){
    clearRiffle();
    var dir = to > cur ? 1 : -1;
    // Bigger jumps turn faster so the whole sweep stays brisk and readable.
    function step(){
      var dist = Math.abs(to - cur);
      go(cur + dir, true);
      if (cur === to){ riffleTimer = null; return; }
      var gap = Math.max(55, Math.min(150, 700 / dist));
      riffleTimer = setTimeout(step, gap);
    }
    step();
  }
  function go(n, riffleStep){
    if (!riffleStep) clearRiffle();
    n = Math.max(0, Math.min(total - 1, n));
    if (n === cur) { arrange(true); return; }
    var prev = cur;
    // A multi-page jump from the controls riffles through the pages in between
    // instead of a single flip, so it reads as moving across several pages.
    if (!riffleStep && Math.abs(n - prev) > 1) return riffle(n);
    cur = n;
    storeSet(STORE_PAGE, String(cur));
    var s = currentSlide();
    if (s) s.scrollTop = 0;
    // Flip the page that's swinging: the old page (prev) when advancing, or the
    // returning page (new index) when going back — each with its own curve.
    var fwd = riffleStep ? FLIP_RIFFLE_FWD : FLIP_FWD;
    var back = riffleStep ? FLIP_RIFFLE_BACK : FLIP_BACK;
    if (n > prev)      arrange(true, prev, fwd);
    else               arrange(true, n, back);
    updateUI();
    if (hintEl) hintEl.style.display = 'none';
  }

  var gOn = false, gAxis = null, gx0 = 0, gy0 = 0, gt0 = 0, gvw = 0, gTarget = null;
  function gStart(x, y, target){
    if (!paged()) return;
    clearRiffle();
    gOn = true; gAxis = null; gx0 = x; gy0 = y; gt0 = Date.now();
    gTarget = target || null;
    // Drag distance is measured against the page width: a full page-width
    // drag = a full turn (window width on phone, where the page is full-bleed).
    gvw = (readerActive && wraps[cur])
      ? (wraps[cur].getBoundingClientRect().width || window.innerWidth || 1)
      : (window.innerWidth || 1);
  }
  function gMove(x, y){
    if (!gOn) return false;
    var dx = x - gx0, dy = y - gy0;
    if (gAxis === null){
      if (Math.abs(dx) < 7 && Math.abs(dy) < 7) return false;
      gAxis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
    }
    if (gAxis !== 'x') return false;
    if (dx < 0 && cur < total - 1)
      setWrap(wraps[cur], Math.max(dx / gvw, -1) * 180, 30, false, 'none');
    else if (dx > 0 && cur > 0)
      setWrap(wraps[cur - 1], -180 + Math.min(dx / gvw, 1) * 180, 40, false, 'none');
    return true;
  }
  function gEnd(x, y){
    if (!gOn) return;
    gOn = false;
    var dx = x - gx0, dy = y - gy0, dt = Date.now() - gt0;
    if (gAxis === 'x'){
      var far = Math.abs(dx) > gvw * 0.22;
      var flick = dt < 260 && Math.abs(dx) > 40;
      gAxis = null;
      if (dx < 0 && (far || flick)) return go(cur + 1);
      if (dx > 0 && (far || flick)) return go(cur - 1);
      arrange(true);
    } else if (gAxis === null && dt < 320 && Math.abs(dx) < 8 && Math.abs(dy) < 8){
      // A tap to turn the page is touch-only (phones). On the desktop reader the
      // page is turned by dragging it, the bottom control bar, or the keyboard,
      // never by clicking the page itself.
      if (readerActive){ gAxis = null; return; }
      // A tap: ignore it when it lands on an interactive control, otherwise
      // turn forward/back from the side of the viewport touched.
      if (gTarget && gTarget.closest &&
          gTarget.closest('button, a, input, textarea, select, [data-wifi-copy]')){
        gAxis = null; return;
      }
      var vw = window.innerWidth || 1;
      if (x > vw * 0.55) go(cur + 1);
      else if (x < vw * 0.45) go(cur - 1);
    }
    gAxis = null;
  }
  function gCancel(){ if (gOn){ gOn = false; gAxis = null; arrange(true); } }

  deck.addEventListener('touchstart', function(e){
    var t = e.touches[0]; gStart(t.clientX, t.clientY);
  }, { passive: true });
  deck.addEventListener('touchmove', function(e){
    var t = e.touches[0];
    if (gMove(t.clientX, t.clientY)) e.preventDefault();
  }, { passive: false });
  deck.addEventListener('touchend', function(e){
    var t = e.changedTouches[0]; gEnd(t.clientX, t.clientY);
  });
  deck.addEventListener('touchcancel', gCancel);
  function setGrabbing(on){
    if (readerActive) document.body.classList.toggle('is-grabbing', !!on);
    else document.body.classList.remove('is-grabbing');
  }
  deck.addEventListener('pointerdown', function(e){
    if (e.pointerType === 'touch') return;
    // Let interactive controls (buttons, links, copy chips) keep their own cursor.
    var interactive = e.target && e.target.closest &&
      e.target.closest('button, a, input, textarea, select, [data-wifi-copy]');
    if (!interactive) setGrabbing(true);
    gStart(e.clientX, e.clientY, e.target);
  });
  deck.addEventListener('pointermove', function(e){ if (e.pointerType !== 'touch') gMove(e.clientX, e.clientY); });
  deck.addEventListener('pointerup', function(e){ if (e.pointerType !== 'touch'){ setGrabbing(false); gEnd(e.clientX, e.clientY); } });
  deck.addEventListener('pointercancel', function(e){ if (e.pointerType !== 'touch'){ setGrabbing(false); gCancel(); } });
  // Stop the browser from "tearing off" a ghost image while dragging a page.
  deck.addEventListener('dragstart', function(e){ e.preventDefault(); });
  // If the mouse is released or focus is lost off the deck, drop the grab cursor.
  window.addEventListener('pointerup', function(e){ if (e.pointerType !== 'touch') setGrabbing(false); });
  window.addEventListener('blur', function(){ setGrabbing(false); });
  deck.addEventListener('scroll', function(){ updateScrollCue(); }, true);
  window.addEventListener('load', function(){ setTimeout(updateScrollCue, 60); });
  document.addEventListener('keydown', function(e){
    if (!paged()) return;
    if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') go(cur + 1);
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') go(cur - 1);
    else if (e.key === 'Home') { go(0); e.preventDefault(); }
    else if (e.key === 'End') { go(total - 1); e.preventDefault(); }
  });

  // =====================================================================
  // READER CONTROLS
  // The bottom control bar (first / prev / count / next / last) and a
  // collapsible thumbnail navigator. Both drive the existing go() engine,
  // so the desktop reader page-turn stays exactly as before.
  // =====================================================================
  var thumbsBuilt = false;
  var bookFirst = document.getElementById('bookFirst');
  var bookPrev = document.getElementById('bookPrev');
  var bookNext = document.getElementById('bookNext');
  var bookLast = document.getElementById('bookLast');
  var bookCount = document.getElementById('bookCount');
  var bookThumbsToggle = document.getElementById('bookThumbsToggle');
  var bookThumbs = document.getElementById('bookThumbs');

  function updateControls(){
    if (bookCount) bookCount.textContent = (cur + 1) + ' / ' + total;
    if (bookFirst) bookFirst.classList.toggle('is-disabled', cur === 0);
    if (bookPrev) bookPrev.classList.toggle('is-disabled', cur === 0);
    if (bookNext) bookNext.classList.toggle('is-disabled', cur === total - 1);
    if (bookLast) bookLast.classList.toggle('is-disabled', cur === total - 1);
    if (bookThumbs){
      var marks = bookThumbs.querySelectorAll('.thumb');
      marks.forEach(function(t, i){ t.classList.toggle('is-current', i === cur); });
      var active = marks[cur];
      if (active && bookThumbs.classList.contains('is-open')){
        active.scrollIntoView({ block: 'nearest', inline: 'center' });
      }
    }
  }

  function buildThumbs(){
    if (thumbsBuilt || !bookThumbs) return;
    thumbsBuilt = true;
    wraps.forEach(function(w, i){
      var slide = w.querySelector('.slide');
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'thumb';
      btn.setAttribute('aria-label', 'Go to page ' + (i + 1));
      if (slide){
        var mini = slide.cloneNode(true);
        mini.removeAttribute('id');
        btn.appendChild(mini);
      }
      var num = document.createElement('span');
      num.className = 'tnum';
      num.textContent = (i + 1);
      btn.appendChild(num);
      btn.addEventListener('click', function(){
        go(i);
        bookThumbs.classList.remove('is-open');
        if (bookThumbsToggle) bookThumbsToggle.classList.remove('is-active');
      });
      bookThumbs.appendChild(btn);
    });
  }

  if (bookFirst) bookFirst.addEventListener('click', function(){ go(0); });
  if (bookPrev) bookPrev.addEventListener('click', function(){ go(cur - 1); });
  if (bookNext) bookNext.addEventListener('click', function(){ go(cur + 1); });
  if (bookLast) bookLast.addEventListener('click', function(){ go(total - 1); });
  if (bookThumbsToggle) bookThumbsToggle.addEventListener('click', function(){
    if (!thumbsBuilt) buildThumbs();
    var open = bookThumbs.classList.toggle('is-open');
    bookThumbsToggle.classList.toggle('is-active', open);
    if (open) updateControls();
  });

  // Local-only segmented control: switch between the reader and the flat
  // export grid. Defaults to Read.
  var segRead = document.getElementById('segRead');
  var segGrid = document.getElementById('segGrid');
  function setView(grid){
    storeSet(STORE_VIEW, grid ? 'grid' : 'read');
    document.body.classList.toggle('prefers-grid', grid);
    if (segRead){ segRead.classList.toggle('is-active', !grid); segRead.setAttribute('aria-selected', String(!grid)); }
    if (segGrid){ segGrid.classList.toggle('is-active', grid); segGrid.setAttribute('aria-selected', String(grid)); }
    applyLayout();
  }
  if (segRead) segRead.addEventListener('click', function(){ setView(false); });
  if (segGrid) segGrid.addEventListener('click', function(){ setView(true); });

  // Both phone and desktop now read as a turning book. Desktop defaults to the
  // reader; locally the owner can flip to the flat export grid via the toolbar toggle.
  function readerWanted(){
    return !document.body.classList.contains('prefers-grid');
  }

  var launchOnce = document.documentElement.classList.contains('is-phone');
  function finishLaunch(){
    if (!launchOnce || !mobileActive) return;
    launchOnce = false;
    requestAnimationFrame(function(){
      requestAnimationFrame(function(){
        document.body.classList.add('is-ready');
      });
    });
  }

  function applyLayout(){
    var mobile = isMobile();
    var reader = !mobile && readerWanted();

    mobileActive = mobile;
    readerActive = reader;
    document.body.classList.toggle('is-mobile', mobile);
    document.body.classList.toggle('is-reader', reader);

    if (paged()){
      cur = Math.max(0, Math.min(cur, total - 1));
      if (reader) fitDesktop();
      // Re-arrange without animating when (re)entering or resizing.
      arrange(false);
      updateUI();
    } else {
      // Flat export grid: clear any page-turn transforms without animating.
      if (bookThumbs) bookThumbs.classList.remove('is-open');
      if (bookThumbsToggle) bookThumbsToggle.classList.remove('is-active');
      wraps.forEach(function(w){
        w.style.transition = 'none';
        w.style.transform = '';
        w.style.zIndex = '';
        w.classList.remove('pg-hidden');
      });
      // Force a reflow so the cleared transform is applied instantly, then drop
      // the inline override so the CSS hover transition works again.
      void document.body.offsetHeight;
      wraps.forEach(function(w){ w.style.transition = ''; });
      document.body.classList.remove('pg-dark', 'pg-bare');
      fitGrid();
    }
    if (window.updateWifiUI) window.updateWifiUI();
    if (mobile) finishLaunch();
    else document.body.classList.add('is-ready');
  }
  // Restore the last-used view (defaults to read) before first layout.
  setView(storeGet(STORE_VIEW) === 'grid');
  window.addEventListener('resize', applyLayout);
  window.addEventListener('orientationchange', function(){ setTimeout(applyLayout, 80); });

  // ----- Mobile WiFi: scan QR, tap-to-copy, Android WIFI: join -----
  (function(){
    var WIFI = BOOKLET.wifi;
    var toast = document.getElementById('wifiToast');
    var connectBtn = document.getElementById('wifiConnect');
    var connectTxt = connectBtn && connectBtn.querySelector('.wifi-connect-txt');
    var mobileHint = document.getElementById('wifiMobileHint');

    function escapeWifiField(s){
      return String(s).replace(/([\\;,"])/g, '\\$1');
    }
    function wifiUri(){
      return 'WIFI:T:' + WIFI.type
        + ';S:' + escapeWifiField(WIFI.ssid)
        + ';P:' + escapeWifiField(WIFI.pass)
        + ';H:false;;';
    }
    function isIOS(){
      return /iPad|iPhone|iPod/.test(navigator.userAgent)
        || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    }
    function isAndroid(){ return /Android/i.test(navigator.userAgent); }
    function showToast(msg, ms){
      if (!toast) return;
      toast.textContent = msg;
      toast.classList.add('show');
      clearTimeout(showToast._t);
      showToast._t = setTimeout(function(){ toast.classList.remove('show'); }, ms || 3800);
    }
    function flashChip(chip){
      if (!chip) return;
      chip.classList.add('copied');
      clearTimeout(flashChip._t);
      flashChip._t = setTimeout(function(){ chip.classList.remove('copied'); }, 1200);
    }
    function copyText(text, onDone, chip){
      var done = function(){
        flashChip(chip);
        if (onDone) onDone();
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(function(){ legacyCopy(text, done); });
        return;
      }
      legacyCopy(text, done);
    }
    function legacyCopy(text, onDone){
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); onDone(); }
      catch(e){ showToast('ZenInRennes · ' + WIFI.pass, 5000); }
      ta.remove();
    }
    function copyPassword(chip){
      copyText(WIFI.pass, function(){
        showToast('Mot de passe copié — Réglages → Wi‑Fi → ZenInRennes · Password copied — Settings → Wi‑Fi → ZenInRennes');
      }, chip);
    }
    function joinAndroid(){
      window.location.href = wifiUri();
    }
    function updateWifiUI(){
      var mobile = document.body.classList.contains('is-mobile');
      if (!mobile){
        if (connectTxt) connectTxt.textContent = 'Se connecter';
        if (mobileHint) mobileHint.textContent = '';
        return;
      }
      if (isAndroid()){
        if (connectTxt) connectTxt.textContent = 'Rejoindre le réseau';
        if (mobileHint){
          mobileHint.innerHTML = 'Confirmez dans la fenêtre du système.'
            + '<span class="es">Confirm in the system prompt.</span>';
        }
      } else if (isIOS()){
        if (connectTxt) connectTxt.textContent = 'Copier le mot de passe';
        if (mobileHint){
          mobileHint.innerHTML = 'Scannez le QR avec l\u2019Appareil photo, ou copiez le mot de passe → Wi‑Fi.'
            + '<span class="es">Scan the QR with Camera, or copy the password → Wi‑Fi.</span>';
        }
      } else {
        if (connectTxt) connectTxt.textContent = 'Copier le mot de passe';
        if (mobileHint){
          mobileHint.innerHTML = 'Scannez le QR ou copiez le mot de passe, puis choisissez ZenInRennes.'
            + '<span class="es">Scan the QR or copy the password, then choose ZenInRennes.</span>';
        }
      }
    }

    function paged(){
      return document.body.classList.contains('is-mobile')
        || document.body.classList.contains('is-reader');
    }

    document.addEventListener('click', function(e){
      var chip = e.target.closest('[data-wifi-copy]');
      if (chip && paged()){
        var kind = chip.getAttribute('data-wifi-copy');
        if (kind === 'ssid') {
          copyText(WIFI.ssid, function(){
            showToast('Réseau copié · Network copied');
          }, chip);
        } else {
          copyPassword(chip);
        }
        return;
      }
      var btn = e.target.closest('.wifi-connect');
      if (!btn) return;
      if (!document.body.classList.contains('is-mobile')) return;
      if (isAndroid()) {
        joinAndroid();
      } else {
        copyPassword(btn);
      }
    });

    window.updateWifiUI = updateWifiUI;
    updateWifiUI();
  })();

  // ----- Local-only PNG/zip export (authoring utility) -----
  // The heavy html-to-image + JSZip libraries are fetched lazily on first use,
  // so guests on the deployed site never download them.
  if (IS_LOCAL){
    var exportLibsPromise = null;
    function loadScript(src){
      return new Promise(function(resolve, reject){
        var s = document.createElement('script');
        s.src = src;
        s.onload = resolve;
        s.onerror = function(){ reject(new Error('Failed to load ' + src)); };
        document.head.appendChild(s);
      });
    }
    function loadExportLibs(){
      if (!exportLibsPromise) exportLibsPromise = Promise.all(BOOKLET.exportLibs.map(loadScript));
      return exportLibsPromise;
    }
    function filenameFor(slide){ return (slide.getAttribute('data-name') || 'slide') + '.png'; }
    function renderSlide(slide){
      return htmlToImage.toPng(slide, {
        width: 1080, height: 1080, pixelRatio: 2, cacheBust: true,
        style: { transform: 'none', margin: '0', boxShadow: 'none' }
      });
    }
    function downloadDataUrl(dataUrl, name){
      var a = document.createElement('a');
      a.href = dataUrl; a.download = name; document.body.appendChild(a); a.click(); a.remove();
    }
    var downloadAllBtn = document.getElementById('downloadAll');
    if (downloadAllBtn) downloadAllBtn.addEventListener('click', async function(){
      var btn = this; btn.disabled = true;
      var label = btn.querySelector('span'); var original = label.textContent;
      try{
        label.textContent = 'Loading…';
        await loadExportLibs();
        await document.fonts.ready;
        var zip = new JSZip();
        var slides = Array.prototype.slice.call(document.querySelectorAll('.slide'));
        for (var i = 0; i < slides.length; i++){
          label.textContent = 'Rendering ' + (i+1) + '/' + slides.length;
          await renderSlide(slides[i]);                 // warm-up
          var dataUrl = await renderSlide(slides[i]);    // final
          zip.file(filenameFor(slides[i]), dataUrl.split(',')[1], { base64: true });
        }
        label.textContent = 'Zipping…';
        var blob = await zip.generateAsync({ type: 'blob' });
        var url = URL.createObjectURL(blob);
        downloadDataUrl(url, BOOKLET.storagePrefix + '-slides.zip');
        setTimeout(function(){ URL.revokeObjectURL(url); }, 4000);
      }catch(e){ console.error(e); alert('Export failed — make sure you opened this over a local server.'); }
      finally{ btn.disabled = false; label.textContent = original; }
    });
  }
