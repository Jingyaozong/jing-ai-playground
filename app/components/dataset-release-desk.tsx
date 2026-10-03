'use client';

import { useState } from 'react';
import { LocalRecordCopy } from './local-record-copy';
import { assessRelease, blankReleaseRecord, isBlankReleaseRecord, paperBoatB02Practice, paperBoatB02RetestPractice, releaseGates, releaseReport, type ReleaseCheckId, type ReleaseCheckStatus, type ReleaseRecord } from '../../lib/dataset-release';

export function DatasetReleaseDesk() {
  const [record, setRecord] = useState<ReleaseRecord>(blankReleaseRecord);
  const assessment = assessRelease(record);
  const report = releaseReport(record);
  const canLoadPractice = isBlankReleaseRecord(record);

  function updateIdentity(key: 'dataset' | 'batch' | 'ruleVersion', value: string) {
    setRecord((current) => ({ ...current, [key]: value }));
  }

  function updateCheck(id: ReleaseCheckId, change: Partial<{ status: ReleaseCheckStatus; evidence: string }>) {
    setRecord((current) => ({ ...current, checks: { ...current.checks, [id]: { ...current.checks[id], ...change } } }));
  }

  return <div className="dataset-release-desk">
    <section className="release-intro" aria-labelledby="release-intro-title">
      <div><p className="eyebrow mono">RELEASE GATES / 本地自检</p><h2 id="release-intro-title">先记下依据，<br /><em>再谈放行。</em></h2></div>
      <p>这是一张空白的人工核对桌。只在当前页面处理输入，不读取或上传数据集，也不替负责人做最终批准。刷新页面会清空填写内容。</p>
    </section>

    <section className="release-practice" aria-labelledby="release-practice-title" id="practice">
      <div className="release-practice-stamp" aria-hidden="true"><span className="mono">纸舟 / B02</span><strong>暂缓</strong><small>虚构退回单</small></div>
      <div className="release-practice-copy"><p className="eyebrow mono">WORKED EXAMPLE / 完全虚构</p><h2 id="release-practice-title">单批没过，<br />总平均不能掩盖。</h2><p>沿用“纸舟”合成项目：B02 首检模拟抽 100 条，普通不合格 4 条，超过案例约定的最多 2 条。载入的是失败时点，不是返修后的结果。</p><button type="button" disabled={!canLoadPractice} onClick={() => setRecord(paperBoatB02Practice())}>载入首检暂缓演练 ↗</button><span role="status" aria-live="polite">{record.practiceStage === 'first-check' ? '已载入首检时点；刷新页面可清空。' : canLoadPractice ? '仅在空白记录时可载入，不覆盖你已填写的内容。' : '已有填写，不能覆盖；刷新页面会清空当前输入。'}</span></div>
    </section>

    <section className="release-comparison" aria-labelledby="release-comparison-title" id="retest-practice">
      <div className="release-comparison-head"><div><p className="eyebrow mono">B02 / 两次冻结 · 三本账</p><h2 id="release-comparison-title">复检是新一页，<br />不是改写首检。</h2></div><p>这是同一个虚构批次的后续时点。两次随机抽检各有自己的 100 条分母；中间的 500 条是范围复核，不是第三次抽样。</p></div>
      <div className="release-comparison-ledger" aria-label="纸舟 B02 虚构时点对照">
        <article><span className="mono">首检 / 旧冻结版</span><strong>4 <small>/ 100</small></strong><p>普通不合格，关键错误 0。超过本案例最多 2 条的门槛，当时暂缓。</p></article>
        <article><span className="mono">返修 / 全批范围</span><strong>18 <small>/ 500</small></strong><p>模拟复核全批并修正 18 条，包含首检的 4 条。这里是修正条数，不是抽检错误率。</p></article>
        <article><span className="mono">复检 / 新冻结版</span><strong>1 <small>/ 100</small></strong><p>重新随机抽检，关键错误 0；达到案例抽检门槛。该 1 条随后修正，关闭复验仍待记录。</p></article>
      </div>
      <div className="release-comparison-action"><button type="button" disabled={!canLoadPractice} onClick={() => setRecord(paperBoatB02RetestPractice())}>载入返修后复检演练 ↗</button><span role="status" aria-live="polite">{record.practiceStage === 'retest' ? '已载入复检时点；最终文件与关闭复验仍待核实。' : canLoadPractice ? '仅在空白记录时可载入；不会覆盖首检或你的填写。' : '已有填写，不能覆盖；刷新页面可重新选择时点。'}</span></div>
    </section>

    {record.synthetic && <p className="release-synthetic-banner" role="status">正在查看完全虚构的纸舟 B02 {record.practiceStage === 'retest' ? '返修后复检' : '首检暂缓'}演练。所有状态与依据都是情境设定，不代表真实检查或荆的项目成果。</p>}

    <section className="release-identity" aria-labelledby="release-identity-title">
      <div><span className="mono">BATCH / 批次身份</span><h2 id="release-identity-title">先写清是哪一批。</h2><p>可使用非敏感代号；不要填写客户机密或个人信息。</p></div>
      <div className="release-identity-fields">
        <label>数据集代号<input maxLength={80} value={record.dataset} onChange={(event) => updateIdentity('dataset', event.target.value)} placeholder="例如：演练数据集 A" /></label>
        <label>批次<input maxLength={80} value={record.batch} onChange={(event) => updateIdentity('batch', event.target.value)} placeholder="例如：批次 01" /></label>
        <label>规则版本<input maxLength={80} value={record.ruleVersion} onChange={(event) => updateIdentity('ruleVersion', event.target.value)} placeholder="例如：v1.0" /></label>
      </div>
    </section>

    <div className="release-rail" role="list" aria-label="四道交付自检关口">
      {releaseGates.map((gate, index) => {
        const checks = gate.checks.map((check) => record.checks[check.id]);
        const state = checks.some((check) => check.status === 'needs-work') ? '需处理' : checks.every((check) => check.status === 'verified' && check.evidence.trim()) ? '已记录依据' : '待核实';
        return <div className="release-rail-stop" data-state={state} role="listitem" key={gate.id}><span className="mono">GATE {index + 1}</span><strong>{gate.title}</strong><small>{state}</small></div>;
      })}
    </div>

    <div className="release-gates">
      {releaseGates.map((gate, index) => <section className="release-gate" key={gate.id} aria-labelledby={`release-gate-${gate.id}`}>
        <div className="release-gate-heading"><span className="release-gate-mark mono">0{index + 1}</span><div><p className="mono">{gate.cue}</p><h2 id={`release-gate-${gate.id}`}>{gate.title}</h2></div></div>
        <div className="release-checks">{gate.checks.map((check) => <div className="release-check" key={check.id}>
          <label className="release-check-title" htmlFor={`release-status-${check.id}`}>{check.label}</label>
          <div className="release-check-inputs"><label>人工判断<select id={`release-status-${check.id}`} value={record.checks[check.id].status} onChange={(event) => updateCheck(check.id, { status: event.target.value as ReleaseCheckStatus })}><option value="unchecked">待核实</option><option value="verified">已核实</option><option value="needs-work">需处理</option></select></label>
            <label>依据或待办<input maxLength={240} value={record.checks[check.id].evidence} onChange={(event) => updateCheck(check.id, { evidence: event.target.value })} placeholder="写下文件、记录位置或未关闭问题" /></label></div>
          {record.checks[check.id].status === 'verified' && !record.checks[check.id].evidence.trim() && <p className="release-field-hint">请补上依据；只选择“已核实”不会使这一项齐备。</p>}
        </div>)}</div>
      </section>)}
    </div>

    <section className="release-result" aria-labelledby="release-result-title">
      <div className="release-result-head"><div><span className="mono">HANDOFF NOTE / 交接记录</span><h2 id="release-result-title">留下能追问的记录。</h2></div><span className="release-result-state" data-ready={assessment.readyForHumanApproval}>{assessment.readyForHumanApproval ? '记录齐备 · 待人工批准' : assessment.blocked.length ? '暂勿交付 · 有待处理项' : '待核实 · 不可据此交付'}</span></div>
      <p>这里汇总你填的状态，不读取实际文件，也不会验证证据真伪。无论显示什么，都需要负责人对照原件、抽检与例外记录作最终决定。</p>
      {(assessment.missingIdentity.length > 0 || assessment.blocked.length > 0 || assessment.pending.length > 0) && <div className="release-todo"><h3>交付前还要处理</h3><ul>
        {assessment.missingIdentity.length > 0 && <li>补齐数据集代号、批次与规则版本。</li>}
        {assessment.blocked.map((check) => <li key={check.id}>{check.gate} · {check.label}：需处理。</li>)}
        {assessment.pending.map((check) => <li key={check.id}>{check.gate} · {check.label}：待核实或缺少依据。</li>)}
      </ul></div>}
      <div className="release-copy-row"><LocalRecordCopy value={report} label="复制交接记录 ↗" success={record.synthetic ? '已复制虚构演练记录；不得用于实际交付。' : '已复制当前自检记录；仍需人工核对实际文件。'} /></div>
      <label className="release-report-label" htmlFor="release-report">当前记录预览，可选中复制</label><textarea id="release-report" readOnly value={report} rows={12} />
    </section>
  </div>;
}
