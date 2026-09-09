import { spawnSync } from 'node:child_process';

const repository = 'Jingyaozong/jing-ai-playground';
const siteUrl = 'https://jingyaozong.github.io/jing-ai-playground';
const npmEntry = process.env.npm_execpath;
if (!npmEntry) throw new Error('无法定位当前 npm 执行入口，请通过 npm run verify:pages:repository 运行。');
const environment = {
  ...process.env,
  GITHUB_ACTIONS: 'true',
  GITHUB_REPOSITORY: repository,
  NEXT_PUBLIC_SITE_URL: siteUrl,
};

for (const script of ['build', 'verify:pages']) {
  const result = spawnSync(process.execPath, [npmEntry, 'run', script], {
    cwd: process.cwd(),
    env: environment,
    stdio: 'inherit',
  });

  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

console.log(`仓库路径模拟通过：${siteUrl}/`);
