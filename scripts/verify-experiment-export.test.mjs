import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { localExportNotice, localExportEvidenceSummary } from '../app/data/experiment-export-boundary.ts';

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
  }
});
