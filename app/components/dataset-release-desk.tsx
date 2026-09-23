'use client';

import { useState } from 'react';
import { assessRelease, blankReleaseRecord, releaseGates, releaseReport, type ReleaseCheckId, type ReleaseCheckStatus, type ReleaseRecord } from '../../lib/dataset-release';

export function DatasetReleaseDesk() {
  const [record, setRecord] = useState<ReleaseRecord>(blankReleaseRecord);
  const [copyMessage, setCopyMessage] = useState('');
  const assessment = assessRelease(record);
  const report = releaseReport(record);

  function updateIdentity(key: 'dataset' | 'batch' | 'ruleVersion', value: string) {
    setRecord((current) => ({ ...current, [key]: value }));
    setCopyMessage('');
  }

  function updateCheck(id: ReleaseCheckId, change: Partial<{ status: ReleaseCheckStatus; evidence: string }>) {
    setRecord((current) => ({ ...current, checks: { ...current.checks, [id]: { ...current.checks[id], ...change } } }));
    setCopyMessage('');
  }

  async function copyReport() {
    try {
      await navigator.clipboard.writeText(report);
      setCopyMessage('已复制当前自检记录；仍需人工核对实际文件。');
    } catch {
      setCopyMessage('复制不可用。可选中下方文本框内容，手动复制。');
    }
  }

  return <div className="dataset-release-desk">
    <section className="release-intro" aria-labelledby="release-intro-title">
      <div><p className="eyebrow mono">RELEASE GATES / 本地自检</p><h2 id="release-intro-title">先记下依据，<br /><em>再谈放行。</em></h2></div>
      <p>这是一张空白的人工核对桌。只在当前页面处理输入，不读取或上传数据集，也不替负责人做最终批准。刷新页面会清空填写内容。</p>
    </section>

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
      <div className="release-copy-row"><button type="button" onClick={copyReport}>复制交接记录 ↗</button><span role="status" aria-live="polite">{copyMessage}</span></div>
      <label className="release-report-label" htmlFor="release-report">当前记录预览，可选中复制</label><textarea id="release-report" readOnly value={report} rows={12} />
    </section>
  </div>;
}
