'use client';

import type { CSSProperties } from 'react';
import { useMemo, useState } from 'react';

type Master = {
  title: string;
  version: string;
  width: number;
  height: number;
  duration: number;
  frameRate: string;
  visualFocus: string;
  captionSource: string;
};

type Destination = {
  id: number;
  enabled: boolean;
  name: string;
  placement: string;
  width: number;
  height: number;
  maxDuration: number;
  safeTop: number;
  safeRight: number;
  safeBottom: number;
  safeLeft: number;
  caption: string;
  audio: string;
  suffix: string;
  checkedAt: string;
};

const exampleMaster: Master = {
  title: '《她每天醒来都会忘记昨天》发布测试',
  version: 'v01',
  width: 1920,
  height: 1080,
  duration: 48,
  frameRate: '25 fps',
  visualFocus: '人物眼睛、桌面信件与日期必须保持可读；竖版允许重排双人构图。',
  captionSource: '中文字幕 SRT + 无字母版',
};

const exampleDestinations: Destination[] = [
  { id: 1, enabled: true, name: '横版正片', placement: '作品主页 / 横屏播放器', width: 1920, height: 1080, maxDuration: 60, safeTop: 5, safeRight: 5, safeBottom: 10, safeLeft: 5, caption: '外挂 SRT + 无字版', audio: '立体声；发布前实听', suffix: 'LANDSCAPE', checkedAt: '示例，发布前核对' },
  { id: 2, enabled: true, name: '竖版短片', placement: '移动端全屏信息流', width: 1080, height: 1920, maxDuration: 30, safeTop: 12, safeRight: 8, safeBottom: 20, safeLeft: 8, caption: '烧录字幕；避开界面覆盖区', audio: '立体声；对白优先', suffix: 'VERTICAL', checkedAt: '示例，发布前核对' },
  { id: 3, enabled: true, name: '方版预告', placement: '收藏页 / 方形卡片', width: 1080, height: 1080, maxDuration: 15, safeTop: 8, safeRight: 8, safeBottom: 14, safeLeft: 8, caption: '短句烧录字幕', audio: '立体声；检查首帧静音播放', suffix: 'SQUARE', checkedAt: '示例，发布前核对' },
];

const emptyMaster: Master = { title: '未命名发布项目', version: 'v01', width: 1920, height: 1080, duration: 30, frameRate: '25 fps', visualFocus: '', captionSource: '' };
const emptyDestination: Destination = { id: 1, enabled: true, name: '新的发布版本', placement: '', width: 1080, height: 1920, maxDuration: 30, safeTop: 10, safeRight: 8, safeBottom: 18, safeLeft: 8, caption: '', audio: '', suffix: 'VERTICAL', checkedAt: '' };

function safeNumber(value: string, max = 100000) {
  return Math.min(max, Math.max(0, Number(value) || 0));
}

function gcd(a: number, b: number): number {
  return b ? gcd(b, a % b) : a;
}

function ratioLabel(width: number, height: number) {
  if (!width || !height) return '—';
  const divisor = gcd(Math.round(width), Math.round(height));
  return `${Math.round(width) / divisor}:${Math.round(height) / divisor}`;
}

function cropInfo(sourceWidth: number, sourceHeight: number, targetWidth: number, targetHeight: number) {
  if (!sourceWidth || !sourceHeight || !targetWidth || !targetHeight) return { retained: 0, axis: 'unknown' as const };
  const sourceRatio = sourceWidth / sourceHeight;
  const targetRatio = targetWidth / targetHeight;
  if (Math.abs(sourceRatio - targetRatio) < 0.015) return { retained: 100, axis: 'none' as const };
  if (sourceRatio > targetRatio) return { retained: targetRatio / sourceRatio * 100, axis: 'sides' as const };
  return { retained: sourceRatio / targetRatio * 100, axis: 'top-bottom' as const };
}

function csvCell(value: string | number) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

async function copyText(value: string) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return true;
    }
  } catch {
    // Continue to a local fallback.
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

export function ReleaseMatrixPlanner() {
  const [master, setMaster] = useState<Master>(exampleMaster);
  const [destinations, setDestinations] = useState<Destination[]>(exampleDestinations);
  const [openIds, setOpenIds] = useState<number[]>([1, 2]);
  const [copied, setCopied] = useState<string | null>(null);
  const [manualCopy, setManualCopy] = useState<string | null>(null);

  const matrix = useMemo(() => destinations.filter((item) => item.enabled).map((item) => {
    const crop = cropInfo(master.width, master.height, item.width, item.height);
    const safeValid = item.safeLeft + item.safeRight < 90 && item.safeTop + item.safeBottom < 90;
    const complete = Boolean(item.name.trim() && item.placement.trim() && item.width && item.height && item.maxDuration && item.checkedAt.trim() && safeValid);
    const trimSeconds = Math.max(0, master.duration - item.maxDuration);
    const cropLoss = Math.max(0, 100 - crop.retained);
    const cropStatus = crop.axis === 'none' ? '原画幅' : cropLoss > 35 ? '建议重排' : cropLoss > 10 ? '需要裁切' : '轻微裁切';
    return { ...item, ...crop, safeValid, complete, trimSeconds, cropLoss, cropStatus };
  }), [destinations, master]);

  const readyCount = matrix.filter((item) => item.complete).length;
  const score = matrix.length ? Math.round(readyCount / matrix.length * 100) : 0;

  const markdown = useMemo(() => [
    `# ${master.title.trim() || '未命名项目'} · 多平台发布矩阵`, '',
    `- 母版：${master.width} × ${master.height}（${ratioLabel(master.width, master.height)}）`,
    `- 母版版本：${master.version || '待填写'}`,
    `- 时长：${master.duration} 秒`,
    `- 帧率：${master.frameRate || '待填写'}`,
    `- 视觉焦点：${master.visualFocus || '待填写'}`,
    `- 字幕源：${master.captionSource || '待填写'}`, '',
    '## 输出矩阵', '',
    '| 版本 | 发布位置 | 规格 | 上限 | 画幅处理 | 安全区 上/右/下/左 | 字幕 | 音频 | 核对日期 |',
    '| --- | --- | --- | ---: | --- | --- | --- | --- | --- |',
    ...matrix.map((item) => `| ${item.name || '未命名'} | ${item.placement || '待填写'} | ${item.width}×${item.height} (${ratioLabel(item.width, item.height)}) | ${item.maxDuration}s | ${item.cropStatus}；保留约 ${Math.round(item.retained)}% | ${item.safeTop}% / ${item.safeRight}% / ${item.safeBottom}% / ${item.safeLeft}% | ${item.caption || '待填写'} | ${item.audio || '待填写'} | ${item.checkedAt || '待核对'} |`), '',
    '## 版本动作', '',
    ...matrix.flatMap((item) => [
      `### ${item.name || '未命名版本'} · ${item.suffix || 'OUTPUT'}`,
      `- ${item.cropStatus}${item.axis === 'sides' ? '：左右会被裁切，重新检查人物、文字与道具。' : item.axis === 'top-bottom' ? '：上下会被裁切，重新检查头顶、字幕与动作落点。' : '：与母版画幅接近。'}`,
      `- ${item.trimSeconds ? `需要从母版缩短至少 ${item.trimSeconds} 秒；不要只做机械截尾。` : '当前时长不超过填写的上限。'}`,
      `- 安全区：上 ${item.safeTop}% / 右 ${item.safeRight}% / 下 ${item.safeBottom}% / 左 ${item.safeLeft}%${item.safeValid ? '' : '（数值冲突，必须修正）'}`,
      `- 字幕：${item.caption || '待填写'}`,
      `- 音频：${item.audio || '待填写'}`,
      `- 导出文件建议：${master.title.trim() || 'PROJECT'}_${master.version || 'v01'}_${item.suffix || 'OUTPUT'}_${item.width}x${item.height}.mp4`, '',
    ]),
    '说明：画幅保留比例只按母版与目标画幅的几何中心裁切估算，不检查主体位置、运镜、字幕、平台界面或实际编码。平台规则应在发布当天从官方页面重新核对。',
  ].join('\n'), [master, matrix]);

  const csv = useMemo(() => [
    ['版本', '发布位置', '宽', '高', '比例', '时长上限秒', '预计需缩短秒', '几何保留%', '画幅处理', '安全上%', '安全右%', '安全下%', '安全左%', '字幕', '音频', '后缀', '规则核对日期', '状态'].map(csvCell).join(','),
    ...matrix.map((item) => [item.name, item.placement, item.width, item.height, ratioLabel(item.width, item.height), item.maxDuration, item.trimSeconds, Math.round(item.retained), item.cropStatus, item.safeTop, item.safeRight, item.safeBottom, item.safeLeft, item.caption, item.audio, item.suffix, item.checkedAt, item.complete ? '字段完整' : '待补字段'].map(csvCell).join(',')),
  ].join('\n'), [matrix]);

  function resetCopy() { setCopied(null); setManualCopy(null); }
  function updateMaster(key: keyof Master, value: string | number) { setMaster((current) => ({ ...current, [key]: value })); resetCopy(); }
  function updateDestination(id: number, patch: Partial<Destination>) { setDestinations((current) => current.map((item) => item.id === id ? { ...item, ...patch } : item)); resetCopy(); }
  function addDestination() {
    if (destinations.length >= 6) return;
    const nextId = destinations.reduce((max, item) => Math.max(max, item.id), 0) + 1;
    setDestinations((current) => [...current, { ...emptyDestination, id: nextId, name: `发布版本 ${nextId}` }]);
    resetCopy();
  }
  function removeDestination(id: number) { if (destinations.length > 1) setDestinations((current) => current.filter((item) => item.id !== id)); resetCopy(); }
  function loadExample() { setMaster(exampleMaster); setDestinations(exampleDestinations); setOpenIds([1, 2]); resetCopy(); }
  function clearAll() { setMaster(emptyMaster); setDestinations([emptyDestination]); setOpenIds([1]); resetCopy(); }
  async function handleCopy(key: string, value: string) {
    if (await copyText(value)) { setCopied(key); setManualCopy(null); window.setTimeout(() => setCopied(null), 1800); }
    else setManualCopy(value);
  }

  return (
    <section className="release-workbench" aria-label="多平台发布规格规划器">
      <div className="release-editor">
        <div className="release-panel-heading">
          <div><span className="mono">01 / MASTER SOURCE</span><h2>先锁母版，<br />再拆发布版本。</h2></div>
          <div><button type="button" onClick={loadExample}>载入示例</button><button type="button" onClick={clearAll}>清空</button></div>
        </div>

        <div className="release-master-grid">
          <label className="is-wide"><span>项目名称<small>用于矩阵与文件名</small></span><input value={master.title} onChange={(event) => updateMaster('title', event.target.value)} /></label>
          <label><span>母版版本</span><input value={master.version} onChange={(event) => updateMaster('version', event.target.value)} /></label>
          <label><span>母版宽度</span><div><input type="number" min="1" value={master.width} onChange={(event) => updateMaster('width', safeNumber(event.target.value))} /><b>px</b></div></label>
          <label><span>母版高度</span><div><input type="number" min="1" value={master.height} onChange={(event) => updateMaster('height', safeNumber(event.target.value))} /><b>px</b></div></label>
          <label><span>母版时长</span><div><input type="number" min="0" step="0.1" value={master.duration} onChange={(event) => updateMaster('duration', safeNumber(event.target.value))} /><b>秒</b></div></label>
          <label><span>帧率</span><input value={master.frameRate} onChange={(event) => updateMaster('frameRate', event.target.value)} /></label>
          <label className="is-wide"><span>不可丢失的视觉焦点<small>人物、文字、道具与动作落点</small></span><textarea rows={2} value={master.visualFocus} onChange={(event) => updateMaster('visualFocus', event.target.value)} /></label>
          <label className="is-wide"><span>字幕源<small>无字母版、SRT、双语稿等</small></span><input value={master.captionSource} onChange={(event) => updateMaster('captionSource', event.target.value)} /></label>
        </div>

        <div className="release-destinations-heading"><div><span className="mono">02 / DESTINATIONS</span><h3>每一个发布位置，都是独立版本。</h3></div><button type="button" onClick={addDestination} disabled={destinations.length >= 6}>{destinations.length >= 6 ? '最多 6 个版本' : '＋ 添加发布版本'}</button></div>
        <div className="release-destination-list">
          {destinations.map((item, index) => <details className={`release-destination release-tone-${index % 4}`} open={openIds.includes(item.id)} onToggle={(event) => {
            const isOpen = event.currentTarget.open;
            setOpenIds((current) => isOpen ? current.includes(item.id) ? current : [...current, item.id] : current.filter((id) => id !== item.id));
          }} key={item.id}>
            <summary><span className="mono">OUTPUT {String(index + 1).padStart(2, '0')}</span><strong>{item.name || '未命名版本'}</strong><small>{item.width} × {item.height} · {ratioLabel(item.width, item.height)}</small><i>＋</i></summary>
            <div className="release-destination-body">
              <label className="release-enable-switch"><span>纳入本次输出矩阵</span><input type="checkbox" checked={item.enabled} onChange={(event) => updateDestination(item.id, { enabled: event.target.checked })} /><i>{item.enabled ? 'IN' : 'OUT'}</i></label>
              <div className="release-fields">
                <label><span>版本名称</span><input value={item.name} onChange={(event) => updateDestination(item.id, { name: event.target.value })} /></label>
                <label><span>发布位置</span><input value={item.placement} placeholder="具体页面或渠道位置" onChange={(event) => updateDestination(item.id, { placement: event.target.value })} /></label>
                <label><span>宽度</span><div><input type="number" min="1" value={item.width} onChange={(event) => updateDestination(item.id, { width: safeNumber(event.target.value) })} /><b>px</b></div></label>
                <label><span>高度</span><div><input type="number" min="1" value={item.height} onChange={(event) => updateDestination(item.id, { height: safeNumber(event.target.value) })} /><b>px</b></div></label>
                <label><span>时长上限</span><div><input type="number" min="0" step="0.1" value={item.maxDuration} onChange={(event) => updateDestination(item.id, { maxDuration: safeNumber(event.target.value) })} /><b>秒</b></div></label>
                <label><span>文件名后缀</span><input value={item.suffix} onChange={(event) => updateDestination(item.id, { suffix: event.target.value.toUpperCase() })} /></label>
              </div>
              <div className="release-safe-fields"><span className="mono">SAFE AREA / 安全边距（画面百分比）</span>{(['safeTop', 'safeRight', 'safeBottom', 'safeLeft'] as const).map((key, safeIndex) => <label key={key}><span>{['上', '右', '下', '左'][safeIndex]}</span><input type="number" min="0" max="80" value={item[key]} onChange={(event) => updateDestination(item.id, { [key]: safeNumber(event.target.value, 80) })} /><b>%</b></label>)}</div>
              <div className="release-fields release-notes-fields">
                <label><span>字幕交付方式</span><input value={item.caption} placeholder="烧录、外挂或无字幕" onChange={(event) => updateDestination(item.id, { caption: event.target.value })} /></label>
                <label><span>音频要求</span><input value={item.audio} placeholder="声道、响度或实听要求" onChange={(event) => updateDestination(item.id, { audio: event.target.value })} /></label>
                <label className="is-wide"><span>规则最后核对日期 / 备注</span><input value={item.checkedAt} placeholder="例如：2026-08-29，官方帮助中心" onChange={(event) => updateDestination(item.id, { checkedAt: event.target.value })} /></label>
              </div>
              <button className="release-remove" type="button" disabled={destinations.length === 1} onClick={() => removeDestination(item.id)}>删除这个发布版本</button>
            </div>
          </details>)}
        </div>
      </div>

      <aside className="release-routing-board" aria-live="polite">
        <div className="release-board-topline mono"><span>FORMAT ROUTING BOARD</span><span>{matrix.length} OUTPUTS</span></div>
        <div className="release-master-frame" style={{ '--master-ratio': `${master.width} / ${master.height}` } as CSSProperties}>
          <span className="mono">MASTER / {ratioLabel(master.width, master.height)}</span><strong>{master.title || '未命名母版'}</strong><small>{master.width} × {master.height} · {master.duration}s</small>
          <i aria-hidden="true" />
        </div>
        <div className="release-route-line" aria-hidden="true"><i /><i /><i /></div>
        <div className="release-mini-frames">
          {matrix.map((item, index) => <article className={`release-mini-frame release-mini-${index % 4} ${item.complete ? 'is-complete' : ''}`} key={item.id}>
            <div className="release-canvas" style={{ aspectRatio: `${item.width || 1} / ${item.height || 1}`, '--safe-top': `${item.safeTop}%`, '--safe-right': `${item.safeRight}%`, '--safe-bottom': `${item.safeBottom}%`, '--safe-left': `${item.safeLeft}%` } as CSSProperties}>
              <i className={`crop-${item.axis}`} aria-hidden="true" /><span>SAFE</span>
            </div>
            <div><span className="mono">{item.suffix || `OUT-${index + 1}`}</span><strong>{item.name || '未命名'}</strong><small>{ratioLabel(item.width, item.height)} · 保留约 {Math.round(item.retained)}%</small></div>
            <b>{item.complete ? '字段完整' : '待补字段'}</b>
          </article>)}
        </div>
        <div className="release-score"><span className="mono">MATRIX READINESS</span><strong>{score}%</strong><small>{readyCount} / {matrix.length} 个启用版本字段完整</small></div>
        <button type="button" onClick={() => handleCopy('all', markdown)}>{copied === 'all' ? '已复制发布矩阵 ✓' : '复制完整发布矩阵 ↗'}</button>
        <small>彩色安全框由你填写的百分比生成；裁切保留值只是假设居中裁切的几何估算。</small>
      </aside>

      <section className="release-output-section">
        <div className="release-output-heading"><div><span className="mono">03 / HANDOFF SHEETS</span><h2>把每个版本，<br />交给下一道工序。</h2></div><p>矩阵让剪辑、字幕、声音和发布人员看到同一组要求。执行前仍需在真实平台与设备上核对。</p></div>
        <div className="release-output-grid">
          <article><div><span className="mono">MARKDOWN MATRIX</span><button type="button" onClick={() => handleCopy('md', markdown)}>{copied === 'md' ? '已复制 ✓' : '复制'}</button></div><pre>{markdown}</pre></article>
          <article><div><span className="mono">CSV EXPORT LIST</span><button type="button" onClick={() => handleCopy('csv', csv)}>{copied === 'csv' ? '已复制 ✓' : '复制'}</button></div><pre>{csv}</pre></article>
        </div>
      </section>

      {manualCopy && <aside className="release-copy-fallback"><div><span className="mono">MANUAL COPY / 浏览器限制</span><p>点击文本框后按 Ctrl+A，再按 Ctrl+C。</p></div><button type="button" onClick={() => setManualCopy(null)}>关闭 ×</button><textarea readOnly value={manualCopy} aria-label="手动复制发布矩阵" /></aside>}
    </section>
  );
}
