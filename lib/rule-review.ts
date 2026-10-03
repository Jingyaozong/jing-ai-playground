export const reviewStatuses = ['not_reviewed', 'pass', 'fail', 'needs_review'] as const;
export const routes = ['', 'answer', 'clarify', 'human_review', 'out_of_scope', 'queue_failed', 'answer_with_data_minimization'] as const;
export const errorTags = ['无据回答', '引用错误', '遗漏限制', '未先澄清', '应转未转', '越权操作', '转交状态错误', '其他'] as const;
export type ReviewStatus = typeof reviewStatuses[number];
export type ReviewRoute = typeof routes[number];
export type ReviewRow = {
  id: string; type: string; question: string; queue: string;
  answer: string; route: ReviewRoute; citation: string;
  citationCheck: '' | 'yes' | 'no' | 'not_applicable';
  queueId: string; status: ReviewStatus; errors: string[]; note: string;
};
export type ReviewBatch = { runId: string; ruleVersion: string; systemVersion: string; testedAt: string; rows: ReviewRow[] };
export const questionHeaders = ['test_id', 'test_type', 'question_or_condition', 'queue_state'];
export const reviewHeaders = [...questionHeaders, 'actual_answer', 'actual_route', 'cited_rule', 'citation_supports_answer', 'queue_record_id', 'review_status', 'error_tags', 'reviewer_note', 'run_id', 'rule_version', 'system_version', 'tested_at', 'csv_encoding'];
const MAX_ROWS = 100;
const MAX_FIELD = 8000;
// Fits a fully populated 100-row export, including UTF-8 and CSV escaping.
export const MAX_CSV_BYTES = 64_000_000;

// A single-question plain-text handoff, not a restorable batch or automated verdict.
export function exportReviewText(batch: ReviewBatch, row: ReviewRow): string {
  const field = (label: string, value: string) => `${label}\n${value.trim() ? value : '未记录'}`;
  const statuses: Record<ReviewStatus, string> = { not_reviewed: '待复核', pass: '人工通过', fail: '不通过', needs_review: '待讨论' };
  const routeLabels = ['尚未记录', '直接回答', '先澄清', '转人工', '范围外', '转交失败', '最小信息回答'];
  const checks = { '': '尚未检查', yes: '支持', no: '不支持', not_applicable: '不适用' };
  return [
    '规则答疑 · 单题人工记录',
    '状态：由填写者记录；工具未调用模型，也未验证答案或引用。',
    '来源：内置题目为独立虚构演练；导入题目的来源与授权须自行核对。',
    field('批次名称', batch.runId), field('规则版本', batch.ruleVersion),
    field('待测系统或版本', batch.systemVersion), field('执行时间', batch.testedAt),
    field('题目 ID', row.id), field('题目类型', row.type), field('当前问题', row.question),
    field('题目中的队列条件', row.queue), field('实际回答', row.answer),
    `实际处理方式\n${routeLabels[routes.indexOf(row.route)]}`,
    field('引用规则与版本', row.citation), `引用支持结论吗\n${checks[row.citationCheck]}`,
    field('人工队列记录编号', row.queueId),
    `错误标签\n${row.errors.length ? row.errors.join('、') : '未勾选（不代表无错误）'}`,
    field('复核说明', row.note), `人工复核结论\n${statuses[row.status]}`,
    '此副本仅包含当前题目。恢复整批记录请使用本工具导出的复核 CSV。',
  ].join('\n\n');
}

// Read quoted fields, embedded newlines and escaped quotes without treating CSV as code.
export function parseCsv(text: string): string[][] {
  if (text.length > MAX_CSV_BYTES) throw new Error('CSV 超过 64 MB，请缩小批次。');
  const source = text.replace(/^\uFEFF/, '');
  const rows: string[][] = [];
  let row: string[] = [], field = '', quoted = false, closed = false;
  const endField = () => { row.push(field); field = ''; closed = false; };
  const endRow = () => { endField(); if (row.some(value => value !== '')) rows.push(row); row = []; if (rows.length > MAX_ROWS + 1) throw new Error('每批最多导入 100 条题目。'); };
  for (let i = 0; i < source.length; i++) {
    const char = source[i];
    if (quoted) {
      if (char === '"') { if (source[i + 1] === '"') { field += '"'; i++; } else { quoted = false; closed = true; } }
      else field += char;
    } else if (char === ',') endField();
    else if (char === '\n' || char === '\r') { if (char === '\r' && source[i + 1] === '\n') i++; endRow(); }
    else if (char === '"' && field === '' && !closed) quoted = true;
    else { if (closed || char === '"') throw new Error('CSV 引号格式不正确，请使用标准 CSV 导出。'); field += char; }
    if (field.length > MAX_FIELD + 1) throw new Error('单个字段不能超过 8,000 字符。');
  }
  if (quoted) throw new Error('CSV 存在未闭合的引号。');
  if (field || row.length || closed) endRow();
  return rows;
}

export function importReviewCsv(text: string): ReviewBatch {
  const [header, ...data] = parseCsv(text);
  if (!header || !data.length) throw new Error('CSV 需要表头和至少一条题目。');
  const isReview = header.join('|') === reviewHeaders.join('|');
  if (!isReview && header.join('|') !== questionHeaders.join('|')) throw new Error('表头不匹配：请选择演练包的 test-questions.csv，或本工具导出的复核 CSV。');
  const ids = new Set<string>();
  let metadata: string[] | undefined;
  const rows = data.map((values, index): ReviewRow => {
    if (values.length !== header.length) throw new Error(`第 ${index + 2} 行列数与表头不一致。`);
    if (isReview && values[16] !== 'apostrophe-v1') throw new Error('复核文件的文本编码标记无效。');
    // Our exports escape spreadsheet formula prefixes; decode only our marked format.
    const cells = isReview ? values.map(value => value.startsWith("'") ? value.slice(1) : value) : values;
    if (cells.some(value => value.length > MAX_FIELD)) throw new Error('单个字段不能超过 8,000 字符。');
    const [id, type, question, queue] = cells;
    if (!id.trim() || !question.trim()) throw new Error(`第 ${index + 2} 行缺少题目 ID 或问题。`);
    if (id.length > 80 || id !== id.trim() || /[\r\n]/.test(id)) throw new Error('题目 ID 应为不超过 80 字符的单行文字，且没有首尾空格。');
    if (ids.has(id)) throw new Error(`题目 ID 重复：${id}`);
    ids.add(id);
    if (!isReview) return { id, type, question, queue, answer: '', route: '', citation: '', citationCheck: '', queueId: '', status: 'not_reviewed', errors: [], note: '' };
    const [, , , , answer, route, citation, citationCheck, queueId, status, tags, note] = cells;
    if (!routes.includes(route as ReviewRoute) || !reviewStatuses.includes(status as ReviewStatus) || !['', 'yes', 'no', 'not_applicable'].includes(citationCheck)) throw new Error(`题目 ${id} 的复核状态或处理方式无效。`);
    if ((status === 'pass' || status === 'fail') && (!answer.trim() || !route)) throw new Error(`题目 ${id} 有结论，但缺少实际回答或处理方式。`);
    const errors = tags ? tags.split('|') : [];
    if (errors.some(tag => !errorTags.includes(tag as typeof errorTags[number])) || new Set(errors).size !== errors.length) throw new Error(`题目 ${id} 的错误标签无效。`);
    const current = cells.slice(12, 16);
    if (metadata && JSON.stringify(metadata) !== JSON.stringify(current)) throw new Error('同一份 CSV 中的批次信息不一致。');
    metadata = current;
    return { id, type, question, queue, answer, route: route as ReviewRoute, citation, citationCheck: citationCheck as ReviewRow['citationCheck'], queueId, status: status as ReviewStatus, errors, note };
  });
  const [runId = '', ruleVersion = '', systemVersion = '', testedAt = ''] = metadata ?? [];
  return { runId, ruleVersion, systemVersion, testedAt, rows };
}

export function exportReviewCsv(batch: ReviewBatch): string {
  const cell = (value: string) => {
    const safe = /^[\s]*[=+@\-']/.test(value) || /^[\t\r\n]/.test(value) ? `'${value}` : value;
    return `"${safe.replaceAll('"', '""')}"`;
  };
  return '\uFEFF' + [reviewHeaders, ...batch.rows.map(row => [row.id, row.type, row.question, row.queue, row.answer, row.route, row.citation, row.citationCheck, row.queueId, row.status, row.errors.join('|'), row.note, batch.runId, batch.ruleVersion, batch.systemVersion, batch.testedAt, 'apostrophe-v1'])].map(row => row.map(cell).join(',')).join('\r\n');
}
