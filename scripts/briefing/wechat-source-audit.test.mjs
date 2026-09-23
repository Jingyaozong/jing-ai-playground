import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { auditSources, parseSourceFeed, readSourceAudit, saveSourceAudit, sourceArticleUrl, validateSourceAudit, watchedAccounts } from './wechat-source-audit.mjs';
import { renderSourceAuditPage } from './source-audit-page.mjs';

const now = new Date('2026-09-23T05:00:00.000Z');
const makeUrl = (account) => `https://mp.weixin.qq.com/s?__biz=${encodeURIComponent(account.biz)}&mid=123&idx=1&sn=abc`;
const feed = (account, title = '测试标题', url = makeUrl(account)) => `<rss version="2.0"><channel><title>${account.name}</title><item><title><![CDATA[${title}]]></title><link>${url.replaceAll('&', '&amp;')}</link><pubDate>Tue, 22 Sep 2026 10:02:00 +0800</pubDate><content:encoded><![CDATA[不可保存的第三方正文]]></content:encoded></item></channel></rss>`;

test('reads only whitelisted metadata and rejects wrong account identity', () => {
  const account = watchedAccounts[1];
  assert.equal(parseSourceFeed(feed(account), account, now).url, makeUrl(account));
  assert.equal(parseSourceFeed(feed(account, '测试', makeUrl(watchedAccounts[2])), account, now), null);
  assert.throws(() => sourceArticleUrl('https://example.com/s?__biz=x', account));
  for (const suffix of ['&__biz=OTHER', '&mid=456', '&idx=2', '&sn=def']) {
    assert.throws(() => sourceArticleUrl(makeUrl(account) + suffix, account));
    assert.equal(parseSourceFeed(feed(account, '测试', makeUrl(account) + suffix), account, now), null);
  }
  assert.throws(() => parseSourceFeed(feed(account).replace(account.name, '冒名账号'), account, now));
  assert.throws(() => parseSourceFeed('<!DOCTYPE rss><rss/>', account, now));
});

test('source outage remains visible as unavailable and no model input is saved', async () => {
  const audit = await auditSources(now, async (url, options) => {
    assert.equal(options.redirect, 'error');
    const account = watchedAccounts.find((entry) => entry.feed === url);
    if (account.id === 'geekpark') throw new Error('offline');
    return new Response(feed(account));
  });
  assert.equal(audit.records.length, 4);
  assert.equal(audit.records[3].status, 'unavailable');
  assert.equal(audit.records[0].status, 'recent');
  const directory = await mkdtemp(resolve(tmpdir(), 'jing-source-audit-'));
  try {
    await saveSourceAudit(directory, audit, now);
    const raw = await readFile(resolve(directory, 'wechat-source-audit.json'), 'utf8');
    assert.ok(!raw.includes('不可保存的第三方正文'));
    assert.ok(!raw.includes('DEEPSEEK_API_KEY'));
    const loaded = await readSourceAudit(directory, now);
    assert.equal(loaded.records[0].name, '数字生命卡兹克');
    assert.equal(loaded.records[3].latest, null);
    assert.equal(await readSourceAudit(directory, new Date(now.getTime() + 8 * 86400000)), null);
    await writeFile(resolve(directory, 'wechat-source-audit.json'), JSON.stringify({ ...audit, records: [] }));
    await assert.rejects(readSourceAudit(directory, now), /记录无效/);
  } finally {
    assert.ok(directory.startsWith(resolve(tmpdir(), 'jing-source-audit-')));
    await rm(directory, { recursive: true, force: true });
  }
});

test('dashboard escapes source titles and preserves review-only status', () => {
  const audit = { version: 1, checkedAt: now.toISOString(), records: watchedAccounts.map((account) => ({ id: account.id, status: 'recent', latest: { title: '<img src=x>', publishedAt: '2026-09-22T02:02:00.000Z', url: makeUrl(account) } })) };
  const valid = validateSourceAudit(audit, now);
  const html = renderSourceAuditPage(valid);
  assert.ok(html.includes('&lt;img src=x&gt;'));
  assert.ok(!html.includes('<img src=x>'));
  assert.ok(html.includes('尚未获得微信官方身份或正文核验'));
  assert.equal((html.match(/打开公众号原文/g) ?? []).length, 4);
  assert.throws(() => validateSourceAudit({ ...audit, records: audit.records.slice(1) }, now));
});
