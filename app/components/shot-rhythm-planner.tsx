'use client';

import { useMemo, useState } from 'react';

type ShotRole = 'establish' | 'reveal' | 'performance' | 'action' | 'reaction' | 'bridge';

type RhythmShot = {
  id: number;
  title: string;
  role: ShotRole;
  duration: number;
};

type RhythmSignal = {
  tone: 'watch' | 'fix';
  title: string;
  detail: string;
};

const roleOptions: Array<{ value: ShotRole; label: string; short: string }> = [
  { value: 'establish', label: '建立', short: '建立空间' },
  { value: 'reveal', label: '揭示', short: '给出信息' },
  { value: 'performance', label: '表演', short: '等待情绪' },
  { value: 'action', label: '动作', short: '完成动作' },
  { value: 'reaction', label: '反应', short: '接住事件' },
  { value: 'bridge', label: '过桥', short: '连接段落' },
];

const exampleShots: RhythmShot[] = [
  { id: 1, title: '房间全景，她在桌边醒来', role: 'establish', duration: 4 },
  { id: 2, title: '桌面信封与日期', role: 'reveal', duration: 2.5 },
  { id: 3, title: '她读信，手停住', role: 'performance', duration: 5 },
  { id: 4, title: '门外影子掠过', role: 'reveal', duration: 1.5 },
  { id: 5, title: '她抬头看门', role: 'reaction', duration: 2.5 },
  { id: 6, title: '空走廊，先听见声音', role: 'bridge', duration: 4 },
  { id: 7, title: '手靠近门把又停下', role: 'performance', duration: 5 },
  { id: 8, title: '门把轻微转动', role: 'action', duration: 1.5 },
];

function formatTime(value: number) {
  const minutes = Math.floor(value / 60);
  const seconds = value - minutes * 60;
  return `${String(minutes).padStart(2, '0')}:${seconds.toFixed(1).padStart(4, '0')}`;
}

function roleName(role: ShotRole) {
  return roleOptions.find((item) => item.value === role)?.label ?? role;
}

async function copyText(value: string) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return true;
    }
  } catch {
    // Continue to the local fallback.
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

export function ShotRhythmPlanner() {
  const [projectTitle, setProjectTitle] = useState('门外的声音 / 30 秒段落');
  const [targetDuration, setTargetDuration] = useState(30);
  const [shots, setShots] = useState<RhythmShot[]>(exampleShots);
  const [copied, setCopied] = useState(false);
  const [manualCopy, setManualCopy] = useState<string | null>(null);

  const analysis = useMemo(() => {
    const total = shots.reduce((sum, shot) => sum + shot.duration, 0);
    const remaining = targetDuration - total;
    const durations = shots.map((shot) => shot.duration);
    const max = durations.length ? Math.max(...durations) : 0;
    const min = durations.length ? Math.min(...durations) : 0;
    const signals: RhythmSignal[] = [];

    if (!shots.length) {
      signals.push({ tone: 'fix', title: '时间线上还没有镜头', detail: '先添加一个镜头，再分配职责和时长。' });
    }
    if (remaining < -0.25) {
      signals.push({ tone: 'fix', title: `超出目标 ${Math.abs(remaining).toFixed(1)} 秒`, detail: '先删掉重复职责、合并镜头，再决定是否压缩表演与信息时间。' });
    } else if (remaining > 0.25) {
      signals.push({ tone: 'watch', title: `还有 ${remaining.toFixed(1)} 秒未分配`, detail: '可以留给反应、声音过桥或片尾，也可以缩短目标总时长。' });
    }
    if (shots.length >= 4 && max - min <= 1) {
      signals.push({ tone: 'watch', title: '镜头长度过于平均', detail: '长短差异不足一秒；确认这是否真的是段落意图，而不是沿用统一生成时长。' });
    }
    const veryShort = shots.filter((shot) => shot.duration <= 2).length;
    if (shots.length >= 5 && veryShort / shots.length >= 0.6) {
      signals.push({ tone: 'watch', title: '短镜头持续占多数', detail: '如果没有较长镜头形成对照，快速剪切可能失去加速感。' });
    }
    const longShot = shots.find((shot) => total > 0 && shot.duration / total > 0.35 && shots.length >= 4);
    if (longShot) {
      signals.push({ tone: 'watch', title: `镜头 ${String(shots.indexOf(longShot) + 1).padStart(2, '0')} 占据段落三分之一以上`, detail: '确认它确实需要承担主要表演、揭示或停顿，而不是包含了重复等待。' });
    }
    const compressedEstablish = shots.find((shot) => shot.role === 'establish' && shot.duration < 2);
    if (compressedEstablish) {
      signals.push({ tone: 'watch', title: '建立镜头少于 2 秒', detail: '这不是错误，但要确认人物、地点或空间关系能够在切走前被读懂。' });
    }
    const clippedReaction = shots.find((shot) => shot.role === 'reaction' && shot.duration < 1.5);
    if (clippedReaction) {
      signals.push({ tone: 'watch', title: '反应镜头非常短', detail: '检查事件落到人物身上的变化是否已经出现，而不是只看见转头动作。' });
    }

    const status = remaining < -0.25 ? 'over' : remaining > 0.25 ? 'under' : signals.length ? 'watch' : 'ready';
    return { total, remaining, signals, status, max, min } as const;
  }, [shots, targetDuration]);

  const timelineShots = useMemo(() => {
    return shots.reduce<Array<RhythmShot & { start: number; end: number }>>((items, shot) => {
      const start = items.at(-1)?.end ?? 0;
      return [...items, { ...shot, start, end: start + shot.duration }];
    }, []);
  }, [shots]);

  const statusCopy = analysis.status === 'over'
    ? { label: '先收时长', note: '当前镜头总长已经超过段落目标。' }
    : analysis.status === 'under'
      ? { label: '还有留白', note: '目标时长尚未分配完，可以有意保留或继续规划。' }
      : analysis.status === 'watch'
        ? { label: '节奏待确认', note: '总时长已经对上，但长短关系仍有需要确认的地方。' }
        : { label: '可以试剪', note: '时间分配已经对上，下一步用真实画面和声音验收。' };

  function updateShot(id: number, patch: Partial<RhythmShot>) {
    setShots((current) => current.map((shot) => shot.id === id ? { ...shot, ...patch } : shot));
    setCopied(false);
    setManualCopy(null);
  }

  function moveShot(index: number, direction: -1 | 1) {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= shots.length) return;
    setShots((current) => {
      const next = [...current];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });
  }

  function addShot() {
    const nextId = shots.reduce((max, shot) => Math.max(max, shot.id), 0) + 1;
    setShots((current) => [...current, { id: nextId, title: '新的镜头任务', role: 'action', duration: 2.5 }]);
  }

  function loadExample() {
    setProjectTitle('门外的声音 / 30 秒段落');
    setTargetDuration(30);
    setShots(exampleShots);
    setCopied(false);
    setManualCopy(null);
  }

  function clearPlanner() {
    setProjectTitle('未命名段落');
    setTargetDuration(30);
    setShots([]);
    setCopied(false);
    setManualCopy(null);
  }

  const report = [
    `# 镜头节奏规划：${projectTitle.trim() || '未命名段落'}`,
    '',
    `目标时长：${targetDuration.toFixed(1)} 秒`,
    `已分配：${analysis.total.toFixed(1)} 秒`,
    `结论：${statusCopy.label}`,
    '',
    '| 镜号 | 时间码 | 时长 | 职责 | 镜头任务 |',
    '| --- | --- | ---: | --- | --- |',
    ...timelineShots.map((shot, index) => `| ${String(index + 1).padStart(2, '0')} | ${formatTime(shot.start)}–${formatTime(shot.end)} | ${shot.duration.toFixed(1)} 秒 | ${roleName(shot.role)} | ${shot.title.trim() || '未命名镜头'} |`),
    '',
    '## 节奏信号',
    ...(analysis.signals.length ? analysis.signals.map((signal) => `- ${signal.title}：${signal.detail}`) : ['- 当前没有触发结构预警。']),
    '',
    '说明：这些提示来自可见时长与职责规则，不是固定剪辑公式。最终节奏需要用真实画面、表演和声音在时间线上验收。',
  ].join('\n');

  async function copyReport() {
    if (await copyText(report)) {
      setManualCopy(null);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } else {
      setManualCopy(report);
    }
  }

  return (
    <section className="rhythm-workbench" aria-label="镜头节奏规划器">
      <div className="rhythm-editor">
        <div className="rhythm-panel-heading">
          <div><span className="mono">01 / ROUGH CUT</span><h2>先分时间，<br />再生成素材。</h2></div>
          <div><button type="button" onClick={loadExample}>载入示例</button><button type="button" onClick={clearPlanner}>清空</button></div>
        </div>

        <div className="rhythm-project-fields">
          <label><span className="mono">SEQUENCE / 段落名称</span><input value={projectTitle} onChange={(event) => setProjectTitle(event.target.value)} /></label>
          <label><span className="mono">TARGET / 目标时长</span><div><input type="number" min="1" max="600" step="0.5" value={targetDuration} onChange={(event) => setTargetDuration(Math.max(1, Number(event.target.value) || 1))} /><b>秒</b></div></label>
        </div>

        <div className="rhythm-timeline-wrap">
          <div className="rhythm-timeline-heading"><span className="mono">TIMELINE / 按秒伸缩</span><strong>{formatTime(analysis.total)}</strong></div>
          <div className="rhythm-timeline" aria-label="镜头节奏时间带">
            {timelineShots.length ? timelineShots.map((shot, index) => <div className={`rhythm-segment rhythm-role-${shot.role}`} style={{ flexGrow: shot.duration }} key={shot.id}><span>{String(index + 1).padStart(2, '0')}</span><strong>{shot.duration.toFixed(1)}s</strong><small>{roleName(shot.role)}</small></div>) : <p>先添加镜头，时间带会按每镜秒数自动展开。</p>}
          </div>
          <div className="rhythm-target-line"><span style={{ width: `${Math.min(100, analysis.total ? (targetDuration / analysis.total) * 100 : 100)}%` }} /><small className="mono">TARGET {targetDuration.toFixed(1)}s</small></div>
        </div>

        <div className="rhythm-shot-list">
          {shots.map((shot, index) => <article className={`rhythm-shot-row rhythm-role-${shot.role}`} key={shot.id}>
            <div className="rhythm-shot-index"><span className="mono">SHOT</span><strong>{String(index + 1).padStart(2, '0')}</strong><small>{formatTime(timelineShots[index].start)}</small></div>
            <label className="rhythm-shot-title"><span>镜头任务</span><input value={shot.title} onChange={(event) => updateShot(shot.id, { title: event.target.value })} aria-label={`镜头 ${index + 1} 的任务`} /></label>
            <label className="rhythm-shot-role"><span>主要职责</span><select value={shot.role} onChange={(event) => updateShot(shot.id, { role: event.target.value as ShotRole })} aria-label={`镜头 ${index + 1} 的职责`}>{roleOptions.map((role) => <option value={role.value} key={role.value}>{role.label} · {role.short}</option>)}</select></label>
            <label className="rhythm-shot-duration"><span>时长</span><div><input type="range" min="0.5" max="15" step="0.5" value={shot.duration} onChange={(event) => updateShot(shot.id, { duration: Number(event.target.value) })} aria-label={`镜头 ${index + 1} 时长`} /><output>{shot.duration.toFixed(1)}s</output></div></label>
            <div className="rhythm-shot-actions"><button type="button" onClick={() => moveShot(index, -1)} disabled={index === 0} aria-label={`镜头 ${index + 1} 上移`}>↑</button><button type="button" onClick={() => moveShot(index, 1)} disabled={index === shots.length - 1} aria-label={`镜头 ${index + 1} 下移`}>↓</button><button type="button" onClick={() => setShots((current) => current.filter((item) => item.id !== shot.id))} aria-label={`删除镜头 ${index + 1}`}>×</button></div>
          </article>)}
        </div>
        <button type="button" className="rhythm-add-shot" onClick={addShot}>＋ 添加一个镜头任务</button>
      </div>

      <aside className={`rhythm-ticket rhythm-status-${analysis.status}`} aria-live="polite">
        <div className="rhythm-ticket-topline mono"><span>02 / RHYTHM CHECK</span><span>{shots.length} SHOTS</span></div>
        <div className="rhythm-pulse" aria-hidden="true">{shots.slice(0, 8).map((shot, index) => <i style={{ height: `${Math.max(18, (shot.duration / Math.max(analysis.max, 1)) * 100)}%` }} key={shot.id}><span>{index + 1}</span></i>)}</div>
        <p>节奏结论</p><h2>{statusCopy.label}</h2><small>{statusCopy.note}</small>
        <dl className="rhythm-metrics"><div><dt>目标</dt><dd>{targetDuration.toFixed(1)}s</dd></div><div><dt>已分配</dt><dd>{analysis.total.toFixed(1)}s</dd></div><div><dt>{analysis.remaining < 0 ? '超出' : '剩余'}</dt><dd>{Math.abs(analysis.remaining).toFixed(1)}s</dd></div></dl>
        <div className="rhythm-signal-list">
          {analysis.signals.length ? analysis.signals.map((signal, index) => <article key={`${signal.title}-${index}`}><span className={`rhythm-signal-${signal.tone}`}>{signal.tone === 'fix' ? '先修' : '确认'}</span><div><strong>{signal.title}</strong><p>{signal.detail}</p></div></article>) : <article className="rhythm-clear"><span>✓</span><div><strong>时长与长短关系没有明显预警</strong><p>放进真实时间线，分别用静音、表演和声音三遍验收。</p></div></article>}
        </div>
        <button type="button" className="rhythm-copy-button" onClick={copyReport}>{copied ? '已复制时间表 ✓' : '复制镜头时间表 ↗'}</button>
        <p className="rhythm-disclaimer">只在浏览器本地计算，不上传内容；提示是透明启发式规则，不是固定剪辑公式。</p>
      </aside>

      {manualCopy && <aside className="rhythm-copy-fallback"><div><span className="mono">MANUAL COPY / 浏览器限制</span><p>点击文本框后按 Ctrl+A，再按 Ctrl+C。</p></div><button type="button" onClick={() => setManualCopy(null)}>关闭 ×</button><textarea readOnly value={manualCopy} aria-label="手动复制镜头时间表" /></aside>}
    </section>
  );
}
