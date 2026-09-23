import test from 'node:test';
import assert from 'node:assert/strict';
import { discoverWatch, renderWatch, watchRecord } from './aihot-watch.mjs';

const now = new Date('2026-09-23T10:00:00.000Z');
const item = {
  source: { name: '公众号：数字生命卡兹克' },
  title: '虚构测试标题',
  publishedAt: '2026-09-22T02:02:03.000Z',
  links: {
    original: 'https://mp.weixin.qq.com/s?__biz=MzIyMzA5NjEyMA%3D%3D&mid=123&idx=1&sn=test',
    aihot: 'https://aihot.news/items/test-only',
  },
};
const page = (items, hasMore = false, nextCursor = '') => new Response(JSON.stringify({ items, page: { hasMore, nextCursor } }), { status: 200 });

test('finds the exact account and keeps only original and index links', async () => {
  const result = await discoverWatch(now, async (url, options) => {
    const query = new URL(url);
    assert.equal(query.origin, 'https://aihot.news');
    assert.equal(query.pathname, '/api/v1/items');
    assert.equal(query.searchParams.get('by'), 'published');
    assert.equal(options.redirect, 'error');
    return page([{ ...item, summary: '第三方摘要不进入清单' }, { ...item, source: { name: '公众号：其他' } }]);
  });
  assert.equal(result.complete, true);
  assert.equal(result.items.length, 1);
  assert.equal('summary' in result.items[0], false);
  const markdown = renderWatch(result);
  assert.match(markdown, /未核对微信原文 · 未调用 DeepSeek · 未发布/);
  assert.match(markdown, /公众号原文/);
  assert.ok(!markdown.includes('第三方摘要'));
});

test('rejects lookalike domains, wrong account and stale items', () => {
  const since = new Date('2026-09-21T10:00:00.000Z');
  assert.equal(watchRecord({ ...item, publishedAt: '2026-09-20T00:00:00Z' }, since, now), null);
  for (const original of ['https://mp.weixin.qq.com.evil.example/s?__biz=MzIyMzA5NjEyMA%3D%3D', 'https://mp.weixin.qq.com/s?__biz=OTHER', 'http://mp.weixin.qq.com/s?__biz=MzIyMzA5NjEyMA%3D%3D']) {
    assert.throws(() => watchRecord({ ...item, links: { ...item.links, original } }, since, now));
  }
  assert.throws(() => watchRecord({ ...item, links: { ...item.links, aihot: 'https://evil.example/items/x' } }, since, now));
});

test('paginates with cursor, deduplicates and discloses incomplete scans', async () => {
  let calls = 0;
  const result = await discoverWatch(now, async (url) => {
    calls++;
    assert.equal(new URL(url).searchParams.get('cursor'), calls === 1 ? null : 'page-2');
    return calls === 1 ? page([item], true, 'page-2') : page([item]);
  });
  assert.equal(result.pages, 2);
  assert.equal(result.items.length, 1);
  assert.equal(result.complete, true);
  await assert.rejects(discoverWatch(now, async () => page([], true, '')), /游标缺失/);
  const empty = renderWatch({ ...result, complete: false, items: [] });
  assert.match(empty, /范围不完整/);
  assert.match(empty, /不代表公众号没有发文/);
});

test('fails closed on provider and schema errors without requesting a model', async () => {
  await assert.rejects(discoverWatch(now, async () => new Response('failure', { status: 503 })), /HTTP 503/);
  await assert.rejects(discoverWatch(now, async () => new Response('{}')), /结构异常/);
});
