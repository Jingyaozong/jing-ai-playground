'use client';

import { useMemo, useState } from 'react';
import type { NoteMeta } from '../../lib/notes';
import { NoteCard } from './note-card';

const filters = ['全部', 'AI TIPS', 'AI EVAL', 'MAKING OF', 'AI BRIEFING', 'AI VIDEO', 'STORYBOARD', 'PROMPT', 'EVALUATION'];
const filterLabels: Record<string, string> = { 'AI TIPS': '使用技巧', 'AI EVAL': 'AI 评测', 'MAKING OF': '创作幕后', 'AI BRIEFING': '信息精选', 'AI VIDEO': 'AI 视频', STORYBOARD: '分镜', PROMPT: 'Prompt', EVALUATION: '评测方法' };
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
    <section className="content-browser note-browser" aria-label="筛选笔记">
      <div className="browser-toolbar">
        <label className="search-field">
          <span className="mono">搜索 / Search</span>
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="输入标题、主题或标签" aria-controls="note-browser-results" />
        </label>
        <div className="filter-row" aria-label="笔记分类">
          {filters.map((filter) => <button type="button" aria-pressed={active === filter} className={active === filter ? 'is-active' : ''} onClick={() => setActive(filter)} key={filter}>{filterLabels[filter] ?? filter}</button>)}
        </div>
      </div>
      <p className="note-result-count" role="status" aria-live="polite" aria-atomic="true">{visible.length} 篇笔记{active !== '全部' ? ` · ${filterLabels[active] ?? active}` : ''}</p>
      <div className="notes-mosaic" id="note-browser-results">
        {visible.map((note, index) => <NoteCard note={note} size={sizes[index % sizes.length]} key={note.slug} />)}
      </div>
      {visible.length === 0 && <div className="empty-result"><b>这里暂时没有匹配内容。</b><span>换一个关键词，或清除搜索与分类筛选。</span><button type="button" onClick={() => { setQuery(''); setActive('全部'); }}>清除筛选，查看全部</button></div>}
    </section>
  );
}
