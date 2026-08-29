'use client';

import { useMemo, useState } from 'react';

type CopyTarget = 'tree' | 'readme' | 'manifest' | 'commands' | 'all';

type DeliveryMeta = {
  projectName: string;
  projectCode: string;
  version: string;
  deliveryDate: string;
  recipient: string;
  purpose: string;
  duration: string;
  resolution: string;
  aspect: string;
  frameRate: string;
  videoCodec: string;
  audioSpec: string;
  knownLimits: string;
};

type DeliveryItem = {
  id: number;
  label: string;
  required: boolean;
  done: boolean;
  evidence: string;
  custom?: boolean;
};

type DeliverySection = {
  id: string;
  folder: string;
  title: string;
  description: string;
  included: boolean;
  items: DeliveryItem[];
};

const exampleMeta: DeliveryMeta = {
  projectName: '《她每天醒来都会忘记昨天》交付结构示例',
  projectCode: 'FYM',
  version: 'v0.3-structure-demo',
  deliveryDate: '2026-08-29',
  recipient: '示例接收方',
  purpose: '内部结构演练 / 非真实交付',
  duration: '约 90 秒（规划值）',
  resolution: '1920 × 1080',
  aspect: '16:9',
  frameRate: '24 fps',
  videoCodec: 'H.264 审核版；母版待确认',
  audioSpec: '48 kHz / Stereo；响度待确认',
  knownLimits: '这是目录与清单结构示例，真实视频、字幕、声音、授权和最终规格均未完成，不能作为正式交付状态。',
};

const emptyMeta: DeliveryMeta = {
  projectName: '', projectCode: '', version: '', deliveryDate: '', recipient: '', purpose: '', duration: '', resolution: '', aspect: '', frameRate: '', videoCodec: '', audioSpec: '', knownLimits: '',
};

const exampleSections: DeliverySection[] = [
  { id: 'masters', folder: '01_MASTERS', title: '主母版', description: '最终高质量版本与必要的干净版本。', included: true, items: [
    { id: 1, label: '主母版', required: true, done: false, evidence: '待生成真实成片' },
    { id: 2, label: '无字 / 干净版', required: true, done: false, evidence: '是否需要由接收方确认' },
    { id: 3, label: '封面或代表帧', required: false, done: true, evidence: '结构示例占位，不是最终素材' },
  ] },
  { id: 'platform', folder: '02_PLATFORM', title: '平台版本', description: '横版、竖版、短版或压缩发布版。', included: true, items: [
    { id: 1, label: '16:9 发布版', required: true, done: false, evidence: '规格待平台确认' },
    { id: 2, label: '9:16 竖版', required: false, done: false, evidence: '本轮暂不确定是否需要' },
  ] },
  { id: 'captions', folder: '03_CAPTIONS', title: '字幕', description: '外挂字幕、烧录参考与字体说明。', included: true, items: [
    { id: 1, label: 'SRT 字幕', required: true, done: false, evidence: '待成片锁定后制作' },
    { id: 2, label: '字幕烧录参考', required: false, done: false, evidence: '' },
    { id: 3, label: '字体与字形说明', required: true, done: true, evidence: '清单结构已预留' },
  ] },
  { id: 'audio', folder: '04_AUDIO', title: '声音', description: '最终混音以及约定的对白、音乐和音效分轨。', included: true, items: [
    { id: 1, label: '最终混音', required: true, done: false, evidence: '真实声音尚未制作' },
    { id: 2, label: '对白 / 音乐 / 音效分轨', required: false, done: false, evidence: '按交付约定决定' },
  ] },
  { id: 'project', folder: '05_PROJECT', title: '工程', description: '收集后的工程、依赖说明与重新链接测试。', included: true, items: [
    { id: 1, label: '收集后的主工程', required: true, done: false, evidence: '待真实制作开始' },
    { id: 2, label: '从新路径重新打开', required: true, done: false, evidence: '尚未执行恢复测试' },
    { id: 3, label: '字体、插件与软件版本说明', required: true, done: true, evidence: 'README 已预留字段' },
  ] },
  { id: 'rights', folder: '06_RIGHTS', title: '来源与授权', description: '素材来源、使用范围与尚未解决的问题。', included: true, items: [
    { id: 1, label: '音乐 / 字体 / 图片来源表', required: true, done: false, evidence: '待真实素材进入项目后记录' },
    { id: 2, label: '生成工具与输入来源说明', required: true, done: true, evidence: '清单结构已建立' },
    { id: 3, label: '待确认授权项列表', required: true, done: true, evidence: '未知项将明确标记，不默认视为可用' },
  ] },
  { id: 'manifest', folder: '07_MANIFEST', title: '清单与校验', description: 'README、文件清单、校验值与恢复记录。', included: true, items: [
    { id: 1, label: 'README', required: true, done: true, evidence: '由本工具生成初稿' },
    { id: 2, label: 'delivery-manifest.csv', required: true, done: true, evidence: '由本工具生成初稿' },
    { id: 3, label: 'SHA256SUMS.txt', required: true, done: false, evidence: '封箱后在交付目录运行命令' },
    { id: 4, label: '恢复测试记录', required: true, done: false, evidence: '必须对真实工程执行' },
  ] },
];

function cloneSections(sections: DeliverySection[]) {
  return sections.map((section) => ({ ...section, items: section.items.map((item) => ({ ...item })) }));
}

function safePart(value: string, fallback: string) {
  const cleaned = value.trim().replace(/[^A-Za-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '');
  return cleaned || fallback;
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

function downloadText(value: string, filename: string, type: string) {
  const blob = new Blob([value], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

const basicFields: Array<{ key: keyof DeliveryMeta; label: string; note: string; placeholder: string; wide?: boolean }> = [
  { key: 'projectName', label: '项目名称', note: 'README 与交付单标题', placeholder: '例如：项目正式名称', wide: true },
  { key: 'projectCode', label: '项目短码', note: '用于根目录与文件身份', placeholder: '例如：FYM' },
  { key: 'version', label: '交付版本', note: '不要只写 final', placeholder: '例如：v1.0-approved' },
  { key: 'deliveryDate', label: '交付日期', note: 'YYYY-MM-DD', placeholder: '2026-08-29' },
  { key: 'recipient', label: '接收方', note: '可以写团队或用途', placeholder: '例如：内部审核' },
  { key: 'purpose', label: '交付目的', note: '审核、发布、移交或归档', placeholder: '例如：平台发布' },
];

const specFields: Array<{ key: keyof DeliveryMeta; label: string; placeholder: string }> = [
  { key: 'duration', label: '时长', placeholder: '例如：00:01:30:00' },
  { key: 'resolution', label: '分辨率', placeholder: '例如：1920 × 1080' },
  { key: 'aspect', label: '比例', placeholder: '例如：16:9' },
  { key: 'frameRate', label: '帧率', placeholder: '例如：24 fps' },
  { key: 'videoCodec', label: '视频编码', placeholder: '例如：ProRes 422 HQ' },
  { key: 'audioSpec', label: '声音规格', placeholder: '例如：48 kHz / Stereo' },
];

export function DeliveryPackBuilder() {
  const [meta, setMeta] = useState<DeliveryMeta>(exampleMeta);
  const [sections, setSections] = useState<DeliverySection[]>(() => cloneSections(exampleSections));
  const [openSections, setOpenSections] = useState<string[]>(['masters', 'platform']);
  const [copied, setCopied] = useState<CopyTarget | null>(null);
  const [manualCopy, setManualCopy] = useState<string | null>(null);

  const summary = useMemo(() => {
    const included = sections.filter((section) => section.included);
    const items = included.flatMap((section) => section.items.map((item) => ({ ...item, section: section.title })));
    const required = items.filter((item) => item.required);
    const metaChecks = [meta.projectName, meta.projectCode, meta.version, meta.deliveryDate];
    const mastersIncluded = sections.find((section) => section.id === 'masters')?.included ?? false;
    const completedUnits = required.filter((item) => item.done).length + metaChecks.filter((value) => value.trim()).length + (mastersIncluded ? 1 : 0);
    const totalUnits = required.length + metaChecks.length + 1;
    const blockers = [
      ...(!meta.projectName.trim() ? ['项目名称未填写'] : []),
      ...(!meta.projectCode.trim() ? ['项目短码未填写'] : []),
      ...(!meta.version.trim() ? ['交付版本未填写'] : []),
      ...(!meta.deliveryDate.trim() ? ['交付日期未填写'] : []),
      ...(!mastersIncluded ? ['主母版目录未纳入交付'] : []),
      ...required.filter((item) => !item.done).map((item) => `${item.section} · ${item.label || '未命名项目'}`),
    ];
    return { included, items, required, blockers, percent: totalUnits ? Math.round(completedUnits / totalUnits * 100) : 0, ready: blockers.length === 0 };
  }, [meta, sections]);

  const rootName = `${safePart(meta.projectCode, 'PROJECT')}_${safePart(meta.version, 'VERSION')}_DELIVERY`;

  const tree = useMemo(() => {
    const folders = summary.included.flatMap((section) => section.id === 'manifest'
      ? [`├─ ${section.folder}/  # ${section.title}`, '│  ├─ delivery-manifest.csv', '│  └─ SHA256SUMS.txt']
      : [`├─ ${section.folder}/  # ${section.title}`]);
    return [`${rootName}/`, ...folders, '└─ README.md'].join('\n');
  }, [rootName, summary.included]);

  const readme = useMemo(() => [
    `# ${meta.projectName.trim() || '未命名项目'} · 交付说明`, '',
    `- 项目短码：${meta.projectCode.trim() || '待填写'}`,
    `- 交付版本：${meta.version.trim() || '待填写'}`,
    `- 交付日期：${meta.deliveryDate.trim() || '待填写'}`,
    `- 接收方：${meta.recipient.trim() || '待填写'}`,
    `- 交付目的：${meta.purpose.trim() || '待填写'}`, '',
    '## 画面与声音规格', '',
    `- 时长：${meta.duration.trim() || '待填写'}`,
    `- 分辨率 / 比例：${[meta.resolution, meta.aspect].filter((value) => value.trim()).join(' / ') || '待填写'}`,
    `- 帧率：${meta.frameRate.trim() || '待填写'}`,
    `- 视频编码：${meta.videoCodec.trim() || '待填写'}`,
    `- 声音规格：${meta.audioSpec.trim() || '待填写'}`, '',
    '## 本次包含', '',
    ...summary.included.map((section) => `- ${section.folder} · ${section.title}`), '',
    '## 未完成的必需项', '',
    ...(summary.blockers.length ? summary.blockers.map((blocker) => `- [ ] ${blocker}`) : ['- [x] 当前清单没有未完成的必需项']), '',
    '## 已知限制 / 待确认', '', meta.knownLimits.trim() || '待填写', '',
    '## 校验说明', '',
    '文件数量、内容规格、工程重连、来源授权与 SHA-256 校验仍需针对真实交付目录执行。本 README 是清单初稿，不代表工具已经检查本地文件。',
  ].join('\n'), [meta, summary]);

  const manifest = useMemo(() => {
    const cell = (value: string) => `"${value.replaceAll('"', '""')}"`;
    const rows = summary.included.flatMap((section) => section.items.map((item) => [section.folder, section.title, item.label, item.required ? 'required' : 'optional', item.done ? 'confirmed' : 'pending', item.evidence]));
    return [['folder', 'section', 'item_or_file', 'requirement', 'status', 'file_name_or_evidence'], ...rows].map((row) => row.map(cell).join(',')).join('\r\n');
  }, [summary.included]);

  const commands = useMemo(() => [
    '# Windows PowerShell · 在交付根目录运行',
    `Set-Location '${rootName}'`,
    `Get-ChildItem -File -Recurse | Where-Object Name -ne 'SHA256SUMS.txt' | Get-FileHash -Algorithm SHA256 | ForEach-Object { "$($_.Hash.ToLower())  $([IO.Path]::GetRelativePath((Get-Location).Path, $_.Path))" } | Set-Content -Encoding utf8 SHA256SUMS.txt`, '',
    '# macOS / Linux · 在交付根目录运行',
    `cd '${rootName}'`,
    `find . -type f ! -name SHA256SUMS.txt -exec shasum -a 256 {} \\; > SHA256SUMS.txt`, '',
    '# 注意：命令只生成校验清单，不判断视频规格、内容、授权或工程能否恢复。',
  ].join('\n'), [rootName]);

  const combined = useMemo(() => [readme, '', '---', '', '## 建议目录', '', '```text', tree, '```', '', '## 交付清单 CSV', '', '```csv', manifest, '```', '', '## SHA-256 命令', '', '```powershell', commands, '```'].join('\n'), [commands, manifest, readme, tree]);

  function resetCopy() {
    setCopied(null);
    setManualCopy(null);
  }

  function updateMeta(key: keyof DeliveryMeta, value: string) {
    setMeta((current) => ({ ...current, [key]: value }));
    resetCopy();
  }

  function updateSection(sectionId: string, patch: Partial<DeliverySection>) {
    setSections((current) => current.map((section) => section.id === sectionId ? { ...section, ...patch } : section));
    resetCopy();
  }

  function updateItem(sectionId: string, itemId: number, patch: Partial<DeliveryItem>) {
    setSections((current) => current.map((section) => section.id === sectionId ? { ...section, items: section.items.map((item) => item.id === itemId ? { ...item, ...patch } : item) } : section));
    resetCopy();
  }

  function setSectionOpen(sectionId: string, open: boolean) {
    setOpenSections((current) => open
      ? current.includes(sectionId) ? current : [...current, sectionId]
      : current.includes(sectionId) ? current.filter((id) => id !== sectionId) : current);
  }

  function addItem(sectionId: string) {
    setSections((current) => current.map((section) => {
      if (section.id !== sectionId || section.items.length >= 8) return section;
      const nextId = section.items.reduce((max, item) => Math.max(max, item.id), 0) + 1;
      return { ...section, items: [...section.items, { id: nextId, label: '自定义交付项', required: false, done: false, evidence: '', custom: true }] };
    }));
    resetCopy();
  }

  function removeItem(sectionId: string, itemId: number) {
    setSections((current) => current.map((section) => section.id === sectionId ? { ...section, items: section.items.filter((item) => item.id !== itemId) } : section));
    resetCopy();
  }

  function loadExample() {
    setMeta(exampleMeta);
    setSections(cloneSections(exampleSections));
    resetCopy();
  }

  function clearBuilder() {
    setMeta(emptyMeta);
    setSections(cloneSections(exampleSections).map((section) => ({ ...section, items: section.items.map((item) => ({ ...item, done: false, evidence: '' })) })));
    resetCopy();
  }

  async function copyOutput(target: CopyTarget) {
    const value = target === 'tree' ? tree : target === 'readme' ? readme : target === 'manifest' ? manifest : target === 'commands' ? commands : combined;
    if (await copyText(value)) {
      setManualCopy(null);
      setCopied(target);
      window.setTimeout(() => setCopied(null), 1800);
    } else {
      setManualCopy(value);
    }
  }

  return (
    <section className="delivery-workbench" aria-label="交付清单生成器">
      <div className="delivery-editor">
        <div className="delivery-panel-heading">
          <div><span className="mono">01 / NAME THE PACKAGE</span><h2>先写清交付身份，<br />再开始装箱。</h2></div>
          <div><button type="button" onClick={loadExample}>载入示例</button><button type="button" onClick={clearBuilder}>清空</button></div>
        </div>

        <div className="delivery-basic-grid">
          {basicFields.map((field) => <label className={field.wide ? 'is-wide' : ''} key={field.key}><span><strong>{field.label}</strong><small>{field.note}</small></span><input value={meta[field.key]} placeholder={field.placeholder} onChange={(event) => updateMeta(field.key, event.target.value)} /></label>)}
        </div>

        <div className="delivery-spec-heading"><span className="mono">02 / DECLARE THE SPECS</span><h3>不要让扩展名替你说明规格。</h3></div>
        <div className="delivery-spec-grid">
          {specFields.map((field) => <label key={field.key}><span>{field.label}</span><input value={meta[field.key]} placeholder={field.placeholder} onChange={(event) => updateMeta(field.key, event.target.value)} /></label>)}
        </div>

        <div className="delivery-sections-heading"><span className="mono">03 / PACK AND CONFIRM</span><h3>每个目录，都要知道为什么存在。</h3></div>
        <div className="delivery-section-list">
          {sections.map((section, index) => {
            const done = section.items.filter((item) => item.done).length;
            return <details className={`delivery-section delivery-tone-${index}`} open={openSections.includes(section.id)} onToggle={(event) => setSectionOpen(section.id, event.currentTarget.open)} key={section.id}>
              <summary><span className="mono">{section.folder}</span><strong>{section.title}</strong><small>{section.included ? `${done} / ${section.items.length} 已确认` : '本次不包含'}</small><i>＋</i></summary>
              <div className="delivery-section-body">
                <label className="delivery-include-switch"><input type="checkbox" checked={section.included} onChange={(event) => updateSection(section.id, { included: event.target.checked })} /><span>{section.included ? '纳入本次交付' : '不纳入本次交付'}</span><i>{section.included ? 'IN' : 'OUT'}</i></label>
                <p>{section.description}</p>
                {section.included && <div className="delivery-item-list">{section.items.map((item) => <article className={item.done ? 'is-done' : ''} key={item.id}>
                  <label className="delivery-done-box"><input type="checkbox" checked={item.done} onChange={(event) => updateItem(section.id, item.id, { done: event.target.checked })} /><i>{item.done ? '✓' : ''}</i><span className="sr-only">标记完成</span></label>
                  <input className="delivery-item-name" value={item.label} aria-label={`${section.title}项目名称`} onChange={(event) => updateItem(section.id, item.id, { label: event.target.value })} />
                  <label className="delivery-required-switch"><input type="checkbox" checked={item.required} onChange={(event) => updateItem(section.id, item.id, { required: event.target.checked })} /><span>{item.required ? '必须' : '可选'}</span></label>
                  <input className="delivery-item-evidence" value={item.evidence} aria-label={`${item.label}的文件名或证据`} placeholder="文件名、路径、说明或待确认项" onChange={(event) => updateItem(section.id, item.id, { evidence: event.target.value })} />
                  {item.custom && <button type="button" onClick={() => removeItem(section.id, item.id)} aria-label={`删除 ${item.label}`}>×</button>}
                </article>)}</div>}
                {section.included && <button type="button" className="delivery-add-item" disabled={section.items.length >= 8} onClick={() => addItem(section.id)}>{section.items.length >= 8 ? '本目录最多 8 项' : '＋ 添加自定义项'}</button>}
              </div>
            </details>;
          })}
        </div>

        <label className="delivery-limits-field"><span><strong>已知限制 / 待确认</strong><small>不确定的内容要明确留下，不要默认视为完成</small></span><textarea rows={4} value={meta.knownLimits} placeholder="例如：母版编码待接收方确认；字体授权范围仍在核对。" onChange={(event) => updateMeta('knownLimits', event.target.value)} /></label>
      </div>

      <aside className={`delivery-case ${summary.ready ? 'is-sealed' : ''}`} aria-live="polite">
        <span className="delivery-case-handle" aria-hidden="true" />
        <div className="delivery-case-topline mono"><span>DELIVERY FLIGHT CASE</span><span>{summary.included.length} FOLDERS</span></div>
        <div className="delivery-case-score"><strong>{summary.percent}</strong><span>%<small>必需信息与必需项</small></span></div>
        <div className="delivery-progress"><i style={{ width: `${summary.percent}%` }} /></div>
        <div className="delivery-folder-tabs">{sections.map((section, index) => <article className={`${section.included ? 'is-included' : ''} delivery-tab-${index}`} key={section.id}><span className="mono">{section.folder}</span><b>{section.title}</b><i>{section.included ? `${section.items.filter((item) => item.done).length}/${section.items.length}` : 'OUT'}</i></article>)}</div>
        <div className="delivery-seal"><span className="mono">{summary.ready ? 'READY TO SEAL' : 'CASE STILL OPEN'}</span><strong>{summary.ready ? '可以封箱' : `${summary.blockers.length} 项待处理`}</strong></div>
        {!summary.ready && <ul>{summary.blockers.slice(0, 4).map((blocker, index) => <li key={`${index}-${blocker}`}>{blocker}</li>)}{summary.blockers.length > 4 && <li>还有 {summary.blockers.length - 4} 项，见 README</li>}</ul>}
        <button type="button" className="delivery-copy-all" onClick={() => copyOutput('all')}>{copied === 'all' ? '完整交付计划已复制 ✓' : '复制完整交付计划 ↗'}</button>
        <small>工具只整理你填写和确认的项目，不读取文件、不验证编码、不判断授权，也不代表已经完成真实交付。</small>
      </aside>

      <section className="delivery-output-section">
        <div className="delivery-output-heading"><div><span className="mono">04 / PACKAGE OUTPUTS</span><h2>目录、说明、清单和校验，<br />一次放到同一处。</h2></div><p>复制后仍要把真实文件名、规格检查、恢复结果和授权状态补齐。校验命令只确认文件字节是否变化。</p></div>
        <div className="delivery-output-grid">
          <article><div><span className="mono">FOLDER TREE</span><button type="button" onClick={() => copyOutput('tree')}>{copied === 'tree' ? '已复制 ✓' : '复制目录'}</button></div><pre>{tree}</pre></article>
          <article><div><span className="mono">README.MD</span><span><button type="button" onClick={() => copyOutput('readme')}>{copied === 'readme' ? '已复制 ✓' : '复制'}</button><button type="button" onClick={() => downloadText(readme, `${rootName}_README.md`, 'text/markdown;charset=utf-8')}>下载</button></span></div><pre>{readme}</pre></article>
          <article><div><span className="mono">DELIVERY-MANIFEST.CSV</span><span><button type="button" onClick={() => copyOutput('manifest')}>{copied === 'manifest' ? '已复制 ✓' : '复制'}</button><button type="button" onClick={() => downloadText(`\uFEFF${manifest}`, `${rootName}_delivery-manifest.csv`, 'text/csv;charset=utf-8')}>下载</button></span></div><pre>{manifest}</pre></article>
          <article><div><span className="mono">SHA-256 COMMANDS</span><button type="button" onClick={() => copyOutput('commands')}>{copied === 'commands' ? '已复制 ✓' : '复制命令'}</button></div><pre>{commands}</pre></article>
        </div>
      </section>

      {manualCopy && <aside className="delivery-copy-fallback"><div><span className="mono">MANUAL COPY / 浏览器限制</span><p>点击文本框后按 Ctrl+A，再按 Ctrl+C。</p></div><button type="button" onClick={() => setManualCopy(null)}>关闭 ×</button><textarea readOnly value={manualCopy} aria-label="手动复制交付计划" /></aside>}
    </section>
  );
}
