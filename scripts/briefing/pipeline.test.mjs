import test from 'node:test';
import assert from 'node:assert/strict';
import { pendingSources, sourceReport } from './sources.mjs';
import { canonicalUrl, collect, generate, limits, parseFeed, readLimited, renderDraft, selectCandidates, sources, validateDraft } from './pipeline.mjs';

const now = new Date('2026-09-07T12:00:00Z');
const source = sources[0];
const entry = (url = 'https://huggingface.co/blog/test', date = 'Mon, 07 Sep 2026 01:00:00 GMT') => `<item><title>Test &amp; tools</title><link>${url}</link><pubDate>${date}</pubDate><description><![CDATA[<p>Offline <b>fixture</b>.</p>]]></description></item>`;
const feed = (items) => `<rss version="2.0"><channel>${items}</channel></rss>`;
const candidates = parseFeed(feed(entry()), source, now);
const output = () => ({ items: [{ sourceId: candidates[0].id, title: '离线测试', summary: '虚构样例，不是新闻。', relevance: '编辑推测，待核对。', uncertainty: '未核对全文。' }] });

test('Chinese publisher RSS supports CDATA and retains original links', () => {
  const publisher = sources.find((item) => item.id === 'qbitai');
  const records = parseFeed(feed(entry('https://www.qbitai.com/2026/09/example.html')), publisher, now);
  assert.equal(records.length, 1);
  assert.equal(records[0].source, '量子位官网（非公众号全量）');
  assert.equal(records[0].url, 'https://www.qbitai.com/2026/09/example.html');
  assert.equal(parseFeed(feed(entry('https://mp.weixin.qq.com/s/example')), publisher, now).length, 0);
});

test('pending targets have no operational endpoints and are explicitly reported', () => {
  assert.equal(pendingSources.length, 5);
  assert.equal(new Set(sources.map((item) => item.id)).size, sources.length);
  for (const target of pendingSources) {
    assert.equal(target.feed, undefined);
    assert.ok(sourceReport().includes(target.name));
  }
  assert.ok(sourceReport().includes('不代表实时健康检查'));
});

test('RSS extracts plain text and preserves source publication date', () => {
  assert.equal(candidates.length, 1);
  assert.equal(candidates[0].title, 'Test & tools');
  assert.equal(candidates[0].excerpt, 'Offline fixture .');
  assert.equal(candidates[0].publishedAt, '2026-09-07T01:00:00.000Z');
});
test('unknown, future and stale dates are excluded', () => {
  for (const date of ['', 'invalid', 'Tue, 08 Sep 2026 01:00:00 GMT', 'Tue, 01 Sep 2020 01:00:00 GMT']) assert.equal(parseFeed(feed(entry(undefined, date)), source, now).length, 0);
});
test('links reject off-list hosts, credentials, insecure schemes and wrong paths', () => {
  for (const url of ['https://huggingface.co.evil.example/blog/x', 'http://huggingface.co/blog/x', 'https://user:secret@huggingface.co/blog/x', 'https://huggingface.co/settings', 'http://127.0.0.1/']) {
    assert.throws(() => canonicalUrl(url, source));
    assert.equal(parseFeed(feed(entry(url)), source, now).length, 0);
  }
});
test('tracking links and already drafted entries deduplicate', () => {
  const records = parseFeed(feed(entry() + entry('https://huggingface.co/blog/test?utm_source=feed#top')), source, now);
  assert.equal(selectCandidates(records).length, 1);
  assert.equal(selectCandidates(records, [candidates[0].id]).length, 0);
});
test('reject DTD, unsupported feeds and oversize input', () => {
  for (const xml of ['<!DOCTYPE rss><rss/>', '<feed/>', 'x'.repeat(limits.feedBytes + 1)]) assert.throws(() => parseFeed(xml, source, now));
});
test('source collection is bounded and stops on failure', async () => {
  await assert.rejects(collect(now, async (url, options) => {
    assert.ok(sources.some((item) => item.feed === url));
    assert.equal(options.redirect, 'error');
    return new Response('private provider error', { status: 500 });
  }), /HTTP 500/);
  await assert.rejects(readLimited(new Response('oversized'), 2), /大小限制/);
});
test('model cannot add or repeat a source, insert links or exceed template bounds', () => {
  for (const change of [
    (value) => { value.items[0].sourceId = 'invented'; },
    (value) => { value.items.push(value.items[0]); },
    (value) => { value.items[0].summary = '<script>alert(1)</script>'; },
    (value) => { value.items[0].summary = 'https://evil.example'; },
    (value) => { value.items[0].title = '长'.repeat(41); },
    (value) => { value.items[0].publish = true; },
  ]) { const value = output(); change(value); assert.throws(() => validateDraft(value, candidates)); }
  assert.deepEqual(validateDraft({ items: [] }, candidates), []);
});
test('missing key fails without network calls', async () => {
  await assert.rejects(generate(candidates, '', () => { assert.fail('Network must not run'); }), /缺少/);
});
test('API uses fixed endpoint, bounded JSON output and no tools', async () => {
  const result = await generate(candidates, 'test-only-key', async (url, options) => {
    assert.equal(url, 'https://api.deepseek.com/chat/completions');
    assert.equal(options.redirect, 'error');
    const body = JSON.parse(options.body);
    assert.equal(body.max_tokens, 2500);
    assert.equal(body.response_format.type, 'json_object');
    assert.equal(body.tools, undefined);
    return Response.json({ choices: [{ finish_reason: 'stop', message: { content: JSON.stringify(output()) } }], usage: { total_tokens: 100 } });
  });
  assert.equal(result.items.length, 1);
  assert.equal(result.usage.total_tokens, 100);
});
test('truncated and malformed API output fails closed', async () => {
  await assert.rejects(generate(candidates, 'test', async () => Response.json({ choices: [{ finish_reason: 'length' }] })), /未正常完成/);
  await assert.rejects(generate(candidates, 'test', async () => Response.json({ choices: [{ finish_reason: 'stop', message: { content: 'not JSON' } }] })));
});
test('review template is explicit about draft, demo and evidence limits', () => {
  const markdown = renderDraft(validateDraft(output(), candidates), '2026-09-07', true);
  for (const value of ['离线虚构样例', '待荆确认', '未发布', '未核对全文', '配图：无', candidates[0].url]) assert.ok(markdown.includes(value));
  assert.ok(!markdown.startsWith('---')); // Not a publishable Notes frontmatter document.
  assert.ok(renderDraft([], '2026-09-07').includes('不凑数'));
});
