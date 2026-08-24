import type { Metadata } from 'next';
import { PageIntro } from '../components/page-intro';
import { Reveal } from '../components/reveal';
import { SiteFooter } from '../components/site-footer';
import { SiteHeader } from '../components/site-header';

export const metadata: Metadata = { title: 'About JING — JING AI PLAYGROUND', description: '关于荆，以及这个持续生长的 AI 创作游乐场。' };

export default function AboutPage() {
  return <main><SiteHeader active="About" /><PageIntro eyebrow="About / 荆" count="A curious human with AI" title="Hello, I’m JING." description="一个很会用 AI 做各种有意思东西的人。" />
    <section className="about-page section-shell"><Reveal><div className="about-manifesto"><span className="mono">A small manifesto</span><p>我喜欢研究 AI 能不能把脑子里那些奇怪、有趣，或者没来得及实现的想法真正做出来。</p><p>我关心的不只是“生成了什么”，也关心一个想法怎样被写成故事、变成镜头，再被人真正看见。</p></div></Reveal>
    <Reveal><div className="about-columns"><div><span className="mono">Now</span><h2>现在，先把第一部<br />AI 漫剧做完。</h2></div><div><span className="mono">Later</span><p>这里会慢慢长出短片、角色、Prompt 实验、工作流和小工具。它不是一份写完就不动的简历，而是一间一直亮着灯的工作室。</p></div></div></Reveal>
    <Reveal><div className="principles"><div><span>01</span><h3>好奇比熟练更重要</h3><p>工具会变，想追着问题跑的习惯可以留下。</p></div><div><span>02</span><h3>作品比术语更诚实</h3><p>少讲“赋能”，多做一个真的能看、能玩、能用的东西。</p></div><div><span>03</span><h3>过程也值得存档</h3><p>把试错、偏差和没成功的版本也留下来。</p></div></div></Reveal></section><SiteFooter /></main>;
}
