'use client';

import { useEffect, useMemo, useState } from 'react';

type OutputKey = 'prompt' | 'checklist' | 'revision';
type PromptValues = {
  shotName: string;
  duration: number;
  subject: string;
  scene: string;
  startState: string;
  action: string;
  endState: string;
  camera: string;
  environment: string;
  keep: string;
  exclude: string;
};
type TextFieldKey = Exclude<keyof PromptValues, 'shotName' | 'duration'>;

const storageKey = 'jing-shot-prompt-builder-v1';

const exampleValues: PromptValues = {
  shotName: '乔野拿起白杯',
  duration: 5,
  subject: '乔野，27岁，黑色低马尾，珊瑚红夹克、浅蓝衬衫、深蓝阔腿裤；右手接近杯子',
  scene: '旧家厨房晨光；白色陶瓷杯位于黄色杯垫中央；杯柄朝画面右侧；背景家具和北窗位置固定',
  startState: '乔野站在桌边，右手距离杯柄约一厘米；杯底完整落在杯垫上，人物与杯子都静止',
  action: '右手缓慢靠近；指尖接触杯柄后四指闭合；完成抓握以后，杯底平稳离开杯垫两厘米',
  endState: '右手保持抓握，白杯悬停在杯垫上方两厘米；人物停住，杯口、杯柄方向不变',
  camera: '固定近景，手、杯柄和杯底始终在画面内；不推拉、不摇移、不切镜',
  environment: '窗帘只有很轻的自然摆动；桌面、杯垫和背景完全稳定',
  keep: '同一张脸、同一发型和服装；单只白杯；杯柄方向；黄色杯垫位置；晨光从北窗进入',
  exclude: '杯子提前移动、悬浮或复制；手指融合或穿过杯柄；抓握点滑动；隐性切镜；背景弯曲；新增人物',
};

const emptyValues: PromptValues = {
  shotName: '', duration: 5, subject: '', scene: '', startState: '', action: '', endState: '', camera: '', environment: '', keep: '', exclude: '',
};

function clean(value: string, fallback = '未填写') {
  return value.trim() || fallback;
}

function buildOutputs(values: PromptValues) {
  const prompt = [
    `# ${clean(values.shotName, '未命名镜头')} / SHOT PROMPT`, '',
    `DURATION: ${values.duration} 秒`,
    `SUBJECT: ${clean(values.subject)}`,
    `SCENE: ${clean(values.scene)}`, '',
    `START: ${clean(values.startState)}`,
    `ACTION: ${clean(values.action)}`,
    `END: ${clean(values.endState)}`, '',
    `CAMERA: ${clean(values.camera)}`,
    `ENVIRONMENT: ${clean(values.environment)}`, '',
    `KEEP: ${clean(values.keep)}`,
    `EXCLUDE: ${clean(values.exclude)}`, '',
    '只生成一个连续镜头。主体动作按 START → ACTION → END 的顺序发生；没有写出的元素不要新增。',
    'STATUS: 待测试制作提示，不代表模型会稳定执行。',
  ].join('\n');

  const checklist = [
    `# ${clean(values.shotName, '未命名镜头')} / 验收清单`, '',
    `- [ ] 时长接近 ${values.duration} 秒，没有隐性切镜`,
    `- [ ] 主体身份与服装保持：${clean(values.subject, '待填写主体锚点')}`,
    `- [ ] 场景结构与固定道具保持：${clean(values.scene, '待填写场景锚点')}`,
    `- [ ] 首帧符合：${clean(values.startState, '待填写')}`,
    `- [ ] 动作只发生一次且顺序正确：${clean(values.action, '待填写')}`,
    `- [ ] 尾帧停在：${clean(values.endState, '待填写')}`,
    `- [ ] 摄影机符合：${clean(values.camera, '待填写')}`,
    `- [ ] 环境变化符合：${clean(values.environment, '待填写')}`,
    `- [ ] 未出现禁止项：${clean(values.exclude, '待填写')}`, '',
    '判定：待真实样本生成后填写。',
  ].join('\n');

  const revision = [
    `# ${clean(values.shotName, '未命名镜头')} / 返修记录`, '',
    '| 项目 | 记录 |',
    '| --- | --- |',
    '| 模型 / 版本 | 待填写 |',
    '| 生成设置 / Seed | 待填写 |',
    '| 候选 ID | 待填写 |',
    '| 首次失败时间 | 待观看后填写 |',
    '| 可见失败现象 | 待观看后填写，不推测模型内部原因 |',
    '| 仍可用区间 | 待填写 |',
    '| 下一轮唯一变量 | 待填写 |', '',
    '## 当前控制事实',
    `- 必须保持：${clean(values.keep)}`,
    `- 禁止发生：${clean(values.exclude)}`, '',
    '没有真实输出时，本表只保留空白记录位，不生成结论。',
  ].join('\n');

  return { prompt, checklist, revision };
}

async function copyText(value: string) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return true;
    }
  } catch {
    // Continue to the manual-copy fallback.
  }
  return false;
}

export function ShotPromptBuilder() {
  const [values, setValues] = useState<PromptValues>(exampleValues);
  const [loaded, setLoaded] = useState(false);
  const [copied, setCopied] = useState<OutputKey | null>(null);
  const [manualCopy, setManualCopy] = useState<string | null>(null);
  const outputs = useMemo(() => buildOutputs(values), [values]);
  const layers = [values.subject, values.scene, values.startState, values.action, values.endState, values.camera, values.environment, values.keep, values.exclude];
  const coverage = layers.filter((item) => item.trim()).length;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const stored = window.localStorage.getItem(storageKey);
        if (stored) setValues(JSON.parse(stored) as PromptValues);
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

  function update<K extends keyof PromptValues>(key: K, value: PromptValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setCopied(null);
    setManualCopy(null);
  }

  function replaceValues(next: PromptValues) {
    setValues(structuredClone(next));
    setCopied(null);
    setManualCopy(null);
  }

  async function handleCopy(key: OutputKey) {
    const success = await copyText(outputs[key]);
    if (success) {
      setCopied(key);
      window.setTimeout(() => setCopied(null), 1600);
    } else {
      setManualCopy(outputs[key]);
    }
  }

  const fields: Array<{ key: TextFieldKey; title: string; note: string; placeholder: string }> = [
    { key: 'subject', title: '主体锚点', note: '只写这一镜真正看得见的身份事实', placeholder: '人物、服装、配饰、初始位置' },
    { key: 'scene', title: '场景锚点', note: '空间、固定道具、材质与光线来源', placeholder: '同一个空间必须保持的事实' },
    { key: 'startState', title: '起点状态', note: '动作发生前，人物和道具分别在哪里', placeholder: '首帧可以直接核对的状态' },
    { key: 'action', title: '动作顺序', note: '用可见动词按真实先后写，不写情绪口号', placeholder: '靠近 → 接触 → 移动 → 停住' },
    { key: 'endState', title: '结束状态', note: '尾帧必须停在哪里，谁在承重', placeholder: '最后一帧的可见结果' },
    { key: 'camera', title: '摄影机', note: '主体动作和运镜分开写，避免互相冲突', placeholder: '景别、机位、运镜和禁止切镜' },
    { key: 'environment', title: '环境变化', note: '没有变化也要明确写“保持静止”', placeholder: '风、雨、灯光、背景人物或无变化' },
    { key: 'keep', title: '必须保持', note: '跨镜头不能漂移的身份与世界事实', placeholder: '人物、道具、空间和光线锚点' },
    { key: 'exclude', title: '禁止发生', note: '只列高风险错误，不堆通用质量词', placeholder: '形变、增殖、漂移、回弹、切镜等' },
  ];

  return (
    <section className="shot-prompt-workbench" aria-label="AI 视频镜头 Prompt 组装器">
      <div className="shot-prompt-editor">
        <header className="shot-builder-heading">
          <div><span className="mono">01 / SHOT FACTS</span><h2>把镜头拆成<br />九层事实。</h2></div>
          <div><button type="button" onClick={() => replaceValues(exampleValues)}>载入示例</button><button type="button" onClick={() => replaceValues(emptyValues)}>清空草稿</button></div>
        </header>

        <div className="shot-prompt-basics">
          <label><span><strong>镜头名称</strong><small>用于文件名和版本记录</small></span><input value={values.shotName} placeholder="例如：乔野拿起白杯" onChange={(event) => update('shotName', event.target.value)} /></label>
          <label><span><strong>镜头时长</strong><small>建议先控制在 3—8 秒</small></span><div><input type="number" min="1" max="30" value={values.duration} onChange={(event) => update('duration', Math.max(1, Number(event.target.value) || 1))} /><b className="mono">SECONDS</b></div></label>
        </div>

        <div className="shot-prompt-fields">
          {fields.map((field, index) => (
            <label className={`shot-prompt-field field-tone-${index % 4}`} key={field.key}>
              <span><i className="mono">{String(index + 1).padStart(2, '0')}</i><strong>{field.title}</strong><small>{field.note}</small></span>
              <textarea rows={3} value={values[field.key]} placeholder={field.placeholder} onChange={(event) => update(field.key, event.target.value)} />
            </label>
          ))}
        </div>
      </div>

      <aside className="shot-prompt-stack">
        <div className="shot-stack-topline mono"><span>LIVE PROMPT STACK</span><b>{coverage} / 9</b></div>
        <div className="shot-stack-cards" aria-label={`${coverage} 个主要控制层已填写`}>
          {[
            ['SUBJECT', values.subject], ['SCENE', values.scene], ['START', values.startState], ['ACTION', values.action],
            ['END', values.endState], ['CAMERA', values.camera], ['ENVIRONMENT', values.environment], ['KEEP', values.keep], ['EXCLUDE', values.exclude],
          ].map(([label, value], index) => <article className={value.trim() ? 'is-filled' : ''} key={label}><span className="mono">{String(index + 1).padStart(2, '0')} / {label}</span><p>{clean(value, '等待填写')}</p></article>)}
        </div>
        <h2>{coverage === 9 ? '镜头事实已齐。' : `还缺 ${9 - coverage} 层事实。`}</h2>
        <p>这里检查的是信息覆盖，不判断 Prompt 或模型输出是否正确。真实视频生成后，仍要逐帧验收。</p>
        <small className="mono">LOCAL DRAFT · AUTO SAVED IN THIS BROWSER</small>
      </aside>

      <section className="shot-prompt-outputs" id="prompt-output">
        <div className="shot-output-heading"><div><span className="mono">02 / OUTPUT PACK</span><h2>一次填写，<br />留下三份记录。</h2></div><p>生成提示负责执行，验收清单负责判断，返修记录负责下一轮只改一个变量。三份内容都来自当前表单，不调用外部模型。</p></div>
        <div className="shot-output-grid">
          {([
            ['prompt', '生成 Prompt', '直接复制到视频模型前，再按对应平台语法微调。'],
            ['checklist', '镜头验收清单', '把“看起来不对”变成逐项可以核对的问题。'],
            ['revision', '返修记录模板', '真实样本生成后，记录失败时间与下一轮唯一变量。'],
          ] as Array<[OutputKey, string, string]>).map(([key, title, note]) => (
            <article className={`shot-output-card output-${key}`} key={key}>
              <div><span className="mono">{key.toUpperCase()}</span><button type="button" onClick={() => handleCopy(key)}>{copied === key ? '已复制 ✓' : '复制内容'}</button></div>
              <h3>{title}</h3><p>{note}</p><pre>{outputs[key]}</pre>
            </article>
          ))}
        </div>
        {manualCopy && <div className="shot-copy-fallback"><div><b>浏览器没有开放自动复制。</b><p>在下面的文本框中全选并复制即可。</p></div><button type="button" onClick={() => setManualCopy(null)}>关闭</button><textarea readOnly value={manualCopy} onFocus={(event) => event.currentTarget.select()} /></div>}
      </section>
    </section>
  );
}
