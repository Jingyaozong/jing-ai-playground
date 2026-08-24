# JING AI PLAYGROUND

荆的个人 AI 创作者主页、实验室与作品存档站。

## 本地运行

```bash
npm install
npm run dev
```

然后访问 `http://localhost:3000`。

## 构建纯静态网站

```bash
npm run build
```

构建结果会生成在 `out/`，其中只有 HTML、CSS、JavaScript、字体和图片，不需要服务器或 ChatGPT 登录。

## 发布到 GitHub Pages

1. 在 GitHub 新建一个仓库。
2. 将这个项目推送到仓库的 `main` 分支。
3. 打开仓库的 **Settings → Pages**。
4. 在 **Build and deployment → Source** 中选择 **GitHub Actions**。
5. 项目自带的 `.github/workflows/deploy-pages.yml` 会自动构建并发布网站。

普通项目仓库的访问地址通常是：

```text
https://你的用户名.github.io/仓库名/
```

如果仓库名是 `你的用户名.github.io`，访问地址就是：

```text
https://你的用户名.github.io/
```

## 修改内容

作品、实验和工具数据集中维护在：

```text
app/data/content.ts
```

新增内容时，向 `stories`、`experiments` 或 `tools` 数组添加一条数据即可。

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
