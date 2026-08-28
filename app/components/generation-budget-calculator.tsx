'use client';

import { useMemo, useState } from 'react';

type BudgetGroup = {
  id: number;
  name: string;
  shots: number;
  candidates: number;
  seconds: number;
  unitCost: number;
  reservePct: number;
  purpose: string;
};

type ProjectValues = {
  title: string;
  unit: string;
  targetSeconds: number;
  budgetCap: number;
  development: number;
  visualPost: number;
  soundText: number;
  storageDelivery: number;
  laborHours: number;
  hourlyRate: number;
};

const exampleProject: ProjectValues = {
  title: '《门外的声音》30 秒 Pilot', unit: '¥', targetSeconds: 30, budgetCap: 4200,
  development: 360, visualPost: 520, soundText: 380, storageDelivery: 80, laborHours: 24, hourlyRate: 60,
};

const exampleGroups: BudgetGroup[] = [
  { id: 1, name: '低结构风险', shots: 4, candidates: 2, seconds: 5, unitCost: 1.2, reservePct: 15, purpose: '空镜、静物与简单氛围；先确认构图是否够用。' },
  { id: 2, name: '角色身份', shots: 5, candidates: 4, seconds: 5, unitCost: 2.4, reservePct: 35, purpose: '角色近景与换角度；同时检查身份和表演。' },
  { id: 3, name: '复杂动作', shots: 3, candidates: 5, seconds: 6, unitCost: 2.4, reservePct: 45, purpose: '手部交互、起身和转身；失败时先拆动作。' },
  { id: 4, name: '连续性', shots: 3, candidates: 4, seconds: 5, unitCost: 2.4, reservePct: 30, purpose: '反打、道具状态和相邻镜头接口。' },
];

const emptyProject: ProjectValues = { title: '未命名项目', unit: '¥', targetSeconds: 30, budgetCap: 0, development: 0, visualPost: 0, soundText: 0, storageDelivery: 0, laborHours: 0, hourlyRate: 0 };
const emptyGroups: BudgetGroup[] = [{ id: 1, name: '新的风险组', shots: 1, candidates: 1, seconds: 5, unitCost: 0, reservePct: 0, purpose: '' }];

function safeNumber(value: string) {
  return Math.max(0, Number(value) || 0);
}

function formatNumber(value: number, maximumFractionDigits = 2) {
  return value.toLocaleString('zh-CN', { maximumFractionDigits });
}

function formatMoney(value: number, unit: string) {
  const label = unit.trim() || '单位';
  return `${label} ${formatNumber(value)}`;
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

export function GenerationBudgetCalculator() {
  const [project, setProject] = useState<ProjectValues>(exampleProject);
  const [groups, setGroups] = useState<BudgetGroup[]>(exampleGroups);
  const [copied, setCopied] = useState(false);
  const [manualCopy, setManualCopy] = useState<string | null>(null);

  const budget = useMemo(() => {
    const rows = groups.map((group) => {
      const baseTakes = group.shots * group.candidates;
      const baseSeconds = baseTakes * group.seconds;
      const baseCost = baseSeconds * group.unitCost;
      const reserveSeconds = baseSeconds * group.reservePct / 100;
      const reserveCost = baseCost * group.reservePct / 100;
      return { ...group, baseTakes, baseSeconds, baseCost, reserveSeconds, reserveCost, totalCost: baseCost + reserveCost };
    });
    const selectedShots = rows.reduce((sum, row) => sum + row.shots, 0);
    const baseTakes = rows.reduce((sum, row) => sum + row.baseTakes, 0);
    const baseSeconds = rows.reduce((sum, row) => sum + row.baseSeconds, 0);
    const reserveSeconds = rows.reduce((sum, row) => sum + row.reserveSeconds, 0);
    const baseGeneration = rows.reduce((sum, row) => sum + row.baseCost, 0);
    const reserve = rows.reduce((sum, row) => sum + row.reserveCost, 0);
    const labor = project.laborHours * project.hourlyRate;
    const fixed = project.development + project.visualPost + project.soundText + project.storageDelivery;
    const grand = baseGeneration + reserve + fixed + labor;
    const remaining = project.budgetCap - grand;
    return { rows, selectedShots, baseTakes, baseSeconds, reserveSeconds, baseGeneration, reserve, labor, fixed, grand, remaining };
  }, [groups, project]);

  const envelopes = [
    { key: 'generation', label: '基础生成', value: budget.baseGeneration },
    { key: 'reserve', label: '返工预留', value: budget.reserve },
    { key: 'development', label: '开发 / Pilot', value: project.development },
    { key: 'visual', label: '画面后期', value: project.visualPost },
    { key: 'sound', label: '声音 / 字幕', value: project.soundText },
    { key: 'labor', label: '人工 / 交付', value: budget.labor + project.storageDelivery },
  ];

  const report = useMemo(() => [
    `# 生成预算：${project.title.trim() || '未命名项目'}`, '',
    `- 预算单位：${project.unit.trim() || '单位'}`, `- 成片目标：${formatNumber(project.targetSeconds)} 秒`,
    `- 预算上限：${project.budgetCap ? formatMoney(project.budgetCap, project.unit) : '未设置'}`,
    `- 计划镜头：${budget.selectedShots} 镜`, `- 基础候选：${budget.baseTakes} 个`,
    `- 基础生成秒数：${formatNumber(budget.baseSeconds)} 秒`, `- 含返工预留生成秒数：${formatNumber(budget.baseSeconds + budget.reserveSeconds)} 秒`, '',
    '## 风险组', '',
    '| 风险组 | 镜头 | 每镜候选 | 每候选秒数 | 单位秒成本 | 返工预留 | 小计 | 本组只验证 |',
    '| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |',
    ...budget.rows.map((row) => `| ${row.name || '未命名'} | ${row.shots} | ${row.candidates} | ${formatNumber(row.seconds)} | ${formatMoney(row.unitCost, project.unit)} | ${formatNumber(row.reservePct)}% | ${formatMoney(row.totalCost, project.unit)} | ${row.purpose || '待填写'} |`), '',
    '## 成本分配', '',
    `- 基础生成：${formatMoney(budget.baseGeneration, project.unit)}`,
    `- 返工预留：${formatMoney(budget.reserve, project.unit)}`,
    `- 开发 / Pilot：${formatMoney(project.development, project.unit)}`,
    `- 画面后期：${formatMoney(project.visualPost, project.unit)}`,
    `- 声音 / 字幕：${formatMoney(project.soundText, project.unit)}`,
    `- 存储 / 交付：${formatMoney(project.storageDelivery, project.unit)}`,
    `- 人工：${formatNumber(project.laborHours)} 小时 × ${formatMoney(project.hourlyRate, project.unit)} = ${formatMoney(budget.labor, project.unit)}`, '',
    `## 总预算：${formatMoney(budget.grand, project.unit)}`, '',
    project.budgetCap ? `与上限相比：${budget.remaining >= 0 ? `剩余 ${formatMoney(budget.remaining, project.unit)}` : `超出 ${formatMoney(Math.abs(budget.remaining), project.unit)}`}` : '与上限相比：未设置预算上限',
    `每个计划镜头：${budget.selectedShots ? formatMoney(budget.grand / budget.selectedShots, project.unit) : '—'}`,
    `每个成片目标秒：${project.targetSeconds ? formatMoney(budget.grand / project.targetSeconds, project.unit) : '—'}`, '',
    '说明：费率、候选数和返工预留均为使用者输入，不代表平台价格、模型成功率或最终实际支出。执行当天仍需核对官方计费、币种、税费与套餐规则。',
  ].join('\n'), [project, budget]);

  function resetCopy() {
    setCopied(false);
    setManualCopy(null);
  }

  function updateProject(key: keyof ProjectValues, value: string | number) {
    setProject((current) => ({ ...current, [key]: value }));
    resetCopy();
  }

  function updateGroup(id: number, patch: Partial<BudgetGroup>) {
    setGroups((current) => current.map((group) => group.id === id ? { ...group, ...patch } : group));
    resetCopy();
  }

  function addGroup() {
    if (groups.length >= 8) return;
    const nextId = groups.reduce((max, group) => Math.max(max, group.id), 0) + 1;
    setGroups((current) => [...current, { id: nextId, name: '新的风险组', shots: 1, candidates: 2, seconds: 5, unitCost: 0, reservePct: 0, purpose: '' }]);
    resetCopy();
  }

  function removeGroup(id: number) {
    if (groups.length === 1) return;
    setGroups((current) => current.filter((group) => group.id !== id));
    resetCopy();
  }

  function loadExample() {
    setProject(exampleProject);
    setGroups(exampleGroups);
    resetCopy();
  }

  function clearBudget() {
    setProject(emptyProject);
    setGroups(emptyGroups);
    resetCopy();
  }

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
    <section className="budget-workbench" aria-label="生成预算计算器">
      <div className="budget-editor">
        <div className="budget-panel-heading">
          <div><span className="mono">01 / SET THE LIMITS</span><h2>先分预算池，<br />再决定生成多少。</h2></div>
          <div><button type="button" onClick={loadExample}>载入示例</button><button type="button" onClick={clearBudget}>清空</button></div>
        </div>

        <div className="budget-project-grid">
          <label className="is-wide"><span>项目名称<small>用于报告标题</small></span><input value={project.title} onChange={(event) => updateProject('title', event.target.value)} /></label>
          <label><span>预算单位<small>¥、$、Credits 或自定义</small></span><input value={project.unit} onChange={(event) => updateProject('unit', event.target.value)} /></label>
          <label><span>成片目标<small>最终计划时长</small></span><div><input type="number" min="0" step="1" value={project.targetSeconds} onChange={(event) => updateProject('targetSeconds', safeNumber(event.target.value))} /><b>秒</b></div></label>
          <label><span>预算上限<small>0 表示暂不设置</small></span><input type="number" min="0" step="1" value={project.budgetCap} onChange={(event) => updateProject('budgetCap', safeNumber(event.target.value))} /></label>
        </div>

        <div className="budget-groups-heading"><div><span className="mono">02 / RISK GROUPS</span><h3>不同难度，使用不同候选计划。</h3></div><button type="button" onClick={addGroup} disabled={groups.length >= 8}>{groups.length >= 8 ? '最多 8 个风险组' : '＋ 添加风险组'}</button></div>
        <div className="budget-group-list">
          {budget.rows.map((group, index) => <article className={`budget-group budget-group-${index % 4}`} key={group.id}>
            <div className="budget-group-index"><span className="mono">GROUP</span><strong>{String(index + 1).padStart(2, '0')}</strong><small>{formatMoney(group.totalCost, project.unit)}</small></div>
            <label className="budget-group-name"><span>风险组名称</span><input value={group.name} onChange={(event) => updateGroup(group.id, { name: event.target.value })} /></label>
            <label><span>镜头数</span><input type="number" min="0" step="1" value={group.shots} onChange={(event) => updateGroup(group.id, { shots: safeNumber(event.target.value) })} /></label>
            <label><span>每镜候选</span><input type="number" min="0" step="1" value={group.candidates} onChange={(event) => updateGroup(group.id, { candidates: safeNumber(event.target.value) })} /></label>
            <label><span>每候选秒数</span><input type="number" min="0" step="0.5" value={group.seconds} onChange={(event) => updateGroup(group.id, { seconds: safeNumber(event.target.value) })} /></label>
            <label><span>单位秒成本</span><input type="number" min="0" step="0.01" value={group.unitCost} onChange={(event) => updateGroup(group.id, { unitCost: safeNumber(event.target.value) })} /></label>
            <label><span>返工预留</span><div><input type="number" min="0" max="500" step="5" value={group.reservePct} onChange={(event) => updateGroup(group.id, { reservePct: Math.min(500, safeNumber(event.target.value)) })} /><b>%</b></div></label>
            <label className="budget-group-purpose"><span>本组只验证什么</span><textarea rows={2} value={group.purpose} placeholder="写清这组镜头的主要风险与复盘动作" onChange={(event) => updateGroup(group.id, { purpose: event.target.value })} /></label>
            <div className="budget-group-math mono"><span>{group.shots} 镜 × {group.candidates} 候选 × {formatNumber(group.seconds)} 秒</span><b>{formatNumber(group.baseSeconds + group.reserveSeconds)} 秒 · 含返工</b></div>
            <button type="button" className="budget-remove-group" onClick={() => removeGroup(group.id)} disabled={groups.length === 1} aria-label={`删除风险组 ${index + 1}`}>×</button>
          </article>)}
        </div>

        <div className="budget-fixed-heading"><span className="mono">03 / BEYOND GENERATION</span><h3>生成之外，也是真实成本。</h3></div>
        <div className="budget-fixed-grid">
          <label><span>开发 / Pilot<small>风格、角色、场景与可行性测试</small></span><input type="number" min="0" step="1" value={project.development} onChange={(event) => updateProject('development', safeNumber(event.target.value))} /></label>
          <label><span>画面后期<small>放大、延长、编辑、合成与调色</small></span><input type="number" min="0" step="1" value={project.visualPost} onChange={(event) => updateProject('visualPost', safeNumber(event.target.value))} /></label>
          <label><span>声音 / 字幕<small>对白、音效、音乐、混音与文字</small></span><input type="number" min="0" step="1" value={project.soundText} onChange={(event) => updateProject('soundText', safeNumber(event.target.value))} /></label>
          <label><span>存储 / 交付<small>空间、传输与多平台导出</small></span><input type="number" min="0" step="1" value={project.storageDelivery} onChange={(event) => updateProject('storageDelivery', safeNumber(event.target.value))} /></label>
          <label><span>人工时间<small>计划投入的小时数</small></span><div><input type="number" min="0" step="0.5" value={project.laborHours} onChange={(event) => updateProject('laborHours', safeNumber(event.target.value))} /><b>小时</b></div></label>
          <label><span>每小时成本<small>也可以填自己的机会成本</small></span><input type="number" min="0" step="1" value={project.hourlyRate} onChange={(event) => updateProject('hourlyRate', safeNumber(event.target.value))} /></label>
        </div>
      </div>

      <aside className={`budget-envelope-card ${project.budgetCap > 0 && budget.remaining < 0 ? 'is-over' : ''}`} aria-live="polite">
        <div className="budget-envelope-topline mono"><span>PRODUCTION ENVELOPES</span><span>{budget.selectedShots} SHOTS</span></div>
        <p>当前预算</p><h2>{formatMoney(budget.grand, project.unit)}</h2>
        <div className="budget-cap-line"><span style={{ width: `${project.budgetCap ? Math.min(100, budget.grand / project.budgetCap * 100) : 0}%` }} /><small className="mono">{project.budgetCap ? `${budget.remaining >= 0 ? '剩余' : '超出'} ${formatMoney(Math.abs(budget.remaining), project.unit)}` : '尚未设置预算上限'}</small></div>
        <div className="budget-envelopes">
          {envelopes.map((envelope, index) => <article className={`budget-envelope budget-envelope-${index}`} key={envelope.key}>
            <i aria-hidden="true" style={{ width: `${budget.grand ? envelope.value / budget.grand * 100 : 0}%` }} />
            <span>{envelope.label}</span><b>{formatMoney(envelope.value, project.unit)}</b>
          </article>)}
        </div>
        <dl className="budget-metrics"><div><dt>生成秒数</dt><dd>{formatNumber(budget.baseSeconds + budget.reserveSeconds)}s</dd></div><div><dt>基础候选</dt><dd>{budget.baseTakes}</dd></div><div><dt>每个镜头</dt><dd>{budget.selectedShots ? formatMoney(budget.grand / budget.selectedShots, project.unit) : '—'}</dd></div></dl>
        <button type="button" className="budget-copy-button" onClick={copyReport}>{copied ? '已复制预算表 ✓' : '复制完整预算表 ↗'}</button>
        <small>示例费率只演示计算，不代表任何平台价格；所有计算都在当前浏览器本地完成。</small>
      </aside>

      <section className="budget-report-section">
        <div className="budget-report-heading"><div><span className="mono">04 / BUDGET REPORT</span><h2>把数字和假设，<br />放在同一张表里。</h2></div><button type="button" onClick={copyReport}>{copied ? '已复制 ✓' : '复制 Markdown ↗'}</button></div>
        <pre>{report}</pre>
      </section>

      {manualCopy && <aside className="budget-copy-fallback"><div><span className="mono">MANUAL COPY / 浏览器限制</span><p>点击文本框后按 Ctrl+A，再按 Ctrl+C。</p></div><button type="button" onClick={() => setManualCopy(null)}>关闭 ×</button><textarea readOnly value={manualCopy} aria-label="手动复制生成预算表" /></aside>}
    </section>
  );
}
