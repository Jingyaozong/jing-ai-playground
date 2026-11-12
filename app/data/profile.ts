// 全站需要本人填写的内容集中在这个文件。
// 形如 `{……}` 的值是占位符：没填的项页面上不显示，填入真实内容后会自动出现。

export const isPlaceholder = (value: string) => /^\{.*\}$/.test(value.trim());

export const profile = {
  siteName: 'JING · AI 视频与多模态评测',
  name: '荆',
  roleLine: 'AI 视频 / 多模态评测 · 数据质量 · 项目交付',
  tagline: '我关注多模态生成的视觉质量，并把对构图、光色、人物和时序的判断，写成可以复核的评测记录。',
  narrative: '雕塑本科给了我造型和审美训练，视觉设计让我习惯把判断落到细节。2023 年起我进入 AI 数据行业，从多模态数据标注做到项目管理，再到 AIGC 与视频评测。',
  email: 'jingyaozong0512@gmail.com',
  // 想加其他平台时在这里加：{ label: '平台名', href: '主页链接' }
  links: [] as Array<{ label: string; href: string }>,
};

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
