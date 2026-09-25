'use client';

import { useEffect, useMemo, useState } from 'react';
import { localExportNotice, localExportEvidenceSummary, markdownTableRow } from '../data/experiment-export-boundary';
import { LocalRecordBoundary } from './local-record-boundary';

type RecordStatus = 'untested' | 'generated' | 'reviewed';
type Group = 'A' | 'B' | 'C';
type ScoreKey = 'umbrellaIntegrity' | 'causalOrder' | 'waterDirection' | 'worldContinuity';
type CheckpointPoint = '0%' | '25%' | '50%' | '75%' | '100%';

type WaterlineCheckpoint = {
  point: CheckpointPoint;
  frame: string;
  umbrella: string;
  waterline: string;
};

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
  checkpoints: WaterlineCheckpoint[];
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
const checkpointPoints: CheckpointPoint[] = ['0%', '25%', '50%', '75%', '100%'];
const scoreLabels: Array<{ key: ScoreKey; label: string; hint: string }> = [
  { key: 'umbrellaIntegrity', label: '红伞完整', hint: '始终只有一把伞；伞柄、伞骨、伞盖与手位连续可信' },
  { key: 'causalOrder', label: '因果顺序', hint: '伞骨完全锁定以后，水线才出现第一次位移' },
  { key: 'waterDirection', label: '水线方向', hint: '水线从左前到右后单调后退，不倒流、分叉或随机消失' },
  { key: 'worldContinuity', label: '世界连续', hint: '人物、书架、书页、木地板与出口在退水过程中保持稳定' },
];
const failureOptions = ['水提前后退', '伞水同时动作', '顺序倒置', '伞复制或变形', '手穿过伞柄', '水线倒流', '水线分叉', '局部随机消失', '人物身份漂移', '书架或地板融化', '隐性切镜', '其他'];
const statusLabels: Record<RecordStatus, string> = {
  untested: '待执行 · 无视频',
  generated: '有视频 · 待验收',
  reviewed: '已验收 · 有视频',
};

function emptyCheckpoints(): WaterlineCheckpoint[] {
  return checkpointPoints.map((point) => ({ point, frame: '', umbrella: '', waterline: '' }));
}

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
    checkpoints: emptyCheckpoints(),
    scores: { umbrellaIntegrity: null, causalOrder: null, waterDirection: null, worldContinuity: null },
    failures: [],
    note: '',
  })));
}

function normalizeRecords(value: unknown): WaterlineRecord[] {
  const defaults = emptyRecords();
  if (!Array.isArray(value)) return defaults;
  return defaults.map((fallback) => {
    const saved = value.find((item) => item && typeof item === 'object' && 'id' in item && item.id === fallback.id) as Partial<WaterlineRecord> | undefined;
    if (!saved) return fallback;
    const checkpoints = checkpointPoints.map((point) => {
      const checkpoint = Array.isArray(saved.checkpoints) ? saved.checkpoints.find((item) => item?.point === point) : undefined;
      return {
        point,
        frame: typeof checkpoint?.frame === 'string' ? checkpoint.frame : '',
        umbrella: typeof checkpoint?.umbrella === 'string' ? checkpoint.umbrella : '',
        waterline: typeof checkpoint?.waterline === 'string' ? checkpoint.waterline : '',
      };
    });
    const scores = Object.fromEntries(scoreLabels.map(({ key }) => {
      const score = saved.scores?.[key];
      return [key, typeof score === 'number' && score >= 1 && score <= 5 ? score : null];
    })) as Record<ScoreKey, number | null>;
    return {
      ...fallback,
      status: saved.status === 'generated' || saved.status === 'reviewed' ? saved.status : 'untested',
      model: typeof saved.model === 'string' ? saved.model : '',
      seed: typeof saved.seed === 'string' ? saved.seed : '',
      asset: typeof saved.asset === 'string' ? saved.asset : '',
      lockFrame: typeof saved.lockFrame === 'string' ? saved.lockFrame : '',
      waterStartFrame: typeof saved.waterStartFrame === 'string' ? saved.waterStartFrame : '',
      checkpoints,
      scores,
      failures: Array.isArray(saved.failures) ? saved.failures.filter((item): item is string => typeof item === 'string') : [],
      note: typeof saved.note === 'string' ? saved.note : '',
    };
  });
}

function isComplete(record: WaterlineRecord) {
  return record.status === 'reviewed' && scoreLabels.every(({ key }) => record.scores[key] !== null);
}

function average(record: WaterlineRecord) {
  if (record.status === 'untested') return null;
  const scores = Object.values(record.scores).filter((score): score is number => score !== null);
  return scores.length ? scores.reduce((sum, score) => sum + score, 0) / scores.length : null;
}

function buildMarkdown(records: WaterlineRecord[]) {
  const groupSummary = groups.flatMap((group) => {
    const rows = records.filter((record) => record.group === group.code && record.status !== 'untested');
    return [`### ${group.code} · ${group.label}`, ...scoreLabels.map(({ key, label }) => {
      const values = rows.map((record) => record.scores[key]).filter((value): value is number => value !== null);
      return `- ${label}：${values.length ? (values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2) : '—'} / 5（${values.length} 个有效评分）`;
    }), ''];
  });
  const rows = records.map((record) => markdownTableRow([record.id, record.task, statusLabels[record.status], record.model, record.seed, record.asset, record.lockFrame, record.waterStartFrame, record.scores.umbrellaIntegrity, record.scores.causalOrder, record.scores.waterDirection, record.scores.worldContinuity, record.failures.join('、'), record.note]));
  const checkpointSections = records.flatMap((record) => [
    `### ${record.id} · ${record.task} · ${statusLabels[record.status]}`,
    '',
    '| 时间点 | 真实帧号 | 红伞状态 | 水线位置 / 世界状态 |',
    '| --- | --- | --- | --- |',
    ...record.checkpoints.map((checkpoint) => markdownTableRow([checkpoint.point, checkpoint.frame, checkpoint.umbrella, checkpoint.waterline])),
    '',
  ]);
  return [
    '# 撑伞以后，水面能沿一个方向连续退去吗？｜9 格实验记录', '',
    localExportNotice, '', localExportEvidenceSummary(records), '',
    '> A 一句动作描述、B 因果状态链、C 状态链加空间端点。空白项不进入平均分；静态概念帧不算视频结果。', '',
    '## 分组平均', '', ...groupSummary,
    '## 样本明细', '',
    '| 编号 | 固定任务 | 视频状态 | 模型 / 版本 | Seed | 结果文件 | 伞锁定帧 | 水首动帧 | 红伞完整 | 因果顺序 | 水线方向 | 世界连续 | 失败标签 | 补充观察 |',
    '| --- | --- | --- | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | --- | --- |',
    ...rows, '',
    '## 五点逐帧账本', '',
    ...checkpointSections,
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
          setRecords(normalizeRecords(JSON.parse(saved)));
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
  const allScores = records.filter((record) => record.status !== 'untested').flatMap((record) => Object.values(record.scores)).filter((score): score is number => score !== null);
  const overall = allScores.length ? (allScores.reduce((sum, score) => sum + score, 0) / allScores.length).toFixed(1) : '—';
  const markdown = useMemo(() => buildMarkdown(records), [records]);

  function updateActive(patch: Partial<WaterlineRecord>) {
    setRecords((current) => current.map((record) => record.id === activeId ? { ...record, ...patch } : record));
    setCopyState('idle');
  }

  function updateScore(key: ScoreKey, value: number | null) {
    if (active.status === 'untested') return;
    setRecords((current) => current.map((record) => {
      if (record.id !== activeId) return record;
      const scores = { ...record.scores, [key]: value };
      return { ...record, scores };
    }));
    setCopyState('idle');
  }

  function updateCheckpoint(point: CheckpointPoint, field: 'frame' | 'umbrella' | 'waterline', value: string) {
    updateActive({ checkpoints: active.checkpoints.map((checkpoint) => checkpoint.point === point ? { ...checkpoint, [field]: value } : checkpoint) });
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
        <div><p className="eyebrow mono">04 / Record desk</p><h2><span>从一帧开始，</span><span>把观察留下来。</span></h2></div>
        <div className="experiment-record-intro"><p>每格对应一种提示结构和一个固定动作任务。评分、帧号与备注只保存在当前浏览器，不上传视频、人物或故事素材。</p><span className="mono">{loaded ? '已保存到当前浏览器' : '正在读取本地记录…'}</span></div>
      </div>

      <div className="experiment-record-summary">
        <article><span className="mono">REVIEWED</span><strong>{completed}<i>/9</i></strong><p>已验收且评分完整</p></article>
        <article><span className="mono">VIDEO</span><strong>{generated}<i>/9</i></strong><p>本机标记为有视频</p></article>
        <article><span className="mono">AVG SCORE</span><strong>{overall}<i>/5</i></strong><p>{allScores.length ? `${allScores.length} 个有效分数` : '尚无真实评分'}</p></article>
        <article><span className="mono">FLAGGED</span><strong>{flagged}</strong><p>记录了失败标签</p></article>
      </div>

      <LocalRecordBoundary loaded={loaded} markedCount={generated} />
      <div className="experiment-record-workspace">
        <div className="experiment-contact-sheet">
          <div className="waterline-desk-guide"><span className="eyebrow mono">SAMPLE INDEX</span><h3>选一个样本</h3><p>先撑伞，再退水，最后组合。<br />每格单独保存观察记录。</p></div>
          <div className="experiment-record-filters"><div aria-label="按提示结构筛选">{(['ALL', 'A', 'B', 'C'] as const).map((group) => <button type="button" className={groupFilter === group ? 'is-active' : ''} onClick={() => setGroupFilter(group)} key={group}>{group === 'ALL' ? '全部组' : `${group} 组`}</button>)}</div><span className="mono">A 一句 · B 因果链 · C 加端点</span></div>
          <div className="experiment-contact-grid rain-record-grid waterline-record-grid">
            {records.map((record) => {
              const recordAverage = average(record);
              return <button type="button" key={record.id} className={`record-cell status-${record.status} ${activeId === record.id ? 'is-active' : ''} ${groupFilter === 'ALL' || groupFilter === record.group ? '' : 'is-muted'}`} onClick={() => setActiveId(record.id)} aria-pressed={activeId === record.id} aria-label={`${record.id} ${record.task}，${statusLabels[record.status]}`}><b>{record.id}</b><i>{recordAverage === null ? '未评分' : `${recordAverage.toFixed(1)} / 5`}</i></button>;
            })}
          </div>
          <div className="reference-task-key rain-task-key">{tasks.map((task, index) => <span key={task}><b>{String(index + 1).padStart(2, '0')}</b>{task}</span>)}</div>
          <div className="experiment-record-legend mono"><span><i className="status-untested" />待执行 · 无视频</span><span><i className="status-generated" />有视频 · 待验收</span><span><i className="status-reviewed" />已验收</span></div>
        </div>

        <form className="experiment-record-editor" onSubmit={(event) => event.preventDefault()}>
          <header><div><span className="mono">GROUP {active.group} · CELL</span><strong>{active.id}</strong></div><label><span className="mono">视频状态</span><select value={active.status} onChange={(event) => updateActive({ status: event.target.value as RecordStatus })}><option value="untested">待执行 · 无视频</option><option value="generated">有视频 · 待验收</option><option value="reviewed">已验收 · 有视频</option></select></label></header>
          <div className="reference-active-task"><span className="mono">FIXED MOTION TASK</span><strong>{active.task}</strong></div>
          <div className="experiment-record-meta"><label><span>模型 / 版本 / 制作入口</span><input value={active.model} onChange={(event) => updateActive({ model: event.target.value })} placeholder="执行当天填写真实模型版本" /></label><label><span>Seed / 固定参数</span><input value={active.seed} onChange={(event) => updateActive({ seed: event.target.value })} placeholder="不支持则写“不支持”" /></label><label><span>结果文件 / 链接</span><input value={active.asset} onChange={(event) => updateActive({ asset: event.target.value })} placeholder={`例：${active.id}.mp4`} /></label><label><span>伞锁定帧 / 水首动帧</span><span className="waterline-frame-inputs"><input value={active.lockFrame} onChange={(event) => updateActive({ lockFrame: event.target.value })} placeholder="例：F42" /><input value={active.waterStartFrame} onChange={(event) => updateActive({ waterStartFrame: event.target.value })} placeholder="例：F47" /></span></label></div>
          <fieldset className="waterline-checkpoint-fields"><legend className="mono">五点逐帧账本 · 只填真实画面</legend><div className="waterline-checkpoint-head mono"><span>时间点</span><span>真实帧号</span><span>红伞状态</span><span>水线 / 世界状态</span></div>{active.checkpoints.map((checkpoint) => <div className="waterline-checkpoint-row" key={checkpoint.point}><strong className="mono">{checkpoint.point}</strong><label><span>真实帧号</span><input value={checkpoint.frame} onChange={(event) => updateCheckpoint(checkpoint.point, 'frame', event.target.value)} placeholder="例：F01" /></label><label><span>红伞状态</span><input value={checkpoint.umbrella} onChange={(event) => updateCheckpoint(checkpoint.point, 'umbrella', event.target.value)} placeholder="合拢 / 展开 / 锁定" /></label><label><span>水线 / 世界状态</span><input value={checkpoint.waterline} onChange={(event) => updateCheckpoint(checkpoint.point, 'waterline', event.target.value)} placeholder="位置、方向与最早错误" /></label></div>)}</fieldset>
          <fieldset className="experiment-score-fields" disabled={active.status === 'untested'}><legend className="mono">人工评分 · 1 差 / 5 稳定</legend>{active.status === 'untested' && <p className="waterline-score-lock">先将视频状态改为“有视频 · 待验收”，再填写真实评分。</p>}{scoreLabels.map(({ key, label, hint }) => <div className="experiment-score-row" key={key}><div><strong>{label}</strong><small>{hint}</small></div><div><button type="button" className={active.scores[key] === null ? 'is-active' : ''} onClick={() => updateScore(key, null)} aria-label={`${label}未评分`}>—</button>{[1, 2, 3, 4, 5].map((score) => <button type="button" className={active.scores[key] === score ? 'is-active' : ''} onClick={() => updateScore(key, score)} aria-label={`${label}${score}分`} key={score}>{score}</button>)}</div></div>)}</fieldset>
          <fieldset className="experiment-failure-fields"><legend className="mono">失败标签 · 可多选</legend><div>{failureOptions.map((label) => <button type="button" className={active.failures.includes(label) ? 'is-active' : ''} onClick={() => toggleFailure(label)} aria-pressed={active.failures.includes(label)} key={label}>{label}</button>)}</div></fieldset>
          <label className="experiment-record-note"><span>补充观察</span><textarea value={active.note} onChange={(event) => updateActive({ note: event.target.value })} placeholder="记录五点账本之外的环境、参数、异常或复核说明。" /></label>
        </form>
      </div>

      <div className="experiment-record-export"><div><span className="mono">LOCAL EXPORT</span><strong>伞锁定帧与水首动帧分开记录。</strong><p>复制 Markdown 时保留九格编号、五点真实帧号、四项评分和失败标签；空白格仍标为“待执行 · 无视频”，不会被包装成实验结果。</p></div><div className="experiment-export-actions"><button type="button" onClick={copyMarkdown}>{copyState === 'copied' ? '已复制实验记录 ✓' : copyState === 'manual' ? '请在下方手动复制 ↓' : '复制 Markdown 记录 ↗'}</button><button type="button" className="experiment-reset-button" onClick={resetRecords}>清空本地记录</button></div>{copyState === 'manual' && <textarea readOnly value={markdown} aria-label="手动复制撑伞退水实验记录" onFocus={(event) => event.currentTarget.select()} />}</div>
    </section>
  );
}
