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
  ['ARTICLES', '文章', '真正值得读完和留着回看的文章。', 'yellow', 'ARTICLE'],
  ['VIDEOS', '视频', 'B站、YouTube 与公开视频里的好内容。', 'blue', 'VIDEO'],
  ['PAPERS & PDF', '报告与论文', 'Benchmark、白皮书、论文和官方指南。', 'coral', 'PDF'],
  ['TOOLS', '工具', '不是工具墙，只留下真正可能会用的东西。', 'mint', 'TOOL'],
];

const libraryRoutes = [
  {
    id: 'WATCH',
    title: '先看懂 AI 视频',
    question: '它现在能做什么，边界又在哪里？',
    description: '先看官方示例和短教程，建立对生成画面、角色一致性与提示结构的直观认识。',
    tone: 'yellow',
    resourceIds: ['runway-gen4-intro-video', 'openai-sora-examples', 'kling-character-consistency-bilibili', 'adobe-structuring-video-prompts'],
  },
  {
    id: 'MAKE',
    title: '开始搭制作流程',
    question: '怎样从清楚的任务走到可运行工作流？',
    description: '先定义成功标准，再进入视频 Prompt 与节点工作流；不从巨大模板或复杂技巧开始。',
    tone: 'mint',
    resourceIds: ['openai-prompt-engineering-best-practices', 'anthropic-prompt-engineering-overview', 'google-veo-prompt-guide', 'google-flow-creative-workspace-2026', 'comfyui-official-docs'],
  },
  {
    id: 'EVALUATE',
    title: '学会评估输出',
    question: '“视频好不好”怎样变成可以解释的判断？',
    description: '从评测维度、标准提示集到开源工具，对照三套一手资料建立自己的验收表。',
    tone: 'coral',
    resourceIds: ['vbench-cvpr-paper', 'vbench-open-source-toolkit', 'evalcrafter-cvpr-paper'],
  },
] as const;

export default function LibraryPage() {
  const featured = libraryItems.find((item) => item.featured) ?? libraryItems[0];
  return (
    <main>
      <SiteHeader active="Library" />
      <section className="library-hero page-intro">
        <div className="page-intro-top mono"><span>JING LIBRARY / 荆的 AI 收藏夹</span><span>Curated, not collected</span></div>
        <div className="library-title-lockup"><h1>LIBRARY</h1><span className="library-pick-stamp">荆选<br />JING PICKS</span></div>
        <div className="notes-hero-bottom"><p>不是把链接堆在一起，<br />而是留下它为什么值得先看。</p><span className="mono">Articles / Videos / Papers / Tools</span></div>
      </section>

      <Reveal><section className="library-routes section-shell" aria-labelledby="library-routes-title">
        <aside className="archive-truth-note library-truth-note"><span className="mono">STATUS NOTE / 状态说明</span><p>资源标题、摘要和原始链接已经核对；推荐理由与 JING&apos;S TAKE 多数仍是编辑初稿，只有荆确认后才会成为正式个人观点。</p></aside>
        <div className="section-title-row compact"><div><p className="eyebrow mono">Choose by purpose / 按用途开始</p><h2 id="library-routes-title">先确定用途，<br />再打开资源。</h2></div><p>三条入门路线只精选最适合连续阅读的资源；声音、来源记录与开源工具可在下方继续搜索和筛选。</p></div>
        <div className="library-route-grid">
          {libraryRoutes.map((route) => (
            <article className={`library-route-card library-route-${route.tone}`} key={route.id}>
              <div className="library-route-tab"><span className="mono">{route.id}</span><b>{String(route.resourceIds.length).padStart(2, '0')}</b><small className="mono">resources</small></div>
              <p className="mono">{route.question}</p>
              <h3>{route.title}</h3>
              <p>{route.description}</p>
              <ol>
                {route.resourceIds.map((resourceId, index) => {
                  const item = libraryItems.find((candidate) => candidate.id === resourceId);
                  if (!item) return null;
                  return <li key={item.id}><span className="mono">{String(index + 1).padStart(2, '0')}</span><a href={item.url} target="_blank" rel="noreferrer"><small className="mono">{item.type} · {item.source}</small><strong>{item.title}</strong><i>原内容 ↗</i></a></li>;
                })}
              </ol>
            </article>
          ))}
        </div>
      </section></Reveal>

      <Reveal><section className="featured-library section-shell"><div className="section-title-row compact"><div><p className="eyebrow mono">This week&apos;s candidate / 本周候选</p><h2>先看一个可能<br />值得花时间的内容。</h2></div><p>来源已经核对，并附有编辑推荐理由；等荆确认判断后，它才会成为正式“荆选”。</p></div><LibraryCard item={featured} /></section></Reveal>

      <Reveal><section className="library-shelves section-shell"><div className="section-title-row compact"><div><p className="eyebrow mono">Five shelves / 收藏分类</p><h2>按内容类型收好，<br />按判断重新找到。</h2></div><p>“荆选”可以跨越所有类型，代表等待荆确认的特别推荐候选。</p></div><div className="library-shelf-grid">{shelves.map(([en, zh, description, color, filter], index) => <a className={`library-shelf shelf-${color}`} href={`?type=${filter}#library-all`} key={en}><span className="mono">0{index + 1}</span><strong>{en}</strong><h3>{zh}</h3><p>{description}</p><i>浏览 ↓</i></a>)}<a className="library-shelf shelf-picks" href="?type=JING%20PICKS#library-all"><span className="mono">05</span><strong>JING PICKS</strong><h3>荆选</h3><p>跨越文章、视频、PDF 和工具的特别推荐候选，等待荆确认。</p><i>只看候选 ↓</i></a></div></section></Reveal>

      <section className="library-all section-shell" id="library-all"><div className="section-title-row compact"><div><p className="eyebrow mono">Saved with a reason</p><h2>这些内容，<br />为什么被留下来。</h2></div><p>资源标题、摘要和原始链接已经核对；“JING&apos;S TAKE”目前是编辑初稿，等你确认后才会转为正式荆选。</p></div><LibraryBrowser items={libraryItems} /></section>
      <SiteFooter />
    </main>
  );
}
