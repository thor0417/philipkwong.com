# PHILIP KWONG — DIGITAL ARTIFACT v2.0
## Project Manifest & Design Intelligence Document
### Last updated: April 2026

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
**Repository:** GitHub (main branch auto-deploys)
**File structure:**
```
/
├── index.html
├── css/styles.css
├── js/main.js
└── assets/
    └── font/
        ├── DharmaGothicE_Heavy_R.woff      (font-weight: 900)
        ├── DharmaGothicE_ExBold_R.woff     (font-weight: 800)
        ├── DharmaGothicE_Bold_R.otf        (font-weight: 700)
        ├── DMMono-Regular.ttf              (font-weight: 400)
        ├── DMMono-Medium.ttf               (font-weight: 500)
        ├── InterTight-Regular.ttf          (font-weight: 400)
        └── InterTight-Medium.ttf           (font-weight: 500)
```

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
| `--bg-dark` | `#111111` | Industries and Contact section backgrounds. |
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
- Industry group labels — use `rgba(255, 255, 255, 0.5)` on dark background

---

## TYPOGRAPHY SYSTEM — THREE VOICES

### Voice 1: Dharma Gothic E — Declaration
Used for: Hero headline, section display text, work client names, industry tags, service titles, contact CTA, "Let's talk."

| Weight | File | Usage |
|--------|------|-------|
| 900 Heavy | DharmaGothicE_Heavy_R.woff | Hero headline, contact CTA |
| 800 ExBold | DharmaGothicE_ExBold_R.woff | Service titles, work clients, industry tags |
| 700 Bold | DharmaGothicE_Bold_R.otf | Section subsection headers |

Key properties:
- `letter-spacing: 0.01em` (display tracking token)
- `line-height: 0.92` (display leading token)
- Hero: `line-height: 0.82`, `letter-spacing: -0.01em`

### Voice 2: DM Mono — Machine
Used for: Registry tags, section labels, clock labels, work descriptors, nav wordmark, form labels, metadata.

| Weight | File | Usage |
|--------|------|-------|
| 500 Medium | DMMono-Medium.ttf | Section labels, registry tags, clock cities, nav wordmark |
| 400 Regular | DMMono-Regular.ttf | Body metadata, descriptors |

Key properties:
- Registry tags: `font-size: 14px`, `letter-spacing: 0.04em`, `text-transform: uppercase`
- Section labels: `font-size: 14px`, `letter-spacing: 0.25em`, `color: rgba(10,10,10,0.4)`
- Nav wordmark: `font-size: 15px`, `font-weight: 700`, `letter-spacing: 0.25em`

### Voice 3: Inter Tight — Human
Used for: About section body copy, nav links only.

| Weight | File | Usage |
|--------|------|-------|
| 400 Regular | InterTight-Regular.ttf | About body paragraphs |
| 500 Medium | InterTight-Medium.ttf | Nav links |

Key properties:
- About body: `font-size: 18px`, `line-height: 1.7`, `letter-spacing: 0.01em`, `max-width: 48ch`
- Nav links: `font-size: 11px`, `letter-spacing: 0.12em`

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

The grid spans the full viewport. `5vw` padding-inline creates the left rail that every section aligns to. The wordmark in the nav aligns to this same left edge.

### Section Grid Assignments

**Hero:**
- Clock engine: `grid-column: 1 / 5`
- Headline (h1): `grid-column: 1 / 9`
- Registry tags: `grid-column: 9 / 13`

**Services:**
- Section label: `grid-column: 1 / -1`
- Service list: `grid-column: 1 / -1`
- Service items: flex, `justify-content: space-between` (number left, title right)

**Industries:**
- Section label: `grid-column: 1 / -1`
- Industry grid: `grid-column: 1 / -1`

**Work:**
- Section label: `grid-column: 1 / -1`
- Work subsections: `grid-column: 1 / -1`
- Work entries: `display: grid; grid-template-columns: 1fr auto` (client left, descriptor right)

**About:**
- Section label: `grid-column: 1 / -1`
- Body copy: `grid-column: 1 / 7`
- Locations block: `grid-column: 7 / 13; align-self: start`

**Contact:**
- Section label: `grid-column: 1 / -1`
- CTA h2: `grid-column: 1 / 6`
- Form: `grid-column: 7 / 13`

---

## SECTION-BY-SECTION SPEC

### 01 — HERO
- Full viewport height (`min-height: 100svh`)
- Content anchored to bottom (`display: grid; align-content: end`)
- Z-pattern: clocks top-left → headline dominant left → registry tags right
- Clocks: Vancouver and Bangkok live times, DM Mono Heavy, city labels in orange
- Headline: "There Are / **No** / Shortcuts." — "No" in orange, rest in deep ink
- Registry tags stacked vertically in right column: bold orange bracket + plain black description

### 02 — SERVICES (WHAT I DO)
- Service items: `display: flex; justify-content: space-between`
- Number (01–05) left in `rgba(10,10,10,0.35)` DM Mono
- Title right in Dharma Gothic ExBold
- Hover: border-bottom shifts to `rgba(10,10,10,0.5)` — no orange

### 03 — INDUSTRIES
- Dark background `#111111`
- Four columns at 1280px+, two at 768px, one on mobile
- Column labels in DM Mono, `rgba(255,255,255,0.5)`
- Discipline tags in Dharma Gothic, each on its own line via `display: block`
- HTML structure: `<div class="industry-group__tags"><span class="industry-tag">...</span></div>`

### 04 — SELECTED WORK
- Two subsections: Strategy & Standards and Operational Deployment
- Each entry: `display: grid; grid-template-columns: 1fr auto`
- Client name: Dharma Gothic 700, `clamp(1.5rem, 3vw, 3.5rem)`, left with overflow ellipsis
- Descriptor: DM Mono 500, 13px, `rgba(10,10,10,0.4)`, right-aligned, `white-space: nowrap`
- Subsection labels: DM Mono 700, 16px, `rgba(10,10,10,0.4)` — NOT orange

### 05 — ABOUT
- Body copy: Inter Tight 400, 18px, 1.7 leading — the only section using Inter Tight for body
- Right column contains three data rows in `.about-data-row` elements
- Data rows: `[YEARS: ACTIVE]` / `[CURRENT_LOCATIONS]` / `[BASE:] Vancouver, CA · [OPS:] Bangkok, TH`
- All registry tags same size and font — no inline style overrides
- Closing tags: `.about-locations > .grid-stage > #about > section`

### 06 — CONTACT
- Dark background `#111111`
- "Let's talk." in Dharma Gothic 900 at `var(--text-display-xl)`
- Form fields: borderless, bottom hairline only, dark background autofill suppressed
- Submit button: bordered, no fill, hover shifts border to `var(--text-main)` — no orange

---

## REGISTRY TAG FORMAT

The dossier data language used throughout the site. Must be consistent everywhere.

```html
<span class="t-registry"><strong>[BRACKET: KEY]</strong> Description text</span>
```

- `<strong>` wraps the bracket only — renders in bold orange
- Description text sits outside `<strong>` — renders in plain `#0A0A0A`
- `display: block` on `.t-registry` stacks them vertically
- `letter-spacing: 0.04em` — tight enough to read cleanly, not spread out

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

## JAVASCRIPT — main.js

Two functions active:

**1. Clock engine**
- IDs: `clock-van` (America/Vancouver) and `clock-bkk` (Asia/Bangkok)
- Updates every 1000ms
- DAY/NIGHT status based on hours 6-20
- HTML IDs must match exactly: `id="clock-van"` and `id="clock-bkk"`

**2. Scroll observer**
- IntersectionObserver adds `.is-visible` class to sections at 15% threshold
- Nav gets `.is-dark` class when over `#industries` or `#contact`

---

## WHAT IS NOT DONE YET

### High Priority
- **Mobile layout** — not started. Requires a dedicated design pass. Full-screen nav overlay preferred over hamburger dropdown. Every section needs mobile-specific column assignments.
- **Scroll animations** — JS observer is wired but animations are disabled (`opacity: 1; transform: none` on `.section`). Need to restore entrance animations.
- **Form functionality** — contact form currently does nothing on submit.

### Medium Priority
- **Favicon** — 404 error in console. Add `favicon.ico` to site root.
- **Hero vertical anchoring** — headline should sit at bottom of viewport stage. CSS `align-content: end` on `#hero` is the correct approach but needs verification after latest push.
- **Hero registry tag wrapping** — "CORPORATE STRATEGY" sometimes wraps to two lines. Shortened to "CORP. STRATEGY" and "COMPLIANCE" as workaround.

### Low Priority
- **Font performance** — all fonts served as TTF. Should convert to WOFF2 for production.
- **Meta tags** — no OG tags, no description meta, no Twitter card.

---

## WHAT HAS BEEN TRIED AND REJECTED

- **Koyo watermark numbers** — removed. Client did not want them.
- **Vancouver & Bangkok as display text in About** — removed. Replaced with dossier data rows.
- **08 as large Dharma Gothic number in About** — tried and rejected. Looked out of place.
- **Orange on section labels** — rejected. Violates the orange restriction.
- **DM Mono for body copy** — rejected. Too laboured at paragraph length. Inter Tight used instead.
- **Three-column sub-grid for hero registry tags** — tried. Tags were too narrow and wrapped. Reverted to single column stack at `grid-column: 9 / 13`.
- **Clock engine in About section** — tried. Moved back to Hero where it belongs.

---

## DEPLOYMENT

1. Edit files locally
2. Push to GitHub main branch
3. Site auto-deploys
4. Hard refresh browser: Ctrl+Shift+R
5. If fonts appear wrong after deploy — check Network tab in dev tools filtered for font name to confirm files are being served

---

## SESSION HANDOFF PROTOCOL

At the start of every new session:
1. Read this document completely before touching any code
2. Ask for current screenshots before making any changes
3. Confirm which file is being edited before writing any diffs
4. CSS pass first, HTML pass second, never combined
5. Send files back for review before pushing to GitHub
