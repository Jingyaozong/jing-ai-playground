'use client';

import { useEffect, useRef, useState } from 'react';
import { MAX_CSV_BYTES, errorTags, exportReviewCsv, exportReviewText, importReviewCsv, type ReviewBatch, type ReviewRow, type ReviewStatus } from '../../lib/rule-review';
import { LocalRecordCopy } from './local-record-copy';

const statusLabels: Record<ReviewStatus, string> = { not_reviewed: '待复核', pass: '人工通过', fail: '不通过', needs_review: '待讨论' };
const routeOptions = [['', '尚未记录'], ['answer', '直接回答'], ['clarify', '先澄清'], ['human_review', '转人工'], ['out_of_scope', '范围外'], ['queue_failed', '转交失败'], ['answer_with_data_minimization', '最小信息回答']];
const emptyBatch: ReviewBatch = { runId: '', ruleVersion: '', systemVersion: '', testedAt: '', rows: [] };

export function RuleReview({ sample }: { sample: ReviewBatch }) {
  const [batch, setBatch] = useState<ReviewBatch>(emptyBatch);
  const [selected, setSelected] = useState(0);
  const [filter, setFilter] = useState('all');
  const [pending, setPending] = useState<ReviewBatch | null>(null);
  const [message, setMessage] = useState('可载入内置演练题，或导入本地 CSV。');
  const [dirty, setDirty] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const row = batch.rows[selected];
  const visible = batch.rows.map((item, index) => ({ item, index })).filter(({ item }) => filter === 'all' || item.status === filter);
  const reviewed = batch.rows.filter(item => item.status === 'pass' || item.status === 'fail').length;

  useEffect(() => {
    if (!dirty) return;
    const leave = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', leave);
    return () => window.removeEventListener('beforeunload', leave);
  }, [dirty]);

  function apply(next: ReviewBatch) {
    setBatch(next); setSelected(0); setFilter('all'); setPending(null); setDirty(false);
    setMessage(`已载入 ${next.rows.length} 条记录。原有状态按文件保留；没有自动评判。`);
  }
  function propose(next: ReviewBatch) { if (batch.rows.length) setPending(next); else apply(next); }
  function update(changes: Partial<ReviewRow>) {
    setBatch(current => ({ ...current, rows: current.rows.map((item, index) => index === selected ? { ...item, ...changes, status: changes.status ?? (item.status === 'pass' || item.status === 'fail' ? 'not_reviewed' : item.status) } : item) }));
    setDirty(true);
  }
  function metadata(key: 'runId' | 'ruleVersion' | 'systemVersion' | 'testedAt', value: string) {
    setBatch(current => ({ ...current, [key]: value })); setDirty(true);
  }
  function status(value: ReviewStatus) {
    if ((value === 'pass' || value === 'fail') && (!row.answer.trim() || !row.route)) { setMessage('请先填写实际回答和处理方式，再记录通过或不通过。'); return; }
    update({ status: value }); setMessage(`题目 ${row.id}：${statusLabels[value]}。此结论由填写者记录。`);
  }
  async function importFile(file?: File) {
    if (!file) return;
    setLoading(true);
    try {
      if (file.size > MAX_CSV_BYTES) throw new Error('文件超过 64 MB，请拆成较小批次。');
      const next = importReviewCsv(await file.text());
      propose(next);
    } catch (error) { setMessage(`${error instanceof Error ? error.message : '导入失败。'} 当前记录已保留。`); }
    finally { setLoading(false); if (fileInput.current) fileInput.current.value = ''; }
  }
  function download() {
    try {
      const url = URL.createObjectURL(new Blob([exportReviewCsv(batch)], { type: 'text/csv;charset=utf-8' }));
      const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'rule-review-records.csv';
      document.body.appendChild(anchor); anchor.click(); anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setDirty(false); setMessage(`已发起导出 ${batch.rows.length} 条记录；请保留下载文件，可重新导入续填。`);
    } catch { setMessage('下载未能发起，当前记录仍在页面中。请重试。'); }
  }
  return <section className="rule-review-desk" aria-label="规则答疑验收台">
    <div className="rule-review-toolbar"><div><h2>把题目放上来。</h2><p>支持演练包的 test-questions.csv，或本工具导出的复核 CSV。每批最多 100 题、文件不超过 64 MB。</p></div>
      <div className="rule-review-actions"><button type="button" disabled={loading || !!pending} onClick={() => propose(sample)}>载入 12 条虚构题</button><button type="button" disabled={loading || !!pending} onClick={() => fileInput.current?.click()}>{loading ? '正在读取…' : '导入 CSV'}</button><button type="button" disabled={!batch.rows.length || loading} onClick={download}>导出复核 CSV</button></div>
      <input ref={fileInput} type="file" accept=".csv,text/csv" aria-label="选择题目或复核 CSV" onChange={event => void importFile(event.target.files?.[0])} hidden />
      <p className="rule-review-local">文件只在浏览器内读取。记录保留在当前页，关闭前请导出；导出后可重新导入。{dirty && ' 当前有尚未导出的修改。'}</p>
    </div>
    <p className="rule-review-message" role="status" aria-live="polite">{message}</p>
    {pending && <div className="rule-review-replace"><h3>替换当前批次？</h3><p>将用 {pending.rows.length} 条记录替换当前 {batch.rows.length} 条记录。需要保留当前内容时，先导出复核 CSV。</p><div className="rule-review-actions"><button type="button" onClick={() => setPending(null)}>保留当前批次</button><button type="button" onClick={() => apply(pending)}>替换为导入批次</button></div></div>}
    {!row ? <div className="rule-review-empty"><span aria-hidden="true">□ → ✓</span><h3>一条回答，一份依据。</h3><p>载入题目后，从第一条开始。所有内置题目初始均为待复核。</p></div> : <>
      <div className="rule-review-meta">
        <label>批次名称<input maxLength={200} value={batch.runId} onChange={event => metadata('runId', event.target.value)} placeholder="例如：纸灯演练第一轮" /></label>
        <label>规则版本<input maxLength={200} value={batch.ruleVersion} onChange={event => metadata('ruleVersion', event.target.value)} placeholder="填写本轮依据版本" /></label>
        <label>待测系统或版本<input maxLength={200} value={batch.systemVersion} onChange={event => metadata('systemVersion', event.target.value)} placeholder="未运行可留空" /></label>
        <label>执行时间<input maxLength={200} value={batch.testedAt} onChange={event => metadata('testedAt', event.target.value)} placeholder="实际执行后填写" /></label>
      </div>
      <div className="rule-review-progress"><p>本批 {batch.rows.length} 题 · 已记录结论 {reviewed} 题</p><label>筛选题目<select value={filter} onChange={event => setFilter(event.target.value)}><option value="all">全部题目</option>{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label></div>
      <div className="rule-review-layout">
        <nav className="rule-review-questions" aria-label="选择复核题目">{visible.length ? visible.map(({ item, index }) => <button type="button" key={item.id} aria-current={index === selected ? 'step' : undefined} onClick={() => setSelected(index)}><span>{item.id}<small>{statusLabels[item.status]}</small></span><b>{item.question}</b></button>) : <p>这个筛选下没有题目，可切回全部。</p>}</nav>
        <div className="rule-review-form" key={row.id}>
          <div className="rule-review-question"><span className="mono">{row.id} / {row.type}</span><h3>当前问题</h3><p>{row.question}</p><small>题目中的队列条件：{row.queue || '未提供'} · 当前结论：{statusLabels[row.status]}</small>{filter !== 'all' && row.status !== filter && <small>此题不在当前筛选中；左侧可选择其他题目。</small>}</div>
          <label>实际回答<textarea rows={5} maxLength={8000} value={row.answer} onChange={event => update({ answer: event.target.value })} placeholder="填入本次实际输出；未执行请留空" /></label>
          <div className="rule-review-pair"><label>实际处理方式<select value={row.route} onChange={event => update({ route: event.target.value as ReviewRow['route'] })}>{routeOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><label>引用支持结论吗<select value={row.citationCheck} onChange={event => update({ citationCheck: event.target.value as ReviewRow['citationCheck'] })}><option value="">尚未检查</option><option value="yes">支持</option><option value="no">不支持</option><option value="not_applicable">不适用</option></select></label></div>
          <label>引用规则与版本<input maxLength={8000} value={row.citation} onChange={event => update({ citation: event.target.value })} placeholder="例如：R01 v1.0；没有引用可留空" /></label>
          <label>人工队列记录编号<input maxLength={8000} value={row.queueId} onChange={event => update({ queueId: event.target.value })} placeholder="只填写实际获得的编号" /></label>
          <fieldset><legend>错误标签 · 可多选</legend><div className="rule-review-tags">{errorTags.map(tag => <label key={tag}><input type="checkbox" checked={row.errors.includes(tag)} onChange={event => update({ errors: event.target.checked ? [...row.errors, tag] : row.errors.filter(value => value !== tag) })} />{tag}</label>)}</div></fieldset>
          <label>复核说明<textarea rows={3} maxLength={8000} value={row.note} onChange={event => update({ note: event.target.value })} placeholder="记录判断依据、待讨论项和复验安排" /></label>
          <label>人工复核结论<select value={row.status} onChange={event => status(event.target.value as ReviewStatus)}>{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
          <p className="rule-review-local">修改已判定的记录会回到待复核，请重新检查引用与结论。</p>
          <div className="rule-review-actions"><button type="button" disabled={selected === 0} onClick={() => setSelected(selected - 1)}>上一题</button><button type="button" disabled={selected === batch.rows.length - 1} onClick={() => setSelected(selected + 1)}>下一题</button><button type="button" onClick={download}>导出复核 CSV</button></div>
        </div>
      </div>
      <section className="rule-review-copy" aria-labelledby="rule-review-copy-title">
        <span className="mono">CURRENT QUESTION / 单题副本</span>
        <h2 id="rule-review-copy-title">带走当前题，<br />保留判断依据。</h2>
        <p>文字副本包含当前题目的全部字段和批次信息，便于交流；可恢复的整批记录仍请导出复核 CSV。复制不会替你保存修改，也不会改变复核状态。</p>
        <LocalRecordCopy key={selected} value={exportReviewText(batch, row)} label="复制当前题记录" success="已复制当前题的人工记录；整批记录请另行导出 CSV。" />
      </section>
    </>}
  </section>;
}
