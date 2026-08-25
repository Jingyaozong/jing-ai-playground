export type ExperimentDetail = {
  slug: string;
  number: string;
  title: string;
  englishTitle: string;
  category: string;
  date: string;
  status: string;
  demo: boolean;
  summary: string;
  question: string;
  hypothesis: string;
  constants: string[];
  groups: Array<{
    code: string;
    title: string;
    shots: string;
    variable: string;
    tone: 'blue' | 'yellow' | 'coral' | 'mint';
  }>;
  samples: Array<{
    shot: string;
    title: string;
    setting: string;
    observation: string;
    status: string;
    tone: 'blue' | 'yellow' | 'coral' | 'mint';
  }>;
  checks: Array<{
    label: string;
    question: string;
    note: string;
    tone: 'blue' | 'yellow' | 'coral';
  }>;
  nextSteps: string[];
};

export const experimentDetails: ExperimentDetail[] = [
  {
    slug: 'forty-shots-one-character',
    number: '001',
    title: '同一个她，四十个镜头',
    englishTitle: 'One Character, Forty Shots',
    category: 'Character Study',
    date: '2026.08.18',
    status: 'Demo 记录框架',
    demo: true,
    summary: '用四组镜头逐步增加变量，观察同一个角色的脸、发型、服装和气质会从哪里开始漂移。',
    question: '当景别、光线、情绪和动作不断变化时，哪些角色特征最容易先失去一致性？',
    hypothesis: '比起颜色和服装，脸部比例、发际线与局部配饰可能更早发生漂移；变量叠加越多，身份感越难保持。',
    constants: ['同一张角色参考图', '同一套基础人物描述', '同一画幅与生成时长', '每组只增加一个主要变量'],
    groups: [
      { code: 'A', title: '只换景别', shots: '01—10', variable: '远景 → 特写', tone: 'blue' },
      { code: 'B', title: '加入光线', shots: '11—20', variable: '日光 / 逆光 / 夜景', tone: 'yellow' },
      { code: 'C', title: '加入情绪', shots: '21—30', variable: '平静 / 犹豫 / 哭泣', tone: 'coral' },
      { code: 'D', title: '加入动作', shots: '31—40', variable: '转身 / 奔跑 / 回头', tone: 'mint' },
    ],
    samples: [
      { shot: 'SHOT 03', title: '正面近景', setting: '柔和日光 · 表情平静', observation: '等待替换真实输出后记录脸型与五官锚点。', status: '待放入样本', tone: 'blue' },
      { shot: 'SHOT 14', title: '侧逆光中景', setting: '强逆光 · 轻微侧脸', observation: '重点检查发际线、耳饰与侧脸轮廓。', status: '待放入样本', tone: 'yellow' },
      { shot: 'SHOT 26', title: '哭泣特写', setting: '室内冷光 · 明显情绪', observation: '重点检查表情变化是否改变人物年龄和身份感。', status: '待放入样本', tone: 'coral' },
      { shot: 'SHOT 37', title: '奔跑回头', setting: '室外夜景 · 快速动作', observation: '重点检查运动中脸部、发型与服装细节的稳定性。', status: '待放入样本', tone: 'mint' },
    ],
    checks: [
      { label: 'IDENTITY', question: '第一眼还像同一个人吗？', note: '先判断整体身份感，再看局部细节，避免只盯着单个五官。', tone: 'blue' },
      { label: 'ANCHORS', question: '关键锚点保住了几个？', note: '建议固定记录脸型、眉眼距离、发际线、耳饰和服装领口。', tone: 'yellow' },
      { label: 'DRIFT', question: '漂移从哪个变量开始？', note: '不要只写“崩了”，要标明发生在景别、光线、情绪还是动作之后。', tone: 'coral' },
    ],
    nextSteps: [
      '放入同一角色的真实参考图，并补全基础人物描述。',
      '按 A—D 四组生成 40 个镜头，保留模型与参数信息。',
      '挑出每组最稳定和最不稳定的样本，补写观察。',
      '完成后再发布结论；Demo 阶段不对任何模型作真实判断。',
    ],
  },
];

export function getExperimentBySlug(slug: string) {
  return experimentDetails.find((experiment) => experiment.slug === slug);
}
