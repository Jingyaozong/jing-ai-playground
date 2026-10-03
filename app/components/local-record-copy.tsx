'use client';

import { useEffect, useRef, useState } from 'react';
import { copyWithTimeout } from '../lib/copy-with-timeout';

export function LocalRecordCopy({ value, label, success }: { value: string; label: string; success: string }) {
  const revision = useRef(0);
  const [result, setResult] = useState<{ value: string; phase: 'waiting' | 'success' | 'unconfirmed' } | null>(null);
  const [manual, setManual] = useState<string | null>(null);
  useEffect(() => { return () => { revision.current += 1; }; }, [value]);
  const phase = result?.value === value ? result.phase : null;

  async function copy() {
    const request = ++revision.current;
    setResult({ value, phase: 'waiting' });
    const copied = await copyWithTimeout(value, navigator.clipboard?.writeText?.bind(navigator.clipboard));
    if (request !== revision.current) return;
    setResult({ value, phase: copied ? 'success' : 'unconfirmed' });
    if (!copied) setManual(value);
  }

  return <div className="local-record-copy">
    <div className="local-record-copy-actions"><button type="button" disabled={phase === 'waiting'} onClick={() => void copy()}>{phase === 'waiting' ? '正在复制…' : label}</button><button type="button" onClick={() => setManual(value)}>手动复制</button></div>
    <p role="status" aria-live="polite">{phase === 'waiting' ? '正在请求复制权限，最多等待 1.5 秒；也可直接选择手动复制。' : phase === 'success' ? success : phase === 'unconfirmed' ? '自动复制未确认完成，请使用下方文本框。未响应的权限请求可能稍后完成。' : '内容只在本地处理；修改记录后请重新复制。'}</p>
    {manual === value && <div className="local-record-copy-manual"><label>手动复制完整记录<textarea readOnly value={value} rows={10} onFocus={(event) => event.currentTarget.select()} /></label><p>电脑先全选，再按 Ctrl+C（Mac 按 ⌘C）；手机长按文本选择复制。</p><button type="button" onClick={() => setManual(null)}>关闭手动复制</button></div>}
  </div>;
}
