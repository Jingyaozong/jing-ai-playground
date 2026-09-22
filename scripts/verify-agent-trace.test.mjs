import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { tracePractices } from '../lib/agent-trace-practice.ts';
import {
  syntheticAgentTrace, parseTraceRecord, emptyTraceReview, traceReviewGaps,
  exportTraceBundle, traceReport, MAX_TRACE_CHARS,
} from '../lib/agent-trace-review.ts';

const encode = (trace) => JSON.stringify(trace);

test('acceptance template remains blank, traceable and explicit about tool boundaries', () => {
  const template = readFileSync(new URL('../public/downloads/office-agent-acceptance-v1.0.md', import.meta.url), 'utf8');
  for (const required of ['待荆确认', 'Case ID', 'Run ID', 'AC-01', '无法判断', '不适用', '待最终复核', '不能直接作为轨迹 JSON 导入', '不覆盖原记录']) assert.ok(template.includes(required), required);
  assert.equal((template.match(/^## [A-E]\./gm) ?? []).length, 5);
  assert.ok(template.includes('- [ ]'));
  assert.doesNotMatch(template, /^- \[[xX]\]/m);
});

test('three independent practice traces import with blank reviews and valid reference steps', () => {
  assert.equal(tracePractices.length, 3);
  assert.equal(new Set(tracePractices.map((p) => p.trace.caseId)).size, 3);
  for (const practice of tracePractices) {
    const parsed = parseTraceRecord(encode(practice.trace));
    const downloadable = readFileSync(new URL(`../public/practice/agent-traces/${practice.trace.caseId}.json`, import.meta.url), 'utf8');
    assert.deepEqual(parseTraceRecord(downloadable), parsed);
    assert.equal(parsed.trace.kind, 'synthetic');
    assert.equal(parsed.review.localization, 'pending');
    assert.ok(parsed.review.checks.every((c) => c.result === 'pending' && c.evidence === ''));
    assert.ok(parsed.trace.steps.some((s) => s.id === practice.reference.firstDeviation));
    assert.ok(practice.reference.uncertainty && practice.reference.retest);
    assert.deepEqual(parseTraceRecord(exportTraceBundle(parsed.trace, parsed.review)), parsed);
    assert.equal(encode(practice.trace).includes('firstDeviation'), false);
  }
});

test('practice set distinguishes explicit errors from earlier or silent deviations', () => {
  assert.deepEqual(tracePractices.map((p) => p.reference.firstDeviation), ['F2', 'P3', 'D3']);
  assert.deepEqual(tracePractices.map((p) => p.trace.steps.find((s) => s.status === 'error')?.id), ['F4', 'P4', undefined]);
});

test('synthetic trace remains explicit and never auto-selects the first error as a cause', () => {
  const { trace, review } = parseTraceRecord(encode(syntheticAgentTrace));
  assert.equal(trace.kind, 'synthetic');
  assert.equal(trace.steps.find((step) => step.status === 'error').id, 'S3');
  assert.equal(review.localization, 'pending');
  assert.equal(review.firstDeviationId, '');
  assert.ok(review.checks.every((check) => check.result === 'pending' && !check.evidence));
  assert.match(traceReport(trace, review), /独立虚构演练/);
  assert.match(traceReport(trace, review), /待最终确认/);
});

test('review bundle restores separate localization, hypotheses and acceptance evidence', () => {
  const trace = structuredClone(syntheticAgentTrace);
  const review = emptyTraceReview(trace);
  Object.assign(review, { localization: 'located', firstDeviationId: 'S2', category: 'arguments', evidence: '排除列表缺少 refunded', hypothesis: '约束映射可能遗漏', nextTest: '固定输入，仅修正参数后复验' });
  review.checks[0] = { result: 'fail', evidence: '日志返回 200，验收要求 120' };
  review.checks[1] = { result: 'uncertain', evidence: '没有取得真实文件' };
  const restored = parseTraceRecord(exportTraceBundle(trace, review));
  assert.deepEqual(restored, { trace, review });
  assert.deepEqual(traceReviewGaps(trace, review), []);
  const report = traceReport(trace, review);
  assert.match(report, /首个显式报错：S3/);
  assert.match(report, /人工定位：S2/);
  assert.match(report, /不代表任务成功/);
  assert.match(report, /无法判断/);
});

test('missing or unknown evidence cannot silently become a completed review', () => {
  const trace = syntheticAgentTrace;
  const review = emptyTraceReview(trace);
  review.localization = 'located';
  review.firstDeviationId = 'absent';
  review.checks[0].result = 'pass';
  const gaps = traceReviewGaps(trace, review).join('|');
  assert.match(gaps, /选择偏离步骤/);
  assert.match(gaps, /缺少证据/);
  assert.match(gaps, /待验收/);
  assert.match(gaps, /下一步验证/);
});

test('unfinished localization can be saved and restored without inventing a step', () => {
  const review = emptyTraceReview(syntheticAgentTrace);
  review.localization = 'located';
  const restored = parseTraceRecord(exportTraceBundle(syntheticAgentTrace, review));
  assert.deepEqual(restored.review, review);
  assert.ok(traceReviewGaps(restored.trace, restored.review).includes('尚未选择偏离步骤'));
});

test('malformed, oversized and ambiguous traces are rejected before replacing data', () => {
  assert.throws(() => parseTraceRecord('{'), /JSON 格式/);
  assert.throws(() => parseTraceRecord('x'.repeat(MAX_TRACE_CHARS + 1)), /超过/);
  for (const mutate of [
    (trace) => { trace.steps[1].id = trace.steps[0].id; },
    (trace) => { trace.steps[0].status = 'success'; },
    (trace) => { trace.steps[0].input = { command: 'do not execute' }; },
    (trace) => { trace.steps = Array.from({ length: 101 }, () => trace.steps[0]); },
    (trace) => { trace.acceptance = []; },
    (trace) => { trace.kind = 'official'; },
  ]) {
    const trace = structuredClone(syntheticAgentTrace); mutate(trace);
    assert.throws(() => parseTraceRecord(encode(trace)));
  }
});

test('saved reviews reject foreign step references, invalid states and incomplete check arrays', () => {
  const makeBundle = () => JSON.parse(exportTraceBundle(syntheticAgentTrace, emptyTraceReview(syntheticAgentTrace)));
  const wrongStep = makeBundle(); wrongStep.review.localization = 'located'; wrongStep.review.firstDeviationId = 'missing';
  assert.throws(() => parseTraceRecord(encode(wrongStep)), /偏离步骤/);
  const wrongState = makeBundle(); wrongState.review.checks[0].result = 'approved';
  assert.throws(() => parseTraceRecord(encode(wrongState)), /验收状态/);
  const wrongCount = makeBundle(); wrongCount.review.checks.pop();
  assert.throws(() => parseTraceRecord(encode(wrongCount)), /对应的记录/);
});

test('only documented fields are retained and untrusted text stays literal', () => {
  const raw = structuredClone(syntheticAgentTrace);
  raw.privateToken = 'must-not-export';
  raw.steps[0].internalNotes = 'must-not-export';
  raw.steps[0].output = '<img src=x onerror=alert(1)>\n```\n# fake conclusion';
  const { trace, review } = parseTraceRecord(encode(raw));
  assert.equal(trace.steps[0].output, raw.steps[0].output);
  assert.equal(exportTraceBundle(trace, review).includes('must-not-export'), false);
  assert.match(traceReport(trace, review), /````text\n<img/);
});
