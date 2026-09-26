'use client';

import { useEffect, useMemo, useState } from 'react';
import { RecordEvidenceReminder } from './record-evidence-reminder';
import { countsAsCompletedRecord, localExportNotice, localExportEvidenceSummary, markdownTableRow } from '../data/experiment-export-boundary';
import { LocalRecordBoundary } from './local-record-boundary';

type RecordStatus = 'untested' | 'generated' | 'reviewed';
type Group = 'A' | 'B' | 'C';
type ScoreKey = 'identity' | 'angle' | 'motion' | 'trace';

type ReferenceRecord = {
  id: string;
  group: Group;
  task: string;
  status: RecordStatus;
  model: string;
  asset: string;
  scores: Record<ScoreKey, number | null>;
  flags: string[];
  note: string;
};

const storageKey = 'jing-experiment-reference-comparison-v1';
const groups: Array<{ code: Group; label: string }> = [{ code: 'A', label: '无参考' }, { code: 'B', label: '单张参考' }, { code: 'C', label: '三张参考' }];
const tasks = ['正面微表情', '侧面回头', '拿取物体', '全身走动'];
const scoreLabels: Array<{ key: ScoreKey; label: string; hint: string }> = [
  { key: 'identity', label: '身份一致性', hint: '整体身份、脸部比例、发型与服装' },
  { key: 'angle', label: '角度 / 构图', hint: '目标景别、侧面信息与主体位置' },
  { key: 'motion', label: '动作完成度', hint: '表情、回头、伸手与行走是否自然' },
  { key: 'trace', label: '参考痕迹控制', hint: '5 分表示没有明显背景、光线或融合伪影' },
];
const flagOptions = ['身份漂移', '角度失真', '动作僵硬', '背景残留', '光线继承', '服装冲突', '多视角融合', '其他'];
const statusLabels: Record<RecordStatus, string> = { untested: '待执行', generated: '已生成', reviewed: '已评估' };

function emptyRecords(): ReferenceRecord[] {
  return groups.flatMap((group) => tasks.map((task, index) => ({
    id: `${group.code}${String(index + 1).padStart(2, '0')}`,
    group: group.code,
    task,
    status: 'untested' as const,
    model: '',
    asset: '',
    scores: { identity: null, angle: null, motion: null, trace: null },
    flags: [],
    note: '',
  })));
}

function isComplete(record: ReferenceRecord) {
  return countsAsCompletedRecord(record.status, record.asset, scoreLabels.map(({ key }) => record.scores[key]));
}

function average(record: ReferenceRecord) {
  const scores = Object.values(record.scores).filter((score): score is number => score !== null);
  return scores.length ? scores.reduce((sum, score) => sum + score, 0) / scores.length : null;
}

function buildMarkdown(records: ReferenceRecord[]) {
  const groupSummary = groups.flatMap((group) => {
    const rows = records.filter((record) => record.group === group.code);
    return [`### ${group.code} · ${group.label}`, ...scoreLabels.map(({ key, label }) => {
      const values = rows.map((record) => record.scores[key]).filter((value): value is number => value !== null);
      return `- ${label}：${values.length ? (values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2) : '—'} / 5（${values.length} 个有效评分）`;
    }), ''];
  });
  const table = records.map((record) => markdownTableRow([record.id, record.task, statusLabels[record.status], record.model, record.asset, record.scores.identity, record.scores.angle, record.scores.motion, record.scores.trace, record.flags.join('、'), record.note]));
  return [
    '# 参考图到底锁住了什么？｜12 格实验记录', '',
    localExportNotice, '', localExportEvidenceSummary(records), '',
    '> A 无参考、B 单张正面参考、C 三张多角度参考。空白项不进入平均分；本表只记录这次实验，不代表模型排名。', '',
    '## 分组平均', '', ...groupSummary,
    '## 样本明细', '',
    '| 编号 | 镜头任务 | 状态 | 模型 / 版本 | 结果文件 | 身份 | 角度 | 动作 | 参考痕迹 | 失败标签 | 观察备注 |',
    '| --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | --- | --- |',
    ...table,
  ].join('\n');
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

export function ReferenceComparisonBoard() {
  const [records, setRecords] = useState<ReferenceRecord[]>(emptyRecords);
  const [activeId, setActiveId] = useState('A01');
  const [groupFilter, setGroupFilter] = useState<'ALL' | Group>('ALL');
  const [loaded, setLoaded] = useState(false);
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'manual'>('idle');

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved) as ReferenceRecord[];
          if (Array.isArray(parsed) && parsed.length === 12) setRecords(parsed);
        }
      } catch {
        // A damaged draft should not block the empty worksheet.
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
  const flagged = records.filter((record) => record.flags.length > 0).length;
  const allScores = records.flatMap((record) => Object.values(record.scores)).filter((score): score is number => score !== null);
  const overall = allScores.length ? (allScores.reduce((sum, score) => sum + score, 0) / allScores.length).toFixed(1) : '—';
  const markdown = useMemo(() => buildMarkdown(records), [records]);

  function updateActive(patch: Partial<ReferenceRecord>) {
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
  function toggleFlag(label: string) {
    updateActive({ flags: active.flags.includes(label) ? active.flags.filter((item) => item !== label) : [...active.flags, label] });
  }
  async function copyMarkdown() {
    if (await copyText(markdown)) { setCopyState('copied'); window.setTimeout(() => setCopyState('idle'), 1800); }
    else setCopyState('manual');
  }
  function resetRecords() {
    if (!window.confirm('清空当前浏览器中的 12 格参考图实验记录？此操作无法撤销。')) return;
    setRecords(emptyRecords()); setActiveId('A01'); setCopyState('idle');
  }

  return (
    <section className="experiment-record-board reference-record-board" id="record-desk" aria-label="十二格参考图对照实验记录台">
      <div className="experiment-record-top">
        <div><p className="eyebrow mono">04 / Record desk</p><h2>十二格先空着，<br />只接收真实结果。</h2></div>
        <div className="experiment-record-intro"><p>每格对应一组参考条件和一个固定镜头任务。评分与备注保存在当前浏览器，不上传任何素材。</p><span className="mono">{loaded ? '已保存到当前浏览器' : '正在读取本地记录…'}</span></div>
      </div>

      <div className="experiment-record-summary">
        <article><span className="mono">COMPLETE</span><strong>{completed}<i>/12</i></strong><p>已复核 · 评分与素材栏齐全</p></article>
        <article><span className="mono">GENERATED</span><strong>{generated}<i>/12</i></strong><p>本机标记为已有输出</p></article>
        <article><span className="mono">AVG SCORE</span><strong>{overall}<i>/5</i></strong><p>{allScores.length ? `${allScores.length} 个有效分数` : '尚无真实评分'}</p></article>
        <article><span className="mono">FLAGGED</span><strong>{flagged}</strong><p>记录了失败标签</p></article>
      </div>

      <LocalRecordBoundary loaded={loaded} markedCount={generated} />
      <div className="experiment-record-workspace">
        <div className="experiment-contact-sheet">
          <div className="experiment-record-filters"><div aria-label="按参考条件筛选">{(['ALL', 'A', 'B', 'C'] as const).map((group) => <button type="button" className={groupFilter === group ? 'is-active' : ''} onClick={() => setGroupFilter(group)} key={group}>{group === 'ALL' ? '全部组' : `${group} 组`}</button>)}</div><span className="mono">A 无参考 · B 单张 · C 三张</span></div>
          <div className="experiment-contact-grid reference-record-grid">
            {records.map((record) => {
              const recordAverage = average(record);
              return <button type="button" key={record.id} className={`record-cell status-${record.status} ${activeId === record.id ? 'is-active' : ''} ${groupFilter === 'ALL' || groupFilter === record.group ? '' : 'is-muted'}`} onClick={() => setActiveId(record.id)} aria-label={`${record.id} ${record.task}，${statusLabels[record.status]}`}><span className="mono">{record.group}</span><b>{record.id.slice(1)}</b><i>{recordAverage === null ? '—' : recordAverage.toFixed(1)}</i></button>;
            })}
          </div>
          <div className="reference-task-key">{tasks.map((task, index) => <span key={task}><b>{String(index + 1).padStart(2, '0')}</b>{task}</span>)}</div>
          <div className="experiment-record-legend mono"><span><i className="status-untested" />待执行</span><span><i className="status-generated" />已生成</span><span><i className="status-reviewed" />已评估</span></div>
        </div>

        <form className="experiment-record-editor" onSubmit={(event) => event.preventDefault()}>
          <header><div><span className="mono">GROUP {active.group} · CELL</span><strong>{active.id}</strong></div><label><span className="mono">当前状态</span><select value={active.status} onChange={(event) => updateActive({ status: event.target.value as RecordStatus })}><option value="untested">待执行</option><option value="generated">已生成</option><option value="reviewed">已评估</option></select></label></header>
          <div className="reference-active-task"><span className="mono">FIXED SHOT TASK</span><strong>{active.task}</strong></div>
          <RecordEvidenceReminder status={active.status} asset={active.asset} />
          <div className="experiment-record-meta"><label><span>模型 / 版本 / 入口</span><input value={active.model} onChange={(event) => updateActive({ model: event.target.value })} placeholder="执行当天填写真实版本" /></label><label><span>结果文件 / 链接</span><input value={active.asset} onChange={(event) => updateActive({ asset: event.target.value })} placeholder={`例：${active.id}.mp4`} /></label></div>
          <fieldset className="experiment-score-fields"><legend className="mono">人工评分 · 1 差 / 5 稳定</legend>{scoreLabels.map(({ key, label, hint }) => <div className="experiment-score-row" key={key}><div><strong>{label}</strong><small>{hint}</small></div><div><button type="button" className={active.scores[key] === null ? 'is-active' : ''} onClick={() => updateScore(key, null)} aria-label={`${label}未评分`}>—</button>{[1,2,3,4,5].map((score) => <button type="button" className={active.scores[key] === score ? 'is-active' : ''} onClick={() => updateScore(key, score)} aria-label={`${label}${score}分`} key={score}>{score}</button>)}</div></div>)}</fieldset>
          <fieldset className="experiment-failure-fields"><legend className="mono">观察标签 · 可多选</legend><div>{flagOptions.map((label) => <button type="button" className={active.flags.includes(label) ? 'is-active' : ''} onClick={() => toggleFlag(label)} aria-pressed={active.flags.includes(label)} key={label}>{label}</button>)}</div></fieldset>
          <label className="experiment-record-note"><span>观察备注</span><textarea value={active.note} onChange={(event) => updateActive({ note: event.target.value })} placeholder="只写看见的现象；不要从单个样本推断普遍结论。" /></label>
        </form>
      </div>

      <div className="experiment-record-export"><div><span className="mono">LOCAL EXPORT</span><strong>三组分开算，空白不计分。</strong><p>复制完整 Markdown 记录时，未执行样本保留为“—”；分组平均只使用实际填写的分数。</p></div><div className="experiment-export-actions"><button type="button" onClick={copyMarkdown}>{copyState === 'copied' ? '已复制实验记录 ✓' : copyState === 'manual' ? '请在下方手动复制 ↓' : '复制 Markdown 记录 ↗'}</button><button type="button" className="experiment-reset-button" onClick={resetRecords}>清空本地记录</button></div>{copyState === 'manual' && <textarea readOnly value={markdown} aria-label="手动复制参考图实验记录" onFocus={(event) => event.currentTarget.select()} />}</div>
    </section>
  );
}
