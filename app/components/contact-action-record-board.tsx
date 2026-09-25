'use client';

import { useEffect, useMemo, useState } from 'react';
import { localExportNotice, localExportEvidenceSummary, markdownTableRow } from '../data/experiment-export-boundary';
import { LocalRecordBoundary } from './local-record-boundary';

type RecordStatus = 'untested' | 'generated' | 'reviewed';
type Group = 'A' | 'B' | 'C';
type ScoreKey = 'contactTiming' | 'handIntegrity' | 'objectIntegrity' | 'supportLogic';

type ContactRecord = {
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

const storageKey = 'jing-experiment-contact-action-v1';
const groups: Array<{ code: Group; label: string }> = [
  { code: 'A', label: '普通动作句' },
  { code: 'B', label: '五状态顺序' },
  { code: 'C', label: '五状态＋端点' },
];
const tasks = ['指尖触碰杯壁', '握住杯柄并抬高', '放稳杯子再松手'];
const scoreLabels: Array<{ key: ScoreKey; label: string; hint: string }> = [
  { key: 'contactTiming', label: '接触时点', hint: '物体是否在手真正接触并闭合后才开始移动' },
  { key: 'handIntegrity', label: '手部完整', hint: '手指数量、关节、抓握姿态和遮挡是否连续可信' },
  { key: 'objectIntegrity', label: '道具保持', hint: '杯子的数量、形状、朝向、材质和杯柄是否没有突变' },
  { key: 'supportLogic', label: '承重逻辑', hint: '重量是否按桌面→手→桌面的顺序转移，没有悬浮或滑动' },
];
const failureOptions = ['接触前提前移动', '手指融合或增殖', '手穿过道具', '抓握点滑动', '道具变形或复制', '物体悬浮', '落稳与释放错序', '隐性切镜', '背景或桌面变形', '其他'];
const statusLabels: Record<RecordStatus, string> = { untested: '待执行', generated: '已生成', reviewed: '已评估' };

function emptyRecords(): ContactRecord[] {
  return groups.flatMap((group) => tasks.map((task, index) => ({
    id: `${group.code}${String(index + 1).padStart(2, '0')}`,
    group: group.code,
    task,
    status: 'untested' as const,
    model: '', seed: '', asset: '',
    scores: { contactTiming: null, handIntegrity: null, objectIntegrity: null, supportLogic: null },
    failures: [], note: '',
  })));
}

function isComplete(record: ContactRecord) {
  return scoreLabels.every(({ key }) => record.scores[key] !== null);
}

function average(record: ContactRecord) {
  const scores = Object.values(record.scores).filter((score): score is number => score !== null);
  return scores.length ? scores.reduce((sum, score) => sum + score, 0) / scores.length : null;
}

function buildMarkdown(records: ContactRecord[]) {
  const groupSummary = groups.flatMap((group) => {
    const rows = records.filter((record) => record.group === group.code);
    return [`### ${group.code} · ${group.label}`, ...scoreLabels.map(({ key, label }) => {
      const values = rows.map((record) => record.scores[key]).filter((value): value is number => value !== null);
      return `- ${label}：${values.length ? (values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2) : '—'} / 5（${values.length} 个有效评分）`;
    }), ''];
  });
  const rows = records.map((record) => markdownTableRow([record.id, record.task, statusLabels[record.status], record.model, record.seed, record.asset, record.scores.contactTiming, record.scores.handIntegrity, record.scores.objectIntegrity, record.scores.supportLogic, record.failures.join('、'), record.note]));
  return [
    '# 一只手能否稳定拿起同一个杯子？｜9 格实验记录', '',
    localExportNotice, '', localExportEvidenceSummary(records), '',
    '> A 普通动作句、B 五状态顺序、C 五状态加端点证据。空白项不进入平均分；本机记录不代表模型排名。', '',
    '## 分组平均', '', ...groupSummary,
    '## 样本明细', '',
    '| 编号 | 固定任务 | 状态 | 模型 / 版本 | Seed | 结果文件 | 接触时点 | 手部完整 | 道具保持 | 承重逻辑 | 失败标签 | 五阶段备注 |',
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
    // Continue to local fallback.
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

export function ContactActionRecordBoard() {
  const [records, setRecords] = useState<ContactRecord[]>(emptyRecords);
  const [activeId, setActiveId] = useState('A01');
  const [groupFilter, setGroupFilter] = useState<'ALL' | Group>('ALL');
  const [loaded, setLoaded] = useState(false);
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'manual'>('idle');

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved) as ContactRecord[];
          if (Array.isArray(parsed) && parsed.length === 9) setRecords(parsed);
        }
      } catch {
        // A damaged draft should not block the worksheet.
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

  function updateActive(patch: Partial<ContactRecord>) {
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
    if (!window.confirm('清空当前浏览器中的 9 格接触动作实验记录？此操作无法撤销。')) return;
    setRecords(emptyRecords());
    setActiveId('A01');
    setCopyState('idle');
  }

  return (
    <section className="experiment-record-board contact-action-record-board" id="record-desk" aria-label="九格接触动作实验记录台">
      <div className="experiment-record-top">
        <div><p className="eyebrow mono">04 / Record desk</p><h2>九格先空着，<br />只记何时真正碰到。</h2></div>
        <div className="experiment-record-intro"><p>每格对应一种输入条件和一个固定接触任务。评分、文件名与备注只保存在当前浏览器，不上传视频、手部或道具素材。</p><span className="mono">{loaded ? '已保存到当前浏览器' : '正在读取本地记录…'}</span></div>
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
          <div className="contact-action-diagram" aria-label="手先靠近杯柄，接触建立后承重点才从桌面转移到手"><span className="mono">CONTACT → GRIP → SUPPORT</span><div className="contact-diagram-hand"><i /><i /><i /><b /></div><div className="contact-diagram-cup"><i /><b /></div><em>＋</em><strong className="mono">TABLE → HAND</strong></div>
          <div className="experiment-record-filters"><div aria-label="按输入条件筛选">{(['ALL', 'A', 'B', 'C'] as const).map((group) => <button type="button" className={groupFilter === group ? 'is-active' : ''} onClick={() => setGroupFilter(group)} key={group}>{group === 'ALL' ? '全部组' : `${group} 组`}</button>)}</div><span className="mono">A 动作句 · B 五状态 · C 加端点</span></div>
          <div className="experiment-contact-grid rain-record-grid contact-record-grid">
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
          <div className="reference-active-task"><span className="mono">FIXED CONTACT TASK</span><strong>{active.task}</strong></div>
          <div className="experiment-record-meta"><label><span>模型 / 版本 / 制作入口</span><input value={active.model} onChange={(event) => updateActive({ model: event.target.value })} placeholder="执行当天填写真实模型版本" /></label><label><span>Seed / 固定参数</span><input value={active.seed} onChange={(event) => updateActive({ seed: event.target.value })} placeholder="不支持则写“不支持”" /></label><label><span>结果文件 / 链接</span><input value={active.asset} onChange={(event) => updateActive({ asset: event.target.value })} placeholder={`例：${active.id}.mp4`} /></label></div>
          <fieldset className="experiment-score-fields"><legend className="mono">人工评分 · 1 差 / 5 稳定</legend>{scoreLabels.map(({ key, label, hint }) => <div className="experiment-score-row" key={key}><div><strong>{label}</strong><small>{hint}</small></div><div><button type="button" className={active.scores[key] === null ? 'is-active' : ''} onClick={() => updateScore(key, null)} aria-label={`${label}未评分`}>—</button>{[1, 2, 3, 4, 5].map((score) => <button type="button" className={active.scores[key] === score ? 'is-active' : ''} onClick={() => updateScore(key, score)} aria-label={`${label}${score}分`} key={score}>{score}</button>)}</div></div>)}</fieldset>
          <fieldset className="experiment-failure-fields"><legend className="mono">失败标签 · 可多选</legend><div>{failureOptions.map((label) => <button type="button" className={active.failures.includes(label) ? 'is-active' : ''} onClick={() => toggleFailure(label)} aria-pressed={active.failures.includes(label)} key={label}>{label}</button>)}</div></fieldset>
          <label className="experiment-record-note"><span>五阶段观察备注</span><textarea value={active.note} onChange={(event) => updateActive({ note: event.target.value })} placeholder="依次记录接近、预接触、闭合、承重移动和结束状态：错误最早出现在哪一步，手、杯子和承重点怎样改变。" /></label>
        </form>
      </div>

      <div className="experiment-record-export"><div><span className="mono">LOCAL EXPORT</span><strong>接触时点和承重逻辑分开评分，空白不算结果。</strong><p>复制 Markdown 时保留九格编号、失败标签与五阶段观察；分组平均只使用实际填写的分数。</p></div><div className="experiment-export-actions"><button type="button" onClick={copyMarkdown}>{copyState === 'copied' ? '已复制实验记录 ✓' : copyState === 'manual' ? '请在下方手动复制 ↓' : '复制 Markdown 记录 ↗'}</button><button type="button" className="experiment-reset-button" onClick={resetRecords}>清空本地记录</button></div>{copyState === 'manual' && <textarea readOnly value={markdown} aria-label="手动复制接触动作实验记录" onFocus={(event) => event.currentTarget.select()} />}</div>
    </section>
  );
}
