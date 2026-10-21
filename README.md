# AltasCI Docs

使用 Astro 构建的浅色商务文档站。支持 Markdown 内容集合、集中分类配置、全文关键词搜索、文章目录、代码复制和响应式导航。

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

## 新增分类

当前一级分类依次为：业务文档（`business`）、业务帮助（`help`）、公钥基础设施文档（`pki`）、错误代码（`errors`）、参考资料（`reference`）。每类提供三篇 Demo 文档，业务接口、状态、错误代码与流程均为示例约定，可根据实际服务替换。

编辑 `src/data/categories.ts`，填写 `id`、`name`、`english`、`description`、`icon` 与 `color`。文章的 `category` 必须与分类 ID 对应。分类数组顺序决定导航顺序，`order` 决定分类内文章顺序。

## 主要文件

- `src/content.config.ts`：文档字段定义和校验。
- `src/layouts/Layout.astro`：全局布局、品牌、导航与搜索。
- `src/pages/index.astro`：文档中心首页。
- `src/styles/global.css`：主题与响应式样式。
- `public/brand/altasci-logo-abg.png`：品牌 LOGO（桌面与移动页头统一使用）。
- `public/favicon.ico`：浏览器网站图标。

## 部署

运行 `npm ci && npm run check && npm run build`，将 `dist/` 发布到静态网站服务器。当前按域名根路径部署设计；服务器需支持目录索引和 `404.html`。本站不依赖数据库或服务端运行时。

内容为中文示例，可按业务替换。搜索为浏览器内置的文本匹配，适合中小型文档集；大量文档时建议切换独立搜索索引。字体从 Google Fonts 加载，网络不可达时使用系统字体；完全离线使用时移除 CSS 首行的字体导入。
