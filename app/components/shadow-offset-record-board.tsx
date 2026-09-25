'use client';

import { useEffect, useMemo, useState } from 'react';
import { localExportNotice, localExportEvidenceSummary } from '../data/experiment-export-boundary';
import { LocalRecordBoundary } from './local-record-boundary';

type RecordStatus = 'untested' | 'generated' | 'reviewed';
type Group = 'A' | 'B' | 'C';
type ScoreKey = 'bodyLock' | 'shadowMotion' | 'lightLogic' | 'continuity';

type ShadowRecord = {
  id: string;
  group: Group;
  task: string;
  status: RecordStatus;
  model: string;
  seed: string;
  asset: string;
  scores: Record<ScoreKey, number | null>;
  failures: string[];
  note: string;
};

const storageKey = 'jing-experiment-shadow-offset-v2';
const groups: Array<{ code: Group; label: string }> = [
  { code: 'A', label: '直接描述' },
  { code: 'B', label: '动作账本' },
  { code: 'C', label: '分层合成' },
];
const tasks = ['影子独自抬手', '影子停顿改道', '影子重新贴合'];
const scoreLabels: Array<{ key: ScoreKey; label: string; hint: string }> = [
  { key: 'bodyLock', label: '实体静止', hint: '人物身体、脚位、表情和服装是否真的没有跟着动' },
  { key: 'shadowMotion', label: '影子独立', hint: '只有单一影子完成指定动作，路径与节拍是否清楚' },
  { key: 'lightLogic', label: '光学关系', hint: '影子根部、方向、软硬和长度是否仍属于原来的灯位' },
  { key: 'continuity', label: '时间连续', hint: '0 / 25 / 50 / 75 / 100% 五点是否没有分叉、跳帧或重置' },
];
const failureOptions = ['实体同步动作', '出现第二人物', '影子分叉', '影子脱离脚底', '光向翻转', '影长跳变', '动作回弹', '背景变形', '合成边缘穿帮', '其他'];
const statusLabels: Record<RecordStatus, string> = { untested: '待执行', generated: '已生成', reviewed: '已评估' };

function emptyRecords(): ShadowRecord[] {
  return groups.flatMap((group) => tasks.map((task, index) => ({
    id: `${group.code}${String(index + 1).padStart(2, '0')}`,
    group: group.code,
    task,
    status: 'untested' as const,
    model: '',
    seed: '',
    asset: '',
    scores: { bodyLock: null, shadowMotion: null, lightLogic: null, continuity: null },
    failures: [],
    note: '',
  })));
}

function isComplete(record: ShadowRecord) {
  return scoreLabels.every(({ key }) => record.scores[key] !== null);
}

function average(record: ShadowRecord) {
  const scores = Object.values(record.scores).filter((score): score is number => score !== null);
  return scores.length ? scores.reduce((sum, score) => sum + score, 0) / scores.length : null;
}

function buildMarkdown(records: ShadowRecord[]) {
  const groupSummary = groups.flatMap((group) => {
    const rows = records.filter((record) => record.group === group.code);
    return [`### ${group.code} · ${group.label}`, ...scoreLabels.map(({ key, label }) => {
      const values = rows.map((record) => record.scores[key]).filter((value): value is number => value !== null);
      return `- ${label}：${values.length ? (values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2) : '—'} / 5（${values.length} 个有效评分）`;
    }), ''];
  });
  const rows = records.map((record) => `| ${record.id} | ${record.task} | ${statusLabels[record.status]} | ${record.model || '—'} | ${record.seed || '—'} | ${record.asset || '—'} | ${record.scores.bodyLock ?? '—'} | ${record.scores.shadowMotion ?? '—'} | ${record.scores.lightLogic ?? '—'} | ${record.scores.continuity ?? '—'} | ${record.failures.join('、') || '—'} | ${(record.note || '—').replaceAll('|', '\\|').replaceAll('\n', ' ')} |`);
  return [
    '# 影子能否在人物静止时独立行动？｜9 格实验记录', '',
    localExportNotice, '', localExportEvidenceSummary(records), '',
    '> A 直接描述、B 动作账本、C 分层合成。空白项不进入平均分；本机记录不代表模型排名。', '',
    '## 分组平均', '', ...groupSummary,
    '## 样本明细', '',
    '| 编号 | 固定镜头任务 | 状态 | 模型 / 版本 | Seed | 结果文件 | 实体静止 | 影子独立 | 光学关系 | 时间连续 | 失败标签 | 观察备注 |',
    '| --- | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | --- | --- |',
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

export function ShadowOffsetRecordBoard() {
  const [records, setRecords] = useState<ShadowRecord[]>(emptyRecords);
  const [activeId, setActiveId] = useState('A01');
  const [groupFilter, setGroupFilter] = useState<'ALL' | Group>('ALL');
  const [loaded, setLoaded] = useState(false);
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'manual'>('idle');

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved) as ShadowRecord[];
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
    try { window.localStorage.setItem(storageKey, JSON.stringify(records)); } catch { /* Keep the worksheet usable without storage. */ }
  }, [loaded, records]);

  const active = records.find((record) => record.id === activeId) ?? records[0];
  const generated = records.filter((record) => record.status !== 'untested').length;
  const completed = records.filter(isComplete).length;
  const flagged = records.filter((record) => record.failures.length > 0).length;
  const allScores = records.flatMap((record) => Object.values(record.scores)).filter((score): score is number => score !== null);
  const overall = allScores.length ? (allScores.reduce((sum, score) => sum + score, 0) / allScores.length).toFixed(1) : '—';
  const markdown = useMemo(() => buildMarkdown(records), [records]);

  function updateActive(patch: Partial<ShadowRecord>) {
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
    if (!window.confirm('清空当前浏览器中的 9 格影子错位实验记录？此操作无法撤销。')) return;
    setRecords(emptyRecords());
    setActiveId('A01');
    setCopyState('idle');
  }

  return (
    <section className="experiment-record-board shadow-offset-record-board" id="record-desk" aria-label="九格影子错位实验记录台">
      <div className="experiment-record-top">
        <div><p className="eyebrow mono">04 / Record desk</p><h2>九格先空着，<br />只记是谁先动。</h2></div>
        <div className="experiment-record-intro"><p>每格对应一种制作条件和一个固定影子任务。评分、文件名与备注只保存在当前浏览器，不上传视频或角色素材。</p><span className="mono">{loaded ? '已保存到当前浏览器' : '正在读取本地记录…'}</span></div>
      </div>

      <div className="experiment-record-summary">
        <article><span className="mono">COMPLETE</span><strong>{completed}<i>/9</i></strong><p>四项评分完整</p></article>
        <article><span className="mono">GENERATED</span><strong>{generated}<i>/9</i></strong><p>本机标记为已有输出</p></article>
        <article><span className="mono">AVG SCORE</span><strong>{overall}<i>/5</i></strong><p>{allScores.length ? `${allScores.length} 个有效分数` : '尚无真实评分'}</p></article>
        <article><span className="mono">FLAGGED</span><strong>{flagged}</strong><p>记录了失败标签</p></article>
      </div>

      <LocalRecordBoundary loaded={loaded} markedCount={generated} />
      <div className="experiment-record-workspace">
        <div className="experiment-contact-sheet">
          <div className="shadow-offset-diagram" aria-label="实体人物停在原点，影子沿虚线提前五分钟移动的示意图"><span className="mono">BODY LOCKED / SHADOW +05:00</span><div className="shadow-diagram-body"><i /><b /></div><div className="shadow-diagram-cast"><i /><b /></div><em /><strong className="mono">ONE LIGHT · TWO TIMINGS</strong></div>
          <div className="experiment-record-filters"><div aria-label="按制作条件筛选">{(['ALL', 'A', 'B', 'C'] as const).map((group) => <button type="button" className={groupFilter === group ? 'is-active' : ''} onClick={() => setGroupFilter(group)} key={group}>{group === 'ALL' ? '全部组' : `${group} 组`}</button>)}</div><span className="mono">A 直接 · B 账本 · C 分层</span></div>
          <div className="experiment-contact-grid rain-record-grid shadow-record-grid">
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
          <div className="reference-active-task"><span className="mono">FIXED SHADOW TASK</span><strong>{active.task}</strong></div>
          <div className="experiment-record-meta"><label><span>模型 / 版本 / 制作入口</span><input value={active.model} onChange={(event) => updateActive({ model: event.target.value })} placeholder={active.group === 'C' ? '记录生成与合成软件版本' : '执行当天填写真实模型版本'} /></label><label><span>Seed / 固定参数</span><input value={active.seed} onChange={(event) => updateActive({ seed: event.target.value })} placeholder="不支持则写“不支持”" /></label><label><span>结果文件 / 链接</span><input value={active.asset} onChange={(event) => updateActive({ asset: event.target.value })} placeholder={`例：${active.id}.mp4`} /></label></div>
          <fieldset className="experiment-score-fields"><legend className="mono">人工评分 · 1 差 / 5 稳定</legend>{scoreLabels.map(({ key, label, hint }) => <div className="experiment-score-row" key={key}><div><strong>{label}</strong><small>{hint}</small></div><div><button type="button" className={active.scores[key] === null ? 'is-active' : ''} onClick={() => updateScore(key, null)} aria-label={`${label}未评分`}>—</button>{[1, 2, 3, 4, 5].map((score) => <button type="button" className={active.scores[key] === score ? 'is-active' : ''} onClick={() => updateScore(key, score)} aria-label={`${label}${score}分`} key={score}>{score}</button>)}</div></div>)}</fieldset>
          <fieldset className="experiment-failure-fields"><legend className="mono">失败标签 · 可多选</legend><div>{failureOptions.map((label) => <button type="button" className={active.failures.includes(label) ? 'is-active' : ''} onClick={() => toggleFailure(label)} aria-pressed={active.failures.includes(label)} key={label}>{label}</button>)}</div></fieldset>
          <label className="experiment-record-note"><span>五点观察备注</span><textarea value={active.note} onChange={(event) => updateActive({ note: event.target.value })} placeholder="记录 0 / 25 / 50 / 75 / 100%：实体从哪一帧开始跟动，影子在哪里分叉、跳变或脱离脚底。" /></label>
        </form>
      </div>

      <div className="experiment-record-export"><div><span className="mono">LOCAL EXPORT</span><strong>实体和影子分开评分，空白不算结果。</strong><p>复制 Markdown 时保留九格编号与失败标签；分组平均只使用实际填写的分数。</p></div><div className="experiment-export-actions"><button type="button" onClick={copyMarkdown}>{copyState === 'copied' ? '已复制实验记录 ✓' : copyState === 'manual' ? '请在下方手动复制 ↓' : '复制 Markdown 记录 ↗'}</button><button type="button" className="experiment-reset-button" onClick={resetRecords}>清空本地记录</button></div>{copyState === 'manual' && <textarea readOnly value={markdown} aria-label="手动复制影子错位实验记录" onFocus={(event) => event.currentTarget.select()} />}</div>
    </section>
  );
}
