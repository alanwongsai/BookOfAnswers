# Book of Answers 代码学习笔记

这份文档用来解释当前项目的主要代码结构，方便以后复习。项目核心由两个文件组成：

- `index.html`：页面结构、CSS 样式、JavaScript 交互逻辑。
- `answers.js`：答案数据，包括不同分类和中英文内容。

## 1. 页面入口

`index.html` 开头：

```html
<!DOCTYPE html>
<html lang="en" data-theme="dark" data-book="classic">
```

`<!DOCTYPE html>` 告诉浏览器这是现代 HTML 页面。

`lang="en"` 表示页面默认语言是英文。后面切换中文时，JavaScript 会把它改成 `zh-Hans`。

`data-theme="dark"` 和 `data-book="classic"` 是自定义属性。CSS 会根据它们切换主题和书籍分类样式。

例如：

```css
[data-theme="light"] { ... }
[data-book="audit"] { ... }
```

意思是：当 HTML 元素上出现这些属性时，应用对应样式。

## 2. Head 区域

`<head>` 里放的是页面配置，不是直接显示给用户看的主体内容。

```html
<meta charset="UTF-8" />
```

表示页面使用 UTF-8 编码，所以中文、英文和特殊符号都能正常显示。

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

这是响应式页面常用设置。它让手机浏览器按设备宽度显示页面。

```html
<title>The Book of Answers</title>
```

这是浏览器标签页里的标题。

```html
<link rel="manifest" href="./manifest.json" />
<link rel="apple-touch-icon" href="./icon-192.png" />
```

这两行和 PWA 有关，可以让网页更像 App，比如有图标、可以安装到手机桌面。

```html
<link href="https://fonts.googleapis.com/css2?..." rel="stylesheet" />
```

这里加载 Google Fonts。项目中用了多种字体，比如 `Cinzel`、`Cormorant Garamond`、`Noto Serif SC`、`Inter`。

## 3. CSS 变量

CSS 里最重要的一部分是 `:root`：

```css
:root {
  --bg: #040710;
  --text: rgba(247, 250, 255, 0.94);
  --accent: #9fcfff;
}
```

`:root` 可以理解成全局样式配置中心。

`--bg`、`--text`、`--accent` 这种写法叫 CSS 自定义变量。之后可以这样使用：

```css
background: var(--bg);
color: var(--text);
```

好处是：如果以后想换颜色，只需要改变量，不需要到处找具体颜色值。

## 4. 主题切换

暗色主题默认写在 `:root` 里，浅色主题写在：

```css
[data-theme="light"] {
  --bg: #eef6ff;
  --text: rgba(8, 17, 31, 0.90);
}
```

JavaScript 切换主题时并不会一个个修改颜色，而是修改 HTML 上的属性：

```js
$html.setAttribute("data-theme", state.theme);
```

当 `data-theme` 变成 `light`，CSS 里的浅色主题变量就会生效。

## 5. 书籍分类样式

项目有三种书籍分类：

- `classic`：经典答案之书。
- `audit`：审计人生。
- `relationship`：心语。

CSS 里有不同分类的颜色配置：

```css
[data-book="audit"] {
  --accent: #a2cfe0;
  --mood: rgba(100, 165, 200, 0.26);
}

[data-book="relationship"] {
  --accent: #d4a8e8;
  --mood: rgba(178, 98, 165, 0.32);
}
```

切换分类时，JavaScript 修改 `data-book`，CSS 自动应用对应颜色。

## 6. Reset 和基础样式

```css
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
```

这是 CSS reset。浏览器默认会给很多元素加 margin 和 padding，这里统一清掉，方便自己控制布局。

```css
body {
  min-height: 100vh;
  overflow-x: hidden;
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-ui);
}
```

这段设置整个页面的高度、背景色、文字颜色和默认字体。

## 7. 背景层

```html
<div class="cosmos" aria-hidden="true"></div>
<div class="ambient-orbit" aria-hidden="true"></div>
```

这两个元素主要负责视觉背景。

`aria-hidden="true"` 表示它们只是装饰，屏幕阅读器不用读出来。

CSS 里的 `.cosmos` 使用多个 `radial-gradient` 和 `linear-gradient` 画出宇宙背景：

```css
.cosmos {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}
```

`position: fixed` 表示背景固定在屏幕上。

`inset: 0` 等于同时设置 `top`、`right`、`bottom`、`left` 为 `0`，也就是铺满全屏。

`pointer-events: none` 表示这个背景不会挡住按钮点击。

## 8. 顶部控制按钮

```html
<button class="util-btn" type="button" id="theme-toggle">☀ Day</button>
<button class="util-btn" type="button" id="lang-toggle">中文</button>
```

这两个按钮分别负责：

- `theme-toggle`：切换白天和夜间主题。
- `lang-toggle`：切换英文和中文。

按钮本身只提供结构和初始文字，真正的切换逻辑在下面的 JavaScript 里。

## 9. 标题区域

```html
<h1 class="book-title" id="book-title">The Book of Answers</h1>
<div class="eyebrow" id="book-eyebrow">A quiet answer awaits</div>
```

`h1` 是页面主标题。

`book-eyebrow` 是标题下面的小字。它会根据当前书籍和语言变化。

例如英文 classic 是：

```text
A quiet answer awaits
```

中文 classic 是：

```text
静候答案
```

## 10. 分类切换按钮

```html
<button class="cat-tab active" data-book="classic">Classic</button>
<button class="cat-tab" data-book="audit">Audit Life</button>
<button class="cat-tab" data-book="relationship">Heart</button>
```

每个按钮都有一个 `data-book`。

JavaScript 点击分类按钮时会读取：

```js
const book = tab.dataset.book;
```

然后把当前书籍状态改成对应分类：

```js
state.book = book;
```

## 11. 卡片结构

```html
<div class="card" id="card">
  <div class="card-face card-front">...</div>
  <div class="card-face card-back">...</div>
</div>
```

卡片分成正面和背面：

- `card-front`：显示提示语和装饰符号。
- `card-back`：显示随机答案。

默认背面是隐藏的：

```css
.card-back {
  opacity: 0;
  pointer-events: none;
}
```

当 JavaScript 给卡片加上 `.flipped`：

```js
$card.classList.add("flipped");
```

CSS 会让正面淡出，背面淡入：

```css
.card.flipped .card-front {
  opacity: 0;
}

.card.flipped .card-back {
  opacity: 1;
}
```

所以这个效果不是传统 3D 翻牌，而是用透明度、位移和模糊做出来的“揭晓”动画。

## 12. 主按钮

```html
<button class="ask-btn" type="button" id="ask-btn">Ask the Book</button>
```

这个按钮一开始显示 `Ask the Book`。

当答案出现后，它会变成 `Ask Again`。逻辑在 `render()` 里：

```js
$askBtn.textContent = state.flipped ? d.againBtn : d.askBtn;
```

如果 `state.flipped` 是 `true`，说明现在正在显示答案，按钮就显示“再问一次”。

如果 `state.flipped` 是 `false`，说明还没揭晓，按钮就显示“问问书”。

## 13. 加载答案数据

```html
<script src="./answers.js"></script>
```

这行先加载 `answers.js`。

后面的 JavaScript 会读取：

```js
const BOOKS = window.BOOKS;
```

如果 `answers.js` 没有加载成功，就会报错：

```js
if (!BOOKS) {
  throw new Error("Answer data failed to load.");
}
```

## 14. 状态对象

```js
const state = {
  theme: "dark",
  lang: "en",
  book: "classic",
  flipped: false,
  lastIdx: -1
};
```

`state` 是当前页面的状态，也可以理解成页面记忆。

- `theme`：当前主题，`dark` 或 `light`。
- `lang`：当前语言，`en` 或 `zh`。
- `book`：当前书籍分类。
- `flipped`：卡片是否已经显示答案。
- `lastIdx`：上一次抽到的答案编号，用来避免连续抽到同一条。

## 15. UI_TEXT

```js
const UI_TEXT = {
  en: { ... },
  zh: { ... }
};
```

这里放的是界面文字，不是答案本体。

例如：

- 标题下面的小字。
- 辅助提示文案。
- 无障碍标签。

答案数据在 `answers.js` 的 `BOOKS` 里面。

## 16. 获取 HTML 元素

```js
const $card = document.getElementById("card");
const $askBtn = document.getElementById("ask-btn");
const $tabs = document.querySelectorAll(".cat-tab");
```

这部分是在 JavaScript 里找到页面上的 HTML 元素。

例如 HTML 里有：

```html
<button id="ask-btn">
```

JavaScript 可以通过：

```js
document.getElementById("ask-btn")
```

拿到这个按钮，然后修改文字、添加 class、绑定点击事件。

变量名前面的 `$` 只是命名习惯，表示这个变量保存的是 DOM 元素。

## 17. currentData()

```js
function currentData() {
  return BOOKS[state.book][state.lang];
}
```

这个函数根据当前状态，找到当前书籍和当前语言的数据。

如果当前状态是：

```js
state.book = "classic";
state.lang = "zh";
```

那它返回：

```js
BOOKS["classic"]["zh"]
```

也就是中文版经典答案书的数据。

## 18. randomAnswer()

```js
function randomAnswer() {
  const list = currentData().answers;
  let idx;
  do {
    idx = Math.floor(Math.random() * list.length);
  }
  while (idx === state.lastIdx && list.length > 1);

  state.lastIdx = idx;
  return list[idx];
}
```

这个函数负责随机抽答案。

`Math.random()` 会生成一个 0 到 1 之间的小数。

`Math.random() * list.length` 会得到一个 0 到答案数量之间的数字。

`Math.floor(...)` 会向下取整，得到数组下标。

`do...while` 的作用是避免连续两次抽到同一条答案。

## 19. render()

```js
function render(fadeTitle = false) {
  const d = currentData();
  const ui = UI_TEXT[state.lang];
  ...
}
```

`render()` 是页面刷新函数。它根据当前 `state` 把页面上的文字和状态更新一遍。

它会做这些事：

- 更新 HTML 上的 `data-theme` 和 `data-book`。
- 更新标题、提示语、按钮文字。
- 更新分类按钮的 active 状态。
- 更新语言按钮和主题按钮文字。
- 如果答案已经显示，切换语言时同步更新答案文字。

重点代码：

```js
$html.setAttribute("data-theme", state.theme);
$html.setAttribute("data-book", state.book);
```

这两行让 CSS 知道当前应该使用哪个主题和哪个书籍分类。

```js
$html.lang = state.lang === "en" ? "en" : "zh-Hans";
```

这行会更新页面语言。CSS 里的 `:lang(zh-Hans)` 会因此生效，让中文使用更适合的字体和字号。

## 20. flipToAnswer()

```js
function flipToAnswer() {
  $card.classList.add("gathering");

  setTimeout(() => {
    $card.classList.remove("gathering");
    $answer.classList.add("is-revealing");
    $answer.textContent = randomAnswer();
    state.flipped = true;
    $card.classList.add("flipped");
    render(false);

    window.setTimeout(() => {
      $answer.classList.remove("is-revealing");
      updateAnswerMeta();
    }, 360);
  }, 150);
}
```

这个函数负责揭晓答案。

流程是：

1. 给卡片加上 `gathering`，让卡片先发光。
2. 150 毫秒后移除 `gathering`。
3. 调用 `randomAnswer()` 抽一条答案。
4. 设置 `state.flipped = true`。
5. 给卡片加上 `flipped`，显示背面的答案。
6. 360 毫秒后移除 `is-revealing`，完成答案淡入动画。

## 21. flipToFront()

```js
function flipToFront(shouldRender = true) {
  state.flipped = false;
  $card.classList.remove("flipped");
  $askBtn.textContent = currentData().askBtn;
  if (shouldRender) render(false);
}
```

这个函数负责把卡片合回正面。

它会：

- 把 `state.flipped` 改成 `false`。
- 移除卡片上的 `.flipped`。
- 把按钮文字改回初始状态。
- 必要时重新渲染页面。

## 22. 点击和键盘事件

```js
$cardScene.addEventListener("click", handleAsk);
$askBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  handleAsk();
});
```

点击卡片或按钮都会触发 `handleAsk()`。

`e.stopPropagation()` 是为了防止点击按钮时，事件继续冒泡到外层卡片，导致 `handleAsk()` 被触发两次。

键盘支持：

```js
$cardScene.addEventListener("keydown", (e) => {
  if (e.key !== "Enter" && e.key !== " ") return;
  e.preventDefault();
  handleAsk();
});
```

这表示用户用键盘聚焦到卡片时，按 Enter 或空格也可以揭晓答案。

## 23. 分类切换事件

```js
$tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    const book = tab.dataset.book;
    if (book === state.book) return;

    state.book = book;
    state.lastIdx = -1;

    if (state.flipped) flipToFront(false);
    render(true);
  });
});
```

每个分类按钮都会绑定点击事件。

点击后：

1. 读取按钮的 `data-book`。
2. 更新 `state.book`。
3. 重置 `lastIdx`。
4. 如果当前正在显示答案，先合上卡片。
5. 调用 `render(true)` 更新页面。

`render(true)` 表示标题切换时带一点淡出淡入动画。

## 24. 语言和主题切换事件

语言切换：

```js
$langToggle.addEventListener("click", () => {
  state.lang = state.lang === "en" ? "zh" : "en";
  render(false);
});
```

如果当前是英文，就切换到中文。  
如果当前是中文，就切换到英文。

主题切换：

```js
$themeToggle.addEventListener("click", () => {
  state.theme = state.theme === "light" ? "dark" : "light";
  render(false);
});
```

如果当前是浅色，就切换到深色。  
如果当前是深色，就切换到浅色。

## 25. PWA Service Worker

```js
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}
```

这段代码会在浏览器支持 Service Worker 时注册 `sw.js`。

Service Worker 常用于离线缓存，让网页更像 App。

`.catch(() => {})` 表示如果注册失败，就静默忽略，不让页面报明显错误。

## 26. answers.js 数据结构

`answers.js` 的核心是：

```js
window.BOOKS = {
  "classic": {
    "en": { ... },
    "zh": { ... }
  },
  "audit": {
    "en": { ... },
    "zh": { ... }
  },
  "relationship": {
    "en": { ... },
    "zh": { ... }
  }
};
```

`window.BOOKS` 表示把 `BOOKS` 放到浏览器全局对象 `window` 上。

这样 `index.html` 里的脚本就可以通过下面这行拿到数据：

```js
const BOOKS = window.BOOKS;
```

每本书下面都有英文和中文两份数据。

每份数据大概长这样：

```js
{
  name: "答案之书",
  prompt: "心怀你的问题，然后揭晓你的答案。",
  hint: "点击揭晓",
  askBtn: "问问书",
  againBtn: "再问一次",
  ornament: "✦",
  answers: [
    "可以，但保持简单",
    "不，以现在的形式还不行"
  ]
}
```

字段含义：

- `name`：书名。
- `prompt`：卡片正面的提示语。
- `hint`：卡片正面底部的小提示。
- `askBtn`：第一次询问按钮文字。
- `againBtn`：已经抽过答案后的按钮文字。
- `ornament`：卡片顶部装饰符号。
- `answers`：随机答案数组。

## 27. 整体运行流程

项目运行时大概是这样：

1. 浏览器打开 `index.html`。
2. CSS 画出背景、卡片、按钮和动画。
3. 页面加载 `answers.js`，得到 `window.BOOKS`。
4. JavaScript 初始化 `state`，默认是深色、英文、classic。
5. 调用 `render(false)`，把默认内容显示到页面。
6. 用户点击卡片或按钮。
7. `handleAsk()` 判断当前是否已经翻开。
8. 如果还没翻开，就调用 `flipToAnswer()`。
9. `flipToAnswer()` 调用 `randomAnswer()` 抽一条答案。
10. 卡片加上 `.flipped`，CSS 显示答案面。
11. 用户再点一次，就调用 `flipToFront()` 回到正面。

## 28. 最重要的概念总结

这个项目的核心关系是：

- `answers.js` 提供数据。
- `state` 记录当前页面状态。
- `render()` 把状态显示到页面。
- 事件监听器响应用户点击和键盘操作。
- CSS class 控制动画和视觉变化。

尤其要记住这个模式：

```text
用户操作 -> 修改 state -> 调用 render() -> 页面更新
```

这是很多前端项目都会用到的基本思路。
