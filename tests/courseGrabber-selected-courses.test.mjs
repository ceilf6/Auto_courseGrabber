import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const source = readFileSync(new URL("../courseGrabber.js", import.meta.url), "utf8");

function extractFunction(name) {
  const start = source.indexOf(`function ${name}(`);
  assert.notEqual(start, -1, `Expected courseGrabber.js to define ${name}()`);

  const bodyStart = source.indexOf("{", start);
  let depth = 0;
  for (let index = bodyStart; index < source.length; index++) {
    const char = source[index];
    if (char === "{") depth++;
    if (char === "}") depth--;
    if (depth === 0) {
      return source.slice(start, index + 1);
    }
  }

  throw new Error(`Could not extract ${name}()`);
}

function extractConst(name) {
  const match = source.match(new RegExp(`const ${name} = [^;]+;`));
  assert.notEqual(match, null, `Expected courseGrabber.js to define ${name}`);
  return match[0];
}

function loadCourseGrabberHelpers() {
  const helperSource = [
    extractConst("DROP_BUTTON_EXCLUDED_TEXTS"),
    extractFunction("isCourseCode"),
    extractFunction("extractCourseNameFromJxbmc"),
    extractFunction("isElementClickable"),
    extractFunction("findClickableElementByText"),
    extractFunction("findSelectedCourseRows"),
  ].join("\n");

  return Function(`${helperSource}\nreturn { findClickableElementByText, findSelectedCourseRows };`)();
}

function loadDropCourse(document, state) {
  const helperSource = [
    extractConst("DROP_BUTTON_EXCLUDED_TEXTS"),
    extractFunction("isCourseCode"),
    extractFunction("extractCourseNameFromJxbmc"),
    extractFunction("isElementClickable"),
    extractFunction("findClickableElementByText"),
    extractFunction("findSelectedCourseRows"),
    extractFunction("isTeachingClassMatchingIdentifier"),
    extractFunction("dropCourse"),
  ].join("\n");

  return Function(
    "document",
    "state",
    `
      // These tests validate dropCourse branch selection, not real browser timing.
      const setTimeout = (callback) => {
        callback();
        return 0;
      };
      function log(message, type, courseCode) {
        state.logs.push({ message, type, courseCode });
      }
      function findAllTeachingClasses(courseCode) {
        state.fallbackCalls += 1;
        return state.teachingClasses;
      }
      ${helperSource}
      return { dropCourse };
    `,
  )(document, state);
}

class FakeElement {
  constructor(tagName, attrs = {}, ownText = "") {
    this.tagName = tagName.toUpperCase();
    this.attrs = attrs;
    this.ownText = ownText;
    this.children = [];
    this.parentElement = null;
    this.clicked = false;
    this.onclick = attrs.onclick ? () => {} : null;
  }

  append(...children) {
    for (const child of children) {
      child.parentElement = this;
      this.children.push(child);
    }
    return this;
  }

  get id() {
    return this.attrs.id || "";
  }

  get className() {
    return this.attrs.class || "";
  }

  get value() {
    return this.attrs.value || "";
  }

  get textContent() {
    return [this.ownText, ...this.children.map((child) => child.textContent)].join("");
  }

  getAttribute(name) {
    return this.attrs[name] || null;
  }

  click() {
    this.clicked = true;
    if (typeof this.onclick === "function") {
      this.onclick();
    }
  }

  matches(selector) {
    selector = selector.trim();
    if (!selector) return false;

    if (selector.includes(",")) {
      return selector.split(",").some((part) => this.matches(part));
    }

    if (selector === "*") return true;
    if (selector === "[onclick]") return Boolean(this.attrs.onclick || this.onclick);
    if (selector === '[role="dialog"]') return this.attrs.role === "dialog";
    if (selector === '[id^="right_"]') return this.id.startsWith("right_");
    if (selector === 'input[name="right_kchid"]') {
      return this.tagName === "INPUT" && this.attrs.name === "right_kchid";
    }
    if (selector === 'input[type="button"]') {
      return this.tagName === "INPUT" && this.attrs.type === "button";
    }
    if (selector.startsWith(".")) {
      return this.className.split(/\s+/).includes(selector.slice(1));
    }
    if (selector.includes(".")) {
      const [tag, className] = selector.split(".");
      return (
        this.tagName === tag.toUpperCase() &&
        this.className.split(/\s+/).includes(className)
      );
    }

    return this.tagName === selector.toUpperCase();
  }

  querySelectorAll(selector) {
    const selectors = selector.split(",").map((part) => part.trim());
    const results = [];

    const visit = (node) => {
      for (const child of node.children) {
        if (selectors.some((part) => child.matches(part))) {
          results.push(child);
        }
        visit(child);
      }
    };

    visit(this);
    return results;
  }

  querySelector(selector) {
    return this.querySelectorAll(selector)[0] || null;
  }

  closest(selector) {
    let current = this;
    while (current) {
      if (current.matches(selector)) {
        return current;
      }
      current = current.parentElement;
    }
    return null;
  }
}

function createSelectedCourse({ courseCode = "23006153", courseName = "法语综合实践(DELF)" } = {}) {
  const dropButton = new FakeElement(
    "button",
    {
      class: "btn btn-danger btn-sm",
      onclick: `cancelCourseZzxk('rightpage','JXB001','JXB001','${courseCode}','1','XKKZ001')`,
    },
    "退选",
  );

  const row = new FakeElement("li", {
    id: "right_JXB001",
    class: "list-group-item",
  }).append(new FakeElement("div", { class: "item" }).append(dropButton));

  const selectedCourse = new FakeElement("div", {
    id: `right_${courseCode}`,
    class: "outer_xkxx_list",
  }).append(
    new FakeElement("h6", {}, `(${courseCode})${courseName} - 2.0 学分`),
    new FakeElement("ul", { id: `right_ul_${courseCode}` }).append(
      new FakeElement("input", { name: "right_kchid", value: courseCode }),
      row,
    ),
  );

  return { selectedCourse, row, dropButton };
}

function createConfirmModal() {
  const confirmButton = new FakeElement("button", { "data-bb-handler": "ok" }, "确定");
  const modal = new FakeElement("div", { class: "bootbox", role: "dialog" }, "你是否退选").append(
    confirmButton,
  );
  return { modal, confirmButton };
}

test("findSelectedCourseRows finds a drop button from the selected-course right list", () => {
  const { findSelectedCourseRows } = loadCourseGrabberHelpers();
  const { selectedCourse, row, dropButton } = createSelectedCourse();
  const root = new FakeElement("div").append(selectedCourse);

  const matches = findSelectedCourseRows("23006153", root);

  assert.equal(matches.length, 1);
  assert.equal(matches[0].row, row);
  assert.equal(matches[0].button, dropButton);
});

test("findClickableElementByText prefers the inner clickable drop button", () => {
  const { findClickableElementByText } = loadCourseGrabberHelpers();
  const dropButton = new FakeElement("button", { onclick: "drop()" }, "退选");
  const clickableWrapper = new FakeElement("div", { onclick: "wrapper()" }).append(dropButton);
  const root = new FakeElement("div").append(clickableWrapper);

  const match = findClickableElementByText(root, "退选");

  assert.equal(match, dropButton);
});

test("dropCourse uses selected-course rows before falling back to teaching classes", async () => {
  const { selectedCourse, dropButton } = createSelectedCourse();
  const { modal, confirmButton } = createConfirmModal();
  const document = new FakeElement("div").append(selectedCourse, modal);
  const state = { fallbackCalls: 0, teachingClasses: [], logs: [] };
  const { dropCourse } = loadDropCourse(document, state);

  const result = await dropCourse("23006153");

  assert.equal(result, true);
  assert.equal(state.fallbackCalls, 0);
  assert.equal(dropButton.clicked, true);
  assert.equal(confirmButton.clicked, true);
});

test("dropCourse falls back to teaching classes when selected rows are absent", async () => {
  const dropButton = new FakeElement("button", { onclick: "drop()" }, "退选");
  const teachingRow = new FakeElement("tr", {}, "可退选教学班").append(dropButton);
  const { modal, confirmButton } = createConfirmModal();
  const document = new FakeElement("div").append(modal);
  const state = {
    fallbackCalls: 0,
    teachingClasses: [{ row: teachingRow, courseCode: "23006153" }],
    logs: [],
  };
  const { dropCourse } = loadDropCourse(document, state);

  const result = await dropCourse("23006153");

  assert.equal(result, true);
  assert.equal(state.fallbackCalls, 1);
  assert.equal(dropButton.clicked, true);
  assert.equal(confirmButton.clicked, true);
});

test("dropCourse refuses ambiguous course-name replacement matches", async () => {
  const first = createSelectedCourse({ courseCode: "23006153", courseName: "法语综合实践" });
  const second = createSelectedCourse({ courseCode: "23006156", courseName: "高级法语口语" });
  const { modal } = createConfirmModal();
  const document = new FakeElement("div").append(first.selectedCourse, second.selectedCourse, modal);
  const state = { fallbackCalls: 0, teachingClasses: [], logs: [] };
  const { dropCourse } = loadDropCourse(document, state);

  const result = await dropCourse("法语");

  assert.equal(result, false);
  assert.equal(state.fallbackCalls, 0);
  assert.equal(first.dropButton.clicked, false);
  assert.equal(second.dropButton.clicked, false);
  assert.equal(
    state.logs.some((entry) => entry.type === "warning" && entry.message.includes("匹配到多个已选课程")),
    true,
  );
});

test("dropCourse falls back when selected rows contain no clickable drop button", async () => {
  const row = new FakeElement("li", { id: "right_JXB001", class: "list-group-item" }, "退选");
  const fallbackDropButton = new FakeElement("button", { onclick: "drop()" }, "退选");
  const teachingRow = new FakeElement("tr", {}, "可退选教学班").append(fallbackDropButton);
  const selectedCourse = new FakeElement("div", {
    id: "right_23006153",
    class: "outer_xkxx_list",
  }).append(
    new FakeElement("h6", {}, "(23006153)法语综合实践(DELF) - 2.0 学分"),
    new FakeElement("ul", { id: "right_ul_23006153" }).append(
      new FakeElement("input", { name: "right_kchid", value: "23006153" }),
      row,
    ),
  );
  const { modal } = createConfirmModal();
  const document = new FakeElement("div").append(selectedCourse, modal);
  const state = {
    fallbackCalls: 0,
    teachingClasses: [{ row: teachingRow, courseCode: "23006153" }],
    logs: [],
  };
  const { dropCourse } = loadDropCourse(document, state);

  const result = await dropCourse("23006153");

  assert.equal(result, true);
  assert.equal(state.fallbackCalls, 1);
  assert.equal(fallbackDropButton.clicked, true);
  assert.equal(
    state.logs.some((entry) => entry.type === "warning" && entry.message.includes("未找到可点击的退选按钮")),
    true,
  );
});

test("dropCourse ignores misleading drop text when no real drop button exists", async () => {
  const misleadingButton = new FakeElement("button", { onclick: "cancelUndo()" }, "取消退选");
  const row = new FakeElement("li", { id: "right_JXB001", class: "list-group-item" }).append(
    misleadingButton,
  );
  const selectedCourse = new FakeElement("div", {
    id: "right_23006153",
    class: "outer_xkxx_list",
  }).append(
    new FakeElement("h6", {}, "(23006153)法语综合实践(DELF) - 2.0 学分"),
    new FakeElement("ul", { id: "right_ul_23006153" }).append(
      new FakeElement("input", { name: "right_kchid", value: "23006153" }),
      row,
    ),
  );
  const document = new FakeElement("div").append(selectedCourse);
  const state = { fallbackCalls: 0, teachingClasses: [], logs: [] };
  const { dropCourse } = loadDropCourse(document, state);

  const result = await dropCourse("23006153");

  assert.equal(result, false);
  assert.equal(misleadingButton.clicked, false);
});

test("dropCourse refuses ambiguous fallback matches for course names", async () => {
  const firstDropButton = new FakeElement("button", { onclick: "drop1()" }, "退选");
  const secondDropButton = new FakeElement("button", { onclick: "drop2()" }, "退选");
  const firstTeachingRow = new FakeElement("tr", {}, "法语综合实践").append(firstDropButton);
  const secondTeachingRow = new FakeElement("tr", {}, "高级法语口语").append(secondDropButton);
  const document = new FakeElement("div");
  const state = {
    fallbackCalls: 0,
    teachingClasses: [
      { row: firstTeachingRow, info: { className: "法语综合实践-0001" } },
      { row: secondTeachingRow, info: { className: "高级法语口语-0001" } },
    ],
    logs: [],
  };
  const { dropCourse } = loadDropCourse(document, state);

  const result = await dropCourse("法语");

  assert.equal(result, false);
  assert.equal(state.fallbackCalls, 1);
  assert.equal(firstDropButton.clicked, false);
  assert.equal(secondDropButton.clicked, false);
  assert.equal(
    state.logs.some((entry) => entry.type === "warning" && entry.message.includes("匹配到多个可退选教学班")),
    true,
  );
});

test("dropCourse rejects a fallback candidate that does not match the course name", async () => {
  const mathDropButton = new FakeElement("button", { onclick: "dropMath()" }, "退选");
  const mathTeachingRow = new FakeElement("tr", {}, "数学分析").append(mathDropButton);
  const document = new FakeElement("div");
  const state = {
    fallbackCalls: 0,
    teachingClasses: [{ row: mathTeachingRow, info: { className: "数学分析-0001" } }],
    logs: [],
  };
  const { dropCourse } = loadDropCourse(document, state);

  const result = await dropCourse("法语");

  assert.equal(result, false);
  assert.equal(mathDropButton.clicked, false);
  assert.equal(
    state.logs.some((entry) => entry.type === "warning" && entry.message.includes("未匹配替换课程")),
    true,
  );
});
