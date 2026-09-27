'use client';

import { useEffect, useMemo, useState } from 'react';
import { RecordEvidenceReminder } from './record-evidence-reminder';
import { countsAsCompletedRecord, localExportNotice, localExportEvidenceSummary, markdownTableRow } from '../data/experiment-export-boundary';
import { LocalRecordBoundary } from './local-record-boundary';
import { LocalRecordSaveStatus, useLocalRecordSave } from './local-record-save-status';
import { restoreStoryboardDraft } from '../data/storyboard-record-draft';
import { updateRecordScore } from '../data/experiment-record-state';

type RecordStatus = 'untested' | 'generated' | 'reviewed';
type Group = 'A' | 'B' | 'C';
type ScoreKey = 'coverage' | 'causality' | 'shootability' | 'timing';

type StoryboardRecord = {
  id: string;
  group: Group;
  task: string;
  status: RecordStatus;
  model: string;
  asset: string;
  shotCount: string;
  duration: string;
  scores: Record<ScoreKey, number | null>;
  failures: string[];
  note: string;
};

const storageKey = 'jing-experiment-storyboard-audit-v1';
const groups: Array<{ code: Group; label: string }> = [
  { code: 'A', label: '直接拆镜' },
  { code: 'B', label: '固定字段' },
  { code: 'C', label: '先提拍点' },
];
const tasks = ['忘记昨天', '第七码头', '雨停以前'];
const scoreLabels: Array<{ key: ScoreKey; label: string; hint: string }> = [
  { key: 'coverage', label: '拍点覆盖', hint: '人工最低拍点被保留、错并或遗漏了多少' },
  { key: 'causality', label: '因果连续', hint: '事件顺序、空间位置、对白归属和声音触发是否成立' },
  { key: 'shootability', label: '制作明确', hint: '每镜主体、动作、景别、运镜、对白和声音是否可执行' },
  { key: 'timing', label: '时长可用', hint: '单镜秒数与总时长是否完整、合理且可核对' },
];
const failureOptions = ['关键拍点遗漏', '不同拍点错并', '虚构新动作', '因果顺序颠倒', '对白归属错误', '空间跳变', '不可拍的抽象描述', '字段缺失', '总时长不符', '过度切分', '其他'];
const statusLabels: Record<RecordStatus, string> = { untested: '待执行', generated: '已有输出', reviewed: '已审计' };

function emptyRecords(): StoryboardRecord[] {
  return groups.flatMap((group) => tasks.map((task, index) => ({
    id: `${group.code}${String(index + 1).padStart(2, '0')}`,
    group: group.code,
    task,
    status: 'untested' as const,
    model: '',
    asset: '',
    shotCount: '',
    duration: '',
    scores: { coverage: null, causality: null, shootability: null, timing: null },
    failures: [],
    note: '',
  })));
}

function isComplete(record: StoryboardRecord) {
  return countsAsCompletedRecord(record.status, record.asset, scoreLabels.map(({ key }) => record.scores[key]));
}

function average(record: StoryboardRecord) {
  const scores = Object.values(record.scores).filter((score): score is number => score !== null);
  return scores.length ? scores.reduce((sum, score) => sum + score, 0) / scores.length : null;
}

function buildMarkdown(records: StoryboardRecord[]) {
  const groupSummary = groups.flatMap((group) => {
    const rows = records.filter((record) => record.group === group.code);
    return [`### ${group.code} · ${group.label}`, ...scoreLabels.map(({ key, label }) => {
      const values = rows.map((record) => record.scores[key]).filter((value): value is number => value !== null);
      const result = values.length ? (values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2) : '—';
      return `- ${label}：${result} / 5（${values.length} 个有效评分）`;
    }), ''];
  });
  const rows = records.map((record) => markdownTableRow([record.id, record.task, statusLabels[record.status], record.model, record.asset, record.shotCount, record.duration, record.scores.coverage, record.scores.causality, record.scores.shootability, record.scores.timing, record.failures.join('、'), record.note]));
  return [
    '# 自动分镜机，第一次走神｜9 格审计记录', '',
    localExportNotice, '', localExportEvidenceSummary(records), '',
    '> A 直接拆镜、B 固定字段、C 先提拍点再拆镜。空白输出不进入平均分；人工基准只用于检查遗漏，不代表唯一正确答案。', '',
    '## 分组平均', '', ...groupSummary,
    '## 输出明细', '',
    '| 编号 | 固定故事 | 状态 | 模型 / 版本 | 原始输出 | 镜头数 | 总秒数 | 拍点覆盖 | 因果连续 | 制作明确 | 时长可用 | 错误标签 | 审计备注 |',
    '| --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |',
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

export function StoryboardAuditBoard() {
  const [records, setRecords] = useState<StoryboardRecord[]>(emptyRecords);
  const [activeId, setActiveId] = useState('A01');
  const [groupFilter, setGroupFilter] = useState<'ALL' | Group>('ALL');
  const [loaded, setLoaded] = useState(false);
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'manual'>('idle');
  const [recoverySource, setRecoverySource] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem(storageKey);
        if (saved) {
          try {
            const restored = restoreStoryboardDraft(JSON.parse(saved), emptyRecords());
            if (restored) setRecords(restored);
            else setRecoverySource(saved);
          } catch {
            setRecoverySource(saved);
          }
        }
      } catch {
        // Storage access may be unavailable; the save status reports a write failure.
      }
      setLoaded(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  const saveStatus = useLocalRecordSave(storageKey, records, loaded && recoverySource === null);

  const active = records.find((record) => record.id === activeId) ?? records[0];
  const completed = records.filter(isComplete).length;
  const generated = records.filter((record) => record.status !== 'untested').length;
  const flagged = records.filter((record) => record.failures.length > 0).length;
  const allScores = records.flatMap((record) => Object.values(record.scores)).filter((score): score is number => score !== null);
  const overall = allScores.length ? (allScores.reduce((sum, score) => sum + score, 0) / allScores.length).toFixed(1) : '—';
  const markdown = useMemo(() => buildMarkdown(records), [records]);

  function updateActive(patch: Partial<StoryboardRecord>) {
    setRecords((current) => current.map((record) => record.id === activeId ? { ...record, ...patch } : record));
    setCopyState('idle');
  }

  function updateScore(key: ScoreKey, value: number | null) {
    setRecords((current) => updateRecordScore(current, activeId, key, value));
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
    if (!window.confirm(recoverySource
      ? '原始记录格式异常。请先复制原始备份；清空后会用空白表覆盖本机旧记录。确定继续？'
      : '清空当前浏览器中的 9 格分镜审计记录？此操作无法撤销。')) return;
    setRecords(emptyRecords());
    setRecoverySource(null);
    setActiveId('A01');
    setCopyState('idle');
  }

  return (
    <section className="experiment-record-board storyboard-audit-record-board" id="record-desk" aria-label="九格自动分镜审计记录台">
      <div className="experiment-record-top">
        <div><p className="eyebrow mono">04 / Audit desk</p><h2>九份输出先留空，<br />只对真实文本打分。</h2></div>
        <div className="experiment-record-intro"><p>每格对应一种拆镜流程和一篇固定故事。输出、镜头数、秒数、评分与备注只保存在当前浏览器，不上传故事或生成文本。</p><LocalRecordSaveStatus loaded={loaded} blocked={recoverySource !== null} {...saveStatus} /></div>
      </div>

      <div className="experiment-record-summary">
        <article><span className="mono">AUDITED</span><strong>{completed}<i>/9</i></strong><p>已复核 · 评分与素材栏齐全</p></article>
        <article><span className="mono">OUTPUTS</span><strong>{generated}<i>/9</i></strong><p>本机标记为已有输出</p></article>
        <article><span className="mono">AVG SCORE</span><strong>{overall}<i>/5</i></strong><p>{allScores.length ? `${allScores.length} 个有效分数` : '尚无真实评分'}</p></article>
        <article><span className="mono">FLAGGED</span><strong>{flagged}</strong><p>记录了错误标签</p></article>
      </div>

      <LocalRecordBoundary loaded={loaded} markedCount={generated} />
      <div className="experiment-record-workspace">
        <div className="experiment-contact-sheet">
          <div className="storyboard-audit-map" aria-label="原故事经过三种拆镜流程后与人工拍点基准比较"><span className="mono">STORY → METHOD → SHOTS → AUDIT</span><div><b>原故事</b><i>→</i><b>拆镜流程</b><i>→</i><b>输出表</b><i>→</i><b>拍点基准</b></div><small>不按“像不像电影”评分，只核对已写进故事的事实有没有丢。</small></div>
          <div className="experiment-record-filters"><div aria-label="按拆镜流程筛选">{(['ALL', 'A', 'B', 'C'] as const).map((group) => <button type="button" className={groupFilter === group ? 'is-active' : ''} onClick={() => setGroupFilter(group)} key={group}>{group === 'ALL' ? '全部组' : `${group} 组`}</button>)}</div><span className="mono">A 直接 · B 字段 · C 拍点优先</span></div>
          <div className="experiment-contact-grid rain-record-grid storyboard-record-grid">
            {records.map((record) => {
              const recordAverage = average(record);
              return <button type="button" key={record.id} className={`record-cell status-${record.status} ${activeId === record.id ? 'is-active' : ''} ${groupFilter === 'ALL' || groupFilter === record.group ? '' : 'is-muted'}`} onClick={() => setActiveId(record.id)} aria-label={`${record.id} ${record.task}，${statusLabels[record.status]}`}><span className="mono">{record.group}</span><b>{record.id.slice(1)}</b><i>{recordAverage === null ? '—' : recordAverage.toFixed(1)}</i></button>;
            })}
          </div>
          <div className="reference-task-key storyboard-task-key">{tasks.map((task, index) => <span key={task}><b>{String(index + 1).padStart(2, '0')}</b>{task}</span>)}</div>
          <div className="experiment-record-legend mono"><span><i className="status-untested" />待执行</span><span><i className="status-generated" />已有输出</span><span><i className="status-reviewed" />已审计</span></div>
        </div>

        <form className="experiment-record-editor" onSubmit={(event) => event.preventDefault()}>
          <header><div><span className="mono">GROUP {active.group} · OUTPUT</span><strong>{active.id}</strong></div><label><span className="mono">当前状态</span><select value={active.status} onChange={(event) => updateActive({ status: event.target.value as RecordStatus })}><option value="untested">待执行</option><option value="generated">已有输出</option><option value="reviewed">已审计</option></select></label></header>
          <div className="reference-active-task"><span className="mono">FIXED STORY</span><strong>{active.task}</strong></div>
          <RecordEvidenceReminder status={active.status} asset={active.asset} />
          <div className="experiment-record-meta"><label><span>模型 / 版本 / 入口</span><input value={active.model} onChange={(event) => updateActive({ model: event.target.value })} placeholder="执行当天填写真实版本" /></label><label><span>原始输出文件 / 链接</span><input value={active.asset} onChange={(event) => updateActive({ asset: event.target.value })} placeholder={`例：${active.id}.md`} /></label><label><span>输出镜头数</span><input value={active.shotCount} onChange={(event) => updateActive({ shotCount: event.target.value })} inputMode="numeric" placeholder="按原始输出填写" /></label><label><span>分镜总秒数</span><input value={active.duration} onChange={(event) => updateActive({ duration: event.target.value })} placeholder="例：72 秒" /></label></div>
          <fieldset className="experiment-score-fields"><legend className="mono">人工审计 · 1 差 / 5 完整</legend>{scoreLabels.map(({ key, label, hint }) => <div className="experiment-score-row" key={key}><div><strong>{label}</strong><small>{hint}</small></div><div><button type="button" className={active.scores[key] === null ? 'is-active' : ''} onClick={() => updateScore(key, null)} aria-label={`${label}未评分`}>—</button>{[1, 2, 3, 4, 5].map((score) => <button type="button" className={active.scores[key] === score ? 'is-active' : ''} onClick={() => updateScore(key, score)} aria-label={`${label}${score}分`} key={score}>{score}</button>)}</div></div>)}</fieldset>
          <fieldset className="experiment-failure-fields"><legend className="mono">错误标签 · 可多选</legend><div>{failureOptions.map((label) => <button type="button" className={active.failures.includes(label) ? 'is-active' : ''} onClick={() => toggleFailure(label)} aria-pressed={active.failures.includes(label)} key={label}>{label}</button>)}</div></fieldset>
          <label className="experiment-record-note"><span>拍点审计备注</span><textarea value={active.note} onChange={(event) => updateActive({ note: event.target.value })} placeholder="按人工基准逐项记录：哪些拍点保留、遗漏、错并或被虚构内容替换；再写镜头字段与时长问题。" /></label>
        </form>
      </div>

      <div className="experiment-record-export"><div><span className="mono">LOCAL EXPORT</span><strong>人工基准与模型输出，分开保存。</strong><p>复制 Markdown 时保留九格编号、镜头数、总秒数、四项评分、错误标签与审计备注；空白不算结果。</p></div><div className="experiment-export-actions"><button type="button" onClick={copyMarkdown}>{copyState === 'copied' ? '已复制审计记录 ✓' : copyState === 'manual' ? '请在下方手动复制 ↓' : '复制 Markdown 审计 ↗'}</button><button type="button" className="experiment-reset-button" onClick={resetRecords}>清空本地记录</button></div>{recoverySource !== null && <aside className="storyboard-record-recovery" role="alert"><strong>本机草稿格式异常，已暂停自动保存。</strong><p>当前空白表不是原始记录。先展开并复制下面的原始备份，留底后再清空本地记录。</p><details><summary>查看并复制原始备份</summary><textarea readOnly value={recoverySource} aria-label="本机原始记录备份" onFocus={(event) => event.currentTarget.select()} /></details></aside>}{copyState === 'manual' && <textarea readOnly value={markdown} aria-label="手动复制自动分镜审计记录" onFocus={(event) => event.currentTarget.select()} />}</div>
    </section>
  );
}
