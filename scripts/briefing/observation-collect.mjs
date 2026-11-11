import { pathToFileURL } from 'node:url';
import { podcastSources } from '../../app/data/observation-sources.mjs';
import { canonicalUrl, parseFeed, plain, readLimited } from './pipeline.mjs';

const feeds = [
  { name: 'AIHOT 精选', url: 'https://aihot.news/api/v1/items?mode=selected&window=24h&limit=30' },
  { name: 'AIHOT 热点', url: 'https://aihot.news/api/v1/hot-topics' },
];

function httpsLink(value) {
  if (typeof value !== 'string' || value.length > 2000) return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password ? url.href : null;
  } catch { return null; }
}

export function indexCandidates(data) {
  if (!Array.isArray(data?.items) || data.items.length > 100) throw new Error('AIHOT 响应格式异常');
  const seen = new Set();
  return data.items.flatMap((item) => {
    const title = typeof item?.title === 'string' ? plain(item.title).slice(0, 180) : '';
    const original = httpsLink(item?.links?.original);
    let index;
    try {
      index = canonicalUrl(item?.links?.story ?? item?.links?.aihot, { origin: 'https://aihot.news', path: '/' });
    } catch { return []; }
    if (!title || !original || seen.has(original)) return [];
    seen.add(original);
    return [{ title, original, index }];
  });
}

export async function collectObservation(now = new Date(), fetcher = fetch) {
  const read = async (url) => readLimited(await fetcher(url, { redirect: 'error', signal: AbortSignal.timeout(12_000) }), 2_000_000);
  const jobs = [
    ...feeds.map(({name,url}) => ({ name, read: async () => indexCandidates(JSON.parse(await read(url))) })),
    ...podcastSources.map((source) => ({
      name: source.name,
      read: async () => parseFeed(await read(source.feed), source, now)
        .sort((a,b) => b.publishedAt.localeCompare(a.publishedAt)).slice(0, 5)
        .map(({title,url,publishedAt}) => ({title, episode: url, publishedAt})),
    })),
  ];
  return Promise.all(jobs.map(async ({name,read}) => {
    try { return { name, ok: true, candidates: await read() }; }
    catch { return { name, ok: false, candidates: [] }; }
  }));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const sources = await collectObservation();
  console.log(JSON.stringify({ status: '只供本地选题；核对原文、写入待验证问题后才可发稿', sources }, null, 2));
  if (sources.every(({ok}) => !ok)) process.exitCode = 1;
}
