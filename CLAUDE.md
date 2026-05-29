# CLAUDE.md

Guidance for AI assistants (and humans) working in this repo.

## What this is

**The Book of Answers** — a tiny, dependency-free PWA. You hold a question in
mind, tap the page, and receive one random line. No backend, no AI, no
analytics. It is hosted as a static site on GitHub Pages.

It is intentionally small and calm. Resist the urge to add features, frameworks,
or build steps. The whole point is that it stays a single static folder you can
open by double-clicking `index.html`.

## Architecture

```
index.html          App shell. Loads fonts, styles, the three data files, then app.js.
styles.css          All visual design. Single stylesheet, no preprocessor.
app.js              All interaction logic + data validation. Plain ES, no modules/build.
data/
  classic.js        window.BOOKS.classic   — { en, zh } each with an answers[] array
  audit.js          window.BOOKS.audit
  relationship.js   window.BOOKS.relationship
manifest.json       PWA metadata.
sw.js               Service worker. Caches assets for offline use.
icon-192/512.png    App icons.
```

Data and logic are separate: each `data/*.js` file registers one entry on the
global `window.BOOKS`. `app.js` reads `window.BOOKS`, validates it
(`validateBooksData`), and drives the UI from a small `state` object
(`theme`, `lang`, `book`, `flipped`, `lastIdx`).

There is **no framework and no build**. Edit files directly; reload the browser.

## Design language — "Paper & Ink"

The visual motif is a warm sheet of paper read by hand, with a single drop of
vermilion (朱砂). Keep changes within this language:

- **Ground / page**: warm paper (`--paper`, `--card`). Day = bright paper,
  Night (`[data-theme="dark"]`) = a lamp-lit dark page. Day is the default.
- **Type**: ink-set serif for everything expressive — title, prompt, answer
  (`--font-serif` = Cormorant Garamond + Noto Serif SC). A plain system sans
  (`--font-ui`) only for tiny labels (eyebrow, hint, tabs, counts). Chinese
  uses `--font-zh` (Noto Serif SC) via `:lang(zh-Hans)` rules.
- **Accent**: vermilion `--seal` is the *only* color. Used sparingly — the ✦
  ornament, the active-tab underline, the "Answer" label, and the corner seal
  that stamps in on reveal. Do not introduce a second accent color.
- **Each book** retints the paper and seal slightly (`[data-book="..."]`):
  classic = cream, audit = cooler working-paper grey, relationship = warm blush.
- **Motion is quiet.** A soft page-lift, a cross-fade reveal, and the seal
  "stamp" keyframe. No glow, no glass, no parallax. Respect
  `prefers-reduced-motion` (already handled at the bottom of `styles.css`).

All colors/fonts/radii live as CSS custom properties at the top of
`styles.css`. Change tokens there rather than hardcoding values in components.

> History: an earlier "liquid glass / oracle" direction was replaced by Paper &
> Ink in the v1.5 round. If you find references to glass, gold, or a cosmos
> background anywhere, they are stale.

## Editing answers

Each book has an `en` and a `zh` section, each with an `answers[]` array.

- **The `en` and `zh` arrays in a book MUST stay the same length** — the
  language toggle maps by index, and `validateBooksData` will disable the app if
  they mismatch. When you add/remove a line, do it in both languages.
- Keep each book's voice distinct (this is intentional):
  - **classic** — oracular, calm, concise. "Yes, but keep it simple."
  - **audit** — dry insider humor for auditors. Funny, relatable.
  - **relationship** — honest and tender, occasionally blunt. Avoid preachy or
    over-long lines; trim to a single clear breath.
- Answers should be short — they render large. One line, ideally < ~60 chars EN.

## Constraints & gotchas

- **Bump the cache when you change assets.** `sw.js` serves non-navigation
  requests cache-first. After editing `styles.css` / `app.js` / `data/*`, bump
  `CACHE` (e.g. `book-of-answers-v10` → `v11`) or returning visitors keep the
  old version offline.
- Keep `index.html`'s `data-theme` default, the `theme-color` meta, and
  `manifest.json`'s colors in sync with the design tokens.
- No external requests except the Google Fonts link in `index.html`. Keep it
  that way (offline-friendly, private).
- Accessibility is built in (aria-live answer, keyboard reveal, focus-visible).
  Preserve it.

## Previewing locally

```
python3 -m http.server 8766    # then open http://localhost:8766
```

(There is a `.claude/launch.json` config named `book-of-answers` for the
preview tooling.)

## Future direction (context, not a task)

The longer-term idea is to fold this into a small personal companion app
alongside two sibling ideas: a **daily fortune (今日运势)** and a **life
countdown (人生倒计时)**. The unifying spirit is "a quiet thing you open once a
day." When making changes now, prefer choices that would survive that merge:
keep content as data, keep the design language token-driven and reusable, and
don't entangle answer logic with book-specific assumptions.
