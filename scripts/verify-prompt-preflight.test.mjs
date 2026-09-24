import assert from 'node:assert/strict';
import test from 'node:test';
import { diffPromptText, emptyPromptPreflight, formatPromptPreflight, inspectAcceptanceMatrix, inspectPromptPreflight, parsePromptPreflight, serializePromptPreflight } from '../lib/prompt-preflight.ts';

test('blank card keeps outputs pending and never claims a test result', () => {
  const result = inspectPromptPreflight(emptyPromptPreflight);
  assert.equal(result.readyToTest, false);
  assert.equal(result.resultStatus, '待执行 · 无输出');
  const copy = formatPromptPreflight(emptyPromptPreflight);
  assert.match(copy, /原版实际输出：待执行/);
  assert.match(copy, /新版实际输出：待执行/);
  assert.match(copy, /待荆确认/);
  assert.match(copy, /新版 Prompt：未填写/);
});

test('filled preparation still requires real outputs and human judgment', () => {
  const prepared = { ...emptyPromptPreflight, task: '整理待办', audience: '项目负责人', acceptance: '每条有动作', unknowns: '不补期限', originalPrompt: '整理', revisedPrompt: '整理，并标出缺失期限', ambiguity: '期限未定', humanDecision: '保持未知', oneChange: '标出缺失期限', testInput: '匿名会议记录' };
  assert.equal(inspectPromptPreflight(prepared).readyToTest, true);
  assert.equal(inspectPromptPreflight(prepared).resultStatus, '待执行 · 无输出');
  assert.equal(inspectPromptPreflight({ ...prepared, originalOutput: '输出 A' }).resultStatus, '只记录了一版输出 · 不可比较');
  assert.equal(inspectPromptPreflight({ ...prepared, originalOutput: '输出 A', revisedOutput: '输出 B' }).resultStatus, '已记录两版输出 · 待填写验收证据');
  assert.equal(inspectPromptPreflight({ ...prepared, originalOutput: '输出 A', revisedOutput: '输出 B', evidence: '待人工核对' }).resultStatus, '已记录输出与证据 · 仍需人工判断');
});

test('local save round-trips only bounded versioned fields', () => {
  const record = { ...emptyPromptPreflight, task: '甲\n乙', originalPrompt: '<script>不执行</script>' };
  assert.deepEqual(parsePromptPreflight(serializePromptPreflight(record)), record);
  assert.equal(parsePromptPreflight('{"version":2,"record":{}}'), null);
  assert.equal(parsePromptPreflight('{bad json'), null);
  assert.equal(parsePromptPreflight(serializePromptPreflight({ ...record, task: 'x'.repeat(4001) })), null);
  const { revisedPrompt, ...legacy } = record;
  void revisedPrompt;
  assert.deepEqual(parsePromptPreflight(JSON.stringify({ version: 1, record: legacy })), record);
  const { checks, ...previous } = record;
  void checks;
  assert.deepEqual(parsePromptPreflight(JSON.stringify({ version: 2, record: previous })), record);
});

test('manual matrix requires both actual outputs and evidence for each verdict', () => {
  const check = { id: 'one', criterion: '缺失负责人时标注待确认', originalVerdict: '未评', originalEvidence: '', revisedVerdict: '未评', revisedEvidence: '' };
  const blank = { ...emptyPromptPreflight, checks: [check] };
  assert.equal(inspectAcceptanceMatrix(blank).complete, false);
  assert.match(formatPromptPreflight(blank), /逐项人工验收（无自动评分）/);
  const noOutputVerdict = { ...blank, checks: [{ ...check, originalVerdict: '通过' }] };
  assert.ok(inspectAcceptanceMatrix(noOutputVerdict).issues.some((issue) => issue.includes('没有实际输出')));
  const outputs = { ...blank, originalOutput: 'A 输出', revisedOutput: 'B 输出' };
  assert.ok(inspectAcceptanceMatrix(outputs).issues.some((issue) => issue.includes('仍待人工判定')));
  const missingEvidence = { ...outputs, checks: [{ ...check, originalVerdict: '未通过', revisedVerdict: '通过' }] };
  assert.ok(inspectAcceptanceMatrix(missingEvidence).issues.some((issue) => issue.includes('缺少对应证据')));
  const filled = { ...outputs, checks: [{ ...check, originalVerdict: '未通过', originalEvidence: 'A 未标注', revisedVerdict: '通过', revisedEvidence: 'B 标注待确认' }] };
  assert.equal(inspectAcceptanceMatrix(filled).complete, true);
  assert.equal(inspectPromptPreflight(filled).resultStatus, '已记录输出与逐项证据 · 仍需人工判断');
  assert.match(formatPromptPreflight(filled), /原版：未通过；证据：A 未标注/);
});

test('versioned local records reject forged or oversized manual review rows', () => {
  const check = { id: 'one', criterion: '有动作', originalVerdict: '未评', originalEvidence: '', revisedVerdict: '未评', revisedEvidence: '' };
  const record = { ...emptyPromptPreflight, checks: [check] };
  assert.deepEqual(parsePromptPreflight(serializePromptPreflight(record)), record);
  assert.equal(parsePromptPreflight(serializePromptPreflight({ ...record, checks: [check, check] })), null);
  assert.equal(parsePromptPreflight(serializePromptPreflight({ ...record, checks: [{ ...check, originalVerdict: '自动通过' }] })), null);
  assert.equal(parsePromptPreflight(serializePromptPreflight({ ...record, checks: [{ ...check, criterion: 'x'.repeat(181) }] })), null);
  assert.equal(parsePromptPreflight(serializePromptPreflight({ ...record, checks: Array(9).fill(check) })), null);
});

test('text diff shows exact Chinese additions and deletions without a quality judgment', () => {
  const before = '请整理会议纪要，直接给结论。';
  const after = '请整理匿名会议纪要，缺项先提问。';
  const diff = diffPromptText(before, after);
  assert.equal(diff.mode, 'exact');
  assert.equal(diff.before.map((part) => part.text).join(''), before);
  assert.equal(diff.after.map((part) => part.text).join(''), after);
  assert.ok(diff.before.some((part) => part.kind === 'removed'));
  assert.ok(diff.after.some((part) => part.kind === 'added' && part.text.includes('匿名')));
  assert.deepEqual(diffPromptText('同一版', '同一版').before, [{ kind: 'same', text: '同一版' }]);
});

test('long text uses a disclosed coarse range and preserves both originals', () => {
  const before = `开头${'旧'.repeat(1400)}结尾`;
  const after = `开头${'新'.repeat(1400)}结尾`;
  const diff = diffPromptText(before, after);
  assert.equal(diff.mode, 'coarse');
  assert.equal(diff.before.map((part) => part.text).join(''), before);
  assert.equal(diff.after.map((part) => part.text).join(''), after);
});
