export function LocalRecordRecovery({ source }: { source: string | null }) {
  if (source === null) return null;
  return (
    <aside className="experiment-record-recovery" role="alert">
      <strong>本机草稿格式异常，已暂停自动保存。</strong>
      <p>当前表格不是原始记录。先展开并复制下面的原始备份，留底后再清空本地记录。</p>
      <details>
        <summary>查看并复制原始备份</summary>
        <textarea readOnly value={source} aria-label="本机原始记录备份" onFocus={(event) => event.currentTarget.select()} />
      </details>
    </aside>
  );
}
