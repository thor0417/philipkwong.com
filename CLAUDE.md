# PHILIP KWONG — DIGITAL ARTIFACT v2.0
## Project Manifest & Design Intelligence Document
### Last updated: June 2026

---

## CRITICAL RULES — READ BEFORE TOUCHING ANYTHING

1. **Do not rewrite full files.** Targeted diffs only. Format: Replace [Line X] with [Code].
2. **Do not combine CSS and HTML passes.** CSS first, confirm it renders, then HTML.
3. **Do not introduce new design decisions** without flagging them as [DESIGN CHAT] first.
4. **Orange is reserved for exactly three uses.** See Color section below.
5. **Do not change clamp() ceilings without explicit instruction.** Scale decisions are locked.

---

## PROJECT OVERVIEW

A high-precision professional consulting portfolio for Philip Kwong, a regulatory compliance and corporate strategy consultant operating between Vancouver and Bangkok.

**Live URL:** philipkwong.com
**Repository:** GitHub (main branch auto-deploys to GitHub Pages)
**Stack:** Vanilla HTML/CSS/JS — no framework. Lenis v5 smooth scroll + GSAP ScrollTrigger.

**File structure:**
```
/
├── index.html
├── writing.html
├── favicon.svg
├── css/
│   ├── styles.css
│   └── mobile.css          (loaded after styles.css — overrides only)
├── js/
│   └── main.js
└── assets/
    └── font/
        ├── DharmaGothicE_Heavy_R.woff      (font-weight: 900)
        ├── DharmaGothicE_ExBold_R.woff     (font-weight: 800)
        ├── DharmaGothicE_Bold_R.otf        (font-weight: 700)
        ├── DMMono-Regular.ttf              (font-weight: 400)
        ├── DMMono-Medium.ttf               (font-weight: 500)
        ├── PPNeueMontreal-Regular.otf      (font-weight: 400)
        └── PPNeueMontreal-Semibold.otf     (font-weight: 600)
```

Note: InterTight font files exist on disk but are no longer in use. PP Neue Montreal replaced Inter Tight as Voice 3.

---

## DESIGN PHILOSOPHY

**Style:** Typographic Functionalism. Environmental Typography. Kinetic Asymmetry.
**References:** Anton & Irene, Active Theory, Rolf Jensen.
**Standard:** Master Grade execution. No safe layouts. No centered containers. No decorative typography.

The grid is not a container. It is the stage. Every element knows exactly which column it lives on.

---

## COLOR PALETTE — LOCKED

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` | `#F9F9F9` | Paper-white. All light section backgrounds. |
| `--text-main` | `#0A0A0A` | Deep ink. All primary text. |
| `--accent` | `#B34700` | Burnt orange. **THREE USES ONLY.** |
| `--bg-dark` | `#111111` | Contact section background. |
| `--border-light` | `#E5E5E5` | Hairline rules on light sections. |
| `--border-dark` | `#333333` | Hairline rules on dark sections. |

### ORANGE RESTRICTION — NON-NEGOTIABLE

Orange (`#B34700`) appears in **exactly three places** on the entire site:

1. Registry tag brackets: `[ULC: STRAT]`, `[ISO: VICE]`, `[REG: 08.YRS]`, `[BASE:]`, `[OPS:]` etc.
2. Clock city labels: VANCOUVER and BANGKOK
3. The word **No** in the hero headline

**Orange must NOT appear on:**
- Section labels (02 — WHAT I DO etc.) — use `rgba(10, 10, 10, 0.4)`
- Hover states — use border-color shifts or opacity only
- Form labels — use `rgba(249, 249, 249, 0.4)` on dark, `rgba(10, 10, 10, 0.4)` on light
- Work descriptors — use `rgba(10, 10, 10, 0.4)`

---

## TYPOGRAPHY SYSTEM — THREE VOICES

### Voice 1: Dharma Gothic E — Declaration
Used for: Hero headline, section display text, work client names, service titles, contact CTA, writing page hero, case overlay client name.

| Weight | File | Usage |
|--------|------|-------|
| 900 Heavy | DharmaGothicE_Heavy_R.woff | Hero headline, contact CTA, writing page hero |
| 800 ExBold | DharmaGothicE_ExBold_R.woff | Service titles, work clients, case overlay client |
| 700 Bold | DharmaGothicE_Bold_R.otf | Work subsection headers, writing entry titles |

Key properties:
- `letter-spacing: 0.01em` (display tracking token)
- `line-height: 0.92` (display leading token)
- Hero: `line-height: 0.82`, `letter-spacing: -0.01em`

### Voice 2: DM Mono — Machine
Used for: Registry tags, section labels, clock labels, work descriptors, nav wordmark, form labels, metadata, case overlay subsection/close/descriptors, writing entry dates.

| Weight | File | Usage |
|--------|------|-------|
| 500 Medium | DMMono-Medium.ttf | Section labels, registry tags, clock cities, nav wordmark |
| 400 Regular | DMMono-Regular.ttf | Body metadata, descriptors, dates |

Key properties:
- Registry tags: `font-size: 14px`, `letter-spacing: 0.04em`, `text-transform: uppercase`
- Section labels: `font-size: 14px`, `letter-spacing: 0.25em`, `color: rgba(10,10,10,0.4)`
- Nav wordmark: `font-size: 15px`, `font-weight: 600`, `letter-spacing: 0.08em`

### Voice 3: PP Neue Montreal — Human
Used for: About section body copy, nav links, writing entry descriptions, case overlay editorial copy.

| Weight | File | Usage |
|--------|------|-------|
| 400 Regular | PPNeueMontreal-Regular.otf | About body, case overlay editorial, writing descriptions |
| 600 Semibold | PPNeueMontreal-Semibold.otf | Nav wordmark |

Key properties:
- About body: `font-size: clamp(1.25rem, 2vw, 1.75rem)`, `line-height: 1.45`, `letter-spacing: 0.01em`
- Nav links: `font-size: 11px`, `letter-spacing: 0.12em`
- Case overlay editorial: `font-size: 18px`, `line-height: 1.7`, `max-width: 52ch`

---

## GRID SYSTEM

### Global Grid
```css
.grid-stage {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: clamp(0.75rem, 1.5vw, 1.25rem);
  padding-inline: 5vw;
  width: 100%;
}
```

Mobile collapses to 4-column grid via mobile.css.

### Section Grid Assignments

**Hero:**
- Clock engine: `grid-column: 1 / 5`
- Headline (h1): `grid-column: 1 / 9`
- Registry tags: `grid-column: 9 / 13`

**Services:**
- Section label: `grid-column: 1 / -1`
- Service list: `grid-column: 1 / -1`
- Service items: flex, `justify-content: space-between` (number left, title right)

**Work:**
- Section label: `grid-column: 1 / -1`
- Work subsections: `grid-column: 1 / -1`
- Work entries: `display: grid; grid-template-columns: 1fr auto` (client left, descriptor right)

**About:**
- Section label: `grid-column: 1 / -1`
- Body copy: `grid-column: 1 / 7`
- Locations block: `grid-column: 9 / 13; align-self: start`

**Contact:**
- Section label: `grid-column: 1 / -1`
- CTA h2: `grid-column: 1 / 6`
- Form: `grid-column: 7 / 13`

---

## SECTION-BY-SECTION SPEC

Section order is locked: **Hero → About → Services → Work → Contact**
The Industries section has been **removed entirely** — all HTML, CSS selectors, and JS references purged.

### 01 — HERO
- Full viewport height (`min-height: 100svh`)
- Content anchored to bottom (`display: grid; align-content: end`)
- Z-pattern: clocks top-left → headline dominant left → registry tags right
- Clocks: Vancouver and Bangkok live times, DM Mono Heavy, city labels in orange
- Headline: "There Are / **No** / Shortcuts." — "No" in orange, rest in deep ink
- Registry tags stacked vertically in right column: bold orange bracket + plain black description
- Hero parallax: three elements carry `data-scroll-speed` attributes, scrubbed via ScrollTrigger

### 02 — ABOUT
- Body copy: PP Neue Montreal 400, `clamp(1.25rem, 2vw, 1.75rem)`, 1.45 leading
- Right column: four `.about-data-row` elements with registry tags `[STATUS:]`, `[YEARS:]`, `[BASE:]`, `[OPS:]`
- All registry tags same size and font — no inline style overrides

### 03 — SERVICES (WHAT I DO)
- Five service items numbered 01–05
- Number left in `rgba(10,10,10,0.35)` DM Mono
- Title right in Dharma Gothic ExBold
- Hover: border-bottom shifts to `rgba(10,10,10,0.5)` — no orange

### 04 — SELECTED WORK
- Two subsections: **Strategy & Standards** and **Engagements**
- **13 total work entries**, all clickable — each carries `data-case-id`, `role="button"`, `tabindex="0"`
- Each entry: `display: grid; grid-template-columns: 1fr auto`
- Client name: Dharma Gothic 700, `clamp(1.5rem, 3vw, 3.5rem)`, left
- Descriptor: DM Mono 500, 13px, `rgba(10,10,10,0.4)`, right-aligned
- Subsection labels: DM Mono 700, 16px, `rgba(10,10,10,0.4)` — NOT orange
- Clicking any entry opens the case study overlay

### 05 — CONTACT
- Dark background `#111111`
- "Let's talk." in Dharma Gothic 900 at `var(--text-display-xl)`
- Form fields: borderless, bottom hairline only, dark background autofill suppressed
- Submit button: bordered, no fill, hover shifts border to white — no orange
- Formspree endpoint: `xdaypbrk`

---

## CASE STUDY OVERLAY

Full-viewport overlay panel triggered by clicking any `.work-entry`.

**HTML:** `<div class="case-overlay" id="case-overlay">` placed before scripts in index.html.

**CSS:** `.case-overlay { display: none }` at rest — zero compositor cost. `.case-overlay.is-open { display: grid }` when active. **Do not add clip-path or will-change to this element** — it caused confirmed scroll lag and was the subject of a full debugging session.

**Animation:** `translateY('100%') → translateY('0%')` on open via GSAP timeline. Reverse on close. Content fades in staggered after panel slides up.

**JS:** `initCaseOverlay()` in main.js. CASES object contains 13 entries with `client`, `subsection`, `type`, `descriptors`, and `editorial` fields.

**Close triggers:** `[ CLOSE ]` button, ESC key, clicking the overlay backdrop.

**Scroll lock:** `document.body.style.overflow = 'hidden'` on open, `''` on close.

---

## WRITING PAGE

Separate page at `writing.html`. Same CSS files, same nav markup, same Lenis/GSAP scripts.

- Nav carries `class="site-nav is-writing-page"` — mutes non-active links
- Writing link carries `aria-current="page"`
- Section label: `05 — WRITING`
- Hero heading: `.writing-hero` — Dharma Gothic 900, `clamp(3rem, 8vw, 10rem)`
- Three placeholder articles currently — each a `.writing-entry` `<a>` element
- Mobile: single column layout, date + read time in flex row below description

---

## JAVASCRIPT — main.js

### Active systems

**Lenis smooth scroll**
- `duration: 1.2` desktop, `0.9` mobile
- `touchMultiplier: 2.5`
- Integrated into GSAP ticker: `gsap.ticker.add((time) => lenis.raf(time * 1000))`
- `lenis.on('scroll', ScrollTrigger.update)` keeps ScrollTrigger in sync

**ScrollTrigger proxy** — wired to Lenis scroll position. Do not touch.

**Hero parallax** (desktop only)
- Three `[data-scroll-speed]` elements scrubbed against hero section
- `maxScroll` cached at init, refreshed on `resize` — do not inline `ScrollTrigger.maxScroll(window)` per frame

**Section entrances** (desktop only, `prefers-reduced-motion` checked)
- Section labels: `scrub: 0.8`, `end: 'top 65%'`
- Service items: `scrub: 0.8`, `end: 'top 62%'`
- Work entries: `toggleActions: 'play none none none'` — fires once, no scrub sub-tween
- Contact CTA: `scrub: 0.8`

**Clock engine**
- IDs: `clock-van` (America/Vancouver) and `clock-bkk` (Asia/Bangkok)
- `Intl.DateTimeFormat` instances cached at init as `fmtVan` / `fmtBkk` — do not use `toLocaleTimeString` inline, it reconstructs the formatter every second
- Updates every 1000ms via `setInterval`

**Reveal system**
- `.reveal` / `.reveal__inner` — clip reveal on scroll enter, once only
- ScrollTrigger-based (not IntersectionObserver) — required because Lenis owns the scroll loop

**Nav dark state**
- IntersectionObserver watches `#contact`
- Adds `.is-dark` to `.site-nav` when contact section enters viewport

**Mobile nav**
- `[ MENU ]` / `[ CLOSE ]` trigger
- Full-screen overlay, ESC key support, body scroll lock

**Case study overlay** — see Case Study Overlay section above.

**Contact form** — Formspree `POST` to `https://formspree.io/f/xdaypbrk`.

---

## REGISTRY TAG FORMAT

```html
<span class="t-registry"><strong>[BRACKET: KEY]</strong> Description text</span>
```

- `<strong>` wraps the bracket only — renders in bold orange
- Description text sits outside `<strong>` — renders in plain `#0A0A0A`
- `display: block` on `.t-registry` stacks them vertically
- `letter-spacing: 0.04em`

---

## CURRENT CSS TOKEN VALUES

```css
--tracking-display: 0.01em;
--tracking-hero:    -0.01em;
--tracking-label:    0.25em;
--tracking-body:     0.04em;

--leading-display: 0.92;
--leading-hero:    0.82;
--leading-body:    1.6;

--text-display-2xl: clamp(5rem, 15vw, 20rem);
--text-display-xl:  clamp(3.5rem, 10vw, 14rem);
--text-display-lg:  clamp(2rem, 5vw, 8rem);
--text-display-md:  clamp(1.5rem, 3vw, 4rem);

/* Hero headline */
font-size: clamp(4rem, 12vw, 14rem);

/* Service titles */
font-size: clamp(1.5rem, 3vw, 3rem);

/* Work client names */
font-size: clamp(1.5rem, 3vw, 3.5rem);
```

---

## KNOWN PERFORMANCE ISSUES

### Scroll lag — partially resolved, rebuild will fix permanently

**Root causes identified:**
1. `.case-overlay { clip-path: inset(0 0 100% 0); display: grid }` — fixed by replacing with `display: none` at rest
2. `will-change: transform` on bulk display text selectors — removed
3. `overflow: hidden` on `.section` — removed (created unnecessary stacking contexts)
4. 24+ `scrub: 1` ScrollTrigger animations simultaneously active — reduced to `scrub: 0.8` and work entries converted to `toggleActions`
5. `toLocaleTimeString` reconstructing `Intl.DateTimeFormat` every second — replaced with cached formatters
6. `ScrollTrigger.maxScroll(window)` called inline per frame — cached

**Remaining known cost:** `backdrop-filter: blur(20px)` on `.site-nav` (position: fixed) — pre-existing, blurs scrolling content on every frame. Not addressed in current codebase.

**main.js version instability:** Multiple revert/re-apply cycles today caused confusion about which version was live. The git history has: performance changes in `d2230b0`, reverted in `c1357b5`, re-applied via `git revert c1357b5` in `2c27f5e`. The rebuild eliminates this entirely.

---

## WHAT HAS BEEN TRIED AND REJECTED

- **Koyo watermark numbers** — removed. Client did not want them.
- **Vancouver & Bangkok as display text in About** — removed. Replaced with dossier data rows.
- **08 as large Dharma Gothic number in About** — tried and rejected. Looked out of place.
- **Orange on section labels** — rejected. Violates the orange restriction.
- **DM Mono for body copy** — rejected. Too laboured at paragraph length.
- **Inter Tight** — replaced by PP Neue Montreal throughout.
- **Three-column sub-grid for hero registry tags** — tried. Tags were too narrow and wrapped. Reverted to single column stack at `grid-column: 9 / 13`.
- **Clock engine in About section** — tried. Moved back to Hero where it belongs.
- **Industries section** — removed entirely from HTML, CSS, and JS.
- **WebGL distortion field in hero** — built, debugged, removed. Caused scroll lag via RAF conflicts with Lenis. The effect was incompatible with the Lenis/GSAP architecture without a dedicated Worker. Not the right fit for this site.
- **Kinetic headline magnetic hover** — designed but never shipped due to session being consumed by WebGL debugging.
- **Custom cursor** — designed but never shipped for same reason.

---

## APPROVED NEXT PHASE — NEXT.JS REBUILD

The current vanilla implementation has served its purpose as a design prototype. The rebuild is approved.

**Architecture:**
- Next.js — clean architecture, Lenis + GSAP wired correctly from day one
- Vercel deployment replacing GitHub Pages
- No WebGL

**SEO & GEO infrastructure:**
- Meta tags, OG tags, Twitter cards
- Schema markup
- XML sitemap
- GEO strategy: article architecture targeting AI search engine citation
- Writing section as real Next.js routes with proper metadata
- Case study pages as real routes (not overlays)

**Features to carry forward:**
- Full design system (colors, typography, grid) exactly as specified here
- Case study content (all 13 entries with editorial copy)
- Writing placeholder articles
- Formspree contact form
- Clock engine (Vancouver + Bangkok)
- Mobile nav overlay pattern

**Agent infrastructure hooks** — to be defined at rebuild start.

---

## DEPLOYMENT (CURRENT — PRE-REBUILD)

1. Edit files locally
2. Push to GitHub main branch
3. Site auto-deploys via GitHub Pages
4. Hard refresh browser: Ctrl+Shift+R
5. If fonts appear wrong after deploy — check Network tab filtered for font name

---

## SESSION HANDOFF PROTOCOL

At the start of every new session:
1. Read this document completely before touching any code
2. Read index.html, css/styles.css, css/mobile.css, and js/main.js in full
3. Confirm which file is being edited before writing any diffs
4. CSS pass first, HTML pass second, never combined
5. Do not push without showing a diff summary and receiving approval
