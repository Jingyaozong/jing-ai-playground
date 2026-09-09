import { existsSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';

const expectedBranch = 'main';
const expectedRemote = 'https://github.com/Jingyaozong/jing-ai-playground.git';
const workflowPath = join(process.cwd(), '.github', 'workflows', 'deploy-pages.yml');
const errors = [];

function git(args, { allowFailure = false } = {}) {
  const result = spawnSync('git', args, {
    cwd: process.cwd(),
    encoding: 'utf8',
  });

  if (result.error) throw result.error;
  if (result.status !== 0 && !allowFailure) {
    throw new Error(`git ${args.join(' ')} 执行失败：${result.stderr.trim()}`);
  }

  return {
    ok: result.status === 0,
    output: result.stdout.trim(),
  };
}

const branch = git(['branch', '--show-current']).output;
if (branch !== expectedBranch) errors.push(`当前分支是 ${branch || '未知'}，应为 ${expectedBranch}`);

const remote = git(['remote', 'get-url', 'origin']).output;
if (remote !== expectedRemote) errors.push(`origin 地址不匹配：${remote || '未配置'}`);

const status = git(['status', '--porcelain']).output;
if (status) errors.push('Git 工作区不是干净状态，请先检查并提交本地修改');

const envIgnored = git(['check-ignore', '-q', '.env.local'], { allowFailure: true }).ok;
if (!envIgnored) errors.push('.env.local 没有被 .gitignore 排除');

const envTracked = git(['ls-files', '--error-unmatch', '.env.local'], { allowFailure: true }).ok;
if (envTracked) errors.push('.env.local 已被 Git 跟踪，可能泄漏 API key');

for (const privatePath of ['out', 'outputs', 'work']) {
  const tracked = git(['ls-files', privatePath]).output;
  if (tracked) errors.push(`${privatePath}/ 中存在被 Git 跟踪的生成或私有文件`);
}

if (!existsSync(workflowPath)) {
  errors.push('缺少 GitHub Pages Actions 工作流');
} else {
  const workflow = readFileSync(workflowPath, 'utf8');
  const requiredCommands = [
    'npm ci',
    'npm run lint',
    'npm run typecheck',
    'npm run verify:content',
    'npm run build',
    'npm run verify:pages',
    'npm run verify:navigation',
    'npm run verify:briefing',
    'npm run verify:briefing-export',
  ];

  for (const command of requiredCommands) {
    if (!workflow.includes(`run: ${command}`)) errors.push(`Actions 缺少步骤：${command}`);
  }
  if (!workflow.includes('path: out')) errors.push('Actions 上传目录不是 out');
}

let aheadCount = '未知（本地没有 origin/main 引用）';
const originMain = git(['show-ref', '--verify', '--quiet', 'refs/remotes/origin/main'], { allowFailure: true });
if (originMain.ok) aheadCount = git(['rev-list', '--count', 'origin/main..HEAD']).output;

if (errors.length > 0) {
  throw new Error(`上传前审计失败：\n${errors.map((item) => `- ${item}`).join('\n')}`);
}

console.log('上传前审计通过：');
console.log(`- 分支：${branch}`);
console.log(`- 远端：${remote}`);
console.log(`- 工作区：干净`);
console.log(`- .env.local：${existsSync(join(process.cwd(), '.env.local')) ? '存在于本地且未跟踪' : '未创建且未跟踪'}`);
console.log('- Actions：完整检查与 out/ 发布边界已对齐');
console.log(`- 相对 origin/main 的本地提交数：${aheadCount}`);
console.log('本命令没有连接、上传或修改 GitHub。');
