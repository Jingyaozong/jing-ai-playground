import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MarkdownContent } from '../../components/markdown-content';
import { NoteCard } from '../../components/note-card';
import { NoteVisual } from '../../components/note-visual';
import { SiteFooter } from '../../components/site-footer';
import { SiteHeader } from '../../components/site-header';
import { getAllNotes, getNoteBySlug, getRelatedNotes } from '../../../lib/notes';

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllNotes().map((note) => ({ slug: note.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const note = getNoteBySlug(slug);
  if (!note) return {};
  return {
    title: `${note.title} — JING NOTES`,
    description: note.description,
    openGraph: { title: note.title, description: note.description, images: [] },
    twitter: { title: note.title, description: note.description, images: [] },
  };
}

export default async function NoteDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const note = getNoteBySlug(slug);
  if (!note) notFound();
  const related = getRelatedNotes(note);

  return (
    <main>
      <SiteHeader active="Notes" />
      <header className="note-detail-hero">
        <div className="note-detail-rail mono"><Link href="/notes/">← 返回笔记</Link><span>JING NOTES · {note.date.slice(0, 7).replace('-', ' / ')}</span></div>
        <div className="note-detail-grid">
          <div className="note-detail-title"><div className="note-detail-labels"><span>{note.category}</span><span>ISSUE {note.issue}</span>{note.demo && <b>DEMO</b>}{note.editorialStatus === 'draft' && <b>EDITING DRAFT</b>}{note.editorialStatus === 'source-backed' && <b>SOURCE-BACKED</b>}</div><h1>{note.title}</h1><p>{note.description}</p><div className="note-detail-meta mono"><span>{note.date.replaceAll('-', ' / ')}</span><span>{note.readingTime}</span><span>{note.editorialStatus === 'draft' ? 'EDITED FOR JING' : note.editorialStatus === 'source-backed' ? 'SOURCE EDITION' : 'BY JING'}</span></div></div>
          <NoteVisual variant={note.cover} label={note.title} />
        </div>
      </header>

      <div className="article-layout">
        <aside className="article-sidebar"><span className="mono">这篇笔记</span><div>{note.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>{note.demo && <p><b>Demo 提醒</b>当前正文用于展示内容系统和文章版式，不代表正式发布内容。</p>}{note.editorialStatus === 'draft' && <p><b>编辑稿 · 待荆确认</b>资料来源已经核对，但框架、权重和判断仍需要荆结合真实评测经验确认。</p>}{note.editorialStatus === 'source-backed' && <p><b>资料文章 · 来源已核对</b>事实部分来自原始论文、官方文档或项目页面；实用框架是本站编辑转译，不代表荆已确认的个人经验。</p>}</aside>
        <article><MarkdownContent content={note.content} />
          <section className="article-source"><span className="mono">来源信息 / Sources</span><h2>{note.sourceTitle ?? 'JING NOTES'}</h2><p>{note.sourceNote ?? '本页为荆的原创笔记。'}</p>{note.sourceUrl && <a href={note.sourceUrl} target="_blank" rel="noreferrer">查看原始来源 ↗</a>}</section>
        </article>
      </div>

      {note.connections.length > 0 && <section className="note-connections section-shell"><div className="section-title-row compact"><div><p className="eyebrow mono">Connected work / 从这里继续</p><h2>一篇笔记，<br />连回创作现场。</h2></div><p>方法不是孤立结论。继续查看它对应的故事、实验与可执行 Prompt。</p></div><div className="note-connection-grid">{note.connections.map((item) => <Link className={`note-connection-card tone-${item.tone}`} href={item.href} key={`${item.label}-${item.href}`}><span className="mono">{item.label}</span><h3>{item.title}</h3><p>{item.description}</p><i>继续查看 ↗</i></Link>)}</div></section>}

      <section className="related-notes section-shell"><div className="section-title-row compact"><div><p className="eyebrow mono">Related notes</p><h2>接着往下看。</h2></div><Link className="text-link" href="/notes/">查看全部笔记 ↗</Link></div><div className="related-note-grid">{related.map((item) => <NoteCard note={item} size="small" key={item.slug} />)}</div></section>
      <SiteFooter />
    </main>
  );
}
