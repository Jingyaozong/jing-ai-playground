---
title: "AI 视频人物一致性：先固定参考，再让角色动起来"
slug: "ai-video-character-consistency"
category: "AI TIPS"
issue: "005"
date: "2026-08-28"
description: "从人物参考、构图参考到图生视频运动提示，整理一条更可控的多镜头角色工作流。"
cover: "tips-yellow"
featured: true
tags: ["AI VIDEO", "CHARACTER", "REFERENCE", "WORKFLOW"]
readingTime: "12 分钟"
demo: false
editorialStatus: "source-backed"
sourceTitle: "Runway References / Google Veo Reference Images / Adobe Firefly Reference Controls"
sourceUrl: "https://help.runwayml.com/hc/en-us/articles/40042718905875-Creating-with-Gen-4-Image-References"
sourceNote: "功能事实来自 Runway、Google Cloud 和 Adobe 的官方文档；分镜前的整理方法是本站面向创作者的编辑转译，不包含模型排名，也不声称任何工具能保证人物百分之百一致。"
relatedNotes: ["image-prompt-guide", "video-vs-image-prompt", "ai-video-evaluation"]
connections:
  - label: "PROMPT"
    title: "角色锚点制作卡"
    description: "把固定特征、允许变化和单镜任务整理成可复用提示模板；输出仍需人工核对。"
    href: "/prompts/all/?category=AI%20%E8%A7%86%E9%A2%91%E5%88%B6%E4%BD%9C#prompt-video-character-anchor-brief"
    tone: "yellow"
  - label: "TOOL"
    title: "角色锚点卡生成器"
    description: "把脸部、头发、配饰、服装和允许变化整理成三种可复制的工作格式。"
    href: "/tools/character-anchor/"
    tone: "mint"
  - label: "EXPERIMENT"
    title: "同一个她，四十个镜头"
    description: "进入人物一致性 Pilot 与记录台，用真实样本观察身份、动作、物理和镜头表现。"
    href: "/experiments/forty-shots-one-character/"
    tone: "sky"
  - label: "NOTE"
    title: "AI 视频到底应该怎么评？"
    description: "生成之后，用任务完成度、主体一致性、时间运动与可用性分层验收。"
    href: "/notes/ai-video-evaluation/"
    tone: "coral"
---

人物一致性不是在每条 Prompt 里反复复制同一段外貌描写。多镜头制作里，角色会同时遇到景别、角度、光线、表情、动作、遮挡和场景变化；每增加一个变量，模型就多一次重新解释人物的机会。

更稳妥的顺序是：**先用参考图固定“她是谁”，再用关键帧固定“这一镜从哪里开始”，最后让视频 Prompt 只负责“接下来怎样动”。**

> [!KEY POINT]
> 把身份、构图、风格和运动交给不同的控制输入。一个 Prompt 同时承担四件事，出了问题就很难知道应该改哪里。

## 先分清四种参考，各自控制什么

不同平台都在使用“Reference”这个词，但参考图承担的任务并不相同。

| 控制类型 | 主要作用 | 不应该默认它能做到 |
| --- | --- | --- |
| 人物 / Subject Reference | 保留人物、角色或产品的外观身份 | 自动锁定所有景别、动作和遮挡结果 |
| 风格 / Style Reference | 延续色彩、纹理、材质和整体视觉气质 | 保证是同一张脸或同一套服装 |
| 构图 / Composition Reference | 控制轮廓、深度、主体位置和画面结构 | 直接复制人物身份或动作过程 |
| 首帧 / 尾帧 | 指定视频从什么画面开始或在什么画面结束 | 自动生成合理的中间动作和物理过程 |

[Google Veo 的官方参考图文档](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/video/use-reference-images-to-guide-video-generation?hl=zh-CN)明确把人物、角色或产品的 Subject Reference 与 Style Reference 分开；前者可以提交同一主体的多张图来保留外观，后者只负责艺术风格。

[Adobe Firefly 的构图参考说明](https://helpx.adobe.com/firefly/web/work-with-images/generate-images/match-image-composition-to-reference-image.html)强调的是画面轮廓和深度，并提供强度控制。它解决“人物站在哪里、画面怎样组织”，不等于人物身份锁定。

## 第一步：先做一张干净的主参考

[Runway Gen-4 References 官方指南](https://help.runwayml.com/hc/en-us/articles/40042718905875-Creating-with-Gen-4-Image-References)建议人物参考使用自然、均匀的光线和中性表情，并从简单提示开始迭代。原因很直接：一张已经带有强烈侧光、夸张表情或严重遮挡的图片，会把这些偶然状态一起交给模型解释。

主参考优先满足：

- 五官、发际线和脸部轮廓清楚；
- 头发没有被帽子、手或大面积阴影挡住；
- 光线自然均匀，不依赖极端滤镜；
- 表情中性，方便向其他情绪扩展；
- 没有模糊手指、破碎耳饰等明显生成瑕疵。

最后一条尤其重要。Runway 的[图生视频提示指南](https://help.runwayml.com/hc/en-us/articles/48324313115155-Image-to-Video-Prompting-Guide)提醒，输入图里的模糊脸部、手部或其他视觉瑕疵，进入视频后可能被进一步放大。

> [!BAD CASE]
> 不要把“最有氛围的一张图”自动当成人物母版。它可能适合做海报，却因为侧脸、逆光、动态模糊或遮挡，不适合承担身份参考。

## 第二步：把人物拆成可见锚点

人物一致性不是只看脸。对短片和漫剧来说，观众也会通过发型轮廓、服装色块、配饰和体型快速判断“还是不是同一个人”。

可以先建立一张简短的人物锚点卡：

```text
脸部：圆偏椭圆脸，下颌线柔和，平直眉
头发：齐下巴黑色短发，右侧分缝
高识别配饰：右侧蓝色发夹，红色三角耳饰
服装主色：芥末黄色外套，白色圆领内搭
轮廓：肩线窄，整体轻薄，不使用宽大帽檐
允许变化：表情、景别、场景、光线方向
暂不变化：发型长度、发夹位置、耳饰形状、外套主色
```

这张卡不是要把所有文字塞进每条 Prompt。它的作用是决定参考图里必须看得见什么，以及验收时检查哪些特征。

## 第三步：按用途补参考，不把图片越堆越多

Runway 当前允许单次生成使用最多三张 References；Google Veo 的官方文档也描述了同一人物、角色或产品最多三张 Subject Images 的方式。数量上限不等于每次都应该放满。

更容易排查的组合是：

1. **主参考**：清楚回答“她是谁”；
2. **景别参考**：需要全身镜头时，补充服装和身体比例；
3. **场景或构图参考**：只在画面位置难以用文字表达时加入。

如果一次同时加入多张人物、服装、场景和风格图，模型可能得到互相竞争的信号。Runway 的 References 指南也建议复杂变化分开迭代，并把满意的中间结果继续保存为新参考。

> [!TIP]
> 把“人物路径”和“场景路径”分开生成。先得到可信的人物新角度，再把这张结果带入目标场景，比一步完成换角度、换衣服、换地点和换光线更容易复盘。

## 第四步：先做镜头关键帧，再生成运动

图生视频里，输入图已经提供主体、构图、色彩、光线和风格。Runway 官方指南因此建议：视频文字提示主要描述主体动作、环境运动、摄影机运动、速度和时间变化，不要重复长篇描述输入图里已经存在的内容。

一条更清楚的图生视频 Prompt 可以写成：

```prompt
The camera slowly pushes in as she turns from the window toward the lens.
Her movement is restrained and continuous.
The curtain shifts gently in the background.
```

它只回答三件事：摄影机怎样动、人物怎样动、环境怎样动。人物长相和服装由首帧承担。

如果模型需要新增画面里不存在的物体、发生明显形态变化或处理多人互动，再补充必要的视觉说明；其余时候，重复描述人物可能让模型重新绘制已经确定的身份。

## 第五步：一条素材只承担一个核心动作

Runway 的 Gen-4 和图生视频指南都建议从简单运动开始，再逐项增加细节。这对人物一致性尤其重要。

优先测试：

- 静止呼吸和眨眼；
- 小幅度转头；
- 缓慢抬手；
- 一到两步行走；
- 固定机位下的简单表情变化。

后测试：

- 大幅度正侧脸切换；
- 手遮住脸后重新出现；
- 快速转身、奔跑或复杂舞蹈；
- 两人接触、递物和拥抱；
- 环绕运镜同时进行大动作。

这不是说复杂镜头永远不能生成，而是先用低风险镜头确认身份参考有效，再逐步增加运动、遮挡和摄影机变量。

## 第六步：首帧、尾帧和其他控制不要互相打架

[Adobe Firefly 视频编辑器文档](https://helpx.adobe.com/firefly/web/firefly-video-editor/generate-videos/generate-video-using-firefly-models.html)支持用首帧、尾帧引导视频开始和结束，也支持构图参考、镜头运动、景别和角度控制。但官方页面同时说明：加入首帧或尾帧后，部分构图、运动、景别、角度或风格设置可能不可用。

这给出一个跨工具都适用的检查习惯：

1. 先确认当前模型和模式真正支持哪些控制；
2. 检查打开某个控制后，界面是否关闭了另一个控制；
3. 不要把互相矛盾的首尾帧交给模型补间；
4. 记录本次到底使用了人物参考、首帧、尾帧、构图还是运动参考。

功能名称相似，不代表可以同时叠加，也不代表不同平台的 Reference 含义相同。

## 第七步：用测试矩阵代替“再抽一次”

如果同一角色连续生成失败，只改变一个变量：

| 轮次 | 保持不变 | 只改变 | 想确认什么 |
| --- | --- | --- | --- |
| A | 人物参考、首帧、动作、机位 | 随机结果 | 当前条件下的自然波动 |
| B | 人物参考、首帧、机位 | 动作幅度 | 大动作是否更容易造成身份漂移 |
| C | 人物参考、动作、机位 | 首帧角度 | 正脸、侧脸和全身参考的差异 |
| D | 首帧、动作、机位 | 人物参考组合 | 单张与多张参考是否改善关键锚点 |
| E | 人物参考、首帧、动作 | 摄影机运动 | 运镜是否引入额外身份变化 |

每轮至少保存输入图、Prompt、可见模型版本、参数和结果文件。没有这些记录，“多抽几次以后好了”无法变成可复用方法。

## 生成后，检查五类连续性

不要只比较第一帧和最后一帧的脸。完整观看时检查：

1. **脸部结构**：眼距、脸型、鼻口比例是否突然变化；
2. **头发与配饰**：长度、分缝、发夹和耳饰是否消失或换边；
3. **服装与色块**：领口、袖长、主色和材质是否跳变；
4. **身体与动作**：身高比例、肩线、手部和重心是否可信；
5. **遮挡恢复**：转头、经过物体或离开画面后，重新出现时是否还是同一人。

可以把问题记录进[四十镜人物一致性实验](/experiments/forty-shots-one-character/#record-desk)，再用《[AI 视频到底应该怎么评？](/notes/ai-video-evaluation/)》中的严重度和分层验收方法决定保留、返工或重做。

## 一条可以直接执行的顺序

开始多镜头人物项目时，按下面的顺序走：

1. 选择自然均匀光线、中性表情、无明显瑕疵的主参考；
2. 写出四到六个可见身份锚点，区分允许变化和暂不变化；
3. 先生成正脸、侧脸、半身和全身等静态覆盖；
4. 每个镜头选择最接近目标角度的关键帧；
5. 视频 Prompt 主要描述动作、运镜、速度和环境运动；
6. 从低风险动作开始，一次只增加一个变量；
7. 保存输入、设置和结果，按连续性字段验收；
8. 只有高风险小样稳定后，再扩展到整段故事。

人物一致性没有一条跨模型永久有效的魔法 Prompt。参考图能缩小变化范围，清楚的运动提示能减少重新解释，而测试记录负责告诉你：当前工具、当前镜头和当前角色，究竟在哪一步开始失去连续性。

## 参考来源

- [Runway：Creating with Gen-4 Image References](https://help.runwayml.com/hc/en-us/articles/40042718905875-Creating-with-Gen-4-Image-References)
- [Runway：Image to Video Prompting Guide](https://help.runwayml.com/hc/en-us/articles/48324313115155-Image-to-Video-Prompting-Guide)
- [Runway：Gen-4 Video Prompting Guide](https://help.runwayml.com/hc/en-us/articles/39789879462419-Gen-4-Video-Prompting-Guide)
- [Google Cloud：使用参考图片引导 Veo 视频生成](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/video/use-reference-images-to-guide-video-generation?hl=zh-CN)
- [Adobe Firefly：使用参考图片匹配构图](https://helpx.adobe.com/firefly/web/work-with-images/generate-images/match-image-composition-to-reference-image.html)
- [Adobe Firefly：使用首尾帧和视频控制生成素材](https://helpx.adobe.com/firefly/web/firefly-video-editor/generate-videos/generate-video-using-firefly-models.html)

本文是 **资料文章**：功能说明来自厂商官方文档，工作流是面向多镜头创作者的编辑整理。具体功能会随模型和产品更新变化，使用前应再次核对对应平台的当前文档。
