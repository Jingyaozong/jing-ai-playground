import test from 'node:test';
import assert from 'node:assert/strict';
import { assessRelease, blankReleaseRecord, isBlankReleaseRecord, paperBoatB02Practice, paperBoatB02RetestPractice, releaseGates, releaseReport } from '../lib/dataset-release.ts';

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

test('paper boat B02 practice remains a synthetic hold, not a completed delivery', () => {
  const record = paperBoatB02Practice();
  const result = assessRelease(record);
  const report = releaseReport(record);
  assert.equal(isBlankReleaseRecord(blankReleaseRecord()), true);
  assert.equal(isBlankReleaseRecord(record), false);
  assert.equal(result.readyForHumanApproval, false);
  assert.deepEqual(result.blocked.map((check) => check.id), ['review']);
  assert.ok(result.pending.some((check) => check.id === 'retest'));
  assert.match(report, /完全虚构的练习/);
  assert.match(report, /普通不合格 4，约定最多 2/);
  assert.match(report, /不得作为实际交付记录/);
  assert.doesNotMatch(report, /状态：记录齐备/);
});

test('B02 retest keeps first check, full-batch repairs and new sample separate', () => {
  const first = paperBoatB02Practice();
  const retest = paperBoatB02RetestPractice();
  const result = assessRelease(retest);
  const report = releaseReport(retest);
  assert.equal(first.practiceStage, 'first-check');
  assert.equal(retest.practiceStage, 'retest');
  assert.equal(first.checks.review.status, 'needs-work');
  assert.equal(retest.checks.review.status, 'verified');
  assert.equal(retest.checks.retest.status, 'unchecked');
  assert.equal(result.readyForHumanApproval, false);
  assert.ok(result.pending.some((check) => check.id === 'manifest'));
  assert.match(report, /首检（旧冻结版）：随机抽检 100 条，普通不合格 4 条/);
  assert.match(report, /检查 B02 全部 500 条，模拟修正 18 条（包含首检 4 条）/);
  assert.match(report, /复检（新冻结版）：另抽 100 条，普通不合格 1 条/);
  assert.match(report, /不合并分母，也不倒填首检结论/);
  assert.match(report, /不得作为实际交付记录/);
  assert.doesNotMatch(report, /状态：记录齐备/);
  assert.doesNotMatch(releaseReport(first), /复检（新冻结版）/);
});
