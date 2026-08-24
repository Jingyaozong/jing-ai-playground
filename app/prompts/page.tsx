import type { Metadata } from 'next';
import Link from 'next/link';
import { PromptBrowser } from '../components/prompt-browser';
import { Reveal } from '../components/reveal';
import { SiteFooter } from '../components/site-footer';
import { SiteHeader } from '../components/site-header';
import { promptItems } from '../data/prompts';

export const metadata: Metadata = {
  title: 'Prompt 工作台 — JING AI PLAYGROUND',
  description: '荆整理、测试并留下使用说明的 AI Prompt 工作台。',
};

const rules = [
  ['01', '先说用途', '先标清这条 Prompt 解决什么问题，不收藏只有漂亮结果的咒语。'],
  ['02', '留下变量', '把可替换部分显式标出来，让同一条结构能在不同项目里复用。'],
  ['03', '写下判断', '每条都保留实际使用时最容易踩坑的地方，而不是只贴原文。'],
];

export default function PromptsPage() {
  return (
    <main>
      <SiteHeader active="Notes" />
      <section className="prompt-hero page-intro">
        <div className="page-intro-top mono"><span>JING PROMPT BOX / 提示词工作台</span><span>{promptItems.length} 条 Prompt 正在测试</span></div>
        <div className="prompt-title-lockup"><h1>PROMPTS</h1><span aria-hidden="true">{'{ }'}</span></div>
        <div className="notes-hero-bottom"><p>不是抄一串神奇咒语，<br />而是把好用的结构拆给你看。</p><span className="mono">Copy / Replace / Test / Keep</span></div>
      </section>

      <Reveal><section className="prompt-manifesto section-shell">
        <div className="section-title-row compact"><div><p className="eyebrow mono">How I keep prompts / 整理原则</p><h2>能复用，<br />也知道为什么。</h2></div><p>外部文章只作为学习素材。真正进入这里的是重新梳理后的结构、变量和我的使用判断。</p></div>
        <div className="prompt-rule-grid">{rules.map(([index, title, description]) => <article key={index}><span className="mono">{index}</span><h3>{title}</h3><p>{description}</p></article>)}</div>
      </section></Reveal>

      <section className="prompt-collection section-shell" id="all-prompts">
        <div className="section-title-row compact"><div><p className="eyebrow mono">Prompt drawer / Prompt 抽屉</p><h2>找到一条，<br />换成你的内容。</h2></div><div className="home-notes-intro"><p>当前条目用于展示板块结构，全部标记为 Demo；收到正式素材后会替换为经过验证的内容。</p><Link className="text-link" href="/notes/">返回 AI 笔记 ↗</Link></div></div>
        <PromptBrowser items={promptItems} />
      </section>
      <SiteFooter />
    </main>
  );
}
