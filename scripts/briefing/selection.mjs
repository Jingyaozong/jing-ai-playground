import { createHash } from 'node:crypto';
import { canonicalUrl, limits, sources } from './pipeline.mjs';

export function selectionOptions(args) {
  if (!args.length) return null;
  if ((args.length !== 4 && args.length !== 5) || args[0] !== '--file' || args[2] !== '--pick' || (args.length === 5 && args[4] !== '--check')) throw new Error('格式：--file candidates-时间戳.json --pick 1,3 [--check]');
  if (!/^candidates-\d{13}\.json$/.test(args[1]) || !/^[1-9]\d*(,[1-9]\d*)*$/.test(args[3])) throw new Error('仅接受工作目录内的候选文件名和正整数序号');
  const positions = args[3].split(',').map(Number);
  if (positions.length > limits.items || new Set(positions).size !== positions.length) throw new Error('请选择一至五条不重复候选');
  return { file: args[1], positions, check: args[4] === '--check' };
}

export function selectedCandidates(snapshot, positions, seen = [], now = new Date()) {
  if (!snapshot || !Array.isArray(snapshot.candidates) || snapshot.candidates.length > limits.candidates) throw new Error('候选文件结构无效');
  const fresh = (value) => typeof value === 'string' && Number.isFinite(Date.parse(value)) && Date.parse(value) <= +now && +now - Date.parse(value) <= limits.days * 86400000;
  if (!fresh(snapshot.fetchedAt)) throw new Error('候选清单过期或采集日期无效，请重新采集');
  if (!positions.length || positions.length > limits.items || new Set(positions).size !== positions.length) throw new Error('选择数量或序号重复');
  const ids = new Set(seen);
  return positions.map((position) => {
    const item = Number.isSafeInteger(position) && position > 0 ? snapshot.candidates[position - 1] : null;
    if (!item) throw new Error('候选序号不存在');
    const source = sources.find((entry) => entry.name === item.source);
    if (!source || typeof item.url !== 'string') throw new Error('候选来源无效');
    const url = canonicalUrl(item.url, source);
    const id = createHash('sha256').update(url).digest('hex').slice(0, 16);
    if (id !== item.id || ids.has(id)) throw new Error('候选 ID 无效、重复或已经生成待审稿');
    if (!fresh(item.publishedAt)) throw new Error('候选文章过期或日期无效');
    for (const [key, max] of [['title', 180], ['excerpt', 800]]) {
      if (typeof item[key] !== 'string' || !item[key].trim() || item[key].length > max) throw new Error('候选文字缺失或超限');
    }
    ids.add(id);
    return { id, source: source.name, url, publishedAt: item.publishedAt, title: item.title, excerpt: item.excerpt };
  });
}
