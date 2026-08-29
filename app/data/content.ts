export type Story = {
  id: string;
  slug?: string;
  title: string;
  englishTitle: string;
  description: string;
  type: string;
  date: string;
  duration: string;
  status: string;
  stage: 'documented' | 'concept';
  visual: string;
};

export type Experiment = {
  id: string;
  slug?: string;
  title: string;
  description: string;
  category: string;
  date: string;
  status: string;
  stage: 'documented' | 'concept';
  visual: string;
};

export type Tool = {
  id: string;
  title: string;
  description: string;
  label: string;
  status: string;
  symbol: string;
  href?: string;
};

export const stories: Story[] = [
  {
    id: 'story-001',
    slug: 'she-forgets-yesterday',
    title: '她每天醒来都会忘记昨天',
    englishTitle: 'She Forgets Yesterday',
    description: '一个关于记忆、遗忘和重复告别的短片。她每天醒来，桌上都会多一封自己写给自己的信。',
    type: 'AI Short Film',
    date: '2026.08',
    duration: '01:30',
    status: 'AI 共创草案 · 有详情记录',
    stage: 'documented',
    visual: 'memory',
  },
  {
    id: 'story-002',
    title: '第七码头没有船',
    englishTitle: 'No Boat at Pier Seven',
    description: '深夜值班员收到一张来自十年后的船票。一个雾、旧广播与错过的人的故事。',
    type: 'AI Comic Series',
    date: '未排期',
    duration: '系列设想',
    status: '概念候选 · 未进入制作',
    stage: 'concept',
    visual: 'pier',
  },
  {
    id: 'story-003',
    title: '雨停以前',
    englishTitle: 'Before the Rain Ends',
    description: '如果一场雨只落在一个人头顶，她要走多远，才能把它留在身后？',
    type: 'Visual Poem',
    date: '未排期',
    duration: '短片设想',
    status: '概念候选 · 未进入制作',
    stage: 'concept',
    visual: 'rain',
  },
];

export const experiments: Experiment[] = [
  {
    id: 'experiment-001',
    slug: 'forty-shots-one-character',
    title: '同一个她，四十个镜头',
    description: '跨景别、光线、情绪和动作测试角色一致性。现有一张四格静态 Pilot 样本板；正式四十镜视频测试尚未开始。',
    category: 'Character Study',
    date: '2026.08.18',
    status: 'PILOT 4 格 · 非模型结论',
    stage: 'documented',
    visual: 'faces',
  },
  {
    id: 'experiment-002',
    title: '一句话，四种视频模型',
    description: '待验证问题：同一条分镜提示词，在不同模型里会长出怎样不同的运动与镜头语言？目前没有样本或比较结果。',
    category: 'Model Test',
    date: '未执行',
    status: '实验设想 · 无样本',
    stage: 'concept',
    visual: 'frames',
  },
  {
    id: 'experiment-003',
    title: '让 AI 先画一张不会发生的海报',
    description: '待验证玩法：从一张虚构电影海报反向生长出角色、场景与故事梗概。目前只保留概念卡。',
    category: 'Prompt Play',
    date: '未执行',
    status: '概念设想 · 无结果',
    stage: 'concept',
    visual: 'poster',
  },
  {
    id: 'experiment-004',
    title: '自动分镜机，第一次走神',
    description: '待验证工作流：把短故事拆成镜头，同时观察自动拆分遗漏了什么。目前没有正式实验记录。',
    category: 'Workflow',
    date: '未执行',
    status: '工作流设想 · 无记录',
    stage: 'concept',
    visual: 'storyboard',
  },
];

export const tools: Tool[] = [
  {
    id: 'tool-003',
    title: 'Review Pace',
    description: '输入团队人数、有效工时、单条耗时与返工率，快速估算评测任务的日产能和交付节奏。',
    label: '评测排期计算器',
    status: 'Ready',
    symbol: '≋',
    href: '/tools/review-pace/',
  },
  {
    id: 'tool-001',
    title: 'Random Story Seed',
    description: '抽取人物、意外、地点和规则；锁住喜欢的卡片，只重抽还没有感觉的部分。',
    label: '故事种子生成器',
    status: 'Ready',
    symbol: '↯',
    href: '/tools/story-seed/',
  },
  {
    id: 'tool-002',
    title: 'Shot List Cleaner',
    description: '把每行一镜的散乱笔记，整理成可以编辑和复制的景别、画面、运镜、对白与声音表。',
    label: '分镜整理器',
    status: 'Ready',
    symbol: '⌁',
    href: '/tools/shot-list-cleaner/',
  },
  {
    id: 'tool-004',
    title: 'Character Anchor',
    description: '把人物外貌、配饰、服装与允许变化整理成可复制的角色参考卡、图像锚点和视频验收清单。',
    label: '角色锚点卡生成器',
    status: 'Ready',
    symbol: '◎',
    href: '/tools/character-anchor/',
  },
  {
    id: 'tool-005',
    title: 'Shot Pre-flight',
    description: '检查镜头时长、动作数量、运镜冲突与首尾帧差异，用透明规则给出减项或拆镜建议。',
    label: 'AI 视频镜头风险预检器',
    status: 'Ready',
    symbol: '△',
    href: '/tools/shot-risk-checker/',
  },
  {
    id: 'tool-006',
    title: 'Sound Layer Card',
    description: '把对白、声音表演、环境底、动作音效和音乐分配到各自轨道，生成单镜声音 Brief 与验收清单。',
    label: '声音分层卡生成器',
    status: 'Ready',
    symbol: '≡',
    href: '/tools/sound-layer-card/',
  },
  {
    id: 'tool-007',
    title: 'Continuity Checker',
    description: '把镜头 A 的出口和镜头 B 的入口放在一起，检查人物、方向、视线、动作、场景事实与声音交接。',
    label: '相邻镜头连续性检查器',
    status: 'Ready',
    symbol: '→',
    href: '/tools/continuity-checker/',
  },
  {
    id: 'tool-008',
    title: 'Shot Rhythm Planner',
    description: '给镜头分配职责和秒数，用按时长伸缩的时间带检查段落超时、留白与过度平均。',
    label: '镜头节奏规划器',
    status: 'Ready',
    symbol: '▥',
    href: '/tools/shot-rhythm-planner/',
  },
  {
    id: 'tool-009',
    title: 'Scene Anchor',
    description: '把空间结构、固定家具、道具状态、材质、光线和天气整理成可复制的场景蓝图与单镜接口。',
    label: '场景锚点卡生成器',
    status: 'Ready',
    symbol: '⌂',
    href: '/tools/scene-anchor/',
  },
  {
    id: 'tool-010',
    title: 'Shot Version Recorder',
    description: '记录生成批次、候选状态、可用区间、淘汰原因与剪辑采用方式，并导出 Markdown 和 CSV。',
    label: '镜头版本记录器',
    status: 'Ready',
    symbol: '▦',
    href: '/tools/shot-version-recorder/',
  },
  {
    id: 'tool-011',
    title: 'Generation Budget',
    description: '按风险组计算镜头候选、生成秒数、返工预留、后期、声音与人工成本，不内置会过期的平台费率。',
    label: '生成预算计算器',
    status: 'Ready',
    symbol: '◫',
    href: '/tools/generation-budget/',
  },
  {
    id: 'tool-012',
    title: 'Delivery Pack',
    description: '规划母版、平台版、字幕、声音、工程、授权与清单目录，生成 README、CSV 和 SHA-256 校验命令。',
    label: '交付清单生成器',
    status: 'Ready',
    symbol: '▣',
    href: '/tools/delivery-pack/',
  },
  {
    id: 'tool-013',
    title: 'Release Matrix',
    description: '从一个视频母版规划多种画幅、时长、安全区、字幕与音频版本，生成 Markdown 和 CSV 发布矩阵。',
    label: '多平台发布规格规划器',
    status: 'Ready',
    symbol: '▤',
    href: '/tools/release-matrix/',
  },
];

export const currentlyPlaying = [
  {
    icon: '🎬',
    title: '第一部 AI 短片',
    detail: '故事、剧本、分镜与生成包草案已整理；真实视频尚未生成。',
    status: '草案有记录',
    href: '/stories/she-forgets-yesterday/',
  },
  {
    icon: '🎭',
    title: '人物一致性',
    detail: '现有四格静态 Pilot；正式四十镜测试仍未开始。',
    status: 'Pilot 4 / 40',
    href: '/experiments/forty-shots-one-character/',
  },
  {
    icon: '🎥',
    title: 'AI 视频怎么评',
    detail: '把主体、运动、镜头、时序与可用性整理成一套评测路径。',
    status: '重点笔记',
    href: '/notes/ai-video-evaluation/',
  },
  {
    icon: '🧪',
    title: '分镜整理工作流',
    detail: '把每行一镜的散乱文字整理成可编辑、可排序的镜头表。',
    status: '工具可用',
    href: '/tools/shot-list-cleaner/',
  },
  {
    icon: '🔖',
    title: '值得留下的来源',
    detail: '原始链接已经核对；推荐理由与个人观点仍等待荆确认。',
    status: '来源已核对',
    href: '/library/',
  },
];
