const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

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

function createClassList() {
  const values = new Set();

  return {
    toggle(name) {
      values.has(name) ? values.delete(name) : values.add(name);
    },
    contains(name) {
      return values.has(name);
    },
  };
}

function createDocument() {
  const elements = new Map();
  const makeElement = () => {
    const element = {
      children: [],
      style: {},
      classList: createClassList(),
      value: "",
      textContent: "",
      disabled: false,
      appendChild(child) {
        this.children.push(child);
        return child;
      },
      querySelector(selector) {
        return selector === ".cg-header" ? makeElement() : null;
      },
    };

    Object.defineProperty(element, "id", {
      get() {
        return this._id;
      },
      set(value) {
        this._id = value;
        elements.set(value, this);
      },
    });
    Object.defineProperty(element, "innerHTML", {
      get() {
        return this._innerHTML || "";
      },
      set(value) {
        this._innerHTML = value;
        for (const [, id] of value.matchAll(/id=["']([^"']+)["']/g)) {
          if (!elements.has(id)) {
            const child = makeElement();
            child.id = id;
          }
        }
      },
    });

    return element;
  };

  return {
    readyState: "complete",
    head: makeElement(),
    body: makeElement(),
    createElement: makeElement,
    getElementById(id) {
      return elements.get(id) || null;
    },
    addEventListener() {},
  };
}

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

test("UI 注入后仍可添加课程、最小化和关闭", () => {
  const document = createDocument();
  const window = { document, alert() {} };

  vm.runInNewContext(source, {
    window,
    document,
    console: { log() {}, warn() {}, error() {} },
    setInterval: () => 1,
    clearInterval() {},
    alert() {},
    Date,
    Math,
    Array,
    Object,
    String,
    Number,
    RegExp,
    JSON,
    Set,
    Map,
  });

  const ui = document.getElementById("courseGrabberUI");
  const addCourse = document.getElementById("cg-add-course");
  const courseCode = document.getElementById("cg-course-code");
  const courseList = document.getElementById("cg-course-list");
  const minimize = document.getElementById("cg-minimize-btn");
  const close = document.getElementById("cg-close-btn");

  assert.ok(ui);
  assert.ok(addCourse);
  assert.ok(courseCode);
  assert.ok(courseList);

  courseCode.value = "CS101";
  addCourse.onclick();
  assert.match(courseList.innerHTML, /CS101/);

  minimize.onclick();
  assert.ok(ui.classList.contains("cg-minimized"));

  close.onclick();
  assert.equal(ui.style.display, "none");
});
