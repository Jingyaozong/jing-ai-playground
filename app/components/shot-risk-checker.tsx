'use client';

import { useMemo, useState } from 'react';

type Mode = 'text' | 'first' | 'first-last';
type DifferenceKey = 'identity' | 'pose' | 'framing' | 'scene' | 'lighting';
type Severity = 'watch' | 'split';

type CheckerState = {
  task: string;
  duration: number;
  mode: Mode;
  subjectActions: number;
  cameraMoves: number;
  environmentMoves: number;
  multipleSubjects: boolean;
  preciseDetail: boolean;
  keepIdentity: boolean;
  differences: Record<DifferenceKey, boolean>;
};

type Signal = {
  severity: Severity;
  title: string;
  reason: string;
  action: string;
};

const differenceOptions: Array<{ key: DifferenceKey; label: string; note: string }> = [
  { key: 'identity', label: '人物身份变化', note: '脸、发型、服装或配饰不一致' },
  { key: 'pose', label: '大幅姿态变化', note: '坐到跑、背面转正面等' },
  { key: 'framing', label: '景别或机位大变', note: '近景到远景、平视到俯拍等' },
  { key: 'scene', label: '场景结构变化', note: '室内外或空间布局明显改变' },
  { key: 'lighting', label: '光线时间变化', note: '昼夜、方向或色温明显改变' },
];

const exampleState: CheckerState = {
  task: '她读完信后抬眼看向窗外，摄影机从中景推到近景',
  duration: 5,
  mode: 'first-last',
  subjectActions: 2,
  cameraMoves: 1,
  environmentMoves: 1,
  multipleSubjects: false,
  preciseDetail: false,
  keepIdentity: true,
  differences: { identity: false, pose: true, framing: true, scene: false, lighting: false },
};

const emptyState: CheckerState = {
  task: '', duration: 5, mode: 'first', subjectActions: 1, cameraMoves: 0, environmentMoves: 0,
  multipleSubjects: false, preciseDetail: false, keepIdentity: false,
  differences: { identity: false, pose: false, framing: false, scene: false, lighting: false },
};

const modeLabels: Record<Mode, string> = {
  text: '文生视频',
  first: '仅首帧',
  'first-last': '首帧 + 尾帧',
};

function inspectShot(state: CheckerState) {
  const signals: Signal[] = [];
  const totalMotion = state.subjectActions + state.cameraMoves + state.environmentMoves;
  const activeDifferences = differenceOptions.filter((item) => state.differences[item.key]);

  if (!state.task.trim()) {
    signals.push({ severity: 'watch', title: '核心任务还没写', reason: '没有一句可核对的镜头目标，其他数字很难判断是否必要。', action: '先用一句话写清观众在这一镜必须看到什么。' });
  }
  if ((state.duration <= 4 && totalMotion >= 4) || (state.duration <= 6 && totalMotion >= 6)) {
    signals.push({ severity: 'split', title: '时长装不下当前变化', reason: `${state.duration} 秒内安排了 ${totalMotion} 项主体、摄影机或环境变化。`, action: '保留一个主要动作和一种主要运镜，其余移到下一镜。' });
  } else if (totalMotion >= 4) {
    signals.push({ severity: 'watch', title: '同时变化的层次偏多', reason: `当前共有 ${totalMotion} 项时间变化，失败后不容易定位是哪一层失控。`, action: '先固定环境或摄影机，只测试本镜最重要的变化。' });
  }
  if (state.subjectActions >= 3) {
    signals.push({ severity: state.duration <= 5 ? 'split' : 'watch', title: '主体动作像一小段分镜', reason: `主体需要连续完成 ${state.subjectActions} 个动作节点。`, action: '删除过渡动作，或按“动作完成后的新状态”拆成下一镜。' });
  }
  if (state.cameraMoves >= 2) {
    signals.push({ severity: 'split', title: '摄影机有多个主要路径', reason: `同一镜安排了 ${state.cameraMoves} 种主要运镜，终点容易漂移。`, action: '只保留一种主运镜；复杂路径需要分阶段或拆镜。' });
  }
  if (state.environmentMoves >= 2 && state.subjectActions >= 2) {
    signals.push({ severity: 'watch', title: '环境正在和表演抢控制', reason: '人物动作与多项环境变化同时发生，画面需要分配更多运动注意力。', action: '先减少雨、烟、布料或背景人群中的一部分动态。' });
  }
  if (state.multipleSubjects && state.subjectActions >= 2) {
    signals.push({ severity: 'watch', title: '多人互动增加遮挡与同步', reason: '多个主体同时表演时，身份、肢体接触和动作顺序都要保持连续。', action: '明确谁先动、谁保持静止，并减少同时发生的动作。' });
  }
  if (state.preciseDetail) {
    signals.push({ severity: 'watch', title: '精细文字或手部需要单独验收', reason: '可读文字、精确手势和物体接触比普通动作更容易暴露连续性问题。', action: '给关键细节单独近景，必要时预留后期替换方案。' });
  }
  if (state.keepIdentity && (state.subjectActions >= 3 || state.cameraMoves >= 2)) {
    signals.push({ severity: 'watch', title: '身份一致性遇到高运动压力', reason: '大幅表演或多段运镜会增加角度、遮挡和外观重建。', action: '先用简单动作建立人物基线，再逐项增加运动。' });
  }

  if (state.mode === 'first-last') {
    if (state.differences.identity) {
      signals.push({ severity: 'split', title: '首尾人物身份已经不一致', reason: '模型被要求在中间解释脸、发型、服装或配饰变化。', action: '先修正两张关键帧，让身份锚点完全对齐后再生成。' });
    }
    if (state.differences.scene) {
      signals.push({ severity: 'split', title: '首尾场景结构跨度过大', reason: '空间重建会与人物动作、摄影机运动同时竞争。', action: '为场景变化单独做转场，或加入一个中间衔接镜头。' });
    }
    if (activeDifferences.length >= 3) {
      signals.push({ severity: 'split', title: '首尾帧一次改变太多维度', reason: `两端同时改变了 ${activeDifferences.length} 类可见条件。`, action: '只保留本镜最必要的一项变化，其余拆到后续镜头。' });
    } else if (activeDifferences.length === 2) {
      signals.push({ severity: 'watch', title: '首尾帧有两类主要变化', reason: `当前同时改变${activeDifferences.map((item) => item.label).join('和')}。`, action: '确认两项变化存在清楚的先后顺序，并在 Prompt 中写出中间状态。' });
    }
    if (state.differences.framing && state.cameraMoves === 0) {
      signals.push({ severity: 'watch', title: '景别变化没有对应摄影机说明', reason: '首尾构图明显不同，但运镜数量仍为零。', action: '说明摄影机怎样抵达尾帧，或改用更接近首帧的结束构图。' });
    }
    if (state.differences.pose && state.duration <= 4) {
      signals.push({ severity: 'watch', title: '大姿态变化缺少展开时间', reason: `${state.duration} 秒可能难以同时呈现起势、中间姿态和落稳。`, action: '缩小姿态幅度，或把结束状态移到下一镜。' });
    }
  }

  const splitCount = signals.filter((signal) => signal.severity === 'split').length;
  const status = splitCount > 0 ? 'split' : signals.length > 0 ? 'reduce' : 'run';
  return { signals, totalMotion, activeDifferences, status } as const;
}

export function ShotRiskChecker() {
  const [state, setState] = useState<CheckerState>(exampleState);
  const [copied, setCopied] = useState(false);
  const result = useMemo(() => inspectShot(state), [state]);
  const statusCopy = result.status === 'split'
    ? { label: '建议拆镜', note: '至少一条结构冲突需要先处理。' }
    : result.status === 'reduce'
      ? { label: '建议减项', note: '先缩小变量，再做第一轮试跑。' }
      : { label: '可以试跑', note: '当前没有明显结构冲突，仍需真实生成验证。' };

  function update<K extends keyof CheckerState>(key: K, value: CheckerState[K]) {
    setState((current) => ({ ...current, [key]: value }));
    setCopied(false);
  }

  function toggleDifference(key: DifferenceKey) {
    setState((current) => ({ ...current, differences: { ...current.differences, [key]: !current.differences[key] } }));
    setCopied(false);
  }

  const report = [
    '# AI 视频镜头拍前检查',
    '',
    `镜头任务：${state.task.trim() || '未填写'}`,
    `时长：${state.duration} 秒`,
    `生成方式：${modeLabels[state.mode]}`,
    `时间变化：主体 ${state.subjectActions} / 摄影机 ${state.cameraMoves} / 环境 ${state.environmentMoves}`,
    `结论：${statusCopy.label}`,
    '',
    '## 触发信号',
    ...(result.signals.length ? result.signals.map((signal) => `- ${signal.title}：${signal.reason}`) : ['- 当前没有触发结构预警。']),
    '',
    '## 修改建议',
    ...(result.signals.length ? [...new Set(result.signals.map((signal) => `- ${signal.action}`))] : ['- 保持当前结构，先生成一轮小样并记录真实结果。']),
    '',
    '说明：这是基于输入条件的拍前整理，不是模型成功率预测。',
  ].join('\n');

  async function copyReport() {
    try {
      await navigator.clipboard.writeText(report);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className="risk-workbench" aria-label="AI 视频镜头风险预检器">
      <div className="risk-form-panel">
        <div className="risk-form-heading">
          <div><span className="mono">01 / SHOT CONDITIONS</span><h2>这一镜，<br />到底要做几件事？</h2></div>
          <div><button type="button" onClick={() => setState(exampleState)}>载入示例</button><button type="button" onClick={() => setState(emptyState)}>清空</button></div>
        </div>

        <label className="risk-task-field"><span><strong>本镜核心任务</strong><small>只写观众必须看见的一件事</small></span><textarea value={state.task} onChange={(event) => update('task', event.target.value)} placeholder="例如：她读完信后抬眼看向窗外" rows={3} /></label>

        <div className="risk-setting-grid">
          <label><span>镜头时长</span><div><input type="number" min="2" max="20" step="1" value={state.duration} onChange={(event) => update('duration', Math.max(2, Math.min(20, Number(event.target.value) || 2)))} /><small>秒</small></div></label>
          <label><span>生成方式</span><select value={state.mode} onChange={(event) => update('mode', event.target.value as Mode)}><option value="text">文生视频</option><option value="first">仅首帧</option><option value="first-last">首帧 + 尾帧</option></select></label>
        </div>

        <fieldset className="risk-counts"><legend><span className="mono">TIME LAYERS</span> 时间里同时变化多少项</legend>
          <CountControl label="主体动作" note="抬眼、起身、转身各算一项" value={state.subjectActions} onChange={(value) => update('subjectActions', value)} />
          <CountControl label="主要运镜" note="推近、横移、环绕各算一项" value={state.cameraMoves} onChange={(value) => update('cameraMoves', value)} />
          <CountControl label="环境变化" note="风、雨、烟、背景人群等" value={state.environmentMoves} onChange={(value) => update('environmentMoves', value)} />
        </fieldset>

        <fieldset className="risk-toggles"><legend><span className="mono">EXTRA PRESSURE</span> 还需要同时满足</legend>
          <Toggle label="两个或更多主体互动" checked={state.multipleSubjects} onChange={(value) => update('multipleSubjects', value)} />
          <Toggle label="精确文字、手势或物体接触" checked={state.preciseDetail} onChange={(value) => update('preciseDetail', value)} />
          <Toggle label="跨镜保持同一人物身份" checked={state.keepIdentity} onChange={(value) => update('keepIdentity', value)} />
        </fieldset>

        {state.mode === 'first-last' && <fieldset className="risk-differences"><legend><span className="mono">KEYFRAME GAP</span> 首尾帧之间改变了什么</legend>
          {differenceOptions.map((item) => <label key={item.key}><input type="checkbox" checked={state.differences[item.key]} onChange={() => toggleDifference(item.key)} /><span><strong>{item.label}</strong><small>{item.note}</small></span><i aria-hidden="true">{state.differences[item.key] ? '✓' : '+'}</i></label>)}
        </fieldset>}
      </div>

      <aside className={`risk-result-ticket risk-status-${result.status}`} aria-live="polite">
        <div className="risk-result-topline mono"><span>02 / PRE-FLIGHT</span><span>{result.signals.length} 条信号</span></div>
        <p>拍前结论</p>
        <h2>{statusCopy.label}</h2>
        <small>{statusCopy.note}</small>
        <div className="risk-motion-ledger"><span><b>{state.subjectActions}</b><small>主体</small></span><i>＋</i><span><b>{state.cameraMoves}</b><small>摄影机</small></span><i>＋</i><span><b>{state.environmentMoves}</b><small>环境</small></span><i>＝</i><span><b>{result.totalMotion}</b><small>变化项</small></span></div>

        <div className="risk-signal-list">
          {result.signals.length ? result.signals.map((signal, index) => <article key={`${signal.title}-${index}`}><span className={`risk-severity risk-severity-${signal.severity}`}>{signal.severity === 'split' ? '先处理' : '留意'}</span><div><strong>{signal.title}</strong><p>{signal.reason}</p><small>→ {signal.action}</small></div></article>) : <article className="risk-clear"><span aria-hidden="true">✓</span><div><strong>没有触发结构预警</strong><p>保持当前结构，先生成一轮小样并记录真实结果。</p></div></article>}
        </div>

        <button type="button" className="risk-copy-button" onClick={copyReport}>{copied ? '已复制拍前检查 ✓' : '复制检查结果 ↗'}</button>
        <p className="risk-disclaimer">这是基于可见条件的整理规则，不是模型评分，也不预测成功概率。</p>
      </aside>
    </section>
  );
}

function CountControl({ label, note, value, onChange }: { label: string; note: string; value: number; onChange: (value: number) => void }) {
  return <div className="risk-count-row"><span><strong>{label}</strong><small>{note}</small></span><div><button type="button" onClick={() => onChange(Math.max(0, value - 1))} aria-label={`${label}减少一项`}>−</button><b>{value}</b><button type="button" onClick={() => onChange(Math.min(6, value + 1))} aria-label={`${label}增加一项`}>＋</button></div></div>;
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return <label><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} /><span>{label}</span><i aria-hidden="true">{checked ? 'YES' : 'NO'}</i></label>;
}
