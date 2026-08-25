export type Story = {
  id: string;
  title: string;
  englishTitle: string;
  description: string;
  type: string;
  date: string;
  duration: string;
  status: string;
  visual: string;
};

export type Experiment = {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  status: string;
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
    title: '她每天醒来都会忘记昨天',
    englishTitle: 'She Forgets Yesterday',
    description: '一个关于记忆、遗忘和重复告别的短片。她每天醒来，桌上都会多一封自己写给自己的信。',
    type: 'AI Short Film',
    date: '2026.08',
    duration: '01:38',
    status: '制作中',
    visual: 'memory',
  },
  {
    id: 'story-002',
    title: '第七码头没有船',
    englishTitle: 'No Boat at Pier Seven',
    description: '深夜值班员收到一张来自十年后的船票。一个雾、旧广播与错过的人的故事。',
    type: 'AI Comic Series',
    date: '2026.09',
    duration: 'EP.01—03',
    status: '概念中',
    visual: 'pier',
  },
  {
    id: 'story-003',
    title: '雨停以前',
    englishTitle: 'Before the Rain Ends',
    description: '如果一场雨只落在一个人头顶，她要走多远，才能把它留在身后？',
    type: 'Visual Poem',
    date: '2026.10',
    duration: '00:52',
    status: '脚本中',
    visual: 'rain',
  },
];

export const experiments: Experiment[] = [
  {
    id: 'experiment-001',
    title: '同一个她，四十个镜头',
    description: '跨景别、光线和情绪测试角色一致性，记录哪些细节最先“漂走”。',
    category: 'Character Study',
    date: '2026.08.18',
    status: '记录已公开',
    visual: 'faces',
  },
  {
    id: 'experiment-002',
    title: '一句话，四种视频模型',
    description: '同一条分镜提示词，在不同模型里会长出怎样不同的运动与镜头语言？',
    category: 'Model Test',
    date: '2026.08.11',
    status: '对比中',
    visual: 'frames',
  },
  {
    id: 'experiment-003',
    title: '让 AI 先画一张不会发生的海报',
    description: '从一张虚构电影海报反向生长出角色、场景与故事梗概。',
    category: 'Prompt Play',
    date: '2026.07.29',
    status: '完成',
    visual: 'poster',
  },
  {
    id: 'experiment-004',
    title: '自动分镜机，第一次走神',
    description: '把短故事拆成镜头，同时保留那些机器意外带来的奇怪空白。',
    category: 'Workflow',
    date: '2026.07.16',
    status: '迭代中',
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
];

export const currentlyPlaying = [
  ['🎬', '第一部 AI 漫剧', '把 90 秒的故事真正做完'],
  ['🎭', '人物一致性', '让同一个角色熬过四十个镜头'],
  ['🎥', '视频模型', '寻找更像“镜头”而不只是“会动图片”的结果'],
  ['🧪', '自动分镜', '试着让工作流留下一点创作者的直觉'],
  ['🛠', '新的小工具', '解决一个每天都在重复的小麻烦'],
];
