import Link from 'next/link';
import { ExperimentCard } from './components/experiment-card';
import { LibraryCard } from './components/library-card';
import { NoteCard } from './components/note-card';
import { ProjectVisual } from './components/project-visual';
import { Reveal } from './components/reveal';
import { SiteFooter } from './components/site-footer';
import { SiteHeader } from './components/site-header';
import { StoryCard } from './components/story-card';
import { ToolCard } from './components/tool-card';
import { currentlyPlaying, experiments, stories, tools } from './data/content';
import { libraryItems } from './data/library';
import { getAllNotes } from '../lib/notes';

export default function Home() {
  const featured = stories[0];
  const latestNotes = getAllNotes().slice(0, 4);
  const jingPicks = libraryItems.filter((item) => item.jingPick).slice(0, 4);
  return (
    <main>
      <SiteHeader />
      <section className="hero" id="top">
        <div className="hero-kicker mono"><span>JING / 荆</span><span>AI creator · Since 2026</span></div>
        <div className="hero-layout">
          <div className="hero-main">
            <p className="hero-name mono">JING AI PLAYGROUND</p>
            <h1><span>把奇怪的想法，</span><span><em>认真</em>做出来。</span></h1>
          </div>
          <aside className="hero-card">
            <span className="hero-card-sun" aria-hidden="true">✦</span>
            <p>Stories, visuals, tools and weird little things made with AI.</p>
            <small>一个持续更新的个人 AI 创作现场。</small>
          </aside>
        </div>
        <div className="letter-board" aria-label="JING">
          <span className="letter-j">J<small>stories</small></span>
          <span className="letter-i">I<small>images</small></span>
          <span className="letter-n">N<small>new ideas</small></span>
          <span className="letter-g">G<small>good work</small></span>
        </div>
      </section>
      <div className="live-strip" aria-label="最近动态">
        <span className="live-label mono"><i /> ON THE DESK</span>
        <div className="ticker-track"><span>整理第一部 AI 短片草案</span><b>✦</b><span>记录角色一致性 Pilot</span><b>✦</b><span>完善 AI 视频评测方法</span><b>✦</b><span>打磨本地创作工具</span><b>✦</b><span>整理第一部 AI 短片草案</span></div>
      </div>

      <Reveal><section className="featured">
        <div className="section-heading"><div><p className="eyebrow mono">Featured / 本期主角</p><h2>这次，先认真<br />做完一个故事。</h2></div><p className="featured-intro">《她每天醒来都会忘记昨天》已经完成故事、剧本、分镜和生成包草案；真实视频、剪辑与声音仍待开始。</p></div>
        <article className="feature-card"><ProjectVisual variant="memory feature" label={featured.title} /><div className="feature-meta"><div><p className="mono">AI SHORT FILM · DRAFT / VIDEO NOT GENERATED</p><h3>{featured.title}</h3></div><Link className="round-link" href="/stories/she-forgets-yesterday/" aria-label="查看作品详情">View <span>↗</span></Link></div></article>
      </section></Reveal>

      <Reveal><section className="latest section-shell">
        <div className="section-title-row"><div><p className="eyebrow mono">Latest experiments</p><h2>最近又<br />折腾了什么？</h2></div><p>故事还没完全长成，测试也不一定有结论。这里先留下过程里的碎片、偏差和意外。</p></div>
        <div className="latest-grid">
          <article className="latest-lead"><ProjectVisual variant="faces" label={experiments[0].title} /><span className="mono">Pilot record · 4 static samples / 40 planned</span><h3>{experiments[0].title}</h3></article>
          <article className="latest-note note-violet"><span className="mono">Research question / 待验证</span><blockquote>“变量不断增加时，哪些角色特征最容易先失去一致性？”</blockquote><small>需要正式四十镜样本才能回答</small></article>
          <article className="latest-small"><ProjectVisual variant="frames" label={experiments[1].title} /><span className="mono">Experiment idea · not run</span><h3>{experiments[1].title}</h3></article>
          <article className="latest-note note-apricot"><span className="note-number">40</span><p>个正式镜头仍待测试。目前只有四格静态 Pilot，不写模型结论。</p><span className="mono">PILOT STATUS · 4 / 40</span></article>
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

      <Reveal><section className="home-notes section-shell">
        <div className="section-title-row compact"><div><p className="eyebrow mono">Latest notes / 最近的笔记</p><h2>做过的留下来，<br />想明白的也留下来。</h2></div><div className="home-notes-intro"><p>AI 技巧、评测方法和真实制作过程。不是传统博客，是正在生长的个人知识库。</p><Link className="text-link" href="/notes/">查看全部笔记 ↗</Link></div></div>
        <div className="home-notes-grid">{latestNotes.map((note, index) => <NoteCard note={note} size={index === 0 ? 'large' : index === 1 ? 'tall' : index === 2 ? 'small' : 'wide'} key={note.slug} />)}</div>
      </section></Reveal>

      <Reveal><section className="tools-preview section-shell">
        <div className="section-title-row compact"><div><p className="eyebrow mono">Little tools</p><h2>顺手做点<br />有用的小东西。</h2></div><p>不是产品中心，只是把重复的小麻烦做成按钮。</p></div>
        <div className="tool-grid">{tools.map((tool, index) => <ToolCard tool={tool} index={index} key={tool.id} />)}</div>
        <Link className="text-link tools-all" href="/tools">See all little tools ↗</Link>
      </section></Reveal>

      <Reveal><section className="playing section-shell">
        <div className="playing-title"><p className="eyebrow mono">Currently playing with</p><h2>最近在折腾</h2><span className="hand-note">点击进入真实记录 ↘</span></div>
        <div className="playing-list">{currentlyPlaying.map((item, index) => <Link className="playing-row" href={item.href} key={item.title}><span className="mono">0{index + 1}</span><b aria-hidden="true">{item.icon}</b><div className="playing-row-title"><h3>{item.title}</h3><small className="mono">{item.status}</small></div><p>{item.detail}</p><i aria-hidden="true">↗</i></Link>)}</div>
      </section></Reveal>

      <Reveal><section className="home-picks section-shell">
        <div className="section-title-row compact"><div><p className="eyebrow mono">JING PICKS / 编辑初选</p><h2>最近留下的，<br />四个来源已核对候选。</h2></div><div className="home-notes-intro"><p>资源和原始链接已经核对；推荐理由与 JING&apos;S TAKE 仍是等待荆确认的编辑初稿。</p><Link className="text-link" href="/library/">打开收藏夹 ↗</Link></div></div>
        <div className="home-picks-grid">{jingPicks.map((item) => <LibraryCard item={item} compact key={item.id} />)}</div>
      </section></Reveal>

      <Reveal><section className="about-preview section-shell">
        <div className="about-stamp" aria-hidden="true"><span>J</span><small>MADE BY<br />A CURIOUS HUMAN</small></div>
        <div className="about-copy"><p className="eyebrow mono">About JING</p><h2>我是荆。</h2><p>我喜欢研究 AI 能不能把脑子里那些奇怪、有趣，或者没来得及实现的想法真正做出来。</p><p>这里记录我的 AI 故事、视频、实验和一些小工具。</p><Link className="text-link" href="/about">More about me ↗</Link></div>
      </section></Reveal>
      <SiteFooter />
    </main>
  );
}
