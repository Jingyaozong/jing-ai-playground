import Link from 'next/link';
import type { NoteMeta } from '../../lib/notes';
import { NoteVisual } from './note-visual';

export function NoteCard({ note, size = 'medium' }: { note: NoteMeta; size?: 'large' | 'medium' | 'small' | 'wide' | 'tall' }) {
  const breakToken = note.titleBreakAfter ?? (note.title.includes('：') ? '：' : note.title.length > 24 ? '，' : '');
  const breakIndex = breakToken ? note.title.indexOf(breakToken) : -1;
  const splitAt = breakIndex >= 0 ? breakIndex + breakToken.length : 0;
  return (
    <article className={`note-card note-card-${size}`}>
      <Link href={`/notes/${note.slug}/`} className="note-card-link" aria-label={`阅读：${note.title}`}>
        <NoteVisual variant={note.cover} label={note.title} />
        <div className="note-card-copy">
          <div className="note-card-meta mono"><span>{note.category} / {note.issue}</span><span>{note.synthetic ? '虚构项目演练' : note.editorialStatus === 'draft' ? '编辑稿 · 待确认' : note.editorialStatus === 'source-backed' ? '资料文章 · 已核对' : note.date.replaceAll('-', ' / ')}</span></div>
          <h3>{splitAt > 0 && splitAt < note.title.length ? <><span>{note.title.slice(0, splitAt)}</span><span>{note.title.slice(splitAt)}</span></> : note.title}</h3>
          <p>{note.description}</p>
          <div className="note-card-bottom">
            <div className="note-tags">{note.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}</div>
            <span className="note-arrow">阅读 ↗</span>
          </div>
        </div>
      </Link>
    </article>
  );
}
