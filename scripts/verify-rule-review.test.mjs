import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { importReviewCsv, exportReviewCsv, exportReviewText, parseCsv } from '../lib/rule-review.ts';

const input = readFileSync(new URL('../public/downloads/rule-knowledge-desk-practice-v1.0/test-questions.csv', import.meta.url), 'utf8');

test('single-question text preserves fields, boundaries and pending states without changing the batch', () => {
  const batch = importReviewCsv(input);
  const before = structuredClone(batch);
  const blank = exportReviewText(batch, batch.rows[0]);
  assert.match(blank, /人工复核结论\n待复核/);
  assert.match(blank, /未勾选（不代表无错误）/);
  assert.match(blank, /未调用模型/);
  assert.match(blank, /恢复整批记录/);
  assert.deepEqual(batch, before);
  Object.assign(batch, { runId: '批次一', ruleVersion: 'v2', systemVersion: '候选系统', testedAt: '演练未执行' });
  Object.assign(batch.rows[0], { answer: '  第一行\n第二行  ', route: 'human_review', citation: 'R02 v2', citationCheck: 'no', queueId: 'QUEUE-001', status: 'needs_review', errors: ['引用错误'], note: '待核对来源' });
  const text = exportReviewText(batch, batch.rows[0]);
  for (const value of ['批次一', 'v2', '候选系统', '演练未执行', batch.rows[0].id, batch.rows[0].type, batch.rows[0].question, batch.rows[0].queue, '  第一行\n第二行  ', '转人工', 'R02 v2', '不支持', 'QUEUE-001', '待讨论', '引用错误', '待核对来源']) assert.ok(text.includes(value), value);
  assert.ok(!text.includes(batch.rows[1].question));
});

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
