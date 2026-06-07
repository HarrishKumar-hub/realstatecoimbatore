// ═══════════════════════════════════════════════════
//  SRI MURUGAN PROPERTIES – Enhanced Script
//  Features: 1-2, 5-8, 13, 16-17, PWA, Analytics
// ═══════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {

  // ─── Mobile menu ───────────────────────────
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
  }

  // ─── FEATURE 1+7: Floating WA Chat Widget ──
  const waBtn = document.getElementById('floatWaBtn');
  const waBubble = document.getElementById('floatWaBubble');
  if (waBtn && waBubble) {
    waBtn.addEventListener('click', () => {
      waBubble.classList.toggle('show');
      const notif = waBtn.querySelector('.float-wa-notif');
      if (notif) notif.remove();
    });
    // Auto-show bubble after 20s (first visit only)
    if (!sessionStorage.getItem('waBubbleShown')) {
      setTimeout(() => {
        waBubble.classList.add('show');
        sessionStorage.setItem('waBubbleShown', '1');
      }, 20000);
    }
  }

  // ─── FEATURE 2: Back to Top ─────────────────
  const backTop = document.getElementById('backToTop');
  if (backTop) {
    window.addEventListener('scroll', () => {
      backTop.classList.toggle('visible', window.scrollY > 400);
    });
    backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // ─── FEATURE 3: Sticky header shadow ────────
  window.addEventListener('scroll', () => {
    const h = document.querySelector('header');
    if (h) h.style.boxShadow = window.scrollY > 10
      ? '0 4px 24px rgba(0,0,0,0.12)' : '0 2px 20px rgba(0,0,0,0.07)';
  });

  // ─── FEATURE 5: Sticky Call Bar ─────────────
  const callBar = document.getElementById('stickyCallBar');
  const callBarClose = document.getElementById('callBarClose');
  if (callBar) {
    if (!sessionStorage.getItem('callBarDismissed')) {
      setTimeout(() => callBar.classList.add('show'), 5000);
    }
    if (callBarClose) {
      callBarClose.addEventListener('click', () => {
        callBar.classList.remove('show');
        sessionStorage.setItem('callBarDismissed', '1');
      });
    }
  }

  // ─── FEATURE 6: Exit Intent Popup ───────────
  const exitOverlay = document.getElementById('exitOverlay');
  const exitClose = document.getElementById('exitClose');
  const exitForm = document.getElementById('exitForm');
  if (exitOverlay && !sessionStorage.getItem('exitShown')) {
    let shown = false;
    document.addEventListener('mouseleave', (e) => {
      if (e.clientY < 10 && !shown) {
        shown = true;
        exitOverlay.classList.add('show');
        sessionStorage.setItem('exitShown', '1');
      }
    });
    // Mobile: scroll to bottom = exit intent
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const curr = window.scrollY;
      if (curr < lastScroll && lastScroll > 600 && !shown) {
        shown = true;
        exitOverlay.classList.add('show');
        sessionStorage.setItem('exitShown', '1');
      }
      lastScroll = curr;
    });
    if (exitClose) exitClose.addEventListener('click', () => exitOverlay.classList.remove('show'));
    exitOverlay.addEventListener('click', (e) => { if (e.target === exitOverlay) exitOverlay.classList.remove('show'); });
    if (exitForm) {
      exitForm.addEventListener('submit', (e) => {
        e.preventDefault();
        exitOverlay.classList.remove('show');
        showToast("✓ We'll call you back!");
      });
    }
  }

  // ─── FEATURE 8: Property Alert Modal ────────
  const alertTriggers = document.querySelectorAll('[data-alert-trigger]');
  const alertOverlay = document.getElementById('alertOverlay');
  const alertClose = document.getElementById('alertModalClose');
  const alertForm = document.getElementById('alertForm');
  alertTriggers.forEach(btn => btn.addEventListener('click', () => alertOverlay && alertOverlay.classList.add('show')));
  if (alertClose) alertClose.addEventListener('click', () => alertOverlay.classList.remove('show'));
  if (alertOverlay) alertOverlay.addEventListener('click', (e) => { if (e.target === alertOverlay) alertOverlay.classList.remove('show'); });
  if (alertForm) {
    alertForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alertOverlay.classList.remove('show');
      showToast('✓ Alert registered! We will WhatsApp you new listings.');
    });
  }

  // ─── FEATURE 9: FAQ Accordion ───────────────
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
      if (typeof lucide !== 'undefined') lucide.createIcons();
    });
  });

  // ─── FEATURE 13: Sq.ft converter ────────────
  // Data mapping: cents → sqft
  const SQFT_PER_CENT = 435.56;
  document.querySelectorAll('[data-cents]').forEach(el => {
    const cents = parseFloat(el.dataset.cents);
    if (!isNaN(cents)) {
      const sqft = Math.round(cents * SQFT_PER_CENT);
      const badge = document.createElement('span');
      badge.className = 'sqft-badge';
      badge.textContent = sqft.toLocaleString('en-IN') + ' sq.ft';
      el.after(badge);
    }
  });

  // ─── Scroll Reveal (IntersectionObserver) ───
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -50px 0px' });
    reveals.forEach(el => revealObs.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('visible'));
  }

  // Failsafe: if an element is already in viewport on load or observer fails
  setTimeout(() => {
    reveals.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top <= window.innerHeight) {
        el.classList.add('visible');
      }
    });
  }, 100);

  // ─── Animated Counters ──────────────────────
  const counters = document.querySelectorAll('[data-counter]');
  if (counters.length && 'IntersectionObserver' in window) {
    const cntObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.counter);
          const suffix = el.dataset.suffix || '';
          let start = 0;
          const step = Math.ceil(target / 40);
          const timer = setInterval(() => {
            start = Math.min(start + step, target);
            el.textContent = start + suffix;
            if (start >= target) clearInterval(timer);
          }, 40);
          cntObs.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(el => cntObs.observe(el));
  }

  // ─── Gallery (property detail) ──────────────
  const thumbs = document.querySelectorAll('.gallery-thumb');
  const galleryMain = document.getElementById('gallery-main');
  if (galleryMain && thumbs.length) {
    thumbs.forEach(t => t.addEventListener('click', () => {
      galleryMain.style.opacity = '0';
      setTimeout(() => {
        galleryMain.src = t.src;
        galleryMain.alt = t.alt;
        galleryMain.style.opacity = '1';
      }, 200);
      thumbs.forEach(x => x.classList.remove('active'));
      t.classList.add('active');
    }));
  }

  // ─── FEATURE 16: Share bar ──────────────────
  const copyBtn = document.getElementById('copyLinkBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(window.location.href).then(() => showToast('✓ Link copied to clipboard!'));
    });
  }
  const printBtn = document.getElementById('printPageBtn');
  if (printBtn) printBtn.addEventListener('click', () => window.print());

  // ─── Properties page: search + filter ───────
  const searchInput = document.getElementById('searchInput');
  const filterType = document.getElementById('filter-type');
  const filterArea = document.getElementById('filter-area');
  const filterBudget = document.getElementById('filter-budget');
  const cards = document.querySelectorAll('.property-card[data-type]');
  const countNum = document.getElementById('count-num');
  const noResults = document.getElementById('no-results');
  function applyFilters() {
    const query = searchInput ? searchInput.value.toLowerCase() : '';
    const type = filterType ? filterType.value : 'all';
    const area = filterArea ? filterArea.value : 'all';
    const budget = filterBudget ? filterBudget.value : 'all';
    let visible = 0;
    cards.forEach(card => {
      const cardType = card.dataset.type || '';
      const cardArea = card.dataset.area || '';
      const text = card.textContent.toLowerCase();
      const typeOk = type === 'all' || cardType === type;
      const areaOk = area === 'all' || cardArea === area;
      const queryOk = !query || text.includes(query);
      const show = typeOk && areaOk && queryOk;
      card.style.display = show ? '' : 'none';
      if (show) visible++;
    });
    if (countNum) countNum.textContent = visible;
    if (noResults) noResults.style.display = visible === 0 ? 'block' : 'none';
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }
  if (searchInput) searchInput.addEventListener('input', applyFilters);
  if (filterType) filterType.addEventListener('change', applyFilters);
  if (filterArea) filterArea.addEventListener('change', applyFilters);
  if (filterBudget) filterBudget.addEventListener('change', applyFilters);

  // ─── Enquiry forms ───────────────────────────
  document.querySelectorAll('.site-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('[type=submit]');
      const msg = form.querySelector('.success-msg');
      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
      setTimeout(() => {
        if (btn) { btn.disabled = false; btn.innerHTML = '<i data-lucide="send" class="icon-md"></i> Submit Enquiry'; }
        if (msg) { msg.style.display = 'flex'; setTimeout(() => msg.style.display = 'none', 5000); }
        form.reset();
        if (typeof lucide !== 'undefined') lucide.createIcons();
      }, 1400);
    });
  });

  // ─── FEATURE 17: PWA install prompt ─────────
  let deferredPrompt;
  const pwaBanner = document.getElementById('pwaBanner');
  const pwaInstall = document.getElementById('pwaInstall');
  const pwaDismiss = document.getElementById('pwaDismiss');
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (pwaBanner && !localStorage.getItem('pwaDismissed')) {
      setTimeout(() => pwaBanner.classList.add('show'), 30000);
    }
  });
  if (pwaInstall) {
    pwaInstall.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        deferredPrompt = null;
        if (pwaBanner) pwaBanner.classList.remove('show');
      }
    });
  }
  if (pwaDismiss) {
    pwaDismiss.addEventListener('click', () => {
      if (pwaBanner) pwaBanner.classList.remove('show');
      localStorage.setItem('pwaDismissed', '1');
    });
  }

  // ─── Service Worker registration ────────────
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(() => { });
    });
  }

  // ─── Toast helper ────────────────────────────
  function showToast(msg) {
    let t = document.querySelector('.copy-toast');
    if (!t) {
      t = document.createElement('div');
      t.className = 'copy-toast';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2800);
  }

  // ─── Lucide init ────────────────────────────
  if (typeof lucide !== 'undefined') lucide.createIcons();
});
