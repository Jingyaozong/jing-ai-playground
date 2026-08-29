'use client';

import { useMemo, useState } from 'react';

type AnchorKind = 'person' | 'object' | 'scene' | 'camera';
type VisualInput = 'none' | 'first-frame' | 'reference';
type OutputKey = 'prompt' | 'matrix' | 'review';

type EffectValues = {
  effect: string;
  anchorKind: AnchorKind;
  anchor: string;
  boundary: string;
  inside: string;
  outside: string;
  subjectMotion: string;
  syncRule: string;
  trace: string;
  camera: string;
  duration: number;
  visualInput: VisualInput;
  taskA: string;
  taskB: string;
  taskC: string;
};

const emptyValues: EffectValues = {
  effect: '', anchorKind: 'person', anchor: '', boundary: '', inside: '', outside: '', subjectMotion: '', syncRule: '', trace: '', camera: '', duration: 5,
  visualInput: 'first-frame', taskA: '', taskB: '', taskC: '',
};

const exampleValues: EffectValues = {
  effect: '一根紧凑的细雨柱',
  anchorKind: 'person',
  anchor: '林栖的身体中心轴线',
  boundary: '约一个半肩宽；从头顶上方延伸到脚下；边缘轻微羽化',
  inside: '细密垂直雨线；透明伞遮挡部分雨滴；脚下形成小范围湿区',
  outside: '空气清澈；厨房台面和人物路径外的地面保持干燥、无反光',
  subjectMotion: '林栖向画面右侧缓慢走三步',
  syncRule: '雨柱与身体同速移动，中心不落后；旧位置立即停止落雨',
  trace: '只保留人物走过后的一小段湿脚印，其他旧位置恢复干燥空气',
  camera: '固定中景，一个连续镜头，不变焦、不横移',
  duration: 5,
  visualInput: 'first-frame',
  taskA: '明亮厨房里横向走三步',
  taskB: '日光通道里持续向前快走',
  taskC: '公交站近景中缓慢收起透明伞',
};

const anchorLabels: Record<AnchorKind, string> = {
  person: '人物锚点', object: '物体锚点', scene: '场景锚点', camera: '摄影机锚点',
};

const visualLabels: Record<VisualInput, string> = {
  none: '不增加视觉输入', 'first-frame': '增加首帧边界证据', reference: '增加参考图',
};

const coverageKeys: Array<keyof EffectValues> = ['effect', 'anchor', 'boundary', 'outside', 'subjectMotion', 'syncRule'];

function clean(value: string, fallback = '未填写') {
  return value.trim() || fallback;
}

function buildOutputs(values: EffectValues) {
  const effect = clean(values.effect, '局部特效');
  const anchor = clean(values.anchor, '待定义锚点');
  const tasks = [values.taskA, values.taskB, values.taskC].map((task, index) => clean(task, `镜头任务 ${index + 1}`));
  const prompt = [
    `# ${effect} / LOCAL EFFECT TEST BLOCK`, '',
    `DURATION: ${values.duration} 秒`,
    `CAMERA: ${clean(values.camera)}`,
    `SUBJECT MOTION: ${clean(values.subjectMotion)}`, '',
    `ANCHOR TYPE: ${anchorLabels[values.anchorKind]}`,
    `ANCHOR: ${anchor}`,
    `BOUNDARY: ${clean(values.boundary)}`,
    `INSIDE STATE: ${clean(values.inside)}`,
    `OUTSIDE STATE: ${clean(values.outside)}`,
    `TIME RULE: ${clean(values.syncRule)}`,
    `ALLOWED TRACE: ${clean(values.trace, '无额外残留')}`, '',
    `VISUAL INPUT: ${visualLabels[values.visualInput]}`,
    'NOTE: 待测试结构，不代表模型会稳定执行。',
  ].join('\n');

  const baseline = `${effect}跟随${anchor}`;
  const constrained = [baseline, clean(values.boundary), clean(values.outside), clean(values.syncRule)].join('；');
  const matrixRows = ['A / 普通文本', 'B / 空间约束', 'C / 空间约束 + 视觉输入'].flatMap((condition, groupIndex) => tasks.map((task, taskIndex) => {
    const code = `${String.fromCharCode(65 + groupIndex)}0${taskIndex + 1}`;
    const input = groupIndex === 0 ? baseline : groupIndex === 1 ? constrained : `${constrained}；${visualLabels[values.visualInput]}`;
    return `| ${code} | ${condition} | ${task} | ${input} | 待执行 |`;
  }));
  const matrix = [
    `# ${effect} / 九格对照测试`, '',
    `固定时长：${values.duration} 秒`,
    `固定摄影机：${clean(values.camera)}`, '',
    '| 样本 | 条件 | 镜头任务 | 本组输入 | 状态 |',
    '| --- | --- | --- | --- | --- |',
    ...matrixRows, '',
    '说明：A、B、C 组只改变空间约束与视觉输入；真实执行前仍需固定模型、版本、画幅、输出数量和 Seed（如支持）。',
  ].join('\n');

  const reviewRows = ['开始 / 0%', '1/4 / 25%', '中点 / 50%', '3/4 / 75%', '结束 / 100%'].map((time) => `| ${time} | 待记录 | 待记录 | 待记录 | 待记录 |`);
  const review = [
    `# ${effect} / 逐帧关系验收`, '',
    `锚点：${anchor}`,
    `目标边界：${clean(values.boundary)}`,
    `区外基准：${clean(values.outside)}`, '',
    '| 时间点 | 特效中心相对锚点 | 边界尺寸 | 区外状态 | 连带损伤 |',
    '| --- | --- | --- | --- | --- |',
    ...reviewRows, '',
    '## 失败标签',
    '- [ ] ANCHOR_LAG / 特效落后或超前',
    '- [ ] SCENE_FILL / 局部效果扩散到全场',
    '- [ ] BOUNDARY_PULSE / 边界忽大忽小',
    '- [ ] CAMERA_LOCK / 特效锁在画框而非目标锚点',
    '- [ ] TRAIL_RESET / 残留痕迹消失或旧位置继续生效',
    '- [ ] COLLATERAL_DRIFT / 人物、道具或场景被连带改变', '',
    '本表用于记录真实输出，不预设及格线，也不生成模型结论。',
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
    // Continue to the local textarea fallback.
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

export function LocalEffectBuilder() {
  const [values, setValues] = useState<EffectValues>(exampleValues);
  const [copied, setCopied] = useState<OutputKey | null>(null);
  const [manualCopy, setManualCopy] = useState<string | null>(null);
  const outputs = useMemo(() => buildOutputs(values), [values]);
  const completed = coverageKeys.filter((key) => String(values[key]).trim()).length;
  const canCopy = completed > 0;

  function update<K extends keyof EffectValues>(key: K, value: EffectValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setCopied(null);
    setManualCopy(null);
  }

  async function copyOutput(key: OutputKey) {
    if (await copyText(outputs[key])) {
      setCopied(key);
      setManualCopy(null);
      window.setTimeout(() => setCopied(null), 1800);
    } else {
      setManualCopy(outputs[key]);
    }
  }

  return (
    <section className="effect-workbench" aria-label="局部特效约束卡生成器">
      <div className="effect-editor">
        <div className="effect-panel-heading">
          <div><span className="mono">01 / DEFINE THE RELATION</span><h2>不是加一个效果，<br />是锁住一段关系。</h2></div>
          <div><button type="button" onClick={() => setValues(exampleValues)}>载入示例</button><button type="button" onClick={() => setValues(emptyValues)}>清空</button></div>
        </div>

        <section className="effect-field-group effect-group-relation">
          <div className="effect-group-heading"><span className="mono">A / 锚点与边界</span><p>特效跟着谁，边界内外分别发生什么</p></div>
          <EffectField label="局部特效" note="写可见效果，不写抽象情绪" value={values.effect} placeholder="例如：一根紧凑的细雨柱" onChange={(value) => update('effect', value)} />
          <label className="effect-select-field"><span><strong>锚点类型</strong><small>人物、物体、场景或摄影机</small></span><select value={values.anchorKind} onChange={(event) => update('anchorKind', event.target.value as AnchorKind)}><option value="person">人物锚点</option><option value="object">物体锚点</option><option value="scene">场景锚点</option><option value="camera">摄影机锚点</option></select></label>
          <EffectField label="具体锚点" note="身体部位、物体或空间位置" value={values.anchor} placeholder="例如：人物身体中心轴线" onChange={(value) => update('anchor', value)} />
          <EffectField label="边界形状与尺度" note="用肩宽、物体宽度或空间关系描述" value={values.boundary} placeholder="例如：一个半肩宽的垂直圆柱，边缘轻微羽化" onChange={(value) => update('boundary', value)} />
          <EffectField label="边界内状态" note="效果本身以及遮挡、密度和接触" value={values.inside} placeholder="例如：细密雨线，伞面遮挡部分雨滴" onChange={(value) => update('inside', value)} />
          <EffectField label="边界外状态" note="必须留下可以比较的视觉证据" value={values.outside} placeholder="例如：空气清澈，地面干燥无反光" onChange={(value) => update('outside', value)} />
        </section>

        <section className="effect-field-group effect-group-time">
          <div className="effect-group-heading"><span className="mono">B / 时间里的关系</span><p>主体、特效、痕迹和摄影机怎样各自移动</p></div>
          <EffectField label="主体动作" note="这一镜只保留最重要的动作路径" value={values.subjectMotion} placeholder="例如：人物向画面右侧缓慢走三步" onChange={(value) => update('subjectMotion', value)} />
          <EffectField label="同步规则" note="跟随速度、结束方式与旧位置状态" value={values.syncRule} placeholder="例如：雨柱同速移动，旧位置立即停止落雨" onChange={(value) => update('syncRule', value)} />
          <EffectField label="允许留下的痕迹" note="湿脚印、余光、烟迹或无残留" value={values.trace} placeholder="例如：只保留一小段湿脚印" onChange={(value) => update('trace', value)} />
          <EffectField label="摄影机" note="固定、跟随或其他单一主要路径" value={values.camera} placeholder="例如：固定中景，一个连续镜头" onChange={(value) => update('camera', value)} />
          <div className="effect-compact-grid">
            <label><span><strong>镜头时长</strong><small>同组保持一致</small></span><div><input type="number" min="2" max="20" value={values.duration} onChange={(event) => update('duration', Math.max(2, Math.min(20, Number(event.target.value) || 2)))} /><b className="mono">SEC</b></div></label>
            <label><span><strong>C 组视觉输入</strong><small>按当前平台能力选择</small></span><select value={values.visualInput} onChange={(event) => update('visualInput', event.target.value as VisualInput)}><option value="first-frame">首帧边界证据</option><option value="reference">参考图</option><option value="none">不增加视觉输入</option></select></label>
          </div>
        </section>

        <section className="effect-field-group effect-group-test">
          <div className="effect-group-heading"><span className="mono">C / 三个固定任务</span><p>三种条件都执行同样动作，组成九格</p></div>
          {(['taskA', 'taskB', 'taskC'] as const).map((key, index) => <EffectField key={key} label={`镜头任务 ${index + 1}`} note={index === 0 ? '基础移动或固定镜头' : index === 1 ? '提高速度或增加跟拍压力' : '加入物体接触或边界变化'} value={values[key]} placeholder={`写下固定镜头任务 ${index + 1}`} onChange={(value) => update(key, value)} />)}
        </section>
      </div>

      <aside className="effect-relation-card" aria-live="polite">
        <div className="effect-card-topline mono"><span>RELATION MAP</span><span>{completed} / {coverageKeys.length}</span></div>
        <div className="effect-target" aria-label="局部特效锚点与边界示意图">
          <span className="effect-outside-label mono">OUTSIDE / {values.outside.trim() ? 'DEFINED' : 'WAITING'}</span>
          <i className={`effect-ring effect-ring-outside ${values.outside.trim() ? 'is-filled' : ''}`} />
          <i className={`effect-ring effect-ring-boundary ${values.boundary.trim() ? 'is-filled' : ''}`} />
          <div className={`effect-rain-lines ${values.effect.trim() ? 'is-filled' : ''}`}><i /><i /><i /><i /><i /></div>
          <b className={`effect-anchor-dot ${values.anchor.trim() ? 'is-filled' : ''}`}>＋</b>
          <small className="mono">{anchorLabels[values.anchorKind]}</small>
        </div>
        <h2>{values.effect.trim() || '未命名局部特效'}</h2>
        <div className="effect-card-ledger"><span><small>ANCHOR</small><b>{clean(values.anchor, '等待锚点')}</b></span><span><small>BOUNDARY</small><b>{clean(values.boundary, '等待边界')}</b></span><span><small>TIME RULE</small><b>{clean(values.syncRule, '等待同步规则')}</b></span></div>
        <p>{completed === 0 ? '先写特效和锚点，再补边界外可见状态。' : completed < coverageKeys.length ? '关系已经出现轮廓；继续补齐时间规则和区外证据。' : '约束卡已经可以试跑；真正结果仍需逐帧记录。'}</p>
        <small className="effect-local-note">所有输入只在当前页面处理，不上传、不保存。</small>
      </aside>

      <section className="effect-output-section">
        <div className="effect-output-heading"><div><span className="mono">02 / COPY &amp; TEST</span><h2>一张关系卡，<br />生成三种工作文件。</h2></div><p>Prompt 块描述单镜关系；九格矩阵控制测试变量；逐帧表记录真实输出。三者都不会替你生成视频或预测成功率。</p></div>
        <div className="effect-output-grid">
          <EffectOutputCard label="A / PROMPT BLOCK" title="局部特效提示块" outputKey="prompt" text={outputs.prompt} canCopy={canCopy} copied={copied} onCopy={copyOutput} />
          <EffectOutputCard label="B / 3 × 3 MATRIX" title="九格对照测试" outputKey="matrix" text={outputs.matrix} canCopy={canCopy} copied={copied} onCopy={copyOutput} />
          <EffectOutputCard label="C / FRAME REVIEW" title="逐帧关系验收" outputKey="review" text={outputs.review} canCopy={canCopy} copied={copied} onCopy={copyOutput} />
        </div>
      </section>

      {manualCopy && <aside className="effect-copy-fallback"><div><span className="mono">MANUAL COPY / 浏览器限制</span><p>点击文本框后按 Ctrl+A，再按 Ctrl+C。</p></div><button type="button" onClick={() => setManualCopy(null)}>关闭 ×</button><textarea readOnly value={manualCopy} aria-label="手动复制局部特效约束内容" /></aside>}
    </section>
  );
}

function EffectField({ label, note, value, placeholder, onChange }: { label: string; note: string; value: string; placeholder: string; onChange: (value: string) => void }) {
  return <label className="effect-text-field"><span><strong>{label}</strong><small>{note}</small></span><textarea rows={2} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} /></label>;
}

function EffectOutputCard({ label, title, outputKey, text, canCopy, copied, onCopy }: { label: string; title: string; outputKey: OutputKey; text: string; canCopy: boolean; copied: OutputKey | null; onCopy: (key: OutputKey) => void }) {
  return <article className={`effect-output-card effect-output-${outputKey}`}><div><span className="mono">{label}</span><button type="button" disabled={!canCopy} onClick={() => onCopy(outputKey)}>{copied === outputKey ? '已复制 ✓' : '复制 ↗'}</button></div><h3>{title}</h3>{canCopy ? <pre>{text}</pre> : <div className="effect-output-empty"><span>＋</span><p>填写至少一项关系后，这里会生成可复制内容。</p></div>}</article>;
}
