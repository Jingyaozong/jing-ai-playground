import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { countsAsCompletedRecord, localExportNotice, localExportEvidenceSummary, markdownTableRow, needsOriginalEvidence } from '../app/data/experiment-export-boundary.ts';
import { updateRecordScore } from '../app/data/experiment-record-state.ts';

test('local export distinguishes a marked state from source evidence', () => {
  const rows = [
    { id: 'A01', status: 'generated', asset: '' },
    { id: 'A02', status: 'reviewed', asset: ' A02.mp4 ' },
    { id: 'A03', status: 'untested', asset: '' },
  ];
  const summary = localExportEvidenceSummary(rows);
  assert.match(summary, /已有输出：2 条/);
  assert.match(summary, /未填写原始素材：1 条（A01）/);
  assert.match(summary, /填写路径也不等于素材已核验/);
  assert.match(localExportNotice, /不会更新网站公开实验进度/);
});

test('every experiment record export carries the local-only boundary', () => {
  const boards = [
    'experiment-record-board', 'reference-comparison-board', 'rain-follow-record-board',
    'lighting-continuity-board', 'shadow-offset-record-board', 'contact-action-record-board',
    'storyboard-audit-board', 'poster-story-audit-board', 'waterline-motion-record-board',
  ];
  for (const board of boards) {
    const source = readFileSync(new URL(`../app/components/${board}.tsx`, import.meta.url), 'utf8');
    assert.match(source, /localExportNotice/);
    assert.match(source, /localExportEvidenceSummary\(records\)/);
    assert.match(source, /markdownTableRow\(\[/);
  }
});

test('Markdown cells keep pipes, backslashes and multiline text inside one row', () => {
  const row = markdownTableRow(['A01', '左|右\r\n下一行', 'path\\|v2', null, 0]);
  assert.equal(row, String.raw`| A01 | 左\|右 ↵ 下一行 | path\\\|v2 | — | 0 |`);
  assert.equal(row.split('\n').length, 1);

  const separators = [...row.matchAll(/\|/g)].filter((match) => {
    const prefix = row.slice(0, match.index);
    return (prefix.match(/\\+$/)?.[0].length ?? 0) % 2 === 0;
  });
  assert.equal(separators.length, 6);
  assert.equal(markdownTableRow(['备注\n第二行', '制表\t符']), '| 备注 ↵ 第二行 | 制表 符 |');
});

test('completed local review without an original file prompts for evidence', () => {
  assert.equal(needsOriginalEvidence('reviewed', ''), true);
  assert.equal(needsOriginalEvidence('reviewed', '   '), true);
  assert.equal(needsOriginalEvidence('reviewed', 'A01.mp4'), false);
  assert.equal(needsOriginalEvidence('generated', ''), false);
  assert.equal(needsOriginalEvidence('untested', ''), false);

  const boards = [
    'experiment-record-board', 'reference-comparison-board', 'rain-follow-record-board',
    'lighting-continuity-board', 'shadow-offset-record-board', 'contact-action-record-board',
    'storyboard-audit-board', 'poster-story-audit-board', 'waterline-motion-record-board',
  ];
  for (const board of boards) {
    const source = readFileSync(new URL(`../app/components/${board}.tsx`, import.meta.url), 'utf8');
    assert.match(source, /<RecordEvidenceReminder status=\{active\.status\} asset=\{active\.asset\} \/>/);
  }
});

test('completion counts only locally reviewed rows with a source field and all four scores', () => {
  const fullScores = [3, 4, 2, 5];
  assert.equal(countsAsCompletedRecord('reviewed', ' A01.mp4 ', fullScores), true);
  assert.equal(countsAsCompletedRecord('reviewed', ' ', fullScores), false);
  assert.equal(countsAsCompletedRecord('generated', 'A01.mp4', fullScores), false);
  assert.equal(countsAsCompletedRecord('untested', 'A01.mp4', fullScores), false);
  assert.equal(countsAsCompletedRecord('reviewed', 'A01.mp4', [3, null, 2, 5]), false);
  assert.equal(countsAsCompletedRecord('reviewed', 'A01.mp4', []), false);
  assert.equal(countsAsCompletedRecord('reviewed', 'A01.mp4', [3, 4, Number.NaN, 5]), false);

  const boards = [
    'experiment-record-board', 'reference-comparison-board', 'rain-follow-record-board',
    'lighting-continuity-board', 'shadow-offset-record-board', 'contact-action-record-board',
    'storyboard-audit-board', 'poster-story-audit-board', 'waterline-motion-record-board',
  ];
  for (const board of boards) {
    const source = readFileSync(new URL(`../app/components/${board}.tsx`, import.meta.url), 'utf8');
    assert.match(source, /return countsAsCompletedRecord\(record\.status, record\.asset, scoreLabels\.map/);
    assert.match(source, /已复核 · 评分与素材栏齐全/);
  }
});

test('scoring never promotes a record to generated or reviewed, including after save and restore', () => {
  for (const status of ['untested', 'generated', 'reviewed']) {
    const original = [
      { id: 'A01', status, asset: 'A01.md', note: '人工备注', scores: { coverage: null, causality: null, shootability: null, timing: null } },
      { id: 'A02', status: 'untested', asset: '', scores: { coverage: null, causality: null, shootability: null, timing: null } },
    ];
    const before = structuredClone(original);
    let records = original;
    for (const key of Object.keys(original[0].scores)) {
      records = updateRecordScore(records, 'A01', key, 4);
      assert.equal(records[0].status, status);
      assert.equal(records[1], original[1]);
    }
    assert.deepEqual(original, before, 'the existing record must not be mutated');
    records = JSON.parse(JSON.stringify(records));
    assert.equal(records[0].status, status);
    assert.equal(records[0].note, '人工备注');
    assert.equal(countsAsCompletedRecord(records[0].status, records[0].asset, Object.values(records[0].scores)), status === 'reviewed');

    records = updateRecordScore(records, 'A01', 'timing', null);
    assert.equal(records[0].status, status);
    assert.equal(countsAsCompletedRecord(records[0].status, records[0].asset, Object.values(records[0].scores)), false);
    assert.deepEqual(records[0].scores, { coverage: 4, causality: 4, shootability: 4, timing: null });
  }
});

test('numeric cell IDs remain distinct from string IDs when scoring', () => {
  const records = [{ id: 1, status: 'untested', scores: { identity: null } }, { id: '1', status: 'generated', scores: { identity: 2 } }];
  const updated = updateRecordScore(records, 1, 'identity', 5);
  assert.equal(updated[0].scores.identity, 5);
  assert.equal(updated[0].status, 'untested');
  assert.equal(updated[1], records[1]);
});
