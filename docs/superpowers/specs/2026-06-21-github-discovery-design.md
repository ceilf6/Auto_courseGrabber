# GitHub Discovery Design

## Objective

Increase qualified discovery and the chance of a GitHub star for Auto_courseGrabber without claiming that every Zhengfang deployment or every university is compatible with this script.

## Evidence model

The public evidence must stay separate from script compatibility.

1. **Official teaching-platform confirmation** — a 2025–2026 university source explicitly identifies a Zhengfang teaching or course-selection platform.
2. **Official Zhengfang public customer** — a school logo is publicly displayed on Zhengfang's current customer page. This confirms a Zhengfang customer relationship, not the selected-course page or this script's compatibility.
3. **Community-tested compatibility** — a report identifies the university, a non-sensitive system URL or system version, the script revision, validation date, and result. Only this tier may say that the script was tested at a school.

The repository will never promote tier 1 or tier 2 to tier 3 automatically.

## Content architecture

`README.md` becomes the conversion page. Its first screen must state the exact product, eligible site family, key capabilities, a short start path, a safe-use reminder, and a compact FAQ that answers the phrases prospective users search for.

`docs/zhengfang-university-coverage.md` becomes the evidence inventory. It records the two public tiers with source links and a blank community-tested table. The 23 currently displayed Zhengfang customer logos are treated as one complete, dated set from that public page, not a complete customer directory.

`docs/github-metadata.md` records the manually applied GitHub Description and Topics. It also distinguishes GitHub repository metadata from tracked repository files.

`.github/ISSUE_TEMPLATE/compatibility-report.md` provides a structured, credential-safe way to collect the third evidence tier.

## Search and GEO approach

Use terms only where they answer a concrete user question: 正方教务系统自动选课、正方教务系统抢课脚本、定时选课、课程名或课程号选课、教师筛选、时间筛选、换课 and 新正方教务管理系统. School names appear only in the provenance inventory, where they are qualified by evidence type.

The README should contain direct answers to: what the script does, whether a school is supported, how to determine compatibility, and how to report a result. This makes the repository easy to quote accurately in search and generative answers.

## Non-goals

- Do not claim support for all 1,600+ Zhengfang customers.
- Do not publish credentials, private system URLs, request payloads, or instructions for bypassing authentication.
- Do not update remote GitHub metadata without a separate explicit remote-edit request.

## Verification

- Review all school names against the current official Zhengfang customer-page logos.
- Check the two direct teaching-platform entries against 2025–2026 school sources.
- Run `git diff --check` and scan new Markdown for placeholder text and unqualified compatibility claims.
