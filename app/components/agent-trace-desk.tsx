'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  acceptanceLabels, emptyTraceReview, exportTraceBundle, MAX_TRACE_CHARS, parseTraceRecord,
  syntheticAgentTrace, traceCategories, traceReport, traceReviewGaps,
  type AgentTrace, type TraceReview,
} from '../../lib/agent-trace-review';

type RecordState = { trace: AgentTrace; review: TraceReview };
const statusLabels = { ok: '日志 OK', error: '显式报错', unknown: '状态未知' };

export function AgentTraceDesk() {
  const [source, setSource] = useState('');
  const [loadedSource, setLoadedSource] = useState('');
  const [record, setRecord] = useState<RecordState | null>(null);
  const [pending, setPending] = useState<{ source: string; record: RecordState } | null>(null);
  const [selected, setSelected] = useState(0);
  const [query, setQuery] = useState('');
  const [errorsOnly, setErrorsOnly] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [message, setMessage] = useState('可以先打开虚构演练，熟悉一次完整复核。');
  const fileInput = useRef<HTMLInputElement>(null);
  const unsaved = dirty || source !== loadedSource;
  const report = useMemo(() => record ? traceReport(record.trace, record.review) : '', [record]);
  const gaps = record ? traceReviewGaps(record.trace, record.review) : [];
  const step = record?.trace.steps[selected];
  const errors = record?.trace.steps.filter((item) => item.status === 'error') ?? [];
  const visibleSteps = record?.trace.steps.map((item, index) => ({ ...item, index })).filter((item) => (!errorsOnly || item.status === 'error') && `${item.id} ${item.tool} ${item.input} ${item.output}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())) ?? [];

  useEffect(() => {
    if (!unsaved) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [unsaved]);

  function apply(next: RecordState, text: string) {
    setRecord(next); setSource(text); setLoadedSource(text); setPending(null); setSelected(0); setQuery(''); setErrorsOnly(false); setDirty(false);
    setMessage(`已载入 ${next.trace.caseId}，共 ${next.trace.steps.length} 步。${next.trace.kind === 'synthetic' ? '这是独立虚构演练。' : '请核对日志来源与完整性。'}`);
  }
  function load(text: string) {
    try {
      const next = parseTraceRecord(text);
      if (record && (dirty || text !== loadedSource)) setPending({ record: next, source: text });
      else apply(next, text);
    } catch (error) { setMessage(error instanceof Error ? error.message : '载入失败，当前记录保留。'); }
  }
  function demo() {
    const text = JSON.stringify(syntheticAgentTrace, null, 2);
    if (unsaved && !record) setPending({ record: { trace: syntheticAgentTrace, review: emptyTraceReview(syntheticAgentTrace) }, source: text });
    else load(text);
  }
  async function openFile(file?: File) {
    if (!file) return;
    try {
      if (file.size > 4_000_000) throw new Error('文件超过 4 MB，请拆成单条任务；当前记录保留。');
      load((await file.text()).replace(/^\uFEFF/, ''));
    } catch (error) { setMessage(error instanceof Error ? error.message : '文件读取失败，当前记录保留。'); }
    finally { if (fileInput.current) fileInput.current.value = ''; }
  }
  function updateReview(changes: Partial<TraceReview>) {
    setRecord((current) => current ? { ...current, review: { ...current.review, ...changes } } : current);
    setDirty(true);
  }
  function updateCheck(index: number, changes: Partial<TraceReview['checks'][number]>) {
    if (!record) return;
    updateReview({ checks: record.review.checks.map((item, at) => at === index ? { ...item, ...changes } : item) });
  }
  function download(kind: 'json' | 'md') {
    if (!record) return;
    try {
    const url = URL.createObjectURL(new Blob([kind === 'json' ? exportTraceBundle(record.trace, record.review) : report], { type: kind === 'json' ? 'application/json;charset=utf-8' : 'text/markdown;charset=utf-8' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = `agent-trace-review.${kind}`;
    document.body.appendChild(anchor); anchor.click(); anchor.remove(); window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    if (kind === 'json') setDirty(false);
    setMessage(`已发起${kind === 'json' ? '复核包下载；其中包含当前已载入轨迹和人工记录，可粘贴回本页恢复' : 'Markdown 报告下载；记录状态仍为待最终确认'}。${source !== loadedSource ? '输入框的新文本尚未解析，不在本次导出内。' : ''}`);
    } catch (error) { setMessage(error instanceof Error ? error.message : '下载未能发起，当前记录保留。'); }
  }
  async function copy() {
    try { await navigator.clipboard.writeText(report); setMessage('已复制复核报告，来源和未完成项一并保留。'); }
    catch { setMessage('自动复制未获允许，可在报告框中选择文本后手动复制。'); }
  }

  return <div className="trace-desk">
    <section className="trace-input-card" aria-labelledby="trace-input-title">
      <div className="trace-section-head"><div><span className="mono">START WITH A TRACE</span><h2 id="trace-input-title">把过程放上桌。</h2></div><p>粘贴单条任务的 JSON 或本工具导出的复核包。最多 100 步；只在当前浏览器处理，关闭前请下载保存。</p></div>
      <label className="trace-field">轨迹 JSON<textarea value={source} maxLength={MAX_TRACE_CHARS} onChange={(event) => setSource(event.target.value)} spellCheck={false} rows={8} placeholder="先载入虚构演练查看格式，或粘贴已整理的结构化轨迹。" /></label>
      <div className="trace-actions"><button type="button" className="trace-primary" onClick={() => load(source)} disabled={!source.trim() || (!!record && source === loadedSource)}>解析这份记录</button><button type="button" onClick={() => fileInput.current?.click()}>打开 JSON 文件</button><button type="button" onClick={demo}>载入虚构演练</button></div>
      <input ref={fileInput} type="file" accept=".json,application/json" aria-label="选择本地轨迹 JSON" hidden onChange={(event) => void openFile(event.target.files?.[0])} />
      <details className="trace-format"><summary>输入格式与状态含义</summary><p>这是本站的通用记录格式，需要先把平台日志映射到这些字段。steps 数组按发生顺序排列，id 唯一；input、output 使用文本，只保留可观察参数与返回。</p><pre>{'{\n  "version": 1, "kind": "user_record",\n  "caseId": "CASE-001", "task": "任务要求",\n  "acceptance": ["可核对的验收要求"],\n  "steps": [{"id":"S1", "tool":"read_file",\n    "status":"unknown", "input":"输入参数", "output":"可见返回"}]\n}'}</pre><p>kind 可为 user_record（使用者记录）或 synthetic（独立虚构）。status 可为 ok、error、unknown，均表示日志声明；ok 不等于产物通过验收。复核包同时保存原始字段和人工记录。</p></details>
    </section>
    <p className="trace-message" role="status" aria-live="polite">{message}</p>
    {pending && <section className="trace-replace" aria-label="替换记录确认"><h3>替换当前工作记录？</h3><p>新记录为 {pending.record.trace.caseId}。需要保留当前复核时，先取消并下载复核包。</p><div className="trace-actions"><button type="button" onClick={() => setPending(null)}>保留当前记录</button><button type="button" onClick={() => apply(pending.record, pending.source)}>确认载入新记录</button></div></section>}

    {!record && <div className="trace-empty"><span className="mono">READ → LOCATE → VERIFY</span><h2>先读轨迹，<br />再下判断。</h2><p>演练里，错误参数出现在文件报错之前。试着找到它，再检查“保存成功”是否真的意味着任务完成。</p></div>}
    {record && step && <>
      <section className="trace-case" aria-label="当前任务">
        <span className={`trace-origin ${record.trace.kind === 'synthetic' ? 'is-demo' : ''}`}>{record.trace.kind === 'synthetic' ? '独立虚构演练 · 未执行模型' : '使用者记录 · 来源待自行核对'}</span>
        <h2>{record.trace.caseId}</h2><p>{record.trace.task}</p>
        <div className="trace-observations"><span>{record.trace.steps.length} 个步骤</span><span>日志 error {errors.length} 处</span><span>首个显式报错：{errors[0]?.id ?? '未记录'}</span></div>
        {source !== loadedSource && <p className="trace-stale">输入文本有变化。下方仍是上次载入的记录；点击“解析这份记录”后才会更新。</p>}
      </section>
      <section className="trace-workspace" aria-label="按步骤复核轨迹">
        <aside className="trace-index"><h2>执行顺序</h2><label className="trace-field">查找步骤<input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="工具、参数或返回内容" /></label><label className="trace-toggle"><input type="checkbox" checked={errorsOnly} onChange={(event) => setErrorsOnly(event.target.checked)} />只看显式报错</label><p className="trace-index-count" aria-live="polite">显示 {visibleSteps.length} / {record.trace.steps.length} 步</p>
          <nav aria-label="选择轨迹步骤">{visibleSteps.map((item) => <button type="button" key={item.id} aria-current={selected === item.index ? 'step' : undefined} onClick={() => setSelected(item.index)} className={record.review.localization === 'located' && record.review.firstDeviationId === item.id ? 'has-deviation' : ''}><span className="mono">{item.id}</span><strong>{item.tool}</strong><small>{statusLabels[item.status]}{record.review.localization === 'located' && record.review.firstDeviationId === item.id ? ' · 人工偏离点' : ''}</small></button>)}</nav>
          {!visibleSteps.length && <p>没有匹配步骤。清空搜索或取消“只看显式报错”可返回全部。</p>}
        </aside>
        <article className="trace-step" aria-labelledby="trace-step-title">
          <div className="trace-step-head"><span className="mono">STEP {selected + 1} / {record.trace.steps.length}</span><span className={`trace-status status-${step.status}`}>{statusLabels[step.status]}</span></div>
          <h2 id="trace-step-title">{step.id} · {step.tool}</h2>
          <div className="trace-step-body"><section><h3>输入与参数</h3><pre>{step.input || '未记录'}</pre></section><section><h3>可见返回</h3><pre>{step.output || '未记录'}</pre></section></div>
          <button type="button" className="trace-mark" onClick={() => { updateReview({ localization: 'located', firstDeviationId: step.id }); setMessage(`已将 ${step.id} 标记为人工定位的首个偏离点，请在下方补充依据。`); }}>标记此步为首个偏离</button>
          <p className="trace-small">显式报错由日志标记；首个偏离需要对照任务要求判断。即使只显示报错，右侧仍保留当前所选步骤。</p>
        </article>
      </section>
      <section className="trace-review" aria-labelledby="trace-review-title">
        <div className="trace-section-head"><div><span className="mono">HUMAN REVIEW</span><h2 id="trace-review-title">让判断有落点。</h2></div><p>写清观察到的事实，再写原因假设。日志缺失时，注明目前证据能支持到哪里。</p></div>
        <div className="trace-form-grid">
          <label className="trace-field">定位状态<select value={record.review.localization} onChange={(event) => updateReview({ localization: event.target.value as TraceReview['localization'], firstDeviationId: '' })}><option value="pending">尚未定位</option><option value="located">发现可观察的偏离</option><option value="none">已复核，未发现偏离</option></select></label>
          <label className="trace-field">首个偏离步骤<select disabled={record.review.localization !== 'located'} value={record.review.firstDeviationId} onChange={(event) => updateReview({ firstDeviationId: event.target.value })}><option value="">尚未选择</option>{record.trace.steps.map((item) => <option key={item.id} value={item.id}>{item.id} · {item.tool}</option>)}</select></label>
          <label className="trace-field trace-full">现象分类<select value={record.review.category} onChange={(event) => updateReview({ category: event.target.value as TraceReview['category'] })}>{Object.entries(traceCategories).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
          <label className="trace-field trace-full">定位依据<textarea rows={3} maxLength={8000} value={record.review.evidence} onChange={(event) => updateReview({ evidence: event.target.value })} placeholder="哪条要求与哪个输入 / 返回不一致？此前步骤检查了什么？若未发现偏离，写核查依据。" /></label>
          <label className="trace-field">原因假设 · 待验证<textarea rows={4} maxLength={8000} value={record.review.hypothesis} onChange={(event) => updateReview({ hypothesis: event.target.value })} placeholder="区分规则、数据、工具环境和模型能力；尚不能确定就保留未知。" /></label>
          <label className="trace-field">下一步验证<textarea rows={4} maxLength={8000} value={record.review.nextTest} onChange={(event) => updateReview({ nextTest: event.target.value })} placeholder="固定什么，只改什么，怎样重跑，核对哪项产物证据？" /></label>
        </div>
      </section>
      <section className="trace-acceptance" aria-labelledby="trace-acceptance-title"><div className="trace-section-head"><div><span className="mono">CHECK THE DELIVERABLE</span><h2 id="trace-acceptance-title">最后，验产物。</h2></div><p>这里记录人工判断。工具不会打开或执行日志里提到的文件。</p></div>
        {record.trace.acceptance.map((criterion, index) => <article key={index}><h3>{index + 1}. {criterion}</h3><div className="trace-criterion-fields"><label className="trace-field">验收判断 {index + 1}<select value={record.review.checks[index].result} onChange={(event) => updateCheck(index, { result: event.target.value as TraceReview['checks'][number]['result'] })}>{Object.entries(acceptanceLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><label className="trace-field">验收证据 {index + 1}<textarea rows={2} maxLength={8000} value={record.review.checks[index].evidence} onChange={(event) => updateCheck(index, { evidence: event.target.value })} placeholder="可填写文件名、单元格、核对结果；没有产物时明确写未取得。" /></label></div></article>)}
      </section>
      <section className="trace-export" aria-labelledby="trace-export-title"><div><span className="mono">TAKE THE EVIDENCE WITH YOU</span><h2 id="trace-export-title">带走一份<br />可复核的记录。</h2><p>复核包保存全部输入与人工记录；Markdown 便于交流。任何未完成项都会跟随导出。</p>{gaps.length ? <ul>{gaps.map((gap) => <li key={gap}>{gap}</li>)}</ul> : <p>必要字段已填写。任务是否成功、根因是否成立，仍以证据和最终复核为准。</p>}<div className="trace-actions"><button type="button" onClick={copy}>复制复核报告</button><button type="button" onClick={() => download('md')}>下载 Markdown</button><button type="button" className="trace-primary" onClick={() => download('json')}>下载可恢复复核包</button></div></div><label className="trace-field">报告预览<textarea readOnly value={report} rows={20} onFocus={(event) => event.currentTarget.select()} /></label></section>
    </>}
  </div>;
}
