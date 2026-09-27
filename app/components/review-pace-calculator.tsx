'use client';

import { useState } from 'react';
import { calculateReviewPace, calculateReviewPaceTarget, formatReviewPaceSummary } from '../data/review-pace';

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
  const [exampleRevision, setExampleRevision] = useState(0);

  const inputs = { reviewers, workDays, hoursPerDay, regularMinutes, highRiskShare, highRiskMinutes, reworkRate };
  const result = calculateReviewPace(inputs);
  const targetResult = targetItems === null ? null : calculateReviewPaceTarget(inputs, result, targetItems);
  const summary = (exampleRevision ? '虚构演练参数起步 · 可经过手动修改 · 非真实试标记录\n' : '') + formatReviewPaceSummary(inputs, result, targetResult ?? undefined);
  const targetDraftNumber = Number(targetDraft);
  const targetDraftInvalid = targetDraft !== '' && (!Number.isSafeInteger(targetDraftNumber) || targetDraftNumber < 1 || targetDraftNumber > 1000000);

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
    setExampleRevision((revision) => revision + 1);
  }

  return (
    <>
    <section className="pace-example" aria-labelledby="pace-example-title">
      <div>
        <p className="eyebrow mono">虚构演练 · 编辑候选</p>
        <h2 id="pace-example-title">试标数字，<br />怎样变成排期？</h2>
        <p>假设一批 200 条样本中，160 条常规样本平均耗时 6 分钟，40 条高风险样本平均耗时 18 分钟，后者包含复核与裁决。以下数字仅供练习，并非真实项目记录。</p>
        <button type="button" className="pace-copy-button" onClick={loadExample}>填入演练参数（替换当前输入） ↗</button>
        <small role="status">{exampleRevision > 0 ? '已填入虚构参数，可继续修改；复制摘要会保留演练来源。' : '加载后可调整任意条件，观察估算结果变化。'}</small>
      </div>
      <div className="pace-example-ledger">
        <article><h3>先把复杂样本算进去</h3><p>高风险占比 40 ÷ 200 = 20%；加权耗时为 6 × 80% + 18 × 20% = <strong>8.4 分钟/条</strong>。这需要试标样本能代表待处理批次的结构。</p></article>
        <article><h3>再换成团队可用时间</h3><p>假设 4 人，每天净评测 6 小时，剩余 5 个工作日；额外预留 15% 返工缓冲。120 团队小时中，102 小时用于计划内处理，18 小时留给额外返工。</p></article>
        <article><h3>最后讨论目标缺口</h3><p>102 × 60 ÷ 8.4，向下取整约 <strong>728 条</strong>。若目标为 800 条，估算缺口 72 条，按相同条件约需 6 个工作日。可讨论调整期限或范围；加人之前还需确认培训与复核资源。</p></article>
      </div>
    </section>
    <section className="pace-workbench" aria-label="评测排期计算器">
      <div className="pace-form-panel" key={exampleRevision}>
        <div className="pace-panel-heading">
          <span className="mono">01 / 填写工作条件</span>
          <p>起始数字只是演示。按试标结果填写净工时与两类样本耗时，别把会议和等待素材算进去。清空输入框后可直接重填。</p>
        </div>

        <div className="pace-fields">
          <NumberField label="评测人数" note="实际执行评测的人" suffix="人" value={reviewers} min={1} max={100} wholeNumber onChange={setReviewers} />
          <NumberField label="剩余可用工作日" note="扣除假期后，距目标交接可投入的天数" suffix="天" value={workDays} min={1} max={365} wholeNumber onChange={setWorkDays} />
          <NumberField label="每天有效工时" note="扣除沟通和休息后的净工时" suffix="小时" value={hoursPerDay} min={0.5} max={16} step={0.5} onChange={setHoursPerDay} />
          <NumberField label="常规单条耗时" note="规则明确时，含查看、判断和记录" suffix="分钟" value={regularMinutes} min={0.5} max={480} step={0.5} onChange={setRegularMinutes} />
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
          <NumberField label="高风险与争议占比" note="按试标或已知样本结构估计" suffix="%" value={highRiskShare} min={0} max={100} onChange={setHighRiskShare} />
          <NumberField label="高风险单条耗时" note="包含计划内的独立复核与裁决" suffix="分钟" value={highRiskMinutes} min={0.5} max={480} step={0.5} onChange={setHighRiskMinutes} />
          <NumberField label="额外返工缓冲" note="只留给新发现的问题，避免重复计算" suffix="%" value={reworkRate} min={0} max={90} onChange={setReworkRate} />
        </div>
      </div>

      <aside className="pace-result-card" aria-live="polite">
        <div className="pace-result-topline mono"><span>02 / 计算结果</span><span>Live estimate</span></div>
        {exampleRevision > 0 && <p className="pace-example-origin">虚构演练参数起步 · 可经过手动修改</p>}
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
    </>
  );
}
