// Private discovery only. AIHOT's summaries are not treated as verified WeChat text.
import { readLimited } from './pipeline.mjs';

const endpoint = 'https://aihot.news/api/v1/items';
const account = { name: '数字生命卡兹克', source: '公众号：数字生命卡兹克', biz: 'MzIyMzA5NjEyMA==' };
const pageLimit = 12;
const responseLimit = 1_000_000;

function safeUrl(value, origin, prefix) {
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.origin !== origin || url.username || url.password || !url.pathname.startsWith(prefix)) throw new Error('来源链接不符合白名单');
  return url.href;
}

export function watchRecord(item, since, now) {
  if (item?.source?.name !== account.source) return null;
  const published = new Date(item.publishedAt);
  if (!Number.isFinite(published.getTime()) || published < since || published > now) return null;
  if (typeof item.title !== 'string' || !item.title.trim() || item.title.length > 180) throw new Error('来源标题异常');
  const original = safeUrl(item.links?.original, 'https://mp.weixin.qq.com', '/s');
  if (new URL(original).searchParams.get('__biz') !== account.biz) throw new Error('公众号账号标识不符');
  const index = safeUrl(item.links?.aihot, 'https://aihot.news', '/items/');
  return { title: item.title.trim(), publishedAt: published.toISOString(), original, index };
}

export async function discoverWatch(now = new Date(), fetcher = fetch) {
  const since = new Date(now.getTime() - 48 * 60 * 60 * 1000);
  let cursor = '';
  let complete = false;
  let pages = 0;
  const found = new Map();
  while (pages < pageLimit) {
    const url = new URL(endpoint);
    for (const [key, value] of Object.entries({ mode: 'all', window: '7d', by: 'published', limit: '100' })) url.searchParams.set(key, value);
    if (cursor) url.searchParams.set('cursor', cursor);
    const response = await fetcher(url.href, { redirect: 'error', signal: AbortSignal.timeout(20_000) });
    if (!response.ok) throw new Error(`AIHOT 请求失败（HTTP ${response.status}）；未读取错误正文`);
    const data = JSON.parse(await readLimited(response, responseLimit));
    if (!Array.isArray(data.items) || !data.page || typeof data.page.hasMore !== 'boolean' || data.items.length > 100) throw new Error('AIHOT 响应结构异常');
    pages += 1;
    for (const item of data.items) {
      const record = watchRecord(item, since, now);
      if (record) found.set(record.original, record);
    }
    const oldest = data.items.at(-1)?.publishedAt;
    if (!data.page.hasMore || (oldest && Number.isFinite(Date.parse(oldest)) && new Date(oldest) < since)) { complete = true; break; }
    if (typeof data.page.nextCursor !== 'string' || !data.page.nextCursor) throw new Error('AIHOT 分页游标缺失');
    cursor = data.page.nextCursor;
  }
  return { checkedAt: now.toISOString(), since: since.toISOString(), account: account.name, complete, pages, items: [...found.values()].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)) };
}

const escape = (value) => String(value).replace(/[\\`*_{}\[\]<>#!|\r\n]/g, ' ');
export function renderWatch(result) {
  const lines = [
    '# 公众号发现清单 · 私有待核对',
    '',
    '未核对微信原文 · 未调用 DeepSeek · 未发布。AIHOT 是卡兹克运营的聚合服务，本清单只用于发现链接；它的标题和日期仍须对照原文。',
    '',
    `检查时间：${result.checkedAt} · 覆盖起点：${result.since} · 扫描页数：${result.pages}`,
    '',
    result.complete ? '扫描范围完整；不保证上游收录了公众号全部文章。' : '扫描达到页数上限，范围不完整；不能据此断言没有更新。',
  ];
  if (!result.items.length) lines.push('', '本次未发现匹配条目；不代表公众号没有发文。');
  for (const item of result.items) lines.push('', `## ${escape(item.title)}`, '', `AIHOT 标题 · 来源发布时间：${item.publishedAt}`, '', `[打开公众号原文](<${item.original}>) · [AIHOT 索引](<${item.index}>)`, '', '- [ ] 人工确认原文标题、发布时间和正文', '- [ ] 确认摘要与图片使用边界');
  return lines.join('\n') + '\n';
}
