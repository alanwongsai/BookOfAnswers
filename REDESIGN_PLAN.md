# The Book of Answers — Redesign Plan
## Liquid Glass Oracle Interface

---

## 1. CURRENT STATE AUDIT

### What exists
- Single-file PWA (`index.html`, ~3,062 lines): all HTML, CSS, JS embedded
- **Layout**: 3-column CSS Grid (`book-tabs | oracle-stage | action-dock`) with a `title-block` spanning the full top
- **Interaction**: Card flip reveals the answer — front face fades out, back face fades in
- **Background**: `.cosmos` fixed layer (radial gradients + star dots) + `.ambient-orbit` (concentric dashed circles)
- **Glass**: Applied to `.card` (backdrop-filter: blur 22px) and `.control-group` (blur 14px) — fairly standard glassmorphism
- **Motion**: `glowBreath` (7s pulse), `slowTurn` (34–48s rotation), `starDrift` (18s translate)
- **Typography**: Cinzel (display), Cormorant Garamond (answers), Inter (UI), Noto Serif SC (Chinese)
- **Data**: 900 answers across 3 books × 2 languages, stored entirely in JS

### What must NOT change
- All JS logic: `BOOKS`, `state`, `handleAsk()`, `flipToAnswer()`, bilingual `render()`
- Three categories: `classic`, `audit`, `relationship`
- Language toggle (EN ↔ ZH) and theme toggle (dark ↔ light)
- Answer reveal interaction (tap → reveal → tap → reset)
- Answer count display, PWA/service worker, accessibility (aria-live, keyboard)
- All 900 answer strings (untouched)

### Core problems to fix
1. **Composition is a webpage, not a scene** — stacked regions feel like a typical app form
2. **Glass is applied uniformly** — card, control group, and button share the same frosted treatment
3. **Layout hierarchy is flat** — tabs on the left, card in center, button on the right creates lateral visual weight with no clear focal depth
4. **The card feels like a card** — it should feel like a portal, a chamber, an oracle surface
5. **Controls are incidental** — the category tabs and action button feel like UI scaffolding, not inhabitants of the world
6. **The title sits above the scene** — it should be part of the scene, breathe with it

---

## 2. NEW SCREEN ARCHITECTURE

### Design concept: The Oracle Chamber

The entire interface is reorganized around a single concept: **you are standing before a cosmic answer portal**. Everything in the layout serves that one moment. The screen is a *scene*, not a form.

### New vertical composition (mobile-first, single column):

```
┌──────────────────────────────────────────────────┐
│  [utility-rail]  Lang ·  Theme            top     │  ← compact, pill, centered or right-aligned
├──────────────────────────────────────────────────┤
│                                                   │
│          THE BOOK OF ANSWERS              hero    │  ← display title, large, luminous
│                                                   │
│         ━━━━━ eyebrow line ━━━━━                  │  ← A quiet answer awaits
│                                                   │
│  ┌─── [ Classic ]──[ Audit Life ]──[ Heart ] ───┐ │  ← segmented pill control
│  └───────────────────────────────────────────────┘ │
│                                                   │
│  ╔═══════════════════════════════════════════════╗ │
│  ║                                               ║ │
│  ║         ✦                                     ║ │
│  ║                                               ║ │  ← ORACLE CHAMBER
│  ║   Hold your question in mind,                 ║ │    = the single glass hero object
│  ║   then reveal your answer.                    ║ │
│  ║                                               ║ │
│  ║         ─────────                             ║ │
│  ║         tap to reveal                         ║ │
│  ║                                               ║ │
│  ╚═══════════════════════════════════════════════╝ │
│                                                   │
│         ┌──────────────────────────────┐          │
│         │     ✦   Ask the Book         │          │  ← sculpted pill button
│         └──────────────────────────────┘          │
│                                                   │
│    helper text · answer count                     │  ← small, faint
└──────────────────────────────────────────────────┘
```

### Desktop adaptation (≥ 940px):

On desktop, the composition does NOT revert to the old 3-column layout. Instead, the center column **widens and breathes** — the oracle chamber becomes larger (up to ~600px wide), the title gets more air, and the segmented control scales up. The layout remains centered and vertical, but with more horizontal padding creating a **pillar-like visual column** framed by atmospheric depth.

Optional desktop-only flourish: subtle atmospheric side-glows or ring ornaments can flank the chamber on large screens without adding information content.

---

## 3. DESIGN SYSTEM OVERHAUL

### 3.1 CSS Custom Properties — new tokens

Keep all existing semantic tokens (`--bg`, `--text`, `--accent`, etc.) but add a new layer:

```css
/* Liquid Glass material system */
--glass-primary-fill:    rgba(14, 22, 40, 0.52);      /* oracle chamber */
--glass-primary-blur:    blur(28px) saturate(170%) brightness(1.06);
--glass-primary-edge:    rgba(220, 240, 255, 0.22);
--glass-primary-shine:   rgba(255, 255, 255, 0.16);
--glass-primary-inner:   rgba(255, 255, 255, 0.028);

--glass-ctrl-fill:       rgba(12, 18, 32, 0.44);      /* segmented control */
--glass-ctrl-blur:       blur(16px) saturate(150%);
--glass-ctrl-edge:       rgba(220, 240, 255, 0.18);

--glass-btn-fill:        /* accent gradient */         /* ask button */
--glass-btn-blur:        blur(12px);

/* Spatial depth */
--depth-chamber:   0 40px 120px rgba(0,0,0,0.54), 0 0 80px var(--mood);
--depth-button:    0 20px 60px var(--mood), inset 0 1px 0 rgba(255,255,255,0.64);
--depth-ctrl:      0 8px 28px rgba(0,0,0,0.22), inset 0 1px 0 var(--glass-shine);

/* Specular system */
--specular-top:    inset 0 1px 0 rgba(255,255,255,0.18);
--specular-left:   inset 1px 0 0 rgba(255,255,255,0.08);

/* Motion */
--ease-liquid:     cubic-bezier(0.18, 0.86, 0.18, 1);     /* keep */
--ease-emerge:     cubic-bezier(0.32, 0.72, 0.0, 1.0);    /* new: portal reveal */
--ease-settle:     cubic-bezier(0.46, 0.03, 0.52, 0.96);  /* new: gentle settle */

/* Radii */
--r-chamber:   20px;   /* oracle chamber: large-radius rounded rect */
--r-button:    50px;   /* ask button: full pill */
--r-ctrl:      50px;   /* category control: full pill */
--r-utility:   50px;   /* top bar: capsule */
--r-tab:       50px;   /* individual tab: pill within pill */
```

### 3.2 Category mood tokens (updated)

**Classic** — unchanged from current (cool indigo / silver)
```
--mood: rgba(111, 160, 255, 0.34)
--bg: #050711
```

**Audit Life** — sharper, graphite-blue, more composed
```
--bg: #040810
--mood: rgba(100, 165, 200, 0.26)    /* slightly less warm */
--accent: #a2cfe0
```

**Heart** — deeper plum, intimate, warmer glow
```
--bg: #070511
--bg-soft: #130820
--mood: rgba(178, 98, 165, 0.32)
--mood-2: rgba(108, 78, 190, 0.14)
--accent: #d4a8e8
```

### 3.3 Typography system (refined)

**Display (title):**
- Font: Cinzel 500 (EN) / Noto Serif SC 700 (ZH)
- Size: fluid `clamp(38px, 5.5vw, 64px)` — scales from mobile to desktop
- Letter-spacing: `0.04em` (EN), `0.06em` (ZH)
- Color: `var(--text)` with `text-shadow: 0 0 60px var(--mood)`
- Treatment: luminous, not oversized — the chamber is the hero, not the title

**Answer text:**
- Font: Cormorant Garamond 500 italic (EN) / Noto Serif SC (ZH)
- Size: fluid `clamp(26px, 4.5vw, 42px)`
- Tight max-width: `16ch` (EN), `10em` (ZH)
- Color: `var(--accent-soft)` — slightly luminous
- Text-shadow: soft glow

**Category labels:**
- Font: Inter 600 — clean and legible
- Size: 12px uppercase with `0.08em` tracking (EN), 13px no-uppercase (ZH)

**Eyebrow:**
- Font: Inter 500
- Size: 11px
- Color: `var(--accent)` at 80% opacity
- Letter-spacing: `0.12em`
- Treatment: no uppercase — too formal

**UI labels (hint, count, helper):**
- Font: Inter 400–500
- Size: 11–12px
- Color: `var(--text-faint)`

---

## 4. COMPONENT REDESIGN SPECIFICATIONS

### 4.1 Background layer (`.cosmos` — MODIFIED)

**Keep:** the layered radial gradient system, star dots (`::before`), `starDrift` animation
**Change:**
- Add a stronger central bloom: `radial-gradient(ellipse at 50% 62%, var(--mood) 0, transparent 38%)` — this creates a soft halo centered behind the oracle chamber
- Remove the hard crosshair lines (`::after` gradient hairlines) — too geometric, not atmospheric
- Add a very faint noise texture via SVG filter or CSS grain (optional — only if lightweight)
- Increase the depth contrast: `--bg-deep: #010208` (darker)

### 4.2 Ambient orbit (`.ambient-orbit` — MODIFIED)

**Keep:** the concentric circles concept — it creates spatial depth
**Change:**
- Make the outer ring larger: `min(88vw, 800px)` — it should feel like it wraps the entire experience
- Add a 4th ring that is barely visible: `opacity: 0.18` — creates additional depth layers
- Slow down rotation: `slowTurn` from 48s → 72s on the outer rings
- Add `--mood`-colored glow to the main ring: `box-shadow: 0 0 60px var(--mood), inset 0 0 30px rgba(255,255,255,0.015)`

### 4.3 Utility rail (top controls — REDESIGNED)

**New structure:**
```html
<header class="utility-rail">
  <div class="utility-group">
    <button class="util-btn" id="theme-toggle">☀ Day</button>
    <div class="util-separator"></div>
    <button class="util-btn" id="lang-toggle">中文</button>
  </div>
</header>
```

**Visual:**
- Single pill container: `border-radius: var(--r-utility)` — full capsule
- Width: `fit-content`, centered or right-aligned depending on viewport
- Height: `38px`
- Background: `var(--glass-ctrl-fill)` with `backdrop-filter: var(--glass-ctrl-blur)`
- Border: `1px solid var(--glass-ctrl-edge)`
- Box-shadow: `var(--depth-ctrl)`
- Specular: `inset 0 1px 0 var(--specular-top)`
- Individual buttons: pill shape within the pill, `border-radius: 50px`
- Active state: background brightens with accent color — not a separate floating element
- NO brand mark in the header — the title IS the brand
- Separator between buttons: `1px solid var(--line)` at 50% height

### 4.4 Title block (MODIFIED)

**Keep:** the title text, eyebrow text, transition on book change
**Change:**
- Position: moved up within the centered column — title above the category control
- Eyebrow: moved to sit between title and category control, not above title
- Add a very subtle rule below the title: `width: 1px; height: 28px` vertical divider or a 40px horizontal rule
- Spacing below title → eyebrow → category control: deliberate and airy (`28px + 8px + 24px`)
- Transition on book switch: title fades down, new title fades up (keep existing `.is-changing` logic)

### 4.5 Category selector (REDESIGNED — from vertical tabs to horizontal pill control)

**New structure:**
```html
<nav class="category-control" aria-label="Book category">
  <button class="cat-tab active" data-book="classic" aria-pressed="true">Classic</button>
  <button class="cat-tab" data-book="audit" aria-pressed="false">Audit Life</button>
  <button class="cat-tab" data-book="relationship" aria-pressed="false">Heart</button>
</nav>
```

**Visual:**
- Container: `border-radius: var(--r-ctrl)` — full pill
- Background: `var(--glass-ctrl-fill)` with subtle blur
- Border: `1px solid var(--glass-ctrl-edge)`
- Padding: `4px` inset (tabs float within the pill)
- Individual tabs: `border-radius: var(--r-tab)` — each tab is also a pill
- Inactive tabs: transparent background, `var(--text-faint)` color
- Active tab: `background: rgba(255,255,255,0.10)`, `border: 1px solid var(--line-strong)`, `color: var(--text)`, subtle `box-shadow: var(--depth-ctrl)`, soft glow via `text-shadow`
- Transition: active state slides/fades in 0.28s — no hard jump
- Width: `fit-content`, centered, max ~420px

### 4.6 Oracle Chamber (`.card` — REDESIGNED)

This is the **single hero glass object**. Everything else serves it.

**Geometry:**
- Shape: `border-radius: var(--r-chamber)` — `20px` large rounded rect, NOT a card-like `8px`
- Size: `width: min(92vw, 560px)`, `min-height: 400px` — wider, more portal-like
- On mobile: `min(100%, 360px)` × `360px`
- Aspect ratio approach: consider `aspect-ratio: 3/4` on mobile → `4/3` on desktop landscape

**Glass material:**
- `background: var(--glass-primary-fill)` + layered internal gradients:
  - Top specular: `radial-gradient(ellipse at 50% -8%, rgba(255,255,255,0.22), transparent 42%)` — light source from above
  - Body mood: `radial-gradient(circle at 50% 80%, var(--mood), transparent 55%)`
  - Base fill: `var(--glass-primary-fill)`
- `backdrop-filter: var(--glass-primary-blur)` — blur 28px (more than current 22px)
- Border: `1px solid var(--glass-primary-edge)`
- Box-shadow: `var(--depth-chamber)` — strong, layered, with mood glow
- Specular edge: `inset 0 1px 0 var(--glass-primary-shine)` — top edge light
- Inner frame: the `::after` inset border is kept but with `border-radius: 16px` (matching outer radius – 4px)

**Shimmer on hover/flip (`.card::before`):**
- Keep the light sweep, but make it slower and more restrained: `1.4s` with `--ease-liquid`
- Reduce intensity: `rgba(255,255,255,0.16)` → down from 0.20
- This should feel like light catching the surface, not a flashy sweep

**Content alignment:**
- Front face: center-aligned, more vertical breathing room
- Back face: center-aligned, answer text as the single focal element
- Remove the inner ornament from the back face — the answer text IS the ornament
- Keep the dividers but make them shorter: `50px` not `70px`

### 4.7 Card front face (MODIFIED)

- Ornament: keep `✦` but increase to `32px`, remove the circle border around it — let it float freely with glow
- Prompt text: size up slightly, more vertical whitespace
- Hint text: `var(--text-faint)`, no uppercase, lowercase italic treatment
- Dividers: keep but refine (shorter, more delicate)

### 4.8 Card back face / Answer display (MODIFIED)

- Answer text: centered, large, luminous — the ONLY element that matters when revealed
- Below answer: small `Answer / 答语` label in `var(--text-faint)` at 11px
- Count: `1 of 300` even smaller, `var(--text-faint)`, `font-size: 10px`
- Top and bottom: flanking dividers — thin gradient lines
- No ornament on back face — purity of the answer

### 4.9 Ask / Reveal button (REDESIGNED)

**New shape:** full pill — `border-radius: var(--r-button)` (50px)
**Size:** `min-height: 56px`, `padding: 0 40px`, `width: fit-content`, centered

**Visual:**
- Background: accent gradient — `radial-gradient(circle at 50% 0%, rgba(255,255,255,0.55), transparent 36%), linear-gradient(145deg, var(--accent-soft), var(--accent) 55%, var(--accent-deep))`
- Border: `1px solid rgba(255,255,255,0.28)` — bright rim
- Box-shadow: `var(--depth-button)` — strong glow below
- Specular crown: `inset 0 1px 0 rgba(255,255,255,0.64)` — bright top edge
- Color: `var(--button-text)` — dark text for legibility on light accent fill

**Label:** `✦ Ask the Book` — include the ornament character as part of the label (adds tactile quality)
- Font: Inter 700 (not 800 — less aggressive), `font-size: 13px`, letter-spacing `0.08em`, uppercase
- On reveal state: label changes to `Ask Again`

**Hover:**
- `translateY(-4px)` (slightly more lift than current `-3px`)
- Light sweep `::before` — same treatment as chamber but faster: `0.7s`
- Glow intensifies: `box-shadow: 0 28px 72px var(--mood)`

**Pressed:**
- `translateY(-1px) scale(0.978)` — tactile push

### 4.10 Helper text and answer count

**Helper text:**
- Placed below the Ask button, centered
- `font-size: 12px`, `color: var(--text-faint)`, `line-height: 1.6`
- Visible on desktop, hidden on small mobile (`display: none` at < 480px)
- Text: `"Let the question settle. When the surface feels still, ask once."` (keep)

**Answer count:**
- Displayed only when flipped (answer revealed)
- Below the answer label
- `font-size: 10px`, `var(--text-faint)`, letter-spacing `0.08em`
- Fades in with the answer text

### 4.11 Footer

- Remove. The footer adds nothing to this experience. The brand identity lives in the title.
- OR: reduce to a single `aria-label` element that is visually hidden but present for accessibility

---

## 5. ANIMATION AND MOTION SYSTEM

### 5.1 Ambient animations (always running)

| Name | Target | Duration | Effect |
|------|--------|----------|--------|
| `glowBreath` | `.oracle-stage::before` ring, `.ornament` | 7s / 6s | Soft opacity + scale pulse |
| `slowTurn` | ambient orbit rings | 72s outer / 48s inner | Slow rotation |
| `starDrift` | `.cosmos::before` | 22s (slow it slightly) | Gentle translate |
| `chamberShimmer` | NEW — faint light sweep on chamber | 12s, loop | Very slow left→right light movement at very low opacity |

### 5.2 Answer reveal transition (REDESIGNED)

**Current:** card face crossfades with blur (0.5s). Functional but forgettable.

**New concept:** Energy gathers before the portal opens.

**Phase 1 — Gather (on tap):** 150ms
- The chamber border brightens: `border-color` transitions to `var(--line-strong)`
- The ambient glow on the stage ring pulses once: `opacity: 1, scale: 1.04`
- Button scale: very slight `0.97` press

**Phase 2 — Open (portal activates):** 400ms with `--ease-emerge`
- Front face: fades out downward (same as current)
- Back face: rises from center with a soft bloom — `opacity: 0→1`, `translateY(8px)→0`, `filter: blur(4px)→blur(0)`
- Chamber: brief extra glow `box-shadow` intensifies then settles
- Mood bloom: the background `.cosmos` glow briefly increases then settles

**Phase 3 — Answer appears:** 200ms staggered after Phase 2
- Answer text fades in with a soft upward drift
- Dividers fade in slightly before the text

**Total reveal duration:** ~750ms (slightly slower and more deliberate than current 500ms)

### 5.3 Category transition (MODIFIED)

- Background color transition: already handled by CSS variable system
- Chamber: brief `opacity: 0.9 → 1` flash (imperceptible but adds weight)
- Category control: selected tab pill slides with `0.28s` ease
- Eyebrow text: fade out/in on category change (same pattern as title)
- Add a very subtle color temperature shift to the overall stage — the mood bloom changes hue with `transition: background 0.8s`

### 5.4 Theme toggle transition

- Keep: `transition: background 0.7s var(--ease-liquid), color 0.5s ease`
- Add: `transition` on the glass surfaces themselves — the blur depth and opacity smoothly adjust between dark and light glass formulas

### 5.5 Hover states

**Oracle chamber hover:**
- Lift: `translateY(-4px)` (from current `-5px`, slightly more restrained)
- Border brightens
- Shimmer sweep activates
- Glow deepens on stage ring

**Ask button hover:**
- Lift: `translateY(-4px)`
- Glow intensifies
- Light sweep

**Category tab hover:**
- Background: `rgba(255,255,255,0.06)` — very subtle
- No transform (tabs are inline, movement feels wrong)
- Color: brightens toward `var(--text-muted)`

---

## 6. RESPONSIVE BEHAVIOR

### Mobile (< 480px)
- Oracle chamber: `width: 100%`, `border-radius: 16px` (slightly less than desktop)
- Title: `clamp(32px, 8vw, 44px)`
- Category control: full width pill, tabs equally distributed
- Ask button: `width: min(100%, 280px)`, centered
- Helper text: hidden
- Utility rail: compact, right-aligned or centered

### Tablet (480px – 940px)
- Oracle chamber: `min(88vw, 480px)`
- Title: `clamp(40px, 6vw, 56px)`
- Category control: `fit-content`, centered
- Slightly more breathing room between elements

### Desktop (> 940px)
- Oracle chamber: `min(72vw, 580px)` — let it breathe on large screens
- Title: `clamp(52px, 5.5vw, 68px)`
- Max content width: `640px` — the single column feels intentionally narrow, like a portal, not a dashboard
- More vertical breathing room between all elements

### Landscape / short screens (height < 720px)
- Reduce vertical gaps by ~30%
- Title: reduce to smaller scale
- Chamber: reduce `min-height` to `320px`

---

## 7. LIGHT THEME TREATMENT

Light theme is currently well-handled. The redesign should:
- Adjust glass fill to a cleaner `rgba(255,255,255,0.55)` for the chamber
- Reduce backdrop blur slightly (20px vs 28px) — lighter materials need less blur
- Ensure the category pill control is legible (light glass needs a more defined border)
- The cosmic background becomes a soft blue-white gradient — not fully white
- Ambient rings remain but more faint (`opacity: 0.3`)

---

## 8. IMPLEMENTATION SEQUENCE

### Phase 0 — Prep (no visual changes)
- [ ] Create a backup copy: `index.backup.html`
- [ ] Read the full current `index.html` into memory
- [ ] Identify all existing CSS class names that will be renamed

### Phase 1 — CSS Architecture Rebuild
- [ ] Add new CSS custom properties (glass system, spatial depth, radii, new easings)
- [ ] Update `[data-book]` theme variables (Heart gets deeper plum, Audit gets graphite-blue)
- [ ] Update `[data-theme="light"]` variables
- [ ] Update `:root` base variables
- [ ] Remove old glassmorphism variable duplicates

### Phase 2 — HTML Structure Refactor
- [ ] Replace `.top-bar` with `.utility-rail` (centered capsule pill)
- [ ] Remove `.brand-mark` from header
- [ ] Restructure `.scene-grid` → remove 3-column grid, make single centered column `.oracle-column`
- [ ] Move `.title-block` into the column (keep but rename classes)
- [ ] Replace `.book-tabs` with `.category-control` (horizontal pill segmented control)
- [ ] Rename `.oracle-stage` wrapper (keep the atmospheric rings)
- [ ] Keep `.card-scene` / `.card` / `.card-face` structure — only visual changes needed
- [ ] Move `.ask-btn` inside the column, centered below the chamber
- [ ] Add `.answer-meta` div inside `.card-back` for count + label
- [ ] Remove `.action-dock` (helper copy moves inline below button)
- [ ] Simplify `.footer` (visually hide or remove entirely)

### Phase 3 — Background & Atmosphere
- [ ] Update `.cosmos` gradients (stronger central bloom behind chamber position)
- [ ] Remove crosshair lines from `.cosmos::after`
- [ ] Update `.ambient-orbit` (larger, slower, slight glow)
- [ ] Refine `starDrift` animation timing

### Phase 4 — Oracle Chamber Styling
- [ ] Redesign `.card` (larger radius, stronger glass material, new shadow system)
- [ ] Update `.card::before` shimmer (slower, more restrained)
- [ ] Update `.card::after` inner frame (matching radius)
- [ ] Redesign `.card-face` padding and alignment
- [ ] Redesign `.ornament` (floating, no circle border, larger glow)
- [ ] Redesign `.answer-text` (size, color, spacing)
- [ ] Add `.answer-meta` styles

### Phase 5 — Controls & Button
- [ ] Style `.utility-rail` and `.util-btn`
- [ ] Style `.category-control` and `.cat-tab`
- [ ] Redesign `.ask-btn` as full pill, new shadow, label with ornament
- [ ] Style `.helper-copy` (centered, below button)

### Phase 6 — Animation System
- [ ] Add `chamberShimmer` keyframe
- [ ] Update `glowBreath` (keep but fine-tune)
- [ ] Slow down `starDrift` to 22s
- [ ] Update `slowTurn` to 72s for outer ring
- [ ] Redesign answer reveal transition in JS (`handleAsk`, `flipToAnswer`) — add gather phase
- [ ] Update category transition in JS (atmosphere pulse)
- [ ] Add `--ease-emerge` and `--ease-settle` and apply

### Phase 7 — Typography Fine-Tuning
- [ ] Apply fluid `clamp()` to `.book-title`
- [ ] Apply letter-spacing to category tabs
- [ ] Refine `.card-prompt` sizing
- [ ] Refine `.answer-text` sizing (fluid scale)
- [ ] Review Chinese typography — adjust `font-size` and `line-height` for ZH in new layout

### Phase 8 — Responsive Polish
- [ ] Mobile < 480px: chamber, title, button sizing
- [ ] Tablet 480–940px: intermediate sizes
- [ ] Desktop > 940px: wide breathing room, larger chamber
- [ ] Short landscape: compressed vertical spacing
- [ ] Test `.control-group` → `.utility-rail` at all sizes

### Phase 9 — Accessibility & QA
- [ ] Verify all `aria-*` attributes preserved (aria-live, aria-pressed, aria-label)
- [ ] Keyboard navigation: Enter/Space on card still works
- [ ] Focus styles: update to match new pill/radius system
- [ ] `prefers-reduced-motion`: all animations disabled
- [ ] Color contrast: answer text on glass background (WCAG AA minimum)
- [ ] Light theme contrast check

### Phase 10 — Final Polish
- [ ] Remove any dead CSS rules
- [ ] Remove visual effects that exist only to show off technique
- [ ] Screenshot review — does it feel like an oracle chamber?
- [ ] Test both languages (EN/ZH) in both themes (dark/light) across all 3 categories

---

## 9. THINGS TO EXPLICITLY AVOID

1. **Do not** apply glass blur to the background, the cosmos, or the `.ambient-orbit`
2. **Do not** create more than 2 glass hero surfaces (chamber + button; category control is glass-lite)
3. **Do not** add neon colors or high-saturation accents
4. **Do not** add particle explosions, energy orbs, or gaming-style effects
5. **Do not** add more overlay layers — the cosmos already has 3; that's enough
6. **Do not** use `clip-path` for fancy shapes — rounded rects are the language
7. **Do not** animate the title text with letter-by-letter reveals — too decorative
8. **Do not** change the answer data strings
9. **Do not** break the PWA / service worker
10. **Do not** add any new JavaScript libraries or external dependencies

---

## 10. SUCCESS CRITERIA CHECKLIST

When the redesign is complete, it should pass these tests:

- [ ] Opening the page feels like entering a chamber, not loading an app
- [ ] The oracle chamber is unmistakably the center of attention
- [ ] The category selector looks native to the world — not a default UI widget
- [ ] The Ask button feels sculpted and premium — not a standard button
- [ ] There is only one major glass hero surface on screen at a time
- [ ] The background has atmospheric depth without visual noise
- [ ] The title and controls support the scene — they don't compete with it
- [ ] On mobile, the layout feels intentional and spacious, not compressed
- [ ] Switching categories produces a subtle, perceptible mood shift
- [ ] The answer reveal feels like something happening — energy, weight, presence
- [ ] No visual effect exists without purpose
- [ ] Chinese and English both feel at home in the typography system
- [ ] Light mode is beautiful and readable, not just "inverted dark"
- [ ] The entire experience is calmer and more confident than the original

---

## 11. DESIGN DECISIONS — RATIONALE

**Why remove the 3-column layout?**
The sidebar tabs and action dock create lateral scanning — your eye moves left-right to gather information. An oracle interface should create vertical gravity, pulling you toward the center. Centering everything creates a ceremonial quality that the 3-column layout explicitly destroys.

**Why make the chamber wider?**
At `390px × 472px` the card currently feels constrained. Widening to `560px × ~440px` (landscape-leaning) makes it feel more like a portal slab and less like a physical card. The answer text has more room to breathe. The proportions become more cinematic.

**Why remove the circle border from the ornament?**
The circle border creates a contained, safe, icon-like quality. Removing it allows the `✦` to simply float — uncontained, luminous, cosmic. It becomes ambient rather than decorative.

**Why move to a horizontal category pill?**
Vertical tabs on the left feel like a sidebar navigation — too document-like. A horizontal pill control centered above the chamber feels like a single choice being made in context. It's more focused, more intentional. And it frees the layout from the 3-column constraint.

**Why full-pill button?**
The current `border-radius: 8px` button is the same radius as every other element. A full pill (50px radius) makes the button unmistakably different — it's a call-to-action, a singular object. It reads as "the thing you press" without confusion.

**Why only blur the chamber and button (not everything)?**
When every surface has backdrop-filter, the eye stops assigning meaning to the blur. It becomes visual noise. Reserving blur for the chamber creates a clear material hierarchy: the glass objects are portals; everything else is the world around them.

**Why extend the reveal animation to ~750ms?**
The current 500ms flip is fast enough to feel functional but not long enough to feel significant. An oracle answer deserves weight. 750ms with a gather phase (150ms) + portal open (400ms) + answer appear (200ms) gives the moment ceremony without making it sluggish.

---

*Plan version 1.0 — ready for implementation*
