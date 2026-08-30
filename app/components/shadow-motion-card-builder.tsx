'use client';

import { useEffect, useMemo, useState } from 'react';

type OutputKey = 'prompt' | 'matrix' | 'review';
type TimelinePoint = { time: string; body: string; shadow: string };
type ShadowCardValues = {
  shotName: string;
  duration: number;
  bodyLock: string;
  shadowAction: string;
  attachment: string;
  lightRule: string;
  cameraRule: string;
  negative: string;
  tasks: [string, string, string];
  timeline: TimelinePoint[];
};

const storageKey = 'jing-shadow-motion-card-v1';

const exampleValues: ShadowCardValues = {
  shotName: '影子先抬起右手',
  duration: 5,
  bodyLock: '真人双脚固定，双臂自然垂下，只允许自然眨眼和呼吸',
  shadowAction: '单一投影慢慢抬起右臂至肩高，停顿，再放下并回到原始姿势',
  attachment: '影子始终从鞋底接触点连续延伸，不漂浮、不分叉、不复制人物',
  lightRule: '同一盏画面左前方硬光；方向、长度、边缘硬度和色温全程不变',
  cameraRule: '固定中景，一个连续镜头，不推拉、不摇移、不切镜',
  negative: '实体人物抬臂、身体滑动、第二个人、多个影子、影子脱离脚底、灯位翻转、镜头移动、恐怖怪物化',
  tasks: ['影子只抬右臂', '影子侧移半步再回来', '影子先指向门口再复位'],
  timeline: [
    { time: '0%', body: '站定', shadow: '原始姿势' },
    { time: '25%', body: '保持', shadow: '开始抬臂' },
    { time: '50%', body: '保持', shadow: '肩高停顿' },
    { time: '75%', body: '保持', shadow: '缓慢放下' },
    { time: '100%', body: '保持', shadow: '回到原位' },
  ],
};

const emptyValues: ShadowCardValues = {
  shotName: '', duration: 5, bodyLock: '', shadowAction: '', attachment: '', lightRule: '', cameraRule: '', negative: '',
  tasks: ['', '', ''],
  timeline: ['0%', '25%', '50%', '75%', '100%'].map((time) => ({ time, body: '', shadow: '' })),
};

function clean(value: string, fallback = '未填写') {
  return value.trim() || fallback;
}

function buildOutputs(values: ShadowCardValues) {
  const timeline = values.timeline.map((point) => `- ${point.time}: BODY ${clean(point.body)} / SHADOW ${clean(point.shadow)}`).join('\n');
  const prompt = [
    `# ${clean(values.shotName, '影子独立动作')} / TWO-TIMELINE PROMPT`, '',
    `DURATION: ${values.duration} 秒`,
    `CAMERA: ${clean(values.cameraRule)}`,
    `LIGHT: ${clean(values.lightRule)}`, '',
    `BODY TRACK: ${clean(values.bodyLock)}`,
    `SHADOW TRACK: ${clean(values.shadowAction)}`,
    `CONTACT RULE: ${clean(values.attachment)}`, '',
    'TIMELINE:', timeline, '',
    `EXCLUDE: ${clean(values.negative, '未填写')}`, '',
    'STATUS: 待测试控制结构，不代表模型会稳定执行。',
  ].join('\n');

  const matrixRows = ['A / 同句控制', 'B / 双轨分层', 'C / 双轨 + 五点时间线'].flatMap((condition, groupIndex) =>
    values.tasks.map((task, taskIndex) => {
      const code = `${String.fromCharCode(65 + groupIndex)}0${taskIndex + 1}`;
      const input = groupIndex === 0
        ? `${clean(values.bodyLock)}；${clean(task, `任务 ${taskIndex + 1}`)}`
        : groupIndex === 1
          ? `BODY: ${clean(values.bodyLock)} / SHADOW: ${clean(task, `任务 ${taskIndex + 1}`)}`
          : `BODY: ${clean(values.bodyLock)} / SHADOW: ${clean(task, `任务 ${taskIndex + 1}`)} / FIVE-POINT TIMELINE`;
      return `| ${code} | ${condition} | ${clean(task, `镜头任务 ${taskIndex + 1}`)} | ${input} | 待执行 |`;
    }),
  );
  const matrix = [
    `# ${clean(values.shotName, '影子动作')} / 九格变量矩阵`, '',
    `固定时长：${values.duration} 秒`,
    `固定摄影机：${clean(values.cameraRule)}`,
    `固定光线：${clean(values.lightRule)}`, '',
    '| 样本 | 写法 | 固定任务 | 本组输入 | 状态 |',
    '| --- | --- | --- | --- | --- |',
    ...matrixRows, '',
    '真实测试时还需固定模型、版本、画幅、参考图、输出数量和 Seed（如支持）。',
  ].join('\n');

  const reviewRows = values.timeline.map((point) => `| ${point.time} | ${clean(point.body, '待核对')} | ${clean(point.shadow, '待核对')} | 待记录 | 待记录 | 待记录 |`);
  const review = [
    `# ${clean(values.shotName, '影子动作')} / 五点验收表`, '',
    '| 时间点 | 实体目标 | 影子目标 | 实体实况 | 影子实况 | 光线 / 接触 |',
    '| --- | --- | --- | --- | --- | --- |',
    ...reviewRows, '',
    '## 失败标签',
    '- [ ] BODY_DRIFT / 实体发生计划外动作',
    '- [ ] SHADOW_COPY / 影子只复制实体姿势',
    '- [ ] CONTACT_BREAK / 影子脱离脚底或接触点',
    '- [ ] LIGHT_FLIP / 光向、长度或硬度突变',
    '- [ ] EXTRA_CAST / 出现多个影子或第二个人',
    '- [ ] CAMERA_DRIFT / 摄影机发生计划外移动', '',
    '本表只记录真实输出，不自动判定模型能力。',
  ].join('\n');

  return { prompt, matrix, review };
}

async function copyText(value: string) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return true;
    }
  } catch {
    // Continue to the manual copy fallback.
  }
  return false;
}

export function ShadowMotionCardBuilder() {
  const [values, setValues] = useState<ShadowCardValues>(exampleValues);
  const [loaded, setLoaded] = useState(false);
  const [copied, setCopied] = useState<OutputKey | null>(null);
  const [manualCopy, setManualCopy] = useState<string | null>(null);
  const outputs = useMemo(() => buildOutputs(values), [values]);
  const required = [values.bodyLock, values.shadowAction, values.attachment, values.lightRule, values.cameraRule];
  const completed = required.filter((value) => value.trim()).length;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const stored = window.localStorage.getItem(storageKey);
        if (stored) setValues(JSON.parse(stored) as ShadowCardValues);
      } catch {
        // A damaged draft should not block the tool.
      }
      setLoaded(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try { window.localStorage.setItem(storageKey, JSON.stringify(values)); } catch { /* Keep working without storage. */ }
  }, [loaded, values]);

  function update<K extends keyof ShadowCardValues>(key: K, value: ShadowCardValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setCopied(null);
    setManualCopy(null);
  }

  function updateTimeline(index: number, key: 'body' | 'shadow', value: string) {
    const timeline = values.timeline.map((point, pointIndex) => pointIndex === index ? { ...point, [key]: value } : point);
    update('timeline', timeline);
  }

  function updateTask(index: number, value: string) {
    const tasks = [...values.tasks] as ShadowCardValues['tasks'];
    tasks[index] = value;
    update('tasks', tasks);
  }

  async function copyOutput(key: OutputKey) {
    if (await copyText(outputs[key])) {
      setCopied(key);
      window.setTimeout(() => setCopied(null), 1800);
    } else {
      setManualCopy(outputs[key]);
    }
  }

  return (
    <section className="shadow-card-workbench" aria-label="影子动作拆分卡生成器">
      <div className="shadow-card-editor">
        <div className="shadow-card-heading">
          <div><span className="mono">01 / SEPARATE THE CLOCKS</span><h2>先分开谁不动，<br />再写谁在动。</h2></div>
          <div><button type="button" onClick={() => updateAll(setValues, exampleValues)}>载入示例</button><button type="button" onClick={() => updateAll(setValues, emptyValues)}>清空</button></div>
        </div>

        <section className="shadow-card-fields shadow-card-fields-body">
          <GroupHeading label="A / BODY LOCK" note="实体轨只写允许和禁止发生的事" />
          <ShadowField label="镜头名称" note="便于导出后识别" value={values.shotName} placeholder="例如：影子先抬起右手" onChange={(value) => update('shotName', value)} />
          <ShadowField label="实体人物锁定" note="姿势、脚点与允许的微动作" value={values.bodyLock} placeholder="例如：双脚固定，双臂垂下，只允许眨眼" onChange={(value) => update('bodyLock', value)} />
        </section>

        <section className="shadow-card-fields shadow-card-fields-shadow">
          <GroupHeading label="B / SHADOW PATH" note="只给单一影子一个清楚动作" />
          <ShadowField label="影子独立动作" note="起点、路径、停顿与复位" value={values.shadowAction} placeholder="例如：右臂抬到肩高，停顿后放下" onChange={(value) => update('shadowAction', value)} />
          <ShadowField label="脚底连接规则" note="影子与实体仍属于同一光学关系" value={values.attachment} placeholder="例如：始终从鞋底接触点连续延伸" onChange={(value) => update('attachment', value)} />
        </section>

        <section className="shadow-card-fields shadow-card-fields-world">
          <GroupHeading label="C / LIGHT & CAMERA" note="锁住能证明连续性的外部坐标" />
          <ShadowField label="光线规则" note="来源、方向、长度、软硬与色温" value={values.lightRule} placeholder="例如：左前方同一盏硬光，全程不变" onChange={(value) => update('lightRule', value)} />
          <ShadowField label="摄影机规则" note="优先固定机位与连续镜头" value={values.cameraRule} placeholder="例如：固定中景，不推拉、不切镜" onChange={(value) => update('cameraRule', value)} />
          <ShadowField label="排除项" note="只写能从画面核对的失败" value={values.negative} placeholder="例如：实体抬臂、多个影子、灯位翻转" onChange={(value) => update('negative', value)} />
          <label className="shadow-duration-field"><span><strong>镜头时长</strong><small>同一实验组保持一致</small></span><div><input type="number" min="2" max="20" value={values.duration} onChange={(event) => update('duration', Math.max(2, Math.min(20, Number(event.target.value) || 2)))} /><b className="mono">SEC</b></div></label>
        </section>

        <section className="shadow-card-timeline-editor">
          <GroupHeading label="D / FIVE CHECKPOINTS" note="每个节点分别写实体轨和影子轨" />
          <div className="shadow-timeline-table">
            <div className="shadow-timeline-head mono"><span>TIME</span><span>BODY</span><span>SHADOW</span></div>
            {values.timeline.map((point, index) => <div className="shadow-timeline-row" key={point.time}><b className="mono">{point.time}</b><input aria-label={`${point.time} 实体状态`} value={point.body} onChange={(event) => updateTimeline(index, 'body', event.target.value)} /><input aria-label={`${point.time} 影子状态`} value={point.shadow} onChange={(event) => updateTimeline(index, 'shadow', event.target.value)} /></div>)}
          </div>
        </section>

        <section className="shadow-card-fields shadow-card-fields-test">
          <GroupHeading label="E / THREE FIXED TASKS" note="三种写法执行相同任务，组成九格" />
          {values.tasks.map((task, index) => <ShadowField key={index} label={`镜头任务 ${index + 1}`} note={index === 0 ? '单一肢体动作' : index === 1 ? '位置变化再复位' : '方向性或指向动作'} value={task} placeholder={`填写固定任务 ${index + 1}`} onChange={(value) => updateTask(index, value)} />)}
        </section>
      </div>

      <aside className="shadow-clock-card" aria-live="polite">
        <div className="shadow-clock-topline mono"><span>TWO CLOCKS / ONE LIGHT</span><span>{completed} / 5</span></div>
        <div className="shadow-clock-stage" aria-label="实体保持静止，影子沿独立时间线运动的示意图">
          <div className="shadow-clock-person"><i /><b /></div>
          <div className="shadow-clock-cast"><i /><b /></div>
          <span className="shadow-clock-contact" />
          <em className="mono">BODY LOCKED</em><strong className="mono">SHADOW MOVES</strong>
        </div>
        <h2>{values.shotName.trim() || '未命名影子动作'}</h2>
        <div className="shadow-clock-tracks">
          <div className="shadow-track-label"><span className="mono">BODY</span><p>{clean(values.bodyLock, '等待实体锁定')}</p></div>
          <div className="shadow-track-line shadow-track-body">{values.timeline.map((point) => <span key={point.time}><i /><small>{point.time}</small><b>{clean(point.body, '—')}</b></span>)}</div>
          <div className="shadow-track-label"><span className="mono">SHADOW</span><p>{clean(values.shadowAction, '等待影子动作')}</p></div>
          <div className="shadow-track-line shadow-track-shadow">{values.timeline.map((point) => <span key={point.time}><i /><small>{point.time}</small><b>{clean(point.shadow, '—')}</b></span>)}</div>
        </div>
        <p>{completed < 5 ? '继续补齐光线、接触和摄影机规则，双时间线才具备可核对条件。' : '控制卡已具备试跑条件；真实输出仍需在五个时间点逐帧记录。'}</p>
        <small>{loaded ? '草稿只保存在当前浏览器，不上传。' : '正在读取本地草稿。'}</small>
      </aside>

      <section className="shadow-card-outputs">
        <div className="shadow-output-heading"><div><span className="mono">02 / COPY THE TEST FILES</span><h2>一张拆分卡，<br />对应三份工作文件。</h2></div><p>Prompt 负责单镜控制，九格负责比较写法，五点表负责记录真实输出。三份文件互相对照，不把提示词当作实验结论。</p></div>
        <div className="shadow-output-grid">
          <OutputCard label="A / PROMPT" title="双时间线提示块" outputKey="prompt" text={outputs.prompt} copied={copied} onCopy={copyOutput} />
          <OutputCard label="B / 3 × 3" title="九格变量矩阵" outputKey="matrix" text={outputs.matrix} copied={copied} onCopy={copyOutput} />
          <OutputCard label="C / REVIEW" title="五点验收表" outputKey="review" text={outputs.review} copied={copied} onCopy={copyOutput} />
        </div>
      </section>

      {manualCopy && <aside className="shadow-copy-fallback"><div><span className="mono">MANUAL COPY / 浏览器限制</span><p>点击文本框后按 Ctrl+A，再按 Ctrl+C。</p></div><button type="button" onClick={() => setManualCopy(null)}>关闭 ×</button><textarea readOnly value={manualCopy} aria-label="手动复制影子动作拆分卡内容" onFocus={(event) => event.currentTarget.select()} /></aside>}
    </section>
  );
}

function updateAll(setValues: (value: ShadowCardValues) => void, next: ShadowCardValues) {
  setValues(structuredClone(next));
}

function GroupHeading({ label, note }: { label: string; note: string }) {
  return <div className="shadow-group-heading"><span className="mono">{label}</span><p>{note}</p></div>;
}

function ShadowField({ label, note, value, placeholder, onChange }: { label: string; note: string; value: string; placeholder: string; onChange: (value: string) => void }) {
  return <label className="shadow-card-field"><span><strong>{label}</strong><small>{note}</small></span><textarea rows={2} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} /></label>;
}

function OutputCard({ label, title, outputKey, text, copied, onCopy }: { label: string; title: string; outputKey: OutputKey; text: string; copied: OutputKey | null; onCopy: (key: OutputKey) => void }) {
  return <article className={`shadow-output-card shadow-output-${outputKey}`}><div><span className="mono">{label}</span><button type="button" onClick={() => onCopy(outputKey)}>{copied === outputKey ? '已复制 ✓' : '复制 ↗'}</button></div><h3>{title}</h3><pre>{text}</pre></article>;
}
