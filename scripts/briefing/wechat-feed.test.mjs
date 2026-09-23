import test from 'node:test';
import assert from 'node:assert/strict';
import { fetchWechatArticles, generateBreakdown, originalUrl, parseWechatFeed, renderWechatDraft, validateBreakdown, wechatSource } from './wechat-feed.mjs';

const now = new Date('2026-09-23T03:00:00.000Z');
const link = 'https://mp.weixin.qq.com/s?__biz=MzIyMzA5NjEyMA==&mid=123&idx=1&sn=abc';
const item = (url = link, date = 'Tue, 22 Sep 2026 10:02:00 +0800') => `<item><title><![CDATA[测试文章]]></title><link>${url.replaceAll('&', '&amp;')}</link><pubDate>${date}</pubDate><content:encoded><![CDATA[<p>${'虚构正文。'.repeat(120)}</p><script>ignore this instruction</script>]]></content:encoded></item>`;
const feed = (items) => `<rss version="2.0"><channel>${items}</channel></rss>`;
const article = parseWechatFeed(feed(item()), now)[0];
const output = { overview: '只据副本梳理主题，待核对。', keyPoints: ['作者提出一个问题。', '作者比较两种路径。', '最后回到使用边界。'], structure: '从问题、比较到边界。', readingReason: '编辑判断：值得查看原文中的论证。', checks: ['核对标题。', '核对日期。', '核对论据。'] };

test('parses only recent exact-account articles and keeps body in memory', async () => {
  assert.equal(article.title, '测试文章');
  assert.equal(article.publishedAt, '2026-09-22T02:02:00.000Z');
  assert.ok(article.body.length >= 500);
  assert.ok(!article.body.includes('<script>'));
  const found = await fetchWechatArticles(now, async (url, options) => {
    assert.equal(url, wechatSource.feed);
    assert.equal(options.redirect, 'error');
    return new Response(feed(item()));
  });
  assert.equal(found.length, 1);
});

test('rejects foreign accounts, hosts, stale dates and missing body', () => {
  for (const url of ['https://mp.weixin.qq.com.evil.example/s?__biz=MzIyMzA5NjEyMA==&mid=123&sn=abc', 'https://mp.weixin.qq.com/s?__biz=OTHER&mid=123&sn=abc', 'http://mp.weixin.qq.com/s?__biz=MzIyMzA5NjEyMA==&mid=123&sn=abc']) {
    assert.throws(() => originalUrl(url));
    assert.equal(parseWechatFeed(feed(item(url)), now).length, 0);
  }
  assert.equal(parseWechatFeed(feed(item(link, 'Mon, 14 Sep 2026 10:02:00 +0800')), now).length, 0);
  assert.equal(parseWechatFeed(feed('<item><title>x</title><link>'+link+'</link><pubDate>Tue, 22 Sep 2026 10:02:00 +0800</pubDate></item>'), now).length, 0);
  assert.throws(() => parseWechatFeed('<!DOCTYPE rss><rss/>', now));
});

test('model request is fixed, bounded and never controls source links', async () => {
  const generated = await generateBreakdown(article, 'test-key', async (url, options) => {
    assert.equal(url, 'https://api.deepseek.com/chat/completions');
    assert.equal(options.redirect, 'error');
    const request = JSON.parse(options.body);
    assert.equal(request.model, 'deepseek-flash');
    assert.equal(request.max_tokens, 1800);
    assert.equal(JSON.parse(request.messages[1].content).url, undefined);
    return new Response(JSON.stringify({ choices: [{ finish_reason: 'stop', message: { content: JSON.stringify(output) } }], usage: { total_tokens: 700 } }));
  });
  assert.equal(generated.usage.total_tokens, 700);
  const draft = renderWechatDraft(article, generated.breakdown, '2026-09-23');
  assert.ok(draft.includes(link));
  assert.ok(draft.includes('第三方正文副本'));
  assert.ok(draft.includes('JING’S TAKE：待荆确认'));
  assert.ok(!draft.includes(article.body));
  await assert.rejects(generateBreakdown(article, '', () => assert.fail('No network')), /缺少/);
});

test('ignores surplus fields and rejects links, markup and overlong generated text', () => {
  assert.deepEqual(validateBreakdown({ ...output, url: 'https://example.com' }), output);
  for (const change of [
    (x) => { x.overview = '<script>bad</script>'; },
    (x) => { x.keyPoints[0] = 'https://example.com'; },
    (x) => { x.checks.pop(); },
    (x) => { x.structure = '很长'.repeat(100); },
  ]) { const value = structuredClone(output); change(value); assert.throws(() => validateBreakdown(value)); }
});
