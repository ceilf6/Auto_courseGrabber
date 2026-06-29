# 正方教务系统自动抢课脚本｜并发选课、筛选、换课与定时执行

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![JavaScript](https://img.shields.io/badge/language-JavaScript-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Version](https://img.shields.io/badge/version-2.3.2-green.svg)](https://github.com/ceilf6)

面向**正方教务系统选课页面**的 JavaScript 自动选课辅助脚本。支持多课程并发选课、课程名或课号检索、时间/教师筛选、换课、定时开抢与图形化控制台。

> 正在搜索“正方教务系统自动选课”“正方教务系统抢课脚本”“新正方教务管理系统定时选课”？请先阅读下方的适用范围，再按三步快速启动。

有关学校覆盖与证据等级，请参阅[正方高校覆盖与兼容性记录](docs/zhengfang-university-coverage.md)；远程仓库的 Description 和 Topics 请按[GitHub 元数据清单](docs/github-metadata.md)手动设置。

## ⚡ 三步开始

1. 登录学校的正方教务系统并进入**自主选课**页面。
2. 在浏览器开发者工具的 Console 中粘贴并运行 [`courseGrabber.js`](courseGrabber.js)。
3. 在右上角控制台添加课程，设置优先级、时间/教师筛选或定时开抢，然后开始选课。

## 示范教程

https://bilibili.com/video/BV15q3xz5EzY/

https://www.douyin.com/video/7651581603861720441

## 🔎 适用范围与兼容性

本项目服务于使用正方教务系统的高校选课场景；不同学校的系统版本、页面定制和选课规则可能不同，因此请区分以下三种证据：

- **正方教务平台已确认**：高校近期官方资料直接说明使用正方教学或选课平台。
- **正方官网公开高校客户**：正方官网展示该校为客户，但这不等于该校的选课页面与本脚本兼容。
- **本项目社区实测**：提交了学校、系统版本或页面特征、脚本版本、日期及结果的报告；只有这一层可以称为“本脚本已实测”。

运行前请在选课页检查是否能看到课程卡片和教学班信息。当前脚本依赖正方页面中的课程卡片结构（例如 `.panel-heading.kc_head` 与 `input[name="kch_id"]`）；若页面结构不同，请先提交脱敏兼容性报告，而不要直接提高请求频率。

## ✨ 主要特性

### 🚀 核心功能
- **多课程并发抢课** - 同时监控和抢多门课程
- **优先级控制** - 为不同课程设置优先级（数字越小优先级越高）
- **智能教学班识别** - 自动识别同一课程的多个教学班
- **时间冲突处理** - 时间冲突时自动尝试其他教学班
- **独立状态跟踪** - 每门课程独立跟踪选课状态

### 🔍 过滤器功能

- **时间过滤器** —— 仅选择符合时间条件的教学班  
  - 支持星期过滤：`星期一`、`星期三`  
  - 支持节次过滤：`第1-2节`、`第11-12节`  
  - 支持周数过滤：`1-8周`、`单周`

- **教师过滤器** —— 仅选择符合教师条件的课程  
  - 支持教师姓名过滤：`张三`  
  - 支持职称过滤：`讲师`、`教授`

- **全局 / 课程级过滤器** ——  
  支持设置全局过滤规则，或为单门课程单独配置过滤条件，满足不同选课策略需求。

### 🔽 自动展开课程信息

在选课过程中，页面需要完整展示课程的时间、教师等详细信息，因此**过滤逻辑仅在课程信息卡片处于展开状态时才会生效**。  
但由于正方选课系统在使用 jQuery 刷新列表时会重建 DOM 树，已展开的课程卡片会被自动折叠。为此，本脚本在页面刷新后**主动触发点击事件**，自动展开目标课程卡片。

需要注意的是，展开课程信息会带来一定的性能开销，可能对抢课请求的响应时延产生影响。因此，在以下场景下，脚本会自动将 `CLICK2EXPEND_ENABLED` 设置为 `false`，以避免不必要的展开操作：

1. 页面中仅存在一门课程，且该课程为目标课程  
   （正方选课系统在刷新后会自动展开列表中的第一门课程，无需额外处理）

2. 未启用时间过滤或教师过滤  
   （在无过滤目标的情况下，即使调用展开逻辑也会立即结束，但该过程仍可能引入微小延迟，从而影响抢课请求的发送频率）

### 🤝 换课功能
- **情境**：如果你 pre 课A 但是又想有 课B 保底就想着能不能骑驴找马，在 课A 有空的时候把 课B 退了之后再去抢
- **实现**：这就是换课功能存在的意义，当你输入目标课程的时候下方有一个可选字段 “替换课程” ，那么就会帮你自动监听并实现上面的功能
- **⚠️注意**：由于抢 课A 前需要先把 课B 退了，所以有 课B 退了之后 课A 没空位的风险，一般是对方和你一样用了本脚本

### ⏰ 定时功能
- **定时开抢** - 设置精确的开抢时间
- **倒计时显示** - 实时显示距离开抢时间的倒计时
- **自动启动** - 到达设定时间自动开始抢课

### 🎨 图形化界面
- **现代化UI设计** - 渐变色主题，美观大方
- **可拖拽面板** - 可移动到屏幕任意位置
- **实时日志** - 彩色日志实时显示运行状态
- **一键操作** - 所有功能都可通过界面操作
- **最小化功能** - 不占用屏幕空间

## 📦 安装使用

### 方法一：直接使用（推荐）

1. **登录教务系统**
   - 打开浏览器，登录到学校教务系统
   - 进入选课页面

2. **打开浏览器控制台**
   - Windows/Linux: 按 `F12` 或 `Ctrl + Shift + I`
   - macOS: 按 `Command + Option + I`

3. **加载脚本**
   - 复制 `courseGrabber.js` 的全部内容
   - 粘贴到控制台，按回车运行

4. **使用界面**
   - 脚本运行后会在页面右上角显示操作面板
   - 如果界面被关闭，在控制台输入 `showGrabberUI()` 重新显示

### 方法二：浏览器书签

1. 创建新书签，将以下代码作为书签地址：
```javascript
javascript:(function(){var script=document.createElement('script');script.src='你的脚本URL';document.body.appendChild(script);})();
```

2. 在选课页面点击书签即可加载脚本

## 🎯 使用教程

### 1️⃣ 添加课程

**方式一：使用UI界面（推荐）**

1. 在"📚 添加课程"区域输入课程号
2. 设置优先级（数字越小优先级越高）
3. 可选：设置时间过滤器（如：`星期一,第1-2节`）
4. 可选：设置教师过滤器（如：`叶利群,讲师`）
5. 点击"➕ 添加课程"按钮

**方式二：修改代码配置**

在脚本顶部修改 `TARGET_COURSES` 数组：

```javascript
const TARGET_COURSES = [
    { 
        code: '23286514', 
        priority: 1 
    },
    { 
        code: '23306047', 
        priority: 2,
        timeFilter: ['星期一', '第1-2节'],
        teacherFilter: ['叶利群', '讲师']
    },
];
```

### 2️⃣ 配置过滤器

**时间过滤器示例：**
```javascript
timeFilter: ['星期一', '星期三']  // 只选星期一或星期三的课
timeFilter: ['第1-2节', '第3-4节']  // 只选1-2节或3-4节的课
timeFilter: ['1-8周']  // 只选1-8周的课
```

**教师过滤器示例：**
```javascript
teacherFilter: ['叶利群']  // 只选叶利群老师的课
teacherFilter: ['讲师', '教授']  // 只选讲师或教授的课
teacherFilter: ['张三', '李四']  // 只选张三或李四老师的课
```

**编辑已添加课程的过滤器：**
- 点击课程列表中的 ✏️ 按钮
- 在弹出框中输入新的过滤条件

### 3️⃣ 开始抢课

**立即开始：**
- 点击"🚀 开始抢课"按钮

**定时开抢：**
1. 在"⏰ 定时开抢"区域选择开抢时间
2. 点击"⏰ 设置"按钮
3. 等待倒计时结束，自动开始抢课
4. 可点击"❌ 取消"按钮取消定时

**命令行方式：**
```javascript
// 立即开始
grab.start()

// 定时开抢
grab.schedule('2025-12-19 14:00:00')

// 取消定时
grab.cancelSchedule()

// 停止抢课
grab.stop()

// 查看状态
grab.status()

// 调试信息
grab.debug()
```

### 4️⃣ 监控状态

**实时监控：**
- 界面顶部显示运行状态、尝试次数、成功课程数
- 日志区域实时显示详细运行信息

**状态说明：**
- 🎯 **发现有余量** - 找到有空位的教学班
- ⏭️ **跳过教学班** - 不满足过滤条件
- 🛑 **时间冲突** - 与已选课程时间冲突
- 🎊 **选课成功** - 成功选上课程
- ⚠️ **选课失败** - 选课请求失败

## ⚙️ 高级配置

### 全局配置参数

在脚本顶部可修改以下参数：

```javascript
const CHECK_INTERVAL = 2000;            // 检查间隔(毫秒)，默认2秒
const MAX_ATTEMPTS = 1000;              // 最大尝试次数
const MAX_FAILED_ATTEMPTS = 10;         // 最大连续失败次数
const CONCURRENT_ENABLED = true;        // 是否启用并发抢课
const GLOBAL_TIME_FILTER = [];          // 全局时间过滤器
const GLOBAL_TEACHER_FILTER = [];       // 全局教师过滤器
```

### 并发模式说明

**启用并发模式** (`CONCURRENT_ENABLED = true`)：
- 同时尝试所有课程
- 效率更高，适合多门课程
- 按优先级排序，高优先级优先处理

**禁用并发模式** (`CONCURRENT_ENABLED = false`)：
- 按优先级依次尝试
- 更加稳定，适合网络不稳定情况

### API 接口

```javascript
// 课程管理
grab.addCourse('23286514', 1)           // 添加课程
grab.removeCourse('23286514')           // 移除课程

// 状态查询
grab.status()                           // 查看详细状态
grab.debug()                            // 调试所有课程
grab.debug('23286514')                  // 调试指定课程

// 定时功能
grab.schedule('2025-12-19 14:00:00')   // 定时开抢
grab.cancelSchedule()                   // 取消定时

// 配置管理
grab.config.getCourses()                // 获取课程列表
grab.config.showFilters()               // 查看过滤器配置
grab.config.getInterval()               // 获取检查间隔
grab.config.getConcurrentMode()         // 获取并发模式状态
```

## 📝 注意事项

### ⚠️ 重要提醒

1. **必须点击"点此查看更多"** - DOM树必须完全展开，否则无法找到教学班
2. **保持页面打开** - 脚本运行期间不要关闭或刷新页面
3. **网络稳定** - 确保网络连接稳定
4. **提前测试** - 建议在正式选课前测试脚本功能
5. **遵守规则** - 合理使用，不要设置过短的检查间隔

### 💡 使用技巧

1. **优先级设置** - 为最想选的课程设置最小的优先级数字
2. **过滤器组合** - 可以同时使用时间和教师过滤器
3. **多个关键词** - 过滤器支持多个关键词，满足任意一个即可
4. **定时抢课** - 精确选课时间可使用定时功能
5. **实时调整** - 运行中可以添加或删除课程

### 🐛 常见问题

**Q: 脚本运行后找不到教学班？**
A: 请确保点击了"点此查看更多"按钮，将所有教学班展开。

**Q: 提示时间冲突怎么办？**
A: 脚本会自动尝试其他教学班，如果所有教学班都冲突会自动停止。

**Q: 如何调整检查速度？**
A: 修改 `CHECK_INTERVAL` 参数，但不建议设置太小以免给服务器造成压力。

**Q: 界面不见了怎么办？**
A: 在控制台输入 `showGrabberUI()` 即可重新显示。

**Q: 如何同时抢多个时间段的课？**
A: 不设置时间过滤器，或在时间过滤器中添加多个时间段。

**Q: 上海大学、浙江大学、上海交通大学、杭州电子科技大学可以使用吗？**

A: 请以[高校覆盖记录](docs/zhengfang-university-coverage.md)中的证据等级为准。学校使用正方产品或出现在正方官网客户列表中，并不自动表示本脚本兼容；请在自主选课页面按上文的页面特征检查，并优先使用本项目的实测记录。

**Q: 新正方教务管理系统可以定时选课吗？**

A: 可以设置定时开抢；但须在选课开放前登录，并保持目标课程出现在页面中。不同学校对开放时间、选课规则和请求频率的要求不同，请遵守本校规定。

**Q: 正方教务系统如何按教师或上课时间筛选选课？**

A: 添加课程时填写教师或时间过滤条件即可。时间支持星期、节次和周数关键词；教师筛选支持姓名或职称。详见[过滤器示例](#2️⃣-配置过滤器)。

**Q: 如何反馈某学校是否兼容？**

A: 请通过[兼容性报告](.github/ISSUE_TEMPLATE/compatibility-report.md)提交学校、系统版本或非敏感页面特征、脚本版本、测试日期与结果；不要提交账号、密码、Cookie、Token、学号或私有系统链接。

## 🔧 开发与贡献

### 项目结构

```
Auto_courseGrabber/
├── courseGrabber.js    # 主脚本文件
├── README.md           # 说明文档
└── web结构/            # 网页结构参考
    ├── 自主选课.html
    ├── DOM.html
    └── 自主选课_files/
        ├── zzxkYzb.js
        ├── index.js
        └── ...
```

### 技术栈

- 原生 JavaScript (ES6+)
- DOM API
- 异步编程 (Promise, async/await)
- CSS3 动画效果

### 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 版本历史

### v2.0 (2025-12-19)
- ✨ 添加图形化UI界面
- 🎯 支持多课程并发抢课
- 🔍 添加时间和教师过滤器
- ⏰ 添加定时开抢功能
- 📊 实时状态监控和日志显示
- ✏️ 支持编辑课程过滤器

### v1.0
- 🚀 基础抢课功能
- 📚 单课程支持
- 🔄 自动重试机制

## 📜 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

- 感谢所有使用和反馈的同学
- 感谢开源社区的支持

## ⚖️ 免责声明

本脚本仅供学习交流使用，使用者需遵守学校相关规定。因使用本脚本产生的任何问题，作者不承担任何责任。请合理使用，不要给服务器造成过大压力。

## Friendly Links

- [Linux.do](https://linux.do/) - Chinese AI learning and developer community.
- [Aionui](https://github.com/iOfficeAI/AionUi) - Mobile remote-control UI for letting AI agents operate tasks from a phone.
- [OfficeCLI](https://github.com/iOfficeAI/OfficeCLI) - Office suite designed for AI agents.
- [deepseek-pp](https://github.com/zhu1090093659/deepseek-pp) - Browser extension for DeepSeek web conversations.
- [MuseAI](https://github.com/yejiming/MuseAI) - Local AI companion, text adventure, and interactive fiction app.
- [RedBox](https://github.com/Jamailar/RedBox) - Local AI creation workspace for Xiaohongshu creators.
- [1flowbase](https://github.com/taichuy/1flowbase) - Virtual model gateway for publishing multi-model workflows as OpenAI/Claude-compatible endpoints, with trace, token, latency, and cost visibility.

---

如果这个项目对你有帮助，欢迎 ⭐ Star 支持；也欢迎提交一份脱敏的[兼容性报告](.github/ISSUE_TEMPLATE/compatibility-report.md)，帮助其他使用正方教务系统的同学更快确认适用性。

**祝你抢课成功！🎉**
