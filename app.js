// ── Data ───────────────────────────────────────────────────────────────────
const BOOKS = window.BOOKS || {};
const REQUIRED_BOOKS = ["classic", "audit", "relationship"];
const REQUIRED_LANGS = ["en", "zh"];
const THEME_COLORS = {
  dark: "#09080b",
  light: "#f5f0e8"
};
const dataValidation = validateBooksData(BOOKS);

// ── State ──────────────────────────────────────────────────────────────────
const state = {
  theme:    "dark",
  lang:     "en",
  book:     "classic",
  flipped:  false,
  lastIdx:  -1
};

const UI_TEXT = {
  en: {
    eyebrow: {
      classic: "A quiet answer awaits",
      audit: "A clearer signal awaits",
      relationship: "A tender answer awaits"
    },
    helper: "Let the question settle. When the surface feels still, ask once.",
    revealLabel: "Reveal an answer",
    resetLabel: "Close the answer"
  },
  zh: {
    eyebrow: {
      classic: "静候答案",
      audit: "静候明晰",
      relationship: "静候心声"
    },
    helper: "让问题先安静下来。等表面平稳时，只问一次。",
    revealLabel: "揭晓答案",
    resetLabel: "合上答案"
  }
};

// ── Elements ───────────────────────────────────────────────────────────────
const $html        = document.documentElement;
const $card        = document.getElementById("card");
const $cardScene   = document.getElementById("card-scene");
const $helperCopy  = document.getElementById("helper-copy");
const $bookEyebrow = document.getElementById("book-eyebrow");
const $bookTitle   = document.getElementById("book-title");
const $ornament    = document.getElementById("card-ornament");
const $prompt      = document.getElementById("card-prompt");
const $hint        = document.getElementById("card-hint");
const $answer      = document.getElementById("answer-text");
const $answerLabel = document.getElementById("answer-label");
const $answerCount = document.getElementById("answer-count");
const $askBtn      = document.getElementById("ask-btn");
const $langToggle  = document.getElementById("lang-toggle");
const $themeToggle = document.getElementById("theme-toggle");
const $tabs        = document.querySelectorAll(".cat-tab");
const $tabClassic  = document.getElementById("tab-classic");
const $tabAudit    = document.getElementById("tab-audit");
const $tabRel      = document.getElementById("tab-relationship");
const $themeColorMeta = document.querySelector('meta[name="theme-color"]');

function validateBooksData(data) {
  const errors = [];

  if (!data || typeof data !== "object") {
    return { ok: false, errors: ["BOOKS data object is missing."] };
  }

  REQUIRED_BOOKS.forEach((book) => {
    const bookData = data[book];
    if (!bookData || typeof bookData !== "object") {
      errors.push(`Missing book: ${book}`);
      return;
    }

    REQUIRED_LANGS.forEach((lang) => {
      const langData = bookData[lang];
      if (!langData || typeof langData !== "object") {
        errors.push(`Missing language '${lang}' in book '${book}'`);
        return;
      }

      if (!Array.isArray(langData.answers) || langData.answers.length === 0) {
        errors.push(`Invalid answers in book '${book}' language '${lang}'`);
      }
    });

    const enAnswers = bookData.en && bookData.en.answers;
    const zhAnswers = bookData.zh && bookData.zh.answers;
    if (Array.isArray(enAnswers) && Array.isArray(zhAnswers) && enAnswers.length !== zhAnswers.length) {
      errors.push(`Answer count mismatch in '${book}': en=${enAnswers.length}, zh=${zhAnswers.length}`);
    }
  });

  return { ok: errors.length === 0, errors };
}

// ── Helpers ────────────────────────────────────────────────────────────────
function currentData() {
  const bookData = BOOKS[state.book];
  if (!bookData) return null;
  return bookData[state.lang] || null;
}

function randomAnswer() {
  const data = currentData();
  if (!data || !Array.isArray(data.answers) || data.answers.length === 0) {
    return state.lang === "en" ? "Answer data unavailable." : "答案数据不可用。";
  }

  const list = data.answers;
  let idx;
  do { idx = Math.floor(Math.random() * list.length); }
  while (idx === state.lastIdx && list.length > 1);
  state.lastIdx = idx;
  return list[idx];
}

function setButtonLabel(button, label) {
  const textNode = button.querySelector("span");
  if (textNode) { textNode.textContent = label; }
  else          { button.textContent   = label; }
}

function updateAnswerMeta() {
  const data = currentData();
  const total = data && Array.isArray(data.answers) ? data.answers.length : 0;
  if ($answerCount) {
    if (state.lastIdx >= 0 && total > 0) {
      $answerCount.textContent = state.lang === "en"
        ? `${state.lastIdx + 1} of ${total}`
        : `${state.lastIdx + 1} / ${total}`;
    } else {
      $answerCount.textContent = "";
    }
  }
  if ($answerLabel) {
    $answerLabel.textContent = state.lang === "en" ? "Answer" : "答语";
  }
}

// ── Render UI ──────────────────────────────────────────────────────────────
function render(fadeTitle = false) {
  const d  = currentData();
  const ui = UI_TEXT[state.lang];
  if (!d) return;

  $html.setAttribute("data-theme", state.theme);
  $html.setAttribute("data-book",  state.book);
  if ($themeColorMeta) {
    $themeColorMeta.setAttribute("content", THEME_COLORS[state.theme]);
  }

  // Title (with optional fade transition)
  if (fadeTitle) {
    $bookTitle.classList.add("is-changing");
    setTimeout(() => {
      $bookTitle.textContent = d.name;
      $bookTitle.classList.remove("is-changing");
    }, 240);
  } else {
    $bookTitle.textContent = d.name;
  }

  $bookEyebrow.textContent = ui.eyebrow[state.book];
  if ($helperCopy) $helperCopy.textContent = ui.helper;

  // Card front
  $ornament.textContent = d.ornament;
  $prompt.textContent   = d.prompt;
  $hint.textContent     = d.hint;

  // Button label
  $askBtn.textContent = state.flipped ? d.againBtn : d.askBtn;
  $cardScene.setAttribute("aria-label", state.flipped ? ui.resetLabel : ui.revealLabel);

  // Re-render answer in new language if visible
  if (state.flipped && state.lastIdx >= 0) {
    $answer.textContent = BOOKS[state.book][state.lang].answers[state.lastIdx];
    updateAnswerMeta();
  }

  // Category tabs
  setButtonLabel($tabClassic, state.lang === "en" ? "Classic"    : "经典");
  setButtonLabel($tabAudit,   state.lang === "en" ? "Audit Life" : "审计人生");
  setButtonLabel($tabRel,     state.lang === "en" ? "Heart"      : "心语");
  $tabs.forEach(tab => {
    const isActive = tab.dataset.book === state.book;
    tab.classList.toggle("active", isActive);
    tab.setAttribute("aria-pressed", String(isActive));
  });

  // Utility toggles
  $langToggle.textContent  = state.lang  === "en"    ? "中文"    : "English";
  $themeToggle.textContent = state.theme === "light"
    ? (state.lang === "en" ? "☽ Night" : "☽ 夜间")
    : (state.lang === "en" ? "☀ Day"   : "☀ 日间");

  // lang attribute for CSS :lang() selectors
  $html.lang = state.lang === "en" ? "en" : "zh-Hans";
}

// ── Flip Logic ─────────────────────────────────────────────────────────────
function flipToAnswer() {
  // Phase 1 — Gather (150ms): border brightens, energy builds
  $card.classList.add("gathering");

  setTimeout(() => {
    $card.classList.remove("gathering");

    // Phase 2 — Portal opens: cross-fade front → back
    $answer.classList.add("is-revealing");
    $answer.textContent = randomAnswer();
    state.flipped = true;
    $card.classList.add("flipped");
    $askBtn.textContent = currentData().againBtn;
    render(false);

    // Phase 3 — Answer rises into view (staggered)
    window.setTimeout(() => {
      $answer.classList.remove("is-revealing");
      updateAnswerMeta();
    }, 360);

  }, 150);
}

function flipToFront(shouldRender = true) {
  state.flipped = false;
  $card.classList.remove("flipped");
  $askBtn.textContent = currentData().askBtn;
  if (shouldRender) render(false);
}

function handleAsk() {
  if (!dataValidation.ok) return;
  state.flipped ? flipToFront() : flipToAnswer();
}

// ── Events ─────────────────────────────────────────────────────────────────
$cardScene.addEventListener("click", handleAsk);
$askBtn.addEventListener("click", (e) => { e.stopPropagation(); handleAsk(); });

$cardScene.addEventListener("keydown", (e) => {
  if (e.key !== "Enter" && e.key !== " ") return;
  e.preventDefault();
  handleAsk();
});

$askBtn.addEventListener("pointerdown",  () => $askBtn.classList.add("is-pressed"));
["pointerup", "pointercancel", "pointerleave"].forEach(ev =>
  $askBtn.addEventListener(ev, () => $askBtn.classList.remove("is-pressed"))
);

$tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    const book = tab.dataset.book;
    if (book === state.book) return;
    state.book    = book;
    state.lastIdx = -1;
    if (state.flipped) flipToFront(false);
    render(true);
  });
});

$langToggle.addEventListener("click", () => {
  state.lang = state.lang === "en" ? "zh" : "en";
  render(false);
});

$themeToggle.addEventListener("click", () => {
  state.theme = state.theme === "light" ? "dark" : "light";
  render(false);
});

// ── Init ───────────────────────────────────────────────────────────────────
if (!dataValidation.ok) {
  $askBtn.disabled = true;
  $cardScene.setAttribute("aria-disabled", "true");
  $cardScene.removeAttribute("tabindex");
  $answer.textContent = state.lang === "en"
    ? "Data error. Please verify book files."
    : "数据错误，请检查语料文件。";
  if ($helperCopy) {
    $helperCopy.textContent = state.lang === "en"
      ? "Cannot start: answer files are incomplete."
      : "无法启动：语料文件不完整。";
  }
  if ($themeColorMeta) {
    $themeColorMeta.setAttribute("content", THEME_COLORS.dark);
  }
  console.error("Book data validation failed:", dataValidation.errors);
} else {
  render(false);
}

// ── PWA: Register Service Worker ───────────────────────────────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}
