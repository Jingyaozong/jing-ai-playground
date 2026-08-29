import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

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
  'library/index.html',
  'prompts/index.html',
  'stories/she-forgets-yesterday/index.html',
  'stories/no-boat-at-pier-seven/index.html',
  'stories/before-the-rain-ends/index.html',
  'experiments/forty-shots-one-character/index.html',
  'experiments/what-reference-images-lock/index.html',
  'experiments/can-local-rain-follow-a-character/index.html',
  'tools/story-seed/index.html',
  'tools/review-pace/index.html',
  'tools/shot-list-cleaner/index.html',
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

console.log(`GitHub Pages 导出检查通过：${requiredFiles.length} 个关键文件，basePath="${basePath || '/'}"。`);
