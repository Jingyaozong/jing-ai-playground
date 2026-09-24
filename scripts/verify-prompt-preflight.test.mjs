import assert from 'node:assert/strict';
import test from 'node:test';
import { emptyPromptPreflight, formatPromptPreflight, inspectPromptPreflight, parsePromptPreflight, serializePromptPreflight } from '../lib/prompt-preflight.ts';

test('blank card keeps outputs pending and never claims a test result', () => {
  const result = inspectPromptPreflight(emptyPromptPreflight);
  assert.equal(result.readyToTest, false);
  assert.equal(result.resultStatus, '待执行 · 无输出');
  const copy = formatPromptPreflight(emptyPromptPreflight);
  assert.match(copy, /原版实际输出：待执行/);
  assert.match(copy, /新版实际输出：待执行/);
  assert.match(copy, /待荆确认/);
});

test('filled preparation still requires real outputs and human judgment', () => {
  const prepared = { ...emptyPromptPreflight, task: '整理待办', audience: '项目负责人', acceptance: '每条有动作', unknowns: '不补期限', originalPrompt: '整理', ambiguity: '期限未定', humanDecision: '保持未知', oneChange: '标出缺失期限', testInput: '匿名会议记录' };
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
});
