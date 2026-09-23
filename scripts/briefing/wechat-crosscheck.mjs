import { originalUrl } from './wechat-feed.mjs';

function identity(value) {
  const url = new URL(originalUrl(value));
  return ['__biz', 'mid', 'idx', 'sn'].map((key) => url.searchParams.get(key) ?? '').join('|');
}

export function crossCheckWatch(article, watch) {
  if (!article || !watch || !Array.isArray(watch.items) || typeof watch.complete !== 'boolean') throw new Error('双源核对输入无效');
  const expected = identity(article.url);
  const match = watch.items.find((item) => identity(item.original) === expected);
  if (match) return { status: 'matched', checkedAt: watch.checkedAt, index: match.index };
  return { status: watch.complete ? 'not-found' : 'incomplete', checkedAt: watch.checkedAt, index: null };
}
