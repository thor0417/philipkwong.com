(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", () => {

    /* ─── LENIS — all devices ─────────────────────────────────────────────── */
    const isMobile = window.innerWidth < 768;
    const lenis = new Lenis({
      duration: isMobile ? 0.9 : 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
      infinite: false,
    });

    gsap.registerPlugin(ScrollTrigger);

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

    /* ─── HERO PARALLAX — desktop only ───────────────────────────────────── */
    if (!isMobile) {
      document.querySelectorAll('[data-scroll-speed]').forEach((el) => {
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
    }

    /* ─── SECTION ENTRANCES ───────────────────────────────────────────────── */
    /* Reveal system via IntersectionObserver handles all section entrances.
       GSAP scrub removed — was conflicting with Lenis on every scroll tick. */

    /* ─── CLOCKS ──────────────────────────────────────────────────────────── */
    const CLOCKS = [
      { clusterId: "clock-van", tz: "America/Vancouver" },
      { clusterId: "clock-bkk", tz: "Asia/Bangkok" },
    ];

    const clockNodes = CLOCKS.map(({ clusterId }) => {
      const cluster = document.getElementById(clusterId);
      if (!cluster) return null;
      return {
        cluster,
        timeEl: cluster.querySelector("time"),
        statusEl: cluster.querySelector(".clock-cluster__status"),
      };
    }).filter(Boolean);

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

    tickClocks();
    setInterval(tickClocks, 1000);

    /* ─── REVEAL ──────────────────────────────────────────────────────────── */
    /* ScrollTrigger-based reveal — IntersectionObserver cannot track Lenis
       scroll position since Lenis owns the scroll loop, not the browser.
       ScrollTrigger is already synced to Lenis via scrollerProxy above. */
    function initReveal() {
      const reveals = document.querySelectorAll('.reveal');
      if (!reveals.length) return;
      reveals.forEach(el => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top 92%',
          once: true,
          onEnter: () => el.classList.add('is-visible'),
        });
      });
    }

    /* ─── NAV DARK ────────────────────────────────────────────────────────── */
    function initNavDark() {
      const nav = document.querySelector('.site-nav');
      if (!nav) return;
      const darkSections = document.querySelectorAll('#contact');
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

    /* ─── MOBILE NAV ──────────────────────────────────────────────────────── */
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
      overlayLinks.forEach(link => link.addEventListener('click', closeNav));
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('is-open')) closeNav();
      });
    }

    initReveal();
    initNavDark();
    initMobileNav();

    /* ─── CONTACT FORM ────────────────────────────────────────────────────── */
    const submitBtn = document.getElementById('contact-submit');
    if (submitBtn) {
      submitBtn.addEventListener('click', async () => {
        const name    = document.getElementById('field-name').value.trim();
        const company = document.getElementById('field-company').value.trim();
        const message = document.getElementById('field-message').value.trim();

        if (!name || !message) {
          submitBtn.textContent = 'Name + message required';
          setTimeout(() => submitBtn.textContent = 'Send', 3000);
          return;
        }

        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        try {
          const res = await fetch('https://formspree.io/f/xdaypbrk', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ name, company, message }),
          });

          if (res.ok) {
            submitBtn.textContent = 'Sent.';
            document.getElementById('field-name').value = '';
            document.getElementById('field-company').value = '';
            document.getElementById('field-message').value = '';
          } else {
            submitBtn.textContent = 'Error — try again';
            submitBtn.disabled = false;
          }
        } catch {
          submitBtn.textContent = 'Error — try again';
          submitBtn.disabled = false;
        }

        setTimeout(() => {
          submitBtn.textContent = 'Send';
          submitBtn.disabled = false;
        }, 4000);
      });
    }
  });

})();