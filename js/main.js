<script>
(function () {
  "use strict";

  /* ─────────────────────────────────────────────
   * LIVE CLOCKS
   * Runs every second; updates time display and
   * derives DAY / NIGHT from the local hour in
   * each city so the UI can reflect operational
   * status without a server round-trip.
   * ───────────────────────────────────────────── */

  const CLOCKS = [
    { clusterId: "clock-van", tz: "America/Vancouver" },
    { clusterId: "clock-bkk", tz: "Asia/Bangkok" },
  ];

  /* Cache DOM references once — querying every
   * second would be wasteful and brittle.        */
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

  /* Intl.DateTimeFormat instances are expensive
   * to construct; create one per timezone once. */
  const hourFormatters = new Map(
    CLOCKS.map(({ tz }) => [
      tz,
      new Intl.DateTimeFormat("en-GB", {
        timeZone: tz,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }),
    ])
  );

  const hourFormatters = new Map(
    CLOCKS.map(({ tz }) => [
      tz,
      new Intl.DateTimeFormat("en-GB", {
        timeZone: tz,
        hour: "numeric",
        hour12: false,
      }),
    ])
  );

  function tickClocks() {
  const now = new Date();
  const vanTime = now.toLocaleTimeString('en-US', { timeZone: 'America/Vancouver', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const bkkTime = now.toLocaleTimeString('en-US', { timeZone: 'Asia/Bangkok', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const vanHour = parseInt(vanTime.slice(0, 2), 10);
  const bkkHour = parseInt(bkkTime.slice(0, 2), 10);

  clockNodes[0].timeEl.textContent = vanTime;
  clockNodes[0].timeEl.setAttribute('datetime', now.toISOString());
  clockNodes[0].statusEl.textContent = (vanHour >= 20 || vanHour < 6) ? 'NIGHT' : 'DAY';
  clockNodes[0].cluster.classList.toggle('is-night', vanHour >= 20 || vanHour < 6);

  clockNodes[1].timeEl.textContent = bkkTime;
  clockNodes[1].timeEl.setAttribute('datetime', now.toISOString());
  clockNodes[1].statusEl.textContent = (bkkHour >= 20 || bkkHour < 6) ? 'NIGHT' : 'DAY';
  clockNodes[1].cluster.classList.toggle('is-night', bkkHour >= 20 || bkkHour < 6);
}

  /* ─────────────────────────────────────────────
   * SCROLL-BASED SECTION OBSERVER
   * Adds `is-visible` once when a section crosses
   * the 15% threshold — never removed, so each
   * section animates in exactly one time.
   * ───────────────────────────────────────────── */

  function initScrollObserver() {
    /* Guard: older browsers that lack IO get a
     * graceful no-op rather than a thrown error. */
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

          /* Unobserve immediately — we only want
           * the animation to fire once per section. */
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15 }
    );

    document.querySelectorAll("section").forEach((el) => observer.observe(el));
  }

  /* ─────────────────────────────────────────────
   * INIT — wait for DOM before querying anything
   * ───────────────────────────────────────────── */

  document.addEventListener("DOMContentLoaded", () => {
    /* Fire immediately so clocks aren't blank for
     * the first second before setInterval kicks in. */
    tickClocks();
    setInterval(tickClocks, 1000);

    initScrollObserver();
  });
})();
</script>
