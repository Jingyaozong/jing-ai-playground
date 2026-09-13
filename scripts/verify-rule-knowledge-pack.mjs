import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const packDirectory = join(process.cwd(), 'public', 'downloads', 'rule-knowledge-desk-practice-v1.0');
const archivePath = join(process.cwd(), 'public', 'downloads', 'rule-knowledge-desk-practice-v1.0.zip');
const expectedFiles = [
  'README.md',
  'rules-v1.0.md',
  'test-questions.csv',
  'answer-key.csv',
  'review-log-template.csv',
  'change-log.md',
  'manifest.json',
];

const failures = [];
for (const filename of expectedFiles) {
  const filePath = join(packDirectory, filename);
  if (!existsSync(filePath) || statSync(filePath).size === 0) failures.push(`缺少或为空：${filename}`);
}

if (!existsSync(archivePath) || statSync(archivePath).size < 1000) {
  failures.push('ZIP 不存在或内容过小');
} else {
  const archive = readFileSync(archivePath);
  if (archive[0] !== 0x50 || archive[1] !== 0x4b) failures.push('ZIP 文件头无效');
  const binaryText = archive.toString('latin1');
  for (const filename of expectedFiles) {
    if (!binaryText.includes(filename)) failures.push(`ZIP 目录缺少：${filename}`);
  }
}

if (existsSync(join(packDirectory, 'manifest.json'))) {
  const manifest = JSON.parse(readFileSync(join(packDirectory, 'manifest.json'), 'utf8'));
  if (manifest.version !== '1.0') failures.push('清单版本不是 1.0');
  if (manifest.status !== 'synthetic-unexecuted-practice-material') failures.push('清单未标明虚构且未执行');
  if (manifest.boundaries?.containsRealProjectData !== false) failures.push('清单未明确排除真实项目数据');
  if (manifest.boundaries?.containsModelResults !== false) failures.push('清单未明确排除模型结果');
}

if (existsSync(join(packDirectory, 'test-questions.csv'))) {
  const questionRows = readFileSync(join(packDirectory, 'test-questions.csv'), 'utf8').trim().split(/\r?\n/).length - 1;
  if (questionRows !== 12) failures.push(`测试题应为 12 条，实际 ${questionRows} 条`);
}

if (failures.length > 0) throw new Error(`规则答疑演练包检查失败：\n${failures.map((item) => `- ${item}`).join('\n')}`);
console.log('规则答疑演练包检查通过：v1.0，7 个文件，12 条合成测试题；ZIP、清单与内容边界有效。');
