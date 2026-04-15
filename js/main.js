(function () {
  "use strict";

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

  /* ─── GSAP LOADER ────────────────────────────────────────────────────────── */

  /* Dynamic load keeps the HTML clean and guarantees ScrollTrigger is
   * registered only after GSAP core is fully evaluated — race-condition safe. */
  const loadGSAP = () => new Promise((resolve) => {
    if (window.gsap) { resolve(); return; }
    const s1 = document.createElement('script');
    s1.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js';
    s1.onload = () => {
      const s2 = document.createElement('script');
      s2.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js';
      s2.onload = resolve;
      document.head.appendChild(s2);
    };
    document.head.appendChild(s1);
  });

  /* ─── ANIMATIONS ─────────────────────────────────────────────────────────── */

  function initAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    const ease = 'power3.out';

    /* -- HERO: fires on load, no ScrollTrigger -------------------------------
     * gsap.set() establishes initial states in JS so CSS never fights GSAP. */

    const heroClock = document.querySelector('#hero .clock-engine');
    if (heroClock) {
      gsap.set(heroClock, { opacity: 0 });
      gsap.to(heroClock, { opacity: 1, duration: 0.6, delay: 0.2, ease });
    }

    const heroSpans = gsap.utils.toArray('.hero-headline span');
    if (heroSpans.length) {
      gsap.set(heroSpans, { y: 40, opacity: 0 });
      gsap.to(heroSpans, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease,
        stagger: 0.08,
        delay: 0.3,
      });
    }

    const heroMeta = gsap.utils.toArray('.hero-meta span, .hero-meta [class*="meta"]');
    if (heroMeta.length) {
      gsap.set(heroMeta, { x: 30, opacity: 0 });
      gsap.to(heroMeta, {
        x: 0,
        opacity: 1,
        duration: 0.7,
        ease,
        stagger: 0.06,
        delay: 0.6,
      });
    }

    /* -- HELPER: shared ScrollTrigger factory --------------------------------
     * `once: true` means the observer disconnects after first trigger so
     * animations never replay on scroll-back — matches the old unobserve() logic. */
    const st = (trigger, extraConfig = {}) => ({
      trigger,
      start: 'top 85%', /* 15% of section visible before firing */
      once: true,
      ...extraConfig,
    });

    /* -- SERVICES ------------------------------------------------------------ */
    const servicesLabel = document.querySelector('#services .section-label, #services .meta-tag');
    if (servicesLabel) {
      gsap.set(servicesLabel, { opacity: 0 });
      gsap.to(servicesLabel, {
        opacity: 1,
        duration: 0.6,
        ease,
        scrollTrigger: st(servicesLabel),
      });
    }

    const serviceItems = gsap.utils.toArray('#services .service-item');
    if (serviceItems.length) {
      gsap.set(serviceItems, { x: -20, opacity: 0 });
      gsap.to(serviceItems, {
        x: 0,
        opacity: 1,
        duration: 0.7,
        ease,
        stagger: 0.06,
        scrollTrigger: st('#services .service-item'),
      });
    }

    /* -- INDUSTRIES ---------------------------------------------------------- */
    const industriesLabel = document.querySelector('#industries .section-label, #industries .meta-tag');
    if (industriesLabel) {
      gsap.set(industriesLabel, { opacity: 0 });
      gsap.to(industriesLabel, {
        opacity: 1,
        duration: 0.6,
        ease,
        scrollTrigger: st(industriesLabel),
      });
    }

    const industryGroups = gsap.utils.toArray('#industries .industry-group');
    if (industryGroups.length) {
      gsap.set(industryGroups, { y: 30, opacity: 0 });
      gsap.to(industryGroups, {
        y: 0,
        opacity: 1,
        duration: 0.75,
        ease,
        stagger: 0.08,
        scrollTrigger: st('#industries .industry-group'),
      });
    }

    /* -- WORK ---------------------------------------------------------------- */
    const workLabel = document.querySelector('#work .section-label, #work .meta-tag');
    if (workLabel) {
      gsap.set(workLabel, { opacity: 0 });
      gsap.to(workLabel, {
        opacity: 1,
        duration: 0.6,
        ease,
        scrollTrigger: st(workLabel),
      });
    }

    /* Subsection labels fade before their sibling entries */
    const workSubLabels = gsap.utils.toArray('#work .subsection-label, #work .work-category');
    if (workSubLabels.length) {
      gsap.set(workSubLabels, { opacity: 0 });
      gsap.to(workSubLabels, {
        opacity: 1,
        duration: 0.5,
        ease,
        stagger: 0.05,
        scrollTrigger: st('#work'),
      });
    }

    const workEntries = gsap.utils.toArray('#work .work-entry');
    if (workEntries.length) {
      gsap.set(workEntries, { x: -20, opacity: 0 });
      gsap.to(workEntries, {
        x: 0,
        opacity: 1,
        duration: 0.65,
        ease,
        stagger: 0.04,
        scrollTrigger: st('#work .work-entry'),
      });
    }

    /* -- ABOUT --------------------------------------------------------------- */
    const aboutLabel = document.querySelector('#about .section-label, #about .meta-tag');
    if (aboutLabel) {
      gsap.set(aboutLabel, { opacity: 0 });
      gsap.to(aboutLabel, {
        opacity: 1,
        duration: 0.6,
        ease,
        scrollTrigger: st(aboutLabel),
      });
    }

    const aboutBody = document.querySelector('#about .about-body');
    if (aboutBody) {
      gsap.set(aboutBody, { x: -20, opacity: 0 });
      gsap.to(aboutBody, {
        x: 0,
        opacity: 1,
        duration: 0.75,
        ease,
        scrollTrigger: st(aboutBody),
      });
    }

    /* Opposite direction creates deliberate visual tension against .about-body */
    const aboutLocations = document.querySelector('#about .about-locations');
    if (aboutLocations) {
      gsap.set(aboutLocations, { x: 20, opacity: 0 });
      gsap.to(aboutLocations, {
        x: 0,
        opacity: 1,
        duration: 0.75,
        ease,
        scrollTrigger: st(aboutLocations),
      });
    }

    /* -- CONTACT ------------------------------------------------------------- */
    const contactCta = document.querySelector('#contact .contact-cta');
    if (contactCta) {
      gsap.set(contactCta, { y: 30, opacity: 0 });
      gsap.to(contactCta, {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease,
        scrollTrigger: st(contactCta),
      });
    }

    const formFields = gsap.utils.toArray('#contact .contact-form__field, #contact .contact-form__submit');
    if (formFields.length) {
      gsap.set(formFields, { y: 20, opacity: 0 });
      gsap.to(formFields, {
        y: 0,
        opacity: 1,
        duration: 0.65,
        ease,
        stagger: 0.06,
        scrollTrigger: st('#contact .contact-form__field'),
      });
    }

    /* -- NAV DARK STATE ------------------------------------------------------
     * Separate ScrollTrigger per section so enter/leave in both scroll
     * directions toggles the class correctly with no shared state to manage. */
    const nav = document.querySelector('.site-nav');
    if (nav) {
      ['#industries', '#contact'].forEach((selector) => {
        const section = document.querySelector(selector);
        if (!section) return;

        ScrollTrigger.create({
          trigger: section,
          start: 'top 10%',
          end: 'bottom 10%',
          onEnter:      () => nav.classList.add('is-dark'),
          onLeave:      () => nav.classList.remove('is-dark'),
          onEnterBack:  () => nav.classList.add('is-dark'),
          onLeaveBack:  () => nav.classList.remove('is-dark'),
        });
      });
    }
  }

  /* ─── INIT ───────────────────────────────────────────────────────────────── */

  document.addEventListener("DOMContentLoaded", () => {
    tickClocks();
    setInterval(tickClocks, 1000);

    loadGSAP().then(() => {
      gsap.registerPlugin(ScrollTrigger);
      initAnimations();
    });
  });
})();