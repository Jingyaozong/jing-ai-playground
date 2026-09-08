import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

test('private briefing output is excluded from the exported website', () => {
  const root = resolve(import.meta.dirname, '../..');
  const out = resolve(root, 'out');
  assert.ok(existsSync(resolve(out, 'index.html')), 'Run build before this check');
  assert.ok(!existsSync(resolve(out, 'work')));
  assert.ok(!existsSync(resolve(out, 'scripts/briefing')));
  const files = readdirSync(out, { recursive: true });
  for (const file of files.filter((file) => file.endsWith('.html'))) {
    const html = readFileSync(resolve(out, file), 'utf8');
    for (const marker of ['离线样例：镜头整理工具更新', 'DEEPSEEK_API_KEY', 'work/briefing']) assert.ok(!html.includes(marker), `Private briefing content in ${file}`);
  }
});
