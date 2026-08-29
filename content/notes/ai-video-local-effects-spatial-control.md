---
title: "AI 视频里的局部特效，为什么总会铺满全场？"
slug: "ai-video-local-effects-spatial-control"
category: "AI TIPS"
issue: "011"
date: "2026-08-29"
description: "雨只落在人物身上、雾只停在门后、微光只沿着手臂移动——把局部特效从一个氛围词，改写成可逐帧检查的空间关系。"
cover: "tips-blue"
featured: true
tags: ["AI VIDEO", "VFX", "SPATIAL", "EVALUATION"]
readingTime: "15 分钟"
demo: false
editorialStatus: "source-backed"
sourceTitle: "Runway Image to Video / Google Veo References / Adobe Firefly Frames"
sourceUrl: "https://help.runwayml.com/hc/en-us/articles/48324313115155-Image-to-Video-Prompting-Guide"
sourceNote: "首帧、参考图、运动提示与首尾关键帧的输入职责依据 Runway、Google Cloud 与 Adobe 当前官方资料核对；三层空间账本、九格测试和逐帧验收方法是本站编辑整理，尚未写入真实模型结果，也不代表任何模型能稳定实现局部特效。"
relatedNotes: ["first-last-frame-motion-prompt", "ai-video-scene-consistency", "video-failure-cases"]
connections:
  - label: "EXPERIMENT"
    title: "局部雨区能否稳定跟随人物？"
    description: "三种条件 × 三个相同镜头，九格空白记录台；目前 0 / 9，等待真实输出。"
    href: "/experiments/can-local-rain-follow-a-character/"
    tone: "coral"
  - label: "STORY"
    title: "雨停以前"
    description: "用同一人物和四张概念关键帧，把局部雨设定拆成可以测试的镜头。"
    href: "/stories/before-the-rain-ends/"
    tone: "yellow"
  - label: "TOOL"
    title: "局部特效约束卡生成器"
    description: "把锚点、边界、区外状态和时间规则整理成 Prompt、九格测试与逐帧验收表。"
    href: "/tools/local-effect-card/"
    tone: "mint"
---

“只让她头顶下雨，街道其他地方保持干燥。”

单帧看起来并不复杂，但一旦人物开始走，雨区可能留在原地、追不上人物、忽然扩大到整条街，或者像贴在摄影机前的一层透明素材。类似问题也会发生在局部雾、身体边缘的微光、只包围一个物体的火花、跟随手掌移动的粒子，以及限定在一扇门后的风雪。

这些失败不一定说明“雨做得不好”。更常见的问题是：**画面需要维持一个跨越时间的空间关系，而输入只说出了一个特效名词。**

> [!KEY POINT]
> 局部特效不是“雨、雾、光、火花”本身，而是四件事同时成立：特效跟着谁、边界在哪里、边界外保持什么状态、这个关系怎样随时间变化。

## 模型听见了“雨”，却没有得到完整边界

“人物周围下雨”至少隐藏了四个需要被看见的事实：

1. **锚点**：雨区跟随人物身体中心，而不是跟随画面中心或地面原点；
2. **范围**：雨区是一根约多宽、多高、什么形状的空间柱；
3. **外部状态**：雨区之外的空气、墙面和地面继续保持干燥；
4. **时间规则**：人物移动时雨区同步移动，旧位置不继续落雨，湿脚印可以留下。

把它压缩成一行制作公式：

```text
局部特效 = 锚点 + 边界 + 边界外状态 + 时间规则
```

如果只写“a small rain cloud follows her”，模型仍要自己猜“small”有多大、“follows”是跟随人物还是跟随镜头，以及雨区外的场景是否也可以变湿。结果可能漂亮，但无法验收。

## 先分清四种输入各自负责什么

不同产品和模型支持的输入不一样。以下不是一套通用按钮，而是一张制作分工表：

| 输入 | 最适合提供什么 | 不能直接保证什么 |
| --- | --- | --- |
| 文字 Prompt | 主体动作、环境运动、摄影机运动、方向、速度与时间顺序 | 每一帧都严格遵守几何边界 |
| 首帧 | 起始构图、人物位置、光线、风格与第一帧可见的特效范围 | 特效在人物移动后仍保持同样相对位置 |
| 参考图 | 人物、产品或视觉外观的依据；具体能力随模型变化 | 自动成为第一帧，或精确锁定中间帧的空间关系 |
| 尾帧 | 终点画面或变化后的目标状态 | 中间路径一定自然，也不保证边界沿途稳定 |

[Runway 的 Image to Video 指南](https://help.runwayml.com/hc/en-us/articles/48324313115155-Image-to-Video-Prompting-Guide)明确把输入图像视为第一帧，它提供构图、主体、光线和风格；文字提示则应集中描述主体、环境和摄影机的运动。官方也建议从最关键的运动开始，再逐项增加细节，以便看出哪一项改变了结果。

[Google Cloud 的视频参考图文档](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/video/generate-videos-from-references)把参考图定义为引导生成的额外输入，并按具体模型说明支持的参考类型。例如当前文档中，Veo 的相关模式使用主体参考图帮助保持人物、角色或产品外观；这并不等于它会自动锁定一块雨区的几何范围。

[Adobe Firefly 的图生视频文档](https://helpx.adobe.com/firefly/web/work-with-audio-and-video/work-with-video/generate-videos-using-images.html)则把首尾关键帧称为开始和结束的固定点，同时说明增加关键帧后，一些景别、构图、风格或运动控制可能不可用。制作记录必须写下**当时真正启用的控制项**，不能假定所有条件可以同时叠加。

## 用三层空间账本写局部特效

### 第一层：锚点跟着谁

不要只写“跟随人物”。先确定锚点属于哪种空间：

- **人物锚点**：头顶、胸口、右手、脚下或身体中心；
- **物体锚点**：伞面、信封、车灯或门把手；
- **场景锚点**：一扇门后、桌面上方或地面某个固定区域；
- **摄影机锚点**：贴近镜头的水滴或眩光——只有确实需要时才使用。

最容易混淆的是人物锚点和画面锚点。人物从左走到右时，如果雨仍停在画面中央，它在单个画面里仍可能像“局部雨”，但已经违反了故事规则。

### 第二层：边界长什么样

边界需要可观察，未必需要精确到工程单位。可以选一种相对尺度：

```text
中心：人物胸口的垂直轴线
宽度：约一个半肩宽
高度：从头顶上方延伸到脚下地面
形状：紧凑的垂直雨柱，边缘轻微羽化
遮挡：伞面挡住部分雨滴，人物背后的雨仍可见
```

“一个半肩宽”比“很小”更容易跨景别理解。特写镜头里，也可以改用“始终只覆盖伞面与肩部范围”，避免让固定像素尺寸与摄影机距离冲突。

### 第三层：边界外必须留下证据

只描述雨区内部，会让画面外部没有明确任务。边界外至少留一个可比较的状态：

```text
雨区外的空气清澈；背景灯光锐利可见。
雨区外的地面保持干燥，只留下人物走过后的湿脚印。
两侧墙面没有雨痕，厨房台面保持干燥且不反光。
```

这不是把“不要下雨”重复很多次，而是给边界外安排一种正向、可见的画面状态。

## 把否定句改成两侧都能看见的画面

> [!BAD CASE]
> 她周围下雨。不要让整个厨房下雨。不要让背景变湿。不要让雨留在原地。

这组句子告诉了我们不想要什么，却没有把正确画面写完整。可以改成：

```prompt
A compact vertical column of fine rain stays centered on the woman's body,
about one and a half shoulder-widths wide. As she takes three slow steps to
the right, the rain column moves with her at the same pace. The sunlit kitchen
air outside the column remains clear. The counter and floor outside her path
stay dry and matte. Only a short trail of wet footprints remains behind her.
The locked camera stays still for one continuous shot.
```

这是一条**待测试的编辑模板**，不是已经验证的万能 Prompt。它把同一个关系拆成：人物运动、雨区尺寸、同步规则、外部状态、允许留下的痕迹和摄影机状态。

## 首帧能画出边界，但不能替你写时间规则

首帧可以非常清楚地展示：人物头顶有一小块雨、外面是阳光、地面只有脚下湿。它解决的是起点证据。

人物开始移动后，还会出现新的问题：

- 雨区中心是否和人物保持相对位置；
- 雨区边缘是否忽大忽小；
- 旧位置的雨是否停止；
- 地面水迹是合理留下，还是整片场景一起变湿；
- 摄影机移动时，雨区究竟锁在人物、场景还是画框上。

[Google Cloud 的首尾帧生成文档](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/video/generate-videos-from-first-and-last-frames)将首帧与可选尾帧作为明确输入；[Adobe Firefly](https://helpx.adobe.com/firefly/web/work-with-audio-and-video/work-with-video/generate-videos-using-images.html)也把它们视为起止固定点。两端画面能约束“从哪里到哪里”，但中间关系仍需要 Prompt、输入设计和实际输出共同验证。

参考图同样不能替代时间规则。人物参考可以帮助保持外观，场景参考可以提供空间证据，局部雨参考可以说明目标画面；是否能在同一模式中同时使用、分别被怎样理解，要以当前产品能力为准。

## 用九格测试分清是哪一层起作用

不要用九条完全不同的 Prompt 生成九个漂亮样片。先固定三个镜头任务，再只改变局部特效条件：

| 组别 | 输入条件 | 要回答的问题 |
| --- | --- | --- |
| A 组 | 只写“局部雨跟随人物”的普通文本 | 不补空间结构时，模型怎样理解局部关系？ |
| B 组 | 增加锚点、相对尺度、外部干燥状态和时间规则 | 文本空间约束是否减少边界漂移？ |
| C 组 | 在 B 组基础上增加能看见雨区边界的首帧或参考输入 | 视觉证据是否进一步稳定起点与边界？ |

三个镜头分别测试不同压力：厨房里横向走三步、隧道里持续向前走、近景中收伞。每组都做这三个镜头，共九格。

本站已经为这个问题建立了[“局部雨区能否稳定跟随人物？”实验记录台](/experiments/can-local-rain-follow-a-character/)。目前仍是 **0 / 9**，所有格子等待真实生成结果，没有写入任何模型结论。

## 不要只看成片，要逐帧看关系

至少检查开始、25%、50%、75% 和结束五个位置。每一帧都回答同一组问题：

| 检查项 | 记录方式 |
| --- | --- |
| 特效中心 | 在人物中心、偏左 / 右、落后或超前；也可记录像素距离 |
| 边界尺寸 | 用肩宽、伞宽或画面占比记录，不只写“差不多” |
| 边界外状态 | 空气、墙面、桌面、地面是否仍保持设定状态 |
| 锁定对象 | 特效跟随人物、场景坐标、摄影机还是无法判断 |
| 允许痕迹 | 湿脚印、余光、烟迹是否符合时间方向 |
| 连带损伤 | 脸、手、服装、道具、背景结构是否因特效一起变形 |

如果需要量化，可以记录：

```text
相对偏移 = 特效中心到人物中心的距离 ÷ 人物肩宽
边界变化 = 当前雨区宽度 ÷ 首帧雨区宽度
```

这些数值用于同一批测试内部比较，不应该在没有真实样本时先设一个“通用及格线”。

## 六类失败，不要都记成“效果不好”

| 失败标签 | 可见症状 | 下一轮先改什么 |
| --- | --- | --- |
| `ANCHOR_LAG` | 人物先走，特效晚半拍追上 | 简化人物速度，重写同步关系 |
| `SCENE_FILL` | 局部雨逐渐扩散成全场雨 | 强化边界外可见状态，缩短动作或镜头时长 |
| `BOUNDARY_PULSE` | 特效范围呼吸式忽大忽小 | 使用相对尺度和更清楚的起始边界 |
| `CAMERA_LOCK` | 摄影机移动时特效贴在画面固定位置 | 明确锚点属于人物或场景，不属于画框 |
| `TRAIL_RESET` | 人物走过后水迹消失，或旧位置继续下雨 | 分开写“特效停止”和“物理痕迹保留” |
| `COLLATERAL_DRIFT` | 雨稳定了，但脸、伞或背景开始改变 | 降低单镜任务复杂度，分离人物、场景与特效测试 |

每条失败记录至少保存：平台、模型与版本、日期、模式、时长、画幅、首帧 / 参考图、完整 Prompt、随机种子（如有）、失败出现的时间点和下一轮只改哪一项。

> [!KEY POINT]
> 一次只改一个主要条件。否则下一轮变好时，你仍不知道是首帧、空间句、镜头变短，还是随机波动起了作用。

## 生成前检查表

- [ ] 已明确特效锚定人物、物体、场景还是摄影机；
- [ ] 边界使用相对尺度、形状和羽化方式描述；
- [ ] 边界外至少有一项可见、稳定的状态；
- [ ] 人物移动后，特效怎样同步、旧位置怎样结束已经写清；
- [ ] 地面水迹、余光或烟迹等允许残留已经单独定义；
- [ ] 首帧只承担起点证据，没有把它当成整个时间规则；
- [ ] 参考图的职责与当前模型支持范围已经核对；
- [ ] 动作、特效和摄影机运动没有同时堆得过多；
- [ ] 已准备五个时间点的逐帧验收表；
- [ ] 失败会被归入具体标签，而不是只保存“失败版本”。

## 最后记住这个判断

**局部特效真正难的，不是生成一帧雨，而是让“雨区与人物的关系”在时间里不改变。**

先定义锚点、边界、外部状态和时间规则，再让首帧、参考图与文字 Prompt 分别承担它们真正能承担的部分。最终是否有效，不看一张最漂亮的截图，而看九格测试和逐帧记录能否重复支持同一个结论。

## 官方资料

- [Runway：Image to Video Prompting Guide](https://help.runwayml.com/hc/en-us/articles/48324313115155-Image-to-Video-Prompting-Guide)
- [Runway：Gen-4 Video Prompting Guide](https://help.runwayml.com/hc/en-us/articles/39789879462419-Gen-4-Video-Prompting-Guide)
- [Google Cloud：Video generation prompt guide](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/video/video-gen-prompt-guide)
- [Google Cloud：Generate videos from references](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/video/generate-videos-from-references)
- [Google Cloud：Generate videos from first and last frames](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/video/generate-videos-from-first-and-last-frames)
- [Adobe Firefly：Generate videos using images](https://helpx.adobe.com/firefly/web/work-with-audio-and-video/work-with-video/generate-videos-using-images.html)
