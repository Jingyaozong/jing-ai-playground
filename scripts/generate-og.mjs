// 生成统一模板的分享图（1200×630）：标题 + 姓名 + 方向。
// 标题变了以后重新运行：npm run og
// 需要本机装有 Noto Sans SC（开源字体，Windows 11 自带）。
import { mkdirSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const [{ stories, experiments, tools }, { getAllNotes }, { profile }] = await Promise.all([
  import('../app/data/content.ts'),
  import('../lib/notes.ts'),
  import('../app/data/profile.ts'),
]);
const caseTitle = readFileSync(join(process.cwd(), 'app/data/blind-test.ts'), 'utf8').match(/title: '([^']+)'/)[1];

const pages = [
  ['default', profile.tagline.replace(/，并把.*$/, '')],
  ['cases', '评测案例'],
  ['five-model-blind-test', caseTitle],
  ['bad-case-detective', 'Bad Case 侦探'],
  ['method', '评测方法'],
  ['practice', '创作实践'],
  ['about', '关于与联系'],
  ['archive', '归档'],
  ...getAllNotes().map((note) => [`note-${note.slug}`, note.title]),
  ...experiments.filter((item) => item.slug).map((item) => [`experiment-${item.slug}`, item.title]),
  ...stories.filter((item) => item.slug).map((item) => [`story-${item.slug}`, item.title]),
  ...tools.filter((item) => item.href).map((item) => [`tool-${item.href.split('/').filter(Boolean).pop()}`, item.label]),
];

const escape = (text) => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const widthOf = (char) => (/[\u0000-ÿ]/.test(char) ? 0.56 : 1);

function wrap(text, limit) {
  const lines = [];
  let line = '';
  let width = 0;
  for (const char of text) {
    if (width + widthOf(char) > limit && !'，。？！、：；）》”'.includes(char)) {
      lines.push(line);
      line = '';
      width = 0;
    }
    line += char;
    width += widthOf(char);
  }
  if (line) lines.push(line);
  return lines.slice(0, 3);
}

function svg(title) {
  const long = [...title].reduce((sum, char) => sum + widthOf(char), 0) > 26;
  const size = long ? 60 : 76;
  const lines = wrap(title, long ? 17 : 13);
  const lineHeight = size * 1.35;
  const top = 315 - ((lines.length - 1) * lineHeight) / 2 + size * 0.35;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#faf8f3"/>
  <rect x="80" y="84" width="56" height="8" rx="4" fill="#d9a514"/>
  <text x="80" y="140" font-family="Noto Sans SC" font-size="28" font-weight="500" fill="#5d6675">${escape(profile.siteName)}</text>
  ${lines.map((line, index) => `<text x="80" y="${top + index * lineHeight}" font-family="Noto Sans SC" font-size="${size}" font-weight="700" fill="#16243a">${escape(line)}</text>`).join('\n  ')}
  <rect x="80" y="514" width="1040" height="1" fill="#e4e0d6"/>
  <text x="80" y="566" font-family="Noto Sans SC" font-size="28" font-weight="500" fill="#16243a">${escape(profile.name)}　·　${escape(profile.roleLine)}</text>
</svg>`;
}

const directory = join(process.cwd(), 'public', 'og');
rmSync(directory, { recursive: true, force: true });
mkdirSync(directory, { recursive: true });
for (const [key, title] of pages) {
  await sharp(Buffer.from(svg(title))).png({ compressionLevel: 9, palette: true }).toFile(join(directory, `${key}.png`));
}
// 根目录的 og.png 是首页和兜底分享图。
await sharp(Buffer.from(svg(pages[0][1]))).png({ compressionLevel: 9, palette: true }).toFile(join(process.cwd(), 'public', 'og.png'));
console.log(`已生成 ${pages.length + 1} 张分享图。`);
