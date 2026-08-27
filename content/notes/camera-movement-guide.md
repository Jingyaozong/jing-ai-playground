---
title: "镜头为什么会乱跑？AI 视频运镜词典"
slug: "camera-movement-guide"
category: "AI TIPS"
issue: "004"
date: "2026-08-27"
description: "从固定、摇移、推拉到跟拍与环绕：先看摄影机怎样改变空间，再把运镜写成可生成、可验收的指令。"
cover: "tips-blue"
featured: false
tags: ["AI VIDEO", "CAMERA", "PROMPT", "CINEMATOGRAPHY"]
readingTime: "16 分钟"
demo: false
editorialStatus: "source-backed"
sourceTitle: "Runway Camera Terms / Google Veo Prompt Guide"
sourceUrl: "https://help.runwayml.com/hc/en-us/articles/47313504791059-Camera-Terms-Prompts-Examples"
sourceNote: "摄影机术语依据官方生成指南核对；中文分类、验收方法与 Prompt 模板是本站的编辑转译，不代表所有模型稳定支持每一种高级运镜。"
relatedNotes: ["video-vs-image-prompt", "shot-size-guide", "video-failure-cases"]
connections:
  - label: "PROMPT"
    title: "图生视频和文生视频，到底差在哪？"
    description: "先决定画面由谁负责，再把这里的运镜指令放进对应的 Prompt 结构。"
    href: "/notes/video-vs-image-prompt/"
    tone: "coral"
  - label: "TOOL"
    title: "分镜整理器"
    description: "把主体动作和摄影机运动拆到不同字段，生成前先排除互相打架的方向。"
    href: "/tools/shot-list-cleaner/"
    tone: "mint"
  - label: "STORY"
    title: "十四镜故事生成包"
    description: "查看固定、推近、横移与跟拍怎样被分配到同一个短故事的不同镜头。"
    href: "/stories/she-forgets-yesterday/#generation-pack"
    tone: "yellow"
---

镜头“乱跑”，很多时候不是因为模型不懂“电影感”，而是因为指令没有说清楚：**是谁在动、摄影机从哪里到哪里、运动过程中要揭示什么。**

运镜也不是给画面随手加一点动态。摄影机每移动一次，都会改变主体大小、背景透视、空间信息和观众与人物的距离。先看懂这些变化，才能判断结果是推镜、变焦、主体靠近，还是一次不受控的画面漂移。

> [!KEY POINT]
> 先写“摄影机运动”，再写“主体运动”，最后写“环境运动”。三者分开，结果才有可能被分别验收。

## 先分清三种变化

| 变化来自哪里 | 画面里怎样识别 | 示例 |
| --- | --- | --- |
| 摄影机运动 | 画面边缘、消失点、前后景关系或视角发生变化 | 摄影机缓慢向她靠近 |
| 主体运动 | 主体相对场景的位置、姿态或大小改变 | 她从门口走向餐桌 |
| 环境运动 | 背景元素变化，但摄影机与主体可以保持不动 | 窗帘摆动、雨水滑落 |

一句“女孩跑向镜头，镜头快速后退，背景向前冲”把三种运动和两组相反方向塞进同一条短镜头。它可能是一种明确的复杂设计，也可能只是没有拆开。生成之前先问：本镜最重要的运动究竟是哪一个？

## 第一组：摄影机留在原地，只改变朝向

### 固定 / Locked camera

摄影机位置和朝向都保持不变。固定不是“什么都不动”，而是让人物表演、物体变化或环境运动成为唯一注意力中心。

```prompt
Locked camera. The camera remains still as she slowly turns her head toward the window. Only her breath and the curtain move.
```

Runway 的 Gen-4 指南建议用肯定式描述目标状态，例如 `Locked camera. The camera remains still.`，而不是堆叠 `no camera movement` 一类否定指令。这是 Runway 的模型建议，不应自动推导为所有产品的统一规则。

### 摇 / Pan

摄影机留在固定点，水平向左或向右旋转，像人站在原地转头。它适合跟随横向移动，或者从一个信息摇到另一个信息。

```prompt
A slow pan from left to right begins on the empty doorway and ends with her seated alone at the table.
```

要点不是只写 `pan right`，而是说明**从什么开始、经过什么、在哪里结束**。Runway 的相机术语指南也建议：当镜头需要在画面中完成一次明显揭示时，把各阶段可见内容写出来。

### 俯仰 / Tilt up / Tilt down

摄影机留在固定点，垂直向上或向下旋转。它可以从人物的脸落到手中信件，也可以从脚步抬到高处建筑。

```prompt
The camera tilts down from her uncertain expression to the handwritten letter held between her fingers, ending on the first line of the page.
```

“向下摇”容易和“摄影机下降”混用。判断方式很简单：如果摄影机还在原地，只改变向下看的角度，是 tilt；如果整台摄影机降低高度，是下降或 boom down。

## 第二组：摄影机在空间中真正位移

### 推近与拉远 / Dolly in / Dolly out

摄影机沿前后方向靠近或远离主体。主体大小会变化，前后景之间的相对关系和透视也会随之变化。

```prompt
A very slow dolly in toward her face while she reads the letter. She remains seated and still. The move ends before the frame becomes a close-up.
```

推近适合把注意力从环境逐渐收束到人物；拉远适合让环境、距离或孤立感逐渐显露。但这是叙事选择，不是固定情绪公式。

### 横移 / Truck left / Truck right

摄影机在水平方向平行移动，而不是站在原地旋转。近景物体通常移动得更快，远景移动得更慢，因此会出现明显视差。

```prompt
The camera trucks slowly to the right, parallel to the café window, revealing the two figures through alternating bands of glass reflection.
```

| 容易混淆 | 摄影机位置 | 最明显的画面线索 |
| --- | --- | --- |
| Pan right | 原地不变，只向右旋转 | 视线扫向右侧，空间没有横向穿行感 |
| Truck right | 整台摄影机向右位移 | 前后景产生不同速度的横向视差 |

### 升降 / Pedestal、Boom、Crane

摄影机实际上升或下降。`pedestal` 常用于保持摄影机朝向大体不变的垂直移动；`boom` 或 `crane` 可以带弧线和更大的空间变化。生成模型不一定严格区分器材术语，最稳妥的写法仍是描述路径和揭示结果。

```prompt
The camera rises slowly from table height to an overhead view, revealing the letter, photograph and clock arranged around her hands.
```

“从低处拍”是机位；“从低处上升到俯视”才是运动。不要把角度、景别和运动混成同一个词。

### 环绕 / Arc / Orbit

摄影机沿圆形或半圆路径绕主体移动，主体大致维持在画面中心，背景透视持续变化。

```prompt
A restrained quarter-circle arc moves from her profile to a three-quarter view. She remains still; the room shifts in parallax behind her.
```

环绕会同时考验人物身份、遮挡、背景重建和空间连续性。短镜头可以先试四分之一圆，不要一开始就要求高速 360 度环绕、人物转身、衣物飞扬和复杂光变全部同时发生。

## 第三组：运动关系与运动质感

### 跟拍 / Tracking / Follow

“跟拍”描述的是摄影机和主体之间的关系，不限定唯一轨迹。摄影机可以从背后跟、侧面平行跟，也可以面对主体向后移动。

```prompt
A smooth rear tracking shot follows the two figures as they walk side by side across the quiet street. Their distance from the camera remains nearly constant.
```

如果只写 `tracking shot`，模型仍要猜摄影机在前、后还是侧面。把相对位置、主体方向和距离变化补齐，才更像一条可执行指令。

### 手持 / Handheld

手持是一种运动质感，不等于随机大幅晃动。它可以是克制的呼吸感，也可以是紧张的追逐感；需要说明幅度和目的。

```prompt
Subtle handheld camera with restrained human micro-movements. The framing stays centered on her face as she reads.
```

如果想要稳定画面，就直接写固定或平滑跟拍。不要为了“电影感”默认给每一镜加手持。

### 变焦 / Zoom

变焦改变镜头焦距，摄影机本身不前后移动。主体会变大或变小，但空间透视变化不同于真实推拉。Google Veo 的官方指南明确把 zoom 与 dolly 分开：一个改变焦距，一个移动摄影机。

| 推近 / Dolly in | 放大 / Zoom in |
| --- | --- |
| 摄影机实际靠近主体 | 摄影机位置不变，改变焦距 |
| 前后景透视和视差发生变化 | 主要表现为画面范围和主体大小变化 |
| 更像观众进入空间 | 更像镜头把视野收窄 |

当模型把推镜做成数字放大时，只看主体是否变大不够；还要看前景与背景的相对位置、透视和消失点有没有随摄影机靠近而变化。

### 移焦 / Rack focus

移焦不是摄影机位移，而是清晰焦点在前后景之间转移。它适合从手中物体揭示后方人物，但要提前保证两个焦点都在构图中成立。

```prompt
Locked camera. Focus begins on the photograph in the foreground, then shifts once to her face in the background and holds there.
```

## 一条可复用的运镜结构

把运镜写成四段，而不是一串术语：

```prompt
[摄影机初始状态 + 一种主要运动]
[摄影机与主体的相对关系]
[运动过程中出现或被揭示的内容]
[速度、幅度与明确的结束位置]
```

例如：

```prompt
The camera makes one slow dolly backward from a medium close-up.
She remains seated at the center of frame and does not follow the camera.
The surrounding empty café gradually enters view.
The move is smooth and restrained, ending in a wide two-shot.
```

这里每一句都有验收对象：是否拉远、主体是否留在原位、环境是否逐渐出现、是否停在目标景别。相比“电影感拉镜、孤独氛围、震撼运镜”，它更容易判断哪里没有完成。

## 根据叙事任务选择，不按炫技程度选择

| 本镜真正要完成的事 | 可以先测试 | 需要观察 |
| --- | --- | --- |
| 让观众注意一个细节 | 固定 + 主体动作，或极慢推近 | 注意力是否收束，主体有没有被误当成前移 |
| 从 A 信息揭示 B 信息 | Pan / Tilt | 起点、路径和终点是否明确 |
| 展示空间层次 | Truck / Dolly / Crane | 视差、遮挡和背景结构是否稳定 |
| 陪人物一起行动 | Tracking / Follow | 人物与摄影机距离、步速和构图是否稳定 |
| 强化中心或改变人物关系 | 小幅 Arc / Orbit | 身份、遮挡与背景透视是否连续 |
| 让画面保持安静 | Locked camera | 是否出现无意漂移、自动推近或呼吸式缩放 |

先写叙事任务，再选运镜。一个人物读到重要信息，不一定需要推近；固定镜头中的一次停顿，也可能比复杂环绕更准确。

## 参考图必须给运镜留出空间

图生视频把输入图当作第一帧。运镜要求会迫使模型生成画框之外、遮挡之后或不同视角下的新内容，因此参考图不仅要“好看”，还要能支持目标路径。

- 要横移：检查左右两侧是否有可延伸空间和清楚的前后景层次；
- 要推近：主体细节是否足够稳定，最终景别会不会过紧；
- 要拉远：模型需要补出画框外环境，未知区域越大，测试变量越多；
- 要环绕：主体背面、遮挡关系和背景结构都可能需要重新推断；
- 要上升俯拍：桌面、头顶和地面空间是否有合理结构线索；
- 要固定：画面中的运动模糊、倾斜姿态是否暗示了相反的动态。

> [!TIP]
> 如果本轮只想测试运镜，先让主体保持简单动作或静止。摄影机基线成立后，再逐项加入人物和环境运动。

## 六个常见失控点

### 1. 同时写三个主要运镜

“先推近、再环绕、最后升到鸟瞰”可能已经是一段分镜。短时长里先保留一种主要运动，复杂路径需要明确阶段和每段可见内容。

### 2. 方向只有一个词，没有参照物

“向右”可能指摄影机向右、画面向右，或主体向右。写成“摄影机向右平行移动，跟随向右行走的主体”会更清楚。

### 3. 推镜与主体靠近没有分开

如果人物向摄影机走、摄影机也向人物推近，主体尺寸变化会非常快。除非这正是目的，否则固定其中一个变量。

### 4. 把景别变化当成运镜成功

从中景变成近景可能只是裁切或变焦。检查背景透视、前后景相对位移和画面边缘，才能判断摄影机是否真正进入空间。

### 5. 运镜没有结束状态

只写“缓慢推近”会把停止位置交给模型。补上“在近景前结束”或“最终停在信纸特写”，结果才可验收。

### 6. 参考图不支持目标路径

画面外没有空间信息，却要求大幅拉远或完整环绕，会把大量新场景生成混入运镜测试。先缩短路径，或者先建立更合适的起始帧。

## 四遍验收一条运镜

1. **只看主体**：主体动作、位置和身份有没有被运镜带乱；
2. **只看背景**：消失点、建筑线条和遮挡关系是否连续；
3. **只看画面边缘**：有没有数字裁切、无意缩放或边缘形变；
4. **重新完整播放**：运动是否服务本镜任务，并在目标位置结束。

记录时不要只写“运镜失败”。可以写：

```text
目标：摄影机缓慢推近，人物保持坐姿，最终停在近景。
实际：人物尺寸变大，但背景透视没有变化；画面四边同步裁切。
判断：更接近数字变焦，不是预期的摄影机推近。
下一轮：主体与参考图不变，只强化 dolly in 和前后景视差描述。
```

“下一轮”仍然是假设，不是已经证明的解决方案。保存模型版本、输入图、Prompt、时长和结果，再做单变量对照。

## 把运镜放回分镜表

本站的[分镜整理器](/tools/shot-list-cleaner/)会把“画面”和“运镜”拆成不同字段，正是为了避免把人物行为和摄影机行为写成一团。写完后，再进入[图生视频与文生视频 Prompt 指南](/notes/video-vs-image-prompt/)决定哪些信息由图片承担、哪些必须进入文字。

在[十四镜故事生成包](/stories/she-forgets-yesterday/#generation-pack)里，固定、缓慢推近、横移和背后跟拍被分配给不同叙事任务。它们目前都是待测试 Prompt，不代表已经获得稳定输出；真正生成后，还需要用[AI 视频翻车词典](/notes/video-failure-cases/)检查无意漂移、视差错误和背景空间重建。

> [!JING'S NOTE]
> 待荆确认：运镜的价值不是证明摄影机在动，而是让观众在正确的时刻靠近、离开、发现或陪伴。

## 参考来源

- [Runway：Camera Terms, Prompts, & Examples](https://help.runwayml.com/hc/en-us/articles/47313504791059-Camera-Terms-Prompts-Examples)
- [Runway：Gen-4 Video Prompting Guide](https://help.runwayml.com/hc/en-us/articles/39789879462419-Gen-4-Video-Prompting-Guide)
- [Runway：Image to Video Prompting Guide（Gen-4.5）](https://help.runwayml.com/hc/en-us/articles/48324313115155-Image-to-Video-Prompting-Guide)
- [Google Cloud：Veo 视频生成提示指南](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/video/video-gen-prompt-guide?hl=zh-CN)
- [Adobe Firefly：Writing effective text prompts for video generation](https://helpx.adobe.com/firefly/web/work-with-audio-and-video/work-with-video/writing-effective-text-prompts-for-video-generation.html)

本文是 **资料文章**：摄影机术语与模型建议已经核对，中文模板和验收流程是本站的编辑转译。文中示例均为待测试设计，不冒充真实模型输出，也不代表荆已经确认的个人经验。
