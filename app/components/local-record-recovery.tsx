'use client';

import { useState } from 'react';
import { createLocalRecordBackup, localRecordBackupFilename } from '../data/local-record-backup';

export function LocalRecordRecovery({ source }: { source: string | null }) {
  const [downloadFailed, setDownloadFailed] = useState(false);
  if (source === null) return null;
  const backupSource = source;

  function downloadBackup() {
    let url: string | null = null;
    let link: HTMLAnchorElement | null = null;
    try {
      url = URL.createObjectURL(createLocalRecordBackup(backupSource));
      link = document.createElement('a');
      link.href = url;
      link.download = localRecordBackupFilename;
      document.body.appendChild(link);
      link.click();
      setDownloadFailed(false);
    } catch {
      setDownloadFailed(true);
    } finally {
      link?.remove();
      if (url !== null) {
        const backupUrl = url;
        window.setTimeout(() => URL.revokeObjectURL(backupUrl), 1000);
      }
    }
  }

  return (
    <aside className="experiment-record-recovery" role="alert">
      <strong>本机草稿格式异常，已暂停自动保存。</strong>
      <p>当前表格不是原始记录。先下载原始备份，或展开手动复制；留底后再清空本地记录。备份只在当前浏览器生成，不上传。</p>
      <button type="button" onClick={downloadBackup}>下载原始备份 .txt ↓</button>
      {downloadFailed && <p className="experiment-record-recovery-error" role="status">下载未能启动，请展开下方原始内容手动复制。</p>}
      <details>
        <summary>查看原始内容并手动复制</summary>
        <textarea readOnly value={source} aria-label="本机原始记录备份" onFocus={(event) => event.currentTarget.select()} />
      </details>
    </aside>
  );
}
