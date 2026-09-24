export const acceptanceVerdicts = ['未评', '通过', '未通过', '无法判断'] as const;
export type AcceptanceVerdict = (typeof acceptanceVerdicts)[number];
export type AcceptanceCheck = {
  id: string;
  criterion: string;
  originalVerdict: AcceptanceVerdict;
  originalEvidence: string;
  revisedVerdict: AcceptanceVerdict;
  revisedEvidence: string;
};

export type PromptPreflightRecord = {
  task: string;
  audience: string;
  acceptance: string;
  unknowns: string;
  originalPrompt: string;
  revisedPrompt: string;
  ambiguity: string;
  humanDecision: string;
  oneChange: string;
  testInput: string;
  originalOutput: string;
  revisedOutput: string;
  evidence: string;
  checks: AcceptanceCheck[];
};

export const emptyPromptPreflight: PromptPreflightRecord = {
  task: '', audience: '', acceptance: '', unknowns: '', originalPrompt: '', revisedPrompt: '', ambiguity: '',
  humanDecision: '', oneChange: '', testInput: '', originalOutput: '', revisedOutput: '', evidence: '', checks: [],
};

export function createSyntheticPromptPreflight(): PromptPreflightRecord {
  const originalPrompt = '请从下面的会议记录提取待办，以条目列出动作、负责人和期限。';
  return {
    ...emptyPromptPreflight,
    task: '虚构演练｜从匿名会议记录整理待办',
    audience: '演练中的项目协调人；不对应真实团队或客户',
    acceptance: '逐条列出明确动作；未给出的负责人或期限标为“待确认”，不自行补全。',
    unknowns: '第二项待办的负责人、期限；会议记录没有提供，不能猜测。',
    originalPrompt,
    revisedPrompt: `${originalPrompt}未在记录中出现的负责人或期限标为“待确认”，不要推测。`,
    ambiguity: '原版要求列出负责人和期限，但虚构输入并未为每项待办提供这些信息；缺项该如何写？',
    humanDecision: '本演练设定：缺失字段保留未知，统一写“待确认”；这不是模型自行作出的决定。',
    oneChange: '仅补充负责人或期限缺失时的处理规则，其余要求不变。',
    testInput: '【虚构会议记录】甲负责整理清单，期限为周五。另需确认宣传图片尺寸；记录没有指定这项工作的负责人和期限。',
    checks: [
      { id: 'synthetic-action', criterion: '每条待办都有可辨认的动作。', originalVerdict: '未评', originalEvidence: '', revisedVerdict: '未评', revisedEvidence: '' },
      { id: 'synthetic-owner', criterion: '第二项待办未给出负责人时，明确标为“待确认”，不虚构人名。', originalVerdict: '未评', originalEvidence: '', revisedVerdict: '未评', revisedEvidence: '' },
      { id: 'synthetic-deadline', criterion: '第二项待办未给出期限时，明确标为“待确认”，不推测日期。', originalVerdict: '未评', originalEvidence: '', revisedVerdict: '未评', revisedEvidence: '' },
    ],
  };
}

const fieldLimit = 4000;
export const maxPromptPreflightFileBytes = 512 * 1024;
const fieldNames = Object.keys(emptyPromptPreflight).filter((key) => key !== 'checks') as Array<Exclude<keyof PromptPreflightRecord, 'checks'>>;

export function inspectAcceptanceMatrix(record: PromptPreflightRecord) {
  const issues: string[] = [];
  if (record.checks.length === 0) return { issues: ['尚未添加逐项验收条件。'], complete: false };
  if (!record.originalOutput.trim() || !record.revisedOutput.trim()) issues.push('两版实际输出尚未齐全；逐项验收仍待执行。');
  for (const [index, check] of record.checks.entries()) {
    const label = `验收项 ${index + 1}`;
    if (!check.criterion.trim()) issues.push(`${label}缺少可观察条件。`);
    for (const [name, output, verdict, evidence] of [
      ['原版', record.originalOutput, check.originalVerdict, check.originalEvidence],
      ['新版', record.revisedOutput, check.revisedVerdict, check.revisedEvidence],
    ] as const) {
      if (!output.trim()) {
        if (verdict !== '未评') issues.push(`${label}的${name}没有实际输出，不能保留判定。`);
      } else if (verdict === '未评') issues.push(`${label}的${name}仍待人工判定。`);
      else if (!evidence.trim()) issues.push(`${label}的${name}已判定，但缺少对应证据。`);
    }
  }
  return { issues, complete: issues.length === 0 && Boolean(record.originalOutput.trim() && record.revisedOutput.trim()) };
}

export function inspectPromptPreflight(record: PromptPreflightRecord) {
  const gaps: string[] = [];
  if (!record.task.trim() || !record.audience.trim()) gaps.push('写清任务与使用者，避免只优化一段没有用途的文字。');
  if (!record.acceptance.trim()) gaps.push('写出至少一条可观察的验收条件。');
  if (!record.unknowns.trim()) gaps.push('说明哪些事实不能由模型擅自补全。');
  if (!record.originalPrompt.trim()) gaps.push('保留原 Prompt，下一轮才能看到具体改了什么。');
  if (!record.revisedPrompt.trim()) gaps.push('写出新版 Prompt，才能对照这轮实际修改的文字。');
  if (!record.ambiguity.trim()) gaps.push('列出待确认的歧义；模型建议也需要人工审核。');
  if (!record.humanDecision.trim()) gaps.push('记录由人确认或保留未知的决定。');
  if (!record.oneChange.trim()) gaps.push('限定本轮唯一主要改动；若改动不止一处，应如实记录。');
  if (!record.testInput.trim()) gaps.push('固定同一测试输入，再比较两个版本。');

  const outputCount = Number(Boolean(record.originalOutput.trim())) + Number(Boolean(record.revisedOutput.trim()));
  const matrix = inspectAcceptanceMatrix(record);
  const resultStatus = outputCount === 0 ? '待执行 · 无输出' : outputCount === 1 ? '只记录了一版输出 · 不可比较' : matrix.complete ? '已记录输出与逐项证据 · 仍需人工判断' : !record.evidence.trim() ? '已记录两版输出 · 待填写验收证据' : '已记录输出与证据 · 仍需人工判断';
  return { gaps, matrix, resultStatus, readyToTest: gaps.length === 0 };
}

export function formatPromptPreflight(record: PromptPreflightRecord) {
  const result = inspectPromptPreflight(record);
  const value = (key: Exclude<keyof PromptPreflightRecord, 'checks'>) => record[key].trim() || '未填写';
  return [
    '# Prompt 歧义预检卡',
    '状态：本站编辑工具 · 待荆确认；以下内容由使用者填写，不是模型自动结论。',
    '',
    '## 目标',
    `任务：${value('task')}`,
    `使用者：${value('audience')}`,
    `验收条件：${value('acceptance')}`,
    `不可擅自补全：${value('unknowns')}`,
    '',
    '## 歧义与修改',
    `原 Prompt：${value('originalPrompt')}`,
    `新版 Prompt：${value('revisedPrompt')}`,
    `待查歧义：${value('ambiguity')}`,
    `人工决定：${value('humanDecision')}`,
    `本轮主要改动：${value('oneChange')}`,
    '',
    '## 输出与证据',
    `同一测试输入：${value('testInput')}`,
    `原版实际输出：${record.originalOutput.trim() || '待执行'}`,
    `新版实际输出：${record.revisedOutput.trim() || '待执行'}`,
    `验收证据：${record.evidence.trim() || '待观察'}`,
    `记录状态：${result.resultStatus}`,
    '',
    '## 逐项人工验收（无自动评分）',
    ...(record.checks.length ? record.checks.flatMap((check, index) => [
      `${index + 1}. 条件：${check.criterion.trim() || '未填写'}`,
      `   原版：${check.originalVerdict}；证据：${check.originalEvidence.trim() || '未填写'}`,
      `   新版：${check.revisedVerdict}；证据：${check.revisedEvidence.trim() || '未填写'}`,
    ]) : ['- 尚未添加验收项。']),
    ...(result.matrix.issues.length ? ['待复核：', ...result.matrix.issues.map((issue) => `- ${issue}`)] : ['逐项记录已填写；仍需人工确认判定是否正确。']),
    '',
    '## 拍前待补',
    ...(result.gaps.length ? result.gaps.map((gap) => `- ${gap}`) : ['- 必要字段已填写；尚不代表 Prompt 有效或输出合格。']),
    '',
    '说明：文字差异只表示增删，不判断哪版更好；缺项提醒仅依据空白字段，不分析 Prompt 语义。任何效果判断都需要真实输出与人工验收。',
  ].join('\n');
}

export function parsePromptPreflight(value: string): PromptPreflightRecord | null {
  if (value.length > maxPromptPreflightFileBytes) return null;
  try {
    const parsed: unknown = JSON.parse(value);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null;
    const source = parsed as Record<string, unknown>;
    if (source.format !== undefined && source.format !== 'jing-prompt-preflight') return null;
    if (![1, 2, 3].includes(source.version as number) || !source.record || typeof source.record !== 'object' || Array.isArray(source.record)) return null;
    const input = source.record as Record<string, unknown>;
    if (!fieldNames.every((key) => source.version === 1 && key === 'revisedPrompt' && input[key] === undefined ? true : typeof input[key] === 'string' && (input[key] as string).length <= fieldLimit)) return null;
    const checks = source.version === 3 ? input.checks : [];
    if (!Array.isArray(checks) || checks.length > 8 || !checks.every((check) => {
      if (!check || typeof check !== 'object' || Array.isArray(check)) return false;
      const row = check as Record<string, unknown>;
      return typeof row.id === 'string' && row.id.length > 0 && row.id.length <= 80
        && typeof row.criterion === 'string' && row.criterion.length <= 180
        && acceptanceVerdicts.includes(row.originalVerdict as AcceptanceVerdict)
        && acceptanceVerdicts.includes(row.revisedVerdict as AcceptanceVerdict)
        && typeof row.originalEvidence === 'string' && row.originalEvidence.length <= 1000
        && typeof row.revisedEvidence === 'string' && row.revisedEvidence.length <= 1000;
    })) return null;
    if (new Set(checks.map((check: AcceptanceCheck) => check.id)).size !== checks.length) return null;
    return { ...Object.fromEntries(fieldNames.map((key) => [key, input[key] ?? ''])), checks: checks.map((check: AcceptanceCheck) => ({ id: check.id, criterion: check.criterion, originalVerdict: check.originalVerdict, originalEvidence: check.originalEvidence, revisedVerdict: check.revisedVerdict, revisedEvidence: check.revisedEvidence })) } as PromptPreflightRecord;
  } catch { return null; }
}

export function serializePromptPreflight(record: PromptPreflightRecord) {
  return JSON.stringify({ format: 'jing-prompt-preflight', version: 3, record });
}

export type PromptDiffSegment = { kind: 'same' | 'removed' | 'added'; text: string };
export type PromptTextDiff = { mode: 'exact' | 'coarse'; before: PromptDiffSegment[]; after: PromptDiffSegment[] };

function appendSegment(segments: PromptDiffSegment[], kind: PromptDiffSegment['kind'], text: string) {
  if (!text) return;
  const last = segments[segments.length - 1];
  if (last?.kind === kind) last.text += text;
  else segments.push({ kind, text });
}

export function diffPromptText(before: string, after: string): PromptTextDiff {
  const a = Array.from(before);
  const b = Array.from(after);
  if (a.length > 1200 || b.length > 1200) {
    let start = 0;
    while (start < a.length && start < b.length && a[start] === b[start]) start++;
    let end = 0;
    while (end < a.length - start && end < b.length - start && a[a.length - 1 - end] === b[b.length - 1 - end]) end++;
    const commonStart = a.slice(0, start).join('');
    const commonEnd = end ? a.slice(-end).join('') : '';
    const beforeSegments: PromptDiffSegment[] = [];
    const afterSegments: PromptDiffSegment[] = [];
    appendSegment(beforeSegments, 'same', commonStart);
    appendSegment(afterSegments, 'same', commonStart);
    appendSegment(beforeSegments, 'removed', a.slice(start, a.length - end).join(''));
    appendSegment(afterSegments, 'added', b.slice(start, b.length - end).join(''));
    appendSegment(beforeSegments, 'same', commonEnd);
    appendSegment(afterSegments, 'same', commonEnd);
    return { mode: 'coarse', before: beforeSegments, after: afterSegments };
  }

  const width = b.length + 1;
  const lengths = new Uint16Array((a.length + 1) * width);
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      const cell = i * width + j;
      lengths[cell] = a[i] === b[j] ? lengths[(i + 1) * width + j + 1] + 1 : Math.max(lengths[(i + 1) * width + j], lengths[cell + 1]);
    }
  }
  const beforeSegments: PromptDiffSegment[] = [];
  const afterSegments: PromptDiffSegment[] = [];
  let i = 0;
  let j = 0;
  while (i < a.length || j < b.length) {
    if (i < a.length && j < b.length && a[i] === b[j]) {
      appendSegment(beforeSegments, 'same', a[i]);
      appendSegment(afterSegments, 'same', b[j]);
      i++; j++;
    } else if (i < a.length && (j === b.length || lengths[(i + 1) * width + j] >= lengths[i * width + j + 1])) {
      appendSegment(beforeSegments, 'removed', a[i++]);
    } else {
      appendSegment(afterSegments, 'added', b[j++]);
    }
  }
  return { mode: 'exact', before: beforeSegments, after: afterSegments };
}
