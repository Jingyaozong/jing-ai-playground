'use client';

import { useEffect, useMemo, useState } from 'react';
import { RecordEvidenceReminder } from './record-evidence-reminder';
import { localExportNotice, localExportEvidenceSummary, markdownTableRow } from '../data/experiment-export-boundary';
import { LocalRecordBoundary } from './local-record-boundary';

type RecordStatus = 'untested' | 'generated' | 'reviewed';
type Group = 'A' | 'B' | 'C';
type ScoreKey = 'direction' | 'response' | 'exposure' | 'temperature';

type LightingRecord = {
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

const storageKey = 'jing-experiment-lighting-continuity-v1';
const groups: Array<{ code: Group; label: string }> = [
  { code: 'A', label: '氛围词' },
  { code: 'B', label: '坐标账本' },
  { code: 'C', label: '账本 + 首帧' },
];
const tasks = ['建立镜头', '人物转头', '信纸特写', '反向机位'];
const scoreLabels: Array<{ key: ScoreKey; label: string; hint: string }> = [
  { key: 'direction', label: '光源方向', hint: '北窗与桌灯是否仍在现实空间的原位置' },
  { key: 'response', label: '主体受光', hint: '脸、手、信纸、眼神光与影子是否共同响应' },
  { key: 'exposure', label: '曝光层级', hint: '主光、补光、实景灯与暗部关系是否稳定' },
  { key: 'temperature', label: '色温关系', hint: '冷窗与暖灯的相对分工是否连续' },
];
const failureOptions = ['主光翻面', '阴影重置', '曝光跳动', '色温跳变', '灯具漂移', '关系丢失', '眼神光增殖', '其他'];
const statusLabels: Record<RecordStatus, string> = { untested: '待执行', generated: '已生成', reviewed: '已评估' };

function emptyRecords(): LightingRecord[] {
  return groups.flatMap((group) => tasks.map((task, index) => ({
    id: `${group.code}${String(index + 1).padStart(2, '0')}`,
    group: group.code,
    task,
    status: 'untested' as const,
    model: '',
    seed: '',
    asset: '',
    scores: { direction: null, response: null, exposure: null, temperature: null },
    failures: [],
    note: '',
  })));
}

function isComplete(record: LightingRecord) {
  return scoreLabels.every(({ key }) => record.scores[key] !== null);
}

function average(record: LightingRecord) {
  const scores = Object.values(record.scores).filter((score): score is number => score !== null);
  return scores.length ? scores.reduce((sum, score) => sum + score, 0) / scores.length : null;
}

function buildMarkdown(records: LightingRecord[]) {
  const groupSummary = groups.flatMap((group) => {
    const rows = records.filter((record) => record.group === group.code);
    return [`### ${group.code} · ${group.label}`, ...scoreLabels.map(({ key, label }) => {
      const values = rows.map((record) => record.scores[key]).filter((value): value is number => value !== null);
      return `- ${label}：${values.length ? (values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2) : '—'} / 5（${values.length} 个有效评分）`;
    }), ''];
  });
  const rows = records.map((record) => markdownTableRow([record.id, record.task, statusLabels[record.status], record.model, record.seed, record.asset, record.scores.direction, record.scores.response, record.scores.exposure, record.scores.temperature, record.failures.join('、'), record.note]));
  return [
    '# 同一盏灯换机位后还能保持方向吗？｜12 格实验记录', '',
    localExportNotice, '', localExportEvidenceSummary(records), '',
    '> A 氛围词、B 世界坐标账本、C 账本加首帧。空白项不进入平均分；本机记录不代表模型排名。', '',
    '## 固定世界坐标', '',
    '- 北侧窗户：偏冷高位主光',
    '- 桌面低位灯：偏暖局部光',
    '- 摄影机：C1—C4 换位；灯位不动', '',
    '## 分组平均', '', ...groupSummary,
    '## 样本明细', '',
    '| 编号 | 固定镜头任务 | 状态 | 模型 / 版本 | Seed | 结果文件 | 方向 | 受光 | 曝光 | 色温 | 失败标签 | 观察备注 |',
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

export function LightingContinuityBoard() {
  const [records, setRecords] = useState<LightingRecord[]>(emptyRecords);
  const [activeId, setActiveId] = useState('A01');
  const [groupFilter, setGroupFilter] = useState<'ALL' | Group>('ALL');
  const [loaded, setLoaded] = useState(false);
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'manual'>('idle');

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved) as LightingRecord[];
          if (Array.isArray(parsed) && parsed.length === 12) setRecords(parsed);
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

  function updateActive(patch: Partial<LightingRecord>) {
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
    if (!window.confirm('清空当前浏览器中的 12 格光线连续性实验记录？此操作无法撤销。')) return;
    setRecords(emptyRecords());
    setActiveId('A01');
    setCopyState('idle');
  }

  return (
    <section className="experiment-record-board lighting-record-board" id="record-desk" aria-label="十二格光线连续性实验记录台">
      <div className="experiment-record-top">
        <div><p className="eyebrow mono">04 / Record desk</p><h2>十二格先空着，<br />只记灯从哪边来。</h2></div>
        <div className="experiment-record-intro"><p>每格对应一种光线输入条件和一个固定镜头任务。评分、文件名与备注只保存在当前浏览器，不上传任何素材。</p><span className="mono">{loaded ? '已保存到当前浏览器' : '正在读取本地记录…'}</span></div>
      </div>

      <div className="experiment-record-summary">
        <article><span className="mono">COMPLETE</span><strong>{completed}<i>/12</i></strong><p>四项评分完整</p></article>
        <article><span className="mono">GENERATED</span><strong>{generated}<i>/12</i></strong><p>本机标记为已有输出</p></article>
        <article><span className="mono">AVG SCORE</span><strong>{overall}<i>/5</i></strong><p>{allScores.length ? `${allScores.length} 个有效分数` : '尚无真实评分'}</p></article>
        <article><span className="mono">FLAGGED</span><strong>{flagged}</strong><p>记录了失败标签</p></article>
      </div>

      <LocalRecordBoundary loaded={loaded} markedCount={generated} />
      <div className="experiment-record-workspace">
        <div className="experiment-contact-sheet">
          <div className="light-axis-diagram" aria-label="固定北窗冷光、桌灯暖光与四个可变摄影机位示意">
            <span className="mono">NORTH WINDOW · COOL KEY</span><div className="light-axis-window" /><div className="light-axis-beam beam-one" /><div className="light-axis-beam beam-two" /><b>S<small className="mono">SUBJECT</small></b><i>●<small className="mono">WARM PRACTICAL</small></i>{['C1', 'C2', 'C3', 'C4'].map((camera) => <em className={`axis-${camera.toLowerCase()}`} key={camera}>{camera}</em>)}<strong className="mono">WORLD FIXED / SCREEN CHANGES</strong>
          </div>
          <div className="experiment-record-filters"><div aria-label="按光线输入条件筛选">{(['ALL', 'A', 'B', 'C'] as const).map((group) => <button type="button" className={groupFilter === group ? 'is-active' : ''} onClick={() => setGroupFilter(group)} key={group}>{group === 'ALL' ? '全部组' : `${group} 组`}</button>)}</div><span className="mono">A 氛围 · B 坐标 · C 首帧</span></div>
          <div className="experiment-contact-grid reference-record-grid lighting-record-grid">
            {records.map((record) => {
              const recordAverage = average(record);
              return <button type="button" key={record.id} className={`record-cell status-${record.status} ${activeId === record.id ? 'is-active' : ''} ${groupFilter === 'ALL' || groupFilter === record.group ? '' : 'is-muted'}`} onClick={() => setActiveId(record.id)} aria-label={`${record.id} ${record.task}，${statusLabels[record.status]}`}><span className="mono">{record.group}</span><b>{record.id.slice(1)}</b><i>{recordAverage === null ? '—' : recordAverage.toFixed(1)}</i></button>;
            })}
          </div>
          <div className="reference-task-key lighting-task-key">{tasks.map((task, index) => <span key={task}><b>{String(index + 1).padStart(2, '0')}</b>{task}</span>)}</div>
          <div className="experiment-record-legend mono"><span><i className="status-untested" />待执行</span><span><i className="status-generated" />已生成</span><span><i className="status-reviewed" />已评估</span></div>
        </div>

        <form className="experiment-record-editor" onSubmit={(event) => event.preventDefault()}>
          <header><div><span className="mono">GROUP {active.group} · CELL</span><strong>{active.id}</strong></div><label><span className="mono">当前状态</span><select value={active.status} onChange={(event) => updateActive({ status: event.target.value as RecordStatus })}><option value="untested">待执行</option><option value="generated">已生成</option><option value="reviewed">已评估</option></select></label></header>
          <div className="reference-active-task"><span className="mono">FIXED SHOT TASK</span><strong>{active.task}</strong></div>
          <RecordEvidenceReminder status={active.status} asset={active.asset} />
          <div className="experiment-record-meta"><label><span>模型 / 版本 / 入口</span><input value={active.model} onChange={(event) => updateActive({ model: event.target.value })} placeholder="执行当天填写真实版本" /></label><label><span>Seed / 固定参数</span><input value={active.seed} onChange={(event) => updateActive({ seed: event.target.value })} placeholder="不支持则写“不支持”" /></label><label><span>结果文件 / 链接</span><input value={active.asset} onChange={(event) => updateActive({ asset: event.target.value })} placeholder={`例：${active.id}.mp4`} /></label></div>
          <fieldset className="experiment-score-fields"><legend className="mono">人工评分 · 1 差 / 5 稳定</legend>{scoreLabels.map(({ key, label, hint }) => <div className="experiment-score-row" key={key}><div><strong>{label}</strong><small>{hint}</small></div><div><button type="button" className={active.scores[key] === null ? 'is-active' : ''} onClick={() => updateScore(key, null)} aria-label={`${label}未评分`}>—</button>{[1, 2, 3, 4, 5].map((score) => <button type="button" className={active.scores[key] === score ? 'is-active' : ''} onClick={() => updateScore(key, score)} aria-label={`${label}${score}分`} key={score}>{score}</button>)}</div></div>)}</fieldset>
          <fieldset className="experiment-failure-fields"><legend className="mono">失败标签 · 可多选</legend><div>{failureOptions.map((label) => <button type="button" className={active.failures.includes(label) ? 'is-active' : ''} onClick={() => toggleFailure(label)} aria-pressed={active.failures.includes(label)} key={label}>{label}</button>)}</div></fieldset>
          <label className="experiment-record-note"><span>五点观察备注</span><textarea value={active.note} onChange={(event) => updateActive({ note: event.target.value })} placeholder="记录 0 / 25 / 50 / 75 / 100%：从哪一点开始翻面、重置或跳变。" /></label>
        </form>
      </div>

      <div className="experiment-record-export"><div><span className="mono">LOCAL EXPORT</span><strong>灯位和调色分开记，空白不算结果。</strong><p>复制完整 Markdown 时，未执行样本保留为“—”；分组平均只使用实际填写的分数。</p></div><div className="experiment-export-actions"><button type="button" onClick={copyMarkdown}>{copyState === 'copied' ? '已复制实验记录 ✓' : copyState === 'manual' ? '请在下方手动复制 ↓' : '复制 Markdown 记录 ↗'}</button><button type="button" className="experiment-reset-button" onClick={resetRecords}>清空本地记录</button></div>{copyState === 'manual' && <textarea readOnly value={markdown} aria-label="手动复制光线连续性实验记录" onFocus={(event) => event.currentTarget.select()} />}</div>
    </section>
  );
}
