export type ExperimentDetail = {
  slug: string;
  number: string;
  title: string;
  englishTitle: string;
  category: string;
  date: string;
  status: string;
  demo: boolean;
  testCount?: number;
  testUnit?: string;
  pilotLabel?: string;
  notice?: string;
  summary: string;
  question: string;
  hypothesis: string;
  constants: string[];
  protocolTitle?: string;
  protocolDescription?: string;
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
    generated?: boolean;
  }>;
  sampleTitle?: string;
  sampleDescription?: string;
  reference?: {
    kind: 'character' | 'reference-pack';
    label: string;
    title: string;
    description: string;
  };
  checks: Array<{
    label: string;
    question: string;
    note: string;
    tone: 'blue' | 'yellow' | 'coral';
  }>;
  observationTitle?: string;
  observationDescription?: string;
  recordBoard?: 'forty-shots' | 'reference-comparison';
  sources?: Array<{ title: string; url: string; note: string }>;
  nextSteps: string[];
  currentConclusion?: string;
  conclusionBadge?: string;
  relatedHref?: string;
  relatedLabel?: string;
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
    recordBoard: 'forty-shots',
  },
  {
    slug: 'what-reference-images-lock',
    number: '002',
    title: '参考图到底锁住了什么？',
    englishTitle: 'What Does a Reference Image Actually Lock?',
    category: 'Reference Study',
    date: '2026.08.29',
    status: '实验协议完成 · 0 / 12 待执行',
    demo: true,
    testCount: 12,
    testUnit: 'TEST CELLS',
    pilotLabel: 'PLANNED · 0 / 12',
    notice: '这是一份待执行的对照实验协议，目前没有模型输出、评分或结论。页面中的 12 个样本位和记录台全部保持为空，只有实际生成并人工观察后才会更新状态。',
    summary: '用同一模型和四种镜头任务，对比无参考图、单张正面锚点和三张多角度参考；观察身份、构图、动作自由度与参考伪影怎样变化。',
    question: '增加参考图数量，究竟会提高角色一致性，还是同时引入新的约束与冲突？',
    hypothesis: '单张中性正面参考可能比无参考更稳定地保留身份；一致的多角度参考可能帮助侧面与全身镜头，但“更多图片”本身不保证更好。如果三张素材在年龄、光线、服装或比例上互相冲突，输出可能出现新的漂移。',
    constants: [
      '同一个模型、版本、入口与账号设置；执行当天记录实际名称',
      '同一组角色描述、镜头 Prompt、负面限制、画幅、时长与输出数量',
      '同一位 AI 生成的虚构成年角色；参考素材拥有可测试的使用权',
      '四种镜头任务固定：正面微表情、侧面回头、中景拿取物体、全身走动',
      '如果平台支持 Seed，则固定 Seed；如果不支持，明确记录为不可控变量',
      '评审前隐藏组别，只按样本编号观察；不因某一张好看就更换评分标准',
    ],
    protocolTitle: '三种参考条件，\n四个相同任务。',
    protocolDescription: '每组执行同样四种镜头任务。组间只改变参考素材条件，组内不临时修改 Prompt 来拯救某个结果。',
    groups: [
      { code: 'A', title: '无参考图', shots: 'A01—A04', variable: '只使用固定文字描述，建立无参考基线', tone: 'blue' },
      { code: 'B', title: '单张正面锚点', shots: 'B01—B04', variable: '一张中性表情、均匀光线的正面角色图', tone: 'yellow' },
      { code: 'C', title: '三张多角度参考', shots: 'C01—C04', variable: '正面、侧面、全身三张一致的角色图', tone: 'coral' },
    ],
    reference: {
      kind: 'reference-pack',
      label: 'REFERENCE PACK · 待制作',
      title: '先检查三张图是否在说同一个人。',
      description: '多角度参考包计划包含正面、侧面与全身图。执行前要先核对年龄感、脸部比例、发型、服装、配饰、色温和材质是否一致；不把互相矛盾的图片当成“更多信息”。',
    },
    sampleTitle: '十二格先留白，\n不提前挑赢家。',
    sampleDescription: '每个样本位对应一个真实生成任务。当前只显示任务与编号，所有观察都明确标记为待执行。',
    samples: [
      { shot: 'A01', title: '正面微表情', setting: '无参考 · 近景 · 轻微抬眼', observation: '等待实际生成后记录身份、表情与细节变化。', status: '待执行 · 无样本', framePosition: 'left top', tone: 'blue', generated: false },
      { shot: 'A02', title: '侧面回头', setting: '无参考 · 中近景 · 侧脸转正', observation: '等待实际生成后记录角度变化中的身份与发型轮廓。', status: '待执行 · 无样本', framePosition: 'right top', tone: 'blue', generated: false },
      { shot: 'A03', title: '拿取物体', setting: '无参考 · 中景 · 手伸向桌面', observation: '等待实际生成后记录手部、道具与人物身份是否同时成立。', status: '待执行 · 无样本', framePosition: 'left bottom', tone: 'blue', generated: false },
      { shot: 'A04', title: '全身走动', setting: '无参考 · 全景 · 向前两步', observation: '等待实际生成后记录身材比例、服装与步态。', status: '待执行 · 无样本', framePosition: 'right bottom', tone: 'blue', generated: false },
      { shot: 'B01', title: '正面微表情', setting: '单张参考 · 近景 · 轻微抬眼', observation: '等待实际生成；与 A01 使用相同镜头任务。', status: '待执行 · 无样本', framePosition: 'left top', tone: 'yellow', generated: false },
      { shot: 'B02', title: '侧面回头', setting: '单张参考 · 中近景 · 侧脸转正', observation: '等待实际生成；重点观察正面参考能否约束侧脸。', status: '待执行 · 无样本', framePosition: 'right top', tone: 'yellow', generated: false },
      { shot: 'B03', title: '拿取物体', setting: '单张参考 · 中景 · 手伸向桌面', observation: '等待实际生成；重点观察身份约束是否影响动作完成。', status: '待执行 · 无样本', framePosition: 'left bottom', tone: 'yellow', generated: false },
      { shot: 'B04', title: '全身走动', setting: '单张参考 · 全景 · 向前两步', observation: '等待实际生成；重点观察正面头像对全身信息的覆盖程度。', status: '待执行 · 无样本', framePosition: 'right bottom', tone: 'yellow', generated: false },
      { shot: 'C01', title: '正面微表情', setting: '三张参考 · 近景 · 轻微抬眼', observation: '等待实际生成；检查多张信息是否增加局部冲突。', status: '待执行 · 无样本', framePosition: 'left top', tone: 'coral', generated: false },
      { shot: 'C02', title: '侧面回头', setting: '三张参考 · 中近景 · 侧脸转正', observation: '等待实际生成；重点观察侧面素材是否改善角度转换。', status: '待执行 · 无样本', framePosition: 'right top', tone: 'coral', generated: false },
      { shot: 'C03', title: '拿取物体', setting: '三张参考 · 中景 · 手伸向桌面', observation: '等待实际生成；检查身份、服装与物体交互能否同时成立。', status: '待执行 · 无样本', framePosition: 'left bottom', tone: 'coral', generated: false },
      { shot: 'C04', title: '全身走动', setting: '三张参考 · 全景 · 向前两步', observation: '等待实际生成；检查全身参考是否改善比例并限制动作自由度。', status: '待执行 · 无样本', framePosition: 'right bottom', tone: 'coral', generated: false },
    ],
    checks: [
      { label: 'IDENTITY', question: '第一眼仍是同一个人吗？', note: '分别检查整体身份、脸部比例、发际线、配饰和服装；不要只因为颜色接近就判为一致。', tone: 'blue' },
      { label: 'POSE & MOTION', question: '参考是否妨碍动作完成？', note: '记录回头、伸手和行走是否自然；身份稳定但动作僵硬不能被写成全面改善。', tone: 'yellow' },
      { label: 'REFERENCE TRACE', question: '是否留下参考图的错误痕迹？', note: '检查错误光线、固定表情、背景残留、服装冲突和多视角融合伪影。', tone: 'coral' },
    ],
    observationTitle: '分别看身份、动作，\n再看参考痕迹。',
    observationDescription: '四项人工评分分开记录，不先合成单一总分。样本量只有 12 格时，只描述本轮现象，不外推模型普遍能力。',
    recordBoard: 'reference-comparison',
    sources: [
      { title: 'Runway · Gen-4 Image References', url: 'https://help.runwayml.com/hc/en-us/articles/40042718905875-Creating-with-Gen-4-Image-References', note: '官方说明单张与多张 References 的使用方式，并提醒新增变量会增加结果变化。' },
      { title: 'Google Cloud · Veo reference images', url: 'https://docs.cloud.google.com/vertex-ai/generative-ai/docs/video/use-reference-images-to-guide-video-generation', note: '官方说明参考图可用于主体或风格引导；支持数量与可用模型需要在执行当天核对。' },
      { title: 'Google Cloud · Veo best practices', url: 'https://docs.cloud.google.com/vertex-ai/generative-ai/docs/video/best-practice', note: '官方建议使用清晰、高质量的源图，并把图像视为后续视频细节、光线和风格的基础。' },
    ],
    nextSteps: [
      '制作一组内部一致的正面、侧面、全身参考图，并先完成素材自检。',
      '在执行当天选择一个确实支持目标参考模式的模型版本，保存官方能力页面与日期。',
      '按 A、B、C 三组完成 12 个测试单元，不在中途改变镜头 Prompt 或评分标准。',
      '完成盲评后再解除组别标签，只报告本轮观察与限制，不做模型排名。',
    ],
    currentConclusion: '实验协议与空白记录台已经准备好；当前 0 / 12，没有任何生成结果，因此不能判断单张或多张参考更稳定。',
    conclusionBadge: '0 / 12 · 无结论',
    relatedHref: '/notes/ai-video-character-consistency/',
    relatedLabel: '阅读角色一致性方法 ↗',
  },
];

export function getExperimentBySlug(slug: string) {
  return experimentDetails.find((experiment) => experiment.slug === slug);
}
