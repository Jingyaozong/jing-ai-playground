import test from 'node:test';
import assert from 'node:assert/strict';
import { crossCheckWatch } from './wechat-crosscheck.mjs';

const url = 'https://mp.weixin.qq.com/s?__biz=MzIyMzA5NjEyMA==&mid=123&idx=1&sn=abc';
const article = { url };
const checkedAt = '2026-09-23T05:00:00.000Z';
const index = 'https://aihot.news/items/example';

test('matches article identity despite query ordering and ignores unrelated items', () => {
  const watch = { checkedAt, complete: true, items: [
    { original: url.replace('mid=123', 'mid=456'), index },
    { original: 'https://mp.weixin.qq.com/s?sn=abc&idx=1&mid=123&__biz=MzIyMzA5NjEyMA%3D%3D&poc_token=temporary', index },
  ] };
  assert.deepEqual(crossCheckWatch(article, watch), { status: 'matched', checkedAt, index });
});

test('distinguishes complete absence from incomplete scan', () => {
  assert.equal(crossCheckWatch(article, { checkedAt, complete: true, items: [] }).status, 'not-found');
  assert.equal(crossCheckWatch(article, { checkedAt, complete: false, items: [] }).status, 'incomplete');
  assert.equal(crossCheckWatch(article, { checkedAt, complete: true, items: [{ original: url.replace('idx=1', 'idx=2'), index }] }).status, 'not-found');
});
