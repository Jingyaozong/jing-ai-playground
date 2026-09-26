'use client';

import { useEffect, useMemo, useState } from 'react';
import { RecordEvidenceReminder } from './record-evidence-reminder';
import { countsAsCompletedRecord, localExportNotice, localExportEvidenceSummary, markdownTableRow } from '../data/experiment-export-boundary';
import { LocalRecordBoundary } from './local-record-boundary';

type RecordStatus = 'untested' | 'generated' | 'reviewed';
type ScoreKey = 'identity' | 'motion' | 'physics' | 'camera';

type TestRecord = {
  id: number;
  group: 'A' | 'B' | 'C' | 'D';
  status: RecordStatus;
  model: string;
  asset: string;
  scores: Record<ScoreKey, number | null>;
  failures: string[];
  note: string;
};

const storageKey = 'jing-experiment-forty-shots-records-v2';
const scoreLabels: Array<{ key: ScoreKey; label: string; hint: string }> = [
  { key: 'identity', label: '身份一致性', hint: '脸、发型和主要身份锚点' },
  { key: 'motion', label: '动作可信度', hint: '主体动作是否自然、连续' },
  { key: 'physics', label: '物理稳定性', hint: '手、衣物、物体和空间关系' },
  { key: 'camera', label: '镜头完成度', hint: '景别、运镜和构图是否按计划' },
];
const failureOptions = ['身份漂移', '手部异常', '肢体异常', '物体变形', '物理穿帮', '运动闪烁', '镜头偏移', '其他'];
const statusLabels: Record<RecordStatus, string> = { untested: '待测试', generated: '已生成', reviewed: '已评估' };

function groupFor(id: number): TestRecord['group'] {
  if (id <= 10) return 'A';
  if (id <= 20) return 'B';
  if (id <= 30) return 'C';
  return 'D';
}

function emptyRecords(): TestRecord[] {
  return Array.from({ length: 40 }, (_, index) => ({
    id: index + 1,
    group: groupFor(index + 1),
    status: 'untested',
    model: '',
    asset: '',
    scores: { identity: null, motion: null, physics: null, camera: null },
    failures: [],
    note: '',
  }));
}

function isComplete(record: TestRecord) {
  return countsAsCompletedRecord(record.status, record.asset, scoreLabels.map(({ key }) => record.scores[key]));
}

function recordAverage(record: TestRecord) {
  const scores = Object.values(record.scores).filter((score): score is number => score !== null);
  return scores.length ? scores.reduce((sum, score) => sum + score, 0) / scores.length : null;
}

function buildMarkdown(records: TestRecord[]) {
  const complete = records.filter(isComplete);
  const averages = scoreLabels.map(({ key, label }) => {
    const values = records.map((record) => record.scores[key]).filter((score): score is number => score !== null);
    const average = values.length ? (values.reduce((sum, score) => sum + score, 0) / values.length).toFixed(2) : '—';
    return `- ${label}：${average} / 5（${values.length} 个已评分样本）`;
  }).join('\n');
  const header = '| 镜号 | 组别 | 状态 | 模型 / 版本 | 素材 | 身份 | 动作 | 物理 | 镜头 | 失败标签 | 观察备注 |\n| ---: | :---: | --- | --- | --- | ---: | ---: | ---: | ---: | --- | --- |';
  const rows = records.map((record) => {
    return markdownTableRow([String(record.id).padStart(2, '0'), record.group, statusLabels[record.status], record.model, record.asset, record.scores.identity, record.scores.motion, record.scores.physics, record.scores.camera, record.failures.join('、'), record.note]);
  }).join('\n');
  return `# 同一个她，四十个镜头｜实验记录\n\n${localExportNotice}\n\n${localExportEvidenceSummary(records)}\n\n> 本表只包含手动填写的观察，不代表模型排名。空白样本保持为“待测试”。\n\n## 进度\n\n- 已标复核且四项评分、素材栏齐全：${complete.length} / 40（素材未自动核验）\n- 本机标记为已生成：${records.filter((record) => record.status !== 'untested').length} / 40\n\n## 平均分\n\n${averages}\n\n## 样本明细\n\n${header}\n${rows}`;
}

async function copyText(value: string) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return true;
    }
  } catch {
    // Use the local fallback below.
  }
  const textarea = document.createElement('textarea');
  textarea.value = value;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  let copied = false;
  try {
    copied = document.execCommand('copy');
  } catch {
    copied = false;
  }
  textarea.remove();
  return copied;
}

export function ExperimentRecordBoard() {
  const [records, setRecords] = useState<TestRecord[]>(emptyRecords);
  const [activeId, setActiveId] = useState(1);
  const [groupFilter, setGroupFilter] = useState<'ALL' | TestRecord['group']>('ALL');
  const [statusFilter, setStatusFilter] = useState<'all' | RecordStatus>('all');
  const [loaded, setLoaded] = useState(false);
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'manual'>('idle');

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved) as TestRecord[];
          if (Array.isArray(parsed) && parsed.length === 40) setRecords(parsed);
        }
      } catch {
        // A broken local draft should never block the empty worksheet.
      }
      setLoaded(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(records));
    } catch {
      // The worksheet remains usable even when local storage is unavailable.
    }
  }, [loaded, records]);

  const active = records.find((record) => record.id === activeId) ?? records[0];
  const completed = records.filter(isComplete).length;
  const generated = records.filter((record) => record.status !== 'untested').length;
  const flagged = records.filter((record) => record.failures.length > 0).length;
  const overallScores = records.flatMap((record) => Object.values(record.scores)).filter((score): score is number => score !== null);
  const overallAverage = overallScores.length ? (overallScores.reduce((sum, score) => sum + score, 0) / overallScores.length).toFixed(1) : '—';
  const markdown = useMemo(() => buildMarkdown(records), [records]);

  function updateActive(patch: Partial<TestRecord>) {
    setRecords((current) => current.map((record) => record.id === activeId ? { ...record, ...patch } : record));
    setCopyState('idle');
  }

  function updateScore(key: ScoreKey, value: number | null) {
    setRecords((current) => current.map((record) => {
      if (record.id !== activeId) return record;
      const scores = { ...record.scores, [key]: value };
      const hasAllScores = Object.values(scores).every((score) => score !== null);
      return { ...record, scores, status: hasAllScores ? 'reviewed' : record.status === 'untested' && value !== null ? 'generated' : record.status };
    }));
    setCopyState('idle');
  }

  function toggleFailure(label: string) {
    const failures = active.failures.includes(label) ? active.failures.filter((item) => item !== label) : [...active.failures, label];
    updateActive({ failures });
  }

  async function copyMarkdown() {
    if (await copyText(markdown)) {
      setCopyState('copied');
      window.setTimeout(() => setCopyState('idle'), 1800);
    } else {
      setCopyState('manual');
    }
  }

  function resetRecords() {
    if (!window.confirm('清空当前浏览器中的 40 镜实验记录？此操作无法撤销。')) return;
    setRecords(emptyRecords());
    setActiveId(1);
    setCopyState('idle');
  }

  const matchesFilter = (record: TestRecord) => (groupFilter === 'ALL' || record.group === groupFilter) && (statusFilter === 'all' || record.status === statusFilter);

  return (
    <section className="experiment-record-board" id="record-desk" aria-label="四十镜实验记录板">
      <div className="experiment-record-top">
        <div>
          <p className="eyebrow mono">04 / Record desk</p>
          <h2>四十格先空着，<br />等结果自己说话。</h2>
        </div>
        <div className="experiment-record-intro">
          <p>每一格对应一条正式测试。只记录实际生成的素材和人工观察；未填写的样本不会进入平均分。</p>
          <span className="mono">{loaded ? '已保存到当前浏览器' : '正在读取本地记录…'}</span>
        </div>
      </div>

      <div className="experiment-record-summary" aria-label="实验记录汇总">
        <article><span className="mono">COMPLETE</span><strong>{completed}<i>/40</i></strong><p>已复核 · 评分与素材栏齐全</p></article>
        <article><span className="mono">GENERATED</span><strong>{generated}<i>/40</i></strong><p>本机标记为已有输出</p></article>
        <article><span className="mono">AVG SCORE</span><strong>{overallAverage}<i>/5</i></strong><p>{overallScores.length ? `${overallScores.length} 个有效分数` : '尚无真实评分'}</p></article>
        <article><span className="mono">FLAGGED</span><strong>{flagged}</strong><p>记录了失败标签</p></article>
      </div>

      <LocalRecordBoundary loaded={loaded} markedCount={generated} />
      <div className="experiment-record-workspace">
        <div className="experiment-contact-sheet">
          <div className="experiment-record-filters">
            <div aria-label="按组别筛选">{(['ALL', 'A', 'B', 'C', 'D'] as const).map((group) => <button type="button" className={groupFilter === group ? 'is-active' : ''} onClick={() => setGroupFilter(group)} key={group}>{group === 'ALL' ? '全部组' : `${group} 组`}</button>)}</div>
            <label><span className="mono">STATUS</span><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}><option value="all">全部状态</option><option value="untested">待测试</option><option value="generated">已生成</option><option value="reviewed">已评估</option></select></label>
          </div>
          <div className="experiment-contact-grid">
            {records.map((record) => {
              const average = recordAverage(record);
              return <button type="button" key={record.id} className={`record-cell status-${record.status} ${activeId === record.id ? 'is-active' : ''} ${matchesFilter(record) ? '' : 'is-muted'}`} onClick={() => setActiveId(record.id)} aria-label={`镜头 ${record.id}，${statusLabels[record.status]}`}>
                <span className="mono">{record.group}</span><b>{String(record.id).padStart(2, '0')}</b><i>{average === null ? '—' : average.toFixed(1)}</i>
              </button>;
            })}
          </div>
          <div className="experiment-record-legend mono"><span><i className="status-untested" />待测试</span><span><i className="status-generated" />已生成</span><span><i className="status-reviewed" />已评估</span></div>
        </div>

        <form className="experiment-record-editor" onSubmit={(event) => event.preventDefault()}>
          <header><div><span className="mono">GROUP {active.group} · SHOT</span><strong>{String(active.id).padStart(2, '0')}</strong></div><label><span className="mono">当前状态</span><select value={active.status} onChange={(event) => updateActive({ status: event.target.value as RecordStatus })}><option value="untested">待测试</option><option value="generated">已生成</option><option value="reviewed">已评估</option></select></label></header>
          <div className="experiment-record-meta">
            <label><span>模型 / 版本</span><input value={active.model} onChange={(event) => updateActive({ model: event.target.value })} placeholder="例：模型名 + 版本" /></label>
            <label><span>结果文件 / 链接</span><input value={active.asset} onChange={(event) => updateActive({ asset: event.target.value })} placeholder="例：A-01.mp4" /></label>
          </div>
          <RecordEvidenceReminder status={active.status} asset={active.asset} />
          <fieldset className="experiment-score-fields"><legend className="mono">人工评分 · 1 差 / 5 稳定</legend>{scoreLabels.map(({ key, label, hint }) => <div className="experiment-score-row" key={key}><div><strong>{label}</strong><small>{hint}</small></div><div><button type="button" className={active.scores[key] === null ? 'is-active' : ''} onClick={() => updateScore(key, null)} aria-label={`${label}未评分`}>—</button>{[1, 2, 3, 4, 5].map((score) => <button type="button" className={active.scores[key] === score ? 'is-active' : ''} onClick={() => updateScore(key, score)} aria-label={`${label}${score}分`} key={score}>{score}</button>)}</div></div>)}</fieldset>
          <fieldset className="experiment-failure-fields"><legend className="mono">失败标签 · 可多选</legend><div>{failureOptions.map((label) => <button type="button" className={active.failures.includes(label) ? 'is-active' : ''} onClick={() => toggleFailure(label)} aria-pressed={active.failures.includes(label)} key={label}>{label}</button>)}</div></fieldset>
          <label className="experiment-record-note"><span>观察备注</span><textarea value={active.note} onChange={(event) => updateActive({ note: event.target.value })} placeholder="只写看见的现象：在哪一帧、哪个部位、发生了什么变化。" /></label>
        </form>
      </div>

      <div className="experiment-record-export">
        <div><span className="mono">LOCAL EXPORT</span><strong>记录属于你，也留在你这里。</strong><p>复制的是 40 镜完整 Markdown 表；没有填写的字段保留为“—”，不会被包装成实验结论。</p></div>
        <div className="experiment-export-actions"><button type="button" onClick={copyMarkdown}>{copyState === 'copied' ? '已复制实验记录 ✓' : copyState === 'manual' ? '请在下方手动复制 ↓' : '复制 Markdown 记录 ↗'}</button><button type="button" className="experiment-reset-button" onClick={resetRecords}>清空本地记录</button></div>
        {copyState === 'manual' && <textarea readOnly value={markdown} aria-label="手动复制实验记录" onFocus={(event) => event.currentTarget.select()} />}
      </div>
    </section>
  );
}
