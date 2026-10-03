'use client';

import { useMemo, useRef, useState } from 'react';
import { copyWithTimeout } from '../lib/copy-with-timeout';

type TakeStatus = 'NEW' | 'SHORTLIST' | 'SELECT' | 'HOLD' | 'REJECT';
type RejectCode = '' | 'NAR' | 'ID' | 'SCN' | 'MOT' | 'CAM' | 'TMP' | 'SND' | 'TEC' | 'CUT';

type BatchValues = {
  shotId: string;
  batchId: string;
  task: string;
  platform: string;
  model: string;
  mode: string;
  prompt: string;
  inputs: string;
  settings: string;
  change: string;
  sourceLink: string;
};

type Take = {
  id: number;
  status: TakeStatus;
  usableRange: string;
  strength: string;
  rejectCode: RejectCode;
  observation: string;
  editUse: string;
};

type CopyTarget = 'markdown' | 'csv';

const statusOptions: Array<{ value: TakeStatus; label: string; note: string }> = [
  { value: 'NEW', label: '待检查', note: '尚未完整看完' },
  { value: 'SHORTLIST', label: '短名单', note: '有明确可用区间' },
  { value: 'SELECT', label: '当前采用', note: '已进入当前剪辑' },
  { value: 'HOLD', label: '保留', note: '有价值但暂不采用' },
  { value: 'REJECT', label: '淘汰', note: '有明确致命问题' },
];

const rejectOptions: Array<{ value: Exclude<RejectCode, ''>; label: string }> = [
  { value: 'NAR', label: 'NAR · 叙事未完成' }, { value: 'ID', label: 'ID · 主体漂移' },
  { value: 'SCN', label: 'SCN · 场景 / 道具漂移' }, { value: 'MOT', label: 'MOT · 动作 / 物理错误' },
  { value: 'CAM', label: 'CAM · 机位 / 构图错误' }, { value: 'TMP', label: 'TMP · 时间连续性错误' },
  { value: 'SND', label: 'SND · 声音不可用' }, { value: 'TEC', label: 'TEC · 技术规格错误' },
  { value: 'CUT', label: 'CUT · 无法与相邻镜头组接' },
];

const emptyBatch: BatchValues = {
  shotId: 'S01', batchId: 'B01', task: '', platform: '', model: '', mode: '', prompt: '', inputs: '', settings: '', change: '', sourceLink: '',
};

const exampleBatch: BatchValues = {
  shotId: 'S06',
  batchId: 'B04',
  task: '人物先停住写信，再抬头看向画面右侧房门；至少留下 2 秒可接反打。',
  platform: '示例平台',
  model: '示例视频模型 / 当前可见版本',
  mode: '图生视频',
  prompt: '人物听见门外的轻响，手停在信纸上，随后缓慢抬头看向画面右侧房门。摄影机固定，窗帘只有轻微风动。',
  inputs: '角色正面锚点；雨夜旧公寓 C2 环境 Plate；拆开的白色信封状态图',
  settings: '6 秒；16:9；1080p；Seed 由平台记录',
  change: '只把动作从“迅速抬头”改为“先停笔，再缓慢抬头”。',
  sourceLink: '',
};

const emptyTakes: Take[] = [{ id: 1, status: 'NEW', usableRange: '', strength: '', rejectCode: '', observation: '', editUse: '' }];

const exampleTakes: Take[] = [
  { id: 1, status: 'SELECT', usableRange: '00:01.18–00:04.62', strength: '停笔与抬头的因果最清楚，结尾有可接反打的停顿。', rejectCode: '', observation: '人物身份、房门位置与信封状态在采用区间内保持稳定。', editUse: '当前剪辑采用；速度 96%；弃用生成音频。' },
  { id: 2, status: 'REJECT', usableRange: '00:00.70–00:02.90', strength: '抬头表演自然。', rejectCode: 'SCN', observation: '00:03.4 起，右手信纸变回封闭信封。', editUse: '' },
  { id: 3, status: 'SHORTLIST', usableRange: '00:01.40–00:04.10', strength: '视线方向正确，动作中段干净。', rejectCode: '', observation: '最后一秒面部细节开始漂移，剪短后仍可作为备选。', editUse: '保留短版，等待与上一镜试剪。' },
  { id: 4, status: 'HOLD', usableRange: '00:00.00–00:02.80', strength: '窗帘和雨夜光线状态稳定。', rejectCode: '', observation: '人物没有完成抬头动作，不适合当前镜头职责。', editUse: '可拆成环境过桥镜头。' },
];

const batchFields: Array<{ key: keyof BatchValues; label: string; note: string; placeholder: string; wide?: boolean }> = [
  { key: 'task', label: '镜头职责', note: '这批结果最低要完成什么', placeholder: '例如：停笔后抬头看门，并留下可接反打的停顿', wide: true },
  { key: 'platform', label: '平台', note: '生成发生在哪里', placeholder: '例如：Runway / Vertex AI / 其他' },
  { key: 'model', label: '模型与版本', note: '保存当时可见名称或 ID', placeholder: '例如：模型名称 / 版本 ID' },
  { key: 'mode', label: '生成方式', note: '文生、图生、首尾帧或延长', placeholder: '例如：图生视频' },
  { key: 'settings', label: '可见参数', note: '时长、比例、分辨率、Seed 等', placeholder: '例如：6 秒；16:9；1080p；Seed 1234' },
  { key: 'prompt', label: '完整 Prompt', note: '保留原文，不只留修改摘要', placeholder: '输入这一批实际使用的完整 Prompt', wide: true },
  { key: 'inputs', label: '输入资产', note: '首尾帧、角色与场景参考', placeholder: '列出参考图、视频、音频或文件 ID', wide: true },
  { key: 'change', label: '相比上一批只改变', note: '一次只声明主要变量', placeholder: '例如：只修改抬头动作的节奏', wide: true },
  { key: 'sourceLink', label: '平台记录链接', note: '可选；不要把它当唯一档案', placeholder: 'https://…', wide: true },
];

function takeId(batch: BatchValues, index: number) {
  return `${batch.shotId.trim() || 'S??'}-${batch.batchId.trim() || 'B??'}-T${String(index + 1).padStart(2, '0')}`;
}

function csvCell(value: string) {
  return `"${value.replaceAll('"', '""')}"`;
}

export function ShotVersionRecorder() {
  const [batch, setBatch] = useState<BatchValues>(emptyBatch);
  const [takes, setTakes] = useState<Take[]>(emptyTakes);
  const [synthetic, setSynthetic] = useState(false);
  const [copied, setCopied] = useState<CopyTarget | null>(null);
  const [manualCopy, setManualCopy] = useState<string | null>(null);
  const [copying, setCopying] = useState<CopyTarget | null>(null);
  const copyRevision = useRef(0);
  const manualField = useRef<HTMLTextAreaElement>(null);

  const summary = useMemo(() => {
    const counts = statusOptions.reduce<Record<TakeStatus, number>>((result, option) => ({ ...result, [option.value]: takes.filter((take) => take.status === option.value).length }), { NEW: 0, SHORTLIST: 0, SELECT: 0, HOLD: 0, REJECT: 0 });
    const rejectionCounts = takes.filter((take) => take.status === 'REJECT' && take.rejectCode).reduce<Record<string, number>>((result, take) => ({ ...result, [take.rejectCode]: (result[take.rejectCode] ?? 0) + 1 }), {});
    const primaryReject = Object.entries(rejectionCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';
    return { counts, primaryReject };
  }, [takes]);

  const markdown = useMemo(() => {
    const lines = [
      `# ${batch.shotId.trim() || '未编号镜头'} / ${batch.batchId.trim() || '未编号批次'} · 候选版本记录`, '',
      synthetic ? '> 合成演练 · 编辑候选 · 待荆确认：候选、时间区间、观察与采用状态均为虚构，不对应真实视频。修改后仍属于演练；记录真实样本请先清空。' : '> 使用者填写记录 · 未经工具验证；空白项不代表已检查或通过。', '',
      `- 镜头职责：${batch.task.trim() || '待填写'}`, `- 平台 / 模型：${[batch.platform, batch.model].filter(Boolean).join(' / ') || '待填写'}`,
      `- 生成方式：${batch.mode.trim() || '待填写'}`, `- 可见参数：${batch.settings.trim() || '待填写'}`,
      `- 输入资产：${batch.inputs.trim() || '待填写'}`, `- 相比上一批只改变：${batch.change.trim() || '待填写'}`,
      `- 平台记录：${batch.sourceLink.trim() || '未填写'}`, '', '## Prompt', '', batch.prompt.trim() || '待填写', '',
      '## 候选版本', '', '| 候选 ID | 状态 | 可用区间 | 首要优点 | 淘汰代码 | 观察事实 | 剪辑采用 |',
      '| --- | --- | --- | --- | --- | --- | --- |',
      ...takes.map((take, index) => `| ${takeId(batch, index)} | ${take.status} | ${take.usableRange || '—'} | ${take.strength || '—'} | ${take.status === 'REJECT' ? take.rejectCode || '未分类' : '—'} | ${take.observation || '—'} | ${take.editUse || '—'} |`),
      '', '说明：记录表保存的是当前可见输入与选择理由；平台、模型或服务变化仍可能影响复现结果。',
    ];
    return lines.join('\n');
  }, [batch, takes, synthetic]);

  const csv = useMemo(() => {
    const header = ['candidate_id', 'shot_id', 'batch_id', 'status', 'usable_range', 'strength', 'reject_code', 'observation', 'edit_use', 'platform', 'model', 'mode', 'settings', 'prompt', 'inputs', 'changed_variable', 'source_link', 'record_origin', 'verification_scope'];
    const rows = takes.map((take, index) => [takeId(batch, index), batch.shotId, batch.batchId, take.status, take.usableRange, take.strength, take.status === 'REJECT' ? take.rejectCode : '', take.observation, take.editUse, batch.platform, batch.model, batch.mode, batch.settings, batch.prompt, batch.inputs, batch.change, batch.sourceLink, synthetic ? 'synthetic_exercise' : 'user_entered_unverified', synthetic ? '合成演练，无真实视频，编辑候选，待荆确认' : '使用者填写，未经工具验证']);
    return [header.map(csvCell).join(','), ...rows.map((row) => row.map(csvCell).join(','))].join('\r\n');
  }, [batch, takes, synthetic]);

  function updateBatch(key: keyof BatchValues, value: string) {
    setBatch((current) => ({ ...current, [key]: value }));
    resetCopy();
  }

  function updateTake(id: number, patch: Partial<Take>) {
    setTakes((current) => current.map((take) => take.id === id ? { ...take, ...patch } : take));
    resetCopy();
  }

  function resetCopy() {
    copyRevision.current += 1;
    setCopying(null);
    setCopied(null);
    setManualCopy(null);
  }

  function loadExample() {
    setSynthetic(true);
    setBatch(exampleBatch);
    setTakes(exampleTakes);
    resetCopy();
  }

  function clearRecorder() {
    setSynthetic(false);
    setBatch(emptyBatch);
    setTakes(emptyTakes);
    resetCopy();
  }

  function addTake() {
    if (takes.length >= 8) return;
    const nextId = takes.reduce((max, take) => Math.max(max, take.id), 0) + 1;
    setTakes((current) => [...current, { id: nextId, status: 'NEW', usableRange: '', strength: '', rejectCode: '', observation: '', editUse: '' }]);
    resetCopy();
  }

  function removeTake(id: number) {
    if (takes.length === 1) return;
    setTakes((current) => current.filter((take) => take.id !== id));
    resetCopy();
  }

  async function copyOutput(target: CopyTarget) {
    const value = target === 'markdown' ? markdown : csv;
    const revision = ++copyRevision.current;
    const trigger = document.activeElement;
    setCopied(null);
    setCopying(target);
    setManualCopy(value);
    const success = await copyWithTimeout(value, navigator.clipboard?.writeText?.bind(navigator.clipboard));
    if (revision !== copyRevision.current) return;
    setCopying(null);
    if (success) {
      setManualCopy(null);
      setCopied(target);
      window.setTimeout(() => { if (revision === copyRevision.current) setCopied(null); }, 1800);
    } else {
      if (document.activeElement === trigger) {
        manualField.current?.focus();
        manualField.current?.select();
      }
    }
  }

  function downloadCsv() {
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${batch.shotId.trim() || 'shot'}-${batch.batchId.trim() || 'batch'}-version-log.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="version-workbench" aria-label="镜头版本记录器">
      <div className="version-editor">
        <div className="version-panel-heading">
          <div><span className="mono">01 / BATCH FACTS</span><h2>每一次生成，<br />都留下选择理由。</h2></div>
          <div><button type="button" onClick={loadExample}>载入合成示例</button><button type="button" onClick={clearRecorder}>清空</button></div>
        </div>

        <p className="version-source-note" role="status">{synthetic ? '合成演练 · 编辑候选 · 待荆确认。以下时间、观察和采用状态均为虚构，无真实视频。修改后仍是演练；记录真实样本请先清空。' : '空白起点：没有预填模型输出、可用区间或采用结论。你填写的判断不会由工具自动验证。载入合成示例会替换当前表单，请先导出已有记录。'}</p>

        <div className="version-id-strip">
          <label><span className="mono">SHOT / 镜号</span><input value={batch.shotId} onChange={(event) => updateBatch('shotId', event.target.value.toUpperCase())} /></label>
          <b aria-hidden="true">/</b>
          <label><span className="mono">BATCH / 批次</span><input value={batch.batchId} onChange={(event) => updateBatch('batchId', event.target.value.toUpperCase())} /></label>
        </div>

        <div className="version-batch-grid">
          {batchFields.map((field) => <label className={field.wide ? 'is-wide' : ''} key={field.key}>
            <span><strong>{field.label}</strong><small>{field.note}</small></span>
            {field.wide ? <textarea rows={field.key === 'prompt' ? 4 : 2} value={batch[field.key]} placeholder={field.placeholder} onChange={(event) => updateBatch(field.key, event.target.value)} /> : <input value={batch[field.key]} placeholder={field.placeholder} onChange={(event) => updateBatch(field.key, event.target.value)} />}
          </label>)}
        </div>

        <div className="version-takes-heading"><div><span className="mono">02 / TAKES</span><h3>逐个候选，记录可用与不可用。</h3></div><button type="button" onClick={addTake} disabled={takes.length >= 8}>{takes.length >= 8 ? '最多 8 个候选' : '＋ 添加候选'}</button></div>
        <div className="version-take-list">
          {takes.map((take, index) => <article className={`version-take-row status-${take.status.toLowerCase()}`} key={take.id}>
            <div className="version-take-id"><span className="mono">TAKE</span><strong>{String(index + 1).padStart(2, '0')}</strong><small>{takeId(batch, index)}</small></div>
            <label><span>状态</span><select value={take.status} onChange={(event) => updateTake(take.id, { status: event.target.value as TakeStatus, rejectCode: event.target.value === 'REJECT' ? take.rejectCode : '' })}>{statusOptions.map((option) => <option value={option.value} key={option.value}>{option.value} · {option.label}</option>)}</select></label>
            <label><span>可用区间</span><input value={take.usableRange} placeholder="00:01.20–00:04.60" onChange={(event) => updateTake(take.id, { usableRange: event.target.value })} /></label>
            <label className="version-take-wide"><span>首要优点</span><textarea rows={2} value={take.strength} placeholder="这一版最值得保留的地方" onChange={(event) => updateTake(take.id, { strength: event.target.value })} /></label>
            <label><span>{take.status === 'REJECT' ? '首要淘汰原因' : '淘汰原因'}</span><select value={take.rejectCode} disabled={take.status !== 'REJECT'} onChange={(event) => updateTake(take.id, { rejectCode: event.target.value as RejectCode })}><option value="">{take.status === 'REJECT' ? '选择代码' : '非淘汰版本'}</option>{rejectOptions.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}</select></label>
            <label className="version-take-wide"><span>观察事实</span><textarea rows={2} value={take.observation} placeholder="写对象、发生时间和可观察的问题" onChange={(event) => updateTake(take.id, { observation: event.target.value })} /></label>
            <label className="version-take-wide"><span>剪辑采用 / 保留方式</span><textarea rows={2} value={take.editUse} placeholder="例如：当前采用；速度 96%；弃用生成音频" onChange={(event) => updateTake(take.id, { editUse: event.target.value })} /></label>
            <button className="version-remove-take" type="button" onClick={() => removeTake(take.id)} disabled={takes.length === 1} aria-label={`删除候选 ${index + 1}`}>×</button>
          </article>)}
        </div>
      </div>

      <aside className="version-contact-sheet" aria-live="polite">
        <div className="version-sheet-topline mono"><span>CONTACT SHEET</span><span>{takes.length} TAKES</span></div>
        <div className="version-batch-number"><span>{batch.shotId.trim() || 'S??'}</span><i>/</i><span>{batch.batchId.trim() || 'B??'}</span></div>
        <div className="version-frame-grid" aria-label="候选版本状态接触印样">
          {takes.length ? takes.slice(0, 8).map((take, index) => <article className={`version-frame status-${take.status.toLowerCase()}`} key={take.id}><div><b>{String(index + 1).padStart(2, '0')}</b><i aria-hidden="true" /><i aria-hidden="true" /><i aria-hidden="true" /></div><span>{take.status}</span><small>{take.status === 'REJECT' ? take.rejectCode || '未分类' : take.usableRange || '等待区间'}</small></article>) : <p>添加候选后，这里会形成同批次接触印样。</p>}
        </div>
        <div className="version-status-ledger">
          <span><small>SELECT</small><b>{summary.counts.SELECT}</b></span><span><small>SHORTLIST</small><b>{summary.counts.SHORTLIST}</b></span><span><small>REJECT</small><b>{summary.counts.REJECT}</b></span><span><small>TOP REJECT</small><b>{summary.primaryReject}</b></span>
        </div>
        <p>{synthetic ? '合成演练：以下状态统计只用于演示，不是实际生成或剪辑结果。' : '接触印样只显示候选状态，不判断画面质量。先写可观察事实，再决定采用与淘汰。'}</p>
        <div className="version-sheet-actions"><button type="button" onClick={() => copyOutput('markdown')}>{copied === 'markdown' ? '已复制记录 ✓' : '复制 Markdown ↗'}</button><button type="button" onClick={downloadCsv}>下载 CSV ↓</button></div>
        <small>所有内容只在当前浏览器页面处理；下载文件由浏览器本地生成。</small>
      </aside>

      <section className="version-export-section">
        <div className="version-export-heading"><div><span className="mono">03 / EXPORT</span><h2>一个给人读，<br />一个给表格用。</h2></div><p>Markdown 保存批次上下文与选择理由；CSV 每行对应一个候选，适合继续筛选、排序或合并到项目总表。</p></div>
        <div className="version-export-grid">
          <article><div><span className="mono">MARKDOWN / 完整记录</span><button type="button" onClick={() => copyOutput('markdown')}>{copied === 'markdown' ? '已复制 ✓' : '复制 ↗'}</button></div><pre>{markdown}</pre></article>
          <article><div><span className="mono">CSV / 候选行</span><button type="button" onClick={() => copyOutput('csv')}>{copied === 'csv' ? '已复制 ✓' : '复制 ↗'}</button></div><pre>{csv}</pre></article>
        </div>
      </section>

      {manualCopy && <aside className="version-copy-fallback"><div><span className="mono">MANUAL COPY / 手动复制</span><p role="status">{copying ? '正在请求复制权限；最多等待 1.5 秒。也可直接选中下方文本复制。' : '自动复制未确认完成。电脑先全选，再按 Ctrl+C（Mac 按 ⌘C）；手机长按文本复制。未响应的权限请求可能稍后完成。'}</p></div><button type="button" onClick={resetCopy}>关闭 ×</button><textarea ref={manualField} readOnly value={manualCopy} onFocus={(event) => event.currentTarget.select()} aria-label="手动复制版本记录" /></aside>}
    </section>
  );
}
