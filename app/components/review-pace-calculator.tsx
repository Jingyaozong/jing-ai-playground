'use client';

import { useMemo, useState } from 'react';

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
  const [minutesPerItem, setMinutesPerItem] = useState(8);
  const [reworkRate, setReworkRate] = useState(10);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const rawDaily = reviewers * hoursPerDay * 60 / minutesPerItem;
    const adjustedDaily = Math.max(0, rawDaily * (1 - reworkRate / 100));
    const periodCapacity = adjustedDaily * workDays;
    const bufferItems = Math.max(0, rawDaily - adjustedDaily) * workDays;

    return {
      daily: Math.floor(adjustedDaily),
      total: Math.floor(periodCapacity),
      perPerson: Math.floor(adjustedDaily / reviewers),
      buffer: Math.ceil(bufferItems),
    };
  }, [hoursPerDay, minutesPerItem, reviewers, reworkRate, workDays]);

  const summary = `评测排期估算\n团队：${reviewers} 人\n周期：${workDays} 个工作日\n有效工时：${hoursPerDay} 小时/人/天\n单条平均：${minutesPerItem} 分钟\n返工缓冲：${reworkRate}%\n预计日产能：${result.daily} 条\n周期总产能：${result.total} 条`;

  async function copySummary() {
    await navigator.clipboard.writeText(summary);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <section className="pace-workbench" aria-label="评测排期计算器">
      <div className="pace-form-panel">
        <div className="pace-panel-heading">
          <span className="mono">01 / 填写工作条件</span>
          <p>按“真正能用于评测的时间”填写，不要把会议、沟通和等待素材的时间算进去。</p>
        </div>

        <div className="pace-fields">
          <NumberField label="评测人数" note="实际执行评测的人" suffix="人" value={reviewers} min={1} max={100} onChange={setReviewers} />
          <NumberField label="项目周期" note="预计用于交付的工作日" suffix="天" value={workDays} min={1} max={365} onChange={setWorkDays} />
          <NumberField label="每天有效工时" note="扣除沟通和休息后的净工时" suffix="小时" value={hoursPerDay} min={0.5} max={16} step={0.5} onChange={setHoursPerDay} />
          <NumberField label="单条平均耗时" note="包含查看、判断和记录" suffix="分钟" value={minutesPerItem} min={0.5} max={480} step={0.5} onChange={setMinutesPerItem} />
          <NumberField label="返工缓冲" note="为复核、坏例和争议样本预留" suffix="%" value={reworkRate} min={0} max={90} onChange={setReworkRate} />
        </div>
      </div>

      <aside className="pace-result-card" aria-live="polite">
        <div className="pace-result-topline mono"><span>02 / 计算结果</span><span>Live estimate</span></div>
        <div className="pace-big-number">
          <strong id="pace-title">{result.daily}</strong>
          <span>条 / 天</span>
        </div>
        <p className="pace-result-caption">在当前设置下，团队每天预计可以完成的有效评测量。</p>

        <dl className="pace-metrics">
          <div><dt>周期总产能</dt><dd>{result.total}<span> 条</span></dd></div>
          <div><dt>人均日产能</dt><dd>{result.perPerson}<span> 条</span></dd></div>
          <div><dt>返工缓冲量</dt><dd>{result.buffer}<span> 条</span></dd></div>
        </dl>

        <button className="pace-copy-button" type="button" onClick={copySummary}>{copied ? '已复制排期摘要 ✓' : '复制排期摘要 ↗'}</button>
        <small className="pace-disclaimer">这是排期估算，不代替试跑。正式承诺交付前，建议先用 20～50 条样本校准单条耗时。</small>
      </aside>
    </section>
  );
}
