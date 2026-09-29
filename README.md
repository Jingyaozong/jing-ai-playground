# JING AI PLAYGROUND

荆的个人 AI 创作者主页、实验室与作品存档站。

## 本地运行

```bash
npm install
npm run dev
```

然后访问 `http://localhost:3000`。

本地交互预览请保持使用 `localhost`，不要改用 `127.0.0.1`：Next.js 开发服务器可能拦截后者的开发资源请求，造成页面文字可见、筛选和搜索却无法使用。这不影响静态导出，也不需要为普通本地开发修改部署配置。

## 构建纯静态网站

```bash
npm run build
```

构建结果会生成在 `out/`，其中只有 HTML、CSS、JavaScript、字体和图片，不需要服务器或 ChatGPT 登录。

## 发布到 GitHub Pages

当前本地仓库已经绑定：

```text
origin  https://github.com/Jingyaozong/jing-ai-playground.git
```

目前仍是本地开发状态。不要把“已经配置远端”理解成“已经发布”：只有明确执行 `git push origin main` 后，`main` 分支上的 GitHub Actions 才会开始构建和部署。

首次发布时：

1. 在本地完成下方“发布前自检”，并确认工作区干净。
2. 明确批准上传后，才将 `main` 推送到现有 `origin`；不要在日常内容开发中自动 push。
3. 打开仓库的 **Settings → Pages**，确认 **Build and deployment → Source** 为 **GitHub Actions**。
4. 项目自带的 `.github/workflows/deploy-pages.yml` 会在 `main` 更新后构建并发布网站。

工作流会依次执行代码检查、静态构建和 Pages 路径检查；只有全部通过才会部署。

普通项目仓库的访问地址通常是：

```text
https://你的用户名.github.io/仓库名/
```

如果仓库名是 `你的用户名.github.io`，访问地址就是：

```text
https://你的用户名.github.io/
```

## 修改内容

首页卡片摘要与工具数据集中维护在：

```text
app/data/content.ts
```

故事详情数据维护在 `app/data/stories.ts`，实验详情数据维护在 `app/data/experiments.ts`。新增详情时，在对应数组中添加数据，并在 `app/data/content.ts` 的摘要卡片里填写相同 `slug`。

Library 收藏数据位于 `app/data/library.ts`，Prompt 位于 `app/data/prompts.ts`。

## 发布前自检

完整本地检查：

```bash
npm run verify:release
```

这个命令会按以下顺序执行，任一环节失败便停止：

```text
npm run lint
npm run typecheck
npm run verify:content
npm run build
npm run verify:pages
npm run verify:navigation
npm run verify:briefing
npm run verify:briefing-export
npm run verify:pages:repository
npm run verify:upload-readiness
```

其中 `verify:briefing` 使用离线样本与模拟 API，不消耗模型额度；`verify:briefing-export` 用来确认私有候选稿、工作目录和密钥信息没有进入静态网站。

最后的 `verify:pages:repository` 会模拟 `Jingyaozong/jing-ai-playground` 在 GitHub Actions 中的真实环境，使用 `/jing-ai-playground/` 子路径重新构建，并遍历全部导出 HTML 与 CSS，检查内部页面、脚本、字体和图片引用。它只生成本地 `out/`，不会连接或上传 GitHub。

准备上传前，在已经提交且工作区干净的状态运行 `npm run verify:upload`。它会先执行完整发布检查，再核对 `main` 分支、`origin` 地址、Actions 必需步骤、`.env.local` 忽略状态和待上传提交数；命令只读，不会执行 `git push`。

当前 Actions 会执行 lint、TypeScript、内容完整性、Next.js 构建、Pages 导出、导航、简报管线和私有导出边界检查。没有明确批准时，只允许创建本地 commit，不上传远端。

项目仓库发布时，Actions 会自动根据仓库名加入 `basePath`。例如仓库名为 `jing-ai-playground`，页面和静态资源都会从 `/jing-ai-playground/` 加载；用户主页仓库 `用户名.github.io` 则保持根路径。

## 新增一篇 Notes 文章

在 `content/notes/` 新建一个 `.md` 文件：

```md
---
title: "文章标题"
slug: "article-slug"
category: "AI TIPS"
issue: "005"
date: "2026-08-24"
description: "一句话摘要"
cover: "tips-yellow"
featured: false
tags: ["PROMPT", "IMAGE"]
readingTime: "6 分钟"
demo: false
sourceTitle: "JING NOTES"
sourceNote: "原创笔记"
relatedNotes: ["另一篇文章的-slug"]
---

从这里开始写 Markdown 正文。
```

保存后，Notes 列表、搜索筛选、文章详情页和 Related Notes 会自动生成，不需要再写页面。

可用分类：`AI TIPS`、`AI EVAL`、`MAKING OF`、`AI BRIEFING`。

提示卡写法：

```md
> [!TIP]
> 这里填写提示内容。
```

同时支持 `[!KEY POINT]`、`[!BAD CASE]` 和 `[!JING'S NOTE]`。

## 收藏一个 B站视频

编辑 `app/data/library.ts`，向 `libraryItems` 添加一条数据：

```ts
{
  id: 'lib-video-003',
  title: '视频标题',
  type: 'VIDEO',
  source: 'Bilibili',
  topic: 'AI Video',
  description: '视频讲了什么',
  whyISavedIt: '为什么收藏',
  jingTake: '我的一句话判断',
  tags: ['AI VIDEO'],
  dateAdded: '2026-08-24',
  featured: false,
  jingPick: true,
  visual: 'video-blue',
  url: 'https://www.bilibili.com/video/真实BV号',
  creator: 'UP主名称',
  duration: '12:30',
  demo: false,
}
```

网站只保存介绍、判断和原始链接，不下载或重新托管视频。

## 收藏一篇文章或 PDF

仍然编辑 `app/data/library.ts`。文章使用 `type: 'ARTICLE'`，PDF 使用 `type: 'PDF'`，把 `url` 设置为原始页面或 PDF 的公开链接，并填写真实来源、收藏理由和 `jingTake`。

## 新增一条 Prompt

Prompt 数据集中维护在：

```text
app/data/prompts.ts
```

向 `promptItems` 数组添加一条数据，Prompt 工作台、搜索、分类和复制功能会自动更新。外部公众号内容不作为一个 Library 栏目展示；可以把正文、截图或 Prompt 发给我，提炼为可复用结构后再放进 Prompt 工作台或 Notes。
