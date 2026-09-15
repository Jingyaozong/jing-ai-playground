export const evaluationDimensions = [
  { id: 'semantic', label: '语义遵循', hint: '主体、数量、属性、动作、场景、风格、情绪、镜头与限制' },
  { id: 'quality', label: '基础画质', hint: '清晰度、模糊、噪点、伪影、边缘与局部纹理' },
  { id: 'aesthetics', label: '美学表现', hint: '构图、焦点、色彩、光影、层次、质感与完成度' },
  { id: 'consistency', label: '主体与场景', hint: '人物身份、服装、物体结构与背景连续性' },
  { id: 'temporal', label: '时序与动作', hint: '动作断裂、瞬移、轨迹、重复与前后状态' },
  { id: 'physics', label: '结构与物理', hint: '肢体、接触、穿模、碰撞、重力、流体与倒影' },
  { id: 'camera', label: '镜头与叙事', hint: '景别、机位、运镜、切换、信息顺序与节奏' },
  { id: 'audio_safety', label: '音画与安全', hint: '嘴型、音效、环境音、音乐连续性与合规风险' },
] as const;

export const evaluationResults = ['not_reviewed', 'pass', 'fail', 'uncertain', 'not_applicable'] as const;
export const evaluationSeverities = ['', 'blocker', 'major', 'minor'] as const;
export const rootCauses = ['', 'pending', 'data', 'rule', 'execution', 'tool_flow', 'model_hypothesis'] as const;
export const retestStatuses = ['', 'not_planned', 'pending', 'passed', 'failed'] as const;
export const sampleReviewStates = ['draft', 'ready_for_review', 'reviewed', 'needs_discussion'] as const;

export type EvaluationDimensionId = typeof evaluationDimensions[number]['id'];
export type EvaluationResult = typeof evaluationResults[number];
export type EvaluationSeverity = typeof evaluationSeverities[number];
export type RootCause = typeof rootCauses[number];
export type RetestStatus = typeof retestStatuses[number];
export type SampleReviewState = typeof sampleReviewStates[number];

export type DimensionReview = {
  dimensionId: EvaluationDimensionId;
  result: EvaluationResult;
  severity: EvaluationSeverity;
  timeRange: string;
  evidence: string;
};

export type EvaluationSample = {
  sampleId: string;
  outputId: string;
  taskBrief: string;
  inputNotes: string;
  dimensions: DimensionReview[];
  rootCause: RootCause;
  retestStatus: RetestStatus;
  reviewState: SampleReviewState;
  reviewerNote: string;
};

export type EvaluationBatch = {
  batchName: string;
  rubricVersion: string;
  evaluator: string;
  testedAt: string;
  samples: EvaluationSample[];
};

export type EvaluationDimensionSummary = {
  dimensionId: EvaluationDimensionId;
  label: string;
  notReviewed: number;
  pass: number;
  fail: number;
  uncertain: number;
  notApplicable: number;
  evidenceGaps: number;
};

export type EvaluationBatchSummary = {
  sampleCount: number;
  totalDimensionRecords: number;
  recordedDimensionRecords: number;
  exceptionRecords: number;
  evidenceGaps: number;
  dimensions: EvaluationDimensionSummary[];
  rootCauses: Record<RootCause, number>;
  retestStatuses: Record<RetestStatus, number>;
  reviewStates: Record<SampleReviewState, number>;
};

export const evaluationHeaders = [
  'format_marker', 'batch_name', 'rubric_version', 'evaluator', 'tested_at',
  'sample_id', 'output_id', 'task_brief', 'input_notes', 'dimension_id',
  'dimension_label', 'result', 'severity', 'time_range', 'evidence',
  'root_cause', 'retest_status', 'review_state', 'reviewer_note', 'csv_encoding',
];

const FORMAT_MARKER = 'jing-multimodal-evaluation-v1';
const MAX_SAMPLES = 30;
const MAX_ROWS = MAX_SAMPLES * evaluationDimensions.length;
const MAX_FIELD = 8_000;
export const MAX_EVALUATION_CSV_BYTES = 64_000_000;

export function createEmptySample(index = 1): EvaluationSample {
  return {
    sampleId: `LOCAL-${String(index).padStart(3, '0')}`,
    outputId: '', taskBrief: '', inputNotes: '', rootCause: '', retestStatus: '', reviewState: 'draft', reviewerNote: '',
    dimensions: evaluationDimensions.map(({ id }) => ({ dimensionId: id, result: 'not_reviewed', severity: '', timeRange: '', evidence: '' })),
  };
}

export function createEmptyEvaluationBatch(): EvaluationBatch {
  return { batchName: '', rubricVersion: '', evaluator: '', testedAt: '', samples: [createEmptySample()] };
}

export function sampleReadinessIssues(sample: EvaluationSample): string[] {
  const issues: string[] = [];
  if (!sample.sampleId.trim()) issues.push('缺少样本 ID');
  if (!sample.outputId.trim()) issues.push('缺少输出文件 ID');
  if (!sample.taskBrief.trim()) issues.push('缺少 Prompt 或任务要求');
  const pending = sample.dimensions.filter((dimension) => dimension.result === 'not_reviewed');
  if (pending.length) issues.push(`还有 ${pending.length} 个维度未记录`);
  const evidenceGaps = sample.dimensions.filter((dimension) => ['fail', 'uncertain'].includes(dimension.result) && (!dimension.severity || !dimension.timeRange.trim() || !dimension.evidence.trim()));
  if (evidenceGaps.length) issues.push(`${evidenceGaps.length} 个异常维度缺少严重度、时间段或证据`);
  return issues;
}

function dimensionHasEvidenceGap(dimension: DimensionReview) {
  return ['fail', 'uncertain'].includes(dimension.result)
    && (!dimension.severity || !dimension.timeRange.trim() || !dimension.evidence.trim());
}

export function summarizeEvaluationBatch(batch: EvaluationBatch): EvaluationBatchSummary {
  const dimensions = evaluationDimensions.map(({ id, label }) => {
    const records = batch.samples.map((sample) => sample.dimensions.find((dimension) => dimension.dimensionId === id));
    return {
      dimensionId: id,
      label,
      notReviewed: records.filter((record) => !record || record.result === 'not_reviewed').length,
      pass: records.filter((record) => record?.result === 'pass').length,
      fail: records.filter((record) => record?.result === 'fail').length,
      uncertain: records.filter((record) => record?.result === 'uncertain').length,
      notApplicable: records.filter((record) => record?.result === 'not_applicable').length,
      evidenceGaps: records.filter((record) => record && dimensionHasEvidenceGap(record)).length,
    };
  });
  const allDimensions = batch.samples.flatMap((sample) => sample.dimensions);
  const countSamples = <T extends string>(values: readonly T[], pick: (sample: EvaluationSample) => T) => Object.fromEntries(
    values.map((value) => [value, batch.samples.filter((sample) => pick(sample) === value).length]),
  ) as Record<T, number>;

  return {
    sampleCount: batch.samples.length,
    totalDimensionRecords: batch.samples.length * evaluationDimensions.length,
    recordedDimensionRecords: allDimensions.filter((dimension) => dimension.result !== 'not_reviewed').length,
    exceptionRecords: allDimensions.filter((dimension) => ['fail', 'uncertain'].includes(dimension.result)).length,
    evidenceGaps: allDimensions.filter(dimensionHasEvidenceGap).length,
    dimensions,
    rootCauses: countSamples(rootCauses, (sample) => sample.rootCause),
    retestStatuses: countSamples(retestStatuses, (sample) => sample.retestStatus),
    reviewStates: countSamples(sampleReviewStates, (sample) => sample.reviewState),
  };
}

export function parseEvaluationCsv(text: string): string[][] {
  if (text.length > MAX_EVALUATION_CSV_BYTES) throw new Error('CSV 超过 64 MB，请拆成较小批次。');
  const source = text.replace(/^\uFEFF/, '');
  const rows: string[][] = [];
  let row: string[] = [], field = '', quoted = false, closed = false;
  const endField = () => { row.push(field); field = ''; closed = false; };
  const endRow = () => {
    endField();
    if (row.some((value) => value !== '')) rows.push(row);
    row = [];
    if (rows.length > MAX_ROWS + 1) throw new Error(`每批最多导入 ${MAX_SAMPLES} 个样本。`);
  };
  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    if (quoted) {
      if (char === '"') {
        if (source[index + 1] === '"') { field += '"'; index += 1; }
        else { quoted = false; closed = true; }
      } else field += char;
    } else if (char === ',') endField();
    else if (char === '\n' || char === '\r') {
      if (char === '\r' && source[index + 1] === '\n') index += 1;
      endRow();
    } else if (char === '"' && field === '' && !closed) quoted = true;
    else {
      if (closed || char === '"') throw new Error('CSV 引号格式不正确，请使用本工具导出的文件。');
      field += char;
    }
    if (field.length > MAX_FIELD + 1) throw new Error('单个字段不能超过 8,000 字符。');
  }
  if (quoted) throw new Error('CSV 存在未闭合的引号。');
  if (field || row.length || closed) endRow();
  return rows;
}

export function exportEvaluationCsv(batch: EvaluationBatch): string {
  const cell = (value: string) => {
    const safe = /^[\s]*[=+@\-']/.test(value) || /^[\t\r\n]/.test(value) ? `'${value}` : value;
    return `"${safe.replaceAll('"', '""')}"`;
  };
  const rows = batch.samples.flatMap((sample) => sample.dimensions.map((dimension) => {
    const definition = evaluationDimensions.find(({ id }) => id === dimension.dimensionId);
    return [
      FORMAT_MARKER, batch.batchName, batch.rubricVersion, batch.evaluator, batch.testedAt,
      sample.sampleId, sample.outputId, sample.taskBrief, sample.inputNotes, dimension.dimensionId,
      definition?.label ?? '', dimension.result, dimension.severity, dimension.timeRange, dimension.evidence,
      sample.rootCause, sample.retestStatus, sample.reviewState, sample.reviewerNote, 'apostrophe-v1',
    ];
  }));
  return '\uFEFF' + [evaluationHeaders, ...rows].map((row) => row.map(cell).join(',')).join('\r\n');
}

export function importEvaluationCsv(text: string): EvaluationBatch {
  const [header, ...data] = parseEvaluationCsv(text);
  if (!header || !data.length || header.join('|') !== evaluationHeaders.join('|')) throw new Error('表头不匹配：请选择本评测记录台导出的 CSV。');
  const samples = new Map<string, EvaluationSample>();
  const sampleMeta = new Map<string, string>();
  let batchMeta: string | undefined;

  data.forEach((values, rowIndex) => {
    if (values.length !== evaluationHeaders.length) throw new Error(`第 ${rowIndex + 2} 行列数与表头不一致。`);
    if (values[19] !== 'apostrophe-v1') throw new Error('CSV 文本编码标记无效。');
    const cells = values.map((value) => value.startsWith("'") ? value.slice(1) : value);
    if (cells.some((value) => value.length > MAX_FIELD)) throw new Error('单个字段不能超过 8,000 字符。');
    const [marker, batchName, rubricVersion, evaluator, testedAt, sampleId, outputId, taskBrief, inputNotes, dimensionId, dimensionLabel, result, severity, timeRange, evidence, rootCause, retestStatus, reviewState, reviewerNote] = cells;
    if (marker !== FORMAT_MARKER) throw new Error('CSV 格式版本无效。');
    if (!sampleId.trim() || sampleId !== sampleId.trim() || sampleId.length > 80 || /[\r\n]/.test(sampleId)) throw new Error(`第 ${rowIndex + 2} 行的样本 ID 无效。`);
    const batchKey = JSON.stringify([batchName, rubricVersion, evaluator, testedAt]);
    if (batchMeta && batchMeta !== batchKey) throw new Error('同一份 CSV 中的批次信息不一致。');
    batchMeta = batchKey;
    const definition = evaluationDimensions.find(({ id }) => id === dimensionId);
    if (!definition || definition.label !== dimensionLabel) throw new Error(`样本 ${sampleId} 的评测维度无效。`);
    if (!evaluationResults.includes(result as EvaluationResult) || !evaluationSeverities.includes(severity as EvaluationSeverity) || !rootCauses.includes(rootCause as RootCause) || !retestStatuses.includes(retestStatus as RetestStatus) || !sampleReviewStates.includes(reviewState as SampleReviewState)) throw new Error(`样本 ${sampleId} 包含无效状态。`);
    if (['pass', 'not_applicable', 'not_reviewed'].includes(result) && severity) throw new Error(`样本 ${sampleId} 的严重度与维度结果冲突。`);
    const metaKey = JSON.stringify([outputId, taskBrief, inputNotes, rootCause, retestStatus, reviewState, reviewerNote]);
    if (sampleMeta.has(sampleId) && sampleMeta.get(sampleId) !== metaKey) throw new Error(`样本 ${sampleId} 的重复信息不一致。`);
    sampleMeta.set(sampleId, metaKey);
    if (!samples.has(sampleId)) samples.set(sampleId, { sampleId, outputId, taskBrief, inputNotes, rootCause: rootCause as RootCause, retestStatus: retestStatus as RetestStatus, reviewState: reviewState as SampleReviewState, reviewerNote, dimensions: [] });
    const sample = samples.get(sampleId)!;
    if (sample.dimensions.some((dimension) => dimension.dimensionId === dimensionId)) throw new Error(`样本 ${sampleId} 的维度重复。`);
    sample.dimensions.push({ dimensionId: dimensionId as EvaluationDimensionId, result: result as EvaluationResult, severity: severity as EvaluationSeverity, timeRange, evidence });
  });

  if (samples.size > MAX_SAMPLES) throw new Error(`每批最多导入 ${MAX_SAMPLES} 个样本。`);
  for (const sample of samples.values()) {
    if (sample.dimensions.length !== evaluationDimensions.length || evaluationDimensions.some(({ id }) => !sample.dimensions.some((dimension) => dimension.dimensionId === id))) throw new Error(`样本 ${sample.sampleId} 没有完整的八维记录。`);
    sample.dimensions.sort((left, right) => evaluationDimensions.findIndex(({ id }) => id === left.dimensionId) - evaluationDimensions.findIndex(({ id }) => id === right.dimensionId));
    if (sample.reviewState === 'reviewed' && sampleReadinessIssues(sample).length) throw new Error(`样本 ${sample.sampleId} 标记为已复核，但记录仍不完整。`);
  }
  const [batchName = '', rubricVersion = '', evaluator = '', testedAt = ''] = JSON.parse(batchMeta ?? '[]');
  return { batchName, rubricVersion, evaluator, testedAt, samples: [...samples.values()] };
}
