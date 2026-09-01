'use client';

import { useEffect, useMemo, useState } from 'react';

type RecordStatus = 'untested' | 'generated' | 'reviewed';
type Group = 'A' | 'B' | 'C';
type ScoreKey = 'umbrellaIntegrity' | 'causalOrder' | 'waterDirection' | 'worldContinuity';

type WaterlineRecord = {
  id: string;
  group: Group;
  task: string;
  status: RecordStatus;
  model: string;
  seed: string;
  asset: string;
  lockFrame: string;
  waterStartFrame: string;
  scores: Record<ScoreKey, number | null>;
  failures: string[];
  note: string;
};

const storageKey = 'jing-experiment-waterline-motion-v1';
const groups: Array<{ code: Group; label: string }> = [
  { code: 'A', label: '一句动作描述' },
  { code: 'B', label: '因果状态链' },
  { code: 'C', label: '状态链＋空间端点' },
];
const tasks = ['只测试撑伞', '只测试斜向退水', '组合撑伞与退水'];
const scoreLabels: Array<{ key: ScoreKey; label: string; hint: string }> = [
  { key: 'umbrellaIntegrity', label: '红伞完整', hint: '始终只有一把伞；伞柄、伞骨、伞盖与手位连续可信' },
  { key: 'causalOrder', label: '因果顺序', hint: '伞骨完全锁定以后，水线才出现第一次位移' },
  { key: 'waterDirection', label: '水线方向', hint: '水线从左前到右后单调后退，不倒流、分叉或随机消失' },
  { key: 'worldContinuity', label: '世界连续', hint: '人物、书架、书页、木地板与出口在退水过程中保持稳定' },
];
const failureOptions = ['水提前后退', '伞水同时动作', '顺序倒置', '伞复制或变形', '手穿过伞柄', '水线倒流', '水线分叉', '局部随机消失', '人物身份漂移', '书架或地板融化', '隐性切镜', '其他'];
const statusLabels: Record<RecordStatus, string> = { untested: '待执行', generated: '已生成', reviewed: '已评估' };

function emptyRecords(): WaterlineRecord[] {
  return groups.flatMap((group) => tasks.map((task, index) => ({
    id: `${group.code}${String(index + 1).padStart(2, '0')}`,
    group: group.code,
    task,
    status: 'untested' as const,
    model: '',
    seed: '',
    asset: '',
    lockFrame: '',
    waterStartFrame: '',
    scores: { umbrellaIntegrity: null, causalOrder: null, waterDirection: null, worldContinuity: null },
    failures: [],
    note: '',
  })));
}

function isComplete(record: WaterlineRecord) {
  return scoreLabels.every(({ key }) => record.scores[key] !== null);
}

function average(record: WaterlineRecord) {
  const scores = Object.values(record.scores).filter((score): score is number => score !== null);
  return scores.length ? scores.reduce((sum, score) => sum + score, 0) / scores.length : null;
}

function buildMarkdown(records: WaterlineRecord[]) {
  const groupSummary = groups.flatMap((group) => {
    const rows = records.filter((record) => record.group === group.code);
    return [`### ${group.code} · ${group.label}`, ...scoreLabels.map(({ key, label }) => {
      const values = rows.map((record) => record.scores[key]).filter((value): value is number => value !== null);
      return `- ${label}：${values.length ? (values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2) : '—'} / 5（${values.length} 个有效评分）`;
    }), ''];
  });
  const rows = records.map((record) => `| ${record.id} | ${record.task} | ${statusLabels[record.status]} | ${record.model || '—'} | ${record.seed || '—'} | ${record.asset || '—'} | ${record.lockFrame || '—'} | ${record.waterStartFrame || '—'} | ${record.scores.umbrellaIntegrity ?? '—'} | ${record.scores.causalOrder ?? '—'} | ${record.scores.waterDirection ?? '—'} | ${record.scores.worldContinuity ?? '—'} | ${record.failures.join('、') || '—'} | ${(record.note || '—').replaceAll('|', '\\|').replaceAll('\n', ' ')} |`);
  return [
    '# 撑伞以后，水面能沿一个方向连续退去吗？｜9 格实验记录', '',
    '> A 一句动作描述、B 因果状态链、C 状态链加空间端点。空白项不进入平均分；静态概念帧不算视频结果。', '',
    '## 分组平均', '', ...groupSummary,
    '## 样本明细', '',
    '| 编号 | 固定任务 | 状态 | 模型 / 版本 | Seed | 结果文件 | 伞锁定帧 | 水首动帧 | 红伞完整 | 因果顺序 | 水线方向 | 世界连续 | 失败标签 | 五点观察 |',
    '| --- | --- | --- | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | --- | --- |',
    ...rows,
  ].join('\n');
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

export function WaterlineMotionRecordBoard() {
  const [records, setRecords] = useState<WaterlineRecord[]>(emptyRecords);
  const [activeId, setActiveId] = useState('A01');
  const [groupFilter, setGroupFilter] = useState<'ALL' | Group>('ALL');
  const [loaded, setLoaded] = useState(false);
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'manual'>('idle');

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved) as WaterlineRecord[];
          if (Array.isArray(parsed) && parsed.length === 9) setRecords(parsed);
        }
      } catch {
        // A damaged local draft should not block the worksheet.
      }
      setLoaded(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try { window.localStorage.setItem(storageKey, JSON.stringify(records)); } catch { /* Keep working without storage. */ }
  }, [loaded, records]);

  const active = records.find((record) => record.id === activeId) ?? records[0];
  const generated = records.filter((record) => record.status !== 'untested').length;
  const completed = records.filter(isComplete).length;
  const flagged = records.filter((record) => record.failures.length > 0).length;
  const allScores = records.flatMap((record) => Object.values(record.scores)).filter((score): score is number => score !== null);
  const overall = allScores.length ? (allScores.reduce((sum, score) => sum + score, 0) / allScores.length).toFixed(1) : '—';
  const markdown = useMemo(() => buildMarkdown(records), [records]);

  function updateActive(patch: Partial<WaterlineRecord>) {
    setRecords((current) => current.map((record) => record.id === activeId ? { ...record, ...patch } : record));
    setCopyState('idle');
  }

  function updateScore(key: ScoreKey, value: number | null) {
    setRecords((current) => current.map((record) => {
      if (record.id !== activeId) return record;
      const scores = { ...record.scores, [key]: value };
      const complete = Object.values(scores).every((score) => score !== null);
      return { ...record, scores, status: complete ? 'reviewed' : value !== null && record.status === 'untested' ? 'generated' : record.status };
    }));
    setCopyState('idle');
  }

  function toggleFailure(label: string) {
    updateActive({ failures: active.failures.includes(label) ? active.failures.filter((item) => item !== label) : [...active.failures, label] });
  }

  async function copyMarkdown() {
    if (await copyText(markdown)) {
      setCopyState('copied');
      window.setTimeout(() => setCopyState('idle'), 1800);
    } else setCopyState('manual');
  }

  function resetRecords() {
    if (!window.confirm('清空当前浏览器中的 9 格撑伞退水实验记录？此操作无法撤销。')) return;
    setRecords(emptyRecords());
    setActiveId('A01');
    setCopyState('idle');
  }

  return (
    <section className="experiment-record-board waterline-motion-record-board" id="record-desk" aria-label="九格撑伞退水实验记录台">
      <div className="experiment-record-top">
        <div><p className="eyebrow mono">04 / Record desk</p><h2>九格先空着，<br />只记水从哪一帧开始退。</h2></div>
        <div className="experiment-record-intro"><p>每格对应一种提示结构和一个固定动作任务。评分、帧号与备注只保存在当前浏览器，不上传视频、人物或故事素材。</p><span className="mono">{loaded ? '已保存到当前浏览器' : '正在读取本地记录…'}</span></div>
      </div>

      <div className="experiment-record-summary">
        <article><span className="mono">COMPLETE</span><strong>{completed}<i>/9</i></strong><p>四项评分完整</p></article>
        <article><span className="mono">GENERATED</span><strong>{generated}<i>/9</i></strong><p>已有真实视频</p></article>
        <article><span className="mono">AVG SCORE</span><strong>{overall}<i>/5</i></strong><p>{allScores.length ? `${allScores.length} 个有效分数` : '尚无真实评分'}</p></article>
        <article><span className="mono">FLAGGED</span><strong>{flagged}</strong><p>记录了失败标签</p></article>
      </div>

      <div className="experiment-record-workspace">
        <div className="experiment-contact-sheet">
          <div className="waterline-motion-diagram" aria-label="红伞完全撑开后，斜水线从左前方向右后方连续退去"><span className="mono">LOCK UMBRELLA → MOVE WATERLINE</span><div className="waterline-record-umbrella"><i /><b /></div><div className="waterline-record-level"><i /><i /><i /><i /><i /></div><strong className="mono">0% · 25% · 50% · 75% · 100%</strong></div>
          <div className="experiment-record-filters"><div aria-label="按提示结构筛选">{(['ALL', 'A', 'B', 'C'] as const).map((group) => <button type="button" className={groupFilter === group ? 'is-active' : ''} onClick={() => setGroupFilter(group)} key={group}>{group === 'ALL' ? '全部组' : `${group} 组`}</button>)}</div><span className="mono">A 一句 · B 因果链 · C 加端点</span></div>
          <div className="experiment-contact-grid rain-record-grid waterline-record-grid">
            {records.map((record) => {
              const recordAverage = average(record);
              return <button type="button" key={record.id} className={`record-cell status-${record.status} ${activeId === record.id ? 'is-active' : ''} ${groupFilter === 'ALL' || groupFilter === record.group ? '' : 'is-muted'}`} onClick={() => setActiveId(record.id)} aria-label={`${record.id} ${record.task}，${statusLabels[record.status]}`}><span className="mono">{record.group}</span><b>{record.id.slice(1)}</b><i>{recordAverage === null ? '—' : recordAverage.toFixed(1)}</i></button>;
            })}
          </div>
          <div className="reference-task-key rain-task-key">{tasks.map((task, index) => <span key={task}><b>{String(index + 1).padStart(2, '0')}</b>{task}</span>)}</div>
          <div className="experiment-record-legend mono"><span><i className="status-untested" />待执行</span><span><i className="status-generated" />已生成</span><span><i className="status-reviewed" />已评估</span></div>
        </div>

        <form className="experiment-record-editor" onSubmit={(event) => event.preventDefault()}>
          <header><div><span className="mono">GROUP {active.group} · CELL</span><strong>{active.id}</strong></div><label><span className="mono">当前状态</span><select value={active.status} onChange={(event) => updateActive({ status: event.target.value as RecordStatus })}><option value="untested">待执行</option><option value="generated">已生成</option><option value="reviewed">已评估</option></select></label></header>
          <div className="reference-active-task"><span className="mono">FIXED MOTION TASK</span><strong>{active.task}</strong></div>
          <div className="experiment-record-meta"><label><span>模型 / 版本 / 制作入口</span><input value={active.model} onChange={(event) => updateActive({ model: event.target.value })} placeholder="执行当天填写真实模型版本" /></label><label><span>Seed / 固定参数</span><input value={active.seed} onChange={(event) => updateActive({ seed: event.target.value })} placeholder="不支持则写“不支持”" /></label><label><span>结果文件 / 链接</span><input value={active.asset} onChange={(event) => updateActive({ asset: event.target.value })} placeholder={`例：${active.id}.mp4`} /></label><label><span>伞锁定帧 / 水首动帧</span><span className="waterline-frame-inputs"><input value={active.lockFrame} onChange={(event) => updateActive({ lockFrame: event.target.value })} placeholder="例：F42" /><input value={active.waterStartFrame} onChange={(event) => updateActive({ waterStartFrame: event.target.value })} placeholder="例：F47" /></span></label></div>
          <fieldset className="experiment-score-fields"><legend className="mono">人工评分 · 1 差 / 5 稳定</legend>{scoreLabels.map(({ key, label, hint }) => <div className="experiment-score-row" key={key}><div><strong>{label}</strong><small>{hint}</small></div><div><button type="button" className={active.scores[key] === null ? 'is-active' : ''} onClick={() => updateScore(key, null)} aria-label={`${label}未评分`}>—</button>{[1, 2, 3, 4, 5].map((score) => <button type="button" className={active.scores[key] === score ? 'is-active' : ''} onClick={() => updateScore(key, score)} aria-label={`${label}${score}分`} key={score}>{score}</button>)}</div></div>)}</fieldset>
          <fieldset className="experiment-failure-fields"><legend className="mono">失败标签 · 可多选</legend><div>{failureOptions.map((label) => <button type="button" className={active.failures.includes(label) ? 'is-active' : ''} onClick={() => toggleFailure(label)} aria-pressed={active.failures.includes(label)} key={label}>{label}</button>)}</div></fieldset>
          <label className="experiment-record-note"><span>五点水线观察</span><textarea value={active.note} onChange={(event) => updateActive({ note: event.target.value })} placeholder="记录 0 / 25 / 50 / 75 / 100%：伞是否锁定、水线坐标、人物与书架是否稳定，以及错误最早出现在哪一帧。" /></label>
        </form>
      </div>

      <div className="experiment-record-export"><div><span className="mono">LOCAL EXPORT</span><strong>伞锁定帧与水首动帧分开记录。</strong><p>复制 Markdown 时保留九格编号、两类帧号、四项评分和失败标签；空白格不会被包装成实验结果。</p></div><div className="experiment-export-actions"><button type="button" onClick={copyMarkdown}>{copyState === 'copied' ? '已复制实验记录 ✓' : copyState === 'manual' ? '请在下方手动复制 ↓' : '复制 Markdown 记录 ↗'}</button><button type="button" className="experiment-reset-button" onClick={resetRecords}>清空本地记录</button></div>{copyState === 'manual' && <textarea readOnly value={markdown} aria-label="手动复制撑伞退水实验记录" onFocus={(event) => event.currentTarget.select()} />}</div>
    </section>
  );
}
