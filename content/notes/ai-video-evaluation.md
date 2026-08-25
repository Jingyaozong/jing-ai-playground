---
title: "AI 视频到底应该怎么评？"
slug: "ai-video-evaluation"
category: "AI EVAL"
issue: "001"
date: "2026-08-25"
description: "把“好不好看”拆成六个可以检查、解释和复盘的评测层级。"
cover: "eval-blue"
featured: true
tags: ["AI VIDEO", "EVALUATION", "AIGC"]
readingTime: "12 分钟"
demo: false
editorialStatus: "draft"
sourceTitle: "VBench / EvalCrafter / 官方提示指南"
sourceUrl: "https://openaccess.thecvf.com/content/CVPR2024/papers/Huang_VBench_Comprehensive_Benchmark_Suite_for_Video_Generative_Models_CVPR_2024_paper.pdf"
sourceNote: "本文是基于公开研究和官方指南形成的编辑整理稿。六层框架与权重是本站草案，等待荆结合真实项目经验确认。"
relatedNotes: ["video-failure-cases", "shot-size-guide", "video-vs-image-prompt"]
---

评 AI 视频，最容易掉进两个极端：一种只看“第一眼漂不漂亮”，另一种把所有问题压成一个总分。前者会忽略人物漂移、动作断裂和 Prompt 没完成；后者虽然方便排序，却很难告诉创作者下一步应该改什么。

[VBench](https://openaccess.thecvf.com/content/CVPR2024/papers/Huang_VBench_Comprehensive_Benchmark_Suite_for_Video_Generative_Models_CVPR_2024_paper.pdf) 把评测分成 **视频本身的质量** 与 **视频对生成条件的遵循** 两个大方向，再拆成 16 个维度。[EvalCrafter](https://openaccess.thecvf.com/content/CVPR2024/papers/Liu_EvalCrafter_Benchmarking_and_Evaluating_Large_Video_Generation_Models_CVPR_2024_paper.pdf) 也强调视觉、内容、运动和文图一致性不能只靠单一指标概括。

> [!KEY POINT]
> 先判断视频有没有完成任务，再判断它完成得漂不漂亮；最后一定要说明问题出现在哪一层。

## 评测之前：先写清楚“这条视频要完成什么”

没有验收目标，就没有可靠的评测。开始播放之前，先把 Prompt 和制作需求拆成可检查项目。

[Google 的 Veo 提示指南](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/video/video-gen-prompt-guide?hl=zh-CN) 建议从主体、动作、场景、摄影机、光线和风格等组成部分理解视频提示；[Runway 的 Gen-4 指南](https://help.runwayml.com/hc/en-us/articles/39789879462419-Gen-4-Video-Prompting-Guide) 则提醒图生视频时让输入图承担外观信息，让文字更集中地描述运动。

```prompt
近景。一名短发女性站在雨后的公交站，先看向道路尽头，
然后缓慢回头看向镜头。摄影机轻微向前推进，清晨自然光。
```

把这条 Prompt 拆开，可以得到五个验收点：

1. 主体仍然是同一名短发女性；
2. 场景是雨后的公交站；
3. 先看道路尽头，再回头看镜头；
4. 摄影机发生轻微推进；
5. 光线呈现清晨的自然感。

如果“回头”是这条视频的核心动作，而结果里完全没有发生，那么即使画面漂亮，也不能算任务完成。

## 六层评测框架

### 01 任务完成度

逐项核对主体、动作、场景、镜头、时长、画幅、风格和声音要求。这里评的是 **有没有按要求生成**，不是审美偏好。

| 检查项 | 可以问的问题 | 常见失败 |
| --- | --- | --- |
| 主体与数量 | 人物、物体和数量是否正确？ | 少人、多物、主体变成另一类 |
| 动作与顺序 | 动作发生了吗？先后顺序正确吗？ | 漏动作、反向、动作同时发生 |
| 场景与属性 | 地点、时间、天气、颜色是否匹配？ | 场景混合、属性丢失 |
| 镜头要求 | 景别、机位和运镜是否实现？ | 人物在动，但摄影机没有动 |

> [!BAD CASE]
> 不要因为结果“意外地很好看”，就忽略它没有完成核心指令。意外结果可以收藏，但不能冒充 Prompt 遵循。

### 02 主体与世界一致性

视频需要让主体和环境在时间里持续成立。人物一致性不只是“脸差不多”，还包括发型、服装、配饰、体型，以及遮挡之后能否恢复成同一个人。

- 人物身份有没有漂移；
- 衣服、道具、文字和背景结构有没有无故变化；
- 同一个物体被遮挡后重新出现时，形状和位置是否合理；
- 多镜头内容里，角色关系和空间方向是否延续。

### 03 时间、运动与连续性

图片只需要一个瞬间成立，视频必须在一段时间里持续成立。重点观察：

- 是否出现闪烁、跳帧或纹理沸腾；
- 运动速度是否忽快忽慢；
- 动作的起点、过程和终点是否完整；
- 主体运动与摄影机运动能否区分；
- 镜头切换或遮挡有没有造成身份、位置突变。

> [!TIP]
> 第一遍按正常速度看整体，第二遍只看主体和动作，第三遍再检查背景边缘、手部和遮挡处。不要一开始就逐帧找瑕疵，否则容易失去对整体运动的判断。

### 04 物理、人体与常识

[VBench 2.0](https://arxiv.org/abs/2503.21755) 把评测继续推进到“内在可信度”，覆盖人体、可控性、创造性、物理和常识等方向。也就是说，画面看起来连贯还不够，它发生的事情还要说得通。

需要重点检查：

- 关节、手指、步态和重心是否合理；
- 重力、碰撞、惯性、液体和布料反应是否可信；
- 前因与后果能否连接；
- 人物是否在没有触碰的情况下操纵物体；
- 影子、反射、遮挡关系有没有违反空间逻辑。

### 05 画面、声音与技术质量

这一层关注视频作为成品是否能够被使用：清晰度、压缩、噪点、曝光、色彩、字幕与音频都属于这里。

有声音时，单独检查对白是否清楚、口型是否同步、环境声是否连续、音乐和音效是否盖住重要信息。没有声音的模型，不应该因为“没有音频”被扣除本来就不承诺的能力。

### 06 镜头表达与使用价值

最后才进入“它是不是一个好镜头”：景别有没有帮助叙事，摄影机运动有没有动机，构图能否把注意力放到正确的位置，情绪是否符合用途。

这一层必须结合场景判断。广告、漫剧、模型 Benchmark 和概念短片的目标不同，不能共用一套固定审美权重。

## 一张可以试跑的评分表

下面不是行业标准，而是一份用于小批量试跑的 **本站编辑草案**：

| 维度 | 建议权重 | 低分意味着什么 |
| --- | ---: | --- |
| 任务完成度 | 25% | Prompt 或业务要求没有完成 |
| 主体与世界一致性 | 20% | 人物、物体或空间关系漂移 |
| 时间、运动与连续性 | 20% | 闪烁、跳变、动作不完整 |
| 物理、人体与常识 | 15% | 看似流畅但事情不成立 |
| 画面、声音与技术质量 | 10% | 成品清晰度或声音不可用 |
| 镜头表达与使用价值 | 10% | 能生成，但不适合真实用途 |

> [!KEY POINT]
> 权重只能帮助汇总，不能掩盖致命问题。核心动作缺失、主体身份无法确认、严重人体崩坏等情况，应该单独标记为“关键失败”，而不是用其他维度的高分抵消。

## 记录问题时，不要只写“崩了”

一个可复盘的问题记录至少包含四部分：

```text
时间位置：00:03.2—00:04.1
问题层级：主体与世界一致性
可见现象：人物转身后耳环消失，发型由短发变为披肩发
影响判断：主体身份连续性被破坏，关键镜头不可用
```

这样记录以后，团队才能判断下一步是修改 Prompt、加强参考图、减少复杂动作、换模型，还是把问题留给后期处理。

> [!JING'S NOTE]
> 待荆确认：真正有用的评测，不只告诉我们哪条视频更好，还应该告诉创作者下一次应该改 Prompt、换模型，还是调整制作流程。

## 参考来源

- [VBench：视频生成模型综合评测基准（CVPR 2024）](https://openaccess.thecvf.com/content/CVPR2024/papers/Huang_VBench_Comprehensive_Benchmark_Suite_for_Video_Generative_Models_CVPR_2024_paper.pdf)
- [VBench 2.0：面向内在可信度的视频生成评测](https://arxiv.org/abs/2503.21755)
- [EvalCrafter：大型视频生成模型的多维评测框架（CVPR 2024）](https://openaccess.thecvf.com/content/CVPR2024/papers/Liu_EvalCrafter_Benchmarking_and_Evaluating_Large_Video_Generation_Models_CVPR_2024_paper.pdf)
- [Google Cloud：Veo 视频生成提示指南](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/video/video-gen-prompt-guide?hl=zh-CN)
- [Runway：Gen-4 Video Prompting Guide](https://help.runwayml.com/hc/en-us/articles/39789879462419-Gen-4-Video-Prompting-Guide)

当前版本是 **编辑整理稿**。下一步需要加入荆自己的真实坏例、项目权重和评分习惯，再转为正式发布。
