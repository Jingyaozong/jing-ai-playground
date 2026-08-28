'use client';

import { useMemo, useState } from 'react';

type SoundRoute = 'native' | 'post' | 'performance';

type SoundState = {
  shot: string;
  duration: number;
  route: SoundRoute;
  speaker: string;
  dialogue: string;
  performance: string;
  ambience: string;
  sfx: string;
  music: string;
  mouthVisible: boolean;
  exactText: boolean;
};

type Track = {
  id: 'dialogue' | 'performance' | 'ambience' | 'sfx' | 'music';
  label: string;
  short: string;
  value: string;
};

const routeOptions: Array<{ id: SoundRoute; label: string; title: string; note: string }> = [
  { id: 'native', label: 'A / NATIVE', title: '原生音视频', note: '让画面、短对白和环境声在同一次生成里共同出现。' },
  { id: 'post', label: 'B / POST', title: '后期配声', note: '画面先通过，再把对白、环境、音效和音乐分别放进时间线。' },
  { id: 'performance', label: 'C / DRIVE', title: '表演驱动', note: '先确定录音与表演节奏，再驱动角色的嘴型和面部动作。' },
];

const exampleState: SoundState = {
  shot: '07',
  duration: 6,
  route: 'post',
  speaker: '她 / 画外音',
  dialogue: '这不是今天拍的。',
  performance: '轻声；“今天”前短暂停顿；说完后保留一次呼吸',
  ambience: '连续雨声；站棚内较闷；远处车辆偶尔经过',
  sfx: '00:01.8 手机提示音，必须早于人物抬头',
  music: '无；让雨声和停顿承担情绪',
  mouthVisible: false,
  exactText: true,
};

const emptyState: SoundState = {
  shot: '01', duration: 5, route: 'post', speaker: '', dialogue: '', performance: '', ambience: '', sfx: '', music: '', mouthVisible: false, exactText: false,
};

const routeNames: Record<SoundRoute, string> = {
  native: '原生音视频',
  post: '后期配声',
  performance: '表演驱动',
};

async function copyText(value: string) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return true;
    }
  } catch {
    // Continue to the browser-local fallback.
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

function buildTracks(state: SoundState): Track[] {
  return [
    { id: 'dialogue', label: '对白 / 旁白', short: 'DIA', value: [state.speaker, state.dialogue].filter(Boolean).join('：') },
    { id: 'performance', label: '声音表演', short: 'PERF', value: state.performance },
    { id: 'ambience', label: '环境底', short: 'AMB', value: state.ambience },
    { id: 'sfx', label: '动作音效', short: 'SFX', value: state.sfx },
    { id: 'music', label: '音乐', short: 'MUS', value: state.music },
  ];
}

function buildChecks(state: SoundState) {
  const checks = [
    state.dialogue.trim() ? '台词内容、说话人与文本版本已经绑定。' : '补充台词，或明确标记本镜无对白。',
    state.performance.trim() ? '检查语气、停顿和呼吸是否落在预期位置。' : '补充声音表演方向，避免只留下文字。',
    state.ambience.trim() ? '检查环境底在前后镜头之间是否连续。' : '确认本镜是否需要连续环境底。',
    state.sfx.trim() ? '检查动作音效发生在动作前、中还是后。' : '确认本镜没有需要对点的叙事音效。',
    state.music.trim() ? '检查音乐是否给对白和关键音效让出空间。' : '确认本镜不需要音乐，或补充进入与退出位置。',
  ];

  if (state.mouthVisible) checks.unshift('逐帧检查开口、收口、嘴唇、牙齿和下巴稳定性。');
  if (state.exactText) checks.unshift('逐字核对台词，不接受漏字、改词或专有名词误读。');
  return checks;
}

function buildNotices(state: SoundState) {
  const notices: string[] = [];
  if (state.route === 'native' && state.exactText) notices.push('要求逐字准确时，原生音视频不便单独替换错词；先准备后期配声或表演驱动备选。');
  if (state.route === 'post' && state.mouthVisible) notices.push('画面里能清楚看见嘴部：普通后期配声不能自动解决口型，需要增加口型步骤或调整机位。');
  if (state.route === 'performance' && !state.dialogue.trim()) notices.push('表演驱动需要先确定实际台词或录音，否则镜头时长和嘴型任务都无法锁定。');
  if (state.route === 'performance' && !state.mouthVisible) notices.push('嘴部并不清楚可见：先判断是否真的需要表演驱动，画外配音可能更直接。');
  if (state.duration <= 4 && state.dialogue.trim().length >= 18) notices.push('短镜头承载了较长台词；请先试读，用真实录音长度决定是否拆句。');
  return notices;
}

export function SoundLayerBuilder() {
  const [state, setState] = useState<SoundState>(exampleState);
  const [copied, setCopied] = useState<'brief' | 'checklist' | null>(null);
  const [manualCopy, setManualCopy] = useState<string | null>(null);
  const tracks = useMemo(() => buildTracks(state), [state]);
  const checks = useMemo(() => buildChecks(state), [state]);
  const notices = useMemo(() => buildNotices(state), [state]);
  const activeLayers = tracks.filter((track) => track.value.trim()).length;

  function update<K extends keyof SoundState>(key: K, value: SoundState[K]) {
    setState((current) => ({ ...current, [key]: value }));
    setCopied(null);
    setManualCopy(null);
  }

  const brief = [
    `# SHOT ${state.shot.trim() || '—'} 声音分层卡`,
    '',
    `- 时长：${state.duration} 秒`,
    `- 声音路线：${routeNames[state.route]}`,
    `- 嘴型清楚可见：${state.mouthVisible ? '是' : '否'}`,
    `- 台词需要逐字准确：${state.exactText ? '是' : '否'}`,
    '',
    ...tracks.map((track) => `## ${track.label}\n${track.value.trim() || '未填写 / 本镜不使用'}`),
    '',
    '## 路线提醒',
    ...(notices.length ? notices.map((notice) => `- ${notice}`) : ['- 当前路线与已填写条件没有明显冲突，仍需用真实生成结果验收。']),
  ].join('\n');

  const checklist = [
    `# SHOT ${state.shot.trim() || '—'} 声音验收清单`,
    '',
    ...checks.map((check) => `- [ ] ${check}`),
    '- [ ] 检查整体响度、远近、方向与空间混响。',
    '- [ ] 确认只错一层时可以单独替换，不必重做整镜。',
  ].join('\n');

  async function copy(kind: 'brief' | 'checklist') {
    const value = kind === 'brief' ? brief : checklist;
    if (await copyText(value)) {
      setManualCopy(null);
      setCopied(kind);
      window.setTimeout(() => setCopied((current) => current === kind ? null : current), 1800);
    } else {
      setManualCopy(value);
    }
  }

  return (
    <section className="sound-workbench" aria-label="声音分层卡生成器">
      <div className="sound-input-panel">
        <div className="sound-panel-heading">
          <div><span className="mono">01 / SOUND PLAN</span><h2>先分轨，<br />再让声音发生。</h2></div>
          <div><button type="button" onClick={() => setState(exampleState)}>载入示例</button><button type="button" onClick={() => setState(emptyState)}>清空</button></div>
        </div>

        <div className="sound-basics">
          <label><span>镜号</span><input value={state.shot} onChange={(event) => update('shot', event.target.value)} aria-label="镜号" /></label>
          <label><span>时长</span><div><input type="number" min="1" max="60" step="0.5" value={state.duration} onChange={(event) => update('duration', Math.max(1, Math.min(60, Number(event.target.value) || 1)))} /><small>秒</small></div></label>
        </div>

        <fieldset className="sound-route-picker"><legend><span className="mono">ROUTE</span> 这镜的声音由谁负责</legend>
          {routeOptions.map((route) => <label key={route.id}><input type="radio" name="sound-route" value={route.id} checked={state.route === route.id} onChange={() => update('route', route.id)} /><span className="mono">{route.label}</span><strong>{route.title}</strong><small>{route.note}</small><i aria-hidden="true">{state.route === route.id ? '✓' : '＋'}</i></label>)}
        </fieldset>

        <div className="sound-fields">
          <SoundField index="01" label="说话人" note="角色名、旁白或画外音" value={state.speaker} onChange={(value) => update('speaker', value)} placeholder="例如：她 / 画外音" compact />
          <SoundField index="02" label="精确台词" note="需要被听懂的实际文本" value={state.dialogue} onChange={(value) => update('dialogue', value)} placeholder="例如：这不是今天拍的。" />
          <SoundField index="03" label="声音表演" note="语气、速度、停顿与呼吸" value={state.performance} onChange={(value) => update('performance', value)} placeholder="例如：轻声；关键词前短暂停顿；说完后保留一次呼吸" />
          <SoundField index="04" label="环境底" note="整镜持续的空间声音" value={state.ambience} onChange={(value) => update('ambience', value)} placeholder="例如：连续雨声；室内较闷；远处偶尔有车经过" />
          <SoundField index="05" label="动作音效" note="事件、时间点与前后关系" value={state.sfx} onChange={(value) => update('sfx', value)} placeholder="例如：00:01.8 手机提示音，早于人物抬头" />
          <SoundField index="06" label="音乐" note="进入、退出、强弱或明确不用" value={state.music} onChange={(value) => update('music', value)} placeholder="例如：无；让环境声承担情绪" />
        </div>

        <fieldset className="sound-conditions"><legend><span className="mono">ACCEPTANCE</span> 需要额外核对</legend>
          <Toggle label="画面里能清楚看见嘴型" checked={state.mouthVisible} onChange={(value) => update('mouthVisible', value)} />
          <Toggle label="台词必须逐字准确" checked={state.exactText} onChange={(value) => update('exactText', value)} />
        </fieldset>
      </div>

      <aside className="sound-mix-card" aria-live="polite">
        <div className="sound-card-topline mono"><span>02 / TRACK CARD</span><span>{activeLayers} / 5 层已写</span></div>
        <div className="sound-card-title"><span className="mono">SHOT</span><strong>{state.shot.trim() || '—'}</strong><div><b>{state.duration}s</b><small>{routeNames[state.route]}</small></div></div>

        <div className="sound-track-stack">
          {tracks.map((track) => <article className={`sound-track sound-track-${track.id} ${track.value.trim() ? '' : 'is-empty'}`} key={track.id}><span className="mono">{track.short}</span><div><strong>{track.label}</strong><p>{track.value.trim() || '本层还没有内容'}</p></div><i aria-hidden="true">{track.value.trim() ? '●' : '○'}</i></article>)}
        </div>

        {notices.length > 0 ? <div className="sound-notices"><span className="mono">ROUTE CHECK / {notices.length}</span>{notices.map((notice) => <p key={notice}>→ {notice}</p>)}</div> : <div className="sound-notices is-clear"><span className="mono">ROUTE CHECK / CLEAR</span><p>当前路线与输入条件没有明显冲突，仍需用真实结果逐层验收。</p></div>}

        <div className="sound-copy-actions"><button type="button" onClick={() => copy('brief')}>{copied === 'brief' ? '已复制声音卡 ✓' : '复制声音 Brief ↗'}</button><button type="button" onClick={() => copy('checklist')}>{copied === 'checklist' ? '已复制清单 ✓' : '复制验收清单 ↗'}</button></div>
        <p className="sound-local-note">所有内容只在当前浏览器中整理，不上传。路线提醒是透明条件判断，不代表模型成功率。</p>
      </aside>

      {manualCopy && <aside className="sound-copy-fallback"><div><span className="mono">MANUAL COPY / 浏览器限制</span><p>点击文本框后按 Ctrl+A，再按 Ctrl+C。</p></div><button type="button" onClick={() => setManualCopy(null)}>关闭 ×</button><textarea readOnly value={manualCopy} aria-label="手动复制声音工作卡" /></aside>}
    </section>
  );
}

function SoundField({ index, label, note, value, onChange, placeholder, compact = false }: { index: string; label: string; note: string; value: string; onChange: (value: string) => void; placeholder: string; compact?: boolean }) {
  return <label className={`sound-field ${compact ? 'is-compact' : ''}`}><span className="sound-field-index mono">{index}</span><span className="sound-field-copy"><strong>{label}</strong><small>{note}</small></span><textarea rows={compact ? 1 : 2} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} /></label>;
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return <label><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} /><span>{label}</span><i aria-hidden="true">{checked ? 'YES' : 'NO'}</i></label>;
}
