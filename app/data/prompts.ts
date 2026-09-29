export type PromptCategory = '问清问题' | '学习' | '解决问题' | '决策' | '认识自己' | 'AI 视频制作';

export type PromptItem = {
  id: string;
  title: string;
  category: PromptCategory;
  description: string;
  prompt: string;
  variables: string[];
  tags: string[];
  model: string;
  usageNote: string;
  dateAdded: string;
  featured: boolean;
  demo: boolean;
  editorial?: boolean;
  sourceAdapted?: boolean;
  sourceHref?: string;
  sourceLabel?: string;
  relatedLinks?: Array<{ href: string; label: string }>;
};

export const promptSource = {
  title: '都 Agent 时代了，我还是想分享给你这 12 个我最常用的 Prompt',
  author: '数字生命卡兹克',
  url: 'https://mp.weixin.qq.com/s/NAdhdFrUq9-BKelqzqpwBQ',
  cardLinkLabel: '阅读原文合集 ↗',
  topicTitles: [
    '苏格拉底式提问', '双层解释法', '反向拆解', '横纵分析法', '事实核查',
    '专家会诊', '第一性原理', '跨领域借解', '双向钢人论证', '用最小实验替代空想',
    '挖掘隐藏天赋', '人生设计术',
  ],
  note: '前 12 个主题受这篇公开文章启发；本站现提供独立编写的简短任务卡，不展示原文 Prompt 全文，也不代表原作者认可这些改写。想使用作者版本，请直接阅读原文。后 10 条 AI 制作内容是本站编辑候选，待荆确认。',
};

const sourceAdaptedIntro = `【版本说明】这是 JING AI PLAYGROUND 依据“数字生命卡兹克”公开文章主题独立编写的短版任务卡，不是原作者的 Prompt 原文，也不代表作者认可本改写。原文：${promptSource.url}`;

export const promptItems: PromptItem[] = [
  {
    id: 'socratic-questioning',
    title: '苏格拉底式提问',
    category: '问清问题',
    description: '通过逐轮提问，把混乱的困惑收窄成真正值得回答的问题。',
    prompt: String.raw`${sourceAdaptedIntro}

我遇到的具体情境是：【具体情境】；我目前的解释是：【目前解释】；我希望改变的是：【希望改变】。

请先把这三部分分开呈现，指出其中最影响判断的一处空白，然后只问我一个能补上这处空白的问题。等我回答后再决定是否追问；不要预先列一串问题，也不要急着给建议。

当事实与目标已经足够清楚时，请用两句话收束：现在最值得处理的问题是什么；下一步还需要核实哪一项。不要把我的解释直接当事实。`,
    variables: ['具体情境', '目前解释', '希望改变'],
    tags: ['提问', '苏格拉底', '需求澄清'],
    model: '通用对话模型',
    usageNote: '适合问题还模糊的时候。先填一个真实情境，逐轮补信息；这张短卡是本站改写，不是原作者的完整版本。',
    dateAdded: '2026-08-24', featured: true, demo: false, sourceAdapted: true, sourceHref: promptSource.url, sourceLabel: promptSource.cardLinkLabel,
  },
  {
    id: 'two-layer-explanation',
    title: '双层解释法',
    category: '学习',
    description: '先用生活化方式建立直觉，再用专业术语补全机制、边界和误区。',
    prompt: String.raw`${sourceAdaptedIntro}

我想弄懂：【概念】。我已有的基础：【已有基础】。

请先用一个日常场景说明它解决什么问题，再画出一条更准确的机制链：输入是什么、经过什么变化、何时不适用。两种解释若只是比喻关系，请明确指出比喻失效的位置。

最后给我一个新的小情境，让我先预测结果；等我回答后再纠正，而不是直接公布答案。`,
    variables: ['概念', '已有基础'],
    tags: ['学习', '概念解释', '费曼学习'],
    model: '通用对话模型',
    usageNote: '先建立直觉，再用迁移题检查理解。比喻不是机制本身；这张短卡为本站改写。',
    dateAdded: '2026-08-24', featured: false, demo: false, sourceAdapted: true, sourceHref: promptSource.url, sourceLabel: promptSource.cardLinkLabel,
  },
  {
    id: 'reverse-engineering',
    title: '反向拆解',
    category: '学习',
    description: '从一个优秀成品倒推结构、关键选择、完成标准与可迁移规律。',
    prompt: String.raw`${sourceAdaptedIntro}

这里有一个我想研究的成品：【成品材料】。我想从中学到：【想学到的内容】。

请只依据我提供的材料，记录三个可观察选择：它让使用者先做什么、哪些信息被突出、哪些内容被有意省略。再为每个选择写一个可能的设计目的，并标明“观察”与“推测”的区别。

最后只挑一项适合我当前任务的小做法，写出如何在自己的材料上试一次，以及什么反馈会说明不适合照搬。看不到的制作过程不要猜。`,
    variables: ['成品材料', '想学到的内容'],
    tags: ['案例拆解', '模仿学习', '方法迁移'],
    model: '支持附件或网页的模型',
    usageNote: '需要成品材料；没有附件时先补材料。只迁移能解释用途的选择，不复制视觉表面。本站改写短版。',
    dateAdded: '2026-08-24', featured: false, demo: false, sourceAdapted: true, sourceHref: promptSource.url, sourceLabel: promptSource.cardLinkLabel,
  },
  {
    id: 'horizontal-vertical-research',
    title: '横纵分析法',
    category: '学习',
    description: '纵向追踪历史演化，横向比较同类差异，建立一个陌生领域的研究框架。',
    prompt: String.raw`${sourceAdaptedIntro}

研究对象：【研究对象】；我需要做出的判断：【待做判断】；截止日期：【截止日期】。

请用两张小表建立研究入口。第一张按时间列出最多五个转折，只保留能找到日期与出处的事实。第二张挑两到三个同类对象，先定义相同的比较维度，再填写差异。每一格附来源；找不到材料就留空。

最后说明：哪些历史选择可能解释今天的差异？哪些只是相关而非因果？我接下来最该核实的一条反例是什么？没有联网能力或可靠来源时，不要假装完成研究，先交检索计划。`,
    variables: ['研究对象', '待做判断', '截止日期'],
    tags: ['深度研究', '竞品分析', '时间线'],
    model: '支持联网与深度研究的模型',
    usageNote: '这是研究入口，不是自动生成的深度报告；需要实时来源和截止日期。本站改写短版。',
    dateAdded: '2026-08-24', featured: false, demo: false, sourceAdapted: true, sourceHref: promptSource.url, sourceLabel: promptSource.cardLinkLabel,
  },
  {
    id: 'fact-checking',
    title: '事实核查',
    category: '学习',
    description: '把说法拆成事实、推论和价值判断，再逐层检查证据与推理链。',
    prompt: String.raw`${sourceAdaptedIntro}

待核查的原话：【待核查原话】；它出现的时间与场景：【时间与场景】。

请把原话切成能够单独查证的小断言，并为每条记录：最早来源、来源日期、它实际支持的范围，以及目前的证据空白。随后画出“证据 → 推断 → 建议”的短链，指出哪一步跨得太远。

有检索条件时，优先查原始资料而非转述；没有检索条件时只列待查清单。结论使用“支持／部分支持／未能确认／与证据冲突”，不要用 AI 自己生成的引用充当证据。`,
    variables: ['待核查原话', '时间与场景'],
    tags: ['事实核查', '证据', '推理'],
    model: '支持联网搜索的模型',
    usageNote: '逐条核对原始来源与日期，引用须能支持对应断言。没有检索能力时只产出核查清单。本站改写短版。',
    dateAdded: '2026-08-24', featured: false, demo: false, sourceAdapted: true, sourceHref: promptSource.url, sourceLabel: promptSource.cardLinkLabel,
  },
  {
    id: 'expert-panel',
    title: '专家会诊',
    category: '解决问题',
    description: '让三个真正互补的专业视角独立判断、互相质疑，再综合出可执行方案。',
    prompt: String.raw`${sourceAdaptedIntro}

我要处理的事：【问题】；目标：【目标】；已知限制：【已知限制】。

请选三种关注点不同的工作视角，例如使用者、执行者、风险审查者。它们是分析角度，不是真实专家发言。每个视角各写一条建议、一个担忧和一个会改变其看法的新事实。

把三者放在同一张决策表中，先找相同前提，再指出真正冲突的假设。若关键事实缺失，只问我最重要的一项；信息足够时，给出一个可逆的首步以及停止条件。`,
    variables: ['问题', '目标', '已知限制'],
    tags: ['专家视角', '方案评审', '分歧'],
    model: '通用推理模型',
    usageNote: '分析视角不等于真实专家意见，重要决定仍需适当专业核对。本站改写短版。',
    dateAdded: '2026-08-24', featured: false, demo: false, sourceAdapted: true, sourceHref: promptSource.url, sourceLabel: promptSource.cardLinkLabel,
  },
  {
    id: 'first-principles',
    title: '第一性原理',
    category: '解决问题',
    description: '暂时放下行业惯例，把问题拆回事实、目标、假设和现实约束。',
    prompt: String.raw`${sourceAdaptedIntro}

当前方案：【当前方案】；它试图达成的效果：【目标效果】。

请先暂停讨论方案，把材料拆成三栏：有证据的约束、仍可测试的假设、真正要改善的结果。对每个“必须如此”的说法，问一次它来自法规、物理条件、预算，还是惯例。

只保留无法回避的限制，设计两个不同的小方案；分别指出最脆弱的前提，以及用什么低成本观察可以推翻它。不要把未经核对的常识写成基本事实。`,
    variables: ['当前方案', '目标效果'],
    tags: ['第一性原理', '系统重构', '基本假设'],
    model: '通用推理模型',
    usageNote: '适合反复修补仍不奏效的方案。先验明“不能改变”的部分到底是不是硬约束。本站改写短版。',
    dateAdded: '2026-08-24', featured: false, demo: false, sourceAdapted: true, sourceHref: promptSource.url, sourceLabel: promptSource.cardLinkLabel,
  },
  {
    id: 'cross-domain-analogy',
    title: '跨领域借解',
    category: '解决问题',
    description: '抽象问题的底层结构，再从不同领域寻找需要核实的相似机制。',
    prompt: String.raw`${sourceAdaptedIntro}

我的卡点：【卡点】；手头资源和不可碰的边界：【资源与边界】。

先把这个问题写成不含行业名词的一句关系描述，例如“有限资源如何分配给不确定的请求”。再找两个结构类似、但领域不同的真实机制。每个机制说明：它解决的关系是什么，必须具备哪些条件，我这里缺少哪些条件。

最后只移植一个最小部件，写出一周内可撤回的试法和失败信号。若案例无法核实，标为类比假设，不要包装成已验证范例。`,
    variables: ['卡点', '资源与边界'],
    tags: ['跨领域', '类比', '机制迁移'],
    model: '支持联网研究的模型',
    usageNote: '先核对约束与反馈结构是否相似，再尝试移植机制。案例未经核实就只当假设。本站改写短版。',
    dateAdded: '2026-08-24', featured: false, demo: false, sourceAdapted: true, sourceHref: promptSource.url, sourceLabel: promptSource.cardLinkLabel,
  },
  {
    id: 'two-way-steelmanning',
    title: '双向钢人论证',
    category: '决策',
    description: '把两个方向都论证到最强，再找出真正的分歧与最可能改变结论的变量。',
    prompt: String.raw`${sourceAdaptedIntro}

待选路线 A：【路线 A】；路线 B：【路线 B】；我最在乎的结果：【最在乎的结果】。

请先为两条路线分别写一份最公平的支持陈述，不能故意把另一边说弱。随后做一个“条件变化表”：预算、时间、风险承受度分别变化时，哪条路线会反超？

先找出最值得问我的一个缺失条件，等我回答后再给建议。建议要写明适用期限与复盘信号，不要把偏好伪装成客观事实。`,
    variables: ['路线 A', '路线 B', '最在乎的结果'],
    tags: ['决策', '钢人论证', '关键变量'],
    model: '通用推理模型',
    usageNote: '先比较路线成立的条件，再问一个可能改变选择的问题。本站改写短版。',
    dateAdded: '2026-08-24', featured: false, demo: false, sourceAdapted: true, sourceHref: promptSource.url, sourceLabel: promptSource.cardLinkLabel,
  },
  {
    id: 'minimum-experiment',
    title: '用最小实验替代空想',
    category: '决策',
    description: '把无法靠讨论解决的选择，转化为一个低成本、可逆、能产生新信息的实验。',
    prompt: String.raw`${sourceAdaptedIntro}

我正在犹豫：【犹豫的选择】；能承担的时间、费用和风险：【可承担的时间费用风险】。

请把争论里最重要的一句话改写成可观察的假设。为它设计一个不需要长期承诺的小试验：起点记录什么、期间只改变什么、到哪一天停止、出现什么信号就暂停。结果可能支持、反对或仍然不清楚，请分别写出下一步。

最后告诉我开始前必须收集的基线信息。不要把计划中的结果写成已经发生。`,
    variables: ['犹豫的选择', '可承担的时间费用风险'],
    tags: ['最小实验', '行动', '验证假设'],
    model: '通用推理模型',
    usageNote: '优先选择可撤回的试验，先记录基线，再看结果是否真的改变判断。本站改写短版。',
    dateAdded: '2026-08-24', featured: false, demo: false, sourceAdapted: true, sourceHref: promptSource.url, sourceLabel: promptSource.cardLinkLabel,
  },
  {
    id: 'hidden-talent',
    title: '挖掘隐藏天赋',
    category: '认识自己',
    description: '从主动投入、做得顺手与高消耗的经历中，寻找仍需验证的能力模式。',
    prompt: String.raw`${sourceAdaptedIntro}

我想从真实经历里寻找可重复使用的优势，不需要人格诊断。请一轮只问一个具体经历：一次我愿意主动投入、一次我做得顺手、一次我做得好却消耗很大。每次记录行动、环境和事后精力。

最后给出“可能的能力模式 / 支持它的经历 / 尚缺证据 / 一周内可验证的小练习”四栏。没有经历证据就不贴天赋标签；不要以模型代替心理或职业评估。`,
    variables: [],
    tags: ['天赋', '生涯探索', '能量审计'],
    model: '支持长对话的模型',
    usageNote: '本站改写短版。只把经历当作线索，不把模型推断当成天赋或职业诊断。',
    dateAdded: '2026-08-24', featured: false, demo: false, sourceAdapted: true, sourceHref: promptSource.url, sourceLabel: promptSource.cardLinkLabel,
  },
  {
    id: 'life-design',
    title: '人生设计术',
    category: '认识自己',
    description: '在真实约束内比较三个生活原型，再用本月的小行动验证方向。',
    prompt: String.raw`${sourceAdaptedIntro}

我想规划下一年，而非得到命定的人生答案。请先问我当前最想改变的一件事，以及时间、钱、照顾责任等现实边界。

基于我的回答，提出三个方向不同、都可认真考虑的生活原型。每个原型写出本月可试的一步、能学到什么、何时停止或调整。每次只问一个问题；我没有提供的价值观和经历不要替我编造。涉及情绪或健康时，只记录我自述的需求，不做诊断。`,
    variables: [],
    tags: ['人生设计', '生活原型', '原型行动'],
    model: '支持长对话的模型',
    usageNote: '本站改写短版。把三个方向当作试验方案，不把未来写成已经确定的结论。',
    dateAdded: '2026-08-24', featured: false, demo: false, sourceAdapted: true, sourceHref: promptSource.url, sourceLabel: promptSource.cardLinkLabel,
  },
  {
    id: 'video-character-anchor-brief',
    title: '角色锚点制作卡',
    category: 'AI 视频制作',
    description: '把人物身份、固定特征、允许变化和当前镜头任务整理成可复用角色锚点。',
    prompt: String.raw`【状态】本站编辑候选，待荆确认；以下是制作前的模板，不是已生成镜头的验收结果。

我要为一个 AI 视频角色建立可复用锚点。

角色资料：【姓名或代号、年龄感、脸型、五官、发型、体态】
固定服装与配饰：【颜色、材质、穿法、左右位置】
允许变化：【表情、姿势、景别、光线等】
禁止变化：【绝不能漂移的身份特征】
当前镜头：【场景、动作、景别、时长】
参考图说明：【正面、侧面、全身图分别提供什么证据；没有则写无】

请先指出资料中互相冲突、无法从参考图确认或描述过于主观的部分，不要自行补造。未提供参考图时，只整理我填写的文字资料，不要声称已经看见人物。
然后按以下顺序输出：
1. 80字以内的角色身份锚点，只写可见事实；
2. 当前镜头需要重复写入的固定特征；
3. 可以省略、交给参考图负责的内容；
4. 一条适合当前镜头的角色提示段；
5. 五项验收清单：脸、头发、配饰、服装、体态；
6. 最多三个需要在生成后检查的漂移风险；它们是预检假设，不是已发生的错误。

不要使用“漂亮、电影感、高质量”等无法验收的空词。没有证据的内容标记“待确认”。`,
    variables: ['角色资料', '固定服装与配饰', '允许变化', '禁止变化', '当前镜头', '参考图说明'],
    tags: ['AI VIDEO', '角色一致性', 'REFERENCE'],
    model: '支持图片输入的多模态模型',
    usageNote: '编辑候选 · 待荆确认。先整理锚点，再把固定特征用于相关镜头；未提供参考图时只处理文字输入，不把推测写成可见事实。',
    dateAdded: '2026-08-31', featured: false, demo: false, editorial: true,
    relatedLinks: [
      { href: '/notes/ai-video-character-consistency/', label: '阅读人物一致性方法 ↗' },
      { href: '/tools/character-anchor/', label: '打开角色锚点卡 ↗' },
    ],
  },
  {
    id: 'video-scene-anchor-brief',
    title: '场景锚点制作卡',
    category: 'AI 视频制作',
    description: '固定空间结构、道具坐标、材质、天气和光线来源，减少换机位后的场景重写。',
    prompt: String.raw`【状态】本站编辑候选，待荆确认；以下是生成前的模板，不是场景连续性已通过的证明。

我要为一组连续镜头建立场景锚点。

空间名称与用途：【填写】
平面关系：【门、窗、墙、通道和人物活动区的相对位置】
固定物件：【名称、位置、朝向、数量】
可移动道具及当前状态：【填写】
材质与主色：【填写】
光源世界坐标：【方向、高度、冷暖、是否可见】
天气与时间：【填写】
本组镜头机位：【逐镜列出摄影机位置与朝向】

请不要重写成氛围文案。请输出：
1. 场景中不可改变的世界事实；
2. 一份简洁的文字平面图；
3. 每个机位应该看到与不应该看到的物件；
4. 每镜都应复用的场景提示段；
5. 道具状态账本；
6. 换机位时最容易发生的五种连续性错误。

如果资料之间存在空间矛盾，先列出矛盾并停止补全。没有参考图或场景图时，只根据我填写的文字建立待核对的空间草案；看不到的画外空间标记“待确认”。`,
    variables: ['空间名称与用途', '平面关系', '固定物件', '可移动道具', '材质与主色', '光源坐标', '天气与时间', '机位'],
    tags: ['AI VIDEO', '场景一致性', 'CONTINUITY'],
    model: '通用推理或多模态模型',
    usageNote: '编辑候选 · 待荆确认。适合三镜以上的同场戏；空间草案需要用参考图和实际镜头复核，不能凭模板保证场景一致。',
    dateAdded: '2026-08-31', featured: false, demo: false, editorial: true,
    relatedLinks: [
      { href: '/notes/ai-video-scene-consistency/', label: '阅读场景一致性方法 ↗' },
      { href: '/tools/scene-anchor/', label: '打开场景锚点卡 ↗' },
    ],
  },
  {
    id: 'video-single-shot-motion',
    title: '单镜动作指令',
    category: 'AI 视频制作',
    description: '把一个镜头收束为清楚的起点、动作顺序、摄影机行为和结束状态。',
    prompt: String.raw`【状态】本站编辑候选，待荆确认；不是视频结果。

请把下面的镜头任务整理成一条待生成的 AI 视频提示，不增加剧情，也不要声称已经生成或通过验收。

时长：【秒数】
起点画面：【人物、道具和摄影机的初始状态】
主体动作：【按计划发生顺序填写】
结束画面：【最后一帧必须停在哪里】
摄影机：【固定、推、拉、摇、移、跟随；只选真正需要的】
环境变化：【没有则写无】
必须保持：【人物、道具、背景和光线锚点】
禁止发生：【多余动作、形变、切镜或新增元素】

请先检查动作数量是否适合当前时长。若超载，给出删减版和拆成两镜版。
若输入足以规划这一镜，请输出：
1. 一句核心镜头任务；
2. 按时间顺序写成的主体运动；
3. 独立的摄影机运动；
4. 精简后的生成提示；
5. 首帧、中点、尾帧三项待执行验收标准，实际观察栏留空；
6. 失败时优先删除的一个变量。

避免同时使用互相冲突的运镜，不要把情绪词当成可见动作。输入不足时先列待确认事实，不补造画面。`,
    variables: ['时长', '起点画面', '主体动作', '结束画面', '摄影机', '环境变化', '必须保持', '禁止发生'],
    tags: ['AI VIDEO', '动作', 'SHOT'],
    model: '通用推理模型',
    usageNote: '编辑候选 · 待荆确认。一镜只保留一个主要动作目标；生成前的验收点是计划，真实通过与否只能看视频样本。',
    dateAdded: '2026-08-31', featured: true, demo: false, editorial: true,
    relatedLinks: [
      { href: '/notes/ai-video-prompt-shot-facts/', label: '阅读镜头事实方法 ↗' },
      { href: '/tools/shot-prompt-builder/', label: '打开单镜组装器 ↗' },
    ],
  },
  {
    id: 'video-first-last-frame-bridge',
    title: '首尾帧过渡指令',
    category: 'AI 视频制作',
    description: '比较两张端点画面，只描述中间必须发生的变化和不能漂移的视觉事实。',
    prompt: String.raw`【状态】本站编辑候选，待荆确认；不是视频结果。

我会提供首帧和尾帧，请为首尾帧视频生成整理待测试的过渡指令。没有两张实际端点图时，先列所缺素材，不假装已比较画面。

镜头时长：【秒数】
首帧事实：【主体位置、姿势、视线、道具、摄影机】
尾帧事实：【只写与首帧相比发生变化的部分】
必须保持：【身份、服装、场景结构、光线方向、画幅】
动作路径：【如果已经确定则填写；没有写待设计】
摄影机运动：【填写或写固定】

请先比较两张图，列出：保持项、变化项、疑似冲突项。不要根据遮挡区域猜测结构。
然后输出：
1. 从首帧到尾帧的唯一主要动作；
2. 3到5个按顺序发生的动作节点；
3. 摄影机与主体各自的时间线；
4. 一条只描述运动和变化的精简提示；
5. 中间帧需要重点观察的形变、瞬移和动作回弹风险；这些是预检假设，不是已发生的问题；
6. 首帧、中间帧、尾帧验收表，实际结果栏留空。

如果端点存在明显冲突或按计划难以在当前时长内连接，请说明依据并建议增加时长、减少变化或拆镜；不要承诺模型一定能完成。`,
    variables: ['时长', '首帧事实', '尾帧事实', '必须保持', '动作路径', '摄影机运动'],
    tags: ['AI VIDEO', '首尾帧', 'MOTION'],
    model: '支持图片输入的多模态模型',
    usageNote: '编辑候选 · 待荆确认。必须提供两张真实端点图才能比较；中间动作和风险均属待测试计划，不能冒充生成结果。',
    dateAdded: '2026-08-31', featured: false, demo: false, editorial: true,
    relatedLinks: [
      { href: '/notes/first-last-frame-motion-prompt/', label: '阅读首尾帧方法 ↗' },
      { href: '/tools/shot-risk-checker/', label: '预检首尾帧风险 ↗' },
    ],
  },
  {
    id: 'video-sound-layer-brief',
    title: '单镜声音分层 Brief',
    category: 'AI 视频制作',
    description: '把对白、声音表演、环境底、动作音效和音乐分别放进时间线。',
    prompt: String.raw`【状态】本站编辑候选，待荆确认；不是已完成的音画验收。

请为下面的镜头制作待执行的声音分层 Brief，不生成不存在的画面或声音，也不要把计划时点写成实测同步结果。

镜头时长：【秒数】
画面动作时间线：【逐秒或按动作节点填写】
对白与说话人：【没有则写无】
空间环境：【室内外、空间大小、远近声源】
关键接触动作：【脚步、拿起、放下、开门等】
情绪目标：【观众此时需要感受到什么】
音乐策略：【无音乐、进入点、退出点或功能】

请拆成五条轨道：
1. 对白；
2. 呼吸、衣料与声音表演；
3. 环境底；
4. 动作与接触音效；
5. 音乐。

每条需要的轨道输出计划开始时间、计划结束时间、声音内容、远近与强弱；没有的轨道写“无”，不补造声音。最后补充：
1. 生成或剪辑后必须用真实画面核对的同步点；
2. 应该刻意留白的位置；
3. 最容易堆得太满的轨道；
4. 一份不超过8项的声音验收清单。

不要用音乐替代缺失的关键动作音，也不要默认每条轨道都必须有声音。没有实际音视频时，验收结果栏保持空白。`,
    variables: ['镜头时长', '画面动作时间线', '对白', '空间环境', '关键接触动作', '情绪目标', '音乐策略'],
    tags: ['AI VIDEO', '声音', 'SOUND DESIGN'],
    model: '通用推理模型',
    usageNote: '编辑候选 · 待荆确认。先规划接触音，再补环境和音乐；无声也是选择。时间线是制作计划，不能当作已完成混音或同步验收。',
    dateAdded: '2026-08-31', featured: false, demo: false, editorial: true,
    relatedLinks: [
      { href: '/notes/ai-video-sound-workflow/', label: '阅读声音分工方法 ↗' },
      { href: '/tools/sound-layer-card/', label: '打开声音分层卡 ↗' },
    ],
  },
  {
    id: 'video-failure-revision',
    title: '失败镜头返修诊断',
    category: 'AI 视频制作',
    description: '从目标、原 Prompt 和实际失败帧出发，一次只修改最可能影响结果的变量。',
    prompt: String.raw`【状态】本站编辑候选，待荆确认；不是已有失败案例的诊断结果。

我要诊断一次 AI 视频生成失败。请只根据我提供的目标、原提示和真实样本观察做证据化判断；没有视频、关键帧或可靠观察记录时只返回待填写的诊断表，不虚构故障。

镜头目标：【填写】
原始 Prompt：【完整粘贴】
参考素材：【说明每张图负责锁定什么】
生成设置：【模型、版本、模式、时长、画幅、种子等】
失败发生时间：【例如 2.4 秒开始】
可见失败：【只写实际看到的现象】
仍然可用的区间：【没有则写无】

请按身份漂移、动作顺序、物理接触、场景连续性、摄影机冲突、声音同步、输入冲突七类检查。
输出：
1. 已确认现象与尚未确认推断；
2. 与可见证据相符的原因假设及其置信边界；证据不足时不强行凑主因或次因；
3. 原 Prompt 中可能产生歧义或过载的部分；
4. 下一轮只改变一个变量的最小实验；
5. 精简后的返修 Prompt；
6. 保持不变的设置；
7. 新样本的通过与失败标准。

不要声称知道模型内部原因，不要把相关性写成已证实因果。证据不足时明确写“无法从当前样本判断”；返修 Prompt 与通过标准都是下一轮待测试内容。`,
    variables: ['镜头目标', '原始 Prompt', '参考素材', '生成设置', '失败时间', '可见失败', '可用区间'],
    tags: ['AI VIDEO', '返修', 'DIAGNOSIS'],
    model: '支持视频或关键帧输入的多模态模型',
    usageNote: '编辑候选 · 待荆确认。最好附失败前、中、后三张真实关键帧；没有样本就只生成空表。原因是复测假设，下一轮只改一个主要变量。',
    dateAdded: '2026-08-31', featured: true, demo: false, editorial: true,
    relatedLinks: [
      { href: '/notes/video-failure-cases/', label: '阅读失败排查词典 ↗' },
    ],
  },
  {
    id: 'video-cut-continuity-handoff',
    title: '相邻镜头交接检查',
    category: 'AI 视频制作',
    description: '把镜头 A 的出口和镜头 B 的入口并排核对，提前发现方向、动作与声音跳变。',
    prompt: String.raw`【状态】本站编辑候选，待荆确认；不是已完成的剪辑验收。

请检查两个相邻镜头能否连续剪接。只有文字描述、没有真实尾帧与首帧时，只做待核对的交接计划，不声称已经看过画面或声音。

镜头 A 尾部：【最后1秒的人物位置、朝向、视线、动作、道具、光线和声音】
镜头 B 开头：【最初1秒的同类信息】
剪辑意图：【连续动作、跳切、时间省略、视角转换等】
必须保留的事实：【填写】
允许改变的内容：【填写】

请制作交接表，逐项比较：
1. 人物身份与服装；
2. 屏幕方向与视线；
3. 动作相位与承重点；
4. 道具位置与状态；
5. 场景结构与光线方向；
6. 环境音、对白尾音和音乐；
7. 景别与轴线变化。

每项标记为：实测可直接剪、实测需要过渡、实测明显冲突、资料不足。前三项必须引用真实镜头、关键帧或可靠观察记录；只有计划描述时统一标记“资料不足／待实测”。
最后输出基于现有证据的最小修复建议：优先核对切点，其次考虑修改镜头 B 的入口，最后才建议重做整镜。不要把有意跳切误判为错误。`,
    variables: ['镜头 A 尾部', '镜头 B 开头', '剪辑意图', '必须保留的事实', '允许改变的内容'],
    tags: ['AI VIDEO', '剪辑', 'CONTINUITY'],
    model: '支持视频或关键帧输入的多模态模型',
    usageNote: '编辑候选 · 待荆确认。只比较切点附近；若未提供真实尾帧、首帧或观察记录，只能做交接计划，不能断言剪辑已通过。',
    dateAdded: '2026-08-31', featured: false, demo: false, editorial: true,
    relatedLinks: [
      { href: '/notes/ai-video-shot-continuity/', label: '阅读跨镜连续性方法 ↗' },
      { href: '/tools/continuity-checker/', label: '打开连续性检查器 ↗' },
    ],
  },
  {
    id: 'video-candidate-review-table',
    title: '候选样本验收表',
    category: 'AI 视频制作',
    description: '用统一标准记录多个候选的可用区间、失败证据和剪辑采用方式。',
    prompt: String.raw`【状态】本站编辑候选，待荆确认；不是已完成的候选评测。

请把一组 AI 视频候选整理成可追溯的验收记录。未提供真实样本时只生成空表；只有转述观察而没有可核对素材时，要标注“观察待复核”。

镜头任务与完成标准：【填写】
候选列表：【逐条填写候选 ID、版本、时长和设置】
观察记录：【逐条填写可见现象；可附视频或关键帧】
项目硬性要求：【人物、动作、道具、场景、声音、技术规格】

请不要只选“最好看”的一条。只有能核对真实样本时，才为每个候选填写：
1. 结论：采用、局部采用、备选、淘汰；
2. 可用时间区间；
3. 通过项及对应证据；
4. 失败项、首次出现时间及严重程度；
5. 是否能通过剪辑、裁切、变速、遮挡或声音修复；
6. 采用时需要保留的备注。

最后给出：
1. 首选候选与原因；
2. 如果首选失效时的替补；
3. 下一轮是否值得继续生成；
4. 若继续生成，只改变哪一个变量；
5. 一张可以复制进制作记录的 Markdown 表格。

没有看到样本时只生成空白记录模板，不替用户填写结果；不能从候选 ID、文件名或计划 Prompt 推断通过项、失败时间或首选候选。`,
    variables: ['镜头任务与标准', '候选列表', '观察记录', '项目硬性要求'],
    tags: ['AI VIDEO', '评测', 'VERSION LOG'],
    model: '支持视频输入的多模态模型',
    usageNote: '编辑候选 · 待荆确认。候选 ID 和设置要留档；没有真实样本只生成空表，仅有文字转述时标“待复核”，不让模型代填评测结果。',
    dateAdded: '2026-08-31', featured: false, demo: false, editorial: true,
    relatedLinks: [
      { href: '/notes/ai-video-generation-version-log/', label: '阅读版本留档方法 ↗' },
      { href: '/tools/shot-version-recorder/', label: '打开版本记录器 ↗' },
    ],
  },
  {
    id: 'video-causal-motion-gate',
    title: '因果动作闸门',
    category: 'AI 视频制作',
    description: '先让动作 A 完成并锁定，再允许动作 B 沿唯一方向变化，把“随后”写成可以逐帧验收的时序协议。',
    prompt: String.raw`【状态】本站编辑候选，待荆确认；以下只生成待测试协议，不代表已有视频结果。

请把下面的双阶段镜头整理成一份可测试的因果动作协议。不要生成或虚构实验结果。

镜头名称：【填写】
时长与帧率：【例如 6 秒、24 fps】
人物与道具：【身份、手位、数量与接触关系】
摄影机：【机位、景别、焦段、构图与是否允许运镜】

动作 A 起点：【0% 时可以直接看见的状态】
动作 A 锁定状态：【完成后必须保持的状态】
动作 A 锁定时刻：【占镜头百分比】

动作 B 起点：【启动前必须保持的状态与画面坐标】
动作 B 唯一方向：【从哪里连续移动到哪里】
动作 B 终点：【100% 时可以验收的状态】
动作 B 首动时刻：【必须严格晚于动作 A 锁定时刻】

环境常量：【背景结构、材质、光线与不得移动的物体】

先检查因果闸门：
1. 如果动作 B 首动不晚于动作 A 锁定，立即停止并标记“不可测试”，不要生成一份顺序矛盾的 Prompt；
2. 如果两者间隔短到无法看见稳定状态，标记“间隔待确认”；
3. 不要根据语义替我补写画面中不存在的事实。

检查通过后，按以下顺序输出：
1. 五点动作账本：列出 0 / 25 / 50 / 75 / 100% 的时间、计划帧号、动作 A 状态和动作 B 状态；
2. 完整视频 Prompt：明确写出 A 变化、A 锁定、可见停顿、B 单向变化和最终状态；
3. 负面约束：排除同时动作、顺序倒置、动作回弹、路径分叉、身份或道具复制、隐性切镜与环境漂移；
4. 逐帧验收清单：保留“实际 A 锁定帧”“实际 B 首动帧”和五点位置的空白记录栏；
5. 失败标签：至少包括 EARLY_START、SIMULTANEOUS、ORDER_REVERSED、ACTION_DRIFT、PATH_REVERSE、WORLD_DRIFT、HIDDEN_CUT。

所有计划帧号只能作为生成前参考。结尾必须写：
“STATUS: 待测试 Prompt，不代表已经生成或通过；结论只填写真实视频观察。”`,
    variables: ['镜头名称', '时长与帧率', '人物与道具', '摄影机', '动作 A 起点', '动作 A 锁定状态', '动作 A 锁定时刻', '动作 B 起点', '动作 B 唯一方向', '动作 B 终点', '动作 B 首动时刻', '环境常量'],
    tags: ['AI VIDEO', '因果顺序', '动作闸门', '逐帧验收'],
    model: '通用推理模型',
    usageNote: '编辑候选 · 待荆确认。适合“先完成一件事，随后第二件事再变化”的单镜任务；先核对时序再交给视频模型。没有真实视频时只生成空白验收表。',
    dateAdded: '2026-09-01', featured: false, demo: false, editorial: true,
    relatedLinks: [
      { href: '/notes/causal-motion-five-point-ledger/', label: '阅读五点账本方法 ↗' },
      { href: '/tools/waterline-motion-card/', label: '打开水线动作卡 ↗' },
      { href: '/experiments/can-water-recede-after-the-umbrella-opens/', label: '查看 EXP.010 ↗' },
    ],
  },
  {
    id: 'poster-to-story-short-ledger',
    title: '海报反推故事 · 短证据账本',
    category: 'AI 视频制作',
    description: '先用短账本分清看见、推测和主动设定，再生成不重复账本的故事梗概。',
    prompt: String.raw`【状态】本站编辑候选，待荆确认；生成的是故事文本，不是视频成果。

请根据我提供的一张无片名海报，反推一个可继续开发的故事。没有实际海报图时先索取图片，不编造可见证据。不要联网搜索，不要猜测它属于某部真实作品，也不要把创作设定写成画面事实。

输入海报：【上传图片】
故事类型或限制：【可选；没有则写无】
不希望出现的套路：【可选；没有则写无】

先建立一份短证据账本：

E｜可见证据
- 最多 6 条，只写能从画面直接指出的主体、环境、异常、空间关系、光线和关键道具。
- 每条编号为 E1、E2……；看不清的内容写“无法确认”，不要补全。

I｜合理推测
- 最多 3 条，每条必须使用“可能”或“也许”，并标注它依据的证据编号。
- 推测不能自动变成故事事实。

C｜主动创作选择
- 最多 3 条，明确写出作者为了建立世界规则、冲突或选择而新增的设定。
- 每条说明它使用了哪些证据；不能只套用与海报无关的类型套路。

完成账本后，输出：
1. 故事标题；
2. 主人公；
3. 世界规则；
4. 核心冲突；
5. 一次不可逆选择；
6. 150—250 字故事梗概。

写作要求：
- 故事至少使用 3 条可见证据，并让它们参与因果，而不只是装饰；
- 主人公身份、过去、异常原因和世界规则若无法从画面确认，必须来自 C 栏；
- 世界规则必须制造限制，限制必须迫使主人公做选择；
- 梗概直接讲故事，不要再次抄写 E／I／C 账本；
- 删除这张海报后，如果故事几乎不变，请重写。

最后只用 4 行自检：
- 使用了哪些 E 编号；
- 哪一项仍只是推测；
- 最大的一项主动设定；
- 故事最可能落入的套路。`,
    variables: ['输入海报', '故事类型或限制', '不希望出现的套路'],
    tags: ['STORY', '海报反推', '证据边界', '创意开发'],
    model: '支持图片输入的多模态模型',
    usageNote: '编辑候选 · 待荆确认。依据 EXP.008 九份文本 Pilot 整理；EXP.009 的九份同会话候选也保持来源分层，但不证明跨会话稳定或视频效果。没有海报图时不要编造证据。',
    dateAdded: '2026-08-31', featured: false, demo: false, editorial: true,
    sourceHref: '/experiments/can-a-fictional-poster-grow-a-story/',
    sourceLabel: '查看 9 / 9 实验依据 ↗',
    relatedLinks: [
      { href: '/notes/poster-to-story-evidence-ledger/', label: '阅读证据账本方法 ↗' },
      { href: '/tools/poster-story-builder/', label: '打开故事组装器 ↗' },
    ],
  },
];

export const promptFilters: Array<'全部' | PromptCategory> = ['全部', 'AI 视频制作', '问清问题', '学习', '解决问题', '决策', '认识自己'];
