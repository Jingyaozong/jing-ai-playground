import Link from 'next/link';
import type { NoteMeta } from '../../lib/notes';
import { NoteVisual } from './note-visual';

export function NoteCard({ note, size = 'medium' }: { note: NoteMeta; size?: 'large' | 'medium' | 'small' | 'wide' | 'tall' }) {
  return (
    <article className={`note-card note-card-${size}`}>
      <Link href={`/notes/${note.slug}/`} className="note-card-link" aria-label={`阅读：${note.title}`}>
        <NoteVisual variant={note.cover} label={note.title} />
        <div className="note-card-copy">
          <div className="note-card-meta mono"><span>{note.category} / {note.issue}</span><span>{note.editorialStatus === 'draft' ? '编辑稿 · 待确认' : note.date.replaceAll('-', ' / ')}</span></div>
          <h3>{note.title}</h3>
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
