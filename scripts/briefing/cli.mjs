import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { collect, generate, renderDraft, selectCandidates, validateDraft } from './pipeline.mjs';
import { reserveDailyRequest, shanghaiDay } from './run-guard.mjs';

const command = process.argv[2];
const root = resolve(import.meta.dirname, '../..');
const directory = resolve(root, 'work/briefing');
const day = shanghaiDay();

async function save(items, usage, demo) {
  const folder = resolve(directory, `${demo ? 'demo-' : ''}${day}-${Date.now()}`);
  await mkdir(folder, { recursive: true });
  await writeFile(resolve(folder, 'review.md'), renderDraft(items, day, demo), { flag: 'wx' });
  // No API key or raw model response is persisted. IDs support local cross-run deduplication.
  await writeFile(resolve(folder, 'manifest.json'), JSON.stringify({ status: 'pending-review', demo, ids: items.map((item) => item.source.id), usage }, null, 2), { flag: 'wx' });
  console.log(`本地待审稿：${resolve(folder, 'review.md')}\n条目：${items.length}；未发布、未执行 Git 操作。`);
}

async function main() {
  if (!['demo', 'collect', 'draft'].includes(command)) throw new Error('使用 briefing:demo、briefing:collect 或 briefing:draft');
  if (command === 'demo') {
    const candidates = [{ id: 'demo-only', source: '离线虚构来源', url: 'https://example.com/demo-only', publishedAt: `${day}T00:00:00.000Z`, title: '虚构工具样例', excerpt: '仅测试排版和流程。' }];
    const items = validateDraft({ items: [{ sourceId: 'demo-only', title: '离线样例：镜头整理工具更新', summary: '这是人为编写的虚构输入，仅用于验证待审稿模板，不对应真实新闻。', relevance: '编辑推测：这类更新可能帮助整理镜头；本例不构成工具推荐。', uncertainty: '没有真实产品、评测或事件，不能发布为新闻。' }] }, candidates);
    await save(items, null, true);
    return;
  }
  if (command === 'draft' && !process.env.DEEPSEEK_API_KEY?.trim()) throw new Error('缺少 DEEPSEEK_API_KEY；未请求来源或付费 API。请在本地 .env.local 配置，不要发到聊天中。');
  const records = await collect();
  await mkdir(directory, { recursive: true });
  const seen = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (!entry.isDirectory() || !/^\d{4}-\d{2}-\d{2}-\d+$/.test(entry.name)) continue;
    const manifest = JSON.parse(await readFile(resolve(directory, entry.name, 'manifest.json'), 'utf8'));
    seen.push(...manifest.ids);
  }
  const candidates = selectCandidates(records, seen);
  if (command === 'collect') {
    const path = resolve(directory, `candidates-${Date.now()}.json`);
    await writeFile(path, JSON.stringify({ fetchedAt: new Date().toISOString(), candidates }, null, 2), { flag: 'wx' });
    console.log(`收集 ${candidates.length} 条近七日候选：${path}\n仅收集 RSS；未调用模型、未发布。`);
    return;
  }
  if (!candidates.length) { console.log('没有新的近七日候选，未调用模型、未发布。'); return; }
  // Atomic daily reservation also blocks concurrent processes and uncertain retries.
  await reserveDailyRequest(directory);
  const { items, usage } = await generate(candidates, process.env.DEEPSEEK_API_KEY);
  await save(items, usage, false);
}

main().catch((error) => {
  // Never dump fetch request objects, headers, provider bodies or credentials.
  console.error(`简报流程已停止：${error instanceof TypeError || error instanceof SyntaxError ? '网络或数据格式异常' : error.message}`);
  process.exitCode = 1;
});
