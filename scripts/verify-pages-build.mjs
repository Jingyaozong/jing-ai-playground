import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';

const outputDirectory = join(process.cwd(), 'out');
const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? '';
const isUserSite = repositoryName.endsWith('.github.io');
const basePath = repositoryName && !isUserSite ? `/${repositoryName}` : '';
const siteUrl = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000')
  .toString()
  .replace(/\/$/, '');

const requiredFiles = [
  'index.html',
  '404.html',
  'notes/index.html',
  'notes/ai-video-local-effects-spatial-control/index.html',
  'notes/ai-video-lighting-continuity/index.html',
  'library/index.html',
  'prompts/index.html',
  'stories/she-forgets-yesterday/index.html',
  'stories/no-boat-at-pier-seven/index.html',
  'stories/before-the-rain-ends/index.html',
  'stories/shadow-arrives-five-minutes-early/index.html',
  'experiments/forty-shots-one-character/index.html',
  'experiments/what-reference-images-lock/index.html',
  'experiments/can-local-rain-follow-a-character/index.html',
  'experiments/can-one-light-survive-a-reverse-angle/index.html',
  'experiments/can-a-shadow-move-on-its-own/index.html',
  'tools/story-seed/index.html',
  'tools/review-pace/index.html',
  'tools/shot-list-cleaner/index.html',
  'tools/local-effect-card/index.html',
  'tools/lighting-ledger/index.html',
  'og.png',
];

const missingFiles = requiredFiles.filter((file) => !existsSync(join(outputDirectory, file)));
if (missingFiles.length > 0) {
  throw new Error(`静态导出缺少文件：\n${missingFiles.map((file) => `- ${file}`).join('\n')}`);
}

const homepage = readFileSync(join(outputDirectory, 'index.html'), 'utf8');
const expectedChecks = [
  [`${basePath}/_next/`, 'Next.js 静态资源路径'],
  [`href="${basePath}/stories/`, 'Stories 内部链接'],
  [`href="${basePath}/notes/`, 'Notes 内部链接'],
  [`${siteUrl}/og.png`, '社交分享图地址'],
];

const failedChecks = expectedChecks.filter(([value]) => !homepage.includes(value));
if (failedChecks.length > 0) {
  throw new Error(`GitHub Pages 路径检查失败：\n${failedChecks.map(([, label]) => `- ${label}`).join('\n')}`);
}

function listFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? listFiles(path) : [path];
  });
}

function localOutputPath(reference) {
  if (!reference.startsWith('/') || reference.startsWith('//')) return null;
  const pathname = reference.split(/[?#]/, 1)[0];

  if (basePath && pathname !== basePath && !pathname.startsWith(`${basePath}/`)) {
    return { error: `缺少 basePath：${reference}` };
  }

  const withoutBase = basePath ? pathname.slice(basePath.length) || '/' : pathname;
  let relativePath;
  try {
    relativePath = decodeURIComponent(withoutBase).replace(/^\/+/, '');
  } catch {
    return { error: `无法解码路径：${reference}` };
  }

  if (!relativePath || relativePath.endsWith('/')) relativePath += 'index.html';
  else if (!extname(relativePath)) relativePath = join(relativePath, 'index.html');
  return { path: join(outputDirectory, relativePath) };
}

const allFiles = listFiles(outputDirectory);
const htmlFiles = allFiles.filter((file) => file.endsWith('.html'));
const cssFiles = allFiles.filter((file) => file.endsWith('.css'));
const referenceErrors = new Set();
const checkedReferences = new Set();

for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');
  for (const match of html.matchAll(/<[^>]+\b(?:href|src)=["']([^"']+)["'][^>]*>/g)) {
    if (/\brel=["'][^"']*preconnect/.test(match[0])) continue;
    const result = localOutputPath(match[1]);
    if (!result) continue;
    if (result.error) referenceErrors.add(`${result.error} · ${file}`);
    else {
      checkedReferences.add(result.path);
      if (!existsSync(result.path)) referenceErrors.add(`导出文件不存在：${match[1]} · ${file}`);
    }
  }
}

for (const file of cssFiles) {
  const css = readFileSync(file, 'utf8');
  for (const match of css.matchAll(/url\((?:["']?)([^"')]+)(?:["']?)\)/g)) {
    const reference = match[1];
    if (/^(?:data:|https?:|#)/.test(reference)) continue;
    const rootResult = localOutputPath(reference);
    if (rootResult?.error) referenceErrors.add(`${rootResult.error} · ${file}`);
    const assetPath = rootResult?.path ?? resolve(dirname(file), reference.split(/[?#]/, 1)[0]);
    checkedReferences.add(assetPath);
    if (!existsSync(assetPath)) referenceErrors.add(`CSS 资源不存在：${reference} · ${file}`);
  }
}

if (referenceErrors.size > 0) {
  throw new Error(`全站静态引用检查失败：\n${[...referenceErrors].slice(0, 30).map((item) => `- ${item}`).join('\n')}`);
}

console.log(`GitHub Pages 导出检查通过：${requiredFiles.length} 个关键文件、${htmlFiles.length} 个 HTML 页面、${checkedReferences.size} 个本地引用，basePath="${basePath || '/'}"。`);
