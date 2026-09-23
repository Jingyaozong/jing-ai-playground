import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { auditSources, saveSourceAudit } from './wechat-source-audit.mjs';

const directory = resolve(import.meta.dirname, '../../work/briefing');
try {
  const audit = await auditSources();
  await mkdir(directory, { recursive: true });
  const saved = await saveSourceAudit(directory, audit);
  for (const record of saved.records) console.log(`${record.name}：${record.status}${record.latest ? ` · ${record.latest.title} · ${record.latest.publishedAt}` : ''}`);
  console.log('仅保存私有标题、发布时间和公众号原文链接；未保存正文、未调用 DeepSeek、未发布。');
} catch (error) {
  console.error(`公众号来源核验已停止：${error.message}`);
  process.exitCode = 1;
}
