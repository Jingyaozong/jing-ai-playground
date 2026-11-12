// 全站需要本人填写的内容集中在这个文件。
// 形如 `{……}` 的值是占位符：没填的项页面上不显示，填入真实内容后会自动出现。

export const isPlaceholder = (value: string) => /^\{.*\}$/.test(value.trim());

export const profile = {
  siteName: 'JING · AI 视频与多模态评测',
  name: '荆',
  roleLine: 'AI 视频 / 多模态评测 · 数据质量 · 项目交付',
  tagline: '我关注多模态生成的视觉质量，并把对构图、光色、人物和时序的判断，写成可以复核的评测记录。',
  narrative: '雕塑本科给了我造型和审美训练，UI 设计让我习惯把判断落到细节。2023 年起我进入 AI 数据行业，从多模态数据标注做到项目管理，再到 AIGC 与视频评测。',
  email: 'jingyaozong0512@gmail.com',
  // 想加其他平台时在这里加：{ label: '平台名', href: '主页链接' }
  links: [] as Array<{ label: string; href: string }>,
  stats: [
    { value: '{30+ 人}', label: '带过的评测与标注团队规模' },
    { value: '{+x%}', label: 'Prompt-Image Match 指标提升' },
    { value: '{样本量}', label: '累计评测 / 标注样本' },
  ],
};

export type Project = {
  id: string;
  title: string;
  org: string;
  period: string;
  role: string;
  situation: string;
  task: string;
  actions: string[];
  results: Array<{ value: string; label: string }>;
  methodLinks: Array<{ label: string; href: string }>;
};

export const projects: Project[] = [
  {
    id: 'aigc-image-evaluation',
    title: 'AIGC 文生图评测',
    org: '{公司 / 项目方}',
    period: '{起止时间}',
    role: '{我的角色}',
    situation: '文生图模型迭代需要稳定的主观评测结果，评测员之间的判断口径不一致。',
    task: '带领评测团队建立评测规范与复核机制，让评测结论可以被复核，并能反馈到规则迭代。',
    actions: [
      '编写评测规范，明确各维度的判断依据和打分锚点',
      '建立双人复核机制，分歧样本单独裁决并沉淀为规则',
      '对 Bad Case 做归因，区分数据、规则、执行与模型能力问题',
      '按归因结果迭代规则，并组织培训同步到团队',
    ],
    results: [
      { value: '{30+ 人}', label: '评测团队规模' },
      { value: '{x% → y%}', label: '双人复核一致率' },
      { value: '{+x%}', label: 'Prompt-Image Match 指标提升' },
    ],
    methodLinks: [
      { label: 'Bad Case 归因与闭环', href: '/notes/bad-case-review-loop/' },
      { label: '八维评测框架', href: '/notes/video-evaluation-eight-dimensions/' },
    ],
  },
  {
    id: 'multimodal-annotation-delivery',
    title: '多模态图文匹配 / OCR 数据项目',
    org: '博彦科技',
    period: '{起止时间}',
    role: '{我的角色}',
    situation: '图文匹配与 OCR 标注需求量大，需要在保证质量的前提下按期交付。',
    task: '管理标注团队，负责从需求确认到交付验收的全流程。',
    actions: [
      '把客户需求拆成可执行的标注规则与 SOP',
      '组织试标和培训，稳定口径后再放量',
      '设置质检与返修流程，跟踪问题类型',
      '按批次完成格式、质量与版本检查后交付',
    ],
    results: [
      { value: '{团队规模}', label: '标注团队' },
      { value: '{交付量}', label: '累计交付数据' },
      { value: '{准确率 / 返修率}', label: '质量指标' },
    ],
    methodLinks: [
      { label: '交付前的四道关口', href: '/notes/dataset-release-gates/' },
    ],
  },
  {
    id: 'dify-workflow-automation',
    title: 'Dify 工作流自动化',
    org: '{公司 / 项目方}',
    period: '{起止时间}',
    role: '{我的角色}',
    situation: '项目中的规则答疑和重复问题占用大量人工时间。',
    task: '把重复问题交给工作流自动处理，同时保留人工升级通道。',
    actions: [
      '用 Dify 搭建 RAG + Prompt + Workflow 的处理流程',
      '把规则文档整理成可检索的知识库',
      '按风险分层，高风险问题转人工处理',
    ],
    results: [
      { value: '{处理量}', label: '自动处理的问题数' },
      { value: '{节省工时 / 响应时间}', label: '效率变化' },
    ],
    methodLinks: [],
  },
  {
    id: 'pm-assistant',
    title: '项目经理助理',
    org: '海天瑞声',
    period: '{起止时间}',
    role: '项目经理助理',
    situation: '{项目背景}',
    task: '协助项目经理推进数据项目，从客户需求到交付验收。',
    actions: [
      '对接客户需求并整理成项目要求',
      '协调供应商的排期与产能',
      '跟进项目进度与交付验收',
    ],
    results: [
      { value: '{项目数 / 交付量}', label: '参与项目' },
    ],
    methodLinks: [],
  },
];

export const capabilities = [
  { title: '视频与多模态评测', copy: '按八个维度做主观评测，用时间码和可见事实写证据，给出严重度结论。' },
  { title: '评测体系与 Bad Case 闭环', copy: '设计评测集、打分锚点和复核机制，对 Bad Case 做五层归因并推动规则迭代。' },
  { title: '团队与 SOP、QC', copy: '带 30–50 人规模的团队，负责规范编写、培训、质检和一致性管理。' },
  { title: '项目交付与供应商协同', copy: '从需求确认、试标、放量到验收交付，协调客户与供应商。' },
];

export const eightDimensions = [
  { id: '01', name: '语义遵循', check: '主体、动作、数量、属性是否按指令出现' },
  { id: '02', name: '基础画质', check: '清晰度、噪点、压缩与伪影' },
  { id: '03', name: '美学表现', check: '构图、光色、质感与视觉焦点' },
  { id: '04', name: '主体与场景一致性', check: '人物身份、服装、道具与场景是否稳定' },
  { id: '05', name: '时序与动作连续性', check: '动作是否连贯，有无闪烁、跳变' },
  { id: '06', name: '结构与物理合理性', check: '人体结构、接触、遮挡与物理规律' },
  { id: '07', name: '镜头语言与叙事', check: '景别、运镜是否服务于要表达的内容' },
  { id: '08', name: '音画与安全', check: '音画同步，以及内容安全与合规' },
];

export const evaluationFlow = ['需求', '验收合同', '评测集设计', '四遍观看与打分', '一致性复核', 'Bad Case 归因', '报告与闭环'];
