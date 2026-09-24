import type { Metadata } from 'next';
import Link from 'next/link';
import { PromptPreflightDesk } from '../../components/prompt-preflight-desk';
import { SiteFooter } from '../../components/site-footer';
import { SiteHeader } from '../../components/site-header';

export const metadata: Metadata = {
  title: 'Prompt 歧义预检卡 — JING AI PLAYGROUND',
  description: '用目标、歧义、输出三关整理 Prompt 迭代记录；本地对照两版文字、复制和保存，不调用模型。',
};

export default function PromptPreflightPage() {
  return <main>
    <SiteHeader active="Tools" />
    <header className="tool-detail-hero prompt-preflight-hero">
      <div className="tool-detail-topline mono"><Link href="/tools/">← 返回工具箱</Link><span>JING TOOL / LOCAL DESK</span></div>
      <div className="tool-detail-title"><div><p className="eyebrow mono">PROMPT PRE-FLIGHT / 歧义预检</p><h1>先把问题问清，<br /><em>再比较输出。</em></h1></div><p>把一轮 Prompt 修改拆成目标、歧义与证据。只提醒缺项，不替你猜任务，也不把一次输出说成稳定效果。</p></div>
      <div className="prompt-preflight-route" aria-hidden="true"><span>目标</span><i>→</i><span>歧义</span><i>→</i><span>输出</span></div>
    </header>
    <div className="tool-detail-shell prompt-preflight-shell"><PromptPreflightDesk />
      <section className="prompt-preflight-method"><div><span className="mono">METHOD / 编辑候选</span><h2>一张卡，<br />只记录一轮修改。</h2></div><div><p>这张工作卡依据本站《Prompt 迭代》笔记整理，属于待荆确认的方法编辑稿。想先看来源范围和三个字幕时间点，可以回到笔记；需要可复制的任务模板，可以进入 Prompt 工作台。</p><nav className="tool-method-links" aria-label="Prompt 预检相关内容"><Link href="/notes/prompt-iteration-ambiguity-output/">阅读方法与来源边界 ↗</Link><Link href="/prompts/">进入 Prompt 工作台 ↗</Link></nav></div></section>
    </div><SiteFooter />
  </main>;
}
