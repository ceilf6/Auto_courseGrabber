// ====================
// 一、用户配置（必须严格遵守）
// ====================
const targets = [
    {
        className: '23286513', // 教学班编号（必填）
        teacher: 'Antoine JOUGLET', // 教师姓名（可选）
        time: '星期二第9-11节{9-16周}' // 上课时间（可选）
    },
    {
        className: '',
        teacher: '',
        time: ''
    }
];

// ====================
// 二、运行配置
// ====================
const options = {
    // 是否真的点击“选课”（false=演练 dry-run；true=真实点击 real-run）
    realRun: true,
    // 是否轮询（true=持续扫描；false=只扫描一次）
    polling: true,
    // 轮询间隔（毫秒）
    intervalMs: 1500,
    // 是否打印每条教学班扫描日志（true=更详细，false=更安静）
    verboseScanLog: true,
    // 防重复点击同一教学班（同一 key 仅触发一次）
    preventRepeatClick: true,
    // 扫描范围优先使用 #contentBox（常见于自主选课页面），找不到再退化到全局
    preferRootSelector: '#contentBox'
};

(() => {
    const LOG_PREFIX = '[抢课脚本]';

    function log(message) {
        try {
            console.log(LOG_PREFIX, String(message));
        } catch (_) {
            // ignore
        }
    }

    function safeText(node) {
        try {
            return (node && node.textContent ? node.textContent : '').replace(/\s+/g, ' ').trim();
        } catch (_) {
            return '';
        }
    }

    function normalize(s) {
        return (s ?? '').toString().replace(/\s+/g, ' ').trim();
    }

    function includesMatch(haystack, needle) {
        const h = normalize(haystack);
        const n = normalize(needle);
        if (!n) return true;
        return h.includes(n);
    }

    function isElementVisible(el) {
        if (!el || !(el instanceof Element)) return false;
        const style = window.getComputedStyle(el);
        if (!style) return true;
        if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
    }

    function isClickable(el) {
        if (!el || !(el instanceof Element)) return false;
        if (!isElementVisible(el)) return false;
        const disabledAttr = el.getAttribute('disabled');
        const ariaDisabled = el.getAttribute('aria-disabled');
        const className = el.className ? String(el.className) : '';
        if (disabledAttr != null) return false;
        if (ariaDisabled === 'true') return false;
        if (/(^|\s)disabled(\s|$)/i.test(className)) return false;
        return true;
    }

    function parseFirstInt(text) {
        const m = normalize(text).match(/(\d+)/);
        return m ? Number(m[1]) : null;
    }

    function parseSelectedCapacity(text) {
        const t = normalize(text);

        // 形如：10/30 或 10 / 30
        let m = t.match(/\b(\d+)\s*\/\s*(\d+)\b/);
        if (m) return { selected: Number(m[1]), capacity: Number(m[2]) };

        // 形如：已选 10 容量 30
        const sel = (() => {
            const mm = t.match(/已选\D*(\d+)/);
            return mm ? Number(mm[1]) : null;
        })();
        const cap = (() => {
            const mm = t.match(/(容量|限选|上限|人数上限)\D*(\d+)/);
            return mm ? Number(mm[2]) : null;
        })();
        if (sel != null && cap != null) return { selected: sel, capacity: cap };

        // 形如：余量 5 容量 30
        const rem = (() => {
            const mm = t.match(/余量\D*(\d+)/);
            return mm ? Number(mm[1]) : null;
        })();
        if (rem != null && cap != null) {
            const selected = Math.max(0, cap - rem);
            return { selected, capacity: cap };
        }

        return { selected: null, capacity: null };
    }

    function pickButtonByText(container) {
        if (!container || !(container instanceof Element)) return null;
        const candidates = Array.from(container.querySelectorAll('button, a, input[type="button"], input[type="submit"]'));

        const getLabel = (el) => {
            if (!el) return '';
            if (el.tagName === 'INPUT') return normalize(el.getAttribute('value') || '');
            return normalize(el.textContent || el.getAttribute('title') || el.getAttribute('aria-label') || '');
        };

        const isSelectLabel = (label) => {
            if (!label) return false;
            // 排除退课/取消等
            if (/退|取消|撤销|删除|移除/.test(label)) return false;
            return /选课|选\s*上|选择|加入|提交/.test(label);
        };

        // 优先匹配文本
        const byText = candidates
            .map((el) => ({ el, label: getLabel(el) }))
            .filter((x) => isSelectLabel(x.label))
            .map((x) => x.el)
            .filter(isClickable);

        if (byText.length > 0) return byText[0];

        // 退化：查找可能的“操作列”区域
        const possible = candidates.filter((el) => {
            const label = getLabel(el);
            if (!label) return false;
            return /选|加/.test(label) && !/退|取消|撤销|删除|移除/.test(label);
        }).filter(isClickable);

        return possible[0] || null;
    }

    function getPreferredRoot() {
        const root = document.querySelector(options.preferRootSelector);
        if (root) return root;
        return document.body || document.documentElement;
    }

    function findTeachingClassNodes(root) {
        const r = root || document.body;
        const nodes = [];

        // 1) jqGrid 表格行（常见：tr.jqgrow）
        try {
            const jqRows = Array.from(r.querySelectorAll('table.ui-jqgrid-btable tr.jqgrow'));
            nodes.push(...jqRows);
        } catch (_) { }

        // 2) 常见列表项（卡片/列表）
        try {
            const listItems = Array.from(r.querySelectorAll('.item-list > li, ul.list-group > li.list-group-item, li.list-group-item'));
            nodes.push(...listItems);
        } catch (_) { }

        // 3) 兜底：表格行
        try {
            const tableRows = Array.from(r.querySelectorAll('table tbody tr')).filter((tr) => {
                const t = safeText(tr);
                return t && t.length >= 6;
            });
            nodes.push(...tableRows);
        } catch (_) { }

        // 去重
        const uniq = [];
        const seen = new Set();
        for (const n of nodes) {
            if (!n || !(n instanceof Element)) continue;
            const key = n;
            if (seen.has(key)) continue;
            seen.add(key);
            uniq.push(n);
        }
        return uniq;
    }

    function extractInfoFromNode(node) {
        // 尽量从常见 class 中提取
        const classNameNode = node.querySelector?.('.jxb, .jxbmc, .popover-demo[title]') || null;
        const teacherNode = node.querySelector?.('.teachers, .teacher, [data-teacher]') || null;
        const timeNode = node.querySelector?.('.time, .sksj, [data-time]') || null;

        let className = '';
        let teacher = '';
        let time = '';

        if (classNameNode) {
            className = normalize(classNameNode.getAttribute('title') || safeText(classNameNode));
        }
        if (teacherNode) {
            teacher = normalize(teacherNode.getAttribute('title') || safeText(teacherNode));
        }
        if (timeNode) {
            time = normalize(timeNode.getAttribute('title') || safeText(timeNode));
        }

        // jqGrid 场景：尝试按 aria-describedby / 表头文本推断
        if ((!className || !teacher || !time) && node.tagName === 'TR') {
            try {
                const tds = Array.from(node.querySelectorAll('td'));
                const tdTexts = tds.map((td) => normalize(td.textContent));
                const tdDescs = tds.map((td) => normalize(td.getAttribute('aria-describedby') || ''));

                const pickByDesc = (regexList) => {
                    for (let i = 0; i < tdDescs.length; i++) {
                        for (const re of regexList) {
                            if (re.test(tdDescs[i])) return tdTexts[i];
                        }
                    }
                    return '';
                };

                if (!className) {
                    className = pickByDesc([/jxb/i, /jxbmc/i, /jx?b/i, /jxbm/i, /jxb_name/i, /jxbmc/i]);
                }
                if (!teacher) {
                    teacher = pickByDesc([/js/i, /xm\b/i, /teacher/i, /skjs/i, /rkjs/i]);
                }
                if (!time) {
                    time = pickByDesc([/sksj/i, /skjc/i, /time/i, /sjjc/i]);
                }
            } catch (_) {
                // ignore
            }
        }

        // 如果还缺，兜底用整条文本
        const rawText = safeText(node);
        if (!className) {
            // 尝试从“教学班/班级/班号”附近提取
            const m = rawText.match(/教学班\s*[:：]?\s*([^\s,，;；]+)/);
            className = m ? normalize(m[1]) : '';
        }
        if (!teacher) {
            const m = rawText.match(/教师\s*[:：]?\s*([^\s,，;；]+)/);
            teacher = m ? normalize(m[1]) : '';
        }
        if (!time) {
            const m = rawText.match(/上课时间\s*[:：]?\s*([^\n]+)/);
            time = m ? normalize(m[1]) : '';
        }

        const { selected, capacity } = parseSelectedCapacity(rawText);
        const button = pickButtonByText(node);

        return {
            className: normalize(className),
            teacher: normalize(teacher),
            time: normalize(time),
            selected,
            capacity,
            button,
            rawText
        };
    }

    function matchesTarget(info, target) {
        if (!target || !target.className) return false;
        if (!includesMatch(info.className || info.rawText, target.className)) return false;
        if (target.teacher && !includesMatch(info.teacher || info.rawText, target.teacher)) return false;
        if (target.time && !includesMatch(info.time || info.rawText, target.time)) return false;
        return true;
    }

    function makeDedupKey(info, target) {
        const base = [
            normalize(target?.className || ''),
            normalize(target?.teacher || ''),
            normalize(target?.time || ''),
            normalize(info.className || ''),
            normalize(info.teacher || ''),
            normalize(info.time || '')
        ].join('|');
        return base || normalize(info.rawText).slice(0, 120);
    }

    const state = window.__COURSE_GRABBER__ || (window.__COURSE_GRABBER__ = {});
    state._clickedKeys = state._clickedKeys || new Set();
    state._timer = state._timer || null;

    function scanOnce() {
        const root = getPreferredRoot();

        if (!Array.isArray(targets) || targets.length === 0) {
            log('targets 为空：请先在脚本顶部配置要抢的教学班');
            return;
        }

        const nodes = findTeachingClassNodes(root);
        if (!nodes || nodes.length === 0) {
            log('未找到可扫描的教学班列表 DOM（可能需要先在页面执行查询/展开列表）');
            return;
        }

        log(`开始扫描：候选 DOM 数=${nodes.length}，realRun=${options.realRun}，intervalMs=${options.intervalMs}`);

        for (const node of nodes) {
            let info;
            try {
                info = extractInfoFromNode(node);
            } catch (e) {
                log(`解析教学班信息失败：${e && e.message ? e.message : String(e)}`);
                continue;
            }

            const short = `教学班=${info.className || '（未知）'} | 教师=${info.teacher || '（未知）'} | 时间=${info.time || '（未知）'}`;
            const capText = `人数=${info.selected == null ? '?' : info.selected}/${info.capacity == null ? '?' : info.capacity}`;

            if (options.verboseScanLog) {
                log(`扫描到：${short} | ${capText}`);
            }

            for (const target of targets) {
                if (!matchesTarget(info, target)) continue;

                log(`命中目标：${short} | ${capText}`);

                // 选课判断：已选人数 < 课程容量
                if (info.selected == null || info.capacity == null) {
                    log(`未触发选课：无法解析已选人数/容量（请确认列表中是否展示了“已选/容量/余量”等信息）`);
                    continue;
                }
                if (!(info.selected < info.capacity)) {
                    log(`未触发选课：已满（${info.selected}/${info.capacity}）`);
                    continue;
                }

                if (!info.button) {
                    log('未触发选课：未找到“选课”按钮');
                    continue;
                }
                if (!isClickable(info.button)) {
                    log('未触发选课：按钮不可点击（disabled/不可见）');
                    continue;
                }

                // 防重复点击
                const key = makeDedupKey(info, target);
                if (options.preventRepeatClick) {
                    const already = state._clickedKeys.has(key) || (node.dataset && node.dataset.__courseGrabberClicked === '1');
                    if (already) {
                        log('未触发选课：已点击过该教学班（防重复）');
                        continue;
                    }
                }

                if (!options.realRun) {
                    log(`dry-run：满足条件，将会点击按钮 -> ${normalize(info.button.textContent || info.button.value || '按钮')}`);
                    // dry-run 也记录，避免刷屏
                    if (options.preventRepeatClick) {
                        state._clickedKeys.add(key);
                        if (node.dataset) node.dataset.__courseGrabberClicked = '1';
                    }
                    continue;
                }

                try {
                    log(`执行选课：点击按钮 -> ${normalize(info.button.textContent || info.button.value || '按钮')}`);
                    info.button.click();

                    if (options.preventRepeatClick) {
                        state._clickedKeys.add(key);
                        if (node.dataset) node.dataset.__courseGrabberClicked = '1';
                    }
                } catch (e) {
                    log(`点击失败：${e && e.message ? e.message : String(e)}`);
                }
            }
        }
    }

    function start() {
        stop();
        if (!options.polling) {
            scanOnce();
            return;
        }
        scanOnce();
        state._timer = window.setInterval(scanOnce, Math.max(300, Number(options.intervalMs) || 1500));
        log('已启动轮询。停止请执行：__COURSE_GRABBER__.stop()');
    }

    function stop() {
        if (state._timer) {
            window.clearInterval(state._timer);
            state._timer = null;
            log('已停止轮询');
        }
    }

    // 暴露控制台命令
    state.scanOnce = scanOnce;
    state.start = start;
    state.stop = stop;
    state.setRealRun = (v) => {
        options.realRun = !!v;
        log(`realRun=${options.realRun}`);
    };
    state.clearClicked = () => {
        state._clickedKeys = new Set();
        log('已清空防重复点击记录');
    };

    // 自动启动
    start();
})();

