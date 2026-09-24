---
title: "Prompt 迭代：先问清，再验证"
slug: "prompt-iteration-ambiguity-output"
category: "AI TIPS"
issue: "020"
date: "2026-09-24"
description: "从 Anthropic 公开视频的三处英文字幕出发，整理一张目标、歧义、输出三关工作卡；只提出待试方法，不预写效果。"
titleBreakAfter: "："
cover: "prompt-iteration"
featured: false
tags: ["PROMPT", "迭代", "歧义审查", "来源核对"]
readingTime: "6 分钟"
demo: false
editorialStatus: "draft"
sourceTitle: "Anthropic / AI Prompt Engineering: A Deep Dive（公开视频英文字幕）"
sourceUrl: "https://www.youtube.com/watch?v=T9aRN5JkmL8"
sourceNote: "仅核对该视频英文字幕的 03:14、12:45、51:12 附近片段；没有逐帧核对完整视频。三关工作卡是本站据此写出的编辑候选，待荆确认；没有执行模型测试或得到效果结论。"
relatedNotes: ["ai-video-prompt-comparison", "ai-video-prompt-shot-facts", "bad-case-review-loop"]
connections:
  - label: "SOURCE"
    title: "回到 Prompt 延伸资源"
    description: "查看 Anthropic 原视频及本站对字幕核对范围的说明。"
    href: "/prompts/#prompt-resources"
    tone: "blue"
  - label: "METHOD"
    title: "怎样比较两版 Prompt"
    description: "把修改限定为一个主要变量，并为每次候选保留证据。"
    href: "/notes/ai-video-prompt-comparison/"
    tone: "yellow"
  - label: "TOOL"
    title: "打开完整 Prompt 库"
    description: "选一条真实任务模板，再用这张卡检查目标、歧义与输出。"
    href: "/prompts/all/"
    tone: "mint"
---

Prompt 写得越来越长，不一定意味着任务越来越清楚。可能只是把没说清的目标、互相冲突的限制和事后想到的补丁放进了同一段话。

这篇笔记以 [Anthropic 的公开视频](https://www.youtube.com/watch?v=T9aRN5JkmL8) 为起点，只整理**已核对英文字幕的三个时间点**。下面的“三关工作卡”是本站的编辑转译，**待荆确认、待实际测试**；它不是视频原作者提出的固定框架，也不是荆已取得的项目结果。

## 三个时间点，各提醒一件事

| 字幕位置 | 可从片段确认的意思 | 本站的工作转译 |
| --- | --- | --- |
| [03:14](https://www.youtube.com/watch?v=T9aRN5JkmL8&t=194s) | Prompt 调整需要试错；一次实验应尽量独立，避免上一轮上下文混进来。 | 留住原版本，在干净上下文中测试一次主要改动。 |
| [12:45](https://www.youtube.com/watch?v=T9aRN5JkmL8&t=765s) | 在执行前可以先让模型指出指令里不清楚、有歧义的部分；这种审查本身也可能不完美。 | 先列疑问，再由人补充事实，不把模型的猜测当作需求。 |
| [51:12](https://www.youtube.com/watch?v=T9aRN5JkmL8&t=3072s) | 仔细读 Prompt 和模型输出，拆解为什么有效或无效，并亲自测试。 | 验收具体输出是否完成任务，而不是只评价 Prompt 文案是否漂亮。 |

时间点链接指向原视频。这里没有核对完整画面或整场发言，也不把片段扩写为“官方保证有效”的规则。

## 三关工作卡：目标、歧义、输出

第一关先写**目标**。用一句话说明这次输出要帮助谁完成什么事，再写出最低可验收条件。例如，要求“整理会议待办”时，至少要说清负责人、截止时间缺失时怎么标注，以及哪些内容不能自行补全。没有验收条件，后续很容易只比谁写得顺口。

第二关查**歧义**。在正式执行前，可以让模型只列出含糊词、缺少的上下文、互相冲突的要求和它准备擅自补全的地方。人再决定补哪项事实、保留哪项未知。模型指出的歧义是一份待审核清单，不是最终需求。

第三关看**输出**。让修改前后的版本面对同一任务和事先写好的检查点，逐条保留输入、输出和不通过的原因。只有看到输出，才知道修改有没有帮助当前任务；单次改善也不能直接推断成稳定提升。

> [!KEY POINT]
> 把“写得更像好 Prompt”和“输出更适合任务”分开。前者是文本判断，后者需要实际输出与验收证据。

## 可以直接复制的空白卡

这张卡只用于准备下一轮练习，**没有预填模型结果**。

```text
任务与使用者：
这次输出必须做到：
这次输出不能擅自补全：

原 Prompt 版本：
待查歧义：
由人确认或补充的事实：
本轮唯一主要改动：

同一测试输入：
原版实际输出：待执行
新版实际输出：待执行
逐项验收证据：待观察
仍然不确定的地方：
下一轮决定：待证据填写
```

如果让模型解释“为什么刚才失败”，也要把解释当作**排查线索**。视频在这一段附近也提醒，这类自我解释未必总是准确。更稳妥的记录是：原输入是什么、输出实际出现了什么、与哪条要求不符；原因暂时无法确认时就写“未确认”。

## 不要把片段变成万能口诀

有些问题不是再改一句 Prompt 就能解决：任务目标本身未定、输入缺关键事实、验收标准相互矛盾，或者模型暂时做不到。三关的作用是尽早发现这些边界，而不是承诺“按步骤写就会成功”。

需要比较两版写法时，可接着读[只改一处：怎样比较两版视频 Prompt](/notes/ai-video-prompt-comparison/)；要从现成任务出发，可进入 [Prompt 工作台](/prompts/)。

**JING’S TAKE：待荆确认。** 本文是依据有限字幕片段写出的编辑候选，不代表荆已采用这套流程，更不代表已有实际测试结论。
