import { sources } from './pipeline.mjs';
import { createHash } from 'node:crypto';
import { mountRemark } from './remark-client.mjs';
const escape = (value) => String(value).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const beijingTime = (value) => new Intl.DateTimeFormat('zh-CN', { timeZone: 'Asia/Shanghai', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(value));

// Only the pipeline's small Markdown subset is supported; raw HTML stays text.
function inline(text) {
  const pattern = /\[([^\]]+)\]\(<(https:[^>]+)>\)/g;
  let result='', offset=0;
  for (const match of text.matchAll(pattern)) {
    result+=escape(text.slice(offset,match.index));
    try {
      const url=new URL(match[2]);
      const knownRss = sources.some(source=>source.origin===url.origin && url.pathname.startsWith(source.path));
      const knownWechat = url.origin==='https://mp.weixin.qq.com' && url.pathname==='/s' && url.searchParams.get('__biz')==='MzIyMzA5NjEyMA==' && !!url.searchParams.get('mid') && !!url.searchParams.get('sn');
      if (url.username || url.password || !(knownRss || knownWechat)) throw new Error('foreign link');
      result+=`<a href="${escape(url.href)}" target="_blank" rel="noopener noreferrer" referrerpolicy="no-referrer">${escape(match[1])} ↗</a>`;
    } catch { result+=escape(match[0]); }
    offset=match.index+match[0].length;
  }
  return result+escape(text.slice(offset));
}

export function renderDraftText(markdown) {
  return markdown.split(/\r?\n/).map(line=>{
    if (!line.trim()) return '';
    if (line==='---') return '<hr>';
    const heading=line.match(/^#{1,3} (.+)$/);
    if (heading) return `<h2>${inline(heading[1])}</h2>`;
    const emphasis=line.match(/^\*\*(.+)\*\*$/);
    if (emphasis) return `<h3>${inline(emphasis[1])}</h3>`;
    const check=line.match(/^- \[([ x])\] (.+)$/i);
    if (check) return `<p class="check">${check[1].toLowerCase()==='x'?'☑':'☐'} ${inline(check[2])}</p>`;
    return `<p>${inline(line)}</p>`;
  }).join('\n');
}

export function renderDraftPage(records, detail, sourceCheck = null) {
  const key=detail ? 'jing-briefing-remark-v1:'+createHash('sha256').update((detail.name ?? '')+'\n'+detail.text).digest('hex') : '';
  const remark=detail ? `<section class="remark" aria-labelledby="remark-heading"><h2 id="remark-heading">把待核实的，记下来。</h2><p>仅存在当前浏览器，不修改原稿、不发送给模型，也不代表批准发布。原稿变更后，旧版本备注不会自动套用。</p><label for="remark">审阅备注（最多 3000 字符）</label><textarea id="remark" maxlength="3000" rows="6" placeholder="例如：核实可用地区；标题需要收敛。请勿填写密钥或敏感信息。"></textarea><button id="remark-copy" disabled>复制备注</button><p id="remark-status" role="status"></p><p>清空输入框即可删除本版本备注；清除浏览器数据会丢失备注，请及时复制备份。</p></section><script>(${mountRemark.toString()})(${JSON.stringify(key)},window);</script>` : '';
  const source = !detail && sourceCheck ? `<section class="source-check" aria-labelledby="source-check-title"><p class="label">公众号来源预检 · 仅本地</p><h2 id="source-check-title">${sourceCheck.article ? escape(sourceCheck.article.title) : '近 48 小时没有合格的新候选'}</h2><p>${sourceCheck.stale ? '预检已超过 24 小时；请重新运行免费预检。' : '预检时间：'+beijingTime(sourceCheck.checkedAt)+'（北京）。'}${sourceCheck.article ? ' RSS 发布时间：'+beijingTime(sourceCheck.article.publishedAt)+'（北京）。' : ''}</p><p>仅检查第三方订阅源的链接与正文长度；没有保存正文，也未与微信原文逐字核对。此处不是 AI 拆解或已发布文章。</p>${sourceCheck.article ? `<a href="${escape(sourceCheck.article.url)}" target="_blank" rel="noopener noreferrer" referrerpolicy="no-referrer">打开微信公众号原文 ↗</a>` : ''}<p class="source-next">如需更新，运行 <code>npm run briefing:wechat:check</code>；模型请求机会另受每日限制。</p></section>` : '';
  const content = detail ? `<a href="/drafts/">← 返回待审稿</a><article>${renderDraftText(detail.text)}</article>` : source + (records.length
    ? records.map(record=>`<article><p class="label">编辑候选 · 未发布</p><h2><a href="/drafts/${escape(record.name)}/">${escape(record.name.slice(0,10))} 的待审稿</a></h2><p>${record.ids.length} 条内容 · 待荆确认</p><a href="/drafts/${escape(record.name)}/">打开阅读 →</a></article>`).join('')
    : '<article><h2>还没有待审稿</h2><p>先选择文章、完成免费预检，再决定是否调用模型生成。这里不会自动生成内容。</p></article>');
  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>本地待审稿 · JING AI PLAYGROUND</title><style>
*{box-sizing:border-box}body{margin:0;background:#fffdf7;color:#16243a;font:16px/1.9 "Microsoft YaHei",sans-serif}main{max-width:900px;margin:auto;padding:56px 36px 90px}nav{margin-bottom:42px}a{color:#245bff;text-underline-offset:5px}a:focus-visible{outline:3px solid #ff7059;outline-offset:5px}header{margin-bottom:42px}h1{font-size:clamp(30px,4vw,44px);line-height:1.5;margin:18px 0}h1 span{background:#ffd94a;border-radius:8px;padding:0 8px}h2{font-size:24px;line-height:1.65;text-wrap:pretty;margin:20px 0}h3{font-size:17px;margin-top:32px}.label{font:12px/1.8 Consolas,monospace;color:#687080}article{padding:32px;margin:26px 0;border:2px solid #16243a;border-radius:22px;background:#fff;box-shadow:5px 6px 0 #dceaff}p{color:#536174;margin:18px 0}article *{overflow-wrap:anywhere}hr{border:0;border-top:1px solid #bfc7d2;margin:36px 0}.check{font-size:14px}footer{margin-top:36px;font-size:13px;color:#687080}@media(max-width:600px){main{padding:30px 22px 60px}article{padding:22px}h2{font-size:21px}}
.remark{margin-top:48px;background:#dceaff;border:2px solid #16243a;border-radius:22px;padding:28px}.remark p{font-size:14px}.remark textarea{display:block;width:100%;margin:14px 0 20px;padding:16px;border:1px solid #16243a;border-radius:12px;font:16px/1.8 "Microsoft YaHei",sans-serif;resize:vertical}.remark button{font:inherit;padding:10px 18px;border:2px solid #16243a;border-radius:12px;background:#ffd94a;min-height:44px;cursor:pointer}.remark button:disabled{opacity:.5;cursor:not-allowed}.remark :focus-visible{outline:3px solid #245bff;outline-offset:4px}@media(max-width:600px){.remark{padding:22px}}
.source-check{margin:28px 0 48px;padding:30px 32px;background:#dceaff;border:2px solid #16243a;border-left:10px solid #245bff;border-radius:22px;box-shadow:5px 6px 0 #c6eadc}.source-check h2{margin:10px 0 8px}.source-check p{margin:12px 0}.source-check .source-next{font-size:14px;margin-top:26px}.source-check code{overflow-wrap:anywhere;color:#16243a}@media(max-width:600px){.source-check{padding:22px 20px;border-left-width:7px}}
</style></head><body><main><nav><a href="/">← 返回选稿</a></nav><header><div class="label">JING AI PLAYGROUND / LOCAL REVIEW</div><h1>先核对，<span>再决定。</span></h1><p>本地待审稿 · 待荆确认 · 未发布。可能来自 RSS 摘要或第三方正文副本；具体来源以每篇稿件标注为准，均未核对原文，不代表荆的个人观点。</p></header>${content}${remark}<footer>原稿只读：勾选符号仅展示文件记录，不构成审核或发布操作。原文链接需主动打开；本页不调用模型。</footer></main></body></html>`;
}
