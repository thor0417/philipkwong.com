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

  const loadGSAP = () => new Promise((resolve, reject) => {
    if (window.gsap) { resolve(); return; }
    const s1 = document.createElement('script');
    s1.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js';
    s1.onerror = reject;
    s1.onload = () => {
      const s2 = document.createElement('script');
      s2.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js';
      s2.onerror = reject;
      s2.onload = resolve;
      document.head.appendChild(s2);
    };
    document.head.appendChild(s1);
  });

  /* ─── FALLBACK ───────────────────────────────────────────────────────────── */

  function showAllContent() {
    document.querySelectorAll(
      '.section, .service-item, .work-entry, .section-label, ' +
      '.industry-group, .about-body, .about-locations, ' +
      '.contact-cta, .contact-form__field, .contact-form__submit, ' +
      '.hero-headline span, #hero .clock-engine, .hero-meta .t-registry'
    ).forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
  }

  /* ─── ANIMATIONS ─────────────────────────────────────────────────────────── */

  function initAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    const ease = 'power3.out';

    /* -- HERO ---------------------------------------------------------------- */

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
        duration: 1.2,
        ease,
        stagger: 0.12,
        delay: 0.4,
      });
    }

    const heroMeta = gsap.utils.toArray('.hero-meta .t-registry');
    if (heroMeta.length) {
      gsap.set(heroMeta, { x: 30, opacity: 0 });
      gsap.to(heroMeta, {
        x: 0,
        opacity: 1,
        duration: 1.0,
        ease,
        stagger: 0.1,
        delay: 0.9,
      });
    }

    /* -- HELPER -------------------------------------------------------------- */
    const st = (trigger, extraConfig = {}) => ({
      trigger,
      start: 'top 90%',
      once: true,
      ...extraConfig,
    });

    /* -- SERVICES ------------------------------------------------------------ */
    const servicesLabel = document.querySelector('#services .section-label');
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
        scrollTrigger: st(serviceItems[0]),
      });
    }

    /* -- INDUSTRIES ---------------------------------------------------------- */
    const industriesLabel = document.querySelector('#industries .section-label');
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
        scrollTrigger: st(industryGroups[0]),
      });
    }

    /* -- WORK ---------------------------------------------------------------- */
    const workLabel = document.querySelector('#work .section-label');
    if (workLabel) {
      gsap.set(workLabel, { opacity: 0 });
      gsap.to(workLabel, {
        opacity: 1,
        duration: 0.6,
        ease,
        scrollTrigger: st(workLabel),
      });
    }

    const workCategoryLabels = gsap.utils.toArray('#work .work-category-label');
    if (workCategoryLabels.length) {
      gsap.set(workCategoryLabels, { opacity: 0 });
      gsap.to(workCategoryLabels, {
        opacity: 1,
        duration: 0.5,
        ease,
        stagger: 0.05,
        scrollTrigger: st(workCategoryLabels[0]),
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
        scrollTrigger: st(workEntries[0]),
      });
    }

    /* -- ABOUT --------------------------------------------------------------- */
    const aboutLabel = document.querySelector('#about .section-label');
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
        scrollTrigger: st(formFields[0]),
      });
    }

    /* -- NAV DARK STATE ------------------------------------------------------ */
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

    ScrollTrigger.refresh();
  }

  /* ─── INIT ───────────────────────────────────────────────────────────────── */

  document.addEventListener("DOMContentLoaded", () => {
    tickClocks();
    setInterval(tickClocks, 1000);

    loadGSAP()
      .then(() => {
        initAnimations();
      })
      .catch(() => {
        showAllContent();
      });

    setTimeout(showAllContent, 4000);
  });
})();