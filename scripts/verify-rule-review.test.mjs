import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { importReviewCsv, exportReviewCsv, parseCsv } from '../lib/rule-review.ts';

const input = readFileSync(new URL('../public/downloads/rule-knowledge-desk-practice-v1.0/test-questions.csv', import.meta.url), 'utf8');

test('built-in questions start unreviewed with no invented output', () => {
  const batch = importReviewCsv(input);
  assert.equal(batch.rows.length, 12);
  assert.ok(batch.rows.every(row => row.status === 'not_reviewed' && row.answer === '' && row.route === ''));
});

test('quoted multiline CSV and metadata survive export/import exactly', () => {
  const batch = importReviewCsv(input);
  batch.runId = "'批次,一"; batch.systemVersion = '=测试'; batch.testedAt = '2026-09-14';
  Object.assign(batch.rows[0], { answer: '=HYPERLINK("example")\n第二行,含逗号', route: 'answer', citation: 'R01 v1.0', citationCheck: 'yes', status: 'pass', note: '\t不要执行公式', errors: ['引用错误'] });
  const csv = exportReviewCsv(batch);
  assert.deepEqual(importReviewCsv(csv), batch);
  const cells = parseCsv(csv)[1];
  assert.ok(cells[4].startsWith("'="));
  assert.ok(cells[11].startsWith("'\t"));
  assert.ok(cells[12].startsWith("''"));
});

test('reject malformed quotes, missing questions and duplicate IDs', () => {
  assert.throws(() => parseCsv('"unfinished'), /引号/);
  assert.throws(() => parseCsv('"closed"x,'), /引号/);
  assert.throws(() => importReviewCsv('test_id,test_type,question_or_condition,queue_state\nQ1,x,,available'), /缺少/);
  assert.throws(() => importReviewCsv('test_id,test_type,question_or_condition,queue_state\nQ1,x,问题,available\nQ1,y,另一题,failed'), /重复/);
  assert.throws(() => importReviewCsv('test_id,test_type,question_or_condition,queue_state\nQ1,x,问题'), /列数/);
  assert.throws(() => importReviewCsv('question,answer\nx,y'), /表头/);
});

test('bound imports and preserve maximum sized escaped fields', () => {
  const batch = importReviewCsv(input);
  batch.rows[0].answer = '=' + '字'.repeat(7999);
  assert.equal(importReviewCsv(exportReviewCsv(batch)).rows[0].answer, batch.rows[0].answer);
  assert.throws(() => parseCsv('x'.repeat(64_000_001)), /64 MB/);
  batch.rows = Array.from({ length: 100 }, (_, i) => ({ ...batch.rows[0], id: `Q${i}`, note: '复核说明'.repeat(2000) }));
  assert.deepEqual(importReviewCsv(exportReviewCsv(batch)), batch);
  assert.throws(() => importReviewCsv('test_id,test_type,question_or_condition,queue_state\n' + Array.from({ length: 101 }, (_, i) => `Q${i},x,问题,available`).join('\n')), /100/);
});

test('reject fabricated completion without output and inconsistent batch metadata', () => {
  const batch = importReviewCsv(input);
  batch.rows[0].status = 'pass';
  assert.throws(() => importReviewCsv(exportReviewCsv(batch)), /缺少实际回答/);
  batch.rows[0].status = 'not_reviewed'; batch.runId = 'same-run';
  assert.throws(() => importReviewCsv(exportReviewCsv(batch).replace('"same-run"', '"other-run"')), /批次信息不一致/);
  assert.throws(() => importReviewCsv(exportReviewCsv(batch).replace('"not_reviewed"', '"unknown"')), /状态/);
});
