// 验收检查：扫描 out/ 里的导出页面和仓库源码，输出可核对的数字。
// 先构建再运行：npm run build && npm run acceptance
import { execSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const out = join(process.cwd(), 'out');
const pages = [];
(function walk(directory) {
  for (const entry of readdirSync(join(out, directory), { withFileTypes: true })) {
    const path = directory ? `${directory}/${entry.name}` : entry.name;
    if (entry.isDirectory()) { if (!['_next', '_not-found', '404'].includes(entry.name)) walk(path); } else if (entry.name === 'index.html') pages.push(path);
  }
})('');

const attr = (html, pattern) => html.match(pattern)?.[1]?.replaceAll('&amp;', '&') ?? '';
const rows = pages.map((file) => {
  const raw = readFileSync(join(out, file), 'utf8');
  const head = raw.slice(0, raw.indexOf('</head>'));
  const text = raw.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');
  const ogImage = attr(head, /<meta property="og:image" content="([^"]*)"/);
  const imageFile = ogImage ? join(out, new URL(ogImage).pathname.replace(/^\/jing-ai-playground/, '')) : '';
  return {
    route: `/${file.replace(/index\.html$/, '')}`,
    title: attr(head, /<title>([^<]*)<\/title>/),
    description: attr(head, /<meta name="description" content="([^"]*)"/),
    ogTitle: attr(head, /<meta property="og:title" content="([^"]*)"/),
    ogDescription: attr(head, /<meta property="og:description" content="([^"]*)"/),
    ogImage,
    ogImageExists: Boolean(imageFile) && existsSync(imageFile),
    noindex: /<meta name="robots" content="[^"]*noindex/.test(head),
    fiction: (text.match(/虚构/g) ?? []).length,
    navItems: [...(text.match(/<nav class="desktop-nav"[^>]*>([\s\S]*?)<\/nav>/)?.[1] ?? '').matchAll(/<a\b/g)].length,
    video: (text.match(/<video\b/g) ?? []).length,
  };
});

const publicPages = rows.filter((row) => !row.noindex && row.route !== '/archive/');
const missing = (list, test) => list.filter(test).map((row) => row.route);
// 拆开写，避免这个脚本自己被计入。
const banned = [['待荆', '确认'], ['编辑', '候选'], ['编辑', '稿'], ['不代表荆', '已确认'], ['AI-', 'ASSISTED'], ['PILOT ', 'NOTICE'], ['本站编辑', '转译']].map((parts) => parts.join('')).join('|');
const sourceFiles = execSync('git ls-files -co --exclude-standard', { encoding: 'utf8' }).split('\n')
  .filter((file) => file && existsSync(file) && !/\.(png|webp|jpg|zip|ico|woff2?)$/.test(file));
let bannedCount = 0;
for (const file of sourceFiles) bannedCount += (readFileSync(file, 'utf8').match(new RegExp(banned, 'g')) ?? []).length;

const sitemap = existsSync(join(out, 'sitemap.xml')) ? [...readFileSync(join(out, 'sitemap.xml'), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]) : [];

const report = {
  导出页面数: rows.length,
  对外页面数: publicPages.length,
  归档页面数_noindex: rows.length - publicPages.length,
  源码中代写与未确认标注次数: bannedCount,
  对外页面中出现虚构的页面: missing(publicPages, (row) => row.fiction > 0),
  全部页面中出现虚构的页面: missing(rows, (row) => row.fiction > 0),
  导航项数: [...new Set(rows.map((row) => row.navItems))],
  缺少title的对外页面: missing(publicPages, (row) => !row.title),
  缺少description的对外页面: missing(publicPages, (row) => !row.description),
  description超过80字的对外页面: missing(publicPages, (row) => row.description.length > 80),
  缺少ogTitle的对外页面: missing(publicPages, (row) => !row.ogTitle),
  缺少ogDescription的对外页面: missing(publicPages, (row) => !row.ogDescription),
  缺少ogImage或图片文件不存在的对外页面: missing(publicPages, (row) => !row.ogImageExists),
  缺少description或ogImage的全部页面: missing(rows, (row) => !row.description || !row.ogImageExists),
  站点地图条目数: sitemap.length,
  站点地图中被设为noindex的条目: sitemap.filter((url) => rows.some((row) => row.noindex && url.endsWith(row.route))),
  含video标签的页面: missing(rows, (row) => row.video > 0),
};
console.log(JSON.stringify(report, null, 2));
console.log('\n对外页面：\n' + publicPages.map((row) => `${row.route}  |  ${row.title}`).join('\n'));
