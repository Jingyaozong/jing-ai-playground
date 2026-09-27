export const trialTimeLogHeaders = [
  'sample_id', 'batch_id', 'rule_version', 'risk_tier', 'risk_reason',
  'work_minutes', 'planned_review_minutes', 'extra_rework_minutes',
  'pause_minutes', 'pause_reason', 'review_role', 'record_status', 'notes',
] as const;

export type TrialTimeSummary = {
  total: number;
  regularCount: number;
  highRiskCount: number;
  regularMinutes: number;
  highRiskMinutes: number;
  highRiskShare: number;
};

const maxRows = 500;
const maxCharacters = 1_000_000;

function parseRows(input: string): string[][] {
  if (input.length > maxCharacters) throw new Error('文件过大；最多读取约 1 MB 的 CSV。');
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;
  let closedQuote = false;
  const text = input.replace(/^\uFEFF/, '');

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (quoted) {
      if (char === '"' && text[index + 1] === '"') { field += '"'; index += 1; }
      else if (char === '"') { quoted = false; closedQuote = true; }
      else field += char;
      continue;
    }
    if (char === '"') {
      if (field !== '' || closedQuote) throw new Error(`第 ${rows.length + 1} 行的引号格式不正确。`);
      quoted = true;
    } else if (char === ',') {
      row.push(field); field = ''; closedQuote = false;
    } else if (char === '\n' || char === '\r') {
      if (char === '\r' && text[index + 1] === '\n') index += 1;
      row.push(field); field = ''; closedQuote = false;
      if (row.some((value) => value !== '')) rows.push(row);
      row = [];
      if (rows.length > maxRows + 1) throw new Error(`最多读取 ${maxRows} 条记录。`);
    } else {
      if (closedQuote) throw new Error(`第 ${rows.length + 1} 行的引号后有多余字符。`);
      field += char;
    }
  }
  if (quoted) throw new Error('CSV 有未闭合的引号。');
  if (row.length || field !== '') {
    row.push(field);
    if (row.some((value) => value !== '')) rows.push(row);
  }
  if (rows.length > maxRows + 1) throw new Error(`最多读取 ${maxRows} 条记录。`);
  return rows;
}

function requiredMinutes(value: string, row: number, name: string, allowZero: boolean): number {
  const trimmed = value.trim();
  const number = Number(trimmed);
  if (!/^\d+(?:\.\d+)?$/.test(trimmed) || !Number.isFinite(number) || number < (allowZero ? 0 : 0.5) || number > 480) {
    throw new Error(`第 ${row} 行的 ${name} 必须明确填写 ${allowZero ? '0–480' : '0.5–480'} 分钟。`);
  }
  return number;
}

export function summarizeTrialTimeLog(input: string): TrialTimeSummary {
  const rows = parseRows(input);
  if (!rows.length || rows[0].length !== trialTimeLogHeaders.length
    || rows[0].some((value, index) => value.trim() !== trialTimeLogHeaders[index])) {
    throw new Error('CSV 表头与空白模板不一致，请使用页面提供的模板。');
  }
  if (rows.length === 1) throw new Error('模板尚无记录；请填入已核对的逐条耗时后再导入。');

  const ids = new Set<string>();
  let regularCount = 0;
  let highRiskCount = 0;
  let regularTotal = 0;
  let highRiskTotal = 0;

  for (let index = 1; index < rows.length; index += 1) {
    const line = index + 1;
    const row = rows[index];
    if (row.length !== trialTimeLogHeaders.length) throw new Error(`第 ${line} 行字段数不对，请检查逗号和引号。`);
    const id = row[0].trim();
    if (!id || ids.has(id)) throw new Error(`第 ${line} 行 sample_id 为空或重复。`);
    ids.add(id);
    const tier = row[3].trim();
    if (tier !== 'regular' && tier !== 'high-risk') throw new Error(`第 ${line} 行 risk_tier 只能填 regular 或 high-risk。`);
    if (row[11].trim() !== 'reviewed') throw new Error(`第 ${line} 行尚未标记 reviewed；请先人工核对耗时记录。`);
    const minutes = requiredMinutes(row[5], line, 'work_minutes', false)
      + requiredMinutes(row[6], line, 'planned_review_minutes', true);
    if (minutes > 480) throw new Error(`第 ${line} 行计划内处理与复核合计超过 480 分钟，请先核对异常值。`);
    if (tier === 'regular') { regularCount += 1; regularTotal += minutes; }
    else { highRiskCount += 1; highRiskTotal += minutes; }
  }
  if (!regularCount || !highRiskCount) throw new Error('需要同时有常规和高风险记录，才能填入两类平均耗时；另一类请先手动估算。');
  const total = regularCount + highRiskCount;
  const oneDecimal = (value: number) => Math.round(value * 10) / 10;
  return {
    total,
    regularCount,
    highRiskCount,
    regularMinutes: oneDecimal(regularTotal / regularCount),
    highRiskMinutes: oneDecimal(highRiskTotal / highRiskCount),
    highRiskShare: oneDecimal(highRiskCount / total * 100),
  };
}
