# AltasCI Docs

使用 Astro 构建的浅色商务文档站。支持 Markdown 内容集合、集中分类配置、全文关键词搜索、文章目录、代码复制和响应式导航。

源码仓库：https://github.com/phil616/altasci-docs

页头提供明暗主题切换。首次访问跟随系统配色，手动选择后保存在浏览器本地，并在刷新、页面跳转和同源标签页间保持一致。`src/styles/theme.css` 维护深色主题与切换按钮样式。

## 本地运行

建议 Node.js 24 LTS。

```bash
npm install
npm run dev
```

默认访问 http://localhost:4321 。

```bash
npm run check    # Astro / TypeScript 检查
npm run build    # 输出 dist/
npm run preview  # 预览构建产物
```

## 新增文档

在 `src/content/docs/` 下新增 Markdown 文件：

```markdown
---
title: 我的文档
description: 一句话介绍文档的内容。
category: business
order: 10
updated: '2026-10-21'
tags: [教程]
---

## 第一节

正文从二级标题开始。
```

文章地址由文件路径生成，分类由 `category` 字段决定。侧边栏、分类页、最近更新与搜索自动读取集合。生产环境更新内容后需要重新构建。

## AI Agent 读取

本站在构建时为全部文章生成纯净 Markdown，继续使用现有静态托管，无需增加后端或开放新端口。

| 地址 | 用途 |
| --- | --- |
| `/llm.txt` | 固定阅读入口：获取方法、内容范围，以及按分类和文章顺序排列的全部文章链接、摘要、更新时间与标签 |
| `/llms.txt` | 与 `/llm.txt` 内容相同的兼容入口 |
| `/docs/<文章 ID>.md` | 单篇文章的 Markdown，例如 `/docs/pki/openpgp.md`，末尾不加斜杠 |

让智能体先 GET 本站的 `/llm.txt`，根据标题与摘要选择文章，再 GET 索引中的 Markdown 地址即可。所有 `/` 开头的路径均相对于实际部署域名根路径，不需要浏览器渲染。HTML 页面的 `<head>` 同时声明索引地址，文章页另声明对应 Markdown 地址。

输出包含文章标题、摘要、分类、更新日期、标签及正文，不包含 YAML Frontmatter 或网页布局。正文内嵌 HTML 转换为 Markdown，下载链接保留附件地址；站内文章链接自动改为已存在文章的 Markdown 地址，并保留查询参数与章节锚点。代码示例不改写，其中可能保留 HTML 语法。Demo 提示和真实内容的适用范围随原文保留。

相关实现在 `src/lib/agent-docs.ts`、`src/pages/docs/[...id].md.ts`、`src/pages/llm.txt.ts` 与 `src/pages/llms.txt.ts`。新增、更新或删除文章后，重新构建即可同步索引和 Markdown，无需维护第二份正文。不要在 `public/` 中另放同名索引文件。

专用验证命令为 `npm run test:agent-docs`，使用 Node.js 内置测试运行器，检查 HTML 转换、代码保留、链接改写、索引顺序和内容范围。

## 新增分类

当前一级分类依次为：业务文档（`business`）、业务帮助（`help`）、CI/CD 文档（`cicd`）、公钥基础设施文档（`pki`）、错误代码（`errors`）、参考资料（`reference`）。业务接口、状态、错误代码与流程中的 Demo 为示例约定，可根据实际服务替换。PKI 分类另有 CA 证书下载页和企业 OpenPGP 公钥与验证文章，分别发布公开 PEM 证书与 OpenPGP 公钥材料。

CI/CD 分类入口为 `/categories/cicd/`，阅读起点为 `/docs/cicd/overview/`。正文存放于 `src/content/docs/cicd/`，覆盖体系总览、应用形态、CI 平台、CNB 流水线、部署目标、凭据与连接方式。文章介绍 AltasCI 的交付实践，配置片段单独标注为示例，不代表文档站提供流水线执行或服务器操作能力。维护时核对相关平台的官方文档，不发布内部主机清单、实际密钥仓库路径或凭据；`localdev/` 仅作本地来源，构建不依赖它。

错误代码分类同时收录一组真实内容：服务访问错误代码（`E001` 至 `E008`），页面为 `/docs/errors/access-errors/`，源码为 `src/content/docs/errors/access-errors.md`。它与演示接口错误代码编号方式不同，需分开维护，不要互相套用措辞。

编辑 `src/data/categories.ts`，填写 `id`、`name`、`english`、`description`、`icon` 与 `color`。文章的 `category` 必须与分类 ID 对应。分类数组顺序决定导航顺序，`order` 决定分类内文章顺序。

## 主要文件

- `src/content.config.ts`：文档字段定义和校验。
- `src/layouts/Layout.astro`：全局布局、品牌、导航与搜索。
- `src/pages/index.astro`：文档中心首页。
- `src/styles/global.css`：主题与响应式样式。
- `public/brand/altasci-logo-abg.png`：品牌 LOGO（桌面与移动页头统一使用）。
- `public/favicon.ico`：浏览器网站图标。

## 部署

### CA 证书文件

公开下载文件存放于 `public/pki/certificates/`，页面为 `/docs/pki/downloads/`，源码为 `src/content/docs/pki/downloads.md`。`localdev/` 是被忽略的本地来源目录，部署不依赖该目录。更新证书时仅复制公开证书，保留原始字节，并同步下载页的证书名称、有效期、文件大小、文件 SHA-256 和证书指纹。证书指纹对应首张证书，文件校验值对应整个 PEM 文件。

### OpenPGP 公钥文件

公开公钥存放于 `public/pki/openpgp/`，文章为 `/docs/pki/openpgp/`，源码为 `src/content/docs/pki/openpgp.md`。仅将 `localdev/` 中核验过的公开材料复制到发布目录，构建不依赖本地来源目录。四个 `.asc` 文件保留原始字节；发布用 `SHA256SUMS` 使用相对文件名，不保留来源机器的绝对路径。

更新时解析全部 OpenPGP 包，确认不含私钥或其他非预期内容；在独立 GnuPG 密钥环中核对主密钥与子密钥完整指纹、UID、用途、有效期及认证签名，同步文章的文件大小、SHA-256 和当前限制，并确认构建后的下载文件与发布源文件字节一致。不要将本地 ownertrust 导出为发布材料，也不要把认证关系描述为实时在职或业务授权证明。

### 静态部署

运行 `npm ci && npm run check && npm run build`，将 `dist/` 发布到静态网站服务器。当前按域名根路径部署设计；服务器需支持目录索引和 `404.html`。本站不依赖数据库或服务端运行时。

部署时一并发布生成的 `llm.txt`、`llms.txt` 和 `docs/**/*.md`。静态服务器或 CDN 应将 `.md` 配为 `text/markdown; charset=utf-8`，将上述 `.txt` 配为 `text/plain; charset=utf-8`；端点源码中的响应头不代表静态托管会自动采用这些配置。确保这些路径不会回退到首页 HTML，不存在的文章返回 HTTP 404。上线后直接 GET `/llm.txt` 及一篇 `.md`，核对响应正文和响应头。

构建时可通过环境变量注入版本 SHA（Bash / CI）：

```bash
export ALTASCI_DOC_BUILD_SHA='xxx'
npm run build
```

PowerShell 使用 `$env:ALTASCI_DOC_BUILD_SHA = 'xxx'` 后运行 `npm run build`。设置后，构建终端及每个页面的浏览器 Console 会输出 `[AltasCI Docs] Build SHA: xxx`（构建终端的日志前缀由 Astro 提供）。未设置或为空时不输出。SHA 写入静态页面，修改后需重新构建。

内容为中文示例，可按业务替换。搜索为浏览器内置的文本匹配，适合中小型文档集；大量文档时建议切换独立搜索索引。字体从 Google Fonts 加载，网络不可达时使用系统字体；完全离线使用时移除 CSS 首行的字体导入。
