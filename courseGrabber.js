// 仓库地址（持续维护、更新中）: https://github.com/ceilf6/Auto_courseGrabber
// https://github.com/ceilf6
// https://blog.csdn.net/2301_78856868

// 使用方法:
// 1. 登录教务系统并进入选课页面
// 2. 配置目标课程列表 TARGET_COURSES（现在已经支持UI界面，所以在UI界面上配置也没事）
// 3. 按F12打开控制台，粘贴此脚本并执行
// 4. 输入 grab.start() 开始抢课

// 注意!!! 目标课程得在页面中出现（可以在不是选课时间到目标课程展示的页面并打开定时开抢功能、教学班卡片信息本脚本已经自动实现展开所以不重要），DOM树一定得展开否则无法找到 !!!

(function () {
    // ========= 防止重复粘贴/重复执行 =========
    const __CG_GLOBAL__ = (typeof window !== 'undefined' ? window : globalThis);
    const __CG_LOADED_KEY__ = '__AUTO_COURSE_GRABBER_LOADED__';
    const __CG_INSTANCE_KEY__ = '__AUTO_COURSE_GRABBER_INSTANCE_ID__';
    const __CG_REFRESH_LOCK_KEY__ = '__AUTO_COURSE_GRABBER_LAST_REFRESH_AT__';

    if (__CG_GLOBAL__[__CG_LOADED_KEY__]) {
        try {
            // 尝试停止旧实例（如果旧实例仍挂在 window.grab 上）
            if (__CG_GLOBAL__.grab && typeof __CG_GLOBAL__.grab.stop === 'function') {
                __CG_GLOBAL__.grab.stop();
            }
        } catch (e) {
            // 忽略停止失败
        }
        console.warn('[抢课脚本] 检测到脚本已加载过一次：已尝试停止旧实例，并将覆盖为新实例。');
    }

    __CG_GLOBAL__[__CG_LOADED_KEY__] = true;
    __CG_GLOBAL__[__CG_INSTANCE_KEY__] = `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    'use strict';

    // ========== 配置参数 ==========
    // 支持多门课程同时抢课，格式: [{code: '课程号或课程名称', priority: 优先级, timeFilter: 时间过滤, teacherFilter: 教师过滤}]
    // code 字段支持两种输入方式：
    //   1. 课程号（纯数字）：如 '23286514'
    //   2. 课程名称（包含中文）：如 '机器学习'、'计算机控制'
    const TARGET_COURSES = [
        // 示例配置:
        // { code: '23286514', priority: 1 },  // 使用课程号，高优先级，无过滤
        // { code: '机器学习', priority: 1 },  // 使用课程名称，高优先级，无过滤
        // { code: 'CS102', priority: 2, timeFilter: ['星期一', '星期三'] },  // 只选星期一或星期三的课
        // { code: 'CS103', priority: 3, teacherFilter: ['张三', '李四'] }   // 只选张三或李四的课
        // { code: 'CS104', priority: 4, timeFilter: ['第1-2节'], teacherFilter: ['王五'] }  // 同时过滤时间和教师
    ];

    const CHECK_INTERVAL = 1000;            // 检查间隔(毫秒)
    const MAX_ATTEMPTS = 3000;              // 最大尝试次数
    const MAX_FAILED_ATTEMPTS = 10;          // 最大连续失败次数
    const RETRY_DELAY = 3000;               // 重试延迟(毫秒)
    const CONCURRENT_ENABLED = true;        // 是否启用并发抢课
    const CLICK2EXPEND_ENABLED = true;     // 用户设置: 是否在 jQuery 后自动展开目标课程信息，用于时间筛选和教师筛选
    
    let click2expend_enabled = true;       // 用于脚本自动关闭

    // ========== 过滤器配置 ==========
    // 全局时间过滤器（可选）- 留空表示不过滤，支持多个关键词，满足任意一个即可
    // 示例: ['星期一', '星期三', '第1-2节', '第11-12节']
    const GLOBAL_TIME_FILTER = [];

    // 全局教师过滤器（可选）- 留空表示不过滤，支持多个关键词，满足任意一个即可
    // 示例: ['张三', '张三', '讲师']
    const GLOBAL_TEACHER_FILTER = [];

    // ========== 全局状态管理 ==========
    let attemptCount = 0;
    let isRunning = false;
    let intervalId = null;
    let refreshInProgress = false;          // 避免刷新分支在 attemptCount 未变化时被重复触发
    let refreshTimeoutId = null;            // 刷新后延迟抢课的 timeout

    // 多课程状态管理
    let courseStates = new Map();           // 每门课程的状态: {courseCode: {attempts, failed, tried, conflicted, selecting, success}}
    let selectedCourses = new Set();        // 已成功选上的课程
    let activeCourses = new Set();          // 当前活跃的课程列表

    // 全局选课队列
    let selectingQueue = [];                // 正在处理的选课任务队列
    let isProcessingQueue = false;          // 是否正在处理队列

    // 定时开抢相关
    let scheduledTime = null;               // 计划开抢时间
    let schedulerIntervalId = null;         // 定时器ID
    let isScheduled = false;                // 是否已设置定时

    // ========== 工具函数 ==========

    /**
     * 安全的字符串分割与过滤函数
     * 避免使用可能被页面/库篡改的 Array.prototype.filter
     * @param {string} input - 原始输入字符串
     * @param {RegExp} [separatorRegex=/[，,;；]+/] - 分隔符正则
     * @returns {string[]} - 过滤后的非空字符串数组
     */
    function safeParseFilterInput(input, separatorRegex = /[，,;；]+/) {
        if (!input || typeof input !== 'string') {
            return [];
        }

        const raw = input.trim();
        if (!raw) {
            return [];
        }

        // 分割字符串
        const splitResult = raw.split(separatorRegex);

        // 手动 trim 每个元素
        const trimmed = [];
        for (let i = 0; i < splitResult.length; i++) {
            try {
                trimmed.push(splitResult[i].trim());
            } catch (e) {
                trimmed.push(String(splitResult[i]));
            }
        }

        // 手动过滤空字符串，避免使用被篡改的 Array.prototype.filter
        const filtered = [];
        for (let i = 0; i < trimmed.length; i++) {
            try {
                const v = '' + trimmed[i];
                if (v && v.length > 0) {
                    filtered.push(v);
                }
            } catch (e) {
                // 忽略无法处理的项
            }
        }

        return filtered;
    }

    /**
     * 判断输入是否为课程号（纯数字）
     * @param {string} input - 用户输入
     * @returns {boolean} - 是否为课程号
     */
    function isCourseCode(input) {
        return /^\d+$/.test(String(input).trim());
    }

    /**
     * 从教学班名称中提取课程名称
     * 教学班名称格式：课程名称-0001
     * @param {string} jxbmc - 教学班名称
     * @returns {string} - 课程名称
     */
    function extractCourseNameFromJxbmc(jxbmc) {
        if (!jxbmc) return '';
        // 移除末尾的 -数字 部分
        const match = jxbmc.match(/^(.+)-\d+$/);
        return match ? match[1].trim() : jxbmc.trim();
    }

    /**
     * 展开课程详情（支持课程号和课程名称）
     * @param {string} courseCodeOrName - 课程号或课程名称
     * @returns {boolean} - 是否成功展开
     */
    function expandCourseByCode(courseCodeOrName) {
        // 找所有课程头
        const heads = document.querySelectorAll('.panel-heading.kc_head');
        const input = String(courseCodeOrName).trim();
        const isCode = isCourseCode(input);

        for (let head of heads) {
            let matched = false;

            if (isCode) {
                // 按课程号匹配
                const codeInput = head.querySelector('input[name="kch_id"]');
                if (codeInput && codeInput.value === input) {
                    matched = true;
                }
            } else {
                // 按课程名称匹配
                // 课程名称在 span.kcmc 下的 <a> 标签内，格式：(课程号)课程名称
                const kcmcSpan = head.querySelector('span.kcmc');
                if (kcmcSpan) {
                    const kcmcLink = kcmcSpan.querySelector('a');
                    if (kcmcLink) {
                        const courseName = kcmcLink.textContent.trim();
                        // 精确匹配或包含匹配
                        if (courseName === input || courseName.includes(input)) {
                            matched = true;
                        }
                    }
                }
            }

            if (matched) {
                // 直接触发 click（等价于用户点击）
                head.click();
                return true;
            }
        }
        return false;
    }

    function forceExpandTargetCourses() {
        const targets = new Set([
            ...activeCourses,
            ...TARGET_COURSES.map(c => typeof c === 'string' ? c : c.code)
        ]);

        targets.forEach(code => {
            expandCourseByCode(code);
        });
    }

    function forceExpandTargetCoursesAggressive() {
        let count = 0;
        const timer = setInterval(() => {
            forceExpandTargetCourses();
            if (++count >= 3) clearInterval(timer);
        }, 300);
    }

    // 彩色日志函数
    function log(message, type = 'info', courseCode = null) {
        const timestamp = new Date().toLocaleTimeString();
        const courseTag = courseCode ? `[${courseCode}]` : '';
        const prefix = `[抢课脚本 ${timestamp}]${courseTag}`;

        switch (type) {
            case 'success':
                console.log(`%c${prefix} ✅ ${message}`, 'color: #00ff00; font-weight: bold;');
                break;
            case 'error':
                console.log(`%c${prefix} ❌ ${message}`, 'color: #ff0000; font-weight: bold;');
                break;
            case 'warning':
                console.log(`%c${prefix} ⚠️ ${message}`, 'color: #ffa500; font-weight: bold;');
                break;
            case 'info':
                console.log(`%c${prefix} ℹ️ ${message}`, 'color: #0099ff;');
                break;
        }
    }

    // 初始化课程状态
    function initCourseState(courseCode) {
        if (!courseStates.has(courseCode)) {
            courseStates.set(courseCode, {
                attempts: 0,
                failed: 0,
                tried: new Set(),
                conflicted: new Set(),
                selecting: false,
                success: false,
                lastAttempt: 0
            });
        }
        return courseStates.get(courseCode);
    }

    // 获取课程状态
    function getCourseState(courseCode) {
        return courseStates.get(courseCode) || initCourseState(courseCode);
    }

    // 检查是否所有课程都已完成（成功或失败）
    function allCoursesCompleted() {
        for (let courseCode of activeCourses) {
            const state = getCourseState(courseCode);
            if (!state.success && state.failed < MAX_FAILED_ATTEMPTS) {
                return false;
            }
        }
        return true;
    }

    // 时间模糊匹配函数
    function matchesTimeFilter(timeInfo, timeFilter) {
        // 如果没有配置过滤器，返回true（不过滤）
        if (!timeFilter || timeFilter.length === 0) {
            return true;
        }

        // 如果时间信息为空，返回false
        if (!timeInfo || timeInfo === '未知时间') {
            return false;
        }

        // 检查是否匹配任意一个时间关键词
        for (let keyword of timeFilter) {
            if (timeInfo.includes(keyword)) {
                return true;
            }
        }

        return false;
    }

    // 教师模糊匹配函数
    function matchesTeacherFilter(teacher, teacherFilter) {
        // 如果没有配置过滤器，返回true（不过滤）
        if (!teacherFilter || teacherFilter.length === 0) {
            return true;
        }

        // 如果教师信息为空，返回false
        if (!teacher || teacher === '未知教师') {
            return false;
        }

        // 检查是否匹配任意一个教师关键词
        for (let keyword of teacherFilter) {
            if (teacher.includes(keyword)) {
                return true;
            }
        }

        return false;
    }

    // 检查教学班是否匹配过滤条件
    function matchesFilters(teachingClass, courseCode) {
        // 获取该课程的配置
        const courseConfig = TARGET_COURSES.find(c => c.code === courseCode);

        // 获取时间和教师过滤器（优先使用课程特定配置，否则使用全局配置）
        const timeFilter = (courseConfig && courseConfig.timeFilter) || GLOBAL_TIME_FILTER;
        const teacherFilter = (courseConfig && courseConfig.teacherFilter) || GLOBAL_TEACHER_FILTER;

        // 检查时间过滤
        const timeMatch = matchesTimeFilter(teachingClass.info.timeInfo, timeFilter);
        if (!timeMatch) {
            return { match: false, reason: '时间不匹配过滤条件' };
        }

        // 检查教师过滤
        const teacherMatch = matchesTeacherFilter(teachingClass.info.teacher, teacherFilter);
        if (!teacherMatch) {
            return { match: false, reason: '教师不匹配过滤条件' };
        }

        return { match: true, reason: '通过过滤' };
    }

    /**
     * 检查教学班行是否匹配目标课程（支持课程号和课程名称）
     * @param {HTMLElement} row - 教学班行元素
     * @param {string} targetCourseCodeOrName - 课程号或课程名称
     * @returns {boolean} - 是否匹配
     */
    function isRowMatchingCourse(row, targetCourseCodeOrName) {
        const input = String(targetCourseCodeOrName).trim();
        const isCode = isCourseCode(input);

        if (isCode) {
            // 按课程号匹配：检查 td.kch_id
            const kchIdCell = row.querySelector('td.kch_id');
            if (kchIdCell && kchIdCell.textContent.trim() === input) {
                return true;
            }
        } else {
            // 按课程名称匹配：检查 td.jxbmc 中的教学班名称
            const jxbmcCell = row.querySelector('td.jxbmc');
            if (jxbmcCell) {
                const jxbmcText = jxbmcCell.textContent.trim();
                const courseName = extractCourseNameFromJxbmc(jxbmcText);
                // 精确匹配或包含匹配
                if (courseName === input || courseName.includes(input) || input.includes(courseName)) {
                    return true;
                }
            }
        }

        return false;
    }

    // 查找目标课程的所有教学班（支持课程号和课程名称）
    function findAllTeachingClasses(targetCourseCodeOrName) {
        const teachingClasses = [];
        const input = String(targetCourseCodeOrName).trim();
        const isCode = isCourseCode(input);

        // 方法1：直接遍历所有教学班行，按课程号或课程名称匹配
        const allRows = document.querySelectorAll('table tbody tr.body_tr');
        
        for (let row of allRows) {
            if (isRowMatchingCourse(row, input)) {
                const selectButton = row.querySelector('button, a, input[type="button"]');
                if (selectButton) {
                    const classInfo = extractTeachingClassInfo(row);
                    if (classInfo && classInfo.id) {
                        teachingClasses.push({
                            row: row,
                            info: classInfo,
                            button: selectButton,
                            courseCode: targetCourseCodeOrName
                        });
                    }
                }
            }
        }

        // 方法2：如果方法1没找到，尝试通过课程区域查找
        if (teachingClasses.length === 0) {
            // 查找包含目标课程的所有元素
            const allElements = document.querySelectorAll('*');
            let courseSection = null;

            // 首先找到课程主行
            for (let element of allElements) {
                const text = element.textContent || '';
                if (isCode) {
                    // 课程号匹配
                    if (text.includes(`(${input})`) || text.includes(input)) {
                        courseSection = element.closest('div, section, table');
                        break;
                    }
                } else {
                    // 课程名称匹配
                    if (text.includes(input)) {
                        courseSection = element.closest('div, section, table');
                        break;
                    }
                }
            }

            if (!courseSection) {
                // 如果没找到课程区域，尝试表格行方式
                const courseRows = document.querySelectorAll('table tbody tr');
                for (let row of courseRows) {
                    if (isRowMatchingCourse(row, input)) {
                        // 找到匹配的行，查找同一表格中的所有教学班
                        const table = row.closest('table');
                        if (table) {
                            const tableRows = table.querySelectorAll('tbody tr');
                            for (let classRow of tableRows) {
                                if (isRowMatchingCourse(classRow, input)) {
                                    const selectButton = classRow.querySelector('button, a, input[type="button"]');
                                    if (selectButton) {
                                        const classInfo = extractTeachingClassInfo(classRow);
                                        if (classInfo && classInfo.id) {
                                            teachingClasses.push({
                                                row: classRow,
                                                info: classInfo,
                                                button: selectButton,
                                                courseCode: targetCourseCodeOrName
                                            });
                                        }
                                    }
                                }
                            }
                        }
                        break;
                    }
                }
            } else {
                // 在课程区域内查找所有教学班行
                const classRows = courseSection.querySelectorAll('tr');
                for (let row of classRows) {
                    const selectButton = row.querySelector('button, a, input[type="button"]');
                    if (selectButton) {
                        const classInfo = extractTeachingClassInfo(row);
                        if (classInfo && classInfo.id) {
                            teachingClasses.push({
                                row: row,
                                info: classInfo,
                                button: selectButton,
                                courseCode: targetCourseCodeOrName
                            });
                        }
                    }
                }
            }
        }

        log(`找到 ${teachingClasses.length} 个教学班`, 'info', targetCourseCodeOrName);
        return teachingClasses;
    }

    // 查找所有目标课程的教学班
    function findAllCoursesTeachingClasses() {
        const allClasses = new Map(); // courseCode -> teachingClasses[]

        for (let courseCode of activeCourses) {
            const classes = findAllTeachingClasses(courseCode);
            if (classes.length > 0) {
                allClasses.set(courseCode, classes);
            }
        }

        return allClasses;
    }

    // 提取教学班信息
    function extractTeachingClassInfo(row) {
        try {
            let className = '';
            let teacher = '';
            let capacity = '';
            let timeInfo = '';

            // 记录原始文本用于调试
            const fullText = row.textContent || row.innerText || '';

            // 优先使用表格特定类名提取信息（更准确）
            // .jxbmc - 教学班名称
            const jxbmcEl = row.querySelector('.jxbmc, td.jxbmc');
            if (jxbmcEl) {
                className = jxbmcEl.textContent.trim();
            }

            // .jsxmzc - 上课教师（格式：【教师名】职称）
            const jsxmzcEl = row.querySelector('.jsxmzc, td.jsxmzc');
            if (jsxmzcEl) {
                teacher = jsxmzcEl.textContent.trim();
            }

            // .sksj - 上课时间
            const sksjEl = row.querySelector('.sksj, td.sksj');
            if (sksjEl) {
                timeInfo = sksjEl.textContent.trim();
            }

            // .rsxx - 已选/容量（格式：【36/50】）
            const rsxxEl = row.querySelector('.rsxx, td.rsxx');
            if (rsxxEl) {
                capacity = rsxxEl.textContent.trim();
            }

            // 如果通过类名没找到，回退到遍历所有单元格
            if (!className || !teacher || !capacity || !timeInfo) {
                const cells = row.querySelectorAll('td');
                for (let cell of cells) {
                    const text = cell.textContent.trim();

                    // 提取教学班名称（如：工程化学-0001）
                    if (!className && text.includes('-') && text.match(/\d{4}/)) {
                        className = text;
                    }

                    // 提取教师信息
                    if (!teacher && text.includes('【') && text.includes('】')) {
                        teacher = text;
                    }

                    // 提取容量信息 - 只选择数字/数字格式
                    if (!capacity && text.match(/\d+\/\d+/)) {
                        capacity = text;
                    }

                    // 提取时间信息
                    if (!timeInfo && (text.includes('星期') || text.includes('第') || text.includes('节'))) {
                        timeInfo = text;
                    }
                }
            }

            // 如果仍未找到基本信息，尝试从整个行文本中提取
            if (!className || !teacher || !capacity) {
                // 尝试提取教学班名称
                if (!className) {
                    const classMatch = fullText.match(/([^-\s]+[-]\d{4})/);
                    if (classMatch) {
                        className = classMatch[1];
                    }
                }

                // 尝试提取教师
                if (!teacher) {
                    const teacherMatch = fullText.match(/【([^】]+)】/);
                    if (teacherMatch) {
                        teacher = `【${teacherMatch[1]}】`;
                    }
                }

                // 尝试提取容量
                if (!capacity) {
                    const capacityMatch = fullText.match(/(\d+\/\d+|已满)/);
                    if (capacityMatch) {
                        capacity = capacityMatch[1];
                    }
                }

                // 尝试提取时间
                if (!timeInfo) {
                    const timeMatch = fullText.match(/(星期[一二三四五六日][^星期]*)/g);
                    if (timeMatch) {
                        timeInfo = timeMatch.join(' ');
                    }
                }
            }

            // 更宽松的信息检查 - 只要有按钮就认为是有效的教学班
            const hasButton = row.querySelector('button, a, input[type="button"]') !== null;

            // 生成唯一ID（优先使用 jxb_id）
            const jxbIdEl = row.querySelector('.jxb_id, div.jxb_id');
            const jxbId = jxbIdEl ? jxbIdEl.textContent.trim() : '';
            const uniqueId = jxbId || className || teacher || capacity || fullText.substring(0, 20) || `row_${Date.now()}_${Math.random()}`;

            const result = {
                className: className || '未知教学班',
                teacher: teacher || '未知教师',
                capacity: capacity || '未知容量',
                timeInfo: timeInfo || '未知时间',
                id: `${uniqueId}_${teacher || 'unknown'}`,
                jxbId: jxbId, // 保存教学班ID，可能用于后续操作
                hasButton: hasButton,
                rawText: fullText.substring(0, 200) // 保留原始文本用于调试
            };

            return result;

        } catch (error) {
            // 返回默认信息而不是null
            return {
                className: '解析失败',
                teacher: '未知教师',
                capacity: '未知容量',
                timeInfo: '未知时间',
                id: `error_${Date.now()}_${Math.random()}`,
                jxbId: '',
                hasButton: false,
                rawText: (row.textContent || '').substring(0, 200)
            };
        }
    }

    // 检查教学班是否可选课
    // 逻辑：只判断 .full 元素（"已满"标识）是否显示
    function checkTeachingClassCapacity(teachingClass) {
        try {
            if (!teachingClass || !teachingClass.row) {
                return false;
            }

            // 检查 .full 元素是否可见
            const fullElement = teachingClass.row.querySelector('.full, td.full');
            if (fullElement) {
                const style = window.getComputedStyle(fullElement);
                const isVisible = style.display !== 'none' && style.visibility !== 'hidden';
                // 如果"已满"可见，返回 false
                if (isVisible) {
                    return false;
                }
            }

            // "已满"不可见，可以选课
            return true;
        } catch (error) {
            return false;
        }
    }

    // 检查是否出现时间冲突警告
    function checkTimeConflictWarning() {
        try {
            // 检查页面中是否出现时间冲突警告
            const warningTexts = [
                '所选教学班的上课时间与其他教学班有冲突',
                '上课时间与其他教学班有冲突',
                '时间冲突',
                '时间有冲突'
            ];

            // 查找所有可能包含警告文本的元素
            const allElements = document.querySelectorAll('*');
            for (let element of allElements) {
                const text = element.textContent || element.innerText || '';
                for (let warningText of warningTexts) {
                    if (text.includes(warningText)) {
                        return true;
                    }
                }
            }

            // 检查弹窗或模态框中的警告
            const modals = document.querySelectorAll('.modal, .dialog, .alert, [role="dialog"], [role="alert"]');
            for (let modal of modals) {
                const modalText = modal.textContent || modal.innerText || '';
                for (let warningText of warningTexts) {
                    if (modalText.includes(warningText)) {
                        return true;
                    }
                }
            }

            return false;
        } catch (error) {
            return false;
        }
    }

    // 退选指定课程
    function dropCourse(courseCode) {
        return new Promise((resolve) => {
            try {
                log(`🔄 开始退选课程: ${courseCode}`, 'info', courseCode);

                // 查找该课程的所有教学班
                const teachingClasses = findAllTeachingClasses(courseCode);

                if (teachingClasses.length === 0) {
                    log(`未找到课程 ${courseCode} 的教学班`, 'warning', courseCode);
                    resolve(false);
                    return;
                }

                // 查找包含"退选"按钮的教学班
                let dropClass = null;
                for (let tc of teachingClasses) {
                    const rowText = tc.row ? tc.row.textContent : '';
                    if (rowText.includes('退选')) {
                        dropClass = tc;
                        break;
                    }
                }

                if (!dropClass) {
                    log(`课程 ${courseCode} 未找到可退选的教学班`, 'warning', courseCode);
                    resolve(false);
                    return;
                }

                // 查找退选按钮
                const row = dropClass.row;
                const allElements = row.querySelectorAll('*');
                let dropButton = null;

                for (let element of allElements) {
                    const elementText = element.textContent.trim();
                    if (elementText === '退选' || elementText.includes('退选')) {
                        if (element.tagName === 'BUTTON' || element.tagName === 'A' || element.onclick || element.getAttribute('onclick')) {
                            dropButton = element;
                            break;
                        }
                    }
                }

                if (!dropButton) {
                    log(`未找到课程 ${courseCode} 的退选按钮`, 'warning', courseCode);
                    resolve(false);
                    return;
                }

                log(`找到退选按钮，正在点击...`, 'info', courseCode);
                dropButton.click();

                // 等待模态框出现并确认退选
                setTimeout(() => {
                    log(`等待退选确认模态框...`, 'info', courseCode);

                    // 多种方式查找模态框中的确定按钮
                    let confirmButton = null;

                    // 方法1: 查找模态框内的确定按钮（优先）
                    const modals = document.querySelectorAll('.modal, .bootbox, [role="dialog"]');
                    for (let modal of modals) {
                        // 检查模态框是否包含退选相关文本
                        const modalText = modal.textContent || '';
                        if (modalText.includes('退选') || modalText.includes('你是否')) {
                            // 在这个模态框内查找确定按钮
                            const buttons = modal.querySelectorAll('button, input[type="button"], a');
                            for (let btn of buttons) {
                                const btnText = btn.textContent.trim();
                                const btnId = btn.id || '';
                                const btnHandler = btn.getAttribute('data-bb-handler') || '';

                                // 匹配确定按钮的多种特征
                                if (btnText.includes('确定') || btnText.includes('确认') ||
                                    btnText.includes('OK') || btnId === 'btn_ok' ||
                                    btnHandler === 'ok' || btnHandler === 'confirm') {
                                    confirmButton = btn;
                                    log(`✅ 找到模态框确定按钮 (${btnText || btnId})`, 'info', courseCode);
                                    break;
                                }
                            }
                            if (confirmButton) break;
                        }
                    }

                    // 方法2: 直接查找带有特定ID的确定按钮
                    if (!confirmButton) {
                        confirmButton = document.querySelector('#btn_ok, button[data-bb-handler="ok"], button[data-bb-handler="confirm"]');
                        if (confirmButton) {
                            log(`✅ 通过ID找到确定按钮`, 'info', courseCode);
                        }
                    }

                    // 方法3: 查找所有可见的确定按钮（最后备选）
                    if (!confirmButton) {
                        const allButtons = document.querySelectorAll('button, input[type="button"], a.btn');
                        for (let btn of allButtons) {
                            const text = btn.textContent.trim();
                            // 检查按钮是否可见
                            const style = window.getComputedStyle(btn);
                            const isVisible = style.display !== 'none' && style.visibility !== 'hidden' && btn.offsetParent !== null;

                            if (isVisible && (text === '确定' || text === '确  定' || text.includes('确定'))) {
                                confirmButton = btn;
                                log(`✅ 找到可见的确定按钮`, 'info', courseCode);
                                break;
                            }
                        }
                    }

                    if (confirmButton) {
                        log(`正在点击确定按钮...`, 'info', courseCode);
                        confirmButton.click();

                        // 等待退选操作完成
                        setTimeout(() => {
                            log(`✅ 已确认退选课程 ${courseCode}`, 'success', courseCode);
                            resolve(true);
                        }, 1500);
                    } else {
                        log(`❌ 未找到退选确认按钮`, 'error', courseCode);
                        resolve(false);
                    }
                }, 800); // 增加等待时间，确保模态框完全加载

            } catch (error) {
                log(`退选课程失败: ${error.message}`, 'error', courseCode);
                resolve(false);
            }
        });
    }

    // 尝试选择教学班
    function selectTeachingClass(teachingClass) {
        if (!teachingClass || !teachingClass.row) return false;

        const courseCode = teachingClass.courseCode;
        const classId = teachingClass.info.id;
        const state = getCourseState(courseCode);

        // 检查是否已经因时间冲突被跳过
        if (state.conflicted.has(classId)) {
            log(`教学班 ${teachingClass.info.className} 已知时间冲突，跳过`, 'warning', courseCode);
            return false;
        }

        try {
            log(`尝试选择教学班: ${teachingClass.info.className} (${teachingClass.info.teacher})`, 'info', courseCode);
            log(`时间: ${teachingClass.info.timeInfo}`, 'info', courseCode);
            log(`容量: ${teachingClass.info.capacity}`, 'info', courseCode);

            // 标记正在选课
            state.selecting = true;

            // 查找该行中真正的选课按钮或链接
            const row = teachingClass.row;
            const rowText = row.textContent || '';

            // 查找包含"选课"文本的元素 - 更精确的查找逻辑
            let selectElement = null;
            const allElements = row.querySelectorAll('*');

            // 优先级1: 查找明确的"选课"文本
            for (let element of allElements) {
                const elementText = element.textContent.trim();
                if (elementText === '选课') {
                    // 确保不是退选按钮，且是可点击的
                    if (!elementText.includes('退选') && (element.tagName === 'BUTTON' || element.tagName === 'A' || element.onclick || element.getAttribute('onclick'))) {
                        selectElement = element;
                        break;
                    }
                }
            }

            // 优先级2: 查找包含"选课"的可点击元素
            if (!selectElement) {
                for (let element of allElements) {
                    const elementText = element.textContent.trim();
                    if (elementText.includes('选课') && !elementText.includes('退选')) {
                        if (element.tagName === 'BUTTON' || element.tagName === 'A' || element.onclick || element.getAttribute('onclick')) {
                            selectElement = element;
                            break;
                        }
                    }
                }
            }

            // 优先级3: 查找可点击的按钮或链接（但要排除明确的退选或其他功能）
            if (!selectElement) {
                const clickableElements = row.querySelectorAll('button, a, input[type="button"], [onclick]');
                for (let element of clickableElements) {
                    const elementText = element.textContent.trim();
                    // 只有在排除了明确的其他功能按钮后才选择
                    if (!elementText.includes('退选') &&
                        !elementText.includes('详情') &&
                        !elementText.includes('查看') &&
                        !elementText.includes('取消') &&
                        !elementText.includes('关闭') &&
                        elementText.length > 0 &&
                        (element.tagName === 'BUTTON' || element.tagName === 'A' || element.onclick || element.getAttribute('onclick'))) {
                        selectElement = element;
                        break;
                    }
                }
            }

            if (selectElement) {
                log('找到选课元素，正在点击...', 'info', courseCode);

                // 记录已尝试的教学班
                state.tried.add(classId);

                // 点击选课元素
                selectElement.click();

                // 等待并检查结果
                setTimeout(() => {
                    // 首先检查是否有时间冲突警告
                    if (checkTimeConflictWarning()) {
                        log(`🛑 教学班 ${teachingClass.info.className} 时间冲突！`, 'error', courseCode);

                        // 记录冲突的教学班
                        state.conflicted.add(classId);

                        // 尝试关闭警告弹窗
                        const cancelButtons = document.querySelectorAll('button, input[type="button"], a');
                        for (let btn of cancelButtons) {
                            const text = btn.textContent.trim();
                            if (text.includes('取消') || text.includes('关闭') || text.includes('确定')) {
                                btn.click();
                                log('已关闭时间冲突警告弹窗', 'info', courseCode);
                                break;
                            }
                        }

                        log(`继续尝试其他教学班...`, 'info', courseCode);
                        state.selecting = false;
                        return;
                    }

                    // 如果没有时间冲突，查找并点击确认按钮
                    const confirmButtons = document.querySelectorAll('button, input[type="button"], a');
                    for (let btn of confirmButtons) {
                        const text = btn.textContent.trim();
                        if (text.includes('确定') || text.includes('确认') || text.includes('提交') || text.includes('OK')) {
                            btn.click();
                            log('已点击确认按钮', 'info', courseCode);

                            // 点击确认后再次检查是否出现时间冲突警告
                            setTimeout(() => {
                                if (checkTimeConflictWarning()) {
                                    log(`🛑 确认后检测到时间冲突: ${teachingClass.info.className}`, 'error', courseCode);
                                    state.conflicted.add(classId);

                                    // 关闭冲突警告
                                    const closeButtons = document.querySelectorAll('button, input[type="button"], a');
                                    for (let closeBtn of closeButtons) {
                                        const closeText = closeBtn.textContent.trim();
                                        if (closeText.includes('确定') || closeText.includes('取消') || closeText.includes('关闭')) {
                                            closeBtn.click();
                                            break;
                                        }
                                    }
                                    state.selecting = false;
                                } else {
                                    // 等待更长时间再验证是否真正选课成功
                                    setTimeout(() => {
                                        // 重新查找教学班，验证是否真的选上了
                                        const updatedClasses = findAllTeachingClasses(courseCode);
                                        let reallySelected = false;

                                        for (let updatedClass of updatedClasses) {
                                            if (updatedClass.info.className === teachingClass.info.className) {
                                                const updatedRowText = updatedClass.row ? updatedClass.row.textContent : '';
                                                if (updatedRowText.includes('退选')) {
                                                    reallySelected = true;
                                                    break;
                                                }
                                            }
                                        }

                                        if (reallySelected) {
                                            // 真正选课成功，重置失败计数器
                                            state.failed = 0;
                                            state.success = true;
                                            selectedCourses.add(courseCode);
                                            activeCourses.delete(courseCode); // 从活跃列表中移除

                                            log(`🎊 确认选课成功: ${teachingClass.info.className}！`, 'success', courseCode);

                                            // 显示成功通知
                                            try {
                                                if (window.Notification && Notification.permission === 'granted') {
                                                    new Notification('抢课成功！', {
                                                        body: `成功选择: ${courseCode} - ${teachingClass.info.className}`,
                                                        icon: '/favicon.ico'
                                                    });
                                                }

                                                // 检查是否所有课程都已完成
                                                if (activeCourses.size === 0) {
                                                    alert(`🎉 所有课程抢课完成！\n成功课程: ${Array.from(selectedCourses).join(', ')}`);
                                                    stopGrabbing();
                                                }
                                            } catch (e) {
                                                // 忽略通知错误
                                            }
                                        } else {
                                            // 实际上没有选课成功，增加重试计数
                                            state.failed++;
                                            log(`⚠️ 选课请求已发送但未确认成功 (失败次数: ${state.failed}/${MAX_FAILED_ATTEMPTS})`, 'warning', courseCode);

                                            if (state.failed >= MAX_FAILED_ATTEMPTS) {
                                                log(`❌ 课程 ${courseCode} 连续失败 ${MAX_FAILED_ATTEMPTS} 次，停止该课程抢课`, 'error', courseCode);
                                                activeCourses.delete(courseCode);

                                                // 检查是否所有课程都已完成
                                                if (activeCourses.size === 0 && selectedCourses.size === 0) {
                                                    alert(`抢课脚本已停止\n原因: 所有课程都无法选课成功\n建议: 检查网络连接或手动刷新页面后重试`);
                                                    stopGrabbing();
                                                }
                                            }
                                        }
                                        state.selecting = false;
                                    }, 3000); // 等待3秒再验证
                                }
                            }, 1000);

                            break;
                        }
                    }
                }, 500);

                return true;
            } else {
                log('未找到可点击的选课元素', 'warning', courseCode);
                state.selecting = false;
                return false;
            }
        } catch (error) {
            log(`选择教学班失败: ${error.message}`, 'error', courseCode);
            state.selecting = false;
            return false;
        }
    }

    // 刷新课程列表
    function refreshCourseList() {
        try {
            // 全局节流：避免重复实例/重复触发导致的“刷新触发两次”
            const now = Date.now();
            const last = __CG_GLOBAL__[__CG_REFRESH_LOCK_KEY__] || 0;
            if (now - last < 300) {
                return;
            }
            __CG_GLOBAL__[__CG_REFRESH_LOCK_KEY__] = now;

            const searchBtn = document.querySelector(
                'button[onclick*="search"], input[value*="搜索"], input[value*="查询"]'
            );
            if (searchBtn) {
                searchBtn.click();
                log('已触发课程列表刷新');
            } else {
                // 如果没有搜索按钮，尝试刷新页面数据
                if (typeof jQuery !== 'undefined' && jQuery('#searchBox').length) {
                    jQuery('#searchBox').trigger('searchResult');
                    log('已触发jQuery搜索刷新');
                }
            }

            // 🔥 刷新后强制恢复展开
            if (click2expend_enabled && CLICK2EXPEND_ENABLED) setTimeout(forceExpandTargetCoursesAggressive, 600);
        } catch (e) {
            log(`刷新课程列表失败: ${e.message}`, 'warning');
        }
    }

    // 单个课程抢课逻辑
    function attemptGrabSingleCourse(courseCode) {
        const state = getCourseState(courseCode);

        // 检查是否正在选课
        if (state.selecting) {
            return;
        }

        // 检查是否已成功
        if (state.success) {
            return;
        }

        // 检查是否达到最大失败次数
        if (state.failed >= MAX_FAILED_ATTEMPTS) {
            return;
        }

        state.attempts++;

        // 查找所有教学班
        const teachingClasses = findAllTeachingClasses(courseCode);
        if (teachingClasses.length === 0) {
            log('未找到教学班，尝试重新展开课程', 'warning', courseCode);
            if (click2expend_enabled && CLICK2EXPEND_ENABLED) forceExpandTargetCoursesAggressive();
            return;
        }

        // 设置标志：是否有时间不冲突但人数已满的教学班
        let hasNonConflictedFullClass = false;

        // 逐个尝试所有教学班
        for (let tc of teachingClasses) {
            // 确保教学班信息完整
            if (!tc || !tc.info || !tc.info.id) {
                continue;
            }

            const classId = tc.info.id;

            // 检查是否已经因时间冲突被标记
            if (state.conflicted.has(classId)) {
                continue;
            }

            // 检查是否已经尝试过
            if (state.tried.has(classId)) {
                continue;
            }

            // 检查是否有选课按钮（排除退选按钮）
            const rowText = tc.row ? tc.row.textContent : '';
            if (rowText.includes('退选')) {
                continue;
            }

            if (!rowText.includes('选课')) {
                continue;
            }

            // ========== 应用过滤器 ==========
            const filterResult = matchesFilters(tc, courseCode);

            // 调试日志：显示过滤器配置和匹配结果
            const courseConfig = TARGET_COURSES.find(c => c.code === courseCode);
            if (courseConfig && (courseConfig.timeFilter || courseConfig.teacherFilter)) {
                log(`🔍 过滤器检查 - 教学班: ${tc.info.className}`, 'info', courseCode);
                if (courseConfig.timeFilter) {
                    log(`   时间过滤器: [${courseConfig.timeFilter.join(', ')}]`, 'info', courseCode);
                    log(`   教学班时间: ${tc.info.timeInfo}`, 'info', courseCode);
                }
                if (courseConfig.teacherFilter) {
                    log(`   教师过滤器: [${courseConfig.teacherFilter.join(', ')}]`, 'info', courseCode);
                    log(`   教学班教师: ${tc.info.teacher}`, 'info', courseCode);
                }
                log(`   匹配结果: ${filterResult.match ? '✅通过' : '❌' + filterResult.reason}`, 'info', courseCode);
            }

            if (!filterResult.match) {
                // 不满足过滤条件，跳过此教学班
                log(`⏭️ 跳过教学班 ${tc.info.className}: ${filterResult.reason}`, 'info', courseCode);
                log(`   教师: ${tc.info.teacher}, 时间: ${tc.info.timeInfo}`, 'info', courseCode);
                continue;
            }

            // 检查容量
            const hasCapacity = checkTeachingClassCapacity(tc);

            if (hasCapacity) {
                // 有余量，检查是否需要先退选其他课程
                log(`🎯 发现有余量的教学班: ${tc.info.className}`, 'success', courseCode);
                log(`📚 教师: ${tc.info.teacher}`, 'info', courseCode);
                log(`⏰ 时间: ${tc.info.timeInfo}`, 'info', courseCode);
                log(`👥 容量: ${tc.info.capacity}`, 'info', courseCode);

                // 获取课程配置
                const courseConfig = TARGET_COURSES.find(c => c.code === courseCode);

                // 如果配置了替换课程，先执行退选
                if (courseConfig && courseConfig.replaceCode) {
                    log(`🔄 检测到需要替换课程 ${courseConfig.replaceCode}，立即执行退选...`, 'warning', courseCode);
                    addUILog && addUILog('warning', `[${courseCode}] 🔄 发现空位！开始退选 ${courseConfig.replaceCode}`);

                    // 异步执行退选，然后选课
                    dropCourse(courseConfig.replaceCode).then(dropSuccess => {
                        if (dropSuccess) {
                            log(`✅ 退选成功，立即选择新课程 ${courseCode}`, 'success', courseCode);
                            addUILog && addUILog('success', `[${courseCode}] ✅ 退选成功，开始抢课...`);

                            // 等待页面更新后立即选课
                            setTimeout(() => {
                                selectTeachingClass(tc);
                            }, 1500);
                        } else {
                            log(`❌ 退选失败，放弃本次选课`, 'error', courseCode);
                            addUILog && addUILog('error', `[${courseCode}] ❌ 退选失败，等待下次机会`);
                            state.selecting = false;
                        }
                    });
                    return; // 等待异步退选完成
                } else {
                    // 没有配置替换课程，直接选课
                    const selectResult = selectTeachingClass(tc);
                    if (selectResult) {
                        return; // 尝试选课后等待结果
                    }
                }
            } else {
                // 没有余量，但时间不冲突，设置标志
                hasNonConflictedFullClass = true;
            }
        }

        // 检查是否所有教学班都时间冲突
        if (!hasNonConflictedFullClass && state.conflicted.size > 0 && state.conflicted.size === teachingClasses.length) {
            log('🛑 所有教学班都存在时间冲突，停止该课程抢课！', 'error', courseCode);
            activeCourses.delete(courseCode);

            if (activeCourses.size === 0) {
                alert(`⚠️ 时间冲突警告\n\n课程 ${courseCode} 的所有教学班都与您已选课程时间冲突。\n冲突的教学班数量: ${state.conflicted.size}\n\n请手动检查课程表并解决时间冲突问题。`);
                stopGrabbing();
            }
            return;
        }

        // 重置已尝试列表，继续轮询
        if (state.attempts % 10 === 0 && state.tried.size > 0) {
            state.tried.clear();
            log(`已重置尝试列表，继续监控`, 'info', courseCode);
        }
    }

    // 主抢课逻辑（多课程并发版）
    function attemptGrabCourse() {
        attemptCount++;

        if (attemptCount > MAX_ATTEMPTS) {
            log(`已达到最大尝试次数 ${MAX_ATTEMPTS}，停止抢课`, 'warning');
            stopGrabbing();
            return;
        }

        if (activeCourses.size === 0) {
            log('所有课程已完成', 'success');
            stopGrabbing();
            return;
        }

        log(`第 ${attemptCount} 次尝试抢课 (活跃课程: ${activeCourses.size})`);

        // 按优先级排序课程
        const sortedCourses = Array.from(activeCourses).sort((a, b) => {
            const courseA = TARGET_COURSES.find(c => c.code === a);
            const courseB = TARGET_COURSES.find(c => c.code === b);
            const priorityA = courseA ? courseA.priority : 999;
            const priorityB = courseB ? courseB.priority : 999;
            return priorityA - priorityB;
        });

        // 并发模式：同时尝试所有课程
        if (CONCURRENT_ENABLED) {
            for (let courseCode of sortedCourses) {
                attemptGrabSingleCourse(courseCode);
            }
        } else {
            // 顺序模式：按优先级依次尝试
            for (let courseCode of sortedCourses) {
                const state = getCourseState(courseCode);
                if (!state.selecting) {
                    attemptGrabSingleCourse(courseCode);
                    break; // 只尝试一个课程，等待结果
                }
            }
        }
    }

    // 开始抢课
    function startGrabbing(customCourses = null) {
        if (isRunning) {
            log('抢课脚本已在运行中！', 'warning');
            return;
        }

        // 使用自定义课程或默认课程
        const coursesToGrab = customCourses || TARGET_COURSES;

        if (!coursesToGrab || coursesToGrab.length === 0) {
            log('❌ 未配置目标课程！请先配置 TARGET_COURSES 或传入课程列表', 'error');
            alert('请先配置目标课程！\n\n在脚本中修改 TARGET_COURSES 数组，或使用：\ncourseGrabber.start([{code: "课程号", priority: 1}])');
            return;
        }

        // 请求通知权限
        if (window.Notification && Notification.permission === 'default') {
            Notification.requestPermission();
        }

        isRunning = true;
        attemptCount = 0;
        refreshInProgress = false;
        if (refreshTimeoutId) {
            clearTimeout(refreshTimeoutId);
            refreshTimeoutId = null;
        }

        // 初始化课程状态
        courseStates.clear();
        selectedCourses.clear();
        activeCourses.clear();

        for (let course of coursesToGrab) {
            const courseCode = typeof course === 'string' ? course : course.code;
            activeCourses.add(courseCode);
            initCourseState(courseCode);
        }

        // 自动判断是否需要展开功能（用于时间/教师过滤）
        // 如果没有任何过滤器配置，则无需展开课程详情
        const needsFiltering = (() => {
            // 检查全局过滤器
            if (GLOBAL_TIME_FILTER.length > 0 || GLOBAL_TEACHER_FILTER.length > 0) {
                return true;
            }
            // 检查每门课程的单独过滤器
            for (let course of coursesToGrab) {
                if (typeof course === 'object') {
                    if ((course.timeFilter && course.timeFilter.length > 0) ||
                        (course.teacherFilter && course.teacherFilter.length > 0)) {
                        return true;
                    }
                }
            }
            return false;
        })();

        // 根据是否需要过滤自动设置 click2expend_enabled
        if (!needsFiltering) {
            click2expend_enabled = false;
            log('📌 未检测到时间/教师过滤器配置，已自动禁用课程展开功能', 'info');
        } else {
            click2expend_enabled = true;
            log('📌 检测到过滤器配置，已自动启用课程展开功能', 'info');
        }

        log(`🚀 开始监控 ${activeCourses.size} 门课程`, 'success');
        log(`📋 课程列表: ${Array.from(activeCourses).join(', ')}`, 'info');
        log(`⏱️ 检查间隔: ${CHECK_INTERVAL / 1000} 秒`, 'info');
        log(`🎯 最大尝试次数: ${MAX_ATTEMPTS}`, 'info');
        log(`⚡ 并发模式: ${CONCURRENT_ENABLED ? '启用' : '禁用'}`, 'info');

        // 显示过滤器配置
        if (GLOBAL_TIME_FILTER.length > 0) {
            log(`🔍 全局时间过滤: ${GLOBAL_TIME_FILTER.join(', ')}`, 'info');
        }
        if (GLOBAL_TEACHER_FILTER.length > 0) {
            log(`🔍 全局教师过滤: ${GLOBAL_TEACHER_FILTER.join(', ')}`, 'info');
        }

        // 显示每门课程的特定过滤器
        for (let course of coursesToGrab) {
            if (typeof course === 'object') {
                if (course.timeFilter && course.timeFilter.length > 0) {
                    log(`🔍 [${course.code}] 时间过滤: ${course.timeFilter.join(', ')}`, 'info', course.code);
                }
                if (course.teacherFilter && course.teacherFilter.length > 0) {
                    log(`🔍 [${course.code}] 教师过滤: ${course.teacherFilter.join(', ')}`, 'info', course.code);
                }
            }
        }

        // 立即执行一次
        attemptGrabCourse();

        // 设置定时器
        intervalId = setInterval(() => {
            // 每8次尝试刷新一次课程列表
            // 注意：attemptCount 在 attemptGrabCourse() 内部自增；如果这里先走“刷新分支”，
            // attemptGrabCourse() 会被延迟 1s，这段时间内 attemptCount 不变，会导致下一次 interval 再次满足 %8===0，
            // 从而出现“已触发jQuery搜索刷新”连续打印两次的现象。
            if (attemptCount > 0 && attemptCount % 3 === 0 && !refreshInProgress) {
                refreshInProgress = true;
                refreshCourseList();
                refreshTimeoutId = setTimeout(() => {
                    refreshInProgress = false;
                    refreshTimeoutId = null;
                    attemptGrabCourse();
                }, 1000); // 刷新后等待1秒再尝试
            } else {
                attemptGrabCourse();
            }
        }, CHECK_INTERVAL);
    }

    // 停止抢课
    function stopGrabbing() {
        if (!isRunning) {
            log('抢课脚本未运行', 'info');
            return;
        }

        isRunning = false;
        refreshInProgress = false;
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
        if (refreshTimeoutId) {
            clearTimeout(refreshTimeoutId);
            refreshTimeoutId = null;
        }

        log('⏹️ 抢课脚本已停止', 'warning');
    }

    // 获取状态
    function getStatus() {
        const status = {
            isRunning: isRunning,
            attemptCount: attemptCount,
            activeCourses: Array.from(activeCourses),
            selectedCourses: Array.from(selectedCourses),
            checkInterval: CHECK_INTERVAL,
            maxAttempts: MAX_ATTEMPTS,
            concurrentMode: CONCURRENT_ENABLED
        };

        console.log('%c========== 抢课状态 ==========', 'color: #00ffff; font-weight: bold; font-size: 16px;');
        console.table(status);

        // 显示每门课程的详细状态
        log('--- 课程详细状态 ---', 'info');
        for (let [courseCode, state] of courseStates) {
            log(`课程: ${courseCode}`, 'info');
            log(`  尝试次数: ${state.attempts}`, 'info');
            log(`  失败次数: ${state.failed}/${MAX_FAILED_ATTEMPTS}`, 'info');
            log(`  已尝试教学班: ${state.tried.size}个`, 'info');
            log(`  时间冲突教学班: ${state.conflicted.size}个`, 'info');
            log(`  正在选课: ${state.selecting ? '是' : '否'}`, 'info');
            log(`  选课成功: ${state.success ? '是' : '否'}`, state.success ? 'success' : 'info');
        }

        return {
            status,
            courseStates: Array.from(courseStates.entries()).map(([code, state]) => ({
                courseCode: code,
                attempts: state.attempts,
                failed: state.failed,
                triedCount: state.tried.size,
                conflictedCount: state.conflicted.size,
                selecting: state.selecting,
                success: state.success
            }))
        };
    }

    // 添加单门课程到监控列表
    function addCourse(courseCode, priority = 999) {
        if (activeCourses.has(courseCode)) {
            log(`课程 ${courseCode} 已在监控列表中`, 'warning');
            return false;
        }

        activeCourses.add(courseCode);
        initCourseState(courseCode);
        TARGET_COURSES.push({ code: courseCode, priority: priority });

        log(`✅ 已添加课程 ${courseCode} 到监控列表`, 'success');
        return true;
    }

    // 移除课程
    function removeCourse(courseCode) {
        if (!activeCourses.has(courseCode)) {
            log(`课程 ${courseCode} 不在监控列表中`, 'warning');
            return false;
        }

        activeCourses.delete(courseCode);
        courseStates.delete(courseCode);

        const index = TARGET_COURSES.findIndex(c => c.code === courseCode);
        if (index !== -1) {
            TARGET_COURSES.splice(index, 1);
        }

        log(`🗑️ 已从监控列表中移除课程 ${courseCode}`, 'warning');
        return true;
    }

    // 暴露全局控制接口
    window.grab = {
        // 开始抢课 - 可以传入自定义课程列表
        // 示例: grab.start([{code: 'CS101', priority: 1}, {code: 'CS102', priority: 2}])
        start: startGrabbing,

        // 停止抢课
        stop: stopGrabbing,

        // 查看状态
        status: getStatus,

        // 添加课程
        // 示例: grab.addCourse('CS103', 1)
        addCourse: addCourse,

        // 移除课程
        // 示例: grab.removeCourse('CS103')
        removeCourse: removeCourse,

        // 调试信息
        debug: (courseCode = null) => {
            log('=== 调试信息 ===', 'info');

            // 如果指定了课程，只调试该课程
            const coursesToDebug = courseCode ? [courseCode] : Array.from(activeCourses);

            if (coursesToDebug.length === 0) {
                log('没有活跃的课程', 'warning');
                return null;
            }

            const debugInfo = [];

            for (let code of coursesToDebug) {
                log(`\n--- 课程: ${code} ---`, 'info');
                const classes = findAllTeachingClasses(code);
                log(`找到 ${classes.length} 个教学班`, 'info');

                const state = getCourseState(code);

                classes.forEach((tc, index) => {
                    const rowText = tc.row ? tc.row.textContent : '';

                    // 查找所有数字/数字格式
                    const allCapacityMatches = rowText.match(/\d+\/\d+/g) || [];

                    // 查找选课元素
                    let selectElement = null;
                    let selectElementInfo = '无选课元素';

                    if (tc.row) {
                        const allElements = tc.row.querySelectorAll('*');
                        for (let element of allElements) {
                            const elementText = element.textContent.trim();
                            if (elementText === '选课' || elementText.includes('选课')) {
                                if (!elementText.includes('退选')) {
                                    selectElement = element;
                                    selectElementInfo = `${element.tagName}(${elementText})`;
                                    break;
                                }
                            }
                        }

                        // 如果没找到选课元素，列出所有可点击元素
                        if (!selectElement) {
                            const clickableElements = tc.row.querySelectorAll('button, a, input[type="button"], [onclick]');
                            const clickableInfo = Array.from(clickableElements).map(el =>
                                `${el.tagName}(${el.textContent.trim()})`
                            ).join(', ');
                            selectElementInfo = `可点击元素: ${clickableInfo || '无'}`;
                        }
                    }

                    // 检查选课/退选状态
                    const isSelectAvailable = rowText.includes('选课');
                    const isDropAvailable = rowText.includes('退选');

                    log(`教学班 ${index + 1}:`, 'info', code);
                    log(`  名称: ${tc.info.className}`, 'info', code);
                    log(`  教师: ${tc.info.teacher}`, 'info', code);
                    log(`  容量: ${tc.info.capacity}`, 'info', code);
                    log(`  所有容量信息: [${allCapacityMatches.join(', ')}]`, 'info', code);
                    log(`  时间: ${tc.info.timeInfo}`, 'info', code);
                    log(`  选课元素: ${selectElementInfo}`, 'info', code);
                    log(`  行包含选课: ${isSelectAvailable}`, 'info', code);
                    log(`  行包含退选: ${isDropAvailable}`, 'info', code);
                    log(`  ID: ${tc.info.id}`, 'info', code);
                    log(`  有余量: ${checkTeachingClassCapacity(tc)}`, 'info', code);
                    log(`  已尝试: ${state.tried.has(tc.info.id)}`, 'info', code);
                    log(`  时间冲突: ${state.conflicted.has(tc.info.id)}`, 'info', code);

                    // 检查过滤器匹配
                    const filterResult = matchesFilters(tc, code);
                    log(`  过滤器: ${filterResult.match ? '✅通过' : '❌' + filterResult.reason}`, 'info', code);
                    log(`  可选择: ${isSelectAvailable && !isDropAvailable && checkTeachingClassCapacity(tc) && !state.conflicted.has(tc.info.id) && filterResult.match}`, 'info', code);

                    debugInfo.push({
                        courseCode: code,
                        index: index + 1,
                        className: tc.info.className,
                        teacher: tc.info.teacher,
                        capacity: tc.info.capacity,
                        timeInfo: tc.info.timeInfo,
                        hasCapacity: checkTeachingClassCapacity(tc),
                        tried: state.tried.has(tc.info.id),
                        conflicted: state.conflicted.has(tc.info.id),
                        filterMatch: filterResult.match,
                        filterReason: filterResult.reason,
                        canSelect: isSelectAvailable && !isDropAvailable && checkTeachingClassCapacity(tc) && !state.conflicted.has(tc.info.id) && filterResult.match
                    });
                });
            }

            return debugInfo;
        },

        // 定时开抢
        schedule: (timeString) => {
            const targetTime = new Date(timeString);
            if (isNaN(targetTime.getTime())) {
                log('❌ 时间格式错误！请使用如: "2025-12-19 14:00:00"', 'error');
                return false;
            }
            setScheduledStart(targetTime);
            return true;
        },

        cancelSchedule: () => {
            cancelScheduledStart();
        },

        // 配置管理
        config: {
            getCourses: () => TARGET_COURSES,
            setCourses: (courses) => {
                TARGET_COURSES.length = 0;
                TARGET_COURSES.push(...courses);
                log('✅ 已更新课程配置', 'success');
            },
            getInterval: () => CHECK_INTERVAL,
            getConcurrentMode: () => CONCURRENT_ENABLED,
            getGlobalTimeFilter: () => GLOBAL_TIME_FILTER,
            getGlobalTeacherFilter: () => GLOBAL_TEACHER_FILTER,
            // 显示过滤器信息
            showFilters: () => {
                console.log('%c=== 过滤器配置 ===', 'color: #00ffff; font-weight: bold; font-size: 16px;');
                console.log('%c全局时间过滤:', 'color: #ffaa00; font-weight: bold;');
                if (GLOBAL_TIME_FILTER.length > 0) {
                    console.log('  ' + GLOBAL_TIME_FILTER.join(', '));
                } else {
                    console.log('  未配置（不过滤）');
                }
                console.log('%c全局教师过滤:', 'color: #ffaa00; font-weight: bold;');
                if (GLOBAL_TEACHER_FILTER.length > 0) {
                    console.log('  ' + GLOBAL_TEACHER_FILTER.join(', '));
                } else {
                    console.log('  未配置（不过滤）');
                }
                console.log('%c课程特定过滤:', 'color: #ffaa00; font-weight: bold;');
                TARGET_COURSES.forEach(course => {
                    console.log(`  ${course.code}:`);
                    if (course.timeFilter) {
                        console.log(`    时间: ${course.timeFilter.join(', ')}`);
                    }
                    if (course.teacherFilter) {
                        console.log(`    教师: ${course.teacherFilter.join(', ')}`);
                    }
                    if (!course.timeFilter && !course.teacherFilter) {
                        console.log(`    无特定过滤`);
                    }
                });
            }
        }
    };

    // 显示脚本信息
    console.log('%c🎓 自动抢课脚本已加载 - 多课程并发版', 'color: #ff6b35; font-size: 18px; font-weight: bold;');
    console.log('%c✨ 新特性: 支持多门课程同时抢课！', 'color: #00ff00; font-size: 16px; font-weight: bold;');
    console.log('%c📚 目标课程数: ' + TARGET_COURSES.length, 'color: #4ecdc4; font-size: 14px; font-weight: bold;');
    console.log('%c⚡ 使用方法:', 'color: #45b7d1; font-size: 14px; font-weight: bold;');
    console.log('  grab.start()  - 🚀 开始抢课（使用配置的课程）');
    console.log('  grab.start([{code:"CS101", priority:1}])  - 🚀 使用自定义课程列表');
    console.log('  grab.stop()   - ⏹️ 停止抢课');
    console.log('  grab.status() - 📊 查看状态');
    console.log('  grab.debug()  - 🔍 调试所有课程');
    console.log('  grab.debug("CS101")  - 🔍 调试指定课程');
    console.log('  grab.addCourse("CS101", 1)  - ➕ 添加课程到监控列表');
    console.log('  grab.removeCourse("CS101")  - ➖ 移除课程');
    console.log('%c⚠️ 提醒: 确保您在正确的选课页面且已登录！', 'color: #ffa500; font-weight: bold;');
    console.log('%c🛡️ 智能保护:', 'color: #ff69b4; font-weight: bold;');
    console.log('  • 多课程并发抢课（可配置）');
    console.log('  • 优先级控制（数字越小优先级越高）');
    console.log('  • 自动识别同一课程的多个教学班');
    console.log('  • 时间冲突时自动尝试其他教学班');
    console.log('  • 独立跟踪每门课程的状态');
    console.log('  • 自动处理选课成功和失败');
    console.log('%c📋 配置示例:', 'color: #9370db; font-weight: bold;');
    console.log('  在脚本顶部修改 TARGET_COURSES:');
    console.log('  const TARGET_COURSES = [');
    console.log('    { code: "23286514", priority: 1 },  // 使用课程号');
    console.log('    { code: "机器学习", priority: 1 },  // 使用课程名称');
    console.log('    { code: "CS102", priority: 2, timeFilter: ["星期一", "第1-2节"] },  // 只选星期一或1-2节的课');
    console.log('    { code: "CS103", priority: 3, teacherFilter: ["张三", "讲师"] }  // 只选张三或讲师的课');
    console.log('  ];');
    console.log('%c🆕 新功能: 支持课程号和课程名称两种输入方式！', 'color: #00ff00; font-weight: bold;');
    console.log('%c🔍 过滤器功能:', 'color: #ff1493; font-weight: bold;');
    console.log('  • timeFilter - 时间过滤（支持星期、节次等关键词）');
    console.log('  • teacherFilter - 教师过滤（支持教师姓名、职称等关键词）');
    console.log('  • grab.config.showFilters() - 查看当前过滤器配置');
    console.log('%c💡 提示: 并发模式已' + (CONCURRENT_ENABLED ? '启用' : '禁用'), 'color: #00ffff; font-weight: bold;');

    // 如果配置了过滤器，显示提示
    if (GLOBAL_TIME_FILTER.length > 0 || GLOBAL_TEACHER_FILTER.length > 0) {
        console.log('%c⚠️ 已启用全局过滤器:', 'color: #ffa500; font-weight: bold;');
        if (GLOBAL_TIME_FILTER.length > 0) {
            console.log('  时间: ' + GLOBAL_TIME_FILTER.join(', '));
        }
        if (GLOBAL_TEACHER_FILTER.length > 0) {
            console.log('  教师: ' + GLOBAL_TEACHER_FILTER.join(', '));
        }
    }

    // ========== UI界面 ==========
    // 创建UI控制面板
    function createUI() {
        // 检查是否已存在UI
        if (document.getElementById('courseGrabberUI')) {
            return;
        }

        // 创建样式
        const style = document.createElement('style');
        style.textContent = `
            #courseGrabberUI {
                position: fixed;
                top: 20px;
                right: 20px;
                width: 420px;
                max-height: 90vh;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 16px;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                z-index: 999999;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                color: white;
                overflow: hidden;
                display: flex;
                flex-direction: column;
            }
            #courseGrabberUI * {
                box-sizing: border-box;
            }
            .cg-header {
                padding: 20px;
                background: rgba(0,0,0,0.2);
                cursor: move;
                display: flex;
                justify-content: space-between;
                align-items: center;
                user-select: none;
            }
            .cg-title {
                font-size: 18px;
                font-weight: bold;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            .cg-close {
                background: rgba(255,255,255,0.2);
                border: none;
                color: white;
                width: 32px;
                height: 32px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 18px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s;
            }
            .cg-close:hover {
                background: rgba(255,255,255,0.3);
                transform: rotate(90deg);
            }
            .cg-body {
                padding: 20px;
                overflow-y: auto;
                flex: 1;
            }
            .cg-section {
                background: rgba(255,255,255,0.1);
                border-radius: 12px;
                padding: 16px;
                margin-bottom: 16px;
                backdrop-filter: blur(10px);
            }
            .cg-section-title {
                font-size: 14px;
                font-weight: bold;
                margin-bottom: 12px;
                opacity: 0.9;
                display: flex;
                align-items: center;
                gap: 6px;
            }
            .cg-input {
                width: 100%;
                padding: 10px 12px;
                border: 2px solid rgba(255,255,255,0.2);
                background: rgba(255,255,255,0.1);
                border-radius: 8px;
                color: white;
                font-size: 13px;
                margin-bottom: 8px;
                transition: all 0.3s;
            }
            .cg-input:focus {
                outline: none;
                border-color: rgba(255,255,255,0.5);
                background: rgba(255,255,255,0.15);
            }
            .cg-input::placeholder {
                color: rgba(255,255,255,0.5);
            }
            .cg-btn {
                padding: 10px 20px;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 13px;
                font-weight: bold;
                transition: all 0.3s;
                display: inline-flex;
                align-items: center;
                gap: 6px;
                justify-content: center;
            }
            .cg-btn-primary {
                background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
                color: #333;
            }
            .cg-btn-primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 20px rgba(67,233,123,0.4);
            }
            .cg-btn-danger {
                background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                color: white;
            }
            .cg-btn-danger:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 20px rgba(245,87,108,0.4);
            }
            .cg-btn-secondary {
                background: rgba(255,255,255,0.2);
                color: white;
            }
            .cg-btn-secondary:hover {
                background: rgba(255,255,255,0.3);
            }
            .cg-btn-small {
                padding: 6px 12px;
                font-size: 12px;
            }
            .cg-btn-group {
                display: flex;
                gap: 8px;
                margin-top: 12px;
            }
            .cg-course-list {
                max-height: 200px;
                overflow-y: auto;
                margin-top: 12px;
            }
            .cg-course-item {
                background: rgba(255,255,255,0.1);
                padding: 12px;
                border-radius: 8px;
                margin-bottom: 8px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                transition: all 0.3s;
            }
            .cg-course-item:hover {
                background: rgba(255,255,255,0.15);
            }
            .cg-course-info {
                flex: 1;
                font-size: 13px;
            }
            .cg-course-code {
                font-weight: bold;
                margin-bottom: 4px;
            }
            .cg-course-meta {
                font-size: 11px;
                opacity: 0.8;
            }
            .cg-status {
                padding: 8px 16px;
                background: rgba(255,255,255,0.1);
                border-radius: 8px;
                font-size: 13px;
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 8px;
            }
            .cg-status-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: #43e97b;
                animation: pulse 2s infinite;
            }
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }
            .cg-log-area {
                background: rgba(0,0,0,0.3);
                border-radius: 8px;
                padding: 12px;
                max-height: 150px;
                overflow-y: auto;
                font-size: 11px;
                font-family: 'Monaco', 'Menlo', monospace;
                line-height: 1.6;
            }
            .cg-log-item {
                margin-bottom: 4px;
                opacity: 0.9;
            }
            .cg-log-success { color: #43e97b; }
            .cg-log-error { color: #f5576c; }
            .cg-log-warning { color: #ffa500; }
            .cg-log-info { color: #38f9d7; }
            .cg-badge {
                display: inline-block;
                padding: 4px 8px;
                background: rgba(255,255,255,0.2);
                border-radius: 4px;
                font-size: 11px;
                margin-left: 8px;
            }
            .cg-badge-success {
                background: rgba(67,233,123,0.3);
            }
            .cg-badge-running {
                background: rgba(56,249,215,0.3);
            }
            .cg-controls {
                display: flex;
                gap: 8px;
            }
            .cg-minimize {
                background: rgba(255,255,255,0.2);
                border: none;
                color: white;
                width: 32px;
                height: 32px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s;
            }
            .cg-minimize:hover {
                background: rgba(255,255,255,0.3);
            }
            .cg-minimized {
                height: auto !important;
                width: 60px !important;
            }
            .cg-minimized .cg-body {
                display: none !important;
            }
            .cg-minimized .cg-title {
                display: none !important;
            }
            .cg-filter-input {
                font-size: 12px;
                margin-bottom: 4px;
            }
            .cg-help-text {
                font-size: 11px;
                opacity: 0.7;
                margin-top: 4px;
            }
            .cg-timer-display {
                background: rgba(255,255,255,0.15);
                padding: 16px;
                border-radius: 8px;
                text-align: center;
                font-size: 24px;
                font-weight: bold;
                letter-spacing: 2px;
                margin-top: 12px;
                font-family: 'Monaco', 'Menlo', monospace;
            }
            .cg-timer-active {
                background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                animation: timerPulse 2s infinite;
            }
            @keyframes timerPulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.02); }
            }
            .cg-time-input-group {
                display: flex;
                gap: 8px;
                align-items: center;
            }
            .cg-time-input-group input {
                flex: 1;
            }
            .cg-course-filters {
                background: rgba(0,0,0,0.2);
                padding: 8px;
                border-radius: 6px;
                margin-top: 6px;
                font-size: 11px;
            }
            .cg-course-filter-item {
                margin-bottom: 4px;
                display: flex;
                align-items: center;
                gap: 4px;
            }
            .cg-course-filter-item:last-child {
                margin-bottom: 0;
            }
            .cg-filter-label {
                opacity: 0.8;
                min-width: 40px;
            }
            .cg-course-actions {
                display: flex;
                gap: 4px;
                flex-direction: column;
            }
        `;
        document.head.appendChild(style);

        // 创建UI容器
        const ui = document.createElement('div');
        ui.id = 'courseGrabberUI';
        ui.innerHTML = `
            <div class="cg-header">
                <div class="cg-title">
                    <span>🎓</span>
                    <span>自动抢课</span>
                </div>
                <div class="cg-controls">
                    <button class="cg-minimize" id="cg-minimize-btn" title="最小化">−</button>
                    <button class="cg-close" id="cg-close-btn" title="关闭">×</button>
                </div>
            </div>
            <div class="cg-body">
                <!-- 状态显示 -->
                <div class="cg-section">
                    <div class="cg-section-title">📊 运行状态</div>
                    <div id="cg-status-display">
                        <div class="cg-status">
                            <span>状态:</span>
                            <span id="cg-status-text">未运行</span>
                        </div>
                    </div>
                </div>

                <!-- 课程管理 -->
                <div class="cg-section">
                    <div class="cg-section-title">📚 添加目标课程</div>
                    <input type="text" class="cg-input" id="cg-course-code" placeholder="课程号或课程名称 (例: 23286514 或 机器学习)">
                    <input type="number" class="cg-input" id="cg-course-priority" placeholder="优先级 (数字越小优先级越高)" value="1" min="1">
                    
                    <div class="cg-section-title" style="font-size: 13px; margin-top: 12px; margin-bottom: 8px;"> 目标课程的过滤器 (可选)</div>
                    <input type="text" class="cg-input cg-filter-input" id="cg-time-filter" placeholder="时间过滤 (例: 星期一,第1-2节)">
                    <div class="cg-help-text">多个关键词用逗号分隔，满足任意一个即可</div>
                    <input type="text" class="cg-input cg-filter-input" id="cg-teacher-filter" placeholder="教师过滤 (例: 张三,讲师)">
                    <div class="cg-help-text">支持教师姓名或职称，满足任意一个即可</div>

                    <div class="cg-section-title" style="font-size: 13px; margin-top: 12px; margin-bottom: 8px;"> 替换课程 (可选)</div>
                    <input type="text" class="cg-input cg-filter-input" id="cg-replace-code" placeholder="要替换的课程号 (例: 23306047)">
                    <div class="cg-help-text">选中新课程前，先退选此课程（用于换课）</div>
                    
                    <button class="cg-btn cg-btn-secondary cg-btn-small" id="cg-add-course" style="width: 100%; margin-top: 12px;">➕ 添加课程</button>
                </div>

                <!-- 目标课程列表 -->
                <div class="cg-section">
                    <div class="cg-section-title">📋 目标课程列表</div>
                    <div class="cg-course-list" id="cg-course-list"></div>
                </div>

                <!-- 定时开抢 -->
                <div class="cg-section">
                    <div class="cg-section-title">⏰ 定时开抢</div>
                    <div class="cg-time-input-group">
                        <input type="datetime-local" class="cg-input" id="cg-schedule-time" placeholder="选择开抢时间">
                        <button class="cg-btn cg-btn-secondary cg-btn-small" id="cg-schedule-btn">确定</button>
                    </div>
                    <div class="cg-help-text">设置自动开抢时间，到时自动开始抢课</div>
                    <div id="cg-timer-display" style="display: none;"></div>
                </div>

                <!-- 控制按钮 -->
                <div class="cg-section">
                    <div class="cg-btn-group">
                        <button class="cg-btn cg-btn-primary" id="cg-start-btn" style="flex: 1;">🚀 开始抢课</button>
                        <button class="cg-btn cg-btn-danger" id="cg-stop-btn" style="flex: 1;" disabled>⏹️ 停止</button>
                    </div>
                    <div class="cg-btn-group">
                        <button class="cg-btn cg-btn-secondary cg-btn-small" id="cg-status-btn" style="flex: 1;">📊 查看状态</button>
                        <button class="cg-btn cg-btn-secondary cg-btn-small" id="cg-debug-btn" style="flex: 1;">🔍 调试</button>
                    </div>
                </div>

                <!-- 日志显示 -->
                <div class="cg-section">
                    <div class="cg-section-title">📝 运行日志</div>
                    <div class="cg-log-area" id="cg-log-area"></div>
                </div>
            </div>
        `;

        document.body.appendChild(ui);

        // 添加拖拽功能
        makeDraggable(ui);

        // 绑定事件
        bindUIEvents();

        // 初始化课程列表
        updateCourseList();

        // 劫持日志函数以显示在UI中
        interceptLogs();

        console.log('%c✨ UI界面已加载！可拖动面板到任意位置', 'color: #43e97b; font-weight: bold; font-size: 14px;');
    }

    // 使UI可拖拽
    function makeDraggable(element) {
        const header = element.querySelector('.cg-header');
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        header.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
            element.style.right = "auto";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // 绑定UI事件
    function bindUIEvents() {
        // 关闭按钮
        document.getElementById('cg-close-btn').onclick = () => {
            document.getElementById('courseGrabberUI').style.display = 'none';
        };

        // 最小化按钮
        document.getElementById('cg-minimize-btn').onclick = () => {
            const ui = document.getElementById('courseGrabberUI');
            ui.classList.toggle('cg-minimized');
            const btn = document.getElementById('cg-minimize-btn');
            btn.textContent = ui.classList.contains('cg-minimized') ? '□' : '−';
        };

        // 添加课程
        document.getElementById('cg-add-course').onclick = () => {
            const code = document.getElementById('cg-course-code').value.trim();
            const priority = parseInt(document.getElementById('cg-course-priority').value) || 1;

            if (!code) {
                alert('请输入课程号！');
                return;
            }

            // 检查是否已存在
            if (TARGET_COURSES.some(c => c.code === code)) {
                alert('该课程已存在！');
                return;
            }

            // 获取替换课程和过滤器（使用querySelector作为备用方案）
            const replaceCodeEl = document.getElementById('cg-replace-code');
            const timeFilterEl = document.getElementById('cg-time-filter');
            const teacherFilterEl = document.getElementById('cg-teacher-filter');

            const replaceCode = (replaceCodeEl ? replaceCodeEl.value : '').trim();
            const timeFilterInput = (timeFilterEl ? timeFilterEl.value : '').trim();
            const teacherFilterInput = (teacherFilterEl ? teacherFilterEl.value : '').trim();

            // 构造最终要推入的课程对象，避免作用域或外部修改影响
            const finalCourse = { code: code, priority: priority };
            if (replaceCode) finalCourse.replaceCode = replaceCode;

            // 使用安全的解析函数处理过滤器输入（避免被篡改的 Array.prototype.filter）
            const finalTimeFilter = safeParseFilterInput(timeFilterInput);
            if (finalTimeFilter.length > 0) {
                finalCourse.timeFilter = finalTimeFilter;
            }

            const finalTeacherFilter = safeParseFilterInput(teacherFilterInput);
            if (finalTeacherFilter.length > 0) {
                finalCourse.teacherFilter = finalTeacherFilter;
            }

            // 直接推入 finalCourse（是新对象）
            TARGET_COURSES.push(finalCourse);

            // 清空所有输入
            document.getElementById('cg-course-code').value = '';
            document.getElementById('cg-course-priority').value = '1';
            document.getElementById('cg-replace-code').value = '';
            document.getElementById('cg-time-filter').value = '';
            document.getElementById('cg-teacher-filter').value = '';

            updateCourseList();

            let logMsg = `已添加课程: ${code} (优先级: ${priority})`;
            if (finalCourse.replaceCode) logMsg += ` [替换: ${finalCourse.replaceCode}]`;
            if (finalCourse.timeFilter && finalCourse.timeFilter.length > 0) {
                logMsg += ` [时间过滤: ${finalCourse.timeFilter.join(', ')}]`;
            }
            if (finalCourse.teacherFilter && finalCourse.teacherFilter.length > 0) {
                logMsg += ` [教师过滤: ${finalCourse.teacherFilter.join(', ')}]`;
            }
            addUILog('success', logMsg);
        };

        // 开始抢课
        document.getElementById('cg-start-btn').onclick = () => {
            if (TARGET_COURSES.length === 0) {
                alert('请先添加至少一门课程！');
                return;
            }

            window.grab.start();
            document.getElementById('cg-start-btn').disabled = true;
            document.getElementById('cg-stop-btn').disabled = false;
            updateStatusDisplay();
        };

        // 停止抢课
        document.getElementById('cg-stop-btn').onclick = () => {
            window.grab.stop();
            document.getElementById('cg-start-btn').disabled = false;
            document.getElementById('cg-stop-btn').disabled = true;
            updateStatusDisplay();
        };

        // 查看状态
        document.getElementById('cg-status-btn').onclick = () => {
            window.grab.status();
        };

        // 调试
        document.getElementById('cg-debug-btn').onclick = () => {
            window.grab.debug();
        };

        // 定时开抢
        document.getElementById('cg-schedule-btn').onclick = () => {
            const timeInput = document.getElementById('cg-schedule-time');
            const timeValue = timeInput.value;

            if (!timeValue) {
                alert('请先选择开抢时间！');
                return;
            }

            const scheduleTime = new Date(timeValue);
            const now = new Date();

            if (scheduleTime <= now) {
                alert('开抢时间必须大于当前时间！');
                return;
            }

            if (TARGET_COURSES.length === 0) {
                alert('请先添加至少一门课程！');
                return;
            }

            setScheduledStart(scheduleTime);
        };

        // 定期更新状态
        setInterval(updateStatusDisplay, 1000);
    }

    // 更新课程列表显示
    function updateCourseList() {
        const list = document.getElementById('cg-course-list');
        if (TARGET_COURSES.length === 0) {
            list.innerHTML = '<div style="text-align: center; opacity: 0.6; padding: 20px;">暂无课程，请先添加课程</div>';
            return;
        }

        list.innerHTML = TARGET_COURSES.map((course, index) => {
            const hasConfig = course.replaceCode || course.timeFilter || course.teacherFilter;

            let filterHTML = '';
            if (hasConfig) {
                filterHTML = '<div class="cg-course-filters">';
                if (course.replaceCode) {
                    filterHTML += `<div class="cg-course-filter-item"><span class="cg-filter-label">🔄 替换:</span><span>${course.replaceCode}</span></div>`;
                }
                if (course.timeFilter) {
                    filterHTML += `<div class="cg-course-filter-item"><span class="cg-filter-label">⏰ 时间:</span><span>${course.timeFilter.join(', ')}</span></div>`;
                }
                if (course.teacherFilter) {
                    filterHTML += `<div class="cg-course-filter-item"><span class="cg-filter-label">👨‍🏫 教师:</span><span>${course.teacherFilter.join(', ')}</span></div>`;
                }
                filterHTML += '</div>';
            } else {
                filterHTML = '<div class="cg-course-meta" style="opacity: 0.6;">🔓 无配置</div>';
            }

            return `
                <div class="cg-course-item">
                    <div class="cg-course-info">
                        <div class="cg-course-code">${course.code} <span class="cg-badge">优先级: ${course.priority}</span></div>
                        ${filterHTML}
                    </div>
                    <div class="cg-course-actions">
                        <button class="cg-btn cg-btn-secondary cg-btn-small" onclick="window.editCourseUI(${index})" title="编辑过滤器">✏️</button>
                        <button class="cg-btn cg-btn-danger cg-btn-small" onclick="window.removeCourseUI(${index})" title="删除课程">🗑️</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    // 删除课程（UI调用）
    window.removeCourseUI = (index) => {
        const course = TARGET_COURSES[index];
        if (confirm(`确定要删除课程 ${course.code} 吗？`)) {
            TARGET_COURSES.splice(index, 1);
            updateCourseList();
            addUILog('warning', `已删除课程: ${course.code}`);
        }
    };

    // 编辑课程过滤器（UI调用）
    window.editCourseUI = (index) => {
        const course = TARGET_COURSES[index];

        const replaceCode = prompt(
            `编辑课程 ${course.code} 的替换课程\n\n输入要替换的课程号，留空表示不替换\n例如: 23306047`,
            course.replaceCode || ''
        );

        if (replaceCode === null) return; // 用户取消

        const timeFilter = prompt(
            `编辑课程 ${course.code} 的时间过滤器\n\n多个关键词用逗号分隔，留空表示不过滤\n例如: 星期一,第1-2节`,
            course.timeFilter ? course.timeFilter.join(',') : ''
        );

        if (timeFilter === null) return; // 用户取消

        const teacherFilter = prompt(
            `编辑课程 ${course.code} 的教师过滤器\n\n多个关键词用逗号分隔，留空表示不过滤\n例如: 张三,讲师`,
            course.teacherFilter ? course.teacherFilter.join(',') : ''
        );

        if (teacherFilter === null) return; // 用户取消

        // 更新课程配置
        if (replaceCode.trim()) {
            course.replaceCode = replaceCode.trim();
        } else {
            delete course.replaceCode;
        }

        // 使用安全的解析函数处理过滤器输入（避免被篡改的 Array.prototype.filter）
        const parsedTimeFilter = safeParseFilterInput(timeFilter);
        if (parsedTimeFilter.length > 0) {
            course.timeFilter = parsedTimeFilter;
        } else {
            delete course.timeFilter;
        }

        const parsedTeacherFilter = safeParseFilterInput(teacherFilter);
        if (parsedTeacherFilter.length > 0) {
            course.teacherFilter = parsedTeacherFilter;
        } else {
            delete course.teacherFilter;
        }

        updateCourseList();
        addUILog('info', `已更新课程 ${course.code} 的过滤器`);
    };

    // 更新状态显示
    function updateStatusDisplay() {
        const statusText = document.getElementById('cg-status-text');

        if (statusText) {
            if (isRunning) {
                statusText.innerHTML = '<span class="cg-status-dot"></span>运行中';
                statusText.className = 'cg-badge-running';
            } else {
                statusText.textContent = '未运行';
                statusText.className = '';
            }
        }
    }

    // 添加UI日志
    function addUILog(type, message) {
        const logArea = document.getElementById('cg-log-area');
        if (!logArea) return;

        const time = new Date().toLocaleTimeString();
        const logItem = document.createElement('div');
        logItem.className = `cg-log-item cg-log-${type}`;
        logItem.textContent = `[${time}] ${message}`;

        logArea.appendChild(logItem);
        logArea.scrollTop = logArea.scrollHeight;

        // 限制日志数量
        while (logArea.children.length > 100) {
            logArea.removeChild(logArea.firstChild);
        }
    }

    // 劫持日志函数
    function interceptLogs() {
        const originalLog = log;
        window.log = function (message, type = 'info', courseCode = null) {
            originalLog(message, type, courseCode);
            const prefix = courseCode ? `[${courseCode}] ` : '';
            addUILog(type, prefix + message);
        };
    }

    // 设置定时开抢
    function setScheduledStart(targetTime) {
        // 取消之前的定时器
        if (schedulerIntervalId) {
            clearInterval(schedulerIntervalId);
        }

        scheduledTime = targetTime;
        isScheduled = true;

        // 显示倒计时
        const timerDisplay = document.getElementById('cg-timer-display');
        timerDisplay.style.display = 'block';
        timerDisplay.className = 'cg-timer-display cg-timer-active';

        // 禁用立即开始按钮
        document.getElementById('cg-start-btn').disabled = true;
        document.getElementById('cg-schedule-btn').textContent = '❌ 取消';
        document.getElementById('cg-schedule-btn').onclick = cancelScheduledStart;

        addUILog('info', `已设置定时开抢: ${targetTime.toLocaleString()}`);
        log(`⏰ 定时开抢已设置，将在 ${targetTime.toLocaleString()} 自动开始`, 'success');

        // 启动倒计时
        schedulerIntervalId = setInterval(() => {
            const now = new Date();
            const diff = scheduledTime - now;

            if (diff <= 0) {
                // 时间到，开始抢课
                clearInterval(schedulerIntervalId);
                isScheduled = false;
                timerDisplay.style.display = 'none';

                addUILog('success', '⏰ 定时时间已到，开始抢课！');
                log('⏰ 定时时间已到，自动开始抢课！', 'success');

                // 重置按钮
                document.getElementById('cg-schedule-btn').textContent = '⏰ 设置';
                document.getElementById('cg-schedule-btn').onclick = document.getElementById('cg-schedule-btn').onclick;

                // 开始抢课
                window.grab.start();
                document.getElementById('cg-start-btn').disabled = true;
                document.getElementById('cg-stop-btn').disabled = false;
            } else {
                // 更新倒计时显示
                updateCountdown(diff);
            }
        }, 100);
    }

    // 取消定时开抢
    function cancelScheduledStart() {
        if (schedulerIntervalId) {
            clearInterval(schedulerIntervalId);
        }

        scheduledTime = null;
        isScheduled = false;

        const timerDisplay = document.getElementById('cg-timer-display');
        timerDisplay.style.display = 'none';

        document.getElementById('cg-start-btn').disabled = false;
        document.getElementById('cg-schedule-btn').textContent = '⏰ 设置';

        // 重新绑定设置事件
        const scheduleBtn = document.getElementById('cg-schedule-btn');
        scheduleBtn.onclick = () => {
            const timeInput = document.getElementById('cg-schedule-time');
            const timeValue = timeInput.value;

            if (!timeValue) {
                alert('请先选择开抢时间！');
                return;
            }

            const scheduleTime = new Date(timeValue);
            const now = new Date();

            if (scheduleTime <= now) {
                alert('开抢时间必须大于当前时间！');
                return;
            }

            if (TARGET_COURSES.length === 0) {
                alert('请先添加至少一门课程！');
                return;
            }

            setScheduledStart(scheduleTime);
        };

        addUILog('warning', '已取消定时开抢');
        log('⏰ 定时开抢已取消', 'warning');
    }

    // 更新倒计时显示
    function updateCountdown(milliseconds) {
        const timerDisplay = document.getElementById('cg-timer-display');
        if (!timerDisplay) return;

        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        const ms = Math.floor((milliseconds % 1000) / 10);

        let timeString = '';
        if (hours > 0) {
            timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        } else {
            timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(ms).padStart(2, '0')}`;
        }

        timerDisplay.textContent = `⏰ ${timeString}`;

        // 最后10秒加速闪烁
        if (totalSeconds <= 10 && totalSeconds > 0) {
            timerDisplay.style.animation = 'timerPulse 0.5s infinite';
        }
    }

    // 自动创建UI
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createUI);
    } else {
        createUI();
    }

    // 提供手动显示UI的方法
    window.showGrabberUI = () => {
        const ui = document.getElementById('courseGrabberUI');
        if (ui) {
            ui.style.display = 'flex';
        } else {
            createUI();
        }
    };

})();
