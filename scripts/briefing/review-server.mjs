import { createServer } from 'node:http';
import { readFile, readdir, lstat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { renderReviewPage } from './review-page.mjs';
import { draftedIds, draftRecords, readDraft } from './draft-records.mjs';
import { renderDraftPage } from './draft-page.mjs';
const directory = resolve(import.meta.dirname, '../../work/briefing');
try {
  const names = (await readdir(directory)).filter(name => /^candidates-\d{13}\.json$/.test(name)).sort();
  const file = names.at(-1);
  if (!file) throw new Error('没有候选清单，请先运行 briefing:collect');
  const path = resolve(directory, file);
  const stat = await lstat(path);
  if (!stat.isFile() || stat.size > 100000) throw new Error('候选文件无效或过大');
  const snapshot = JSON.parse(await readFile(path, 'utf8'));
  const server = createServer(async (req, res) => {
    const detail = req.url?.match(/^\/drafts\/(\d{4}-\d{2}-\d{2}-\d+)\/$/);
    if (req.headers.host !== '127.0.0.1:4318' || req.method !== 'GET' || (req.url !== '/' && req.url !== '/drafts/' && !detail)) { res.writeHead(404); res.end(); return; }
    let page;
    try {
      if (detail) {
        const text = await readDraft(directory, detail[1]);
        if (text === null) { res.writeHead(404); res.end('Not found'); return; }
        page = renderDraftPage([], {text});
      } else if (req.url === '/drafts/') page = renderDraftPage(await draftRecords(directory));
      else page = renderReviewPage(snapshot, file, new Date(), await draftedIds(directory));
    }
    catch { res.writeHead(503, {'Content-Type':'text/plain; charset=utf-8','Cache-Control':'no-store'}); res.end('暂时无法安全选稿：候选已过期或本地待审记录异常。请重新采集或核对记录后刷新；未调用模型。'); return; }
    res.writeHead(200, { 'Content-Type':'text/html; charset=utf-8', 'Cache-Control':'no-store', 'X-Content-Type-Options':'nosniff', 'Content-Security-Policy':"default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; connect-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'" });
    res.end(page);
  });
  server.on('error', () => { console.error('本地预览启动失败，请检查端口 4318 是否被占用。'); process.exitCode = 1; });
  server.listen(4318, '127.0.0.1', () => console.log('本地选稿：http://127.0.0.1:4318/\n只显示启动时的最新清单；重新采集后重启此命令。Ctrl+C 关闭。无模型调用。'));
} catch { console.error('无法打开本地清单：请确认已采集近七日有效候选。'); process.exitCode = 1; }
