'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { calculateReviewPace, calculateReviewPaceTarget, compareReviewPaceMix, formatReviewPaceSummary } from '../data/review-pace';
import { summarizeTrialTimeLog, type TrialTimeSummary } from '../data/review-pace-import';

type FieldProps = {
  label: string;
  note: string;
  suffix: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  wholeNumber?: boolean;
  onChange: (value: number) => void;
};

function NumberField({ label, note, suffix, value, min, max, step = 1, wholeNumber = false, onChange }: FieldProps) {
  const [draft, setDraft] = useState(String(value));
  const parsedDraft = Number(draft);
  const draftInvalid = draft.trim() === '' || !Number.isFinite(parsedDraft) || parsedDraft < min || parsedDraft > max
    || (wholeNumber && !Number.isInteger(parsedDraft));

  function finishEditing() {
    const parsed = Number(draft);
    if (draft.trim() === '' || !Number.isFinite(parsed)) {
      setDraft(String(value));
      return;
    }
    const next = Math.min(max, Math.max(min, wholeNumber ? Math.round(parsed) : parsed));
    onChange(next);
    setDraft(String(next));
  }

  return (
    <label className="pace-field">
      <span className="pace-field-copy"><strong>{label}</strong><small>{note}</small>{draftInvalid && <small className="pace-field-warning">输入未完成，结果仍按上次有效值估算。</small>}</span>
      <span className="pace-input-wrap">
        <input
          inputMode="decimal"
          aria-invalid={draftInvalid}
          max={max}
          min={min}
          step={step}
          type="number"
          value={draft}
          onChange={(event) => {
            const raw = event.target.value;
            setDraft(raw);
            const next = Number(raw);
            if (raw.trim() !== '' && Number.isFinite(next) && next >= min && next <= max
              && (!wholeNumber || Number.isInteger(next))) onChange(next);
          }}
          onBlur={finishEditing}
        />
        <span>{suffix}</span>
      </span>
    </label>
  );
}

export function ReviewPaceCalculator() {
  const [reviewers, setReviewers] = useState(3);
  const [workDays, setWorkDays] = useState(5);
  const [hoursPerDay, setHoursPerDay] = useState(6);
  const [regularMinutes, setRegularMinutes] = useState(8);
  const [highRiskShare, setHighRiskShare] = useState(25);
  const [highRiskMinutes, setHighRiskMinutes] = useState(20);
  const [reworkRate, setReworkRate] = useState(10);
  const [targetItems, setTargetItems] = useState<number | null>(null);
  const [targetDraft, setTargetDraft] = useState('');
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'manual'>('idle');
  const [formRevision, setFormRevision] = useState(0);
  const [source, setSource] = useState<'example' | 'import' | null>(null);
  const [pendingImport, setPendingImport] = useState<TrialTimeSummary | null>(null);
  const [importError, setImportError] = useState('');
  const [importing, setImporting] = useState(false);
  const [trialReference, setTrialReference] = useState<{ count: number; highRiskShare: number } | null>(null);
  const [batchShareDraft, setBatchShareDraft] = useState('');
  const [batchAppliedShare, setBatchAppliedShare] = useState<number | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const inputs = { reviewers, workDays, hoursPerDay, regularMinutes, highRiskShare, highRiskMinutes, reworkRate };
  const result = calculateReviewPace(inputs);
  const targetResult = targetItems === null ? null : calculateReviewPaceTarget(inputs, result, targetItems);
  const sourceLine = source === 'example' ? '虚构演练参数起步 · 可经过手动修改 · 非真实试标记录\n'
    : source === 'import' ? `本地 CSV 汇总参数起步 · 可经过手动修改 · 仅核对耗时，未验证质量或批次代表性${batchAppliedShare !== null ? '；正式批次占比为手工输入的待核对假设' : ''}\n` : '';
  const summary = sourceLine + formatReviewPaceSummary(inputs, result, targetResult ?? undefined);
  const targetDraftNumber = Number(targetDraft);
  const targetDraftInvalid = targetDraft !== '' && (!Number.isSafeInteger(targetDraftNumber) || targetDraftNumber < 1 || targetDraftNumber > 1000000);
  const batchShare = batchShareDraft.trim() === '' ? null : Number(batchShareDraft);
  const batchShareInvalid = batchShare !== null && (!Number.isFinite(batchShare) || batchShare < 0 || batchShare > 100);
  const mixComparison = trialReference && batchShare !== null && !batchShareInvalid
    ? compareReviewPaceMix(inputs, trialReference.highRiskShare, batchShare, targetItems) : null;

  async function copySummary() {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(summary);
      setCopyState('copied');
      window.setTimeout(() => setCopyState('idle'), 1800);
    } catch {
      setCopyState('manual');
    }
  }

  function loadExample() {
    setReviewers(4);
    setWorkDays(5);
    setHoursPerDay(6);
    setRegularMinutes(6);
    setHighRiskShare(20);
    setHighRiskMinutes(18);
    setReworkRate(15);
    setTargetItems(800);
    setTargetDraft('800');
    setCopyState('idle');
    setSource('example');
    setTrialReference(null);
    setBatchShareDraft('');
    setBatchAppliedShare(null);
    setPendingImport(null);
    setImportError('');
    setFormRevision((revision) => revision + 1);
  }

  async function importFile(file: File | undefined) {
    setPendingImport(null);
    setImportError('');
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.csv') || file.size > 1_000_000) {
      setImportError('请选择不超过 1 MB 的 CSV 文件。');
      return;
    }
    setImporting(true);
    try {
      setPendingImport(summarizeTrialTimeLog(await file.text()));
    } catch (error) {
      setImportError(error instanceof Error ? error.message : '无法读取 CSV，请检查文件。');
    } finally {
      setImporting(false);
    }
  }

  function applyImport() {
    if (!pendingImport) return;
    setRegularMinutes(pendingImport.regularMinutes);
    setHighRiskMinutes(pendingImport.highRiskMinutes);
    setHighRiskShare(pendingImport.highRiskShare);
    setTrialReference({ count: pendingImport.total, highRiskShare: pendingImport.highRiskShare });
    setBatchShareDraft('');
    setBatchAppliedShare(null);
    setSource('import');
    setPendingImport(null);
    setCopyState('idle');
    setFormRevision((revision) => revision + 1);
  }

  function applyBatchShare() {
    if (batchShare === null || batchShareInvalid) return;
    setHighRiskShare(batchShare);
    setBatchAppliedShare(batchShare);
    setCopyState('idle');
    setFormRevision((revision) => revision + 1);
  }

  return (
    <>
    <section className="pace-example" aria-labelledby="pace-example-title">
      <div>
        <p className="eyebrow mono">虚构演练 · 编辑候选</p>
        <h2 id="pace-example-title">试标数字，<br />怎样变成排期？</h2>
        <p>假设一批 200 条样本中，160 条常规样本平均耗时 6 分钟，40 条高风险样本平均耗时 18 分钟，后者包含复核与裁决。以下数字仅供练习，并非真实项目记录。</p>
        <button type="button" className="pace-copy-button" onClick={loadExample}>填入演练参数（替换当前输入） ↗</button>
        <small role="status">{source === 'example' ? '已填入虚构参数，可继续修改；复制摘要会保留演练来源。' : '加载后可调整任意条件，观察估算结果变化。'}</small>
      </div>
      <div className="pace-example-ledger">
        <article><h3>先把复杂样本算进去</h3><p>高风险占比 40 ÷ 200 = 20%；加权耗时为 6 × 80% + 18 × 20% = <strong>8.4 分钟/条</strong>。这需要试标样本能代表待处理批次的结构。</p></article>
        <article><h3>再换成团队可用时间</h3><p>假设 4 人，每天净评测 6 小时，剩余 5 个工作日；额外预留 15% 返工缓冲。120 团队小时中，102 小时用于计划内处理，18 小时留给额外返工。</p></article>
        <article><h3>最后讨论目标缺口</h3><p>102 × 60 ÷ 8.4，向下取整约 <strong>728 条</strong>。若目标为 800 条，估算缺口 72 条，按相同条件约需 6 个工作日。可讨论调整期限或范围；加人之前还需确认培训与复核资源。</p></article>
      </div>
    </section>
    <section className="pace-import" aria-labelledby="pace-import-title">
      <div className="pace-import-intro">
        <span className="mono">LOCAL CSV / 本地汇总</span>
        <h2 id="pace-import-title">把试标耗时，<br />带进排期。</h2>
        <p>选择按模板填写的 CSV，先看两类样本的数量、占比和平均分钟数，再决定是否填入。仅在当前浏览器汇总；不上传、不保存原始行。</p>
        <Link href="/downloads/trial-review-time-log-v1.csv" download>下载空白模板 ↓</Link>
      </div>
      <div className="pace-import-action">
        <input
          ref={fileInput}
          className="pace-file-input"
          type="file"
          tabIndex={-1}
          accept=".csv,text/csv"
          aria-label="选择试标耗时 CSV"
          onChange={(event) => {
            void importFile(event.currentTarget.files?.[0]);
            event.currentTarget.value = '';
          }}
        />
        <button type="button" className="pace-import-pick" disabled={importing} onClick={() => fileInput.current?.click()}>{importing ? '正在本地读取…' : '选择 CSV 文件 ↗'}</button>
        {importError && <p className="pace-import-error" role="alert">{importError}</p>}
        {pendingImport ? (
          <div className="pace-import-preview" aria-live="polite">
            <strong>预览 · {pendingImport.total} 条已核对耗时记录</strong>
            <p>常规 {pendingImport.regularCount} 条，平均 {pendingImport.regularMinutes} 分钟；高风险 {pendingImport.highRiskCount} 条，平均 {pendingImport.highRiskMinutes} 分钟，占 {pendingImport.highRiskShare}%。均值四舍五入至一位小数。</p>
            <button type="button" onClick={applyImport}>确认填入这 3 项 ↗</button>
            <small>CSV 中的批次与规则版本一致，但未核实填写内容。仅替换两类耗时与占比；人数、工时、目标和返工缓冲保持原值。</small>
          </div>
        ) : <p className="pace-import-help">需同一批次、同一规则版本、两类样本都有记录，且每行标记 <code>reviewed</code>。混合版本会被拒绝；样本是否代表正式批次仍需人工判断。</p>}
      </div>
    </section>
    <section className="pace-workbench" aria-label="评测排期计算器">
      <div className="pace-form-panel" key={formRevision}>
        <div className="pace-panel-heading">
          <span className="mono">01 / 填写工作条件</span>
          <p>起始数字只是演示。按试标结果填写净工时与两类样本耗时，别把会议和等待素材算进去。清空输入框后可直接重填。</p>
        </div>

        <div className="pace-fields">
          <NumberField label="评测人数" note="实际执行评测的人" suffix="人" value={reviewers} min={1} max={100} wholeNumber onChange={setReviewers} />
          <NumberField label="剩余可用工作日" note="扣除假期后，距目标交接可投入的天数" suffix="天" value={workDays} min={1} max={365} wholeNumber onChange={setWorkDays} />
          <NumberField label="每天有效工时" note="扣除沟通和休息后的净工时" suffix="小时" value={hoursPerDay} min={0.5} max={16} step={0.5} onChange={setHoursPerDay} />
          <NumberField label="常规单条耗时" note="规则明确时，含查看、判断和记录" suffix="分钟" value={regularMinutes} min={0.5} max={480} step={0.1} onChange={setRegularMinutes} />
        </div>
        <label className="pace-field pace-target-field">
          <span className="pace-field-copy"><strong>目标处理条数 <small>可选</small></strong><small>填写后对照可用工作日；留空则只看产能</small>{targetDraftInvalid && <small className="pace-field-warning">请输入 1–100 万之间的整数。</small>}</span>
          <span className="pace-input-wrap">
            <input
              aria-label="目标处理条数，可选"
              aria-invalid={targetDraftInvalid}
              inputMode="numeric"
              max={1000000}
              min={1}
              placeholder="未填写"
              step={1}
              type="number"
              value={targetDraft}
              onChange={(event) => {
                const raw = event.target.value;
                setTargetDraft(raw);
                if (raw === '') { setTargetItems(null); return; }
                const next = Number(raw);
                setTargetItems(Number.isSafeInteger(next) && next >= 1 && next <= 1000000 ? next : null);
              }}
              onBlur={() => {
                if (targetDraft === '') return;
                const next = Number(targetDraft);
                if (!Number.isFinite(next)) { setTargetDraft(targetItems === null ? '' : String(targetItems)); return; }
                const normalized = Math.min(1000000, Math.max(1, Math.round(next)));
                setTargetItems(normalized);
                setTargetDraft(String(normalized));
              }}
            />
            <span>条</span>
          </span>
        </label>
        <div className="pace-risk-group">
          <div className="pace-risk-heading"><strong>把高风险时间单独留出来。</strong><p>争议、复杂关系与逐条复核，不用常规样本的速度外推。</p></div>
          <NumberField label="高风险与争议占比" note="按试标或已知样本结构估计" suffix="%" value={highRiskShare} min={0} max={100} step={0.1} onChange={(value) => { setHighRiskShare(value); setBatchAppliedShare(null); }} />
          <NumberField label="高风险单条耗时" note="包含计划内的独立复核与裁决" suffix="分钟" value={highRiskMinutes} min={0.5} max={480} step={0.1} onChange={setHighRiskMinutes} />
          <NumberField label="额外返工缓冲" note="只留给新发现的问题，避免重复计算" suffix="%" value={reworkRate} min={0} max={90} onChange={setReworkRate} />
        </div>
      </div>

      <aside className="pace-result-card" aria-live="polite">
        <div className="pace-result-topline mono"><span>02 / 计算结果</span><span>Live estimate</span></div>
        {source && <p className="pace-example-origin">{source === 'example' ? '虚构演练参数起步 · 可经过手动修改' : batchAppliedShare !== null ? '本地 CSV 耗时起步 · 批次占比为人工假设；质量及代表性未验证' : '本地 CSV 汇总起步 · 可经过手动修改；质量及代表性未验证'}</p>}
        <div className={`pace-big-number${result.daily >= 1000 ? ' is-compact' : ''}`}>
          <strong id="pace-title">{result.daily}</strong>
          <span>条 / 天</span>
        </div>
        <p className="pace-result-caption">按两类样本的预计条数与耗时估算日处理量；不等于已通过质检或已交付数量。</p>
        {result.daily === 0 && result.total > 0 && <p className="pace-zero-note">单日平均不足一条；周期估算允许跨日接续，请确认任务能否这样安排。</p>}

        <dl className="pace-metrics">
          <div><dt>周期处理量估算</dt><dd>{result.total}<span> 条</span></dd></div>
          <div><dt>人均日处理量</dt><dd>{result.perPerson}<span> 条</span></dd></div>
          <div><dt>预留团队工时</dt><dd>{result.reservedHours.toFixed(1)}<span> 小时</span></dd></div>
        </dl>

        <div className="pace-route-ledger" aria-label="周期样本结构估算">
          <div><span>常规 · {100 - highRiskShare}%</span><strong>约 {result.regularItems} 条</strong></div>
          <div><span>高风险 · {highRiskShare}%</span><strong>约 {result.highRiskItems} 条</strong></div>
        </div>
        <div className={`pace-target-check${targetResult && !targetResult.withinEstimate ? ' has-gap' : ''}`}>
          <span className="mono">目标对照 / Target check</span>
          {targetResult ? (
            <>
              <strong>{targetResult.withinEstimate ? '目标落在估算量内' : `估算缺口 ${-targetResult.gap} 条`}</strong>
              <p>目标 {targetResult.targetItems} 条 · 按当前条件约需 {targetResult.requiredDays} 个工作日
                {targetResult.withinEstimate ? `，估算余量 ${targetResult.gap} 条。` : `，比当前多 ${targetResult.extraDays} 个工作日。`}
              </p>
              <small>工作日由你填入，不按自然日推算；结论不是交付承诺。</small>
            </>
          ) : <p>填写目标条数后，这里会显示估算缺口和所需工作日。</p>}
        </div>
        <p className="pace-formula">加权耗时约 {result.weightedMinutes.toFixed(1)} 分钟/条；容量按整数条数及高风险条数复算。高风险耗时已含计划内复核，缓冲另留给未预见的返修。人数按共享团队池估算，未拆新人和骨干排班。</p>
        <button className="pace-copy-button" type="button" onClick={copySummary}>{copyState === 'copied' ? '已复制排期摘要 ✓' : copyState === 'manual' ? '请在下方手动复制 ↓' : '复制排期摘要 ↗'}</button>
        {copyState === 'manual' && <textarea className="pace-copy-fallback" readOnly value={summary} aria-label="手动复制排期摘要" onFocus={(event) => event.currentTarget.select()} />}
        <small className="pace-disclaimer">这是计划估算，不代替试标、质检或交付验收。实际比例与耗时变化后，请重新填写。</small>
      </aside>
    </section>
    <section className="pace-mix" aria-labelledby="pace-mix-title">
      <div className="pace-mix-intro">
        <span className="mono">样本结构 / Mix check</span>
        <h2 id="pace-mix-title">试标比例，<br />未必是整批比例。</h2>
        <p>只换高风险样本占比，其余人数、净工时、两类耗时和返工缓冲保持相同。看见差额后，再核对正式批次的抽样依据。</p>
      </div>
      <div className="pace-mix-body">
        {trialReference ? (
          <>
            <label className="pace-mix-input-label" htmlFor="pace-batch-share">正式批次预计高风险占比 <small>人工假设 · 待核对</small></label>
            <div className="pace-mix-input-row">
              <div className="pace-input-wrap"><input id="pace-batch-share" type="number" inputMode="decimal" min={0} max={100} step={0.1} placeholder="例如 35" value={batchShareDraft} aria-invalid={batchShareInvalid} onChange={(event) => { setBatchShareDraft(event.target.value); setBatchAppliedShare(null); }} /><span>%</span></div>
              <span>试标 {trialReference.count} 条中，高风险占 {trialReference.highRiskShare}%。</span>
            </div>
            {batchShareInvalid && <p className="pace-mix-warning" role="alert">请输入 0–100 之间的占比。</p>}
            {mixComparison ? (
              <>
                <div className="pace-mix-ledger" aria-live="polite">
                  <div><span>试标结构 · {trialReference.highRiskShare}%</span><strong>{mixComparison.trial.total} <small>条 / 周期</small></strong>{mixComparison.trialTarget && <p>对照目标：{mixComparison.trialTarget.gap >= 0 ? `余量 ${mixComparison.trialTarget.gap}` : `缺口 ${-mixComparison.trialTarget.gap}`} 条</p>}</div>
                  <div><span>批次假设 · {batchShare}%</span><strong>{mixComparison.batch.total} <small>条 / 周期</small></strong>{mixComparison.batchTarget && <p>对照目标：{mixComparison.batchTarget.gap >= 0 ? `余量 ${mixComparison.batchTarget.gap}` : `缺口 ${-mixComparison.batchTarget.gap}`} 条</p>}</div>
                </div>
                <p className="pace-mix-difference">按这组假设，批次结构的周期容量比试标结构{mixComparison.capacityDifference === 0 ? '相同。' : mixComparison.capacityDifference > 0 ? `多 ${mixComparison.capacityDifference} 条。` : `少 ${-mixComparison.capacityDifference} 条。`}</p>
                <button type="button" className="pace-mix-apply" onClick={applyBatchShare} disabled={batchAppliedShare === batchShare}>{batchAppliedShare === batchShare ? '已用于上方排期 ✓' : '用批次占比更新上方排期 ↗'}</button>
              </>
            ) : <p className="pace-mix-empty">填写批次预计占比后，才会出现两种结构的容量对照；未知时请保持空白。</p>}
            <small className="pace-mix-caveat">这不是正式批次的真实分布或交付承诺。两组都只估处理容量，不代表质检通过量。</small>
          </>
        ) : <p className="pace-mix-empty">先在上方<a href="#pace-import-title">导入已核对的试标耗时 CSV ↗</a>，这里才会保留试标占比。没有记录时，不生成虚构的批次对照。</p>}
      </div>
    </section>
    </>
  );
}
