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
    framePosition: 'left top' | 'right top' | 'left bottom' | 'right bottom';
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
    status: '首轮 4 格静态样本',
    demo: true,
    summary: '先用四格静态样本验证角色锚点和记录方法，再逐步扩展为四组、四十镜的正式一致性测试。',
    question: '当景别、光线、情绪和动作不断变化时，哪些角色特征最容易先失去一致性？',
    hypothesis: '比起颜色和服装，脸部比例、发际线与局部配饰可能更早发生漂移；变量叠加越多，身份感越难保持。',
    constants: ['同一张角色锚点图', '同一套服装、发夹与耳饰', '同一次生成任务中的四格静态画面', '每格只增加一类主要挑战'],
    groups: [
      { code: 'A', title: '只换景别', shots: '01—10', variable: '远景 → 特写', tone: 'blue' },
      { code: 'B', title: '加入光线', shots: '11—20', variable: '日光 / 逆光 / 夜景', tone: 'yellow' },
      { code: 'C', title: '加入情绪', shots: '21—30', variable: '平静 / 犹豫 / 哭泣', tone: 'coral' },
      { code: 'D', title: '加入动作', shots: '31—40', variable: '转身 / 奔跑 / 回头', tone: 'mint' },
    ],
    samples: [
      { shot: 'PILOT 01', title: '正面近景', setting: '柔和日光 · 表情平静', observation: '脸型、发型、蓝色发夹、红色耳饰和黄色外套都与角色锚点保持一致。', status: '已生成 · 首轮样本', framePosition: 'left top', tone: 'blue' },
      { shot: 'PILOT 02', title: '侧逆光中景', setting: '强逆光 · 完整侧脸', observation: '侧脸比例仍可辨认，发夹与耳饰保留；逆光主要改变皮肤对比和鼻梁轮廓。', status: '已生成 · 首轮样本', framePosition: 'right top', tone: 'yellow' },
      { shot: 'PILOT 03', title: '哭泣特写', setting: '室内冷光 · 明显情绪', observation: '强情绪改变眼周和皮肤纹理，但年龄感、发际线与主要身份锚点没有明显漂移。', status: '已生成 · 首轮样本', framePosition: 'left bottom', tone: 'coral' },
      { shot: 'PILOT 04', title: '奔跑回头', setting: '室外暮色 · 快速动作', observation: '运动让短发轮廓变化最大；发夹、耳饰、服装颜色和脸部辨识度仍然保留。', status: '已生成 · 首轮样本', framePosition: 'right bottom', tone: 'mint' },
    ],
    checks: [
      { label: 'IDENTITY', question: '第一眼还像同一个人吗？', note: '先判断整体身份感，再看局部细节，避免只盯着单个五官。', tone: 'blue' },
      { label: 'ANCHORS', question: '关键锚点保住了几个？', note: '建议固定记录脸型、眉眼距离、发际线、耳饰和服装领口。', tone: 'yellow' },
      { label: 'DRIFT', question: '漂移从哪个变量开始？', note: '不要只写“崩了”，要标明发生在景别、光线、情绪还是动作之后。', tone: 'coral' },
    ],
    nextSteps: [
      '把首轮四格样本拆成独立 Prompt，并保存完整生成参数。',
      '按 A—D 四组扩展到 40 个静态或视频镜头。',
      '每组挑出最稳定和最不稳定的结果，使用同一张表记录锚点。',
      '完成正式测试后再写模型结论；当前样本只验证记录方法。',
    ],
  },
];

export function getExperimentBySlug(slug: string) {
  return experimentDetails.find((experiment) => experiment.slug === slug);
}
