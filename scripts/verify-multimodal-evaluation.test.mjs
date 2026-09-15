import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createEmptyEvaluationBatch, evaluationDimensions, evaluationHeaders,
  exportEvaluationCsv, importEvaluationCsv, parseEvaluationCsv, sampleReadinessIssues,
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
