import type { Metadata } from 'next';
import { NoteBrowser } from '../components/note-browser';
import { ArchiveFilterHashFocus } from '../components/archive-filter-hash-focus';
import { NoteVisual } from '../components/note-visual';
import { Reveal } from '../components/reveal';
import { SiteFooter } from '../components/site-footer';
import { SiteHeader } from '../components/site-header';
import { noteCategories } from '../data/note-config';
import { getAllNotes } from '../../lib/notes';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '荆的 AI 笔记 — JING AI PLAYGROUND',
  description: '关于 AI、创作、评测，以及荆最近学到的东西。',
};

const readingPaths = [
  {
    id: 'A',
    label: 'BUILD THE FRAME',
    title: '先学会控制画面',
    description: '从一张参考图开始，依次理解画面描述、人物景别和摄影机运动。',
    tone: 'yellow',
    steps: [
      { title: 'AI 图片 Prompt，到底写什么？', href: '/notes/image-prompt-guide/', meta: '画面元素' },
      { title: 'AI 视频景别：人物该占多大？', href: '/notes/shot-size-guide/', meta: '人物边界' },
      { title: '镜头为什么会乱跑？', href: '/notes/camera-movement-guide/', meta: '摄影机运动' },
    ],
  },
  {
    id: 'B',
    label: 'READ THE RESULT',
    title: '再学会诊断视频',
    description: '先分清生成方式，再识别失败现象，最后建立可以复核的评测流程。',
    tone: 'sky',
    steps: [
      { title: '图生视频和文生视频，差在哪？', href: '/notes/video-vs-image-prompt/', meta: '选择入口' },
      { title: 'AI 视频翻车词典', href: '/notes/video-failure-cases/', meta: '描述问题' },
      { title: 'AI 视频到底应该怎么评？', href: '/notes/ai-video-evaluation/', meta: '形成判断' },
    ],
  },
  {
    id: 'C',
    label: 'MAKE THE STORY',
    title: '把方法带进一支作品',
    description: '从 90 秒时间结构进入完整制作路线，最后抵达已经准备好的故事生成包。',
    tone: 'coral',
    steps: [
      { title: '把 90 秒故事拆成 14 镜', href: '/notes/ninety-second-storyboard/', meta: '拆分故事' },
      { title: '第一支 AI 漫剧，怎么做？', href: '/notes/making-first-ai-comic/', meta: '串起流程' },
      { title: '进入「她忘记昨天」生成包', href: '/stories/she-forgets-yesterday/#generation-pack', meta: '开始制作' },
    ],
  },
] as const;

export default function NotesPage() {
  const notes = getAllNotes();
  const featured = notes.find((note) => note.featured) ?? notes[0];
  const featuredBreak = featured.titleBreakAfter ? featured.title.indexOf(featured.titleBreakAfter) + featured.titleBreakAfter.length : 0;
  const featuredStatus = featured.demo
    ? 'Demo 内容，用于展示文章版式，不代表正式发布内容。'
    : featured.editorialStatus === 'draft'
      ? '编辑稿 · 待荆确认。框架与判断尚未作为正式个人观点发布。'
      : featured.editorialStatus === 'source-backed'
        ? '资料文章 · 来源已核对。编辑转译不代表荆已确认的个人经验。'
        : '正式笔记';

  return (
    <main className="notes-index-page">
      <SiteHeader active="Notes" />
      <section className="notes-hero page-intro">
        <div className="page-intro-top mono"><span>JING NOTES / 荆的 AI 笔记</span><span>{notes.length} 篇内容正在生长</span></div>
        <div className="notes-title-lockup"><h1>NOTES</h1><span className="notes-title-sticker">学到的<br />先记下来</span></div>
        <div className="notes-hero-bottom"><p>关于 AI、创作、评测，<br />以及我最近学到的东西。</p><span className="mono">Thoughts / Tips / Experiments / AI</span></div>
      </section>

      <Reveal><section className="reading-paths section-shell" aria-labelledby="reading-paths-title">
        <div className="section-title-row compact"><div><p className="eyebrow mono">Start here / 从这里开始</p><h2 id="reading-paths-title">不用全部看完，<br />先选一条路。</h2></div><p>九篇笔记已经可以组成三种入口。按顺序阅读，也可以从你眼下最需要解决的问题开始。</p></div>
        <div className="reading-path-grid">
          {readingPaths.map((path) => (
            <article className={`reading-path-card path-${path.tone}`} key={path.id}>
              <div className="reading-path-heading"><span className="reading-path-letter mono">PATH {path.id}</span><span className="mono">{path.label}</span></div>
              <h3>{path.title}</h3>
              <p>{path.description}</p>
              <ol>
                {path.steps.map((step, index) => (
                  <li key={step.href}>
                    <span className="reading-step-number mono">{String(index + 1).padStart(2, '0')}</span>
                    <Link href={step.href}><small className="mono">{step.meta}</small><strong>{step.title}</strong><i>阅读 ↗</i></Link>
                  </li>
                ))}
              </ol>
            </article>
          ))}
        </div>
      </section></Reveal>

      <Reveal><section className="featured-note section-shell" id="featured-note">
        <div className="section-title-row compact"><div><p className="eyebrow mono">Featured note / 重点笔记</p><h2>先读一篇，<br />再接着探索。</h2></div><p>{featured.description}</p></div>
        <Link href={`/notes/${featured.slug}/`} className="featured-note-card">
          <NoteVisual variant={featured.cover} label={featured.title} />
          <div className="featured-note-copy"><div className="mono"><span>{featured.category} / {featured.issue}</span><span>{featured.readingTime}</span></div><h2>{featuredBreak > 0 ? <>{featured.title.slice(0, featuredBreak)}<br />{featured.title.slice(featuredBreak)}</> : featured.title}</h2><p>{featuredStatus}</p><span className="featured-note-action">阅读这篇笔记 ↗</span></div>
        </Link>
      </section></Reveal>

      <Reveal><section className="note-categories section-shell">
        <div className="section-title-row compact"><div><p className="eyebrow mono">Four shelves / 四个栏目</p><h2>写技巧，也留下<br />判断和过程。</h2></div><p>四个栏目对应四种不同的记录方式，但都来自同一个创作现场。</p></div>
        <div className="note-category-grid">{noteCategories.map((category, index) => <a href={`?category=${encodeURIComponent(category.id)}#all-notes`} className={`note-category-card category-${category.color}`} key={category.id}><span className="mono">0{index + 1}</span><strong>{category.id}</strong><h3>{category.chinese}</h3><p>{category.description}</p><i>查看栏目 ↓</i></a>)}</div>
      </section></Reveal>

      <Reveal><section className="prompt-entry section-shell">
        <Link href="/prompts/" className="prompt-entry-card">
          <div><span className="mono">New shelf / Prompt 工作台</span><h2>好用的 Prompt，<br />不应该只剩一句咒语。</h2><p>我会把外部素材重新梳理成可复用结构，标出变量、适用场景和实际使用时的判断。</p><i>打开 Prompt 板块 ↗</i></div>
          <span className="prompt-entry-brace" aria-hidden="true">{'{ }'}</span>
        </Link>
      </section></Reveal>

      <section className="latest-notes section-shell" id="all-notes">
        <ArchiveFilterHashFocus hash="#all-notes" headingId="all-notes-title" />
        <div className="section-title-row compact"><div><p className="eyebrow mono">Latest notes / 最近更新</p><h2 id="all-notes-title" tabIndex={-1}>最近记下来的<br />一些东西。</h2></div><p>Demo、编辑稿和正式内容都会明确标注；真实制作过程会随着项目推进继续更新。</p></div>
        <NoteBrowser notes={notes} />
      </section>
      <SiteFooter />
    </main>
  );
}
