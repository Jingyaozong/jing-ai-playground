'use client';

import { useState } from 'react';

type ShotRow = {
  id: string;
  size: string;
  duration: string;
  visual: string;
  camera: string;
  sound: string;
};

const exampleNotes = `雨夜，远景，6秒。空荡的公交站，路灯闪烁。固定镜头。环境音：雨声。
近景，5秒。短发女性低头看手机，屏幕亮起。摄影机缓慢推进。声音：呼吸。
手部特写，4秒。手机上出现一张来自明天的合照。固定镜头。音效：消息提示音。
中景，7秒。她抬头看向道路尽头，说：“这不是今天拍的。” 跟拍。环境音：雨声。`;

const shotSizes = ['大远景', '远景', '全景', '中景', '中近景', '近景', '特写', '未指定'];
const cameraMoves = ['固定', '推', '拉', '摇', '移', '跟', '升降', '环绕', '未指定'];

function inferShotSize(text: string) {
  return shotSizes.find((size) => size !== '未指定' && text.includes(size)) ?? '未指定';
}

function inferCamera(text: string) {
  const patterns: Array<[RegExp, string]> = [
    [/固定镜头|镜头固定|静止镜头/, '固定'],
    [/环绕|绕拍/, '环绕'],
    [/跟拍|跟随镜头|镜头跟随/, '跟'],
    [/推进|推镜|镜头推近|缓慢推/, '推'],
    [/拉远|后拉|拉镜/, '拉'],
    [/横摇|摇镜|镜头摇动/, '摇'],
    [/平移|横移|侧移|镜头移动/, '移'],
    [/升降|镜头上升|镜头下降/, '升降'],
  ];
  return patterns.find(([pattern]) => pattern.test(text))?.[1] ?? '未指定';
}

function inferDuration(text: string) {
  return text.match(/(\d+(?:\.\d+)?)\s*(?:秒|s\b|sec\b)/i)?.[1] ?? '';
}

function extractSound(text: string) {
  const parts: string[] = [];
  const dialogue = [...text.matchAll(/(?:对白|台词|说)?[：:]?[“"]([^”"]+)[”"]/g)].map((match) => `对白：${match[1]}`);
  const sounds = [...text.matchAll(/(?:环境音|音效|声音|音乐)[：:]\s*([^。；\n]+)/g)].map((match) => match[0]);
  parts.push(...dialogue, ...sounds);
  return parts.join('；') || '—';
}

function cleanVisual(text: string) {
  return text
    .replace(/(?:大远景|远景|全景|中近景|中景|近景|特写)[，,。]?/g, '')
    .replace(/\d+(?:\.\d+)?\s*(?:秒|s\b|sec\b)[，,。]?/gi, '')
    .replace(/(?:固定镜头|镜头固定|静止镜头|环绕|绕拍|跟拍|跟随镜头|镜头跟随|摄影机缓慢推进|摄影机推进|推进|推镜|镜头推近|拉远|后拉|拉镜|横摇|摇镜|镜头摇动|平移|横移|侧移|镜头移动|升降|镜头上升|镜头下降)[，,。]?/g, '')
    .replace(/(?:环境音|音效|声音|音乐)[：:]\s*[^。；\n]+[。；]?/g, '')
    .replace(/(?:说)?[：:]?[“"][^”"]+[”"]/g, '开口说话')
    .replace(/^[，,。；;\s]+|[，,；;\s]+$/g, '')
    .replace(/[。]{2,}/g, '。')
    .trim() || '补充画面与动作';
}

function parseNotes(text: string): ShotRow[] {
  return text.split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => ({
      id: `parsed-${index}-${line.length}`,
      size: inferShotSize(line),
      duration: inferDuration(line),
      visual: cleanVisual(line),
      camera: inferCamera(line),
      sound: extractSound(line),
    }));
}

function escapeCell(value: string) {
  return value.replaceAll('|', '\\|').replaceAll('\n', ' ');
}

function missingFields(row: ShotRow) {
  const missing: string[] = [];
  if (row.size === '未指定') missing.push('景别');
  if (!row.duration || Number(row.duration) <= 0) missing.push('时长');
  if (!row.visual.trim() || row.visual === '补充画面与动作') missing.push('画面');
  if (row.camera === '未指定') missing.push('运镜');
  if (!row.sound.trim() || row.sound === '—') missing.push('声音');
  return missing;
}

function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.round((totalSeconds % 60) * 10) / 10;
  const secondsLabel = Number.isInteger(seconds) ? String(seconds).padStart(2, '0') : seconds.toFixed(1).padStart(4, '0');
  return `${String(minutes).padStart(2, '0')}:${secondsLabel}`;
}

function buildPromptSkeleton(rows: ShotRow[]) {
  return rows.map((row, index) => [
    `SHOT ${String(index + 1).padStart(2, '0')} / ${row.duration || '?'} SEC`,
    `FRAME: ${row.size}. ${row.visual}`,
    `CAMERA: ${row.camera}.`,
    `AUDIO: ${row.sound}.`,
    'MOTION RULE: one clear primary action, restrained natural movement, stable subject and objects.',
    'NEGATIVE: identity drift, extra limbs, fused hands, warped objects, flicker, camera shake, text, logo, watermark.',
  ].join('\n')).join('\n\n---\n\n');
}

async function copyText(value: string) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return true;
    }
  } catch {
    // Continue to the local fallback below.
  }

  const textarea = document.createElement('textarea');
  textarea.value = value;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand('copy');
  textarea.remove();
  return copied;
}

export function ShotListCleaner() {
  const [notes, setNotes] = useState(exampleNotes);
  const [rows, setRows] = useState<ShotRow[]>(() => parseNotes(exampleNotes));
  const [copied, setCopied] = useState<'table' | 'prompt' | null>(null);
  const [manualCopy, setManualCopy] = useState<{ kind: 'table' | 'prompt'; value: string } | null>(null);

  function organize() {
    setRows(parseNotes(notes));
    setCopied(null);
    setManualCopy(null);
  }

  function updateRow(id: string, field: keyof Omit<ShotRow, 'id'>, value: string) {
    setRows((current) => current.map((row) => row.id === id ? { ...row, [field]: value } : row));
    setCopied(null);
    setManualCopy(null);
  }

  function moveRow(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= rows.length) return;
    setRows((current) => {
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
    setCopied(null);
    setManualCopy(null);
  }

  function addRow() {
    setRows((current) => [...current, { id: `manual-${Date.now()}`, size: '未指定', duration: '', visual: '补充画面与动作', camera: '未指定', sound: '—' }]);
    setCopied(null);
    setManualCopy(null);
  }

  function deleteRow(id: string) {
    setRows((current) => current.filter((item) => item.id !== id));
    setCopied(null);
    setManualCopy(null);
  }

  async function copyTable() {
    const header = '| 镜号 | 景别 | 时长 | 画面与动作 | 运镜 | 对白与声音 |\n| --- | --- | ---: | --- | --- | --- |';
    const body = rows.map((row, index) => `| ${String(index + 1).padStart(2, '0')} | ${escapeCell(row.size)} | ${escapeCell(row.duration || '—')} 秒 | ${escapeCell(row.visual)} | ${escapeCell(row.camera)} | ${escapeCell(row.sound)} |`).join('\n');
    const value = `${header}\n${body}`;
    if (await copyText(value)) {
      setManualCopy(null);
      setCopied('table');
      window.setTimeout(() => setCopied((current) => current === 'table' ? null : current), 1800);
    } else {
      setManualCopy({ kind: 'table', value });
    }
  }

  async function copyPrompts() {
    const value = buildPromptSkeleton(rows);
    if (await copyText(value)) {
      setManualCopy(null);
      setCopied('prompt');
      window.setTimeout(() => setCopied((current) => current === 'prompt' ? null : current), 1800);
    } else {
      setManualCopy({ kind: 'prompt', value });
    }
  }

  const totalDuration = rows.reduce((total, row) => total + (Number(row.duration) || 0), 0);
  const totalFields = rows.length * 5;
  const missingCount = rows.reduce((total, row) => total + missingFields(row).length, 0);
  const completeness = totalFields === 0 ? 0 : Math.round(((totalFields - missingCount) / totalFields) * 100);
  const readyRows = rows.filter((row) => missingFields(row).length === 0).length;
  const promptSkeleton = buildPromptSkeleton(rows);

  return (
    <section className="shot-cleaner" aria-label="分镜整理器">
      <div className="shot-input-layout">
        <div className="shot-input-panel">
          <div className="shot-panel-topline mono"><span>01 / 粘贴散乱笔记</span><span>每行一镜</span></div>
          <textarea value={notes} onChange={(event) => setNotes(event.target.value)} aria-label="散乱的分镜笔记" placeholder="每行写一个镜头。可以包含景别、画面、运镜、对白和声音。" />
          <div className="shot-input-actions">
            <button type="button" onClick={() => setNotes(exampleNotes)}>恢复示例</button>
            <button type="button" onClick={() => { setNotes(''); setRows([]); setCopied(null); setManualCopy(null); }}>清空</button>
            <button type="button" className="shot-organize-button" onClick={organize}>整理成镜头表 ↓</button>
          </div>
        </div>

        <aside className="shot-input-note">
          <span className="mono">LOCAL / 本地处理</span>
          <strong>先写清楚，<br />不必写漂亮。</strong>
          <p>本地规则会识别景别、时长、运镜、对白和声音，内容不会上传。整理以后，每一格都可以继续修改。</p>
          <div className="shot-input-counts"><span><b>{rows.length}</b><small>个镜头</small></span><span><b>{formatDuration(totalDuration)}</b><small>总时长</small></span></div>
        </aside>
      </div>

      <div className="shot-output-section">
        <div className="shot-output-heading">
          <div><span className="mono">02 / SHOT LIST</span><h2>可以继续修改的镜头表。</h2></div>
          <div className="shot-output-actions"><button type="button" onClick={addRow}>＋ 新增镜头</button><button type="button" className="shot-copy-button" onClick={copyTable} disabled={rows.length === 0}>{copied === 'table' ? '已复制表格 ✓' : manualCopy?.kind === 'table' ? '请在下方手动复制 ↓' : '复制镜头表 ↗'}</button><button type="button" className="shot-prompt-button" onClick={copyPrompts} disabled={rows.length === 0}>{copied === 'prompt' ? '已复制 Prompt ✓' : manualCopy?.kind === 'prompt' ? '请在下方手动复制 ↓' : '复制 Prompt 骨架 ↗'}</button></div>
        </div>

        {manualCopy && <aside className="shot-copy-fallback"><div><span className="mono">MANUAL COPY / 浏览器限制</span><p>当前浏览器禁止自动写入剪贴板。点击文本框后按 Ctrl+A，再按 Ctrl+C。</p></div><button type="button" onClick={() => setManualCopy(null)}>关闭 ×</button><textarea readOnly value={manualCopy.value} aria-label={manualCopy.kind === 'table' ? '手动复制镜头表' : '手动复制 Prompt 骨架'} /></aside>}

        {rows.length > 0 && <div className="shot-health" aria-label="分镜完整度概览"><article><span className="mono">SHOTS</span><strong>{rows.length}</strong><p>{readyRows} 镜资料完整</p></article><article><span className="mono">TOTAL TIME</span><strong>{formatDuration(totalDuration)}</strong><p>{totalDuration} 秒时间账本</p></article><article><span className="mono">COMPLETENESS</span><strong>{completeness}%</strong><p>{missingCount === 0 ? '所有字段已填写' : `还缺 ${missingCount} 个字段`}</p></article></div>}

        {rows.length > 0 ? <div className="shot-sheet">
          <div className="shot-sheet-head mono"><span>镜号</span><span>景别</span><span>时长</span><span>画面与动作</span><span>运镜</span><span>对白与声音</span><span>调整</span></div>
          {rows.map((row, index) => {
            const missing = missingFields(row);
            return <article className="shot-row" key={row.id}>
            <div className="shot-number"><span className="mono">镜号</span><b>{String(index + 1).padStart(2, '0')}</b></div>
            <label className="shot-cell shot-size-cell"><span className="mono">景别</span><select value={row.size} onChange={(event) => updateRow(row.id, 'size', event.target.value)}>{shotSizes.map((size) => <option key={size}>{size}</option>)}</select></label>
            <label className="shot-cell shot-duration-cell"><span className="mono">时长 / 秒</span><input type="number" min="0.5" max="60" step="0.5" value={row.duration} onChange={(event) => updateRow(row.id, 'duration', event.target.value)} aria-label={`镜头 ${index + 1} 时长（秒）`} /></label>
            <label className="shot-cell shot-visual-cell"><span className="mono">画面与动作</span><textarea value={row.visual} onChange={(event) => updateRow(row.id, 'visual', event.target.value)} /></label>
            <label className="shot-cell shot-camera-cell"><span className="mono">运镜</span><select value={row.camera} onChange={(event) => updateRow(row.id, 'camera', event.target.value)}>{cameraMoves.map((move) => <option key={move}>{move}</option>)}</select></label>
            <label className="shot-cell shot-sound-cell"><span className="mono">对白与声音</span><textarea value={row.sound} onChange={(event) => updateRow(row.id, 'sound', event.target.value)} /></label>
            <div className="shot-row-actions"><span className={`shot-ready ${missing.length === 0 ? 'is-ready' : ''}`}>{missing.length === 0 ? '完整 ✓' : `缺 ${missing.length} 项`}</span><button type="button" disabled={index === 0} onClick={() => moveRow(index, -1)} aria-label={`镜头 ${index + 1} 上移`}>↑</button><button type="button" disabled={index === rows.length - 1} onClick={() => moveRow(index, 1)} aria-label={`镜头 ${index + 1} 下移`}>↓</button><button type="button" onClick={() => deleteRow(row.id)} aria-label={`删除镜头 ${index + 1}`}>×</button></div>
          </article>;})}
        </div> : <div className="shot-empty"><strong>镜头表还是空的。</strong><p>在上方每行写一个镜头，然后点击“整理成镜头表”。</p></div>}

        {rows.length > 0 && <section className="shot-prompt-export"><div className="shot-prompt-heading"><div><span className="mono">03 / PROMPT SKELETON</span><h2>把分镜翻译成生成骨架。</h2></div><button type="button" onClick={copyPrompts}>{copied === 'prompt' ? '已复制全部 Prompt ✓' : manualCopy?.kind === 'prompt' ? '请在上方手动复制 ↑' : '复制全部 Prompt ↗'}</button></div><p>骨架只整理镜头动作、运镜和声音，不会擅自补写人物长相或模型参数。使用时还需要加入项目自己的身份锚点、风格约束和负面词。</p><pre><code>{promptSkeleton}</code></pre></section>}
      </div>
    </section>
  );
}
