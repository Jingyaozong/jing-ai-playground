'use client';

import { Fragment, useMemo, useRef, useState, type ChangeEvent } from 'react';
import { acceptanceVerdicts, createSyntheticPromptPreflight, diffPromptText, emptyPromptPreflight, formatPromptPreflight, inspectPromptPreflight, maxPromptPreflightFileBytes, parsePromptPreflight, serializePromptPreflight, type AcceptanceCheck, type AcceptanceVerdict, type PromptPreflightRecord, type PromptDiffSegment } from '../../lib/prompt-preflight';

const storageKey = 'jing-prompt-preflight-v1';
type Field = Exclude<keyof PromptPreflightRecord, 'checks'>;

const groups: Array<{ title: string; eyebrow: string; note: string; fields: Array<{ key: Field; label: string; hint: string; rows?: number }> }> = [
  { title: '先定目标', eyebrow: 'AIM / 要做成什么', note: '先写工作任务，再写什么算完成。', fields: [
    { key: 'task', label: '这次要完成的任务', hint: '例如：把会议记录整理为可分派的待办' },
    { key: 'audience', label: '谁会使用结果', hint: '例如：没有参会的项目负责人' },
    { key: 'acceptance', label: '至少一条可观察的验收条件', hint: '例如：每条待办有动作、负责人；缺失截止时间时明确标注', rows: 3 },
    { key: 'unknowns', label: '哪些事实不能擅自补全', hint: '例如：未提到的负责人和截止时间', rows: 2 },
  ] },
  { title: '找出歧义', eyebrow: 'ASK / 谁来确认', note: '模型可以提疑问，最终仍由人决定。', fields: [
    { key: 'originalPrompt', label: '原 Prompt', hint: '粘贴当前版本，保留原样', rows: 4 },
    { key: 'revisedPrompt', label: '新版 Prompt', hint: '粘贴本轮修改后的完整版本，供文字对照', rows: 4 },
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
  const [diffVisible, setDiffVisible] = useState(false);
  const [pendingImport, setPendingImport] = useState<{ fileName: string; record: PromptPreflightRecord } | null>(null);
  const [examplePreview, setExamplePreview] = useState(false);
  const importInput = useRef<HTMLInputElement>(null);
  const review = inspectPromptPreflight(record);
  const diff = useMemo(() => diffVisible && record.originalPrompt && record.revisedPrompt ? diffPromptText(record.originalPrompt, record.revisedPrompt) : null, [diffVisible, record.originalPrompt, record.revisedPrompt]);

  function change(key: Field, value: string) {
    const resetOriginal = key === 'originalPrompt' || key === 'originalOutput' || key === 'testInput';
    const resetRevised = key === 'revisedPrompt' || key === 'revisedOutput' || key === 'testInput';
    setRecord((current) => ({ ...current, [key]: value, checks: resetOriginal || resetRevised ? current.checks.map((check) => ({ ...check, originalVerdict: resetOriginal ? '未评' as const : check.originalVerdict, revisedVerdict: resetRevised ? '未评' as const : check.revisedVerdict })) : current.checks }));
    if (key === 'originalPrompt' || key === 'revisedPrompt') setDiffVisible(false);
    setFeedback(resetOriginal || resetRevised ? '输入已改变；相关判定重置为未评，原证据文字保留供核对。请再次保存。' : '内容已更改；如需留在这台浏览器，请再次保存。');
  }

  function addCheck() {
    setRecord((current) => current.checks.length >= 8 ? current : { ...current, checks: [...current.checks, { id: crypto.randomUUID(), criterion: '', originalVerdict: '未评', originalEvidence: '', revisedVerdict: '未评', revisedEvidence: '' }] });
    setFeedback('已添加空白验收项；请先写可观察条件，再依据真实输出人工判定。');
  }

  function updateCheck(id: string, patch: Partial<AcceptanceCheck>) {
    setRecord((current) => ({ ...current, checks: current.checks.map((check) => check.id === id ? { ...check, ...patch, ...(patch.criterion === undefined ? {} : { originalVerdict: '未评' as const, revisedVerdict: '未评' as const }) } : check) }));
    setFeedback(patch.criterion === undefined ? '验收记录已更改；如需保留，请再次保存到此浏览器。' : '验收条件已改变；两版旧判定重置为未评，原证据文字保留供核对。');
  }

  function removeCheck(id: string) {
    setRecord((current) => ({ ...current, checks: current.checks.filter((check) => check.id !== id) }));
    setFeedback('已从当前填写移除这条验收项；先前保存的版本不受影响。');
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
      setDiffVisible(false);
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

  function exportJson() {
    const json = JSON.stringify(JSON.parse(serializePromptPreflight(record)), null, 2);
    const url = URL.createObjectURL(new Blob([json], { type: 'application/json;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `jing-prompt-preflight-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setFeedback('JSON 备份已下载到本机；文件未加密，请妥善保管。');
  }

  async function chooseImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    setPendingImport(null);
    if (!file) return;
    if (file.size > maxPromptPreflightFileBytes) {
      setFeedback('文件超过 512 KB，未导入；请选择本工具导出的 JSON 备份。');
      return;
    }
    try {
      const imported = parsePromptPreflight(await file.text());
      if (!imported) {
        setFeedback('文件不是有效的预检卡 JSON，或版本不受支持；当前填写未改变。');
        return;
      }
      setPendingImport({ fileName: file.name, record: imported });
      setFeedback('文件已在浏览器本地校验。确认前不会替换当前填写。');
    } catch {
      setFeedback('无法读取这个文件；当前填写未改变。');
    }
  }

  function confirmImport() {
    if (!pendingImport) return;
    setRecord(pendingImport.record);
    setDiffVisible(false);
    setPendingImport(null);
    setFeedback('已导入并替换当前填写；浏览器存档未改变。如需保留，请另行点击“保存到此浏览器”。');
  }

  function loadExample() {
    setRecord(createSyntheticPromptPreflight());
    setDiffVisible(false);
    setPendingImport(null);
    setExamplePreview(false);
    setFeedback('已载入虚构演练；两版实际输出仍为空，验收项均为未评。浏览器存档未改变。');
  }

  const example = createSyntheticPromptPreflight();
  return <><section className="prompt-preflight-practice" aria-labelledby="prompt-practice-title">
    <div className="prompt-preflight-practice-heading"><span className="mono">FICTIONAL WALKTHROUGH / 虚构演练 · 待执行</span><h2 id="prompt-practice-title">先看怎样补规则，<br />再决定是否试跑。</h2><p>用一段完全虚构的匿名会议记录，演示一轮只改一处的 Prompt 预检。这里没有调用模型，也没有任何已验证结果。</p></div>
    <div className="prompt-preflight-practice-paper"><div><span className="mono">原版</span><p>{example.originalPrompt}</p></div><div><span className="mono">新增的一条规则</span><p>未在记录中出现的负责人或期限标为“待确认”，不要推测。</p></div><button type="button" onClick={() => setExamplePreview(true)}>查看并载入虚构示例 ↗</button>{examplePreview && <div className="prompt-preflight-practice-confirm" role="group" aria-label="确认载入虚构示例"><p>将用虚构示例替换当前页面填写；此前保存到浏览器的记录不变。示例只有准备内容，没有模型输出或验收结论。</p><div><button type="button" onClick={loadExample}>确认替换当前填写</button><button type="button" onClick={() => setExamplePreview(false)}>取消</button></div></div>}</div>
  </section><section className="prompt-preflight-desk" aria-label="Prompt 歧义预检工作台">
    <div className="prompt-preflight-form">
      {groups.map((group, index) => <Fragment key={group.eyebrow}><fieldset className="prompt-preflight-group">
        <legend><span className="mono">{group.eyebrow}</span><strong>{group.title}</strong></legend>
        <p>{group.note}</p>
        <div className="prompt-preflight-fields">{group.fields.map((field) => <label key={field.key} htmlFor={`preflight-${field.key}`}><span>{field.label}</span><textarea id={`preflight-${field.key}`} rows={field.rows ?? 2} maxLength={4000} value={record[field.key]} onChange={(event) => change(field.key, event.target.value)} placeholder={field.hint} /></label>)}</div>
        <span className="prompt-preflight-group-count mono">{index + 1} / 3</span>
      </fieldset>{index === 1 && <section className="prompt-preflight-diff" aria-labelledby="prompt-diff-title">
        <div className="prompt-preflight-diff-heading"><div><span className="mono">TEXT CHANGE / 文字对照</span><h2 id="prompt-diff-title">改了哪里，<br />一眼看清。</h2></div><button type="button" disabled={!record.originalPrompt || !record.revisedPrompt} onClick={() => setDiffVisible((visible) => !visible)}>{diffVisible ? '收起文字差异' : '查看文字差异 ↗'}</button></div>
        {!record.originalPrompt || !record.revisedPrompt ? <p>填写原版与新版完整 Prompt 后，再查看文字增删。这里只对照文本，不分析语义。</p> : diff ? <><div className="prompt-preflight-diff-grid"><div><span className="mono">原版 / 删除用珊瑚色标出</span><p>{diff.before.map((segment, part) => <DiffPart segment={segment} key={part} />)}</p></div><div><span className="mono">新版 / 增加用薄荷色标出</span><p>{diff.after.map((segment, part) => <DiffPart segment={segment} key={part} />)}</p></div></div><p>{diff.mode === 'coarse' ? '文本较长：仅区分共同前后文与中间改写范围，中间未逐字对齐。' : '按字符对齐文字增删；相同文字保持原色。'}差异不代表哪版更好，仍需用同一输入测试并人工验收。</p></> : <p>点击“查看文字差异”后显示；编辑任一版本会收起旧对照。</p>}
      </section>}</Fragment>)}
      <AcceptanceMatrix record={record} issues={review.matrix.issues} onAdd={addCheck} onUpdate={updateCheck} onRemove={removeCheck} />
    </div>
    <aside className="prompt-preflight-ticket">
      <div className="prompt-preflight-ticket-top mono"><span>REVIEW TICKET / 本地检查</span><span>只查缺项</span></div>
      <h2>下一轮，<br />先补哪一处？</h2>
      <p className="prompt-preflight-result">{review.readyToTest ? '必要字段已填写 · 可以开始真实测试' : `还有 ${review.gaps.length} 处待补充`}</p>
      <ul>{review.gaps.length ? review.gaps.map((gap) => <li key={gap}>{gap}</li>) : <li>这里只确认字段已填写，不判断 Prompt 是否有效。</li>}</ul>
      <div className="prompt-preflight-output-status"><span className="mono">OUTPUT STATUS</span><strong>{review.resultStatus}</strong></div>
      <div className="prompt-preflight-actions"><button type="button" onClick={copy}>复制工作卡 ↗</button><button type="button" onClick={save}>保存到此浏览器</button><button type="button" onClick={restore}>恢复上次保存</button><button type="button" onClick={() => { setRecord(emptyPromptPreflight); setDiffVisible(false); setFeedback('当前填写已清空；此前保存的记录仍在，可用“恢复上次保存”取回。'); }}>清空当前填写</button><button type="button" onClick={removeSaved}>删除此浏览器存档</button></div>
      <section className="prompt-preflight-backup" aria-label="本地 JSON 备份与导入">
        <span className="mono">PORTABLE COPY / 本地备份</span>
        <p>换浏览器也能继续填写。导出的是当前页面内容，不要求先保存；导入只在你确认后替换当前填写。</p>
        <div className="prompt-preflight-backup-actions"><button type="button" onClick={exportJson}>下载 JSON 备份 ↓</button><button type="button" onClick={() => importInput.current?.click()}>选择 JSON 导入 ↗</button></div>
        <input ref={importInput} className="prompt-preflight-file-input" type="file" accept=".json,application/json" aria-label="选择预检卡 JSON 文件" onChange={chooseImport} />
        {pendingImport && <div className="prompt-preflight-import-preview"><strong>准备导入：{pendingImport.fileName}</strong><p>任务：{pendingImport.record.task.trim() || '未填写'}<br />人工验收项：{pendingImport.record.checks.length} 条。确认后会替换当前填写，但不会修改浏览器存档。</p><div><button type="button" onClick={confirmImport}>确认导入并替换</button><button type="button" onClick={() => { setPendingImport(null); setFeedback('已取消导入；当前填写未改变。'); }}>取消导入</button></div></div>}
        <small>仅在浏览器本地读写；JSON 文件未加密，请勿保存或分享含敏感资料的备份。</small>
      </section>
      <p className="prompt-preflight-feedback" role="status" aria-live="polite">{feedback}</p>
      <p className="prompt-preflight-privacy">不调用 AI、不上传输入、不自动保存。缺项提示只看空白字段，不理解 Prompt 内容；效果判断需要真实输出与人工验收。本站编辑工具 · 待荆确认。</p>
    </aside>
  </section></>;
}

function DiffPart({ segment }: { segment: PromptDiffSegment }) {
  if (segment.kind === 'removed') return <del>{segment.text}</del>;
  if (segment.kind === 'added') return <ins>{segment.text}</ins>;
  return <span>{segment.text}</span>;
}

function AcceptanceMatrix({ record, issues, onAdd, onUpdate, onRemove }: { record: PromptPreflightRecord; issues: string[]; onAdd: () => void; onUpdate: (id: string, patch: Partial<AcceptanceCheck>) => void; onRemove: (id: string) => void }) {
  return <section className="prompt-acceptance-matrix" aria-labelledby="prompt-acceptance-title">
    <div className="prompt-acceptance-heading"><div><span className="mono">HUMAN REVIEW / 逐项验收</span><h2 id="prompt-acceptance-title">同一把尺子，<br />看两版输出。</h2></div><button type="button" onClick={onAdd} disabled={record.checks.length >= 8}>添加验收项 ＋</button></div>
    <p>每项只写可观察的条件。判定由你选择，工具不自动评分；没有实际输出时只能保持“未评”。最多记录 8 项。</p>
    {record.checks.length === 0 ? <div className="prompt-acceptance-empty">还没有验收项。先添加一条，再把原版与新版放到同一条件下核对。</div> : <div className="prompt-acceptance-list">{record.checks.map((check, index) => <article className="prompt-acceptance-card" key={check.id}>
      <div className="prompt-acceptance-card-top"><span className="mono">条件 {String(index + 1).padStart(2, '0')}</span><button type="button" onClick={() => onRemove(check.id)}>移除此项</button></div>
      <label className="prompt-acceptance-criterion"><span>可观察的验收条件</span><textarea maxLength={180} rows={2} value={check.criterion} onChange={(event) => onUpdate(check.id, { criterion: event.target.value })} placeholder="例如：每条待办都有明确动作；缺失负责人时标为待确认" /></label>
      <div className="prompt-acceptance-pair">{([['原版', 'originalOutput', 'originalVerdict', 'originalEvidence'], ['新版', 'revisedOutput', 'revisedVerdict', 'revisedEvidence']] as const).map(([label, outputKey, verdictKey, evidenceKey]) => <div key={label}>
        <strong>{label}输出</strong>
        <label><span>人工判定</span><select aria-label={`条件 ${index + 1} ${label}人工判定`} disabled={!record[outputKey].trim() || !check.criterion.trim()} value={check[verdictKey]} onChange={(event) => onUpdate(check.id, { [verdictKey]: event.target.value as AcceptanceVerdict })}>{acceptanceVerdicts.map((verdict) => <option key={verdict} value={verdict}>{verdict}</option>)}</select></label>
        <label><span>对应证据</span><textarea aria-label={`条件 ${index + 1} ${label}对应证据`} maxLength={1000} rows={3} value={check[evidenceKey]} onChange={(event) => onUpdate(check.id, { [evidenceKey]: event.target.value })} placeholder={record[outputKey].trim() ? '写下输出中的可核对依据；无法判断也说明原因' : '先粘贴该版实际输出'} /></label>
      </div>)}</div>
    </article>)}</div>}
    <div className="prompt-acceptance-status"><span className="mono">仍待人工处理</span><ul>{issues.length ? issues.map((issue) => <li key={issue}>{issue}</li>) : <li>记录字段已填写；判定是否正确仍需人工确认。</li>}</ul></div>
  </section>;
}
