import { lstat, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { plain, readLimited } from './pipeline.mjs';

// Third-party BestBlogs / Wechat2RSS feeds, not official WeChat interfaces.
// Account labels and observed __biz values need independent human verification.
export const watchedAccounts = [
  { id: 'kazik', name: '数字生命卡兹克', biz: 'MzIyMzA5NjEyMA==', feed: 'https://wechat2rss.bestblogs.dev/feed/ff621c3e98d6ae6fceb3397e57441ffc6ea3c17f.xml' },
  { id: 'ai-front', name: 'AI前线', biz: 'MzU1NDA4NjU2MA==', feed: 'https://wechat2rss.bestblogs.dev/feed/25185b01482da0f485418ecb92e208b4416712fb.xml' },
  { id: 'jiqizhixin', name: '机器之心', biz: 'MzA3MzI4MjgzMw==', feed: 'https://wechat2rss.bestblogs.dev/feed/8d97af31b0de9e48da74558af128a4673d78c9a3.xml' },
  { id: 'geekpark', name: '极客公园', biz: 'MTMwNDMwODQ0MQ==', feed: 'https://wechat2rss.bestblogs.dev/feed/11ea7163fbea99e2ab9fa2812ac3d179574886cc.xml' },
];
const feedLimit = 1_200_000;
const filename = 'wechat-source-audit.json';
const field = (xml, name) => xml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, 'i'))?.[1] ?? '';

export function sourceArticleUrl(value, account) {
  const url = new URL(plain(value));
  const identity = ['__biz', 'mid', 'idx', 'sn'];
  if (url.protocol !== 'https:' || url.origin !== 'https://mp.weixin.qq.com' || url.pathname !== '/s' || url.username || url.password || identity.some((key) => url.searchParams.getAll(key).length !== 1 || !url.searchParams.get(key)) || url.searchParams.get('__biz') !== account.biz) throw new Error('公众号链接与本源观察标识不符');
  url.hash = '';
  return url.href;
}

export function parseSourceFeed(xml, account, now = new Date()) {
  if (Buffer.byteLength(xml) > feedLimit || /<!DOCTYPE|<!ENTITY/i.test(xml) || !/<rss\b/i.test(xml)) throw new Error('第三方源格式无效');
  const channel = xml.match(/<channel(?:\s[^>]*)?>([\s\S]*?)<item/i)?.[1] ?? '';
  if (plain(field(channel, 'title')) !== account.name) throw new Error('第三方源名称不匹配');
  const candidates = [];
  for (const match of xml.matchAll(/<item(?:\s[^>]*)?>([\s\S]*?)<\/item>/gi)) {
    const item = match[1];
    const published = new Date(plain(field(item, 'pubDate')));
    if (!Number.isFinite(published.getTime()) || published > now || now - published > 7 * 86400000) continue;
    try {
      const url = sourceArticleUrl(field(item, 'link'), account);
      const title = plain(field(item, 'title'));
      if (!title || title.length > 180) continue;
      candidates.push({ title, publishedAt: published.toISOString(), url });
    } catch { /* One malformed item must not become a clickable source. */ }
  }
  candidates.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  return candidates[0] ?? null;
}

export async function auditSources(now = new Date(), fetcher = fetch) {
  const records = await Promise.all(watchedAccounts.map(async (account) => {
    try {
      const response = await fetcher(account.feed, { redirect: 'error', signal: AbortSignal.timeout(20_000) });
      const latest = parseSourceFeed(await readLimited(response, feedLimit), account, now);
      return { id: account.id, status: latest ? 'recent' : 'no-recent', latest };
    } catch { return { id: account.id, status: 'unavailable', latest: null }; }
  }));
  return { version: 1, checkedAt: now.toISOString(), records };
}

export function validateSourceAudit(value, now = new Date()) {
  const checked = new Date(value?.checkedAt);
  if (value?.version !== 1 || !Number.isFinite(checked.getTime()) || checked > now || !Array.isArray(value.records) || value.records.length !== watchedAccounts.length) throw new Error('公众号来源看板记录无效');
  if (now - checked > 7 * 86400000) throw new Error('公众号来源看板记录已过期');
  const records = value.records.map((record, index) => {
    const account = watchedAccounts[index];
    if (record?.id !== account.id || !['recent', 'no-recent', 'unavailable'].includes(record.status)) throw new Error('公众号来源状态无效');
    if (record.status !== 'recent') {
      if (record.latest !== null) throw new Error('无文章状态不得包含原文');
      return { id: account.id, name: account.name, status: record.status, latest: null };
    }
    const item = record.latest;
    const published = new Date(item?.publishedAt);
    if (typeof item?.title !== 'string' || !item.title.trim() || item.title.length > 180 || /[\u0000-\u001f]/.test(item.title) || !Number.isFinite(published.getTime()) || published > checked || checked - published > 7 * 86400000) throw new Error('公众号来源文章字段无效');
    return { id: account.id, name: account.name, status: record.status, latest: { title: item.title, publishedAt: published.toISOString(), url: sourceArticleUrl(item.url, account) } };
  });
  return { checkedAt: checked.toISOString(), stale: now - checked > 24 * 3600000, records };
}

export async function saveSourceAudit(directory, audit, now = new Date()) {
  const validated = validateSourceAudit(audit, now);
  await writeFile(resolve(directory, filename), JSON.stringify(audit, null, 2));
  return validated;
}

export async function readSourceAudit(directory, now = new Date()) {
  const path = resolve(directory, filename);
  let stat;
  try { stat = await lstat(path); }
  catch (error) { if (error.code === 'ENOENT') return null; throw error; }
  if (!stat.isFile() || stat.size > 12_000) throw new Error('公众号来源记录文件无效');
  try { return validateSourceAudit(JSON.parse(await readFile(path, 'utf8')), now); }
  catch (error) { if (error.message === '公众号来源看板记录已过期') return null; throw error; }
}
