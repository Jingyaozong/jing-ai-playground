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
  onChange: (value: number) => void;
};

function NumberField({ label, note, suffix, value, min, max, step = 1, onChange }: FieldProps) {
  return (
    <label className="pace-field">
      <span className="pace-field-copy"><strong>{label}</strong><small>{note}</small></span>
      <span className="pace-input-wrap">
        <input
          inputMode="decimal"
          max={max}
          min={min}
          step={step}
          type="number"
          value={value}
          onChange={(event) => {
            const next = Number(event.target.value);
            if (Number.isFinite(next)) onChange(Math.min(max, Math.max(min, next)));
          }}
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
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'manual'>('idle');

  const inputs = { reviewers, workDays, hoursPerDay, regularMinutes, highRiskShare, highRiskMinutes, reworkRate };
  const result = calculateReviewPace(inputs);
  const targetResult = targetItems === null ? null : calculateReviewPaceTarget(inputs, result, targetItems);
  const summary = formatReviewPaceSummary(inputs, result, targetResult ?? undefined);

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

  return (
    <section className="pace-workbench" aria-label="评测排期计算器">
      <div className="pace-form-panel">
        <div className="pace-panel-heading">
          <span className="mono">01 / 填写工作条件</span>
          <p>起始数字只是演示。按试标结果填写净工时与两类样本耗时，别把会议和等待素材算进去。</p>
        </div>

        <div className="pace-fields">
          <NumberField label="评测人数" note="实际执行评测的人" suffix="人" value={reviewers} min={1} max={100} onChange={setReviewers} />
          <NumberField label="剩余可用工作日" note="扣除假期后，距目标交接可投入的天数" suffix="天" value={workDays} min={1} max={365} onChange={setWorkDays} />
          <NumberField label="每天有效工时" note="扣除沟通和休息后的净工时" suffix="小时" value={hoursPerDay} min={0.5} max={16} step={0.5} onChange={setHoursPerDay} />
          <NumberField label="常规单条耗时" note="规则明确时，含查看、判断和记录" suffix="分钟" value={regularMinutes} min={0.5} max={480} step={0.5} onChange={setRegularMinutes} />
        </div>
        <label className="pace-field pace-target-field">
          <span className="pace-field-copy"><strong>目标处理条数 <small>可选</small></strong><small>填写后对照可用工作日；留空则只看产能</small></span>
          <span className="pace-input-wrap">
            <input
              aria-label="目标处理条数，可选"
              inputMode="numeric"
              max={1000000}
              min={1}
              placeholder="未填写"
              step={1}
              type="number"
              value={targetItems ?? ''}
              onChange={(event) => {
                if (event.target.value === '') { setTargetItems(null); return; }
                const next = Number(event.target.value);
                if (Number.isSafeInteger(next)) setTargetItems(Math.min(1000000, Math.max(1, next)));
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
        <div className={`pace-big-number${result.daily >= 1000 ? ' is-compact' : ''}`}>
          <strong id="pace-title">{result.daily}</strong>
          <span>条 / 天</span>
        </div>
        <p className="pace-result-caption">按两类耗时加权后的日处理量估算；不等于已通过质检或已交付数量。</p>
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
        <p className="pace-formula">加权耗时 {result.weightedMinutes.toFixed(1)} 分钟/条。高风险耗时已含计划内复核；缓冲另留给未预见的返修。人数按共享团队池估算，未拆新人和骨干排班。</p>
        <button className="pace-copy-button" type="button" onClick={copySummary}>{copyState === 'copied' ? '已复制排期摘要 ✓' : copyState === 'manual' ? '请在下方手动复制 ↓' : '复制排期摘要 ↗'}</button>
        {copyState === 'manual' && <textarea className="pace-copy-fallback" readOnly value={summary} aria-label="手动复制排期摘要" onFocus={(event) => event.currentTarget.select()} />}
        <small className="pace-disclaimer">这是计划估算，不代替试标、质检或交付验收。实际比例与耗时变化后，请重新填写。</small>
      </aside>
    </section>
  );
}
