(function () {
  "use strict";

  /* ─── LENIS + GSAP SCROLLTRIGGER ────────────────────────────────────────── */

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
  });

  gsap.registerPlugin(ScrollTrigger);

  // Manual ScrollTrigger proxy — replaces v4's built-in integration
  ScrollTrigger.scrollerProxy(document.body, {
    scrollTop(value) {
      if (arguments.length) lenis.scrollTo(value, { immediate: true });
      return lenis.scroll;
    },
    getBoundingClientRect() {
      return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
    },
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // Hero parallax — data-scroll-speed drives the multiplier
  if (window.innerWidth >= 768) document.querySelectorAll('[data-scroll-speed]').forEach((el) => {
    const speed = parseFloat(el.getAttribute('data-scroll-speed'));
    gsap.to(el, {
      y: () => (1 - speed) * ScrollTrigger.maxScroll(window) * 0.12,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  });

/* ─── SECTION ENTRANCES ─────────────────────────────────────────────────── */
  // Philosophy: one property per element, small offsets, scrubbed to scroll.
  // No opacity + transform combos. No large distances. Weight, not drama.

  function initEntrances() {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobile = window.innerWidth < 768;
    if (reduced || mobile) return;

    const scrub = 1.2;
    const ease  = 'none';

    // Section labels — fade only, fast
    gsap.utils.toArray('.section-label').forEach((el) => {
      gsap.fromTo(el,
        { opacity: 0 },
        { opacity: 1, ease, scrub,
          scrollTrigger: { trigger: el, start: 'top 90%', end: 'top 65%', scrub } }
      );
    });

    // Service items — slide from left, 10px only
    gsap.utils.toArray('.service-item').forEach((el, i) => {
      gsap.fromTo(el,
        { x: -10, opacity: 0 },
        { x: 0, opacity: 1, ease, delay: i * 0.04,
          scrollTrigger: { trigger: el, start: 'top 88%', end: 'top 60%', scrub } }
      );
    });

    // Work entries — same logic as services
    gsap.utils.toArray('.work-entry').forEach((el, i) => {
      gsap.fromTo(el,
        { x: -10, opacity: 0 },
        { x: 0, opacity: 1, ease, delay: i * 0.03,
          scrollTrigger: { trigger: el, start: 'top 88%', end: 'top 60%', scrub } }
      );
    });

    // Contact CTA — y only, 8px, no opacity
    const cta = document.querySelector('.contact-cta');
    if (cta) {
      gsap.fromTo(cta,
        { y: 8 },
        { y: 0, ease,
          scrollTrigger: { trigger: cta, start: 'top 85%', end: 'top 55%', scrub } }
      );
    }
  }

  initEntrances();

  /* ─── CLOCK CONFIG ───────────────────────────────────────────────────────── */

  const CLOCKS = [
    { clusterId: "clock-van", tz: "America/Vancouver" },
    { clusterId: "clock-bkk", tz: "Asia/Bangkok" },
  ];

  const clockNodes = CLOCKS.map(({ clusterId, tz }) => {
    const cluster = document.getElementById(clusterId);
    if (!cluster) return null;
    return {
      tz,
      cluster,
      timeEl: cluster.querySelector("time"),
      statusEl: cluster.querySelector(".clock-cluster__status"),
    };
  }).filter(Boolean);

  /* ─── CLOCK ENGINE — DO NOT TOUCH ───────────────────────────────────────── */

  function tickClocks() {
    const now = new Date();
    const vanTime = now.toLocaleTimeString('en-GB', { timeZone: 'America/Vancouver', hour: '2-digit', minute: '2-digit' });
    const bkkTime = now.toLocaleTimeString('en-GB', { timeZone: 'Asia/Bangkok', hour: '2-digit', minute: '2-digit' });
    const vanHour = parseInt(vanTime.slice(0, 2), 10);
    const bkkHour = parseInt(bkkTime.slice(0, 2), 10);

    if (clockNodes[0]) {
      clockNodes[0].timeEl.textContent = vanTime;
      clockNodes[0].timeEl.setAttribute('datetime', now.toISOString());
      if (clockNodes[0].statusEl) clockNodes[0].statusEl.textContent = (vanHour >= 20 || vanHour < 6) ? 'NIGHT' : 'DAY';
      clockNodes[0].cluster.classList.toggle('is-night', vanHour >= 20 || vanHour < 6);
    }

    if (clockNodes[1]) {
      clockNodes[1].timeEl.textContent = bkkTime;
      clockNodes[1].timeEl.setAttribute('datetime', now.toISOString());
      if (clockNodes[1].statusEl) clockNodes[1].statusEl.textContent = (bkkHour >= 20 || bkkHour < 6) ? 'NIGHT' : 'DAY';
      clockNodes[1].cluster.classList.toggle('is-night', bkkHour >= 20 || bkkHour < 6);
    }
  }

  /* ─── CLIP-PATH REVEAL — IntersectionObserver, zero opacity flicker ──────── */
  // No GSAP opacity. Text is always opaque behind overflow:hidden clip.
  // .is-visible added once → inner .reveal__inner slides up into view via CSS.

  function initReveal() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -8% 0px',
    });

    reveals.forEach(el => observer.observe(el));
  }

  /* ─── NAV DARK STATE — IntersectionObserver, no GSAP dependency ─────────── */

  function initNavDark() {
    const nav = document.querySelector('.site-nav');
    if (!nav) return;

    const darkSections = document.querySelectorAll('#industries, #contact');
    if (!darkSections.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        entry.target.classList.toggle('in-view', entry.isIntersecting);
      });
      const anyDark = [...darkSections].some(s => s.classList.contains('in-view'));
      nav.classList.toggle('is-dark', anyDark);
    }, { threshold: 0.1 });

    darkSections.forEach(s => observer.observe(s));
  }

  /* ─── MOBILE NAV OVERLAY ─────────────────────────────────────────────────── */

  function initMobileNav() {
    const trigger = document.querySelector('.site-nav__trigger');
    const overlay = document.getElementById('nav-overlay');
    if (!trigger || !overlay) return;

    const overlayLinks = overlay.querySelectorAll('.nav-overlay__link');

    function openNav() {
      overlay.classList.add('is-open');
      overlay.setAttribute('aria-hidden', 'false');
      trigger.setAttribute('aria-expanded', 'true');
      trigger.textContent = '[ CLOSE ]';
      document.body.style.overflow = 'hidden';
    }

    function closeNav() {
      overlay.classList.remove('is-open');
      overlay.setAttribute('aria-hidden', 'true');
      trigger.setAttribute('aria-expanded', 'false');
      trigger.textContent = '[ MENU ]';
      document.body.style.overflow = '';
    }

    trigger.addEventListener('click', () => {
      overlay.classList.contains('is-open') ? closeNav() : openNav();
    });

    overlayLinks.forEach(link => {
      link.addEventListener('click', closeNav);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) closeNav();
    });
  }

  /* ─── INIT ───────────────────────────────────────────────────────────────── */

  document.addEventListener("DOMContentLoaded", () => {
    tickClocks();
    setInterval(tickClocks, 1000);
    initMobileNav();
    initReveal();
    initNavDark();
  });

})();