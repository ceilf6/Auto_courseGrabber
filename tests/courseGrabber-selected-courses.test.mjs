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

function loadCourseGrabberHelpers() {
  const helperSource = [
    extractFunction("isCourseCode"),
    extractFunction("isElementClickable"),
    extractFunction("findClickableElementByText"),
    extractFunction("findSelectedCourseRows"),
  ].join("\n");

  return Function(`${helperSource}\nreturn { findSelectedCourseRows };`)();
}

class FakeElement {
  constructor(tagName, attrs = {}, ownText = "") {
    this.tagName = tagName.toUpperCase();
    this.attrs = attrs;
    this.ownText = ownText;
    this.children = [];
    this.parentElement = null;
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

  matches(selector) {
    selector = selector.trim();
    if (!selector) return false;

    if (selector.includes(",")) {
      return selector.split(",").some((part) => this.matches(part));
    }

    if (selector === "*") return true;
    if (selector === "[onclick]") return Boolean(this.attrs.onclick || this.onclick);
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

test("findSelectedCourseRows finds a drop button from the selected-course right list", () => {
  const { findSelectedCourseRows } = loadCourseGrabberHelpers();

  const dropButton = new FakeElement(
    "button",
    {
      class: "btn btn-danger btn-sm",
      onclick:
        "cancelCourseZzxk('rightpage','JXB001','JXB001','23006153','1','XKKZ001')",
    },
    "退选",
  );

  const row = new FakeElement("li", {
    id: "right_JXB001",
    class: "list-group-item",
  }).append(new FakeElement("div", { class: "item" }).append(dropButton));

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

  const root = new FakeElement("div").append(selectedCourse);

  const matches = findSelectedCourseRows("23006153", root);

  assert.equal(matches.length, 1);
  assert.equal(matches[0].row, row);
  assert.equal(matches[0].button, dropButton);
});
