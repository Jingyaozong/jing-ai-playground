'use client';

import { useEffect, useState } from 'react';
import { writeLocalRecordSnapshot } from '../data/local-record-save';

type SaveAttempt = { key: string; snapshot: string; failed: boolean };

export function useLocalRecordSave(key: string, records: unknown, loaded: boolean) {
  const [attempt, setAttempt] = useState<SaveAttempt | null>(null);
  const snapshot = JSON.stringify(records);

  useEffect(() => {
    if (!loaded) return;
    let failed = false;
    try {
      failed = !writeLocalRecordSnapshot(window.localStorage, key, snapshot);
    } catch {
      failed = true;
    }
    const timer = window.setTimeout(() => setAttempt({ key, snapshot, failed }), 0);
    return () => window.clearTimeout(timer);
  }, [key, loaded, snapshot]);

  return {
    saved: loaded && attempt?.key === key && attempt.snapshot === snapshot && !attempt.failed,
    failed: loaded && attempt?.key === key && attempt.failed,
  };
}

export function LocalRecordSaveStatus({ loaded, saved, failed, blocked = false, savedLabel = '已保存到当前浏览器' }: { loaded: boolean; saved: boolean; failed: boolean; blocked?: boolean; savedLabel?: string }) {
  return (
    <span className={failed || blocked ? 'is-unsaved' : undefined} role="status" aria-live="polite">
      {!loaded ? '正在读取本地记录…' : blocked ? '本机记录异常 · 原数据未覆盖' : failed ? '本机保存失败 · 请复制下方 Markdown 留底' : saved ? savedLabel : '正在保存本地记录…'}
    </span>
  );
}
