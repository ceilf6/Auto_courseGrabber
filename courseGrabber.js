// 教务系统自动抢课脚本 - 多课程并发版本
// 中欧 信息工程 ceilf
// https://github.com/ceilf6
// https://blog.csdn.net/2301_78856868
// 3506456886@qq.com

// 使用方法:
// 1. 登录教务系统并进入选课页面
// 2. 配置目标课程列表 TARGET_COURSES
// 3. 按F12打开控制台，粘贴此脚本并执行
// 4. 输入 grab.start() 开始抢课

// 注意!!! 必须点击“点此查看更多”，DOM树一定得展开否则无法找到 !!!

(function () {
    'use strict';

    // ========== 配置参数 ==========
    // 支持多门课程同时抢课，格式: [{code: '课程号', priority: 优先级(数字越小优先级越高)}]
    const TARGET_COURSES = [
        // 示例配置:
        // { code: 'CS101', priority: 1 },  // 高优先级
        // { code: 'CS102', priority: 2 },  // 中优先级
        // { code: 'CS103', priority: 3 }   // 低优先级
        { code: '23286514', priority: 1 },
        { code: '23306047', priority: 2 },
        { code: '23306049', priority: 3 }
    ];

    const CHECK_INTERVAL = 2000;            // 检查间隔(毫秒)
    const MAX_ATTEMPTS = 1000;              // 最大尝试次数
    const MAX_FAILED_ATTEMPTS = 5;          // 最大连续失败次数
    const RETRY_DELAY = 3000;               // 重试延迟(毫秒)
    const CONCURRENT_ENABLED = true;        // 是否启用并发抢课

    // ========== 全局状态管理 ==========
    let attemptCount = 0;
    let isRunning = false;
    let intervalId = null;

    // 多课程状态管理
    let courseStates = new Map();           // 每门课程的状态: {courseCode: {attempts, failed, tried, conflicted, selecting, success}}
    let selectedCourses = new Set();        // 已成功选上的课程
    let activeCourses = new Set();          // 当前活跃的课程列表

    // 全局选课队列
    let selectingQueue = [];                // 正在处理的选课任务队列
    let isProcessingQueue = false;          // 是否正在处理队列

    // ========== 工具函数 ==========
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

    // 查找目标课程的所有教学班（支持多课程）
    function findAllTeachingClasses(targetCourseCode) {
        const teachingClasses = [];

        // 查找包含目标课程号的所有行
        const allElements = document.querySelectorAll('*');
        let courseSection = null;

        // 首先找到课程主行
        for (let element of allElements) {
            const text = element.textContent || '';
            if (text.includes(`(${targetCourseCode})`) || text.includes(targetCourseCode)) {
                courseSection = element.closest('div, section, table');
                break;
            }
        }

        if (!courseSection) {
            // 如果没找到课程区域，尝试表格行方式
            const courseRows = document.querySelectorAll('table tbody tr');
            for (let row of courseRows) {
                const cells = row.querySelectorAll('td');
                for (let cell of cells) {
                    if (cell.textContent.trim() === targetCourseCode) {
                        // 找到课程号后，查找同一表格中的所有教学班
                        const table = row.closest('table');
                        if (table) {
                            const allRows = table.querySelectorAll('tbody tr');
                            for (let classRow of allRows) {
                                const selectButton = classRow.querySelector('button, a, input[type="button"]');
                                if (selectButton) {
                                    const classInfo = extractTeachingClassInfo(classRow);
                                    if (classInfo && classInfo.id) {
                                        teachingClasses.push({
                                            row: classRow,
                                            info: classInfo,
                                            button: selectButton,
                                            courseCode: targetCourseCode
                                        });
                                    }
                                }
                            }
                        }
                        break;
                    }
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
                            courseCode: targetCourseCode
                        });
                    }
                }
            }
        }

        log(`找到 ${teachingClasses.length} 个教学班`, 'info', targetCourseCode);
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
            const cells = row.querySelectorAll('td');
            let className = '';
            let teacher = '';
            let capacity = '';
            let timeInfo = '';

            // 记录原始文本用于调试
            const fullText = row.textContent || row.innerText || '';

            for (let cell of cells) {
                const text = cell.textContent.trim();

                // 提取教学班名称（如：工程化学-0001）
                if (text.includes('-') && text.match(/\d{4}/)) {
                    className = text;
                }

                // 提取教师信息
                if (text.includes('【') && text.includes('】')) {
                    teacher = text;
                }

                // 提取容量信息 - 只选择数字/数字格式
                if (text.match(/\d+\/\d+/)) {
                    // 只保留数字格式的容量信息
                    if (!capacity || !capacity.match(/\d+\/\d+/)) {
                        capacity = text;
                    }
                }

                // 提取时间信息
                if (text.includes('星期') || text.includes('第') || text.includes('节')) {
                    timeInfo = text;
                }
            }

            // 如果没有找到基本信息，尝试从整个行文本中提取
            if (!className || !teacher || !capacity) {
                // 尝试提取教学班名称
                const classMatch = fullText.match(/([^-\s]+[-]\d{4})/);
                if (classMatch) {
                    className = classMatch[1];
                }

                // 尝试提取教师
                const teacherMatch = fullText.match(/【([^】]+)】/);
                if (teacherMatch) {
                    teacher = `【${teacherMatch[1]}】`;
                }

                // 尝试提取容量
                const capacityMatch = fullText.match(/(\d+\/\d+|已满)/);
                if (capacityMatch) {
                    capacity = capacityMatch[1];
                }

                // 尝试提取时间
                const timeMatch = fullText.match(/(星期[一二三四五六日][^星期]*)/g);
                if (timeMatch) {
                    timeInfo = timeMatch.join(' ');
                }
            }

            // 更宽松的信息检查 - 只要有按钮就认为是有效的教学班
            const hasButton = row.querySelector('button, a, input[type="button"]') !== null;

            // 生成唯一ID
            const uniqueId = className || teacher || capacity || fullText.substring(0, 20) || `row_${Date.now()}_${Math.random()}`;

            const result = {
                className: className || '未知教学班',
                teacher: teacher || '未知教师',
                capacity: capacity || '未知容量',
                timeInfo: timeInfo || '未知时间',
                id: `${uniqueId}_${teacher || 'unknown'}`,
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
                hasButton: false,
                rawText: (row.textContent || '').substring(0, 200)
            };
        }
    }

    // 检查教学班是否有余量
    function checkTeachingClassCapacity(teachingClass) {
        try {
            // 确保teachingClass和info存在
            if (!teachingClass || !teachingClass.info) {
                return false;
            }

            const capacity = teachingClass.info.capacity;

            // 在同一行中查找所有容量信息
            const rowText = teachingClass.row ? teachingClass.row.textContent : '';
            const allCapacityMatches = rowText.match(/\d+\/\d+/g) || [];

            // 优先检查标准格式 "当前人数/最大容量" (如: 125/127)
            let match = capacity.match(/^(\d+)\/(\d+)$/);
            if (match) {
                const current = parseInt(match[1]);
                const max = parseInt(match[2]);
                return current < max;
            }

            // 如果当前容量信息不是标准格式，在所有容量信息中查找标准格式
            for (let capacityInfo of allCapacityMatches) {
                match = capacityInfo.match(/^(\d+)\/(\d+)$/);
                if (match) {
                    const current = parseInt(match[1]);
                    const max = parseInt(match[2]);
                    // 排除明显不合理的数据（如 0/0）
                    if (max > 0 && max < 1000) {
                        return current < max;
                    }
                }
            }

            // 格式: "135/0/0" - 只取第一个数字作为容量上限
            match = capacity.match(/^(\d+)\/\d+\/\d+$/);
            if (match) {
                const maxCapacity = parseInt(match[1]);

                // 在其他容量信息中查找真正的已选人数
                for (let capacityInfo of allCapacityMatches) {
                    const currentMatch = capacityInfo.match(/^(\d+)\/(\d+)$/);
                    if (currentMatch) {
                        const currentCount = parseInt(currentMatch[1]);
                        const actualCapacity = parseInt(currentMatch[2]);
                        if (actualCapacity === maxCapacity) {
                            return currentCount < maxCapacity;
                        }
                    }
                }

                // 如果找不到匹配的，继续查找其他可能的人数/容量组合
                for (let capacityInfo of allCapacityMatches) {
                    const currentMatch = capacityInfo.match(/^(\d+)\/(\d+)$/);
                    if (currentMatch) {
                        const currentCount = parseInt(currentMatch[1]);
                        const actualCapacity = parseInt(currentMatch[2]);
                        return currentCount < actualCapacity;
                    }
                }

                // 如果完全没有找到人数/容量信息，则无法判断
                return false;
            }

            // 格式: 单独的数字 - 无法判断，需要其他容量信息
            match = capacity.match(/^(\d+)$/);
            if (match) {
                // 在其他容量信息中查找人数/容量对比
                for (let capacityInfo of allCapacityMatches) {
                    const currentMatch = capacityInfo.match(/^(\d+)\/(\d+)$/);
                    if (currentMatch) {
                        const currentCount = parseInt(currentMatch[1]);
                        const actualCapacity = parseInt(currentMatch[2]);
                        return currentCount < actualCapacity;
                    }
                }

                return false;
            }

            // 如果容量信息无法解析，尝试在行中查找任何人数/容量信息
            if (allCapacityMatches.length > 0) {
                for (let capacityInfo of allCapacityMatches) {
                    const currentMatch = capacityInfo.match(/^(\d+)\/(\d+)$/);
                    if (currentMatch) {
                        const currentCount = parseInt(currentMatch[1]);
                        const actualCapacity = parseInt(currentMatch[2]);
                        if (actualCapacity > 0 && actualCapacity < 1000) {
                            return currentCount < actualCapacity;
                        }
                    }
                }
            }

            return false;
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
            // 尝试触发页面刷新或重新搜索
            const searchBtn = document.querySelector('button[onclick*="search"], input[value*="搜索"], input[value*="查询"]');
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
        } catch (error) {
            log(`刷新课程列表失败: ${error.message}`, 'warning');
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
            log(`未找到课程的任何教学班`, 'warning', courseCode);
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

            // 检查容量
            const hasCapacity = checkTeachingClassCapacity(tc);

            if (hasCapacity) {
                // 有余量，直接尝试选课
                log(`🎯 发现有余量的教学班: ${tc.info.className}`, 'success', courseCode);
                log(`📚 教师: ${tc.info.teacher}`, 'info', courseCode);
                log(`⏰ 时间: ${tc.info.timeInfo}`, 'info', courseCode);
                log(`👥 容量: ${tc.info.capacity}`, 'info', courseCode);

                const selectResult = selectTeachingClass(tc);
                if (selectResult) {
                    return; // 尝试选课后等待结果
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

        // 初始化课程状态
        courseStates.clear();
        selectedCourses.clear();
        activeCourses.clear();

        for (let course of coursesToGrab) {
            const courseCode = typeof course === 'string' ? course : course.code;
            activeCourses.add(courseCode);
            initCourseState(courseCode);
        }

        log(`🚀 开始监控 ${activeCourses.size} 门课程`, 'success');
        log(`📋 课程列表: ${Array.from(activeCourses).join(', ')}`, 'info');
        log(`⏱️ 检查间隔: ${CHECK_INTERVAL / 1000} 秒`, 'info');
        log(`🎯 最大尝试次数: ${MAX_ATTEMPTS}`, 'info');
        log(`⚡ 并发模式: ${CONCURRENT_ENABLED ? '启用' : '禁用'}`, 'info');

        // 立即执行一次
        attemptGrabCourse();

        // 设置定时器
        intervalId = setInterval(() => {
            // 每20次尝试刷新一次课程列表
            if (attemptCount % 20 === 0) {
                refreshCourseList();
                setTimeout(attemptGrabCourse, 1000); // 刷新后等待1秒再尝试
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
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
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
                    log(`  可选择: ${isSelectAvailable && !isDropAvailable && checkTeachingClassCapacity(tc) && !state.conflicted.has(tc.info.id)}`, 'info', code);

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
                        canSelect: isSelectAvailable && !isDropAvailable && checkTeachingClassCapacity(tc) && !state.conflicted.has(tc.info.id)
                    });
                });
            }

            return debugInfo;
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
            getConcurrentMode: () => CONCURRENT_ENABLED
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
    console.log('    { code: "CS101", priority: 1 },  // 高优先级');
    console.log('    { code: "CS102", priority: 2 },  // 中优先级');
    console.log('    { code: "CS103", priority: 3 }   // 低优先级');
    console.log('  ];');
    console.log('%c💡 提示: 并发模式已' + (CONCURRENT_ENABLED ? '启用' : '禁用'), 'color: #00ffff; font-weight: bold;');
})();