'use client';

import { useEffect, useMemo, useState } from 'react';

type OutputKey = 'prompt' | 'matrix' | 'review';
type ContactStage = { label: string; hand: string; object: string; support: string };
type ContactValues = {
  shotName: string;
  duration: number;
  handIdentity: string;
  objectIdentity: string;
  contactPoint: string;
  objectLock: string;
  supportRule: string;
  cameraRule: string;
  negative: string;
  stages: ContactStage[];
  tasks: [string, string, string];
};

const storageKey = 'jing-contact-action-card-v1';
const stageNames = ['接近', '预接触', '闭合', '承重移动', '结束状态'];

const exampleValues: ContactValues = {
  shotName: '右手握住杯柄并抬高',
  duration: 5,
  handIdentity: '人物右手；手背略朝向摄影机；拇指在杯柄外侧，四指从内侧闭合',
  objectIdentity: '单只白色陶瓷杯；圆形杯口；C 形杯柄朝画面右侧；杯中无液体',
  contactPoint: '拇指与食指先在杯柄上下两侧建立接触，杯柄轮廓始终可见',
  objectLock: '抓握建立前，杯底完整落在桌面，位置、数量、形状与朝向不变',
  supportRule: '杯子先由桌面承重；手指闭合后转由右手承重；抬升时手腕与杯子同速',
  cameraRule: '固定近景，手、杯柄和杯底始终在画面内；不推拉、不切镜',
  negative: '额外手指、手指融合、手穿过杯柄、杯子提前移动、悬浮、杯子变形或复制、抓握点滑动、镜头移动',
  stages: [
    { label: '接近', hand: '从杯子右侧缓慢靠近', object: '留在桌面原位', support: '桌面' },
    { label: '预接触', hand: '指尖对准杯柄两侧', object: '仍然完全静止', support: '桌面' },
    { label: '闭合', hand: '拇指与四指围绕杯柄闭合', object: '仍未离开桌面', support: '桌面＋手' },
    { label: '承重移动', hand: '手腕平稳向上移动', object: '同步抬高几厘米', support: '右手' },
    { label: '结束状态', hand: '停止并保持抓握', object: '保持形状与朝向停住', support: '右手' },
  ],
  tasks: ['指尖碰到杯壁后停住', '握住杯柄并抬高几厘米', '把杯子放稳后松手离开'],
};

const emptyValues: ContactValues = {
  shotName: '', duration: 5, handIdentity: '', objectIdentity: '', contactPoint: '', objectLock: '', supportRule: '', cameraRule: '', negative: '',
  stages: stageNames.map((label) => ({ label, hand: '', object: '', support: '' })),
  tasks: ['', '', ''],
};

function clean(value: string, fallback = '未填写') {
  return value.trim() || fallback;
}

function buildOutputs(values: ContactValues) {
  const timeline = values.stages.map((stage, index) => `${index + 1}. ${stage.label}: HAND ${clean(stage.hand)} / OBJECT ${clean(stage.object)} / SUPPORT ${clean(stage.support)}`).join('\n');
  const prompt = [
    `# ${clean(values.shotName, '接触动作')} / CONTACT CHAIN PROMPT`, '',
    `DURATION: ${values.duration} 秒`,
    `CAMERA: ${clean(values.cameraRule)}`, '',
    `HAND: ${clean(values.handIdentity)}`,
    `OBJECT: ${clean(values.objectIdentity)}`,
    `CONTACT POINT: ${clean(values.contactPoint)}`,
    `OBJECT BEFORE CONTACT: ${clean(values.objectLock)}`,
    `SUPPORT TRANSFER: ${clean(values.supportRule)}`, '',
    'FIVE STAGES:', timeline, '',
    `EXCLUDE: ${clean(values.negative)}`, '',
    'STATUS: 待测试控制结构，不代表模型会稳定执行。',
  ].join('\n');

  const matrixRows = ['A / 普通动作句', 'B / 五状态顺序', 'C / 五状态 + 端点'].flatMap((condition, groupIndex) =>
    values.tasks.map((task, taskIndex) => {
      const code = `${String.fromCharCode(65 + groupIndex)}0${taskIndex + 1}`;
      const input = groupIndex === 0
        ? clean(task, `任务 ${taskIndex + 1}`)
        : groupIndex === 1
          ? `${clean(task, `任务 ${taskIndex + 1}`)}；接近→接触→承重→移动→结束`
          : `${clean(task, `任务 ${taskIndex + 1}`)}；五状态顺序＋首尾端点证据`;
      return `| ${code} | ${condition} | ${clean(task, `镜头任务 ${taskIndex + 1}`)} | ${input} | 待执行 |`;
    }),
  );
  const matrix = [
    `# ${clean(values.shotName, '接触动作')} / 九格变量矩阵`, '',
    `固定时长：${values.duration} 秒`,
    `固定手部：${clean(values.handIdentity)}`,
    `固定物体：${clean(values.objectIdentity)}`,
    `固定摄影机：${clean(values.cameraRule)}`, '',
    '| 样本 | 输入条件 | 固定任务 | 本组写法 | 状态 |',
    '| --- | --- | --- | --- | --- |',
    ...matrixRows, '',
    '真实测试还需固定模型、版本、画幅、参考图、输出数量和 Seed（如支持）。',
  ].join('\n');

  const reviewRows = values.stages.map((stage, index) => `| ${index + 1} / ${stage.label} | ${clean(stage.hand, '待核对')} | ${clean(stage.object, '待核对')} | ${clean(stage.support, '待核对')} | 待记录 | 待记录 |`);
  const review = [
    `# ${clean(values.shotName, '接触动作')} / 五阶段验收表`, '',
    '| 阶段 | 手部目标 | 物体目标 | 目标承重点 | 真实画面 | 判定 |',
    '| --- | --- | --- | --- | --- | --- |',
    ...reviewRows, '',
    '## 失败标签',
    '- [ ] CONTACT_MISS / 接触前物体提前移动',
    '- [ ] HAND_MELT / 手指融合、增殖或穿模',
    '- [ ] GRIP_SLIDE / 抓握点无因滑动',
    '- [ ] OBJECT_MUTATE / 物体形状、数量或材质改变',
    '- [ ] WEIGHTLESS_PROP / 物体悬浮或缺少承重点',
    '- [ ] RELEASE_ERROR / 落稳与释放顺序错误', '',
    '本表只记录真实输出，不自动判断模型能力。',
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
    // Continue to manual copy.
  }
  return false;
}

export function ContactActionCardBuilder() {
  const [values, setValues] = useState<ContactValues>(exampleValues);
  const [loaded, setLoaded] = useState(false);
  const [copied, setCopied] = useState<OutputKey | null>(null);
  const [manualCopy, setManualCopy] = useState<string | null>(null);
  const outputs = useMemo(() => buildOutputs(values), [values]);
  const coverage = [values.handIdentity, values.objectIdentity, values.contactPoint, values.supportRule, values.cameraRule].filter((item) => item.trim()).length;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const stored = window.localStorage.getItem(storageKey);
        if (stored) setValues(JSON.parse(stored) as ContactValues);
      } catch {
        // A damaged draft should not block the tool.
      }
      setLoaded(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try { window.localStorage.setItem(storageKey, JSON.stringify(values)); } catch { /* Keep the tool usable without storage. */ }
  }, [loaded, values]);

  function update<K extends keyof ContactValues>(key: K, value: ContactValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    setCopied(null);
    setManualCopy(null);
  }

  function replaceValues(next: ContactValues) {
    setValues(structuredClone(next));
    setCopied(null);
    setManualCopy(null);
  }

  function updateStage(index: number, key: 'hand' | 'object' | 'support', value: string) {
    update('stages', values.stages.map((stage, stageIndex) => stageIndex === index ? { ...stage, [key]: value } : stage));
  }

  function updateTask(index: number, value: string) {
    const tasks = [...values.tasks] as ContactValues['tasks'];
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
    <section className="contact-card-workbench" aria-label="接触动作拆分卡生成器">
      <div className="contact-card-editor">
        <div className="contact-card-heading">
          <div><span className="mono">01 / DEFINE THE CONTACT</span><h2>手先碰到，<br />物体才移动。</h2></div>
          <div><button type="button" onClick={() => replaceValues(exampleValues)}>载入示例</button><button type="button" onClick={() => replaceValues(emptyValues)}>清空</button></div>
        </div>

        <section className="contact-field-group contact-group-cast">
          <ContactGroupHeading label="A / HAND & OBJECT" note="先确认谁在动、谁在接触前保持不动" />
          <ContactField label="镜头名称" note="导出后用于识别本镜" value={values.shotName} placeholder="例如：右手握住杯柄并抬高" onChange={(value) => update('shotName', value)} />
          <ContactField label="手部身份" note="哪只手、手背朝向和抓握方式" value={values.handIdentity} placeholder="例如：人物右手，拇指在杯柄外侧" onChange={(value) => update('handIdentity', value)} />
          <ContactField label="道具身份" note="数量、形状、朝向、材质与初始位置" value={values.objectIdentity} placeholder="例如：单只白色陶瓷杯，杯柄朝右" onChange={(value) => update('objectIdentity', value)} />
        </section>

        <section className="contact-field-group contact-group-cause">
          <ContactGroupHeading label="B / CONTACT & SUPPORT" note="把接触点和承重点的变化写成因果" />
          <ContactField label="第一个接触点" note="谁先碰到哪里，关键轮廓是否可见" value={values.contactPoint} placeholder="例如：拇指与食指先接触杯柄两侧" onChange={(value) => update('contactPoint', value)} />
          <ContactField label="接触前锁定" note="在手真正碰到之前，道具必须怎样保持" value={values.objectLock} placeholder="例如：杯底保持在桌面，位置和形状不变" onChange={(value) => update('objectLock', value)} />
          <ContactField label="承重点转移" note="何时从桌面转到手，何时重新落稳" value={values.supportRule} placeholder="例如：抓握闭合后，杯子才转由右手承重" onChange={(value) => update('supportRule', value)} />
        </section>

        <section className="contact-field-group contact-group-frame">
          <ContactGroupHeading label="C / CAMERA & LIMITS" note="让关键接触点始终留在证据里" />
          <ContactField label="摄影机规则" note="景别、角度、运动与可见范围" value={values.cameraRule} placeholder="例如：固定近景，杯柄和杯底始终可见" onChange={(value) => update('cameraRule', value)} />
          <ContactField label="排除项" note="只写能够从真实画面核对的失败" value={values.negative} placeholder="例如：多指、穿模、杯子提前移动" onChange={(value) => update('negative', value)} />
          <label className="contact-duration-field"><span><strong>镜头时长</strong><small>同一实验组保持一致</small></span><div><input type="number" min="2" max="20" value={values.duration} onChange={(event) => update('duration', Math.max(2, Math.min(20, Number(event.target.value) || 2)))} /><b className="mono">SEC</b></div></label>
        </section>

        <section className="contact-stage-editor">
          <ContactGroupHeading label="D / FIVE STAGES" note="每一步分别记录手、物体和当前承重点" />
          <div className="contact-stage-table">
            <div className="contact-stage-head mono"><span>STAGE</span><span>HAND</span><span>OBJECT</span><span>SUPPORT</span></div>
            {values.stages.map((stage, index) => <div className="contact-stage-row" key={stage.label}>
              <div><small className="mono">0{index + 1}</small><strong>{stage.label}</strong></div>
              <input aria-label={`${stage.label} 手部状态`} value={stage.hand} onChange={(event) => updateStage(index, 'hand', event.target.value)} />
              <input aria-label={`${stage.label} 物体状态`} value={stage.object} onChange={(event) => updateStage(index, 'object', event.target.value)} />
              <input aria-label={`${stage.label} 承重点`} value={stage.support} onChange={(event) => updateStage(index, 'support', event.target.value)} />
            </div>)}
          </div>
        </section>

        <section className="contact-field-group contact-group-test">
          <ContactGroupHeading label="E / THREE FIXED TASKS" note="三种输入条件使用相同任务，组成九格" />
          {values.tasks.map((task, index) => <ContactField key={index} label={`镜头任务 ${index + 1}`} note={index === 0 ? '只测试接触建立' : index === 1 ? '增加承重与移动' : '增加落稳与释放'} value={task} placeholder={`填写固定任务 ${index + 1}`} onChange={(value) => updateTask(index, value)} />)}
        </section>
      </div>

      <aside className="contact-transfer-card" aria-live="polite">
        <div className="contact-transfer-topline mono"><span>SUPPORT TRANSFER</span><span>{coverage} / 5</span></div>
        <div className="contact-transfer-stage" aria-label="手靠近杯子并建立抓握，承重点从桌面转移到手的示意图">
          <div className="contact-hand"><i /><i /><i /><i /><i /><b /></div>
          <div className="contact-cup"><span /><b /></div>
          <span className="contact-point-pulse">＋</span>
          <div className="contact-table-line" />
          <small className="mono">TABLE → HAND</small>
        </div>
        <h2>{values.shotName.trim() || '未命名接触动作'}</h2>
        <div className="contact-transfer-ledger">
          <span><small className="mono">CONTACT</small><b>{clean(values.contactPoint, '等待接触点')}</b></span>
          <span><small className="mono">BEFORE</small><b>{clean(values.objectLock, '等待接触前锁定')}</b></span>
          <span><small className="mono">TRANSFER</small><b>{clean(values.supportRule, '等待承重规则')}</b></span>
        </div>
        <div className="contact-stage-strip" role="list" aria-label="接触动作的五个阶段">
          {values.stages.map((stage, index) => <article key={stage.label} role="listitem"><div><span className="mono">0{index + 1}</span><strong>{stage.label}</strong></div><i /><p>{clean(stage.support, '待定义')}</p></article>)}
        </div>
        <p>{coverage < 5 ? '继续补齐手、物体、接触、承重和摄影机规则，才能形成可核对的接触链。' : '接触链已具备试跑条件；真实输出仍要逐阶段检查手、物体和承重点。'}</p>
        <small>{loaded ? '草稿只保存在当前浏览器，不上传。' : '正在读取本地草稿。'}</small>
      </aside>

      <section className="contact-card-outputs">
        <div className="contact-output-heading"><div><span className="mono">02 / COPY THE TEST FILES</span><h2>一次接触，<br />生成三份工作文件。</h2></div><p>Prompt 说明单镜因果，九格比较输入方式，五阶段表记录真实输出。它们帮助排错，不替代真实生成和逐帧判断。</p></div>
        <div className="contact-output-grid">
          <ContactOutputCard label="A / PROMPT" title="接触链提示块" outputKey="prompt" text={outputs.prompt} copied={copied} onCopy={copyOutput} />
          <ContactOutputCard label="B / 3 × 3" title="九格变量矩阵" outputKey="matrix" text={outputs.matrix} copied={copied} onCopy={copyOutput} />
          <ContactOutputCard label="C / REVIEW" title="五阶段验收表" outputKey="review" text={outputs.review} copied={copied} onCopy={copyOutput} />
        </div>
      </section>

      {manualCopy && <aside className="contact-copy-fallback"><div><span className="mono">MANUAL COPY / 浏览器限制</span><p>点击文本框后按 Ctrl+A，再按 Ctrl+C。</p></div><button type="button" onClick={() => setManualCopy(null)}>关闭 ×</button><textarea readOnly value={manualCopy} aria-label="手动复制接触动作拆分卡内容" onFocus={(event) => event.currentTarget.select()} /></aside>}
    </section>
  );
}

function ContactGroupHeading({ label, note }: { label: string; note: string }) {
  return <div className="contact-group-heading"><span className="mono">{label}</span><p>{note}</p></div>;
}

function ContactField({ label, note, value, placeholder, onChange }: { label: string; note: string; value: string; placeholder: string; onChange: (value: string) => void }) {
  return <label className="contact-card-field"><span><strong>{label}</strong><small>{note}</small></span><textarea rows={2} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} /></label>;
}

function ContactOutputCard({ label, title, outputKey, text, copied, onCopy }: { label: string; title: string; outputKey: OutputKey; text: string; copied: OutputKey | null; onCopy: (key: OutputKey) => void }) {
  return <article className={`contact-output-card contact-output-${outputKey}`}><div><span className="mono">{label}</span><button type="button" onClick={() => onCopy(outputKey)}>{copied === outputKey ? '已复制 ✓' : '复制 ↗'}</button></div><h3>{title}</h3><pre>{text}</pre></article>;
}
