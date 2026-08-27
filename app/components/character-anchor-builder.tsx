'use client';

import { useMemo, useState } from 'react';

type AnchorValues = {
  name: string;
  face: string;
  hair: string;
  accessories: string;
  wardrobe: string;
  silhouette: string;
  style: string;
  allowed: string;
  locked: string;
};

type AnchorKey = keyof AnchorValues;
type OutputKey = 'card' | 'prompt' | 'checklist';

const emptyValues: AnchorValues = {
  name: '',
  face: '',
  hair: '',
  accessories: '',
  wardrobe: '',
  silhouette: '',
  style: '',
  allowed: '',
  locked: '',
};

const exampleValues: AnchorValues = {
  name: '角色 A',
  face: '圆偏椭圆脸，下颌线柔和，平直眉，深棕色眼睛',
  hair: '齐下巴黑色短发，右侧分缝，发尾轻微内扣',
  accessories: '右侧蓝色发夹，红色三角耳饰',
  wardrobe: '芥末黄色短外套，白色圆领内搭，深蓝色长裤',
  silhouette: '肩线窄，身形轻薄，不使用宽大帽檐或蓬松围巾',
  style: '写实电影感，自然肤质，柔和日光，低饱和背景',
  allowed: '表情、景别、场景、动作和光线方向可以变化',
  locked: '发型长度、发夹位置、耳饰形状、外套主色不可漂移',
};

const anchorFields: Array<{ key: AnchorKey; number: string; label: string; note: string; placeholder: string }> = [
  { key: 'name', number: '00', label: '角色名称', note: '便于在多角色项目里辨认', placeholder: '例如：角色 A / 林真' },
  { key: 'face', number: '01', label: '脸部特征', note: '写稳定结构，不写一时表情', placeholder: '脸型、眉眼、鼻唇、肤色或年龄感' },
  { key: 'hair', number: '02', label: '头发', note: '长度、颜色、分缝和轮廓', placeholder: '例如：齐下巴黑色短发，右侧分缝' },
  { key: 'accessories', number: '03', label: '高识别配饰', note: '少而醒目，注明位置', placeholder: '例如：右侧蓝色发夹，红色三角耳饰' },
  { key: 'wardrobe', number: '04', label: '服装与主色', note: '先写大色块，再补材质', placeholder: '例如：芥末黄外套，白色内搭' },
  { key: 'silhouette', number: '05', label: '体型与轮廓', note: '远景里仍能辨认的外形', placeholder: '例如：肩线窄，身形轻薄' },
  { key: 'style', number: '06', label: '视觉媒介', note: '风格属于画面，不属于人物身份', placeholder: '例如：写实电影感，自然肤质，柔和日光' },
  { key: 'allowed', number: '07', label: '允许变化', note: '告诉生成任务哪里可以自由', placeholder: '例如：表情、景别、场景和动作' },
  { key: 'locked', number: '08', label: '必须锁定', note: '列出最不能漂移的识别点', placeholder: '例如：发型长度、配饰位置、服装主色' },
];

const identityKeys: AnchorKey[] = ['face', 'hair', 'accessories', 'wardrobe', 'silhouette', 'allowed', 'locked'];

function line(label: string, value: string) {
  return value.trim() ? `- ${label}：${value.trim()}` : '';
}

function buildOutputs(values: AnchorValues) {
  const name = values.name.trim() || '未命名角色';
  const card = [
    `# ${name} / CHARACTER ANCHOR`,
    '',
    line('脸部', values.face),
    line('头发', values.hair),
    line('高识别配饰', values.accessories),
    line('服装与主色', values.wardrobe),
    line('体型与轮廓', values.silhouette),
    line('视觉媒介', values.style),
    line('允许变化', values.allowed),
    line('必须锁定', values.locked),
  ].filter((item, index, array) => item || (index === 1 && array.length > 2)).join('\n');

  const promptSections = [
    ['CHARACTER IDENTITY', [values.face, values.hair, values.accessories, values.wardrobe, values.silhouette].filter(Boolean).join('；')],
    ['VISUAL MEDIUM', values.style],
    ['ALLOWED VARIATION', values.allowed],
    ['IDENTITY LOCK', values.locked],
  ].filter(([, value]) => value.trim());
  const prompt = [`${name} — IMAGE ANCHOR`, ...promptSections.flatMap(([label, value]) => ['', `${label}:`, value.trim()])].join('\n');

  const checks = [
    ['脸部结构与母版相符', values.face],
    ['发型长度、颜色与分缝相符', values.hair],
    ['配饰形状与位置相符', values.accessories],
    ['服装主色和大轮廓相符', values.wardrobe],
    ['体型与整体剪影相符', values.silhouette],
    ['允许变化没有被误判为身份漂移', values.allowed],
    ['所有必须锁定项均未漂移', values.locked],
  ].filter(([, value]) => value.trim());
  const checklist = [`## ${name} / 视频一致性验收`, '', ...checks.map(([label, value]) => `- [ ] ${label}：${value.trim()}`), '', '- [ ] 运动过程中没有突然换脸、增减配饰或服装变色', '- [ ] 遮挡前后仍能确认是同一角色', '- [ ] 问题镜头已记录时间点，便于单独返修'].join('\n');

  return { card, prompt, checklist };
}

export function CharacterAnchorBuilder() {
  const [values, setValues] = useState<AnchorValues>(emptyValues);
  const [copied, setCopied] = useState<OutputKey | null>(null);
  const outputs = useMemo(() => buildOutputs(values), [values]);
  const completed = identityKeys.filter((key) => values[key].trim()).length;
  const canCopy = completed > 0;

  function updateValue(key: AnchorKey, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
    setCopied(null);
  }

  async function copyOutput(key: OutputKey) {
    try {
      await navigator.clipboard.writeText(outputs[key]);
      setCopied(key);
      window.setTimeout(() => setCopied(null), 1800);
    } catch {
      setCopied(null);
    }
  }

  return (
    <section className="anchor-workbench" aria-label="角色锚点卡生成器">
      <div className="anchor-input-panel">
        <div className="anchor-panel-heading">
          <div>
            <span className="mono">01 / DEFINE THE CHARACTER</span>
            <h2>先写不会变的，<br />再写允许改变的。</h2>
          </div>
          <div className="anchor-panel-actions">
            <button type="button" onClick={() => setValues(exampleValues)}>载入示例</button>
            <button type="button" onClick={() => setValues(emptyValues)}>清空</button>
          </div>
        </div>

        <div className="anchor-fields">
          {anchorFields.map((field) => (
            <label className="anchor-field" key={field.key}>
              <span className="anchor-field-index mono">{field.number}</span>
              <span className="anchor-field-copy"><strong>{field.label}</strong><small>{field.note}</small></span>
              <textarea
                rows={field.key === 'name' ? 1 : 2}
                value={values[field.key]}
                placeholder={field.placeholder}
                onChange={(event) => updateValue(field.key, event.target.value)}
              />
            </label>
          ))}
        </div>
      </div>

      <aside className="anchor-status-card">
        <div className="anchor-status-topline mono"><span>ANCHOR COVERAGE</span><span>{completed} / {identityKeys.length}</span></div>
        <div className="anchor-status-number"><strong>{completed}</strong><span>个身份锚点<br />已经写清楚</span></div>
        <div className="anchor-meter" aria-label={`已填写 ${completed} 个，共 ${identityKeys.length} 个身份锚点`}>
          {identityKeys.map((key, index) => <i className={values[key].trim() ? 'is-filled' : ''} key={key} aria-hidden="true">{index + 1}</i>)}
        </div>
        <p>{completed === 0 ? '从脸部、头发或服装开始。它们应该描述可见事实，而不是“漂亮”“高级”这类抽象评价。' : completed < 5 ? '已经有了起点。继续补足远景也能辨认的轮廓，以及最不能漂移的细节。' : '锚点已经足够形成工作卡。生成前仍应准备清晰、无瑕疵的参考图。'}</p>
        <small>内容只在当前浏览器页面里处理，不会上传或保存。</small>
      </aside>

      <section className="anchor-output-section">
        <div className="anchor-output-heading">
          <div><span className="mono">02 / COPY &amp; USE</span><h2>一份信息，整理成<br />三种工作格式。</h2></div>
          <p>锚点卡给人看，图像锚点给生成任务用，验收清单用于逐镜检查。它们不会替代参考图，也不承诺模型一定保持一致。</p>
        </div>

        <div className="anchor-output-grid">
          <OutputCard title="角色参考卡" label="A / REFERENCE CARD" text={outputs.card} outputKey="card" canCopy={canCopy} copied={copied} onCopy={copyOutput} />
          <OutputCard title="图像生成锚点" label="B / IMAGE ANCHOR" text={outputs.prompt} outputKey="prompt" canCopy={canCopy} copied={copied} onCopy={copyOutput} />
          <OutputCard title="视频验收清单" label="C / VIDEO CHECK" text={outputs.checklist} outputKey="checklist" canCopy={canCopy} copied={copied} onCopy={copyOutput} />
        </div>
      </section>
    </section>
  );
}

function OutputCard({ title, label, text, outputKey, canCopy, copied, onCopy }: { title: string; label: string; text: string; outputKey: OutputKey; canCopy: boolean; copied: OutputKey | null; onCopy: (key: OutputKey) => void }) {
  return (
    <article className={`anchor-output-card anchor-output-${outputKey}`}>
      <div className="anchor-output-topline"><span className="mono">{label}</span><button type="button" disabled={!canCopy} onClick={() => onCopy(outputKey)}>{copied === outputKey ? '已复制 ✓' : '复制 ↗'}</button></div>
      <h3>{title}</h3>
      {canCopy ? <pre>{text}</pre> : <div className="anchor-output-empty"><span aria-hidden="true">＋</span><p>填写至少一个身份锚点后，这里会生成可复制内容。</p></div>}
    </article>
  );
}
