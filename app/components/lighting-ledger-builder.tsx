'use client';

import type { CSSProperties } from 'react';
import { useEffect, useMemo, useState } from 'react';

type Direction = 'N' | 'E' | 'S' | 'W';
type ScreenRelation = 'left' | 'right' | 'front' | 'back';
type Temperature = 'cool' | 'neutral' | 'warm';

type Shot = {
  id: string;
  name: string;
  size: string;
  camera: Direction;
  subjectFacing: Direction;
  observed: '' | ScreenRelation;
  note: string;
};

type LedgerState = {
  sceneName: string;
  keyLabel: string;
  keyDirection: Direction;
  keyTemperature: Temperature;
  keyQuality: 'soft' | 'hard';
  practical: string;
  shots: Shot[];
};

type CopyKey = 'interfaces' | 'checklist';

const storageKey = 'jing-lighting-ledger-v1';
const directionLabels: Record<Direction, string> = { N: '北', E: '东', S: '南', W: '西' };
const relationLabels: Record<ScreenRelation, string> = { left: '画面左侧', right: '画面右侧', front: '正面来光', back: '背后来光' };
const temperatureLabels: Record<Temperature, string> = { cool: '偏冷', neutral: '中性', warm: '偏暖' };
const vectors: Record<Direction, readonly [number, number]> = { N: [0, 1], E: [1, 0], S: [0, -1], W: [-1, 0] };

const emptyState: LedgerState = {
  sceneName: '',
  keyLabel: '',
  keyDirection: 'N',
  keyTemperature: 'cool',
  keyQuality: 'soft',
  practical: '',
  shots: [
    { id: 'shot-1', name: '镜头 01', size: '中景', camera: 'S', subjectFacing: 'N', observed: '', note: '' },
    { id: 'shot-2', name: '镜头 02', size: '近景', camera: 'E', subjectFacing: 'N', observed: '', note: '' },
  ],
};

const exampleState: LedgerState = {
  sceneName: '北窗工作室',
  keyLabel: '北窗冷光',
  keyDirection: 'N',
  keyTemperature: 'cool',
  keyQuality: 'soft',
  practical: '桌面右后方暖灯，只照亮信纸与手',
  shots: [
    { id: 'example-1', name: '建立镜头', size: '全景', camera: 'S', subjectFacing: 'N', observed: '', note: '' },
    { id: 'example-2', name: '人物转头', size: '中近景', camera: 'E', subjectFacing: 'E', observed: '', note: '' },
    { id: 'example-3', name: '信纸特写', size: '特写', camera: 'S', subjectFacing: 'N', observed: '', note: '' },
    { id: 'example-4', name: '反向机位', size: '越肩反打', camera: 'N', subjectFacing: 'S', observed: '', note: '' },
  ],
};

function screenRelation(lightDirection: Direction, cameraDirection: Direction): ScreenRelation {
  const light = vectors[lightDirection];
  const camera = vectors[cameraDirection];
  const screenRight: readonly [number, number] = [-camera[1], camera[0]];
  const side = light[0] * screenRight[0] + light[1] * screenRight[1];
  const front = light[0] * camera[0] + light[1] * camera[1];
  if (Math.abs(side) > Math.abs(front)) return side > 0 ? 'right' : 'left';
  return front > 0 ? 'front' : 'back';
}

function subjectRelation(lightDirection: Direction, facingDirection: Direction) {
  const light = vectors[lightDirection];
  const facing = vectors[facingDirection];
  const subjectRight: readonly [number, number] = [facing[1], -facing[0]];
  const side = light[0] * subjectRight[0] + light[1] * subjectRight[1];
  const front = light[0] * facing[0] + light[1] * facing[1];
  if (Math.abs(side) > Math.abs(front)) return side > 0 ? '人物右侧受光' : '人物左侧受光';
  return front > 0 ? '人物正面受光' : '人物背面受光';
}

function oppositeRelation(relation: ScreenRelation) {
  return relation === 'left' ? '影子倾向画面右侧' : relation === 'right' ? '影子倾向画面左侧' : relation === 'front' ? '影子向画面深处' : '影子朝向摄影机';
}

function short(value: string, fallback: string) {
  const clean = value.trim();
  return clean ? `${clean.slice(0, 18)}${clean.length > 18 ? '…' : ''}` : fallback;
}

function safeCell(value: string) {
  return value.replaceAll('|', '\\|').replaceAll('\n', ' ');
}

function buildOutputs(state: LedgerState) {
  const scene = state.sceneName.trim() || '未命名场景';
  const source = state.keyLabel.trim() || `${directionLabels[state.keyDirection]}侧主光`;
  const fixedLine = `${source}固定在${directionLabels[state.keyDirection]}侧，${temperatureLabels[state.keyTemperature]}、${state.keyQuality === 'soft' ? '柔和' : '偏硬'}；不随机位移动`;
  const interfaces = [
    `# ${scene} / 逐镜光线接口`, '',
    `> 世界坐标：${fixedLine}。`,
    state.practical.trim() ? `> 实景灯：${state.practical.trim()}。` : '', '',
    ...state.shots.flatMap((shot, index) => {
      const expected = screenRelation(state.keyDirection, shot.camera);
      return [
        `## ${String(index + 1).padStart(2, '0')} · ${shot.name.trim() || `镜头 ${index + 1}`}`,
        `- 景别：${shot.size || '未填写'}`,
        `- 摄影机：位于${directionLabels[shot.camera]}侧，看向人物`,
        `- 人物：面向${directionLabels[shot.subjectFacing]}侧`,
        `- 世界灯位：${fixedLine}`,
        `- 预期画面关系：${relationLabels[expected]}；${subjectRelation(state.keyDirection, shot.subjectFacing)}；${oppositeRelation(expected)}`,
        '- 连续性限制：机位改变时允许画面左右关系变化，但现实灯位、冷暖分工和阴影因果不能重置', '',
      ];
    }),
  ].filter(Boolean).join('\n');

  const rows = state.shots.map((shot, index) => {
    const expected = screenRelation(state.keyDirection, shot.camera);
    const verdict = !shot.observed ? '待核对' : shot.observed === expected ? '坐标一致' : '疑似光位错误';
    return `| ${String(index + 1).padStart(2, '0')} | ${safeCell(shot.name || `镜头 ${index + 1}`)} | ${directionLabels[shot.camera]} | ${directionLabels[shot.subjectFacing]} | ${relationLabels[expected]} | ${shot.observed ? relationLabels[shot.observed] : '—'} | ${verdict} | ${safeCell(shot.note || '—')} |`;
  });
  const checklist = [
    `# ${scene} / 光线连续性验收`, '',
    `- 固定主光：${fixedLine}`,
    state.practical.trim() ? `- 固定实景灯：${state.practical.trim()}` : '',
    '- 检查时间点：0% / 25% / 50% / 75% / 100%', '',
    '| # | 镜头 | 机位 | 人物面向 | 坐标预期 | 真实观察 | 判断 | 备注 |',
    '| --- | --- | --- | --- | --- | --- | --- | --- |',
    ...rows, '',
    '- [ ] 现实灯位没有随机位改变',
    '- [ ] 人脸、手、道具、眼神光与投影共同响应同一光源',
    '- [ ] 曝光跳动和色温跳变没有被误写成灯位翻转',
    '- [ ] 反打造成的正常画面侧变化已经与空间错误分开',
  ].filter(Boolean).join('\n');
  return { interfaces, checklist };
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

export function LightingLedgerBuilder() {
  const [state, setState] = useState<LedgerState>(emptyState);
  const [loaded, setLoaded] = useState(false);
  const [copied, setCopied] = useState<CopyKey | null>(null);
  const [manualCopy, setManualCopy] = useState<string | null>(null);
  const outputs = useMemo(() => buildOutputs(state), [state]);
  const expectedRelations = state.shots.map((shot) => screenRelation(state.keyDirection, shot.camera));
  const checked = state.shots.filter((shot) => shot.observed).length;
  const issues = state.shots.filter((shot) => shot.observed && shot.observed !== screenRelation(state.keyDirection, shot.camera)).length;
  const legitimateFlips = expectedRelations.slice(1).filter((relation, index) => relation !== expectedRelations[index]).length;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved) as LedgerState;
          if (parsed && Array.isArray(parsed.shots) && parsed.shots.length >= 2) setState(parsed);
        }
      } catch {
        // A damaged local draft should not block the tool.
      }
      setLoaded(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try { window.localStorage.setItem(storageKey, JSON.stringify(state)); } catch { /* Keep the tool usable without storage. */ }
  }, [loaded, state]);

  function update<K extends keyof LedgerState>(key: K, value: LedgerState[K]) {
    setState((current) => ({ ...current, [key]: value }));
    setCopied(null);
    setManualCopy(null);
  }

  function updateShot(id: string, patch: Partial<Shot>) {
    update('shots', state.shots.map((shot) => shot.id === id ? { ...shot, ...patch } : shot));
  }

  function addShot() {
    if (state.shots.length >= 8) return;
    const next = state.shots.length + 1;
    update('shots', [...state.shots, { id: `shot-${Date.now()}`, name: `镜头 ${String(next).padStart(2, '0')}`, size: '中景', camera: 'S', subjectFacing: 'N', observed: '', note: '' }]);
  }

  function removeShot(id: string) {
    if (state.shots.length <= 2) return;
    update('shots', state.shots.filter((shot) => shot.id !== id));
  }

  async function copyOutput(key: CopyKey) {
    if (await copyText(outputs[key])) {
      setManualCopy(null);
      setCopied(key);
      window.setTimeout(() => setCopied(null), 1800);
    } else setManualCopy(outputs[key]);
  }

  return (
    <section className="lighting-ledger-workbench" aria-label="光线连续性账本工具">
      <div className="lighting-ledger-editor">
        <div className="lighting-panel-heading">
          <div><span className="mono">01 / FIX THE WORLD</span><h2>先钉住一盏灯，<br />再移动摄影机。</h2></div>
          <div><button type="button" onClick={() => setState(exampleState)}>载入四镜示例</button><button type="button" onClick={() => setState(emptyState)}>清空</button></div>
        </div>

        <section className="lighting-world-card">
          <div className="lighting-group-heading"><span className="mono">A / WORLD COORDINATES</span><p>这里描述现实空间，不描述画面左右。</p></div>
          <div className="lighting-basic-grid">
            <label><span>场景名称<small>让同一套账本可以复用</small></span><input value={state.sceneName} onChange={(event) => update('sceneName', event.target.value)} placeholder="例如：北窗工作室" /></label>
            <label><span>固定主光名称<small>写真实来源，不写“电影感”</small></span><input value={state.keyLabel} onChange={(event) => update('keyLabel', event.target.value)} placeholder="例如：北窗冷光" /></label>
            <label><span>主光色温<small>只记录相对冷暖关系</small></span><select value={state.keyTemperature} onChange={(event) => update('keyTemperature', event.target.value as Temperature)}><option value="cool">偏冷</option><option value="neutral">中性</option><option value="warm">偏暖</option></select></label>
            <label><span>光线质感<small>用于逐镜接口提示</small></span><select value={state.keyQuality} onChange={(event) => update('keyQuality', event.target.value as 'soft' | 'hard')}><option value="soft">柔和</option><option value="hard">偏硬</option></select></label>
          </div>
          <fieldset className="lighting-direction-picker"><legend>主光固定在哪一侧？</legend><div>{(['N', 'E', 'S', 'W'] as Direction[]).map((direction) => <label key={direction}><input type="radio" name="key-direction" checked={state.keyDirection === direction} onChange={() => update('keyDirection', direction)} /><b>{direction}</b><span>{directionLabels[direction]}侧</span></label>)}</div></fieldset>
          <label className="lighting-practical-field"><span>固定实景灯 / 次光源<small>可留空；不要把会移动的光写成固定灯</small></span><textarea value={state.practical} onChange={(event) => update('practical', event.target.value)} placeholder="例如：桌面右后方暖灯，只照亮信纸与手" /></label>
        </section>

        <section className="lighting-shot-section">
          <div className="lighting-group-heading"><span className="mono">B / SHOT POSITIONS</span><p>最多八镜；真实观察留空时不做判断。</p></div>
          <div className="lighting-shot-list">
            {state.shots.map((shot, index) => {
              const expected = screenRelation(state.keyDirection, shot.camera);
              const verdict = !shot.observed ? 'pending' : shot.observed === expected ? 'match' : 'issue';
              return <article className={`lighting-shot-row verdict-${verdict}`} key={shot.id}>
                <div className="lighting-shot-index"><span className="mono">SHOT</span><strong>{String(index + 1).padStart(2, '0')}</strong><button type="button" disabled={state.shots.length <= 2} onClick={() => removeShot(shot.id)} aria-label={`删除${shot.name}`}>×</button></div>
                <div className="lighting-shot-fields">
                  <label className="lighting-shot-name"><span>镜头名称</span><input value={shot.name} onChange={(event) => updateShot(shot.id, { name: event.target.value })} /></label>
                  <label><span>景别</span><input value={shot.size} onChange={(event) => updateShot(shot.id, { size: event.target.value })} placeholder="中景" /></label>
                  <label><span>摄影机位于</span><select value={shot.camera} onChange={(event) => updateShot(shot.id, { camera: event.target.value as Direction })}>{(['N', 'E', 'S', 'W'] as Direction[]).map((direction) => <option value={direction} key={direction}>{directionLabels[direction]}侧</option>)}</select></label>
                  <label><span>人物面向</span><select value={shot.subjectFacing} onChange={(event) => updateShot(shot.id, { subjectFacing: event.target.value as Direction })}>{(['N', 'E', 'S', 'W'] as Direction[]).map((direction) => <option value={direction} key={direction}>{directionLabels[direction]}侧</option>)}</select></label>
                  <label className="lighting-observed-field"><span>真实画面主光来自</span><select value={shot.observed} onChange={(event) => updateShot(shot.id, { observed: event.target.value as '' | ScreenRelation })}><option value="">尚未观察</option>{(['left', 'right', 'front', 'back'] as ScreenRelation[]).map((relation) => <option value={relation} key={relation}>{relationLabels[relation]}</option>)}</select></label>
                  <label className="lighting-note-field"><span>五点观察备注</span><input value={shot.note} onChange={(event) => updateShot(shot.id, { note: event.target.value })} placeholder="0 / 25 / 50 / 75 / 100% 的变化" /></label>
                </div>
                <div className="lighting-shot-expectation"><span className="mono">COORDINATE EXPECTATION</span><strong>{relationLabels[expected]}</strong><small>{subjectRelation(state.keyDirection, shot.subjectFacing)} · {oppositeRelation(expected)}</small><b>{verdict === 'pending' ? '待真实画面' : verdict === 'match' ? '坐标一致 ✓' : '疑似光位错误 !'}</b></div>
              </article>;
            })}
          </div>
          <button type="button" className="lighting-add-shot" disabled={state.shots.length >= 8} onClick={addShot}>{state.shots.length >= 8 ? '已到八镜上限' : '＋ 增加一个镜头'}</button>
        </section>
      </div>

      <aside className="lighting-ledger-output">
        <div className="lighting-output-topline mono"><span>LIGHT AXIS COMPASS</span><span>{loaded ? 'LOCAL DRAFT' : 'LOADING'}</span></div>
        <div className={`lighting-compass key-${state.keyDirection.toLowerCase()}`} aria-label={`主光固定在${directionLabels[state.keyDirection]}侧的光线罗盘`}>
          <span className="compass-n">N</span><span className="compass-e">E</span><span className="compass-s">S</span><span className="compass-w">W</span>
          <i className="lighting-key-source">☀<small>{short(state.keyLabel, 'KEY')}</small></i>
          <b>S<small>SUBJECT</small></b>
          {state.shots.map((shot, index) => <em className={`lighting-camera camera-${shot.camera.toLowerCase()}`} style={{ '--camera-offset': `${index * 18}px` } as CSSProperties} key={shot.id}>C{index + 1}</em>)}
        </div>
        <h2>{state.sceneName.trim() || '未命名光线账本'}</h2>
        <p>{state.keyLabel.trim() || `${directionLabels[state.keyDirection]}侧主光`}固定在现实空间的{directionLabels[state.keyDirection]}侧；机位改变时，画面关系允许改变，灯位不跟着摄影机移动。</p>
        <div className="lighting-output-stats"><span><small>SHOTS</small><b>{state.shots.length}</b></span><span><small>CHECKED</small><b>{checked}</b></span><span><small>ISSUES</small><b>{issues}</b></span><span><small>SCREEN FLIPS</small><b>{legitimateFlips}</b></span></div>
        <div className="lighting-mini-ledger">
          {state.shots.map((shot, index) => {
            const expected = expectedRelations[index];
            return <article key={shot.id}><span className="mono">{String(index + 1).padStart(2, '0')}</span><div><strong>{short(shot.name, `镜头 ${index + 1}`)}</strong><small>C@{shot.camera} · FACE {shot.subjectFacing}</small></div><b>{relationLabels[expected]}</b><i className={!shot.observed ? 'is-pending' : shot.observed === expected ? 'is-match' : 'is-issue'}>{!shot.observed ? '—' : shot.observed === expected ? '✓' : '!'}</i></article>;
          })}
        </div>
        <div className="lighting-output-actions"><button type="button" onClick={() => copyOutput('interfaces')}>{copied === 'interfaces' ? '逐镜接口已复制 ✓' : '复制逐镜光线接口 ↗'}</button><button type="button" onClick={() => copyOutput('checklist')}>{copied === 'checklist' ? '验收表已复制 ✓' : '复制验收表 ↗'}</button></div>
        <small className="lighting-output-local">所有输入与观察只保存在当前浏览器，不上传图片或视频。SCREEN FLIPS 只表示坐标预期发生改变，不代表错误。</small>
      </aside>

      {manualCopy && <aside className="lighting-copy-fallback"><div><span className="mono">MANUAL COPY / 浏览器限制</span><p>点击文本框后按 Ctrl+A，再按 Ctrl+C。</p></div><button type="button" onClick={() => setManualCopy(null)}>关闭 ×</button><textarea readOnly value={manualCopy} aria-label="手动复制光线连续性账本内容" onFocus={(event) => event.currentTarget.select()} /></aside>}
    </section>
  );
}
