import type { Metadata } from 'next';
import { LibraryBrowser } from '../components/library-browser';
import { LibraryCard } from '../components/library-card';
import { Reveal } from '../components/reveal';
import { SiteFooter } from '../components/site-footer';
import { SiteHeader } from '../components/site-header';
import { libraryItems } from '../data/library';

export const metadata: Metadata = {
  title: '荆的 AI 收藏夹 — JING AI PLAYGROUND',
  description: '荆筛选出来值得收藏的 AI 文章、视频、PDF、报告和工具。',
};

const shelves = [
  ['ARTICLES', '文章', '真正值得读完和留着回看的文章。', 'yellow'],
  ['VIDEOS', '视频', 'B站、YouTube 与公开视频里的好内容。', 'blue'],
  ['PAPERS & PDF', '报告与论文', 'Benchmark、白皮书、论文和官方指南。', 'coral'],
  ['TOOLS', '工具', '不是工具墙，只留下真正可能会用的东西。', 'mint'],
];

export default function LibraryPage() {
  const featured = libraryItems.find((item) => item.featured) ?? libraryItems[0];
  return (
    <main>
      <SiteHeader active="Library" />
      <section className="library-hero page-intro">
        <div className="page-intro-top mono"><span>JING LIBRARY / 荆的 AI 收藏夹</span><span>Curated, not collected</span></div>
        <div className="library-title-lockup"><h1>LIBRARY</h1><span className="library-pick-stamp">荆选<br />JING PICKS</span></div>
        <div className="notes-hero-bottom"><p>不是把链接堆在一起，<br />而是留下我为什么觉得它值得看。</p><span className="mono">Articles / Videos / Papers / Tools</span></div>
      </section>

      <Reveal><section className="featured-library section-shell"><div className="section-title-row compact"><div><p className="eyebrow mono">This week&apos;s pick / 本周荆选</p><h2>先看一个我认为<br />值得花时间的内容。</h2></div><p>每一条收藏都保留来源、推荐理由和一句明确的个人判断。</p></div><LibraryCard item={featured} /></section></Reveal>

      <Reveal><section className="library-shelves section-shell"><div className="section-title-row compact"><div><p className="eyebrow mono">Five shelves / 收藏分类</p><h2>按内容类型收好，<br />按判断重新找到。</h2></div><p>“荆选”可以跨越所有类型，代表我个人特别推荐。</p></div><div className="library-shelf-grid">{shelves.map(([en, zh, description, color], index) => <a className={`library-shelf shelf-${color}`} href="#library-all" key={en}><span className="mono">0{index + 1}</span><strong>{en}</strong><h3>{zh}</h3><p>{description}</p><i>浏览 ↓</i></a>)}<a className="library-shelf shelf-picks" href="#library-all"><span className="mono">05</span><strong>JING PICKS</strong><h3>荆选</h3><p>跨越文章、视频、PDF 和工具的个人特别推荐。</p><i>只看荆选 ↓</i></a></div></section></Reveal>

      <section className="library-all section-shell" id="library-all"><div className="section-title-row compact"><div><p className="eyebrow mono">Saved with a reason</p><h2>这些内容，<br />为什么被留下来。</h2></div><p>当前所有资源均为 Demo，占位标题、来源与判断不会冒充真实推荐。</p></div><LibraryBrowser items={libraryItems} /></section>
      <SiteFooter />
    </main>
  );
}
