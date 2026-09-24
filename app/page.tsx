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
  const featured = stories.find((story) => story.slug === 'she-forgets-yesterday') ?? stories[0];
  const recentStories = stories.slice(-2).reverse();
  const recentExperiments = experiments.filter((experiment) => experiment.stage === 'documented').slice(-3).reverse();
  const recentTools = tools.slice(-4).reverse();
  const latestNotes = getAllNotes().slice(0, 4);
  const jingPicks = libraryItems.filter((item) => item.jingPick)
    .sort((a, b) => b.dateAdded.localeCompare(a.dateAdded)).slice(0, 4);
  const causalExperiment = experiments.find((experiment) => experiment.slug === 'can-water-recede-after-the-umbrella-opens') ?? recentExperiments[0];
  const causalStory = stories.find((story) => story.slug === 'before-the-water-recedes') ?? recentStories[0];
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
        <div className="ticker-track"><span>准备因果动作九格测试</span><b>✦</b><span>填写五点动作账本</span><b>✦</b><span>完善原创短片视觉开发</span><b>✦</b><span>核对值得留下的来源</span><b>✦</b><span>准备因果动作九格测试</span></div>
      </div>

      <Reveal><section className="featured" id="featured-story">
        <div className="section-heading"><div><p className="eyebrow mono">Featured / 本期主角</p><h2>这次，先认真<br />做完一个故事。</h2></div><p className="featured-intro">{featured.description}</p></div>
        <article className="feature-card"><ProjectVisual variant={`${featured.visual} feature`} label={featured.title} /><div className="feature-meta"><div><p className="mono">{featured.type} · {featured.status}</p><h3>{featured.title}</h3></div><Link className="round-link" href={`/stories/${featured.slug}/`} aria-label={`查看《${featured.title}》详情`}>View <span>↗</span></Link></div></article>
      </section></Reveal>

      <Reveal><section className="latest section-shell">
        <div className="section-title-row"><div><p className="eyebrow mono">Current research / 最近在研究</p><h2>先后不是同时，<br />要留下可见间隔。</h2></div><p>从《退水以前》的一个高风险镜头出发，把故事问题拆成九格实验、五点账本和浏览器本地工具。真实视频仍是 0 / 9，所以这里展示研究路径，不提前展示结论。</p></div>
        <div className="latest-grid">
          <Link className="latest-lead" href={`/experiments/${causalExperiment.slug}/`}><ProjectVisual variant={causalExperiment.visual} label={causalExperiment.title} /><span className="mono">EXPERIMENT / {causalExperiment.status}</span><h3>{causalExperiment.title}</h3></Link>
          <Link className="latest-note note-violet latest-method-note" href="/notes/causal-motion-five-point-ledger/"><span className="mono">METHOD NOTE / EDITING DRAFT</span><blockquote>“随后”不是气氛描述，<br />而是一个可以失败的时间条件。</blockquote><small>阅读五点账本与逐帧验收方法 ↗</small></Link>
          <Link className="latest-small" href={`/stories/${causalStory.slug}/`}><ProjectVisual variant={causalStory.visual} label={causalStory.title} /><span className="mono">STORY / {causalStory.status}</span><h3>{causalStory.title}</h3></Link>
          <Link className="latest-note note-apricot latest-causal-tool" href="/tools/waterline-motion-card/"><div><span className="mono">LOCAL TOOL / 五点动作账本</span><h3>先锁定，<br />再移动。</h3><p>填写伞锁定与水首动时刻，导出待测试 Prompt 和空白验收表。</p></div><div className="latest-causal-ruler" aria-label="锁定、保持、移动的五点动作轨道"><span>LOCK</span><span>MOVE</span>{[0,25,50,75,100].map((point) => <i key={point}><b>{point}%</b></i>)}</div><strong>打开水线动作卡 ↗</strong></Link>
        </div>
      </section></Reveal>

      <Reveal><section className="stories-preview section-shell">
        <div className="section-index mono">Archive A / AI Stories</div>
        <div className="section-title-row compact"><div><p className="eyebrow mono">Stories</p><h2>把脑子里的<br />奇怪故事做出来。</h2></div><Link className="text-link" href="/stories">View all stories ↗</Link></div>
        <div className="story-grid">{recentStories.map((story, index) => <StoryCard story={story} isLatest={index === 0} key={story.id} />)}</div>
      </section></Reveal>

      <Reveal><section className="experiments-preview dark-section"><div className="dark-inner">
        <div className="section-title-row compact"><div><p className="eyebrow mono">Experiments</p><h2>不急着有用，<br />先看看会发生什么。</h2></div><Link className="text-link" href="/experiments">Open the lab ↗</Link></div>
        <div className="experiment-preview-grid">{recentExperiments.map((experiment, index) => <ExperimentCard experiment={experiment} isLatest={index === 0} key={experiment.id} />)}</div>
      </div></section></Reveal>

      <Reveal><section className="home-notes section-shell">
        <div className="section-title-row compact"><div><p className="eyebrow mono">Latest notes / 最近的笔记</p><h2>做过的留下来，<br />想明白的也留下来。</h2></div><div className="home-notes-intro"><p>AI 技巧、评测方法与创作过程笔记。资料、编辑稿和虚构演练会分别标注，不把计划写成成果。</p><Link className="text-link" href="/notes/">查看全部笔记 ↗</Link></div></div>
        <div className="home-notes-grid">{latestNotes.map((note, index) => <NoteCard note={note} size={index === 0 ? 'large' : index === 1 ? 'tall' : index === 2 ? 'small' : 'wide'} key={note.slug} />)}</div>
      </section></Reveal>

      <Reveal><section className="tools-preview section-shell">
        <div className="section-title-row compact"><div><p className="eyebrow mono">Little tools</p><h2>顺手做点<br />有用的小东西。</h2></div><p>不是产品中心，只是把重复的小麻烦做成按钮。</p></div>
        <div className="tool-grid">{recentTools.map((tool, index) => <ToolCard tool={tool} index={index} key={tool.id} />)}</div>
        <Link className="text-link tools-all" href="/tools/#work-scenes">按工作场景找工具 ↗</Link>
      </section></Reveal>

      <Reveal><section className="playing section-shell">
        <div className="playing-title"><p className="eyebrow mono">Currently playing with</p><h2>最近在折腾</h2><span className="hand-note">点击查看当前状态 ↘</span></div>
        <div className="playing-list">{currentlyPlaying.map((item, index) => <Link className="playing-row" href={item.href} key={item.title}><span className="mono">0{index + 1}</span><b aria-hidden="true">{item.icon}</b><div className="playing-row-title"><h3>{item.title}</h3><small className="mono">{item.status}</small></div><p>{item.detail}</p><i aria-hidden="true">↗</i></Link>)}</div>
      </section></Reveal>

      <Reveal><section className="home-picks section-shell">
        <div className="section-title-row compact"><div><p className="eyebrow mono">Picks to review / 待确认推荐</p><h2>先收好来源，<br />再讨论值不值得留。</h2></div><div className="home-notes-intro"><p>这组来源已核对；推荐理由与观点仍是编辑候选，待荆确认。</p><Link className="text-link" href="/library/">打开收藏夹 ↗</Link></div></div>
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
