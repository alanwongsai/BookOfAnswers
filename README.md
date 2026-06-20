# 📖 The Book of Answers · 答案之书

Ask a question, tap the page, receive one quiet line. A minimal, dependency-free
oracle in the spirit of *The Book of Answers* — no AI, no algorithm, just a flip
and a sentence that might be exactly what you needed to hear.

**Live:** https://alanwongsai.github.io/BookOfAnswers/

Design language: **Fate Thread Glass** — a restrained dark "thread of fate"
register adapted from The Norns: near-black ground, silver linework, scarce gold
accents, serif inscription type, and a translucent glass answer card. Dark is the
default; Day is a cool silver-glass variant, not parchment.

---

## 介绍 · What it is

Three "books", each with answers in **English and 简体中文**. The whole point is
that whatever you are turning over in your mind, the line you draw will feel like
it means something.

| Book | 书 | Theme | Voice | Lines |
|------|-----|-------|-------|-------|
| **Classic** | 经典 | Life & decisions | Oracular, calm | 300 |
| **Audit Life** | 审计人生 | Work & audit dilemmas | Dry, wise, real | 200 |
| **Heart** | 心语 | Relationships & feelings | Honest, tender | 200 |

Each book keeps its own ornament (✦ / § / ♡), while the visual system stays in
the same gold/silver fate-thread register.

---

## 文件架构 · Project structure

```
index.html          App shell — loads fonts, styles, the data files, then app.js
styles.css          All visual design (the "Fate Thread Glass" language). One stylesheet.
app.js              Interaction logic + data validation. Plain JS, no build.
data/
  classic.js        window.BOOKS.classic       — { en, zh }, each an answers[] array
  audit.js          window.BOOKS.audit
  relationship.js   window.BOOKS.relationship
manifest.json       PWA metadata
sw.js               Service worker (offline cache)
icon-192/512.png    App icons
CLAUDE.md           Guide for AI assistants / contributors (design rules, gotchas)
```

Data and logic are separated: each `data/*.js` registers one entry on
`window.BOOKS`. `app.js` validates it and drives the UI from a small `state`
(`theme`, `lang`, `book`, `flipped`). No framework, no `package.json`, no build
step — open `index.html` and it works.

---

## 使用 · Run it locally

It is a static site, so any static server works:

```bash
python3 -m http.server 8766
# then open http://localhost:8766
```

In the app: tap the page (or **Ask the Book**) to reveal an answer; tap again to
ask anew. Switch books with the tabs, and use the top-right controls to toggle
**EN ↔ 中文** and **day ↔ night** — even mid-answer.

---

## Customising answers

Answers live in `data/classic.js`, `data/audit.js`, and `data/relationship.js`.
Each book has an `en` and a `zh` section, each with an `answers` array.

> ⚠️ Keep the `en` and `zh` arrays in a book **the same length** — the language
> toggle maps by index, and the app disables itself if they mismatch. Edit both
> when you add or remove a line.

After changing any asset (`styles.css`, `app.js`, `data/*`), bump `CACHE` in
`sw.js` so returning visitors get the new version instead of the offline cache.

---

## Deploy (GitHub Pages)

Push to `main`, then **Settings → Pages → Source: main / root**. The site is live
at `https://<username>.github.io/<repo>/` within a minute.

---

## License

MIT — do whatever you like with it.
