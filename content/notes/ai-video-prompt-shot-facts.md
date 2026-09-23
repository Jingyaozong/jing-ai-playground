---
title: "AI 视频 Prompt 不是一句话：镜头事实与返修记录"
slug: "ai-video-prompt-shot-facts"
category: "AI TIPS"
issue: "017"
date: "2026-08-31"
description: "把一条镜头需求拆成主体、场景、起点、动作、终点、摄影机与失败边界，并同时生成 Prompt、验收清单和返修记录。"
cover: "tips-yellow"
featured: true
tags: ["AI VIDEO", "PROMPT", "SHOT DESIGN", "WORKFLOW"]
readingTime: "15 分钟"
demo: false
editorialStatus: "source-backed"
sourceTitle: "Runway Image to Video Prompting Guide / Google Cloud Video Generation Prompt Guide"
sourceUrl: "https://help.runwayml.com/hc/en-us/articles/48324313115155-Image-to-Video-Prompting-Guide"
sourceNote: "平台提示方式依据 Runway 与 Google Cloud 官方文档核对；九层镜头事实、三份输出和返修流程是本站的编辑制作框架，不代表不同模型共享相同语法，也不代表示例已经通过真实生成。"
relatedNotes: ["first-last-frame-motion-prompt", "ai-video-generation-version-log", "video-failure-cases"]
connections:
  - label: "TOOL"
    title: "AI 视频 Prompt 组装器"
    description: "填写九层镜头事实，生成单镜 Prompt、验收清单与返修记录。"
    href: "/tools/shot-prompt-builder/"
    tone: "yellow"
  - label: "PROMPTS"
    title: "单镜动作指令"
    description: "直接打开起点、动作顺序、摄影机和结束状态的可复制模板。"
    href: "/prompts/all/?category=AI%20%E8%A7%86%E9%A2%91%E5%88%B6%E4%BD%9C#prompt-video-single-shot-motion"
    tone: "sky"
  - label: "TOOL"
    title: "镜头风险预检器"
    description: "在生成前检查动作数量、时长、运镜和首尾差异是否需要减项。"
    href: "/tools/shot-risk-checker/"
    tone: "coral"
  - label: "TOOL"
    title: "镜头版本记录器"
    description: "生成以后记录候选版本、失败时间、保留原因与下一轮变量。"
    href: "/tools/shot-version-recorder/"
    tone: "mint"
---

很多 AI 视频 Prompt 看起来很完整：人物、场景、风格、镜头、光线、动作、情绪、质量词和一长串禁止项都塞进了同一个段落。真正生成以后，却很难回答一个简单问题：**模型到底漏掉了哪一项？**

问题往往不是句子不够长，而是镜头任务没有被拆开。人物要保持什么，动作从哪里开始，什么时候结束，摄影机是否移动，环境能不能变化，这些不是同一种信息。它们需要分别填写、分别检查，也需要在生成后分别验收。

> [!KEY POINT]
> Prompt 负责告诉模型“这一镜要发生什么”；验收清单负责判断“结果有没有做到”；返修记录负责决定“下一轮只改什么”。不要让一段文字同时承担三种工作。

## 官方指南真正支持的共识

[Runway 的 Image to Video Prompting Guide](https://help.runwayml.com/hc/en-us/articles/48324313115155-Image-to-Video-Prompting-Guide)把输入图看作视频的第一帧：它已经提供构图、主体、光线和风格，文字应该主要描述主体运动、环境运动、摄影机运动、方向、速度和时间进展。指南同时建议从关键运动开始，按需要逐步增加细节，而不是第一轮就写满全部组件。

[Google Cloud 的视频生成 Prompt 指南](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/video/video-gen-prompt-guide)把 Prompt 拆成主体、动作、场景、机位、运镜和视觉风格等组成部分，并明确说明不是每条 Prompt 都必须使用全部元素。

两份官方文档的写法并不完全相同，也不能互相替代平台说明。但它们支持一个共同的制作原则：**先把想法拆成清楚的视觉组成，再决定哪些信息需要进入这一轮生成。**

本站的九层结构是在这个原则上增加了制作管理需要的起点、终点、保持项和失败边界。它不是某个模型的固定语法，而是一张镜头任务卡。

## 一条镜头，先拆成九层事实

| 层 | 回答的问题 | 写什么 | 不写什么 |
| --- | --- | --- | --- |
| `SUBJECT` | 谁或什么在动 | 身份、服装、可见配饰、初始位置 | 人物传记与抽象性格 |
| `SCENE` | 动作发生在哪里 | 空间、固定道具、材质、光线来源 | 与本镜无关的世界观 |
| `START` | 第一帧是什么状态 | 手脚位置、物体承重点、视线与静止项 | “准备开始”“即将行动” |
| `ACTION` | 中间怎样变化 | 可见动词、对象、方向和先后顺序 | “充满情绪”“很有电影感” |
| `END` | 最后一帧停在哪里 | 动作结果、停点、最终承重与朝向 | 只写“动作完成” |
| `CAMERA` | 观众怎样看见它 | 景别、机位、运镜或明确固定 | 同时要求多种冲突运镜 |
| `ENVIRONMENT` | 背景是否变化 | 风、雨、光线、布料、背景人物或保持静止 | 默认所有东西都自然运动 |
| `KEEP` | 哪些事实不能漂移 | 人物、道具数量、场景结构、光线方向 | 把所有画面细节重复一遍 |
| `EXCLUDE` | 哪些失败会让镜头报废 | 穿模、增殖、漂移、隐性切镜等高风险现象 | 无穷无尽的通用质量词 |

这九层不一定要原样粘贴到每个平台。它们首先用于发现矛盾：`START` 里杯子在桌上，`ACTION` 却让杯子在手接触前移动；`CAMERA` 写固定，后面又要求完整环绕；`KEEP` 要求晨光方向不变，`ENVIRONMENT` 却让太阳快速越过房间。

## 先写可见事实，不写解释

“她紧张地拿起杯子”对故事很有用，对镜头验收却不够具体。紧张可能表现为手指发抖、呼吸加快、视线游移或动作犹豫，模型和创作者未必选择同一种表现。

把它改成可见动作：

```text
START：右手距离杯柄约一厘米，杯底完整落在杯垫上。
ACTION：右手先停顿，指尖轻微颤动；随后靠近杯柄，四指闭合以后才抬升。
END：白杯停在杯垫上方两厘米，手保持抓握，人物没有继续移动。
```

这里仍然表达紧张，但每一项都能从视频里观察。失败后可以指出“杯子提前移动”或“结尾没有停住”，而不是只说“情绪不对”。

## 一个镜头只保留一条主动作链

短视频生成最常见的过载，是把剧本中的一句话误当成一个生成镜头：

```text
她拿起杯子，喝了一口，转头看向窗外，窗外开始下雨，摄影机绕到她背后，
最后推近杯中倒影，倒影变成童年时的房间。
```

这不是一个动作，而是接触、承重、饮用、转头、天气变化、环绕、推近和场景变形的组合。每一项都可能改变人物、物体、遮挡或空间，失败时也无法判断应该删哪一项。

更可控的拆法是：

1. 手靠近并拿起杯子；
2. 已经握住杯子的状态开始，只完成饮用；
3. 人物放下杯子后转头，窗外才开始下雨；
4. 杯中倒影的变化作为独立特写或后期合成。

拆镜不保证成功，但它让每轮测试只有一条主要因果链。

## 把摄影机从主体动作里拿出来

`ACTION` 写人物与道具怎样变化，`CAMERA` 写观看方式。两者分开以后，才容易发现同时移动是否真的必要。

```prompt
SUBJECT ACTION: Her right hand approaches the mug handle. Her fingers close around it, then the mug lifts two centimeters and stops.

CAMERA: Locked close shot. The hand, handle and bottom of the mug remain visible throughout the shot.
```

这段英文只是待测试示例，不代表特定平台的最佳语法。它的价值是把“拿起杯子”和“摄影机固定”拆成两个可以独立验收的条件。

如果基础动作还没有成立，先固定摄影机。等接触与承重稳定以后，再单独测试推近、横移或跟随。一次新增一个运动变量，结果更容易解释。

## `KEEP` 和 `EXCLUDE` 不是一回事

`KEEP` 写需要持续存在的正向事实：同一张脸、同一件珊瑚红夹克、单只白杯、杯柄朝右、晨光从北窗进入。

`EXCLUDE` 写制作上的报废条件：杯子复制、手指穿过杯柄、背景弯曲、隐性切镜。它首先服务于**生成前风险提醒和生成后验收**，不一定应该原样作为负面 Prompt 粘贴进去。

这是因为平台对负面表达的处理并不统一。Runway 的部分视频指南建议使用正向措辞，例如用 `Locked camera` 表达固定摄影机，而不是反复写“不要移动摄影机”。因此导出到具体平台时，可以把部分禁止项改写成正向状态：

| 制作上的禁止项 | 可尝试的正向表达 |
| --- | --- |
| 不要切镜 | 单个连续镜头，摄影机始终保持同一机位 |
| 杯子不要提前移动 | 杯子保持在桌面，直到抓握完全建立 |
| 背景不要变形 | 背景家具、墙面与窗框保持稳定 |
| 不要新增人物 | 画面中始终只有当前人物 |

不能自然转成正向描述的失败标签，继续留在验收清单里即可。

## 从九层事实生成三份不同文件

### 1. 生成 Prompt

只保留平台当前需要的执行信息。图生视频时，参考图已经提供的外观细节可以适当减少，把文字集中到动作和时间；文生视频时，则需要补足主体、场景与视觉事实。

```prompt
DURATION: 5 seconds
START: Her right hand is one centimeter from the mug handle. The mug rests completely on the yellow coaster.
ACTION: Her hand slowly approaches. Only after her fingers close around the handle, the mug lifts two centimeters.
END: Her hand and the mug stop together. The mug keeps the same shape and orientation.
CAMERA: Locked close shot. The fingers, handle and coaster remain visible.
ENVIRONMENT: The curtain moves slightly; the table and background remain stable.
```

它描述的是计划，不是已验证结果。模型、版本、模式和参考图变化以后，仍要重新测试。

### 2. 镜头验收清单

Prompt 里的每个重要要求，都应该变成一个可勾选问题：

- [ ] 杯子在接触建立前是否留在杯垫上；
- [ ] 手指是否围绕杯柄，而不是穿过杯柄；
- [ ] 杯子是否只出现一只，形状和朝向保持一致；
- [ ] 杯子与手是否在抓握后同步移动；
- [ ] 摄影机是否保持固定，没有隐性切镜；
- [ ] 结尾是否真的停在目标高度，而不是继续上升。

验收清单不能只写“画质好”“动作自然”。它要指出在第几秒、哪个对象、哪种关系出了问题。

### 3. 返修记录

返修记录保存本轮真实条件和下一步：

```text
模型 / 版本：
生成日期：
模式与参考图：
时长 / 画幅 / Seed：
候选 ID：
首次可见失败时间：
失败现象：
仍可使用的时间段：
下一轮唯一变量：
```

“首次可见失败时间”比“整条都不行”更有用。它能帮助判断错误发生在动作开始、接触建立、承重移动还是结束停点。

## 一轮只改一个主要变量

Runway 的官方提示指南建议先从简单 Prompt 开始，再逐步增加细节。这不仅是写作习惯，也是排错方法。

假设第一轮出现杯子提前移动，可以选择：

- 延长手靠近阶段；
- 明确杯子在接触前保持；
- 换成更清楚的近景；
- 缩短抬升距离；
- 更换参考图中的手与杯子间距。

但不要五项一起改。先固定模型、版本、时长、画幅、参考图和其他 Prompt，只改变一个主要变量。否则第二轮即使变好，也不知道真正起作用的是哪一项。

## 什么时候应该停止改 Prompt

Prompt 不是所有失败的唯一入口。遇到以下情况，继续加词通常不会让排错更清楚：

- 首帧中的手、脸或道具已经模糊、融合或被错误裁切；
- 首尾参考图的人物、光线、服装或空间结构本身不一致；
- 一个短镜头同时要求多次动作、复杂互动和大幅运镜；
- 关键接触点始终被遮挡，无法判断物理关系；
- 同一种失败连续出现两轮，而本轮没有减少任务复杂度；
- 镜头必须精确交付，但模型输出仍缺少可重复控制。

这时应该换参考图、换机位、拆镜、缩小动作，或者转入遮罩、合成、实拍和后期修正。返修记录要把这些制作成本保留下来，不能把后期修复写成模型一次生成成功。

## 一条完整的制作路径

```text
故事或分镜
  ↓ 只选择一个镜头任务
九层镜头事实
  ↓ 检查矛盾与过载
平台适配后的 Prompt
  ↓ 记录模型、版本、参考图和参数
候选视频
  ↓ 按验收清单逐帧检查
返修记录
  ↓ 下一轮只改一个主要变量
保留 / 重做 / 拆镜 / 转后期
```

这条路径的重点不是把 Prompt 写得更像技术文档，而是让创作决策有前后关系。生成前知道自己要求了什么，生成后知道它在哪一刻失败，下一轮知道为什么只改这一项。

## 生成前最后检查

- [ ] 这一轮是否只有一个主要镜头任务；
- [ ] 主体和场景只保留本镜真正需要的事实；
- [ ] 起点、动作和终点之间没有互相矛盾；
- [ ] 摄影机与主体运动已经分开；
- [ ] 环境变化明确，或明确保持稳定；
- [ ] `KEEP` 是正向锚点，不是重复全文；
- [ ] `EXCLUDE` 只保留会让镜头报废的高风险错误；
- [ ] 已按当前平台区分图生视频与文生视频写法；
- [ ] 每个重要要求都有对应验收项；
- [ ] 已准备记录真实模型、版本、参数和失败时间。

**Prompt 不是成片，也不是结论。它只是一张镜头任务卡。** 把任务写成事实，把事实变成检查，把检查变成下一轮变量，Prompt 才真正进入制作流程。

## 参考来源

- [Runway：Image to Video Prompting Guide](https://help.runwayml.com/hc/en-us/articles/48324313115155-Image-to-Video-Prompting-Guide)
- [Runway：Introduction to Prompting](https://help.runwayml.com/hc/en-us/articles/46182941379347-Introduction-to-Prompting)
- [Runway：Gen-4 Video Prompting Guide](https://help.runwayml.com/hc/en-us/articles/39789879462419-Gen-4-Video-Prompting-Guide)
- [Google Cloud：Video generation prompt guide](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/video/video-gen-prompt-guide)

本文是**资料方法文章**。九层镜头事实、三份输出和示例均为待实际制作验证的编辑框架，不代表任何模型已经通过测试，也不冒充荆的个人实测结论。
