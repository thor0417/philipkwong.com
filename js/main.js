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
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const ease = 'none';

      gsap.utils.toArray('.section-label').forEach((el) => {
        gsap.fromTo(el,
          { opacity: 0 },
          { opacity: 1, ease, scrollTrigger: { trigger: el, start: 'top 90%', end: 'top 60%', scrub: 1 } }
        );
      });

      if (!isMobile) {
        gsap.utils.toArray('.service-item').forEach((el, i) => {
          gsap.fromTo(el,
            { x: -10, opacity: 0 },
            { x: 0, opacity: 1, ease, scrollTrigger: { trigger: el, start: 'top 88%', end: 'top 60%', scrub: 1 } }
          );
        });

        gsap.utils.toArray('.work-entry').forEach((el) => {
          gsap.fromTo(el,
            { x: -10, opacity: 0 },
            { x: 0, opacity: 1, ease, scrollTrigger: { trigger: el, start: 'top 88%', end: 'top 60%', scrub: 1 } }
          );
        });

        const cta = document.querySelector('.contact-cta');
        if (cta) {
          gsap.fromTo(cta,
            { y: 8 },
            { y: 0, ease, scrollTrigger: { trigger: cta, start: 'top 85%', end: 'top 55%', scrub: 1 } }
          );
        }
      }
    }

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
       ScrollTrigger is already synced to Lenis via scrollerProxy above.
       overflow:hidden is set inline so parent flex/grid containers in
       sections 4 and 5 cannot collapse the clip on .reveal__inner. */
    function initReveal() {
      const reveals = document.querySelectorAll('.reveal');
      if (!reveals.length) return;
      reveals.forEach(el => {
        el.style.overflow = 'hidden';
        ScrollTrigger.create({
          trigger: el,
          start: 'top 100%',
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

    /* ─── CASE STUDY OVERLAY ─────────────────────────────────────────────── */
    function initCaseOverlay() {
      const overlay      = document.getElementById('case-overlay');
      if (!overlay) return;
      const subsectionEl  = document.getElementById('case-subsection');
      const closeBtn      = document.getElementById('case-close');
      const contentEl     = document.getElementById('case-content');
      const footerEl      = document.getElementById('case-footer');
      const topBarEl      = overlay.querySelector('.case-overlay__top-bar');
      const clientEl      = document.getElementById('case-client');
      const editorialEl   = document.getElementById('case-editorial');
      const descriptorsEl = document.getElementById('case-descriptors');
      const typeTagEl     = document.getElementById('case-type-tag');

      const CASES = {
        'bc-pharmacy': {
          client: 'BC Pharmacy Regulation',
          subsection: 'STRATEGY & STANDARDS',
          type: 'STANDARDS',
          descriptors: 'Quality Management System · Regulatory Compliance · Documentation',
          editorial: 'Architected the first end-to-end Quality Management System and Standard Operating Procedures suite for British Columbia community pharmacies under the new Health Professions and Occupations Act framework. The 97-document suite covers governance, CIRCL incident reporting, narcotics and controlled substances, dispensing, staff training, records, privacy, and pharmacy operations. Every procedure is anchored to a specific bylaw section and structured under ISO 9001:2015 as a document architecture overlay, built to address three regulatory deadlines: HPOA and PODSA Bylaws (April 1, 2026), CIRCL (June 1, 2026), and SOR/2025-242 (October 1, 2026).'
        },
        'ul-canada': {
          client: 'UL Canada',
          subsection: 'STRATEGY & STANDARDS',
          type: 'STANDARDS',
          descriptors: 'Corporate Strategy Development',
          editorial: 'Corporate strategy development for the Canadian national standards body.'
        },
        'ul-canada-tg': {
          client: 'UL Canada TG 4400-2',
          subsection: 'STRATEGY & STANDARDS',
          type: 'STANDARDS',
          descriptors: 'Chair',
          editorial: 'Chaired the technical guide committee responsible for ULC TG-44002, the first Canadian safety guide covering cannabis oil extraction processes including hydrocarbon, alcohol, CO2, post-processing refinement, and distillation. The guide established best practices that became the foundation for extraction facility compliance across Canada.'
        },
        'iso-iwa': {
          client: 'ISO IWA 37-1',
          subsection: 'STRATEGY & STANDARDS',
          type: 'STANDARDS',
          descriptors: 'Vice Convener',
          editorial: 'Vice Convener of Working Group 1 within ISO\'s first international workshop on cannabis safety, security, and sustainability. The workshop drew over 200 participants from 22 countries. The resulting three-part IWA 37 series became the global blueprint for countries building legal cannabis market infrastructure.'
        },
        'ul-ulc': {
          client: 'UL/ULC/ANSI/CAN/1389',
          subsection: 'STRATEGY & STANDARDS',
          type: 'STANDARDS',
          descriptors: 'STP Member',
          editorial: 'STP member on the standards technical panel that developed the first bi-national safety standard for plant oil extraction equipment across the US and Canada. The standard addressed fire, explosion, and injury risks that had sent workers to hospital and created regulatory uncertainty across North America. Referenced in NFPA 1 and the International Fire Code.'
        },
        'grant-leisure': {
          client: 'Grant Leisure International',
          subsection: 'ENGAGEMENTS',
          type: 'OPERATIONAL',
          descriptors: 'Brand Identity · Visual Systems · Digital Presence',
          editorial: 'Comprehensive brand and digital rebuild for a global leisure consultancy. Visual identity, asset architecture, and digital presence redesigned and delivered across the full engagement.'
        },
        'aurora': {
          client: 'Aurora Cannabis',
          subsection: 'ENGAGEMENTS',
          type: 'OPERATIONAL',
          descriptors: 'SOP · Product Development · Regulatory Compliance · Operational Planning',
          editorial: "Embedded across product development and compliance for one of Canada's largest licensed producers. SOP development, extraction facility design, health and safety frameworks, and staff training programs across a three-year engagement."
        },
        'organigram': {
          client: 'Organigram',
          subsection: 'ENGAGEMENTS',
          type: 'OPERATIONAL',
          descriptors: 'Regulatory Compliance · Operational Planning · Facility Development',
          editorial: 'Extraction facility design, equipment sourcing, and health and safety compliance for a publicly traded national licensed producer.'
        },
        'valens': {
          client: 'The Valens Company',
          subsection: 'ENGAGEMENTS',
          type: 'OPERATIONAL',
          descriptors: 'Operational Planning · Facility Development',
          editorial: 'Equipment sourcing, extraction floorplan design, installation, and operational training for a cannabis manufacturing company operating across Canada.'
        },
        'adastra': {
          client: 'Adastra Labs',
          subsection: 'ENGAGEMENTS',
          type: 'OPERATIONAL',
          descriptors: 'Regulatory Compliance · Operational Planning · Strategy Development',
          editorial: 'Feasibility strategy, facility design, rezoning assistance, and compliance architecture for an extraction-focused licensed producer in British Columbia.'
        },
        'ets': {
          client: 'ExtractionTek Stainless',
          subsection: 'ENGAGEMENTS',
          type: 'OPERATIONAL',
          descriptors: 'Market Entry · Regulatory Affairs · Government Relations',
          editorial: 'Built the Canadian market entry for a Colorado-based industrial equipment manufacturer. Regulatory affairs, government relations, and full Canadian sales division established.'
        },
        'veritas': {
          client: 'Veritas Pharma',
          subsection: 'ENGAGEMENTS',
          type: 'OPERATIONAL',
          descriptors: 'Strategy · Go-to-Market Development · Project Management',
          editorial: 'Consulting engagement supporting Cannevert Therapeutics Ltd., the UBC-based cannabis research subsidiary of publicly traded Veritas Pharma Inc. Cannevert operates as an academic incubator staffed by emeritus professors of pharmacology and anaesthesiology from the University of British Columbia. Work focused on extraction strategy, operational setup, and project management in support of Cannevert\'s clinical research program.'
        },
        'embark': {
          client: 'Embark Health',
          subsection: 'ENGAGEMENTS',
          type: 'OPERATIONAL',
          descriptors: 'Regulatory Compliance · Operational Planning · Strategy Development',
          editorial: 'Municipal compliance, rezoning, building and fire code, and facility design for an extraction producer serving Canadian and global medical and recreational markets.'
        }
      };

      let isOpen = false;
      let activeTl = null;

      function openCase(id) {
        const data = CASES[id];
        if (!data || isOpen) return;

        subsectionEl.textContent  = data.subsection;
        clientEl.textContent      = data.client;
        editorialEl.textContent   = data.editorial;
        descriptorsEl.textContent = data.descriptors;
        typeTagEl.innerHTML       = `<strong>[TYPE:]</strong> ${data.type}`;

        overlay.setAttribute('aria-hidden', 'false');
        overlay.classList.add('is-open');
        isOpen = true;
        document.body.style.overflow = 'hidden';

        if (activeTl) activeTl.kill();
        gsap.set([topBarEl, contentEl, footerEl], { opacity: 0 });

        const duration = isMobile ? 0.4 : 0.6;
        activeTl = gsap.timeline()
          .fromTo(overlay,
            { clipPath: 'inset(0 0 100% 0)' },
            { clipPath: 'inset(0 0 0% 0)', duration, ease: 'expo.out' }
          )
          .to([topBarEl, contentEl, footerEl], {
            opacity: 1,
            duration: 0.35,
            stagger: 0.1,
            ease: 'power2.out'
          });
      }

      function closeCase() {
        if (!isOpen) return;
        isOpen = false;

        if (activeTl) activeTl.kill();
        const duration = isMobile ? 0.35 : 0.5;

        activeTl = gsap.timeline()
          .to([footerEl, contentEl, topBarEl], {
            opacity: 0,
            duration: 0.2,
            stagger: 0.05,
            ease: 'power2.in'
          })
          .to(overlay, {
            clipPath: 'inset(0 0 100% 0)',
            duration,
            ease: 'expo.in',
            onComplete: () => {
              overlay.classList.remove('is-open');
              overlay.setAttribute('aria-hidden', 'true');
              document.body.style.overflow = '';
            }
          }, '-=0.05');
      }

      document.querySelectorAll('.work-entry[data-case-id]').forEach(entry => {
        entry.addEventListener('click', () => openCase(entry.dataset.caseId));
        entry.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openCase(entry.dataset.caseId); }
        });
      });

      closeBtn.addEventListener('click', closeCase);
      overlay.addEventListener('click', (e) => { if (e.target === overlay) closeCase(); });
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && isOpen) closeCase(); });
    }

    /* ─── WEBGL DISTORTION — desktop only ───────────────────────────────── */
    function initWebGL() {
      if (isMobile) return;
      const canvas = document.getElementById('hero-canvas');
      if (!canvas) return;
      let gl;
      try { gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl'); } catch (e) {}
      if (!gl) return;

      const VS = `
        attribute vec2 aPosition;
        void main() {
          gl_Position = vec4(aPosition, 0.0, 1.0);
        }
      `;

      const FS = `
        precision mediump float;
        uniform float uTime;
        uniform vec2  uMouse;
        uniform vec2  uResolution;

        float hash(vec2 p) {
          p = fract(p * vec2(234.34, 435.345));
          p += dot(p, p + 34.23);
          return fract(p.x * p.y);
        }

        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          float a = hash(i);
          float b = hash(i + vec2(1.0, 0.0));
          float c = hash(i + vec2(0.0, 1.0));
          float d = hash(i + vec2(1.0, 1.0));
          return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
        }

        float fbm(vec2 p) {
          float v = 0.0; float a = 0.5;
          for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.0; a *= 0.5; }
          return v;
        }

        void main() {
          vec2 uv   = gl_FragCoord.xy / uResolution;
          vec2 mUV  = vec2(uMouse.x / uResolution.x, 1.0 - uMouse.y / uResolution.y);
          float mDist = length(uv - mUV);
          float mInfl = smoothstep(0.45, 0.0, mDist);
          float t  = uTime * 0.06;
          float n1 = fbm(uv * 3.0 + t);
          float n2 = fbm(uv * 2.5 - t * 0.7 + 7.3);
          float str = 0.006 + 0.014 * mInfl;
          float cn  = fbm(uv + vec2(n1 - 0.5, n2 - 0.5) * str + t * 0.25);
          vec3 bg   = vec3(0.9765, 0.9765, 0.9765);
          float shift = (cn - 0.5) * str * 7.0;
          gl_FragColor = vec4(clamp(bg + shift, 0.0, 1.0), 1.0);
        }
      `;

      function mkShader(type, src) {
        const s = gl.createShader(type);
        gl.shaderSource(s, src);
        gl.compileShader(s);
        return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
      }

      const vs = mkShader(gl.VERTEX_SHADER, VS);
      const fs = mkShader(gl.FRAGMENT_SHADER, FS);
      if (!vs || !fs) return;

      const prog = gl.createProgram();
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
      gl.useProgram(prog);

      const quad = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
      const vbuf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vbuf);
      gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW);

      const aPos = gl.getAttribLocation(prog, 'aPosition');
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

      const locT = gl.getUniformLocation(prog, 'uTime');
      const locM = gl.getUniformLocation(prog, 'uMouse');
      const locR = gl.getUniformLocation(prog, 'uResolution');

      let tMX = -1000, tMY = -1000, cMX = -1000, cMY = -1000;

      const heroEl = document.getElementById('hero');
      if (heroEl) {
        heroEl.addEventListener('mousemove', (e) => { tMX = e.clientX; tMY = e.clientY; });
        heroEl.addEventListener('mouseleave', () => { tMX = -1000; tMY = -1000; });
      }

      function resize() {
        canvas.width  = canvas.offsetWidth  || window.innerWidth;
        canvas.height = canvas.offsetHeight || window.innerHeight;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
      resize();
      window.addEventListener('resize', resize);

      gsap.ticker.add((time) => {
        cMX += (tMX - cMX) * 0.05;
        cMY += (tMY - cMY) * 0.05;
        gl.uniform1f(locT, time);
        gl.uniform2f(locM, cMX, cMY);
        gl.uniform2f(locR, canvas.width, canvas.height);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      });
    }

    initWebGL();
    initReveal();
    initNavDark();
    initMobileNav();
    initCaseOverlay();

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