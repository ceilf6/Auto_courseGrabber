// 教务系统自动抢课脚本
// 版本: v2.2.0 (多课程同时抢课版本 - 宽松查找增强版)
// 中欧 信息工程 ceilf
// https://github.com/ceilf6
// https://blog.csdn.net/2301_78856868
// 3506456886@qq.com
// 
// 更新日志 v2.2.0:
// - 支持同时抢多门课程
// - 支持按教师和时间筛选每门课程
// - 自动跟踪已选课程状态
// - 所有课程选完后自动停止
// - 优化了多课程管理逻辑
// - 增强了成功选课的验证机制
// - 【NEW】采用宽松查找策略，大幅提升教学班识别成功率
// - 【NEW】多重查找方法，渐进式查找确保不遗漏任何教学班
// - 【NEW】更智能的信息提取，支持多种页面布局格式

// 使用方法:
// 1. 登录教务系统并进入选课页面
// 2. 选择目标课称号并填入下面的 TARGET_COURSES 数组
// 3. 按F12打开控制台，粘贴此脚本并执行
// 4. 输入 courseGrabber.start() 开始抢课

(function () {
    'use strict';

    // ============= 配置区域 =============
    // 支持同时抢多门课程（格式：课程号或课程号+教师/时间筛选）
    const TARGET_COURSES = [
        {
            courseCode: '',      // 课程号1
            teacher: '',         // 教师筛选（可选）
            time: ''             // 时间筛选（可选）
        },
        {
            courseCode: '',      // 课程号2
            teacher: '',         // 教师筛选（可选）
            time: ''             // 时间筛选（可选）
        }
        // 可以添加更多课程...
    ];
    // ===================================

    const CHECK_INTERVAL = 2000;            // 检查间隔
    const MAX_ATTEMPTS = 1000;              // 最大尝试次数
    const MAX_FAILED_ATTEMPTS = 5;          // 最大连续失败次数
    const RETRY_DELAY = 3000;               // 重试延迟(毫秒)

    let attemptCount = 0;
    let failedAttempts = 0;                 // 连续失败次数计数器
    let isRunning = false;
    let intervalId = null;
    let triedTeachingClasses = new Set();   // 记录已尝试的教学班
    let conflictedClasses = new Set();      // 记录时间冲突的教学班
    let isSelecting = false;                // 标记当前是否正在选课操作中
    let selectedCourses = new Set();        // 记录已成功选中的课程

    // 彩色日志函数
    function log(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const prefix = `[抢课脚本 ${timestamp}]`;

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

    // 查找目标课程的所有教学班
    function findAllTeachingClasses() {
        const teachingClasses = [];

        // 查找所有课程区域
        for (const course of TARGET_COURSES) {
            // 如果该课程已经成功选上，跳过
            if (selectedCourses.has(course.courseCode)) {
                continue;
            }

            const courseCode = course.courseCode;

            // 方法1: 直接在所有表格行中查找课程号
            const allRows = document.querySelectorAll('table tbody tr, table tr');
            let courseFound = false;

            for (let row of allRows) {
                const rowText = row.textContent || '';

                // 检查是否包含目标课程号
                if (rowText.includes(courseCode)) {
                    courseFound = true;
                    // 查找该行或相邻行中的选课按钮
                    const selectButton = row.querySelector('button, a, input[type="button"]');
                    if (selectButton) {
                        const classInfo = extractTeachingClassInfo(row);
                        if (classInfo && classInfo.id) {
                            teachingClasses.push({
                                row: row,
                                info: classInfo,
                                button: selectButton,
                                courseCode: courseCode,
                                targetTeacher: course.teacher,
                                targetTime: course.time
                            });
                        }
                    }

                    // 如果当前行没有按钮，检查同一表格的其他行
                    const table = row.closest('table');
                    if (table && !selectButton) {
                        const tableRows = table.querySelectorAll('tbody tr, tr');
                        for (let tableRow of tableRows) {
                            const tableRowButton = tableRow.querySelector('button, a, input[type="button"]');
                            if (tableRowButton) {
                                const tableRowText = tableRow.textContent || '';
                                // 确保这行也与目标课程相关（可能是教学班行）
                                if (tableRowText.includes('选课') || tableRowText.includes('教学班') || tableRowText.match(/\d+\/\d+/)) {
                                    const classInfo = extractTeachingClassInfo(tableRow);
                                    if (classInfo && classInfo.id) {
                                        teachingClasses.push({
                                            row: tableRow,
                                            info: classInfo,
                                            button: tableRowButton,
                                            courseCode: courseCode,
                                            targetTeacher: course.teacher,
                                            targetTime: course.time
                                        });
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // 方法2: 如果没找到该课程，使用更宽松的查找
            if (!courseFound) {
                // 查找所有包含"选课"文本的行
                for (let row of allRows) {
                    const rowText = row.textContent || '';
                    if (rowText.includes('选课') && !rowText.includes('退选')) {
                        const selectButton = row.querySelector('button, a, input[type="button"]');
                        if (selectButton) {
                            const classInfo = extractTeachingClassInfo(row);
                            if (classInfo && classInfo.id) {
                                teachingClasses.push({
                                    row: row,
                                    info: classInfo,
                                    button: selectButton,
                                    courseCode: courseCode,
                                    targetTeacher: course.teacher,
                                    targetTime: course.time
                                });
                            }
                        }
                    }
                }
            }

            // 方法3: 如果还是没找到，查找所有有按钮的行
            if (teachingClasses.filter(tc => tc.courseCode === courseCode).length === 0) {
                const buttonRows = document.querySelectorAll('tr');
                for (let row of buttonRows) {
                    const selectButton = row.querySelector('button, a, input[type="button"]');
                    if (selectButton) {
                        const buttonText = selectButton.textContent || '';
                        const rowText = row.textContent || '';
                        // 只有包含选课相关文本的按钮才考虑
                        if (buttonText.includes('选课') || rowText.includes('选课')) {
                            const classInfo = extractTeachingClassInfo(row);
                            if (classInfo && classInfo.id) {
                                teachingClasses.push({
                                    row: row,
                                    info: classInfo,
                                    button: selectButton,
                                    courseCode: courseCode,
                                    targetTeacher: course.teacher,
                                    targetTime: course.time
                                });
                            }
                        }
                    }
                }
            }
        }

        // 去重（基于ID和课程号）
        const uniqueClasses = [];
        const seenIds = new Set();
        for (let tc of teachingClasses) {
            const uniqueKey = `${tc.courseCode}_${tc.info.id}`;
            if (!seenIds.has(uniqueKey)) {
                seenIds.add(uniqueKey);
                uniqueClasses.push(tc);
            }
        }

        log(`找到 ${uniqueClasses.length} 个教学班`);
        return uniqueClasses;
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

            // 优先尝试从数据属性中提取教师信息（格式：教师号/教师姓名/职称）
            const jsxxAttr = row.getAttribute('data-jsxx') || row.querySelector('[data-jsxx]')?.getAttribute('data-jsxx');
            if (jsxxAttr && jsxxAttr.includes('/')) {
                const parts = jsxxAttr.split('/');
                if (parts.length >= 2) {
                    teacher = parts[1]; // 提取教师姓名（第二部分）
                }
            }

            for (let cell of cells) {
                const text = cell.textContent.trim();

                // 如果还没有找到教师，尝试从单元格的data-jsxx属性中提取
                if (!teacher) {
                    const cellJsxx = cell.getAttribute('data-jsxx') || cell.getAttribute('jsxx');
                    if (cellJsxx && cellJsxx.includes('/')) {
                        const parts = cellJsxx.split('/');
                        if (parts.length >= 2) {
                            teacher = parts[1];
                        }
                    }
                }

                // 提取教学班名称（更宽松的匹配）
                if (!className) {
                    // 匹配 课程名-数字 格式
                    if (text.includes('-') && text.match(/\d{3,4}/)) {
                        className = text;
                    }
                    // 匹配纯数字教学班号
                    else if (text.match(/^\d{3,4}$/) && cells.length > 1) {
                        className = text;
                    }
                }

                // 提取容量信息（优先提取，避免与教师混淆）
                if (!capacity) {
                    // 匹配各种容量格式: 数字/数字 或 【数字/数字】 或 已满
                    if (text.match(/^【?\d+\/\d+】?$/) || text === '已满') {
                        capacity = text;
                    }
                }

                // 提取教师信息（更宽松的匹配）
                if (!teacher) {
                    // 首先尝试匹配 教师号/教师姓名/职称 格式
                    const jsxxMatch = text.match(/\d{8}[\/\\]([\u4e00-\u9fa5A-Za-z\s]+)[\/\\]/);
                    if (jsxxMatch) {
                        teacher = jsxxMatch[1].trim();
                    }
                    // 检查【】内容，但要排除容量格式
                    else if (text.includes('【') && text.includes('】') && !text.match(/【\d+\/\d+】/)) {
                        teacher = text;
                    }
                    // 匹配教师姓名（中文姓名），排除常见的非教师信息
                    else if (text.match(/^[\u4e00-\u9fa5]{2,4}$/) &&
                        !text.includes('星期') &&
                        !text.includes('第') &&
                        text !== '已满' &&
                        text !== '未满' &&
                        text !== '可选' &&
                        text !== '人数' &&
                        text !== '容量') {
                        teacher = text;
                    }
                }

                // 提取时间信息（支持多种格式，累积多个时间段）
                // 匹配时间格式：星期X第X-X节 或 星期X第X-X节{X-X周} 或 星期X第X-X节｛X-X周
                if (text.match(/星期[一二三四五六日天]/) || 
                    (text.includes('第') && text.includes('节')) ||
                    text.match(/\d+-\d+周/) ||
                    text.match(/｛\d+-\d+周/) ||
                    text.match(/\{\d+-\d+周/)) {
                    // 累积时间信息，用空格分隔
                    timeInfo = timeInfo ? `${timeInfo} ${text}` : text;
                }
            }

            // 如果没有找到基本信息，尝试从整个行文本中提取
            if (!className || !teacher || !capacity) {
                // 尝试提取教学班名称
                if (!className) {
                    const classMatch = fullText.match(/([^-\s]+[-]\d{3,4})/);
                    if (classMatch) {
                        className = classMatch[1];
                    } else {
                        // 尝试匹配纯数字教学班号
                        const numMatch = fullText.match(/\b(\d{3,4})\b/);
                        if (numMatch) {
                            className = numMatch[1];
                        }
                    }
                }

                // 尝试提取容量（优先提取）
                if (!capacity) {
                    const capacityMatch = fullText.match(/【?(\d+\/\d+)】?|已满/);
                    if (capacityMatch) {
                        capacity = capacityMatch[0];
                    }
                }

                // 尝试提取教师
                if (!teacher) {
                    // 首先尝试匹配 教师号/教师姓名/职称 格式
                    const jsxxMatch = fullText.match(/\d{8}[\/\\]([\u4e00-\u9fa5A-Za-z\s]+)[\/\\]/);
                    if (jsxxMatch) {
                        teacher = jsxxMatch[1].trim();
                    } else {
                        // 查找【】包裹的内容，但排除容量格式
                        const teacherMatches = fullText.match(/【([^】]+)】/g);
                        if (teacherMatches) {
                            for (let match of teacherMatches) {
                                // 排除容量格式 【数字/数字】
                                if (!match.match(/【\d+\/\d+】/)) {
                                    teacher = match;
                                    break;
                                }
                            }
                        }
                        
                        // 如果还是没找到，尝试匹配中文姓名
                        if (!teacher) {
                            const excludeWords = ['已满', '未满', '可选', '星期', '第一', '第二', '第三', '第四', '第五', '第六', '第七', '第八', '第九', '第十', '人数', '容量', '教学班'];
                            const nameMatches = fullText.match(/[\u4e00-\u9fa5]{2,4}/g);
                            if (nameMatches) {
                                for (let name of nameMatches) {
                                    if (!excludeWords.some(word => name.includes(word))) {
                                        teacher = name;
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }

                // 尝试提取时间（支持更多格式，包括全角字符）
                if (!timeInfo) {
                    // 匹配：星期X第X-X节{X-X周} 或 星期X第X-X节｛X-X周 或 星期X第X-X节
                    const timeMatch = fullText.match(/星期[一二三四五六日天]第\d+-\d+节[｛{]\d+-\d+周[｝}]?|星期[一二三四五六日天]第\d+-\d+节/g);
                    if (timeMatch) {
                        timeInfo = timeMatch.join(' ');
                    }
                }
            }

            // 更宽松的信息检查 - 只要有按钮或包含选课相关文本就认为是有效的教学班
            const hasButton = row.querySelector('button, a, input[type="button"]') !== null;
            const hasSelectText = fullText.includes('选课') && !fullText.includes('退选');

            // 生成唯一ID（使用行的位置信息作为备用）
            const uniqueId = className || teacher || capacity || fullText.substring(0, 20) || `row_${Array.from(row.parentNode.children).indexOf(row)}`;

            const result = {
                className: className || '未知教学班',
                teacher: teacher || '未知教师',
                capacity: capacity || '未知容量',
                timeInfo: timeInfo || '未知时间',
                id: `${uniqueId}_${teacher || 'unknown'}`,
                hasButton: hasButton || hasSelectText,
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

    // 检查教学班是否符合筛选条件
    function checkTeachingClassFilter(teachingClass) {
        // 教师筛选
        if (teachingClass.targetTeacher &&
            teachingClass.info.teacher.indexOf(teachingClass.targetTeacher) === -1) {
            log(`教学班 ${teachingClass.info.className} 教师不匹配: 提取到的教师="${teachingClass.info.teacher}" 目标教师="${teachingClass.targetTeacher}"`, 'info');
            return false;
        }

        // 时间筛选
        if (teachingClass.targetTime) {
            // 如果没有提取到时间信息，检查原始文本
            let timeToCheck = teachingClass.info.timeInfo;
            if (timeToCheck === '未知时间' && teachingClass.info.rawText) {
                timeToCheck = teachingClass.info.rawText;
            }
            
            if (timeToCheck.indexOf(teachingClass.targetTime) === -1) {
                log(`教学班 ${teachingClass.info.className} 时间不匹配: 提取到的时间="${teachingClass.info.timeInfo}" 目标时间="${teachingClass.targetTime}" (原始文本前50字: ${teachingClass.info.rawText.substring(0, 50)})`, 'info');
                return false;
            }
        }

        return true;
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

        const classId = teachingClass.info.id;

        // 检查是否已经因时间冲突被跳过
        if (conflictedClasses.has(classId)) {
            log(`教学班 ${teachingClass.info.className} 已知时间冲突，跳过`, 'warning');
            return false;
        }

        try {
            log(`尝试选择教学班: ${teachingClass.info.className} (${teachingClass.info.teacher})`, 'info');
            log(`时间: ${teachingClass.info.timeInfo}`);
            log(`容量: ${teachingClass.info.capacity}`);

            // 标记正在选课
            isSelecting = true;

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
                log('找到选课元素，正在点击...', 'info');

                // 记录已尝试的教学班
                triedTeachingClasses.add(classId);

                // 点击选课元素
                selectElement.click();

                // 等待并检查结果
                setTimeout(() => {
                    // 首先检查是否有时间冲突警告
                    if (checkTimeConflictWarning()) {
                        log(`🛑 教学班 ${teachingClass.info.className} 时间冲突！`, 'error');

                        // 记录冲突的教学班
                        conflictedClasses.add(classId);

                        // 尝试关闭警告弹窗
                        const cancelButtons = document.querySelectorAll('button, input[type="button"], a');
                        for (let btn of cancelButtons) {
                            const text = btn.textContent.trim();
                            if (text.includes('取消') || text.includes('关闭') || text.includes('确定')) {
                                btn.click();
                                log('已关闭时间冲突警告弹窗', 'info');
                                break;
                            }
                        }

                        log(`继续尝试其他教学班...`, 'info');
                        isSelecting = false;
                        return;
                    }

                    // 如果没有时间冲突，查找并点击确认按钮
                    const confirmButtons = document.querySelectorAll('button, input[type="button"], a');
                    for (let btn of confirmButtons) {
                        const text = btn.textContent.trim();
                        if (text.includes('确定') || text.includes('确认') || text.includes('提交') || text.includes('OK')) {
                            btn.click();
                            log('已点击确认按钮', 'info');

                            // 点击确认后再次检查是否出现时间冲突警告
                            setTimeout(() => {
                                if (checkTimeConflictWarning()) {
                                    log(`🛑 确认后检测到时间冲突: ${teachingClass.info.className}`, 'error');
                                    conflictedClasses.add(classId);

                                    // 关闭冲突警告
                                    const closeButtons = document.querySelectorAll('button, input[type="button"], a');
                                    for (let closeBtn of closeButtons) {
                                        const closeText = closeBtn.textContent.trim();
                                        if (closeText.includes('确定') || closeText.includes('取消') || closeText.includes('关闭')) {
                                            closeBtn.click();
                                            break;
                                        }
                                    }
                                    isSelecting = false;
                                } else {
                                    // 等待更长时间再验证是否真正选课成功
                                    setTimeout(() => {
                                        // 重新查找教学班，验证是否真的选上了
                                        const updatedClasses = findAllTeachingClasses();
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
                                            failedAttempts = 0;
                                            log(`🎊 确认选课成功: ${teachingClass.info.className}！`, 'success');

                                            // 记录已选中的课程
                                            selectedCourses.add(teachingClass.courseCode);

                                            // 显示成功通知
                                            try {
                                                if (window.Notification && Notification.permission === 'granted') {
                                                    new Notification('抢课成功！', {
                                                        body: `成功选择教学班: ${teachingClass.info.className}`,
                                                        icon: '/favicon.ico'
                                                    });
                                                }

                                                alert(`🎉 抢课成功！\n课程号: ${teachingClass.courseCode}\n教学班: ${teachingClass.info.className}\n教师: ${teachingClass.info.teacher}`);
                                            } catch (e) {
                                                // 忽略通知错误
                                            }

                                            // 检查是否所有课程都已选上
                                            checkAllCoursesSelected();
                                        } else {
                                            // 实际上没有选课成功，增加重试计数
                                            failedAttempts++;
                                            log(`⚠️ 选课请求已发送但未确认成功 (失败次数: ${failedAttempts}/${MAX_FAILED_ATTEMPTS})`, 'warning');

                                            if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
                                                log(`❌ 连续失败 ${MAX_FAILED_ATTEMPTS} 次，可能是网络问题或系统异常，停止脚本`, 'error');
                                                alert(`抢课脚本已停止\n原因: 连续多次选课请求失败\n建议: 检查网络连接或手动刷新页面后重试`);
                                                stopGrabbing();
                                            }
                                        }
                                        isSelecting = false;
                                    }, 3000); // 等待3秒再验证
                                }
                            }, 1000);

                            break;
                        }
                    }
                }, 500);

                return true;
            } else {
                log('未找到可点击的选课元素', 'warning');
                isSelecting = false;
                return false;
            }
        } catch (error) {
            log(`选择教学班失败: ${error.message}`, 'error');
            isSelecting = false;
            return false;
        }
    }

    // 检查是否所有课程都已选上
    function checkAllCoursesSelected() {
        const allCourses = TARGET_COURSES.map(course => course.courseCode);
        const selected = Array.from(selectedCourses);

        // 检查是否所有课程都已选上
        const allSelected = allCourses.every(course => selected.includes(course));

        if (allSelected) {
            log(`🎉 所有课程都已成功选上！`, 'success');
            alert('🎉 恭喜！所有课程都已成功选上！');
            stopGrabbing();
        } else {
            const remaining = allCourses.filter(course => !selected.includes(course));
            log(`已选课程: ${selected.length}/${allCourses.length}, 剩余课程: ${remaining.join(', ')}`, 'info');
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

    // 主抢课逻辑
    function attemptGrabCourse() {
        if (isSelecting) {
            log('当前正在处理选课操作，跳过本次尝试', 'info');
            return;
        }

        attemptCount++;
        log(`第 ${attemptCount} 次尝试抢课`);

        if (attemptCount > MAX_ATTEMPTS) {
            log(`已达到最大尝试次数 ${MAX_ATTEMPTS}，停止抢课`, 'warning');
            stopGrabbing();
            return;
        }

        // 查找所有教学班
        const teachingClasses = findAllTeachingClasses();
        if (teachingClasses.length === 0) {
            const allCourses = TARGET_COURSES.map(course => course.courseCode);
            const remainingCourses = allCourses.filter(course => !selectedCourses.has(course));
            log(`未找到课程 ${remainingCourses.join(', ')} 的任何教学班`, 'warning');
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
            if (conflictedClasses.has(classId)) {
                continue;
            }

            // 检查是否已经尝试过
            if (triedTeachingClasses.has(classId)) {
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

            // 检查是否符合筛选条件
            if (!checkTeachingClassFilter(tc)) {
                continue;
            }

            // 检查容量
            const hasCapacity = checkTeachingClassCapacity(tc);

            if (hasCapacity) {
                // 有余量，直接尝试选课
                log(`🎯 发现有余量的教学班: ${tc.info.className}`, 'success');
                log(`📚 课程号: ${tc.courseCode}`);
                log(`👨‍🏫 教师: ${tc.info.teacher}`);
                log(`⏰ 时间: ${tc.info.timeInfo}`);
                log(`👥 容量: ${tc.info.capacity}`);

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
        if (!hasNonConflictedFullClass && conflictedClasses.size > 0) {
            log('🛑 所有教学班都存在时间冲突，停止抢课！', 'error');
            stopGrabbing();
            alert(`⚠️ 时间冲突警告\n\n所有教学班都与您已选课程时间冲突。\n冲突的教学班数量: ${conflictedClasses.size}\n\n请手动检查课程表并解决时间冲突问题。`);
            return;
        }

        // 重置已尝试列表，继续轮询
        if (triedTeachingClasses.size > 0) {
            triedTeachingClasses.clear();
        }
    }

    // 开始抢课
    function startGrabbing() {
        if (isRunning) {
            log('抢课脚本已在运行中！', 'warning');
            return;
        }

        // 请求通知权限
        if (window.Notification && Notification.permission === 'default') {
            Notification.requestPermission();
        }

        // 重置状态
        isRunning = true;
        attemptCount = 0;
        failedAttempts = 0;                // 重置失败计数器
        triedTeachingClasses.clear();      // 重置已尝试教学班
        conflictedClasses.clear();         // 重置冲突教学班
        selectedCourses.clear();           // 重置已选课程

        // 显示要抢的课程列表
        log(`🚀 开始监控 ${TARGET_COURSES.length} 门课程`, 'success');
        TARGET_COURSES.forEach((course, index) => {
            let info = `课程 ${index + 1}: ${course.courseCode}`;
            if (course.teacher) info += ` | 教师: ${course.teacher}`;
            if (course.time) info += ` | 时间: ${course.time}`;
            log(info, 'info');
        });

        log(`⏱️ 检查间隔: ${CHECK_INTERVAL / 1000} 秒`);
        log(`🎯 最大尝试次数: ${MAX_ATTEMPTS}`);

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

        // 显示最终结果
        const allCourses = TARGET_COURSES.map(course => course.courseCode);
        const selected = Array.from(selectedCourses);
        const remaining = allCourses.filter(course => !selected.includes(course));

        if (selected.length > 0) {
            log(`✅ 已成功选上 ${selected.length} 门课程: ${selected.join(', ')}`, 'success');
        }

        if (remaining.length > 0) {
            log(`❌ 未选上 ${remaining.length} 门课程: ${remaining.join(', ')}`, 'warning');
        }

        log('⏹️ 抢课脚本已停止', 'warning');
    }

    // 获取状态
    function getStatus() {
        const allCourses = TARGET_COURSES.map(course => course.courseCode);
        const selected = Array.from(selectedCourses);
        const remaining = allCourses.filter(course => !selected.includes(course));

        const status = {
            isRunning: isRunning,
            attemptCount: attemptCount,
            totalCourses: TARGET_COURSES.length,
            selectedCourses: selected.length,
            remainingCourses: remaining,
            checkInterval: CHECK_INTERVAL,
            maxAttempts: MAX_ATTEMPTS,
            triedClasses: Array.from(triedTeachingClasses),
            conflictedClasses: Array.from(conflictedClasses)
        };

        console.table(status);
        log(`已选课程: ${selected.length}/${TARGET_COURSES.length}`);
        log(`剩余课程: ${remaining.join(', ') || '无'}`);
        log(`已尝试教学班: ${triedTeachingClasses.size}个`);
        log(`时间冲突教学班: ${conflictedClasses.size}个`);
        return status;
    }

    // 暴露全局控制接口
    window.courseGrabber = {
        start: startGrabbing,
        stop: stopGrabbing,
        status: getStatus,
        debug: () => {
            log('=== 调试信息 ===', 'info');
            const classes = findAllTeachingClasses();
            log(`找到 ${classes.length} 个教学班`, 'info');
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

                log(`教学班 ${index + 1}:`, 'info');
                log(`  课程号: ${tc.courseCode}`, 'info');
                log(`  名称: ${tc.info.className}`, 'info');
                log(`  教师: ${tc.info.teacher}`, 'info');
                log(`  容量: ${tc.info.capacity}`, 'info');
                log(`  所有容量信息: [${allCapacityMatches.join(', ')}]`, 'info');
                log(`  时间: ${tc.info.timeInfo}`, 'info');
                log(`  选课元素: ${selectElementInfo}`, 'info');
                log(`  行包含选课: ${isSelectAvailable}`, 'info');
                log(`  行包含退选: ${isDropAvailable}`, 'info');
                log(`  ID: ${tc.info.id}`, 'info');
                log(`  符合筛选条件: ${checkTeachingClassFilter(tc)}`, 'info');
                log(`  有余量: ${checkTeachingClassCapacity(tc)}`, 'info');
                log(`  已尝试: ${triedTeachingClasses.has(tc.info.id)}`, 'info');
                log(`  时间冲突: ${conflictedClasses.has(tc.info.id)}`, 'info');
                log(`  可选择: ${isSelectAvailable && !isDropAvailable && checkTeachingClassCapacity(tc) && !conflictedClasses.has(tc.info.id)}`, 'info');
            });
            return classes;
        }
    };

    // 显示脚本信息
    console.log('%c🎓 自动抢课脚本已加载', 'color: #ff6b35; font-size: 18px; font-weight: bold;');
    console.log('%c🚀 支持同时抢多门课程', 'color: #4ecdc4; font-size: 14px; font-weight: bold;');
    console.log('%c⚡ 使用方法:', 'color: #45b7d1; font-size: 14px; font-weight: bold;');
    console.log('  courseGrabber.start()  - 🚀 开始抢课');
    console.log('  courseGrabber.stop()   - ⏹️ 停止抢课');
    console.log('  courseGrabber.status() - 📊 查看状态');
    console.log('  courseGrabber.debug()  - 🔍 调试信息');
    console.log('%c⚠️ 提醒: 确保您在正确的选课页面且已登录！', 'color: #ffa500; font-weight: bold;');
    console.log('%c🛡️ 智能保护: 自动处理多教学班和时间冲突', 'color: #ff69b4; font-weight: bold;');
    console.log('%c📋 功能特性:', 'color: #9370db; font-weight: bold;');
    console.log('  • 支持同时抢多门课程');
    console.log('  • 支持按教师和时间筛选');
    console.log('  • 自动识别同一课程的多个教学班');
    console.log('  • 时间冲突时自动尝试其他教学班');
    console.log('  • 🆕 宽松查找策略，大幅提升教学班识别率');
    console.log('  • 🆕 多重查找方法，适配不同页面布局');
    console.log('  • 🆕 智能信息提取，支持多种数据格式');
})();