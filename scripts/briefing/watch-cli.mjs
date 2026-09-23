import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { discoverWatch, renderWatch } from './aihot-watch.mjs';

const directory = resolve(import.meta.dirname, '../../work/briefing');
try {
  const result = await discoverWatch();
  await mkdir(directory, { recursive: true });
  const path = resolve(directory, `watch-${Date.now()}.md`);
  await writeFile(path, renderWatch(result), { flag: 'wx' });
  console.log(`发现 ${result.items.length} 条数字生命卡兹克的近 48 小时索引；扫描${result.complete ? '完整' : '未完成'}。\n私有核对清单：${path}\n未调用 DeepSeek，未核对微信原文，未发布。`);
} catch (error) {
  console.error(`公众号发现已停止：${error instanceof TypeError || error instanceof SyntaxError ? '网络或数据格式异常' : error.message}`);
  process.exitCode = 1;
}
