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
};

export const emptyPromptPreflight: PromptPreflightRecord = {
  task: '', audience: '', acceptance: '', unknowns: '', originalPrompt: '', revisedPrompt: '', ambiguity: '',
  humanDecision: '', oneChange: '', testInput: '', originalOutput: '', revisedOutput: '', evidence: '',
};

const fieldLimit = 4000;
const fieldNames = Object.keys(emptyPromptPreflight) as Array<keyof PromptPreflightRecord>;

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
  const resultStatus = outputCount === 0 ? '待执行 · 无输出' : outputCount === 1 ? '只记录了一版输出 · 不可比较' : !record.evidence.trim() ? '已记录两版输出 · 待填写验收证据' : '已记录输出与证据 · 仍需人工判断';
  return { gaps, resultStatus, readyToTest: gaps.length === 0 };
}

export function formatPromptPreflight(record: PromptPreflightRecord) {
  const result = inspectPromptPreflight(record);
  const value = (key: keyof PromptPreflightRecord) => record[key].trim() || '未填写';
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
    '## 拍前待补',
    ...(result.gaps.length ? result.gaps.map((gap) => `- ${gap}`) : ['- 必要字段已填写；尚不代表 Prompt 有效或输出合格。']),
    '',
    '说明：文字差异只表示增删，不判断哪版更好；缺项提醒仅依据空白字段，不分析 Prompt 语义。任何效果判断都需要真实输出与人工验收。',
  ].join('\n');
}

export function parsePromptPreflight(value: string): PromptPreflightRecord | null {
  if (value.length > fieldLimit * fieldNames.length + 1000) return null;
  try {
    const parsed: unknown = JSON.parse(value);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null;
    const source = parsed as Record<string, unknown>;
    if ((source.version !== 1 && source.version !== 2) || !source.record || typeof source.record !== 'object' || Array.isArray(source.record)) return null;
    const input = source.record as Record<string, unknown>;
    if (!fieldNames.every((key) => source.version === 1 && key === 'revisedPrompt' && input[key] === undefined ? true : typeof input[key] === 'string' && (input[key] as string).length <= fieldLimit)) return null;
    return Object.fromEntries(fieldNames.map((key) => [key, input[key] ?? ''])) as PromptPreflightRecord;
  } catch { return null; }
}

export function serializePromptPreflight(record: PromptPreflightRecord) {
  return JSON.stringify({ version: 2, record });
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
