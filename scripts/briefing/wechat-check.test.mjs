import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { readWechatCheck, saveWechatCheck, validateWechatCheck } from './wechat-check.mjs';

const now = new Date('2026-09-23T03:00:00.000Z');
const url = 'https://mp.weixin.qq.com/s?__biz=MzIyMzA5NjEyMA==&mid=123&idx=1&sn=abc';
const article = { title: '虚构测试文章', publishedAt: '2026-09-22T02:02:00.000Z', url, body: '测试正文'.repeat(150) };

test('source-only preview record contains metadata, not article body or model claims', async () => {
  const directory = await mkdtemp(resolve(tmpdir(), 'jing-wechat-check-'));
  try {
    const saved = await saveWechatCheck(directory, article, now);
    const raw = await readFile(resolve(directory, 'wechat-latest-check.json'), 'utf8');
    assert.equal(saved.status, 'source-only');
    assert.ok(raw.includes('虚构测试文章'));
    assert.ok(!raw.includes('测试正文'));
    assert.ok(!raw.includes('DEEPSEEK_API_KEY'));
    assert.equal((await readWechatCheck(directory, now)).article.bodyChars, article.body.length);
    assert.equal((await readWechatCheck(directory, new Date(now.getTime() + 25 * 3600000))).stale, true);
    assert.equal(await readWechatCheck(directory, new Date(now.getTime() + 8 * 86400000)), null);
    await saveWechatCheck(directory, null, now);
    assert.equal((await readWechatCheck(directory, now)).article, null);
  } finally {
    assert.ok(directory.startsWith(resolve(tmpdir(), 'jing-wechat-check-')));
    await rm(directory, { recursive: true, force: true });
  }
});

test('rejects wrong accounts, malformed article metadata and expired checks', () => {
  const base = { version: 1, status: 'source-only', checkedAt: now.toISOString(), article: { title: '测试', publishedAt: article.publishedAt, url, bodyChars: 600 } };
  assert.throws(() => validateWechatCheck({ ...base, article: { ...base.article, url: url.replace('MzIyMzA5NjEyMA==', 'OTHER') } }, now));
  assert.throws(() => validateWechatCheck({ ...base, article: { ...base.article, bodyChars: 0 } }, now));
  assert.throws(() => validateWechatCheck(base, new Date(now.getTime() + 8 * 86400000)));
  assert.throws(() => validateWechatCheck({ ...base, article: { ...base.article, publishedAt: '2026-09-01T00:00:00.000Z' } }, now));
});
