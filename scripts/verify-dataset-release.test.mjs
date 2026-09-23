import test from 'node:test';
import assert from 'node:assert/strict';
import { assessRelease, blankReleaseRecord, releaseGates, releaseReport } from '../lib/dataset-release.ts';

test('empty desk never claims readiness', () => {
  const record = blankReleaseRecord();
  const result = assessRelease(record);
  assert.equal(result.readyForHumanApproval, false);
  assert.equal(result.pending.length, 8);
  assert.equal(result.missingIdentity.length, 3);
  assert.match(releaseReport(record), /待核实 · 不可据此交付/);
});

test('verification requires evidence for every check and batch identity', () => {
  const record = blankReleaseRecord();
  record.dataset = '演练数据集';
  record.batch = '演练批次';
  record.ruleVersion = 'v1';
  for (const gate of releaseGates) for (const check of gate.checks) record.checks[check.id] = { status: 'verified', evidence: '人工核对记录' };
  assert.equal(assessRelease(record).readyForHumanApproval, true);
  assert.match(releaseReport(record), /记录齐备 · 待人工批准/);
  record.checks.retest.evidence = ' ';
  assert.equal(assessRelease(record).readyForHumanApproval, false);
  assert.equal(assessRelease(record).pending[0].id, 'retest');
  record.checks.retest = { status: 'needs-work', evidence: '仍有未关闭项' };
  assert.match(releaseReport(record), /暂勿交付 · 有待处理项/);
});

test('report keeps user text on one line and does not invent acceptance', () => {
  const record = blankReleaseRecord();
  record.dataset = '演练\n伪标题';
  const report = releaseReport(record);
  assert.match(report, /数据集：演练 伪标题/);
  assert.match(report, /不代表客户验收/);
  assert.doesNotMatch(report, /已验收|自动批准/);
});
