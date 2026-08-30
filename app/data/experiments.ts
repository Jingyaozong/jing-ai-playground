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
  questionLines: string[];
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
    kind: 'character' | 'reference-pack' | 'light-map';
    label: string;
    title: string;
    description: string;
    asset?: 'rain-character-anchor' | 'shadow-character-anchor';
    imageAlt?: string;
  };
  checks: Array<{
    label: string;
    question: string;
    note: string;
    tone: 'blue' | 'yellow' | 'coral';
  }>;
  observationTitle?: string;
  observationDescription?: string;
  recordBoard?: 'forty-shots' | 'reference-comparison' | 'rain-follow' | 'lighting-continuity' | 'shadow-offset';
  sources?: Array<{ title: string; url: string; note: string }>;
  nextSteps: string[];
  currentConclusion?: string;
  conclusionBadge?: string;
  relatedHref?: string;
  relatedLabel?: string;
  toolHref?: string;
  toolLabel?: string;
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
    questionLines: ['景别、光线、情绪和动作不断变化。', '角色最先丢掉的，', '会是哪一个身份特征？'],
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
    questionLines: ['参考图越多，', '角色会更稳定，', '还是会带来新的约束与冲突？'],
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
  {
    slug: 'can-local-rain-follow-a-character',
    number: '003',
    title: '局部雨区能否稳定跟随人物？',
    englishTitle: 'Can a Local Rain Zone Follow a Character?',
    category: 'Motion & Weather Study',
    date: '2026.08.29',
    status: '实验协议完成 · 0 / 9 待执行',
    demo: true,
    testCount: 9,
    testUnit: 'TEST CELLS',
    pilotLabel: 'PLANNED · 0 / 9',
    notice: '这是一份服务《雨停以前》的待执行视频实验协议。目前只有角色锚点、静态概念画面、九个测试单元与空白记录台；没有视频输出、评分或模型结论。',
    summary: '用三个相同高风险镜头，对比纯文字、明确空间约束和角色锚点 / 首帧参考三种条件；检查一小块雨能否持续跟着林栖，同时让雨区之外保持干燥。',
    question: '当人物开始横移、快走和收伞时，视频模型能否让半径约 1.2 米的雨区持续跟随，而不把雨铺满全场？',
    questionLines: ['人物横移、快走、收伞。', '半径约 1.2 米的雨区，', '能否持续跟随，', '而不铺满全场？'],
    hypothesis: '只写“雨跟着她”可能不足以维持稳定边界；明确人物为圆心、雨区半径和区外干燥，可能改善空间关系。加入角色锚点或首帧参考可能帮助身份一致性，但不一定改善雨幕跟随，甚至可能限制动作。',
    constants: [
      '同一个模型、版本、入口和账号设置；执行当天记录真实名称',
      '同一个虚构角色林栖、同一套黄色雨衣、蓝包、红鞋和透明伞',
      '三个固定镜头任务：厨房横移一步、通道快走三步、公交站合伞',
      '每格 5 秒、16:9、相同输出数量；帧率与清晰度按平台可用项固定',
      '除 A / B / C 指定条件外，不临时增删动作、运镜或负面限制',
      '如果平台支持 Seed 则固定；不支持时明确记为不可控变量',
    ],
    protocolTitle: '三种提示条件，\n三个相同动作。',
    protocolDescription: '每组都执行同样三个高风险镜头。组间只改变空间描述与参考素材条件，失败后也不临时改 Prompt 拯救单个样本。',
    groups: [
      { code: 'A', title: '纯文字基线', shots: 'A01—A03', variable: '只写“局部雨跟着她”，不补充半径、圆心或区外干燥', tone: 'blue' },
      { code: 'B', title: '明确空间约束', shots: 'B01—B03', variable: '写明人物为圆心、半径约 1.2 米、区外始终干燥', tone: 'yellow' },
      { code: 'C', title: '锚点 / 首帧参考', shots: 'C01—C03', variable: '在 B 组文字约束上增加林栖角色锚点或同场景首帧', tone: 'coral' },
    ],
    reference: {
      kind: 'character',
      asset: 'rain-character-anchor',
      imageAlt: '林栖局部雨实验角色锚点图',
      label: 'IDENTITY ANCHOR · AI FICTIONAL CHARACTER',
      title: '先固定林栖，再看雨会不会跟丢。',
      description: 'C 组计划使用《雨停以前》的林栖角色锚点。脸、耳后直发、透明黄色雨衣、蓝色斜挎包和红色帆布鞋都保持不变；参考图只用于角色与服装，不预设雨效已经成功。',
    },
    sampleTitle: '九格保持空白，\n失败也要留下位置。',
    sampleDescription: '每个样本位对应一次真实视频生成。当前只显示条件、镜头任务和观察重点，不用静态概念图冒充视频结果。',
    samples: [
      { shot: 'A01', title: '厨房横移一步', setting: '纯文字 · 固定镜头 · 5 秒', observation: '待执行；观察雨区是否留在原地或迅速铺满厨房。', status: '待执行 · 无视频', framePosition: 'left top', tone: 'blue', generated: false },
      { shot: 'A02', title: '通道快走三步', setting: '纯文字 · 后退跟拍 · 5 秒', observation: '待执行；观察模型是否把局部雨误解成固定漏水。', status: '待执行 · 无视频', framePosition: 'right top', tone: 'blue', generated: false },
      { shot: 'A03', title: '公交站合伞', setting: '纯文字 · 缓慢下压 · 5 秒', observation: '待执行；观察透明伞、双手与雨区是否同时保持连续。', status: '待执行 · 无视频', framePosition: 'left bottom', tone: 'blue', generated: false },
      { shot: 'B01', title: '厨房横移一步', setting: '空间约束 · 固定镜头 · 5 秒', observation: '待执行；与 A01 相同动作，增加 1.2 米半径和区外干燥描述。', status: '待执行 · 无视频', framePosition: 'right bottom', tone: 'yellow', generated: false },
      { shot: 'B02', title: '通道快走三步', setting: '空间约束 · 后退跟拍 · 5 秒', observation: '待执行；检查雨幕中心、人物步伐和湿脚印是否同向移动。', status: '待执行 · 无视频', framePosition: 'left top', tone: 'yellow', generated: false },
      { shot: 'B03', title: '公交站合伞', setting: '空间约束 · 缓慢下压 · 5 秒', observation: '待执行；检查合伞前局部雨区是否保持，且不提前扩散全街。', status: '待执行 · 无视频', framePosition: 'right top', tone: 'yellow', generated: false },
      { shot: 'C01', title: '厨房横移一步', setting: '林栖锚点 / 首帧 · 固定镜头 · 5 秒', observation: '待执行；检查参考是否稳定人物，但让身体动作或雨区边界变僵。', status: '待执行 · 无视频', framePosition: 'left bottom', tone: 'coral', generated: false },
      { shot: 'C02', title: '通道快走三步', setting: '林栖锚点 / 首帧 · 后退跟拍 · 5 秒', observation: '待执行；检查锚点条件下的脸、服装、步态与跟随雨幕。', status: '待执行 · 无视频', framePosition: 'right bottom', tone: 'coral', generated: false },
      { shot: 'C03', title: '公交站合伞', setting: '林栖锚点 / 首帧 · 缓慢下压 · 5 秒', observation: '待执行；检查透明伞放下后是否增殖、漂移或重新展开。', status: '待执行 · 无视频', framePosition: 'left top', tone: 'coral', generated: false },
    ],
    checks: [
      { label: 'RAIN LOCK', question: '雨区中心还跟着她吗？', note: '逐帧看人物中心与雨幕中心的相对位置；不要只根据开头和结尾两帧判断。', tone: 'blue' },
      { label: 'DRY OUTSIDE', question: '雨区之外真的保持干燥吗？', note: '记录雨线、积水和反光是否向全场扩散，以及湿圆边界是否闪烁或跳动。', tone: 'yellow' },
      { label: 'BODY & PROP', question: '人物和透明伞先崩了吗？', note: '把雨效问题与脸、雨衣、鞋、手和伞骨问题分开记录，避免把多个失败合成一句“不能用”。', tone: 'coral' },
    ],
    observationTitle: '先看跟随与边界，\n最后才看好不好看。',
    observationDescription: '四项评分分开记录：雨区跟随、干湿边界、人物连续性、动作与道具。九格只用于发现本轮失败模式，不外推模型普遍能力。',
    recordBoard: 'rain-follow',
    nextSteps: [
      '执行当天选择一个支持五秒视频生成的模型版本，记录入口、设置与日期。',
      '按 A、B、C 三组完成九格，不在中途修改固定动作和验收标准。',
      '逐帧记录雨区落后、全场扩散、边界闪烁、人物漂移和透明伞变形。',
      '完成九格后再判断是否进入《雨停以前》的十镜完整视频测试。',
    ],
    currentConclusion: '实验协议、林栖角色锚点与九格空白记录台已经准备好；当前 0 / 9，没有视频输出，因此不能判断哪种条件更稳定。',
    conclusionBadge: '0 / 9 · 无结论',
    relatedHref: '/stories/before-the-rain-ends/',
    relatedLabel: '返回《雨停以前》故事页 ↗',
    toolHref: '/tools/local-effect-card/',
    toolLabel: '生成局部特效约束卡 ↗',
  },
  {
    slug: 'can-one-light-survive-a-reverse-angle',
    number: '004',
    title: '同一盏灯换机位后还能保持方向吗？',
    englishTitle: 'Can One Light Survive a Reverse Angle?',
    category: 'Lighting Continuity Study',
    date: '2026.08.29',
    status: '实验协议完成 · 0 / 12 待执行',
    demo: true,
    testCount: 12,
    testUnit: 'TEST CELLS',
    pilotLabel: 'PLANNED · 0 / 12',
    notice: '这是一份待执行的光线连续性实验协议。目前只有固定灯位图、十二个测试单元和空白记录台，没有模型输出、评分或结论；页面不会用概念图冒充视频结果。',
    summary: '固定北窗冷光与桌灯暖光，用四个相同镜头对比氛围词、世界坐标账本和账本加起点证据三种输入条件；检查换景别、转身与反打后，灯是否还在原来的位置。',
    question: '摄影机和人物改变方向之后，视频模型能否继续遵守同一个现实空间里的主光方向、阴影关系、曝光层级与冷暖分工？',
    questionLines: ['摄影机和人物改变方向后，', '同一盏灯还能留在原处吗？', '受光、阴影、曝光与冷暖，', '能否继续一致？'],
    hypothesis: '只写“电影感冷暖光”可能不足以约束灯在现实空间中的位置；明确北窗、桌灯、人物和摄影机的世界坐标，可能减少主光翻面与阴影重置。增加首帧或场景参考可以固定起点证据，但不保证中段和反向机位仍然连续。',
    constants: [
      '同一个模型、版本、入口和账号设置；执行当天记录真实名称',
      '同一位虚构成年角色、同一套服装、同一个房间与固定家具位置',
      '固定灯位：北侧窗户提供偏冷高位主光，桌面低位灯提供偏暖局部光',
      '四个固定镜头任务：建立镜头、人物转头、信纸特写、反向机位',
      '每格 5 秒、16:9、相同输出数量；帧率与清晰度按平台可用项固定',
      '除 A / B / C 指定输入条件外，不临时增删运镜、动作、光源或调色词',
    ],
    protocolTitle: '三种光线描述，\n四个相同机位任务。',
    protocolDescription: '灯位、人物、空间和镜头任务全部固定。组间只改变光线输入的精确程度，失败后也不临时为单格补救。',
    groups: [
      { code: 'A', title: '氛围词基线', shots: 'A01—A04', variable: '只写“电影感冷暖夜景”，不说明灯位和现实空间方向', tone: 'blue' },
      { code: 'B', title: '世界坐标账本', shots: 'B01—B04', variable: '写明北窗冷光、桌灯暖光、人物受光面与阴影方向', tone: 'yellow' },
      { code: 'C', title: '账本 + 起点证据', shots: 'C01—C04', variable: '在 B 组文字账本上增加对应机位的首帧或环境参考', tone: 'coral' },
    ],
    reference: {
      kind: 'light-map',
      label: 'WORLD LIGHT MAP · FIXED FOR ALL 12 CELLS',
      title: '先固定灯在哪里，再测试摄影机去哪。',
      description: '北窗冷光与桌灯暖光在十二格中都不移动。相机 C1—C4 可以换位，人物可以转身，但主光来自现实空间的哪一侧不能跟着画面左右一起翻转。',
    },
    sampleTitle: '十二格不预设画面，\n只预设检查方法。',
    sampleDescription: '每个位置对应一次真实视频生成。当前只显示固定任务、条件与检查重点；没有任何缩略图、分数或优胜组。',
    samples: [
      { shot: 'A01', title: '建立镜头', setting: '氛围词 · 房间全景 · 固定镜头', observation: '待执行；记录北窗与桌灯是否能形成可辨认的两层光线关系。', status: '待执行 · 无视频', framePosition: 'left top', tone: 'blue', generated: false },
      { shot: 'A02', title: '人物转头', setting: '氛围词 · 中近景 · 由窗转向桌面', observation: '待执行；检查人物转头时主光是否翻面、眼神光是否突然增殖。', status: '待执行 · 无视频', framePosition: 'right top', tone: 'blue', generated: false },
      { shot: 'A03', title: '信纸特写', setting: '氛围词 · 插入镜头 · 手拿信纸', observation: '待执行；检查信纸、手部与桌灯的阴影方向是否属于同一空间。', status: '待执行 · 无视频', framePosition: 'left bottom', tone: 'blue', generated: false },
      { shot: 'A04', title: '反向机位', setting: '氛围词 · 越肩反打 · 看向北窗', observation: '待执行；检查换到轴线另一侧后，主光是否只是机械地停在画面同一侧。', status: '待执行 · 无视频', framePosition: 'right bottom', tone: 'blue', generated: false },
      { shot: 'B01', title: '建立镜头', setting: '坐标账本 · 房间全景 · 固定镜头', observation: '待执行；与 A01 相同任务，增加北窗、桌灯与曝光层级约束。', status: '待执行 · 无视频', framePosition: 'left top', tone: 'yellow', generated: false },
      { shot: 'B02', title: '人物转头', setting: '坐标账本 · 中近景 · 由窗转向桌面', observation: '待执行；逐帧记录人物脸部受光面是否随真实转身正确变化。', status: '待执行 · 无视频', framePosition: 'right top', tone: 'yellow', generated: false },
      { shot: 'B03', title: '信纸特写', setting: '坐标账本 · 插入镜头 · 手拿信纸', observation: '待执行；检查信纸亮度、桌面接触影和手部投影是否保持因果关系。', status: '待执行 · 无视频', framePosition: 'left bottom', tone: 'yellow', generated: false },
      { shot: 'B04', title: '反向机位', setting: '坐标账本 · 越肩反打 · 看向北窗', observation: '待执行；区分正常的屏幕左右变化与错误的现实灯位翻转。', status: '待执行 · 无视频', framePosition: 'right bottom', tone: 'yellow', generated: false },
      { shot: 'C01', title: '建立镜头', setting: '账本 + 首帧 · 房间全景 · 固定镜头', observation: '待执行；检查起点证据是否稳定窗、桌灯与暗部层级。', status: '待执行 · 无视频', framePosition: 'left top', tone: 'coral', generated: false },
      { shot: 'C02', title: '人物转头', setting: '账本 + 首帧 · 中近景 · 由窗转向桌面', observation: '待执行；检查首帧正确之后，中段转头是否仍会重置主光。', status: '待执行 · 无视频', framePosition: 'right top', tone: 'coral', generated: false },
      { shot: 'C03', title: '信纸特写', setting: '账本 + 首帧 · 插入镜头 · 手拿信纸', observation: '待执行；检查参考中的光线是否保留，同时不锁死手部动作。', status: '待执行 · 无视频', framePosition: 'left bottom', tone: 'coral', generated: false },
      { shot: 'C04', title: '反向机位', setting: '账本 + 首帧 · 越肩反打 · 看向北窗', observation: '待执行；检查反打首帧与前一镜出口是否属于同一套现实灯位。', status: '待执行 · 无视频', framePosition: 'right bottom', tone: 'coral', generated: false },
    ],
    checks: [
      { label: 'LIGHT SOURCE', question: '现实空间里的灯还在原处吗？', note: '先按北窗与桌灯的世界坐标判断，不因为画面左右翻转就误判为主光错误。', tone: 'blue' },
      { label: 'SUBJECT RESPONSE', question: '人、手、信纸和影子一起响应了吗？', note: '检查脸部受光面、眼神光、接触影和投影；只保住背景亮度不算连续。', tone: 'yellow' },
      { label: 'GRADE BOUNDARY', question: '这是空间错误还是调色差异？', note: '把曝光泵动和色温跳变，与灯位翻转、阴影重置分开记录，避免把所有问题都写成“色不一样”。', tone: 'coral' },
    ],
    observationTitle: '先看灯从哪里来，\n再看画面像不像。',
    observationDescription: '四项人工评分分开记录：光源方向、主体受光、曝光层级和色温关系。每格再检查 0%、25%、50%、75%、100% 五个时间点。',
    recordBoard: 'lighting-continuity',
    sources: [
      { title: 'Runway · Image to Video Prompting Guide', url: 'https://help.runwayml.com/hc/en-us/articles/48324313115155-Image-to-Video-Prompting-Guide', note: '官方说明输入图承担构图、主体、光线与风格，文字应主要描述运动；因此首帧可作为起点证据，但不能替代整段检查。' },
      { title: 'Google Cloud · Video generation best practices', url: 'https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/video/best-practice', note: '官方建议清晰描述主体、动作、环境、光线与镜头；本实验把这些变量拆开固定，不把建议本身当成结果。' },
      { title: 'Adobe · Match Color between shots', url: 'https://helpx.adobe.com/premiere/desktop/correct-color/add-color-effects/match-color-between-shots.html', note: '官方调色流程可用于镜头间颜色匹配；本实验仍把后期可修的色彩差异与无法靠调色修复的空间照明错误分开。' },
    ],
    nextSteps: [
      '执行当天选择一个支持五秒视频生成的模型版本，记录入口、设置和日期。',
      '制作同一房间的环境参考与四个机位首帧，并先核对北窗、桌灯和人物位置。',
      '按 A、B、C 三组完成十二格，不在中途修改固定动作、灯位或验收标准。',
      '逐格检查五个时间点，分开记录灯位翻转、阴影重置、曝光跳动和色温跳变。',
    ],
    currentConclusion: '固定灯位图、十二格空白样本墙与本地记录台已经准备好；当前 0 / 12，没有视频输出，因此不能判断哪种输入更稳定。',
    conclusionBadge: '0 / 12 · 无结论',
    relatedHref: '/notes/ai-video-lighting-continuity/',
    relatedLabel: '阅读完整光线连续性方法 ↗',
    toolHref: '/tools/scene-anchor/',
    toolLabel: '制作场景与光线锚点卡 ↗',
  },
  {
    slug: 'can-a-shadow-move-on-its-own',
    number: '005',
    title: '影子能否在人物静止时独立行动？',
    englishTitle: 'Can a Shadow Move on Its Own?',
    category: 'Motion Separation Study',
    date: '2026.08.30',
    status: '实验协议完成 · 0 / 9 待执行',
    demo: true,
    testCount: 9,
    testUnit: 'TEST CELLS',
    pilotLabel: 'PLANNED · 0 / 9',
    notice: '这是一份待执行的影子错位实验协议。目前只有安澄角色锚点、三种制作条件、九个测试单元和本地记录台，没有视频输出、评分或结论；故事概念关键帧只作为起点参考，不会冒充动作测试结果。',
    summary: '固定同一人物、硬光、机位和三种影子动作，对比直接文字描述、实体/影子动作账本与分层合成三种制作条件；检查人物能否保持静止，影子能否独立抬手、改道并重新贴合。',
    question: '当实体人物必须完全静止时，怎样的生成或合成条件，才能让单一投影完成独立动作，同时保住脚底连接、光线方向与时间连续性？',
    questionLines: ['实体人物必须完全静止。', '影子怎样独立行动？', '脚底连接与光线方向，', '时间也要保持连续。'],
    hypothesis: '单次提示同时要求“人物不动”和“影子行动”可能产生动作耦合；把实体与影子写成独立时间轨道，可能提高指令可读性，但仍未必解决投影分叉与光学错误。分层制作预计更可控，却会增加遮罩、跟踪和合成成本。',
    constants: [
      '同一位虚构成年角色安澄，以及同一张已生成的人物锚点图',
      '同一套珊瑚红夹克、浅蓝衬衫、藏蓝阔腿裤、黄工具包与银色方表',
      '同一场景、同一盏方向明确的硬光、同一固定机位与相同起始构图',
      '三个固定任务：影子独自抬手、影子从半步停顿改道、影子在夕阳下重新贴合',
      '每格 5 秒、16:9、相同输出数量；模型、版本、Seed 与平台设置在执行当天记录',
      '人物实体全程不说话；不加入运镜、风、衣摆或背景人群等额外运动',
    ],
    protocolTitle: '三种制作条件，\n三个相同影子任务。',
    protocolDescription: '九格共用同一人物、灯位、起点和动作终点。组间只改变实体与影子被描述或拆层的方式，不为单个失败样本临时改构图。',
    groups: [
      { code: 'A', title: '直接文字描述', shots: 'A01—A03', variable: '单次生成；只写“人物保持静止，影子独立完成动作”', tone: 'blue' },
      { code: 'B', title: '实体 / 影子动作账本', shots: 'B01—B03', variable: '单次生成；分别锁定 BODY = HOLD、SHADOW = MOVE，并写明五个时间点', tone: 'yellow' },
      { code: 'C', title: '分层生成与合成', shots: 'C01—C03', variable: '实体底片与影子层分开制作，再用遮罩、透明度与混合模式合成', tone: 'coral' },
    ],
    reference: {
      kind: 'character',
      asset: 'shadow-character-anchor',
      label: 'CHARACTER + LIGHT ANCHOR · GENERATED 2026.08',
      title: '人物先保持不动，实验才知道影子动了没有。',
      description: '安澄的脸、低发髻、珊瑚红夹克、芥末黄工具包和银色方表在九格中全部固定。参考图只提供人物与硬光起点，不代表任何影子动作已经通过。',
      imageAlt: '安澄 AI 角色锚点与单一硬光影子',
    },
    sampleTitle: '九格先留白。\n把两条时间线分开。',
    sampleDescription: '每格对应一次真实生成或一次完整分层合成。当前只展示任务、条件和观察重点；故事页的静态概念图不计入九格结果。',
    samples: [
      { shot: 'A01', title: '影子独自抬手', setting: '直接描述 · 工作室墙面 · 实体双臂垂下', observation: '待执行；检查人物是否会被影子动作带着同步抬手。', status: '待执行 · 无视频', framePosition: 'left top', tone: 'blue', generated: false },
      { shot: 'A02', title: '影子停顿改道', setting: '直接描述 · 站台地面 · 实体双脚站定', observation: '待执行；检查单一影子能否停住、转向并继续，而不复制人物。', status: '待执行 · 无视频', framePosition: 'right top', tone: 'blue', generated: false },
      { shot: 'A03', title: '影子重新贴合', setting: '直接描述 · 店门夕阳 · 人物到位后停住', observation: '待执行；检查影子能否以真实光学路径贴回脚边，而不是融化或消失。', status: '待执行 · 无视频', framePosition: 'left bottom', tone: 'blue', generated: false },
      { shot: 'B01', title: '影子独自抬手', setting: '动作账本 · BODY HOLD / SHADOW RAISE', observation: '待执行；五点记录实体是否始终静止，以及影子抬手从哪一帧开始。', status: '待执行 · 无视频', framePosition: 'right bottom', tone: 'yellow', generated: false },
      { shot: 'B02', title: '影子停顿改道', setting: '动作账本 · BODY HOLD / SHADOW TURN', observation: '待执行；检查停顿、转向与迈步能否形成三个连续节拍。', status: '待执行 · 无视频', framePosition: 'left top', tone: 'yellow', generated: false },
      { shot: 'B03', title: '影子重新贴合', setting: '动作账本 · BODY HOLD / SHADOW ALIGN', observation: '待执行；检查贴合过程中影子根部、长度和方向是否连续。', status: '待执行 · 无视频', framePosition: 'right top', tone: 'yellow', generated: false },
      { shot: 'C01', title: '影子独自抬手', setting: '分层合成 · 静止人物底片＋影子动作层', observation: '待执行；记录遮罩边缘、脚底接点与墙面材质是否穿帮。', status: '待执行 · 无视频', framePosition: 'left bottom', tone: 'coral', generated: false },
      { shot: 'C02', title: '影子停顿改道', setting: '分层合成 · 静止站台底片＋改道影子层', observation: '待执行；检查跟踪、透视与地面接触是否比单次生成更可控。', status: '待执行 · 无视频', framePosition: 'right bottom', tone: 'coral', generated: false },
      { shot: 'C03', title: '影子重新贴合', setting: '分层合成 · 门口底片＋渐变贴合影子层', observation: '待执行；记录贴合是否自然，以及为了隐藏边缘付出的制作成本。', status: '待执行 · 无视频', framePosition: 'left top', tone: 'coral', generated: false },
    ],
    checks: [
      { label: 'SEPARATION', question: '到底是谁在动？', note: '先看实体肩、肘、手、骨盆和脚位是否保持静止，再判断影子动作；人物微动不能被忽略。', tone: 'blue' },
      { label: 'LIGHT LOGIC', question: '影子还属于这盏灯吗？', note: '检查脚底连接、投影方向、软硬、长度和表面透视；动作成功但光学脱节仍判失败。', tone: 'yellow' },
      { label: 'PRODUCTION COST', question: '控制力换来了多少额外工作？', note: 'C 组单独记录遮罩、跟踪、修边和合成时间，不把后期路径与单次生成混写成模型能力。', tone: 'coral' },
    ],
    observationTitle: '先看实体有没有动，\n再看影子怎么动。',
    observationDescription: '四项人工评分分开记录：实体静止、影子独立、光学关系和时间连续。每格检查 0%、25%、50%、75%、100% 五个时间点。',
    recordBoard: 'shadow-offset',
    sources: [
      { title: 'Runway · Image to Video Prompting Guide', url: 'https://help.runwayml.com/hc/en-us/articles/48324313115155-Image-to-Video-Prompting-Guide', note: '官方说明输入图承担构图、主体、光线与风格，文字主要描述动作；也提醒起点图里的隐含运动线索可能与目标运动冲突。' },
      { title: 'Google Cloud · Veo reference images', url: 'https://cloud.google.com/vertex-ai/generative-ai/docs/video/use-reference-images-to-guide-video-generation', note: '官方说明参考图可用于主体引导；支持的模型与输入数量可能变化，因此执行当天仍需核对真实能力。' },
      { title: 'Adobe · Compositing overview', url: 'https://helpx.adobe.com/premiere/desktop/add-video-effects/work-with-composites/compositing-overview.html', note: '官方说明可使用透明度、遮罩、键控与混合模式叠加视频层；C 组把它作为制作兜底，不当作模型生成能力。' },
    ],
    nextSteps: [
      '执行当天选择一个支持五秒图生视频的真实模型版本，并记录入口、设置与日期。',
      '从故事 004 的角色锚点重新制作三张无动作模糊、单一硬光的干净首帧。',
      '先执行 A、B 两组三个任务；C 组保留相同底片、动作终点与验收标准完成分层合成。',
      '九格完成后只报告本轮分离成功率、光学错误与制作成本，再决定故事采用单次生成还是二维影子层。',
    ],
    currentConclusion: '安澄角色锚点、三种制作条件、九格空白样本墙与本地记录台已经准备好；当前 0 / 9，没有视频输出，因此不能判断影子能否稳定独立行动。',
    conclusionBadge: '0 / 9 · 无结论',
    relatedHref: '/stories/shadow-arrives-five-minutes-early/',
    relatedLabel: '返回《影子比她早到五分钟》↗',
    toolHref: '/tools/lighting-ledger/',
    toolLabel: '打开光线连续性账本 ↗',
  },
];

export function getExperimentBySlug(slug: string) {
  return experimentDetails.find((experiment) => experiment.slug === slug);
}
