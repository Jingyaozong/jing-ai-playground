'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { LocalRecordCopy } from './local-record-copy';
import {
  MAX_EVALUATION_CSV_BYTES, createEmptyEvaluationBatch, createEmptySample,
  evaluationDimensions, exportEvaluationCsv, filterEvaluationIssues, importEvaluationCsv, sampleReadinessIssues, summarizeEvaluationBatch,
  type DimensionReview, type EvaluationBatch, type EvaluationResult, type EvaluationSample,
  type EvaluationIssueFilter, type EvaluationSeverity, type RootCause, type RetestStatus, type SampleReviewState,
} from '../../lib/multimodal-evaluation';

const resultLabels: Record<EvaluationResult, string> = { not_reviewed: '待记录', pass: '满足', fail: '不满足', uncertain: '无法判断', not_applicable: '不适用' };
const severityLabels: Record<EvaluationSeverity, string> = { '': '尚未选择', blocker: '阻断', major: '重要', minor: '轻微' };
const rootCauseLabels: Record<RootCause, string> = { '': '尚未记录', pending: '待排查', data: '数据', rule: '规则', execution: '执行理解', tool_flow: '工具流程', model_hypothesis: '模型能力假设' };
const retestLabels: Record<RetestStatus, string> = { '': '尚未记录', not_planned: '暂不复验', pending: '待复验', passed: '复验满足', failed: '复验未满足' };
const reviewStateLabels: Record<SampleReviewState, string> = { draft: '填写中', ready_for_review: '待人工复核', reviewed: '已完成人工复核', needs_discussion: '待讨论' };

function sampleSummary(batch: EvaluationBatch, sample: EvaluationSample) {
  const lines = sample.dimensions.map((dimension, index) => {
    const definition = evaluationDimensions[index];
    const evidence = dimension.evidence.trim() || '未记录';
    return `${index + 1}. ${definition.label}｜${resultLabels[dimension.result]}｜${severityLabels[dimension.severity]}｜${dimension.timeRange.trim() || '无时间段'}\n   证据：${evidence}`;
  });
  return [
    '# 多模态评测人工记录', '',
    `- 批次：${batch.batchName.trim() || '未填写'}`,
    `- 规则版本：${batch.rubricVersion.trim() || '未填写'}`,
    `- 评测人：${batch.evaluator.trim() || '未填写'}`,
    `- 执行时间：${batch.testedAt.trim() || '未填写'}`,
    `- 样本 ID：${sample.sampleId.trim() || '未填写'}`,
    `- 输出文件 ID：${sample.outputId.trim() || '未填写'}`,
    `- 人工复核状态：${reviewStateLabels[sample.reviewState]}`,
    '', '## Prompt / 任务要求', sample.taskBrief.trim() || '未填写',
    '', '## 输入与素材说明', sample.inputNotes.trim() || '未填写',
    '', '## 八维记录', ...lines,
    '', `- 原因层：${rootCauseLabels[sample.rootCause]}`,
    `- 复验状态：${retestLabels[sample.retestStatus]}`,
    `- 复核说明：${sample.reviewerNote.trim() || '未填写'}`,
    '', '> 本记录由使用者在浏览器本地填写；工具没有自动评分或模型结论。',
  ].join('\n');
}

export function MultimodalEvaluationDesk() {
  const [batch, setBatch] = useState<EvaluationBatch>(() => createEmptyEvaluationBatch());
  const [selectedSample, setSelectedSample] = useState(0);
  const [selectedDimension, setSelectedDimension] = useState(0);
  const [issueFilter, setIssueFilter] = useState<EvaluationIssueFilter>('all');
  const [pendingImport, setPendingImport] = useState<EvaluationBatch | null>(null);
  const [removePending, setRemovePending] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('已放入一条空白本地记录，没有预填模型输出或评测结论。');
  const fileInput = useRef<HTMLInputElement>(null);
  const importNotice = useRef<HTMLParagraphElement>(null);
  const dimensionTabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const sample = batch.samples[selectedSample];
  const dimension = sample.dimensions[selectedDimension];
  const definition = evaluationDimensions[selectedDimension];
  const issues = sampleReadinessIssues(sample);
  const summary = useMemo(() => summarizeEvaluationBatch(batch), [batch]);
  const visibleIssues = useMemo(() => filterEvaluationIssues(summary.issues, issueFilter), [summary, issueFilter]);
  const issueFilterOptions: { id: EvaluationIssueFilter; label: string; count: number }[] = [
    { id: 'all', label: '全部异常', count: summary.issues.length },
    { id: 'evidence_gap', label: '证据缺口', count: summary.issues.filter((issue) => issue.evidenceGap).length },
    { id: 'pending_retest', label: '样本待复验', count: summary.issues.filter((issue) => issue.retestStatus === 'pending').length },
  ];
  const allDimensions = batch.samples.flatMap((item) => item.dimensions);
  const totals = {
    recorded: allDimensions.filter((item) => item.result !== 'not_reviewed').length,
    failed: allDimensions.filter((item) => item.result === 'fail').length,
    uncertain: allDimensions.filter((item) => item.result === 'uncertain').length,
    evidenceGaps: allDimensions.filter((item) => ['fail', 'uncertain'].includes(item.result) && (!item.severity || !item.timeRange.trim() || !item.evidence.trim())).length,
  };
  const markdown = useMemo(() => sampleSummary(batch, sample), [batch, sample]);

  useEffect(() => { if (pendingImport) importNotice.current?.focus(); }, [pendingImport]);

  useEffect(() => {
    if (!dirty) return;
    const leave = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', leave);
    return () => window.removeEventListener('beforeunload', leave);
  }, [dirty]);

  function updateBatch(key: keyof Omit<EvaluationBatch, 'samples'>, value: string) {
    setBatch((current) => ({ ...current, [key]: value })); setDirty(true);
  }

  function updateSample(changes: Partial<EvaluationSample>, preserveState = false) {
    setBatch((current) => ({ ...current, samples: current.samples.map((item, index) => index === selectedSample ? { ...item, ...changes, reviewState: preserveState ? (changes.reviewState ?? item.reviewState) : item.reviewState === 'reviewed' ? 'draft' : item.reviewState } : item) }));
    setDirty(true); setRemovePending(false);
  }

  function updateDimension(changes: Partial<DimensionReview>) {
    setBatch((current) => ({ ...current, samples: current.samples.map((item, sampleIndex) => sampleIndex === selectedSample ? {
      ...item,
      reviewState: item.reviewState === 'reviewed' ? 'draft' : item.reviewState,
      dimensions: item.dimensions.map((entry, dimensionIndex) => dimensionIndex === selectedDimension ? { ...entry, ...changes } : entry),
    } : item) }));
    setDirty(true);
  }

  function chooseResult(result: EvaluationResult) {
    updateDimension({ result, severity: ['fail', 'uncertain'].includes(result) ? dimension.severity : '' });
    setMessage(`${definition.label}已记为“${resultLabels[result]}”。这只是人工记录，不是自动判定。`);
  }

  function addSample() {
    if (batch.samples.length >= 30) { setMessage('每批最多 30 个样本，请先导出，再开始下一批。'); return; }
    let index = batch.samples.length + 1;
    while (batch.samples.some((item) => item.sampleId === `LOCAL-${String(index).padStart(3, '0')}`)) index += 1;
    setBatch((current) => ({ ...current, samples: [...current.samples, createEmptySample(index)] }));
    setSelectedSample(batch.samples.length); setSelectedDimension(0); setDirty(true); setRemovePending(false);
    setMessage('已新增一条空白记录。请先填写样本与输出文件 ID。');
  }

  function removeSample() {
    if (batch.samples.length === 1) {
      setBatch((current) => ({ ...current, samples: [createEmptySample()] })); setSelectedSample(0);
    } else {
      setBatch((current) => ({ ...current, samples: current.samples.filter((_, index) => index !== selectedSample) }));
      setSelectedSample(Math.max(0, selectedSample - 1));
    }
    setSelectedDimension(0); setRemovePending(false); setDirty(true); setMessage('当前样本已从页面记录中移除。尚未导出的内容无法恢复。');
  }

  function applyImport(next: EvaluationBatch) {
    setBatch(next); setSelectedSample(0); setSelectedDimension(0); setPendingImport(null); setRemovePending(false); setDirty(false);
    setMessage(`已载入 ${next.samples.length} 个样本、${next.samples.length * 8} 条维度记录；原有人工状态按文件保留。`);
  }

  async function importFile(file?: File) {
    if (!file) return;
    setLoading(true);
    try {
      if (file.size > MAX_EVALUATION_CSV_BYTES) throw new Error('文件超过 64 MB，请拆成较小批次。');
      const next = importEvaluationCsv(await file.text());
      if (dirty) setPendingImport(next); else applyImport(next);
    } catch (error) {
      setMessage(`${error instanceof Error ? error.message : '导入失败。'} 当前记录已保留。`);
    } finally {
      setLoading(false); if (fileInput.current) fileInput.current.value = '';
    }
  }

  function downloadCsv() {
    try {
      const url = URL.createObjectURL(new Blob([exportEvaluationCsv(batch)], { type: 'text/csv;charset=utf-8' }));
      const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'multimodal-evaluation-records.csv';
      document.body.appendChild(anchor); anchor.click(); anchor.remove(); window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setDirty(false); setMessage(`已发起导出 ${batch.samples.length} 个样本。CSV 可重新导入继续填写。`);
    } catch { setMessage('下载未能发起，当前页面记录仍保留。请重试。'); }
  }

  function completeReview() {
    if (issues.length) { setMessage(`还不能标记完成：${issues.join('；')}。`); return; }
    updateSample({ reviewState: 'reviewed' }, true); setMessage(`${sample.sampleId} 已由你标记为完成人工复核。工具没有自动判断通过或失败。`);
  }

  function locateIssue(sampleIndex: number, dimensionIndex: number) {
    const targetSample = batch.samples[sampleIndex];
    const targetDimension = evaluationDimensions[dimensionIndex];
    if (!targetSample || !targetDimension) return;
    setSelectedSample(sampleIndex);
    setSelectedDimension(dimensionIndex);
    setRemovePending(false);
    setMessage(`已定位到 ${targetSample.sampleId || '未命名样本'} 的“${targetDimension.label}”。请按真实素材复核证据。`);
    const tab = dimensionTabRefs.current[dimensionIndex];
    tab?.scrollIntoView({ behavior: 'auto', block: 'center' });
    tab?.focus({ preventScroll: true });
  }

  return <section className="evaluation-desk" aria-label="多模态评测记录台">
    <div className="evaluation-toolbar">
      <div><span className="mono">LOCAL ONLY / 当前浏览器</span><h2>先建一条<br />空白记录。</h2><p>每批最多 30 个样本。CSV 一行对应一个样本的一个维度，可导回本页继续填写。</p></div>
      <div className="evaluation-actions"><button type="button" onClick={addSample}>新增空白样本</button><button type="button" disabled={loading || !!pendingImport} onClick={() => fileInput.current?.click()}>{loading ? '正在读取…' : '导入记录 CSV'}</button><button type="button" onClick={downloadCsv}>导出记录 CSV</button></div>
      <input ref={fileInput} type="file" accept=".csv,text/csv" aria-label="选择评测记录 CSV" hidden onChange={(event) => void importFile(event.target.files?.[0])} />
      <p className="evaluation-local-note">不会读取或上传视频；CSV 只在浏览器内解析。关闭页面前请导出。{dirty && ' 当前有尚未导出的修改。'}</p>
    </div>
    <p ref={importNotice} tabIndex={-1} className="evaluation-message" role="status" aria-live="polite">{pendingImport ? `已读取 ${pendingImport.samples.length} 个样本，尚未替换当前记录。请选择保留当前记录或确认替换。` : message}</p>

    {pendingImport && <div className="evaluation-replace"><div><span className="mono">REPLACE / 替换确认</span><h3>用导入文件<br />替换当前记录？</h3><p>导入文件包含 {pendingImport.samples.length} 个样本。需要保留当前修改时，请先取消并导出。</p></div><div className="evaluation-actions"><button type="button" onClick={() => setPendingImport(null)}>保留当前记录</button><button type="button" onClick={() => applyImport(pendingImport)}>确认替换</button></div></div>}

    <div className="evaluation-batch-fields">
      <label>批次名称<input maxLength={200} value={batch.batchName} onChange={(event) => updateBatch('batchName', event.target.value)} placeholder="例如：候选版内部试评" /></label>
      <label>评测规则版本<input maxLength={200} value={batch.rubricVersion} onChange={(event) => updateBatch('rubricVersion', event.target.value)} placeholder="例如：8D-v1.0" /></label>
      <label>评测人<input maxLength={200} value={batch.evaluator} onChange={(event) => updateBatch('evaluator', event.target.value)} placeholder="实际执行后填写" /></label>
      <label>执行时间<input maxLength={200} value={batch.testedAt} onChange={(event) => updateBatch('testedAt', event.target.value)} placeholder="YYYY-MM-DD 或实际时间" /></label>
    </div>

    <div className="evaluation-overview" aria-label="当前批次记录概览">
      <div className="evaluation-eight"><strong>8D</strong><span>只汇总记录状态<br />不计算模型总分</span></div>
      <dl><div><dt>样本</dt><dd>{batch.samples.length}</dd></div><div><dt>已记录维度</dt><dd>{totals.recorded} / {allDimensions.length}</dd></div><div><dt>不满足</dt><dd>{totals.failed}</dd></div><div><dt>无法判断</dt><dd>{totals.uncertain}</dd></div><div><dt>证据缺口</dt><dd>{totals.evidenceGaps}</dd></div></dl>
    </div>

    <div className="evaluation-workspace">
      <aside className="evaluation-samples"><div><span className="mono">SAMPLES / 样本</span><b>{batch.samples.length} 条</b></div><nav aria-label="选择评测样本">{batch.samples.map((item, index) => {
        const recorded = item.dimensions.filter((entry) => entry.result !== 'not_reviewed').length;
        return <button type="button" key={`${item.sampleId}-${index}`} aria-current={selectedSample === index ? 'step' : undefined} onClick={() => { setSelectedSample(index); setSelectedDimension(0); setRemovePending(false); }}><span>{String(index + 1).padStart(2, '0')}</span><div><strong>{item.sampleId || '未命名样本'}</strong><small>{recorded} / 8 · {reviewStateLabels[item.reviewState]}</small></div></button>;
      })}</nav><button type="button" className="evaluation-add-sample" onClick={addSample}>＋ 新增空白样本</button></aside>

      <div className="evaluation-sheet">
        <div className="evaluation-sheet-heading"><div><span className="mono">CURRENT SAMPLE / 当前样本</span><h2>{sample.sampleId || '未命名样本'}</h2></div><span className={`evaluation-review-state is-${sample.reviewState}`}>{reviewStateLabels[sample.reviewState]}</span></div>
        <div className="evaluation-identity">
          <label>样本 ID<input maxLength={80} value={sample.sampleId} onChange={(event) => updateSample({ sampleId: event.target.value })} /></label>
          <label>输出文件 ID<input maxLength={200} value={sample.outputId} onChange={(event) => updateSample({ outputId: event.target.value })} placeholder="只填真实文件或候选编号" /></label>
          <label className="is-wide">Prompt / 任务要求<textarea rows={4} maxLength={8000} value={sample.taskBrief} onChange={(event) => updateSample({ taskBrief: event.target.value })} placeholder="粘贴本次实际要求；未执行时可以留空" /></label>
          <label className="is-wide">输入与素材说明<textarea rows={2} maxLength={8000} value={sample.inputNotes} onChange={(event) => updateSample({ inputNotes: event.target.value })} placeholder="记录参考图、首尾帧、音轨或未知项；工具不会读取这些文件" /></label>
        </div>

        <div className="evaluation-dimension-tabs" role="tablist" aria-label="八个评测维度">{evaluationDimensions.map((item, index) => {
          const entry = sample.dimensions[index];
          return <button type="button" role="tab" aria-selected={selectedDimension === index} className={`is-${entry.result}`} key={item.id} ref={(node) => { dimensionTabRefs.current[index] = node; }} onClick={() => setSelectedDimension(index)}><span>{String(index + 1).padStart(2, '0')}</span><strong>{item.label}</strong><small>{resultLabels[entry.result]}</small></button>;
        })}</div>

        <section className={`evaluation-dimension-card is-${dimension.result}`} role="tabpanel" aria-label={`${definition.label}记录`}>
          <div className="evaluation-dimension-heading"><span>{String(selectedDimension + 1).padStart(2, '0')}</span><div><p className="mono">DIMENSION / 当前维度</p><h3>{definition.label}</h3><small>{definition.hint}</small></div></div>
          <fieldset><legend>观看结果</legend><div className="evaluation-result-options">{Object.entries(resultLabels).map(([value, label]) => <button type="button" aria-pressed={dimension.result === value} key={value} onClick={() => chooseResult(value as EvaluationResult)}>{label}</button>)}</div></fieldset>
          <div className="evaluation-field-pair"><label>严重度<select value={dimension.severity} disabled={!['fail', 'uncertain'].includes(dimension.result)} onChange={(event) => updateDimension({ severity: event.target.value as EvaluationSeverity })}>{Object.entries(severityLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label><label>证据时间段<input maxLength={200} value={dimension.timeRange} onChange={(event) => updateDimension({ timeRange: event.target.value })} placeholder="例如：00:02.4–00:03.1" /></label></div>
          <label>可复核证据<textarea rows={5} maxLength={8000} value={dimension.evidence} onChange={(event) => updateDimension({ evidence: event.target.value })} placeholder="只写可见、可听或可定位的现象；没有把握时选择“无法判断”" /></label>
          <p>“不满足”和“无法判断”需要同时填写严重度、时间段与证据，才能标记完成人工复核。</p>
        </section>

        <div className="evaluation-resolution">
          <div className="evaluation-resolution-fields"><label>原因层<select value={sample.rootCause} onChange={(event) => updateSample({ rootCause: event.target.value as RootCause })}>{Object.entries(rootCauseLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select><small>先排除数据、规则、执行和工具流程；“模型能力”只能作为待验证假设。</small></label><label>复验状态<select value={sample.retestStatus} onChange={(event) => updateSample({ retestStatus: event.target.value as RetestStatus })}>{Object.entries(retestLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label><label>人工复核说明<textarea rows={3} maxLength={8000} value={sample.reviewerNote} onChange={(event) => updateSample({ reviewerNote: event.target.value })} placeholder="记录争议、裁决依据或下一步" /></label></div>
          <aside className="evaluation-gate"><span className="mono">HUMAN GATE / 人工关口</span><h3>{issues.length ? '还不能收口。' : '证据已经齐了。'}</h3>{issues.length ? <ul>{issues.map((issue) => <li key={issue}>{issue}</li>)}</ul> : <p>八维状态与必要证据完整。仍需由你确认，不会自动判定样本优劣。</p>}<label>当前流程状态<select value={sample.reviewState} disabled={sample.reviewState === 'reviewed'} onChange={(event) => updateSample({ reviewState: event.target.value as SampleReviewState }, true)}><option value="draft">填写中</option><option value="ready_for_review">待人工复核</option><option value="needs_discussion">待讨论</option>{sample.reviewState === 'reviewed' && <option value="reviewed">已完成人工复核</option>}</select></label><button type="button" onClick={completeReview}>由我确认完成人工复核</button></aside>
        </div>

        <div className="evaluation-sheet-actions"><div>{removePending ? <><p>移除后，尚未导出的当前样本无法恢复。</p><button type="button" onClick={() => setRemovePending(false)}>取消移除</button><button type="button" onClick={removeSample}>确认移除</button></> : <button type="button" onClick={() => setRemovePending(true)}>移除当前样本</button>}</div><button type="button" onClick={downloadCsv}>导出全部记录 CSV</button></div>
      </div>
    </div>

    <section className="evaluation-insights" aria-labelledby="evaluation-insights-title">
      <header className="evaluation-insights-heading">
        <div><span className="mono">READ ONLY / 批次观察窗</span><h2 id="evaluation-insights-title">八条轨道，<br />看清哪里卡住。</h2></div>
        <div><p>来源：当前页面中的本地人工记录。粒度：样本 × 维度。面板随填写或 CSV 导入即时更新。</p><strong>未记录不等于满足；这里不计算模型总分。</strong></div>
      </header>

      <div className="evaluation-insights-grid">
        <article className="evaluation-dimension-distribution">
          <div className="evaluation-panel-heading"><div><span className="mono">8D DISTRIBUTION</span><h3>八维记录分布</h3></div><small>每条轨道共 {summary.sampleCount} 个样本</small></div>
          <ul className="evaluation-chart-legend" aria-label="八维分布图例">
            <li className="is-pass">满足</li><li className="is-fail">不满足</li><li className="is-uncertain">无法判断</li><li className="is-not_applicable">不适用</li><li className="is-not_reviewed">待记录</li>
          </ul>
          <div className="evaluation-dimension-rails">{summary.dimensions.map((item, index) => {
            const segments = [
              { key: 'pass', label: '满足', count: item.pass },
              { key: 'fail', label: '不满足', count: item.fail },
              { key: 'uncertain', label: '无法判断', count: item.uncertain },
              { key: 'not_applicable', label: '不适用', count: item.notApplicable },
              { key: 'not_reviewed', label: '待记录', count: item.notReviewed },
            ];
            const aria = segments.filter(({ count }) => count > 0).map(({ label, count }) => `${label} ${count}`).join('，') || '没有记录';
            return <div className="evaluation-dimension-rail" key={item.dimensionId}>
              <div className="evaluation-rail-label"><span>{String(index + 1).padStart(2, '0')}</span><strong>{item.label}</strong>{item.evidenceGaps > 0 && <small>{item.evidenceGaps} 个证据缺口</small>}</div>
              <div className="evaluation-rail-track" role="img" aria-label={`${item.label}：${aria}`}>{segments.map((segment) => segment.count > 0 && <span className={`is-${segment.key}`} style={{ width: `${segment.count / Math.max(summary.sampleCount, 1) * 100}%` }} key={segment.key}><b>{segment.count}</b></span>)}</div>
            </div>;
          })}</div>
          {summary.recordedDimensionRecords === 0 && <p className="evaluation-chart-empty">当前只有空白记录。轨道里的“待记录”不是评测结果，而是需要补齐的人工观察。</p>}
          <section className="evaluation-issue-locator" aria-labelledby="evaluation-issue-locator-title">
            <div className="evaluation-issue-heading"><div><span className="mono">FIND THE RECORD / 本地定位</span><h4 id="evaluation-issue-locator-title">异常记录，<br />逐条可达。</h4></div><small>{summary.issues.length} 条</small></div>
            {summary.issues.length > 0 && <><div className="evaluation-issue-filters" role="group" aria-label="筛选异常记录">{issueFilterOptions.map(({ id, label, count }) => <button type="button" key={id} aria-pressed={issueFilter === id} onClick={() => setIssueFilter(id)}>{label}<span>{count}</span></button>)}</div><p className="evaluation-filter-note">按异常维度筛选；“样本待复验”取所在样本的人工状态。</p></>}
            {visibleIssues.length ? <ul>{visibleIssues.map((issue) => <li key={`${issue.sampleIndex}-${issue.dimensionIndex}`}><button type="button" onClick={() => locateIssue(issue.sampleIndex, issue.dimensionIndex)} aria-label={`定位到${issue.sampleId || '未命名样本'}的${issue.dimensionLabel}，${resultLabels[issue.result]}${issue.evidenceGap ? '，证据有缺口' : ''}${issue.retestStatus === 'pending' ? '，所在样本待复验' : ''}`}><span className={`evaluation-issue-result is-${issue.result}`}>{resultLabels[issue.result]}</span><span className="evaluation-issue-name"><strong>{issue.sampleId || '未命名样本'} · {issue.dimensionLabel}</strong><small>{issue.evidenceGap ? '证据缺口 · 需补全' : issue.timeRange ? `时间段 ${issue.timeRange}` : '证据已记录'}{issue.retestStatus === 'pending' && ' · 样本待复验'}</small></span><span aria-hidden="true">↗</span></button></li>)}</ul> : <p className="evaluation-issue-empty" aria-live="polite">{summary.issues.length === 0 ? '目前没有标为“不满足”或“无法判断”的维度。开始人工评测后，相关记录会出现在这里。' : issueFilter === 'evidence_gap' ? '当前没有证据缺口。切回“全部异常”可查看其他记录。' : '当前没有所在样本标为“待复验”的异常记录。切回“全部异常”可查看其他记录。'}</p>}
          </section>
        </article>

        <aside className="evaluation-insight-side">
          <div className="evaluation-gap-card"><span className="mono">EVIDENCE GAP</span><strong>{summary.evidenceGaps}</strong><h3>条异常记录证据不完整</h3><p>不满足或无法判断时，需要同时有严重度、时间段和可复核证据。</p><dl><div><dt>异常记录</dt><dd>{summary.exceptionRecords}</dd></div><div><dt>待记录维度</dt><dd>{summary.totalDimensionRecords - summary.recordedDimensionRecords}</dd></div></dl></div>
          <DistributionCard title="原因层" hint="按样本统计" counts={summary.rootCauses} labels={rootCauseLabels} />
          <DistributionCard title="复验状态" hint="按样本统计" counts={summary.retestStatuses} labels={retestLabels} />
          <DistributionCard title="人工状态" hint="按样本统计" counts={summary.reviewStates} labels={reviewStateLabels} />
        </aside>
      </div>
    </section>

    <section className="evaluation-export" aria-labelledby="evaluation-export-title"><div><span className="mono">READABLE COPY / 可读副本</span><h2 id="evaluation-export-title">一份给表格，<br />一份给人读。</h2><p>CSV 保存整批八维字段；下方文字只汇总当前样本。两者都来自你填写的记录，不补写结论。</p><LocalRecordCopy key={selectedSample} value={markdown} label="复制当前记录" success="已复制当前样本的人工记录。" /></div><textarea aria-label="当前样本可读记录" readOnly value={markdown} rows={18} onFocus={(event) => event.currentTarget.select()} /></section>
  </section>;
}

function DistributionCard<T extends string>({ title, hint, counts, labels }: { title: string; hint: string; counts: Record<T, number>; labels: Record<T, string> }) {
  const visible = (Object.entries(counts) as [T, number][]).filter(([, count]) => count > 0);
  return <section className="evaluation-distribution-card"><header><h3>{title}</h3><span>{hint}</span></header><dl>{visible.map(([key, count]) => <div key={key}><dt>{labels[key]}</dt><dd>{count}</dd></div>)}</dl></section>;
}
