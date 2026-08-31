'use client';

import { useEffect, useMemo, useState } from 'react';

type OutputKey = 'ledger' | 'task' | 'prompt';
type LinkedItem = { text: string; refs: string };
type BuilderValues = {
  posterName: string;
  storyLimit: string;
  excluded: string;
  evidence: string[];
  inferences: LinkedItem[];
  choices: LinkedItem[];
};

const storageKey = 'jing-poster-story-builder-v1';

const exampleValues: BuilderValues = {
  posterName: '退潮电影院',
  storyLimit: '近未来寓言；不使用穿越或失忆',
  excluded: '怀旧影院复活、神秘老人解释一切',
  evidence: [
    '一座旧电影院孤立在潮湿的滩涂上',
    '入口向外透出暖黄色灯光',
    '建筑四周有浅水和倒影',
    '远处能看见海平线',
    '画面里没有人物、车辆或邻近建筑',
    '天空明亮，处于白天',
  ],
  inferences: [
    { text: '建筑可能只能在退潮时进入', refs: 'E1, E3, E4' },
    { text: '暖光也许说明内部仍有能源', refs: 'E2' },
  ],
  choices: [
    { text: '影院只放映下一次风暴潮到来前的二十分钟', refs: 'E2, E3, E4' },
    { text: '预警只有在影院被永久注销后才能带走', refs: 'E1, E2' },
    { text: '主人公是负责关闭这座建筑的工程师', refs: 'E1, E5' },
  ],
};

const emptyValues: BuilderValues = {
  posterName: '',
  storyLimit: '',
  excluded: '',
  evidence: [''],
  inferences: [{ text: '', refs: '' }],
  choices: [{ text: '', refs: '' }],
};

function filled(items: string[]) {
  return items.map((item) => item.trim()).filter(Boolean);
}

function filledLinked(items: LinkedItem[]) {
  return items.filter((item) => item.text.trim());
}

function numberedLines(prefix: string, items: string[]) {
  return items.length ? items.map((item, index) => `${prefix}${index + 1}. ${item}`) : [`${prefix}1. 待填写`];
}

function linkedLines(prefix: string, items: LinkedItem[]) {
  return items.length
    ? items.map((item, index) => `${prefix}${index + 1}. ${item.text}${item.refs.trim() ? `（依据：${item.refs.trim()}）` : '（依据待补）'}`)
    : [`${prefix}1. 待填写（依据待补）`];
}

function buildOutputs(values: BuilderValues) {
  const evidence = filled(values.evidence);
  const inferences = filledLinked(values.inferences);
  const choices = filledLinked(values.choices);
  const name = values.posterName.trim() || '未命名海报';
  const ledger = [
    `# ${name} / 短证据账本`, '',
    '## E / 可见证据', ...numberedLines('E', evidence), '',
    '## I / 合理推测', ...linkedLines('I', inferences), '',
    '## C / 主动创作选择', ...linkedLines('C', choices), '',
    '说明：E 只记录画面中能直接指出的事实；I 使用“可能 / 也许”等措辞；C 是创作者主动加入的设定，不伪装成海报事实。',
  ].join('\n');

  const task = [
    `# ${name} / 故事任务卡`, '',
    `类型与边界：${values.storyLimit.trim() || '待填写'}`,
    `主动避开：${values.excluded.trim() || '待填写'}`, '',
    '必须交付：',
    '- 一个片名',
    '- 一个有具体身份与当下任务的主人公',
    '- 一条能被画面验证的世界规则',
    '- 一个由海报证据触发的核心冲突',
    '- 一次不可逆的选择',
    '- 一段 150—250 字的故事梗概', '',
    '完成前核对：',
    '- [ ] 至少使用三条 E 证据',
    '- [ ] 没有把 I 或 C 写成“海报里明确存在”',
    '- [ ] 去掉这张海报后，故事不能原样成立',
    '- [ ] 梗概推进了事件，没有重复证据账本',
  ].join('\n');

  const prompt = [
    `你将根据一张名为《${name}》的虚构海报发展一个短故事。`, '',
    ledger, '',
    `类型与边界：${values.storyLimit.trim() || '未限定'}`,
    `主动避开：${values.excluded.trim() || '未限定'}`, '',
    '请严格区分三层信息：E 是画面可见事实；I 只是有证据指向的推测；C 是为了让故事成立而做的创作选择。不要补写新的“海报事实”。', '',
    '输出以下字段：',
    '1. 片名',
    '2. 主人公（身份 + 当下任务）',
    '3. 世界规则',
    '4. 核心冲突',
    '5. 不可逆选择',
    '6. 150—250 字故事梗概', '',
    '要求：至少让三条 E 证据参与因果链；梗概不要复述证据清单；海报必须是故事结构中不可替换的一部分。',
    'STATUS: 待创作提示，不代表故事已经验证或完成。',
  ].join('\n');

  return { ledger, task, prompt };
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

export function PosterStoryBuilder() {
  const [values, setValues] = useState<BuilderValues>(exampleValues);
  const [loaded, setLoaded] = useState(false);
  const [copied, setCopied] = useState<OutputKey | null>(null);
  const [manualCopy, setManualCopy] = useState<string | null>(null);
  const outputs = useMemo(() => buildOutputs(values), [values]);
  const counts = {
    evidence: filled(values.evidence).length,
    inferences: filledLinked(values.inferences).length,
    choices: filledLinked(values.choices).length,
  };
  const readyChecks = [Boolean(values.posterName.trim()), counts.evidence >= 3, counts.inferences >= 1, counts.choices >= 1];
  const readyCount = readyChecks.filter(Boolean).length;

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const stored = window.localStorage.getItem(storageKey);
        if (stored) setValues(JSON.parse(stored) as BuilderValues);
      } catch {
        // A damaged browser draft should not block the tool.
      }
      setLoaded(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try { window.localStorage.setItem(storageKey, JSON.stringify(values)); } catch { /* Keep working without storage. */ }
  }, [loaded, values]);

  function replaceValues(next: BuilderValues) {
    setValues(structuredClone(next));
    setCopied(null);
    setManualCopy(null);
  }

  function updateText(key: 'posterName' | 'storyLimit' | 'excluded', value: string) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function updateEvidence(index: number, value: string) {
    setValues((current) => ({ ...current, evidence: current.evidence.map((item, itemIndex) => itemIndex === index ? value : item) }));
  }

  function updateLinked(key: 'inferences' | 'choices', index: number, field: keyof LinkedItem, value: string) {
    setValues((current) => ({ ...current, [key]: current[key].map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item) }));
  }

  function addRow(key: 'evidence' | 'inferences' | 'choices') {
    setValues((current) => ({
      ...current,
      [key]: key === 'evidence' ? [...current.evidence, ''] : [...current[key], { text: '', refs: '' }],
    }));
  }

  function removeRow(key: 'evidence' | 'inferences' | 'choices', index: number) {
    setValues((current) => ({ ...current, [key]: current[key].filter((_, itemIndex) => itemIndex !== index) }));
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

  return (
    <section className="poster-story-workbench" aria-label="海报反推故事组装器">
      <header className="poster-story-controls">
        <div><span className="mono">01 / SOURCE FRAME</span><h2>先固定这次<br />创作的边界。</h2></div>
        <div className="poster-story-actions"><button type="button" onClick={() => replaceValues(exampleValues)}>载入示例</button><button type="button" onClick={() => replaceValues(emptyValues)}>清空草稿</button></div>
        <label><span><strong>海报或画面名称</strong><small>只用于标记当前任务</small></span><input value={values.posterName} placeholder="例如：退潮电影院" onChange={(event) => updateText('posterName', event.target.value)} /></label>
        <label><span><strong>类型与边界</strong><small>先限定体裁、时长或明确不用的机制</small></span><textarea rows={2} value={values.storyLimit} placeholder="例如：近未来寓言；不使用穿越或失忆" onChange={(event) => updateText('storyLimit', event.target.value)} /></label>
        <label><span><strong>主动避开</strong><small>列出会让故事滑向套路的捷径</small></span><textarea rows={2} value={values.excluded} placeholder="例如：神秘人物解释一切" onChange={(event) => updateText('excluded', event.target.value)} /></label>
      </header>

      <div className="poster-story-ledger">
        <section className="poster-ledger-column ledger-evidence">
          <div className="poster-ledger-heading"><span className="poster-ledger-letter">E</span><div><span className="mono">EVIDENCE / 最多 6 条</span><h3>画面确实<br />给了什么？</h3><p>只写能指给别人看的事实，不解释、不猜原因。</p></div></div>
          <div className="poster-ledger-rows">
            {values.evidence.map((item, index) => <label key={`e-${index}`}><span className="mono">E{index + 1}</span><textarea rows={2} value={item} placeholder="一条可见事实" onChange={(event) => updateEvidence(index, event.target.value)} />{values.evidence.length > 1 && <button type="button" aria-label={`删除证据 E${index + 1}`} onClick={() => removeRow('evidence', index)}>×</button>}</label>)}
          </div>
          {values.evidence.length < 6 && <button className="poster-add-row" type="button" onClick={() => addRow('evidence')}>＋ 添加一条可见证据</button>}
        </section>

        <section className="poster-ledger-column ledger-inference">
          <div className="poster-ledger-heading"><span className="poster-ledger-letter">I</span><div><span className="mono">INFERENCE / 最多 3 条</span><h3>证据允许<br />怎样推测？</h3><p>使用“可能 / 也许”，并写清它依赖哪些 E。</p></div></div>
          <div className="poster-ledger-rows">
            {values.inferences.map((item, index) => <label key={`i-${index}`}><span className="mono">I{index + 1}</span><textarea rows={2} value={item.text} placeholder="一条克制的推测" onChange={(event) => updateLinked('inferences', index, 'text', event.target.value)} /><input value={item.refs} aria-label={`推测 I${index + 1} 的证据编号`} placeholder="依据：E1, E3" onChange={(event) => updateLinked('inferences', index, 'refs', event.target.value)} />{values.inferences.length > 1 && <button type="button" aria-label={`删除推测 I${index + 1}`} onClick={() => removeRow('inferences', index)}>×</button>}</label>)}
          </div>
          {values.inferences.length < 3 && <button className="poster-add-row" type="button" onClick={() => addRow('inferences')}>＋ 添加一条合理推测</button>}
        </section>

        <section className="poster-ledger-column ledger-choice">
          <div className="poster-ledger-heading"><span className="poster-ledger-letter">C</span><div><span className="mono">CHOICE / 最多 3 条</span><h3>你决定<br />加入什么？</h3><p>承认这是创作选择，并让它回应已有证据。</p></div></div>
          <div className="poster-ledger-rows">
            {values.choices.map((item, index) => <label key={`c-${index}`}><span className="mono">C{index + 1}</span><textarea rows={2} value={item.text} placeholder="一个主动加入的设定" onChange={(event) => updateLinked('choices', index, 'text', event.target.value)} /><input value={item.refs} aria-label={`选择 C${index + 1} 的证据编号`} placeholder="回应：E2, E4" onChange={(event) => updateLinked('choices', index, 'refs', event.target.value)} />{values.choices.length > 1 && <button type="button" aria-label={`删除选择 C${index + 1}`} onClick={() => removeRow('choices', index)}>×</button>}</label>)}
          </div>
          {values.choices.length < 3 && <button className="poster-add-row" type="button" onClick={() => addRow('choices')}>＋ 添加一个创作选择</button>}
        </section>
      </div>

      <aside className="poster-story-trace" aria-label="证据链覆盖情况">
        <div className="poster-trace-stage trace-e"><span className="mono">VISIBLE</span><strong>E</strong><b>{counts.evidence} / 6</b><small>可见证据</small></div>
        <i aria-hidden="true">→</i>
        <div className="poster-trace-stage trace-i"><span className="mono">POSSIBLE</span><strong>I</strong><b>{counts.inferences} / 3</b><small>合理推测</small></div>
        <i aria-hidden="true">→</i>
        <div className="poster-trace-stage trace-c"><span className="mono">CREATED</span><strong>C</strong><b>{counts.choices} / 3</b><small>创作选择</small></div>
        <div className="poster-trace-status"><span className="mono">TASK READINESS {readyCount} / 4</span><h2>{readyCount === 4 ? '来源分层已经可以交接。' : '先补齐最短证据链。'}</h2><p>这里检查信息是否齐全，不判断推测是否正确，也不把生成结果当作荆已经确认的故事。</p></div>
      </aside>

      <section className="poster-story-outputs" id="poster-story-output">
        <div className="poster-story-output-heading"><div><span className="mono">02 / HANDOFF PACK</span><h2>同一条证据链，<br />交出三种文件。</h2></div><p>短账本负责守住来源，任务卡负责定义交付，完整 Prompt 才负责把两者交给模型。工具不会上传海报，也不会自动生成故事。</p></div>
        <div className="poster-story-output-grid">
          {([
            ['ledger', '短证据账本', '适合贴进实验记录，说明哪些是看见、推测和创作。'],
            ['task', '故事任务卡', '先锁定交付字段和验收规则，再开始扩写。'],
            ['prompt', '完整创作 Prompt', '复制给语言模型前，仍可继续修改当前来源链。'],
          ] as Array<[OutputKey, string, string]>).map(([key, title, note]) => <article className={`poster-output-card output-${key}`} key={key}><div><span className="mono">{key.toUpperCase()}</span><button type="button" onClick={() => handleCopy(key)}>{copied === key ? '已复制 ✓' : '复制内容'}</button></div><h3>{title}</h3><p>{note}</p><pre>{outputs[key]}</pre></article>)}
        </div>
        {manualCopy && <div className="poster-copy-fallback"><div><b>浏览器没有开放自动复制。</b><p>在下面的文本框中全选复制即可。</p></div><button type="button" onClick={() => setManualCopy(null)}>关闭</button><textarea readOnly value={manualCopy} onFocus={(event) => event.currentTarget.select()} /></div>}
      </section>
    </section>
  );
}
