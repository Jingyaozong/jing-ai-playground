import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { selectedCandidates, selectionOptions } from './selection.mjs';
const now = new Date('2026-09-08T12:00:00Z');
const record = (n) => {
  const url = `https://www.qbitai.com/2026/09/${n}.html`;
  return { id: createHash('sha256').update(url).digest('hex').slice(0,16), source: '量子位官网（非公众号全量）', url, publishedAt: now.toISOString(), title: `虚构测试${n}`, excerpt: '离线测试摘要' };
};
const snapshot = () => ({ fetchedAt: now.toISOString(), candidates: [record(1), record(2), record(3)] });
test('selection arguments require bounded explicit file and unique positions', () => {
  assert.equal(selectionOptions([]), null);
  assert.deepEqual(selectionOptions(['--file','candidates-1788859143946.json','--pick','3,1','--check']).positions,[3,1]);
  for (const args of [['--check'], ['--file','../secret','--pick','1'], ['--file','candidates-1788859143946.json','--pick','1,1'], ['--file','candidates-1788859143946.json','--pick','1,2,3,4,5,6'], ['--file','candidates-1788859143946.json','--pick','0']]) assert.throws(() => selectionOptions(args));
});
test('only selected records are returned in requested order with no added fields', () => {
  const data = snapshot(); data.candidates[0].extra = 'untrusted';
  const selected = selectedCandidates(data,[3,1],[],now);
  assert.deepEqual(selected.map((item) => item.id),[record(3).id,record(1).id]);
  assert.equal(selected[1].extra,undefined);
});
test('invalid, stale, future, duplicate and already drafted records stop selection', () => {
  for (const positions of [[],[4],[0],[1,1],[1.5]]) assert.throws(() => selectedCandidates(snapshot(),positions,[],now));
  assert.throws(() => selectedCandidates(snapshot(),[1],[record(1).id],now));
  for (const change of [
    (d) => { d.fetchedAt = '2020-01-01'; },
    (d) => { d.candidates[0].publishedAt = '2027-01-01'; },
    (d) => { d.candidates[0].publishedAt = '2020-01-01'; },
    (d) => { d.candidates[0].id = 'fake'; },
    (d) => { d.candidates[0].url = 'https://example.com/'; },
    (d) => { d.candidates[0].source = 'unknown'; },
    (d) => { d.candidates[0].excerpt = 'x'.repeat(801); },
  ]) { const data = snapshot(); change(data); assert.throws(() => selectedCandidates(data,[1],[],now)); }
});
