import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { draftedIds } from './draft-records.mjs';
import { reserveDailyRequest, shanghaiDay } from './run-guard.mjs';
import { fetchWechatArticles, generateBreakdown, renderWechatDraft } from './wechat-feed.mjs';
import { saveWechatCheck } from './wechat-check.mjs';

const mode = process.argv[2];
const directory = resolve(import.meta.dirname, '../../work/briefing');

async function main() {
  if (!['check', 'draft'].includes(mode)) throw new Error('使用 briefing:wechat:check 或 briefing:wechat:draft');
  if (mode === 'draft' && !process.env.DEEPSEEK_API_KEY?.trim()) throw new Error('缺少 DEEPSEEK_API_KEY；未请求来源或付费 API');
  await mkdir(directory, { recursive: true });
  const seen = new Set(await draftedIds(directory));
  const articles = await fetchWechatArticles();
  const article = articles.find((entry) => !seen.has(entry.id));
  if (mode === 'check') {
    await saveWechatCheck(directory, article ?? null);
    if (!article) { console.log('近 48 小时没有新的、正文长度合格的卡兹克文章；未调用 DeepSeek。不能据此断言公众号没有更新。本地预检状态已更新。'); return; }
    console.log(`发现待核对文章：${article.title}\nRSS 时间：${article.publishedAt}\n原文链接：${article.url}\n第三方正文长度：${article.body.length} 字符；仅在内存中检查，未保存正文。\n未调用 DeepSeek，未发布。`);
    return;
  }
  if (!article) { console.log('近 48 小时没有新的、正文长度合格的卡兹克文章；未调用 DeepSeek。不能据此断言公众号没有更新。'); return; }
  await reserveDailyRequest(directory);
  const { breakdown, usage } = await generateBreakdown(article, process.env.DEEPSEEK_API_KEY);
  const folder = resolve(directory, `${shanghaiDay()}-${Date.now()}`);
  await mkdir(folder, { recursive: true });
  await writeFile(resolve(folder, 'review.md'), renderWechatDraft(article, breakdown, shanghaiDay()), { flag: 'wx' });
  await writeFile(resolve(folder, 'manifest.json'), JSON.stringify({ status: 'pending-review', demo: false, ids: [article.id], usage, inputKind: 'third-party-wechat-rss', originalVerified: false }, null, 2), { flag: 'wx' });
  console.log(`本地待审稿：${resolve(folder, 'review.md')}\nAPI tokens：${usage?.total_tokens ?? '未返回'}；未保存第三方全文、未发布。`);
}

main().catch((error) => {
  console.error(`公众号拆解已停止：${error instanceof TypeError || error instanceof SyntaxError ? '网络或数据格式异常' : error.message}`);
  process.exitCode = 1;
});
