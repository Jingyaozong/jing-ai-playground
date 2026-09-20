import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createEmptyEvaluationBatch, evaluationDimensions, evaluationHeaders,
  exportEvaluationCsv, importEvaluationCsv, parseEvaluationCsv, sampleReadinessIssues, summarizeEvaluationBatch,
} from '../lib/multimodal-evaluation.ts';

const encodeRows = (rows) => rows.map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(',')).join('\n');

test('blank desk starts with eight empty dimensions and no invented output', () => {
  const batch = createEmptyEvaluationBatch();
  assert.equal(batch.samples.length, 1);
  assert.equal(batch.samples[0].outputId, '');
  assert.equal(batch.samples[0].dimensions.length, 8);
  assert.ok(batch.samples[0].dimensions.every((dimension) => dimension.result === 'not_reviewed' && dimension.evidence === ''));
});

test('complete records and spreadsheet-safe text survive CSV round-trip', () => {
  const batch = createEmptyEvaluationBatch();
  Object.assign(batch, { batchName: "'第一批", rubricVersion: 'v1.0', evaluator: '=测试者', testedAt: '2026-09-15' });
  const sample = batch.samples[0];
  Object.assign(sample, { outputId: 'OUT-001', taskBrief: '=生成一段街角视频', inputNotes: '参考图,一张', rootCause: 'pending', retestStatus: 'pending', reviewState: 'reviewed', reviewerNote: '\t人工复核完成' });
  sample.dimensions.forEach((dimension, index) => Object.assign(dimension, index === 0 ? { result: 'fail', severity: 'major', timeRange: '00:02-00:03', evidence: '动作与要求不一致\n已复看' } : { result: 'pass' }));
  assert.deepEqual(sampleReadinessIssues(sample), []);
  const csv = exportEvaluationCsv(batch);
  assert.deepEqual(importEvaluationCsv(csv), batch);
  const first = parseEvaluationCsv(csv)[1];
  assert.ok(first[3].startsWith("'="));
  assert.ok(first[7].startsWith("'="));
  assert.ok(first[18].startsWith("'\t"));
});

test('readiness requires identity, all dimensions and evidence for exceptions', () => {
  const sample = createEmptyEvaluationBatch().samples[0];
  assert.equal(sampleReadinessIssues(sample).length, 3);
  Object.assign(sample, { outputId: 'OUT-01', taskBrief: '任务要求' });
  sample.dimensions.forEach((dimension) => { dimension.result = 'pass'; });
  sample.dimensions[0].result = 'uncertain';
  assert.match(sampleReadinessIssues(sample).join('|'), /证据/);
  Object.assign(sample.dimensions[0], { severity: 'minor', timeRange: '00:01', evidence: '画面被遮挡，无法判断' });
  assert.deepEqual(sampleReadinessIssues(sample), []);
});

test('imports reject malformed, incomplete and inconsistent records', () => {
  const rows = parseEvaluationCsv(exportEvaluationCsv(createEmptyEvaluationBatch()));
  assert.throws(() => parseEvaluationCsv('"unfinished'), /引号/);
  assert.throws(() => importEvaluationCsv('wrong,header\na,b'), /表头/);
  assert.throws(() => importEvaluationCsv(encodeRows([rows[0], ...rows.slice(1, -1)])), /完整的八维/);
  const duplicate = structuredClone(rows); duplicate[2][9] = duplicate[1][9]; duplicate[2][10] = duplicate[1][10];
  assert.throws(() => importEvaluationCsv(encodeRows(duplicate)), /维度重复/);
  const inconsistent = structuredClone(rows); inconsistent[2][6] = 'OTHER';
  assert.throws(() => importEvaluationCsv(encodeRows(inconsistent)), /重复信息不一致/);
});

test('CSV schema keeps one stable row for each of eight dimensions', () => {
  const rows = parseEvaluationCsv(exportEvaluationCsv(createEmptyEvaluationBatch()));
  assert.deepEqual(rows[0], evaluationHeaders);
  assert.deepEqual(rows.slice(1).map((row) => row[9]), evaluationDimensions.map(({ id }) => id));
  assert.throws(() => parseEvaluationCsv('x'.repeat(64_000_001)), /64 MB/);
});

test('read-only batch summary reconciles dimensions, gaps and sample states without a score', () => {
  const batch = createEmptyEvaluationBatch();
  const first = batch.samples[0];
  first.dimensions[0].result = 'pass';
  Object.assign(first.dimensions[1], { result: 'fail', severity: 'major', timeRange: '00:02', evidence: '主体边缘破损' });
  first.dimensions[2].result = 'uncertain';
  Object.assign(first, { rootCause: 'pending', retestStatus: 'pending', reviewState: 'needs_discussion' });

  const summary = summarizeEvaluationBatch(batch);
  assert.equal(summary.sampleCount, 1);
  assert.equal(summary.totalDimensionRecords, 8);
  assert.equal(summary.recordedDimensionRecords, 3);
  assert.equal(summary.exceptionRecords, 2);
  assert.equal(summary.evidenceGaps, 1);
  assert.deepEqual(summary.dimensions.map(({ pass, fail, uncertain, notReviewed }) => pass + fail + uncertain + notReviewed), Array(8).fill(1));
  assert.equal(summary.dimensions[2].evidenceGaps, 1);
  assert.equal(summary.rootCauses.pending, 1);
  assert.equal(summary.retestStatuses.pending, 1);
  assert.equal(summary.reviewStates.needs_discussion, 1);
  assert.deepEqual(summary.issues.map(({ sampleIndex, dimensionIndex, result, evidenceGap }) => ({ sampleIndex, dimensionIndex, result, evidenceGap })), [
    { sampleIndex: 0, dimensionIndex: 1, result: 'fail', evidenceGap: false },
    { sampleIndex: 0, dimensionIndex: 2, result: 'uncertain', evidenceGap: true },
  ]);
  assert.equal('score' in summary, false);
});

test('issue locator uses sample positions even when display IDs are duplicated', () => {
  const batch = createEmptyEvaluationBatch();
  const second = structuredClone(batch.samples[0]);
  batch.samples.push(second);
  batch.samples[0].dimensions[4].result = 'fail';
  batch.samples[1].dimensions[4].result = 'uncertain';
  const issues = summarizeEvaluationBatch(batch).issues;
  assert.deepEqual(issues.map(({ sampleIndex, dimensionIndex, sampleId }) => ({ sampleIndex, dimensionIndex, sampleId })), [
    { sampleIndex: 0, dimensionIndex: 4, sampleId: 'LOCAL-001' },
    { sampleIndex: 1, dimensionIndex: 4, sampleId: 'LOCAL-001' },
  ]);
});
