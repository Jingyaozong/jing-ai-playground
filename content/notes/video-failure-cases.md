---
title: "AI 视频最常见的 10 种崩坏"
slug: "video-failure-cases"
category: "AI EVAL"
issue: "002"
date: "2026-08-22"
description: "从脸漂、穿模到镜头失控，先给常见问题起一个准确的名字。"
cover: "eval-sky"
featured: false
tags: ["AI VIDEO", "EVALUATION"]
readingTime: "7 分钟"
demo: true
sourceTitle: "JING NOTES Demo"
sourceNote: "演示文章，坏例图片与真实测试数据将在后续补充。"
relatedNotes: ["ai-video-evaluation", "video-vs-image-prompt"]
---

很多人会把 AI 视频的问题统一叫作“崩了”。但如果问题没有准确名字，就很难知道下一轮应该修改什么。

## 十种常见问题

1. 人脸身份漂移
2. 服装与配饰变化
3. 肢体增生或消失
4. 遮挡关系错误
5. 背景纹理闪烁
6. 物体瞬移
7. 速度忽快忽慢
8. 摄影机运动失控
9. Prompt 关键动作遗漏
10. 画面清晰但叙事不成立

> [!TIP]
> 先把问题分成主体、时间、物理、镜头和指令遵循五类，再决定是否值得重生成。

## 为什么要做坏例库

坏例库可以帮助创作者建立自己的判断词典。它比只收藏漂亮成片更接近真实生产过程。

本文属于 **Demo**，后续会加入逐帧示例和修复前后对照。
