import { sources } from './pipeline.mjs';
const escape = (value) => String(value).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

// Only the pipeline's small Markdown subset is supported; raw HTML stays text.
function inline(text) {
  const pattern = /\[([^\]]+)\]\(<(https:[^>]+)>\)/g;
  let result='', offset=0;
  for (const match of text.matchAll(pattern)) {
    result+=escape(text.slice(offset,match.index));
    try {
      const url=new URL(match[2]);
      if (url.username || url.password || !sources.some(source=>source.origin===url.origin && url.pathname.startsWith(source.path))) throw new Error('foreign link');
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

export function renderDraftPage(records, detail) {
  const content = detail ? `<a href="/drafts/">← 返回待审稿</a><article>${renderDraftText(detail.text)}</article>` : records.length
    ? records.map(record=>`<article><p class="label">编辑候选 · 未发布</p><h2><a href="/drafts/${escape(record.name)}/">${escape(record.name.slice(0,10))} 的待审简报</a></h2><p>${record.ids.length} 条内容 · 待荆确认</p><a href="/drafts/${escape(record.name)}/">打开阅读 →</a></article>`).join('')
    : '<article><h2>还没有待审稿</h2><p>先选择文章、完成免费预检，再决定是否调用模型生成。这里不会自动生成内容。</p></article>';
  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>本地待审稿 · JING AI PLAYGROUND</title><style>
*{box-sizing:border-box}body{margin:0;background:#fffdf7;color:#16243a;font:16px/1.9 "Microsoft YaHei",sans-serif}main{max-width:900px;margin:auto;padding:56px 36px 90px}nav{margin-bottom:42px}a{color:#245bff;text-underline-offset:5px}a:focus-visible{outline:3px solid #ff7059;outline-offset:5px}header{margin-bottom:42px}h1{font-size:clamp(30px,4vw,44px);line-height:1.5;margin:18px 0}h1 span{background:#ffd94a;border-radius:8px;padding:0 8px}h2{font-size:24px;line-height:1.65;text-wrap:pretty;margin:20px 0}h3{font-size:17px;margin-top:32px}.label{font:12px/1.8 Consolas,monospace;color:#687080}article{padding:32px;margin:26px 0;border:2px solid #16243a;border-radius:22px;background:#fff;box-shadow:5px 6px 0 #dceaff}p{color:#536174;margin:18px 0}article *{overflow-wrap:anywhere}hr{border:0;border-top:1px solid #bfc7d2;margin:36px 0}.check{font-size:14px}footer{margin-top:36px;font-size:13px;color:#687080}@media(max-width:600px){main{padding:30px 22px 60px}article{padding:22px}h2{font-size:21px}}
</style></head><body><main><nav><a href="/">← 返回选稿</a></nav><header><div class="label">JING AI PLAYGROUND / LOCAL REVIEW</div><h1>先核对，<span>再决定。</span></h1><p>本地待审稿 · 待荆确认 · 未发布。以下内容仅据 RSS 摘要整理，未核对全文，不代表荆的个人观点。</p></header>${content}<footer>只读预览：勾选符号仅展示文件记录，不构成审核或发布操作。原文链接需主动打开；本页不调用模型。</footer></main></body></html>`;
}
