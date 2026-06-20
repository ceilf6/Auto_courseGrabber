# GitHub Discovery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the repository easier to discover and trust through an evidence-backed README, a maintainable Zhengfang university coverage inventory, actionable GitHub metadata, and a compatibility-report template.

**Architecture:** Keep the README focused on conversion and concrete answers. Put source-heavy university coverage in a dedicated document, preserve the distinction between vendor customers and this script's tested compatibility, and collect future evidence through a structured GitHub issue.

**Tech Stack:** GitHub-flavored Markdown and GitHub issue templates; no runtime code or dependencies.

---

### Task 1: Reframe README discovery content

**Files:**
- Modify: `README.md`

- [x] **Step 1: Replace the title and introductory paragraph with the product's searchable definition**

Use the heading `# 正方教务系统自动抢课脚本｜并发选课、筛选、换课与定时执行` and state that the JavaScript helper is for Zhengfang course-selection pages. Include links to the coverage inventory and metadata checklist.

- [x] **Step 2: Add a concise "适用范围与兼容性" section before features**

State the three evidence tiers and explicitly say that a Zhengfang customer relationship is not a script-compatibility guarantee.

- [x] **Step 3: Add an answer-first FAQ near the end of the README**

Answer the search questions about supported schools, how to check a page, timed enrollment, teacher/time filtering, and how to submit a compatibility result. Use the search terms in answers, not a keyword dump.

- [x] **Step 4: Add a contribution CTA after the FAQ**

Ask a user who benefited from the project to star it and submit a redacted compatibility report. Do not request sensitive information.

### Task 2: Add source-backed university coverage

**Files:**
- Create: `docs/zhengfang-university-coverage.md`

- [x] **Step 1: Write the evidence definitions and update rule**

Define the three tiers, the 2026-06-21 verification date, and the rule that only community-tested reports support a script-compatibility claim.

- [x] **Step 2: Record direct teaching-platform confirmations**

Add Shanghai University and Hangzhou Dianzi University with their official 2025–2026 evidence links. Do not include a school in this table unless the source explicitly identifies a Zhengfang teaching platform.

- [x] **Step 3: Enumerate all 23 client logos on Zhengfang's current public customer page**

List the 23 schools as official Zhengfang public customers with one shared source link. Add a note that this is the complete visible logo set as of the verification date, not the vendor's complete 1,600+ customer list.

- [x] **Step 4: Add an empty community-tested compatibility table and submission requirements**

Require school name, system release or public entry type, script commit/version, test date, and result; prohibit credentials and private data.

### Task 3: Add manual GitHub metadata and evidence collection instructions

**Files:**
- Create: `docs/github-metadata.md`
- Create: `.github/ISSUE_TEMPLATE/compatibility-report.md`

- [x] **Step 1: Record the exact GitHub Description and Topics**

Document the Chinese-first bilingual description and a focused list of topics. State that these must be set in the GitHub repository UI or by an explicitly authorized remote command.

- [x] **Step 2: Create a credential-safe compatibility-report issue template**

Ask for the school, province, platform generation/version if known, non-sensitive entry URL or page characteristics, script revision, validation date, result, and a redacted error or screenshot. Include a mandatory reminder not to publish credentials, tokens, student data, or private URLs.

### Task 4: Verify document integrity and claim boundaries

**Files:**
- Verify: `README.md`
- Verify: `docs/zhengfang-university-coverage.md`
- Verify: `docs/github-metadata.md`
- Verify: `.github/ISSUE_TEMPLATE/compatibility-report.md`

- [x] **Step 1: Run whitespace validation**

Run: `git diff --check`

Expected: no output and exit code 0.

- [x] **Step 2: Scan for placeholder and overclaiming language**

Run: `rg -n --glob '!docs/superpowers/plans/**' 'TODO|TBD|全部兼容|均已兼容|保证兼容' README.md docs .github`

Expected: no matches.

- [x] **Step 3: Inspect the final diff**

Run: `git diff -- README.md docs .github`

Expected: only discovery, source-provenance, metadata, and compatibility-report documentation changes.
