import assert from 'node:assert/strict';
import test from 'node:test';
import { copyWithTimeout } from '../app/lib/copy-with-timeout.ts';

test('clipboard success forwards exact content', async () => {
  let actual;
  assert.equal(await copyWithTimeout('合成演练\n"CSV"', async (value) => { actual = value; }), true);
  assert.equal(actual, '合成演练\n"CSV"');
});
test('missing, rejected and synchronously throwing clipboard return unconfirmed', async () => {
  assert.equal(await copyWithTimeout('text', undefined), false);
  assert.equal(await copyWithTimeout('text', async () => { throw new Error('denied'); }), false);
  assert.equal(await copyWithTimeout('text', () => { throw new Error('blocked'); }), false);
});
test('unresolved permission times out; late completion does not change result', async () => {
  let complete;
  const result = await copyWithTimeout('text', () => new Promise((resolve) => { complete = resolve; }), 10);
  assert.equal(result, false);
  complete();
  await Promise.resolve();
  assert.equal(result, false);
});
