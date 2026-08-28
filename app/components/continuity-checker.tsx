'use client';

import { useMemo, useState } from 'react';

type CutType = 'straight' | 'action' | 'eyeline' | 'sound' | 'jump';
type IdentityState = 'match' | 'planned' | 'conflict';
type DirectionState = 'match' | 'reset' | 'reverse';
type EyelineState = 'match' | 'na' | 'conflict';
type ActionState = 'continue' | 'new' | 'repeat' | 'jump';
type FactState = 'match' | 'planned' | 'conflict';
type SoundState = 'continuous' | 'jcut' | 'lcut' | 'hard' | 'broken';
type Severity = 'watch' | 'fix';

type CheckerState = {
  pair: string;
  exit: string;
  entry: string;
  cutType: CutType;
  sameScene: boolean;
  intentionalBreak: boolean;
  identity: IdentityState;
  direction: DirectionState;
  eyeline: EyelineState;
  action: ActionState;
  facts: FactState;
  sound: SoundState;
};

type Signal = {
  severity: Severity;
  line: string;
  title: string;
  reason: string;
  action: string;
};

type Choice<T extends string> = { value: T; label: string };

const cutOptions: Array<{ value: CutType; label: string; note: string }> = [
  { value: 'straight', label: '直接切', note: '画面和声音按同一切点变化' },
  { value: 'action', label: '动作匹配', note: '让一个动作跨过切点继续' },
  { value: 'eyeline', label: '视线匹配', note: 'A 看向目标，B 回答目标是什么' },
  { value: 'sound', label: '声音交接', note: '用 J / L Cut 让声音先行或延续' },
  { value: 'jump', label: '明确跳切', note: '有意暴露时间或空间断裂' },
];

const exampleState: CheckerState = {
  pair: '07 → 08',
  exit: '她在画面右侧，右手压下门把，身体继续朝画面左侧移动；门刚打开一条缝。',
  entry: '右手近景继续压下门把，门随即打开；动作不重新开始，运动方向仍朝左。',
  cutType: 'action',
  sameScene: true,
  intentionalBreak: false,
  identity: 'match',
  direction: 'match',
  eyeline: 'na',
  action: 'continue',
  facts: 'match',
  sound: 'continuous',
};

const emptyState: CheckerState = {
  pair: 'A → B', exit: '', entry: '', cutType: 'straight', sameScene: true, intentionalBreak: false,
  identity: 'match', direction: 'match', eyeline: 'na', action: 'new', facts: 'match', sound: 'continuous',
};

const identityChoices: Choice<IdentityState>[] = [
  { value: 'match', label: '身份保持' }, { value: 'planned', label: '有意变化' }, { value: 'conflict', label: '出现漂移' },
];
const directionChoices: Choice<DirectionState>[] = [
  { value: 'match', label: '方向接上' }, { value: 'reset', label: '重新建立' }, { value: 'reverse', label: '突然反向' },
];
const eyelineChoices: Choice<EyelineState>[] = [
  { value: 'match', label: '视线匹配' }, { value: 'na', label: '本切点不看' }, { value: 'conflict', label: '目标对不上' },
];
const actionChoices: Choice<ActionState>[] = [
  { value: 'continue', label: '继续动作' }, { value: 'new', label: '开始新动作' }, { value: 'repeat', label: '动作重做' }, { value: 'jump', label: '阶段跳过' },
];
const factChoices: Choice<FactState>[] = [
  { value: 'match', label: '事实保持' }, { value: 'planned', label: '有因变化' }, { value: 'conflict', label: '无因跳变' },
];
const soundChoices: Choice<SoundState>[] = [
  { value: 'continuous', label: '环境连续' }, { value: 'jcut', label: 'J Cut' }, { value: 'lcut', label: 'L Cut' }, { value: 'hard', label: '声音硬切' }, { value: 'broken', label: '意外断裂' },
];

const cutNames: Record<CutType, string> = {
  straight: '直接切', action: '动作匹配', eyeline: '视线匹配', sound: '声音交接', jump: '明确跳切',
};

function inspectPair(state: CheckerState) {
  const signals: Signal[] = [];

  if (!state.exit.trim() || !state.entry.trim()) {
    signals.push({ severity: 'watch', line: '接口', title: 'A 的出口或 B 的入口还没写清', reason: '缺少切点两侧的可见状态，六条连续线会失去判断对象。', action: '先各用一句话写出切点前最后状态和切点后最初状态。' });
  }
  if (state.identity === 'conflict') {
    signals.push({ severity: 'fix', line: '身份', title: '人物身份在切点发生漂移', reason: '脸、发型、服装或配饰无叙事原因地改变。', action: '用同一人物锚点重做 B 的入口关键帧。' });
  } else if (state.identity === 'planned' && !state.intentionalBreak) {
    signals.push({ severity: 'watch', line: '身份', title: '人物外观变化尚未被标记为叙事选择', reason: '当前选择了有意变化，但没有开启“刻意打破连续”。', action: '补充变化原因，或把身份状态改为保持。' });
  }
  if (state.direction === 'reverse') {
    signals.push({ severity: state.intentionalBreak ? 'watch' : 'fix', line: '方向', title: state.intentionalBreak ? '方向反转需要新的空间锚点' : '人物或机位在切点突然反向', reason: '画面左右关系发生翻转，观众可能误判人物位置或运动方向。', action: state.intentionalBreak ? '保留一个稳定的背景、视线或声音线索说明视角已经改变。' : '保持同侧机位，或加入中性镜头重新建立轴线。' });
  } else if (state.direction === 'reset') {
    signals.push({ severity: 'watch', line: '方向', title: '空间关系正在重新建立', reason: 'B 不直接继承 A 的画面方向，需要一个清楚的重新定位信号。', action: '用全景、正面中性机位、遮挡或明确运动重新说明人物位置。' });
  }
  if (state.eyeline === 'conflict') {
    signals.push({ severity: 'fix', line: '视线', title: 'B 没有接住 A 的视线目标', reason: '方向、高度或目标位置与上一镜建立的注视关系冲突。', action: '调整 B 的目标构图，或在 A 中重新建立人物真正看向的位置。' });
  }
  if (state.cutType === 'eyeline' && state.eyeline !== 'match') {
    signals.push({ severity: 'fix', line: '视线', title: '选择了视线匹配，但视线状态没有匹配', reason: '切点类型与实际交接条件互相矛盾。', action: '让 B 明确回答 A 的视线，或更换切点类型。' });
  }
  if (state.action === 'repeat') {
    signals.push({ severity: 'fix', line: '动作', title: '动作在 B 的开头重新开始', reason: 'A 已经完成的起势被 B 重复，剪在一起会像短暂倒带。', action: '让 B 从动作下一阶段进入，并剪掉重复的共享停顿。' });
  } else if (state.action === 'jump') {
    signals.push({ severity: state.intentionalBreak ? 'watch' : 'fix', line: '动作', title: '动作阶段在切点跳过', reason: '身体重心、物体接触或运动速度没有中间交接。', action: state.intentionalBreak ? '确认跳跃能表达时间省略，并保留方向或声音锚点。' : '补一个中间状态，或把 A 的出口推进到更接近 B 的阶段。' });
  }
  if (state.cutType === 'action' && state.action !== 'continue') {
    signals.push({ severity: 'fix', line: '动作', title: '动作匹配没有真正继续动作', reason: '选择了 Match on action，但 B 的入口并未承接 A 的动作阶段。', action: '记录阶段、方向、速度和接触关系，让 B 从下一阶段开始。' });
  }
  if (state.facts === 'conflict') {
    signals.push({ severity: 'fix', line: '事实', title: '道具、光线或场景状态无因跳变', reason: '持物手、开合状态、门窗结构或主光方向在切点改变。', action: '锁定关键道具与光线锚点，重做冲突较大的入口镜头。' });
  } else if (state.facts === 'planned' && state.sameScene && !state.intentionalBreak) {
    signals.push({ severity: 'watch', line: '事实', title: '同一场景里的事实变化需要解释', reason: 'B 出现了道具、光线或环境变化，但当前不是明确跳切。', action: '补充变化发生的动作或时间依据。' });
  }
  if (state.sound === 'broken') {
    signals.push({ severity: state.sameScene ? 'fix' : 'watch', line: '声音', title: '声音在切点意外断裂', reason: state.sameScene ? '同一空间的环境底突然重启或消失。' : '跨场景声音突然中断，可能让转场显得生硬。', action: '使用连续环境轨，或明确设计静音作为转场事件。' });
  } else if (state.sound === 'hard' && state.sameScene) {
    signals.push({ severity: 'watch', line: '声音', title: '同一场景使用声音硬切', reason: '画面切换的同时环境底也完全切断，容易暴露拼接。', action: '先尝试保持环境底连续，再单独切换对白或动作音效。' });
  }
  if (state.cutType === 'sound' && state.sound !== 'jcut' && state.sound !== 'lcut') {
    signals.push({ severity: 'fix', line: '声音', title: '声音交接没有使用先行或延续', reason: '当前切点类型要求声音跨过画面切点，但声音设置没有形成 J / L Cut。', action: '让下一镜声音提前进入，或让上一镜声音延续到 B。' });
  }
  if (state.cutType === 'jump' && !state.intentionalBreak) {
    signals.push({ severity: 'watch', line: '意图', title: '选择了跳切，但没有标记刻意打破连续', reason: '难以区分叙事选择与生成误差。', action: '确认跳切目的并开启刻意打破连续，或改用其他切点。' });
  }

  const fixCount = signals.filter((signal) => signal.severity === 'fix').length;
  const status = fixCount > 0 ? 'fix' : signals.length > 0 ? 'watch' : 'ready';
  return { signals, fixCount, status } as const;
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

export function ContinuityChecker() {
  const [state, setState] = useState<CheckerState>(exampleState);
  const [copied, setCopied] = useState(false);
  const [manualCopy, setManualCopy] = useState<string | null>(null);
  const result = useMemo(() => inspectPair(state), [state]);
  const statusCopy = result.status === 'fix'
    ? { label: '先修切点', note: `${result.fixCount} 条结构冲突需要先处理。` }
    : result.status === 'watch'
      ? { label: '需要补锚点', note: '切点可以继续整理，但交接依据还不完整。' }
      : { label: '可以试剪', note: '当前没有明显断裂，仍需放进真实时间线验收。' };

  function update<K extends keyof CheckerState>(key: K, value: CheckerState[K]) {
    setState((current) => ({ ...current, [key]: value }));
    setCopied(false);
    setManualCopy(null);
  }

  const report = [
    `# 相邻镜头连续性检查：${state.pair.trim() || 'A → B'}`,
    '',
    `切点类型：${cutNames[state.cutType]}`,
    `同一场景：${state.sameScene ? '是' : '否'}`,
    `刻意打破连续：${state.intentionalBreak ? '是' : '否'}`,
    '',
    `镜头 A 出口：${state.exit.trim() || '未填写'}`,
    `镜头 B 入口：${state.entry.trim() || '未填写'}`,
    '',
    `结论：${statusCopy.label}`,
    '',
    '## 触发信号',
    ...(result.signals.length ? result.signals.map((signal) => `- [${signal.line}] ${signal.title}：${signal.reason}`) : ['- 当前没有触发结构预警。']),
    '',
    '## 修改建议',
    ...(result.signals.length ? [...new Set(result.signals.map((signal) => `- ${signal.action}`))] : ['- 保持当前交接，放进真实时间线循环检查切点前后。']),
    '',
    '说明：这是基于已选择条件的透明检查，不是生成模型成功率预测。',
  ].join('\n');

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
    <section className="continuity-workbench" aria-label="相邻镜头连续性检查器">
      <div className="continuity-input-panel">
        <div className="continuity-panel-heading">
          <div><span className="mono">01 / CUT INTERFACE</span><h2>先看出口，<br />再看入口。</h2></div>
          <div><button type="button" onClick={() => setState(exampleState)}>载入示例</button><button type="button" onClick={() => setState(emptyState)}>清空</button></div>
        </div>

        <div className="continuity-pair-label"><label><span className="mono">SHOT PAIR</span><input value={state.pair} onChange={(event) => update('pair', event.target.value)} aria-label="相邻镜头编号" /></label><div><Toggle label="同一场景" checked={state.sameScene} onChange={(value) => update('sameScene', value)} /><Toggle label="刻意打破连续" checked={state.intentionalBreak} onChange={(value) => update('intentionalBreak', value)} /></div></div>

        <div className="continuity-ab-cards">
          <label className="continuity-shot-card continuity-shot-a"><span className="mono">OUT / 镜头 A 出口</span><strong>A</strong><textarea value={state.exit} onChange={(event) => update('exit', event.target.value)} placeholder="写切点前最后看见的状态：人物位置、方向、动作阶段、道具和声音。" rows={5} /></label>
          <div className="continuity-cut-mark" aria-hidden="true"><span>CUT</span><i>→</i></div>
          <label className="continuity-shot-card continuity-shot-b"><span className="mono">IN / 镜头 B 入口</span><strong>B</strong><textarea value={state.entry} onChange={(event) => update('entry', event.target.value)} placeholder="写切点后最先看见的状态：怎样接住 A，什么保持，什么允许改变。" rows={5} /></label>
        </div>

        <fieldset className="continuity-cut-types"><legend><span className="mono">CUT TYPE</span> 准备用什么方式交接</legend>{cutOptions.map((option) => <label key={option.value}><input type="radio" name="cut-type" value={option.value} checked={state.cutType === option.value} onChange={() => update('cutType', option.value)} /><strong>{option.label}</strong><small>{option.note}</small><i aria-hidden="true">{state.cutType === option.value ? '✓' : '＋'}</i></label>)}</fieldset>

        <div className="continuity-lines">
          <ChoiceRow index="01" title="人物身份" note="脸、发型、服装与配饰" name="identity-line" value={state.identity} choices={identityChoices} onChange={(value) => update('identity', value)} />
          <ChoiceRow index="02" title="空间方向" note="左右关系、轴线与运动方向" name="direction-line" value={state.direction} choices={directionChoices} onChange={(value) => update('direction', value)} />
          <ChoiceRow index="03" title="人物视线" note="方向、高度与目标位置" name="eyeline-line" value={state.eyeline} choices={eyelineChoices} onChange={(value) => update('eyeline', value)} />
          <ChoiceRow index="04" title="动作时间" note="阶段、速度、重心与接触" name="action-line" value={state.action} choices={actionChoices} onChange={(value) => update('action', value)} />
          <ChoiceRow index="05" title="场景事实" note="道具状态、光线与环境结构" name="fact-line" value={state.facts} choices={factChoices} onChange={(value) => update('facts', value)} />
          <ChoiceRow index="06" title="声音交接" note="环境底、对白与动作音效" name="sound-line" value={state.sound} choices={soundChoices} onChange={(value) => update('sound', value)} />
        </div>
      </div>

      <aside className={`continuity-result-ticket continuity-status-${result.status}`} aria-live="polite">
        <div className="continuity-result-topline mono"><span>02 / SPLICE CHECK</span><span>{result.signals.length} 条信号</span></div>
        <div className="continuity-splice-visual"><span>A</span><i>→</i><span>B</span><b>CUT</b></div>
        <p>切点结论</p><h2>{statusCopy.label}</h2><small>{statusCopy.note}</small>
        <div className="continuity-result-meta"><span><b>{state.pair.trim() || 'A → B'}</b><small>镜头对</small></span><span><b>{cutNames[state.cutType]}</b><small>切点类型</small></span></div>

        <div className="continuity-signal-list">
          {result.signals.length ? result.signals.map((signal, index) => <article key={`${signal.title}-${index}`}><span className={`continuity-severity continuity-severity-${signal.severity}`}>{signal.severity === 'fix' ? '先修' : '留意'}</span><div><small className="mono">{signal.line}</small><strong>{signal.title}</strong><p>{signal.reason}</p><em>→ {signal.action}</em></div></article>) : <article className="continuity-clear"><span>✓</span><div><strong>六条连续线没有明显冲突</strong><p>把两镜放进真实时间线，循环播放切点前后再做最终判断。</p></div></article>}
        </div>

        <button type="button" className="continuity-copy-button" onClick={copyReport}>{copied ? '已复制切点报告 ✓' : '复制连续性报告 ↗'}</button>
        <p className="continuity-disclaimer">所有判断都来自上方可见条件，不上传内容，也不预测模型成功率。</p>
      </aside>

      {manualCopy && <aside className="continuity-copy-fallback"><div><span className="mono">MANUAL COPY / 浏览器限制</span><p>点击文本框后按 Ctrl+A，再按 Ctrl+C。</p></div><button type="button" onClick={() => setManualCopy(null)}>关闭 ×</button><textarea readOnly value={manualCopy} aria-label="手动复制连续性报告" /></aside>}
    </section>
  );
}

function ChoiceRow<T extends string>({ index, title, note, name, value, choices, onChange }: { index: string; title: string; note: string; name: string; value: T; choices: Choice<T>[]; onChange: (value: T) => void }) {
  return <fieldset className="continuity-line"><legend><span className="mono">{index}</span><strong>{title}</strong><small>{note}</small></legend><div>{choices.map((choice) => <label key={choice.value}><input type="radio" name={name} value={choice.value} checked={value === choice.value} onChange={() => onChange(choice.value)} /><span>{choice.label}</span></label>)}</div></fieldset>;
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return <label><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} /><span>{label}</span><i aria-hidden="true">{checked ? 'YES' : 'NO'}</i></label>;
}
