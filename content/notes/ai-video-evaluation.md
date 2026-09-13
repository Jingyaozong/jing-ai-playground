---
title: "AI 视频到底应该怎么评？"
slug: "ai-video-evaluation"
category: "AI EVAL"
issue: "001"
date: "2026-08-27"
description: "从四套公开评测基准出发，把 AI 视频判断整理成可执行的验收、观察、标记与复盘流程。"
cover: "eval-blue"
featured: true
tags: ["AI VIDEO", "EVALUATION", "VBench", "WORKFLOW"]
readingTime: "16 分钟"
demo: false
editorialStatus: "source-backed"
sourceTitle: "VBench / EvalCrafter / VBench 2.0 / T2V-CompBench"
sourceUrl: "https://github.com/Vchitect/VBench"
sourceNote: "事实部分依据原始论文、CVPR 页面与官方代码仓库核对；实用评测流程是本站面向创作者的编辑转译，不包含模型排名，也不冒充荆已经确认的个人观点。"
relatedNotes: ["video-evaluation-eight-dimensions", "video-failure-cases", "ai-video-character-consistency"]
connections:
  - label: "EXPERIMENT"
    title: "同一个她，四十个镜头"
    description: "进入可填写的四十镜记录板，用真实样本验证身份、动作、物理与镜头表现。"
    href: "/experiments/forty-shots-one-character/#record-desk"
    tone: "yellow"
  - label: "TOOL"
    title: "分镜整理器"
    description: "生成前先把景别、时长、动作、运镜和声音整理成可验收的镜头要求。"
    href: "/tools/shot-list-cleaner/"
    tone: "mint"
  - label: "GLOSSARY"
    title: "AI 视频翻车词典"
    description: "不知道问题叫什么时，从身份漂移、闪烁、物理穿帮等失败类型继续排查。"
    href: "/notes/video-failure-cases/"
    tone: "coral"
---

评 AI 视频，先别问“好不好看”。先问两件事：**它有没有完成这次生成任务？它在哪一层开始失去可信度？**

一个漂亮的错误答案仍然是错误答案；一个技术上干净、但无法用于当前镜头的结果，也不等于可交付素材。可靠的评测需要把 Prompt 遵循、时间连续性、物理合理性和实际用途分开记录。

> [!KEY POINT]
> 先设验收门槛，再做分层评分。致命问题单独标记，不允许被其他维度的高分抵消。

## 四套公开基准，分别在回答什么

公开 Benchmark 不是一张万能评分表。它们选择的测试对象、Prompt 集与自动指标不同，适合回答的问题也不同。

| 基准 | 公开设计 | 更适合回答 |
| --- | --- | --- |
| [VBench（CVPR 2024）](https://openaccess.thecvf.com/content/CVPR2024/papers/Huang_VBench_Comprehensive_Benchmark_Suite_for_Video_Generative_Models_CVPR_2024_paper.pdf) | 将视频质量拆为 16 个维度，分为视频本身质量与生成条件一致性两大方向，并逐维度做人工偏好对齐 | 一个模型在哪些基础能力上稳定，短板具体是什么 |
| [EvalCrafter（CVPR 2024）](https://openaccess.thecvf.com/content/CVPR2024/html/Liu_EvalCrafter_Benchmarking_and_Evaluating_Large_Video_Generation_Models_CVPR_2024_paper.html) | 使用 700 条 Prompt、17 个客观指标，覆盖视觉、内容、运动与文图一致性，再用用户意见拟合汇总方式 | 多种客观指标怎样更接近人的整体判断 |
| [VBench 2.0（2025）](https://arxiv.org/abs/2503.21755) | 从表层可信度继续扩展到人体、可控性、创造性、物理与常识五大方向，共 18 个细分能力 | 视频看起来真实之外，发生的事情是否真正说得通 |
| [T2V-CompBench（CVPR 2025）](https://openaccess.thecvf.com/content/CVPR2025/html/Sun_T2V-CompBench_A_Comprehensive_Benchmark_for_Compositional_Text-to-video_Generation_CVPR_2025_paper.html) | 使用 1,400 条 Prompt 检查属性、数量、空间关系、动作绑定、物体互动等七类组合能力 | Prompt 中有多个对象、属性和动作时，模型有没有正确绑定 |

VBench 明确反对只用一个总分掩盖模型的长处与短板；EvalCrafter 也发现，直接平均多个指标不如经过人类意见对齐的汇总方式。对创作者来说，这给出一个很实用的原则：**保留分项结果，比急着排出总名次更重要。**

> [!TIP]
> Benchmark 比较的是规定协议下的模型能力；制作验收判断的是一条素材能否完成当前任务。两者可以借用同一套维度，但不能把公开榜单分数直接当成项目结论。

## 第一步：生成之前，先写验收合同

没有事先写清楚的目标，评测很容易变成“结果出来以后再解释”。每条测试至少固定以下信息：

| 项目 | 必须记录什么 |
| --- | --- |
| 输入条件 | 文生视频、图生视频、首尾帧、参考角色或其他控制方式 |
| 模型条件 | 模型与版本、生成日期、时长、画幅、分辨率和可见参数 |
| 核心任务 | 这条视频最重要、不能漏掉的一个动作或叙事变化 |
| 身份锚点 | 必须持续保留的人物、服装、配饰或物体特征 |
| 镜头要求 | 景别、机位、摄影机运动以及主体运动 |
| 允许偏差 | 哪些细节可以变化，哪些变化会让镜头直接不可用 |

例如，“短发女性在雨后公交站缓慢回头，摄影机轻微推进”至少包含五个可检查项：人物身份、场景、回头动作、动作速度和摄影机推进。只有先拆出这些项目，才能判断失败来自 Prompt、模型还是测试设计。

```prompt
核心任务：人物先看向道路尽头，再缓慢回头看向镜头。
身份锚点：齐下巴短发、右侧蓝色发夹、红色三角耳饰、黄色外套。
镜头要求：近景；摄影机轻微向前推进；人物位置保持稳定。
关键失败：没有回头 / 人物身份漂移 / 推镜变成主体前移。
```

## 第二步：用四遍观看代替一次印象

### 第一遍：正常速度，只看任务

不要暂停，不先找手指。回答：核心动作发生了吗？先后顺序对吗？主体、场景和镜头要求有没有完成？

如果核心任务缺失，先标记 **任务失败**。画面再漂亮，也不进入“可直接使用”。

### 第二遍：正常速度，只看时间

把注意力放在连续性：

- 主体和背景有没有闪烁、纹理沸腾或突然跳变；
- 动作是否有起点、过程和终点；
- 速度是否无原因地忽快忽慢；
- 遮挡前后的身份、物体和空间位置是否接得上；
- 主体运动与摄影机运动能否被清楚区分。

这对应 VBench 中的主体一致性、背景一致性、时间闪烁、运动平滑度和动态程度等基础维度。

### 第三遍：暂停关键帧，只看结构与物理

在动作开始、遮挡发生、接触物体和动作结束处暂停。检查人体、手部、重心、物体形状、碰撞、重力、反射和遮挡关系。

VBench 2.0 将这类问题纳入人体可信度、物理和常识等“内在可信度”。它提醒我们：**连贯不等于合理**。一个动作可以很流畅，却仍然违反人体结构或因果关系。

### 第四遍：回到成片，只看用途

最后才判断构图、光线、情绪、节奏、声音和可剪辑性。广告镜头、漫剧、概念片和 Benchmark 样本的用途不同，不应该共享一套固定审美权重。

## 第三步：把判断拆成六层

| 层级 | 核心问题 | 典型记录 |
| --- | --- | --- |
| 任务完成度 | Prompt 和制作要求完成了吗？ | 漏动作、顺序错误、数量错误、运镜缺失 |
| 主体与世界一致性 | 时间里还是同一个人、物体和空间吗？ | 脸型漂移、配饰消失、背景结构跳变 |
| 时间与运动 | 动作是否连续、完整且速度合理？ | 闪烁、跳帧、瞬移、动作没有结束 |
| 人体、物理与常识 | 发生的事情是否成立？ | 多指、重心错误、无接触操物、碰撞无结果 |
| 技术质量 | 素材在技术上能否使用？ | 模糊、压缩、曝光、字幕、口型或声音问题 |
| 镜头表达与用途 | 这个镜头是否服务叙事和交付？ | 注意力错误、运镜无动机、情绪或节奏不匹配 |

T2V-CompBench 进一步提醒：当 Prompt 同时出现多个对象、颜色、数量、动作和空间关系时，要检查“绑定”是否正确。生成了红球和蓝杯，不代表模型理解了“红球在蓝杯左侧”；人物和动作都出现，也不代表动作属于正确的人。

## 第四步：分数之外，再加严重度

分数适合比较程度，严重度适合决定去留。建议同时使用两套标记：

| 标记 | 定义 | 建议处理 |
| --- | --- | --- |
| PASS | 没有影响用途的可见问题 | 进入候选素材 |
| MINOR | 有瑕疵，但正常观看不影响核心任务 | 保留，视用途决定后期处理 |
| MAJOR | 明显影响连续性、可信度或剪辑 | 返工或重新生成 |
| CRITICAL | 核心动作缺失、身份不可确认、严重人体崩坏等 | 直接判定本次任务失败 |

如果需要 1—5 分，可以固定三个锚点，减少不同评审者之间的漂移：

- **1 分**：核心能力失败，素材不可用；
- **3 分**：任务基本完成，但问题清晰可见，需要取舍或后期；
- **5 分**：在目标时长内稳定完成要求，没有影响用途的问题。

2 分和 4 分只表示介于相邻锚点之间。不要先给总分再倒推理由，也不要让审美高分抵消 CRITICAL 问题。

> [!BAD CASE]
> “模型 A：87 分，模型 B：84 分”并不足以支持制作选择。至少还需要分项结果、关键失败率、可用镜头率、测试 Prompt 和生成条件。

## 第五步：用可复盘的句子记录问题

“这条崩了”没有告诉下一轮该改什么。一个可复盘记录至少包含：时间位置、问题层级、可见现象、任务影响和下一步假设。

```text
镜头：A-07
时间位置：00:03.2—00:04.1
问题层级：主体与世界一致性
严重度：MAJOR
可见现象：人物转身并经过遮挡后，右侧蓝色发夹消失，短发变为披肩发。
任务影响：身份连续性被破坏，不能与前一镜直接连接。
下一步假设：减少遮挡；强化身份锚点；保持其他变量不变后重新测试。
```

注意“下一步假设”仍然是假设，不是已经证明的原因。只有控制变量并重复测试之后，才能判断问题究竟来自 Prompt、参考图、模型能力还是随机性。

## 自动指标和人工评审怎样配合

VBench、EvalCrafter、VBench 2.0 和 T2V-CompBench 都在尝试让自动指标更细，并通过人工偏好或人工评测验证对齐程度。但“与人类判断相关”不等于“可以替代每个项目的人工验收”。

更稳妥的分工是：

1. 自动指标用于大批量初筛、重复检查和模型级趋势；
2. 人工评审负责核心任务、叙事用途、严重度和可剪辑性；
3. 分歧样本单独复核，不用总分强行消除分歧；
4. 对外发布结论时，同时保留 Prompt、参数、样本数量和评审规则。

## 把方法放回这座网站

本站的[四十镜实验记录板](/experiments/forty-shots-one-character/#record-desk)目前只记录身份、动作、物理与镜头四项，因为那次实验的目标是观察同一角色在变量叠加时怎样漂移。它不是通用行业榜单，也不会预先填入任何模型分数。

真正开始测试后，每个样本应保存模型版本、结果文件、四项人工评分、失败标签和观察原句。对外写结论之前，至少报告完整样本数、关键失败数和未完成项。

> [!JING'S NOTE]
> 待荆确认：对创作最有价值的评测，不是给模型排一个永久名次，而是帮助下一轮决定——改 Prompt、换参考、降低动作复杂度、换模型，还是调整制作流程。

## 参考来源

- [VBench：视频生成模型综合评测基准（CVPR 2024 论文）](https://openaccess.thecvf.com/content/CVPR2024/papers/Huang_VBench_Comprehensive_Benchmark_Suite_for_Video_Generative_Models_CVPR_2024_paper.pdf)
- [VBench 官方代码仓库与 16 个评测维度](https://github.com/Vchitect/VBench)
- [EvalCrafter：大型视频生成模型评测框架（CVPR 2024）](https://openaccess.thecvf.com/content/CVPR2024/html/Liu_EvalCrafter_Benchmarking_and_Evaluating_Large_Video_Generation_Models_CVPR_2024_paper.html)
- [EvalCrafter 官方代码、Prompt 与人工反馈说明](https://github.com/evalcrafter/EvalCrafter)
- [VBench 2.0：面向内在可信度的视频生成评测](https://arxiv.org/abs/2503.21755)
- [T2V-CompBench：组合式文生视频评测基准（CVPR 2025）](https://openaccess.thecvf.com/content/CVPR2025/html/Sun_T2V-CompBench_A_Comprehensive_Benchmark_for_Compositional_Text-to-video_Generation_CVPR_2025_paper.html)

本文是 **资料文章**：来源事实已经核对，实用流程是本站的编辑转译。没有真实样本支持的模型排名、权重与经验判断，不会在这里被写成既定结论。
