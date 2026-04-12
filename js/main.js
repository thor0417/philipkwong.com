(function () {
  "use strict";

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

  function initScrollObserver() {
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll("section").forEach((el) => {
        el.classList.add("is-visible");
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15 }
    );

    document.querySelectorAll("section").forEach((el) => observer.observe(el));
  }

  function initNavDark() {
    const nav = document.querySelector('.site-nav');
    if (!nav || !('IntersectionObserver' in window)) return;
    const darkSections = document.querySelectorAll('#industries, #contact');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          nav.classList.add('is-dark');
        } else {
          nav.classList.remove('is-dark');
        }
      });
    }, { threshold: 0.1 });
    darkSections.forEach(el => observer.observe(el));
  }

  document.addEventListener("DOMContentLoaded", () => {
    tickClocks();
    setInterval(tickClocks, 1000);
    initScrollObserver();
    initNavDark();
  });
})();