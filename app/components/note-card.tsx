import Link from 'next/link';
import type { NoteMeta } from '../../lib/notes';

export function NoteCard({ note }: { note: NoteMeta; size?: string }) {
  return (
    <Link href={`/notes/${note.slug}/`} className="pf-card pf-note-card">
      <div className="note-cover"><h3>{note.title}</h3></div>
      <div className="pf-card-body">
        <span className="pf-card-tag">{note.synthetic ? '方法演示' : note.date.replaceAll('-', ' / ')} · {note.readingTime}</span>
        <p>{note.description}</p>
        <span className="pf-card-more">阅读 →</span>
      </div>
    </Link>
  );
}
