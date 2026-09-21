export const MAX_TRACE_CHARS = 1_000_000;
export const traceCategories = {
  pending: '尚未分类', task_rule: '任务与规则', planning: '规划与拆解', tool_selection: '工具选择',
  arguments: '参数与口径', execution: '执行与环境', state: '状态与上下文', synthesis: '结果整合',
} as const;
export const acceptanceLabels = { pending: '待验收', pass: '满足', fail: '不满足', uncertain: '无法判断' } as const;
export type TraceStep = { id: string; tool: string; status: 'ok' | 'error' | 'unknown'; input: string; output: string };
export type AgentTrace = { version: 1; kind: 'synthetic' | 'user_record'; caseId: string; task: string; acceptance: string[]; steps: TraceStep[] };
export type TraceReview = {
  localization: 'pending' | 'located' | 'none'; firstDeviationId: string;
  category: keyof typeof traceCategories; evidence: string; hypothesis: string; nextTest: string;
  checks: { result: keyof typeof acceptanceLabels; evidence: string }[];
};
export function emptyTraceReview(trace: AgentTrace): TraceReview {
  return { localization: 'pending', firstDeviationId: '', category: 'pending', evidence: '', hypothesis: '', nextTest: '', checks: trace.acceptance.map(() => ({ result: 'pending', evidence: '' })) };
}
function object(value: unknown): value is Record<string, unknown> { return typeof value === 'object' && value !== null && !Array.isArray(value); }
function textField(value: unknown, label: string, max = 8000, allowEmpty = false): string {
  if (typeof value !== 'string' || value.length > max || (!allowEmpty && !value.trim())) throw new Error(`${label}需要${allowEmpty ? '' : '非空'}文本，最多 ${max} 字符。`);
  return value;
}
function enumField<T extends string>(value: unknown, choices: readonly T[], label: string): T {
  if (typeof value !== 'string' || !choices.includes(value as T)) throw new Error(`${label}无效：请选择模板中的状态。`);
  return value as T;
}

// Only the documented, observable fields enter the workbench or an export.
export function parseTraceRecord(source: string): { trace: AgentTrace; review: TraceReview } {
  if (source.length > MAX_TRACE_CHARS) throw new Error('记录超过 100 万字符，请拆成单条任务。');
  let data: unknown;
  try { data = JSON.parse(source); } catch { throw new Error('JSON 格式不正确；请检查引号、逗号与括号。当前已载入记录仍保留。'); }
  if (!object(data)) throw new Error('JSON 顶层需要一个对象。');
  const isBundle = data.format === 'jing-agent-review-v1';
  if ('format' in data && !isBundle) throw new Error('复核包版本不支持。');
  const raw = isBundle ? data.trace : data;
  if (!object(raw) || raw.version !== 1) throw new Error('轨迹 version 必须为 1。可先载入虚构演练查看格式。');
  if (!Array.isArray(raw.acceptance) || raw.acceptance.length < 1 || raw.acceptance.length > 12) throw new Error('acceptance 需要 1–12 条验收要求。');
  if (!Array.isArray(raw.steps) || raw.steps.length < 1 || raw.steps.length > 100) throw new Error('steps 需要 1–100 个步骤，数组顺序就是执行顺序。');
  const ids = new Set<string>();
  const trace: AgentTrace = {
    version: 1, kind: enumField(raw.kind, ['synthetic', 'user_record'], '记录来源'),
    caseId: textField(raw.caseId, 'Case ID', 100), task: textField(raw.task, '任务'),
    acceptance: raw.acceptance.map((item) => textField(item, '验收要求', 1000)),
    steps: raw.steps.map((item, index) => {
      if (!object(item)) throw new Error(`步骤 ${index + 1} 需要对象。`);
      const id = textField(item.id, '步骤 ID', 60);
      if (id.trim() !== id || ids.has(id) || /[\r\n]/.test(id)) throw new Error('步骤 ID 需要唯一、单行，首尾不能有空格。');
      ids.add(id);
      return { id, tool: textField(item.tool, '动作 / 工具名', 120), status: enumField(item.status, ['ok', 'error', 'unknown'], '步骤状态'), input: textField(item.input, '输入 / 参数', 8000, true), output: textField(item.output, '可见返回', 8000, true) };
    }),
  };
  const review = emptyTraceReview(trace);
  if (isBundle) {
    const saved = data.review;
    if (!object(saved) || !Array.isArray(saved.checks) || saved.checks.length !== trace.acceptance.length) throw new Error('复核包缺少与验收要求对应的记录。');
    review.localization = enumField(saved.localization, ['pending', 'located', 'none'], '定位状态');
    review.firstDeviationId = textField(saved.firstDeviationId, '偏离步骤', 60, true);
    if (review.localization === 'located' ? review.firstDeviationId !== '' && !ids.has(review.firstDeviationId) : review.firstDeviationId !== '') throw new Error('偏离步骤与定位状态不一致。');
    review.category = enumField(saved.category, Object.keys(traceCategories) as (keyof typeof traceCategories)[], '问题分类');
    for (const field of ['evidence', 'hypothesis', 'nextTest'] as const) review[field] = textField(saved[field], field, 8000, true);
    review.checks = saved.checks.map((check) => {
      if (!object(check)) throw new Error('验收记录格式无效。');
      return { result: enumField(check.result, Object.keys(acceptanceLabels) as (keyof typeof acceptanceLabels)[], '验收状态'), evidence: textField(check.evidence, '验收证据', 8000, true) };
    });
  }
  return { trace, review };
}

export function traceReviewGaps(trace: AgentTrace, review: TraceReview): string[] {
  const gaps: string[] = [];
  if (review.localization === 'pending') gaps.push('轨迹尚未完成人工定位');
  if (review.localization === 'located' && !trace.steps.some((step) => step.id === review.firstDeviationId)) gaps.push('尚未选择偏离步骤');
  if (!review.evidence.trim()) gaps.push('缺少定位依据或未发现偏离的核查依据');
  if (review.localization === 'located' && review.category === 'pending') gaps.push('偏离尚未分类');
  const unchecked = review.checks.filter((check) => check.result === 'pending').length;
  const missing = review.checks.filter((check) => check.result !== 'pending' && !check.evidence.trim()).length;
  if (unchecked) gaps.push(`${unchecked} 条要求待验收`);
  if (missing) gaps.push(`${missing} 条验收判断缺少证据`);
  if ((review.localization === 'located' || review.checks.some((check) => check.result === 'fail' || check.result === 'uncertain')) && !review.nextTest.trim()) gaps.push('尚未记录下一步验证');
  return gaps;
}

export function exportTraceBundle(trace: AgentTrace, review: TraceReview): string {
  const result = JSON.stringify({ format: 'jing-agent-review-v1', trace, review }, null, 2);
  if (result.length > MAX_TRACE_CHARS) throw new Error('复核包超过 100 万字符，请精简长日志后再导出；当前记录保留。');
  return result;
}

function literalBlock(value: string): string {
  const fence = '`'.repeat(Math.max(3, ...Array.from(value.matchAll(/`+/g), (match) => match[0].length + 1)));
  return `${fence}text\n${value || '未记录'}\n${fence}`;
}

export function traceReport(trace: AgentTrace, review: TraceReview): string {
  const errors = trace.steps.filter((step) => step.status === 'error');
  const gaps = traceReviewGaps(trace, review);
  return [
    '# 办公 Agent 轨迹复核记录', '',
    `来源：${trace.kind === 'synthetic' ? '独立虚构演练；没有执行模型，不代表真实项目或效果' : '使用者导入；真实性与完整性由复核者核对'}`,
    '状态：人工记录 · 待最终确认；工具没有执行任务或验证文件。',
    'Case ID：', literalBlock(trace.caseId), '', '## 任务', literalBlock(trace.task), '', '## 轨迹概览',
    `共 ${trace.steps.length} 步；日志显式 error ${errors.length} 步；首个显式报错：${errors[0]?.id ?? '未记录'}。`,
    `人工定位：${review.localization === 'pending' ? '待定位' : review.localization === 'none' ? '复核者记录未发现偏离' : review.firstDeviationId || '尚未选择步骤'}`,
    `现象分类：${traceCategories[review.category]}`, '', '## 定位依据', literalBlock(review.evidence),
    '', '## 原因假设（待验证）', literalBlock(review.hypothesis), '', '## 下一步验证', literalBlock(review.nextTest),
    '', '## 产物验收', ...trace.acceptance.flatMap((item, index) => [`### 要求 ${index + 1}`, literalBlock(item), `人工判断：${acceptanceLabels[review.checks[index].result]}`, '证据：', literalBlock(review.checks[index].evidence)]),
    '', '## 当前记录缺口', ...(gaps.length ? gaps.map((gap) => `- ${gap}`) : ['必要字段已填写；这不代表任务成功或根因得到验证。']),
    '', '## 可观察轨迹', ...trace.steps.flatMap((step, index) => [`\n### 步骤 ${index + 1} · ${step.status}`, literalBlock(`${step.id} · ${step.tool}`), '输入 / 参数：', literalBlock(step.input), '可见返回：', literalBlock(step.output)]),
  ].join('\n');
}

export const syntheticAgentTrace: AgentTrace = {
  version: 1, kind: 'synthetic', caseId: 'DEMO-OFFICE-001',
  task: '独立虚构任务：汇总三条订单，排除已退款与已取消，保存可编辑的销售表，并核对合计。',
  acceptance: ['只纳入 paid 订单，合计应为 120 元。', 'sales-summary.xlsx 可打开，包含状态与金额字段，且原始文件保留。'],
  steps: [
    { id: 'S1', tool: 'read_orders', status: 'ok', input: '读取 orders-demo.csv', output: 'paid: 120；refunded: 80；cancelled: 40。共 3 行。' },
    { id: 'S2', tool: 'aggregate_orders', status: 'ok', input: 'exclude_status: [cancelled]', output: '纳入 paid 与 refunded；合计 200 元。' },
    { id: 'S3', tool: 'save_sheet', status: 'error', input: 'sales-summary.xlsx；合计 200 元', output: '文件占用，保存失败。' },
    { id: 'S4', tool: 'save_sheet', status: 'ok', input: '重试保存 sales-summary.xlsx；合计 200 元', output: '日志声明：文件保存成功。' },
    { id: 'S5', tool: 'final_response', status: 'ok', input: '根据保存返回组织回复', output: '已完成销售表，合计 200 元。' },
  ],
};
