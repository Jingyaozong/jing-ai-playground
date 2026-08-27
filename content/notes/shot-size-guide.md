---
title: "AI 视频景别：人物该占多大？"
slug: "shot-size-guide"
category: "AI TIPS"
issue: "003"
date: "2026-08-27"
description: "从大远景到极特写：用可见边界、信息任务和画幅关系，把景别写成能生成、能检查的构图要求。"
cover: "tips-mint"
featured: false
tags: ["AI VIDEO", "CAMERA", "PROMPT", "COMPOSITION"]
readingTime: "16 分钟"
demo: false
editorialStatus: "source-backed"
sourceTitle: "Adobe Firefly Shot Size / Google Veo Prompt Guide"
sourceUrl: "https://helpx.adobe.com/firefly/web/work-with-audio-and-video/work-with-video/generate-videos-using-text-prompts.html"
sourceNote: "景别名称与产品选项依据官方指南核对；中文边界描述、选择方法和验收流程是本站的编辑转译，不把任何一种景别写成固定情绪公式。"
relatedNotes: ["camera-movement-guide", "image-prompt-guide", "ninety-second-storyboard"]
connections:
  - label: "CAMERA"
    title: "AI 视频运镜词典"
    description: "景别决定这一刻看多少，运镜决定这个范围怎样在时间里变化。"
    href: "/notes/camera-movement-guide/"
    tone: "blue"
  - label: "TOOL"
    title: "分镜整理器"
    description: "把景别、画面和运镜拆成独立字段，逐镜检查构图要求是否互相冲突。"
    href: "/tools/shot-list-cleaner/"
    tone: "mint"
  - label: "STORY"
    title: "十四镜故事生成包"
    description: "查看极特写、近景、中景、双人中景和远景怎样承担不同叙事任务。"
    href: "/stories/she-forgets-yesterday/#generation-pack"
    tone: "yellow"
---

景别不是给 Prompt 增加“专业感”的标签。它决定画面把多少空间交给人物、动作、道具和环境，也决定观众在这一秒应该先读到什么。

只写 `close-up`、`medium shot` 或“远景”仍然可能得到不同构图。更稳妥的做法是再补一层**可见边界**：人物从哪里到哪里进入画面、环境占多少、手和关键道具是否完整可见。

> [!KEY POINT]
> 景别名称告诉模型大概范围；可见边界和信息任务，才告诉这一镜为什么要这样取景。

## 先把四个概念拆开

| 概念 | 它回答的问题 | 示例 |
| --- | --- | --- |
| 景别 / Shot size | 主体在画面里占多大 | 腰部以上的中景 |
| 机位与角度 / Angle | 观众从哪里、以什么高度看 | 平视、低角度、俯拍 |
| 焦段与光学 / Lens | 视野、透视和景深怎样呈现 | 广角、长焦、浅景深 |
| 运镜 / Camera motion | 构图怎样随时间变化 | 固定、推近、横移、跟拍 |

Adobe Firefly 的生成界面把 Shot size、Camera angle 和 Motion 分成不同选项；Google Veo 的官方提示指南也分别列出景别、角度、摄影机运动和镜头效果。它们可以组合，但不能互相替代。

“低角度特写”同时包含机位和景别；“广角远景”同时包含镜头视野和景别；“从中景推到近景”才加入了时间里的运镜。

## 景别不是一条绝对刻度

不同语言、片种和产品对 `wide shot`、`long shot`、`full shot`、`medium wide shot` 的边界可能略有不同。Adobe Firefly 当前提供 Extreme close up、Close up、Medium、Long 和 Extreme long 等选项；Runway 与 Google 的指南也使用极特写、中景、远景等词。

因此本文不把某条裁切线当成行业唯一标准，而是采用三项记录：

1. **景别名称**：便于搜索、筛选和与工具沟通；
2. **可见边界**：画面具体露到人物哪里；
3. **信息任务**：这一镜最重要的主体、动作或空间关系。

```text
景别：中近景 / medium close-up
可见边界：胸口以上，双肩完整，头顶保留少量空间
信息任务：同时看清她的迟疑表情和压住信纸的手
```

## 大远景 / Extreme long shot

人物很小，地点、天气、规模和空间关系占据主要画面。它适合回答“这是哪里”“人物被怎样的世界包围”，不适合承担细微表情。

```prompt
Extreme long shot at blue hour. The two figures appear small at the center of a quiet intersection, surrounded by broad wet streets and distant apartment lights. Eye-level view, locked camera.
```

**验收重点：** 地点是否一眼成立；人物是否仍然可识别为目标主体；环境有没有淹没本镜必须完成的动作。

大远景不等于无人机俯拍。前者是景别，后者是角度和机位；大远景同样可以平视、低机位或高机位。

## 远景 / Long shot、Wide shot

人物全身和周围环境同时可见，适合走路、跑动、身体动作和人与空间的关系。Adobe Firefly 将 Long shot 描述为包含完整主体以及更多背景环境。

```prompt
Long shot, full body visible from head to shoes. She stands inside the café doorway with open space on her right, holding a folded letter at her side. The entrance and street beyond remain readable.
```

**验收重点：** 头脚是否完整；动作需要的空间是否充足；地面接触、重心和身体结构是否稳定。

如果 Prompt 同时要求“远景”和“只看清眼神里的犹豫”，两个信息任务已经互相竞争。可以拆成远景交代位置，再切近景看反应。

## 全景 / Full shot

全景更强调完整主体，人物通常从头到脚进入画面，环境仍然存在但不必像远景那样占主导。它适合展示姿态、服装、完整动作和人物与道具的接触。

```prompt
Full shot of her from head to shoes beside the bedroom mirror. Her entire reflection is visible without cropping, with enough floor space for her to take one step backward.
```

**验收重点：** 主体是否完整；镜面、门框和桌沿有没有切断关键结构；动作开始和结束时是否仍留在画内。

“完整全身”比只写“全景”更少歧义。涉及坐姿时，可以直接写“人物、椅子和双脚完整可见”，不要机械套用站立人物的头到脚边界。

## 中景 / Medium shot

中景通常在人物腰部附近取景，兼顾表情、上半身动作和少量环境。Adobe Firefly 将它描述为在主体细节与周围语境之间取得平衡，Google Veo 也把中景用于对话等需要兼顾人物与背景的场景。

```prompt
Medium shot framed from the waist up. She sits at the table with both forearms and the entire letter visible. The window and warm desk lamp remain as simple background context.
```

**验收重点：** 手部和关键道具有没有被切掉；背景信息是否足够但不抢主体；人物动作是否适合当前画框。

中景并不自动等于“普通”或“无聊”。它的价值是给表演和环境同时保留解释空间。

## 中近景 / Medium close-up

中近景通常取胸口或肩部以上，比中景更关注面部反应，又比近景保留更多身体语言。虽然不同产品不一定把它列为独立选项，但可以通过边界描述明确表达。

```prompt
Medium close-up, framed from the chest up with both shoulders visible. Her face and blue hair clip stay clear while one hand holding the top edge of the letter remains inside frame.
```

**验收重点：** 面部身份是否稳定；肩颈结构是否自然；必须出现的手或道具是否真的能进入画面。

## 近景 / Close-up

近景把注意力压缩到面部、局部动作或关键物体。Adobe Firefly 将 Close up 用于突出面部或特定细节；它适合观察反应，但会减少环境与完整动作信息。

```prompt
Close-up of her face, framed just below the shoulders. Her eyes lower toward the letter outside the frame, pause, then look up toward the person opposite her. Locked camera.
```

**验收重点：** 眼神方向是否可读；脸部、头发和配饰是否连续；画外道具是否会让动作变得难以理解。

如果信件对叙事至关重要，却完全在画外，只靠眼神可能不够。可以改用中近景让信件边缘入画，或者单独增加道具特写。

## 特写与极特写 / Detail、Extreme close-up、Macro

极特写只保留眼睛、手指、笔尖、钟表数字或物体纹理等局部。它不是“更近的近景”这么简单，而是重新指定谁成为画面主体。

```prompt
Extreme close-up of the clock display and the edge of her fingertip. The digits change once while the fingertip remains still. The rest of the room is outside the frame.
```

```prompt
Macro detail of the pen tip touching cream paper. The nib draws one short ink stroke; paper fibers and a tiny pool of wet ink remain visible. Locked camera.
```

**验收重点：** 关键细节是否清楚；局部结构有没有变形；画面是否误生成了不需要的额外对象或文字。

Macro 更强调把很小的对象或纹理拍得很大；Extreme close-up 更强调取景范围极紧。实际生成时不必争论名称，补上“画面只包含什么”更重要。

## 同一时刻，景别改变了什么

以“她读到信的第一行”为例：

| 景别 | 观众先得到的信息 | 容易失去的信息 |
| --- | --- | --- |
| 大远景 | 她被怎样的房间或城市包围 | 表情、字迹和手部动作 |
| 远景 / 全景 | 她的姿态、位置和完整身体反应 | 细微眼神与信纸内容 |
| 中景 | 上半身表演、手与信件的关系 | 房间整体尺度 |
| 中近景 / 近景 | 面部迟疑、呼吸和视线 | 身体动作与环境关系 |
| 极特写 | 眼睛、指尖、笔迹或钟表变化 | 人物身份和空间位置 |

没有“最电影”的景别，只有最适合当前信息任务的取舍。

## 一条可复用的景别结构

```prompt
[景别名称 + 可见边界]
[机位与角度]
[主体、动作和必须入画的道具]
[环境占比、前后景关系或留白方向]
[摄影机固定或一种主要运镜]
```

例如：

```prompt
Medium shot framed from the waist up, eye level.
She sits on the left third of frame, reading an unfolded letter held fully inside the shot.
The empty chair opposite her and a small portion of the café window remain visible on the right.
Locked camera; only her eyes and fingers move.
```

这段可以逐项验收：是不是腰部以上、是不是平视、信件有没有完整入画、右侧空椅是否存在、摄影机是否保持固定。

## 画幅会改变同一个景别

16:9、1:1 和 9:16 不是简单换一个外框。同样写“腰部以上中景”，横屏可以在人物旁边保留更多环境，竖屏更容易把视觉注意力集中在人物纵向身体上。

| 画幅 | 构图时优先检查 |
| --- | --- |
| 16:9 横屏 | 左右空间、人物关系、运动方向和环境层次 |
| 1:1 方形 | 中心与四周平衡，避免顶部和底部信息拥挤 |
| 9:16 竖屏 | 头顶、手部、上下层次以及主体纵向动作 |

不要先按 16:9 生成一张边界很紧的构图，再假设裁成 9:16 仍能保留所有信息。目标画幅应在生成前进入构图要求。

## 留白不是空出来就结束

留白应该与动作、视线或下一个信息有关：

- 人物看向右侧，右侧通常需要足够空间承接视线；
- 人物向左行走，左侧需要容纳下一步动作；
- 对话双人镜头要提前决定两人是否同框、谁更靠前、肩部遮挡多少；
- 关键道具位于前景时，要写清它是否完整、是否清晰，以及和人物的空间关系；
- 计划横移或拉远时，起始构图必须给运动路径留出可生成空间。

这些是编辑检查方法，不是保证模型服从的魔法词。结果出来后仍要看画面实际是否完成了信息任务。

## 六种常见构图冲突

### 1. 景别名称和边界互相打架

“极特写，全身从头到脚可见”把两个相反范围放在一起。先决定最重要的信息，再保留一个主要景别。

### 2. 既要看表情，又要看完整大动作

近景适合表情，全景适合完整身体动作。一条短镜头无法同时最大化两者，可以拆镜或用明确运镜完成变化。

### 3. 关键道具被裁出画面

如果人物要递咖啡、打开信或握住另一只手，就明确写“手和道具完整可见”，并选择容纳动作的景别。

### 4. 用广角代替远景

广角是镜头视野与透视倾向，远景是主体在画面中的大小。广角可以近距离拍人物，也可能产生夸张透视；远景也可以使用更长焦的压缩感。

### 5. 用俯拍代替大远景

俯拍回答从上面看，大远景回答主体占多大。两者可以组合，但不是同义词。

### 6. 运镜改变景别，却没有写结束构图

“缓慢推近”至少要补上从什么景别开始、最终在哪里停止。否则开头成立，结尾也可能把脸或道具裁掉。

## 图生视频先检查第一帧

图生视频通常把输入图作为第一帧。图片已经确定初始景别、边界和大部分构图，文字很难无代价地把一张极紧近景变成稳定全景。

生成前检查：

- 初始图是不是目标镜头真正需要的景别；
- 人物、手和关键道具是否已经完整可见；
- 运镜结束后需要出现的区域，图片有没有足够空间线索；
- 主体是否贴边，动作方向是否有留白；
- 目标画幅和输入图画幅是否一致；
- 多人物镜头的左右关系和遮挡是否已经清楚。

如果第一帧构图不支持任务，先调整图片，通常比继续用文字要求“大幅改景别但保持全部细节”更容易形成可解释的测试。

## 四步验收一个景别

1. **看边界**：人物从哪里到哪里可见，有没有在关节或关键道具处意外裁切；
2. **看主次**：第一眼是否落在本镜最重要的信息上；
3. **看空间**：视线、动作、对话对象和计划运镜是否有足够位置；
4. **看连续性**：与前后镜相比，景别变化是否有叙事理由，人物位置是否便于剪接。

```text
目标：腰部以上中景；双手和展开的信完整可见；右侧保留空椅。
实际：构图变成胸口以上近景，右手和信纸下半部被裁掉。
影响：读信动作无法验收，也不能与下一镜的手部特写顺接。
下一轮：输入与动作不变，只强化 waist-up、both hands fully visible 和 right-side negative space。
```

下一轮仍然只是一项待验证假设。保留输入、模型版本、参数、日期和结果，才能判断修改是否真的改善构图遵循。

## 把景别放回整个镜头流程

先在[分镜整理器](/tools/shot-list-cleaner/)里记录景别和画面任务，再用[运镜词典](/notes/camera-movement-guide/)决定构图是否需要随时间变化。文生视频要把景别与初始画面写进 Prompt；图生视频则先检查参考图是否已经承担这些信息，具体分工可以继续看[图生视频与文生视频 Prompt 指南](/notes/video-vs-image-prompt/)。

[十四镜故事生成包](/stories/she-forgets-yesterday/#generation-pack)目前同时使用极特写、近景、中景、双人中景和远景，让每一镜只承担有限的信息任务。这些仍是待测试制作设计，不代表已经生成出合格样片。

> [!JING'S NOTE]
> 待荆确认：景别不是“离人物多远”，而是这一秒愿意舍弃多少信息，换取观众对某件事更集中的注意。

## 参考来源

- [Adobe Firefly：Generate videos using text prompts（Shot size、Angle、Motion）](https://helpx.adobe.com/firefly/web/work-with-audio-and-video/work-with-video/generate-videos-using-text-prompts.html)
- [Adobe Firefly：Set shot size and angle for video generations](https://helpx.adobe.com/firefly/mobile/work-with-audio-and-video/work-with-video/set-shot-size-and-angle-for-videogeneration.html)
- [Adobe Firefly：Writing effective text prompts for video generation](https://helpx.adobe.com/firefly/web/work-with-audio-and-video/work-with-video/writing-effective-text-prompts-for-video-generation.html)
- [Runway：Camera Terms, Prompts, & Examples](https://help.runwayml.com/hc/en-us/articles/47313504791059-Camera-Terms-Prompts-Examples)
- [Google Cloud：Veo 视频生成提示指南](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/video/video-gen-prompt-guide?hl=zh-CN)

本文是 **资料文章**：景别定义与产品选项已经核对，中文边界模板、构图判断和验收流程是本站的编辑转译。示例均为待测试设计，不冒充真实生成结果，也不代表荆已经确认的个人经验。
