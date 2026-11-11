import type { Metadata } from 'next';
import { pageMeta } from '../../lib/seo';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MarkdownContent, headingId } from '../../components/markdown-content';
import { NoteCard } from '../../components/note-card';
import { SiteFooter } from '../../components/site-footer';
import { SiteHeader } from '../../components/site-header';
import { methodNoteSlugs } from '../../data/note-config';
import { getAllNotes, getNoteBySlug, getRelatedNotes } from '../../../lib/notes';

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllNotes().map((note) => ({ slug: note.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const note = getNoteBySlug(slug);
  if (!note) return {};
  return pageMeta({
    title: note.title,
    description: note.description,
    og: `note-${note.slug}`,
    robots: methodNoteSlugs.includes(note.slug) ? undefined : { index: false, follow: true },
  });
}

export default async function NoteDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const note = getNoteBySlug(slug);
  if (!note) notFound();
  const related = getRelatedNotes(note);
  const isMethod = methodNoteSlugs.includes(note.slug);
  const backHref = isMethod ? '/method/' : '/notes/';
  const backLabel = isMethod ? '评测方法' : '归档';
  const headings = [...note.content.matchAll(/^## (.+)$/gm)].map((match) => match[1].trim());

  return (
    <main className="pf">
      <SiteHeader active={isMethod ? 'Method' : ''} />
      <header className="pf-page-head pf-shell">
        <Link className="pf-breadcrumb" href={backHref}>← 返回{backLabel}</Link>
        <h1>{note.title}</h1>
        {note.synthetic && <p className="note-demo-line">方法演示，非真实项目数据</p>}
        <p>{note.description}</p>
        <p className="pf-note">{note.date.replaceAll('-', ' / ')} · {note.readingTime}</p>
      </header>

      <div className="pf-shell pf-article-layout">
        <nav className="pf-toc" aria-label="本文目录">
          <strong>目录</strong>
          <ol>{headings.map((heading) => <li key={heading}><a href={`#${headingId(heading)}`}>{heading.replace(/[*`_]/g, '')}</a></li>)}</ol>
        </nav>
        <article><MarkdownContent content={note.content} />{note.sourceUrl && !note.content.includes('## 参考来源') && <p className="article-source-line">参考来源：<a href={note.sourceUrl} target="_blank" rel="noreferrer">{note.sourceTitle ?? note.sourceUrl}</a></p>}</article>
      </div>

      <section className="pf-shell pf-section"><div className="pf-section-head"><h2>相关阅读</h2><Link className="pf-text-link" href={backHref}>返回{backLabel}</Link></div><div className="pf-grid-3">{related.map((item) => <NoteCard note={item} key={item.slug} />)}</div></section>
      <SiteFooter />
    </main>
  );
}
