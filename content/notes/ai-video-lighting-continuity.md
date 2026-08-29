---
title: "AI 视频里的光线连续性：同一盏灯为什么每镜都换边？"
slug: "ai-video-lighting-continuity"
category: "AI TIPS"
issue: "012"
date: "2026-08-29"
description: "别只把每个镜头都写成电影感：用光源位置、人物受光、阴影、曝光层级与色温五层账本，让换机位以后仍然属于同一个时间和空间。"
cover: "tips-mint"
featured: true
tags: ["AI VIDEO", "LIGHTING", "CONTINUITY", "COLOR"]
readingTime: "16 分钟"
demo: false
editorialStatus: "source-backed"
sourceTitle: "Runway Image to Video / Google Veo Prompt Guide / Adobe Premiere Color Match"
sourceUrl: "https://help.runwayml.com/hc/en-us/articles/48324313115155-Image-to-Video-Prompting-Guide"
sourceNote: "源图承担光线与风格起点、视频 Prompt 可描述光线、Premiere 比较视图与示波器的用途依据 Runway、Google Cloud、Adobe 和 ARRI 当前官方资料核对；五层光线账本、四镜最小测试和失败标签是本站编辑整理，不包含真实模型输出或模型能力结论。"
relatedNotes: ["ai-video-scene-consistency", "ai-video-shot-continuity", "first-last-frame-motion-prompt"]
connections:
  - label: "TOOL"
    title: "场景锚点卡生成器"
    description: "把真实光源位置、方向、软硬、色温和天气写进场景母版与单镜接口。"
    href: "/tools/scene-anchor/"
    tone: "yellow"
  - label: "TOOL"
    title: "相邻镜头连续性检查器"
    description: "把镜头 A 的离开状态和镜头 B 的进入状态并排检查，包括光线与场景事实。"
    href: "/tools/continuity-checker/"
    tone: "coral"
  - label: "STORY"
    title: "七码头没有船"
    description: "用明亮蓝雾、暖黄值班室和珊瑚围巾测试夜景换机位后的光线关系。"
    href: "/stories/no-boat-at-pier-seven/"
    tone: "mint"
---

镜头 A 里，窗光从人物左后方进入，脸的左侧有一道冷色轮廓；镜头 B 换成反打，窗户还在同一面墙，脸却突然从另一侧被照亮；镜头 C 只切了一个手部特写，桌面灯又从暖黄变成惨白。

每个镜头单独看都可能“很有电影感”，剪在一起却像灯光组在每次切镜后重新布了一遍灯。

这不是单纯的颜色不一致。光线连续性至少包含：光源在空间里的位置、人物怎样受光、阴影朝哪里落、画面亮暗怎样分层，以及不同光源各自是什么色温。

> [!KEY POINT]
> 不要锁定“画面左边来光”，要锁定“房间北窗来光”。摄影机换边后，光源在画面里的左右可以变化；它在真实空间中相对人物的位置不能无因改变。

## “暖光夜景”还不是一套光线

下面两条描述都可以叫暖光夜景：

```text
A：人物右前方有一盏低位桌灯，左后方窗外有冷蓝街灯。
B：整个房间均匀暖黄，人物正脸明亮，背景没有冷色轮廓。
```

它们的色调可能接近，光线结构却完全不同。真正跨镜可用的描述，需要回答五层问题：

| 光线层 | 需要记录什么 | 常见漂移 |
| --- | --- | --- |
| 光源位置 | 哪个真实物体发光，位于哪面墙、什么高度 | 窗光换墙、桌灯消失、无来源的正面光 |
| 人物受光 | 脸和身体哪一侧亮，轮廓光与眼神光来自哪里 | 换机位后主光翻面、脸部突然被补平 |
| 阴影关系 | 阴影方向、软硬、长度和接触位置 | 影子换方向、脚下接触影消失、墙影跳动 |
| 曝光层级 | 画面中谁最亮、谁次亮、黑位保留多少 | 人脸忽明忽暗、窗户突然过曝、背景亮度重置 |
| 色温关系 | 每个光源偏暖、偏冷或偏绿，彼此怎样对比 | 同一灯从暖黄变白、阴影从蓝变绿、肤色跳变 |

五层不是要让每个镜头的像素相同。它们负责让观众相信：摄影机只是换了位置，场景里的光仍来自同一组光源。

## 先写世界坐标，再写画面结果

### 世界坐标：灯在哪里

```text
主光：北墙窄窗外的冷蓝街灯，高于人物头顶，方向固定。
室内灯：旧木桌右后方一盏低位暖灯，只覆盖桌面和手。
走廊灯：东墙门外的暖白顶灯；门关闭时不可见。
不新增光源：没有正面补光，没有天花板大面积白光。
```

### 画面结果：这个机位看见什么

```text
C1 门侧广角：窗在画面左侧；人物左后方有冷轮廓，脸部偏暗。
C2 窗侧中景：窗在摄影机后侧；人物近窗一侧更亮，门后的背景更暗。
C3 桌面特写：暖灯照亮右手和信纸；冷窗光只留在手腕外缘。
```

“世界坐标”跨镜保持；“画面结果”随摄影机位置重新推导。如果只复制“left-side lighting”，反打镜头很可能把屏幕左右误当成空间左右。

## 源图能锁住起点，但不能替代整段验收

[Runway 的 Image to Video 指南](https://help.runwayml.com/hc/en-us/articles/48324313115155-Image-to-Video-Prompting-Guide)把输入图像视为视频第一帧，并说明它提供构图、主体、光线与风格信息；文字提示主要描述运动、摄影机和时间变化。官方也提醒，源图中的模糊、脸手错误等瑕疵可能在视频中被放大。

[Google Cloud 的视频生成最佳实践](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/video/best-practice)同样把源图视为人物细节、光线和整体风格的基础，并建议图生视频时把 Prompt 集中在运动上。

这意味着首帧要先做对：

- 光源位置在画面中有可见证据；
- 人物受光与背景光属于同一个空间；
- 高光没有在起点就失去细节；
- 阴影没有与人物或道具接触错误；
- 没有准备在后续帧被放大的光斑和边缘伪影。

但第一帧正确，不代表人物转头、走过房间或摄影机环绕以后仍然正确。每一个动作都会改变脸部角度、遮挡和受光面积，仍需逐帧检查。

## 视频 Prompt 应该描述什么光

[Google Cloud 的视频 Prompt 指南](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/video/video-gen-prompt-guide)把光线放在视觉风格与美学部分，并给出自然光、人工光、高调 / 低调、逆光和侧光等示例。它证明当前提示入口可以接受这类视觉描述，但不等于一条光线词汇会自动保证跨镜几何关系。

与其每镜都堆一串“cinematic, moody, dramatic”，不如写成可检查结构：

```prompt
SCENE LIGHT ANCHOR:
A cold blue streetlight enters through the north window above and behind the woman.
A low warm desk lamp illuminates only her hands and the open letter.

CURRENT SHOT:
Window-side medium shot. The woman slowly turns from the letter toward the east door.
The window-side edge of her face remains cooler and brighter; the door-side cheek stays in soft shadow.
The hallway behind the closed door remains darker than the room.

MOTION:
One slow head turn. Locked camera. No new light source appears during the shot.
```

这是**待测试的结构示例**，不是跨模型通用语法。真正执行时，图生视频应避免重复描述源图里已经明确的全部视觉细节，只保留与运动中光线关系有关的关键句。

## 人物一转头，受光关系应该怎样变化

光线连续不等于脸上亮区完全不动。人物转头后，面部几何改变，主光覆盖范围也会自然变化。

需要保持的是因果关系：

```text
人物面向窗：近窗脸颊更亮，鼻影朝远离窗的一侧。
人物转到侧面：亮面变窄，鼻影拉长，但方向不反转。
人物背向窗：脸部整体变暗，发丝和肩部保留冷色轮廓。
```

如果转头过程中亮面没有变化，光可能像贴在脸上的美颜滤镜；如果亮面突然跳到另一侧，光源像穿过了房间。

### 移动光源要单独写时间规则

车灯、手机屏幕、闪电、开门后的走廊光都可以移动或出现，但必须有清楚原因：

```text
00:00—00:02：门关闭，走廊暖光不可见。
00:02—00:04：门向内打开，暖光先落到地面，再扫到人物小腿。
00:04—00:05：门停住，暖光范围保持，不继续爬满整间房。
```

光线变化有时间方向时，它是镜头事件；每次切镜随机改变时，它才是连续性错误。

## 一张五层光线账本

```text
场景：雨夜旧公寓

光源 01 / 北窗街灯
- 位置：北墙窗外，高于人物头顶
- 色温关系：冷蓝，是人物轮廓和室内冷色来源
- 软硬：偏软，窗框边缘可见但不过分锐利
- 影响：靠窗面更亮；人物背向窗时脸部偏暗

光源 02 / 桌面灯
- 位置：木桌右后方，低于人物眼睛
- 色温关系：暖黄，只覆盖桌面、手和信纸
- 软硬：小范围柔光
- 影响：不照亮整个房间，不在墙面产生新的大面积光斑

曝光层级：窗户最高；桌灯与手次亮；人物脸中等偏暗；走廊最暗。
允许变化：门打开后，走廊暖白光进入地面。
必须锁定：光源真实位置、人物受光逻辑、影子方向、冷热关系。
```

这张账本可以进入[场景锚点卡生成器](/tools/scene-anchor/)。每个单镜只调用当前机位真正看得见的部分，不必复制整张母版。

## 镜头 A → B，怎样交接光线

把两镜放进一张接口卡：

```text
镜头 A 出口：门侧中景；人物左后方冷轮廓；暖桌灯照亮信纸；门关闭。
镜头 B 入口：桌面特写；右手和信纸仍受暖灯；手腕外缘保留冷窗光；门不入画。

保持：暖灯只照桌面、冷光来自北窗、信纸亮度低于窗户。
允许变化：人物脸离开画面；景深变浅；背景更暗。
验收：手部高光方向、纸面亮度、冷暖边缘是否接得上。
```

如果 B 是反打，不要要求画面左右完全相同。先回到平面图，判断光源、人物和摄影机三者的空间关系，再写 B 的可见结果。

## 四镜最小光线测试

在生成完整场景前，用四个镜头暴露不同问题：

1. **建立镜头**：同时看见光源证据、人物和主要空间；
2. **同侧人物中景**：检查转头或起身时亮面怎样连续变化；
3. **关键物体特写**：检查手、纸面、杯子或道具高光方向；
4. **反向机位**：检查换边以后世界坐标是否仍能解释受光与阴影。

四镜固定人物、场景、时间与光源设置。一次只改变机位或动作，不要同时换服装、天气、色彩风格和所有构图。

## 逐帧检查五个时间点

至少检查开始、25%、50%、75% 和结束：

| 检查项 | 要记录什么 |
| --- | --- |
| 主光方向 | 亮面与鼻影、下颌影是否仍由同一光源解释 |
| 轮廓与接触 | 发丝轮廓、脚下接触影、手与道具阴影是否跳变 |
| 高光位置 | 眼神光、皮肤、玻璃、金属和湿地反光是否漂移 |
| 曝光层级 | 人脸、窗户、灯具、背景谁最亮，顺序是否改变 |
| 色温关系 | 暖灯、冷窗光、肤色和阴影是否保持同一组关系 |

不要只截开头和结尾。曝光跳动、影子翻向和眼神光增殖往往只出现在转头或遮挡的中间几帧。

## 六类失败，分别处理

| 失败标签 | 可见症状 | 下一轮先做什么 |
| --- | --- | --- |
| `KEY_SIDE_FLIP` | 主光或脸部亮面突然换侧 | 回到世界坐标，重写光源与人物相对位置 |
| `SHADOW_RESET` | 阴影消失、重生或改变方向 | 减少动作与运镜，只测试人物和一个光源 |
| `EXPOSURE_PUMP` | 人脸或背景无原因忽明忽暗 | 缩小时间变化，逐帧标出跳变位置 |
| `TEMP_JUMP` | 同一光源从暖到冷或偏绿 | 固定源图与色温关系，再做基础颜色校正 |
| `PRACTICAL_DRIFT` | 灯具位置、数量或开关状态改变 | 把灯具作为场景固定道具与状态记录 |
| `RELATION_LOSS` | 人物移动后仍像正面补光跟拍 | 明确光源固定、人物穿过光区，不让光贴脸移动 |

失败记录至少保留：模型和版本、日期、生成模式、源图、完整 Prompt、时长、画幅、失败时间点、失控层和下一轮唯一主要修改。

## 后期调色能修什么，不能修什么

[Adobe Premiere 的 Match Color 文档](https://helpx.adobe.com/premiere/desktop/correct-color/add-color-effects/match-color-between-shots.html)允许在 Comparison View 中选择参考帧与当前帧，使用并排或分割视图比较，并通过 Color Wheels 与 Saturation 等控制匹配镜头的颜色和光线外观。文档也提醒：如果画面内容随时间变化，要选择能代表整体颜色与亮度的帧。

[Adobe 的 Lumetri Scopes 文档](https://helpx.adobe.com/premiere/desktop/correct-color/add-color-effects/display-lumetri-scopes.html)提供 Vectorscope、Histogram、Parade 和 Waveform，用于评估颜色、曝光、对比和色调；[ARRI 的颜色 FAQ](https://www.arri.com/en/learn-help/learn-help-camera-system/image-science/color-faq)也建议在判断中性灰色偏色时使用 RGB Waveform 或 Vectorscope，而不只依赖观看环境中的肉眼。

后期通常可以帮助：

- 拉近整体曝光、对比和黑位；
- 调整全局冷暖与绿 / 品红偏色；
- 让同一场景不同镜头的肤色和背景色更接近；
- 用局部遮罩修正小范围亮度与颜色差异。

后期不能自动解决：

- 主光从人物左边跳到右边；
- 灯具或窗户跑到错误位置；
- 影子朝错误方向落下；
- 眼神光和高光无因增殖；
- 人物受光不再服从场景光源。

这些问题改变的是空间和物理关系，通常需要重做画面、合成重建，或者有意把它设计成新的光线事件。

## 调色时先匹配层级，再追求风格

一种实用顺序：

1. 先确认色彩管理和素材解释一致；
2. 选择能代表这个场景的参考帧；
3. 用 Waveform 比较黑位、主体中间调和最高亮区；
4. 调整整体曝光和对比，不急着套 Look；
5. 用 RGB Parade 或 Vectorscope 检查偏色与色温关系；
6. 处理肤色、灯具与关键道具的局部差异；
7. 回到正常速度和真实切点检查，而不是只看静帧；
8. 最后才统一风格、颗粒、光晕与其他质感。

[Adobe 的颜色校正工作流](https://helpx.adobe.com/in/premiere/desktop/correct-color/color-correction-fundamentals/color-correction-workflow.html)把曝光、白平衡、饱和度、曲线、色轮和 Color Match 分成可逐步调整的工具。对 AI 镜头而言，同样应先让镜头属于同一个场景，再决定它们共同长成什么风格。

## 生成前检查表

- [ ] 光源已经写成真实空间位置，不只是画面左右；
- [ ] 主光、补光、轮廓光和实际灯具的职责已经区分；
- [ ] 人物转头、起身或移动后，亮面怎样变化可以被解释；
- [ ] 阴影方向、软硬和接触位置已有基准；
- [ ] 画面中最亮、次亮和最暗区域的层级已经确定；
- [ ] 冷暖与绿 / 品红关系绑定到具体光源；
- [ ] 源图的脸、手、高光和阴影没有明显起点瑕疵；
- [ ] 反打镜头根据世界坐标重写，没有机械复制左右描述；
- [ ] 移动光源有明确的出现顺序、范围和停止状态；
- [ ] 已准备四镜测试和五个时间点的逐帧记录。

## 剪进时间线以后再验收

1. **灰度看一遍**：先忽略颜色，检查曝光、主光与阴影；
2. **并排看参考帧**：比较人物、窗户、灯具和背景的亮暗层级；
3. **用示波器复核**：观察波形、RGB 通道和饱和度，而不是只凭显示器；
4. **循环切点**：看受光方向、高光和阴影是否在剪切处跳变；
5. **逐帧看动作中段**：特别检查转头、遮挡、开门和人物穿过光区；
6. **标记可修与必须重做**：颜色与曝光差异进入调色，空间光线错误回到生成或合成。

## 最后记住这句分工

**光源属于场景，亮面属于当下角度，颜色匹配属于后期。**

不要让每个镜头各自追求一套最好看的光。先把灯放在同一个世界里，再让人物和摄影机在这套光中移动；最后才用调色把可以修正的曝光与色温差异收拢起来。

## 官方资料

- [Runway：Image to Video Prompting Guide](https://help.runwayml.com/hc/en-us/articles/48324313115155-Image-to-Video-Prompting-Guide)
- [Runway：Gen-4 Video Prompting Guide](https://help.runwayml.com/hc/en-us/articles/39789879462419-Gen-4-Video-Prompting-Guide)
- [Google Cloud：Best practices for generating videos](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/video/best-practice)
- [Google Cloud：Video generation prompt guide](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/video/video-gen-prompt-guide)
- [Adobe Premiere：Match color between shots](https://helpx.adobe.com/premiere/desktop/correct-color/add-color-effects/match-color-between-shots.html)
- [Adobe Premiere：Display Lumetri Scopes](https://helpx.adobe.com/premiere/desktop/correct-color/add-color-effects/display-lumetri-scopes.html)
- [Adobe Premiere：Available Lumetri Scopes](https://helpx.adobe.com/premiere/desktop/correct-color/add-color-effects/available-lumetri-scopes.html)
- [Adobe Premiere：Color correction workflow](https://helpx.adobe.com/in/premiere/desktop/correct-color/color-correction-fundamentals/color-correction-workflow.html)
- [ARRI：Color FAQ](https://www.arri.com/en/learn-help/learn-help-camera-system/image-science/color-faq)
