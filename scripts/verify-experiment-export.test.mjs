import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { countsAsCompletedRecord, localExportNotice, localExportEvidenceSummary, markdownTableRow, needsOriginalEvidence } from '../app/data/experiment-export-boundary.ts';
import { updateRecordScore } from '../app/data/experiment-record-state.ts';
import { writeLocalRecordSnapshot } from '../app/data/local-record-save.ts';
import { restoreStoryboardDraft } from '../app/data/storyboard-record-draft.ts';
import { restoreExperimentRecordDraft } from '../app/data/experiment-record-draft.ts';
import { createLocalRecordBackup, localRecordBackupFilename } from '../app/data/local-record-backup.ts';

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

test('local save reports successful writes and quota or permission failures', () => {
  const writes = [];
  assert.equal(writeLocalRecordSnapshot({ setItem: (key, value) => writes.push([key, value]) }, 'A', '[1]'), true);
  assert.deepEqual(writes, [['A', '[1]']]);
  assert.equal(writeLocalRecordSnapshot({ setItem: () => { throw new Error('quota exceeded'); } }, 'A', '[2]'), false);
});

test('storyboard drafts restore valid edits and reject broken rows before the board can use them', () => {
  const defaults = ['A01', 'A02'].map((id) => ({
    id, group: 'A', task: id === 'A01' ? '忘记昨天' : '第七码头',
    status: 'untested', model: '', asset: '', shotCount: '', duration: '',
    scores: { coverage: null, causality: null, shootability: null, timing: null },
    failures: [], note: '',
  }));
  const saved = structuredClone(defaults);
  saved[0].status = 'reviewed';
  saved[0].asset = 'A01.md';
  saved[0].scores.coverage = 4;
  saved[0].note = '实测备注';

  const restored = restoreStoryboardDraft(saved, defaults);
  assert.equal(restored[0].note, '实测备注');
  assert.equal(restored[0].asset, 'A01.md');
  assert.equal(defaults[0].asset, '');
  assert.equal(restored[1].status, 'untested');
  assert.deepEqual(restoreStoryboardDraft([...saved].reverse(), defaults), restored);

  const corrupt = (change) => {
    const candidate = structuredClone(saved);
    change(candidate);
    assert.equal(restoreStoryboardDraft(candidate, defaults), null);
  };
  corrupt((rows) => { rows[0] = null; });
  corrupt((rows) => { rows[1].id = 'A01'; });
  corrupt((rows) => { rows[0].scores = null; });
  corrupt((rows) => { rows[0].scores.coverage = 9; });
  corrupt((rows) => { rows[0].failures = '误标'; });
  corrupt((rows) => { rows[0].status = 'reviewed-by-machine'; });
  assert.equal(restoreStoryboardDraft(saved.slice(0, 1), defaults), null);
});

test('shared record restoration keeps valid edits for numeric IDs and seeded poster rows', () => {
  const defaults = [1, 2].map((id) => ({
    id, group: 'A', status: 'untested', model: '', asset: '',
    scores: { identity: null, motion: null, physics: null, camera: null },
    failures: [], note: '',
  }));
  const saved = structuredClone(defaults);
  saved[0].status = 'reviewed';
  saved[0].scores.motion = 4;
  saved[0].asset = '01.mp4';
  saved[0].note = '人工观察';
  assert.deepEqual(restoreExperimentRecordDraft([...saved].reverse(), defaults), saved);
  assert.equal(defaults[0].asset, '');

  const pilot = [{
    id: 'A01', group: 'A', poster: '海报 A', status: 'reviewed', model: '已公开试验',
    asset: 'A01.md', outputTitle: '已公开标题', wordCount: '216',
    scores: { evidence: 5, boundary: 5, coherence: 4, relevance: 5 },
    failures: [], note: '已公开复核',
  }];
  assert.deepEqual(restoreExperimentRecordDraft(structuredClone(pilot), pilot), pilot);
});

test('shared record restoration rejects malformed rows without merging them into defaults', () => {
  const defaults = ['A01', 'A02'].map((id) => ({
    id, group: 'A', task: `任务 ${id}`, status: 'untested', model: '', seed: '', asset: '',
    scores: { identity: null, motion: null, physics: null, camera: null },
    failures: [], flags: [], note: '',
  }));
  const corrupt = (change) => {
    const rows = structuredClone(defaults);
    change(rows);
    assert.equal(restoreExperimentRecordDraft(rows, defaults), null);
  };
  corrupt((rows) => { rows[0] = null; });
  corrupt((rows) => { rows[1].id = 'A01'; });
  corrupt((rows) => { rows[0].task = '另一项任务'; });
  corrupt((rows) => { rows[0].scores.identity = 6; });
  corrupt((rows) => { rows[0].scores.extra = 4; });
  corrupt((rows) => { rows[0].flags = ['漂移', null]; });
  corrupt((rows) => { rows[0].status = 'reviewed-by-machine'; });
  corrupt((rows) => { rows[0].futureField = '必须保留原始草稿'; });
  assert.equal(restoreExperimentRecordDraft(defaults.slice(0, 1), defaults), null);
});

test('waterline draft requires each checkpoint and its frame observations', () => {
  const defaults = [{
    id: 'A01', group: 'A', task: '撑伞退水', status: 'untested',
    model: '', seed: '', asset: '', lockFrame: '', waterStartFrame: '',
    checkpoints: ['开始', '触发', '结束'].map((point) => ({ point, frame: '', umbrella: '', waterline: '' })),
    scores: { umbrellaIntegrity: null, causalOrder: null, waterDirection: null, worldContinuity: null },
    failures: [], note: '',
  }];
  const saved = structuredClone(defaults);
  saved[0].checkpoints[1].frame = '00:02';
  saved[0].checkpoints[1].waterline = '向左退';
  assert.deepEqual(restoreExperimentRecordDraft(saved, defaults), saved);
  const incomplete = structuredClone(saved);
  delete incomplete[0].checkpoints[1].waterline;
  assert.equal(restoreExperimentRecordDraft(incomplete, defaults), null);
  const reordered = structuredClone(saved);
  reordered[0].checkpoints.reverse();
  assert.equal(restoreExperimentRecordDraft(reordered, defaults), null);
});

test('every experiment board pauses writes and exposes the original malformed draft', () => {
  const boards = [
    'experiment-record-board', 'reference-comparison-board', 'rain-follow-record-board',
    'lighting-continuity-board', 'shadow-offset-record-board', 'contact-action-record-board',
    'poster-story-audit-board', 'waterline-motion-record-board',
  ];
  for (const board of boards) {
    const source = readFileSync(new URL(`../app/components/${board}.tsx`, import.meta.url), 'utf8');
    assert.match(source, /restoreExperimentRecordDraft\(JSON\.parse\(saved\),/);
    assert.match(source, /else setRecoverySource\(saved\)/);
    assert.match(source, /loaded && recoverySource === null/);
    assert.match(source, /blocked=\{recoverySource !== null\}/);
    assert.match(source, /<LocalRecordRecovery source=\{recoverySource\} \/>/);
  }
});

test('downloadable recovery backup retains malformed source text exactly', async () => {
  const original = '{"note":"水线偏移｜未完成"}\n{invalid-json';
  const backup = createLocalRecordBackup(original);
  assert.equal(backup.type, 'text/plain;charset=utf-8');
  assert.equal(await backup.text(), original);
  assert.match(localRecordBackupFilename, /\.txt$/);

  const component = readFileSync(new URL('../app/components/local-record-recovery.tsx', import.meta.url), 'utf8');
  assert.match(component, /URL\.createObjectURL\(createLocalRecordBackup\(backupSource\)\)/);
  assert.match(component, /link\.download = localRecordBackupFilename/);
  assert.match(component, /URL\.revokeObjectURL\(backupUrl\)/);
  assert.match(component, /<textarea readOnly value=\{source\}/);
});
