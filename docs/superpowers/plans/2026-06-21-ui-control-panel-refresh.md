# UI 控制面板视觉刷新 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在不改变自动选课行为或现有 DOM 调用契约的前提下，将注入式控制面板刷新为可访问、响应式的深色考场控制台。

**Architecture:** 保持 `courseGrabber.js` 为唯一运行时文件，并只替换 `createUI()` 的样式字符串。使用 Node 内置测试对 DOM ID、事件绑定及视觉系统的静态约束做回归保护；用本地浏览器夹具验证已注入面板的实际呈现和交互。

**Tech Stack:** 原生 JavaScript、CSS、Node.js 内置 `node:test`、本地浏览器夹具。

---

## 文件结构

- `courseGrabber.js`：运行时 UI；只替换 `createUI()` 内的 `style.textContent` 内容。
- `tests/ui-control-panel-contract.test.cjs`：不依赖第三方包的静态与运行时回归测试，保护 DOM 合约、设计约束和基础交互。
- `tests/ui-control-panel-fixture.html`：加载真实脚本的本地手工验证页面，不参与生产运行。

### Task 1: 建立 UI 合约回归测试

**Files:**
- Create: `tests/ui-control-panel-contract.test.cjs`
- Verify: `courseGrabber.js:2095-2500`

- [ ] **Step 1: 新增会失败的 UI 合约测试**

```js
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const source = fs.readFileSync(
  path.join(__dirname, "..", "courseGrabber.js"),
  "utf8",
);

const requiredIds = [
  "cg-close-btn",
  "cg-minimize-btn",
  "cg-status-text",
  "cg-course-code",
  "cg-course-list",
  "cg-schedule-time",
  "cg-start-btn",
  "cg-stop-btn",
  "cg-log-area",
];

test("UI 保留业务代码依赖的 DOM 合约", () => {
  assert.ok(source.includes('ui.id = "courseGrabberUI"'));

  for (const id of requiredIds) {
    assert.match(source, new RegExp(`id=["']${id}["']`));
  }

  for (const selector of [
    ".cg-header",
    "window.showGrabberUI",
    "window.editCourseUI",
    "window.removeCourseUI",
  ]) {
    assert.ok(source.includes(selector), `缺少 ${selector}`);
  }
});

test("UI 使用可访问的响应式考场控制台样式", () => {
  for (const token of [
    "--cg-ink:",
    "--cg-surface:",
    "--cg-success:",
    "--cg-warning:",
    "--cg-danger:",
    "@media (max-width: 520px)",
    "@media (prefers-reduced-motion: reduce)",
    ":focus-visible",
  ]) {
    assert.ok(source.includes(token), `缺少 ${token}`);
  }

  assert.doesNotMatch(source, /#667eea|#764ba2/);
});
```

- [ ] **Step 2: 运行测试，确认它在当前主题上失败**

Run: `node --test tests/ui-control-panel-contract.test.cjs`

Expected: 第一个子测试通过，第二个子测试因缺少 `--cg-ink:`、响应式规则与减少动态效果规则而失败。

### Task 2: 替换控制面板的视觉系统

**Files:**
- Modify: `courseGrabber.js:2103-2418`
- Test: `tests/ui-control-panel-contract.test.cjs`

- [ ] **Step 1: 用以下 CSS 完整替换 `style.textContent` 的模板内容**

```css
#courseGrabberUI {
  --cg-ink: #071a2d;
  --cg-surface: #0c243a;
  --cg-surface-raised: #112e47;
  --cg-surface-quiet: #0a2034;
  --cg-border: #2a4b66;
  --cg-text: #f5f2e9;
  --cg-muted: #a8b8c6;
  --cg-success: #42d6a4;
  --cg-warning: #f3b64d;
  --cg-danger: #e75d64;
  --cg-focus: #8ad9ff;
  position: fixed;
  top: 20px;
  right: 20px;
  width: min(440px, calc(100vw - 32px));
  max-height: min(90vh, 760px);
  background: var(--cg-ink);
  border: 1px solid var(--cg-border);
  border-radius: 18px;
  box-shadow: 0 24px 70px rgba(4, 15, 27, 0.42), 0 2px 0 rgba(255, 255, 255, 0.05) inset;
  z-index: 999999;
  font-family: "Avenir Next", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
  color: var(--cg-text);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
#courseGrabberUI * { box-sizing: border-box; }
.cg-header {
  padding: 15px 16px;
  background: #081e32;
  border-bottom: 1px solid var(--cg-border);
  cursor: move;
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
}
.cg-title { font-size: 16px; font-weight: 700; letter-spacing: 0.04em; display: flex; align-items: center; gap: 8px; }
.cg-controls { display: flex; gap: 6px; }
.cg-close, .cg-minimize {
  background: #173750;
  border: 1px solid #31536c;
  color: var(--cg-text);
  width: 30px;
  height: 30px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 17px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background-color 160ms ease, border-color 160ms ease, transform 160ms ease;
}
.cg-close:hover { background: #5a2632; border-color: var(--cg-danger); transform: rotate(90deg); }
.cg-minimize:hover { background: #24506e; border-color: var(--cg-focus); }
.cg-body { padding: 14px; overflow-y: auto; flex: 1; scrollbar-color: #496780 transparent; }
.cg-section { background: var(--cg-surface-raised); border: 1px solid #244660; border-radius: 12px; padding: 13px; margin-bottom: 12px; box-shadow: 0 1px 0 rgba(255, 255, 255, 0.035) inset; }
.cg-section:last-child { margin-bottom: 0; }
.cg-section-title { color: var(--cg-text); font-size: 12px; font-weight: 700; letter-spacing: 0.07em; margin-bottom: 10px; display: flex; align-items: center; gap: 6px; }
.cg-input { width: 100%; padding: 10px 11px; border: 1px solid #365873; background: var(--cg-surface-quiet); border-radius: 8px; color: var(--cg-text); font-size: 13px; margin-bottom: 8px; transition: border-color 160ms ease, background-color 160ms ease, box-shadow 160ms ease; }
.cg-input:hover { border-color: #58809d; }
.cg-input:focus { outline: none; border-color: var(--cg-focus); background: #0d2940; box-shadow: 0 0 0 3px rgba(138, 217, 255, 0.16); }
.cg-input::placeholder { color: #8398aa; }
.cg-btn { min-height: 36px; padding: 9px 13px; border: 1px solid transparent; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 700; letter-spacing: 0.01em; transition: background-color 160ms ease, border-color 160ms ease, color 160ms ease, transform 160ms ease, box-shadow 160ms ease; display: inline-flex; align-items: center; gap: 6px; justify-content: center; }
.cg-btn:hover:not(:disabled) { transform: translateY(-1px); }
.cg-btn:disabled { cursor: not-allowed; opacity: 0.48; }
.cg-btn-primary { background: var(--cg-success); border-color: #68e4ba; color: #06261f; box-shadow: 0 7px 18px rgba(66, 214, 164, 0.16); }
.cg-btn-primary:hover:not(:disabled) { background: #66e1b7; box-shadow: 0 9px 20px rgba(66, 214, 164, 0.25); }
.cg-btn-danger { background: #9e3d49; border-color: #d55a63; color: #fff7f5; }
.cg-btn-danger:hover:not(:disabled) { background: var(--cg-danger); }
.cg-btn-secondary { background: #173a55; border-color: #315873; color: #dfeaf0; }
.cg-btn-secondary:hover:not(:disabled) { background: #24516f; border-color: #56809d; }
.cg-btn-small { min-height: 32px; padding: 6px 10px; font-size: 12px; }
.cg-btn-group { display: flex; gap: 8px; margin-top: 10px; }
.cg-course-list { max-height: 220px; overflow-y: auto; margin-top: 10px; scrollbar-color: #496780 transparent; }
.cg-course-item { background: #0d2941; border: 1px solid #284c68; padding: 11px; border-radius: 9px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center; gap: 10px; transition: background-color 160ms ease, border-color 160ms ease; }
.cg-course-item:last-child { margin-bottom: 0; }
.cg-course-item:hover { background: #11334f; border-color: #4e7795; }
.cg-course-info { flex: 1; min-width: 0; font-size: 13px; }
.cg-course-code { color: var(--cg-text); font-weight: 700; margin-bottom: 5px; overflow-wrap: anywhere; }
.cg-course-meta { color: var(--cg-muted); font-size: 11px; }
.cg-status { padding: 10px 11px; background: #0c2b40; border: 1px solid #28536a; border-radius: 8px; font-size: 13px; display: flex; align-items: center; gap: 8px; }
.cg-status-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--cg-success); box-shadow: 0 0 0 4px rgba(66, 214, 164, 0.13); animation: cg-pulse 2s infinite; }
@keyframes cg-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
.cg-log-area { background: #061827; border: 1px solid #203f57; border-radius: 8px; padding: 11px; max-height: 168px; overflow-y: auto; color: #d5e1e8; font-size: 11px; font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace; line-height: 1.65; scrollbar-color: #496780 transparent; }
.cg-log-item { margin-bottom: 4px; }
.cg-log-success { color: var(--cg-success); }
.cg-log-error { color: #ff8c91; }
.cg-log-warning { color: var(--cg-warning); }
.cg-log-info { color: #86d5ff; }
.cg-badge { display: inline-block; padding: 3px 7px; background: #1d4059; border: 1px solid #3b647e; border-radius: 999px; color: #d7e6ee; font-size: 11px; margin-left: 6px; }
.cg-badge-success { background: rgba(66, 214, 164, 0.16); border-color: rgba(66, 214, 164, 0.45); color: #9bf0cf; }
.cg-badge-running { background: rgba(66, 214, 164, 0.16); border: 1px solid rgba(66, 214, 164, 0.45); border-radius: 999px; color: #9bf0cf; padding: 3px 8px; }
.cg-minimized { height: auto !important; width: 112px !important; }
.cg-minimized .cg-body, .cg-minimized .cg-title { display: none !important; }
.cg-filter-input { font-size: 12px; margin-bottom: 4px; }
.cg-help-text { color: var(--cg-muted); font-size: 11px; line-height: 1.5; margin-top: 4px; }
.cg-timer-display { background: #3d2e16; border: 1px solid #9e7132; color: #ffe0a4; padding: 14px; border-radius: 8px; text-align: center; font-size: 24px; font-weight: 700; letter-spacing: 0.08em; margin-top: 10px; font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace; }
.cg-timer-active { background: #4a3516; animation: cg-timer-pulse 2s infinite; }
@keyframes cg-timer-pulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(243, 182, 77, 0.14); } 50% { box-shadow: 0 0 0 8px rgba(243, 182, 77, 0); } }
.cg-time-input-group { display: flex; gap: 8px; align-items: center; }
.cg-time-input-group input { flex: 1; }
.cg-course-filters { background: #0a2135; border-left: 2px solid #3f6e8d; padding: 8px; border-radius: 0 6px 6px 0; margin-top: 7px; font-size: 11px; }
.cg-course-filter-item { color: #c3d1da; margin-bottom: 4px; display: flex; align-items: center; gap: 4px; overflow-wrap: anywhere; }
.cg-course-filter-item:last-child { margin-bottom: 0; }
.cg-filter-label { color: #93acc0; min-width: 40px; }
.cg-course-actions { display: flex; gap: 4px; flex-direction: column; }
#courseGrabberUI button:focus-visible, #courseGrabberUI input:focus-visible { outline: 2px solid var(--cg-focus); outline-offset: 2px; }
@media (max-width: 520px) {
  #courseGrabberUI { top: 12px; right: 12px; width: calc(100vw - 24px); max-height: calc(100vh - 24px); border-radius: 14px; }
  .cg-header { padding: 12px; }
  .cg-body { padding: 10px; }
  .cg-section { padding: 11px; margin-bottom: 10px; }
  .cg-course-item { align-items: flex-start; }
  .cg-course-actions { flex-direction: row; }
}
@media (prefers-reduced-motion: reduce) {
  #courseGrabberUI *, #courseGrabberUI *::before, #courseGrabberUI *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; scroll-behavior: auto !important; transition-duration: 0.01ms !important; }
}
```

- [ ] **Step 2: 运行静态测试，确认主题和 DOM 合约均通过**

Run: `node --test tests/ui-control-panel-contract.test.cjs`

Expected: 三个子测试均为 `ok`，测试进程以状态码 0 结束。

- [ ] **Step 3: 执行 JavaScript 语法检查**

Run: `node --check courseGrabber.js`

Expected: 无输出，状态码 0。

### Task 3: 添加真实脚本的本地浏览器夹具

**Files:**
- Create: `tests/ui-control-panel-fixture.html`
- Verify: `courseGrabber.js`

- [ ] **Step 1: 创建本地夹具页**

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>自动抢课 UI 夹具</title>
    <style>
      body { margin: 0; min-height: 100vh; background: #edf2f7; color: #1f2933; font: 16px/1.5 Georgia, "Noto Serif SC", serif; }
      main { max-width: 860px; padding: 48px 32px; }
      h1 { margin: 0 0 12px; }
      .notice { max-width: 560px; padding: 20px; border: 1px solid #cad6df; border-radius: 8px; background: #fff; }
    </style>
  </head>
  <body>
    <main>
      <h1>正方教务系统</h1>
      <div class="notice">此页面仅用于验证 courseGrabber 注入的控制面板。</div>
    </main>
    <script>window.alert = () => {};</script>
    <script src="../courseGrabber.js"></script>
  </body>
</html>
```

- [ ] **Step 2: 在浏览器中验证夹具；浏览器通道不可用时切换运行时烟测**

Run: 优先打开 `file:///Users/a86198/Desktop/project/Auto_courseGrabber/tests/ui-control-panel-fixture.html`；检查控制台无错误，并依次观察默认状态、添加一门课程后的课程卡片、最小化状态和 375px 宽视窗。若浏览器通道在脚本执行前被宿主拒绝，则运行 `node --test tests/ui-control-panel-contract.test.cjs` 中的 `UI 注入后仍可添加课程、最小化和关闭` 子测试。

Expected: 浏览器可用时，面板始终完整显示，按钮与输入框可操作，控制台没有 error 级消息。回退时，最小 DOM 夹具必须实际执行完整脚本，并验证面板注入、添加课程、最小化和关闭；浏览器视觉检查标记为受宿主通道阻塞。

### Task 4: 完成验证并提交

**Files:**
- Modify: `courseGrabber.js`
- Create: `tests/ui-control-panel-contract.test.cjs`
- Create: `tests/ui-control-panel-fixture.html`

- [ ] **Step 1: 运行所有可用自动验证**

Run: `node --test tests/ui-control-panel-contract.test.cjs && node --check courseGrabber.js && git diff --check`

Expected: 测试输出三个 `ok` 子测试，语法检查与 `git diff --check` 均无输出，命令以状态码 0 结束。

- [ ] **Step 2: 检查变更范围**

Run: `git diff -- courseGrabber.js tests/ui-control-panel-contract.test.cjs tests/ui-control-panel-fixture.html docs/superpowers/plans/2026-06-21-ui-control-panel-refresh.md`

Expected: 仅包含控制面板视觉系统、其无依赖合约测试、本地浏览器夹具和本实施计划。

- [ ] **Step 3: 创建实现提交**

Run: `git add courseGrabber.js tests/ui-control-panel-contract.test.cjs tests/ui-control-panel-fixture.html docs/superpowers/plans/2026-06-21-ui-control-panel-refresh.md && git commit -m "feat: refresh course grabber control panel UI"`

Expected: 新提交包含且只包含上述四个文件。
