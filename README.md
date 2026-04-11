# 📖 The Book of Answers

A minimal, elegant web app inspired by *The Book of Answers* — ask a question, flip the card, receive your answer.

**Live demo:** `https://yourusername.github.io/book-of-answers`

---

## What It Does

You hold a question in your mind, tap the card, and get a random answer — just like the classic book. No AI, no algorithms trying to be clever. Just a flip, and a line that might be exactly what you needed to hear.

Three books are included, each with 40 answers in both **English and Simplified Chinese**:

| Book | Theme | Vibe |
|------|-------|-------|
| **Classic** | Life & decisions | Oracular, timeless |
| **Audit Life** | Work & audit struggles | Honest, painfully relatable |
| **Heart** | Relationships & feelings | Honest, sometimes brutal |

---

## Features

- 🃏 **3D card flip animation** — smooth, satisfying reveal
- 🌙 **Day / Night mode** — warm cream by day, deep gold-on-dark at night
- 🇨🇳 **EN ↔ 中文** — switch languages anytime, even mid-answer
- 📱 **Mobile friendly** — works on any screen size
- ⚡ **Zero dependencies** — pure HTML, CSS, JavaScript. No build step, no framework.

---

## Deploy in 3 Steps

1. **Fork or clone** this repo
2. Push `index.html` and `README.md` to your `main` branch
3. Go to **Settings → Pages → Source: main / root** → Save

Your app will be live at `https://yourusername.github.io/repo-name` within a minute.

---

## Project Structure

```
/
└── index.html    ← the entire app, self-contained
└── README.md     ← this file
```

No `node_modules`. No `package.json`. No build process. Just open the file and it works.

---

## Customising Answers

All answers live inside `index.html` in the `BOOKS` object near the top of the `<script>` block. Each book has an `en` and `zh` section, each with an `answers` array. Add, remove, or edit lines freely — just keep the EN and ZH arrays the same length so the language switch stays in sync.

```js
answers: [
  "Your new answer here",
  // ...
]
```

---

## License

MIT — do whatever you like with it.
