# GEO 分析工具

AI 搜索引擎优化 (Generative Engine Optimization) 分析工具，帮助你优化网站在 ChatGPT、Perplexity、Google AI Overviews、Claude 等 AI 搜索引擎中的表现。

![GEO 分析工具截图](docs/images/screenshot.jpg)

## 功能特性

- **37+ 项专业 GEO 分析指标**，涵盖技术基础、结构化数据、内容结构、E-E-A-T 信号、AI 引用模拟 5 大维度
- **22+ AI 爬虫检测** - 覆盖 GPTBot、ClaudeBot、PerplexityBot、Applebot-Extended、Bytespider 等主流 AI 爬虫
- **跨平台品牌提及扫描** - 检测品牌在 Wikipedia、YouTube、Reddit、LinkedIn 等 10+ 平台的提及情况
- **AI 引用就绪度评分** - 基于 GEO 研究（134-167 词最佳引用段落长度）评估内容被 AI 引用的概率
- **深度全站分析** - 支持按URL深度（1-5层）爬取整站，无页面数量限制
- **页面自动归类** - 全站扫描后按页面类型（首页/文章/分类/产品等）自动归类，统计各类数量与评分
- **实时分析** - 输入 URL 即可开始分析
- **可视化仪表板** - 直观展示各维度评分和详细指标
- **可操作建议** - 每项发现都配有具体可执行的优化建议，按优先级排序
- **报告导出** - 支持 HTML/JSON 格式导出分析报告

## 5 大分析维度

1. **技术基础 (20%)**
   - robots.txt 检测（含 22+ AI 爬虫配置：GPTBot、ClaudeBot、PerplexityBot、Applebot-Extended、Bytespider 等）
   - llms.txt 文件（AI 搜索引擎专用）
   - Sitemap 检测
   - HTTPS 安全性
   - 登录墙检测
   - JavaScript 依赖检测
   - 移动端友好性检测（viewport、responsive）
   - 内部/外部链接分析
   - 性能检测（CDN 使用、图片优化 WebP/懒加载/alt、第三方脚本、资源统计）
   - 元标签检测（description、keywords、author）
   - 社交标签检测（Open Graph 完整度、Twitter Card 完整度）
   - 面包屑导航检测
   - 相关文章和搜索功能检测

2. **结构化数据 (20%)**
   - Schema 检测（Article 字段完整性、FAQPage、HowTo、Organization、Person）
   - Open Graph 元标签
   - Microdata 结构化数据
   - Speakable 标记（语音搜索优化）

3. **内容结构 (25%)**
   - 标题优化检测（长度、数字、问题形式、指南/列表关键词）
   - FAQ 内容检测
   - 写作框架检测（步骤、列表、引言、结论）
   - 段落单任务性检测（3-8 句）
   - 绝对化表达检测（一定、必须、所有等）
   - 数据支撑检测（百分比、日期、量词等）
   - 问题导向性检测（标题/内容是否对应真实问题）
   - 术语一致性检测（核心术语在全文中是否一致）
   - 结论前置检测（首屏是否有明确结论）
   - 来源引用检测（引用块、参考文献、外部链接）
   - 三段式结构检测（结论-展开-建议）
   - 案例完整性检测（背景-做法-结果）
   - 方法论框架检测（方法论、框架、步骤）
   - 定义边界检测（定义+边界说明）
   - 图片尺寸检测（width/height 属性，避免 CLS）
   - 利益关系披露检测
   - 字体加载策略检测（font-display: swap、字体预加载）
   - 锚文本质量检测（避免无意义锚文本）
   - 可读性检测（段落长度、句子长度、内容长度）

4. **E-E-A-T 信号 (15%)**
   - 经验信号检测（案例、作者信息）
   - 专业信号检测（方法论、术语）
   - 可信信号检测（联系、隐私、日期）

5. **AI 引用模拟 (20%)**
   - 品牌提及检测
   - 内容质量评分
   - 情感分析（积极/消极词汇比例）

## 安装和运行

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 使用方法

1. 启动应用后，在输入框中输入要分析的网站 URL
2. 点击"开始分析"按钮
3. 查看分析结果和优化建议
4. 使用导出按钮保存分析报告

## 技术栈

- React 18
- TypeScript
- Vite
- TailwindCSS
- Lucide React (图标库)

## 什么是 GEO（生成式引擎优化）？

GEO（Generative Engine Optimization，生成式引擎优化）是针对 AI 搜索引擎（如 ChatGPT、Perplexity、Google AI Overviews）优化网站内容的技术。与传统 SEO 不同，GEO 专注于让 AI 模型更好地理解、引用和推荐你的网站内容。

## 如何提高网站的 GEO 评分？

提高 GEO 评分的关键措施包括：

### 技术基础
- 添加 llms.txt 文件
- 在 robots.txt 中配置 AI 爬虫访问权限
- 完善 Sitemap.xml
- 确保 HTTPS 安全性
- 优化页面加载速度（使用 CDN、优化图片、减少第三方脚本）
- 添加元标签（description、keywords、author）
- 完善社交分享标签（Open Graph、Twitter Card）

### 结构化数据
- 完善 JSON-LD 结构化数据（Article、FAQPage、HowTo、Organization、Person）
- 添加 Open Graph 元标签
- 考虑添加 Speakable 标记以优化语音搜索

### 内容结构
- 优化标题长度（建议 30-60 字符），使用数字、问题形式
- 确保段落单任务性（每段 3-8 句）
- 减少绝对化表达，增加限定条件
- 添加具体数据、案例和统计信息
- 在标题或开头明确要回答的问题
- 确保核心术语在全文中保持一致
- 在开头段落明确给出核心结论
- 添加引用块、参考文献或外部参考链接
- 采用结论-展开-建议的三段式结构
- 确保案例包含背景-做法-结果三个要素
- 添加清晰的方法论或框架说明
- 为核心概念添加定义和边界说明
- 为图片添加 width 和 height 属性以避免 CLS
- 添加利益关系披露声明以提升可信度
- 使用 font-display: swap 或字体预加载以优化加载性能
- 使用语义化的锚文本，避免"点击这里"等无意义文本

### E-E-A-T 信号
- 添加详细的作者信息和背景
- 展示具体案例和实践经验
- 提供清晰的方法论和术语定义
- 添加完整的联系方式和隐私政策
- 确保内容更新日期清晰可见

### AI 引用模拟
- 确保品牌名称在页面中被明确提及
- 优化内容质量，提供高价值信息
- 使用积极的表达方式，避免消极措辞

## 支持项目

如果这个工具对你有帮助，欢迎请作者喝杯咖啡 ☕

<img src="docs/images/alipay-qrcode.jpg" alt="支付宝赞赏" width="200" />

## 许可证

[CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/) — 署名-非商业性使用

本作品允许自由共享和修改，但**禁止商业使用**。
