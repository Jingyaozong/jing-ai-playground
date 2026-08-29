'use client';

import { useState } from 'react';
import type { StoryDetail } from '../data/stories';

type PromptPackProps = Pick<StoryDetail, 'promptGuide' | 'prompts' | 'motionTests'>;

export function StoryPromptPack({ promptGuide, prompts, motionTests }: PromptPackProps) {
  const [copiedShot, setCopiedShot] = useState<string | null>(null);
  const [copyErrorShot, setCopyErrorShot] = useState<string | null>(null);

  async function copyPrompt(shot: string, prompt: string) {
    const fullPrompt = [
      `IDENTITY LOCK: ${promptGuide.identityLock}`,
      `SHOT ${shot}: ${prompt}`,
      `STYLE LOCK: ${promptGuide.styleLock}`,
      `NEGATIVE: ${promptGuide.negative}`,
    ].join('\n\n');

    let copied = false;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(fullPrompt);
        copied = true;
      }
    } catch {
      copied = false;
    }

    if (!copied) {
      const textarea = document.createElement('textarea');
      textarea.value = fullPrompt;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      copied = document.execCommand('copy');
      textarea.remove();
    }

    if (copied) {
      setCopyErrorShot(null);
      setCopiedShot(shot);
      window.setTimeout(() => setCopiedShot((current) => current === shot ? null : current), 1800);
    } else {
      setCopiedShot(null);
      setCopyErrorShot(shot);
    }
  }

  return (
    <>
      <section className="story-prompts" id="generation-pack">
        <div className="story-section-inner">
          <div className="story-section-heading"><div><p className="eyebrow mono">06 / Generation pack</p><h2>每一镜，<br />都有自己的约束。</h2></div><p>Prompt 使用英文描述模型动作，中文说明风险。复制时会自动带上统一的人物锚点、画面风格和负面约束。</p></div>

          <div className="story-prompt-locks">
            <article><span className="mono">IDENTITY LOCK</span><h3>先锁定角色是谁</h3><p>{promptGuide.identityLock}</p></article>
            <article><span className="mono">STYLE LOCK</span><h3>再锁定画面气质</h3><p>{promptGuide.styleLock}</p></article>
            <article><span className="mono">NEGATIVE</span><h3>最后排除常见失败</h3><p>{promptGuide.negative}</p></article>
          </div>

          <div className="story-prompt-list">
            {prompts.map((item) => <details key={item.shot} open={item.shot === '01'}>
              <summary><b>{item.shot}</b><span>{item.title}</span><small className="mono">展开 PROMPT ＋</small></summary>
              <div className="story-prompt-detail">
                <div><span className="mono">MODEL PROMPT</span><p>{item.prompt}</p></div>
                <aside><span className="mono">JING CHECK</span><p>{item.constraint}</p><button type="button" onClick={() => copyPrompt(item.shot, item.prompt)}>{copiedShot === item.shot ? '已复制完整 Prompt ✓' : copyErrorShot === item.shot ? '复制失败，请手动选择' : '复制完整 Prompt ↗'}</button></aside>
              </div>
            </details>)}
          </div>
        </div>
      </section>

      <section className="story-motion-tests section-shell">
        <div className="story-section-heading"><div><p className="eyebrow mono">07 / Motion tests</p><h2>先测高风险镜头，<br />再决定要不要做完。</h2></div><p>先用少量动作验证人物、道具和空间连续性，尽早暴露问题，再决定是否生成完整镜头表。</p></div>
        <div className="story-test-grid">
          {motionTests.map((test, index) => <article key={test.shot}>
            <div className="story-test-top"><b>{test.shot}</b><span className="mono">TEST {String(index + 1).padStart(2, '0')} · {test.duration}</span><em>{test.status}</em></div>
            <h3>{test.title}</h3>
            <p>{test.purpose}</p>
            <dl><div><dt className="mono">ACTION</dt><dd>{test.action}</dd></div><div><dt className="mono">PASS</dt><dd>{test.pass}</dd></div><div><dt className="mono">FAIL</dt><dd>{test.fail}</dd></div></dl>
          </article>)}
        </div>
        <aside className="story-test-notice"><span className="mono">NO OUTPUT YET</span><p>这里只展示测试设计，尚未调用任何外部视频模型。出现真实输出后，才会补充模型名称、参数、原片和观察结论。</p></aside>
      </section>
    </>
  );
}
