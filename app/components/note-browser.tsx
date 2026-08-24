'use client';

import { useMemo, useState } from 'react';
import type { NoteMeta } from '../../lib/notes';
import { NoteCard } from './note-card';

const filters = ['全部', 'AI TIPS', 'AI EVAL', 'MAKING OF', 'AI BRIEFING', 'AI VIDEO', 'PROMPT', 'EVALUATION'];
const sizes: Array<'large' | 'medium' | 'small' | 'wide' | 'tall'> = ['large', 'small', 'tall', 'wide', 'medium'];

export function NoteBrowser({ notes }: { notes: NoteMeta[] }) {
  const [active, setActive] = useState('全部');
  const [query, setQuery] = useState('');
  const visible = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return notes.filter((note) => {
      const categoryMatch = active === '全部' || note.category === active || note.tags.includes(active);
      const searchMatch = !normalized || `${note.title} ${note.description} ${note.category} ${note.tags.join(' ')}`.toLowerCase().includes(normalized);
      return categoryMatch && searchMatch;
    });
  }, [active, notes, query]);

  return (
    <section className="content-browser" aria-label="筛选笔记">
      <div className="browser-toolbar">
        <label className="search-field">
          <span className="mono">搜索 / Search</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="输入标题、主题或标签" />
        </label>
        <div className="filter-row" aria-label="笔记分类">
          {filters.map((filter) => <button className={active === filter ? 'is-active' : ''} onClick={() => setActive(filter)} key={filter}>{filter}</button>)}
        </div>
      </div>
      <div className="notes-mosaic">
        {visible.map((note, index) => <NoteCard note={note} size={sizes[index % sizes.length]} key={note.slug} />)}
      </div>
      {visible.length === 0 && <div className="empty-result"><b>这里暂时没有匹配内容。</b><span>换一个关键词，或者查看“全部”。</span></div>}
    </section>
  );
}
