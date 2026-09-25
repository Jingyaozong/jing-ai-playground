'use client';

import { useEffect, useMemo, useState } from 'react';
import { localExportNotice, localExportEvidenceSummary } from '../data/experiment-export-boundary';
import { LocalRecordBoundary } from './local-record-boundary';
import { posterStoryPilotRecords, type PosterStoryPilotRecord } from '../data/poster-story-pilot';
import { posterStoryRetestRecords } from '../data/poster-story-retest';

type RecordStatus = 'untested' | 'generated' | 'reviewed';
type Group = 'A' | 'B' | 'C';
type ScoreKey = 'evidence' | 'boundary' | 'coherence' | 'relevance';
type AuditMode = 'comparison' | 'retest';

type PosterStoryRecord = {
  id: string;
  group: Group;
  poster: string;
  status: RecordStatus;
  model: string;
  asset: string;
  outputTitle: string;
  wordCount: string;
  scores: Record<ScoreKey, number | null>;
  failures: string[];
  note: string;
};

type BoardConfig = {
  storageKey: string;
  groups: Array<{ code: Group; label: string }>;
  posters: string[];
  records: PosterStoryPilotRecord[];
  exportTitle: string;
  exportNote: string;
  heading: string;
  intro: string;
  localLabel: string;
  filterLabel: string;
  mapLabel: string;
  mapFoot: string;
  resetConfirm: string;
};

const boardConfigs: Record<AuditMode, BoardConfig> = {
  comparison: {
    storageKey: 'jing-experiment-poster-story-audit-v5',
    groups: [{ code: 'A', label: '直接反推' }, { code: 'B', label: '证据优先' }, { code: 'C', label: '三栏反推' }],
    posters: ['双月公交站', '退潮电影院', '室内落雪'],
    records: posterStoryPilotRecords,
    exportTitle: '让 AI 先画一张不会发生的海报｜9 格故事审计',
    exportNote: '三张 AI 生成海报只是固定输入。A 直接反推、B 证据优先、C 证据／推测／选择三栏；空白输出不进入平均分。',
    heading: '三张海报各跑三遍，\n九格首轮已经填满。',
    intro: '九份原始输出和暂定编辑审计随页面公开；你在此继续修改的标题、分数与备注只保存在当前浏览器，不会覆盖原始故事文本。',
    localLabel: '公开 Pilot + 当前浏览器草稿',
    filterLabel: 'A 直接 · B 证据 · C 三栏',
    mapLabel: 'LOOK → INFER → CHOOSE',
    mapFoot: '故事必须说明自己从哪里长出来。',
    resetConfirm: '恢复页面公开的 9 份 Pilot 审计，并清除当前浏览器中的后续修改？',
  },
  retest: {
    storageKey: 'jing-experiment-poster-story-retest-v1',
    groups: [{ code: 'A', label: '候选 01' }, { code: 'B', label: '候选 02' }, { code: 'C', label: '候选 03' }],
    posters: ['水中图书馆', '果园电梯', '海中洗衣机'],
    records: posterStoryRetestRecords,
    exportTitle: '短证据账本能否跨题材工作｜9 格复测审计',
    exportNote: '三张新生成虚构海报分别保留三份故事候选；九份都使用同一短证据账本，但来自同一次 Codex 会话，不视为独立重复实验。',
    heading: '三张新海报各写三次，\n九份短账本已经保存。',
    intro: '三张新海报、九份原始输出与暂定编辑审计随页面公开。候选来自同一次 Codex 会话，用来检查跨题材表现，不冒充独立会话复测。',
    localLabel: '公开复测 + 当前浏览器草稿',
    filterLabel: 'A 候选 01 · B 候选 02 · C 候选 03',
    mapLabel: 'E → I → C → STORY',
    mapFoot: '同一份短账本，换三种空间异常。',
    resetConfirm: '恢复页面公开的 9 份复测审计，并清除当前浏览器中的后续修改？',
  },
};
const scoreLabels: Array<{ key: ScoreKey; label: string; hint: string }> = [
  { key: 'evidence', label: '线索利用', hint: '可见主体、异常、空间关系、光线和道具有多少进入故事因果' },
  { key: 'boundary', label: '边界透明', hint: '画面事实、合理推测与主动创作选择是否清楚分开' },
  { key: 'coherence', label: '故事连贯', hint: '规则是否制造限制，限制是否形成冲突与不可逆选择' },
  { key: 'relevance', label: '海报关联', hint: '换掉这张海报后故事是否仍然几乎不变' },
];
const failureOptions = ['可见线索遗漏', '推测冒充事实', '任意添加身份', '世界规则空泛', '规则代价抽象', '冲突与规则无关', '选择不可逆性不足', '类型套壳', '道具没有作用', '梗概跳步', '解释过量', '其他'];
const statusLabels: Record<RecordStatus, string> = { untested: '待执行', generated: '已有故事', reviewed: '已审计' };

function initialRecords(config: BoardConfig): PosterStoryRecord[] {
  return config.groups.flatMap((group) => config.posters.map((poster, index) => {
    const id = `${group.code}${String(index + 1).padStart(2, '0')}`;
    const pilot = config.records.find((record) => record.id === id);
    return {
    id,
    group: group.code,
    poster,
    status: pilot ? 'reviewed' as const : 'untested' as const,
    model: pilot ? 'OpenAI Codex · current session · 2026.08.31' : '',
    asset: pilot?.rawHref ?? '',
    outputTitle: pilot?.outputTitle ?? '',
    wordCount: pilot?.wordCount ?? '',
    scores: pilot ? { ...pilot.scores } : { evidence: null, boundary: null, coherence: null, relevance: null },
    failures: pilot ? [...pilot.failures] : [],
    note: pilot?.auditNote ?? '',
  };
  }));
}

function isComplete(record: PosterStoryRecord) {
  return scoreLabels.every(({ key }) => record.scores[key] !== null);
}

function average(record: PosterStoryRecord) {
  const scores = Object.values(record.scores).filter((score): score is number => score !== null);
  return scores.length ? scores.reduce((sum, score) => sum + score, 0) / scores.length : null;
}

function cleanCell(value: string) {
  return value.replaceAll('|', '\\|').replaceAll('\n', ' ');
}

function buildMarkdown(records: PosterStoryRecord[], config: BoardConfig) {
  const groupSummary = config.groups.flatMap((group) => {
    const rows = records.filter((record) => record.group === group.code);
    return [`### ${group.code} · ${group.label}`, ...scoreLabels.map(({ key, label }) => {
      const values = rows.map((record) => record.scores[key]).filter((value): value is number => value !== null);
      const result = values.length ? (values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2) : '—';
      return `- ${label}：${result} / 5（${values.length} 个有效评分）`;
    }), ''];
  });
  const rows = records.map((record) => `| ${record.id} | ${record.poster} | ${statusLabels[record.status]} | ${cleanCell(record.model || '—')} | ${cleanCell(record.asset || '—')} | ${cleanCell(record.outputTitle || '—')} | ${record.wordCount || '—'} | ${record.scores.evidence ?? '—'} | ${record.scores.boundary ?? '—'} | ${record.scores.coherence ?? '—'} | ${record.scores.relevance ?? '—'} | ${cleanCell(record.failures.join('、') || '—')} | ${cleanCell(record.note || '—')} |`);
  return [
    `# ${config.exportTitle}`, '',
    localExportNotice, '', localExportEvidenceSummary(records), '',
    `> ${config.exportNote}`, '',
    '## 分组平均', '', ...groupSummary,
    '## 输出明细', '',
    '| 编号 | 输入海报 | 状态 | 模型 / 版本 | 原始输出 | 输出标题 | 字数 | 线索利用 | 边界透明 | 故事连贯 | 海报关联 | 错误标签 | 审计备注 |',
    '| --- | --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | --- | --- |',
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

export function PosterStoryAuditBoard({ mode = 'comparison' }: { mode?: AuditMode }) {
  const config = boardConfigs[mode];
  const [records, setRecords] = useState<PosterStoryRecord[]>(() => initialRecords(config));
  const [activeId, setActiveId] = useState('A01');
  const [groupFilter, setGroupFilter] = useState<'ALL' | Group>('ALL');
  const [loaded, setLoaded] = useState(false);
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'manual'>('idle');

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem(config.storageKey);
        if (saved) {
          const parsed = JSON.parse(saved) as PosterStoryRecord[];
          if (Array.isArray(parsed) && parsed.length === 9) setRecords(parsed);
        }
      } catch {
        // A damaged local draft should not block the published pilot records.
      }
      setLoaded(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [config.storageKey]);

  useEffect(() => {
    if (!loaded) return;
    try { window.localStorage.setItem(config.storageKey, JSON.stringify(records)); } catch { /* Keep the board usable without storage. */ }
  }, [config.storageKey, loaded, records]);

  const active = records.find((record) => record.id === activeId) ?? records[0];
  const completed = records.filter(isComplete).length;
  const generated = records.filter((record) => record.status !== 'untested').length;
  const flagged = records.filter((record) => record.failures.length > 0).length;
  const allScores = records.flatMap((record) => Object.values(record.scores)).filter((score): score is number => score !== null);
  const overall = allScores.length ? (allScores.reduce((sum, score) => sum + score, 0) / allScores.length).toFixed(1) : '—';
  const markdown = useMemo(() => buildMarkdown(records, config), [config, records]);

  function updateActive(patch: Partial<PosterStoryRecord>) {
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
    if (!window.confirm(config.resetConfirm)) return;
    setRecords(initialRecords(config));
    setActiveId('A01');
    setCopyState('idle');
  }

  return (
    <section className="experiment-record-board poster-story-audit-board" id="record-desk" aria-label="九格海报反推故事审计台">
      <div className="experiment-record-top">
        <div><p className="eyebrow mono">04 / Audit desk</p><h2>{config.heading.split('\n').map((line, index, lines) => <span key={line}>{line}{index < lines.length - 1 && <br />}</span>)}</h2></div>
        <div className="experiment-record-intro"><p>{config.intro}</p><span className="mono">{loaded ? config.localLabel : '正在读取本地记录…'}</span></div>
      </div>

      <div className="experiment-record-summary">
        <article><span className="mono">AUDITED</span><strong>{completed}<i>/9</i></strong><p>四项评分完整</p></article>
        <article><span className="mono">STORIES</span><strong>{generated}<i>/9</i></strong><p>本机标记为已有输出</p></article>
        <article><span className="mono">AVG SCORE</span><strong>{overall}<i>/5</i></strong><p>{allScores.length ? `${allScores.length} 个有效分数` : '尚无真实评分'}</p></article>
        <article><span className="mono">FLAGGED</span><strong>{flagged}</strong><p>记录了错误标签</p></article>
      </div>

      <LocalRecordBoundary loaded={loaded} markedCount={generated} />
      <div className="experiment-record-workspace">
        <div className="experiment-contact-sheet">
          <div className="poster-story-map" aria-label="从海报可见证据到推测和主动创作选择的三段关系"><span className="mono">{config.mapLabel}</span><div><b>可见证据<small>能从图上指出</small></b><i>→</i><b>合理推测<small>可能成立，但未被证明</small></b><i>→</i><b>创作选择<small>作者主动添加</small></b></div><strong>{config.mapFoot}</strong></div>
          <div className="experiment-record-filters"><div aria-label="按反推方法筛选">{(['ALL', 'A', 'B', 'C'] as const).map((group) => <button type="button" className={groupFilter === group ? 'is-active' : ''} onClick={() => setGroupFilter(group)} key={group}>{group === 'ALL' ? '全部组' : `${group} 组`}</button>)}</div><span className="mono">{config.filterLabel}</span></div>
          <div className="experiment-contact-grid rain-record-grid poster-story-record-grid">
            {records.map((record) => {
              const recordAverage = average(record);
              return <button type="button" key={record.id} className={`record-cell status-${record.status} ${activeId === record.id ? 'is-active' : ''} ${groupFilter === 'ALL' || groupFilter === record.group ? '' : 'is-muted'}`} onClick={() => setActiveId(record.id)} aria-label={`${record.id} ${record.poster}，${statusLabels[record.status]}`}><span className="mono">{record.group}</span><b>{record.id.slice(1)}</b><i>{recordAverage === null ? '—' : recordAverage.toFixed(1)}</i></button>;
            })}
          </div>
          <div className="reference-task-key poster-story-task-key">{config.posters.map((poster, index) => <span key={poster}><b>P{String(index + (mode === 'retest' ? 4 : 1)).padStart(2, '0')}</b>{poster}</span>)}</div>
          <div className="experiment-record-legend mono"><span><i className="status-untested" />待执行</span><span><i className="status-generated" />已有故事</span><span><i className="status-reviewed" />已审计</span></div>
        </div>

        <form className="experiment-record-editor" onSubmit={(event) => event.preventDefault()}>
          <header><div><span className="mono">GROUP {active.group} · STORY</span><strong>{active.id}</strong></div><label><span className="mono">当前状态</span><select value={active.status} onChange={(event) => updateActive({ status: event.target.value as RecordStatus })}><option value="untested">待执行</option><option value="generated">已有故事</option><option value="reviewed">已审计</option></select></label></header>
          <div className="reference-active-task"><span className="mono">FIXED POSTER</span><strong>{active.poster}</strong></div>
          <div className="experiment-record-meta"><label><span>模型 / 版本 / 入口</span><input value={active.model} onChange={(event) => updateActive({ model: event.target.value })} placeholder="执行当天填写真实版本" /></label><label><span>原始输出文件 / 链接</span><input value={active.asset} onChange={(event) => updateActive({ asset: event.target.value })} placeholder={`例：${active.id}.md`} /></label><label><span>输出故事标题</span><input value={active.outputTitle} onChange={(event) => updateActive({ outputTitle: event.target.value })} placeholder="按原始输出填写" /></label><label><span>梗概字数</span><input value={active.wordCount} onChange={(event) => updateActive({ wordCount: event.target.value })} inputMode="numeric" placeholder="只填实际字数" /></label></div>
          <fieldset className="experiment-score-fields"><legend className="mono">人工审计 · 1 差 / 5 清楚</legend>{scoreLabels.map(({ key, label, hint }) => <div className="experiment-score-row" key={key}><div><strong>{label}</strong><small>{hint}</small></div><div><button type="button" className={active.scores[key] === null ? 'is-active' : ''} onClick={() => updateScore(key, null)} aria-label={`${label}未评分`}>—</button>{[1, 2, 3, 4, 5].map((score) => <button type="button" className={active.scores[key] === score ? 'is-active' : ''} onClick={() => updateScore(key, score)} aria-label={`${label}${score}分`} key={score}>{score}</button>)}</div></div>)}</fieldset>
          <fieldset className="experiment-failure-fields"><legend className="mono">错误标签 · 可多选</legend><div>{failureOptions.map((label) => <button type="button" className={active.failures.includes(label) ? 'is-active' : ''} onClick={() => toggleFailure(label)} aria-pressed={active.failures.includes(label)} key={label}>{label}</button>)}</div></fieldset>
          <label className="experiment-record-note"><span>证据与故事备注</span><textarea value={active.note} onChange={(event) => updateActive({ note: event.target.value })} placeholder="先写哪些内容能从海报直接指出，再写哪些属于推测、哪些是主动创作选择，以及它们怎样形成规则、冲突与选择。" /></label>
        </form>
      </div>

      <div className="experiment-record-export"><div><span className="mono">LOCAL EXPORT</span><strong>输入海报、推理边界和故事结果分开保存。</strong><p>复制 Markdown 时保留九格编号、输出标题、字数、四项评分、错误标签与证据备注。</p></div><div className="experiment-export-actions"><button type="button" onClick={copyMarkdown}>{copyState === 'copied' ? '已复制审计记录 ✓' : copyState === 'manual' ? '请在下方手动复制 ↓' : '复制 Markdown 审计 ↗'}</button><button type="button" className="experiment-reset-button" onClick={resetRecords}>恢复公开记录</button></div>{copyState === 'manual' && <textarea readOnly value={markdown} aria-label="手动复制海报故事审计记录" onFocus={(event) => event.currentTarget.select()} />}</div>
    </section>
  );
}
