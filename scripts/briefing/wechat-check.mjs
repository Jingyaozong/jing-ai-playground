import { lstat, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { originalUrl } from './wechat-feed.mjs';

const filename = 'wechat-latest-check.json';

export function validateWechatCheck(value, now = new Date()) {
  if (!value || value.version !== 1 || !['source-only', 'no-recent'].includes(value.status)) throw new Error('公众号预检记录无效');
  const checked = new Date(value.checkedAt);
  if (!Number.isFinite(checked.getTime()) || checked > now || now - checked > 7 * 86400000) throw new Error('公众号预检记录已过期');
  if (value.status === 'no-recent') {
    if (value.article !== null) throw new Error('公众号空预检记录无效');
    return { status: value.status, checkedAt: checked.toISOString(), article: null, stale: now - checked > 24 * 3600000 };
  }
  const article = value.article;
  if (!article || typeof article.title !== 'string' || !article.title.trim() || article.title.length > 180 || /[\u0000-\u001f]/.test(article.title) || !Number.isInteger(article.bodyChars) || article.bodyChars < 500 || article.bodyChars > 15000) throw new Error('公众号文章预检字段无效');
  const published = new Date(article.publishedAt);
  if (!Number.isFinite(published.getTime()) || published > checked || checked - published > 48 * 3600000) throw new Error('公众号文章预检时间无效');
  return { status: value.status, checkedAt: checked.toISOString(), stale: now - checked > 24 * 3600000, article: { title: article.title, publishedAt: published.toISOString(), url: originalUrl(article.url), bodyChars: article.bodyChars } };
}

export async function saveWechatCheck(directory, article, now = new Date()) {
  const record = validateWechatCheck({
    version: 1, status: article ? 'source-only' : 'no-recent', checkedAt: now.toISOString(),
    article: article ? { title: article.title, publishedAt: article.publishedAt, url: article.url, bodyChars: article.body.length } : null,
  }, now);
  await writeFile(resolve(directory, filename), JSON.stringify({ version: 1, status: record.status, checkedAt: record.checkedAt, article: record.article }, null, 2));
  return record;
}

export async function readWechatCheck(directory, now = new Date()) {
  const path = resolve(directory, filename);
  let stat;
  try { stat = await lstat(path); }
  catch (error) { if (error.code === 'ENOENT') return null; throw error; }
  if (!stat.isFile() || stat.size > 4096) throw new Error('公众号预检记录文件无效');
  try { return validateWechatCheck(JSON.parse(await readFile(path, 'utf8')), now); }
  catch (error) { if (error.message === '公众号预检记录已过期') return null; throw error; }
}
