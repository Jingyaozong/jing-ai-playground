import Link from 'next/link';
import { ExperimentCard } from './components/experiment-card';
import { ProjectVisual } from './components/project-visual';
import { Reveal } from './components/reveal';
import { SiteFooter } from './components/site-footer';
import { SiteHeader } from './components/site-header';
import { StoryCard } from './components/story-card';
import { ToolCard } from './components/tool-card';
import { currentlyPlaying, experiments, stories, tools } from './data/content';

export default function Home() {
  const featured = stories[0];
  return (
    <main>
      <SiteHeader />
      <section className="hero" id="top">
        <div className="hero-kicker mono"><span>Personal AI creative studio</span><span>Issue 001 · 2026</span></div>
        <h1 aria-label="JING AI PLAYGROUND"><span className="hero-jing">JING</span><span className="hero-playground">AI PLAYGROUND</span></h1>
        <div className="hero-bottom">
          <p className="hero-en">Stories, visuals, tools and weird little things made with AI.</p>
          <div className="hero-orbit" aria-hidden="true"><span className="orbit-dot" /><span className="orbit-label mono">PLAY / MAKE / REPEAT</span></div>
          <p className="hero-zh">用 AI 做故事、影像、工具，<br />以及一些有意思的小东西。</p>
        </div>
      </section>
      <div className="live-strip" aria-label="最近动态">
        <span className="live-label mono"><i /> ON THE DESK</span>
        <div className="ticker-track"><span>正在尝试第一部 AI 漫剧</span><b>✦</b><span>测试人物一致性</span><b>✦</b><span>研究不同视频模型</span><b>✦</b><span>做一些没用但有趣的东西</span><b>✦</b><span>正在尝试第一部 AI 漫剧</span></div>
      </div>

      <Reveal><section className="featured">
        <div className="section-heading"><div><p className="eyebrow mono">Featured / 本期主角</p><h2>一觉醒来，<br />世界少了一天。</h2></div><p className="featured-intro">一个关于记忆、遗忘和重复告别的 AI 影像实验。目前正在制作中。</p></div>
        <article className="feature-card"><ProjectVisual variant="memory feature" label={featured.title} /><div className="feature-meta"><div><p className="mono">AI SHORT FILM · COMING SOON</p><h3>{featured.title}</h3></div><Link className="round-link" href="/stories#story-001" aria-label="查看作品详情">Watch <span>↗</span></Link></div></article>
      </section></Reveal>

      <Reveal><section className="latest section-shell">
        <div className="section-title-row"><div><p className="eyebrow mono">Latest experiments</p><h2>最近又<br />折腾了什么？</h2></div><p>故事还没完全长成，测试也不一定有结论。这里先留下过程里的碎片、偏差和意外。</p></div>
        <div className="latest-grid">
          <article className="latest-lead"><ProjectVisual variant="faces" label={experiments[0].title} /><span className="mono">Character study · 2026</span><h3>{experiments[0].title}</h3></article>
          <article className="latest-note note-violet"><span className="mono">Prompt note #017</span><blockquote>“不要描述她长什么样，先描述她如何停顿。”</blockquote><small>本周最有用的一句废话</small></article>
          <article className="latest-small"><ProjectVisual variant="frames" label={experiments[1].title} /><span className="mono">Model test</span><h3>{experiments[1].title}</h3></article>
          <article className="latest-note note-apricot"><span className="note-number">40</span><p>个镜头以后，角色最先忘记的是耳环。</p><span className="mono">Observation 08/24</span></article>
        </div>
      </section></Reveal>

      <Reveal><section className="stories-preview section-shell">
        <div className="section-index mono">Archive A / AI Stories</div>
        <div className="section-title-row compact"><div><p className="eyebrow mono">Stories</p><h2>把脑子里的<br />奇怪故事做出来。</h2></div><Link className="text-link" href="/stories">View all stories ↗</Link></div>
        <div className="story-grid">{stories.slice(0, 2).map((story, index) => <StoryCard story={story} index={index} key={story.id} />)}</div>
      </section></Reveal>

      <Reveal><section className="experiments-preview dark-section"><div className="dark-inner">
        <div className="section-title-row compact"><div><p className="eyebrow mono">Experiments</p><h2>不急着有用，<br />先看看会发生什么。</h2></div><Link className="text-link" href="/experiments">Open the lab ↗</Link></div>
        <div className="experiment-preview-grid">{experiments.slice(0, 3).map((experiment, index) => <ExperimentCard experiment={experiment} index={index} key={experiment.id} />)}</div>
      </div></section></Reveal>

      <Reveal><section className="tools-preview section-shell">
        <div className="section-title-row compact"><div><p className="eyebrow mono">Little tools</p><h2>顺手做点<br />有用的小东西。</h2></div><p>不是产品中心，只是把重复的小麻烦做成按钮。</p></div>
        <div className="tool-grid">{tools.map((tool, index) => <ToolCard tool={tool} index={index} key={tool.id} />)}</div>
        <Link className="text-link tools-all" href="/tools">See all little tools ↗</Link>
      </section></Reveal>

      <Reveal><section className="playing section-shell">
        <div className="playing-title"><p className="eyebrow mono">Currently playing with</p><h2>最近在折腾</h2><span className="hand-note">持续更新中 ↘</span></div>
        <div className="playing-list">{currentlyPlaying.map(([icon, title, detail], index) => <div className="playing-row" key={title}><span className="mono">0{index + 1}</span><b>{icon}</b><h3>{title}</h3><p>{detail}</p><i>↗</i></div>)}</div>
      </section></Reveal>

      <Reveal><section className="about-preview section-shell">
        <div className="about-stamp" aria-hidden="true"><span>J</span><small>MADE BY<br />A CURIOUS HUMAN</small></div>
        <div className="about-copy"><p className="eyebrow mono">About JING</p><h2>我是荆。</h2><p>我喜欢研究 AI 能不能把脑子里那些奇怪、有趣，或者没来得及实现的想法真正做出来。</p><p>这里记录我的 AI 故事、视频、实验和一些小工具。</p><Link className="text-link" href="/about">More about me ↗</Link></div>
      </section></Reveal>
      <SiteFooter />
    </main>
  );
}
