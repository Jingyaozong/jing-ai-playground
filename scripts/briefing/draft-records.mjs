import { readdir, readFile, lstat } from 'node:fs/promises';
import { resolve } from 'node:path';

export async function draftRecords(directory) {
  const records = [];
  for (const entry of await readdir(directory, { withFileTypes:true })) {
    if (!/^\d{4}-\d{2}-\d{2}-\d+$/.test(entry.name)) continue;
    if (!entry.isDirectory() || entry.isSymbolicLink()) throw new Error('待审稿目录无效');
    const path = resolve(directory, entry.name, 'manifest.json');
    const stat = await lstat(path);
    if (!stat.isFile() || stat.size > 100000) throw new Error('待审稿记录无效');
    const record = JSON.parse(await readFile(path,'utf8'));
    if (record.demo !== false || record.status !== 'pending-review' || !Array.isArray(record.ids) || record.ids.length > 5 || record.ids.some(id=>typeof id !== 'string' || !/^[a-f0-9]{16}$/.test(id))) throw new Error('待审稿记录损坏，请先核对，未忽略该记录');
    const review = await lstat(resolve(directory, entry.name, 'review.md'));
    if (!review.isFile() || review.size > 200000) throw new Error('待审稿正文缺失或过大');
    records.push({ name:entry.name, ids:record.ids });
  }
  return records.sort((a,b)=>b.name.localeCompare(a.name));
}

export async function draftedIds(directory) {
  return [...new Set((await draftRecords(directory)).flatMap(record=>record.ids))];
}

export async function readDraft(directory, name) {
  if (!/^\d{4}-\d{2}-\d{2}-\d+$/.test(name)) throw new Error('无效稿件编号');
  const records = await draftRecords(directory);
  if (!records.some(record=>record.name === name)) return null;
  return readFile(resolve(directory,name,'review.md'),'utf8');
}
