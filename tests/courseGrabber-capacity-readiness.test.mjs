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

function loadCapacityHelpers(windowObject = {}) {
  const helperSource = [
    extractFunction("isCourseCode"),
    extractFunction("parseCapacityText"),
    extractFunction("getRowDoJxbId"),
    extractFunction("getTeachingClassReadiness"),
    extractFunction("checkTeachingClassCapacity"),
  ].join("\n");

  return Function(
    "window",
    `
      const TARGET_COURSES = [
        { code: "TIME_FILTERED", timeFilter: ["星期一"] },
        { code: "TEACHER_FILTERED", teacherFilter: ["张三"] },
      ];
      const GLOBAL_TIME_FILTER = [];
      const GLOBAL_TEACHER_FILTER = [];
      ${helperSource}
      return {
        isCourseCode,
        parseCapacityText,
        getRowDoJxbId,
        getTeachingClassReadiness,
        checkTeachingClassCapacity,
      };
    `,
  )(windowObject);
}

class FakeRow {
  constructor({ doJxbId = "", fullStyle = null, onclickText = "" } = {}) {
    this.doJxbId = doJxbId;
    this.fullElement = fullStyle ? { style: fullStyle } : null;
    this.onclickText = onclickText;
    this.textContent = "";
    this.innerText = "";
  }

  querySelector(selector) {
    if (selector.includes("do_jxb_id") && this.doJxbId) {
      return { textContent: this.doJxbId };
    }
    if (selector.includes(".full") && this.fullElement) {
      return this.fullElement;
    }
    return null;
  }

  querySelectorAll(selector) {
    if (selector.includes("[onclick]") && this.onclickText) {
      return [
        {
          getAttribute: (name) => (name === "onclick" ? this.onclickText : ""),
        },
      ];
    }
    return [];
  }
}

function createTeachingClass({ capacity = "10/50", row = new FakeRow({ doJxbId: "do_1" }), timeInfo = "星期一第1-2节", teacher = "【张三】" } = {}) {
  return {
    row,
    info: {
      capacity,
      timeInfo,
      teacher,
      className: "测试教学班-0001",
    },
  };
}

test("isCourseCode keeps the strict numeric course-code boundary", () => {
  const { isCourseCode } = loadCapacityHelpers();

  assert.equal(isCourseCode("23005523"), true);
  assert.equal(isCourseCode("CS102"), false);
  assert.equal(isCourseCode("C语言程序设计2"), false);
  assert.equal(isCourseCode("AI2"), false);
});

test("parseCapacityText marks full and invalid capacity text conservatively", () => {
  const { parseCapacityText } = loadCapacityHelpers();

  const cases = [
    ["10/50", { valid: true, selected: 10, total: 50, full: false }],
    ["50/50", { valid: true, selected: 50, total: 50, full: true }],
    ["139/48", { valid: true, selected: 139, total: 48, full: true }],
    ["42/0", { valid: true, selected: 42, total: 0, full: true }],
    ["已满", { valid: true, selected: 0, total: 0, full: true }],
    ["", { valid: false, selected: 0, total: 0, full: false }],
    ["未知容量", { valid: false, selected: 0, total: 0, full: false }],
  ];

  for (const [input, expected] of cases) {
    assert.deepEqual(parseCapacityText(input), expected);
  }
});

test("getTeachingClassReadiness blocks incomplete teaching-class data before clicking", () => {
  const { getTeachingClassReadiness } = loadCapacityHelpers();

  assert.equal(getTeachingClassReadiness(createTeachingClass(), "NORMAL").ready, true);
  assert.equal(
    getTeachingClassReadiness(createTeachingClass({ row: new FakeRow() }), "NORMAL").reason,
    "教学班提交ID尚未加载完成",
  );
  assert.equal(
    getTeachingClassReadiness(createTeachingClass({ capacity: "42/0" }), "NORMAL").reason,
    "容量尚未加载完成或为0（42/0）",
  );
  assert.equal(
    getTeachingClassReadiness(createTeachingClass({ capacity: "未知容量" }), "NORMAL").reason,
    "容量信息尚未加载完成",
  );
});

test("getTeachingClassReadiness waits for filter fields when filters are configured", () => {
  const { getTeachingClassReadiness } = loadCapacityHelpers();

  assert.equal(
    getTeachingClassReadiness(createTeachingClass({ timeInfo: "未知时间" }), "TIME_FILTERED").reason,
    "上课时间尚未加载完成，暂不执行时间过滤",
  );
  assert.equal(
    getTeachingClassReadiness(createTeachingClass({ teacher: "未知教师" }), "TEACHER_FILTERED").reason,
    "教师信息尚未加载完成，暂不执行教师过滤",
  );
});

test("checkTeachingClassCapacity combines parsed capacity with visible full marker", () => {
  const { checkTeachingClassCapacity } = loadCapacityHelpers({
    getComputedStyle(element) {
      return element.style || { display: "none", visibility: "hidden" };
    },
  });

  assert.equal(checkTeachingClassCapacity(createTeachingClass({ capacity: "10/50" })), true);
  assert.equal(checkTeachingClassCapacity(createTeachingClass({ capacity: "139/48" })), false);
  assert.equal(checkTeachingClassCapacity(createTeachingClass({ capacity: "未知容量" })), false);
  assert.equal(
    checkTeachingClassCapacity(createTeachingClass({
      capacity: "10/50",
      row: new FakeRow({ doJxbId: "do_1", fullStyle: { display: "block", visibility: "visible" } }),
    })),
    false,
  );
  assert.equal(
    checkTeachingClassCapacity(createTeachingClass({
      capacity: "10/50",
      row: new FakeRow({ doJxbId: "do_1", fullStyle: { display: "none", visibility: "hidden" } }),
    })),
    true,
  );
});

test("getRowDoJxbId can recover the submit id from chooseCourseZzxk onclick", () => {
  const { getRowDoJxbId } = loadCapacityHelpers();

  const row = new FakeRow({
    onclickText: "chooseCourseZzxk('rightpage','DO_JXB_2','JXB001')",
  });

  assert.equal(getRowDoJxbId(row), "DO_JXB_2");
});
