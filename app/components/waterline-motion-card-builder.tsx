'use client';

import { useEffect, useMemo, useState } from 'react';

type OutputKey = 'ledger' | 'prompt' | 'review';
type MotionValues = {
  shotName: string;
  subject: string;
  umbrellaStart: string;
  umbrellaLock: string;
  waterStart: string;
  waterDirection: string;
  waterEnd: string;
  cameraLock: string;
  environmentLock: string;
  duration: number;
  fps: number;
  umbrellaLockAt: number;
  waterStartAt: number;
};

const storageKey = 'jing-waterline-motion-card-v1';
const checkpoints = [0, 25, 50, 75, 100] as const;

const exampleValues: MotionValues = {
  shotName: '《退水以前》/ Shot 11',
  subject: '顾岚站在水中，左手保持身体平衡，右手只操作一把珊瑚红长柄伞',
  umbrellaStart: '红伞完全合拢，伞尖向上，伞柄与右手接触稳定',
  umbrellaLock: '伞盖完全展开，伞骨锁定；伞柄、手位与人物站位保持不变',
  waterStart: '脚踝深清水覆盖木地板；清楚斜水线位于画面左前方',
  waterDirection: '从画面左前方沿同一条斜线，连续退向右后方出口',
  waterEnd: '水线越过右后方出口，木地板完全显露且保持湿润反光',
  cameraLock: '16:9 固定机位，中景偏全身，焦段、构图、曝光与景深不变；单一连续镜头',
  environmentLock: '象牙白书架、干燥书页、木地板和右后方出口的坐标、直线与材质全部保持',
  duration: 6,
  fps: 24,
  umbrellaLockAt: 40,
  waterStartAt: 50,
};

const emptyValues: MotionValues = {
  shotName: '', subject: '', umbrellaStart: '', umbrellaLock: '', waterStart: '', waterDirection: '', waterEnd: '', cameraLock: '', environmentLock: '',
  duration: 6, fps: 24, umbrellaLockAt: 40, waterStartAt: 50,
};

function copyText(value: string) {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(value).then(() => true).catch(() => false);
  return Promise.resolve(false);
}

function safe(value: string, fallback: string) {
  return value.trim() || fallback;
}

export function WaterlineMotionCardBuilder() {
  const [values, setValues] = useState<MotionValues>(exampleValues);
  const [loaded, setLoaded] = useState(false);
  const [copied, setCopied] = useState<OutputKey | null>(null);
  const [manualCopy, setManualCopy] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem(storageKey);
        if (saved) setValues(JSON.parse(saved) as MotionValues);
      } catch {
        // A damaged local draft should not block the worksheet.
      }
      setLoaded(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try { window.localStorage.setItem(storageKey, JSON.stringify(values)); } catch { /* Keep working without storage. */ }
  }, [loaded, values]);

  const derived = useMemo(() => {
    const totalFrames = Math.max(1, Math.round(values.duration * values.fps));
    const lockFrame = Math.round(totalFrames * values.umbrellaLockAt / 100);
    const waterFrame = Math.round(totalFrames * values.waterStartAt / 100);
    const gapFrames = waterFrame - lockFrame;
    const status = gapFrames <= 0 ? 'blocked' : gapFrames < Math.max(2, Math.round(values.fps * .2)) ? 'tight' : 'ready';
    const rows = checkpoints.map((percent) => {
      const time = values.duration * percent / 100;
      const frame = Math.round(totalFrames * percent / 100);
      const umbrella = percent === 0
        ? safe(values.umbrellaStart, '伞起点待填写')
        : percent < values.umbrellaLockAt
          ? `从起点向锁定状态展开；此时不得移动水线`
          : safe(values.umbrellaLock, '伞锁定状态待填写');
      const waterProgress = percent < values.waterStartAt ? 0 : Math.min(100, Math.round((percent - values.waterStartAt) / Math.max(1, 100 - values.waterStartAt) * 100));
      const water = waterProgress === 0
        ? `0% · ${safe(values.waterStart, '水线起点待填写')}`
        : waterProgress >= 100
          ? `100% · ${safe(values.waterEnd, '水线终点待填写')}`
          : `${waterProgress}% · 沿“${safe(values.waterDirection, '方向待填写')}”单调后退`;
      return { percent, time, frame, umbrella, water, waterProgress };
    });
    return { totalFrames, lockFrame, waterFrame, gapFrames, status, rows };
  }, [values]);

  const outputs = useMemo(() => {
    const name = safe(values.shotName, '未命名镜头');
    const statusText = derived.status === 'blocked' ? '未通过：水线启动没有晚于伞锁定' : derived.status === 'tight' ? '待确认：因果间隔过短' : '可测试：伞锁定后留有可见间隔';
    const ledger = [
      `# ${name} / 五点动作账本`, '',
      `时长：${values.duration} 秒 · ${values.fps} fps · 约 ${derived.totalFrames} 帧`,
      `因果闸门：伞锁定 F${derived.lockFrame} → 水首动 F${derived.waterFrame} → 间隔 ${derived.gapFrames} 帧`,
      `协议状态：${statusText}`, '',
      '| 检查点 | 时间 | 帧号 | 红伞状态 | 水线状态 |',
      '| ---: | ---: | ---: | --- | --- |',
      ...derived.rows.map((row) => `| ${row.percent}% | ${row.time.toFixed(2)}s | F${row.frame} | ${row.umbrella} | ${row.water} |`), '',
      `人物锁：${safe(values.subject, '待填写')}`,
      `机位锁：${safe(values.cameraLock, '待填写')}`,
      `环境锁：${safe(values.environmentLock, '待填写')}`,
      '', '说明：这是生成前协议。实际结果必须另记真实帧号，不能用计划帧号替代观察。',
    ].join('\n');

    const prompt = derived.status === 'blocked' ? [
      'BLOCKED / 因果顺序未通过', '',
      `当前时序：伞在 ${values.umbrellaLockAt}% 锁定，水在 ${values.waterStartAt}% 首动。`,
      '水首动必须严格晚于伞锁定；请先调整上方滑杆，再生成并复制完整视频 Prompt。', '',
      'STATUS: 不可测试，未生成视频 Prompt。',
    ].join('\n') : [
      `生成一个 ${values.duration} 秒、${values.fps} fps、16:9 的单一连续镜头。`, '',
      `镜头任务：${name}`,
      `人物与道具：${safe(values.subject, '待填写')}`, '',
      '动作必须严格按以下顺序发生：',
      `1. 0%：${safe(values.umbrellaStart, '伞起点待填写')}。${safe(values.waterStart, '水线起点待填写')}，水面完全静止。`,
      `2. 0%—${values.umbrellaLockAt}%：只让红伞从起点逐步展开；水线不得移动。`,
      `3. ${values.umbrellaLockAt}%：${safe(values.umbrellaLock, '伞锁定状态待填写')}。`,
      `4. ${values.umbrellaLockAt}%—${values.waterStartAt}%：保持锁定状态，留下可见停顿；水线继续静止。`,
      `5. ${values.waterStartAt}%—100%：红伞、人物和背景全部锁定，只让水线${safe(values.waterDirection, '沿固定方向后退')}。`,
      `6. 100%：${safe(values.waterEnd, '水线终点待填写')}。`, '',
      `摄影机：${safe(values.cameraLock, '待填写')}`,
      `环境常量：${safe(values.environmentLock, '待填写')}`, '',
      '整条镜头不得切镜、转场、时间跳跃或用遮挡隐藏动作。先完成伞，再移动水；两件事不能同时发生。',
      'STATUS: 待测试 Prompt，不代表已经生成或通过。',
    ].join('\n');

    const review = [
      `# ${name} / 负面约束与验收`, '',
      '## 生成时排除',
      '- 不增加第二把伞，不复制伞柄、伞骨、手或人物',
      '- 水不能提前后退、与伞同时动作、倒流、分叉或局部随机消失',
      '- 不允许隐性切镜、镜头重置、速度突变或用前景遮挡跳过动作',
      '- 人物身份、手位、服装、书架直线、书页、地板材质与出口坐标不得漂移',
      '- 水退去时只改变水线位置，不让背景、道具或人物一起融化', '',
      '## 逐帧验收',
      `- [ ] 实际伞锁定帧：____（计划参考 F${derived.lockFrame}）`,
      `- [ ] 实际水首动帧：____（计划参考 F${derived.waterFrame}）`,
      '- [ ] 水首动帧严格晚于伞锁定帧',
      '- [ ] 0 / 25 / 50 / 75 / 100% 五点水线位置单调后退',
      '- [ ] 全程只有一把完整红伞，手与伞柄接触可信',
      '- [ ] 人物、机位、曝光、书架、书页、地板和出口保持连续', '',
      '## 失败标签',
      '`WATER_EARLY` `SIMULTANEOUS` `ORDER_REVERSED` `UMBRELLA_DRIFT` `HAND_BREAK` `WATER_REVERSE` `WATER_SPLIT` `WORLD_MELT` `HIDDEN_CUT`', '',
      '结论只填写真实视频观察；计划帧号、Prompt 和静态概念图都不是实验结果。',
    ].join('\n');
    return { ledger, prompt, review };
  }, [derived, values]);

  function update<K extends keyof MotionValues>(key: K, value: MotionValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setCopied(null);
    setManualCopy(null);
  }

  function replaceValues(next: MotionValues) {
    setValues({ ...next });
    setCopied(null);
    setManualCopy(null);
  }

  async function handleCopy(key: OutputKey) {
    if (derived.status === 'blocked') return;
    if (await copyText(outputs[key])) {
      setCopied(key);
      window.setTimeout(() => setCopied(null), 1600);
    } else {
      setManualCopy(outputs[key]);
    }
  }

  const statusCopy = derived.status === 'blocked'
    ? { label: '水线抢跑', note: '把水首动时刻移到伞锁定之后。' }
    : derived.status === 'tight'
      ? { label: '间隔太窄', note: '先留出几帧稳定状态，让先后关系可见。' }
      : { label: '因果闸门已建立', note: `伞锁定后留出 ${derived.gapFrames} 帧，再开始退水。` };

  return (
    <section className="waterline-card-workbench" aria-label="水线动作卡生成器">
      <div className="waterline-card-editor">
        <div className="waterline-builder-heading">
          <div><span className="mono">01 / CAUSAL BRIEF</span><h2>先锁住不动的，<br />再写唯一变化。</h2></div>
          <div><button type="button" onClick={() => replaceValues(exampleValues)}>载入《退水以前》</button><button type="button" onClick={() => replaceValues(emptyValues)}>清空草稿</button></div>
        </div>

        <section className="waterline-field-group waterline-group-shot">
          <div className="waterline-group-heading"><span className="mono">SHOT / 镜头常量</span><p>一个主体、一把伞、一个固定机位。</p></div>
          <label className="waterline-card-field"><span><strong>镜头名称</strong><small>用于导出文件标题</small></span><input value={values.shotName} onChange={(event) => update('shotName', event.target.value)} placeholder="例如：Shot 11 / 撑伞退水" /></label>
          <label className="waterline-card-field"><span><strong>人物与道具</strong><small>身份、手位与唯一道具</small></span><textarea value={values.subject} onChange={(event) => update('subject', event.target.value)} placeholder="谁站在哪里，用哪只手操作哪一把伞" /></label>
          <label className="waterline-card-field"><span><strong>机位锁</strong><small>构图、焦段、曝光与镜头连续性</small></span><textarea value={values.cameraLock} onChange={(event) => update('cameraLock', event.target.value)} placeholder="固定机位；不切镜、不变焦" /></label>
        </section>

        <section className="waterline-field-group waterline-group-umbrella">
          <div className="waterline-group-heading"><span className="mono">GATE / 红伞闸门</span><p>锁定完成以前，水面必须完全静止。</p></div>
          <label className="waterline-card-field"><span><strong>伞的起点</strong><small>0% 可以直接看见的状态</small></span><textarea value={values.umbrellaStart} onChange={(event) => update('umbrellaStart', event.target.value)} placeholder="合拢、手位、伞尖方向" /></label>
          <label className="waterline-card-field"><span><strong>伞的锁定状态</strong><small>允许水线启动的必要条件</small></span><textarea value={values.umbrellaLock} onChange={(event) => update('umbrellaLock', event.target.value)} placeholder="伞盖展开，伞骨锁定并保持" /></label>
          <label className="waterline-range-field"><span><strong>伞锁定时刻</strong><small>占整条镜头的百分比</small></span><div><input type="range" min="15" max="70" step="5" value={values.umbrellaLockAt} onChange={(event) => update('umbrellaLockAt', Number(event.target.value))} /><output>{values.umbrellaLockAt}% · F{derived.lockFrame}</output></div></label>
        </section>

        <section className="waterline-field-group waterline-group-water">
          <div className="waterline-group-heading"><span className="mono">PATH / 水线轨道</span><p>起点、方向和终点必须能在画面里定位。</p></div>
          <label className="waterline-card-field"><span><strong>水线起点</strong><small>启动前始终保持</small></span><textarea value={values.waterStart} onChange={(event) => update('waterStart', event.target.value)} placeholder="水深、边界和画面坐标" /></label>
          <label className="waterline-card-field"><span><strong>单一方向</strong><small>用画面或空间端点描述</small></span><textarea value={values.waterDirection} onChange={(event) => update('waterDirection', event.target.value)} placeholder="从左前方连续退向右后方" /></label>
          <label className="waterline-card-field"><span><strong>水线终点</strong><small>100% 的可验收状态</small></span><textarea value={values.waterEnd} onChange={(event) => update('waterEnd', event.target.value)} placeholder="水线越过出口，地面显露" /></label>
          <label className="waterline-range-field"><span><strong>水首动时刻</strong><small>必须严格晚于伞锁定</small></span><div><input type="range" min="20" max="85" step="5" value={values.waterStartAt} onChange={(event) => update('waterStartAt', Number(event.target.value))} /><output>{values.waterStartAt}% · F{derived.waterFrame}</output></div></label>
        </section>

        <section className="waterline-field-group waterline-group-world">
          <div className="waterline-group-heading"><span className="mono">WORLD / 环境锁</span><p>退水不是让整个世界一起改变。</p></div>
          <label className="waterline-card-field"><span><strong>环境常量</strong><small>坐标、材质、光线与必须不动的物体</small></span><textarea value={values.environmentLock} onChange={(event) => update('environmentLock', event.target.value)} placeholder="书架、书页、地板和出口保持不变" /></label>
          <div className="waterline-number-pair">
            <label><span>镜头时长</span><div><input type="number" min="2" max="20" step=".5" value={values.duration} onChange={(event) => update('duration', Math.max(2, Number(event.target.value) || 2))} /><b>秒</b></div></label>
            <label><span>计划帧率</span><div><input type="number" min="12" max="120" step="1" value={values.fps} onChange={(event) => update('fps', Math.max(12, Number(event.target.value) || 24))} /><b>fps</b></div></label>
          </div>
        </section>
      </div>

      <aside className={`waterline-gate-card waterline-status-${derived.status}`} aria-live="polite">
        <div className="waterline-gate-topline mono"><span>02 / LIVE GATE</span><span>{derived.totalFrames} FRAMES</span></div>
        <div className="waterline-gate-ruler" aria-label={`伞在第 ${derived.lockFrame} 帧锁定，水在第 ${derived.waterFrame} 帧开始移动`}>
          <div className="waterline-ruler-track" style={{ '--lock-at': `${values.umbrellaLockAt}%`, '--move-at': `${values.waterStartAt}%` } as React.CSSProperties}><i style={{ left: `${values.umbrellaLockAt}%` }} /><b style={{ left: `${values.waterStartAt}%` }} /></div>
          <div className="waterline-ruler-labels"><span style={{ left: `${values.umbrellaLockAt}%` }}>LOCK<br />F{derived.lockFrame}</span><span style={{ left: `${values.waterStartAt}%` }}>MOVE<br />F{derived.waterFrame}</span></div>
          <div className="waterline-ruler-points">{checkpoints.map((point) => <span key={point}><i style={{ '--water-progress': `${derived.rows.find((row) => row.percent === point)?.waterProgress ?? 0}%` } as React.CSSProperties} /><b>{point}%</b></span>)}</div>
        </div>
        <span className="mono">CAUSAL STATUS / 因果检查</span><h2>{statusCopy.label}</h2><p>{statusCopy.note}</p>
        <dl className="waterline-gate-metrics"><div><dt>伞锁定</dt><dd>F{derived.lockFrame}</dd></div><div><dt>水首动</dt><dd>F{derived.waterFrame}</dd></div><div><dt>可见间隔</dt><dd>{derived.gapFrames}f</dd></div></dl>
        <div className="waterline-mini-ledger">{derived.rows.map((row) => <article key={row.percent}><span className="mono">{row.percent}%</span><div><strong>{row.percent < values.umbrellaLockAt ? '伞展开中' : '伞已锁定'}</strong><small>{row.waterProgress ? `水线 ${row.waterProgress}%` : '水线保持'}</small></div><b>F{row.frame}</b></article>)}</div>
        <small>这里只显示计划时序。生成后请用真实视频重新记录帧号。</small>
      </aside>

      <section className="waterline-card-outputs">
        <div className="waterline-output-heading"><div><span className="mono">03 / TEST PACK</span><h2>一条因果链，<br />交出三份文件。</h2></div><p>五点账本负责计划，完整 Prompt 负责生成，负面约束与验收表负责回到真实画面。三份内容都会跟随上方字段同步更新。</p></div>
        <div className="waterline-output-grid">
          {([
            ['ledger', '五点动作账本', '把百分比换算为时间和计划帧号，保留伞与水的双轨状态。'],
            ['prompt', '完整视频 Prompt', '只允许一个连续镜头，并把“先锁定、后退水”写成可执行顺序。'],
            ['review', '负面约束与验收', '生成前排除常见失败，生成后填写真实帧号与失败标签。'],
          ] as Array<[OutputKey, string, string]>).map(([key, title, note]) => <article className={`waterline-output-card waterline-output-${key}`} key={key}><div><span className="mono">{key.toUpperCase()}</span><button type="button" disabled={derived.status === 'blocked'} onClick={() => handleCopy(key)}>{derived.status === 'blocked' ? '先修正时序' : copied === key ? '已复制 ✓' : '复制内容'}</button></div><h3>{title}</h3><p>{note}</p><pre>{outputs[key]}</pre></article>)}
        </div>
        {manualCopy && <aside className="waterline-copy-fallback"><div><b>浏览器没有开放自动复制。</b><p>点击文本框后全选复制。</p></div><button type="button" onClick={() => setManualCopy(null)}>关闭 ×</button><textarea readOnly value={manualCopy} onFocus={(event) => event.currentTarget.select()} /></aside>}
      </section>
    </section>
  );
}
