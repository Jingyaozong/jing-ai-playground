import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export type NoteCategory = 'AI TIPS' | 'AI EVAL' | 'MAKING OF' | 'AI BRIEFING';

export type NoteMeta = {
  title: string;
  slug: string;
  category: NoteCategory;
  issue: string;
  date: string;
  description: string;
  cover: string;
  featured: boolean;
  tags: string[];
  readingTime: string;
  demo: boolean;
  editorialStatus: 'draft' | 'source-backed' | 'published';
  sourceTitle?: string;
  sourceUrl?: string;
  sourceNote?: string;
  relatedNotes: string[];
  connections: Array<{
    label: string;
    title: string;
    description: string;
    href: string;
    tone: 'yellow' | 'sky' | 'mint' | 'coral' | 'blue';
  }>;
};

export type NoteDocument = NoteMeta & { content: string };

const notesDirectory = path.join(process.cwd(), 'content', 'notes');

function parseNote(filename: string): NoteDocument {
  const filePath = path.join(notesDirectory, filename);
  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);
  const fallbackSlug = filename.replace(/\.md$/, '');

  return {
    title: String(data.title ?? fallbackSlug),
    slug: String(data.slug ?? fallbackSlug),
    category: data.category as NoteCategory,
    issue: String(data.issue ?? '001'),
    date: String(data.date ?? ''),
    description: String(data.description ?? ''),
    cover: String(data.cover ?? 'tips-yellow'),
    featured: Boolean(data.featured),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    readingTime: String(data.readingTime ?? '5 分钟'),
    demo: data.demo !== false,
    editorialStatus: data.editorialStatus === 'draft' ? 'draft' : data.editorialStatus === 'source-backed' ? 'source-backed' : 'published',
    sourceTitle: data.sourceTitle ? String(data.sourceTitle) : undefined,
    sourceUrl: data.sourceUrl ? String(data.sourceUrl) : undefined,
    sourceNote: data.sourceNote ? String(data.sourceNote) : undefined,
    relatedNotes: Array.isArray(data.relatedNotes) ? data.relatedNotes.map(String) : [],
    connections: Array.isArray(data.connections) ? data.connections.map((item) => ({
      label: String(item.label ?? ''),
      title: String(item.title ?? ''),
      description: String(item.description ?? ''),
      href: String(item.href ?? '#'),
      tone: ['yellow', 'sky', 'mint', 'coral', 'blue'].includes(String(item.tone)) ? item.tone : 'yellow',
    })) : [],
    content,
  };
}

export function getAllNotes(): NoteMeta[] {
  if (!fs.existsSync(notesDirectory)) return [];
  return fs.readdirSync(notesDirectory)
    .filter((filename) => filename.endsWith('.md'))
    .map(parseNote)
    .map(({ content, ...meta }) => {
      void content;
      return meta;
    })
    .sort((a, b) => {
      const byDate = b.date.localeCompare(a.date);
      if (byDate !== 0) return byDate;
      return Number.parseInt(b.issue, 10) - Number.parseInt(a.issue, 10);
    });
}

export function getNoteBySlug(slug: string): NoteDocument | null {
  if (!fs.existsSync(notesDirectory)) return null;
  const filename = fs.readdirSync(notesDirectory)
    .filter((entry) => entry.endsWith('.md'))
    .find((entry) => parseNote(entry).slug === slug);
  return filename ? parseNote(filename) : null;
}

export function getRelatedNotes(note: NoteMeta): NoteMeta[] {
  const notes = getAllNotes();
  const chosen = note.relatedNotes
    .map((slug) => notes.find((item) => item.slug === slug))
    .filter((item): item is NoteMeta => Boolean(item));
  if (chosen.length >= 3) return chosen.slice(0, 3);
  const fallback = notes.filter((item) => item.slug !== note.slug && item.category === note.category && !chosen.some((picked) => picked.slug === item.slug));
  return [...chosen, ...fallback].slice(0, 3);
}
