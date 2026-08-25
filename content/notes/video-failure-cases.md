---
title: "AI 视频最常见的 10 种崩坏"
slug: "video-failure-cases"
category: "AI EVAL"
issue: "002"
date: "2026-08-25"
description: "从身份漂移到因果断裂，建立一套能记录、能复盘的 AI 视频坏例词典。"
cover: "eval-sky"
featured: false
tags: ["AI VIDEO", "EVALUATION", "BAD CASE"]
readingTime: "14 分钟"
demo: false
editorialStatus: "draft"
sourceTitle: "VBench / VBench 2.0 / EvalCrafter"
sourceUrl: "https://openaccess.thecvf.com/content/CVPR2024/papers/Huang_VBench_Comprehensive_Benchmark_Suite_for_Video_Generative_Models_CVPR_2024_paper.pdf"
sourceNote: "本文将公开评测维度重新整理成面向创作者的中文坏例词典。分类、严重度和排查建议是编辑草案，等待荆用真实项目校准。"
relatedNotes: ["ai-video-evaluation", "video-vs-image-prompt", "camera-movement-guide"]
---

“这条视频崩了”并不是一个可以执行的评测结论。脸变了、动作断了、背景在闪、摄影机没有按要求移动，虽然都可以叫“崩”，但它们发生在完全不同的层级，下一轮的排查方式也不一样。

[VBench](https://openaccess.thecvf.com/content/CVPR2024/papers/Huang_VBench_Comprehensive_Benchmark_Suite_for_Video_Generative_Models_CVPR_2024_paper.pdf) 的 16 个评测维度覆盖主体与背景一致性、时序闪烁、运动平滑、人体动作、空间关系和整体 Prompt 一致性；[VBench 2.0](https://arxiv.org/abs/2503.21755) 又把人体可信度、物理和常识纳入评测。下面的十种坏例，是把这些研究维度翻译成创作者和人工评测可以直接记录的语言。

> [!KEY POINT]
> 坏例词典的目的不是给失败起漂亮名字，而是让不同的人看到同一个问题时，能够写下接近一致的记录。

## 先确定严重度

同一种问题在不同镜头里影响不同。建议先用三档严重度，不急着打复杂分数：

| 等级 | 判断方式 | 处理建议 |
| --- | --- | --- |
| P0 · 关键失败 | 核心任务没有完成，镜头不能使用 | 重生成或更换方案 |
| P1 · 明显问题 | 普通速度下清楚可见，破坏观看或连续性 | 优先修复、重生成或剪掉问题段 |
| P2 · 轻微瑕疵 | 需要仔细观察才发现，不影响主要信息 | 根据交付标准决定是否处理 |

> [!TIP]
> 先按正常速度完整看一遍再定严重度。只有逐帧才能发现、正常播放几乎不可见的问题，不一定值得被判成 P0。

## 01 身份漂移 / Identity drift

同一个角色在视频过程中逐渐变成“另一个长得相似的人”。五官比例、年龄感、脸型、肤色或辨识特征发生变化，都属于身份漂移。

**怎么看出来：** 遮挡、转头、快速运动和镜头距离变化之后，角色还能不能被立即认作同一个人。

**为什么严重：** 对漫剧、数字人和连续叙事来说，身份是镜头成立的前提。关键角色无法确认时通常属于 P0。

```text
00:03.8—00:04.6｜P0｜身份漂移
人物转头后眼距变宽、下颌变尖，已无法确认是同一角色。
```

**优先排查：** 参考图是否稳定；镜头是否同时要求大幅转头、遮挡和快速运镜；单镜头时间是否过长。这里列的是排查方向，不代表身份漂移一定由 Prompt 引起。

## 02 外观与道具变异 / Appearance mutation

人物身份没有完全改变，但衣服颜色、发型长度、耳环、纽扣、手持道具或物体纹理持续变化。

这类问题容易被“脸没变就算一致”掩盖。对有角色设定或商品展示的内容，服装与道具同样属于身份系统。

> [!BAD CASE]
> 人物转身前拿着红伞，转身后伞变成黑色；即使动作流畅，也已经破坏了道具连续性。

**优先排查：** 把必须保持的外观特征写成短而明确的约束；减少同一镜头里需要同时维持的细碎元素；检查问题是否只发生在被遮挡后重新出现的位置。

## 03 人体与肢体畸变 / Human anomaly

常见现象包括多指、少指、手臂粘连、关节反折、四肢长度突然改变，以及身体局部融入衣服或物体。

[VBench 2.0](https://arxiv.org/abs/2503.21755) 将 Human Fidelity 单独列为内在可信度的重要方向，因为画面“像真的”不等于人体结构真的成立。

**记录时不要只写：** “手崩了”。

**更有效的写法：** “右手接触杯柄时由五指变成七指，手掌与杯子粘连，持续 0.8 秒。”

**优先排查：** 接触动作是否过于复杂；手部是否太小或被遮挡；能否改变景别、动作设计或剪辑点，而不是只重复生成同一高风险动作。

## 04 遮挡与物体恒存失败 / Occlusion failure

主体被另一个物体挡住后，重新出现时身份、形状、数量或位置发生变化；或者前景与背景互相穿透，遮挡顺序不符合空间关系。

**典型表现：** 人走过柱子后衣服改变；杯子被手挡住后消失；人物本应在桌子后面，身体却浮到桌面前方。

**优先排查：** 问题发生在遮挡前、遮挡中还是重新出现时；记录遮挡物与主体的空间关系；必要时把一次复杂交互拆成两个镜头。

## 05 时序闪烁与纹理沸腾 / Temporal flicker

颜色、亮度、细节或纹理在相邻帧之间快速跳动。背景树叶、毛发、文字、密集图案和高频细节最容易暴露这种问题。

[VBench](https://github.com/Vchitect/VBench) 将 temporal flickering 与 subject / background consistency 分开评测，原因是“主体没换人”和“每一帧都稳定”不是同一件事。

**怎么看出来：** 暂时忽略动作，只盯住画面中的固定区域；如果本应静止的纹理像在持续沸腾，就是明显时序问题。

**优先排查：** 输入素材是否已有噪点或细碎纹理；镜头时长和运动幅度是否放大了不稳定；成品阶段能否通过剪短、降噪或替换背景解决。

## 06 运动断裂与速度漂移 / Motion discontinuity

动作缺少自然的加速、减速和过渡，表现为瞬移、突然停顿、速度忽快忽慢、步态打滑，或运动方向无原因地改变。

**不要和运镜混在一起：** 主体向前走、摄影机向前推、画面被数字放大，是三种不同变化。

```text
00:02.1—00:03.0｜P1｜运动断裂
人物连续向左行走，但脚步没有着地，身体以恒定速度在地面滑行。
```

**优先排查：** Prompt 是否同时塞入太多连续动作；动作是否有明确起点和终点；能否降低运动复杂度或缩短单次生成时长。

## 07 空间、碰撞与物理失败 / Physics failure

物体穿模、碰撞没有反馈、重力方向错误、液体逆流、影子与光源不一致，都属于“画面在动，但世界规则没有成立”。

这类问题不一定第一眼难看，却会迅速破坏真实感和因果关系。VBench 2.0 把 Physics 与 Commonsense 分开，提醒评测者不仅要问“像不像”，还要问“这件事是否可能这样发生”。

**优先排查：** 把交互拆成接触前、接触瞬间和接触后三段；检查失败发生在哪一段；如果任务本身超出模型的稳定能力，应调整动作设计，而不是无限增加形容词。

## 08 Prompt 遗漏与顺序错误 / Instruction failure

视频看起来完整，但漏掉了关键主体、动作、属性或顺序；或者把“先放下杯子，再起身”生成成先起身后放杯子。

这是任务完成度问题，不应该被画面质量高分抵消。[Google Veo 提示指南](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/video/video-gen-prompt-guide?hl=zh-CN) 会把主体、动作、场景和摄影机等元素拆开说明，评测时也应该用同样方式逐项验收。

**优先排查：** 先确认遗漏的是不是核心要求；再检查一条 Prompt 里是否包含过多主体、动作和时间顺序；必要时将复杂段落拆成多个镜头。

## 09 摄影机运动失控 / Camera motion failure

Prompt 要求摄影机推进，结果却只是人物变大；要求环绕，结果背景透视没有变化；要求固定镜头，画面却无目的地漂移。

[Runway 的视频提示指南](https://help.runwayml.com/hc/en-us/articles/39789879462419-Gen-4-Video-Prompting-Guide) 建议图生视频时让文字更集中描述运动。评测时也需要把 **人物动作** 和 **摄影机动作** 分开观察。

> [!TIP]
> 暂时忽略人物表演，只看画面边缘、背景透视和主体尺寸：背景透视是否随摄影机位置改变，通常比“感觉好像在动”更可靠。

**优先排查：** 镜头术语是否与自然语言动作互相冲突；同一条 Prompt 是否要求多种运镜；输入图的构图是否给摄影机留下运动空间。

## 10 叙事与因果断裂 / Causal break

单帧漂亮、运动也流畅，但前因与后果接不上：人物没有打开门却出现在门外，物体没有被拿起却突然到了手中，情绪和动作没有过渡。

这类问题很难被纯画质指标发现，却直接决定镜头有没有使用价值。它与 Prompt 遵循相关，但范围更大：即使 Prompt 没有写明每一步，视频内部也应该保持基本常识和因果连续。

**优先排查：** 用一句话复述镜头里“谁因为什么做了什么，结果怎样”；如果无法顺畅复述，先调整动作和分镜，再决定是否重生成。

## 一张适合坏例库的记录模板

```text
样本编号：
模型 / 版本：
生成方式：文生视频 / 图生视频 / 首尾帧
原始 Prompt：

问题时间：00:00.0—00:00.0
问题名称：从本文十类中选择
严重度：P0 / P1 / P2
可见现象：只写画面中实际发生的事
影响：为什么影响任务或观看
排查方向：Prompt / 参考图 / 模型 / 分镜 / 后期
处理结果：保留 / 剪切 / 后期 / 重生成
```

> [!JING'S NOTE]
> 待荆确认：坏例库真正积累的不是“AI 又失败了一次”，而是某类任务在什么条件下容易失败，以及我们下一次怎样更快避开它。

## 参考来源

- [VBench：视频生成模型综合评测基准（CVPR 2024）](https://openaccess.thecvf.com/content/CVPR2024/papers/Huang_VBench_Comprehensive_Benchmark_Suite_for_Video_Generative_Models_CVPR_2024_paper.pdf)
- [VBench 开源维度与 Prompt Suite](https://github.com/Vchitect/VBench)
- [VBench 2.0：人体、物理与常识等内在可信度评测](https://arxiv.org/abs/2503.21755)
- [EvalCrafter：大型视频生成模型的多维评测框架（CVPR 2024）](https://openaccess.thecvf.com/content/CVPR2024/papers/Liu_EvalCrafter_Benchmarking_and_Evaluating_Large_Video_Generation_Models_CVPR_2024_paper.pdf)
- [Google Cloud：Veo 视频生成提示指南](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/video/video-gen-prompt-guide?hl=zh-CN)
- [Runway：Gen-4 Video Prompting Guide](https://help.runwayml.com/hc/en-us/articles/39789879462419-Gen-4-Video-Prompting-Guide)

当前版本是 **编辑整理稿**。下一步需要用荆的真实失败样本补上时间点截图、生成参数和修复前后对照。
