// Next 的静态导出把分段预取文件写成嵌套目录（__next.a/b/__PAGE__.txt），
// 而浏览器请求的是点号拼接的文件名（__next.a.b.__PAGE__.txt）。
// 构建后补一份点号文件名的副本，避免静态托管上出现 404。
import { copyFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const out = join(process.cwd(), 'out');
let copied = 0;

function flatten(base, prefix, directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) flatten(base, `${prefix}.${entry.name}`, path);
    else {
      const target = join(base, `${prefix}.${entry.name}`);
      if (!existsSync(target)) { copyFileSync(path, target); copied += 1; }
    }
  }
}

(function walk(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const path = join(directory, entry.name);
    if (entry.name.startsWith('__next.')) flatten(directory, entry.name, path);
    else if (entry.name !== '_next') walk(path);
  }
})(out);
console.log(`预取文件补齐：${copied} 个。`);
