import type { Metadata } from 'next';
import { NoteBrowser } from '../components/note-browser';
import { NoteCard } from '../components/note-card';
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

export default function NotesPage() {
  const notes = getAllNotes();
  const featured = notes.find((note) => note.featured) ?? notes[0];
  const latest = notes.filter((note) => note.slug !== featured.slug);

  return (
    <main>
      <SiteHeader active="Notes" />
      <section className="notes-hero page-intro">
        <div className="page-intro-top mono"><span>JING NOTES / 荆的 AI 笔记</span><span>{notes.length} 篇内容正在生长</span></div>
        <div className="notes-title-lockup"><h1>NOTES</h1><span className="notes-title-sticker">学到的<br />先记下来</span></div>
        <div className="notes-hero-bottom"><p>关于 AI、创作、评测，<br />以及我最近学到的东西。</p><span className="mono">Thoughts / Tips / Experiments / AI</span></div>
      </section>

      <Reveal><section className="featured-note section-shell">
        <div className="section-title-row compact"><div><p className="eyebrow mono">Featured note / 重点笔记</p><h2>先从一个真正<br />需要判断的问题开始。</h2></div><p>不是给模型打一个笼统的“好看分”，而是建立可以解释、可以复用的评测框架。</p></div>
        <Link href={`/notes/${featured.slug}/`} className="featured-note-card">
          <NoteVisual variant={featured.cover} label={featured.title} />
          <div className="featured-note-copy"><div className="mono"><span>{featured.category} / {featured.issue}</span><span>{featured.readingTime}</span></div><h2>{featured.title}</h2><p>{featured.description}</p><span className="featured-note-action">阅读这篇笔记 ↗</span></div>
        </Link>
      </section></Reveal>

      <Reveal><section className="note-categories section-shell">
        <div className="section-title-row compact"><div><p className="eyebrow mono">Four shelves / 四个栏目</p><h2>写技巧，也留下<br />判断和过程。</h2></div><p>四个栏目对应四种不同的记录方式，但都来自同一个创作现场。</p></div>
        <div className="note-category-grid">{noteCategories.map((category, index) => <a href="#all-notes" className={`note-category-card category-${category.color}`} key={category.id}><span className="mono">0{index + 1}</span><strong>{category.id}</strong><h3>{category.chinese}</h3><p>{category.description}</p><i>查看栏目 ↓</i></a>)}</div>
      </section></Reveal>

      <section className="latest-notes section-shell" id="all-notes">
        <div className="section-title-row compact"><div><p className="eyebrow mono">Latest notes / 最近更新</p><h2>最近记下来的<br />一些东西。</h2></div><p>所有第一阶段正文都已明确标注 Demo，后续可以直接替换为正式内容。</p></div>
        <NoteBrowser notes={latest} />
      </section>
      <SiteFooter />
    </main>
  );
}
