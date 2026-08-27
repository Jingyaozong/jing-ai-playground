---
title: "AI 图片 Prompt，到底写什么？"
slug: "image-prompt-guide"
category: "AI TIPS"
issue: "001"
date: "2026-08-27"
description: "从主体、动作和构图开始，再加入光线、色彩与材质：一套用于关键帧和参考图的可迭代写法。"
cover: "tips-yellow"
featured: false
tags: ["PROMPT", "IMAGE", "AIGC", "COMPOSITION"]
readingTime: "16 分钟"
demo: false
editorialStatus: "source-backed"
sourceTitle: "Adobe Firefly / Google Imagen 官方图片提示指南"
sourceUrl: "https://helpx.adobe.com/firefly/web/work-with-images/generate-images/writing-effective-text-prompts.html"
sourceNote: "事实部分依据官方产品指南核对；模板与迭代流程是本站面向创作者的编辑转译，不代表所有模型共享同一语法或参考图能力。"
relatedNotes: ["ai-video-character-consistency", "shot-size-guide", "video-vs-image-prompt"]
connections:
  - label: "COMPOSITION"
    title: "AI 视频景别与构图指南"
    description: "把中景、近景或远景进一步写成明确的可见边界和信息任务。"
    href: "/notes/shot-size-guide/"
    tone: "mint"
  - label: "VIDEO"
    title: "图生视频和文生视频，到底差在哪？"
    description: "起始画面完成后，决定哪些静态信息交给图片，哪些时间变化写进视频 Prompt。"
    href: "/notes/video-vs-image-prompt/"
    tone: "coral"
  - label: "STORY"
    title: "十四镜故事生成包"
    description: "把角色锚点、场景色彩和逐镜构图带进一个真实的待测试故事制作流程。"
    href: "/stories/she-forgets-yesterday/#generation-pack"
    tone: "yellow"
---

图片 Prompt 不是形容词清单，也不是越长越接近“成片”。它首先是一份画面决策：**谁最重要、正在做什么、身处哪里、观众从哪里看，以及哪些信息必须保持不变。**

光线、色彩、材质和风格当然重要，但它们应该建立在画面内容与构图已经说清楚之后。一个“电影感、史诗级、绝美、8K”的模糊场景，仍然没有告诉模型人物站在哪里、手里拿什么、画面边界到哪里。

> [!KEY POINT]
> 先写决定画面内容的词，再写决定画面气质的词；先解决必须成立的事实，再给模型留下可以探索的空间。

## 官方指南给出的共同起点

Google Imagen 的官方提示指南把基础结构概括为**主体、背景或语境、风格**，并建议从核心想法开始逐步增加细节。Adobe Firefly 同样建议使用清楚、直接、具体的语言；它还把内容类型、构图参考、风格参考、色彩、光线和相机角度分成不同控制项。

这意味着文字不是唯一控制来源。某些产品允许把构图、风格或主体分别交给参考图和界面设置；另一些产品主要依赖文字。写 Prompt 之前先确认当前模型和界面的能力，不要把某个平台的语法当成通用标准。

## 第一步：把要求分成两层

### 必须成立

缺少或改变以后，这张图就不能完成任务：

- 主体身份与数量；
- 核心动作或状态；
- 场景和时间；
- 景别、可见边界与画幅；
- 必须出现的道具、文字位置或空间关系；
- 角色连续性需要保留的外观锚点。

### 可以探索

允许模型提供不同方案，后续再选择：

- 某些背景细节；
- 次要装饰与纹理；
- 不影响品牌或故事的色彩变化；
- 光线的细微方向和强度；
- 不改变主体身份的服装褶皱或环境小物。

```text
必须成立：齐下巴短发、右侧蓝色发夹、红色三角耳饰、黄色外套；人物坐在桌前；信件完整可见；16:9 中景。
可以探索：窗外建筑轮廓、桌面次要物件、晨光中的微小尘埃。
```

如果所有细节都被写成绝对要求，Prompt 会越来越难排查；如果什么都允许变化，又无法建立可复用的角色与世界。

## 第二步：按画面形成顺序写

### 1. 媒介与用途

先说明你要照片、插画、分镜草图、产品图、海报还是角色设定图。Google Imagen 的指南建议用“a photo of…”等媒介词明确照片方向，绘画与插画也应直接说明制作类型。

```prompt
Cinematic still photograph for a short narrative film.
```

```prompt
Clean character turnaround concept sheet on a pale neutral background.
```

“电影感”不能替代媒介。照片、胶片剧照、平面插画和 3D 渲染对材质与光线的理解不同。

### 2. 主体与身份锚点

写清主体是谁、数量是多少，以及必须被持续识别的少量特征。角色锚点应该具体、可见、相对稳定，而不是把整个人从头到脚写成几十条形容词。

```prompt
One young woman with chin-length straight dark hair, a small blue hair clip on the right side, red triangular earrings, and a mustard-yellow cardigan.
```

数量词很重要。`one woman`、`two people`、`a single cup` 比没有数量更容易形成可验收要求。身份锚点也要区分左右方向，并在每轮测试中保持同一写法。

### 3. 动作或静态状态

图片没有时间展开，但姿势仍然会暗示前一秒和后一秒。不要只写“她很不安”，而要写成能看见的身体状态。

```prompt
She sits upright at the table, one hand pressing the edge of an unfolded letter, her eyes paused on the first line.
```

如果图片将用于图生视频，动作起点尤其重要：身体重心、视线、头发方向、衣物和运动模糊都可能给下一步运动提供信号。

### 4. 场景、时间与天气

场景决定主体周围有什么，时间和天气影响光线与颜色。先写对叙事有用的信息，不需要列出每一件家具。

```prompt
Inside a quiet apartment kitchen just after sunrise, with a rain-softened blue city visible through the window.
```

“温馨房间”仍然依赖模型解释；“清晨厨房、窗外雨后蓝色城市、桌边暖光”提供了更可见的判断点。

### 5. 景别、角度、画幅与构图

景别决定主体占多大，角度决定从哪里看，画幅决定空间怎样分配。只写 `cinematic composition` 没有说明画面边界。

```prompt
16:9 medium shot, framed from the waist up at eye level. She sits on the left third; the empty chair opposite her remains visible on the right. Both hands and the entire letter stay inside frame.
```

更完整的景别边界可以继续查看[AI 视频景别与构图指南](/notes/shot-size-guide/)。如果产品已经提供画幅或构图控件，优先在界面里固定，再让文字补充内容关系。

### 6. 光线

光线至少可以拆成来源、方向、软硬和明暗关系：

```prompt
Soft morning window light from frame left, with a small warm pool of practical lamp light on the letter. Gentle contrast; her eyes remain readable.
```

“氛围光”太宽泛；“左侧窗光、桌面暖灯、眼睛保持可读”同时说明来源和任务。不要堆叠互相冲突的正午硬光、阴天漫射光和深夜霓虹，除非画面确实需要多种光源。

### 7. 色彩

色彩要求可以包含主色、辅助色、点睛色和饱和度关系：

```prompt
Pale blue and cream environment, mustard-yellow clothing as the main color anchor, a small coral-red accent in the earrings, restrained saturation.
```

与其列出十个颜色名称，不如说明谁占主导、谁只做点缀。角色连续性测试时，色彩锚点也可以成为身份检查项。

### 8. 材质与表面

材质告诉画面如何回应光线，也影响真实感和风格：

```prompt
Natural skin texture, matte knitted cardigan, slightly fibrous cream paper, soft condensation on the window glass.
```

把“真实质感”拆成皮肤、针织物、纸张和玻璃，会比反复写 `ultra realistic` 更容易观察。但细节不是越多越好，只保留镜头里真正看得见的材质。

### 9. 风格与完成度

最后再定义整体表达，例如叙事电影剧照、编辑摄影、纸本插画或低饱和定格动画。为了建立自己的视觉语言，可以描述可观察的形式特征，而不是只依赖某位在世艺术家的姓名。

```prompt
Quiet contemporary narrative film still, restrained production design, naturalistic performance, subtle 35mm-like grain.
```

风格不应该覆盖前面的内容要求。先确保人物、动作、构图与场景成立，再判断质感是否服务作品。

## 一套从零生成模板

```prompt
[媒介与用途]
[主体数量、身份与可见锚点]
[动作或静态状态]
[场景、时间与天气]
[画幅、景别、可见边界、机位与构图]
[光源、方向、软硬与明暗任务]
[主色、辅助色与点睛色]
[镜头里看得见的材质]
[整体风格与允许探索的部分]
```

把前面的决定合并成一条**待测试关键帧 Prompt**：

```prompt
Cinematic still photograph for a short narrative film. One young woman with chin-length straight dark hair, a small blue hair clip on the right side, red triangular earrings, and a mustard-yellow cardigan. She sits upright at a kitchen table, one hand pressing the edge of an unfolded cream letter, her eyes paused on the first line. Quiet apartment just after sunrise; a rain-softened blue city is visible through the window.

16:9 medium shot from the waist up at eye level. She sits on the left third; the empty chair opposite her remains visible on the right. Both hands and the entire letter stay inside frame. Soft morning window light from frame left, with a warm pool of lamp light on the paper. Pale blue and cream environment, yellow clothing as the main color anchor, small coral-red earring accent, restrained saturation. Natural skin, matte knit and fibrous paper texture. Quiet contemporary narrative film still, restrained production design.
```

这只是制作设计，不是已生成成功的案例。真正测试时应该保存模型、版本、画幅、参数、参考图和结果，再按单变量修改。

## 有参考图时，先分配它的职责

参考图可以承担不同任务，不能笼统地说“参考这张图”：

| 参考任务 | 希望保留什么 | 文字更应该补充什么 |
| --- | --- | --- |
| 主体参考 | 人物、产品或物体身份 | 新场景、姿势、构图和光线 |
| 构图参考 | 轮廓、位置、透视和空间布局 | 新主体、材质和色彩 |
| 风格参考 | 色彩、笔触、材质或视觉处理 | 画面内容与叙事任务 |
| 姿势或控制参考 | 身体姿态、视线或结构 | 主体身份、服装、环境和完成度 |

Adobe Firefly 将 Composition reference 和 Style reference 分开，并允许分别调整遵循强度；Google Imagen 的定制功能也区分主体、风格和控制图等用途。具体名称与支持范围随产品变化，但编辑原则一致：**说明每张参考图到底负责什么。**

```prompt
Use the reference image only for the subject's identity: preserve the chin-length hair, right-side blue clip, red triangular earrings and facial structure. Place her in the new kitchen scene described below; do not copy the reference background or lighting.
```

这类写法仍需当前产品支持对应的参考图能力。不要在没有主体参考功能的模型里，把“保持完全同一人”当成必然结果。

## 修改已有图片：写变化，也写保持项

局部修改的核心不是重写整张图，而是说明变化对象、变化内容和保持范围。

```prompt
Change only the time of day from morning to blue hour. Keep the woman, pose, facial identity, clothing, camera angle, framing, letter and furniture layout unchanged. Replace the warm window light with soft cool light from outside; keep the desk lamp warm.
```

```prompt
Replace the empty wall on frame right with a rain-streaked window. Preserve the subject, left-third composition, eye-level medium shot and all foreground objects.
```

Google Imagen 的官方编辑与定制示例同样使用“改变某个对象”“移除某个对象”“保留参考主体”等明确任务。具体产品对局部选择、遮罩和保持能力不同，结果仍需要逐项检查。

## 图片里需要文字时

如果海报、招牌或信件需要可读文字，先决定这段文字是否必须精确。Google Imagen 的指南建议保持文字简短，并提醒文字生成仍可能需要多次迭代。

更可靠的制作分工通常是：

1. 生成留有明确文字区域的画面；
2. 需要时让模型尝试短标题或占位文字；
3. 品牌名、正文、日期和法律信息在排版软件中后期完成；
4. 不把模型看似可读的文字直接当成最终交付。

对本站故事里的手写信，可以让图片生成纸张、手势、墨迹和留白，具体中文句子后期合成。这样也避免把文字正确性和人物稳定性混在同一轮测试里。

## 七种常见 Prompt 问题

### 1. 形容词很多，主体关系不清楚

“梦幻、唯美、电影感、史诗级”没有回答谁在画面里、在哪里、正在做什么。先补主体、动作、场景和构图。

### 2. 多个风格互相竞争

真实纪实摄影、扁平矢量插画、厚涂油画和塑料 3D 渲染同时出现时，模型只能自行折中。一次先保留一个主要媒介方向。

### 3. 左右和数量没有写清

角色锚点位于哪一侧、画面有几个人、桌上有几个杯子，都应该明确并进入验收项。

### 4. 构图只写“电影感”

补上画幅、景别、人物边界、机位、主次和留白方向。构图是空间关系，不是气氛词。

### 5. 每轮同时改变所有内容

主体、姿势、场景、光线和风格一起换掉，结果无法告诉你哪项修改有效。保留基线，一次改变一组相关变量。

### 6. 把负面 Prompt 当成通用语法

有些产品提供独立负面提示，有些模型更建议使用正向描述目标状态。先查当前产品说明；没有明确支持时，可以优先写“画面应当是什么”，而不是复制一长串跨模型负面词。

### 7. 为图生视频生成了错误的动作起点

一张漂亮的奔跑中间帧不一定适合“从静止开始走路”。检查重心、视线、衣物方向、运动模糊和画面留白是否支持下一步动作。

## 四轮迭代，不一次追求成片

### 第一轮：只验证内容

主体、数量、动作、场景和关键道具是否正确。风格先保持简单。

### 第二轮：只验证构图

固定内容，调整画幅、景别、可见边界、机位和留白。选出能够完成信息任务的基础图。

### 第三轮：只验证光线与质感

保持主体和构图，调整光源、色彩、材质和整体媒介方向。

### 第四轮：验证连续性与下游用途

检查角色锚点、场景关系、画幅和色彩是否能与前后镜连接；如果要做图生视频，再检查运动起点和画外空间。

```text
轮次：03 / 光线测试
保持：人物身份、坐姿、16:9 腰部以上中景、信件和左右构图
本轮变量：左侧冷晨光 + 桌面暖灯
验收：眼睛可读；信纸不过曝；黄色外套仍是主色锚点
结果：待生成
```

## 作为图生视频第一帧，再检查一次

- 主体是否处在目标动作的合理起点；
- 视线、重心、头发和衣物方向是否支持下一步；
- 手和道具是否已经处在清楚、可延续的关系中；
- 运镜方向是否有足够画面空间；
- 拉远、横移或环绕将要求模型补出多少未知区域；
- 身份锚点是否在当前景别中真正可见；
- 图片里有没有与目标运动相反的模糊或姿态。

完成起始图以后，再进入[图生视频与文生视频 Prompt 指南](/notes/video-vs-image-prompt/)分配运动、摄影机和时间信息；如果还在决定人物应该占多大，先回到[景别与构图指南](/notes/shot-size-guide/)。

## 生成前最后检查

- 媒介和用途说清楚了吗？
- 主体数量、身份锚点和左右位置明确吗？
- 抽象情绪是否已经翻译成可见姿势或状态？
- 场景、时间和关键道具是否足够，不多不少？
- 画幅、景别、可见边界和机位是否互相一致？
- 光源、色彩与材质有没有明确主次？
- 哪些必须保持，哪些允许探索？
- 参考图分别负责主体、构图、风格还是姿势？
- 本轮只改变哪一组变量？
- 这张图如果用于视频，是否真的是合适的第一帧？

[十四镜故事生成包](/stories/she-forgets-yesterday/#generation-pack)已经列出角色锚点、色彩规则和逐镜 Prompt，可用这套流程逐步制作关键帧。但那些内容目前仍是待测试制作设计，不代表已经生成出合格素材。

> [!JING'S NOTE]
> 待荆确认：好的图片 Prompt 不是把所有想象一次塞完，而是让这一轮生成只回答一个清楚的画面问题。

## 参考来源

- [Adobe Firefly：Writing effective text prompts for image generation](https://helpx.adobe.com/firefly/web/work-with-images/generate-images/writing-effective-text-prompts.html)
- [Adobe Firefly：Generate images from text descriptions](https://helpx.adobe.com/firefly/web/work-with-images/generate-images/generate-images-from-text-descriptions.html)
- [Google Cloud：Imagen 图片属性与 Prompt 指南](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/image/img-gen-prompt-guide?hl=zh-CN)
- [Google Cloud：Imagen Subject customization](https://cloud.google.com/vertex-ai/generative-ai/docs/image/subject-customization)
- [Google Cloud：Imagen Instruction customization](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/image/instruct-customization?hl=zh-CN)

本文是 **资料文章**：官方产品结构与建议已经核对，模板、分层方法和迭代流程是本站的编辑转译。示例均为待测试设计，不冒充真实生成结果，也不代表荆已经确认的个人经验。
