'use client';

import { useState } from 'react';
import { emptyPromptPreflight, formatPromptPreflight, inspectPromptPreflight, parsePromptPreflight, serializePromptPreflight, type PromptPreflightRecord } from '../../lib/prompt-preflight';

const storageKey = 'jing-prompt-preflight-v1';
type Field = keyof PromptPreflightRecord;

const groups: Array<{ title: string; eyebrow: string; note: string; fields: Array<{ key: Field; label: string; hint: string; rows?: number }> }> = [
  { title: '先定目标', eyebrow: 'AIM / 要做成什么', note: '先写工作任务，再写什么算完成。', fields: [
    { key: 'task', label: '这次要完成的任务', hint: '例如：把会议记录整理为可分派的待办' },
    { key: 'audience', label: '谁会使用结果', hint: '例如：没有参会的项目负责人' },
    { key: 'acceptance', label: '至少一条可观察的验收条件', hint: '例如：每条待办有动作、负责人；缺失截止时间时明确标注', rows: 3 },
    { key: 'unknowns', label: '哪些事实不能擅自补全', hint: '例如：未提到的负责人和截止时间', rows: 2 },
  ] },
  { title: '找出歧义', eyebrow: 'ASK / 谁来确认', note: '模型可以提疑问，最终仍由人决定。', fields: [
    { key: 'originalPrompt', label: '原 Prompt', hint: '粘贴当前版本，保留原样', rows: 4 },
    { key: 'ambiguity', label: '待确认的歧义', hint: '哪些词含糊、事实缺失或要求互相冲突？', rows: 3 },
    { key: 'humanDecision', label: '人工确认或保留未知', hint: '写下确认过的事实；无法确认就写“保持未知”', rows: 2 },
    { key: 'oneChange', label: '本轮唯一主要改动', hint: '只记录实际打算改的条件，不预写效果', rows: 2 },
  ] },
  { title: '留下输出', eyebrow: 'SEE / 看到什么', note: '没有真实输出时留空，工具会标记待执行。', fields: [
    { key: 'testInput', label: '同一测试输入', hint: '两版使用相同的输入；不要包含敏感资料', rows: 2 },
    { key: 'originalOutput', label: '原版实际输出', hint: '生成后再粘贴；未执行请留空', rows: 3 },
    { key: 'revisedOutput', label: '新版实际输出', hint: '生成后再粘贴；未执行请留空', rows: 3 },
    { key: 'evidence', label: '逐项验收证据', hint: '写可观察的差异、不通过项和仍不确定的地方', rows: 3 },
  ] },
];

export function PromptPreflightDesk() {
  const [record, setRecord] = useState<PromptPreflightRecord>(emptyPromptPreflight);
  const [feedback, setFeedback] = useState('还没有填写记录；不会自动保存或联网。');
  const review = inspectPromptPreflight(record);

  function change(key: Field, value: string) {
    setRecord((current) => ({ ...current, [key]: value }));
    setFeedback('内容已更改；如需留在这台浏览器，请再次保存。');
  }

  function save() {
    try {
      localStorage.setItem(storageKey, serializePromptPreflight(record));
      setFeedback('已保存到这台浏览器。不会同步到服务器；清理浏览器数据后可能丢失。');
    } catch { setFeedback('浏览器未允许本地保存。请先复制工作卡，避免内容丢失。'); }
  }

  function restore() {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) { setFeedback('这台浏览器还没有保存过这张工作卡。'); return; }
      const saved = parsePromptPreflight(raw);
      if (!saved) { setFeedback('保存记录格式不匹配，未覆盖当前内容。'); return; }
      setRecord(saved);
      setFeedback('已从这台浏览器恢复记录；请确认内容是否仍适用于当前任务。');
    } catch { setFeedback('无法读取浏览器本地记录；当前内容未改变。'); }
  }

  function removeSaved() {
    if (!window.confirm('删除这台浏览器保存的 Prompt 工作卡？当前填写不会被清空。')) return;
    try {
      localStorage.removeItem(storageKey);
      setFeedback('已删除这台浏览器的存档；当前填写仍保留在页面上。');
    } catch { setFeedback('无法删除浏览器存档；请检查浏览器存储权限。'); }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(formatPromptPreflight(record));
      setFeedback('已复制工作卡，包含缺项提醒和真实输出状态。');
    } catch { setFeedback('复制未成功。请检查浏览器剪贴板权限。'); }
  }

  return <section className="prompt-preflight-desk" aria-label="Prompt 歧义预检工作台">
    <div className="prompt-preflight-form">
      {groups.map((group, index) => <fieldset className="prompt-preflight-group" key={group.eyebrow}>
        <legend><span className="mono">{group.eyebrow}</span><strong>{group.title}</strong></legend>
        <p>{group.note}</p>
        <div className="prompt-preflight-fields">{group.fields.map((field) => <label key={field.key} htmlFor={`preflight-${field.key}`}><span>{field.label}</span><textarea id={`preflight-${field.key}`} rows={field.rows ?? 2} maxLength={4000} value={record[field.key]} onChange={(event) => change(field.key, event.target.value)} placeholder={field.hint} /></label>)}</div>
        <span className="prompt-preflight-group-count mono">{index + 1} / 3</span>
      </fieldset>)}
    </div>
    <aside className="prompt-preflight-ticket">
      <div className="prompt-preflight-ticket-top mono"><span>REVIEW TICKET / 本地检查</span><span>只查缺项</span></div>
      <h2>下一轮，<br />先补哪一处？</h2>
      <p className="prompt-preflight-result">{review.readyToTest ? '必要字段已填写 · 可以开始真实测试' : `还有 ${review.gaps.length} 处待补充`}</p>
      <ul>{review.gaps.length ? review.gaps.map((gap) => <li key={gap}>{gap}</li>) : <li>这里只确认字段已填写，不判断 Prompt 是否有效。</li>}</ul>
      <div className="prompt-preflight-output-status"><span className="mono">OUTPUT STATUS</span><strong>{review.resultStatus}</strong></div>
      <div className="prompt-preflight-actions"><button type="button" onClick={copy}>复制工作卡 ↗</button><button type="button" onClick={save}>保存到此浏览器</button><button type="button" onClick={restore}>恢复上次保存</button><button type="button" onClick={() => { setRecord(emptyPromptPreflight); setFeedback('当前填写已清空；此前保存的记录仍在，可用“恢复上次保存”取回。'); }}>清空当前填写</button><button type="button" onClick={removeSaved}>删除此浏览器存档</button></div>
      <p className="prompt-preflight-feedback" role="status" aria-live="polite">{feedback}</p>
      <p className="prompt-preflight-privacy">不调用 AI、不上传输入、不自动保存。缺项提示只看空白字段，不理解 Prompt 内容；效果判断需要真实输出与人工验收。本站编辑工具 · 待荆确认。</p>
    </aside>
  </section>;
}
