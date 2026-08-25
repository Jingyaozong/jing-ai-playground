'use client';

import { useState } from 'react';

type ShotRow = {
  id: string;
  size: string;
  visual: string;
  camera: string;
  sound: string;
};

const exampleNotes = `雨夜，远景。空荡的公交站，路灯闪烁。固定镜头。环境音：雨声。
近景，短发女性低头看手机，屏幕亮起。摄影机缓慢推进。
手部特写。手机上出现一张来自明天的合照。音效：消息提示音。
中景。她抬头看向道路尽头，说：“这不是今天拍的。” 跟拍。`;

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
      visual: cleanVisual(line),
      camera: inferCamera(line),
      sound: extractSound(line),
    }));
}

function escapeCell(value: string) {
  return value.replaceAll('|', '\\|').replaceAll('\n', ' ');
}

export function ShotListCleaner() {
  const [notes, setNotes] = useState(exampleNotes);
  const [rows, setRows] = useState<ShotRow[]>(() => parseNotes(exampleNotes));
  const [copied, setCopied] = useState(false);

  function organize() {
    setRows(parseNotes(notes));
    setCopied(false);
  }

  function updateRow(id: string, field: keyof Omit<ShotRow, 'id'>, value: string) {
    setRows((current) => current.map((row) => row.id === id ? { ...row, [field]: value } : row));
    setCopied(false);
  }

  function moveRow(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= rows.length) return;
    setRows((current) => {
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function addRow() {
    setRows((current) => [...current, { id: `manual-${Date.now()}`, size: '未指定', visual: '补充画面与动作', camera: '未指定', sound: '—' }]);
  }

  async function copyTable() {
    const header = '| 镜号 | 景别 | 画面与动作 | 运镜 | 对白与声音 |\n| --- | --- | --- | --- | --- |';
    const body = rows.map((row, index) => `| ${String(index + 1).padStart(2, '0')} | ${escapeCell(row.size)} | ${escapeCell(row.visual)} | ${escapeCell(row.camera)} | ${escapeCell(row.sound)} |`).join('\n');
    try {
      await navigator.clipboard.writeText(`${header}\n${body}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="shot-cleaner" aria-label="分镜整理器">
      <div className="shot-input-layout">
        <div className="shot-input-panel">
          <div className="shot-panel-topline mono"><span>01 / 粘贴散乱笔记</span><span>每行一镜</span></div>
          <textarea value={notes} onChange={(event) => setNotes(event.target.value)} aria-label="散乱的分镜笔记" placeholder="每行写一个镜头。可以包含景别、画面、运镜、对白和声音。" />
          <div className="shot-input-actions">
            <button type="button" onClick={() => setNotes(exampleNotes)}>恢复示例</button>
            <button type="button" onClick={() => { setNotes(''); setRows([]); }}>清空</button>
            <button type="button" className="shot-organize-button" onClick={organize}>整理成镜头表 ↓</button>
          </div>
        </div>

        <aside className="shot-input-note">
          <span className="mono">LOCAL / 本地处理</span>
          <strong>先写清楚，<br />不必写漂亮。</strong>
          <p>第一版使用本地规则识别常见景别、运镜、对白和声音，内容不会上传。整理以后，每一格都可以继续修改。</p>
          <div><b>{rows.length}</b><span>个镜头<br />正在表里</span></div>
        </aside>
      </div>

      <div className="shot-output-section">
        <div className="shot-output-heading">
          <div><span className="mono">02 / SHOT LIST</span><h2>可以继续修改的镜头表。</h2></div>
          <div className="shot-output-actions"><button type="button" onClick={addRow}>＋ 新增镜头</button><button type="button" className="shot-copy-button" onClick={copyTable} disabled={rows.length === 0}>{copied ? '已复制 Markdown 表格 ✓' : '复制镜头表 ↗'}</button></div>
        </div>

        {rows.length > 0 ? <div className="shot-sheet">
          <div className="shot-sheet-head mono"><span>镜号</span><span>景别</span><span>画面与动作</span><span>运镜</span><span>对白与声音</span><span>调整</span></div>
          {rows.map((row, index) => <article className="shot-row" key={row.id}>
            <div className="shot-number"><span className="mono">镜号</span><b>{String(index + 1).padStart(2, '0')}</b></div>
            <label className="shot-cell shot-size-cell"><span className="mono">景别</span><select value={row.size} onChange={(event) => updateRow(row.id, 'size', event.target.value)}>{shotSizes.map((size) => <option key={size}>{size}</option>)}</select></label>
            <label className="shot-cell shot-visual-cell"><span className="mono">画面与动作</span><textarea value={row.visual} onChange={(event) => updateRow(row.id, 'visual', event.target.value)} /></label>
            <label className="shot-cell shot-camera-cell"><span className="mono">运镜</span><select value={row.camera} onChange={(event) => updateRow(row.id, 'camera', event.target.value)}>{cameraMoves.map((move) => <option key={move}>{move}</option>)}</select></label>
            <label className="shot-cell shot-sound-cell"><span className="mono">对白与声音</span><textarea value={row.sound} onChange={(event) => updateRow(row.id, 'sound', event.target.value)} /></label>
            <div className="shot-row-actions"><span className="mono">调整</span><button type="button" disabled={index === 0} onClick={() => moveRow(index, -1)} aria-label={`镜头 ${index + 1} 上移`}>↑</button><button type="button" disabled={index === rows.length - 1} onClick={() => moveRow(index, 1)} aria-label={`镜头 ${index + 1} 下移`}>↓</button><button type="button" onClick={() => setRows((current) => current.filter((item) => item.id !== row.id))} aria-label={`删除镜头 ${index + 1}`}>×</button></div>
          </article>)}
        </div> : <div className="shot-empty"><strong>镜头表还是空的。</strong><p>在上方每行写一个镜头，然后点击“整理成镜头表”。</p></div>}
      </div>
    </section>
  );
}
