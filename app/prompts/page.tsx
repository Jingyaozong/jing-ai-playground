import type { Metadata } from 'next';
import Link from 'next/link';
import { PromptBrowser } from '../components/prompt-browser';
import { Reveal } from '../components/reveal';
import { SiteFooter } from '../components/site-footer';
import { SiteHeader } from '../components/site-header';
import { promptItems, promptSource } from '../data/prompts';

export const metadata: Metadata = {
  title: 'Prompt 工作台 — JING AI PLAYGROUND',
  description: '按问清问题、学习、解决问题、决策和认识自己分类的 12 条实用 Prompt。',
};

const rules = [
  ['01', '先找场景', '问问题、学习、解题、决策和认识自己，需要的是五种不同的思考方式。'],
  ['02', '替换变量', '把【】里的内容换成你的信息；有原始材料时，把文档或截图一起提供。'],
  ['03', '保留判断', 'Prompt 负责建立结构，事实、引用和最终决定仍然需要人来核对。'],
];

export default function PromptsPage() {
  return (
    <main>
      <SiteHeader active="Notes" />
      <section className="prompt-hero page-intro">
        <div className="page-intro-top mono"><span>JING PROMPT BOX / 提示词工作台</span><span>{promptItems.length} 条 Prompt · 5 个使用场景</span></div>
        <div className="prompt-title-lockup"><h1>PROMPTS</h1><span aria-hidden="true">{'{ }'}</span></div>
        <div className="notes-hero-bottom"><p>不是抄一串神奇咒语，<br />而是把好用的结构拆给你看。</p><span className="mono">Copy / Replace / Test / Keep</span></div>
      </section>

      <Reveal><section className="prompt-manifesto section-shell">
        <div className="section-title-row compact"><div><p className="eyebrow mono">How I keep prompts / 整理原则</p><h2>能复用，<br />也知道为什么。</h2></div><p>外部文章只作为学习素材。真正进入这里的是重新梳理后的结构、变量和我的使用判断。</p></div>
        <div className="prompt-rule-grid">{rules.map(([index, title, description]) => <article key={index}><span className="mono">{index}</span><h3>{title}</h3><p>{description}</p></article>)}</div>
        <div className="prompt-source-note">
          <span className="mono">素材来源 / SOURCE</span>
          <div><p>作者：{promptSource.author}</p><h3>{promptSource.title}</h3><p>{promptSource.note}</p></div>
          <a href={promptSource.url} target="_blank" rel="noreferrer">查看原文 ↗</a>
        </div>
      </section></Reveal>

      <section className="prompt-collection section-shell" id="all-prompts">
        <div className="section-title-row compact"><div><p className="eyebrow mono">Prompt drawer / Prompt 抽屉</p><h2>找到一条，<br />换成你的内容。</h2></div><div className="home-notes-intro"><p>12 条 Prompt 已按使用场景整理。长内容默认折叠，展开查看或直接复制即可。</p><Link className="text-link" href="/notes/">返回 AI 笔记 ↗</Link></div></div>
        <PromptBrowser items={promptItems} />
      </section>
      <SiteFooter />
    </main>
  );
}
