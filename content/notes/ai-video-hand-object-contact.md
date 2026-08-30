---
title: "手为什么总是穿过杯子：AI 视频接触动作拆分"
slug: "ai-video-hand-object-contact"
category: "AI TIPS"
issue: "016"
date: "2026-08-30"
description: "把拿、放、推、递等人物与道具互动拆成接近、接触、承重、移动和释放，再用五点检查判断手、物体与因果是否连续。"
cover: "tips-coral"
featured: true
tags: ["AI VIDEO", "HAND", "OBJECT", "PHYSICS"]
readingTime: "16 分钟"
demo: false
editorialStatus: "source-backed"
sourceTitle: "Runway Image to Video / Google Veo Prompt Guide / T2V-CompBench / TASTE-Rob / PhyGenBench"
sourceUrl: "https://help.runwayml.com/hc/en-us/articles/48324313115155-Image-to-Video-Prompting-Guide"
sourceNote: "产品提示方式依据 Runway 与 Google Cloud 官方文档；动作绑定、物体互动、抓握姿态和物理可信度的研究背景依据 CVPR 论文与官方项目。五状态接触账本、失败标签和九格测试是本站编辑方法，不代表任何消费级模型已经通过测试。"
relatedNotes: ["first-last-frame-motion-prompt", "video-failure-cases", "ai-video-shot-continuity"]
connections:
  - label: "TOOL"
    title: "接触动作拆分卡"
    description: "填写手、道具、接触点和承重点，生成五阶段 Prompt、九格矩阵与验收表。"
    href: "/tools/contact-action-card/"
    tone: "coral"
  - label: "EXPERIMENT"
    title: "一只手能否稳定拿起同一个杯子？"
    description: "九格空白协议比较普通动作句、五状态顺序与端点证据，等待真实输出。"
    href: "/experiments/can-one-hand-lift-the-same-cup/"
    tone: "yellow"
  - label: "TOOL"
    title: "AI 视频镜头风险预检器"
    description: "先检查动作数量、时长和首尾差异，决定一镜完成还是拆成两镜。"
    href: "/tools/shot-risk-checker/"
    tone: "mint"
---

她把手伸向桌上的杯子，握住杯柄，拿起来喝一口，再把杯子放回原位。

这在剧本里只是一句话，在视频里却不是一个动作。手要经过杯子，手指要绕过杯柄，接触建立后杯子才应该离开桌面；放回时桌面先重新承重，手指才能松开。如果其中一个状态缺失，就会出现穿模、滑动、悬浮、杯子变形，或者“手还没碰到，杯子已经自己飞起来”。

> [!KEY POINT]
> 接触动作不是“手＋杯子一起动”，而是手、物体和承重点在时间里依次改变关系。先把关系拆开，再讨论 Prompt。

## 先把一个动词拆成五个状态

“拿起”至少包含五个可以逐帧观察的状态：

| 状态 | 手 | 物体 | 接触与受力 |
| --- | --- | --- | --- |
| 01 接近 | 沿清楚路径靠近 | 留在原位 | 尚未接触，桌面承重 |
| 02 预接触 | 手指对准可抓位置 | 不应提前移动 | 两者间距逐渐缩小 |
| 03 闭合 | 手指围绕杯柄或杯身 | 仍在桌面上 | 接触点建立，遮挡关系改变 |
| 04 承重移动 | 手腕与前臂共同抬升 | 与手同步离开桌面 | 重量从桌面转移到手 |
| 05 结束状态 | 抓握稳定或开始释放 | 停在明确终点 | 新承重点成立，不再漂移 |

这里的五个状态是制作账本，不是某个平台的特殊语法。它的作用是让失败变得可定位：问题发生在靠近路径、接触建立、重量转移，还是结束落位。

## 官方说明了什么，又没有保证什么

[Runway 的 Image to Video Prompting Guide](https://help.runwayml.com/hc/en-us/articles/48324313115155-Image-to-Video-Prompting-Guide)把输入图视为视频的第一帧，建议文字集中描述主体动作、环境运动、摄影机运动、方向、速度与时间进展。指南也专门指出，当两个或更多画面元素发生互动时，可以补充必要的视觉描述；复杂顺序则可以用顺序词或粗略时间戳组织。

[Google Cloud 的 Veo Prompt Guide](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/video/video-gen-prompt-guide)把动作和互动列为 Prompt 的独立组成部分，并提醒较长过程需要与片段时长相匹配。

这些说明支持两件事：动作对象要明确，时间顺序要清楚。但它们没有保证“只要写了拿起，手指、物体、遮挡和重量就一定同时正确”。

[T2V-CompBench](https://openaccess.thecvf.com/content/CVPR2025/html/Sun_T2V-CompBench_A_Comprehensive_Benchmark_for_Compositional_Text-to-video_Generation_CVPR_2025_paper.html)把动作绑定和物体互动分成独立评测类别。也就是说，“画面里发生了某个动作”和“正确对象以正确关系完成动作”不能混为一个分数。

[TASTE-Rob](https://openaccess.thecvf.com/content/CVPR2025/html/Zhao_TASTE-Rob_Advancing_Video_Generation_of_Task-Oriented_Hand-Object_Interaction_for_Generalizable_CVPR_2025_paper.html)研究的是面向机器人操作的专门数据与生成方法，不能直接代表普通创作平台；但论文仍报告了偶发的抓握姿态不一致，并专门加入姿态修正流程。这至少说明，精确手物互动本身就是一个需要专门处理的问题。

## 四条轨道，不要写成一团

一条接触镜头至少有四个参与者：

| 轨道 | 负责什么 | 需要固定什么 |
| --- | --- | --- |
| `HAND` | 手腕、手掌与手指怎样靠近、闭合、移动 | 哪只手、抓哪里、手背朝向、允许的手指变化 |
| `OBJECT` | 物体何时保持、何时移动、最后停在哪里 | 形状、数量、朝向、尺度、材质和初始位置 |
| `CONTACT` | 接触点、遮挡和承重怎样改变 | 碰到前不动，握住后同步，放下后再释放 |
| `CAMERA` | 观众是否看得见关键关系 | 景别、机位、运镜、焦点和镜头时长 |

如果失败时只写“手崩了”，下一轮不知道该换首帧、换角度、缩短动作，还是把拿起和放下拆成两镜。四轨分开以后，记录可以写成：

```text
HAND：右手从桌边靠近杯柄，拇指在外侧，四指在内侧闭合。
OBJECT：白色陶瓷杯在接触建立前固定在桌面，数量与形状不变。
CONTACT：手指闭合后杯子才离开桌面，并与手腕同速上移。
CAMERA：固定近景，杯柄、指尖和桌面接触面始终可见。
```

这是一段**待测试的控制结构**，不是成功案例。真实模型是否执行，仍要看完整视频。

## 首帧先为接触留出空间

接触动作的首帧不是商品海报。它必须允许下一步真实发生。

### 手与物体不要已经粘在一起

如果第一帧里指尖被杯柄遮住、手掌与杯身融成一块，模型从起点就缺少“接触前”的证据。让手与物体保留一段清楚间距，关键手指、杯柄和桌面接触面尽量可见。

### 抓握目标要足够大

远景里的细小杯柄需要同时解决手指结构、精确对位和物体保持。可以先换成近景、较大的物体或更简单的抓握面，确认基础接触后再恢复原镜头。

### 避免错误运动暗示

首帧里已经倾斜的杯子、模糊的手和飞溅液体，会暗示动作正在发生。Runway 的官方指南提醒，输入图中的视觉瑕疵或运动线索可能进入视频并被放大。基础测试应从干净、稳定、尚未接触的状态开始。

## 先做三个小任务

### 任务一：指尖碰到杯壁

只检查接近路径和接触时点。杯子不移动，手指碰到以后停住。它不要求抓握、承重或放下，是最小基线。

### 任务二：握住并抬高几厘米

检查手指闭合、重量转移与同步运动。杯子只抬离桌面很短距离，不喝水、不转身、不改变摄影机。

### 任务三：放下再松手

先让杯底稳定接触桌面，再让手指张开并离开。它重点检查因果顺序：物体不能在落稳前失去支撑，手也不能松开后继续把杯子带走。

三个任务依次增加“接触”“承重”“释放”。不要第一次就测试完整的拿杯、喝水、回头、说话和放杯。

## 一张五点接触账本

以五秒“握住并抬高几厘米”为例：

| 时间点 | `HAND` | `OBJECT` | `CONTACT` |
| --- | --- | --- | --- |
| 0% | 手在杯子右侧，尚未触碰 | 杯底完整落在桌面 | 无接触，桌面承重 |
| 25% | 手指接近杯柄两侧 | 位置和角度不变 | 间距缩小，不提前移动 |
| 50% | 拇指与四指闭合 | 仍在桌面 | 抓握建立，遮挡合理 |
| 75% | 手腕向上移动 | 杯子同步抬升 | 手承担重量，杯底离桌 |
| 100% | 手腕停住，抓握保持 | 停在目标高度 | 接触点稳定，不滑动 |

时间百分比不需要变成精确到帧的表演命令。它首先是一张验收地图：在五个位置分别截帧，就能判断错误最早从哪里开始。

## Prompt 只写最小可观察链条

```prompt
Locked close shot. Her right hand slowly approaches the ceramic mug handle.

The mug remains completely still on the table until her fingers close around the handle. Only after the grip is established, she lifts the mug a few centimeters in one smooth motion.

The mug keeps the same shape and orientation. Her hand and the mug stop together at the end of the shot.
```

这段模板刻意省略表情、对白、饮水、转身、液体晃动和摄影机移动。它只保留四个可验收节点：手靠近、杯子先保持、抓握后抬升、两者一起停住。

如果平台支持时间戳，可以再写成更短的顺序；如果不支持，也可以保留 `until`、`only after`、`then` 等时间关系。重点不是语法看起来专业，而是每句话都对应一个能从画面检查的状态。

## 首尾帧怎样参与

首尾帧适合固定接触动作的起点和结果，但不能替代中间过程。

### 只用首帧

适合先测试“手靠近并碰到物体”。结束位置允许有少量自由，重点是观察接触前物体是否保持不动。

### 首帧加尾帧

适合终点必须准确衔接下一镜，例如杯子最后停在嘴边、钥匙最终插入锁孔，或者物体必须放回特定位置。两张图要先保证手、物体、数量、朝向、光线和机位一致。

### 仍然需要中间验收

首帧里手未接触，尾帧里杯子已经被拿起，中间仍要生成手指闭合、遮挡变化和重量转移。端点正确但过程穿模，仍然不能算可用镜头。

## 机位要让问题有证据

“电影感角度”不一定是好测试角度。接触基线应该优先让三件事同时可见：

1. 手与物体的初始间距；
2. 第一个真实接触点；
3. 物体原本的承重点。

正侧方或三分之二角度通常比完全正面更容易看到间距；固定近景比快速环绕更容易判断穿模；适度景深比只剩一条模糊轮廓更便于检查。这里不是规定最终成片必须这样拍，而是先让实验具有证据。

## 六个失败标签

| 标签 | 画面里发生什么 | 下一轮优先改变什么 |
| --- | --- | --- |
| `CONTACT_MISS` | 手还没碰到，物体已经移动 | 延长接近阶段，明确接触前保持 |
| `HAND_MELT` | 手指融合、增殖或穿过物体 | 放大抓握区域，降低手指复杂度 |
| `GRIP_SLIDE` | 接触点沿物体表面无因滑动 | 缩短移动距离，固定单一抓握点 |
| `OBJECT_MUTATE` | 遮挡后物体形状、数量或材质改变 | 简化物体，减少遮挡与旋转 |
| `WEIGHTLESS_PROP` | 物体悬浮、提前飞起或缺少承重点 | 把接触、承重和移动拆开 |
| `RELEASE_ERROR` | 物体未落稳手就松开，或松开后仍被带动 | 单独测试放下与释放顺序 |

标签只记录可见现象，不自动证明原因。下一轮应保持模型、版本、参考图、时长和其他条件不变，只改变一项制作变量。

## 九格测试怎样安排

选择三个固定任务，对比三种输入条件：

| 条件 | A：触碰 | B：抬起 | C：放下 |
| --- | --- | --- | --- |
| 普通动作句 | “手碰到杯子” | “手拿起杯子” | “手放下杯子” |
| 五状态顺序 | 接近→接触→停住 | 接近→闭合→承重→抬升 | 下落→落稳→释放→离开 |
| 五状态＋端点 | 首帧固定间距 | 首尾帧固定起点和抬升终点 | 首尾帧固定持握和落桌终点 |

九格使用同一只手、同一个杯子、同一机位、同一光线、同一时长和同一输出数量。执行前全部标记“待执行”，不要预写成功率。

## 物理正确不能只看像不像

[PhyGenBench](https://phygenbench123.github.io/)用多个物理领域与物理规律检查生成视频的常识可信度，并把关键现象定位到相关帧再提问。它讨论的范围远大于拿杯子，但方法上的启发很直接：物理问题需要在事件真正发生的时间段检查，不能只凭整条视频的氛围判断。

接触镜头至少要问：

- 杯子何时开始移动，那个时点手是否已经建立接触；
- 杯底离开桌面后，新的承重点在哪里；
- 手腕移动时，杯子的速度和方向是否有合理关系；
- 放下以后，杯底是否稳定，手是否按顺序释放；
- 遮挡前后，手与物体是否还是同一只手和同一个物体。

这比“看起来挺顺”更接近可复测的验收。

## 什么时候拆镜或转后期

如果基础接触能够成立，但“拿起＋喝水＋放回”持续失败，可以拆成：

```text
镜头 A：手靠近并建立抓握
镜头 B：已经握住杯子的状态开始，只完成抬升
镜头 C：杯子已经靠近嘴边，只完成轻微倾斜
镜头 D：杯子接近桌面，只完成落稳与释放
```

相邻镜头通过共享状态连接，而不是让一个短片段发明全部中间姿态。重要商品、精确手部或必须交付的镜头，还可以使用实拍手部、局部遮罩、定格替换或合成。需要记录额外工时，不能把后期修正冒充成模型一次生成成功。

> [!TIP]
> 如果同一种接触错误连续出现两轮，先缩小任务或换机位。不要只在同一段 Prompt 后面继续增加否定词。

## 生成前最后检查

- 首帧是否清楚显示手、物体和初始间距；
- 抓握区域是否足够大且没有预先融合；
- 是否只保留一个主要接触动作；
- 手、物体、接触和摄影机是否分别有规则；
- 接触建立前，物体是否应该保持不动；
- 承重点何时从桌面转移到手；
- 结束状态是否需要尾帧锁定；
- 是否能在五个时间点分别验收；
- 是否定义了拆镜或转后期的条件；
- 是否准备记录真实版本、参数和失败样本。

手碰到杯子之前，杯子不应该知道它要移动。先把接触与承重的顺序写清楚，再让生成结果回答：这条因果链究竟有没有成立。

## 参考来源

- [Runway：Image to Video Prompting Guide](https://help.runwayml.com/hc/en-us/articles/48324313115155-Image-to-Video-Prompting-Guide)
- [Google Cloud：Veo 视频生成 Prompt 指南](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/video/video-gen-prompt-guide)
- [T2V-CompBench：动作绑定与物体互动评测（CVPR 2025）](https://openaccess.thecvf.com/content/CVPR2025/html/Sun_T2V-CompBench_A_Comprehensive_Benchmark_for_Compositional_Text-to-video_Generation_CVPR_2025_paper.html)
- [TASTE-Rob：面向任务的手物互动视频生成（CVPR 2025）](https://openaccess.thecvf.com/content/CVPR2025/html/Zhao_TASTE-Rob_Advancing_Video_Generation_of_Task-Oriented_Hand-Object_Interaction_for_Generalizable_CVPR_2025_paper.html)
- [PhyGenBench：视频生成物理常识评测](https://phygenbench123.github.io/)

本文是**资料方法文章**。文中的拆分、模板、标签和测试矩阵是待真实执行的制作方法，不是某个模型的实测结论。
