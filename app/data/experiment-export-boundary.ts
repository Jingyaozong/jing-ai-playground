export const localExportNotice = '> 本表是当前浏览器的工作副本：状态、评分和文件路径仅反映本机保存的记录，未自动核验原始素材，也不会更新网站公开实验进度、样本或结论。公开前须逐条核对素材与记录。';

export function needsOriginalEvidence(status: string, asset: string): boolean {
  return status === 'reviewed' && !asset.trim();
}

export function localExportEvidenceSummary(records: Array<{ id: string | number; status: string; asset: string }>): string {
  const marked = records.filter((record) => record.status !== 'untested');
  const missing = marked.filter((record) => !record.asset.trim());
  return `> 本机标记为已有输出：${marked.length} 条；其中未填写原始素材：${missing.length} 条${missing.length ? `（${missing.map((record) => record.id).join('、')}）` : ''}。填写路径也不等于素材已核验。`;
}

export function markdownTableRow(cells: readonly (string | number | null | undefined)[]): string {
  return `| ${cells.map((value) => String(value === '' || value == null ? '—' : value)
    .replaceAll('\\', '\\\\')
    .replaceAll('|', '\\|')
    .replace(/\r\n?|\n/g, ' ↵ ')
    .replaceAll('\t', ' ')).join(' | ')} |`;
}
