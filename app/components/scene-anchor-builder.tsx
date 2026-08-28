'use client';

import { useMemo, useState } from 'react';

type SceneValues = {
  name: string;
  structure: string;
  connections: string;
  fixtures: string;
  materials: string;
  props: string;
  lighting: string;
  weather: string;
  sound: string;
  shot: string;
  camera: string;
  visible: string;
  movement: string;
  allowed: string;
  locked: string;
};

type SceneKey = keyof SceneValues;
type OutputKey = 'master' | 'prompt' | 'checklist';

const emptyValues: SceneValues = {
  name: '', structure: '', connections: '', fixtures: '', materials: '', props: '', lighting: '', weather: '', sound: '',
  shot: '', camera: '', visible: '', movement: '', allowed: '', locked: '',
};

const exampleValues: SceneValues = {
  name: '雨夜旧公寓',
  structure: '狭长矩形房间；北墙一扇窄窗；东墙唯一的深绿色木门；没有第二扇窗',
  connections: '东墙木门向内打开，门外连接狭长走廊；南侧不设出口',
  fixtures: '窗下旧木桌；西墙低书柜；南侧单人床，床头靠西；家具位置固定',
  materials: '深色磨损木地板；灰绿色剥落墙面；旧木家具；黄铜门把',
  props: '白色信封已经拆开，信纸在人物右手；红色收音机位于书柜顶层且关闭；半杯水在桌面左后方',
  lighting: '北窗外冷蓝街灯为主光；桌面右后方暖灯只照亮手和信纸；走廊比房间暗',
  weather: '持续中雨；窗玻璃有细密水痕；弱风偶尔轻动窗帘；室内地面保持干燥',
  sound: '连续雨声与轻微房间低鸣；门关闭时走廊声音较闷',
  shot: '镜头 06 / 人物听见门外声音',
  camera: 'C2 窗侧中景，摄影机看向人物与东墙房门；人物在画面左侧',
  visible: '深绿色木门、窗下木桌、书柜顶层红色收音机、拆开的白色信封',
  movement: '人物缓慢抬头；摄影机固定；窗帘只有很轻的风动',
  allowed: '人物动作、景别与焦点可以变化；门打开后允许走廊暖光进入地面',
  locked: '唯一的东墙木门、北墙窄窗、固定家具关系、道具当前状态、两盏光源的实际位置不能漂移',
};

const sceneFields: Array<{ key: SceneKey; number: string; label: string; note: string; placeholder: string; group: 'identity' | 'state' | 'shot' }> = [
  { key: 'name', number: '00', label: '场景名称', note: '给地点一个稳定、可复用的名字', placeholder: '例如：雨夜旧公寓', group: 'identity' },
  { key: 'structure', number: '01', label: '空间结构', note: '房间形状、门窗数量与所在墙面', placeholder: '例如：狭长矩形；北墙一扇窗；东墙唯一的门', group: 'identity' },
  { key: 'connections', number: '02', label: '连接空间', note: '门外通向哪里，入口怎样打开', placeholder: '例如：东墙木门通往狭长走廊，向内打开', group: 'identity' },
  { key: 'fixtures', number: '03', label: '固定家具', note: '不能在不同机位间随意移动的关系', placeholder: '例如：窗下木桌；西墙书柜；南侧单人床', group: 'identity' },
  { key: 'materials', number: '04', label: '材质与年代', note: '地面、墙面、家具和磨损', placeholder: '例如：磨损深色木地板，灰绿色剥落墙面', group: 'identity' },
  { key: 'props', number: '05', label: '道具当前状态', note: '位置、数量、开合与动作后的结果', placeholder: '例如：信封已拆开；收音机在书柜顶层且关闭', group: 'state' },
  { key: 'lighting', number: '06', label: '光线账本', note: '真实来源、方向、软硬与亮暗层级', placeholder: '例如：北窗冷光为主；桌灯暖光只照亮手', group: 'state' },
  { key: 'weather', number: '07', label: '天气与湿度', note: '雨雾风雪、窗面与地面状态', placeholder: '例如：持续中雨；窗有水痕；室内地面干燥', group: 'state' },
  { key: 'sound', number: '08', label: '空间声音', note: '连续环境底、远近与混响', placeholder: '例如：连续雨声；关门后走廊声音较闷', group: 'state' },
  { key: 'shot', number: '09', label: '当前镜头', note: '镜号和这一镜的叙事任务', placeholder: '例如：镜头 06 / 人物听见门外声音', group: 'shot' },
  { key: 'camera', number: '10', label: '机位与方向', note: '摄影机位置、朝向和人物画面位置', placeholder: '例如：C2 窗侧中景，看向人物与东墙房门', group: 'shot' },
  { key: 'visible', number: '11', label: '本镜可见锚点', note: '只保留画面里真正看得见的 3–5 项', placeholder: '例如：木门、窗下木桌、红色收音机、拆开信封', group: 'shot' },
  { key: 'movement', number: '12', label: '人物与环境运动', note: '谁动、怎样动，摄影机是否移动', placeholder: '例如：人物缓慢抬头；摄影机固定；窗帘轻动', group: 'shot' },
  { key: 'allowed', number: '13', label: '允许变化', note: '为镜头和故事留下明确自由度', placeholder: '例如：景别、焦点、人物动作可以变化', group: 'shot' },
  { key: 'locked', number: '14', label: '必须锁定', note: '最不能无因改变的空间事实', placeholder: '例如：门窗位置、固定家具、道具状态与光源位置', group: 'shot' },
];

const coverageKeys: SceneKey[] = ['structure', 'fixtures', 'materials', 'props', 'lighting', 'weather', 'locked'];

function line(label: string, value: string) {
  return value.trim() ? `- ${label}：${value.trim()}` : '';
}

function buildOutputs(values: SceneValues) {
  const name = values.name.trim() || '未命名场景';
  const master = [
    `# ${name} / SCENE ANCHOR`, '',
    line('空间结构', values.structure), line('连接空间', values.connections), line('固定家具', values.fixtures), line('材质与年代', values.materials),
    '', '## 当前场景状态',
    line('道具', values.props), line('光线', values.lighting), line('天气', values.weather), line('空间声音', values.sound),
    '', line('允许变化', values.allowed), line('必须锁定', values.locked),
  ].filter((item, index, array) => item || (index > 0 && array[index - 1] !== '')).join('\n');

  const promptSections = [
    ['SCENE ANCHOR', [values.structure, values.connections, values.fixtures, values.materials].filter(Boolean).join('；')],
    ['CURRENT STATE', [values.props, values.lighting, values.weather, values.sound].filter(Boolean).join('；')],
    ['CURRENT SHOT', [values.shot, values.camera, values.visible].filter(Boolean).join('；')],
    ['MOTION', values.movement], ['ALLOWED VARIATION', values.allowed], ['SCENE LOCK', values.locked],
  ].filter(([, value]) => value.trim());
  const prompt = [`${name} — SHOT BLOCK`, ...promptSections.flatMap(([label, value]) => ['', `${label}:`, value.trim()])].join('\n');

  const checks = [
    ['门窗数量、位置与连接空间相符', [values.structure, values.connections].filter(Boolean).join('；')],
    ['固定家具关系相符', values.fixtures], ['墙面、地面与家具材质相符', values.materials], ['道具状态只沿剧情向前变化', values.props],
    ['主光来源、方向与亮暗层级相符', values.lighting], ['天气、湿度与环境声处在同一阶段', [values.weather, values.sound].filter(Boolean).join('；')],
    ['本镜可见锚点都能在画面中核对', values.visible], ['所有必须锁定项均未漂移', values.locked],
  ].filter(([, value]) => value.trim());
  const checklist = [`## ${name} / 场景一致性验收`, '', ...checks.map(([label, value]) => `- [ ] ${label}：${value.trim()}`), '', '- [ ] 机位变化可以用平面关系解释，不像进入另一间房', '- [ ] 颜色匹配没有掩盖结构、道具或阴影方向错误', '- [ ] 问题已标记为结构 / 道具 / 材质 / 光线 / 天气中的具体一层'].join('\n');
  return { master, prompt, checklist };
}

function short(value: string, fallback: string) {
  const clean = value.trim();
  return clean ? `${clean.slice(0, 14)}${clean.length > 14 ? '…' : ''}` : fallback;
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

export function SceneAnchorBuilder() {
  const [values, setValues] = useState<SceneValues>(emptyValues);
  const [copied, setCopied] = useState<OutputKey | null>(null);
  const [manualCopy, setManualCopy] = useState<string | null>(null);
  const outputs = useMemo(() => buildOutputs(values), [values]);
  const completed = coverageKeys.filter((key) => values[key].trim()).length;
  const canCopy = completed > 0;

  function updateValue(key: SceneKey, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
    setCopied(null);
    setManualCopy(null);
  }

  async function copyOutput(key: OutputKey) {
    if (await copyText(outputs[key])) {
      setManualCopy(null);
      setCopied(key);
      window.setTimeout(() => setCopied(null), 1800);
    } else {
      setManualCopy(outputs[key]);
    }
  }

  return (
    <section className="scene-workbench" aria-label="场景锚点卡生成器">
      <div className="scene-input-panel">
        <div className="scene-panel-heading">
          <div><span className="mono">01 / DEFINE THE WORLD</span><h2>先把空间画清楚，<br />再让摄影机移动。</h2></div>
          <div><button type="button" onClick={() => setValues(exampleValues)}>载入示例</button><button type="button" onClick={() => setValues(emptyValues)}>清空</button></div>
        </div>

        {(['identity', 'state', 'shot'] as const).map((group) => <section className={`scene-field-group scene-group-${group}`} key={group}>
          <div className="scene-group-heading"><span className="mono">{group === 'identity' ? 'A / 场景身份' : group === 'state' ? 'B / 当前状态' : 'C / 当前镜头'}</span><p>{group === 'identity' ? '不会随机位改变的空间事实' : group === 'state' ? '会沿故事时间向前变化的事实' : '这一镜允许变化与必须锁定的接口'}</p></div>
          {sceneFields.filter((field) => field.group === group).map((field) => <label className="scene-field" key={field.key}>
            <span className="scene-field-index mono">{field.number}</span>
            <span className="scene-field-copy"><strong>{field.label}</strong><small>{field.note}</small></span>
            <textarea rows={field.key === 'name' ? 1 : 2} value={values[field.key]} placeholder={field.placeholder} onChange={(event) => updateValue(field.key, event.target.value)} />
          </label>)}
        </section>)}
      </div>

      <aside className="scene-blueprint-card">
        <div className="scene-blueprint-topline mono"><span>SPACE BLUEPRINT</span><span>{completed} / {coverageKeys.length}</span></div>
        <div className="scene-floorplan" aria-label="场景蓝图预览">
          <span className={`scene-plan-window ${values.structure.trim() ? 'is-filled' : ''}`}>WINDOW</span>
          <span className={`scene-plan-door ${values.connections.trim() ? 'is-filled' : ''}`}>DOOR</span>
          <span className={`scene-plan-table ${values.fixtures.trim() ? 'is-filled' : ''}`}>TABLE</span>
          <span className={`scene-plan-bed ${values.fixtures.trim() ? 'is-filled' : ''}`}>BED</span>
          <span className={`scene-plan-prop ${values.props.trim() ? 'is-filled' : ''}`}>PROP</span>
          <span className={`scene-plan-camera ${values.camera.trim() ? 'is-filled' : ''}`}>C</span>
          <i className={`scene-plan-light ${values.lighting.trim() ? 'is-filled' : ''}`} />
        </div>
        <h2 className="scene-blueprint-name">{values.name.trim() || '未命名场景'}</h2>
        <div className="scene-blueprint-labels"><span><small>STRUCTURE</small><b>{short(values.structure, '等待空间结构')}</b></span><span><small>STATE</small><b>{short(values.props, '等待道具状态')}</b></span><span><small>SHOT</small><b>{short(values.shot, '等待当前镜头')}</b></span></div>
        <p className="scene-blueprint-guide">{completed === 0 ? '先从空间结构、固定家具或材质开始。蓝图只展示已填写的可见事实。' : completed < 5 ? '场景已经有了轮廓。继续补足光线、天气和必须锁定项。' : '场景身份已经足够形成工作卡；仍需准备环境 Plates 并在时间线成组验收。'}</p>
        <small className="scene-blueprint-local">所有内容只在当前浏览器页面处理，不上传、不保存。</small>
      </aside>

      <section className="scene-output-section">
        <div className="scene-output-heading"><div><span className="mono">02 / COPY &amp; USE</span><h2>一张蓝图，拆成<br />三种制作接口。</h2></div><p>场景母版给团队看，单镜 Prompt 块只调用当前画面需要的事实，验收清单用于成组比较。它们不替代参考图和平面图。</p></div>
        <div className="scene-output-grid">
          <SceneOutputCard title="场景母版卡" label="A / MASTER CARD" text={outputs.master} outputKey="master" canCopy={canCopy} copied={copied} onCopy={copyOutput} />
          <SceneOutputCard title="单镜 Prompt 块" label="B / SHOT BLOCK" text={outputs.prompt} outputKey="prompt" canCopy={canCopy} copied={copied} onCopy={copyOutput} />
          <SceneOutputCard title="场景验收清单" label="C / SCENE CHECK" text={outputs.checklist} outputKey="checklist" canCopy={canCopy} copied={copied} onCopy={copyOutput} />
        </div>
      </section>

      {manualCopy && <aside className="scene-copy-fallback"><div><span className="mono">MANUAL COPY / 浏览器限制</span><p>点击文本框后按 Ctrl+A，再按 Ctrl+C。</p></div><button type="button" onClick={() => setManualCopy(null)}>关闭 ×</button><textarea readOnly value={manualCopy} aria-label="手动复制场景锚点内容" /></aside>}
    </section>
  );
}

function SceneOutputCard({ title, label, text, outputKey, canCopy, copied, onCopy }: { title: string; label: string; text: string; outputKey: OutputKey; canCopy: boolean; copied: OutputKey | null; onCopy: (key: OutputKey) => void }) {
  return <article className={`scene-output-card scene-output-${outputKey}`}><div className="scene-output-topline"><span className="mono">{label}</span><button type="button" disabled={!canCopy} onClick={() => onCopy(outputKey)}>{copied === outputKey ? '已复制 ✓' : '复制 ↗'}</button></div><h3>{title}</h3>{canCopy ? <pre>{text}</pre> : <div className="scene-output-empty"><span aria-hidden="true">＋</span><p>填写至少一项场景锚点后，这里会生成可复制内容。</p></div>}</article>;
}
